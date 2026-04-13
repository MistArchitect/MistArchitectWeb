import { Hero } from "@/components/hero";
import { MotionReveal } from "@/components/motion-reveal";
import { ProjectCard } from "@/components/project-card";
import { SectionRibbon } from "@/components/section-ribbon";
import { getHomeContent, getProjects } from "@/lib/content";
import { isLocale, type Locale, withLocale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import Link from "next/link";

export const revalidate = 60;

type HomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function HomePage({ params }: HomePageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const home = getHomeContent();
  const projects = await getProjects();
  const recommendedProjects = projects.slice(0, 5);

  return (
    <main>
      <Hero />

      <SectionRibbon>{home.indexLabel[locale]}</SectionRibbon>
      <MotionReveal className="section-shell">
        <div className="project-grid featured-grid recommended-grid">
          {recommendedProjects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              locale={locale}
              project={project}
              priority={index === 0}
            />
          ))}
        </div>
        <div className="section-footer-link">
          <Link className="button" href={withLocale(locale, "/projects")}>
            {locale === "zh" ? "进入完整索引" : "Open Full Index"}
          </Link>
        </div>
      </MotionReveal>
    </main>
  );
}
