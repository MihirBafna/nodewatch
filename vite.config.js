import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // base: '/nodewatch/',
  base: 'https://bergerlabmit.github.io/nodewatch',
  plugins: [react()],
  server: {
    host: true,
  },
  
})
