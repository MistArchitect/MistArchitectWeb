import Link from "next/link";
import { type Locale, withLocale } from "@/lib/i18n";
import { MobileMenu } from "./mobile-menu";

type SiteHeaderProps = {
  locale: Locale;
};

export function SiteHeader({ locale }: SiteHeaderProps) {
  return (
    <header className="site-header" aria-label="Mist Architect">
      <div className="main-nav">
        <Link className="brand-mark" href={withLocale(locale, "/")}>
          Mist Architect/岚
        </Link>
        <MobileMenu locale={locale} />
      </div>
    </header>
  );
}
