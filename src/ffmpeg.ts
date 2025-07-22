import commandExists from 'command-exists'
import path from 'node:path'
import os from 'node:os'
import { spawn } from 'node:child_process'
import { ensureDirectoryExists } from './utils'

const tempDir = path.join(os.tmpdir(), 'videocap-cli')

export interface FFmpegMediaInfo {
  version: string
  duration: number
  size: number
  bitrate: string
  width: number
  height: number
  fps: number
  videoCodec: string
  audioCodec: string
  sampleRate: number
  channels: number
  format: string
  bitDepth: number
}

export const isFFmpegInstalled = async (): Promise<boolean> => {
  const isInstalled = commandExists.sync('ffmpeg')
  return isInstalled
}

export const getMediaInfo = async (input: string): Promise<FFmpegMediaInfo> => {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', ['-i', input])
    let stderr = ''
    ffmpeg.stderr.on('data', data => {
      stderr += data.toString()
    })

    ffmpeg.on('close', code => {
      if (stderr.includes('Error')) {
        reject(new Error(`FFmpeg exited with code ${code}: ${stderr}`))
      } else {
        resolve(parseMediaInfo(stderr))
      }
    })

    ffmpeg.on('error', err => {
      console.log('error', err)
      reject(err)
    })
  })
}

export const extractAudioFromVideo = async (input: string): Promise<void> => {
  const name = path.basename(input)
  ensureDirectoryExists(tempDir)
  const audioPath = path.join(tempDir, `${name}-${Date.now()}.wav`)
  const command = ['-i', input, '-vn', '-acodec', 'pcm_s16le', '-ar', '16000', '-ac', '1', '-y', audioPath]
  await execFFmeg(command, {
    onProgress: progress => {
      console.log('--------------------------------')
      console.log('progress', progress)
    }
  })
}

export interface FFmpegOptions {
  onProgress?: (progress: string) => void
  onError?: (error: string) => void
}
export interface FFmpegResult {
  stdout: string
  stderr: string
  code: number
}
export const execFFmeg = async (args: string[], options: FFmpegOptions = {}): Promise<FFmpegResult> => {
  return new Promise((resolve, reject) => {
    // 添加进度报告参数
    const enhancedArgs = [
      ...args,
      '-progress',
      'pipe:1', // 输出进度到 stdout
      '-nostats' // 不输出统计信息到 stderr
    ]

    const ffmpeg = spawn('ffmpeg', enhancedArgs)
    let progressBuffer = ''
    let errorBuffer = ''

    ffmpeg.stdout.on('data', data => {
      // TODO: parse progress to json
      progressBuffer += data.toString()
      options.onProgress?.(progressBuffer)
    })

    ffmpeg.stderr.on('data', data => {
      errorBuffer += data.toString()
      options.onError?.(errorBuffer)
    })

    ffmpeg.on('close', code => {
      if (code === 0) {
        resolve({
          stdout: progressBuffer,
          stderr: errorBuffer,
          code
        })
      } else {
        reject(new Error(`FFmpeg exited with code ${code}: ${errorBuffer}`))
      }
    })
    ffmpeg.on('error', err => {
      reject(err)
    })
  })
}
