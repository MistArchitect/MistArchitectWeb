"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { OssPicture } from "@/components/oss-picture";
import { heroSlides } from "@/content/site";
import type { Locale } from "@/lib/i18n";

type HeroProps = {
  locale: Locale;
};

// Three viewport aspect bands so the hero source matches the screen
// shape without letterboxing:
//   portrait → narrow/tall (phones, split-screen) → 9:16 vertical master
//   standard → near-square (iPad-ish ~4:3)        → 4:3 horizontal master
//   wide     → widescreen desktop (≥ 16:10)       → 4:3 master cropped to 16:9 server-side
type AspectBand = "portrait" | "standard" | "wide";

const HERO_AUTOPLAY_MS = 4500;

// Server rendering defaults to wide — most first-paint visits come from
// 16:9 desktops. The client-side check switches bands after hydration.
const DEFAULT_BAND: AspectBand = "wide";

function pickSource(slide: (typeof heroSlides)[number], band: AspectBand) {
  if (band === "portrait") return slide.vertical;
  // Wide band prefers a photographer-framed 16:9 master when one is
  // supplied; falls back to the 4:3 master (which the `hero-wide`
  // layout will then server-crop to 16:9 via OSS `m_fill`).
  if (band === "wide" && slide.horizontalWide) return slide.horizontalWide;
  return slide.horizontal;
}

/**
 * Dedup slides whose picked source for the active band points at the
 * same file. Some slide entries deliberately share a horizontal or
 * vertical master (e.g. two "原野学社" slides share one horizontal crop,
 * two "万致天地" slides share one vertical crop) so that each orientation
 * exposes the extra crops it has. Rendering all of them on a band whose
 * source collapses to the same file shows the user the same image
 * twice. First-wins order preserves the author's intended sequence.
 */
function dedupSlidesForBand(
  slides: readonly (typeof heroSlides)[number][],
  band: AspectBand
): (typeof heroSlides)[number][] {
  const seen = new Set<string>();
  const kept: (typeof heroSlides)[number][] = [];
  for (const slide of slides) {
    const source = pickSource(slide, band);
    if (seen.has(source)) continue;
    seen.add(source);
    kept.push(slide);
  }
  return kept;
}

function pickLayout(slide: (typeof heroSlides)[number], band: AspectBand) {
  if (band === "portrait") return "hero-portrait" as const;
  if (band === "wide") {
    // Pre-shot 16:9 → resize only (`hero-landscape`). No server crop
    // so the photographer's framing is preserved byte-for-byte.
    // Otherwise fall back to `hero-wide` which server-crops 4:3 to
    // 16:9 at request time.
    return slide.horizontalWide ? ("hero-landscape" as const) : ("hero-wide" as const);
  }
  return "hero-landscape" as const;
}

export function Hero({ locale }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplayResetKey, setAutoplayResetKey] = useState(0);
  const [band, setBand] = useState<AspectBand>(DEFAULT_BAND);
  const reduceMotion = useReducedMotion();

  // Per-band deduped slide list. Recomputed only when the band changes
  // — `heroSlides` is a module-level constant.
  const visibleSlides = useMemo(() => dedupSlidesForBand(heroSlides, band), [band]);
  const imageCount = visibleSlides.length;

  // If the band switch shrinks the list below the stored index, derive
  // a safe index for rendering without mutating state inside a render
  // effect (lint rule `react-hooks/set-state-in-effect`). Every
  // navigation path — arrow keys, autoplay `(prev + 1) % count`, dot
  // clicks — writes an in-range value on the next tick, so the stored
  // index self-normalizes; this modulo only covers the render gap.
  const safeIndex = imageCount > 0 ? currentIndex % imageCount : 0;
  const caption = visibleSlides[safeIndex]?.caption[locale];

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    // Three bands so the served source fits the viewport without
    // letterboxing or excessive crop:
    //   portrait: viewport aspect ≤ 3:4  → 9:16 vertical master
    //   wide:     viewport aspect ≥ 7:5  → 4:3 master cropped to 16:9
    //   standard: everything in between  → 4:3 master served as-is
    // 7:5 (1.40) sits just below 16:9 (1.78) and 16:10 (1.60), so every
    // mainstream desktop + widescreen laptop lands in the wide band while
    // iPad landscape (4:3 = 1.33) stays in standard.
    const portraitQuery = window.matchMedia("(max-aspect-ratio: 3/4)");
    const wideQuery = window.matchMedia("(min-aspect-ratio: 7/5)");

    function syncBand() {
      if (portraitQuery.matches) {
        setBand("portrait");
      } else if (wideQuery.matches) {
        setBand("wide");
      } else {
        setBand("standard");
      }
    }

    syncBand();

    const modern = typeof portraitQuery.addEventListener === "function";
    if (modern) {
      portraitQuery.addEventListener("change", syncBand);
      wideQuery.addEventListener("change", syncBand);
      return () => {
        portraitQuery.removeEventListener("change", syncBand);
        wideQuery.removeEventListener("change", syncBand);
      };
    }

    // Safari <14 fallback.
    portraitQuery.addListener(syncBand);
    wideQuery.addListener(syncBand);
    return () => {
      portraitQuery.removeListener(syncBand);
      wideQuery.removeListener(syncBand);
    };
  }, []);

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

  // Horizontal swipe nav on portrait viewports (phones / split-screen
  // landscape where the visible arrow hotspots shrink to ~30% of a
  // narrow width and are awkward to hit). The desktop tap zones are
  // retained; swipe is additive, not a replacement. Threshold tuned so
  // vertical scroll flicks do not trigger a slide change: horizontal
  // delta must exceed 40px AND exceed the vertical delta.
  const SWIPE_THRESHOLD_PX = 40;
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  function handleTouchStart(event: React.TouchEvent<HTMLElement>) {
    if (band !== "portrait") return;
    const touch = event.touches[0];
    if (!touch) return;
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
  }

  function handleTouchEnd(event: React.TouchEvent<HTMLElement>) {
    const startX = touchStartXRef.current;
    const startY = touchStartYRef.current;
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    if (band !== "portrait") return;
    if (startX === null || startY === null) return;
    const touch = event.changedTouches[0];
    if (!touch) return;
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    if (Math.abs(dx) < SWIPE_THRESHOLD_PX) return;
    if (Math.abs(dy) > Math.abs(dx)) return;
    if (dx < 0) goToNext();
    else goToPrevious();
  }

  function handleScrollHintClick() {
    if (typeof window === "undefined") return;
    const target = window.innerHeight;
    window.scrollTo({ top: target, behavior: "smooth" });
  }

  const activeSlide = visibleSlides[safeIndex];
  const activeSource = activeSlide ? pickSource(activeSlide, band) : "";
  const layout = activeSlide ? pickLayout(activeSlide, band) : "hero-landscape";

  return (
    <section
      className="hero-shell"
      aria-labelledby="hero-title"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <h1 id="hero-title" className="sr-only">
        MIST Architects
      </h1>
      <AnimatePresence>
        {activeSlide ? (
          <motion.div
            // Include band in the key so switching aspect swaps the
            // image immediately rather than waiting for the next autoplay tick.
            key={`${activeSlide.id}-${band}`}
            className="hero-media-frame"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <OssPicture
              path={activeSource}
              layout={layout}
              alt=""
              className="hero-media"
              // Every hero slide is full-screen and the active slide
              // *is* the LCP candidate at the moment it mounts, so all
              // slides must eager-load. Lazy-loading combined with the
              // motion crossfade (initial opacity 0) defers the request
              // until the element is "visible enough", which left the
              // hero blank for a beat after each autoplay tick.
              priority
            />
          </motion.div>
        ) : null}
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
        <button
          aria-label={locale === "zh" ? "向下滚动查看更多" : "Scroll down for more"}
          className="hero-scroll-hint"
          onClick={handleScrollHintClick}
          type="button"
        >
          <span className="hero-scroll-hint-chevron" aria-hidden="true" />
        </button>
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
          {visibleSlides.map((slide, index) => (
            <button
              aria-label={
                locale === "zh"
                  ? `查看第 ${index + 1} 张图片`
                  : `Show image ${index + 1}`
              }
              aria-current={index === safeIndex ? "true" : undefined}
              className="hero-dot"
              key={slide.id}
              onClick={() => goToImage(index)}
              type="button"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
