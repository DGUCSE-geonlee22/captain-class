/**
 * src/data/*.ts 의 목업 데이터를 서버 시드(server/seed.json)로 내보낸다.
 * Node 내장 타입 제거(node:module.stripTypeScriptTypes)로 .ts를 JS로 바꿔 임시 폴더에 두고 import 한다. (Node 22.13+ / 24)
 * 사용: npm run seed:export  (데이터 파일을 고친 뒤 실행)
 */
import { stripTypeScriptTypes } from 'node:module'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'src', 'data')
const tmp = join(root, 'node_modules', '.tmp-seed')
mkdirSync(tmp, { recursive: true })

for (const f of ['types', 'cases', 'bridge', 'team']) {
  const code = readFileSync(join(src, `${f}.ts`), 'utf8')
  const out = stripTypeScriptTypes(code, { mode: 'strip' })
  writeFileSync(join(tmp, `${f}.mjs`), out.replace(/from '\.\/(\w+)'/g, "from './$1.mjs'"))
}

const cases = await import(pathToFileURL(join(tmp, 'cases.mjs')).href)
const bridge = await import(pathToFileURL(join(tmp, 'bridge.mjs')).href)
const team = await import(pathToFileURL(join(tmp, 'team.mjs')).href)

const seed = {
  generatedAt: new Date().toISOString(),
  cases: cases.cases,
  communityPosts: cases.communityPosts,
  grievances: bridge.grievances,
  bridgeProfiles: bridge.bridgeProfiles,
  demoUser: team.demoUser,
}
const file = join(root, 'server', 'seed.json')
writeFileSync(file, JSON.stringify(seed, null, 2) + '\n')
console.log(`seed.json: cases ${seed.cases.length}, posts ${seed.communityPosts.length}, grievances ${seed.grievances.length} → ${file}`)
