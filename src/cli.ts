import { cac } from 'cac'
import { version } from '../package.json'

const cli = cac("videocap-cli")

interface VideoCapOptions {
  input: string
  output: string
}

cli.command("[input]", "Capture video from a path")
.option('--output <output>', 'Output path')
.action((input: string, options: VideoCapOptions) => {
  console.log(input, options)
})

cli.help()
cli.version(version)
cli.parse()


