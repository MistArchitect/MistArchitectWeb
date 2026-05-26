import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectFilter } from "@/components/project-filter";
import { SectionRibbon } from "@/components/section-ribbon";
import { getProjects } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata } from "@/lib/seo";

export const revalidate = 60;

type ProjectsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    return {};
  }

  const locale = rawLocale as Locale;

  return buildPageMetadata({
    title: locale === "zh" ? "项目索引" : "Project Index",
    description:
      locale === "zh"
        ? "浏览岚·建筑设计的建筑、室内、文化公共空间、商业零售与城市更新项目档案。"
        : "Browse MIST Architects' archive of architecture, interiors, cultural public spaces, retail environments, and adaptive reuse projects.",
    locale,
    path: "/projects",
    keywords:
      locale === "zh"
        ? ["建筑项目", "项目索引", "建筑作品集"]
        : ["architecture projects", "project index", "architecture portfolio"]
  });
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const projects = await getProjects();

  return (
    <main className="page-shell">
      <SectionRibbon>{locale === "zh" ? "项目索引" : "Project Index"}</SectionRibbon>
      <header className="archive-heading">
        <p className="kicker">MIST ARCHIVE / 2024-2026</p>
        <h1>{locale === "zh" ? "一个可筛选的建筑档案。" : "A filterable architectural archive."}</h1>
        <p>
          {locale === "zh"
            ? "按项目类型与地域浏览岚·建筑设计的公共、文化、更新与空间实践。"
            : "Browse MIST Architects' public, cultural, renewal, and spatial practice by project type and location."}
        </p>
      </header>
      <ProjectFilter
        locale={locale}
        projects={projects}
        labels={{
          all: locale === "zh" ? "全部" : "All",
          filter: locale === "zh" ? "项目类型筛选" : "Project typology filters"
        }}
      />
    </main>
  );
}
