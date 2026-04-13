import Link from "next/link";

import { home } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { withLocale } from "@/lib/i18n";

import { MotionReveal } from "./motion-reveal";

type HeroProps = {
  locale: Locale;
};

export function Hero({ locale }: HeroProps) {
  return (
    <section className="hero-shell" aria-labelledby="hero-title">
      <video
        className="hero-media"
        autoPlay
        muted
        loop
        playsInline
        poster={home.hero.poster}
        aria-hidden="true"
      >
        <source src={home.hero.video} type="video/mp4" />
      </video>
      <div className="hero-scrim" />
      <MotionReveal className="hero-copy">
        <p className="kicker">{home.hero.kicker[locale]}</p>
        <h1 id="hero-title">{home.hero.title[locale]}</h1>
        <p className="hero-deck">{home.hero.deck[locale]}</p>
        <div className="hero-actions" aria-label="Hero actions">
          <Link className="button button-inverted" href={withLocale(locale, "/projects")}>
            {home.hero.primaryCta[locale]}
          </Link>
          <Link className="text-link-on-dark" href={withLocale(locale, "/journal")}>
            {home.hero.secondaryCta[locale]}
          </Link>
        </div>
      </MotionReveal>
    </section>
  );
}
