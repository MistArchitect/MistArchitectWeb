"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useRef, type PointerEvent as ReactPointerEvent } from "react";

import { MotionReveal } from "@/components/motion-reveal";
import { featuredTiles } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { mediaUrl } from "@/lib/media";

type FeaturedProjectFieldProps = {
  locale: Locale;
};

const PARALLAX_DEPTH = 14;
const TEXT_PARALLAX_DEPTH = 6;
const HOVER_SCALE = 1.04;

type ProjectTileProps = {
  alt: string;
  eyebrow: string;
  imageSrc: string;
  index: number;
  title: string;
};

function ProjectTile({ alt, eyebrow, imageSrc, index, title }: ProjectTileProps) {
  const tileRef = useRef<HTMLElement | null>(null);

  const handlePointerMove = (event: ReactPointerEvent<HTMLElement>) => {
    const node = tileRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const dx = (event.clientX - rect.left) / rect.width - 0.5;
    const dy = (event.clientY - rect.top) / rect.height - 0.5;
    node.style.setProperty("--tile-px", `${dx * PARALLAX_DEPTH}px`);
    node.style.setProperty("--tile-py", `${dy * PARALLAX_DEPTH}px`);
    node.style.setProperty("--tile-tx", `${dx * TEXT_PARALLAX_DEPTH}px`);
    node.style.setProperty("--tile-ty", `${dy * TEXT_PARALLAX_DEPTH}px`);
    node.style.setProperty("--tile-scale", `${HOVER_SCALE}`);
  };

  const handlePointerLeave = () => {
    const node = tileRef.current;
    if (!node) return;
    node.style.setProperty("--tile-px", "0px");
    node.style.setProperty("--tile-py", "0px");
    node.style.setProperty("--tile-tx", "0px");
    node.style.setProperty("--tile-ty", "0px");
    node.style.setProperty("--tile-scale", "1");
  };

  return (
    <MotionReveal className="project-index-reveal" delay={Math.min(index * 0.06, 0.36)}>
      <article
        className="project-index-tile"
        onPointerLeave={handlePointerLeave}
        onPointerMove={handlePointerMove}
        ref={tileRef}
      >
        <div aria-label={title} className="project-index-media-link">
          <div className="project-index-media">
            <img alt={alt} className="project-index-image" loading="lazy" src={imageSrc} />
          </div>
        </div>
        <div className="project-index-copy">
          <p className="project-index-eyebrow">{eyebrow}</p>
          <h2 className="project-index-title">{title}</h2>
        </div>
      </article>
    </MotionReveal>
  );
}

export function FeaturedProjectField({ locale }: FeaturedProjectFieldProps) {
  const tiles = useMemo(
    () =>
      featuredTiles.map((tile) => ({
        ...tile,
        imageSrc: mediaUrl(tile.image, { width: 1920, quality: "std" })
      })),
    []
  );

  return (
    <div className="project-index-grid">
      {tiles.map((tile, index) => {
        const eyebrow = `${tile.year} · ${tile.location[locale]}`;
        const title = tile.title[locale];
        const alt =
          locale === "zh"
            ? `${tile.location.zh} · ${tile.title.zh}`
            : `${tile.location.en} · ${tile.title.en}`;

        return (
          <ProjectTile
            alt={alt}
            eyebrow={eyebrow}
            imageSrc={tile.imageSrc}
            index={index}
            key={tile.id}
            title={title}
          />
        );
      })}
    </div>
  );
}
