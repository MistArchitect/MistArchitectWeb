import type { Metadata } from "next";

import { about, type Project } from "@/content/site";
import { defaultLocale, locales, otherLocale, type Locale, withLocale } from "@/lib/i18n";
import { mediaMetadataUrl, mediaUrl } from "@/lib/media";

const DEFAULT_SITE_ORIGIN = "https://mist-arch.com";

export const siteOrigin = (
  process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_ORIGIN
).replace(/\/+$/, "");

export const siteBrand = {
  zh: "岚·建筑设计",
  en: "MIST Architects"
} satisfies Record<Locale, string>;

export const wechatSeoContact = {
  publicAccountId: "MIST-ARCH",
  publicAccountName: {
    zh: "岚建筑设计",
    en: "岚建筑设计"
  },
  publicAccount: {
    zh: "MIST-ARCH（岚建筑设计）",
    en: "MIST-ARCH (岚建筑设计)"
  },
  channels: {
    zh: "岚建筑",
    en: "岚建筑"
  },
  qrImage: "/20260531-191007.jpeg"
} satisfies {
  publicAccountId: string;
  publicAccountName: Record<Locale, string>;
  publicAccount: Record<Locale, string>;
  channels: Record<Locale, string>;
  qrImage: string;
};

export const siteDescription = {
  zh: "岚·建筑设计是由程博、李博创立的建筑事务所，专注建筑、室内、城市更新与公共文化空间。",
  en: "MIST Architects is a Shenzhen architecture studio working across cultural spaces, interiors, adaptive reuse, and public architecture."
} satisfies Record<Locale, string>;

export const siteKeywords = {
  zh: [
    "岚·建筑设计",
    "MIST Architects",
    "岚建筑设计公众号",
    "MIST-ARCH公众号",
    "微信公众号",
    "建筑设计",
    "室内设计",
    "城市更新",
    "公共文化建筑",
    "深圳建筑事务所"
  ],
  en: [
    "MIST Architects",
    "MIST-ARCH WeChat",
    "MIST Architects WeChat",
    "WeChat public account",
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
  const imageUrl = absoluteUrl(mediaMetadataUrl(image));
  const pageKeywords = Array.from(new Set([...siteKeywords[locale], ...keywords]));

  return {
    title,
    description,
    keywords: pageKeywords,
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
    alternateName: [
      "MIST Architects",
      "岚·建筑设计",
      "岚建筑设计",
      wechatSeoContact.publicAccountId,
      wechatSeoContact.publicAccount[locale]
    ],
    url: localizedSiteUrl(locale),
    logo: absoluteUrl(mediaMetadataUrl("LOGO/logo.png", { quality: "raw" })),
    image: absoluteUrl(mediaMetadataUrl(about.heroImage, { width: 1920, quality: "std" })),
    description: siteDescription[locale],
    email: "info@mist-arch.com",
    telephone: "+86 186 1303 3310",
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: locale === "zh" ? "微信公众账号" : "WeChat public account",
        name: wechatSeoContact.publicAccount[locale],
        availableLanguage: ["zh-CN", "en"]
      },
      {
        "@type": "ContactPoint",
        contactType: locale === "zh" ? "微信视频号" : "WeChat Channels",
        name: wechatSeoContact.channels[locale],
        availableLanguage: ["zh-CN"]
      },
      {
        "@type": "ContactPoint",
        contactType: locale === "zh" ? "业务咨询" : "Business inquiries",
        email: "info@mist-arch.com",
        telephone: "+86 186 1303 3310",
        availableLanguage: ["zh-CN", "en"]
      }
    ],
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
    })),
    identifier: [
      {
        "@type": "PropertyValue",
        propertyID: "WeChat Official Account ID",
        name: "WeChat Official Account ID",
        value: wechatSeoContact.publicAccountId
      },
      {
        "@type": "PropertyValue",
        propertyID: "WeChat Official Account Name",
        name: "WeChat Official Account Name",
        value: wechatSeoContact.publicAccountName[locale]
      },
      {
        "@type": "PropertyValue",
        propertyID: "WeChat Channels Name",
        name: "WeChat Channels Name",
        value: wechatSeoContact.channels[locale]
      }
    ],
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "WeChat public account",
        value: wechatSeoContact.publicAccount[locale]
      },
      {
        "@type": "PropertyValue",
        name: "WeChat Channels",
        value: wechatSeoContact.channels[locale]
      }
    ],
    subjectOf: [wechatQrImageJsonLd(locale)]
  };
}

export function aboutPageJsonLd(locale: Locale) {
  const url = localizedSiteUrl(locale, "/about");

  return {
    "@context": "https://schema.org",
    "@id": `${url}#about-page`,
    "@type": ["AboutPage", "ContactPage"],
    name: locale === "zh" ? "关于岚·建筑设计" : "About MIST Architects",
    description:
      locale === "zh"
        ? "岚·建筑设计事务所介绍、创始人、业务方向、联系方式、微信公众号 MIST-ARCH 与二维码。"
        : "MIST Architects studio profile, founders, services, contact details, WeChat public account MIST-ARCH, and QR code.",
    url,
    inLanguage: locale === "zh" ? "zh-CN" : "en",
    isPartOf: {
      "@id": `${siteOrigin}/#website`
    },
    publisher: {
      "@id": `${siteOrigin}/#organization`
    },
    about: {
      "@id": `${siteOrigin}/#organization`
    },
    mainEntity: {
      "@id": `${siteOrigin}/#organization`
    },
    hasPart: [wechatQrImageJsonLd(locale)]
  };
}

export function wechatQrImageJsonLd(locale: Locale) {
  return {
    "@type": "ImageObject",
    "@id": `${absoluteUrl(wechatSeoContact.qrImage)}#wechat-official-account-qr`,
    name:
      locale === "zh"
        ? "岚建筑设计微信公众号 MIST-ARCH 二维码"
        : "MIST Architects WeChat public account MIST-ARCH QR code",
    description:
      locale === "zh"
        ? "用于关注岚建筑设计微信公众号 MIST-ARCH 的二维码。"
        : "QR code for following the MIST Architects WeChat public account MIST-ARCH.",
    contentUrl: absoluteUrl(wechatSeoContact.qrImage),
    url: absoluteUrl(wechatSeoContact.qrImage),
    caption:
      locale === "zh"
        ? "岚建筑设计微信公众号：MIST-ARCH"
        : "MIST Architects WeChat public account: MIST-ARCH",
    encodingFormat: "image/jpeg",
    representativeOfPage: false,
    about: {
      "@id": `${siteOrigin}/#organization`
    }
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
    image: absoluteUrl(mediaMetadataUrl(project.heroImage)),
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
