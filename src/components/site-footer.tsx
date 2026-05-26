import type { Locale } from "@/lib/i18n";

type SiteFooterProps = {
  locale: Locale;
};

const footerCopy = {
  zh: {
    brand: "岚·建筑设计",
    rights: "All Rights Reserved",
    progress: "项目档案与近作记录。"
  },
  en: {
    brand: "MIST Architects",
    rights: "All Rights Reserved",
    progress: "Project archive and recent work."
  }
} as const;

export function SiteFooter({ locale }: SiteFooterProps) {
  const copy = footerCopy[locale];
  const icpLicense =
    process.env.NEXT_PUBLIC_ICP_LICENSE?.trim() || "粤ICP备2026051307号-1";

  return (
    <footer className="site-footer" aria-label={locale === "zh" ? "网站信息" : "Site information"}>
      <p className="site-footer-progress">{copy.progress}</p>
      <p className="site-footer-meta">
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
