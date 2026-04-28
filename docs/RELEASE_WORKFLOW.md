# Release Workflow

Last updated: 2026-04-22, Asia/Shanghai.

This is the operating workflow for Mist Architect website changes.

## 1. Local Development

Goal: fast visual and content iteration before anything reaches a
client-facing environment.

Use this for:

- layout and interaction changes,
- copy changes,
- image wiring,
- CMS/schema experiments,
- visual QA with the project owner.

Commands:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
npm run dev
```

Local URL:

```text
http://localhost:3000/zh
```

Before committing:

```bash
npm run typecheck
npm run lint
git diff --check
```

Use `npm run build` when the change touches routing, Next.js config,
image handling, environment variables, or deployment behavior.

## 2. Preview Review

Goal: client/internal review of a committed version.

Process:

1. Commit the local changes.
2. Push to `origin/preview/home-featured-projects`.
3. GitHub Actions workflow `Deploy Preview` runs automatically from that push.
4. Share the protected preview URL after the workflow succeeds.

Preview URL:

```text
https://preview.mist-arch.com
```

Rules:

- Preview remains protected by Nginx Basic Auth.
- Public `8080/tcp` stays closed.
- Preview deployment does not touch `mist-production`.
- Do not use GitHub Actions `Re-run all jobs` when the goal is to
  deploy a newer commit. Start a new `Run workflow` run so GitHub uses
  the latest branch HEAD.

## 3. Production Release

Goal: publish only the version approved in preview.

Process:

1. Confirm the exact preview release id on ECS:

   ```bash
   ssh -i "$HOME/.ssh/mist_aliyun_ed25519" -o IdentitiesOnly=yes deploy@47.106.120.253 \
     'cat /srv/mist-architect/shared/current-preview-release.txt'
   ```

2. Promote that exact release directory to production:

   ```bash
   ssh -i "$HOME/.ssh/mist_aliyun_ed25519" -o IdentitiesOnly=yes deploy@47.106.120.253
   ```

   On the server:

   ```bash
   set -euo pipefail
   REMOTE_BASE=/srv/mist-architect
   RELEASE_ID="$(cat "$REMOTE_BASE/shared/current-preview-release.txt")"
   RELEASE_DIR="$REMOTE_BASE/releases/$RELEASE_ID"

   test -f "$RELEASE_DIR/server.js"
   ln -sfn "$RELEASE_DIR" "$REMOTE_BASE/current-production"
   echo "$RELEASE_ID" > "$REMOTE_BASE/shared/current-production-release.txt"

   export NVM_DIR="$HOME/.nvm"
   . "$NVM_DIR/nvm.sh"

   pm2 delete mist-production >/dev/null 2>&1 || true
   cd "$REMOTE_BASE/current-production"
   HOSTNAME=127.0.0.1 PORT=3002 NODE_ENV=production \
     pm2 start server.js --name mist-production --update-env
   pm2 save
   ```

3. Smoke check production:

   ```bash
   curl -fsS https://mist-arch.com/zh >/dev/null
   curl -fsS https://mist-arch.com/en >/dev/null
   ```

Production URL:

```text
https://mist-arch.com
```

Rules:

- Production is manually promoted for now.
- Production should always point to a release that has already passed
  preview deployment and client review.
- Do not deploy a local dirty worktree directly to production.
- Record production promotions in `docs/DEVELOPMENT_LOG.md` and update
  the current release markers in `docs/AGENT_HANDOFF.md` / `docs/CICD.md`.

## 4. Current Baseline

As of 2026-04-22:

```text
Branch: preview/home-featured-projects
Preview release: 20260428174855-6ca9d60
Production release: 20260428174855-6ca9d60
Preview URL: https://preview.mist-arch.com
Production URL: https://mist-arch.com
```
