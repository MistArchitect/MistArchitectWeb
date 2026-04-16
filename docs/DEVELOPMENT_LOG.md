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
