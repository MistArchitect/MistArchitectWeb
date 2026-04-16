import { Hero } from "@/components/hero";
import { MotionReveal } from "@/components/motion-reveal";
import { ProjectCard } from "@/components/project-card";
import { SectionRibbon } from "@/components/section-ribbon";
import { getHomeContent, getProjects } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";

export const revalidate = 60;

type HomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

function splitFeaturedCaption(caption: string) {
  const [location, ...titleParts] = caption.split(" · ");

  return {
    location,
    title: titleParts.join(" · ") || caption
  };
}

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
      <Hero locale={locale} />

      <SectionRibbon>{home.indexLabel[locale]}</SectionRibbon>
      <MotionReveal className="section-shell">
        <div className="project-grid featured-grid recommended-grid">
          {recommendedProjects.map((project, index) => {
            const caption = home.hero.captions[index]?.[locale] || project.title[locale];
            const { location, title } = splitFeaturedCaption(caption);
            const eyebrow = location ? `${project.year} · ${location}` : project.year;

            return (
              <ProjectCard
                key={project.slug}
                locale={locale}
                project={project}
                priority={index === 0}
                displayEyebrow={eyebrow}
                displayTitle={title}
                hideMeta
                isDisabled
              />
            );
          })}
        </div>
      </MotionReveal>
    </main>
  );
}
