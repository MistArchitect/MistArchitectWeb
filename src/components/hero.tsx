"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { home } from "@/content/site";

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      return undefined;
    }

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % home.hero.images.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [reduceMotion]);

  return (
    <section className="hero-shell" aria-labelledby="hero-title">
      <h1 id="hero-title" className="sr-only">
        Mist Architect
      </h1>
      <AnimatePresence>
        <motion.img
          key={currentIndex}
          src={home.hero.images[currentIndex]}
          alt=""
          aria-hidden="true"
          className="hero-media"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </AnimatePresence>
    </section>
  );
}
