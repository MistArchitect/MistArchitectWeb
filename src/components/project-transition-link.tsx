"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { gsap } from "gsap";

type ProjectTransitionLinkProps = {
  href: string;
  transitionId: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
};

function shouldUseNativeNavigation(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.altKey ||
    event.ctrlKey ||
    event.shiftKey
  );
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function ProjectTransitionLink({
  href,
  transitionId,
  children,
  className,
  ariaLabel
}: ProjectTransitionLinkProps) {
  const router = useRouter();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (shouldUseNativeNavigation(event) || prefersReducedMotion()) return;

    const image = document.querySelector<HTMLImageElement>(
      `[data-project-transition-source="${transitionId}"] img`
    );
    if (!image) return;

    const rect = image.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    event.preventDefault();

    const layer = document.createElement("div");
    layer.className = "project-route-transition";
    layer.setAttribute("aria-hidden", "true");

    const clone = document.createElement("img");
    clone.src = image.currentSrc || image.src;
    clone.alt = "";
    clone.decoding = "async";
    clone.style.objectPosition = getComputedStyle(image).objectPosition;
    layer.appendChild(clone);
    document.body.appendChild(layer);

    gsap.set(layer, {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      opacity: 1
    });

    gsap.to(layer, {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      duration: 0.62,
      ease: "power3.inOut",
      onComplete: () => {
        router.push(href);
        gsap.to(layer, {
          opacity: 0,
          duration: 0.34,
          delay: 0.18,
          ease: "power2.out",
          onComplete: () => layer.remove()
        });
      }
    });
  }

  return (
    <Link
      aria-label={ariaLabel}
      className={className}
      href={href}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
}
