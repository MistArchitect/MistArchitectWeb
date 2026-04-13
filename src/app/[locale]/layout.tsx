import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { SiteHeader } from "@/components/site-header";
import { isLocale, locales, type Locale } from "@/lib/i18n";

import "../globals.css";

export const metadata: Metadata = {
  title: {
    default: "Mist Architect",
    template: "%s | Mist Architect"
  },
  description:
    "A bilingual architecture studio website for projects, films, journals, and long-term editorial updates."
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
        <SiteHeader locale={locale} />
        {children}
      </body>
    </html>
  );
}
