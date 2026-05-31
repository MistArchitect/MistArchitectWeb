import {
  home,
  journalEntries as localJournalEntries,
  projects as localProjects,
  type JournalEntry,
  type Project
} from "@/content/site";

export function getHomeContent() {
  return home;
}

export async function getProjects(): Promise<Project[]> {
  return localProjects;
}

export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  return getLocalProject(slug);
}

export async function getProjectSlugs(): Promise<string[]> {
  return localProjects.map((project) => project.slug);
}

export async function getJournalEntries(): Promise<JournalEntry[]> {
  return localJournalEntries;
}

function getLocalProject(slug: string) {
  return localProjects.find((project) => project.slug === slug);
}
