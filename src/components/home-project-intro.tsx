import type { ReactNode } from "react";

import type { Locale } from "@/lib/i18n";

type HomeProjectIntroProps = {
  children: ReactNode;
  locale: Locale;
};

export function HomeProjectIntro({ children, locale }: HomeProjectIntroProps) {
  const label = locale === "zh" ? "项目索引" : "Project Index";

  return (
    <section className="home-project-intro" aria-label={label}>
      <header className="home-project-intro-header">
        <strong>{label}</strong>
      </header>
      <div className="home-project-sequence-grid">{children}</div>
    </section>
  );
}
