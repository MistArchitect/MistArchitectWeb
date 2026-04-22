# Mist Architect

Mist Architect is a bilingual architecture studio website built with React and Next.js.
The first implementation focuses on a high-contrast editorial system inspired by WIRED,
adapted for architectural imagery, project archives, films, and long-term content updates.

## Current Stack

- Next.js App Router
- React + TypeScript
- CSS variables and global editorial layout primitives
- `motion/react` for restrained entrance and scroll-adjacent UI motion
- Sanity Studio CMS with local seed-content fallback

## Run Locally

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
npm install
npm run dev
```

The default localized home route is:

```text
http://localhost:3000/zh
```

The CMS route is:

```text
http://localhost:3000/studio
```

## Project Notes

- `AGENTS.md` is the top-level entry file for coding agents.
- `DESIGN.md` contains the imported WIRED-inspired design reference.
- `docs/RELEASE_WORKFLOW.md` defines the Local → Preview → Production operating flow.
- `docs/DEVELOPMENT_LOG.md` tracks implementation decisions, commands, and handoff notes.
- `docs/DEPLOYMENT_PLAN.md` outlines the preview and mainland-China-ready production path.
- The app is structured around locale-prefixed routes so extra languages can be added later.
- Copy `.env.example` to `.env.local` and fill the Sanity project variables to open the real Studio.

## CMS Content Updates

1. Open `http://localhost:3000/studio`.
2. Create or edit a `Project` document.
3. Fill the Chinese and English fields, then set the slug, project code, year, location, status, and typology.
4. Upload `Cover Image` for cards and `Hero Image` for the project detail page.
5. Add extra images to `Gallery`; these render in the project detail gallery.
6. Paste a direct `.mp4`, `.webm`, or `.mov` URL into `Video URL`; this renders in the project film section.
7. Publish the document. Frontend pages revalidate every 60 seconds after Sanity is configured.
