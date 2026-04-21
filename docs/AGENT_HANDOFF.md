# Mist Architect Agent Handoff

Last updated: 2026-04-22, Asia/Shanghai (OSS security + CDN readiness refresh)

This document is for another coding agent or developer taking over the current prototype work. It summarizes the local repository state, the active Alibaba Cloud deployment, and the operational commands needed to continue safely.

## 1. Current Project State

- Project: Mist Architect / 岚·建筑设计 website.
- Framework: Next.js App Router, React, TypeScript.
- Build mode: Next.js standalone output via `output: "standalone"` in `next.config.ts`.
- Current local branch: `preview/home-featured-projects`.
- GitHub remote:
  - `origin`: `https://github.com/MistArchitect/MistArchitectWeb.git`
- Important: branch is clean and up to date with `origin/preview/home-featured-projects` as of 2026-04-20. GitHub now matches the current preview source state.

Current focus:

- Prototype website for client review.
- Bilingual Chinese/English route structure: `/zh`, `/en`, `/zh/about`, `/en/about`, etc.
- Homepage has full-screen image carousel, manual controls, dot navigation, captions, and static featured project tiles.
- About page is active and uses the `岚` section naming.
- Project detail pages are prototype/mock-detail pages following the MUJI HOTEL Shenzhen interaction reference.
- CMS is not connected in the current phase.
- OSS image delivery is live for the homepage hero, featured project tiles, about page imagery, and splash logo. Remaining migration work is mainly project detail pages / journal content that still reference local `/images/home/*` paths.

## 2. Key Recent Frontend Features

Homepage:

- Full-screen image carousel at the top.
- Left/right manual navigation.
- Dot navigation at the bottom.
- Manual carousel actions reset the autoplay timer.
- Left and right carousel hit areas each cover roughly 30% of the hero image.
- The visible arrow control is a 60px × 1.5px semi-transparent vertical line; on hover the line animates into a `‹` or `›` chevron via two-half rotation (±22°).
- Active carousel caption is content-driven from `src/content/site.ts`, not inferred from filenames.
- Featured project tiles are currently non-clickable during prototype review.
- Featured tile text format is:

```text
year · location
project name
```

About page:

- Primary navigation currently only exposes `关于`.
- About page internal intro section is labeled `岚` in Chinese and `Mist` in English.
- About page hero is a 4-slide full-bleed crossfade carousel rendered by `src/components/about-hero-carousel.tsx`. It renders plain `<img>` tags against raw OSS origin URLs (no `x-oss-process`, no `<picture>` srcset) because the master files are already <400KB each. CSS cycle is 20s with a 5s stagger; slide lifetime 6s produces a 1s crossfade overlap between adjacent slides. Viewport aspect <= 3/4 swaps to the vertical image set (`about/vertical/about-v*.jpeg`); wider viewports use the horizontal set (`about/horizontal/about-h*.jpeg`).
- Founder image and founder metadata are rendered from `src/content/site.ts`.

Splash:

- Opening logo splash resolves the logo via `mediaUrl("LOGO/logo.png")`, defaulting to the Alibaba Cloud OSS public origin unless `NEXT_PUBLIC_MEDIA_BASE` points at a future CDN/custom media domain.
- Splash is session-aware through `sessionStorage`.
- The latest change slowed the splash timing by 35%.
- Reduced-motion users still get a short animation.

## 3. Important Local Files

- `src/content/site.ts`
  - Main seed content for navigation, homepage captions, about content, project data, and mock project detail data.
- `src/components/hero.tsx`
  - Homepage carousel behavior, manual navigation, autoplay reset.
- `src/components/intro-splash.tsx`
  - Opening logo splash behavior and timing.
- `src/components/site-header.tsx`
  - Header brand and primary navigation.
- `src/components/language-switch.tsx`
  - Route-preserving Chinese/English switch.
- `src/components/project-card.tsx`
  - Project tile rendering, including static featured tile mode.
- `src/lib/media.ts`
  - OSS URL helper, `pictureSet()` builder, `LAYOUTS` + `COMPRESSION` presets, `AVIF_MAX_WIDTH` cap.
- `src/components/oss-picture.tsx`
  - `<OssPicture>` wrapper that renders AVIF + WebP + JPG `<picture>` sources from a layout preset.
- `docs/IMAGE_PIPELINE.md`
  - Image pipeline spec — bucket layout, OSS IMG limits, quality matrix, layout presets, byte benchmarks, workflow.
- `src/app/[locale]/page.tsx`
  - Homepage layout and featured project mapping.
- `src/app/[locale]/about/page.tsx`
  - About page layout.
- `src/app/[locale]/projects/[slug]/page.tsx`
  - Project detail page interaction and mock content rendering.
- `src/app/globals.css`
  - Global visual system, hero controls, splash, about layout, project detail layout.
- `DESIGN.md`
  - Design rules and interaction decisions.
- `docs/DEVELOPMENT_LOG.md`
  - Chronological development log.
- `docs/DEPLOYMENT_PLAN.md`
  - Longer-term Alibaba Cloud deployment plan.
- `docs/CICD.md`
  - GitHub Actions CI/CD operating notes, including workflow purposes, required secrets, deploy flow, and the difference between `Re-run all jobs` and `Run workflow`.
- `.github/workflows/deploy-preview.yml`
  - GitHub Actions preview-only deployment workflow. It is currently manual (`workflow_dispatch`) until deploy secrets are configured and the first manual run is verified.

## 4. Current Alibaba Cloud Deployment

Provider:

- Alibaba Cloud ECS.
- Public IP: `47.106.120.253`.
- Production URL: `https://mist-arch.com/zh`.
- English production URL: `https://mist-arch.com/en`.
- Current preview URL: `https://preview.mist-arch.com/zh` (Basic Auth required).
- English preview URL: `https://preview.mist-arch.com/en` (Basic Auth required).

SSH:

```bash
ssh -i "$HOME/.ssh/mist_aliyun_ed25519" -o IdentitiesOnly=yes deploy@47.106.120.253
```

Runtime:

- OS: Ubuntu 22.04 LTS based setup.
- Node: `24.14.1`, installed under the `deploy` user via nvm.
- Process manager: PM2.
- Web server: Nginx.
- App process user: `deploy`.

Directory layout:

```text
/srv/mist-architect/
  releases/
  shared/
    current-preview-release.txt
    current-release.txt
  current-preview -> /srv/mist-architect/releases/20260421161312-3217212
  current-production -> /srv/mist-architect/releases/20260420194149-f176d9d
```

Latest preview release:

```text
20260421161312-3217212
```

Recent release folders on ECS:

```text
20260421161312-3217212
20260420194149-f176d9d
20260420185834-f176d9d
20260419132134-scrollhint-above-caption
20260419041212-header-swipe-scrollhint
20260418234908-about-contact-email-only
20260418230518-about-carousel-crossfade
20260418225425-about-aspect-carousel
20260418211649-hero-band-dedup (stalled mid-rsync; never promoted)
20260418205813-hero-aspect-masters
20260418152449-hero-multi-aspect
20260418145101-hero-contain
20260418143430-quality-slides
20260418142159-hero-eager
20260418135624-img-pipeline
20260418003750-oss-cutover
20260417030911-hero-line-arrows
20260417012030-hero-hotspots-splash
20260416163941-about-featured-type
20260416154811-hero-controls-lang
20260416152348-home-static-featured
20260416025250-about-no-dividers
20260416024633-caption-about-lines
20260416022338-home-captions
20260416004224-optimized-images
20260415230115-local
```

PM2 current state:

```text
mist-preview     online   port 3001 through HOSTNAME=127.0.0.1 PORT=3001
mist-production  online   port 3002 through HOSTNAME=127.0.0.1 PORT=3002
```

Production is online.

The latest checked PM2 process path on 2026-04-21 was:

```text
/srv/mist-architect/releases/20260421161312-3217212/server.js
```

## 5. Current Nginx Routing

Enabled config:

```text
/etc/nginx/sites-enabled/mist-architect
  -> /etc/nginx/sites-available/mist-architect
```

Current behavior:

- `https://mist-arch.com`: canonical production host, proxies to `127.0.0.1:3002`.
- `https://www.mist-arch.com`: redirects to `https://mist-arch.com`.
- `https://mist.archi` and `https://www.mist.archi`: redirect to `https://mist-arch.com`.
- `https://hilarchitects.com` and `https://www.hilarchitects.com`: redirect to `https://mist-arch.com`.
- `https://preview.mist-arch.com`: internal preview host, protected by Nginx Basic Auth, proxies to `127.0.0.1:3001`, and sends `X-Robots-Tag: noindex`.
- Public `8080/tcp` is closed in the Alibaba Cloud security group. The old IP preview bypass should not be reachable.
- `/_next/static/` has 30-day immutable-ish static cache headers.
- HTTPS is handled by Certbot / Let's Encrypt certificate `mist-arch.com`, currently covering `mist-arch.com`, `www.mist-arch.com`, `preview.mist-arch.com`, `mist.archi`, `www.mist.archi`, `hilarchitects.com`, and `www.hilarchitects.com`.

Relevant Nginx shape:

```nginx
server {
    listen 443 ssl;
    server_name mist-arch.com;

    location / {
        proxy_pass http://127.0.0.1:3002;
    }
}

server {
    listen 443 ssl;
    server_name www.mist-arch.com mist.archi www.mist.archi hilarchitects.com www.hilarchitects.com;
    return 301 https://mist-arch.com$request_uri;
}

server {
    listen 443 ssl;
    server_name preview.mist-arch.com;
    auth_basic "Mist Architect Preview";
    auth_basic_user_file /etc/nginx/.htpasswd-mist-preview;
    add_header X-Robots-Tag "noindex" always;

    location / {
        proxy_pass http://127.0.0.1:3001;
    }
}

server {
    listen 80;
    server_name mist-arch.com www.mist-arch.com preview.mist-arch.com mist.archi www.mist.archi hilarchitects.com www.hilarchitects.com;
    return 301 https://$host$request_uri;
}
```

Security group expectation:

- Inbound `80/tcp` remains open for HTTP-to-HTTPS redirects and Let's Encrypt renewal.
- Inbound `443/tcp` remains open for production and protected preview.
- Inbound `8080/tcp` is closed.
- Inbound `22/tcp` is needed for SSH deploy/admin access.
- App ports `3001` and `3002` should not be publicly exposed.

## 6. Local Verification Commands

Use nvm before npm commands in this local shell:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
npm run lint
npm run build
git diff --check
```

The latest verified build generated 20 static pages.

## 7. Preview Deployment Procedure

### GitHub Actions preview deployment

Detailed CI/CD notes are maintained in:

```text
docs/CICD.md
```

The repository now contains a preview-only deployment workflow:

```text
.github/workflows/deploy-preview.yml
```

Current behavior:

- Manual trigger only through GitHub Actions `workflow_dispatch`.
- Builds on GitHub-hosted Ubuntu runner.
- Runs `npm ci`, `npm run typecheck`, `npm run lint`, and `npm run build`.
- Uploads the Next.js standalone output to `/srv/mist-architect/releases/<timestamp>-<sha>/`.
- Switches `/srv/mist-architect/current-preview`.
- Restarts PM2 process `mist-preview` on `127.0.0.1:3001`.
- Smoke-checks `/zh`, `/en`, and `/zh/about` through `https://preview.mist-arch.com` with Basic Auth.
- Does not touch `mist-production`.

Required GitHub Secrets before first run:

```text
ALIYUN_ECS_HOST      47.106.120.253
ALIYUN_ECS_USER      deploy
ALIYUN_ECS_PORT      22
ALIYUN_ECS_SSH_KEY   private SSH key matching deploy user's authorized_keys
PREVIEW_AUTH_USER    Basic Auth username for preview smoke checks
PREVIEW_AUTH_PASSWORD Basic Auth password for preview smoke checks
```

`ALIYUN_ECS_USER` and `ALIYUN_ECS_PORT` have workflow defaults (`deploy`,
`22`), but setting them explicitly is clearer.

After one manual deployment is verified, the commented `push` trigger in the
workflow can be enabled for automatic preview deployment from
`preview/home-featured-projects`.

### Manual fallback

Build locally:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
npm run lint
npm run build
git diff --check
```

Deploy a new preview release:

```bash
release_id="$(date +%Y%m%d%H%M%S)-short-description"
ssh_key="$HOME/.ssh/mist_aliyun_ed25519"
ssh_target="deploy@47.106.120.253"
remote_dir="/srv/mist-architect/releases/$release_id"

ssh -i "$ssh_key" -o IdentitiesOnly=yes "$ssh_target" "mkdir -p '$remote_dir'"

rsync -az --delete -e "ssh -i $ssh_key -o IdentitiesOnly=yes" \
  .next/standalone/ "$ssh_target:$remote_dir/"

rsync -az --delete -e "ssh -i $ssh_key -o IdentitiesOnly=yes" \
  .next/static/ "$ssh_target:$remote_dir/.next/static/"

rsync -az --delete -e "ssh -i $ssh_key -o IdentitiesOnly=yes" \
  public/ "$ssh_target:$remote_dir/public/"

ssh -i "$ssh_key" -o IdentitiesOnly=yes "$ssh_target" "
  ln -sfn '$remote_dir' /srv/mist-architect/current-preview &&
  echo '$release_id' > /srv/mist-architect/shared/current-preview-release.txt &&
  cd /srv/mist-architect/current-preview &&
  export NVM_DIR=\$HOME/.nvm &&
  . \$NVM_DIR/nvm.sh &&
  pm2 delete mist-preview >/dev/null 2>&1 || true;
  cd /srv/mist-architect/current-preview &&
  export NVM_DIR=\$HOME/.nvm &&
  . \$NVM_DIR/nvm.sh &&
  HOSTNAME=127.0.0.1 PORT=3001 NODE_ENV=production pm2 start server.js --name mist-preview --update-env &&
  pm2 save &&
  pm2 status --no-color
"
```

Smoke check:

```bash
curl -fsS https://mist-arch.com/zh >/dev/null
curl -fsS https://mist-arch.com/en >/dev/null
curl -fsS -u 'MIST:<preview-password>' https://preview.mist-arch.com/zh >/dev/null
```

Check PM2:

```bash
ssh -i "$HOME/.ssh/mist_aliyun_ed25519" -o IdentitiesOnly=yes deploy@47.106.120.253 \
  "export NVM_DIR=\$HOME/.nvm; . \$NVM_DIR/nvm.sh; pm2 status --no-color"
```

## 8. Production Status and Launch Notes

Production is not active.

Current production-related state:

- `mist-production` PM2 process is online.
- `/srv/mist-architect/current-production` points to `20260420194149-f176d9d`.
- Canonical production domain is `https://mist-arch.com`.
- User confirmed ICP filing is complete.
- DNS is managed in Alibaba Cloud DNS.
- HTTPS is active through Certbot / Let's Encrypt.
- Preview is protected by Basic Auth at `https://preview.mist-arch.com`.
- Public `8080/tcp` is closed.

Before future production changes:

1. Deploy and verify in preview first.
2. Promote the exact approved release to `mist-production`.
3. Run smoke checks on production domain.
4. Keep preview protected and `8080/tcp` closed.

### OSS security and CDN checklist

The OSS bucket `mist-architects-media` is public-read because the
browser loads image objects directly. It now has baseline production
protection, but CDN is not active yet.

Completed on 2026-04-22:

1. **Bucket Referer whitelist.** `AllowEmptyReferer=false`.
   Allowed Referers are:
   `https://mist-arch.com`, `https://www.mist-arch.com`,
   `https://preview.mist-arch.com`, `https://mist.archi`,
   `https://www.mist.archi`, `https://hilarchitects.com`,
   `https://www.hilarchitects.com`, `http://localhost:3000`,
   and `http://127.0.0.1:3000`.
2. **No CORS rule.** Deliberately unset. Plain `<img>` / `<picture>`
   loading does not need cross-origin XHR permissions.
3. **Bucket versioning.** Enabled so accidental overwrites can be
   recovered.
4. **Runtime check.** Direct no-Referer GET for
   `LOGO/logo.png` returns 403; production Referer GET returns 200;
   `https://mist-arch.com/zh` returns 200.

Still open:

1. **CDN service activation.** Alibaba Cloud CLI currently returns
   `CdnServiceNotFound`, so the account must open Alibaba Cloud CDN
   service in the console before a CDN domain can be created.
2. **Media CDN domain.** Use `media.mist-arch.com` as the CDN domain
   with OSS bucket origin `mist-architects-media.oss-cn-shenzhen.aliyuncs.com`.
   The hostname is pre-registered in `next.config.ts`.
3. **HTTPS on media domain.** Bind a certificate for
   `media.mist-arch.com` in CDN / Certificate Service.
4. **DNS CNAME.** After CDN returns its CNAME target, add Alibaba DNS
   record `media.mist-arch.com CNAME <cdn-target>`.
5. **Environment flip.** Set `NEXT_PUBLIC_MEDIA_BASE=https://media.mist-arch.com`,
   rebuild, deploy preview, then promote after visual verification.
6. **CDN cache and hotlink rules.** Configure long cache for processed
   image URLs and mirror the Referer whitelist at the CDN layer. Do
   not use same-name overwrites for public images once long cache is
   active; upload a new filename or refresh CDN cache explicitly.
7. **Lifecycle / logs / RAM scoping.** Add lifecycle rules, OSS access
   logging, and a dedicated RAM user for upload/delete operations when
   the media workflow stabilizes.

## 9. Known Constraints and Risks

- The ECS is the low-cost Alibaba Cloud economy instance. Keep builds local when possible.
- ECS bandwidth is limited, but homepage/about/splash media now loads from OSS instead of the ECS app bundle. Remaining large-media risk is any local project-detail or journal imagery until those surfaces are moved to OSS.
- Do not further compress homepage hero masters without approval. The user already noted visible quality loss in an earlier local compression pass; current image quality should be controlled through OSS IMG presets in `src/lib/media.ts` and documented in `docs/IMAGE_PIPELINE.md`.
- OSS bucket `mist-architects-media` (cn-shenzhen) is provisioned and seeded with the lossless HD image tree from `assets/for_OSS/` (moved out of `public/` on 2026-04-18 so the 353 MB of masters no longer rsync to ECS on every deploy — the folder is a local upload staging dir only, not a web asset). Public endpoint: `https://mist-architects-media.oss-cn-shenzhen.aliyuncs.com/`. Frontend resolves hero, featured, about, and splash-logo images through `mediaUrl()` / `pictureSet()` (see `src/lib/media.ts`), with the base URL overridable via `NEXT_PUBLIC_MEDIA_BASE`. **The full OSS IMG pipeline is now live**: `<OssPicture>` (`src/components/oss-picture.tsx`) renders AVIF + WebP + JPG sources via `<picture>`, sized by layout preset (`hero-landscape` 1280–3840w, `feature` 640–1920w, etc.), compressed by quality tier (`high`/`std`/`low`/`raw`). AVIF rungs cap at 2560w to stay under OSS's AVIF pixel ceiling. Bucket Referer protection and versioning are enabled as of 2026-04-22; CDN is pending Alibaba Cloud CDN service activation. Measured: WebP 1920 hero ≈ 411 KB, AVIF 2560 hero ≈ 245 KB, WebP 3840 hero ≈ 1.03 MB, WebP 1280 feature tile ≈ 194 KB. Spec: `docs/IMAGE_PIPELINE.md`. Project detail pages still reference local `/images/home/*` paths from the `public/` bundle and will migrate when those pages get reworked.
- New buckets default to `BlockPublicAccess=true`. If a fresh bucket returns 403 on public GET, run `aliyun --profile mist ossutil api put-bucket-public-access-block --bucket <name> --public-access-block-configuration '{"BlockPublicAccess":"false"}'` then `aliyun --profile mist oss set-acl oss://<name> public-read -b` before expecting public GETs to succeed.
- CMS/admin editing is not implemented yet. Content is still code-managed.
- GitHub and the local branch were verified synchronized on 2026-04-20. Still run `git fetch origin --prune` and `git status --short --branch` before each deploy because other agents may push changes between sessions.
- Vercel is no longer the target deployment path for this project because of mainland China access concerns.

## 10. Recommended Next Tasks

1. Before the next deploy, re-check GitHub sync and confirm whether the target source is the GitHub branch or local working tree.
2. Configure the required GitHub Secrets for `.github/workflows/deploy-preview.yml`, then run one manual preview deployment from GitHub Actions.
3. After the manual run is verified, enable the commented `push` trigger for automatic preview deployment from `preview/home-featured-projects`.
4. Add a release cleanup command to keep only the latest 5-8 release folders on the 40 GiB disk.
5. Migrate project detail pages and journal entries off `/images/home/home-NN.*` onto OSS paths via `<OssPicture>` (use `feature` or new project-specific layout preset). The helper (`mediaUrl()`, `pictureSet()`) and component (`OssPicture`) already exist — extend `LAYOUTS` in `src/lib/media.ts` if project detail surfaces need a different size ladder.
6. Decide preview access policy: open IP preview, Basic Auth, or temporary preview domain.
7. When domain/ICP is ready, configure production HTTPS and promote a reviewed release.
