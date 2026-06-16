import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { IntroSplash } from "@/components/intro-splash";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";
import { SmoothScrollProvider } from "@/components/smooth-scroll-provider";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import {
  jsonLd,
  organizationJsonLd,
  siteDescription,
  siteKeywords,
  siteOrigin,
  websiteJsonLd
} from "@/lib/seo";

import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  applicationName: "MIST Architects",
  title: {
    default: "岚·建筑设计 | MIST Architects",
    template: "%s | MIST Architects"
  },
  description: siteDescription.zh,
  keywords: siteKeywords.zh,
  authors: [{ name: "MIST Architects", url: siteOrigin }],
  creator: "MIST Architects",
  publisher: "MIST Architects",
  category: "architecture",
  robots: {
    index: true,
    follow: true
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false
  }
};

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;

  return (
    <html data-scroll-behavior="smooth" lang={locale}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(organizationJsonLd(locale)) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(websiteJsonLd(locale)) }}
        />
        <SmoothScrollProvider>
          <IntroSplash logoAlt={locale === "zh" ? "岚·建筑设计" : "MIST Architects"} />
          <SiteHeader locale={locale} />
          {children}
          <SiteFooter locale={locale} />
          <ScrollToTopButton locale={locale} />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
