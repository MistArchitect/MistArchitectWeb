import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { MotionReveal } from "@/components/motion-reveal";
import { about } from "@/content/site";
import { isLocale, type Locale } from "@/lib/i18n";

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
      images: [about.heroImage]
    }
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const introHeading = locale === "zh" ? "事务所简介" : "Office Profile";
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
      <section className="about-hero" aria-labelledby="about-title">
        <Image
          src={about.heroImage}
          alt={locale === "zh" ? "Mist Architect 办公空间" : "Mist Architect office"}
          fill
          priority
          sizes="100vw"
        />
        <div className="about-hero-copy">
          <p className="kicker">{about.hero.kicker[locale]}</p>
          <h1 id="about-title">{about.hero.title[locale]}</h1>
          <p>{about.hero.deck[locale]}</p>
        </div>
      </section>

      <div className="about-office-shell">
        <aside className="about-office-index">
          <a className="about-office-name" href="#intro">
            Mist Architect
          </a>
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
              <p className="kicker">Mist Architect</p>
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
              <Image
                src={about.foundersImage}
                alt={
                  locale === "zh"
                    ? "Mist Architect 创始人合影，左侧为李博，右侧为程博"
                    : "Mist Architect founders, Li Bo on the left and Cheng Bo on the right"
                }
                width={1400}
                height={1800}
                sizes="(min-width: 1180px) 38vw, (min-width: 760px) 44vw, 100vw"
              />
            </MotionReveal>
            <MotionReveal className="about-founders-copy" delay={0.12}>
              <p className="kicker">Mist Architect</p>
              <h2>{foundersHeading}</h2>
              <div className="founder-list">
                {about.founders.map((founder, index) => (
                  <article className="founder-entry" key={`${founder.name[locale]}-${index}`}>
                    <p className="founder-position">{founder.position[locale]}</p>
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
              <p className="kicker">Mist Architect</p>
              <h2>{about.media.label[locale]}</h2>
              <p className="about-lead">{about.media.title[locale]}</p>
              <div className="about-media-groups">
                {mediaGroups.map((group) => (
                  <article className="about-media-group" key={group.label}>
                    <h3>{group.label}</h3>
                    <div className="about-archive-list">
                      {group.items.map((paragraph, index) => (
                        <p key={paragraph}>
                          <span>{String(index + 1).padStart(2, "0")}</span>
                          {paragraph}
                        </p>
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
              <p className="kicker">Mist Architect</p>
              <h2>{about.contact.label[locale]}</h2>
              <p className="about-lead">{about.contact.title[locale]}</p>
              <div className="about-contact-lines">
                {about.contact.body[locale].map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </section>
          </MotionReveal>
        </div>
      </div>
    </main>
  );
}
