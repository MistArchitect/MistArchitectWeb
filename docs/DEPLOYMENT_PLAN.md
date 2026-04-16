# Mist Architect Aliyun Deployment Plan

This plan targets the current operating mode only:

- Hosting moves to Alibaba Cloud.
- Content updates stay in code and GitHub for now.
- No CMS migration in this phase.
- The site needs two environments: internal preview and public production.

## 1. Target Architecture

```text
GitHub repository
  -> build release package
  -> Alibaba Cloud ECS
  -> Next.js standalone server
  -> Nginx reverse proxy
  -> HTTPS domain
```

The project already uses `output: "standalone"` in `next.config.ts`, so the production runtime should use the generated standalone server rather than `next dev`.

Runtime shape:

```text
Nginx :80/:443
  -> 127.0.0.1:3001 preview
  -> 127.0.0.1:3002 production
```

Recommended first implementation:

- One ECS instance for the prototype phase.
- Two PM2 processes on the same ECS instance:
  - `mist-preview`
  - `mist-production`
- Two Nginx server blocks:
  - `preview.<domain>`
  - `<domain>` / `www.<domain>`

Move to two ECS instances later if traffic, release risk, or security policy requires hard separation.

## 2. ECS Specification Recommendation

### Prototype / Internal Review

Recommended baseline, use one shared ECS instance:

- Region: Mainland China, preferably `cn-shenzhen`, `cn-guangzhou`, `cn-hangzhou`, or `cn-shanghai` depending on account availability and target audience.
- Instance family: `ecs.u2a` / `ecs.u2i` general-purpose compute first, or `ecs.u1` if inventory and pricing are better. Avoid burstable instances for production.
- Recommended size: `2 vCPU / 4 GiB RAM`, such as `ecs.u2a-c1m2.large`, `ecs.u2i-c1m2.large`, or `ecs.u1-c1m2.large`, depending on regional inventory.
- System disk: 80 GiB ESSD.
- OS: Ubuntu 22.04 LTS or Alibaba Cloud Linux 3.
- Bandwidth: fixed bandwidth 5 Mbps minimum, or pay-by-traffic if traffic is unpredictable.

This is enough for:

- Next.js standalone server.
- Nginx.
- PM2.
- Current local image assets.
- Low-traffic internal preview.

### Budget Starter

The Alibaba Cloud economy `ecs.e` package shown in the console can be used for the first low-cost phase:

- Instance: `2 vCPU / 2 GiB RAM`, economy `ecs.e`.
- Disk: 40 GiB ESSD Entry.
- Bandwidth: 3 Mbps fixed bandwidth.
- OS: Ubuntu 22.04 LTS.
- Region: Shenzhen is acceptable if that is where the site audience and filing resources will be based.

Use this package only with these constraints:

- Build the app locally or in CI when possible, then upload the standalone release package to ECS.
- If building directly on the ECS, stop the preview process before production build/reload when memory is tight.
- Keep only a small number of release folders, because 40 GiB will be consumed quickly by `.next`, `public/images`, logs, and backups.
- Compress images before committing and avoid hosting large video files directly from the ECS.
- Treat 3 Mbps as a prototype bandwidth ceiling. It is enough for internal review and light public traffic, but high-resolution image pages will feel slow on first load.

Upgrade from this package to the 2c4g baseline before production if preview reviewers see slow first loads, build memory pressure, or if production needs to host many large project images/videos directly on the server.

### Public Production Starter

For the first public production version, keep one ECS instance:

- `2 vCPU / 4 GiB RAM`, preferably u2a/u2i/u1 rather than burstable.
- 80-100 GiB ESSD.
- 5-10 Mbps bandwidth.
- Preview and production remain separate PM2 apps and Nginx hosts.

Hard environment isolation is a later upgrade path, not the current baseline. If the company later requires preview and production to run on separate hosts, split them into:

- Preview ECS: `2 vCPU / 2 GiB RAM`, u2a/u2i/u1 or equivalent.
- Production ECS: `2 vCPU / 4 GiB RAM`, u2a/u2i/u1 or equivalent.
- Same OS and deploy scripts.
- Production keeps tighter security group and fewer SSH users.

### When To Upgrade

Upgrade production to `4 vCPU / 8 GiB RAM` when any of these become true:

- More real project media is added and image optimization becomes CPU-heavy.
- Public traffic grows beyond low-volume company-site traffic.
- A CMS, database, image processing, or background job runs on the same server.
- Build is performed on the server and regularly causes memory pressure.

If the company prefers the g-series general-purpose family, choose the equivalent 1:4 memory ratio class, which usually means starting at `2 vCPU / 8 GiB RAM` rather than `2 vCPU / 4 GiB RAM`.

## 3. Domain and Environment Plan

Recommended domain split:

```text
preview.mistarchitect.cn   -> internal review
mistarchitect.cn           -> production
www.mistarchitect.cn       -> production
```

If the final domain is not ready:

```text
preview temporary: ECS public IP + basic auth
production temporary: disabled until ICP and DNS are ready
```

Preview access should be protected:

- Nginx Basic Auth is enough for the current phase.
- Do not rely on obscurity-only URLs for internal review.
- Keep preview indexed off with `X-Robots-Tag: noindex`.

Production access:

- No Basic Auth.
- HTTPS required.
- Redirect HTTP to HTTPS after SSL is configured.
- Redirect `www` to apex or apex to `www`, choose one canonical domain.

## 4. ICP and Launch Constraint

For mainland Alibaba Cloud hosting with a public domain, ICP filing must be handled before public launch.

Operational rule:

- Preview can use IP or protected temporary domain during development.
- Production domain should not be treated as public-ready until ICP filing, DNS, SSL, and launch review are complete.

Prepare early:

- Domain real-name verification.
- Alibaba Cloud account real-name verification.
- Business/entity documents.
- ECS resource eligible for filing.
- Filing subject and website name.

## 5. Server Setup

Baseline packages:

```bash
sudo apt update
sudo apt install -y nginx git curl unzip
```

Node runtime:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
nvm install 24.14.1
nvm use 24.14.1
npm i -g pm2
```

Recommended directories:

```text
/srv/mist-architect/
  releases/
  shared/
  current-preview -> releases/<release-id>
  current-production -> releases/<release-id>
```

Keep env files out of git:

```text
/srv/mist-architect/shared/.env.preview
/srv/mist-architect/shared/.env.production
```

## 6. Build and Release

Build command:

```bash
npm ci
npm run build
```

Standalone deploy package must include:

```text
.next/standalone
.next/static
public
package.json
```

Start commands:

```bash
PORT=3001 pm2 start .next/standalone/server.js --name mist-preview
PORT=3002 pm2 start .next/standalone/server.js --name mist-production
pm2 save
```

Use release folders and symlinks so rollback is simple:

```bash
ln -sfn /srv/mist-architect/releases/<release-id> /srv/mist-architect/current-production
pm2 reload mist-production
```

## 7. Nginx Configuration Goals

Preview host:

- `preview.<domain>`
- Proxy to `127.0.0.1:3001`
- Basic Auth enabled.
- `X-Robots-Tag: noindex`.

Production host:

- `<domain>` and `www.<domain>`
- Proxy to `127.0.0.1:3002`
- No Basic Auth.
- HTTPS.
- Cache headers for `/_next/static/*`.

ECS security group:

- Allow `80/tcp` from `0.0.0.0/0`.
- Allow `443/tcp` from `0.0.0.0/0`.
- Allow `22/tcp` only from trusted office/home IPs when possible.
- Do not expose `3001` or `3002` to the public internet.

## 8. Content Update Workflow

Current phase uses code-managed content:

1. Update project text/images in the repository.
2. Commit to GitHub.
3. Deploy to preview.
4. Internal review approves.
5. Promote the same commit/release to production.

Do not edit production files manually on the server except emergency rollback.

## 9. Media Policy

Current preview phase:

- Keep compressed review images in `public/images` until visual approval.
- Use `npm run optimize:images` before deploying new local media.
- Keep filenames stable after review links are shared.
- Keep source-grade originals outside the website runtime package.

OSS migration phase:

- Create an OSS bucket in the same mainland region as ECS, preferably Shenzhen if the ECS stays in `cn-shenzhen`.
- Upload optimized runtime images to OSS, not source-grade originals.
- Let the browser load images directly from OSS or a CDN-bound OSS domain. Do not proxy public images through ECS, otherwise the 3 Mbps ECS bandwidth remains the bottleneck.
- Keep ECS-to-OSS internal endpoints for server-side maintenance tasks, but do not depend on ECS internal bandwidth for browser-facing image delivery.
- Add CDN after ICP and domain setup are complete.

## 10. Operational Checklist

Before preview:

- ECS purchased and security group configured.
- Nginx installed.
- Node 24.14.1 installed.
- PM2 installed and startup configured.
- Preview domain or IP route working.
- Basic Auth enabled for preview.

Before production:

- ICP filing complete if using mainland public domain.
- SSL certificate installed.
- Production Nginx host enabled.
- `npm run lint` passes.
- `npm run build` passes.
- Production release is the same approved commit as preview.
- Rollback release exists.
