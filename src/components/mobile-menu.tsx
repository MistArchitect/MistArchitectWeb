"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";

import { navigation } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { withLocale } from "@/lib/i18n";

type MobileMenuProps = {
  locale: Locale;
};

export function MobileMenu({ locale }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const links = navigation[locale];
  const openLabel = locale === "zh" ? "打开菜单" : "Open menu";
  const closeLabel = locale === "zh" ? "关闭菜单" : "Close menu";
  const closeText = locale === "zh" ? "关闭" : "Close";
  const menuText = locale === "zh" ? "菜单" : "Menu";

  if (links.length <= 1) {
    return (
      <nav
        aria-label={locale === "zh" ? "主导航" : "Primary navigation"}
        className="inline-nav-links inline-nav-links-static"
      >
        {links.map((item) => (
          <Link
            key={item.href}
            className="inline-nav-item"
            href={withLocale(locale, item.href)}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <div className="inline-menu-container">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="menu-btn"
            aria-expanded={isOpen}
            aria-label={openLabel}
            className="menu-toggle"
            onClick={() => setIsOpen(true)}
            type="button"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            {menuText}
          </motion.button>
        ) : (
          <motion.nav
            key="menu-nav"
            aria-label={locale === "zh" ? "主导航" : "Primary navigation"}
            className="inline-nav-links"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
          >
            {links.map((item) => (
              <Link
                key={item.href}
                className="inline-nav-item"
                href={withLocale(locale, item.href)}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <button
              aria-expanded={isOpen}
              aria-label={closeLabel}
              className="menu-toggle"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              {closeText}
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
