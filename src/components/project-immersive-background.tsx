"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";

type ProjectHeroSlide = {
  src: string;
};

type ProjectImmersiveBackgroundProps = {
  heroSlides: ProjectHeroSlide[];
};

const SLIDE_INTERVAL_MS = 5000;

export function ProjectImmersiveBackground({ heroSlides }: ProjectImmersiveBackgroundProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const isStaticImage = heroSlides.length <= 1;

  useEffect(() => {
    if (isStaticImage || prefersReducedMotion()) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % heroSlides.length);
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [heroSlides.length, isStaticImage]);

  return (
    <div className="project-immersive-sticky" aria-hidden="true">
      <div
        className="project-immersive-carousel"
        data-slide-count={heroSlides.length}
        data-static-image={isStaticImage ? "true" : undefined}
      >
        {heroSlides.map((slide, index) => (
          <img
            alt=""
            className={`project-immersive-slide${index === activeIndex ? " is-active" : ""}`}
            key={`${slide.src}-${index}`}
            loading={index === 0 ? "eager" : "lazy"}
            src={slide.src}
          />
        ))}
      </div>
      <div className="project-immersive-shade" />
    </div>
  );
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
