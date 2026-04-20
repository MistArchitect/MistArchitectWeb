# Image Pipeline

End-to-end spec for how MIST Architects ships imagery: where files
live, how they are processed, what the page actually requests, and the
guard rails that keep file weight predictable.

Last reviewed: 2026-04-18 — initial OSS IMG cutover.

---

## 1. Where files live

All site imagery is stored in the Alibaba Cloud OSS bucket
`mist-architects-media` (region `cn-shenzhen`, public-read). The
public origin is:

```
https://mist-architects-media.oss-cn-shenzhen.aliyuncs.com
```

Override in any environment by setting `NEXT_PUBLIC_MEDIA_BASE`. A
custom domain (`media.mistarchitects.com`) is reserved for the
production cutover — see `AGENT_HANDOFF.md` → "Pre-production OSS
hardening checklist" for the launch tasks (CDN + HTTPS + Referer
allowlist + cache headers).

Bucket layout (folder names are the contract — code keys off them):

```
home/horizontal/        → 16:9 hero crops (landscape devices)
home/vertical/          → 9:16 / portrait hero crops (narrow screens)
home/feature/           → square-ish featured tiles for the homepage grid
about/horizontal/       → about-page hero carousel sources
about/founders/         → founder portrait
LOGO/                   → wordmark (PNG, served raw)
projects/<slug>/        → reserved for project detail imagery (not yet on OSS)
```

Filename convention: `<seq> <year>·<location>·<title>.<ext>`. Code
strips the leading sequence number when displaying captions —
sequence is for human ordering inside OSS Browser only. Chinese
characters, spaces, and middle dots in filenames are URL-encoded per
segment by `mediaUrl()`; do not pre-encode paths in source code.

Source uploads are the original masters — no client-side resizing or
re-encoding. OSS Image Processing handles all derivatives.

---

## 2. The processing layer

OSS exposes the IMG service via a query parameter on every object URL:

```
?x-oss-process=image/resize,w_<W>,m_lfit/quality,q_<Q>/format,<F>
```

| Op | What it does |
| --- | --- |
| `resize,w_W,m_lfit` | Limit-fit to width W. Never upscales — if source < W, original is returned. Aspect ratio preserved. |
| `quality,q_Q` | Encoder quality 0–100. Q is per-format (see matrix below). |
| `format,F` | Re-encode to `webp` / `avif` / `jpg`. Omit for source format. |

The browser receives a real webp/avif/jpg byte stream — no client JS,
no Next.js image optimizer involvement.

### OSS IMG limits to know

- **AVIF**: max 4096px wide AND max 9,437,184 total pixels. A 3840×
  2560 (3:2) source trips the pixel cap. The pipeline caps AVIF rungs
  at **2560w** (`AVIF_MAX_WIDTH` in `src/lib/media.ts`); larger
  variants are served as WebP.
- **Source size**: ≤ 20 MB by default. Originals over this need a
  pre-upload re-export.
- **HEAD requests** on processed URLs may return the original metadata
  — always test with `GET` when validating.

---

## 3. Quality tiers

Compression presets are decoupled from size. Component code picks a
**layout** (which decides widths + sizes), which references a
**quality tier**.

| Tier | WebP q | AVIF q | JPG q | Use |
| --- | --- | --- | --- | --- |
| `high` | 92 | 78 | 95 | Hero photography. Preserves skies, glass, soft shadows. 4K WebP lands ~1.45–1.82 MB (4:3) / ~1.45 MB (16:9 crop). |
| `std` | 88 | 72 | 90 | Featured tiles, gallery imagery. |
| `low` | 82 | 62 | 85 | Thumbnails, decorative inline. |
| `raw` | — | — | — | Bypass IMG entirely. Logos, vectors, tiny PNGs. |

> Tuned 2026-04-18 round 3 — round 2 (WebP 90 / AVIF 72) still read soft on full-screen 4K per client review. Client target: ≤2 MB at 4K, visibly sharp on retina + 4K. Pushed WebP to 92, AVIF to 78. See §5 for measured bytes.

Source: `COMPRESSION` table in `src/lib/media.ts`. Tune values there.

---

## 4. Layout presets

Layouts bundle `widths × quality × sizes`. Component code only picks
a layout name; it never hand-rolls widths.

| Layout | Widths (px) | Quality | Crop | `sizes` |
| --- | --- | --- | --- | --- |
| `hero-landscape` | 1280, 1920, 2560, 3840 | high | — | `100vw` |
| `hero-wide` | 1280, 1920, 2560, 3840 | high | 16:9 (m_fill) | `100vw` |
| `hero-portrait` | 720, 1080, 1440, 2160 | high | — | `100vw` |
| `about-hero` | 1280, 1920, 2560, 3840 | high | — | `100vw` |
| `feature` | 640, 960, 1280, 1920 | std | — | `(min-width: 1100px) 33vw, (min-width: 720px) 50vw, 100vw` |
| `portrait` | 720, 1080, 1440, 2160 | high | — | `(min-width: 1180px) 38vw, (min-width: 760px) 44vw, 100vw` |
| `thumb` | 400, 640, 960 | std | — | `(min-width: 720px) 200px, 50vw` |

Width ladder is roughly powers of 1.5 — enough granularity for the
browser's srcset picker (handles DPR + viewport) without exploding
the count of cached derivatives.

### Hero aspect bands

The homepage hero picks one of three layouts at runtime based on the
viewport aspect ratio, so the source that's actually served already
matches the screen shape — `object-fit: cover` then fills the screen
with at most a sliver of edge trim:

| Band | Media query | Layout | Source master |
| --- | --- | --- | --- |
| portrait | `(max-aspect-ratio: 3/4)` | `hero-portrait` | 9:16 vertical (`home/vertical/`) |
| standard | between 3:4 and 7:5 (iPad-ish) | `hero-landscape` | 4:3 horizontal (`home/horizontal/`), served as-is |
| wide | `(min-aspect-ratio: 7/5)` | `hero-landscape` or `hero-wide` (see below) | Photographer-framed 16:9 when provided; otherwise 4:3 server-cropped to 16:9 via `m_fill` |

The 7:5 (1.40) threshold sits just below 16:10 (1.60) and 16:9 (1.78),
so every mainstream desktop + widescreen laptop lands in the wide
band while iPad landscape (1.33) stays in standard.

### Wide-band master selection

`HeroSlide` has an optional `horizontalWide` field. When set, the wide
band serves that 16:9 file directly with the `hero-landscape` layout
(resize-only, no crop) so the photographer's framing is preserved
byte-for-byte. When absent, the wide band falls back to the 4:3
`horizontal` master plus the `hero-wide` layout, which server-crops
to 16:9 via `m_fill` at request time.

File-naming convention in `home/horizontal/` for explicit aspect
variants: `<seq>_<aspect>_<caption>.jpg` — e.g.
`11_16:9_深圳 · 海边栈道.jpg`, `12_4:3 深圳 ·万致天地·自然博物园.jpg`.
Colons are URL-encoded to `%3A` per RFC 3986 by `encodePath()` — no
action required in source code. Chinese characters, spaces, and
middle dots are encoded the same way.

### Crop spec (`m_fill`)

Layouts can declare a `crop: { aspectRatio }` to re-frame the source
into a different output shape. `mediaUrl()` then emits
`resize,w_W,h_H,m_fill` (where `H = round(W / aspectRatio)`) instead
of the default `m_lfit`. OSS scales the source to cover `W×H` and
center-crops the long edge.

Use `m_fill` only when the layout needs a fixed output aspect
different from the source. Don't use it to "nudge" a near-match —
CSS `object-fit: cover` handles that with no extra crop cost.

---

## 5. Output bytes — measured 2026-04-18 (round 3)

Source: `home/horizontal/01 …青年实验剧场.jpg` (11 MB master, 4:3).

| Variant | Bytes |
| --- | --- |
| WebP 3840 q92 (hero-landscape, 4:3 as-is) | 1.82 MB |
| WebP 3840×2160 q92 m_fill (hero-wide, 16:9 crop) | 1.45 MB |
| WebP 1920×1080 q92 m_fill (hero-wide mid rung) | 496 KB |
| AVIF 2560 q78 (hero-landscape, AVIF cap, 4:3 as-is) | 311 KB |
| AVIF 2560×1440 q78 m_fill (hero-wide, 16:9 crop, AVIF cap) | 256 KB |
| JPG 3840 q95 (hero-landscape fallback, 4:3) | 3.68 MB |

Hero target: ≤2 MB at 4K with no visible softness on retina + 4K.
Met for both hero-landscape (1.82 MB) and hero-wide (1.45 MB) WebP
top rungs. AVIF-capable devices land at ~256–311 KB. The 16:9 crop
is *lighter* than the uncropped 4:3 because cropping discards ~25%
of the pixels before encoding.

**JPG fallback weight.** JPG 3840 q95 runs ~3.7 MB — over the 2 MB
hero target. This only ships to browsers that accept neither AVIF nor
WebP (effectively nonexistent on current Chrome/Safari/Firefox), so
it's a safety net for very old clients rather than a real-world cost.
Keep an eye on it if we ever need to reduce the ladder for hero JPG.

When tuning: re-measure both formats after any quality change. AVIF
quality numbers are not interchangeable with WebP — the `low` AVIF
quality (48) often looks better than WebP 78 due to AV1's residual
coding.

---

## 6. How to use it from a component

```tsx
import { OssPicture } from "@/components/oss-picture";

<OssPicture
  path="home/feature/01 2023·深圳·梦工场·青年实验剧场.jpg"
  layout="feature"
  alt="深圳 · 青年实验剧场"
  priority={index === 0}
/>
```

`<OssPicture>` renders:

```html
<picture>
  <source type="image/avif" srcset="…format,avif" sizes="…">
  <source type="image/webp" srcset="…format,webp" sizes="…">
  <img src="…format,jpg" alt="…" loading="lazy" decoding="async">
</picture>
```

Browser picks the best supported source, then the best width for the
viewport × DPR, all natively. CSS targets the inner `<img>` — existing
selectors like `.story-tile img { aspect-ratio: 4/3 }` still apply.

For non-IMG cases (logos, raw passthrough), `mediaUrl(path)` with no
options returns the unprocessed URL.

---

## 7. Adding a new image

1. Drop the source into the right OSS folder via the OSS Console or
   `aliyun ossutil cp`. Use the existing `<seq> ...` naming pattern
   so the file sorts correctly in the bucket UI.
2. Add the bucket-relative path to `src/content/site.ts` (typed
   under `heroSlides` / `featuredTiles` / `about.*` etc.). Do not
   prefix with a slash; do not URL-encode.
3. Pick a `layout` preset that matches the placement. If none fit,
   add a new preset to `LAYOUTS` in `src/lib/media.ts` rather than
   passing one-off widths.
4. Verify with `curl -s -o /tmp/x -w '%{size_download} %{content_type}\n' '<full processed URL>'`.

---

## 8. Adding a new layout or tier

- Layouts → edit `LAYOUTS` in `src/lib/media.ts`. Add the layout
  name to the `Layout` union. Width ladder should keep AVIF rungs ≤
  `AVIF_MAX_WIDTH` to stay within OSS limits, or accept that AVIF
  will silently fall back to WebP for the larger rungs (both behave
  correctly).
- Quality tiers → edit `COMPRESSION`. Re-measure outputs across all
  three formats afterwards and update the table in §5.

---

## 9. Open production tasks (referenced from launch checklist)

- Bind `media.mistarchitects.com` (CNAME → bucket), enable HTTPS,
  switch `NEXT_PUBLIC_MEDIA_BASE` to it.
- Front the bucket with Aliyun CDN (DCDN), configure cache rules:
  long-cache processed URLs (immutable, fingerprinted by query),
  short-cache base paths.
- Restrict OSS IMG access by Referer to `*.mistarchitects.com` once
  the custom domain is live to prevent hot-linking.
- See `docs/AGENT_HANDOFF.md` for the full ten-item OSS hardening
  list.
