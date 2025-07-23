import commandExists from 'command-exists'
import path from 'node:path'
import os from 'node:os'
import { spawn } from 'node:child_process'
import { ensureDirectoryExists, snakeToCamel } from './utils'
import yoctoSpinner from 'yocto-spinner'
const tempDir = path.join(os.tmpdir(), 'videocap-cli')

export const isFFmpegInstalled = async (): Promise<boolean> => {
  const isInstalled = commandExists.sync('ffmpeg')
  return isInstalled
}

export const extractAudioFromVideo = async (input: string): Promise<string> => {
  const name = path.basename(input)
  ensureDirectoryExists(tempDir)
  const audioPath = path.join(tempDir, `${name}-${Date.now()}.wav`)
  const command = ['-i', input, '-vn', '-acodec', 'pcm_s16le', '-ar', '16000', '-ac', '1', '-y', audioPath]
  await execFFmeg(command, {
    enableProgress: true,
    progressText: 'Extracting audio...'
  })
  return audioPath
}


export interface FFmpegOptions {
  enableProgress?: boolean // 是否启用进度显示
  progressText?: string // 进度显示文本
  onProgress?: (progress: FFmpegProgress) => void
  onError?: (error: string) => void
}
export interface FFmpegResult {
  stdout: string
  stderr: string
  code: number
}
export const execFFmeg = async (args: string[], options: FFmpegOptions = {}): Promise<FFmpegResult> => {
  const progressText = options?.progressText || 'Processing'
  const spinner = options.enableProgress ? yoctoSpinner({ text: progressText })?.start() : null
  return new Promise((resolve, reject) => {
    // 添加进度报告参数
    const enhancedArgs = [
      ...args,
      '-progress',
      'pipe:1', // 输出进度到 stdout
      '-nostats' // 不输出统计信息到 stderr
    ]

    const ffmpeg = spawn('ffmpeg', enhancedArgs)
    let errorBuffer = ''

    ffmpeg.stdout.on('data', data => {
      try {
        options.onProgress?.(parseProgress(data.toString()))
      } catch (error) {
        console.error('parse progress error', error)
      }
    })

    ffmpeg.stderr.on('data', data => {
      errorBuffer += data.toString()
      options.onError?.(errorBuffer)
    })

    ffmpeg.on('close', code => {
      if (code === 0) {
        spinner?.success('Success')
        resolve({
          stdout: '',
          stderr: errorBuffer,
          code
        })
      } else {
        spinner?.error('Error')
        reject(new Error(`FFmpeg exited with code ${code}: ${errorBuffer}`))
      }
    })
    ffmpeg.on('error', err => {
      spinner?.error('Error')
      reject(err)
    })
  })
}

interface FFmpegProgress {
  bitrate: number
  totalSize: number
  outTimeUs: number
  outTimeMs: number
  dupFrames: number
  dropFrames: number
  speed: number
  outTime: string
  progress: string
}

function parseProgress(progress: string): FFmpegProgress {
  const progressData = {} as FFmpegProgress
  const lines = progress.split('\n')
  while (lines.length > 0) {
    const line = lines.shift()?.trim()
    if (line) {
      let [key, value] = line.split('=') as [keyof FFmpegProgress, string | number]
      if (typeof key !== 'undefined' && typeof value !== 'undefined') {
        key = snakeToCamel(key) as keyof FFmpegProgress
        switch (key) {
          case 'bitrate':
          case 'totalSize':
          case 'outTimeUs':
          case 'outTimeMs':
          case 'dupFrames':
          case 'dropFrames':
          case 'speed':
            value = parseFloat(value.toString())
            progressData[key] = value
            break
          case 'outTime':
          case 'progress':
            value = value.toString()
            progressData[key] = value
            break
        }
      }
    }
  }
  return progressData
}
