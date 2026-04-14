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

  return (
    <main className="about-page">
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

      <nav className="about-subnav" aria-label={locale === "zh" ? "岚页面导航" : "About page navigation"}>
        {about.nav.map((item) => (
          <a key={item.id} href={`#${item.id}`}>
            {item.label[locale]}
          </a>
        ))}
      </nav>

      <section className="about-scroll-story" id="intro">
        <div className="about-story-index">
          <span>{about.intro.label[locale]}</span>
        </div>
        <MotionReveal className="about-story-copy">
          <p className="kicker">MIST / 01</p>
          <h2>{about.intro.title[locale]}</h2>
          {about.intro.body[locale].map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </MotionReveal>
      </section>

      <section className="about-founders" id="founders">
        <MotionReveal className="about-founders-image">
          <Image
            src={about.foundersImage}
            alt={locale === "zh" ? "Mist Architect 创始人" : "Mist Architect founders"}
            width={1400}
            height={1800}
            sizes="(min-width: 980px) 45vw, 100vw"
          />
        </MotionReveal>
        <MotionReveal className="about-founders-copy" delay={0.12}>
          <p className="kicker">MIST / 02 / {locale === "zh" ? "创始人" : "Founders"}</p>
          <div className="founder-list">
            {about.founders.map((founder, index) => (
              <article className="founder-entry" key={`${founder.name[locale]}-${index}`}>
                <h2>{founder.name[locale]}</h2>
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

      <section className="about-scroll-story" id="media">
        <div className="about-story-index">
          <span>{about.media.label[locale]}</span>
        </div>
        <MotionReveal className="about-story-copy">
          <p className="kicker">MIST / 03</p>
          <h2>{about.media.title[locale]}</h2>
          {about.media.body[locale].map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </MotionReveal>
      </section>

      <section className="about-scroll-story about-contact-story" id="contact">
        <div className="about-story-index">
          <span>{about.contact.label[locale]}</span>
        </div>
        <MotionReveal className="about-story-copy">
          <p className="kicker">MIST / 04</p>
          <h2>{about.contact.title[locale]}</h2>
          {about.contact.body[locale].map((line) => (
            <p key={line}>{line}</p>
          ))}
        </MotionReveal>
      </section>
    </main>
  );
}
