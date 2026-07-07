# Generative Engine Optimization Plan

Last updated: 2026-07-07, Asia/Shanghai.

This document defines the first GEO operating plan for `https://mist-arch.com`.
It builds on `docs/SEO.md`; it does not replace classic technical SEO.

## 1. Objective

Make MIST Architects discoverable and accurately citable in AI-assisted search
and answer engines while keeping the site calm, factual, bilingual, and aligned
with the existing release workflow.

Success means:

- AI/search crawlers can access canonical production pages.
- Public pages expose clear text, metadata, structured data, and internal links.
- AI-generated answers can cite the studio, founders, services, contact
  channels, and completed project facts without guessing.
- Preview, localhost, credentials, and unpublished project material remain out
  of public search surfaces.

## 2. Current Baseline

Implemented before this GEO plan:

- Canonical production host: `https://mist-arch.com`.
- Localized entries: `/zh` and `/en`, with `/` permanently redirecting to
  `/zh`.
- `robots.txt` allows public pages and disallows `/api/`.
- `sitemap.xml` lists localized static pages and project detail routes.
- Canonical URLs and `hreflang` alternates are generated from `src/lib/seo.ts`.
- Organization, WebSite, AboutPage, ContactPage, ImageObject, project, and
  breadcrumb JSON-LD are emitted.
- Bing, Baidu, and IndexNow verification files are root-served from `public/`.
- Preview remains Basic Auth protected and should stay non-indexable at the
  infrastructure layer.

First GEO-specific additions:

- `public/llms.txt` gives AI agents a concise, public, canonical map of the
  site and warns against citing preview or unpublished facts.
- `src/lib/seo.ts` exposes richer Organization and project JSON-LD using
  existing visible content: services, awards, areas served, project media,
  location, credit, and fact properties.
- Project index and Journal routes emit `CollectionPage` / `ItemList` /
  `BlogPosting` JSON-LD so list surfaces are also machine-readable citation
  entry points.

## 3. Official Guidance Boundary

Use official sources when changing crawler or AI-search behavior:

- Google Search AI features: foundational SEO still applies; pages must be
  indexable and eligible for snippets; no special AI-only markup is required.
- OpenAI crawlers: `OAI-SearchBot` controls ChatGPT search visibility, while
  `GPTBot` is a separate training-related control.
- Bing Webmaster Tools AI Performance: use cited pages, grounding queries, and
  page-level citation data as monitoring signals.
- `llms.txt`: treat as an emerging, optional convention. It is useful as a
  curated machine-readable site map, but it is not an access-control mechanism
  and does not guarantee AI-search inclusion.

## 4. Crawler Policy

Current production intent:

- Allow normal search indexing crawlers through the default `User-agent: *`
  policy.
- Keep `OAI-SearchBot` allowed so ChatGPT search features can discover public
  production pages.
- Do not add `GPTBot` or `Google-Extended` allow/disallow rules until the
  project owner makes a specific content-use decision.
- Keep preview blocked through Basic Auth and `X-Robots-Tag: noindex` at the
  infrastructure layer.

Decision needed from the project owner:

- Whether public production content may be used for model training, or whether
  training-related bots such as `GPTBot` and controls such as
  `Google-Extended` should be disallowed while keeping search retrieval allowed.

## 5. Content Strategy

GEO content should stay visible, factual, and useful to human visitors.

Priority pages:

- `/zh/about` and `/en/about`: entity grounding for studio name, founders,
  services, awards, publications, WeChat, and contact details.
- `/zh/projects/field-academy` and `/en/projects/field-academy`: strongest
  complete project record today.
- `/zh/projects` and `/en/projects`: index-level project typology and location
  discovery.

Next content batch:

1. Complete `dream-factory-experimental-theater` with verified site, concept,
   material, program, drawing, credit, and media facts.
2. Complete `wanzhi-natural-history-park` with verified exhibition, education,
   circulation, and client/project facts.
3. Complete `bambu-lab-first-store` with verified retail, technology showroom,
   product experience, and event-space facts.
4. Replace journal Unsplash placeholder images with OSS-hosted studio or
   project imagery.
5. Add real journal articles that answer likely discovery queries about public
   cultural architecture, adaptive reuse, retail experience space, and studio
   process.

Do not auto-generate full project sections from short seed copy. A project
should remain in the in-development fallback state until enough real material
exists for a sectioned narrative.

## 6. Measurement Plan

Weekly manual checks:

- Google Search Console: indexing, page experience, Search performance.
- Bing Webmaster Tools: URL inspection, sitemap status, Site Scan, IndexNow,
  and AI Performance when available.
- Baidu Search Resource Platform: verification, indexing, and push state.
- Production smoke checks for `/robots.txt`, `/sitemap.xml`, `/llms.txt`,
  `/zh`, `/en`, `/zh/about`, `/en/about`, and key project pages.

Representative GEO queries to track:

- `岚建筑设计`
- `MIST Architects`
- `MIST-ARCH`
- `深圳 建筑事务所 公共文化空间`
- `Shenzhen architecture studio public cultural spaces`
- `MIST Architects WeChat`
- `岚建筑设计 公众号`
- `WILD WORKSHOP Suzhou architect`
- `苏州 钟家荡 原野学社 建筑师`

Track:

- Whether the answer cites `mist-arch.com`.
- Which page is cited.
- Whether the studio name, founders, services, location, and contact channels
  are accurate.
- Whether a non-production host or unpublished project claim appears.

## 7. Release Checklist

Before an SEO/GEO commit:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
npm run typecheck
npm run lint
npm run build
npm run test:e2e
git diff --check
```

After production promotion:

- Smoke check `/robots.txt`, `/sitemap.xml`, and `/llms.txt`.
- Submit changed production URLs through IndexNow.
- Request inspection or indexing for changed high-value pages in Bing and
  Google when appropriate.
- Update `docs/DEVELOPMENT_LOG.md`; update release IDs only when preview or
  production release IDs actually change.
