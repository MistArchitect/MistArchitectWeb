# Mist Architects Website Design Guidelines
*Revised Version (April 2026) - The "Void & Structure" Blueprint*

The initial "Wired/Brutalist" design language has been officially retired. Moving forward, the website must embody the design aesthetic shared by leading contemporary Asian architectural practices (e.g., Kengo Kuma and Associates, Vector Architects).

The new philosophy prioritizes **Silence, Light, Materiality, and Void (留白)**. The interface must act as an invisible gallery frame, ensuring that the architectural photography remains the absolute protagonist.

---

## 1. Core Principles (核心理念)

1. **Absolute Neutrality (绝对中立)**:
   The UI should never compete with the content. Avoid decorative UI elements, heavy background blocks, thick borders, or aggressive color palettes.
2. **Generous Void (奢侈的留白)**:
   White space is treated as architectural space. Margins and paddings between elements should be dramatically large. Content should feel like it is "floating" in a carefully calculated grid rather than being boxed in.
3. **Typographic Transparency (文字的透明性)**:
   Text exists merely to provide context, like a museum caption. It should be small, highly legible, but never visually overpowering.

---

## 2. Color Palette (色彩管理)

The color palette is strictly desaturated. Accent colors are banned.

- **Background (Canvas)**: `#FFFFFF` (Pure White). Ensure maximum clean contrast.
- **Primary Text (Headers/Body)**: `#111111` or `#222222` (Deep Charcoal, softer than pure black to reduce harsh screen fatigue).
- **Secondary Text (Captions/Meta)**: `#777777` (Muted Grey).
- **Separators/Rules**: `#E5E5E5` (Hairline subtle grey).

---

## 3. Typography (排版格式)

Typography must be clinical, geometric, and perfectly aligned, mirroring architectural blueprints.

### Font Stack
- **English/Numbers**: Inter, Helvetica Neue, or a clean geometric Sans-serif.
- **Chinese**: Noto Sans SC, PingFang SC (System default sans-serifs). *Avoid Serif for UI text unless it's a massive decorative headline, but prefer Sans for clean modernity.*

### Hierarchy
- **Brand / Logo**: `font-size: 34px` to `48px`, `font-weight: 400`, `letter-spacing: 0`.
- **H1 (Page Titles)**: `font-size: 24px`, `font-weight: 500`.
- **Kickers / Utility (Navigation)**: `font-size: 13px` or `14px`, `font-weight: 400`, `text-transform: uppercase`, `letter-spacing: 0`.
- **Body Text**: `font-size: 14px`, `line-height: 1.8` (Very breathable). Chinese characters need extra line height to look elegant.
- **Captions (Credits/Dates)**: `font-size: 12px`, `color: #777777`.

---

## 4. Components & Layouts (组件与布局结构)

### Header / Navigation
- **Location**: Static top or fixed minimal bar (already implemented with `mix-blend-mode`).
- **Structure**: Brand mark on the left, horizontal inline navigation items on the right.
- **Interaction**: No pill-shaped buttons. Navigation consists solely of plain text. Hover states should simply drop the `opacity` to `0.5` or `0.6` smoothly. **No underline on hover.**

### Buttons & Links
- "Buttons" do not exist as traditional colored blocks. All interactive elements are just text links.
- *Exceptions*: If a bounding box is strictly required (e.g., a "Submit" form button), it must be a 1px solid border with transparent background and black text (`border: 1px solid #111; background: transparent;`).

### Imagery & Media
- **Hero Image (Index)**: Absolute full-screen (`100svh`), edge-to-edge. Let the image swallow the screen.
- **In-page Images (Projects/Journal)**:
  - Do *not* round the corners (`border-radius: 0`). Images must have sharp, crisp edges.
  - Follow strict proportions (16:9, 3:2, or 1:1).
  - Add generous `margin-bottom` beneath images before any caption text.

### Dividers
- Avoid visual dividers if possible; separate content with white space instead.
- If necessary, use a `1px` high `#Eaeaea` solid line.

---

## 5. Animation & Interaction (动效与交互)

- Keep animations minimal and deeply sophisticated. No bouncy effects, no aggressive sliding.
- **Fade**: Using `opacity` transitions exclusively for images and hovering, duration around `300ms` for hover, `1.2s` for large image transitions.
- **Scrolling**: Content should reveal simply by appearing within the viewport.

---

## 6. CSS Reference Implementation

```css
:root {
  --paper: #ffffff;
  --ink: #111111;
  --meta: #777777;
  --border: #e5e5e5;

  --sans: "Inter", "PingFang SC", "Noto Sans SC", -apple-system, sans-serif;
}

body {
  background-color: var(--paper);
  color: var(--ink);
  font-family: var(--sans);
  line-height: 1.8;
  -webkit-font-smoothing: antialiased;
}

/* Links */
a {
  text-decoration: none;
  color: inherit;
  transition: opacity 0.3s ease;
}

a:hover {
  opacity: 0.5;
}

/* Headlines */
h1, h2, h3 {
  font-weight: 400;
  margin-bottom: 2rem;
}
```
