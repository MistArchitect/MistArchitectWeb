import Link from "next/link";

import { type Locale, withLocale } from "@/lib/i18n";
import { LanguageSwitch } from "./language-switch";
import { MobileMenu } from "./mobile-menu";

type SiteHeaderProps = {
  locale: Locale;
};

export function SiteHeader({ locale }: SiteHeaderProps) {
  const brandLabel = locale === "zh" ? "岚·建筑设计" : "MIST Architects";
  const homeLabel = locale === "zh" ? "岚·建筑设计首页" : "MIST Architects home";

  return (
    <header className="site-header" aria-label="MIST Architects">
      <div className="main-nav">
        <Link className="brand-mark" href={withLocale(locale, "/")} aria-label={homeLabel}>
          <span className="brand-wordmark">{brandLabel}</span>
        </Link>
        <div className="header-actions">
          <LanguageSwitch locale={locale} />
          <MobileMenu locale={locale} />
        </div>
      </div>
    </header>
  );
}
