import Link from "next/link";

import { navigation } from "@/content/site";
import { localeLabel, otherLocale, type Locale, withLocale } from "@/lib/i18n";

type SiteHeaderProps = {
  locale: Locale;
};

export function SiteHeader({ locale }: SiteHeaderProps) {
  const alternateLocale = otherLocale(locale);

  return (
    <header className="site-header" aria-label="Mist Architect">
      <div className="utility-bar">
        <span>ARCHITECTURE / ARCHIVE / FILMS</span>
        <Link href={withLocale(alternateLocale)}>{localeLabel(alternateLocale)}</Link>
      </div>
      <div className="main-nav">
        <Link className="brand-mark" href={withLocale(locale)}>
          Mist Architect
        </Link>
        <nav className="nav-links" aria-label="Primary navigation">
          {navigation[locale].map((item) => (
            <Link key={item.href} href={withLocale(locale, item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
