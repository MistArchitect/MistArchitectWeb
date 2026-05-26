import type { MetadataRoute } from "next";

import { getProjectSlugs } from "@/lib/content";
import { localizedSiteUrl, sitemapAlternates } from "@/lib/seo";
import { locales, type Locale } from "@/lib/i18n";

export const revalidate = 3600;

type SitemapEntryInput = {
  path?: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projectSlugs = await getProjectSlugs();
  const entries: SitemapEntryInput[] = [
    {
      path: "",
      priority: 1,
      changeFrequency: "weekly"
    },
    {
      path: "/projects",
      priority: 0.9,
      changeFrequency: "weekly"
    },
    {
      path: "/about",
      priority: 0.8,
      changeFrequency: "monthly"
    },
    {
      path: "/journal",
      priority: 0.5,
      changeFrequency: "monthly"
    },
    ...projectSlugs.map((slug) => ({
      path: `/projects/${slug}`,
      priority: 0.7,
      changeFrequency: "monthly" as const
    }))
  ];

  return entries.flatMap((entry) =>
    locales.map((locale) => sitemapEntry(locale, entry))
  );
}

function sitemapEntry(locale: Locale, entry: SitemapEntryInput): MetadataRoute.Sitemap[number] {
  const path = entry.path ?? "";

  return {
    url: localizedSiteUrl(locale, path),
    alternates: {
      languages: sitemapAlternates(path)
    },
    changeFrequency: entry.changeFrequency,
    priority: entry.priority
  };
}
