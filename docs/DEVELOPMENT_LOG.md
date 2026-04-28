# Mist Architect Development Log

This log is written for both human developers and future coding agents. Keep entries
short, dated, and implementation-oriented so the next contributor can understand what
changed, why it changed, how it was checked, and what remains open.

## 2026-04-24 / Homepage Feature Rollback + React Bits Cards

### Goals

- Roll back the homepage featured-project experiment to the calmer baseline presentation.
- Replace the temporary image-stack / comparison switcher with a single stable featured-project layout.
- Introduce React Bits `TiltedCard` for featured-project imagery and React Bits `DotGrid` as the section background.
- Update the dark-mode base background to `#292929`.

### Files Added or Changed

- `src/components/featured-project-field.tsx`: removed the comparison switcher and image-stack mode, restored the single featured-project grid, and rebuilt the media presentation around React Bits style tilted cards with project-detail links.
- `src/components/react-bits/tilted-card.tsx` + `tilted-card.module.css`: local TypeScript/CSS-module port of the `@react-bits/TiltedCard-JS-CSS` registry component so it works cleanly inside the existing Next.js TypeScript setup.
- `src/components/react-bits/dot-grid.tsx` + `dot-grid.module.css`: local TypeScript/CSS-module port of the `@react-bits/DotGrid-JS-CSS` registry component for the featured-project background.
- `src/app/globals.css`: removed the image-stack / switcher styling, added the dot-grid surface and tilted-card layout styles, and changed dark-mode `--paper`, `--solid-bg`, and `--splash-bg` to `#292929`.

### Notes

- The repository is not currently initialized as a full shadcn project (`components.json` is absent), so the React Bits registry items were inspected via `npx shadcn@latest view` and ported locally instead of running a broad `shadcn init`.
- Registry names verified for this change:
  - `@react-bits/TiltedCard-JS-CSS`
  - `@react-bits/DotGrid-JS-CSS`

### Verification

- `npm run typecheck`
- `npm run lint`
- `git diff --check`
- `npm run build`
- Local smoke checks for `/zh` and `/zh/projects/dream-factory-experimental-theater`

## 2026-04-24 / Homepage DotGrid + Transition Refinement

### Goals

- Extend the homepage DotGrid treatment beyond the featured-project block so it covers the full page background and footer.
- Remove the standalone homepage section label above featured projects.
- Change the project-entry route transition from drifting toward the top-left corner to an image expansion that fills the viewport.
- Reduce the Lenis scroll smoothing strength so wheel input responds more directly.

### Files Added or Changed

- `src/components/home-dot-grid-background.tsx`: new fixed homepage background layer that renders the React Bits DotGrid behind the page content and footer.
- `src/app/[locale]/page.tsx`: removed the standalone "Featured Projects / 推荐项目" ribbon and mounted the full-page DotGrid background.
- `src/components/featured-project-field.tsx`: removed the local section-level DotGrid wrapper so featured cards sit directly on the page-level background.
- `src/components/project-transition-link.tsx`: rewired the transition overlay so the clicked image itself expands to fill the viewport instead of moving the whole container from its top-left origin.
- `src/components/smooth-scroll-provider.tsx`: reduced Lenis duration / increased lerp for a lighter smoothing effect.
- `src/app/globals.css`: made homepage content/footer transparent over the fixed DotGrid layer and updated transition overlay positioning.

### Verification

- `npm run typecheck`
- `npm run lint`
- `git diff --check`
- `npm run build`
- Local smoke checks for `/zh` and `/zh/projects/dream-factory-experimental-theater`

### Follow-Up Refinement

- Moved the DotGrid layer into `.home-overlay-content` so the homepage paper background remains visible and the hero imagery no longer bleeds through the featured-project area.
- Gave the footer the same dark paper color plus a matching dot pattern so the lower page still reads as one continuous surface.

### Additional Homepage Pass

- Added a homepage full-screen project-intro section ahead of the featured cards using a local TypeScript/CSS-module port of React Bits `@react-bits/ScrollFloat-JS-CSS`.
- The intro shows `项目 / Projects` as an oversized scroll-reactive word before the featured project cards appear.
- Changed the homepage featured-project layout to four columns on large screens and increased the local section padding / tile spacing so the grid breathes more.

### Project Intro Refinement

- Replaced the oversized ScrollFloat word treatment with a quieter GSAP-driven project-index threshold.
- The new intro uses a sticky full-screen plane, a fine progress rail, and a moving project-title track before the featured grid appears.
- Removed the local ScrollFloat component files after the effect was no longer used.

### Pinned Project Sequence + Local Media Proxy

- Removed the React Bits DotGrid background and deleted its local component files.
- Rebuilt the homepage project intro as a pinned GSAP sequence: scrolling pins the viewport, flashes the large project label, locks a compact index label in the upper-left, then reveals featured project cards one by one.
- Removed the separate featured-tile reveal in `GsapPageMotion` so it does not fight the pinned sequence timeline.
- Added `src/app/api/media/route.ts` and a development-only branch in `mediaUrl()` so local ports not present in the OSS Referer whitelist can still load media through the Next.js dev server.
- Confirmed OSS returns `403` for featured image requests with `http://127.0.0.1:3001/zh` as Referer and `200` for `http://127.0.0.1:3000/zh`, matching the current whitelist documented in the handoff.

### Pinned Sequence Layout Tuning

- Centered the opening `项目 / Projects` flash on the viewport instead of letting the large CJK glyph sit low in the frame.
- Reduced the pinned index layer to only `项目索引 / Project Index`, removing the small label, count, descriptive copy, project-directory list, and progress rail.
- Expanded homepage featured items to eight visual tiles and split the pinned reveal into two overlaid four-card pages: the first four cards reveal, fade out on continued scroll, then the next four cards reveal.
- The additional homepage-only tiles use existing OSS homepage imagery and do not link to missing detail pages.

## 2026-04-23 / Homepage Featured Presentation Switcher

### Goals

- Replace the homepage featured-project grid with a stronger presentation concept while still preserving the previous layout for side-by-side review.
- Turn homepage featured projects into real entry points to the current project-detail routes.
- Add a scroll-led image-stack presentation with background color transitions and synchronized project-title switching.

### Files Added or Changed

- `src/components/featured-project-field.tsx`: rebuilt the homepage featured area as a client-side switcher with two modes:
  - `新版叠放 / Image Stack`: GSAP scroll-pinned stacked project imagery with animated title changes and project-color background transitions
  - `原始网格 / Classic Grid`: the previous grid layout with mouse-reactive parallax
- `src/components/project-transition-link.tsx`: kept the image-led route transition path for entering project details from either homepage mode.
- `src/content/site.ts`: aligned homepage featured items and local project-detail seed records to the same five featured projects, added folder color metadata, and moved project imagery to OSS-backed remote assets.
- `src/app/globals.css`: added the image-stack scene, toggle, responsive fallbacks, and preserved the original grid styling as a review mode.

### Notes

- The homepage now exposes an in-page comparison control so the project owner can switch between the previous and redesigned feature presentation without changing branches or reverting code.
- Project detail slugs are now generated from the featured-project set:
  - `dream-factory-experimental-theater`
  - `wanzhi-natural-history-park`
  - `wujingkui-ruins-garden`
  - `pavilion-of-light`
  - `bambu-lab-first-store`
- This also removes the earlier local-detail-image 404 issue for the currently seeded projects because the detail data now points at OSS media URLs instead of missing `/images/home/*` files.

### Verification

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Local HTTP smoke checks returned `200` for `/zh` and `/zh/projects/dream-factory-experimental-theater`.

## 2026-04-13 / Project Foundation

### Goals

- Start a React-based architecture studio website for Mist Architect.
- Preserve bilingual Chinese/English routing from the beginning.
- Prepare the codebase for future language expansion and CMS-backed content updates.
- Adapt the imported WIRED-inspired `DESIGN.md` into an architecture-focused visual system.
- Include high-quality image and video surfaces in the first development version.

### Commands and Environment Notes

- The workspace initially contained only `DESIGN.md`.
- The local shell did not expose `node`, `npm`, or `npx` on `PATH`.
- Node exists under nvm at `/Users/winnie/.nvm/versions/node/v24.14.1/bin`.
- Use this temporary prefix when needed:

```bash
PATH=/Users/winnie/.nvm/versions/node/v24.14.1/bin:$PATH npm run dev
```

### Files Added

- `package.json`: Next.js, React, TypeScript, ESLint, and `motion` scripts/dependencies.
- `next.config.ts`: remote image allowlist for Unsplash, Pexels, and Pixabay CDN.
- `src/lib/i18n.ts`: shared locale helpers and default locale.
- `src/content/site.ts`: local seed content for projects, journal entries, and homepage copy.
- `src/app/*`: App Router routes for `/`, `/:locale`, `/:locale/projects`, project detail pages, and `/:locale/journal`.
- `src/components/*`: reusable header, hero, project, journal, filter, ribbon, and motion components.
- `src/app/globals.css`: editorial visual system inspired by WIRED but adapted for Mist Architect.
- `README.md`: developer-facing setup notes.

### Design Translation

The imported WIRED reference is used as visual language, not as a direct clone.
The site keeps:

- black/white editorial contrast
- hard rules and square image edges
- dense project/archive layouts
- mono uppercase metadata
- no shadows, no rounded cards, no decorative gradients

The architecture adaptation adds:

- full-bleed project imagery
- a restrained hero video surface
- project status, location, typology, year, and image credits
- long-term sections for Journal and Films
- CMS-ready local data structure

### Implementation Decisions

- Next.js App Router is used because the site needs SEO, localized routes, static generation,
  project detail pages, and future CMS revalidation.
- Routes are prefixed with locale (`/zh`, `/en`) so adding languages later is mostly a
  content and configuration task.
- Root `/` redirects to `/zh` through `next.config.ts`, which lets `[locale]/layout.tsx`
  own the `<html lang>` value for `/zh` and `/en`.
- Components remain mostly server-rendered; `ProjectFilter` and `MotionReveal` are the
  small client boundaries used for interaction and animation.
- `params` are awaited in route files to stay compatible with modern Next.js App Router behavior.
- Typography uses system font stacks for now. Licensed brand fonts or self-hosted fonts can be
  introduced later without changing layout structure.
- The design reference suggests negative letter spacing in places, but this implementation keeps
  letter spacing neutral to preserve layout stability and readability.

### Content Model Handoff

`src/content/site.ts` should later be replaced by a CMS adapter. Keep the public shape stable:

- `Project`
- `JournalEntry`
- `home`
- `navigation`

For CMS integration, document-level localization is preferred for projects and journal posts.
Shared fields such as year, code, image, status keys, and credits can remain common across locales.

### Verification Checklist

Completed:

- `npm install`: installed 345 packages with 0 reported vulnerabilities.
- `npm run typecheck`: passed; the script runs `next typegen` before `tsc --noEmit`.
- `npm run lint`: passed after updating `eslint.config.mjs` to the Next 16 flat config entrypoints.
- `npm run build`: passed and generated 14 static routes.
- `npm run dev -- --hostname 127.0.0.1`: started on `http://127.0.0.1:3000`.
- HTTP smoke checks returned 200 for `/zh`, `/en`, `/zh/projects`, and
  `/zh/projects/cloud-court-house`.
- `/` returns a 307 redirect to `/zh`.
- `/zh` emits `<html lang="zh">`; `/en` emits `<html lang="en">`.

Environment limitation:

- The `agent-browser` CLI is not installed in this environment, so full browser screenshot
  verification could not be run. HTTP and production-build checks were used instead.

### Known Follow-Ups

- Replace placeholder stock imagery and video with licensed Mist Architect media.
- Add CMS adapter and preview mode.
- Add sitemap, structured data, and per-locale metadata helpers.
- Add a real language switch that preserves the current path when switching locales.
- Expand project detail pages with drawings, process images, films, credits, and related projects.
- Add contact form handling once the preferred backend or email provider is chosen.

## 2026-04-13 / Sanity CMS Scaffold

### Goals

- Add a browser-based content backend for non-developer image and content updates.
- Keep the current site usable before Sanity credentials are configured.
- Prepare project, journal, film, team, category, and site settings models.

### Files Added or Changed

- `sanity.config.ts` and `sanity.cli.ts`: Sanity Studio and CLI configuration.
- `sanity/schemaTypes/*`: Sanity schema types for localized strings, projects, journal entries,
  films, team members, project categories, and site settings.
- `src/app/studio/*`: embedded Studio route with a setup screen when env vars are missing.
- `src/sanity/*`: environment, client, and GROQ query setup.
- `src/lib/content.ts`: content adapter that reads Sanity when configured and falls back to local
  seed data when not configured.
- `.env.example`: required Sanity environment variable names.

### Runtime Behavior

- `/studio` now exists.
- Without `NEXT_PUBLIC_SANITY_PROJECT_ID`, `/studio` shows setup instructions instead of crashing.
- Frontend routes call the content adapter instead of reading seed arrays directly.
- Frontend pages export `revalidate = 60`, so published CMS content can refresh without a full rebuild
  once a real Sanity project is configured.

### Verification

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed with `/studio/[[...tool]]` included as a dynamic route.
- `npm audit --omit=dev`: reports 5 moderate vulnerabilities through Sanity CLI's
  `@vercel/frameworks -> js-yaml@3.13.1`. `npm audit fix --force` would apply a breaking package
  change, so it was not run automatically.

## 2026-04-13 / Project Media CMS Wiring

### Goals

- Make the CMS useful for replacing project image placeholders, not just storing media fields.
- Render project gallery images and direct project video URLs on the project detail page.
- Keep local seed content visually rich while Sanity credentials are still unset.

### Files Added or Changed

- `src/content/site.ts`: extended the `Project` shape with `gallery` and `videoUrl`, and added seed gallery/video data.
- `src/sanity/queries.ts`: fetches project gallery images, alt text, credits, and video URLs from Sanity.
- `src/lib/content.ts`: normalizes CMS gallery media and falls back to seed data when a project has no published gallery.
- `src/app/[locale]/projects/[slug]/page.tsx`: renders optional project film and project gallery sections.
- `src/app/globals.css`: adds responsive editorial styling for the new project film and gallery sections.
- `README.md`: documents the editor flow for replacing images and publishing project media.

### Verification

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- HTTP smoke checks returned 200 for `/zh/projects/cloud-court-house` and `/studio`.
- The project detail HTML includes the new `项目影像` and `项目图集` sections.

## 2026-04-13 / Repository CI and Deployment Planning

### Goals

- Add automated GitHub checks before the project starts receiving more changes.
- Keep the Next.js app portable for both Vercel preview and later self-hosting.
- Document a deployment path that considers mainland-China browsing and editor access.

### Files Added or Changed

- `.github/workflows/ci.yml`: runs install, typecheck, lint, and production build on pushes and pull requests to `main`.
- `next.config.ts`: enables Next.js standalone output for self-hosted Node or container deployment.
- `docs/DEPLOYMENT_PLAN.md`: records preview, production, ICP, media, CMS, and operations notes.
- `README.md`: links to the deployment plan.

### Verification

- Local verification should continue to use `npm run typecheck`, `npm run lint`, and `npm run build`.
- After pushing this commit, GitHub Actions should run the same checks on `main`.

## 2026-04-13 / Prototype Visual System Realignment

### Goals

- Continue from the newer prototype direction and retire the remaining WIRED/brutalist visual language.
- Align the shared CSS with the revised `DESIGN.md` principles: silence, light, materiality, and void.
- Keep the local homepage image carousel performant enough for preview work.

### Files Added or Changed

- `DESIGN.md`: cleaned the revised "Void & Structure" guidance and corrected small typography/color typos.
- `src/app/globals.css`: replaced heavy borders, black ribbons, serif-heavy headings, and aggressive buttons with neutral spacing, light typography, and subtle hairlines.
- `src/components/hero.tsx`: simplified the full-screen image carousel, removed the gradient overlay, and respected reduced-motion preferences.
- `src/components/mobile-menu.tsx`: refined the inline menu interaction and accessibility labels.
- `.gitignore`: ignores macOS `.DS_Store` metadata files.
- `public/images/home/*`: optimized local homepage images from roughly 39 MB to roughly 10 MB.

### Verification

- `git diff --check`: passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed.
- HTTP smoke checks returned 200 for `/zh`, `/zh/projects/cloud-court-house`, and `/studio`.

## 2026-04-13 / Homepage Featured Projects Prototype

### Goals

- Keep only the featured projects section below the full-screen homepage carousel.
- Show five featured project images, each representing one project and linking to its detail route.
- Ensure all five featured projects have enough narrative content for detail-page review.

### Files Added or Changed

- `src/app/[locale]/page.tsx`: removes practice, journal, films, and contact sections from the homepage and renders only the first five projects after the hero.
- `src/content/site.ts`: expands local seed content from three to five projects, maps each featured project to a local homepage image, and adds longer detail-page narratives.
- `src/app/[locale]/layout.tsx`, `.env.example`, and `docs/DEPLOYMENT_PLAN.md`: add `NEXT_PUBLIC_SITE_URL` so local project images resolve cleanly for metadata.

### Verification

- `git diff --check`: passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed and generated 18 static pages.
- HTTP smoke checks found five homepage project links and returned 200 for `/zh/projects/pine-shadow-library` and `/zh/projects/salt-field-guesthouse`.

## 2026-04-14 / About Page and Mist Navigation

### Goals

- Replace the previous practice navigation item with a dedicated `岚` company page entry.
- Build a company introduction page with the office image as a full-screen visual anchor.
- Add a sticky second-level navigation for intro, founders, media, and contact sections.
- Present founder information with the founders image on the left and biography text on the right.

### Files Added or Changed

- `src/content/site.ts`: updates primary navigation and adds localized about-page seed content.
- `src/app/[locale]/about/page.tsx`: adds the bilingual about route with hero, second-level navigation, scrolling text sections, founders, media, and contact.
- `src/app/globals.css`: adds the full-bleed about hero, sticky subnav, scroll-reveal layout, and responsive founder section.
- `public/images/about/*`: stores the office and founders images under the lowercase public asset path.

### Verification

- `git diff --check`: passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed and generated 20 static pages, including `/zh/about` and `/en/about`.
- HTTP smoke checks returned 200 for `/zh/about` and `/en/about`; the `/zh/about` HTML includes the office image, founders image, and requested section labels.

## 2026-04-14 / About Page Office Reference Pass

### Goals

- Rework the `岚` page closer to the Vector Architects office-page rhythm: quiet office image, internal index, long profile text, founder record, media archive, and contact record.
- Keep the requested office image as the page's visual anchor while making the reading area feel more like an architectural office archive than a landing page.
- Preserve the four requested secondary navigation items and the founders image-left/text-right composition.

### Files Added or Changed

- `src/app/[locale]/about/page.tsx`: restructures the page into a sticky office index plus right-side office content sections.
- `src/app/globals.css`: updates the about layout to use an archive-style two-column composition, sticky index, calmer typography, bordered archive rows, and responsive horizontal subnav.
- `src/content/site.ts`: extends the office profile text and reshapes the media section into a simple dated archive list.

### Verification

- `git diff --check`: passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed and generated 20 static pages.
- HTTP smoke checks returned 200 for `/zh/about`; the HTML includes the office image, founders image, secondary nav anchors, `事务所简介`, `主要报道`, and founder credentials.

## 2026-04-14 / Intro Logo Splash

### Goals

- Add a full-screen logo moment before the site content appears.
- Keep the transition quiet and smooth so the homepage feels like it fades in naturally.
- Avoid replaying the intro during normal navigation in the same browser session.

### Files Added or Changed

- `src/components/intro-splash.tsx`: adds a session-aware client splash overlay with reduced-motion support.
- `src/app/[locale]/layout.tsx`: mounts the splash once at the locale layout level so it works from any entry route.
- `src/app/globals.css`: styles the fixed full-screen overlay and responsive logo sizing.
- `public/images/brand/mist-logo.svg`: adds a temporary image-based logo asset for the prototype.

### Verification

- `git diff --check`: passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed and generated 20 static pages.
- HTTP smoke checks confirmed `/zh` includes the splash markup and `/images/brand/mist-logo.svg` returns 200.

## 2026-04-14 / Automatic Light and Dark Theme

### Goals

- Make the full site respond automatically to the visitor's system light or dark preference.
- Keep the intro logo splash aligned with the active theme: white background in light mode and soft black background in dark mode.
- Prepare the intro logo handling for a transparent PNG asset by keeping the logo image background-free and using CSS filtering for dark mode.

### Files Added or Changed

- `src/app/globals.css`: adds color-scheme-aware theme tokens, dark-mode values, smoother color transitions, dark splash background, logo filtering, and image-overlay-safe text tokens.
- `public/images/brand/mist-logo.svg`: removes the temporary white logo background so the current placeholder behaves like a transparent logo.

### Verification

- `git diff --check`: passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed and generated 20 static pages.
- HTTP smoke checks confirmed `/zh` still includes the splash markup and logo asset path.

## 2026-04-14 / About Page Content Refresh

### Goals

- Use the updated `docs/About.md` bullet-point content as the source for the about page.
- Replace the temporary founder records with the new two-founder structure and the updated high-resolution founders photo.
- Make the founder image-to-text relationship explicit: the image shows 李博 on the left and 程博 on the right, and the copy now carries matching left/right position labels.
- Expand the media section into awards plus publications/exhibitions while keeping the existing four-item secondary navigation.

### Files Added or Changed

- `docs/About.md`: stores the current about-page copy source for developers and coding agents.
- `src/content/site.ts`: updates the bilingual about-page data, founder records, awards, publications/exhibitions, and contact email.
- `src/app/[locale]/about/page.tsx`: renders grouped media archives and founder position labels.
- `src/app/globals.css`: tunes the founder image crop and adds understated founder/media archive styling.

### Verification

- `git diff --check`: passed.
- `npm run typecheck`: passed after loading the local NVM Node 24.14.1 environment.
- `npm run lint`: passed after loading the local NVM Node 24.14.1 environment.
- `npm run build`: passed and generated 20 static pages.
- Local smoke checks returned 200 for `/zh/about` and `/images/about/founders.jpeg`; the `/zh/about` HTML includes `左侧`, `右侧`, `华南理工大学讲席副教授`, `出版/展览`, and `info@mist-arch.com`.

## 2026-04-14 / Logo, Font, and Navigation Pass

### Goals

- Replace the temporary intro SVG logo with the new PNG logo asset in `public/images/LOGO`.
- Switch the global typography to the HarmonyOS Sans font family from `public/font`.
- Temporarily simplify the primary navigation to a single `岚` entry.
- Update the header brand lockup to two lines: `岚·建筑设计` and `Mist Architect`.
- Change founder side labels from words to text arrows while preserving accessible left/right labels.

### Files Added or Changed

- `public/images/LOGO/logo.png`: provides the new intro splash logo source.
- `public/font/*`: stores the HarmonyOS Sans font files used by the global typography system.
- `src/components/intro-splash.tsx`: switches the splash image path to the new PNG logo and wraps it for controlled cropping.
- `src/components/site-header.tsx`: changes the header brand text to the requested two-line lockup.
- `src/components/mobile-menu.tsx`: renders a single static navigation link when only one nav item is active.
- `src/content/site.ts`: hides the other primary nav items and changes founder position markers to text arrows.
- `src/app/[locale]/about/page.tsx`: keeps accessible side labels for the visual founder arrows.
- `src/app/globals.css`: adds local font faces, applies HarmonyOS Sans globally, styles the cropped PNG splash logo, and adjusts the header brand lockup.

### Verification

- `git diff --check`: passed.
- `npm run typecheck`: passed after loading the local NVM Node 24.14.1 environment.
- `npm run lint`: passed after loading the local NVM Node 24.14.1 environment.
- `npm run build`: passed and generated 20 static pages.
- Local smoke checks returned 200 for `/zh`, `/zh/about`, `/images/LOGO/logo.png`, and `/font/HarmonyOS_Sans_SC/HarmonyOS_Sans_SC_Regular.ttf`; the `/zh` HTML includes the two-line header brand, new logo path, and a single `岚` nav link, while `/zh/about` includes the founder text arrows with accessible side labels.

## 2026-04-15 / About Hero Carousel and Archive Cleanup

### Goals

- Replace the static about-page office image and overlaid hero copy with a full-bleed background carousel using `about-1`, `about-2`, and `about-3`.
- Remove sequence numbers from the media, awards, publications, and exhibitions lists so each line reads as a standalone item.
- Keep only the Shenzhen contact location.
- Widen the English line in the header brand lockup and increase the active navigation button size.
- Remove the media section lead line so only the two media group headings remain.

### Files Added or Changed

- `public/images/about/about-1.jpeg`, `public/images/about/about-2.jpeg`, and `public/images/about/about-3.jpeg`: provide the about-page carousel photography.
- `src/content/site.ts`: points the about hero to the new image set and reduces contact location data to Shenzhen.
- `src/app/[locale]/about/page.tsx`: renders the about hero as a three-image carousel, removes archive numbering markup, and hides the media lead line.
- `src/app/globals.css`: adds the carousel fade animation, removes archive number columns, adjusts header brand alignment, and increases nav type size.

### Verification

- `git diff --check`: passed.
- `npm run typecheck`: passed after loading the local NVM Node 24.14.1 environment.
- `npm run lint`: passed after loading the local NVM Node 24.14.1 environment.
- `npm run build`: passed and generated 20 static pages.
- Local smoke checks returned 200 for `/zh/about`, `/images/about/about-1.jpeg`, `/images/about/about-2.jpeg`, and `/images/about/about-3.jpeg`; the `/zh/about` HTML includes the three new image paths and Shenzhen contact line, with the old hero sentence and archive number spans absent.

## 2026-04-15 / Dark Splash Logo Visibility Fix

### Goals

- Fix the intro splash logo disappearing in dark mode.
- Keep using the supplied transparent PNG logo while correcting the CSS crop position.
- Prevent refresh black screens caused by server/client splash rendering mismatch after `sessionStorage` marks the intro as seen.

### Files Added or Changed

- `src/app/globals.css`: adjusts the splash logo vertical translation so the actual logo artwork sits inside the visible crop frame in both light and dark modes.
- `src/components/intro-splash.tsx`: moves the `sessionStorage` gate fully client-side and schedules the splash state update after mount, so refreshes can show the page directly without leaving the splash overlay behind.

### Verification

- `git diff --check`: passed.
- `npm run typecheck`: passed after loading the local NVM Node 24.14.1 environment.
- `npm run lint`: passed after loading the local NVM Node 24.14.1 environment.
- `npm run build`: passed and generated 20 static pages.
- Playwright dark-mode screenshot for `/zh` confirmed the logo renders visibly on the dark splash background.
- Playwright dark-mode screenshot after the splash window confirmed the homepage hero renders instead of a black screen.

## 2026-04-15 / Header Label Adjustment

### Goals

- Widen the English `Mist Architect` line so it aligns more closely with the Chinese `岚·建筑设计` line.
- Rename the active right navigation entry from `岚` to `关于`.

### Files Added or Changed

- `src/app/globals.css`: increases the brand lockup width and horizontal scale of the English line.
- `src/content/site.ts`: updates the Chinese primary navigation label to `关于`.

### Verification

- `git diff --check`: passed.
- `npm run typecheck`: passed after loading the local NVM Node 24.14.1 environment.
- Local HTML smoke check confirmed `/zh/about` nav text renders as `关于`.

## 2026-04-15 / About Carousel Crossfade

### Goals

- Make the about-page background carousel transition with a visible crossfade instead of a hard image swap.

### Files Added or Changed

- `src/app/[locale]/about/page.tsx`: spaces the three carousel slides six seconds apart.
- `src/app/globals.css`: extends the carousel loop to eighteen seconds and adds fade-in, hold, and fade-out keyframes with overlapping opacity.

### Verification

- `git diff --check`: passed.
- `npm run lint`: passed after loading the local NVM Node 24.14.1 environment.
- `npm run build`: passed and generated 20 static pages.
- Vercel preview deployment: ready after pushing commit `d442ca1`.

## 2026-04-15 / Mock Project Detail Prototype

### Goals

- Upgrade the five featured homepage project detail pages from a simple title/data/gallery layout into a sectioned architectural project narrative.
- Use the MUJI HOTEL Shenzhen reference as an information-architecture guide: large page head, local anchor navigation, image-first sections, and definition-list metadata.
- Keep the content as mock copy and reusable local data so formal project text and additional photography can replace it later.

### Files Added or Changed

- `src/content/site.ts`: adds optional project facts and section types, plus mock facts for all five featured projects.
- `src/app/[locale]/projects/[slug]/page.tsx`: renders project facts, local section navigation, and sectioned image/text story blocks with fallback sections generated from existing project copy and gallery images.
- `src/app/globals.css`: adds the project detail anchor navigation, image-first story layout, sticky desktop copy column, project facts, and responsive mobile stacking.

### Verification

- `git diff --check`: passed.
- `npm run lint`: passed after loading the local NVM Node 24.14.1 environment.
- `npm run build`: passed and generated 20 static pages, including the five featured project detail routes in both Chinese and English.
- Local dev server smoke checks returned 200 for all five `/zh/projects/[slug]` routes.
- HTML smoke checks confirmed `/zh/projects/cloud-court-house` includes the local section labels and mock project facts, and `/en/projects/salt-field-guesthouse` includes the English section labels and mock project facts.
- `agent-browser` verification was skipped because the command is not installed in the local shell.

## 2026-04-15 / Project Immersive Opening Scroll

### Goals

- Adjust the project detail opening to match the intended reference interaction: a full-screen project image carousel stays in place while the reader scrolls through two transparent text groups.
- Use a downward arrow between the project identity group and the introduction group as the scroll cue.
- Move from the transparent image-overlaid introduction into the white-background detail page only after the second text group.
- Capture the rule in `DESIGN.md` so future project detail work does not revert to a simple static hero.

### Files Added or Changed

- `DESIGN.md`: documents the immersive opening sequence, transparent text rule, arrow cue, and white-background transition.
- `src/app/[locale]/projects/[slug]/page.tsx`: replaces the static project hero with an immersive two-panel scroll opening and CSS-driven project image carousel.
- `src/app/globals.css`: adds the sticky full-screen image carousel, dark image overlay, project title lockup, transparent introduction text, arrow cue, and reduced-motion fallback.

### Verification

- `git diff --check`: passed.
- `npm run lint`: passed after loading the local NVM Node 24.14.1 environment.
- `npm run build`: passed and generated 20 static pages.
- Local HTML smoke checks confirmed `/zh/projects/cloud-court-house` and `/en/projects/river-archive` include the immersive opening, scroll cues, white detail wrapper, and project section navigation.
- Local smoke check returned 200 for `/zh/projects/salt-field-guesthouse`.

## 2026-04-15 / Project Detail Text and Metadata Refinement

### Goals

- Correct the second transparent opening text group so it reads as one centered paragraph instead of multiple separated text blocks.
- Remove horizontal divider lines from the white-background project metadata grid.
- Capture both refinements in `DESIGN.md` for future project detail iterations.

### Files Added or Changed

- `src/app/[locale]/projects/[slug]/page.tsx`: limits the second transparent intro group to one project-introduction paragraph.
- `src/app/globals.css`: centers the transparent intro paragraph and removes metadata-grid top rules.
- `DESIGN.md`: documents the one-paragraph centered intro and no-divider metadata rule.

### Verification

- `git diff --check`: passed.
- `npm run lint`: passed after loading the local NVM Node 24.14.1 environment.
- `npm run build`: passed and generated 20 static pages.
- Local smoke check returned 200 for `/zh/projects/cloud-court-house`.
- Local HTML smoke check confirmed the project intro paragraph and project data grid still render after the refinement.

## 2026-04-15 / Aliyun ECS Deployment Planning

### Goals

- Move the deployment plan from Vercel/Tencent Cloud discussion to Alibaba Cloud ECS.
- Keep the current phase on Scheme A: code-managed content updates through GitHub, without a CMS.
- Plan for two runtime environments: company internal preview and public production.

### Files Added or Changed

- `docs/DEPLOYMENT_PLAN.md`: defines the Alibaba Cloud ECS architecture, recommended ECS specifications, preview/production split, ICP constraint, Nginx/PM2 runtime shape, release flow, security group rules, and operational checklist.

### Verification

- `git diff --check`: passed.

## 2026-04-16 / Preview Image Optimization and OSS Prep

### Goals

- Reduce first-load pressure on the low-bandwidth Aliyun ECS preview server.
- Compress the current local review images before moving approved runtime assets to Alibaba Cloud OSS.
- Document the OSS rule that browser-facing images should load directly from OSS or CDN rather than being proxied through ECS.

### Files Added or Changed

- `scripts/optimize-images.mjs`: adds a repeatable Sharp-based image optimization script for homepage, about, founders, and logo assets.
- `package.json`: adds `npm run optimize:images`.
- `public/images/home/*`: compresses homepage images from roughly 10.5 MB to roughly 2.8 MB.
- `public/images/about/*`: compresses about images from roughly 12.6 MB to roughly 1.5 MB.
- `public/images/LOGO/logo.png`: reduces the splash logo dimensions and file size for faster decode.
- `docs/DEPLOYMENT_PLAN.md`: updates the media policy for OSS direct delivery and CDN readiness.

### Verification

- `npm run optimize:images`: passed and reduced the optimized image set from roughly 23.0 MB to roughly 4.0 MB.
- `npm run build`: passed and generated 20 static pages.
- `npm run lint`: passed.
- Preview deployment `20260416004224-optimized-images` is online on port `8080`.
- Smoke checks confirmed `/zh` returns 200, `/images/home/home-01.jpeg` is served at roughly 337 KB, and `/images/about/founders.jpeg` is served at roughly 239 KB.

## 2026-04-16 / Homepage Hero Image Captions

### Goals

- Add lower-left text labels to the ten homepage carousel images.
- Keep labels as explicit content data instead of deriving them from filenames, so image names can change during OSS migration without affecting displayed copy.
- Keep production offline while publishing the update to preview.

### Files Added or Changed

- `src/content/site.ts`: adds the ten homepage image captions.
- `src/components/hero.tsx`: renders the active image caption with the carousel state.
- `src/app/[locale]/page.tsx`: passes the active locale into the hero component.
- `src/app/globals.css`: positions and styles the lower-left hero caption.
- `DESIGN.md`: documents the homepage caption rule.

### Verification

- `npm run lint`: passed.
- `npm run build`: passed and generated 20 static pages.
- Preview deployment `20260416022338-home-captions` is online on port `8080`.
- Smoke checks confirmed `/zh` returns 200 and production remains stopped with the port `80` offline message.

## 2026-04-16 / Caption Contrast and Detail Cleanup

### Goals

- Keep homepage carousel captions visually consistent over changing image backgrounds.
- Hide project detail section divider lines between the overview/site/material/image areas.
- Remove repeated visible "Mist Architect" labels from the about-page internal navigation and section headings.

### Files Added or Changed

- `src/app/globals.css`: removes blend-mode color inversion from hero captions, strengthens the caption shadow, and removes project detail section/nav divider lines.
- `src/app/[locale]/about/page.tsx`: removes the about-page side label and repeated section kicker labels.

### Verification

- `npm run lint`: passed.
- `npm run build`: passed and generated 20 static pages.
- Preview deployment `20260416024633-caption-about-lines` is online on port `8080`.
- Smoke checks confirmed `/zh` returns 200, project detail HTML renders the expected sections, and production remains stopped.

## 2026-04-16 / About Content Divider Removal

### Goals

- Remove the remaining horizontal divider lines in the about-page content introduction area.
- Keep the about page as open text sections without section, founder, media-list, or mobile index separator rules.

### Files Added or Changed

- `src/app/globals.css`: removes about section top borders, founder entry borders, media list item borders, and the mobile about index bottom border.

### Verification

- `npm run lint`: passed.
- `npm run build`: passed and generated 20 static pages.
- `git diff --check`: passed.
- Preview deployment `20260416025250-about-no-dividers` is online on port `8080`.
- Smoke check confirmed `/zh/about` returns 200 and production remains stopped.

## 2026-04-16 / Localized Header and Static Featured Tiles

### Goals

- Show only one localized brand name in the header: Chinese name on Chinese pages, English name on English pages.
- Update the five homepage featured project tile labels to match the first five supplied project captions.
- Temporarily disable featured project tile links and hide the full project index entry point during prototype review.

### Files Added or Changed

- `src/components/site-header.tsx`: renders one localized brand label instead of both Chinese and English names.
- `src/components/project-card.tsx`: adds disabled/static rendering support for non-clickable featured tiles.
- `src/app/[locale]/page.tsx`: passes the five homepage captions into the featured tiles and removes the full-index link.
- `src/app/globals.css`: simplifies single-line brand styling.
- `DESIGN.md`: documents localized header branding and temporary non-interactive featured tiles.

### Verification

- `npm run lint`: passed.
- `npm run build`: passed and generated 20 static pages.
- Preview deployment `20260416152348-home-static-featured` is online on port `8080`.
- Smoke checks confirmed `/zh` includes the five requested tile labels, has no featured project detail links or full-index link, and `/en` shows `Mist Architect` without the Chinese brand label.
- Production remains stopped.

## 2026-04-16 / Hero Controls and Language Switch

### Goals

- Add manual controls to the homepage image carousel: previous/next arrows and clickable dot navigation.
- Move the active carousel caption above the dot navigation at the lower center of the viewport.
- Add a compact right-header `中文 | EN` language switch that preserves the current route.
- Translate homepage carousel and featured-project labels into English.

### Files Added or Changed

- `src/components/hero.tsx`: adds previous/next handlers, arrow buttons, dot navigation, and centered carousel caption controls.
- `src/components/language-switch.tsx`: adds a client-side language switch using the current pathname.
- `src/components/site-header.tsx`: adds the language switch to the right header action area.
- `src/content/site.ts`: translates homepage carousel captions and changes the English navigation label to `About`.
- `src/app/globals.css`: styles the carousel arrows, dots, centered caption, and header language switch.
- `DESIGN.md`: documents the carousel controls and language switch behavior.

### Verification

- `npm run lint`: passed.
- `npm run build`: passed and generated 20 static pages.
- Preview deployment `20260416154811-hero-controls-lang` is online on port `8080`.
- Smoke checks confirmed `/zh` renders carousel controls and `/en` renders English carousel/featured labels, English branding, `About`, and the language switch.
- Production remains stopped.

## 2026-04-16 / About Intro Label and Featured Tile Typography

### Goals

- Rename the about-page intro navigation item from `简介` to `岚`, and update the intro section heading from `事务所简介` to `岚`.
- Keep the English version synchronized with `Mist`.
- Reformat homepage featured project captions as `year · location` plus a separate project-name line.

### Files Added or Changed

- `src/content/site.ts`: updates the localized about intro labels.
- `src/app/[locale]/about/page.tsx`: updates the visible about intro heading.
- `src/app/[locale]/page.tsx`: splits featured captions into location and project-name display data.
- `src/components/project-card.tsx`: adds an optional featured-project eyebrow line for the static homepage tiles.
- `src/app/globals.css`: adds neutral grey hierarchy styles for the featured tile year/location and project-name lines.
- `DESIGN.md`: documents the homepage featured tile caption hierarchy.

### Verification

- `npm run lint`: passed.
- `npm run build`: passed and generated 20 static pages.
- `git diff --check`: passed.
- Preview deployment `20260416163941-about-featured-type` is online on port `8080`.
- Smoke checks confirmed `/zh` and `/en` render the new featured tile hierarchy, `/zh/about` renders `岚` for the intro nav and heading, `/en/about` renders `Mist`, and production remains stopped.

## 2026-04-18 / About Page Aspect-Band Carousel + Raw Masters Moved

### Goals

- Upload staging dir previously lived at `public/images/for_OSS/` (~353 MB of raw hero masters). Every deploy rsynced all of it to ECS, so releases stalled at 15+ min. Move the staging dir out of `public/` so the Next.js bundle stays lean.
- The about page hero carousel previously had a single `heroImages: string[]` that served only three landscape stills to every viewport. Split it into horizontal + vertical masters, mirroring the homepage hero, so phones get portrait crops and desktop gets the 4:3 set.
- New photographer-supplied about imagery (4 landscape + 4 portrait).

### Moves

- `public/images/for_OSS/` → `assets/for_OSS/`. Untracked in git before the move; still untracked after. Next.js only bundles files under `public/`, so nothing reachable at runtime changed. `public/` dropped from 433 MB → 76 MB (fonts only). Subsequent deploys back to normal speed.
- Failed deploy `20260418211649-hero-band-dedup` was stalled mid-rsync on the 353 MB `for_OSS/` payload. Killed, then rolled forward into the combined `20260418225425-about-aspect-carousel` release.

### OSS uploads (8 new objects)

```
about/horizontal/about-h1.jpeg  (418 KB)
about/horizontal/about-h2.jpeg  (398 KB)
about/horizontal/about-h3.jpeg  (304 KB)
about/horizontal/about-h4.jpeg  (1.4 MB)
about/vertical/about-v1.jpeg    (110 KB)
about/vertical/about-v2.jpeg    (156 KB)
about/vertical/about-v3.jpeg    (2.0 MB)
about/vertical/about-v4.jpeg    (2.1 MB)
```

All masters were pre-compressed by the photographer; OSS IMG re-encodes them to WebP + AVIF via the `about-hero` + `hero-portrait` layouts at request time. Old `about/about-1..3.jpeg` paths left in OSS as orphans for now (no code references them).

### Changes

- `src/content/site.ts`:
  - `about.aboutHero = { horizontal: string[], vertical: string[] }` — paired-by-index arrays, one side per orientation band.
  - `about.heroImage` (used by `generateMetadata`'s openGraph image) moved to `about/horizontal/about-h1.jpeg`.
  - Old `about.heroImages` removed — no other call sites.
- `src/components/about-hero-carousel.tsx` (new, client component):
  - `matchMedia("(max-aspect-ratio: 3/4)")` picks `vertical` or `horizontal` array (same threshold as homepage hero portrait band).
  - Layout: portrait → `hero-portrait`, landscape → `about-hero`.
  - `key={`${orientation}-${image}`}` forces React to remount on orientation change so CSS keyframe animation restarts cleanly instead of inheriting partial opacity state.
- `src/app/[locale]/about/page.tsx`: replaced inline `about.heroImages.map(…)` with `<AboutHeroCarousel horizontal vertical />`.
- `src/app/globals.css` `.about-hero-slide` + `@keyframes about-hero-fade`: cycle bumped 18s → 24s (4 slides × 6s stagger). Keyframe percentages recomputed to keep per-slide budget at 1s fade-in + 4s hold + 1s fade-out + 18s off.

### Verification

- `npm run lint`: passed.
- `npm run build`: passed, 20 static pages.
- Released `20260418225425-about-aspect-carousel`, fast rsync (~seconds, public/ is 76 MB now).
- Smoke: `/zh`, `/en`, `/zh/about`, `/en/about` → HTTP 200.

## 2026-04-18 / Hero Per-Band Dedup

### Problem

Two slides repeated in the carousel:

- Portrait band: `万致天地` appeared twice. `wanzhi-natural-museum` and `wanzhi-natural-museum-02` are two landscape entries sharing one portrait crop (`home/vertical/012 …`), so in the portrait band both pointed at the same file.
- Landscape / wide band: `原野学社` appeared twice. `field-academy` and `field-academy-02` are two portrait entries sharing one landscape crop (`home/horizontal/02 …`), so in the landscape/wide bands both pointed at the same file.

Root cause: `heroSlides` holds the outer join of (horizontal × vertical) variants so that each orientation exposes every crop it actually has. Rendering the raw list per-band produced duplicates whenever an orientation reused its sibling's single crop.

### Fix

`src/components/hero.tsx`:

- Added `dedupSlidesForBand(slides, band)` — first-wins dedup keyed by the exact file `pickSource(slide, band)` would load. Collapses any pair that would render the same asset in the active band.
- `visibleSlides = useMemo(() => dedupSlidesForBand(heroSlides, band), [band])`. Recomputed only on band change; `heroSlides` is a module-level constant.
- Stored `currentIndex` is no longer clamped in an effect (tripped `react-hooks/set-state-in-effect`). `safeIndex = currentIndex % imageCount` derives a legal render index; every navigation path (arrow, autoplay, dot click) writes a modulo-valid value on the next tick so the stored index self-normalizes within one frame.
- All reads of the slide list switched to `visibleSlides` — hero media, caption, dots, aria-current.

### Effect

- Portrait band now shows 1 × 万致天地 (keeps `wanzhi-natural-museum`, drops `…-02`).
- Landscape + wide bands now show 1 × 原野学社 (keeps `field-academy`, drops `field-academy-02`).
- Seaside boardwalk trio stays intact in every band (three distinct crops per orientation).

### Verification

- `npm run lint`: passed.
- `npm run build`: passed, 20 static pages.
- Released `20260418211649-hero-band-dedup`, smoke checks pending (see AGENT_HANDOFF for the release marker).

## 2026-04-18 / Pre-shot 16:9 Hero Masters

### Goals

- Server-side `m_fill` crop from 4:3 to 16:9 (previous release) uses a blind center-crop. For a subset of hero images the photographer has supplied hand-framed 16:9 masters alongside the 4:3 masters — wire these up so wide desktops get the intended framing, not a mechanical center-crop.
- Keep the fallback behavior: slides without a pre-shot 16:9 master continue to use OSS `m_fill` so the system still works for every slide.

### New OSS objects (uploaded via `aliyun oss cp`)

```
home/horizontal/11_16:9_深圳 · 海边栈道.jpg
home/horizontal/11.1_16:9_深圳 · 海边栈道.jpg
home/horizontal/11.1_4:3_深圳 · 海边栈道.jpg
home/horizontal/12_16:9_深圳 ·万致天地·自然博物园.jpg
home/horizontal/12_4:3 深圳 ·万致天地·自然博物园.jpg
home/horizontal/12.1_16:9_深圳 ·万致天地·自然博物园.jpg
home/horizontal/12.1_4:3_深圳 ·万致天地·自然博物园.jpg
```

Colons in filenames are URL-encoded to `%3A` by `encodePath()` — works end-to-end through OSS IMG. Verified with a 2560w WebP fetch (853 KB, `image/webp`).

### Changes

- `src/content/site.ts`:
  - `HeroSlide` gained an optional `horizontalWide?: string` field documenting the pre-shot 16:9 master.
  - Four slides updated to reference the new masters:
    - `wanzhi-natural-museum`: horizontal → `12_4:3 …`, horizontalWide → `12_16:9_…`.
    - `wanzhi-natural-museum-02`: horizontal → `12.1_4:3_…`, horizontalWide → `12.1_16:9_…`.
    - `seaside-boardwalk`: horizontal unchanged (`11 …`), horizontalWide → `11_16:9_…`.
    - `seaside-boardwalk-02`: horizontal → `11.1_4:3_…`, horizontalWide → `11.1_16:9_…`.
- `src/components/hero.tsx`:
  - `pickSource(slide, band)` now returns `slide.horizontalWide` when the wide band is active and a pre-shot 16:9 exists; otherwise falls back to `slide.horizontal`.
  - `pickLayout(slide, band)` now takes the slide too — when wide-band has a pre-shot 16:9 master it uses `hero-landscape` (resize-only, no crop) so OSS doesn't re-crop an already-framed file. Without a pre-shot 16:9 it uses `hero-wide` which does the 4:3 → 16:9 `m_fill`.

### Verification

- `npm run lint`: passed.
- `npm run build`: passed, 20 static pages.
- Released `20260418205813-hero-aspect-masters`, PM2 online on port 3001.
- Smoke checks: `/zh`, `/en`, `/zh/about` all HTTP 200.
- Sanity-fetched one processed URL for a colon-named object (`11_16:9_…jpg` @ 2560w WebP q92) → 853 KB, correct content-type.

### Notes for future agents

- To add more pre-shot 16:9 masters: drop files into `home/horizontal/` with `<seq>_16:9_<caption>.ext`, add the bucket-relative path to the slide's `horizontalWide` field in `src/content/site.ts`. No code changes required; the hero pipeline picks them up automatically.
- To drop a pre-shot master: remove the `horizontalWide` field from the slide and the hero falls back to server-cropping the 4:3 master.

## 2026-04-18 / Multi-Aspect Hero + Round-3 Quality Bump

### Goals

- 4:3 source served on 16:9 desktops showed letterbox bars with `object-fit: contain`. Provide a 16:9 variant for wide viewports so the hero fills the screen with no letterbox and no manual asset duplication.
- Quality round 2 (WebP 90 / AVIF 72) still read soft on 4K per client review. Push another notch — stay under the 2 MB hero ceiling.
- Keep iPad landscape (4:3 = 1.33) on the uncropped 4:3 master; only widescreen viewports get the crop.

### Changes

- `src/lib/media.ts`:
  - `COMPRESSION` round 3: `high` WebP 90 → 92, AVIF 72 → 78, JPG 92 → 95. `std` 85/66/88 → 88/72/90. `low` 78/56/80 → 82/62/85.
  - Added `CropSpec` + `crop?: CropSpec` on `LayoutSpec`. When set, `buildOssProcess()` emits `resize,w_W,h_H,m_fill` (where `H = round(W / aspectRatio)`) instead of `m_lfit`. OSS does a server-side scale-to-cover + center-crop.
  - `mediaSrcSet()` and `pictureSet()` thread the layout's crop spec into every rung so AVIF, WebP, and JPG sources all carry the same output aspect.
  - Added `hero-wide` layout: same widths + quality as `hero-landscape` plus `crop: { aspectRatio: 16/9 }`.
- `src/components/hero.tsx`:
  - Replaced 2-state `Orientation` (portrait | landscape) with 3-band `AspectBand` (portrait | standard | wide).
  - Two `matchMedia` queries: `(max-aspect-ratio: 3/4)` → portrait, `(min-aspect-ratio: 7/5)` → wide, gap in between → standard. 7:5 (1.40) threshold keeps iPad landscape (1.33) in standard while every mainstream desktop + widescreen laptop (16:10 = 1.60, 16:9 = 1.78) lands in wide.
  - `pickLayout(band)` maps portrait → `hero-portrait`, standard → `hero-landscape`, wide → `hero-wide`. `pickSource` unchanged — portrait uses vertical master, the other two bands share the 4:3 horizontal master (wide gets it server-cropped).
- `src/app/globals.css` `.hero-media`: switched `object-fit` back from `contain` to `cover`. Each band now serves a source that matches the viewport shape, so `cover` trims at most a sliver of edge and the hero fills the screen cleanly.

### OSS behavior

- `m_fill` scales the 4:3 master to the target W×H box and center-crops the long edge. For 16:9 from 4:3, OSS discards ~25% of pixels from the top+bottom. Encoded output is lighter than the uncropped master because ~25% fewer pixels hit the encoder.
- AVIF cap (`AVIF_MAX_WIDTH = 2560`) still applies — the 16:9 AVIF rung is 2560×1440 (3.69M pixels), well under the 9.44M ceiling.

### Measured bytes (from §5 of `IMAGE_PIPELINE.md`)

| Variant | Bytes |
| --- | --- |
| WebP 3840 q92 `hero-landscape` (4:3 as-is) | 1.82 MB |
| WebP 3840×2160 q92 `hero-wide` (16:9 crop) | 1.45 MB |
| AVIF 2560 q78 `hero-landscape` | 311 KB |
| AVIF 2560×1440 q78 `hero-wide` | 256 KB |

### Verification

- `npm run lint`: passed.
- `npm run build`: passed, 20 static pages.
- Released `20260418152449-hero-multi-aspect` to preview, PM2 online on port 3001.
- Smoke checks: `/zh`, `/en`, `/zh/about` all HTTP 200 via `http://47.106.120.253:8080`.
- Bench-verified WebP + AVIF `m_fill` URLs return correct content-type and expected byte size.

### Open follow-ups

- Round-4 quality bump budget is getting tight (WebP 92 already produces 1.82 MB at 3840 4:3). Future sharpness complaints likely need a different intervention — e.g. provide a 5K rung for Retina 6K displays, or switch to `m_fill` pre-crop universally so 4K WebP stays well under 2 MB.
- JPG fallback at 3840 q95 is 3.68 MB. Only matters for clients accepting neither AVIF nor WebP; revisit if analytics shows real traffic in that bucket.

## 2026-04-18 / Quality Bump + Hero Slide Expansion

### Goals

- First-round compression read soft on full-screen retina + 4K. Bump quality so 4K hero lands in the 1–2MB band agreed with the client.
- Bump featured tile and AVIF quality so they match the hero's perceptual quality.
- Use all 15 horizontal + 15 vertical hero crops now in OSS — previously only the first 10 were wired up.

### Changes

- `src/lib/media.ts` `COMPRESSION` matrix:
  - `high`: WebP 82 → 90, AVIF 58 → 72, JPG 88 → 92.
  - `std`: WebP 78 → 85, AVIF 52 → 66, JPG 82 → 88.
  - `low`: WebP 72 → 78, AVIF 48 → 56, JPG 75 → 80.
- `src/content/site.ts` `heroSlides`: expanded 10 → 16 slides. Added `wanzhi-natural-museum` (×2 horizontal variants paired with the single vertical), `field-academy-02` (single horizontal paired with the second vertical crop), `seaside-boardwalk` (×3 paired horizontal/vertical variants). Where one orientation has fewer crops than the other, the missing-side path reuses the available crop and is documented inline.
- `docs/IMAGE_PIPELINE.md`: quality matrix and §5 benchmarks updated for the new tier.

### Measured (after bump)

- WebP 3840 q90 hero: 1.56 MB (was 1.03 MB at q82).
- WebP 3840 q88: 1.36 MB.
- WebP 3840 q92: 1.82 MB (kept under 2 MB ceiling).
- AVIF 2560 q72: 294 KB (was 245 KB at q58).
- WebP 1280 q85 feature: 242 KB.

### Verification

- `npm run lint` + `npm run build` clean.
- Sample sweep against OSS IMG returned the byte sizes above.

## 2026-04-18 / Hero + About-Hero Eager-Load Fix

### Symptom

After the OSS IMG cutover, the homepage hero went blank between autoplay ticks (showing only the broken-image icon top-left); opening DevTools made the image render. About-page hero slides 2 and 3 had the same issue.

### Root Cause

`<OssPicture priority>` resolves to `loading="eager"` for the hero img, otherwise `loading="lazy"`. Hero slides were passed `priority={currentIndex === 0}` and about-hero slides `priority={index === 0}` — so only the first slide loaded eagerly, every later slide was lazy. Combined with `motion.div` `initial={ opacity: 0 }` (and the about-hero CSS keyframe that holds opacity 0 for the first ~38% of the cycle), the browser's lazy-load heuristic deferred fetching until visibility evaluation re-ran. Opening DevTools forced a reflow that triggered the load — masking the bug.

### Fix

- `src/components/hero.tsx`: hero slide now always `priority` (every slide is full-screen and is the LCP candidate the moment it mounts).
- `src/app/[locale]/about/page.tsx`: every about-hero slide now `priority` (all three are full-bleed and crossfade via CSS — none can be lazy).

### Verification

- `npm run lint`: passed.
- `npm run build`: passed, 20 pages.
- Deployed `20260418142159-hero-eager`. `curl /zh` markup: hero img `loading="eager" fetchPriority="high"`. `curl /zh/about` markup: 3 eager (about-hero slides) + 1 lazy (founders portrait).

## 2026-04-18 / OSS IMG Pipeline (AVIF + WebP + Quality Tiers)

### Goals

- Cap full-screen hero weight under ~1.5MB at 4K while keeping ≤500KB on typical 1080p/1440p devices.
- Serve AVIF where supported, WebP everywhere else, JPG as last-resort fallback — no client JS, no Next image optimizer doubling work.
- Decouple compression (quality tier) from sizing (layout preset) so component code only picks a layout.
- Document the pipeline so future image additions follow a single workflow.

### Files Added or Changed

- `src/lib/media.ts`: extended from a URL builder into a preset system. Adds `Quality` (`high`/`std`/`low`/`raw`) with per-format encoder values in a `COMPRESSION` matrix; `Layout` union with six presets (`hero-landscape`, `hero-portrait`, `about-hero`, `feature`, `portrait`, `thumb`) bundling width ladder + quality + `sizes`; `mediaSrcSet()` builder; `pictureSet()` returning `{avifSrcSet, webpSrcSet, fallbackSrc, sizes, largestWidth}`. AVIF rungs capped at `AVIF_MAX_WIDTH = 2560` to stay within OSS IMG's 9.4M-pixel AVIF ceiling — larger rungs silently fall back to WebP.
- `src/components/oss-picture.tsx`: new `<OssPicture>` component. Renders `<picture><source type="image/avif"><source type="image/webp"><img></picture>`. Inner `<img>` carries the layout class so existing CSS selectors (`.story-tile img { aspect-ratio }` etc.) continue to apply unchanged.
- `src/components/hero.tsx`: switched from `motion.img + mediaUrl` to `motion.div.hero-media-frame > OssPicture`. Layout chosen by orientation (`hero-landscape` / `hero-portrait`). First slide is `priority`.
- `src/app/[locale]/page.tsx`: featured tiles use `<OssPicture layout="feature">`. Removed `next/image` + manual `mediaUrl` call.
- `src/app/[locale]/about/page.tsx`: hero carousel uses `<OssPicture layout="about-hero" pictureClassName="about-hero-slide" className="about-hero-slide-img">` so the existing fade-keyframe lives on the `<picture>`. Founders portrait uses `layout="portrait"`. Removed `next/image`.
- `src/app/globals.css`: added `.hero-media-frame` (absolute fill wrapper for the motion crossfade), restructured `.about-hero-slide` (now applied to `<picture>` for animation + positioning) and added `.about-hero-slide-img` for the inner `<img>` cover sizing. Added `picture { display: block }` rules under `.story-tile` and `.about-founders-image` so picture wrappers don't inherit inline collapsing.
- `docs/IMAGE_PIPELINE.md`: new spec doc — bucket layout, OSS IMG limits, quality matrix, layout presets, measured byte sizes, component API, workflow for adding images, and references to the production hardening checklist.

### Measured Output Bytes

Source: `home/horizontal/01 …青年实验剧场.jpg` (11MB master, 3:2).

- WebP 1280 q82 (hero-high): ~210KB
- WebP 1920 q82 (hero-high): 411KB
- WebP 3840 q82 (hero-high): 1.03MB
- AVIF 2560 q58 (hero-high, AVIF cap): 245KB
- WebP 1280 q78 (feature-std mid rung): 194KB

Hero target met (≤1.5MB at 4K WebP, ~245KB AVIF on 1440p–4K AVIF-capable devices). Featured tile target met (~150–400KB mid rung).

### Bug Found and Fixed

- AVIF at 3840w for 3:2 source returned `AvifExceedRange` (limit: max 4096px wide AND ≤9,437,184 total pixels; 3840×2560 ≈ 9.83M trips the pixel cap).
- Fix: introduced `AVIF_MAX_WIDTH = 2560` constant and filtered AVIF rungs in `pictureSet()`. WebP and JPG continue to serve the full ladder.
- Validation: capped AVIF URL returns 245KB `image/avif`; WebP at 3840 returns 1.03MB `image/webp`.

### Verification

- `npm run lint`: passed.
- `npm run build`: passed, 20 static pages generated.
- Dev smoke (`PORT=3010 npm run dev`):
  - `/zh` markup contains `<source type="image/avif">` and `<source type="image/webp">` for hero + featured tiles, `srcSet` rungs match the layout ladder, AVIF rungs stop at 2560.
  - `/zh/about` markup contains both source types for the hero carousel.
  - `curl -GET` of representative processed URLs returns the expected `image/webp` and `image/avif` byte streams (HEAD does not trigger IMG processing on this OSS endpoint — must validate with GET).

### Open Items

- Project detail pages (`/projects/[slug]`) and `journal-list` still on local `/images/` paths — migrate when those surfaces are revamped.
- Production hardening checklist (custom domain, CDN, Referer allowlist, cache-control headers) deferred to launch — see `docs/AGENT_HANDOFF.md` §8.

## 2026-04-18 / Frontend OSS Cutover and Orientation-Aware Hero

### Goals

- Move all visible frontend imagery off the local `public/images` bundle and onto OSS so image updates no longer require a site redeploy.
- Split the homepage hero into a landscape set and a portrait set so desktop visitors and mobile/portrait visitors each get a photograph framed for their screen.
- Drive homepage featured tiles from the refreshed `home/feature/` filenames (year · location · title), with the sequence number treated as metadata only.
- Defer CDN, custom domain, cache-control, and versioning rules until the production launch checklist.

### Files Added or Changed

- `src/lib/media.ts`: new `mediaUrl()` helper. Resolves bucket-relative paths against `NEXT_PUBLIC_MEDIA_BASE`, defaulting to the OSS public endpoint. Encodes each path segment so Chinese filenames, spaces, and middle dots become valid URLs.
- `next.config.ts`: adds `mist-architects-media.oss-cn-shenzhen.aliyuncs.com` and reserves `media.mistarchitects.com` in `images.remotePatterns` so the production CDN flip is a one-env-var change.
- `src/content/site.ts`:
  - New `heroSlides` array of ten slides, each with a `horizontal` and `vertical` bucket-relative path plus bilingual caption derived from the OSS filenames (sequence number stripped).
  - New `featuredTiles` array of five entries with `{ year, location, title }` split out of the filename, so the source-name typo `"深圳 · 深圳 ·"` is collapsed at the data layer.
  - `about.heroImage`, `about.heroImages`, and `about.foundersImage` switched from `/images/about/...` absolute public paths to bucket-relative paths.
- `src/components/hero.tsx`: rewritten to consume `heroSlides`. A `matchMedia("(max-aspect-ratio: 3/4)")` listener sets orientation state on mount and on change, swapping between the horizontal and vertical source without a layout thrash. The `<motion.img>` key embeds the orientation so aspect-ratio flips trigger an immediate crossfade rather than waiting for the next autoplay tick. SSR falls back to landscape so first paint on desktop is still the correct frame.
- `src/components/intro-splash.tsx`: splash logo now resolves via `mediaUrl("LOGO/logo.png")`. The prop default is the runtime-resolved URL, keeping the component's public API unchanged.
- `src/app/[locale]/page.tsx`: featured grid rewritten to render `featuredTiles` directly, bypassing the old `ProjectCard` + `Project` fake object path. Eyebrow is `year · location`, title is the project title, image alt concatenates location and title for each locale.
- `src/app/[locale]/about/page.tsx`: about hero carousel, founders image, and Open Graph `images[]` now flow through `mediaUrl()`.
- `docs/AGENT_HANDOFF.md`: Production Launch Notes section extended with a dedicated OSS hardening checklist (CDN, HTTPS, Referer, CORS, cache, lifecycle, versioning, RAM user scoping, access logging, ICP alignment). Known Constraints updated to reflect that the cutover is done. Recommended Next Tasks updated to flag project-detail-page migration as the remaining frontend OSS work.

### Interaction Detail

- Horizontal slides load when viewport aspect ratio is wider than `3:4`. Portrait-shaped viewports (most phones, split-screen tablets, narrow desktop windows) load the vertical set.
- Orientation changes during a session swap the source mid-carousel without interrupting autoplay.
- Prefers-reduced-motion still disables autoplay and the crossfade; the orientation swap still runs so the framing remains correct.

### Verification

- `npm run lint`: passed.
- `npm run build`: passed, 20 static pages generated.
- Dev server smoke checks:
  - `curl http://localhost:3000/zh` returns markup containing the OSS hero URL and `/_next/image?url=...oss-cn-shenzhen...` for every featured tile.
  - `curl http://localhost:3000/zh/about` returns OSS URLs for `about/about-1.jpeg`, `about-2.jpeg`, `about-3.jpeg`, and `founders.jpeg`.
  - Representative raw OSS HTTP checks (hero horizontal, feature tile via Next image optimizer, about hero, logo) all returned `200`.

### Open Items

- Project detail pages still point at the local `/images/home/home-NN.*` bundle and will be migrated when that surface is revamped.
- Custom media subdomain, CDN, cache headers, referer whitelist, and bucket versioning are intentionally deferred until the production launch checklist kicks in (see `docs/AGENT_HANDOFF.md` §8).

## 2026-04-17 / OSS Media Bucket Bootstrap

### Goals

- Host lossless high-resolution images for the deployed site on Alibaba Cloud OSS instead of bundling them in the ECS app.
- Co-locate the bucket with the ECS instance (cn-shenzhen) so internal traffic is free and latency is minimal.
- Mirror the local folder structure so existing relative paths map cleanly once the frontend switches to OSS URLs.

### Bucket

- Name: `mist-architects-media`
- Region: `cn-shenzhen`
- Storage class: Standard
- Public endpoint: `https://mist-architects-media.oss-cn-shenzhen.aliyuncs.com/`
- Intended ACL: public-read for GET; writes remain AK-gated.

### Upload

- Source: `/Users/winnie/Desktop/Programming/MistArchitects/assets/for_OSS/` (moved out of `public/` on 2026-04-18 to keep the deploy rsync lean)
- Command: `aliyun --profile mist oss cp ./ oss://mist-architects-media/ --recursive --exclude ".DS_Store"`
- Result: 41 files, ~336 MB, folder tree preserved (`LOGO/`, `about/`, `home/feature/`, `home/horizontal/`, `home/vertical/`).

### Public Access Fix

- Initial direct GET returned `403 AccessDenied` despite `--acl public-read` at bucket creation.
- Root cause: bucket-level Block Public Access defaulted to `true` on new buckets in cn-shenzhen.
- Fix: `aliyun --profile mist ossutil api put-bucket-public-access-block --bucket mist-architects-media --public-access-block-configuration '{"BlockPublicAccess":"false"}'` then `aliyun --profile mist oss set-acl oss://mist-architects-media public-read -b`.
- Verification: `curl` against `LOGO/logo.png`, `about/founders.jpeg`, `home/horizontal/*`, `home/vertical/*`, `home/feature/*` all return `200`.

### Operator Notes

- The aliyun CLI bundled `oss` subcommand is an older ossutil wrapper; newer ops (PublicAccessBlock, etc.) live under `aliyun ossutil api`.
- `oss ls --recursive` is not supported by the legacy wrapper; use `aliyun ossutil ls oss://mist-architects-media/` for a flat listing.
- The frontend has not yet been switched to OSS URLs. Next step is to introduce a small image-URL helper so local dev can fall back to `public/` while production points at the OSS origin (or a future CDN in front of it).

### Remaining Risks

- No CORS configuration yet; only needed if JS code pulls raw bytes cross-origin. Plain `<img>` usage is unaffected.
- No CDN in front of OSS yet; direct OSS egress is metered if external viewers access the site. Acceptable for preview.
- No lifecycle or versioning rules set; revisit before production promotion.

## 2026-04-17 / Hero Carousel Line-Arrow Controls

### Goals

- Replace the 34px circular hero carousel indicators with two semi-transparent floating vertical lines.
- On hover over the left 30% area, animate the left line into a minimal left-pointing arrow (`‹`).
- On hover over the right 30% area, animate the right line into a minimal right-pointing arrow (`›`).
- Fix Next.js dev server HMR cross-origin block so `127.0.0.1` receives hot-reload updates.

### Files Added or Changed

- `src/app/globals.css`: replaces `.hero-arrow-indicator` circle with a 60px × 1.5px vertical line built from two pseudo-elements (`::before` top half, `::after` bottom half); hover rotates each half ±22° around its shared midpoint to form a chevron; opacity transitions from 0.36 to 0.92 on hover.
- `next.config.ts`: adds `allowedDevOrigins: ["127.0.0.1"]` to allow HMR websocket connections from the loopback IP.

### Interaction Detail

- Default: two translucent white lines sit in the left and right 30% hit zones, visible at rest.
- Hover left zone: top half rotates `+22deg` (origin bottom), bottom half rotates `-22deg` (origin top) → `‹`.
- Hover right zone: top half rotates `-22deg`, bottom half rotates `+22deg` → `›`.
- Transition: 300ms ease on both transform and background.
- Keyboard focus triggers the same visual state as hover.

### Verification

- `npm run lint`: passed.
- `npm run build`: passed and generated 20 static pages.
- Preview deployment `20260417030911-hero-line-arrows` is online on port `8080`.
- Smoke checks returned 200 for `/zh`, `/en`, and `/zh/about`.
- Production remains stopped.

## 2026-04-17 / Splash Timing and Hero Control Hotspots

### Goals

- Slow the opening logo splash animation by 35%.
- Restart the homepage carousel autoplay timer after any manual previous, next, or dot navigation action.
- Expand homepage carousel click targets to the left and right 30% of the hero image.
- Keep the visible control as a small circle and reveal the simple directional mark on hover or keyboard focus.

### Files Added or Changed

- `src/components/intro-splash.tsx`: promotes splash timing values to constants and increases the visible/fade durations by 35%.
- `src/components/hero.tsx`: adds a reset key for autoplay and routes all manual carousel actions through reset-aware handlers.
- `src/app/globals.css`: converts the arrow buttons into large transparent hero hotspots with 34px circular indicators.
- `DESIGN.md`: documents the autoplay reset and hero hotspot interaction rules.

### Verification

- `npm run lint`: passed.
- `npm run build`: passed and generated 20 static pages.
- `git diff --check`: passed.
- Preview deployment `20260417012030-hero-hotspots-splash` is online on port `8080`.
- Smoke checks confirmed `/zh` renders the new hero control markup, the deployed CSS contains the 30% hero hotspots, and production remains stopped.

## 2026-04-18 / About Hero Carousel Crossfade Fix

### Goals

- Fix about page hero playback: only the first slide was visible; subsequent slides faded to black with a ~1s gap before the next slide faded in.
- Serve the about hero masters as raw OSS objects (already <400KB each) — skip the `<picture>` srcset pipeline and OSS IMG processing entirely for this surface.

### Root Cause

The previous CSS used a 24s cycle with a 6s stagger across 4 slides and per-slide keyframes `0%→4.2% fade-in, 4.2%→20.8% hold, 20.8%→25% fade-out, 25%→100% off`. Slide N fully reached `opacity: 0` at wall time `N*6s + 6s`, while slide N+1's own 0% keyframe (opacity 0) began exactly at `N*6s + 6s`. The two transitions did not overlap — there was no moment when both slides were partially visible — so every handoff produced a 1s window where the container was flat black.

### Fix

- New CSS timing: 20s cycle, 5s stagger. Per-slide lifetime of 6s (1s longer than the stagger) so slide N's fade-out and slide N+1's fade-in both run over the shared `N*5s+4s → N*5s+5s` interval. Keyframes: `0%: 0 → 5%: 1 (1s fade-in) → 25%: 1 (4s hold) → 30%: 0 (1s fade-out) → 100%: 0`.
- `about-hero-carousel.tsx` now renders plain `<img src={mediaUrl(path)}>` elements — no `<picture>`, no `x-oss-process` query. `OssPicture` import removed; `eslint-disable-next-line @next/next/no-img-element` comment documents the deliberate bypass. `animationDelay` changed from `index * 6s` to `index * 5s` to match the new stagger.
- `.about-hero-slide` CSS rule absorbed what used to live on `.about-hero-slide-img` (height/width/object-fit) since there is no longer a wrapper around the image.

### Files Changed

- `src/components/about-hero-carousel.tsx`: plain `<img>` + raw origin URL via `mediaUrl(path)`; `index * 5s` stagger.
- `src/app/globals.css`: `.about-hero-slide` animation 24s → 20s with updated geometry; `@keyframes about-hero-fade` replaced with overlap-friendly percentages; `.about-hero-slide-img` rule removed.

### Verification

- `npm run lint`: passed.
- `npm run build`: passed and generated 20 static pages.
- Preview deployment `20260418230518-about-carousel-crossfade` is online on port `8080`.
- Smoke checks returned 200 for `/zh/about`, `/en/about`, and `/zh`.
- Production remains stopped.

## 2026-04-18 / About Contact Trimmed to Email Only

### Goals

- Simplify the about page contact section to just the studio email. Drop the `深圳 / Shenzhen` city line and the tagline about new sites, adaptive reuse, and research collaborations.

### Files Changed

- `src/content/site.ts`: removed `about.contact.title` (both locales) and stripped `深圳 / Shenzhen` from `about.contact.body`. Body now holds a single entry per locale: `info@mist-arch.com`.
- `src/app/[locale]/about/page.tsx`: removed the `<p class="about-lead">` that rendered `about.contact.title` — the section now renders only the `<h2>` label and the body lines.

### Verification

- `npm run lint`: passed.
- `npm run build`: passed and generated 20 static pages.
- Preview deployment `20260418234908-about-contact-email-only` is online on port `8080`.
- Smoke checks returned 200 for `/zh/about` and `/en/about`. `grep` over the rendered `/zh/about` HTML confirmed `info@mist-arch.com` is present and the contact section no longer contains `深圳` or `新的场地` (the remaining `深圳` matches are inside founder credentials and exhibition history, which are unrelated to this change).
- Production remains stopped.

## 2026-04-19 / Header Centerline Alignment, Portrait Hero Swipe, Scroll Hint

### Goals

- Fix the horizontal centerline (中轴线) misalignment between the brand lockup on the left of the top navigation and the `关于 / About` link + language switch on the right.
- On portrait viewports (phones / split-screen), add left/right swipe gestures for the homepage hero carousel on top of the existing tap hotspots.
- Add a minimal downward chevron in the bottom-right of the hero image that hints there is more content below and smooth-scrolls past the hero when tapped.

### Root Cause of Header Misalignment

`.brand-mark` used `display: block` with `line-height: 1.12`, while `.language-switch`, `.menu-toggle`, and `.inline-nav-item` used `line-height: 1`. Flex `align-items: center` centered each item's border box, but the brand glyph sat ~1.2px lower in its 22.4px content box than the switch glyph did in its 14px content box, producing a visible midline offset. In addition the `(max-width: 640px)` breakpoint explicitly set `.main-nav { align-items: flex-start }`, which top-aligned both sides at narrow widths instead of center-aligning them.

### Files Changed

- `src/app/globals.css`:
  - `.brand-mark`: `display: block` → `display: inline-flex; align-items: center`; `line-height: 1.12` → `1`. Keeps the CJK glyph midline locked to the flex cross-axis center so brand + header actions share one horizontal axis.
  - `@media (max-width: 640px) .main-nav`: dropped the `align-items: flex-start` override so the narrow-viewport header inherits the desktop `align-items: center` behavior.
  - New `.hero-scroll-hint` + `.hero-scroll-hint-chevron` block and `@keyframes hero-scroll-hint-bounce`. Chevron built from two 12×1.5px bars rotated ±32° joined at the top; 2.2s translateY(0 → 6px) loop. Disabled under `prefers-reduced-motion`. `z-index: 4` sits one layer above the `.hero-arrow-next` hotspot (z-index 3) so the chevron intercepts clicks inside the shared right-band rectangle without disabling the hotspot elsewhere.
- `src/components/hero.tsx`:
  - Added `useRef` import.
  - New `handleTouchStart` / `handleTouchEnd` handlers bound to `.hero-shell` (only fire when `band === "portrait"`). Swipe threshold 40px horizontal; horizontal delta must also exceed vertical delta so vertical scroll flicks never trigger a slide change. Left swipe → `goToNext`, right swipe → `goToPrevious`; both run through `resetAutoplay()` so the autoplay clock restarts like the tap paths do.
  - New `handleScrollHintClick` that smooth-scrolls the window by one viewport height — enough to move the hero out of view on any device without coupling the hero to a specific DOM anchor.
  - Rendered a `<button class="hero-scroll-hint">` child of `.hero-shell` with a bilingual `aria-label` and a purely decorative `<span>` chevron.

### Verification

- `npm run lint`: passed.
- `npm run build`: passed and generated 20 static pages.
- Preview deployment `20260419041212-header-swipe-scrollhint` is online on port `8080`.
- Smoke checks returned 200 for `/zh`, `/en`, and `/zh/about`. `grep` over the rendered `/zh` HTML confirmed the new `hero-scroll-hint` / `hero-scroll-hint-chevron` classes are present.
- Production remains stopped.

## 2026-04-19 / Scroll Hint Repositioned Above Caption

### Goals

- Move the hero scroll-hint chevron out of the bottom-right corner and into the centered controls column directly under the hero image, above the caption and dots.

### Files Changed

- `src/components/hero.tsx`: relocated the `<button class="hero-scroll-hint">` node from a direct child of `.hero-shell` to the first child of `.hero-carousel-controls`. The control column now reads top-to-bottom: scroll-hint → caption → dots.
- `src/app/globals.css` `.hero-scroll-hint`: dropped the `position: absolute; bottom; right; z-index: 4;` block. The button is now a regular 32×32 flex child of the centered control column (`.hero-carousel-controls` is `display: flex; flex-direction: column; align-items: center`), so it auto-centers horizontally and sits above the caption via DOM order.

### Verification

- `npm run lint`: passed.
- `npm run build`: passed and generated 20 static pages.
- Preview deployment `20260419132134-scrollhint-above-caption` is online on port `8080`.
- Smoke checks returned 200 for `/zh`. `grep` over the rendered HTML confirmed the scroll-hint button is the first child of `.hero-carousel-controls`, above the caption and dots.
- Production remains stopped.

## 2026-04-20 / Repository Sync and Handoff Refresh

### Goals

- Confirm the local repository and GitHub branch are synchronized after external Claude Code work.
- Refresh the handoff documentation so future agents use the current Alibaba Cloud ECS / OSS assumptions instead of stale Vercel or pre-OSS notes.
- Record the currently active preview deployment and production-offline state.

### Repository State

- Branch: `preview/home-featured-projects`.
- Remote: `origin https://github.com/MistArchitect/MistArchitectWeb.git`.
- Current HEAD: `b8ecc4d OSS image pipeline, aspect-band hero, about carousel, header alignment, scroll hint`.
- `git fetch origin --prune` completed successfully.
- `git status --short --branch` reported `## preview/home-featured-projects...origin/preview/home-featured-projects` with no modified or untracked files before this documentation update.

### Deployment State

- Preview remains on Alibaba Cloud ECS at `http://47.106.120.253:8080/zh` and `http://47.106.120.253:8080/en`.
- Production remains intentionally offline on port `80`, returning the Nginx 503 message.
- PM2 preview process is online and running from:

```text
/srv/mist-architect/releases/20260419132134-scrollhint-above-caption/server.js
```

- PM2 production process exists but is stopped.

### Files Changed

- `docs/AGENT_HANDOFF.md`: updated repository sync status, OSS cutover status, splash logo source, current preview release path, PM2 runtime note, known constraints, and next-task ordering.
- `docs/DEVELOPMENT_LOG.md`: added this handoff refresh entry.

### Verification

- `git fetch origin --prune`: passed.
- `git status --short --branch`: clean and synchronized before the docs edit.
- SSH/PM2 check passed after loading the deploy user's nvm environment: `mist-preview` online at the release path above, `mist-production` stopped.
- No build was run for this entry because the change is documentation-only.

## 2026-04-20 / Preview CI/CD Bootstrap

### Goals

- Move the project away from local-machine-only preview deployment.
- Add a GitHub Actions path that builds the Next.js standalone output in CI and deploys only the preview process on Alibaba Cloud ECS.
- Keep production deployment disabled until domain, ICP, HTTPS, and approval flow are ready.

### Decisions

- Use GitHub-hosted runners for build/typecheck/lint instead of building on the 2C2G economy ECS instance.
- Use SSH/rsync to upload the release artifact to ECS, matching the existing manual release layout.
- Keep the workflow manual-only first (`workflow_dispatch`). The `push` trigger for `preview/home-featured-projects` is present as a commented block and should only be enabled after GitHub Secrets are configured and one manual deployment passes.
- Do not store or upload the local deploy private key automatically. The key must be added by a repository admin as a GitHub Secret.

### Files Changed

- `.github/workflows/deploy-preview.yml`: new preview-only deployment workflow. It runs `npm ci`, `npm run typecheck`, `npm run lint`, `npm run build`, installs `rsync`, uploads `.next/standalone`, `.next/static`, and `public`, promotes `/srv/mist-architect/current-preview`, restarts `mist-preview`, and smoke-checks `/zh`, `/en`, and `/zh/about`.
- `docs/AGENT_HANDOFF.md`: documents required GitHub Secrets, manual trigger behavior, and the path to enable automatic preview deploys later.

### Required GitHub Secrets

```text
ALIYUN_ECS_HOST
ALIYUN_ECS_USER
ALIYUN_ECS_PORT
ALIYUN_ECS_SSH_KEY
```

### Verification

- Current docs commit `8bbb3d1` was pushed to `origin/preview/home-featured-projects` before the CI/CD workflow work started.
- `git diff --check`: passed.
- Ruby YAML parse of `.github/workflows/deploy-preview.yml`: passed.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `npm run build`: passed and generated 20 static pages.
- `actionlint` was not run because it is not installed locally, `npx actionlint` is not an executable npm package, and this machine does not have Go installed for `go run github.com/rhysd/actionlint/cmd/actionlint@latest`.

### 2026-04-21 Follow-up

- Registered `.github/workflows/deploy-preview.yml` on the default branch `main` as commit `61ce091` so GitHub's Actions UI can list the manual `Deploy Preview` workflow. No application code from `preview/home-featured-projects` was merged into `main`.
- Removed the obsolete `vercel.json` from `preview/home-featured-projects` after the Vercel GitHub Environments were deleted. The project deployment path is now Alibaba Cloud ECS + GitHub Actions preview workflow.
- First manual `Deploy Preview` run failed because `ALIYUN_ECS_SSH_KEY` contained a malformed private key value (`Load key ... error in libcrypto`). The secret was reset through `gh secret set` from the verified local deploy key.
- Retry run `24684681445` succeeded from branch `preview/home-featured-projects` at commit `f176d9d`. It deployed release `20260420185834-f176d9d` to `/srv/mist-architect/current-preview`, restarted `mist-preview`, and smoke checks returned 200 for `/zh`, `/en`, and `/zh/about`.
- Added `FORCE_JAVASCRIPT_ACTIONS_TO_NODE24=true` to the workflow environment to opt GitHub JavaScript actions into Node 24 and avoid the Node 20 deprecation warning shown by the first successful run.

### 2026-04-21 CI/CD Documentation Follow-up

- Added `docs/CICD.md` as the dedicated GitHub Actions CI/CD reference for the project owner and future agents.
- Documented why `Re-run all jobs` keeps the old `headSha` and why deploying the newest `preview/home-featured-projects` commit requires starting a new `Run workflow` run.
- Current observed re-run behavior: run `24684681445` stayed on `f176d9d` and redeployed ECS release `20260420194149-f176d9d`; this is expected GitHub Actions behavior.
- After production domain setup, preview smoke checks were moved from public port `8080` to `https://preview.mist-arch.com` with Basic Auth secrets (`PREVIEW_AUTH_USER`, `PREVIEW_AUTH_PASSWORD`) so the public `8080` preview bypass can be closed.

## 2026-04-21 / Production Domain Launch

### Goals

- Bring the approved preview release online as production.
- Use `mist-arch.com` as the canonical production domain.
- Redirect `mist.archi` and `hilarchitects.com` family domains to the canonical production domain.
- Protect preview behind Basic Auth and remove the old public `8080` preview bypass.

### DNS

- Added Alibaba Cloud DNS A records pointing to ECS `47.106.120.253`:
  - `mist-arch.com`
  - `www.mist-arch.com`
  - `preview.mist-arch.com`
  - `mist.archi`
  - `www.mist.archi`
- Updated Alibaba Cloud DNS A records for `hilarchitects.com` and `www.hilarchitects.com` from `47.240.13.168` to `47.106.120.253`.
- Left `hilarchitects.com` mail records and `bim` / `bim2` subdomain A records unchanged.

### Runtime

- Promoted release `20260420194149-f176d9d` to production:
  - `/srv/mist-architect/current-production -> /srv/mist-architect/releases/20260420194149-f176d9d`
  - `mist-production` online on `127.0.0.1:3002`
- `mist-preview` remains online on `127.0.0.1:3001`.

### Nginx and HTTPS

- Configured `https://mist-arch.com` as canonical production, proxying to `127.0.0.1:3002`.
- Configured `https://preview.mist-arch.com` with Nginx Basic Auth and `X-Robots-Tag: noindex`, proxying to `127.0.0.1:3001`.
- Configured `www.mist-arch.com`, `mist.archi`, `www.mist.archi`, `hilarchitects.com`, and `www.hilarchitects.com` to `301` redirect to `https://mist-arch.com`.
- Installed Certbot and issued/expanded Let's Encrypt certificate `mist-arch.com` for:
  - `mist-arch.com`
  - `www.mist-arch.com`
  - `preview.mist-arch.com`
  - `mist.archi`
  - `www.mist.archi`
  - `hilarchitects.com`
  - `www.hilarchitects.com`
- Certbot timer is enabled for automatic renewal.

### Security Group

- Confirmed inbound `80/tcp` and `443/tcp` are open.
- Closed public inbound `8080/tcp`; preview should now be reached through `https://preview.mist-arch.com` only.
- `3001` and `3002` remain internal-only behind Nginx.

### Verification

- `https://mist-arch.com/zh`: HTTP 200.
- `https://mist-arch.com/en`: HTTP 200.
- `https://www.mist-arch.com/zh`: HTTP 301 to `https://mist-arch.com/zh`.
- `https://mist.archi/zh`: HTTP 301 to `https://mist-arch.com/zh`.
- `https://www.mist.archi/zh`: HTTP 301 to `https://mist-arch.com/zh`.
- `https://hilarchitects.com/zh`: HTTP 301 to `https://mist-arch.com/zh`.
- `https://www.hilarchitects.com/zh`: HTTP 301 to `https://mist-arch.com/zh`.
- `https://preview.mist-arch.com/zh` without credentials: HTTP 401.
- `https://preview.mist-arch.com/zh` with Basic Auth: HTTP 200.
- `http://47.106.120.253:8080/zh`: blocked/unreachable after security group rule removal.
- Manual `Deploy Preview` run `24733248566` was triggered after closing `8080` to verify the new Basic Auth smoke checks. It succeeded from commit `3217212` and deployed preview release `20260421161312-3217212`. Production remained on `20260420194149-f176d9d`.

## 2026-04-22 / OSS Security and CDN Readiness

### Goals

- Add baseline OSS safety controls before wider production sharing.
- Keep browser-facing images working on production and protected preview.
- Prepare the final CDN media domain without switching traffic before Alibaba Cloud CDN is active.

### OSS changes

- Enabled Referer protection on bucket `mist-architects-media`.
- Set `AllowEmptyReferer=false`.
- Allowed Referers:
  - `https://mist-arch.com`
  - `https://www.mist-arch.com`
  - `https://preview.mist-arch.com`
  - `https://mist.archi`
  - `https://www.mist.archi`
  - `https://hilarchitects.com`
  - `https://www.hilarchitects.com`
  - `http://localhost:3000`
  - `http://127.0.0.1:3000`
- Left CORS unset because `<img>` / `<picture>` loading does not need XHR access.
- Enabled OSS bucket versioning so accidental overwrites are recoverable.

### CDN state

- Reserved `media.mist-arch.com` as the future media CDN domain and added it to `next.config.ts` remote image patterns.
- Alibaba Cloud CLI currently returns `CdnServiceNotFound`, which means CDN service is not open on the account yet. CDN setup must wait for console activation / billing confirmation.
- After CDN activation, create CDN domain `media.mist-arch.com` with OSS origin, bind HTTPS, add DNS CNAME, set `NEXT_PUBLIC_MEDIA_BASE=https://media.mist-arch.com`, rebuild preview, and verify.

### Verification

- Direct no-Referer GET for `https://mist-architects-media.oss-cn-shenzhen.aliyuncs.com/LOGO/logo.png`: HTTP 403.
- Same object with production Referer: HTTP 200.
- `https://mist-arch.com/zh`: HTTP 200.

## 2026-04-22 / Footer Legal Copy and Home Progress Note

### Goals

- Add production-ready footer structure for copyright and ICP filing copy.
- Add a small homepage note that the website content remains in progress.

### Changes

- Added `src/components/site-footer.tsx` and mounted it in the localized root layout so all public locale pages share one legal footer.
- Footer renders localized brand copy, copyright year, rights text, and an optional ICP filing link when `NEXT_PUBLIC_ICP_LICENSE` is set.
- Added `NEXT_PUBLIC_ICP_LICENSE` to `.env.example`. Production should set this to the real ICP filing number before launch; the site intentionally does not render a guessed placeholder.
- Added homepage progress copy below the featured project grid:
  - Chinese: `网站内容持续更新中 / Work in progress.`
  - English: `Work in progress. The website is being updated.`

### Deployment

- Pushed commit `b84b20a` to `origin/preview/home-featured-projects`.
- Triggered manual GitHub Actions run `24738362474`; it passed typecheck, lint, build, upload, preview promotion, and preview smoke checks.
- Preview release: `20260421180550-b84b20a`.
- Promoted the same release to production:
  - `/srv/mist-architect/current-production -> /srv/mist-architect/releases/20260421180550-b84b20a`
  - `mist-production` online on `127.0.0.1:3002`
- Verified `https://mist-arch.com/zh` contains the home progress note and footer copyright.
- Verified `https://mist-arch.com/en` contains the English progress note and footer copyright.
- ICP filing copy is intentionally absent until `NEXT_PUBLIC_ICP_LICENSE` is set to the real filing number.

## 2026-04-22 / Center Footer Legal Copy

### Change

- Centered the site footer legal text so the copyright line sits in the middle of the page on desktop and wraps centered on smaller screens.

### Deployment

- Pushed commit `2e8474c` to `origin/preview/home-featured-projects`.
- Triggered manual GitHub Actions run `24739160886`; it passed typecheck, lint, build, upload, preview promotion, and preview smoke checks.
- Preview release: `20260421182320-2e8474c`.
- Promoted the same release to production:
  - `/srv/mist-architect/current-production -> /srv/mist-architect/releases/20260421182320-2e8474c`
  - `mist-production` online on `127.0.0.1:3002`
- Verified `https://mist-arch.com/zh` contains the footer and the CSS chunk contains `.site-footer p{text-align:center;...justify-content:center;...}`.

## 2026-04-22 / Formalize Release Workflow

### Goals

- Prepare the project for the next development cycle with a clear operating flow.
- Make the Local → Preview → Production path explicit for future agents and developers.

### Changes

- Added `docs/RELEASE_WORKFLOW.md`.
- Updated `README.md`, `docs/CICD.md`, and `docs/AGENT_HANDOFF.md` to point to the workflow.
- Corrected stale handoff wording from `Production is not active` to `Production is active`.
- Confirmed local branch is synchronized with `origin/preview/home-featured-projects`.
- Confirmed ECS preview and production both point to `20260421182320-2e8474c`.

## 2026-04-22 / Add Top-Level Agent Entry File

### Goals

- Provide a single repository-root entry point for future coding agents.
- Define document reading order, hard rules, and release-flow guardrails.

### Changes

- Added `AGENTS.md` at the repository root.
- Linked `AGENTS.md` from `README.md`.
- Kept detailed operational content in existing docs instead of duplicating it.

## 2026-04-22 / Mobile Hero Swipe Direction Lock

### Goals

- Improve homepage Hero carousel touch behavior on portrait/mobile viewports.
- Prevent slightly diagonal left/right swipes from accidentally scrolling the page vertically.
- Give mobile swipe transitions a more directional feel than the desktop crossfade.

### Changes

- `src/components/hero.tsx`: added a touch-move direction lock with a small dead zone. Slightly diagonal horizontal gestures lock as carousel swipes and call `preventDefault()` while strongly vertical gestures keep normal page scrolling.
- `src/components/hero.tsx`: added a portrait/mobile drag track using `motion/react` motion values. The active, previous, and next images move with the finger, can pause mid-gesture, then either settle back or complete the image change on release.
- `src/app/globals.css`: set `touch-action: pan-y` on the hero shell so normal vertical gestures remain available while horizontal gestures are handled by the carousel.
- `src/app/globals.css`: added the three-frame mobile carousel stage/track styles.
- `DESIGN.md`: documented the mobile direction-lock rule, gesture-driven mobile swipe animation, and the project-detail `sticky hero` / `scroll overlay` naming.

## 2026-04-22 / Mobile Hero Light Stack Transition

### Goals

- Replace the portrait/mobile Hero's side-by-side push feel with a calmer stacked transition.
- Keep the interaction gesture-driven so the image can stop naturally under the finger.
- Remove mobile left/right tap controls and keep swipe as the only mobile carousel change gesture.

### Changes

- `src/components/hero.tsx`: changed the portrait/mobile Hero structure from a three-frame horizontal track to a light stacked deck. The current image sits above the previous/next images and follows `mobileDragX`; the incoming image fades, scales, and shifts subtly from the layer below.
- `src/components/hero.tsx`: kept the release behavior spring-based. Under-threshold gestures rebound to the current image; committed gestures animate the current image out and then update the active index.
- `src/app/globals.css`: replaced mobile track positioning with stacked frame layering and current-frame drag cursor/touch styles.
- `DESIGN.md`: updated the mobile Hero rule to describe the light stacked deck model instead of a lateral push transition.

## 2026-04-22 / Homepage Scroll Overlay

### Goals

- Bring the project-detail `sticky hero` / `scroll overlay` behavior to the homepage.
- Keep the first screen as a full Hero image carousel.
- Let the recommended-projects white page body rise over the Hero during downward scroll.

### Changes

- `src/app/[locale]/page.tsx`: wrapped the homepage Hero and recommended-projects content in a `home-scroll-overlay` section. The Hero sits inside `home-hero-sticky`, followed by a transparent one-viewport spacer and then the white content layer.
- `src/app/globals.css`: added `home-page`, `home-scroll-overlay`, `home-hero-sticky`, `home-overlay-spacer`, and `home-overlay-content` styles. The sticky Hero uses `margin-bottom: -100svh` so the spacer controls when the white layer begins to cover the image.
- `DESIGN.md`: documented the homepage `scroll overlay` / `cover reveal` rule.

## 2026-04-22 / About Scroll Overlay

### Goals

- Apply the same `scroll overlay` / `cover reveal` entry rhythm to the About page.
- Keep the About image carousel as a full-screen photographic entry.
- Let the white office profile content rise over the image, with the secondary About navigation staying in the white content layer.

### Changes

- `src/app/[locale]/about/page.tsx`: wrapped the About hero carousel and office content in `about-scroll-overlay`, with a sticky hero layer, one-viewport spacer, and white content layer.
- `src/app/globals.css`: added `about-hero-sticky`, `about-overlay-spacer`, and `about-overlay-content` styles, and changed `.about-hero` from an 88svh block to a 100svh block for a complete first-screen cover reveal.
- `DESIGN.md`: documented the About page overlay behavior and kept its section anchors explicit.

## 2026-04-22 / Hero Stack Direction and Footer Layering Fix

### Goals

- Restore the mobile Hero autoplay transition after the stacked swipe refactor.
- Adjust the stacked swipe direction so next images layer in from the right, while previous images are revealed beneath the current image.
- Prevent sticky Hero layers from showing through the site footer after the homepage/About scroll overlay changes.

### Changes

- `src/components/hero.tsx`: mobile autoplay now animates `mobileDragX` to the next-image position before updating `currentIndex`, so timed image changes use the same stacked transition as manual gestures.
- `src/components/hero.tsx`: adjusted the mobile stack transforms. The next slide is positioned offscreen to the right and moves left above the current image; the previous slide stays below and is revealed as the current image moves right.
- `src/app/globals.css`: raised the next-slide stack layer above the current slide for the incoming-next transition.
- `src/app/globals.css`: gave `.site-footer` an explicit paper background, full-width stacking context, and higher z-index so sticky image layers cannot bleed behind the footer.
- `DESIGN.md`: clarified the intended asymmetric mobile stack behavior and noted that autoplay must animate instead of swapping instantly.

## 2026-04-22 / Hero Next Overlay and About Scroll Cue

### Goals

- Fix the mobile next-image and autoplay transitions so they read as a right-to-left overlay, not a left-to-right push.
- Add a clear scroll cue to the About hero.

### Changes

- `src/components/hero.tsx`: added a counter-motion layer inside the current mobile slide. During next-image gestures/autoplay, the current image remains visually anchored while the next image enters from the right above it; previous-image gestures still move the current image rightward to reveal the lower layer.
- `src/app/globals.css`: allowed the current mobile frame to overflow and added `.hero-mobile-current-visual` so the counter-motion layer can keep the current image visually fixed during next-image drags.
- `src/app/[locale]/about/page.tsx`: added a minimal downward chevron anchor in the About hero, linking to the intro section.
- `src/app/globals.css`: added `.about-scroll-hint` positioning and hover/focus treatment, reusing the homepage chevron mark.
- `DESIGN.md`: clarified that mobile autoplay uses the same next-image overlay animation and documented the About scroll cue.

## 2026-04-22 / Preview Smoke Check Hardening

### Goals

- Keep preview deployment automatic on push while reducing false-negative smoke failures.
- Distinguish application deployment success from transient public HTTPS connection resets.

### Changes

- `.github/workflows/deploy-preview.yml`: changed the smoke step to first SSH into ECS and check `/zh`, `/en`, and `/zh/about` directly against `http://127.0.0.1:3001`.
- `.github/workflows/deploy-preview.yml`: kept the public Basic Auth smoke checks, but added HTTP/1.1, connection/max-time limits, longer retry count, and `--retry-all-errors` so TLS reset/transient network failures get retried.
- `.github/workflows/deploy-preview.yml`: made public preview smoke failures warnings after ECS-local smoke passes. The deployment should fail only when the deployed app is unhealthy on ECS; GitHub-hosted runner TLS resets against `preview.mist-arch.com` are tracked as warnings.
- `docs/CICD.md`: documented the two-stage smoke check: ECS-local first, public Basic Auth second.

## 2026-04-22 / Preview Shared Public Assets

### Goals

- Prevent preview deployments from re-uploading the same 76 MB `public/font` bundle into every timestamped release directory.
- Keep future automatic preview deployments fast enough for push-based CI/CD.

### Changes

- Seeded `/srv/mist-architect/shared/public` on ECS from the current preview release's `public` directory.
- `.github/workflows/deploy-preview.yml`: now rsyncs `public/` into `/srv/mist-architect/shared/public/` and symlinks that directory into each new preview release during promotion.
- `docs/CICD.md`: documented the shared public asset directory and the release symlink behavior.

## 2026-04-22 / Temporary IP Preview OSS Referer

### Goals

- Let reviewers access the preview build before `mist-arch.com` finishes ICP filing.
- Keep OSS Referer protection enabled while allowing the temporary IP preview entry.

### Changes

- Confirmed `mist-arch.com` HTTPS failures are caused by Alibaba Cloud ICP/domain interception before the request reaches Nginx.
- Confirmed `http://47.106.120.253:8080/zh` reaches the preview Next.js app, but OSS images returned 403 because the IP preview origin was not in the bucket Referer whitelist.
- Added `http://47.106.120.253:8080` to the OSS bucket `mist-architects-media` Referer whitelist with `AllowEmptyReferer=false` unchanged.
- Verified homepage OSS image URLs and `LOGO/logo.png` return 200 when requested with `Referer: http://47.106.120.253:8080/zh`.
- Updated `docs/IMAGE_PIPELINE.md` and `docs/AGENT_HANDOFF.md` to mark this as a temporary pre-ICP preview allowance.

## 2026-04-23 / Homepage Featured Project Pointer Field

### Goals

- Add a restrained GSAP-driven pointer response to the homepage featured project tiles.
- Keep the effect photographic and architectural rather than decorative, with mobile and reduced-motion users receiving the static layout.

### Changes

- Added `gsap` as a runtime dependency.
- `src/components/featured-project-field.tsx`: new client component for the homepage featured project grid. It uses GSAP quick setters for pointer-following CSS variables that drive micro image translation, subtle tilt, and a smaller counter-motion on the project copy.
- `src/app/[locale]/page.tsx`: replaced inline featured tile rendering with `FeaturedProjectField`.
- `src/app/globals.css`: added the featured pointer parallax styles plus coarse-pointer and reduced-motion fallbacks.
- `src/content/site.ts`: updated the featured tile comment to match the new render path.

### Verification

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `git diff --check`: passed.
- `npm run build`: passed.

## 2026-04-23 / Project Card Entry Transition

### Goals

- Add a restrained project-list-to-detail transition inspired by high-end portfolio project entries.
- Keep the transition scoped to clickable archive project cards while homepage featured tiles remain non-clickable for prototype review.

### Changes

- `src/components/project-transition-link.tsx`: added a client link wrapper that intercepts normal clicks, clones the source project card image, expands it to the viewport with GSAP, then navigates to the project detail route.
- `src/components/project-card.tsx`: replaced project archive image/title links with `ProjectTransitionLink` and marked the media source for the shared-image transition.
- `src/app/globals.css`: added the fixed route-transition overlay styles.

### Verification

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `git diff --check`: passed.

## 2026-04-23 / GSAP Deep Motion Branch

### Goals

- Start a dedicated `codex/gsap-deep-motion` branch for deeper homepage, project-detail, and About page motion exploration while preserving the current GSAP interaction baseline.
- Follow `docs/GSAP_ANIMATIONS.md`: use `@gsap/react`, ScrollTrigger, and Lenis-backed scroll smoothing with reduced-motion fallbacks.

### Changes

- Added `@gsap/react` and `lenis` dependencies.
- `src/components/smooth-scroll-provider.tsx`: new desktop-only Lenis provider synchronized with GSAP ScrollTrigger; disabled for reduced-motion and coarse-pointer environments.
- `src/app/[locale]/layout.tsx`: wraps the localized app shell in `SmoothScrollProvider`.
- `src/components/gsap-page-motion.tsx`: new page-level motion layer for homepage, About, and project detail pages. It adds scroll-scrub image depth on sticky hero imagery plus staggered section/media/copy reveals.
- `src/app/[locale]/page.tsx`, `src/app/[locale]/about/page.tsx`, and `src/app/[locale]/projects/[slug]/page.tsx`: attach `GsapPageMotion` with page-specific modes.

### Verification

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `git diff --check`: passed.
- `npm run build`: passed.

## 2026-04-24 / Project Detail Route Recovery

### Goals

- Fix the project-detail runtime error seen when entering projects from the homepage animation.
- Give the newly added homepage project tiles the same detail-page treatment as the existing routed projects.
- Prevent stale ScrollTrigger pin state from corrupting the homepage project sequence after route transitions or browser back.

### Changes

- `src/app/[locale]/projects/[slug]/page.tsx`: replaced detail-page `next/image` usage with native image elements so development media-proxy URLs render reliably in the App Router RSC path; added a persistent localized return link back to the project index.
- `src/content/site.ts`: added detail records and slugs for `light-encounter-theater`, `teastone-mixc`, and `meditation-hall-by-the-wetland`.
- `src/components/home-project-intro.tsx`: added ScrollTrigger refresh handling for `pageshow` and `popstate`, and removed the no-op GSAP cleanup return.
- `src/components/project-transition-link.tsx`: clears active ScrollTriggers before route navigation so pinned homepage state does not survive into the detail route.
- `src/app/globals.css`: added return-link styling and native image sizing for the project immersive carousel.

### Verification

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Local detail route smoke checks returned 200 for the existing and newly routed project pages.
- Local media proxy smoke checks returned 200 for the new horizontal and vertical project images.

## 2026-04-28 / Sticky Compact Navigation Prototype

### Goals

- Change the site header from an absolute overlay toward a sticky navigation system.
- Prioritize the mobile behavior: full brand and inline actions at the top of the page, then a 50% height compact state after scrolling.
- In the compact state, replace the company name with the logo and collapse right-side actions into a single menu button that opens a vertical menu.

### Changes

- `src/components/site-header.tsx`: converted the header to a client component that tracks scroll position and toggles compact state.
- `src/components/mobile-menu.tsx`: added a compact mode that renders a menu button and vertical navigation panel, including language switching.
- `src/components/language-switch.tsx`: added a non-`nav` render mode so it can appear inside the compact vertical menu without nested navigation landmarks.
- `src/app/globals.css`: made the header sticky, added compact sizing, logo/wordmark crossfade, and mobile-first compact menu styles.

### Verification

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `git diff --check`: passed.
- `npm run build`: passed.

## 2026-04-28 / Project Index Portrait Tuning

### Goals

- Remove the oversized `项目 / Projects` flash from the homepage scroll-driven project index sequence.
- Improve portrait layout so featured projects fit inside the pinned viewport without oversized card cropping or overlapping text.

### Changes

- `src/components/home-project-intro.tsx`: removed the flash text node and the associated GSAP timeline beats; shortened the ScrollTrigger range so the sequence begins directly with the compact project-index label and cards.
- `src/app/globals.css`: removed flash-text styles and added smaller portrait breakpoints for the project card grid, card scale, copy width, and pinned stage spacing.

### Verification

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Local `/zh` smoke check returned 200.

## 2026-04-28 / Project Index Mobile Flow Fix

### Goals

- Fix portrait project cards stacking into overlapping images and text.
- Use a regular vertical project flow on portrait/mobile screens instead of the pinned GSAP project-index sequence.
- Keep only a quiet fade/blur reveal as newly scrolled project cards enter.

### Changes

- `src/components/home-project-intro.tsx`: added a portrait/mobile media-query guard so the ScrollTrigger timeline is reverted and skipped on narrow or portrait viewports.
- `src/app/globals.css`: changed portrait project pages from absolute stacked panes to normal document flow, with one-column mobile and two-column portrait tablet layouts.
- `src/app/globals.css`: added a lightweight CSS view-timeline reveal for mobile project cards and disabled it under reduced motion.

### Verification

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Local `/zh` smoke check returned 200.
- Mobile 466px viewport full-page screenshot confirmed the project section renders as a normal single-column scroll list without overlapping pages.

## 2026-04-28 / Mobile Project Card Overlay Captions

### Goals

- Tighten the vertical rhythm between mobile project images.
- Move mobile project metadata and titles into the lower-left corner of each image.
- Fix compact scroll menu text disappearing against white page backgrounds.
- Remove excess whitespace above the project index, between the index label and first project image, and between mobile project cards.
- Ensure mobile images fully fill their cards without internal white margins or blur artifacts.
- Let the project owner compare 4:3 and 16:9 mobile project-card proportions directly on the homepage.
- Increase the mobile project image frame width beyond the visible viewport so the viewport crops the frame edges instead of leaving narrow in-column cards.
- Anchor the widened mobile project frame to the viewport left edge instead of clipping from the padded project-shell content box.
- Add a translucent adaptive glass background to the compact scroll menu and expanded menu panel.
- Remove the mobile project card bottom gradient layer that created a visible horizontal split between stacked images.
- Replace the compact menu text label with a three-line hamburger icon.

### Changes

- `src/app/globals.css`: reduced portrait/mobile project-grid gaps, constrained cards to the image width, and overlaid captions with a subtle bottom gradient for legibility.
- `src/app/globals.css`: switched compact header/menu text out of blend mode and onto the page text color.
- `src/app/globals.css`: removed the mobile card scale transform, made the TiltedCard figure and image fill the responsive square card, and changed the mobile reveal from blur/fade to a sharper opacity/translate reveal.
- `src/components/home-project-intro.tsx`: added a mobile-only 4:3 / 16:9 ratio toggle for direct comparison.
- `src/app/globals.css`: switched the mobile card from square to ratio-driven 4:3 / 16:9 landscape layouts and forced project imagery to cover the full card.
- `src/app/globals.css`: widened mobile project frames to `100vw + bleed`, clipped horizontal overflow at the project section, and offset overlay captions back into the visible viewport.
- `src/app/globals.css`: moved mobile horizontal clipping to `.home-featured-shell`, restored visible overflow on `.home-project-intro`, and anchored `.featured-tilted-tile` with `margin-left: calc(50% - 50vw)`.
- `src/app/globals.css`: replaced the frame-width control with `--mobile-card-side-bleed`, which expands the project frame equally past both viewport edges and keeps the caption inset inside the visible area.
- `src/app/globals.css`: moved the compact glass treatment to the full `.site-header.is-compact::before` bar using React Bits GlassSurface-style fallback values (`color-mix`, `backdrop-filter`, saturation, and inset highlights).
- `src/app/globals.css`: removed the mobile project card bottom gradient layer and kept captions readable with text shadow.
- `src/components/mobile-menu.tsx`: replaced the compact menu text with a semantic hamburger icon while preserving accessible labels.

### Verification

- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Local `/zh` smoke check returned 200.
- Mobile 466px viewport screenshot confirmed project captions render inside the image lower-left corner, cards have tighter vertical spacing, images fill the card, and the final card is no longer blurred.
- Mobile 466px viewport screenshots were captured for both 4:3 and 16:9 ratio states.
- Mobile 466px viewport screenshot confirmed the widened frame approach reduces visible side margin by cropping the oversized frame through the viewport.
- Mobile 466px viewport screenshot confirmed the project image frame now reaches the viewport left edge.
- Mobile 466px viewport screenshot confirmed the project card bottom gradient layer is gone.

## 2026-04-28 / Tailwind and shadcn Incremental Integration

### Goals

- Introduce Tailwind and shadcn as an additive component layer without rewriting the existing global CSS system.
- Keep existing pages stable by avoiding Tailwind Preflight during the first integration pass.
- Enable React Bits / shadcn registry components for higher-quality motion and glass UI work.
- Replace the hand-built compact header glass background with an adapted React Bits GlassSurface component.

### Changes

- `package.json` / `package-lock.json`: added Tailwind v4, PostCSS, shadcn utility dependencies, Radix slot, class variance utilities, `lucide-react`, `clsx`, and `tailwind-merge`.
- `postcss.config.mjs`: added the Tailwind v4 PostCSS plugin.
- `components.json`: added shadcn configuration for the current Next App Router project, using existing `@/*` aliases and registering the React Bits registry.
- `src/app/globals.css`: imported Tailwind `theme.css` and `utilities.css` only; intentionally skipped `preflight.css` to avoid resetting the existing hand-built site styles.
- `src/app/globals.css`: mapped shadcn/Tailwind semantic color tokens to the existing Mist variables (`--paper`, `--page-ink`, `--hairline`, `--muted`).
- `src/lib/utils.ts`: added the standard `cn()` helper for shadcn/Tailwind class composition.
- `src/components/react-bits/glass-surface.tsx` and `glass-surface.module.css`: adapted the React Bits GlassSurface registry component into TypeScript and CSS Modules so it can be safely imported in the App Router without global CSS leakage.
- `src/components/site-header.tsx`: renders GlassSurface as the full compact-header background layer.

### Verification

- `npx shadcn@latest info --json`: detected Next App Router, Tailwind v4, existing aliases, `src/app/globals.css`, and the React Bits registry.
- `npm run typecheck`: passed.
- `npm run lint`: passed.
- `git diff --check`: passed.
- `npm run build`: passed.
- Local smoke checks returned 200 for `/zh`, `/en`, `/zh/about`, and `/zh/projects/dream-factory-experimental-theater`.
- Mobile 466px viewport screenshot confirmed the homepage still renders after Tailwind/shadcn integration.

### Notes

- Tailwind Preflight remains disabled for now. This keeps the existing page typography, image defaults, buttons, and layout reset from changing unexpectedly.
- `npm install` reported existing moderate audit findings; no automatic audit fix was run to avoid broad dependency churn.

## 2026-04-28 / Compact Menu Icon Swap

### Goals

- Replace the compact navigation text button with a quieter animated icon swap.
- Keep the compact menu trigger visible while the menu is open instead of replacing the whole trigger with the menu panel.
- Avoid a strong boxed button treatment while preserving the full-width translucent header glass.

### Changes

- `src/components/mobile-menu.tsx`: added a compact-only persistent menu trigger that swaps between Lucide `Menu` and `X` icons using the Transitions.dev blur/scale pattern.
- `src/components/mobile-menu.tsx`: renders the compact menu panel separately under the persistent trigger and closes the panel when a navigation item is selected.
- `src/app/globals.css`: added reusable `.t-icon-swap` animation styles, reduced-motion handling, and non-boxed compact trigger focus styling.
- `src/components/site-header.tsx`: disabled GlassSurface channel displacement for the compact header so the top bar keeps the glass blur without colorful image warping.

## 2026-04-29 / Header simplification, footer restore, project index rebuild

### Goals

- Drop scroll-driven compact navigation in favor of a single half-height sticky bar.
- Reserve a header slot so the home hero stays full-screen below the nav instead of overflowing.
- Replace the bilingual language toggle with a single-link switch.
- Restore the footer (with the work-in-progress notice) below all home content.
- Remove the GSAP-pinned project index sequence; show all featured projects in a responsive grid with scroll-fade reveal and pointer parallax. Disable navigation into project detail routes for now.

### Changes

- `src/components/site-header.tsx`: static sticky header, no scroll listener, no compact state, brand wordmark only.
- `src/components/mobile-menu.tsx`: removed compact branch; only inline nav and burger-expand paths remain.
- `src/components/language-switch.tsx`: single anchor that links to the opposite locale and shows the target label.
- `src/components/site-footer.tsx`: added work-in-progress line above the existing meta row.
- `src/components/home-project-intro.tsx`: replaced GSAP pin/scrub timeline with a simple labeled section.
- `src/components/featured-project-field.tsx`: removed paged tilted-card layout; tiles now use `MotionReveal` for scroll-fade and pointer-driven CSS variables for parallax + scale on hover. Project detail links disabled (no `<a>` wrappers) so tiles are non-interactive for navigation.
- `src/app/globals.css`: hoisted `--header-height` to `:root`; switched home hero/spacer/overlay heights to `calc(100svh - var(--header-height))`; replaced featured-project-field/featured-tilted CSS with `.project-index-grid` system (1 col default, 2 cols on `min-aspect-ratio: 16/9`); added borderless translucent header and language switch styling; pruned compact-related rules; tightened home project index vertical padding.

### Verification

- `npm run typecheck`: passed.
- `npm run lint`: passed.
