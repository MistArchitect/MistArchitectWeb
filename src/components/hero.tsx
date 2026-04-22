"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform
} from "motion/react";

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
type SwipeLock = "horizontal" | "vertical" | null;
type HeroSlide = (typeof heroSlides)[number];
type DragInfo = {
  offset: {
    x: number;
  };
  velocity: {
    x: number;
  };
};

const HERO_AUTOPLAY_MS = 4500;
const SWIPE_THRESHOLD_PX = 42;
const SWIPE_LOCK_THRESHOLD_PX = 10;
const SWIPE_HORIZONTAL_BIAS = 0.58;
const SWIPE_VERTICAL_BIAS = 1.35;
const MOBILE_DRAG_COMMIT_RATIO = 0.24;
const MOBILE_DRAG_VELOCITY_PX = 780;
const MOBILE_DRAG_EDGE_RESISTANCE = 0.34;
const MOBILE_DRAG_PROJECTION_SECONDS = 0.12;
const MOBILE_STACK_WIDTH_FALLBACK = 390;
const MOBILE_DRAG_COMPLETE_SPRING = {
  type: "spring" as const,
  stiffness: 150,
  damping: 28,
  mass: 0.95,
  restDelta: 0.6,
  restSpeed: 8
};
const MOBILE_DRAG_REBOUND_SPRING = {
  type: "spring" as const,
  stiffness: 180,
  damping: 30,
  mass: 0.9,
  restDelta: 0.6,
  restSpeed: 8
};

// Server rendering defaults to wide — most first-paint visits come from
// 16:9 desktops. The client-side check switches bands after hydration.
const DEFAULT_BAND: AspectBand = "wide";

function pickSource(slide: HeroSlide, band: AspectBand) {
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
  slides: readonly HeroSlide[],
  band: AspectBand
): HeroSlide[] {
  const seen = new Set<string>();
  const kept: HeroSlide[] = [];
  for (const slide of slides) {
    const source = pickSource(slide, band);
    if (seen.has(source)) continue;
    seen.add(source);
    kept.push(slide);
  }
  return kept;
}

function pickLayout(slide: HeroSlide, band: AspectBand) {
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

const heroImageVariants = {
  enterFade: {
    opacity: 0
  },
  exitFade: {
    opacity: 0
  },
  enterMobile: (direction: number) => ({
    opacity: 0,
    scale: 1.018,
    x: `${direction * 16}%`
  }),
  center: {
    opacity: 1,
    scale: 1,
    x: "0%"
  },
  exitMobile: (direction: number) => ({
    opacity: 0,
    scale: 1.006,
    x: `${direction * -10}%`
  })
};

const heroImageTransition = {
  duration: 0.82,
  ease: [0.22, 1, 0.36, 1] as const
};

function HeroImage({ slide, band }: { slide: HeroSlide; band: AspectBand }) {
  return (
    <OssPicture
      path={pickSource(slide, band)}
      layout={pickLayout(slide, band)}
      alt=""
      className="hero-media"
      // Every hero slide is full-screen and the active slide is the LCP
      // candidate at the moment it mounts. Eager loading prevents blank
      // frames during autoplay, manual navigation, and drag completion.
      priority
    />
  );
}

export function Hero({ locale }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplayResetKey, setAutoplayResetKey] = useState(0);
  const [band, setBand] = useState<AspectBand>(DEFAULT_BAND);
  const [slideDirection, setSlideDirection] = useState(1);
  const [isMobileDragging, setIsMobileDragging] = useState(false);
  const [isMobileSettling, setIsMobileSettling] = useState(false);
  const [mobileViewportWidth, setMobileViewportWidth] = useState(MOBILE_STACK_WIDTH_FALLBACK);
  const mobileDragX = useMotionValue(0);
  const activeImageScale = useTransform(
    mobileDragX,
    [-mobileViewportWidth, 0, mobileViewportWidth],
    [0.995, 1, 0.985]
  );
  const activeImageOpacity = useTransform(
    mobileDragX,
    [-mobileViewportWidth, 0, mobileViewportWidth],
    [1, 1, 0.9]
  );
  const activeImageCounterX = useTransform(
    mobileDragX,
    [-mobileViewportWidth, 0, mobileViewportWidth],
    [mobileViewportWidth, 0, 0]
  );
  const previousImageOpacity = useTransform(
    mobileDragX,
    [0, mobileViewportWidth * 0.28],
    [0.88, 1]
  );
  const previousImageScale = useTransform(
    mobileDragX,
    [0, mobileViewportWidth * 0.62],
    [0.965, 1]
  );
  const previousImageX = useTransform(
    mobileDragX,
    [0, mobileViewportWidth * 0.62],
    [-18, 0]
  );
  const nextImageOpacity = useTransform(
    mobileDragX,
    [-mobileViewportWidth * 0.28, 0],
    [1, 0]
  );
  const nextImageScale = useTransform(
    mobileDragX,
    [-mobileViewportWidth * 0.62, 0],
    [1, 0.965]
  );
  const nextImageX = useTransform(
    mobileDragX,
    [-mobileViewportWidth, 0, mobileViewportWidth],
    [0, mobileViewportWidth, mobileViewportWidth]
  );
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
    if (typeof window === "undefined") return undefined;

    function syncViewportWidth() {
      setMobileViewportWidth(window.innerWidth || MOBILE_STACK_WIDTH_FALLBACK);
    }

    syncViewportWidth();
    window.addEventListener("resize", syncViewportWidth);
    return () => window.removeEventListener("resize", syncViewportWidth);
  }, []);

  useEffect(() => {
    if (reduceMotion || imageCount < 1) {
      return undefined;
    }

    const timer = setInterval(() => {
      if (isMobileDragging || isMobileSettling) return;
      setSlideDirection(1);
      if (band === "portrait" && imageCount > 1) {
        const width = mobileViewportWidth || MOBILE_STACK_WIDTH_FALLBACK;
        setIsMobileSettling(true);
        void animate(mobileDragX, -width, MOBILE_DRAG_COMPLETE_SPRING).then(() => {
          setCurrentIndex((prev) => (prev + 1) % imageCount);
          mobileDragX.set(0);
          setIsMobileSettling(false);
        });
        return;
      }
      setCurrentIndex((prev) => (prev + 1) % imageCount);
    }, HERO_AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [
    autoplayResetKey,
    band,
    imageCount,
    isMobileDragging,
    isMobileSettling,
    mobileDragX,
    mobileViewportWidth,
    reduceMotion
  ]);

  function resetAutoplay() {
    setAutoplayResetKey((key) => key + 1);
  }

  function goToPrevious() {
    setSlideDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + imageCount) % imageCount);
    resetAutoplay();
  }

  function goToNext() {
    setSlideDirection(1);
    setCurrentIndex((prev) => (prev + 1) % imageCount);
    resetAutoplay();
  }

  function goToImage(index: number) {
    setSlideDirection(index >= safeIndex ? 1 : -1);
    setCurrentIndex(index);
    resetAutoplay();
  }

  // Horizontal swipe nav on portrait viewports. The move handler locks
  // each gesture after a small dead zone: slightly diagonal swipes are
  // treated as horizontal carousel gestures and `preventDefault()` keeps
  // the page from drifting vertically. A gesture has to be strongly
  // vertical before the page scroll is allowed through.
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const swipeLockRef = useRef<SwipeLock>(null);

  function handleTouchStart(event: React.TouchEvent<HTMLElement>) {
    if (band !== "portrait") return;
    const touch = event.touches[0];
    if (!touch) return;
    touchStartXRef.current = touch.clientX;
    touchStartYRef.current = touch.clientY;
    swipeLockRef.current = null;
  }

  function handleTouchMove(event: React.TouchEvent<HTMLElement>) {
    const startX = touchStartXRef.current;
    const startY = touchStartYRef.current;
    if (band !== "portrait" || startX === null || startY === null) return;

    const touch = event.touches[0];
    if (!touch) return;

    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (!swipeLockRef.current && Math.max(absX, absY) >= SWIPE_LOCK_THRESHOLD_PX) {
      if (absX >= absY * SWIPE_HORIZONTAL_BIAS) {
        swipeLockRef.current = "horizontal";
      } else if (absY >= absX * SWIPE_VERTICAL_BIAS) {
        swipeLockRef.current = "vertical";
      }
    }

    if (swipeLockRef.current === "horizontal") {
      event.preventDefault();
    }
  }

  function handleTouchEnd() {
    const startX = touchStartXRef.current;
    const startY = touchStartYRef.current;
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    const lock = swipeLockRef.current;
    swipeLockRef.current = null;
    if (band !== "portrait") return;
    if (startX === null || startY === null) return;
    if (lock === "vertical") return;
  }

  function handleMobileDragStart() {
    if (band !== "portrait") return;
    setIsMobileDragging(true);
    swipeLockRef.current = "horizontal";
    resetAutoplay();
  }

  function handleMobileDragEnd(
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: DragInfo
  ) {
    if (band !== "portrait" || imageCount < 2) {
      mobileDragX.set(0);
      setIsMobileDragging(false);
      return;
    }

    const width = typeof window === "undefined" ? 0 : window.innerWidth;
    const commitDistance = Math.max(SWIPE_THRESHOLD_PX, width * MOBILE_DRAG_COMMIT_RATIO);
    const projectedOffset = info.offset.x + info.velocity.x * MOBILE_DRAG_PROJECTION_SECONDS;
    const shouldGoNext =
      projectedOffset <= -commitDistance || info.velocity.x <= -MOBILE_DRAG_VELOCITY_PX;
    const shouldGoPrevious =
      projectedOffset >= commitDistance || info.velocity.x >= MOBILE_DRAG_VELOCITY_PX;

    if (!shouldGoNext && !shouldGoPrevious) {
      void animate(mobileDragX, 0, MOBILE_DRAG_REBOUND_SPRING).then(() => {
        setIsMobileDragging(false);
      });
      return;
    }

    const direction = shouldGoNext ? 1 : -1;
    const targetX = direction === 1 ? -width : width;
    setIsMobileSettling(true);

    void animate(mobileDragX, targetX, MOBILE_DRAG_COMPLETE_SPRING).then(() => {
      setSlideDirection(direction);
      setCurrentIndex((prev) => (prev + direction + imageCount) % imageCount);
      mobileDragX.set(0);
      setIsMobileDragging(false);
      setIsMobileSettling(false);
      resetAutoplay();
    });
  }

  function handleScrollHintClick() {
    if (typeof window === "undefined") return;
    const target = window.innerHeight;
    window.scrollTo({ top: target, behavior: "smooth" });
  }

  const activeSlide = visibleSlides[safeIndex];
  const previousSlide = imageCount > 0
    ? visibleSlides[(safeIndex - 1 + imageCount) % imageCount]
    : undefined;
  const nextSlide = imageCount > 0
    ? visibleSlides[(safeIndex + 1) % imageCount]
    : undefined;
  const useMobileStack = band === "portrait" && activeSlide && previousSlide && nextSlide;

  return (
    <section
      className="hero-shell"
      aria-labelledby="hero-title"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <h1 id="hero-title" className="sr-only">
        MIST Architects
      </h1>
      {useMobileStack ? (
        <div className="hero-mobile-stage">
          <motion.div
            className="hero-media-frame hero-media-frame-mobile hero-media-frame-previous"
            style={{
              opacity: previousImageOpacity,
              scale: previousImageScale,
              x: previousImageX
            }}
          >
            <HeroImage slide={previousSlide} band={band} />
          </motion.div>
          <motion.div
            className="hero-media-frame hero-media-frame-mobile hero-media-frame-next"
            style={{
              opacity: nextImageOpacity,
              scale: nextImageScale,
              x: nextImageX
            }}
          >
            <HeroImage slide={nextSlide} band={band} />
          </motion.div>
          <motion.div
            className="hero-media-frame hero-media-frame-mobile hero-media-frame-current"
            drag={reduceMotion || isMobileSettling ? false : "x"}
            dragConstraints={
              typeof window === "undefined"
                ? { left: 0, right: 0 }
                : { left: -window.innerWidth, right: window.innerWidth }
            }
            dragElastic={MOBILE_DRAG_EDGE_RESISTANCE}
            dragMomentum={false}
            onDragStart={handleMobileDragStart}
            onDragEnd={handleMobileDragEnd}
            style={{
              opacity: activeImageOpacity,
              scale: activeImageScale,
              x: mobileDragX
            }}
          >
            <motion.div
              className="hero-mobile-current-visual"
              style={{ x: activeImageCounterX }}
            >
              <HeroImage slide={activeSlide} band={band} />
            </motion.div>
          </motion.div>
        </div>
      ) : (
        <AnimatePresence custom={slideDirection}>
          {activeSlide ? (
            <motion.div
              // Include band in the key so switching aspect swaps the
              // image immediately rather than waiting for the next autoplay tick.
              key={`${activeSlide.id}-${band}`}
              className="hero-media-frame"
              custom={slideDirection}
              initial={
                reduceMotion
                  ? false
                  : band === "portrait"
                    ? "enterMobile"
                    : "enterFade"
              }
              animate="center"
              exit={
                reduceMotion
                  ? undefined
                  : band === "portrait"
                    ? "exitMobile"
                    : "exitFade"
              }
              transition={heroImageTransition}
              variants={heroImageVariants}
            >
              <HeroImage slide={activeSlide} band={band} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      )}
      {band !== "portrait" ? (
        <>
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
        </>
      ) : null}
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
