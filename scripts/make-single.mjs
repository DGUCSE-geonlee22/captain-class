/**
 * dist/의 빌드 결과를 HTML 파일 하나로 묶는다.
 * 결과: dist-single/CaptainClass.html — 카톡·메일·드라이브로 보내서 더블클릭으로 열 수 있다.
 * 사용: npm run build:single
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
const out = join(root, 'dist-single')
if (!existsSync(join(dist, 'index.html'))) throw new Error('dist/index.html이 없습니다. 먼저 npm run build를 실행하세요.')

let html = readFileSync(join(dist, 'index.html'), 'utf8')

// JS 인라인 (</script 문자열이 태그를 닫지 않도록 이스케이프)
html = html.replace(/<script type="module" crossorigin src="\.\/(assets\/[^"]+\.js)"><\/script>/, (_, p) => {
  const js = readFileSync(join(dist, p), 'utf8').replace(/<\/script/gi, '<\\/script')
  return `<script type="module">${js}</script>`
})

// CSS 인라인
html = html.replace(/<link rel="stylesheet" crossorigin href="\.\/(assets\/[^"]+\.css)">/, (_, p) => {
  const css = readFileSync(join(dist, p), 'utf8').replace(/<\/style/gi, '<\\/style')
  return `<style>${css}</style>`
})

// 파비콘 인라인
html = html.replace(/href="\.\/favicon\.svg"/, () => {
  const svg = readFileSync(join(dist, 'favicon.svg'), 'utf8')
  return `href="data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}"`
})

if (/src="\.\/assets|href="\.\/assets/.test(html)) throw new Error('인라인되지 않은 assets 참조가 남아 있습니다.')

mkdirSync(out, { recursive: true })
const file = join(out, 'CaptainClass.html')
writeFileSync(file, html)
console.log(`완료: ${file} (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB)`)
