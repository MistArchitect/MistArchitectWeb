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
