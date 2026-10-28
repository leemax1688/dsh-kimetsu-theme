"""从最高分辨率原图重建主题壁纸（高清版）。

与旧版 tools/prepare-wallpapers.py 的区别：
  1. 输出宽度 2560 -> 3200（主区）/ 900 -> 1440（侧栏），DPI 感知下不再发虚；
  2. 编码 JPEG q84 -> WebP q90 method 6，同体积下细节明显更多；
  3. 降饱和 0.62 -> 0.72、对比度 0.94 -> 1.00，避免"糊成一片"的灰雾感；
  4. 增加 UnsharpMask 轻微锐化，抵消重采样带来的软边。

用法：
    python tools/build-assets.py            # 生成到 assets/
    python tools/build-assets.py --preview  # 额外输出 1600px 预览图（体积小，便于肉眼比对）
"""
from __future__ import annotations

import argparse
import pathlib

from PIL import Image, ImageEnhance, ImageFilter

# 原始候选图（1-8 MB 的高分原图）与输出目录
SRC = pathlib.Path(r"C:\DeepSeek Harness\kimetsu-theme-pack\candidates")
OUT = pathlib.Path(__file__).resolve().parent.parent / "assets"

MAIN_MAX_W = 3200          # 主区：21:9，2560 宽在 2x/4K 屏上会被放大
SIDE_MAX_W = 1440          # 侧栏：9:20
MAIN_RATIO = 21 / 9
SIDE_RATIO = 9 / 20

TINT_RGB = (46, 125, 79)   # 鬼杀队绿

# (候选 id, 输出名, 水平锚点) —— 与旧脚本保持同一套选图与构图
MAIN = [
    ("ox7r25", "km-main-1", 0.72),   # 蓝水波 + 火之神神乐
    ("q6g7w7", "km-main-2", 0.70),   # 冰晶侧面，深蓝
    ("8or3o1", "km-main-3", 0.35),   # 挥刀光轨
    ("z8wdyw", "km-main-4", 0.62),   # 水之呼吸圆环
    ("5wpyq9", "km-main-5", 0.60),   # 背祢豆子，青绿
]
SIDE = [
    ("z837vj", "km-side-1", 0.50),   # 藤花 + 蝴蝶
    ("zm9yxj", "km-side-2", 0.50),   # 极淡背影（2250x4000，侧栏最高分源）
    ("x8xemo", "km-side-3", 0.50),   # 站立白蝶（1834x3262）
    ("vqv6ol", "km-side-4", 0.50),   # 暗调蓝紫
]


def crop_to_ratio(im: Image.Image, ratio: float, ax: float, ay: float) -> Image.Image:
    w, h = im.size
    if w / h > ratio:
        new_w = int(h * ratio)
        x0 = int((w - new_w) * ax)
        box = (x0, 0, x0 + new_w, h)
    else:
        new_h = int(w / ratio)
        y0 = int((h - new_h) * ay)
        box = (0, y0, w, y0 + new_h)
    return im.crop(box)


def apply_tone(im: Image.Image, sat: float, tint: float, bright: float, contrast: float) -> Image.Image:
    im = ImageEnhance.Color(im).enhance(sat)
    im = ImageEnhance.Contrast(im).enhance(contrast)
    im = ImageEnhance.Brightness(im).enhance(bright)
    if tint > 0:
        im = Image.blend(im, Image.new("RGB", im.size, TINT_RGB), tint)
    # 重采样后的软边补偿：轻量锐化，不引入白边
    return im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))


def save(im: Image.Image, stem: str, max_w: int, preview: bool) -> None:
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    im = im.convert("RGB")
    out = OUT / f"{stem}.webp"
    im.save(out, "WEBP", quality=90, method=6)
    print(f"  {out.name:<18} {im.size[0]}x{im.size[1]:<6} {out.stat().st_size / 1024:>6.0f} KB")
    if preview:
        pv = OUT / "preview"
        pv.mkdir(exist_ok=True)
        small = im.resize((min(1600, im.width), round(im.height * min(1600, im.width) / im.width)), Image.LANCZOS)
        small.save(pv / f"{stem}.webp", "WEBP", quality=82, method=6)


def find(folder: str, stem: str) -> pathlib.Path:
    for p in (SRC / folder).iterdir():
        if p.stem == stem:
            return p
    raise FileNotFoundError(stem)


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--sat", type=float, default=0.72)
    ap.add_argument("--tint", type=float, default=0.06)
    ap.add_argument("--preview", action="store_true")
    a = ap.parse_args()

    OUT.mkdir(parents=True, exist_ok=True)

    print(f"=== 主区壁纸 21:9 @{MAIN_MAX_W}px (sat={a.sat} tint={a.tint}) ===")
    for stem, name, ax in MAIN:
        im = Image.open(find("tanjiro", stem))
        im = crop_to_ratio(im, MAIN_RATIO, ax, 0.44)
        im = apply_tone(im, a.sat, a.tint, 0.98, 1.0)
        save(im, name, MAIN_MAX_W, a.preview)

    print(f"\n=== 侧栏壁纸 9:20 @{SIDE_MAX_W}px ===")
    for stem, name, ax in SIDE:
        im = Image.open(find("shinobu", stem))
        im = crop_to_ratio(im, SIDE_RATIO, ax, 0.46)
        im = apply_tone(im, a.sat, a.tint, 1.0, 1.0)
        save(im, name, SIDE_MAX_W, a.preview)

    files = sorted(OUT.glob("km-*.webp"))
    total = sum(p.stat().st_size for p in files) / 1024 / 1024
    print(f"\n合计 {len(files)} 张，{total:.2f} MB")


if __name__ == "__main__":
    main()
