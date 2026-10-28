/**
 * Host half of `dsh-kimetsu-theme`.
 *
 * 前端要拿到的壁纸（每张 150-500 KB）不适合内联进 client 包，所以由 Host 侧
 * 注册一个静态前缀路由 `/dsh-kimetsu/*` 来提供 assets/ 下的文件。
 * 只服务启动时扫描到的白名单文件名，杜绝路径穿越。
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS = path.join(__dirname, 'assets')

const MIME = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
}

export default {
  name: 'dsh-kimetsu-theme',
  inject: ['webServer'],
  apply(ctx) {
    let allow = new Set()
    try {
      allow = new Set(fs.readdirSync(ASSETS).filter((f) => MIME[path.extname(f).toLowerCase()]))
    } catch (err) {
      ctx.logger?.warn?.(`[dsh-kimetsu-theme] assets 目录不可读: ${err.message}`)
    }

    const dispose = ctx.webServer.register({
      kind: 'prefix',
      path: '/dsh-kimetsu',
      handler: (req, res) => {
        const name = String(req.url || '').split('?')[0].split('/').filter(Boolean).pop() || ''
        if (!allow.has(name)) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
          res.end('not found')
          return
        }
        const file = path.join(ASSETS, name)
        try {
          const stat = fs.statSync(file)
          res.writeHead(200, {
            'Content-Type': MIME[path.extname(name).toLowerCase()] || 'application/octet-stream',
            'Content-Length': String(stat.size),
            'Cache-Control': 'public, max-age=604800, immutable',
          })
          fs.createReadStream(file).pipe(res)
        } catch (err) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
          res.end('not found')
        }
      },
    })

    ctx.effect(() => dispose)
  },
}
