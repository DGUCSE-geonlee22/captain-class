import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  // 상대 경로 빌드: 어느 폴더(예: ~/public_html/cc/)에 올려도 CSS·JS 경로가 깨지지 않음
  base: './',
  plugins: [react(), tailwindcss()],
  // 개발 중 /api 요청은 로컬 백엔드(npm run server, 8787)로 넘긴다
  server: { proxy: { '/api': 'http://localhost:8787' } },
})
