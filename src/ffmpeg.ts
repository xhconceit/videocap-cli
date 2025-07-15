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

export const extractAudioFromVideo = async (input: string, output: string): Promise<void> => {
  const name = path.basename(input)
  ensureDirectoryExists(tempDir)

  // ✅ 改为 WAV 格式，适合 Whisper
  const audioPath = path.join(tempDir, `${name}-${Date.now()}.wav`)

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

export interface FFmpegOptions {}
export const execFFmeg = async (args: string[], options: FFmpegOptions = {}): Promise<number> => {
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

    ffmpeg.stdout.on('data', data => {})

    // 监听错误输出 (stderr)
    ffmpeg.stderr.on('data', data => {})

    ffmpeg.on('close', code => {})

    ffmpeg.on('error', err => {})
  })
}
