/**
 * 不依赖浏览器的客户端半单元测试。
 *
 * 目的：在没有真实 chromium 的情况下，验证 client.js 的运行时行为——
 *   1. 能被 ModuleLoader 正常装载（factory 不抛）；
 *   2. apply(ctx) 会把 173 个令牌注册到主题服务（light/dark 成对）；
 *   3. 三个图层（#km-side / #km-flame / #km-dock）挂上 DOM，html 带 km-on；
 *   4. 🎴 能开关（令牌层随之下/上、class 切换）；
 *   5. dispose 能把 DOM、class、令牌层全部还原。
 *
 * 用法：node tools/test-client.mjs
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CODE = fs.readFileSync(path.join(ROOT, 'client.js'), 'utf8')

/* ------------------------------------------------------------------ DOM 桩 -- */

class Style {
  constructor() { this.props = {} }
  setProperty(k, v) { this.props[k] = v }
  removeProperty(k) { delete this.props[k] }
}
class ClassList {
  constructor() { this.set = new Set() }
  toggle(name, on) { on ? this.set.add(name) : this.set.delete(name) }
  contains(name) { return this.set.has(name) }
  remove(name) { this.set.delete(name) }
}
class El {
  constructor(tag) {
    this.tagName = tag.toUpperCase()
    this.children = []
    this.style = new Style()
    this.classList = new ClassList()
    this.listeners = {}
    this.textContent = ''
    this.title = ''
    this.id = ''
  }
  append(...nodes) { this.children.push(...nodes) }
  appendChild(node) { this.children.push(node); return node }
  remove() {
    const all = [document.head, document.body]
    for (const parent of all) {
      const i = parent.children.indexOf(this)
      if (i >= 0) parent.children.splice(i, 1)
    }
  }
  addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn) }
  removeEventListener(type, fn) {
    const list = this.listeners[type] || []
    const i = list.indexOf(fn)
    if (i >= 0) list.splice(i, 1)
  }
  click() { for (const fn of this.listeners.click || []) fn() }
}

const documentElement = new El('html')
const document = {
  documentElement,
  head: new El('head'),
  body: new El('body'),
  hidden: false,
  listeners: {},
  createElement: (tag) => new El(tag),
  addEventListener(type, fn) { (this.listeners[type] ||= []).push(fn) },
  removeEventListener(type, fn) {
    const list = this.listeners[type] || []
    const i = list.indexOf(fn)
    if (i >= 0) list.splice(i, 1)
  },
}

const store = new Map()
const localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
}

let loaded = null
const window = {
  __ModuleLoader__: {
    load(def) { loaded = def },
  },
}

const sandbox = {
  window,
  document,
  localStorage,
  setInterval,
  clearInterval,
  console,
}
sandbox.globalThis = sandbox

/* ------------------------------------------------------------------ 执行 -- */

vm.createContext(sandbox)
vm.runInContext(CODE, sandbox)

assert.ok(loaded, 'ModuleLoader.load 未被调用')
assert.equal(loaded.id, 'dsh-kimetsu-theme', '插件 id 不符')

const mod = loaded.factory()
// 跨 VM 边界的数组原型不同，用 JSON 比较
assert.equal(JSON.stringify(mod.inject), JSON.stringify(['theme']), 'inject 应为 [theme]')
assert.equal(typeof mod.apply, 'function', 'apply 不是函数')

const effects = []
const tokenCalls = []
const ctx = {
  theme: {
    overrideTokens(source, tokens) {
      tokenCalls.push({ source, count: Object.keys(tokens).length, tokens })
      return () => tokenCalls.push({ source, count: 0, disposed: true })
    },
  },
  effect(fn, label) {
    const dispose = fn()
    effects.push({ label, dispose })
    return dispose
  },
}

mod.apply(ctx)

/* ------------------------------------------------------------------ 断言 -- */

const ids = document.body.children.map((c) => c.id)
assert.deepEqual(ids.sort(), ['km-dock', 'km-flame', 'km-side'], `图层不齐: ${ids}`)
assert.ok(documentElement.classList.contains('km-on'), 'html 未加 km-on')
assert.equal(document.head.children.length, 1, '未注入样式表')
assert.ok(document.head.children[0].textContent.includes('--km-scrim-1'), '样式表内容异常')

const first = tokenCalls[0]
assert.equal(first.source, 'dsh-kimetsu-theme', '令牌 source 不符')
assert.equal(first.count, 173, `令牌数量应为 173，实际 ${first.count}`)
const sample = first.tokens['--dsw-alias-bg-base']
assert.ok(sample && sample.light && sample.dark, '--dsw-alias-bg-base 缺 light/dark')
console.log(`令牌: ${first.count} 个；--dsw-alias-bg-base light=${sample.light} dark=${sample.dark}`)

const mainVar = documentElement.style.props['--km-main-img']
assert.ok(mainVar && mainVar.includes('/dsh-kimetsu/km-main-'), `壁纸变量异常: ${mainVar}`)
console.log(`壁纸变量: ${mainVar}`)

/* 开关：🎴 一次关，二次开 */
const dock = document.body.children.find((c) => c.id === 'km-dock')
const [toggle, next] = dock.children
toggle.click()
assert.ok(!documentElement.classList.contains('km-on'), '关闭后 km-on 仍在')
assert.equal(store.get('dsh-kimetsu:on'), '0', '关闭状态未持久化')
toggle.click()
assert.ok(documentElement.classList.contains('km-on'), '重新打开失败')
assert.equal(store.get('dsh-kimetsu:on'), '1', '打开状态未持久化')

/* 换图按钮改索引 */
const before = documentElement.style.props['--km-main-img']
next.click()
const after = documentElement.style.props['--km-main-img']
assert.notEqual(before, after, '换图后壁纸未变化')
console.log(`换图: ${before} -> ${after}`)

/* 卸载：DOM/class/令牌层全还原 */
for (const e of effects) assert.equal(typeof e.dispose, 'function', `${e.label} 没有 disposer`)
for (const e of effects) e.dispose()
assert.equal(document.body.children.length, 0, '卸载后仍有残留节点')
assert.ok(!documentElement.classList.contains('km-on'), '卸载后 km-on 仍在')
assert.ok(tokenCalls.some((c) => c.disposed), '令牌层未被释放')

console.log('\n全部通过：装载 / 173 令牌 / 三图层 / 开关 / 换图 / 卸载')
