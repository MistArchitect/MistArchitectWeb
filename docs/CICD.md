# Mist Architect CI/CD Notes

Last updated: 2026-04-22, Asia/Shanghai.

This document explains the current GitHub Actions CI/CD setup for the Mist
Architect website. It is intended for the project owner and future coding
agents.

For the end-to-end Local → Preview → Production operating flow, see:

```text
docs/RELEASE_WORKFLOW.md
```

## 1. Current Branches

```text
main
  Default GitHub branch.
  Registers workflows so they appear in GitHub Actions UI.
  Does not currently contain the latest preview application code.

preview/home-featured-projects
  Active prototype branch.
  Source branch for the current Alibaba Cloud ECS preview deployment.
```

Important GitHub UI behavior:

- Manual `workflow_dispatch` workflows only appear in the Actions UI when the
  workflow file exists on the repository default branch (`main`).
- For that reason, `.github/workflows/deploy-preview.yml` is intentionally
  present on both `main` and `preview/home-featured-projects`.
- Registering the workflow on `main` does not mean preview application code has
  been merged into `main`.

## 2. Workflows

### CI

File:

```text
.github/workflows/ci.yml
```

Purpose:

- Validate code before merging into `main`.

Triggers:

```text
push to main
pull_request targeting main
```

Steps:

```text
actions/checkout
actions/setup-node using .nvmrc
npm ci
npm run typecheck
npm run lint
npm run build
```

This workflow does not deploy anything.

### Deploy Preview

File:

```text
.github/workflows/deploy-preview.yml
```

Purpose:

- Build the active preview branch in GitHub Actions.
- Upload the Next.js standalone build output to Alibaba Cloud ECS.
- Promote the uploaded release as the live preview.
- Restart only the PM2 preview process.

Current trigger:

```text
push to preview/home-featured-projects
workflow_dispatch
```

That means preview deployment is automatic for the active preview branch.
Manual `workflow_dispatch` remains available when a deployment needs to be
re-run without creating a new commit.

## 3. Required GitHub Secrets

These repository secrets are required by `Deploy Preview`:

```text
ALIYUN_ECS_HOST      47.106.120.253
ALIYUN_ECS_USER      deploy
ALIYUN_ECS_PORT      22
ALIYUN_ECS_SSH_KEY   private SSH key matching deploy user's authorized_keys
PREVIEW_AUTH_USER    Basic Auth username for preview smoke checks
PREVIEW_AUTH_PASSWORD Basic Auth password for preview smoke checks
```

Notes:

- `ALIYUN_ECS_SSH_KEY` must be the full private key content, including:

```text
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

- Preserve all line breaks.
- Do not use the `.pub` public key.
- If GitHub Actions logs show `Load key ... error in libcrypto`, the private
  key secret is malformed. Reset it from a known-good local private key.

The current secret was reset with:

```bash
gh secret set ALIYUN_ECS_SSH_KEY \
  --repo MistArchitect/MistArchitectWeb \
  < "$HOME/.ssh/mist_aliyun_ed25519"
```

## 4. Deploy Preview Flow

When a new manual `Deploy Preview` run is started on
`preview/home-featured-projects`, the workflow performs:

```text
1. Checkout selected branch and commit.
2. Setup Node using .nvmrc.
3. npm ci.
4. npm run typecheck.
5. npm run lint.
6. npm run build.
7. Install rsync on the GitHub-hosted runner.
8. Write ALIYUN_ECS_SSH_KEY into ~/.ssh/mist_aliyun_ed25519.
9. ssh-keyscan the ECS host into known_hosts.
10. Create /srv/mist-architect/releases/<timestamp>-<short-sha>/ on ECS.
11. rsync .next/standalone/ into the release directory.
12. rsync .next/static/ into release/.next/static/.
13. rsync public/ into /srv/mist-architect/shared/public/ and symlink that shared directory into the release. This avoids re-uploading the 76 MB font bundle into every new release.
14. Update /srv/mist-architect/current-preview symlink.
15. Write /srv/mist-architect/shared/current-preview-release.txt.
16. Restart PM2 process mist-preview on HOSTNAME=127.0.0.1 PORT=3001.
17. Smoke check ECS-local preview routes on `http://127.0.0.1:3001`.
18. Smoke check public preview routes through Basic Auth with HTTP/1.1 and longer retries. Public preview failures are emitted as warnings after ECS-local smoke succeeds, because `preview.mist-arch.com` may reset TLS from GitHub-hosted runner networks even when browser access is normal:
    - https://preview.mist-arch.com/zh
    - https://preview.mist-arch.com/en
    - https://preview.mist-arch.com/zh/about
```

The release id format is:

```text
YYYYMMDDHHMMSS-<short-git-sha>
```

Example:

```text
20260420194149-f176d9d
```

## 5. Re-run vs New Run

GitHub has two different actions that look similar:

### Re-run all jobs

This re-runs the same workflow run.

It keeps the original:

```text
head branch
head SHA
workflow inputs
```

Example:

```text
Original run head: f176d9d
Re-run all jobs:    f176d9d again
```

Use this only when the same commit failed because of a temporary issue, such as
network timeout or an invalid secret that has since been fixed.

### Run workflow

This creates a new workflow run from the currently selected branch.

Use this only when you need to redeploy the selected branch without creating a
new commit. Normal preview deployment happens automatically after pushing to
`preview/home-featured-projects`.

Correct manual deployment path:

```text
Actions
  -> Deploy Preview
  -> Run workflow
  -> Branch: preview/home-featured-projects
  -> Run workflow
```

If the goal is to deploy the latest `preview/home-featured-projects` HEAD, do
not use `Re-run all jobs` on an old run.

## 6. Current Verified State

Latest successful `Deploy Preview` run checked during setup:

```text
Run id: 24684681445
Branch: preview/home-featured-projects
Head SHA: f176d9da4360e60d31ff480cca7d9a2293339e0b
Short SHA: f176d9d
Conclusion: success
```

The user later clicked `Re-run all jobs` on that run, which correctly kept the
same head SHA and redeployed another release from `f176d9d`.

ECS preview after that re-run:

```text
PM2 process: mist-preview
Release: 20260420194149-f176d9d
Server path: /srv/mist-architect/releases/20260420194149-f176d9d/server.js
Preview URL: https://preview.mist-arch.com/zh
```

Latest preview branch HEAD at the time the re-run behavior was observed,
before this documentation update:

```text
preview/home-featured-projects
HEAD: f8eea51 Document preview deploy verification
```

Because `f8eea51` was newer than the original run, deploying it requires a new
`Run workflow` action, not a re-run of run `24684681445`.

## 7. Production Status

Production is online, but production deployment is not automated in
GitHub Actions yet.

Current production state:

```text
https://mist-arch.com
mist-production -> 127.0.0.1:3002 -> /srv/mist-architect/current-production
```

Keep production promotion manual until a release approval policy is
agreed. The current automated workflow deploys preview only.

The intended release flow is:

1. Develop and review locally.
2. Commit and manually deploy `preview/home-featured-projects` to
   protected preview.
3. After client approval, promote the exact approved preview release id
   to production.

Do not deploy an uncommitted local worktree directly to production.

## 8. Vercel Status

Vercel is no longer the target deployment path.

Current state:

- Vercel GitHub Environments were removed by the user.
- `vercel.json` was removed from `preview/home-featured-projects`.
- Some package-lock references to `@vercel/*` remain because they are transitive
  dependencies of Next/Sanity-related tooling, not active Vercel deployment
  configuration.

## 9. Production Domain State

Production was brought online on 2026-04-21.

Canonical production:

```text
https://mist-arch.com
```

Production aliases:

```text
https://www.mist-arch.com       -> https://mist-arch.com
https://mist.archi              -> https://mist-arch.com
https://www.mist.archi          -> https://mist-arch.com
https://hilarchitects.com       -> https://mist-arch.com
https://www.hilarchitects.com   -> https://mist-arch.com
```

Protected preview:

```text
https://preview.mist-arch.com
```

Preview access:

- Nginx Basic Auth enabled.
- `X-Robots-Tag: noindex` enabled.
- Public `8080/tcp` closed in the Alibaba Cloud security group.

Current runtime split:

```text
mist-production -> 127.0.0.1:3002 -> /srv/mist-architect/current-production
mist-preview    -> 127.0.0.1:3001 -> /srv/mist-architect/current-preview
```

Current production release:

```text
20260428174855-6ca9d60
```

Latest verified preview workflow after production launch:

```text
Run id: 24739160886
Branch: preview/home-featured-projects
Head SHA: 2e8474c0b0791f017a6ae3e33dde27e47d859469
Short SHA: 2e8474c
Preview release: 20260428174855-6ca9d60
Conclusion: success
```

HTTPS:

- Certbot / Let's Encrypt certificate name: `mist-arch.com`.
- Certificate currently covers all production aliases plus `preview.mist-arch.com`.
- Certbot timer is enabled for automatic renewal.
