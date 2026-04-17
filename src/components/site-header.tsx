import Link from "next/link";
import { type Locale, withLocale } from "@/lib/i18n";
import { LanguageSwitch } from "./language-switch";
import { MobileMenu } from "./mobile-menu";

type SiteHeaderProps = {
  locale: Locale;
};

export function SiteHeader({ locale }: SiteHeaderProps) {
  const brandLabel = locale === "zh" ? "岚·建筑设计" : "MIST";

  return (
    <header className="site-header" aria-label="Mist Architect">
      <div className="main-nav">
        <Link className="brand-mark" href={withLocale(locale, "/")}>
          {brandLabel}
        </Link>
        <div className="header-actions">
          <LanguageSwitch locale={locale} />
          <MobileMenu locale={locale} />
        </div>
      </div>
    </header>
  );
}
