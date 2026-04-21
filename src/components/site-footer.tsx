import type { Locale } from "@/lib/i18n";

type SiteFooterProps = {
  locale: Locale;
};

const footerCopy = {
  zh: {
    brand: "岚·建筑设计",
    rights: "All Rights Reserved"
  },
  en: {
    brand: "MIST Architects",
    rights: "All Rights Reserved"
  }
} as const;

export function SiteFooter({ locale }: SiteFooterProps) {
  const copy = footerCopy[locale];
  const icpLicense = process.env.NEXT_PUBLIC_ICP_LICENSE?.trim();

  return (
    <footer className="site-footer" aria-label={locale === "zh" ? "网站信息" : "Site information"}>
      <p>
        <span>© Copyright 2026</span>
        <span>{copy.brand}</span>
        <span>{copy.rights}</span>
        {icpLicense ? (
          <a href="https://beian.miit.gov.cn/" rel="noreferrer" target="_blank">
            {icpLicense}
          </a>
        ) : null}
      </p>
    </footer>
  );
}
