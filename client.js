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
    const TOKENS = {
  "--dsw-static-deepseek-50": {
    "light": "#eef7f1",
    "dark": "#102b1e"
  },
  "--dsw-static-deepseek-100": {
    "light": "#d8ede0",
    "dark": "#173d29"
  },
  "--dsw-static-deepseek-200": {
    "light": "#bde0cb",
    "dark": "#1d5135"
  },
  "--dsw-static-deepseek-300": {
    "light": "#92c8a8",
    "dark": "#266642"
  },
  "--dsw-static-deepseek-400": {
    "light": "#4ea77a",
    "dark": "#2e7d4f"
  },
  "--dsw-static-deepseek-450": {
    "light": "#3b9a6b",
    "dark": "#3b9a6b"
  },
  "--dsw-static-deepseek-500": {
    "light": "#2e7d4f",
    "dark": "#5ec488"
  },
  "--dsw-static-deepseek-600": {
    "light": "#266642",
    "dark": "#7fd4a3"
  },
  "--dsw-static-deepseek-700-delete": {
    "light": "#1d5135",
    "dark": "#a3e3bd"
  },
  "--dsw-static-deepseek-800": {
    "light": "#173d29",
    "dark": "#c6efd7"
  },
  "--dsw-static-deepseek-900": {
    "light": "#102b1e",
    "dark": "#e4f8ec"
  },
  "--dsw-static-neutral-bluish-00": {
    "light": "#fffdf8",
    "dark": "#100e0b"
  },
  "--dsw-static-neutral-bluish-50": {
    "light": "#faf7f0",
    "dark": "#141210"
  },
  "--dsw-static-neutral-bluish-60": {
    "light": "#f7f4ec",
    "dark": "#17140f"
  },
  "--dsw-static-neutral-bluish-75": {
    "light": "#f3efe5",
    "dark": "#1b1813"
  },
  "--dsw-static-neutral-bluish-100": {
    "light": "#ece7db",
    "dark": "#201c16"
  },
  "--dsw-static-neutral-bluish-150": {
    "light": "#e2dccd",
    "dark": "#262119"
  },
  "--dsw-static-neutral-bluish-200": {
    "light": "#d6cfbd",
    "dark": "#2e281e"
  },
  "--dsw-static-neutral-bluish-300": {
    "light": "#bfb6a1",
    "dark": "#3d3527"
  },
  "--dsw-static-neutral-bluish-400": {
    "light": "#9d947e",
    "dark": "#554b38"
  },
  "--dsw-static-neutral-bluish-500": {
    "light": "#7f7663",
    "dark": "#6f6553"
  },
  "--dsw-static-neutral-bluish-600": {
    "light": "#665f4e",
    "dark": "#8a8070"
  },
  "--dsw-static-neutral-bluish-700": {
    "light": "#4f4a3c",
    "dark": "#a69c8b"
  },
  "--dsw-static-neutral-bluish-750": {
    "light": "#403c30",
    "dark": "#b8ae9c"
  },
  "--dsw-static-neutral-bluish-800": {
    "light": "#302d24",
    "dark": "#cac1af"
  },
  "--dsw-static-neutral-bluish-850": {
    "light": "#26241d",
    "dark": "#d9d1c1"
  },
  "--dsw-static-neutral-bluish-875": {
    "light": "#1f1d17",
    "dark": "#e2dbcd"
  },
  "--dsw-static-neutral-bluish-900": {
    "light": "#181712",
    "dark": "#ebe5d8"
  },
  "--dsw-static-neutral-bluish-950": {
    "light": "#100e0b",
    "dark": "#f4f0e7"
  },
  "--dsw-static-neutral-bluish-1000": {
    "light": "#080705",
    "dark": "#fffdf8"
  },
  "--dsw-static-neutral-00": {
    "light": "#fffdf8",
    "dark": "#100e0b"
  },
  "--dsw-static-neutral-50": {
    "light": "#faf8f3",
    "dark": "#16130f"
  },
  "--dsw-static-neutral-100": {
    "light": "#f2efe8",
    "dark": "#1d1a15"
  },
  "--dsw-static-neutral-150": {
    "light": "#eae6dd",
    "dark": "#231f19"
  },
  "--dsw-static-neutral-200": {
    "light": "#e1dcd0",
    "dark": "#2a251e"
  },
  "--dsw-static-neutral-250": {
    "light": "#d7d1c4",
    "dark": "#332d24"
  },
  "--dsw-static-neutral-300": {
    "light": "#cac2b3",
    "dark": "#3e372c"
  },
  "--dsw-static-neutral-400": {
    "light": "#a19788",
    "dark": "#5a5140"
  },
  "--dsw-static-neutral-500": {
    "light": "#7f776a",
    "dark": "#746a56"
  },
  "--dsw-static-neutral-550": {
    "light": "#696256",
    "dark": "#8b8070"
  },
  "--dsw-static-neutral-600": {
    "light": "#565046",
    "dark": "#a3988a"
  },
  "--dsw-static-neutral-700": {
    "light": "#413c34",
    "dark": "#bdb3a2"
  },
  "--dsw-static-neutral-800": {
    "light": "#2d2923",
    "dark": "#d4cbbb"
  },
  "--dsw-static-neutral-850": {
    "light": "#24211c",
    "dark": "#ded6c7"
  },
  "--dsw-static-neutral-900": {
    "light": "#171512",
    "dark": "#e9e2d4"
  },
  "--dsw-static-neutral-1000": {
    "light": "#000000",
    "dark": "#fffdf8"
  },
  "--dsw-static-blue-50": {
    "light": "#ecf7f8",
    "dark": "#0f2c34"
  },
  "--dsw-static-blue-50p": {
    "light": "#e8f5f7",
    "dark": "#102f38"
  },
  "--dsw-static-blue-75": {
    "light": "#e0f1f3",
    "dark": "#12343e"
  },
  "--dsw-static-blue-100": {
    "light": "#cde7eb",
    "dark": "#143c46"
  },
  "--dsw-static-blue-300": {
    "light": "#80c3cd",
    "dark": "#1c525e"
  },
  "--dsw-static-blue-400": {
    "light": "#4fa8b7",
    "dark": "#256e7e"
  },
  "--dsw-static-blue-450": {
    "light": "#3e9aab",
    "dark": "#2e8a9d"
  },
  "--dsw-static-blue-500": {
    "light": "#2e8a9d",
    "dark": "#4fa8b7"
  },
  "--dsw-static-blue-600": {
    "light": "#256e7e",
    "dark": "#80c3cd"
  },
  "--dsw-static-blue-800": {
    "light": "#1c525e",
    "dark": "#cde7eb"
  },
  "--dsw-static-blue-900": {
    "light": "#143c46",
    "dark": "#e0f1f3"
  },
  "--dsw-static-blue-950": {
    "light": "#0f2c34",
    "dark": "#ecf7f8"
  },
  "--dsw-static-red-50": {
    "light": "#fdeeec",
    "dark": "#5e1612"
  },
  "--dsw-static-red-100": {
    "light": "#fadcd8",
    "dark": "#7a1d18"
  },
  "--dsw-static-red-400": {
    "light": "#e26054",
    "dark": "#c1272d"
  },
  "--dsw-static-red-500": {
    "light": "#d6453a",
    "dark": "#d6453a"
  },
  "--dsw-static-red-600": {
    "light": "#c1272d",
    "dark": "#e26054"
  },
  "--dsw-static-red-900": {
    "light": "#5e1612",
    "dark": "#fadcd8"
  },
  "--dsw-static-amber-100": {
    "light": "#fdf0da",
    "dark": "#422810"
  },
  "--dsw-static-amber-400": {
    "light": "#f0a33e",
    "dark": "#cc7426"
  },
  "--dsw-static-amber-500": {
    "light": "#e8933a",
    "dark": "#e8933a"
  },
  "--dsw-static-amber-600": {
    "light": "#cc7426",
    "dark": "#f0a33e"
  },
  "--dsw-static-amber-900": {
    "light": "#422810",
    "dark": "#fdf0da"
  },
  "--dsw-static-green-100": {
    "light": "#e6f7ea",
    "dark": "#1e4228"
  },
  "--dsw-static-green-400": {
    "light": "#53c976",
    "dark": "#2ea054"
  },
  "--dsw-static-green-500": {
    "light": "#2ea054",
    "dark": "#53c976"
  },
  "--dsw-static-green-900": {
    "light": "#1e4228",
    "dark": "#e6f7ea"
  },
  "--dsw-alias-bg-base": {
    "light": "#f7f4ec",
    "dark": "#100e0b"
  },
  "--dsw-alias-bg-layer-1": {
    "light": "#fffdf8",
    "dark": "#1a1713"
  },
  "--dsw-alias-bg-layer-2": {
    "light": "#f2ede3",
    "dark": "#221e18"
  },
  "--dsw-alias-bg-layer-3": {
    "light": "#eae2d5",
    "dark": "#2b251d"
  },
  "--dsw-alias-bg-mask-1": {
    "light": "rgba(27, 38, 32, .42)",
    "dark": "rgba(0, 0, 0, .58)"
  },
  "--dsw-alias-bg-mask-2": {
    "light": "rgba(27, 38, 32, .28)",
    "dark": "rgba(0, 0, 0, .42)"
  },
  "--dsw-alias-bg-mask-3": {
    "light": "rgba(27, 38, 32, .16)",
    "dark": "rgba(0, 0, 0, .26)"
  },
  "--dsw-alias-bg-mask-drop": {
    "light": "rgba(27, 38, 32, .10)",
    "dark": "rgba(0, 0, 0, .18)"
  },
  "--dsw-alias-bg-mask-photo": {
    "light": "rgba(27, 38, 32, .48)",
    "dark": "rgba(0, 0, 0, .62)"
  },
  "--dsw-alias-bg-module-platform": {
    "light": "#fffdf8",
    "dark": "#171410"
  },
  "--dsw-alias-bg-multi-select": {
    "light": "rgba(46, 125, 79, .10)",
    "dark": "rgba(94, 196, 136, .14)"
  },
  "--dsw-alias-bg-overlay": {
    "light": "rgba(27, 38, 32, .38)",
    "dark": "rgba(0, 0, 0, .58)"
  },
  "--dsw-alias-bg-skeleton": {
    "light": "#ece7db",
    "dark": "#221e18"
  },
  "--dsw-alias-border-l1": {
    "light": "rgba(46, 125, 79, .20)",
    "dark": "rgba(94, 196, 136, .18)"
  },
  "--dsw-alias-border-l2": {
    "light": "rgba(46, 125, 79, .14)",
    "dark": "rgba(94, 196, 136, .12)"
  },
  "--dsw-alias-border-l2-darkmode-thin": {
    "light": "rgba(46, 125, 79, .14)",
    "dark": "rgba(94, 196, 136, .12)"
  },
  "--dsw-alias-border-l3": {
    "light": "rgba(46, 125, 79, .28)",
    "dark": "rgba(94, 196, 136, .26)"
  },
  "--dsw-alias-border-l4": {
    "light": "rgba(46, 125, 79, .40)",
    "dark": "rgba(94, 196, 136, .38)"
  },
  "--dsw-alias-border-inverted": {
    "light": "rgba(255, 253, 248, .30)",
    "dark": "rgba(16, 14, 11, .40)"
  },
  "--dsw-alias-border-inverted2": {
    "light": "rgba(255, 253, 248, .55)",
    "dark": "rgba(16, 14, 11, .62)"
  },
  "--dsw-alias-brand-primary": {
    "light": "#2e7d4f",
    "dark": "#5ec488"
  },
  "--dsw-alias-brand-primary-invert": {
    "light": "#ffffff",
    "dark": "#0d1a13"
  },
  "--dsw-alias-brand-primary-new-colorprimary-new-color": {
    "light": "#2e7d4f",
    "dark": "#5ec488"
  },
  "--dsw-alias-brand-text": {
    "light": "#23603e",
    "dark": "#8ddcac"
  },
  "--dsw-alias-button-primary-fill": {
    "light": "#2e7d4f",
    "dark": "#3b9a6b"
  },
  "--dsw-alias-button-primary-hover": {
    "light": "#1d5135",
    "dark": "#4ea77a"
  },
  "--dsw-alias-button-primary-dimmed": {
    "light": "#cfe4d8",
    "dark": "#2a3f32"
  },
  "--dsw-alias-button-contrast-fill": {
    "light": "#1b2620",
    "dark": "#ece5d8"
  },
  "--dsw-alias-button-elevated-fill": {
    "light": "#fffdf8",
    "dark": "#221e18"
  },
  "--dsw-alias-button-floating-fill": {
    "light": "#fffdf8",
    "dark": "#1f1b16"
  },
  "--dsw-alias-button-floating-hover": {
    "light": "#f2ede3",
    "dark": "#2b251d"
  },
  "--dsw-alias-button-ghost-active-fill": {
    "light": "rgba(46, 125, 79, .14)",
    "dark": "rgba(94, 196, 136, .18)"
  },
  "--dsw-alias-button-ghost-active-hover": {
    "light": "rgba(46, 125, 79, .22)",
    "dark": "rgba(94, 196, 136, .26)"
  },
  "--dsw-alias-button-ghost-active-border": {
    "light": "rgba(46, 125, 79, .32)",
    "dark": "rgba(94, 196, 136, .38)"
  },
  "--dsw-alias-button-info-fill": {
    "light": "rgba(46, 125, 79, .12)",
    "dark": "rgba(94, 196, 136, .14)"
  },
  "--dsw-alias-button-info-hover": {
    "light": "rgba(46, 125, 79, .20)",
    "dark": "rgba(94, 196, 136, .22)"
  },
  "--dsw-alias-button-tool-bar-fill": {
    "light": "rgba(46, 125, 79, .07)",
    "dark": "rgba(94, 196, 136, .10)"
  },
  "--dsw-alias-button-tool-bar-fill-invisible": {
    "light": "transparent",
    "dark": "transparent"
  },
  "--dsw-alias-button-tool-bar-hover": {
    "light": "rgba(46, 125, 79, .16)",
    "dark": "rgba(94, 196, 136, .20)"
  },
  "--dsw-alias-interactive-bg-active": {
    "light": "rgba(46, 125, 79, .13)",
    "dark": "rgba(94, 196, 136, .18)"
  },
  "--dsw-alias-interactive-bg-hover": {
    "light": "rgba(46, 125, 79, .07)",
    "dark": "rgba(94, 196, 136, .10)"
  },
  "--dsw-alias-interactive-bg-hover-accent": {
    "light": "rgba(46, 125, 79, .17)",
    "dark": "rgba(94, 196, 136, .22)"
  },
  "--dsw-alias-interactive-bg-hover-solid": {
    "light": "#e7f0e9",
    "dark": "#262219"
  },
  "--dsw-alias-interactive-bg-hover-danger": {
    "light": "rgba(193, 39, 45, .12)",
    "dark": "rgba(214, 69, 58, .20)"
  },
  "--dsw-alias-label-primary": {
    "light": "#1b2620",
    "dark": "#ebe5d8"
  },
  "--dsw-alias-label-secondary": {
    "light": "#4d5c52",
    "dark": "#bdb3a2"
  },
  "--dsw-alias-label-tertiary": {
    "light": "#7d8b81",
    "dark": "#8b8070"
  },
  "--dsw-alias-label-caption": {
    "light": "#94a196",
    "dark": "#746a56"
  },
  "--dsw-alias-label-dimmed": {
    "light": "#aab4ac",
    "dark": "#5f5747"
  },
  "--dsw-alias-label-primary-dimmed": {
    "light": "#6b7a70",
    "dark": "#a69c8b"
  },
  "--dsw-alias-label-primary-bluish": {
    "light": "#1b2620",
    "dark": "#ebe5d8"
  },
  "--dsw-alias-label-primary-foreground": {
    "light": "#ffffff",
    "dark": "#0d1a13"
  },
  "--dsw-alias-label-primary-inverted": {
    "light": "#ffffff",
    "dark": "#0d1a13"
  },
  "--dsw-alias-link": {
    "light": "#23603e",
    "dark": "#7fd4a3"
  },
  "--dsw-alias-markdown-code-block": {
    "light": "#f1ece1",
    "dark": "#221e18"
  },
  "--dsw-alias-markdown-code-block-banner": {
    "light": "#e9e3d6",
    "dark": "#2b251d"
  },
  "--dsw-alias-markdown-inline-code": {
    "light": "rgba(46, 125, 79, .10)",
    "dark": "rgba(94, 196, 136, .14)"
  },
  "--dsw-alias-markdown-tag": {
    "light": "rgba(46, 125, 79, .13)",
    "dark": "rgba(94, 196, 136, .18)"
  },
  "--dsw-alias-markdown-citation": {
    "light": "rgba(46, 125, 79, .10)",
    "dark": "rgba(94, 196, 136, .14)"
  },
  "--dsw-alias-markdown-placeholder": {
    "light": "rgba(46, 125, 79, .12)",
    "dark": "rgba(94, 196, 136, .16)"
  },
  "--dsw-alias-markdown-code-segment-selected": {
    "light": "rgba(46, 125, 79, .18)",
    "dark": "rgba(94, 196, 136, .24)"
  },
  "--dsw-alias-markdown-code-segment-unselected": {
    "light": "rgba(46, 125, 79, .06)",
    "dark": "rgba(94, 196, 136, .08)"
  },
  "--dsw-alias-scrollbar-bg-l1": {
    "light": "#dbe6dd",
    "dark": "#2f4a3a"
  },
  "--dsw-alias-scrollbar-hover-l1": {
    "light": "#2e7d4f",
    "dark": "#5ec488"
  },
  "--dsw-alias-scrollbar-bg-l2": {
    "light": "#dbe6dd",
    "dark": "#2f4a3a"
  },
  "--dsw-alias-scrollbar-hover-l2": {
    "light": "#2e7d4f",
    "dark": "#5ec488"
  },
  "--dsw-alias-state-success-primary": {
    "light": "#2ea054",
    "dark": "#53c976"
  },
  "--dsw-alias-state-success-secondary": {
    "light": "#53c976",
    "dark": "#2ea054"
  },
  "--dsw-alias-state-success-tertiary": {
    "light": "#e6f7ea",
    "dark": "#1e4228"
  },
  "--dsw-alias-state-error-primary": {
    "light": "#c1272d",
    "dark": "#e26054"
  },
  "--dsw-alias-state-error-secondary": {
    "light": "#e26054",
    "dark": "#d6453a"
  },
  "--dsw-alias-state-warn-primary": {
    "light": "#e8933a",
    "dark": "#f0a33e"
  },
  "--dsw-alias-state-warn-secondary": {
    "light": "#f0a33e",
    "dark": "#e8933a"
  },
  "--dsw-alias-state-warn-tertiary": {
    "light": "#fdf0da",
    "dark": "#422810"
  },
  "--dsw-alias-state-warn-label": {
    "light": "#8a5416",
    "dark": "#f5c98a"
  },
  "--dsw-alias-state-business-primary": {
    "light": "#2e8a9d",
    "dark": "#4fa8b7"
  },
  "--dsw-alias-state-business-tertiary": {
    "light": "#ecf7f8",
    "dark": "#0f2c34"
  },
  "--dsw-alias-toast-bg": {
    "light": "#1b2620",
    "dark": "#2b251d"
  },
  "--dsw-alias-tooltip-bg": {
    "light": "#1b2620",
    "dark": "#2b251d"
  },
  "--dsw-specific-sidebar-fill": {
    "light": "rgba(247, 244, 236, .82)",
    "dark": "rgba(16, 14, 11, .74)"
  },
  "--dsw-specific-sidebar-nav-item-active": {
    "light": "rgba(46, 125, 79, .16)",
    "dark": "rgba(94, 196, 136, .18)"
  },
  "--dsw-specific-sidebar-nav-item-active-accent": {
    "light": "#2e7d4f",
    "dark": "#5ec488"
  },
  "--dsw-specific-sidebar-nav-item-hover": {
    "light": "rgba(46, 125, 79, .09)",
    "dark": "rgba(94, 196, 136, .10)"
  },
  "--dsw-specific-input-major": {
    "light": "#fffdf8",
    "dark": "#1a1713"
  },
  "--dsw-specific-login-input": {
    "light": "#fffdf8",
    "dark": "#1a1713"
  },
  "--dsw-specific-menu": {
    "light": "#fffdf8",
    "dark": "#221e18"
  },
  "--dsw-specific-selector": {
    "light": "rgba(46, 125, 79, .10)",
    "dark": "rgba(94, 196, 136, .12)"
  },
  "--dsw-specific-tip": {
    "light": "rgba(27, 38, 32, .06)",
    "dark": "rgba(255, 253, 248, .05)"
  },
  "--dsw-specific-bubble": {
    "light": "#2e7d4f",
    "dark": "#2f6b48"
  },
  "--dsw-specific-bubble-highlight": {
    "light": "#1d5135",
    "dark": "#3b9a6b"
  },
  "--dsw-shadow-lv1": {
    "light": "0 1px 2px rgba(24, 42, 32, .07), 0 1px 1px rgba(24, 42, 32, .04)",
    "dark": "0 1px 2px rgba(0, 0, 0, .40)"
  },
  "--dsw-shadow-lv2": {
    "light": "0 4px 14px rgba(24, 42, 32, .10), 0 1px 3px rgba(24, 42, 32, .06)",
    "dark": "0 4px 16px rgba(0, 0, 0, .46)"
  },
  "--dsw-shadow-lv3": {
    "light": "0 12px 34px rgba(24, 42, 32, .16), 0 2px 8px rgba(24, 42, 32, .08)",
    "dark": "0 14px 40px rgba(0, 0, 0, .58)"
  },
  "--dsw-elevation-panel": {
    "light": "0 12px 34px rgba(24, 42, 32, .16)",
    "dark": "0 14px 40px rgba(0, 0, 0, .58)"
  },
  "--dsw-elevation-prominent": {
    "light": "0 18px 46px rgba(24, 42, 32, .22)",
    "dark": "0 20px 52px rgba(0, 0, 0, .66)"
  },
  "--dsw-elevation-soft": {
    "light": "0 4px 14px rgba(24, 42, 32, .08)",
    "dark": "0 5px 18px rgba(0, 0, 0, .40)"
  },
  "--dsw-elevation-stroke": {
    "light": "rgba(46, 125, 79, .18)",
    "dark": "rgba(94, 196, 136, .20)"
  },
  "--dsw-elevation-stroke-color": {
    "light": "rgba(46, 125, 79, .18)",
    "dark": "rgba(94, 196, 136, .20)"
  },
  "--dsw-linear-gradient-think": {
    "light": "linear-gradient(180deg, #f3efe5 20.19%, rgba(243, 239, 229, 0) 100%)",
    "dark": "linear-gradient(180deg, #17140f 20.19%, rgba(23, 20, 15, 0) 100%)"
  },
  "--dsw-linear-think-select": {
    "light": "linear-gradient(180deg, #ece7db 20.19%, rgba(236, 231, 219, 0) 100%)",
    "dark": "linear-gradient(180deg, #221e18 20.19%, rgba(34, 30, 24, 0) 100%)"
  }
}

    /** 壁纸清单：由宿主 index.js 注册的 /dsh-kimetsu 前缀路由提供。 */
    const MAIN = ["km-main-1.webp","km-main-2.webp","km-main-3.webp","km-main-4.webp","km-main-5.webp"]
    const SIDE = ["km-side-1.webp","km-side-2.webp","km-side-3.webp","km-side-4.webp"]

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
