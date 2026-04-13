import {
  home,
  journalEntries as localJournalEntries,
  projects as localProjects,
  type JournalEntry,
  type Project,
  type ProjectMedia
} from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { locales } from "@/lib/i18n";
import { sanityClient } from "@/sanity/client";
import { isSanityConfigured } from "@/sanity/env";
import {
  journalEntriesQuery,
  projectBySlugQuery,
  projectSlugsQuery,
  projectsQuery
} from "@/sanity/queries";

type LocalizedText = Partial<Record<Locale, string>>;

type SanityProject = Omit<Project, "body" | "image" | "heroImage" | "imageAlt" | "gallery"> & {
  body?: LocalizedText;
  image?: string;
  heroImage?: string;
  imageAlt?: LocalizedText;
  heroAlt?: LocalizedText;
  gallery?: SanityMedia[];
};

type SanityJournalEntry = Omit<JournalEntry, "image" | "imageAlt"> & {
  image?: string;
  imageAlt?: LocalizedText;
};

type SanityMedia = {
  src?: string;
  alt?: LocalizedText;
  credit?: string;
};

type SanitySlug = {
  slug?: string;
};

export function getHomeContent() {
  return home;
}

export async function getProjects(): Promise<Project[]> {
  if (!isSanityConfigured()) {
    return localProjects;
  }

  try {
    const data = await sanityClient.fetch<SanityProject[]>(projectsQuery);
    const normalized = data.map(normalizeProject).filter(isProject);
    return normalized.length > 0 ? normalized : localProjects;
  } catch {
    return localProjects;
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  if (!isSanityConfigured()) {
    return getLocalProject(slug);
  }

  try {
    const data = await sanityClient.fetch<SanityProject | null>(projectBySlugQuery, {
      slug
    });
    return data ? normalizeProject(data) : getLocalProject(slug);
  } catch {
    return getLocalProject(slug);
  }
}

export async function getProjectSlugs(): Promise<string[]> {
  if (!isSanityConfigured()) {
    return localProjects.map((project) => project.slug);
  }

  try {
    const data = await sanityClient.fetch<SanitySlug[]>(projectSlugsQuery);
    const slugs = data.map((item) => item.slug).filter(isPresent);
    return slugs.length > 0 ? slugs : localProjects.map((project) => project.slug);
  } catch {
    return localProjects.map((project) => project.slug);
  }
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
  if (!isSanityConfigured()) {
    return localJournalEntries;
  }

  try {
    const data = await sanityClient.fetch<SanityJournalEntry[]>(journalEntriesQuery);
    const normalized = data.map(normalizeJournalEntry).filter(isJournalEntry);
    return normalized.length > 0 ? normalized : localJournalEntries;
  } catch {
    return localJournalEntries;
  }
}

function normalizeProject(project: SanityProject): Project | undefined {
  if (!project.slug) {
    return undefined;
  }

  const fallback = getLocalProject(project.slug) ?? localProjects[0];

  return {
    ...fallback,
    ...project,
    body: splitLocalizedText(project.body, fallback.body),
    image: project.image || fallback.image,
    heroImage: project.heroImage || project.image || fallback.heroImage,
    imageAlt: normalizeLocalized(project.imageAlt, fallback.imageAlt),
    gallery: normalizeGallery(project.gallery, fallback.gallery),
    title: normalizeLocalized(project.title, fallback.title),
    dek: normalizeLocalized(project.dek, fallback.dek),
    location: normalizeLocalized(project.location, fallback.location),
    status: normalizeLocalized(project.status, fallback.status),
    typology: normalizeLocalized(project.typology, fallback.typology),
    credit: project.credit || fallback.credit,
    videoUrl: project.videoUrl || fallback.videoUrl
  };
}

function normalizeJournalEntry(entry: SanityJournalEntry): JournalEntry | undefined {
  if (!entry.slug) {
    return undefined;
  }

  const fallback =
    localJournalEntries.find((item) => item.slug === entry.slug) ?? localJournalEntries[0];

  return {
    ...fallback,
    ...entry,
    category: normalizeLocalized(entry.category, fallback.category),
    title: normalizeLocalized(entry.title, fallback.title),
    dek: normalizeLocalized(entry.dek, fallback.dek),
    image: entry.image || fallback.image,
    imageAlt: normalizeLocalized(entry.imageAlt, fallback.imageAlt)
  };
}

function normalizeLocalized(value: LocalizedText | undefined, fallback: Record<Locale, string>) {
  return locales.reduce(
    (result, locale) => ({
      ...result,
      [locale]: value?.[locale] || fallback[locale]
    }),
    {} as Record<Locale, string>
  );
}

function splitLocalizedText(
  value: LocalizedText | undefined,
  fallback: Record<Locale, string[]>
) {
  return locales.reduce(
    (result, locale) => ({
      ...result,
      [locale]: splitParagraphs(value?.[locale]) || fallback[locale]
    }),
    {} as Record<Locale, string[]>
  );
}

function splitParagraphs(value: string | undefined) {
  const paragraphs = value
    ?.split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return paragraphs && paragraphs.length > 0 ? paragraphs : undefined;
}

function normalizeGallery(
  gallery: SanityMedia[] | undefined,
  fallback: ProjectMedia[]
): ProjectMedia[] {
  const normalized = (gallery ?? []).reduce<ProjectMedia[]>((result, image) => {
    if (!image.src) {
      return result;
    }

    result.push({
      src: image.src,
      alt: normalizeLocalized(image.alt, {
        zh: "项目图像",
        en: "Project image"
      }),
      credit: image.credit
    });

    return result;
  }, []);

  return normalized && normalized.length > 0 ? normalized : fallback;
}

function getLocalProject(slug: string) {
  return localProjects.find((project) => project.slug === slug);
}

function isPresent(value: string | undefined): value is string {
  return Boolean(value);
}

function isProject(value: Project | undefined): value is Project {
  return Boolean(value);
}

function isJournalEntry(value: JournalEntry | undefined): value is JournalEntry {
  return Boolean(value);
}
