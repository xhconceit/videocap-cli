import { defineConfig } from 'rolldown'

export default defineConfig({
  input: ['src/index.ts', 'src/cli.ts'],
  output: [
    {
      banner: `
        import { fileURLToPath } from 'node:url';import { dirname } from 'node:path';const __filename = fileURLToPath(import.meta.url);const __dirname = dirname(__filename); 
        `,
      dir: 'dist',
      entryFileNames: '[name].js',
      chunkFileNames: 'chunks/lib-[hash].js',
      format: 'es'
    }
  ],
  platform: 'node',
  external: ['events', 'fs', 'path', 'util', 'url', 'child_process', 'stream', 'crypto']
})
