import commandExists from 'command-exists'
import path from 'node:path'
import os from 'node:os'
import { spawn } from 'node:child_process'
import { ensureDirectoryExists } from './utils'

const tempDir = path.join(os.tmpdir(), 'videocap-cli')

export interface FFmpegMediaInfo {
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
      console.log(code)
      console.log(stderr.includes('Error'))
      // if (code === 0) {
      //   resolve(stderr)
      // } else {
      //   reject(new Error(`FFmpeg exited with code ${code}: ${stderr}`))
      // }
    })

    ffmpeg.on('error', err => {
      console.log('error', err)
      reject(err)
    })
  })
}

export const extractAudioFromVideo = async (input: string, output: string): Promise<void> => {
  const name = path.basename(input)
  ensureDirectoryExists(tempDir)

  // ✅ 改为 WAV 格式，适合 Whisper
  const audioPath = path.join(tempDir, `${name}-${Date.now()}.wav`)

  await getMediaInfo(input)
  return

  // ✅ 使用适合的编码参数
  const command = [
    '-i',
    input,
    '-vn', // 不包含视频
    '-acodec',
    'pcm_s16le', // PCM 编码（无损）
    '-ar',
    '16000', // 16kHz（Whisper 推荐）
    '-ac',
    '1', // 单声道
    '-y', // 覆盖现有文件
    audioPath
  ]

  await execFFmeg(command)
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

    console.log('execFFmeg', enhancedArgs)
    const ffmpeg = spawn('ffmpeg', enhancedArgs)

    let progressBuffer = ''
    let errorBuffer = ''

    ffmpeg.stdout.on('data', data => {
      progressBuffer += data.toString()
      options.onProgress?.(progressBuffer)
    })

    ffmpeg.stderr.on('data', data => {
      errorBuffer += data.toString()
      options.onError?.(errorBuffer)
    })

    ffmpeg.on('close', code => {
      console.log('close', code)
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
