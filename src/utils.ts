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

export const ensureDirectoryExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

/**
 * 将下划线命名转换为驼峰命名
 * @param str 下划线分隔的字符串
 * @returns 驼峰命名的字符串
 * @example
 * snakeToCamel('out_time_us') // 返回 'outTimeUs'
 * snakeToCamel('foo_bar') // 返回 'fooBar'
 */
export const snakeToCamel = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase())
}
