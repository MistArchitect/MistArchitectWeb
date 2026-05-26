import type { Metadata } from "next";

import { about, type Project } from "@/content/site";
import { defaultLocale, locales, otherLocale, type Locale, withLocale } from "@/lib/i18n";
import { mediaUrl } from "@/lib/media";

const DEFAULT_SITE_ORIGIN = "https://mist-arch.com";

export const siteOrigin = (
  process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_ORIGIN
).replace(/\/+$/, "");

export const siteBrand = {
  zh: "岚·建筑设计",
  en: "MIST Architects"
} satisfies Record<Locale, string>;

export const siteDescription = {
  zh: "岚·建筑设计是由程博和李博创立的建筑事务所，关注建筑、室内、城市更新、公共文化空间与材料研究。",
  en: "MIST Architects is an architecture studio founded by Cheng Bo and Li Bo, working across architecture, interiors, adaptive reuse, public cultural spaces, and material research."
} satisfies Record<Locale, string>;

export const siteKeywords = {
  zh: [
    "岚·建筑设计",
    "MIST Architects",
    "建筑设计",
    "室内设计",
    "城市更新",
    "公共文化建筑",
    "深圳建筑事务所"
  ],
  en: [
    "MIST Architects",
    "architecture studio",
    "interior design",
    "adaptive reuse",
    "public architecture",
    "cultural architecture",
    "Shenzhen architecture practice"
  ]
} satisfies Record<Locale, string[]>;

type PageMetadataInput = {
  title: string;
  description: string;
  locale: Locale;
  path?: string;
  image?: string;
  imageAlt?: string;
  keywords?: string[];
  type?: "website" | "article";
};

export function siteUrl(path = "") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${siteOrigin}${cleanPath === "/" ? "" : cleanPath}`;
}

export function localizedSiteUrl(locale: Locale, path = "") {
  return siteUrl(withLocale(locale, path));
}

export function languageAlternates(path = "") {
  return {
    "zh-CN": localizedSiteUrl("zh", path),
    en: localizedSiteUrl("en", path),
    "x-default": localizedSiteUrl(defaultLocale, path)
  };
}

export function absoluteUrl(url: string) {
  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return siteUrl(url);
}

export function buildPageMetadata({
  title,
  description,
  locale,
  path = "",
  image = mediaUrl(about.heroImage, { width: 1920, quality: "std" }),
  imageAlt = title,
  keywords = [],
  type = "website"
}: PageMetadataInput): Metadata {
  const canonical = localizedSiteUrl(locale, path);
  const fullTitle = formatTitle(title);
  const imageUrl = absoluteUrl(image);

  return {
    title,
    description,
    keywords: [...siteKeywords[locale], ...keywords],
    alternates: {
      canonical,
      languages: languageAlternates(path)
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonical,
      siteName: "MIST Architects",
      locale: openGraphLocale(locale),
      alternateLocale: [openGraphLocale(otherLocale(locale))],
      type,
      images: [
        {
          url: imageUrl,
          alt: imageAlt
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [imageUrl]
    }
  };
}

export function organizationJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@id": `${siteOrigin}/#organization`,
    "@type": ["Organization", "ArchitecturalService"],
    name: siteBrand[locale],
    alternateName: ["MIST Architects", "岚·建筑设计"],
    url: localizedSiteUrl(locale),
    logo: absoluteUrl(mediaUrl("LOGO/logo.png", { quality: "raw" })),
    image: absoluteUrl(mediaUrl(about.heroImage, { width: 1920, quality: "std" })),
    description: siteDescription[locale],
    email: "info@mist-arch.com",
    telephone: "+86 186 1303 3310",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        locale === "zh"
          ? "深圳市福田区福保街道福保社区槟榔道1号吉虹研发大厦B栋7层702"
          : "Room 702, Building B, Jihong R&D Building, No. 1 Binlang Road, Fubao Community, Fubao Subdistrict, Futian District",
      addressLocality: "Shenzhen",
      addressRegion: "Guangdong",
      addressCountry: "CN"
    },
    founder: about.founders.map((founder) => ({
      "@type": "Person",
      name: founder.name[locale]
    }))
  };
}

export function websiteJsonLd(locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteOrigin}/#website`,
    name: siteBrand[locale],
    alternateName: ["MIST Architects", "岚·建筑设计"],
    url: localizedSiteUrl(locale),
    inLanguage: locale === "zh" ? "zh-CN" : "en",
    publisher: {
      "@id": `${siteOrigin}/#organization`
    }
  };
}

export function projectJsonLd(locale: Locale, project: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${localizedSiteUrl(locale, `/projects/${project.slug}`)}#project`,
    name: project.title[locale],
    headline: project.title[locale],
    description: project.dek[locale],
    url: localizedSiteUrl(locale, `/projects/${project.slug}`),
    image: absoluteUrl(project.heroImage),
    creator: {
      "@id": `${siteOrigin}/#organization`
    },
    publisher: {
      "@id": `${siteOrigin}/#organization`
    },
    dateCreated: project.year || undefined,
    locationCreated: project.location[locale],
    inLanguage: locale === "zh" ? "zh-CN" : "en",
    about: [project.typology[locale], project.status[locale]].filter(Boolean)
  };
}

export function breadcrumbJsonLd(
  locale: Locale,
  items: Array<{
    name: string;
    path: string;
  }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: localizedSiteUrl(locale, item.path)
    }))
  };
}

export function jsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function formatTitle(title: string) {
  return title.includes("MIST Architects") ? title : `${title} | MIST Architects`;
}

function openGraphLocale(locale: Locale) {
  return locale === "zh" ? "zh_CN" : "en_US";
}

export function sitemapAlternates(path = "") {
  return locales.reduce<Record<string, string>>(
    (result, locale) => ({
      ...result,
      [locale === "zh" ? "zh-CN" : "en"]: localizedSiteUrl(locale, path)
    }),
    {
      "x-default": localizedSiteUrl(defaultLocale, path)
    }
  );
}
