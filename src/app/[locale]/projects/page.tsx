import { notFound } from "next/navigation";

import { ProjectFilter } from "@/components/project-filter";
import { SectionRibbon } from "@/components/section-ribbon";
import { getProjects } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n";

export const revalidate = 60;

type ProjectsPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

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
            ? "第一版使用本地内容数据，后续可替换为 CMS 发布数据。"
            : "The first version uses local seed content and is ready to be replaced by CMS-published records."}
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
