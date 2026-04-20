# Mist Architect Development Log

This log is written for both human developers and future coding agents. Keep entries
short, dated, and implementation-oriented so the next contributor can understand what
changed, why it changed, how it was checked, and what remains open.

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
