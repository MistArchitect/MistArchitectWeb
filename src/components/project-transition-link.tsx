"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

    const source = document.querySelector<HTMLElement>(
      `[data-project-transition-source="${transitionId}"]`
    );
    if (!source) return;

    const snapshot = source.querySelector<HTMLElement>("img");
    if (!snapshot) return;

    const rect = snapshot.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    event.preventDefault();

    const layer = document.createElement("div");
    layer.className = "project-route-transition";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);

    const clone = snapshot.cloneNode(true) as HTMLElement;
    if (clone instanceof HTMLImageElement) {
      clone.alt = "";
      clone.decoding = "async";
      clone.style.objectPosition = getComputedStyle(snapshot).objectPosition;
    }

    clone.classList.add("project-route-transition-content");
    layer.appendChild(clone);

    gsap.set(layer, {
      opacity: 1
    });

    gsap.set(clone, {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height
    });

    const timeline = gsap.timeline({
      onComplete: () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
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

    timeline.to(clone, {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      duration: 0.62,
      ease: "power3.inOut"
    }, 0);

    timeline.to(clone, {
      scale: 1,
      duration: 0.62,
      ease: "power2.inOut"
    }, 0);
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
