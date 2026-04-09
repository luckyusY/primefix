from __future__ import annotations

from pathlib import Path

from PIL import Image


def crop_transparent_png(src: Path, dst: Path, *, pad: int = 10) -> tuple[int, int]:
    im = Image.open(src).convert("RGBA")
    alpha = im.split()[-1]
    bbox = alpha.getbbox()
    if not bbox:
        raise ValueError("No non-transparent pixels found")

    l, t, r, b = bbox
    l = max(0, l - pad)
    t = max(0, t - pad)
    r = min(im.width, r + pad)
    b = min(im.height, b + pad)

    out = im.crop((l, t, r, b))
    dst.parent.mkdir(parents=True, exist_ok=True)
    out.save(dst)
    return out.size


def main() -> None:
    src = Path(r"public\media\primefix-london-logo-transparent.png")
    dst = Path(r"public\media\primefix-london-logo-cropped.png")
    size = crop_transparent_png(src, dst, pad=10)
    print(f"Saved {dst} ({size[0]}x{size[1]})")


if __name__ == "__main__":
    main()

