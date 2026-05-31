# Mist Architect

Mist Architect is the bilingual portfolio website for 岚·建筑设计 / MIST
Architects. The current build is intentionally lean: content is managed in code,
imagery is served from Alibaba Cloud OSS, and releases run on Alibaba Cloud ECS
as a Next.js standalone server.

## Stack

- Next.js App Router, React, and TypeScript
- Hand-authored global CSS with CSS variables
- `motion/react` for splash, menu, hero, and reveal motion
- GSAP ScrollTrigger plus Lenis for desktop scroll polish
- Alibaba Cloud OSS responsive image delivery with AVIF/WebP/JPG `<picture>`
  output
- Playwright Chromium smoke tests
- GitHub Actions CI and protected preview deployment

The active build does not include a CMS, Sanity Studio, Tailwind, shadcn, or
React Bits runtime layer.

## Routes

```text
/zh
/en
/zh/about
/en/about
/zh/projects
/en/projects
/zh/projects/[slug]
/en/projects/[slug]
/zh/journal
/en/journal
```

`field-academy` / WILD WORKSHOP is the only project with complete detail
material today. Other project detail pages intentionally show the project
cover image or carousel, a short in-development line, and a return link to the
project index.

The About contact section includes email, phone, office address, WeChat public
account, and WeChat Channels. Clicking the WeChat public account opens the QR
code stored at `public/20260531-191007.jpeg`.

## Local Development

Use the project Node version through nvm:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
npm install
npm run dev
```

Local routes:

```text
http://localhost:3000/zh
http://localhost:3000/en
```

## Verification

Before committing code changes:

```bash
npm run typecheck
npm run lint
npm run test:e2e
git diff --check
```

Run `npm run build` when changes touch routing, Next.js config, media handling,
environment variables, or deployment behavior.

The first local Playwright run may need:

```bash
npx playwright install chromium
```

Local Playwright runs against the Next.js dev server. CI runs the same tests
against the standalone production server after `npm run build`.

## Content and Media

Site content is managed in:

```text
src/content/site.ts
```

The content adapter is:

```text
src/lib/content.ts
```

Images referenced from code should use bucket-relative OSS paths and flow
through `src/lib/media.ts` / `src/components/oss-picture.tsx` where possible.
The active media origin is:

```text
https://mist-architects-media.oss-cn-shenzhen.aliyuncs.com
```

`NEXT_PUBLIC_MEDIA_BASE` is supported as a future CDN/custom-origin override.
Leave it unset while the raw OSS origin is active. Do not switch to
`https://media.mist-arch.com` until Alibaba Cloud CDN, HTTPS, DNS, and the
Next image allow-list are changed together.

## Environment

Public variables:

```text
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_ICP_LICENSE
```

Optional media variables:

```text
NEXT_PUBLIC_MEDIA_BASE
NEXT_PUBLIC_DISABLE_MEDIA_PROXY
```

Only set `NEXT_PUBLIC_ICP_LICENSE` after the real ICP filing value is provided.

## Release Workflow

Persistent branches:

```text
main
preview/home-featured-projects
```

Release flow:

1. Develop and verify locally.
2. Commit the reviewed source on `main`.
3. Update `preview/home-featured-projects` to the exact reviewed commit and
   push it.
4. Let GitHub Actions deploy the protected preview.
5. Promote the exact deployed preview release to production after approval.

Preview and production:

```text
https://preview.mist-arch.com
https://mist-arch.com
```

See `docs/RELEASE_WORKFLOW.md`, `docs/CICD.md`, and
`docs/AGENT_HANDOFF.md` before changing deployment behavior.

## Project Notes

- `AGENTS.md` is the entry file for coding agents.
- `DESIGN.md` defines the current visual and interaction direction.
- `docs/IMAGE_PIPELINE.md` documents OSS image processing and CDN guard rails.
- `docs/DEVELOPMENT_LOG.md` records implementation and deployment history.
