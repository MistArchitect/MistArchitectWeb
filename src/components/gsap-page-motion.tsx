"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type GsapPageMotionProps = {
  page: "home" | "about" | "project";
};

function shouldReduceMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function GsapPageMotion({ page }: GsapPageMotionProps) {
  useGSAP(() => {
    if (shouldReduceMotion()) return undefined;

    if (page === "home") {
      return setupHomeMotion();
    }

    if (page === "about") {
      return setupAboutMotion();
    }

    return setupProjectMotion();
  }, [page]);

  return null;
}

function setupHomeMotion() {
  const heroImages = gsap.utils.toArray<HTMLElement>(".home-hero-sticky .hero-media");
  if (heroImages.length > 0) {
    gsap.to(heroImages, {
      scale: 1.075,
      yPercent: 4,
      ease: "none",
      scrollTrigger: {
        trigger: ".home-scroll-overlay",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }

  const featuredTiles = gsap.utils.toArray<HTMLElement>(".featured-project-reactive-tile");
  if (featuredTiles.length > 0) {
    gsap.from(featuredTiles, {
      autoAlpha: 0,
      y: 56,
      duration: 1.15,
      ease: "power3.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".recommended-grid",
        start: "top 82%"
      }
    });
  }
}

function setupAboutMotion() {
  const heroSlides = gsap.utils.toArray<HTMLElement>(".about-hero-slide");
  if (heroSlides.length > 0) {
    gsap.to(heroSlides, {
      scale: 1.085,
      yPercent: 5,
      ease: "none",
      scrollTrigger: {
        trigger: ".about-scroll-overlay",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }

  gsap.utils.toArray<HTMLElement>(".about-office-section").forEach((section) => {
    const targets = section.querySelectorAll("h2, h3, p, li");
    if (targets.length === 0) return;

    gsap.from(targets, {
      autoAlpha: 0,
      y: 28,
      duration: 0.95,
      ease: "power3.out",
      stagger: 0.045,
      scrollTrigger: {
        trigger: section,
        start: "top 76%"
      }
    });
  });

  const founderImage = document.querySelector<HTMLElement>(".about-founders-image img");
  if (founderImage) {
    gsap.fromTo(
      founderImage,
      { yPercent: -4, scale: 1.04 },
      {
        yPercent: 4,
        scale: 1.04,
        ease: "none",
        scrollTrigger: {
          trigger: ".about-founders",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );
  }
}

function setupProjectMotion() {
  const heroSlides = gsap.utils.toArray<HTMLElement>(".project-immersive-slide");
  if (heroSlides.length > 0) {
    gsap.to(heroSlides, {
      scale: 1.12,
      yPercent: 5,
      ease: "none",
      scrollTrigger: {
        trigger: ".project-immersive",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });
  }

  const lockupTargets = document.querySelectorAll(
    ".project-immersive-lockup .kicker, .project-immersive-lockup h1, .project-title-rule, .project-immersive-lockup p:not(.kicker)"
  );
  if (lockupTargets.length > 0) {
    gsap.from(lockupTargets, {
      autoAlpha: 0,
      y: 34,
      duration: 1.05,
      ease: "power3.out",
      stagger: 0.08,
      delay: 0.1
    });
  }

  gsap.utils.toArray<HTMLElement>(".project-story-block").forEach((block) => {
    const media = block.querySelectorAll(".project-story-media figure");
    const copy = block.querySelectorAll(".project-story-copy > *");

    if (media.length > 0) {
      gsap.from(media, {
        autoAlpha: 0,
        y: 52,
        duration: 1.15,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: block,
          start: "top 78%"
        }
      });
    }

    if (copy.length > 0) {
      gsap.from(copy, {
        autoAlpha: 0,
        y: 26,
        duration: 0.95,
        ease: "power3.out",
        stagger: 0.055,
        scrollTrigger: {
          trigger: block,
          start: "top 72%"
        }
      });
    }
  });

  gsap.utils.toArray<HTMLElement>(".project-story-media img").forEach((image) => {
    const figure = image.closest("figure");
    if (!figure) return;

    gsap.fromTo(
      image,
      { yPercent: -3, scale: 1.035 },
      {
        yPercent: 3,
        scale: 1.035,
        ease: "none",
        scrollTrigger: {
          trigger: figure,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      }
    );
  });
}
