import { Hero } from "@/components/hero";
import { FeaturedProjectField } from "@/components/featured-project-field";
import { MotionReveal } from "@/components/motion-reveal";
import { SectionRibbon } from "@/components/section-ribbon";
import { getHomeContent } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export const revalidate = 60;

type HomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const home = getHomeContent();

  return (
    <main className="home-page">
      <section className="home-scroll-overlay" aria-label={locale === "zh" ? "首页" : "Home"}>
        <div className="home-hero-sticky">
          <Hero locale={locale} />
        </div>
        <div className="home-overlay-spacer" aria-hidden="true" />
        <div className="home-overlay-content">
          <SectionRibbon>{home.indexLabel[locale]}</SectionRibbon>
          <MotionReveal className="section-shell">
            <FeaturedProjectField locale={locale} />
            <p className="home-progress-note">
              {locale === "zh"
                ? "网站内容持续更新中 / Work in progress."
                : "Work in progress. The website is being updated."}
            </p>
          </MotionReveal>
        </div>
      </section>
    </main>
  );
}
