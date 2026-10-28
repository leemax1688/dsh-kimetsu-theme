# dsh-kimetsu-theme · 鬼灭之刃「鬼杀队之夜」

DeepSeek Harness (DSH) Web 界面的《鬼灭之刃》皮肤：鬼杀队绿 + 和纸暖白／炭夜暖黑，
炭治郎与蝴蝶忍沉在背景层，顶部一道缓慢流动的火焰带，右下角两颗悬浮按钮负责开关与换图。

> 同人皮肤，非官方。《鬼灭之刃》角色版权归权利方所有；素材授权见 [LICENSE](./LICENSE)。

## 安装

```sh
dsh plugin --profile web add dsh-kimetsu-theme
```

或装进你实际使用的 profile：

```sh
dsh plugin --profile <你的 profile> add dsh-kimetsu-theme
```

装完刷新页面即可（多数情况无需重启）。卸载：

```sh
dsh plugin --profile web remove dsh-kimetsu-theme
```

## 界面里怎么用

| 位置 | 控件 | 作用 |
|---|---|---|
| 右下角 | 🎴 | 主题开 / 关（关掉立刻回到原生界面，调色板一起还原） |
| 右下角 | 🖼 | 手动换一张壁纸（主区 + 侧栏同时换） |

状态存在 localStorage：`dsh-kimetsu:on`（`1`/`0`）与 `dsh-kimetsu:idx`（当前壁纸序号）。
壁纸每 2 分钟自动轮换一次，切到后台会停表，回来不会连跳好几张。

## 它做了什么

1. **调色板**：覆盖 173 个 `--dsw-*` 设计令牌（light / dark 成对），
   走 `ctx.theme.overrideTokens()`，不改你的主题偏好，卸载即还原。
2. **壁纸**：主区 5 张 21:9（3200×1371，WebP q90）、侧栏 4 张 9:20（最高 1440×3200），
   由 Host 侧注册的 `/dsh-kimetsu/*` 静态路由提供，不内联进客户端包。
3. **装饰**：顶部火焰带（`prefers-reduced-motion` 下自动静止）、右侧可读性遮罩。

## 与旧版「往 dist 塞 CSS」的区别

旧方案改的是 `dsh-web-frontend/dist`：注入样式表、改 `index.html`、依赖 CSS Module
类名哈希（`hHd-Xa_root` 这类）。DSH 一升级 hash 就变，必须重跑部署脚本，还得维护一张
类名映射表。

本插件只依赖两样稳定契约：

- **令牌名**（`--dsw-alias-*` / `--dsw-static-*` / `--dsw-specific-*`）——官方主题服务的公开面；
- **自己的 DOM 图层**（`#km-side` / `#km-flame` / `#km-dock`）——不碰宿主任何类名。

所以 DSH 升级后不需要重新部署，也不需要改映射。

## 目录

```
index.js               Host 半：注册 /dsh-kimetsu 静态资源路由（白名单，防路径穿越）
client.js              构建产物（勿手改）：令牌覆盖 + 壁纸图层 + 悬浮按钮
src/template.client.js client 模板（真正的源码）
src/tokens.json        从旧主题 CSS 抽出的 173 个令牌（light/dark）
cordis.patch.yml       装载一行 loader 记录
tools/extract-tokens.py  旧 CSS → src/tokens.json
tools/build-assets.py    候选原图 → assets/*.webp（裁切/调色/锐化/编码）
tools/build-client.mjs   模板 + 令牌 + 壁纸清单 → client.js
tools/make-icon.py       市场卡片图标（180×180 PNG）
assets/                壁纸 + 图标
```

重建：

```sh
python tools/extract-tokens.py    # 令牌
python tools/build-assets.py      # 壁纸（可选 --preview 输出预览图）
node   tools/build-client.mjs     # 打包 client.js
python tools/make-icon.py         # 图标
```

## 兼容性

- 需要 DSH Web `0.1.0-rc.6` 或更新（`ctx.theme.overrideTokens` 与 `webServer.register` 在这之后稳定）。
- 已在 DSH `0.2.1` 上验证。
- 只覆盖调色板与背景层；会话、工具卡片、侧栏交互逻辑都不动。

## License

代码 MIT；`assets/` 下的同人图不在 MIT 范围内，详见 [LICENSE](./LICENSE)。
