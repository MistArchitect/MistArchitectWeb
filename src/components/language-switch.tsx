"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Locale } from "@/lib/i18n";

type LanguageSwitchProps = {
  locale: Locale;
};

export function LanguageSwitch({ locale }: LanguageSwitchProps) {
  const pathname = usePathname();
  const withoutLocale = pathname.replace(/^\/(zh|en)(?=\/|$)/, "") || "/";
  const zhHref = `/zh${withoutLocale === "/" ? "" : withoutLocale}`;
  const enHref = `/en${withoutLocale === "/" ? "" : withoutLocale}`;

  return (
    <nav
      aria-label={locale === "zh" ? "语言切换" : "Language switch"}
      className="language-switch"
    >
      {locale === "zh" ? (
        <span aria-current="page">中文</span>
      ) : (
        <Link href={zhHref}>中文</Link>
      )}
      <span aria-hidden="true">|</span>
      {locale === "en" ? (
        <span aria-current="page">EN</span>
      ) : (
        <Link href={enHref}>EN</Link>
      )}
    </nav>
  );
}
