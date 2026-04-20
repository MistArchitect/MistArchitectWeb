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
    <main>
      <Hero locale={locale} />

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
      </MotionReveal>
    </main>
  );
}
