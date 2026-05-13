"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";

import { type Locale, withLocale } from "@/lib/i18n";

type BrandHomeLinkProps = {
  children: ReactNode;
  className?: string;
  homeLabel: string;
  locale: Locale;
};

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function BrandHomeLink({ children, className, homeLabel, locale }: BrandHomeLinkProps) {
  const pathname = usePathname();
  const homeHref = withLocale(locale, "/");
  const isHome = pathname === homeHref;

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      !isHome ||
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.altKey ||
      event.ctrlKey ||
      event.shiftKey
    ) {
      return;
    }

    event.preventDefault();
    if (window.location.pathname !== homeHref || window.location.hash) {
      window.history.replaceState(null, "", homeHref);
    }
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  return (
    <Link className={className} href={homeHref} aria-label={homeLabel} onClick={handleClick}>
      {children}
    </Link>
  );
}
