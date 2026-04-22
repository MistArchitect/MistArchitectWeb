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
- **Brand display**: Show only the localized brand name in the header. Chinese pages use `岚·建筑设计`; English pages use `Mist Architect`.
- **Language switch**: Keep a compact `中文 | EN` switch in the upper-right header area and preserve the current route when switching language.
- **Interaction**: No pill-shaped buttons. Navigation consists solely of plain text. Hover states should simply drop the `opacity` to `0.5` or `0.6` smoothly. **No underline on hover.**

### Buttons & Links
- "Buttons" do not exist as traditional colored blocks. All interactive elements are just text links.
- *Exceptions*: If a bounding box is strictly required (e.g., a "Submit" form button), it must be a 1px solid border with transparent background and black text (`border: 1px solid #111; background: transparent;`).

### Imagery & Media
- **Hero Image (Index)**: Absolute full-screen (`100svh`), edge-to-edge. Let the image swallow the screen.
  - The homepage image carousel must provide left/right arrow controls and clickable dot navigation.
  - Manual carousel actions must restart the autoplay timer so a user click never immediately collides with the next automatic transition.
  - The left and right carousel hit areas each cover roughly 30% of the hero image. The visible control is a semi-transparent white vertical line (60px tall, 1.5px wide) resting at rest opacity. On hover or keyboard focus the line animates into a minimal chevron arrow: the top half and bottom half each rotate ±22° around the shared midpoint to form `‹` (left zone) or `›` (right zone). Transition is 300ms ease. No circle, no border-radius, no icon glyph.
  - The active image caption sits above the dot navigation near the lower center of the viewport.
  - On portrait/mobile viewports, horizontal swipe gestures must include a small direction-lock dead zone. Slightly diagonal left/right swipes should remain carousel gestures and should not drift the page vertically; strongly vertical gestures should continue to allow normal page scroll.
  - Portrait/mobile swipe transitions should use a light stacked deck model. Swiping toward the next/right-side image brings that image in from the right and layers it above the current image while the current image stays visually anchored; swiping toward the previous/left-side image moves the current image rightward and reveals the previous image underneath. The gesture can pause mid-drag, then either settle back or complete the image change on release. Autoplay should use the same stacked next-image overlay animation instead of an instant index swap. Avoid hard push animations, bounce, or large lateral movement.
  - After the initial homepage Hero, the recommended-projects page body should enter with a `scroll overlay` / `cover reveal`: keep the Hero sticky for the first scroll screen, then let the white content layer rise from below and cover the image. Do not add divider lines or decorative edges at the transition; the shift from image to white page is the visual cue.
  - Homepage featured project tiles can be temporarily non-interactive during prototype review; when disabled, remove detail links and the full-index entry point.
  - Homepage featured project tile captions use two lines: `year · location` on the first line and project name on the second line. Both use neutral greys, with the project name slightly stronger and the first line smaller.
  - Caption text is content data, not derived from filenames, so future renames or OSS migration do not change public-facing labels.
- **In-page Images (Projects/Journal)**:
  - Do *not* round the corners (`border-radius: 0`). Images must have sharp, crisp edges.
  - Follow strict proportions (16:9, 3:2, or 1:1).
  - Add generous `margin-bottom` beneath images before any caption text.

### About Page

- The About page uses the same `scroll overlay` / `cover reveal` entry rhythm as the homepage: keep the full-screen office-image carousel sticky for the first scroll screen, then let the white office text layer rise over it.
- Add the same minimal downward chevron cue used on the homepage Hero so users understand that the About hero can scroll into the office content.
- The secondary About navigation belongs to the white content layer, not the image layer, so the image remains a quiet photographic introduction rather than a navigational panel.
- Preserve the existing section anchors: intro, founders, media, and contact.

### Project Detail Pages

Project detail pages should use the MUJI HOTEL Shenzhen page system as a reference for calm information architecture, not as a visual clone.

Reference pages reviewed:
- `https://hotel.muji.com/shenzhen/ja/`
- `https://hotel.muji.com/shenzhen/ja/rooms/`
- `https://hotel.muji.com/shenzhen/ja/facilities/`

Adopt the following principles for Mist Architect project detail pages:

1. **Entry Sequence**
   - Start with an immersive full-screen photographic page head using the project image carousel.
   - The carousel should occupy the entire viewport and remain visually present while the first two text groups are read.
   - Text over the image must sit directly on the image with transparent background. Do not place this opening text inside a card, panel, frosted box, or bordered container.
   - The first text group is the project identity: project title, location, year/status if needed, and a restrained divider.
   - A small downward arrow sits between the first and second text groups as the scroll cue.
   - The second text group is a single centered project-introduction paragraph, still over the full-screen image carousel with a darkened image overlay for legibility.
   - After the second transparent text group, the next scroll enters the white-background detail page.
   - Use a quiet parallax or sticky depth effect only if it remains subtle and does not disturb reading.
   - This opening pattern is a `sticky hero` / `scroll overlay` / `scrollytelling cover reveal`: the image remains sticky while later white-background content scrolls over it.

2. **Sectioned Narrative**
   - Structure every project as anchored sections rather than one long undifferentiated article.
   - Recommended anchors: `Overview`, `Site`, `Concept`, `Material`, `Process`, `Drawings`, `Media`, `Information`.
   - Use the Chinese equivalents in the UI and keep English labels available in the content model.
   - Each anchor should correspond to a real content block, not a decorative scroll stop.

3. **Image-First Blocks**
   - Each major section should lead with a large image, gallery, drawing, or video still.
   - Desktop default: image/gallery on one side, text and metadata on the other.
   - Mobile default: media first, text second.
   - Avoid nested cards. The image and text can sit in a shared grid, but should not appear inside a boxed component.

4. **Local Section Navigation**
   - Detail pages may include a thin local anchor navigation similar to the MUJI room type navigation.
   - The active section should be plain text or reduced opacity; inactive sections are text links.
   - Use smooth anchor scrolling and avoid animated indicator bars unless the interaction remains extremely quiet.

5. **Project Metadata**
   - Use definition-list style metadata for precise project facts.
   - Suggested fields: `Location`, `Year`, `Status`, `Area`, `Client`, `Design Team`, `Collaborators`, `Photography`.
   - Keep labels short and values aligned in two columns on desktop; stack them naturally on mobile.
   - Avoid horizontal divider lines in the metadata grid by default. Let white space, column rhythm, and label/value hierarchy separate the information.

6. **Gallery / Slider Behavior**
   - Section galleries should support lazy loading and a simple fade or horizontal slide.
   - Controls should be minimal: small arrows, small dots, or text-based previous/next controls.
   - No autoplay for detail-page galleries unless the user explicitly requests it. Manual control is preferred for architectural reading.
   - Captions should remain small and factual: location, view direction, drawing type, photographer, or material note.
   - Exception: the opening full-screen project image may use an automatic slow crossfade carousel because it functions as atmospheric entry rather than a reading gallery.

7. **Drawings and Technical Media**
   - Plans, sections, elevations, diagrams, and construction photos should be treated as first-class project media.
   - Drawings may use a white or paper background, but avoid decorative frames.
   - Provide captions and optional scale/context notes.

8. **Motion**
   - Use viewport fade-in for block entry, with delays no longer than `120ms` between sibling elements.
   - Image transitions may use `opacity` over `800ms` to `1200ms`.
   - Avoid large lateral movement, bounce, scale-heavy zooms, or scroll-jacking.

9. **Content Model**
   - Project data should be prepared for CMS migration. Do not hard-code page structure only in JSX.
   - Recommended shape:

```ts
type ProjectDetail = {
  slug: string;
  title: LocalizedText;
  subtitle?: LocalizedText;
  intro: LocalizedText;
  heroImage: MediaAsset;
  facts: Array<{ label: LocalizedText; value: LocalizedText }>;
  sections: Array<{
    id: string;
    navLabel: LocalizedText;
    heading: LocalizedText;
    body: LocalizedText;
    media: MediaAsset[];
    facts?: Array<{ label: LocalizedText; value: LocalizedText }>;
  }>;
};
```

10. **What Not To Copy**
   - Do not copy hotel booking buttons, reservation flows, commercial call-to-action hierarchy, or restaurant/facility semantics.
   - Do not copy MUJI branding, typography identity, or proprietary imagery.
   - Translate the reference into an architectural portfolio system: spatial narrative, drawings, photography, credits, and archive-quality documentation.

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
