import { nodewhisper } from 'nodejs-whisper'
import { join } from 'node:path'
import fs from 'node:fs'

// whisper 相关路径配置
export const whisperPaths = {
  // 模型目录路径
  modelsDir: join(__dirname, '../node_modules/nodejs-whisper/dist/cpp/whisper.cpp/models'),
  // 下载脚本路径
  downloadScript: join(__dirname, '../node_modules/nodejs-whisper/download-ggml-model.sh')
}

// 确保 whisper 目录存在
export const ensureWhisperDirs = () => {
  if (!fs.existsSync(whisperPaths.modelsDir)) {
    fs.mkdirSync(whisperPaths.modelsDir, { recursive: true })
  }
}

// 下载模型
export const downloadWhisperModel = async (modelName: string = 'base.en') => {
  ensureWhisperDirs()

  // 如果下载脚本不存在，从官方仓库下载
  if (!fs.existsSync(whisperPaths.downloadScript)) {
    const response = await fetch(
      'https://raw.githubusercontent.com/ggerganov/whisper.cpp/master/models/download-ggml-model.sh'
    )
    const script = await response.text()
    fs.writeFileSync(whisperPaths.downloadScript, script)
    fs.chmodSync(whisperPaths.downloadScript, '755') // 添加执行权限
  }

  // 执行下载脚本
  const { spawn } = await import('node:child_process')
  return new Promise((resolve, reject) => {
    const process = spawn(whisperPaths.downloadScript, [modelName], {
      cwd: whisperPaths.modelsDir
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
