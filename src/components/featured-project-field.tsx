"use client";

import { useMemo } from "react";

import { TiltedCard } from "@/components/react-bits/tilted-card";
import { ProjectTransitionLink } from "@/components/project-transition-link";
import { featuredTiles } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { withLocale } from "@/lib/i18n";
import { mediaUrl } from "@/lib/media";

type FeaturedProjectFieldProps = {
  locale: Locale;
};

export function FeaturedProjectField({ locale }: FeaturedProjectFieldProps) {
  const tiles = useMemo(
    () =>
      featuredTiles.map((tile) => ({
        ...tile,
        imageSrc: mediaUrl(tile.image, { width: 1920, quality: "std" }),
        href: tile.slug ? withLocale(locale, `/projects/${tile.slug}`) : undefined
      })),
    [locale]
  );
  const pages = useMemo(() => [
    tiles.slice(0, 4),
    tiles.slice(4, 8)
  ], [tiles]);

  return (
    <div className="featured-grid recommended-grid featured-project-field">
      {pages.map((page, pageIndex) => (
        <div className="featured-project-page" data-featured-page={pageIndex} key={pageIndex}>
          {page.map((tile) => {
            const eyebrow = `${tile.year} · ${tile.location[locale]}`;
            const title = tile.title[locale];
            const alt = locale === "zh"
              ? `${tile.location.zh} · ${tile.title.zh}`
              : `${tile.location.en} · ${tile.title.en}`;
            const transitionId = `featured-grid-${tile.id}`;

            const card = (
              <span className="featured-tilted-card-source" data-project-transition-source={transitionId}>
                <TiltedCard
                  altText={alt}
                  captionText={title}
                  containerHeight="300px"
                  containerWidth="300px"
                  displayOverlayContent={false}
                  imageHeight="300px"
                  imageSrc={tile.imageSrc}
                  imageWidth="300px"
                  overlayContent={null}
                  rotateAmplitude={10}
                  scaleOnHover={1.2}
                  showMobileWarning={false}
                  showTooltip={false}
                />
              </span>
            );

            return (
              <article
                key={tile.id}
                className="story-tile project-tile featured-project-reactive-tile featured-tilted-tile"
              >
                {tile.href ? (
                  <ProjectTransitionLink
                    ariaLabel={title}
                    className="project-card-media-link featured-tilted-card-link"
                    href={tile.href}
                    transitionId={transitionId}
                  >
                    {card}
                  </ProjectTransitionLink>
                ) : (
                  <div className="project-card-media featured-tilted-card-link" aria-label={title}>
                    {card}
                  </div>
                )}

                <div className="story-copy">
                  <p className="featured-project-eyebrow">{eyebrow}</p>
                  <h2 className="featured-project-title">
                    {tile.href ? (
                      <ProjectTransitionLink href={tile.href} transitionId={transitionId}>
                        {title}
                      </ProjectTransitionLink>
                    ) : title}
                  </h2>
                </div>
              </article>
            );
          })}
        </div>
      ))}
    </div>
  );
}
