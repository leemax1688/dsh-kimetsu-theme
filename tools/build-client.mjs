/**
 * 把 src/tokens.json + assets/*.webp 注入 src/template.client.js，产出 client.js。
 *
 * 为什么要构建步骤：DSH 的 client 半是单个自包含文件（ModuleLoader 的 factory
 * 只拿得到 require，没有 ESM import），所以令牌表和壁纸清单必须在构建时内联。
 *
 * 用法：node tools/build-client.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(ROOT, 'src')
const ASSETS = path.join(ROOT, 'assets')

const tokens = JSON.parse(fs.readFileSync(path.join(SRC, 'tokens.json'), 'utf8'))

/* 令牌合并成 { token: { light, dark } }；只有一侧有值时用同值兜底，
   保证任何模式都不会出现"半边失效"。 */
const merged = {}
for (const [name, value] of Object.entries(tokens.light)) {
  merged[name] = { light: value, dark: tokens.dark[name] ?? value }
}
for (const [name, value] of Object.entries(tokens.dark)) {
  if (!merged[name]) merged[name] = { light: value, dark: value }
}

const files = fs.readdirSync(ASSETS).filter((f) => f.endsWith('.webp')).sort()
const main = files.filter((f) => f.startsWith('km-main-'))
const side = files.filter((f) => f.startsWith('km-side-'))
if (!main.length || !side.length) throw new Error('assets/ 里缺壁纸，先跑 python tools/build-assets.py')

const template = fs.readFileSync(path.join(SRC, 'template.client.js'), 'utf8')
const out = template
  .replace('__TOKENS__', JSON.stringify(merged, null, 2))
  .replace('__MAIN__', JSON.stringify(main))
  .replace('__SIDE__', JSON.stringify(side))

const target = path.join(ROOT, 'client.js')
fs.writeFileSync(target, out)

const kb = (n) => `${(n / 1024).toFixed(1)} KB`
console.log(`tokens: ${Object.keys(merged).length} 个（light/dark 成对）`)
console.log(`壁纸: main ${main.length} 张 / side ${side.length} 张`)
console.log(`-> client.js  ${kb(Buffer.byteLength(out))}`)
