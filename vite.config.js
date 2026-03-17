import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages deploys to /repo-name/ — set this to your repo name
  base: '/intelligence-lab/',
})
