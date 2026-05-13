"use client";

import { ChevronUp } from "lucide-react";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type ScrollToTopButtonProps = {
  locale: "zh" | "en";
};

export function ScrollToTopButton({ locale }: ScrollToTopButtonProps) {
  const label = locale === "zh" ? "回到页面顶部" : "Back to top";

  const handleClick = () => {
    const homePath = `/${locale}`;
    if (window.location.pathname === homePath && window.location.hash) {
      window.history.replaceState(null, "", homePath);
    }
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  };

  return (
    <button className="scroll-top-button" type="button" aria-label={label} onClick={handleClick}>
      <ChevronUp aria-hidden="true" size={16} strokeWidth={1.6} />
    </button>
  );
}
