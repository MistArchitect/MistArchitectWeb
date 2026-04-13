export const locales = ["zh", "en"] as const;
export const defaultLocale = "zh";

export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function otherLocale(locale: Locale): Locale {
  return locale === "zh" ? "en" : "zh";
}

export function localeLabel(locale: Locale): string {
  return locale === "zh" ? "中文" : "EN";
}

export function withLocale(locale: Locale, path = ""): string {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${cleanPath === "/" ? "" : cleanPath}`;
}
