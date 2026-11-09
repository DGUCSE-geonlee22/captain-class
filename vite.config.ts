import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  // 상대 경로 빌드: 어느 폴더(예: ~/public_html/cc/)에 올려도 CSS·JS 경로가 깨지지 않음
  base: './',
  plugins: [react(), tailwindcss()],
})
