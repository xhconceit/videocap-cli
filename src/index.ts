import fs from 'node:fs'
import { isVideoFile } from './utils'
import { extractAudioFromVideo, isFFmpegInstalled } from './ffmpeg'
import { extractSubtitlesFromAudio } from './whisper'

export interface VideoCapOptions {
  input: string
  output: string
  language: string
  hard?: boolean
  soft?: string[]
  embedded?: boolean
  external?: boolean
  burned?: boolean
  cc?: boolean
}

export const videoCap = async (options: VideoCapOptions): Promise<void> => {
  if (!fs.existsSync(options.input)) {
    console.error('Input file does not exist.')
    process.exit(1)
  }
  if (!isFFmpegInstalled()) {
    console.error('FFmpeg is not installed. Please install it first.')
    process.exit(1)
  }
  if (!isVideoFile(options.input)) {
    console.error('Input file is not a video file.')
    process.exit(1)
  }
  const audioPaht = await extractAudioFromVideo(options.input)
  const sub = await extractSubtitlesFromAudio(audioPaht)
  console.log(sub)
}
