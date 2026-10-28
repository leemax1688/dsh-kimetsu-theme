/**
 * Client half of `dsh-kimetsu-theme` — 鬼灭之刃「鬼杀队之夜」皮肤。
 *
 * 与旧版（往 dsh-web-frontend/dist 里塞 CSS + 改 index.html）的本质区别：
 *   旧版依赖 CSS Module 类名哈希（形如 `hHd-Xa_root`），DSH 每次升级都可能整体失效，
 *   还要维护一份 CLASS_OVERRIDES 映射表；本插件只用两样东西：
 *     1. 设计令牌覆盖（ctx.theme.overrideTokens）——令牌名是稳定契约；
 *     2. 自己的 DOM 图层（壁纸 / 火焰带 / 悬浮按钮）——不碰宿主的任何类名。
 *   因此升级 DSH 不需要重部署，也不需要改映射。
 *
 * 令牌值由 tools/extract-tokens.py 从旧 CSS 抽出、tools/build-client.mjs 注入。
 */
window.__ModuleLoader__.load({
  id: 'dsh-kimetsu-theme',
  factory() {
    /** 覆盖层身份：一个 source 只有一个图层，重复注册会替换自己。 */
    const SOURCE = 'dsh-kimetsu-theme'

    /** 全部令牌（light/dark 成对），构建时注入。 */
    const TOKENS = __TOKENS__

    /** 壁纸清单：由宿主 index.js 注册的 /dsh-kimetsu 前缀路由提供。 */
    const MAIN = __MAIN__
    const SIDE = __SIDE__

    const KEY_ON = 'dsh-kimetsu:on'
    const KEY_IDX = 'dsh-kimetsu:idx'
    const ROTATE_MS = 120000

    /* --------------------------------------------------------------- 样式 -- */

    const CSS = `
html.km-on body {
  background-image:
    linear-gradient(to right,
      var(--km-scrim-1) 0%,
      var(--km-scrim-2) 44%,
      var(--km-scrim-3) 100%),
    var(--km-main-img) !important;
  background-size: cover !important;
  background-position: right center !important;
  background-repeat: no-repeat !important;
  background-attachment: fixed !important;
}
html.km-on {
  --km-scrim-1: rgba(247, 244, 236, .97);
  --km-scrim-2: rgba(247, 244, 236, .90);
  --km-scrim-3: rgba(247, 244, 236, .42);
}
html.km-on body[data-ds-dark-theme] {
  --km-scrim-1: rgba(16, 14, 11, .97);
  --km-scrim-2: rgba(16, 14, 11, .88);
  --km-scrim-3: rgba(16, 14, 11, .40);
}
#km-side {
  position: fixed; left: 0; top: 0; bottom: 0;
  width: min(300px, 27vw);
  background-image: var(--km-side-img);
  background-size: cover; background-position: center top;
  opacity: .55; pointer-events: none; z-index: 0;
  -webkit-mask-image: linear-gradient(to right, #000 0%, #000 52%, transparent 100%);
  mask-image: linear-gradient(to right, #000 0%, #000 52%, transparent 100%);
}
#km-flame {
  position: fixed; left: 0; right: 0; top: 0; height: 3px;
  z-index: 5; pointer-events: none; opacity: .85;
  background: linear-gradient(90deg, transparent, #c1272d, #e8933a, #2e7d4f, transparent);
  background-size: 300% 100%;
  animation: km-flame-run 9s linear infinite;
}
@keyframes km-flame-run {
  0%   { background-position:   0% 50%; }
  100% { background-position: 300% 50%; }
}
@media (prefers-reduced-motion: reduce) {
  #km-flame { animation: none; }
}
#km-dock {
  position: fixed; right: 16px; bottom: 16px;
  display: flex; gap: 8px; z-index: 2147483000;
}
#km-dock button {
  width: 34px; height: 34px; border-radius: 10px; cursor: pointer;
  font-size: 15px; line-height: 1;
  color: var(--dsw-alias-label-primary, #1b2620);
  background: var(--dsw-specific-sidebar-fill, rgba(247, 244, 236, .82));
  border: 1px solid var(--dsw-alias-border-l1, rgba(46, 125, 79, .20));
  backdrop-filter: blur(6px);
  transition: transform .15s ease, border-color .15s ease;
}
#km-dock button:hover {
  transform: translateY(-1px);
  border-color: var(--dsw-static-deepseek-500, #2e7d4f);
}
`

    /* ------------------------------------------------------------ 工具函数 -- */

    const read = (key, fallback) => {
      try {
        const v = localStorage.getItem(key)
        return v === null ? fallback : v
      } catch (err) {
        return fallback
      }
    }
    const write = (key, value) => {
      try {
        localStorage.setItem(key, value)
      } catch (err) {
        /* 隐私模式下 localStorage 会抛，忽略即可 */
      }
    }
    const url = (name) => 'url("/dsh-kimetsu/' + name + '")'

    /* ---------------------------------------------------------------- 挂载 -- */

    function mount(ctx) {
      const root = document.documentElement

      // immediately:true 的客户端插件可能在 <body> 解析完之前就跑，
      // 这时挂到 DOMContentLoaded 上，并把"还没挂载"的状态也纳入 dispose。
      if (!document.body) {
        let disposed = false
        let inner = null
        const onReady = () => {
          if (!disposed) inner = mount(ctx)
        }
        document.addEventListener('DOMContentLoaded', onReady, { once: true })
        return () => {
          disposed = true
          document.removeEventListener('DOMContentLoaded', onReady)
          if (inner) inner()
        }
      }

      const body = document.body

      let index = Number(read(KEY_IDX, '0')) || 0
      let enabled = read(KEY_ON, '1') !== '0'
      let timer = null

      const style = document.createElement('style')
      style.id = 'dsh-kimetsu-style'
      style.textContent = CSS
      document.head.appendChild(style)

      const side = document.createElement('div')
      side.id = 'km-side'

      const flame = document.createElement('div')
      flame.id = 'km-flame'

      const dock = document.createElement('div')
      dock.id = 'km-dock'
      const toggle = document.createElement('button')
      toggle.title = '鬼灭之刃主题 开 / 关'
      toggle.textContent = '🎴'
      const next = document.createElement('button')
      next.title = '换一张壁纸'
      next.textContent = '🖼'
      dock.append(toggle, next)

      body.append(side, flame, dock)

      /** 把第 i 张壁纸写进 CSS 变量；主区与侧栏各自独立索引。 */
      const paint = () => {
        const m = MAIN[index % MAIN.length]
        const s = SIDE[index % SIDE.length]
        root.style.setProperty('--km-main-img', url(m))
        side.style.setProperty('--km-side-img', url(s))
      }

      /** 调色板的处置句柄：换状态时先释放上一层，避免图层叠加。 */
      let tokenDispose = null
      const setTokens = (on) => {
        if (tokenDispose) {
          tokenDispose()
          tokenDispose = null
        }
        if (!on) return
        try {
          const d = ctx.theme.overrideTokens(SOURCE, TOKENS)
          tokenDispose = typeof d === 'function' ? d : null
        } catch (err) {
          /* 主题服务不可用时只保留装饰层 */
        }
      }

      /** 开关：装饰层 + 调色板一起切换，卸载插件即彻底还原。 */
      const applyEnabled = (on) => {
        enabled = on
        root.classList.toggle('km-on', on)
        side.style.display = on ? '' : 'none'
        flame.style.display = on ? '' : 'none'
        setTokens(on)
        write(KEY_ON, on ? '1' : '0')
        if (on) startRotation()
        else stopRotation()
      }

      const stopRotation = () => {
        if (timer !== null) {
          clearInterval(timer)
          timer = null
        }
      }

      const startRotation = () => {
        stopRotation()
        if (!enabled) return
        timer = setInterval(() => {
          index = (index + 1) % Math.max(MAIN.length, SIDE.length)
          write(KEY_IDX, String(index))
          paint()
        }, ROTATE_MS)
      }

      /** 切到后台就停表，回来不会连跳好几张。 */
      const onVisibility = () => {
        if (document.hidden) stopRotation()
        else if (enabled) startRotation()
      }

      toggle.addEventListener('click', () => applyEnabled(!enabled))
      next.addEventListener('click', () => {
        index = (index + 1) % Math.max(MAIN.length, SIDE.length)
        write(KEY_IDX, String(index))
        paint()
      })
      document.addEventListener('visibilitychange', onVisibility)

      paint()
      applyEnabled(enabled)

      return () => {
        stopRotation()
        setTokens(false)
        document.removeEventListener('visibilitychange', onVisibility)
        style.remove()
        side.remove()
        flame.remove()
        dock.remove()
        root.classList.remove('km-on')
        root.style.removeProperty('--km-main-img')
        root.style.removeProperty('--km-side-img')
      }
    }

    /* ---------------------------------------------------------------- 导出 -- */

    return {
      inject: ['theme'],
      apply(ctx) {
        // 调色板与装饰层都由 mount 统一管理：开关切换时两者一起进出，
        // 卸载插件时 dispose 会同时撤掉令牌层和 DOM 图层。
        ctx.effect(() => mount(ctx), 'kimetsu skin')
      },
    }
  },
})
