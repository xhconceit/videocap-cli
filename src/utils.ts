import { fileTypeFromBuffer } from 'file-type'
import fs from 'node:fs'
import path from 'node:path'

export const getFileAbsolutePath = (url: string): string => {
  if (path.isAbsolute(url)) {
    return url
  }
  return path.resolve(process.cwd(), url)
}


export const isVideoFile = async (url: string): Promise<boolean> => {
  const fileType = await fileTypeFromBuffer(fs.readFileSync(url))
  return fileType?.mime.startsWith('video/') ?? false
}