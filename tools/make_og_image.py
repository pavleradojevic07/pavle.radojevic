#!/usr/bin/env python3
"""Generate images/og-image.png (1200x630), the picture shown when a page is shared on
WhatsApp / LinkedIn / Facebook / X.   Usage (from the repo root):  python tools/make_og_image.py
Needs:  pip install pillow      Fonts are read from tools/fonts/.
To use a photo instead, replace the PNG with any 1200x630 JPG/PNG and keep the same file name."""
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont

HERE = Path(__file__).resolve().parent
OUT = HERE.parent / "images" / "og-image.png"
S = 2                      # draw at 2x, then downsample for smooth edges
W, H = 1200 * S, 630 * S

BG, TEXT, TEXT2 = (10, 10, 15), (232, 232, 240), (160, 160, 184)
ORANGE, BLUE, GREEN, GOLD = (240, 123, 59), (77, 166, 255), (61, 220, 132), (212, 168, 83)


def font(name, size):
    return ImageFont.truetype(str(HERE / "fonts" / name), size * S)


img = Image.new("RGB", (W, H), BG)

# soft colour glows (blurred discs), the site's ambient look
glow = Image.new("RGB", (W, H), (0, 0, 0))
g = ImageDraw.Draw(glow)
g.ellipse([-300 * S, -260 * S, 640 * S, 420 * S], fill=(46, 36, 20))
g.ellipse([760 * S, 300 * S, 1500 * S, 900 * S], fill=(14, 28, 46))
glow = glow.filter(ImageFilter.GaussianBlur(120 * S))
img = ImageChops.add(img, glow)

# faint globe wireframe, partly off-canvas on the right
wire = Image.new("RGBA", (W, H), (0, 0, 0, 0))
w = ImageDraw.Draw(wire)
cx, cy, r = 1010 * S, 330 * S, 330 * S
line = (232, 232, 240, 34)
w.ellipse([cx - r, cy - r, cx + r, cy + r], outline=line, width=2 * S)
for k in (0.28, 0.58, 0.86):                      # meridians
    rx = int(r * k)
    w.ellipse([cx - rx, cy - r, cx + rx, cy + r], outline=line, width=2 * S)
for k in (-0.62, -0.3, 0.0, 0.3, 0.62):           # parallels
    y = cy + int(r * k)
    half = int((r * r - (r * k) ** 2) ** 0.5)
    w.line([cx - half, y, cx + half, y], fill=line, width=2 * S)
img = Image.alpha_composite(img.convert("RGBA"), wire).convert("RGB")

d = ImageDraw.Draw(img)
x0 = 84 * S

d.text((x0, 132 * S), "Pavle Radojević", font=font("PlayfairDisplay-Bold.ttf", 120), fill=TEXT)
d.text((x0, 292 * S), "Basketball player, mathematics student", font=font("Inter-Regular.ttf", 38), fill=TEXT2)
d.text((x0, 346 * S), "and license plate collector.", font=font("Inter-Regular.ttf", 38), fill=TEXT2)

# three short bars: the three sections of the site, in their accent colours
bx = x0
for col, label in ((ORANGE, "Basketball"), (BLUE, "Academic"), (GREEN, "License Plate Atlas")):
    f = font("Inter-SemiBold.ttf", 26)
    tw = d.textlength(label, font=f)
    d.rounded_rectangle([bx, 470 * S, bx + tw, 476 * S], radius=3 * S, fill=col)
    d.text((bx, 490 * S), label, font=f, fill=TEXT)
    bx += tw + 56 * S

d.text((x0, 560 * S), "pavleradojevic07.github.io/pavle.radojevic", font=font("Inter-Regular.ttf", 24), fill=(143, 143, 168))

OUT.parent.mkdir(exist_ok=True)
img.resize((1200, 630), Image.LANCZOS).save(OUT, optimize=True)
print("wrote", OUT)
