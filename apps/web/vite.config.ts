import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: { port: 3000 },
  resolve: {
    alias: {
      '@five-letter/game-core': path.resolve(
        __dirname,
        '../../packages/game-core/src/index.ts'
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
})
