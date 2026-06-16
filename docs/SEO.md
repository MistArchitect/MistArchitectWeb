# SEO Implementation

Last updated: 2026-06-06, Asia/Shanghai.

This document records how technical SEO is implemented for
`https://mist-arch.com`, where to maintain it, and how to verify search-engine
submissions after a release.

## 1. Current Goals

- Make the bilingual architecture portfolio crawlable and indexable on Bing,
  Baidu, and other search engines.
- Make brand searches such as `岚建筑设计`, `MIST Architects`, `MIST-ARCH`, and
  direct domain searches discover the canonical production site.
- Keep preview protected from indexing.
- Describe WeChat public account and WeChat Channels information without
  adding visible keyword-heavy page clutter.

SEO cannot guarantee a ranking position or immediate search visibility. The
site can expose clean crawl signals, submit URLs, and request indexing, but
ranking still depends on search-engine crawl timing, domain history, backlinks,
content relevance, and trust signals.

## 2. Public Hosts

Canonical production:

```text
https://mist-arch.com
```

Canonical localized entry pages:

```text
https://mist-arch.com/zh
https://mist-arch.com/en
```

The root path `/` permanently redirects to `/zh` through
`next.config.ts`:

```text
/ -> /zh 308 Permanent Redirect
```

Preview remains protected and should not be indexed:

```text
https://preview.mist-arch.com
```

Preview indexing protection is handled at the infrastructure/Nginx layer with
Basic Auth and `X-Robots-Tag: noindex`.

## 3. Source Files

Core SEO helpers:

```text
src/lib/seo.ts
```

This file owns:

- `siteOrigin`
- localized brand names
- site descriptions
- keyword seed lists
- canonical URL helpers
- `hreflang` alternate helpers
- Open Graph and Twitter metadata generation
- Organization, WebSite, AboutPage, ContactPage, ImageObject, project, and
  breadcrumb JSON-LD helpers

Route metadata:

```text
src/app/[locale]/layout.tsx
src/app/[locale]/page.tsx
src/app/[locale]/about/page.tsx
src/app/[locale]/projects/page.tsx
src/app/[locale]/projects/[slug]/page.tsx
src/app/[locale]/journal/page.tsx
```

Robots and sitemap:

```text
src/app/robots.ts
src/app/sitemap.ts
```

Root-served verification and API files:

```text
public/BingSiteAuth.xml
public/baidu_verify_codeva-rzwTLycS3q.html
public/f5775da6489b4079bb75b30bdd8fdbf9.txt
public/20260531-191007.jpeg
```

## 4. Metadata Model

All localized pages should use `buildPageMetadata()` from `src/lib/seo.ts`
unless there is a strong reason not to.

That helper generates:

- page title
- page description
- merged keyword list
- canonical URL
- localized alternates
- Open Graph metadata
- Twitter card metadata
- search-crawler-safe metadata image URLs

Description guidance:

- Keep English descriptions near 120 to 155 characters when practical.
- Keep Chinese descriptions concise and readable.
- Avoid keyword stuffing. Mention brand, discipline, city/context, and service
  area naturally.
- If a route has its own focused purpose, use route-specific descriptions
  rather than reusing the homepage description.

The current global descriptions are in `siteDescription`:

```text
zh: 岚·建筑设计是由程博、李博创立的建筑事务所，专注建筑、室内、城市更新与公共文化空间。
en: MIST Architects is a Shenzhen architecture studio working across cultural spaces, interiors, adaptive reuse, and public architecture.
```

### Metadata images

Visible page imagery still resolves through `mediaUrl()` and is served directly
from OSS or the future CDN. Search metadata is different: Open Graph, Twitter,
and JSON-LD image/logo URLs should use the site-owned `/api/media` proxy via
`mediaMetadataUrl()` so crawlers that fetch without a page Referer can retrieve
the assets.

Reason: the OSS bucket has Referer protection enabled. Direct no-Referer GETs
to OSS return `403`, which can prevent Bing and other search engines from
fetching the logo or social preview images even when the page HTML is correct.

## 5. Canonical and hreflang

Localized canonical URLs are generated with:

```text
localizedSiteUrl(locale, path)
```

Localized alternates are generated with:

```text
languageAlternates(path)
sitemapAlternates(path)
```

Every localized route should expose:

```text
zh-CN -> https://mist-arch.com/zh...
en    -> https://mist-arch.com/en...
x-default -> https://mist-arch.com/zh...
```

Do not set canonical URLs to preview hosts, localhost, or alternate domains.
Production SEO should always point at `https://mist-arch.com`.

## 6. Structured Data

The site emits JSON-LD through `src/lib/seo.ts`.

Current structured data:

- `Organization` and `ArchitecturalService` on every localized layout
- `WebSite` on every localized layout
- `AboutPage` and `ContactPage` on `/zh/about` and `/en/about`
- WeChat QR code `ImageObject`
- project `CreativeWork` on project detail pages
- `BreadcrumbList` on project detail pages

WeChat fields currently exposed in Organization JSON-LD:

```text
WeChat Official Account ID: MIST-ARCH
WeChat Official Account Name: 岚建筑设计
WeChat Channels Name: 岚建筑
```

The WeChat QR image is served from:

```text
https://mist-arch.com/20260531-191007.jpeg
```

If the QR code changes, update both the public asset and
`wechatSeoContact.qrImage` in `src/lib/seo.ts`.

## 7. Images and alt Text

Search tools currently check the rendered HTML for missing image `alt`
attributes. The site should not emit `alt=""` on public production pages unless
there is a deliberate accessibility reason and the SEO tradeoff has been
accepted.

Current implementation:

- homepage hero images derive descriptive alt text from localized carousel
  captions in `src/components/hero.tsx`
- About hero carousel images receive localized office-photo alt prefixes in
  `src/components/about-hero-carousel.tsx`
- project immersive hero images reuse existing project image alt text in
  `src/components/project-immersive-background.tsx`
- project index and content images use content-managed `imageAlt` / media alt
  fields from `src/content/site.ts`
- WeChat QR code dialog uses specific QR-code alt text

When adding new images:

- add meaningful `alt` text to content images
- keep decorative UI icons `aria-hidden` where appropriate
- avoid filename-derived public captions or alt text
- verify production HTML does not introduce new `alt=""` warnings

## 8. robots.txt and sitemap.xml

`src/app/robots.ts` generates:

```text
Allow: /
Allow: /api/media
Disallow: /api/
Sitemap: https://mist-arch.com/sitemap.xml
Host: https://mist-arch.com
```

The `/api/media` allow rule is intentional. Metadata images use this endpoint,
while the broader `/api/` path remains blocked from indexing.

`src/app/sitemap.ts` generates localized entries for:

- home
- projects archive
- about
- journal
- every project detail slug returned by `getProjectSlugs()`

The sitemap includes localized alternate links and is revalidated every hour.

## 9. Verification Files

Bing Webmaster Tools:

```text
https://mist-arch.com/BingSiteAuth.xml
```

Baidu Search Resource Platform:

```text
https://mist-arch.com/baidu_verify_codeva-rzwTLycS3q.html
```

IndexNow key file:

```text
https://mist-arch.com/f5775da6489b4079bb75b30bdd8fdbf9.txt
```

The IndexNow key file must contain the same key as its filename. This key is
public by design for IndexNow verification.

Do not commit private API tokens, Baidu push tokens, webmaster account
credentials, Basic Auth passwords, or SSH keys.

## 10. Search Engine Submission

### Bing / IndexNow

After SEO-relevant production releases, submit changed URLs through IndexNow.

Safe single-URL pattern:

```bash
node <<'NODE'
const key = 'f5775da6489b4079bb75b30bdd8fdbf9';
const urls = [
  'https://mist-arch.com/zh',
  'https://mist-arch.com/en',
  'https://mist-arch.com/zh/about',
  'https://mist-arch.com/en/about',
  'https://mist-arch.com/sitemap.xml'
];

for (const url of urls) {
  const endpoint = new URL('https://api.indexnow.org/indexnow');
  endpoint.searchParams.set('url', url);
  endpoint.searchParams.set('key', key);
  const response = await fetch(endpoint);
  console.log(`${response.status} ${response.statusText} ${url}`);
}
NODE
```

Expected accepted responses are commonly `200 OK` or `202 Accepted`.

### Bing Webmaster Tools UI

Use these sections:

- URL Submission for key changed URLs
- Sitemaps for `https://mist-arch.com/sitemap.xml`
- URL Inspection for individual diagnostics
- IndexNow for submitted URL status
- Site Scan or SEO/GEO issue panel for metadata and image warnings

If a URL is `Discovered but not crawled`, Bing knows the URL but has not
crawled it yet. Use `Request indexing` and wait for Bing to reprocess it. This
state is not by itself a code error.

If Bing shows old HTML, check the inspection timestamp. Bing may retain an old
snapshot until it crawls again.

### Baidu API Push

Baidu's resource push uses a webmaster token. Do not commit the real token.
Use a local `urls.txt` file and the token from Baidu Search Resource Platform:

```bash
curl -H 'Content-Type:text/plain' \
  --data-binary @urls.txt \
  'http://data.zz.baidu.com/urls?site=https://mist-arch.com&token=<baidu-token>'
```

`urls.txt` should contain one absolute URL per line:

```text
https://mist-arch.com/zh
https://mist-arch.com/en
https://mist-arch.com/zh/about
https://mist-arch.com/en/about
```

## 11. Release Verification

Run local checks before committing SEO code changes:

```bash
export NVM_DIR="$HOME/.nvm"
. "$NVM_DIR/nvm.sh"
npm run typecheck
npm run lint
npm run build
npm run test:e2e
git diff --check
```

After production promotion, use targeted smoke checks:

```bash
curl -sS -o /dev/null -w '%{http_code} %{redirect_url}\n' https://mist-arch.com/
curl -fsS -o /dev/null -w '%{http_code}\n' https://mist-arch.com/zh
curl -fsS -o /dev/null -w '%{http_code}\n' https://mist-arch.com/en
curl -fsS -o /dev/null -w '%{http_code}\n' https://mist-arch.com/sitemap.xml
curl -fsS -o /dev/null -w '%{http_code}\n' https://mist-arch.com/robots.txt
```

Check descriptions and empty alt attributes:

```bash
node <<'NODE'
const urls = [
  'https://mist-arch.com/zh',
  'https://mist-arch.com/en',
  'https://mist-arch.com/zh/about',
  'https://mist-arch.com/en/about'
];

for (const url of urls) {
  const html = await fetch(url).then((response) => response.text());
  const emptyAltCount = (html.match(/alt=""/g) ?? []).length;
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? '';
  console.log(`${url} empty alt count: ${emptyAltCount}; description length: ${description.length}`);
}
NODE
```

Expected current production values:

```text
/ -> /zh returns 308
/zh returns 200
/en returns 200
/sitemap.xml returns 200
/robots.txt returns 200
/en description length is 133
/en/about description length is 127
public pages should normally have empty alt count 0
```

## 12. Current Search State Notes

As of 2026-06-06:

- Bing has indexed `https://mist-arch.com/zh`.
- `https://mist-arch.com/en/about` was known to Bing as
  `Discovered but not crawled` in URL Inspection.
- `/en` SEO/GEO warnings for meta description length and one missing image alt
  were fixed in production release `20260604190723-5d999c1`.
- `/en/about` meta description was shortened in production release
  `20260605194748-da9960e` before Bing crawled that URL.
- IndexNow accepted `/zh`, `/zh/about`, `/en`, `/en/about`, and
  `/sitemap.xml` after production release `20260605194748-da9960e`.
- IndexNow also accepted `/en/projects/field-academy` during the previous
  SEO cleanup release.

Search visibility can lag after a successful technical fix. Bing, Baidu, and
WeChat search may take days or longer to refresh snippets, indexing state, and
ranking.

## 13. Maintenance Rules

- Keep SEO copy natural and brand-specific.
- Keep canonical URLs on `https://mist-arch.com`.
- Keep preview blocked from indexing.
- Add new public routes to `src/app/sitemap.ts` when they should be indexed.
- Add route-specific metadata for new high-value pages.
- Update JSON-LD when official contact, address, founder, WeChat, or QR code
  information changes.
- Submit changed production URLs through IndexNow after deployment.
- Do not commit private webmaster tokens or account credentials.
