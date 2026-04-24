# Images Guide

Add your photos to this folder. Here's exactly what the site expects.

---

## Family Profile Photos

These appear in the **Our Family** card grid. The cards crop to a **square (1:1)**, so square photos look best — or crop yours to square before dropping them in.

| Filename       | Who              | Notes                                           |
|----------------|------------------|-------------------------------------------------|
| `luis.jpg`     | Luis Issac (Dad) | Face centered, square crop recommended          |
| `reyna.jpg`    | Reyna Isabel (Mom) | Face centered, square crop recommended        |
| `abel.jpg`     | Abel Jayson (Son) | Square crop, smile encouraged                  |
| `baby-a.jpg`   | Baby A           | Ultrasound photo, nursery shot, or leave blank — the site handles it gracefully |

**Recommended size:** 600×600 px minimum (1200×1200 px ideal for retina screens).

---

## Gallery Photos

These appear in the 3×3 **Gallery** grid. Any photo works — the grid forces a square crop via CSS.

| Filename          | Suggested content            |
|-------------------|------------------------------|
| `gallery-1.jpg`   | Family together              |
| `gallery-2.jpg`   | Luis and Reyna               |
| `gallery-3.jpg`   | Abel playing                 |
| `gallery-4.jpg`   | Family outing                |
| `gallery-5.jpg`   | Candid moment                |
| `gallery-6.jpg`   | Baby announcement / nursery  |
| `gallery-7.jpg`   | Holiday or birthday          |
| `gallery-8.jpg`   | Luis on his motorcycle       |
| `gallery-9.jpg`   | Any favorite shot            |

**Recommended size:** 800×800 px minimum.

---

## Tips

- JPG works great for photos. PNG and WebP are also fine — just update the `src` in `index.html` to match the extension.
- Keep each file under **500 KB** for fast page loads. Use [Squoosh](https://squoosh.app) (free, browser-based) to compress without visible quality loss.
- If you skip a photo, the site shows a warm terracotta placeholder automatically — nothing will look broken.
