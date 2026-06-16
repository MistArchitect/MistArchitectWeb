import type { MetadataRoute } from "next";

import { siteOrigin } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/api/media"],
      disallow: ["/api/"]
    },
    sitemap: `${siteOrigin}/sitemap.xml`,
    host: siteOrigin
  };
}
