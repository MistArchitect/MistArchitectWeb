# Mist Architect Deployment Plan

This plan keeps early iteration fast while leaving a clean route to a mainland-China-ready production stack.

## Current Priorities

- Keep GitHub as the source of truth.
- Use automated checks on every push and pull request.
- Keep the first public preview easy to deploy and review.
- Avoid locking the frontend to one CMS or one hosting platform.
- Move production images and video away from third-party stock URLs before launch.

## Phase 1: GitHub and Preview

Use GitHub for code review and CI. The repository should keep `main` protected once the first preview is stable.

Recommended preview target:

- Vercel for fast Next.js preview deployments.
- Sanity Studio for early content modeling and editor testing.
- Sanity dataset variables set in the deployment platform, not committed to git.

Required deployment variables:

```text
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-04-13
SANITY_API_READ_TOKEN=
```

Notes:

- `SANITY_API_READ_TOKEN` is optional until private datasets, preview mode, or draft reads are enabled.
- The current frontend has a local content fallback, so build checks pass without CMS credentials.
- Use Vercel preview URLs for design and content review, not as the final mainland availability guarantee.

## Phase 2: Mainland-Ready Production

If the main audience and editors are in mainland China, plan for a domestic hosting and media path.

Recommended production stack:

- Compute: Alibaba Cloud ECS, Tencent Cloud CVM, or a managed container service in mainland China.
- Runtime: Next.js standalone build behind Nginx or a container gateway.
- Media: Alibaba Cloud OSS or Tencent Cloud COS.
- CDN: the matching cloud provider CDN after ICP filing is complete.
- CMS: self-hosted Directus or Strapi if Sanity access is not reliable enough for editors.
- Database: PostgreSQL or MySQL in the same cloud region as the CMS.

Why this path:

- A domestic object-storage and CDN path avoids relying on Unsplash, Pixabay, or overseas CMS asset delivery.
- A self-hosted CMS keeps the admin experience close to the production audience.
- Next.js `output: "standalone"` keeps the app portable for Node server, Docker, and cloud VM deployment.

## ICP and Domain Notes

For mainland China hosting or mainland CDN use, prepare ICP filing early. Cloud providers usually require a real-name verified domain, business or individual documents, a mainland cloud resource, and provider-specific filing steps.

If the site does not need mainland infrastructure at first, a Hong Kong or Singapore preview deployment can stay unfiled, but the browsing and editor experience may vary by network.

## Media Policy

Before launch:

- Replace all seed Unsplash and Pixabay URLs with licensed Mist Architect assets.
- Store original images in the CMS or object storage.
- Use image alt text in both Chinese and English.
- Compress video into web delivery formats before upload.
- Keep source video archives outside the web delivery bucket.

## Operational Checklist

- GitHub CI passes on `main`.
- Deployment target has the same Node major version as `.nvmrc`.
- Environment variables are configured in the deployment console.
- CMS editors can upload, publish, and preview one real project.
- Project detail pages render hero images, gallery images, and project film sections.
- CDN cache behavior is documented before final launch.
- Domain, ICP filing, analytics, sitemap, and structured data are handled before public release.
