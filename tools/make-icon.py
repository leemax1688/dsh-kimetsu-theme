"""生成市场卡片图标（180x180 PNG，方形）。

为什么不用 SVG：awesome-dsh-plugin 的收录规则明确只接受 GitHub 托管的**位图**图标
（svg 与第三方图床会被拒），所以这里直接用 PIL 画一张 180px 的位图。

图案：鬼杀队羽织的绿黑方格 + 日轮绯红圆 + 细金环。
"""
from __future__ import annotations

import pathlib

from PIL import Image, ImageDraw

OUT = pathlib.Path(__file__).resolve().parent.parent / "assets" / "icon-180.png"
SIZE = 180
GREEN = (46, 125, 79)
INK = (16, 14, 11)
CRIMSON = (193, 39, 45)
GOLD = (232, 147, 58)
PAPER = (247, 244, 236)


def main() -> None:
    im = Image.new("RGB", (SIZE, SIZE), INK)
    d = ImageDraw.Draw(im)

    # 鬼杀队羽织：8x8 绿黑方格
    cells = 8
    step = SIZE // cells
    for row in range(cells):
        for col in range(cells):
            if (row + col) % 2 == 0:
                d.rectangle(
                    [col * step, row * step, (col + 1) * step - 1, (row + 1) * step - 1],
                    fill=GREEN,
                )

    # 中央和纸圆底 + 日轮绯红
    cx = cy = SIZE // 2
    r = 56
    d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=PAPER)
    d.ellipse([cx - r + 7, cy - r + 7, cx + r - 7, cy + r - 7], fill=CRIMSON)
    d.ellipse([cx - 26, cy - 26, cx + 26, cy + 26], fill=GOLD)

    # 细金环
    d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=GOLD, width=3)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    im.save(OUT, "PNG", optimize=True)
    print(f"-> {OUT}  {OUT.stat().st_size / 1024:.1f} KB")


if __name__ == "__main__":
    main()
