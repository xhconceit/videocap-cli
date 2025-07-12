import commandExists from 'command-exists'
import path from 'node:path'
import os from 'node:os'
import { spawn } from 'node:child_process'

const tempDir = path.join(os.tmpdir(), 'videocap-cli')

export const isFFmpegInstalled = async (): Promise<boolean> => {
  const isInstalled = commandExists.sync('ffmpeg')
  return isInstalled
}

export const extractAudioFromVideo = async (input: string, output: string) => {
  const name = path.basename(input)
  const audioPath = path.join(tempDir, `${name}.mp3`)
  const command = ['-i', input, '-vn', '-acodec', 'copy', audioPath]
}


export const execFFmeg = async (args: string[]) => {
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', args)
    ffmpeg.stdout.on('data', (data) => {
      console.log(data)
    })
    ffmpeg.stderr.on('data', (data) => {
      console.log(data)
    })
    ffmpeg.on('close', (code) => {
      resolve(code)
    })
    ffmpeg.on('error', (err) => {
      reject(err)
    })
  })
}
