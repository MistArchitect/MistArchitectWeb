"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { home } from "@/content/site";
import type { Locale } from "@/lib/i18n";

type HeroProps = {
  locale: Locale;
};

const HERO_AUTOPLAY_MS = 4500;

export function Hero({ locale }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplayResetKey, setAutoplayResetKey] = useState(0);
  const reduceMotion = useReducedMotion();
  const imageCount = home.hero.images.length;
  const caption = home.hero.captions[currentIndex]?.[locale];

  useEffect(() => {
    if (reduceMotion) {
      return undefined;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imageCount);
    }, HERO_AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [autoplayResetKey, imageCount, reduceMotion]);

  function resetAutoplay() {
    setAutoplayResetKey((key) => key + 1);
  }

  function goToPrevious() {
    setCurrentIndex((prev) => (prev - 1 + imageCount) % imageCount);
    resetAutoplay();
  }

  function goToNext() {
    setCurrentIndex((prev) => (prev + 1) % imageCount);
    resetAutoplay();
  }

  function goToImage(index: number) {
    setCurrentIndex(index);
    resetAutoplay();
  }

  return (
    <section className="hero-shell" aria-labelledby="hero-title">
      <h1 id="hero-title" className="sr-only">
        MIST Architects
      </h1>
      <AnimatePresence>
        <motion.img
          key={currentIndex}
          src={home.hero.images[currentIndex]}
          alt=""
          aria-hidden="true"
          className="hero-media"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </AnimatePresence>
      <button
        aria-label={locale === "zh" ? "上一张图片" : "Previous image"}
        className="hero-arrow hero-arrow-prev"
        onClick={goToPrevious}
        type="button"
      >
        <span className="hero-arrow-indicator" aria-hidden="true" />
      </button>
      <button
        aria-label={locale === "zh" ? "下一张图片" : "Next image"}
        className="hero-arrow hero-arrow-next"
        onClick={goToNext}
        type="button"
      >
        <span className="hero-arrow-indicator" aria-hidden="true" />
      </button>
      <div className="hero-carousel-controls" aria-label={locale === "zh" ? "首页图片轮播" : "Homepage image carousel"}>
        {caption ? (
          <AnimatePresence mode="wait">
            <motion.p
              key={caption}
              className="hero-caption"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              {caption}
            </motion.p>
          </AnimatePresence>
        ) : null}
        <div className="hero-dots">
          {home.hero.images.map((image, index) => (
            <button
              aria-label={
                locale === "zh"
                  ? `查看第 ${index + 1} 张图片`
                  : `Show image ${index + 1}`
              }
              aria-current={index === currentIndex ? "true" : undefined}
              className="hero-dot"
              key={image}
              onClick={() => goToImage(index)}
              type="button"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
