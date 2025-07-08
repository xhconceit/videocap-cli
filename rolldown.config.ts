import { defineConfig } from 'rolldown'

export default defineConfig({
  input: ['src/index.ts', 'src/cli.ts'],
  output: [
    {
      dir: 'dist',
      entryFileNames: '[name].js',
      chunkFileNames: 'chunks/lib-[hash].js',
      format: 'es'
    }
  ]
})
