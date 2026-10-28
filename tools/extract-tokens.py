"""从旧主题 CSS 里抽出设计令牌（--dsw-*），供插件运行时注册。

旧方案是往 dist 里塞一份 CSS，靠 `html body { --x: v !important }` 硬压；
新方案走 DSH 的主题服务：`ctx.theme.overrideTokens(source, { token: {light, dark} })`。
所以这里只提取**令牌**，不搬类名哈希规则（那些会随 DSH 升级整体失效）。

输出：src/tokens.json
    {
      "light": { "--dsw-alias-bg-base": "#f7f4ec", ... },
      "dark":  { "--dsw-alias-bg-base": "#100e0b", ... },
      "stats": { "light": 210, "dark": 205, "paired": 200, "lightOnly": [...], "darkOnly": [...] }
    }
"""
from __future__ import annotations

import json
import pathlib
import re

CSS = pathlib.Path(r"C:\DeepSeek Harness\kimetsu-theme-pack\kimetsu-theme.css")
OUT = pathlib.Path(__file__).resolve().parent.parent / "src" / "tokens.json"

LIGHT_SELECTORS = {":root", "html body"}
DARK_SELECTORS = {"html body[data-ds-dark-theme]"}

DECL = re.compile(r"(--dsw-[A-Za-z0-9-]+)\s*:\s*([^;{}]+);")


def split_blocks(css: str):
    """极简块切分：只处理单层花括号（本文件没有嵌套 @media 里的令牌块）。"""
    i = 0
    n = len(css)
    while i < n:
        brace = css.find("{", i)
        if brace < 0:
            return
        selector = css[i:brace].strip()
        # 去掉上一块结尾的 } 与前导注释
        selector = re.sub(r"^[\s}]+", "", selector)
        selector = re.sub(r"/\*.*?\*/", "", selector, flags=re.S).strip()
        depth = 1
        j = brace + 1
        while j < n and depth:
            if css[j] == "{":
                depth += 1
            elif css[j] == "}":
                depth -= 1
            j += 1
        yield selector, css[brace + 1 : j - 1]
        i = j


def collect(css: str, selectors: set[str]) -> dict[str, str]:
    out: dict[str, str] = {}
    for selector, body in split_blocks(css):
        if selector not in selectors:
            continue
        for name, value in DECL.findall(body):
            out[name] = re.sub(r"\s*!important\s*$", "", value.strip())
    return out


def main() -> None:
    css = CSS.read_text(encoding="utf-8")
    light = collect(css, LIGHT_SELECTORS)
    dark = collect(css, DARK_SELECTORS)

    light_only = sorted(set(light) - set(dark))
    dark_only = sorted(set(dark) - set(light))
    paired = sorted(set(light) & set(dark))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps(
            {
                "light": light,
                "dark": dark,
                "stats": {
                    "light": len(light),
                    "dark": len(dark),
                    "paired": len(paired),
                    "lightOnly": light_only,
                    "darkOnly": dark_only,
                },
            },
            ensure_ascii=False,
            indent=1,
        ),
        encoding="utf-8",
    )

    print(f"light={len(light)}  dark={len(dark)}  paired={len(paired)}")
    print(f"lightOnly={len(light_only)}  darkOnly={len(dark_only)}")
    if light_only[:8]:
        print("  light-only 例:", ", ".join(light_only[:8]))
    if dark_only[:8]:
        print("  dark-only 例:", ", ".join(dark_only[:8]))
    print(f"-> {OUT}")


if __name__ == "__main__":
    main()
