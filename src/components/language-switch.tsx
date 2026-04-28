"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Locale } from "@/lib/i18n";

type LanguageSwitchProps = {
  as?: "div" | "nav";
  locale: Locale;
};

export function LanguageSwitch({ as = "nav", locale }: LanguageSwitchProps) {
  const pathname = usePathname();
  const withoutLocale = pathname.replace(/^\/(zh|en)(?=\/|$)/, "") || "/";
  const target: Locale = locale === "zh" ? "en" : "zh";
  const href = `/${target}${withoutLocale === "/" ? "" : withoutLocale}`;
  const label = target === "zh" ? "中" : "EN";
  const aria = locale === "zh" ? "切换到英文" : "Switch to Chinese";
  const Element = as;

  return (
    <Element className="language-switch">
      <Link aria-label={aria} href={href}>
        {label}
      </Link>
    </Element>
  );
}
