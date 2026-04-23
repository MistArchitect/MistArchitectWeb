"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

import { OssPicture } from "@/components/oss-picture";
import { featuredTiles } from "@/content/site";
import type { Locale } from "@/lib/i18n";

type FeaturedProjectFieldProps = {
  locale: Locale;
};

type TileMotion = {
  copyX: gsap.QuickToFunc;
  copyY: gsap.QuickToFunc;
  imageX: gsap.QuickToFunc;
  imageY: gsap.QuickToFunc;
  imageScale: gsap.QuickToFunc;
  tiltX: gsap.QuickToFunc;
  tiltY: gsap.QuickToFunc;
};

const TILE_SELECTOR = ".featured-project-reactive-tile";

function motionForTile(tile: HTMLElement): TileMotion {
  return {
    copyX: gsap.quickTo(tile, "--copy-x", { duration: 0.5, ease: "power3.out", unit: "px" }),
    copyY: gsap.quickTo(tile, "--copy-y", { duration: 0.5, ease: "power3.out", unit: "px" }),
    imageX: gsap.quickTo(tile, "--image-x", { duration: 0.42, ease: "power3.out", unit: "px" }),
    imageY: gsap.quickTo(tile, "--image-y", { duration: 0.42, ease: "power3.out", unit: "px" }),
    imageScale: gsap.quickTo(tile, "--image-scale", { duration: 0.42, ease: "power3.out" }),
    tiltX: gsap.quickTo(tile, "--tile-tilt-x", { duration: 0.48, ease: "power3.out", unit: "deg" }),
    tiltY: gsap.quickTo(tile, "--tile-tilt-y", { duration: 0.48, ease: "power3.out", unit: "deg" })
  };
}

export function FeaturedProjectField({ locale }: FeaturedProjectFieldProps) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || typeof window === "undefined") return undefined;
    const gridElement = grid;

    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (reduceMotionQuery.matches || !finePointerQuery.matches) return undefined;

    const tileMotions = new WeakMap<HTMLElement, TileMotion>();
    let activeTile: HTMLElement | null = null;

    function getMotion(tile: HTMLElement) {
      let motion = tileMotions.get(tile);
      if (!motion) {
        motion = motionForTile(tile);
        tileMotions.set(tile, motion);
      }
      return motion;
    }

    function resetTile(tile: HTMLElement) {
      const motion = getMotion(tile);
      motion.copyX(0);
      motion.copyY(0);
      motion.imageX(0);
      motion.imageY(0);
      motion.imageScale(1);
      motion.tiltX(0);
      motion.tiltY(0);
    }

    function handlePointerMove(event: PointerEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const tile = target.closest<HTMLElement>(TILE_SELECTOR);
      if (!tile || !gridElement.contains(tile)) {
        if (activeTile) resetTile(activeTile);
        activeTile = null;
        return;
      }

      if (activeTile && activeTile !== tile) {
        resetTile(activeTile);
      }
      activeTile = tile;

      const rect = tile.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      const centeredX = x / 100 - 0.5;
      const centeredY = y / 100 - 0.5;
      const motion = getMotion(tile);

      motion.imageX(centeredX * 8);
      motion.imageY(centeredY * 8);
      motion.imageScale(1.018);
      motion.copyX(centeredX * -4);
      motion.copyY(centeredY * -3);
      motion.tiltX(centeredY * -1.15);
      motion.tiltY(centeredX * 1.25);
    }

    function handlePointerLeave() {
      activeTile = null;
      gridElement.querySelectorAll<HTMLElement>(TILE_SELECTOR).forEach(resetTile);
    }

    gridElement.addEventListener("pointermove", handlePointerMove);
    gridElement.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      gridElement.removeEventListener("pointermove", handlePointerMove);
      gridElement.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  return (
    <div
      ref={gridRef}
      className="project-grid featured-grid recommended-grid featured-project-field"
    >
      {featuredTiles.map((tile, index) => {
        const eyebrow = `${tile.year} · ${tile.location[locale]}`;
        const title = tile.title[locale];
        const alt = locale === "zh"
          ? `${tile.location.zh} · ${tile.title.zh}`
          : `${tile.location.en} · ${tile.title.en}`;

        return (
          <article
            key={tile.id}
            className="story-tile project-tile featured-project-reactive-tile"
          >
            <div className="project-card-media" aria-label={title}>
              <OssPicture
                path={tile.image}
                layout="feature"
                alt={alt}
                priority={index === 0}
              />
            </div>
            <div className="story-copy">
              <p className="featured-project-eyebrow">{eyebrow}</p>
              <h2 className="featured-project-title">{title}</h2>
            </div>
          </article>
        );
      })}
    </div>
  );
}
