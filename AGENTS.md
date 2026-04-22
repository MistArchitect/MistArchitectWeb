# Agent Instructions

This is the first file coding agents should read when working on the
Mist Architect website.

## 1. Read Order

Read these files in order before making changes:

1. `AGENTS.md` — this file. Entry rules and reading order.
2. `docs/RELEASE_WORKFLOW.md` — Local -> Preview -> Production workflow.
3. `docs/AGENT_HANDOFF.md` — current project, ECS, domain, OSS, and runtime state.
4. `DESIGN.md` — visual and interaction direction.
5. Task-specific docs:
   - `docs/CICD.md` for GitHub Actions, preview deploys, and production promotion.
   - `docs/IMAGE_PIPELINE.md` for OSS, responsive images, CDN, and image processing.
   - `docs/DEPLOYMENT_PLAN.md` for Alibaba Cloud architecture decisions.
   - `docs/DEVELOPMENT_LOG.md` for chronological implementation history.

## 2. Current Operating Model

Use this release flow:

1. Develop locally and let the project owner review the local result.
2. Commit and push to `preview/home-featured-projects`.
3. Manually run GitHub Actions `Deploy Preview`.
4. Share `https://preview.mist-arch.com` for client/internal review.
5. After approval, promote the exact approved preview release to production.

Production URL:

```text
https://mist-arch.com
```

Preview URL:

```text
https://preview.mist-arch.com
```

## 3. Hard Rules

- Do not deploy an uncommitted local dirty worktree to production.
- Do not promote production before preview is deployed and approved.
- Do not expose or commit secrets, SSH keys, tokens, or Basic Auth passwords.
- Do not invent an ICP filing number. Use `NEXT_PUBLIC_ICP_LICENSE` only after
  the project owner provides the real filing value.
- Keep preview protected by Basic Auth.
- Keep public `8080/tcp` closed.
- Do not revert user or other-agent changes unless explicitly asked.
- Prefer scoped changes over broad refactors.
- Update `docs/DEVELOPMENT_LOG.md` for meaningful implementation,
  deployment, infrastructure, or workflow changes.
- If production or preview release ids change, update
  `docs/AGENT_HANDOFF.md` and `docs/CICD.md`.

## 4. Local Verification

Use the project Node version through nvm:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
```

Before committing code changes:

```bash
npm run typecheck
npm run lint
git diff --check
```

Run `npm run build` when changes touch routing, Next.js config, media
pipeline, environment variables, or deployment behavior.

## 5. Current Baseline

As of 2026-04-22:

```text
Branch: preview/home-featured-projects
Preview release: 20260421182320-2e8474c
Production release: 20260421182320-2e8474c
Production host: https://mist-arch.com
Protected preview host: https://preview.mist-arch.com
```
