from __future__ import annotations

import math
from pathlib import Path

from PIL import Image


def _median(values: list[int]) -> int:
    values = sorted(values)
    return values[len(values) // 2]


def _estimate_bg_rgba(im: Image.Image) -> tuple[int, int, int, int]:
    px = im.load()
    w, h = im.size
    samples: list[tuple[int, int, int, int]] = []

    # sample a few pixels from each corner (robust to minor compression noise)
    step = 5
    span = 40
    for y in range(0, min(span, h), step):
        for x in range(0, min(span, w), step):
            samples.append(px[x, y])
        for x in range(max(0, w - span), w, step):
            samples.append(px[x, y])
    for y in range(max(0, h - span), h, step):
        for x in range(0, min(span, w), step):
            samples.append(px[x, y])
        for x in range(max(0, w - span), w, step):
            samples.append(px[x, y])

    rs = [p[0] for p in samples]
    gs = [p[1] for p in samples]
    bs = [p[2] for p in samples]
    a = _median([p[3] for p in samples])
    return _median(rs), _median(gs), _median(bs), a


def _rgb_dist(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    return math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2)


def remove_solid_bg(
    src: Path,
    dst: Path,
    *,
    transparent_dist: float = 22.0,
    opaque_dist: float = 55.0,
    halo_cleanup_dist: float = 30.0,
) -> tuple[int, int, int]:
    im = Image.open(src).convert("RGBA")
    px = im.load()
    w, h = im.size

    bg_r, bg_g, bg_b, _ = _estimate_bg_rgba(im)
    bg_rgb = (bg_r, bg_g, bg_b)

    # Feather alpha between two distance thresholds.
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            d = _rgb_dist((r, g, b), bg_rgb)
            if d <= transparent_dist:
                px[x, y] = (r, g, b, 0)
            elif d >= opaque_dist:
                continue
            else:
                t = (d - transparent_dist) / (opaque_dist - transparent_dist)
                px[x, y] = (r, g, b, int(a * t))

    # Reduce subtle blue halo artifacts near edges.
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a == 0:
                continue
            if _rgb_dist((r, g, b), bg_rgb) < halo_cleanup_dist and a < 200:
                px[x, y] = (r, g, b, 0)

    dst.parent.mkdir(parents=True, exist_ok=True)
    im.save(dst)
    return bg_rgb


def main() -> None:
    repo_root = Path(__file__).resolve().parents[1]
    src = repo_root / "asset" / "PrimeFix_London-0057dfec-8716-48ee-828a-017b497779b6.png"
    dst = repo_root / "asset" / "primefix-london-logo-transparent.png"

    if not src.exists():
        # fallback: Cursor stores pasted images outside the repo
        src = Path(
            r"C:\Users\HP\.cursor\projects\c-Users-HP-3D-Objects-primefix\assets\c__Users_HP_AppData_Roaming_Cursor_User_workspaceStorage_ada496206aa06be965fcd2871b11d404_images_PrimeFix_London-0057dfec-8716-48ee-828a-017b497779b6.png"
        )

    bg = remove_solid_bg(src, dst)
    print(f"Estimated BG RGB: {bg}")
    print(f"Saved: {dst}")


if __name__ == "__main__":
    main()

