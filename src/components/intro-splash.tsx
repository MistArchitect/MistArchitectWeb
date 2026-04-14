"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const SPLASH_STORAGE_KEY = "mist-intro-splash-seen";

type IntroSplashProps = {
  logoSrc?: string;
};

function shouldPlaySplash() {
  if (typeof window === "undefined") {
    return true;
  }

  try {
    return sessionStorage.getItem(SPLASH_STORAGE_KEY) !== "true";
  } catch {
    return true;
  }
}

export function IntroSplash({ logoSrc = "/images/brand/mist-logo.svg" }: IntroSplashProps) {
  const [shouldShow, setShouldShow] = useState(shouldPlaySplash);
  const [isVisible, setIsVisible] = useState(shouldPlaySplash);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!shouldShow) {
      return undefined;
    }

    try {
      sessionStorage.setItem(SPLASH_STORAGE_KEY, "true");
    } catch {
      // Storage can be unavailable in private browsing; the animation still plays safely.
    }

    const timer = window.setTimeout(
      () => setIsVisible(false),
      reduceMotion ? 450 : 1650
    );

    return () => window.clearTimeout(timer);
  }, [reduceMotion, shouldShow]);

  return (
    <AnimatePresence onExitComplete={() => setShouldShow(false)}>
      {shouldShow && isVisible ? (
        <motion.div
          aria-hidden="true"
          className="intro-splash"
          initial={reduceMotion ? false : { opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.95, ease: [0.65, 0, 0.35, 1] }}
        >
          <motion.img
            src={logoSrc}
            alt=""
            className="intro-splash-logo"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{
              duration: reduceMotion ? 0.2 : 0.9,
              ease: [0.22, 1, 0.36, 1]
            }}
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
