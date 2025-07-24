// import { nodewhisper } from 'nodejs-whisper'
import { join } from 'node:path'
import fs from 'node:fs'
import { homedir } from 'node:os'
import yoctoSpinner from 'yocto-spinner'

const MODEL_DIR_PATH = join(homedir(), '.videocap')
const WHISPER_DIR_PATH = join(MODEL_DIR_PATH, 'whisper')
const WHISPER_MODEL_DIR_PATH = join(WHISPER_DIR_PATH, 'models')

const WhisperDownloadModelBashUrl =
  'https://raw.githubusercontent.com/ggerganov/whisper.cpp/master/models/download-ggml-model.sh'
const WhisperDownloadModelBashPath = join(WHISPER_DIR_PATH, 'download-ggml-model.sh')

// 确保 whisper 目录存在
export const ensureWhisperDirs = (): void => {
  if (!fs.existsSync(WHISPER_DIR_PATH)) {
    fs.mkdirSync(WHISPER_DIR_PATH, { recursive: true })
  }
}

// 下载模型
export const downloadWhisperModel = async (modelName: string = 'base.en'): Promise<boolean> => {
  ensureWhisperDirs()
  if (!fs.existsSync(WhisperDownloadModelBashPath)) {
    const spinner = yoctoSpinner({ text: 'Downloading whisper model bash file...' }).start()
    const response = await fetch(WhisperDownloadModelBashUrl)
    const script = await response.text()
    spinner.success('Download whisper model bash file success')
    fs.writeFileSync(WhisperDownloadModelBashPath, script)
    fs.chmodSync(WhisperDownloadModelBashPath, '755')
  }

  // 执行下载脚本
  const { spawn } = await import('node:child_process')
  return new Promise((resolve, reject) => {
    const process = spawn(WhisperDownloadModelBashPath, [modelName], {
      cwd: WHISPER_MODEL_DIR_PATH
    })

    process.on('close', code => {
      if (code === 0) {
        resolve(true)
      } else {
        reject(new Error(`下载模型失败，退出码: ${code}`))
      }
    })

    process.on('error', reject)
  })
}

export const extractSubtitlesFromAudio = async (input: string): Promise<string> => {
  await downloadWhisperModel()
  return ''
  const data = await nodewhisper(input, {
    modelName: 'base.en', //Downloaded models name
    autoDownloadModelName: 'base.en', // (optional) auto download a model if model is not present
    removeWavFileAfterTranscription: false, // (optional) remove wav file once transcribed
    withCuda: false, // (optional) use cuda for faster processing
    logger: console, // (optional) Logging instance, defaults to console
    whisperOptions: {
      outputInCsv: false, // get output result in csv file
      outputInJson: false, // get output result in json file
      outputInJsonFull: false, // get output result in json file including more information
      outputInLrc: false, // get output result in lrc file
      outputInSrt: true, // get output result in srt file
      outputInText: false, // get output result in txt file
      outputInVtt: false, // get output result in vtt file
      outputInWords: false, // get output result in wts file for karaoke
      translateToEnglish: false, // translate from source language to english
      wordTimestamps: false, // word-level timestamps
      timestamps_length: 20, // amount of dialogue per timestamp pair
      splitOnWord: true // split on word rather than on token
    }
  })
  return data
}
