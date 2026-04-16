# Mist Architect Agent Handoff

Last updated: 2026-04-17, Asia/Shanghai

This document is for another coding agent or developer taking over the current prototype work. It summarizes the local repository state, the active Alibaba Cloud deployment, and the operational commands needed to continue safely.

## 1. Current Project State

- Project: Mist Architect / 岚·建筑设计 website.
- Framework: Next.js App Router, React, TypeScript.
- Build mode: Next.js standalone output via `output: "standalone"` in `next.config.ts`.
- Current local branch: `preview/home-featured-projects`.
- GitHub remote:
  - `origin`: `https://github.com/MistArchitect/MistArchitectWeb.git`
- Important: the local worktree currently has many uncommitted changes. Do not assume GitHub already contains the deployed preview state.

Current focus:

- Prototype website for client review.
- Bilingual Chinese/English route structure: `/zh`, `/en`, `/zh/about`, `/en/about`, etc.
- Homepage has full-screen image carousel, manual controls, dot navigation, captions, and static featured project tiles.
- About page is active and uses the `岚` section naming.
- Project detail pages are prototype/mock-detail pages following the MUJI HOTEL Shenzhen interaction reference.
- CMS is not connected in the current phase.
- OSS migration is planned but not done. Images are still served from the ECS app bundle.

## 2. Key Recent Frontend Features

Homepage:

- Full-screen image carousel at the top.
- Left/right manual navigation.
- Dot navigation at the bottom.
- Manual carousel actions reset the autoplay timer.
- Left and right carousel hit areas each cover roughly 30% of the hero image.
- The visible arrow control is a 34px circular indicator; the directional mark appears on hover/focus.
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
- About page uses `about-1`, `about-2`, and `about-3` as a full-bleed carousel.
- Founder image and founder metadata are rendered from `src/content/site.ts`.

Splash:

- Opening logo splash uses `/public/images/LOGO/logo.png`.
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

## 4. Current Alibaba Cloud Deployment

Provider:

- Alibaba Cloud ECS.
- Public IP: `47.106.120.253`.
- Current preview URL: `http://47.106.120.253:8080/zh`.
- English preview URL: `http://47.106.120.253:8080/en`.

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
  current-preview -> /srv/mist-architect/releases/20260417012030-hero-hotspots-splash
  current-production -> /srv/mist-architect/releases/20260415230115-local
```

Latest preview release:

```text
20260417012030-hero-hotspots-splash
```

Recent release folders on ECS:

```text
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
mist-production  stopped  configured historically for port 3002
```

Production is intentionally offline.

## 5. Current Nginx Routing

Enabled config:

```text
/etc/nginx/sites-enabled/mist-architect
  -> /etc/nginx/sites-available/mist-architect
```

Current behavior:

- Port `80`: default server returns HTTP 503 with:

```text
Production is temporarily offline. Use preview on port 8080.
```

- Port `8080`: proxies preview traffic to `127.0.0.1:3001`.
- `/images/` has 30-day cache headers and `X-Robots-Tag: noindex`.
- `/_next/static/` has 30-day immutable-ish static cache headers.
- General preview traffic includes `X-Robots-Tag: noindex`.
- No production domain, HTTPS, or ICP production launch is configured yet.

Relevant Nginx shape:

```nginx
server {
    listen 80 default_server;
    server_name 47.106.120.253 _;
    return 503 "Production is temporarily offline. Use preview on port 8080.\n";
}

server {
    listen 8080;
    server_name 47.106.120.253 _;

    add_header X-Robots-Tag "noindex" always;

    location / {
        proxy_pass http://127.0.0.1:3001;
    }
}
```

Security group expectation:

- Inbound `8080/tcp` must remain open for current preview.
- Inbound `80/tcp` can remain open but currently only returns the offline production message.
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
curl -fsS http://47.106.120.253:8080/zh >/dev/null
curl -fsS http://47.106.120.253:8080/en >/dev/null
curl -fsS http://47.106.120.253:8080/zh/about >/dev/null
```

Check PM2:

```bash
ssh -i "$HOME/.ssh/mist_aliyun_ed25519" -o IdentitiesOnly=yes deploy@47.106.120.253 \
  "export NVM_DIR=\$HOME/.nvm; . \$NVM_DIR/nvm.sh; pm2 status --no-color"
```

## 8. Production Status and Launch Notes

Production is not active.

Current production-related state:

- `mist-production` PM2 process exists but is stopped.
- `/srv/mist-architect/current-production` points to an old local release.
- Port `80` intentionally returns 503.
- No public production domain is attached.
- No HTTPS certificate is configured.
- ICP filing / domain readiness is not complete in this repo state.

Do not start production unless explicitly requested.

Before real production launch:

1. Confirm final domain and ICP filing status.
2. Add DNS records to Alibaba Cloud or the chosen DNS provider.
3. Configure Nginx server blocks for production domain and optional preview domain.
4. Configure HTTPS certificate.
5. Decide whether preview should move behind Basic Auth.
6. Deploy the exact approved release to `mist-production`.
7. Run smoke checks on production domain.

## 9. Known Constraints and Risks

- The ECS is the low-cost Alibaba Cloud economy instance. Keep builds local when possible.
- ECS bandwidth is limited. Large media will be slow until OSS/CDN migration.
- Current images were compressed once. User noted homepage images lost visible quality; do not further compress homepage hero images without approval.
- OSS migration is desired but not implemented yet.
- CMS/admin editing is not implemented yet. Content is still code-managed.
- The current preview was deployed from the local worktree; commit/push state should be checked before assuming reproducibility from GitHub.
- Vercel is no longer the target deployment path for this project because of mainland China access concerns.

## 10. Recommended Next Tasks

1. Commit and push the current stable preview state to GitHub.
2. Add a formal deploy script under `scripts/` to avoid hand-running long rsync commands.
3. Add a release cleanup command to keep only the latest 5-8 release folders on the 40 GiB disk.
4. Prepare OSS bucket and image URL strategy before adding more high-resolution media.
5. Decide preview access policy: open IP preview, Basic Auth, or temporary preview domain.
6. When domain/ICP is ready, configure production HTTPS and promote a reviewed release.
