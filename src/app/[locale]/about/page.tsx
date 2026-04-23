import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutHeroCarousel } from "@/components/about-hero-carousel";
import { GsapPageMotion } from "@/components/gsap-page-motion";
import { MotionReveal } from "@/components/motion-reveal";
import { OssPicture } from "@/components/oss-picture";
import { about } from "@/content/site";
import { isLocale, type Locale } from "@/lib/i18n";
import { mediaUrl } from "@/lib/media";

export const revalidate = 60;

type AboutPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    return {};
  }

  const locale = rawLocale as Locale;

  return {
    title: about.hero.title[locale],
    description: about.hero.deck[locale],
    openGraph: {
      title: about.hero.title[locale],
      description: about.hero.deck[locale],
      images: [mediaUrl(about.heroImage)]
    }
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const introHeading = locale === "zh" ? "岚" : "MIST Architects";
  const foundersHeading = locale === "zh" ? "创始人" : "Founders";
  const mediaGroups = [
    {
      label: locale === "zh" ? "行业及获奖经历" : "Awards and Recognition",
      items: about.media.body[locale]
    },
    {
      label: about.publications.label[locale],
      items: about.publications.body[locale]
    }
  ];

  return (
    <main className="about-page about-office-page">
      <GsapPageMotion page="about" />
      <section className="about-scroll-overlay" aria-label={locale === "zh" ? "岚" : "About"}>
        <div className="about-hero-sticky">
          <section className="about-hero" aria-labelledby="about-title">
            <h1 id="about-title" className="sr-only">{about.hero.title[locale]}</h1>
            <AboutHeroCarousel
              horizontal={about.aboutHero.horizontal}
              vertical={about.aboutHero.vertical}
            />
            <a
              aria-label={locale === "zh" ? "向下滚动查看更多" : "Scroll down for more"}
              className="about-scroll-hint"
              href="#intro"
            >
              <span className="hero-scroll-hint-chevron" aria-hidden="true" />
            </a>
          </section>
        </div>
        <div className="about-overlay-spacer" aria-hidden="true" />
        <div className="about-overlay-content">
          <div className="about-office-shell">
            <aside className="about-office-index">
              <nav
                className="about-subnav"
                aria-label={locale === "zh" ? "岚页面导航" : "About page navigation"}
              >
                {about.nav.map((item) => (
                  <a key={item.id} href={`#${item.id}`}>
                    {item.label[locale]}
                  </a>
                ))}
              </nav>
            </aside>

            <div className="about-office-content">
              <MotionReveal className="about-office-section about-intro-section" delay={0.05}>
                <section id="intro">
                  <h2>{introHeading}</h2>
                  <div className="about-long-copy">
                    <p className="about-lead">{about.intro.title[locale]}</p>
                    {about.intro.body[locale].map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              </MotionReveal>

              <section className="about-office-section about-founders" id="founders">
                <MotionReveal className="about-founders-image">
                  <OssPicture
                    path={about.foundersImage}
                    layout="portrait"
                    alt={
                      locale === "zh"
                        ? "创始人合影，左侧为李博，右侧为程博"
                        : "Founders, Li Bo on the left and Cheng Bo on the right"
                    }
                  />
                </MotionReveal>
                <MotionReveal className="about-founders-copy" delay={0.12}>
                  <h2>{foundersHeading}</h2>
                  <div className="founder-list">
                    {about.founders.map((founder, index) => (
                      <article className="founder-entry" key={`${founder.name[locale]}-${index}`}>
                        <p className="founder-position" aria-label={founder.positionLabel[locale]}>
                          {founder.position[locale]}
                        </p>
                        <h3>{founder.name[locale]}</h3>
                        <ul>
                          {founder.credentials[locale].map((credential) => (
                            <li key={credential}>{credential}</li>
                          ))}
                        </ul>
                      </article>
                    ))}
                  </div>
                </MotionReveal>
              </section>

              <MotionReveal className="about-office-section about-archive-section" delay={0.05}>
                <section id="media">
                  <h2>{about.media.label[locale]}</h2>
                  <div className="about-media-groups">
                    {mediaGroups.map((group) => (
                      <article className="about-media-group" key={group.label}>
                        <h3>{group.label}</h3>
                        <div className="about-archive-list">
                          {group.items.map((paragraph, index) => (
                            <p key={`${paragraph}-${index}`}>{paragraph}</p>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </MotionReveal>

              <MotionReveal
                className="about-office-section about-contact-section"
                delay={0.05}
              >
                <section id="contact">
                  <h2>{about.contact.label[locale]}</h2>
                  <div className="about-contact-lines">
                    {about.contact.body[locale].map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </section>
              </MotionReveal>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
