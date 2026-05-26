"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useRef, type PointerEvent as ReactPointerEvent } from "react";

import { MotionReveal } from "@/components/motion-reveal";
import { ProjectTransitionLink } from "@/components/project-transition-link";
import type { Project } from "@/content/site";
import { type Locale, withLocale } from "@/lib/i18n";

type FeaturedProjectFieldProps = {
  locale: Locale;
  projects: Project[];
};

const PARALLAX_DEPTH = 14;
const TEXT_PARALLAX_DEPTH = 6;
const HOVER_SCALE = 1.04;

type ProjectTileProps = {
  alt: string;
  eyebrow: string;
  href: string;
  imageSrc: string;
  index: number;
  title: string;
  transitionId: string;
};

function ProjectTile({
  alt,
  eyebrow,
  href,
  imageSrc,
  index,
  title,
  transitionId
}: ProjectTileProps) {
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
        <ProjectTransitionLink
          ariaLabel={title}
          className="project-index-media-link"
          href={href}
          transitionId={transitionId}
        >
          <div className="project-index-media" data-project-transition-source={transitionId}>
            <img alt={alt} className="project-index-image" loading="lazy" src={imageSrc} />
          </div>
        </ProjectTransitionLink>
        <div className="project-index-copy">
          <p className="project-index-eyebrow">{eyebrow}</p>
          <h2 className="project-index-title">
            <ProjectTransitionLink href={href} transitionId={transitionId}>
              {title}
            </ProjectTransitionLink>
          </h2>
        </div>
      </article>
    </MotionReveal>
  );
}

export function FeaturedProjectField({ locale, projects }: FeaturedProjectFieldProps) {
  const tiles = useMemo(
    () =>
      projects.map((project) => ({
        id: project.slug,
        alt: project.imageAlt[locale],
        eyebrow: [project.year, project.location[locale]].filter(Boolean).join(" · "),
        href: withLocale(locale, `/projects/${project.slug}`),
        imageSrc: project.image,
        title: project.title[locale],
        transitionId: project.slug
      })),
    [locale, projects]
  );

  return (
    <div className="project-index-grid">
      {tiles.map((tile, index) => {
        return (
          <ProjectTile
            alt={tile.alt}
            eyebrow={tile.eyebrow}
            href={tile.href}
            imageSrc={tile.imageSrc}
            index={index}
            key={tile.id}
            title={tile.title}
            transitionId={tile.transitionId}
          />
        );
      })}
    </div>
  );
}
