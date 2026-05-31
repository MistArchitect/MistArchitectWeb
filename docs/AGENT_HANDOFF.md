# Mist Architect Agent Handoff

Last updated: 2026-05-31, Asia/Shanghai.

This handoff is the source-of-truth briefing for developers and coding agents
taking over the Mist Architect / 岚·建筑设计 website. It summarizes the current
repo shape, active runtime model, deployment state, and known open decisions.

## 1. Current Project State

- Project: bilingual architecture portfolio for 岚·建筑设计 / MIST Architects.
- Current implementation: lean code-managed website. No active CMS/admin
  surface is included in the build.
- Framework: Next.js App Router, React, TypeScript.
- Build output: Next.js standalone server via `output: "standalone"` in
  `next.config.ts`.
- Styling: hand-authored global CSS with CSS variables. Tailwind, shadcn, and
  React Bits leftovers have been removed from the active build.
- Motion: `motion/react` for UI transitions, GSAP ScrollTrigger + Lenis for
  scroll polish.
- Media: Alibaba Cloud OSS public origin is the active media base.
- Tests: `typecheck`, `lint`, `build`, and Playwright Chromium smoke tests.

Persistent Git branches:

```text
main
preview/home-featured-projects
```

- `main` is the canonical latest approved source branch.
- `preview/home-featured-projects` is the GitHub Actions preview deployment
  branch.
- Temporary agent branches/worktrees should be deleted after merge,
  abandonment, or replacement.

GitHub remote:

```text
origin https://github.com/MistArchitect/MistArchitectWeb.git
```

## 2. Active Routes and Content Model

Localized route prefixes:

```text
/zh
/en
```

Current public surfaces:

- `/zh`, `/en`: homepage with full-screen hero carousel and interactive
  project index.
- `/zh/about`, `/en/about`: about/studio page.
- `/zh/projects`, `/en/projects`: project archive.
- `/zh/projects/[slug]`, `/en/projects/[slug]`: project detail route.
- `/zh/journal`, `/en/journal`: journal index with hash anchors per entry.

Content is managed in:

```text
src/content/site.ts
```

The content adapter is intentionally simple:

```text
src/lib/content.ts
```

It returns local seed data directly. The former Sanity CMS, Studio route, GROQ
queries, schemas, and related env vars have been removed.

Project-detail state:

- `field-academy` / WILD WORKSHOP is the only project with complete detail
  material and sectioned narrative content.
- All other project detail routes intentionally use a fallback detail state:
  full-screen cover/carousel, a concise "Project details are in development."
  message, and a return link to the homepage project index.
- Do not auto-generate fake project sections for projects that lack real
  material.

Journal hash state:

- Journal cards link to `/journal#<entry.slug>`.
- Each journal entry article now owns a matching `id`, so hash links can be
  shared and land on the intended entry.

## 3. Important Files

```text
AGENTS.md                              Agent rules and local verification
README.md                              Project overview and run commands
DESIGN.md                              Visual and interaction direction
docs/RELEASE_WORKFLOW.md              Local -> Preview -> Production flow
docs/CICD.md                           GitHub Actions and deployment notes
docs/IMAGE_PIPELINE.md                 OSS image pipeline and CDN guard rails
docs/DEPLOYMENT_PLAN.md                Alibaba Cloud architecture plan
docs/DEVELOPMENT_LOG.md                Chronological implementation log

src/app/[locale]/page.tsx              Homepage route
src/app/[locale]/about/page.tsx        About route
src/app/[locale]/projects/[slug]/page.tsx
                                         Project detail full/fallback rendering
src/app/[locale]/journal/page.tsx      Journal route
src/components/featured-project-field.tsx
                                         Homepage project index tiles
src/components/journal-list.tsx        Journal hash targets and images
src/components/oss-picture.tsx         Responsive OSS <picture> wrapper
src/lib/media.ts                       OSS URL, layout, and compression helpers
src/app/globals.css                    Global visual system and page layouts

.github/workflows/ci.yml               Typecheck/lint/build/e2e workflow
.github/workflows/deploy-preview.yml   Preview build and ECS deploy workflow
playwright.config.ts                   Playwright Chromium smoke setup
tests/e2e/home.spec.ts                 Homepage/project/journal smoke tests
```

## 4. Local Development and Verification

Use the project Node version through nvm:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
npm install
npm run dev
```

Local URLs:

```text
http://localhost:3000/zh
http://localhost:3000/en
```

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

Current Playwright coverage is intentionally smoke-level. Local runs start the
Next.js dev server; CI runs against the standalone production server after
`npm run build`.

Covered routes/states:

- `/zh` and `/en` homepage identity.
- Incomplete project fallback state.
- `field-academy` complete-detail state.
- Journal hash anchor behavior.

## 5. GitHub Actions

### CI

File:

```text
.github/workflows/ci.yml
```

Triggers:

```text
push to main
pull_request targeting main
```

Steps:

```text
npm ci
npm run typecheck
npm run lint
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
```

This workflow does not deploy. Playwright runs against `npm run
start:standalone` in CI, so it verifies the built app artifact rather than a
dev-server-only surface.

### Deploy Preview

File:

```text
.github/workflows/deploy-preview.yml
```

Triggers:

```text
push to preview/home-featured-projects
workflow_dispatch
```

The workflow builds the standalone Next.js release, uploads it to ECS, promotes
only the preview symlink/process, and runs ECS-local plus authenticated public
preview smoke checks. It does not currently run the Playwright e2e suite, so
keep CI passing before updating the preview branch.

Required GitHub secrets:

```text
ALIYUN_ECS_HOST
ALIYUN_ECS_USER
ALIYUN_ECS_PORT
ALIYUN_ECS_SSH_KEY
PREVIEW_AUTH_USER
PREVIEW_AUTH_PASSWORD
```

Never commit or echo secret values into docs or logs.

## 6. Deployment State

Provider:

```text
Alibaba Cloud ECS
```

Host:

```text
47.106.120.253
```

Runtime:

- OS: Ubuntu 22.04 LTS based setup.
- Node: `24.14.1` under the `deploy` user via nvm.
- Process manager: PM2.
- Web server: Nginx.
- App user: `deploy`.

Public hosts:

```text
https://mist-arch.com
https://preview.mist-arch.com  (Basic Auth protected)
```

Current release pointers as of this handoff:

```text
Preview release:    20260531150039-b41fc1f
Production release: 20260531150039-b41fc1f
```

ECS directory layout:

```text
/srv/mist-architect/
  releases/
  shared/
    current-preview-release.txt
    current-production-release.txt
    public/
  current-preview -> /srv/mist-architect/releases/<release-id>
  current-production -> /srv/mist-architect/releases/<release-id>
```

PM2 process shape:

```text
mist-preview     127.0.0.1:3001
mist-production  127.0.0.1:3002
```

Production promotion remains manual. Do not deploy an uncommitted local dirty
worktree to production, and do not promote production before the exact preview
release has been deployed and approved.

## 7. Media and CDN State

Active media base:

```text
https://mist-architects-media.oss-cn-shenzhen.aliyuncs.com
```

`src/lib/media.ts` resolves bucket-relative paths against this OSS origin by
default. In local development, the default OSS origin is proxied through
`/api/media` unless `NEXT_PUBLIC_DISABLE_MEDIA_PROXY=1` is set, so local ports
outside the OSS Referer whitelist still load images.

Current media coverage:

- Homepage hero and project index images use OSS.
- About hero/founder imagery uses OSS.
- Splash logo uses OSS.
- `field-academy` project detail imagery uses OSS under
  `projects/field-academy/`.
- Journal entries still use Unsplash placeholder images. Migrate them to OSS
  when final journal imagery is available.

Reserved CDN media host:

```text
https://media.mist-arch.com
```

CDN recommendation:

- Keep `NEXT_PUBLIC_MEDIA_BASE` unset while the raw OSS origin is active.
- Do not flip to `https://media.mist-arch.com` until Alibaba Cloud CDN is open,
  HTTPS is bound, DNS CNAME points at the CDN target, and `next.config.ts`
  `images.remotePatterns` includes `media.mist-arch.com` for any remaining
  `next/image` surfaces.
- Make the CDN domain, env var, and Next image allow-list changes in the same
  previewed release to avoid broken optimized images.

## 8. Environment Variables

Currently expected public variables:

```text
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_ICP_LICENSE
```

Optional media variables:

```text
NEXT_PUBLIC_MEDIA_BASE
NEXT_PUBLIC_DISABLE_MEDIA_PROXY
```

Only set `NEXT_PUBLIC_ICP_LICENSE` after the project owner provides the real
ICP filing value. Do not invent one.

## 9. Known Open Tasks

- Add complete project-detail material for projects other than `field-academy`.
- Replace journal Unsplash placeholder images with OSS-hosted project/studio
  imagery.
- Decide when to activate `media.mist-arch.com` CDN and make the env/config
  flip as a single previewed change.
- Consider whether `deploy-preview.yml` should also run Playwright e2e tests,
  or keep e2e limited to `ci.yml` for faster preview deployments.
- Keep production promotion manual until the project owner approves an
  automated release policy.
- Update release IDs in this file and `docs/CICD.md` whenever preview or
  production is promoted.

## 10. Operational Rules

- Preview remains Basic Auth protected.
- Public `8080/tcp` stays closed.
- Do not expose secrets, SSH keys, tokens, or Basic Auth credentials.
- Do not revert user or other-agent changes unless explicitly asked.
- Prefer scoped changes over broad refactors.
- Update `docs/DEVELOPMENT_LOG.md` for meaningful implementation, deployment,
  infrastructure, or workflow changes.
