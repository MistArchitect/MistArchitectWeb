"use client";

import { useEffect, useState } from "react";

import { mediaUrl } from "@/lib/media";

type AboutHeroCarouselProps = {
  horizontal: readonly string[];
  vertical: readonly string[];
};

type Orientation = "landscape" | "portrait";

// Server-render defaults to landscape. First paint on desktop matches
// instantly; portrait phones swap to the vertical set after hydration.
const DEFAULT_ORIENTATION: Orientation = "landscape";

export function AboutHeroCarousel({ horizontal, vertical }: AboutHeroCarouselProps) {
  const [orientation, setOrientation] = useState<Orientation>(DEFAULT_ORIENTATION);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }

    // Same threshold as the homepage hero's portrait band so both
    // carousels swap orientation at the same viewport aspect.
    const portraitQuery = window.matchMedia("(max-aspect-ratio: 3/4)");

    function sync() {
      setOrientation(portraitQuery.matches ? "portrait" : "landscape");
    }

    sync();

    if (typeof portraitQuery.addEventListener === "function") {
      portraitQuery.addEventListener("change", sync);
      return () => portraitQuery.removeEventListener("change", sync);
    }
    portraitQuery.addListener(sync);
    return () => portraitQuery.removeListener(sync);
  }, []);

  const slides = orientation === "portrait" ? vertical : horizontal;

  return (
    <div className="about-hero-carousel" aria-hidden="true">
      {slides.map((image, index) => (
        // About hero masters are already small (<400KB). Bypass OSS
        // IMG processing and Next's optimizer — serve the raw origin
        // URL so the `<picture>` srcset machinery doesn't get in the
        // way of the simple CSS crossfade.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          // Include orientation in the key so React unmounts the old
          // orientation's <img> on switch, restarting the CSS crossfade
          // animation cleanly instead of inheriting partial opacity
          // state from the previous band.
          key={`${orientation}-${image}`}
          src={mediaUrl(image)}
          alt=""
          className="about-hero-slide"
          // 5s stagger matches the 20s / 4-slide CSS cycle in
          // globals.css `.about-hero-slide`. Change both together.
          style={{ animationDelay: `${index * 5}s` }}
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
      ))}
    </div>
  );
}
