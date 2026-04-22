import { Hero } from "@/components/hero";
import { MotionReveal } from "@/components/motion-reveal";
import { OssPicture } from "@/components/oss-picture";
import { SectionRibbon } from "@/components/section-ribbon";
import { featuredTiles } from "@/content/site";
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
            <div className="project-grid featured-grid recommended-grid">
              {featuredTiles.map((tile, index) => {
                const eyebrow = `${tile.year} · ${tile.location[locale]}`;
                const title = tile.title[locale];
                const alt = locale === "zh"
                  ? `${tile.location.zh} · ${tile.title.zh}`
                  : `${tile.location.en} · ${tile.title.en}`;

                return (
                  <article
                    key={tile.id}
                    className="story-tile project-tile"
                  >
                    <div className="project-card-media" aria-label={title}>
                      <OssPicture
                        path={tile.image}
                        layout="feature"
                        alt={alt}
                        priority={index === 0}
                      />
                    </div>
                    <div className="story-copy">
                      <p className="featured-project-eyebrow">{eyebrow}</p>
                      <h2 className="featured-project-title">{title}</h2>
                    </div>
                  </article>
                );
              })}
            </div>
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
