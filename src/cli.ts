import { cac } from 'cac'
import { version } from '../package.json'
import { getFileAbsolutePath } from './utils'
import { videoCap, VideoCapOptions } from '.'

const cli = cac('videocap-cli')

interface CliOptions {
  input: string
  output: string
  language: string
  hard?: boolean
  soft?: string
  embedded?: boolean
  external?: boolean
  burned?: boolean
  cc?: boolean
}

const language = ['zh', 'en', 'zh-CN', 'zh-TW']
const soft = ['srt', 'vtt', 'ass', 'ssa']

cli
  .command('[input]', 'Capture video from a path')
  .option('--output <output>', 'Output path', {
    default: 'dist'
  })
  .option('--language <language>', `Language (${language.join(', ')})`, {
    default: language[0]
  })
  .option('--hard', 'Hard mode')
  .option('--soft <soft>', `Soft mode (${soft.join(', ')})`)
  .option('--embedded', 'Embedded mode')
  .option('--external', 'External mode')
  .option('--burned', 'Burned mode')
  .option('--cc', 'CC mode')

  .action((input: string, options: CliOptions) => {
    const url = getFileAbsolutePath(input)

    const soft: string[] = []
    if (typeof options.soft === 'string') {
      options.soft
        .split(',')
        .filter(ele => soft.includes(ele))
        .forEach(ele => soft.push(ele))
    }

    if (
      soft.length === 0 &&
      !options.hard &&
      !options.embedded &&
      !options.external &&
      !options.burned &&
      !options.cc
    ) {
      soft.push(soft[0])
    }

    const config: VideoCapOptions = {
      input: url,
      output: options.output,
      language: options.language,
      hard: options.hard,
      soft,
      embedded: options.embedded,
      external: options.external,
      burned: options.burned,
      cc: options.cc
    }

    videoCap(config)
  })

cli.help()
cli.version(version)
cli.parse()
