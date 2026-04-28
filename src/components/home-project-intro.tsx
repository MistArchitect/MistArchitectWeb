"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { Locale } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type HomeProjectIntroProps = {
  children: ReactNode;
  locale: Locale;
};

function shouldReduceMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function HomeProjectIntro({ children, locale }: HomeProjectIntroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const label = locale === "zh" ? "项目" : "Projects";
  const fixedLabel = locale === "zh" ? "项目索引" : "Project Index";

  useEffect(() => {
    const refresh = () => {
      requestAnimationFrame(() => ScrollTrigger.refresh(true));
    };

    window.addEventListener("pageshow", refresh);
    window.addEventListener("popstate", refresh);

    return () => {
      window.removeEventListener("pageshow", refresh);
      window.removeEventListener("popstate", refresh);
    };
  }, []);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section || shouldReduceMotion()) return undefined;

    const flash = section.querySelector(".home-project-intro-flash");
    const compact = section.querySelector(".home-project-intro-fixed");
    const pageOne = section.querySelector("[data-featured-page='0']");
    const pageTwo = section.querySelector("[data-featured-page='1']");
    const firstTiles = Array.from(pageOne?.querySelectorAll(".featured-tilted-tile") || []);
    const secondTiles = Array.from(pageTwo?.querySelectorAll(".featured-tilted-tile") || []);
    const allTiles = [...firstTiles, ...secondTiles];

    gsap.set(flash, { autoAlpha: 0, y: 0, scale: 0.96, filter: "blur(10px)" });
    gsap.set(compact, { autoAlpha: 0, y: -16 });
    gsap.set(pageTwo, { autoAlpha: 0, pointerEvents: "none" });
    gsap.set(allTiles, {
      autoAlpha: 0,
      y: 92,
      scale: 0.94,
      filter: "blur(10px)"
    });

    const timeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=430%",
        pin: true,
        scrub: 0.55,
        anticipatePin: 1
      }
    });

    timeline
      .to(flash, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.14,
        ease: "power3.out"
      })
      .to(flash, {
        autoAlpha: 0,
        y: -56,
        scale: 1.08,
        filter: "blur(8px)",
        duration: 0.14,
        ease: "power2.in"
      }, 0.18)
      .to(compact, {
        autoAlpha: 1,
        y: 0,
        duration: 0.16,
        ease: "power3.out"
      }, 0.23)
      .to(firstTiles, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.52,
        ease: "power3.out",
        stagger: {
          each: 0.08,
          from: "start"
        }
      }, 0.42)
      .to(firstTiles, {
        autoAlpha: 0,
        y: -62,
        scale: 0.96,
        filter: "blur(10px)",
        duration: 0.34,
        ease: "power2.in",
        stagger: {
          each: 0.045,
          from: "end"
        }
      }, 1.02)
      .set(pageOne, { pointerEvents: "none" }, 1.12)
      .set(pageTwo, { autoAlpha: 1, pointerEvents: "auto" }, 1.16)
      .to(secondTiles, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.52,
        ease: "power3.out",
        stagger: {
          each: 0.08,
          from: "start"
        }
      }, 1.18);
  }, { dependencies: [locale], scope: sectionRef });

  return (
    <section className="home-project-intro" aria-label={label} ref={sectionRef}>
      <div className="home-project-intro-stage">
        <div className="home-project-intro-flash" aria-hidden="true">
          <span>{label}</span>
        </div>

        <div className="home-project-intro-fixed">
          <strong>{fixedLabel}</strong>
        </div>

        <div className="home-project-sequence-grid">
          {children}
        </div>
      </div>
    </section>
  );
}
