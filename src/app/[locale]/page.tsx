import { Hero } from "@/components/hero";
import { JournalList } from "@/components/journal-list";
import { MotionReveal } from "@/components/motion-reveal";
import { ProjectCard } from "@/components/project-card";
import { SectionRibbon } from "@/components/section-ribbon";
import { getHomeContent, getJournalEntries, getProjects } from "@/lib/content";
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
  const [projects, journalEntries] = await Promise.all([
    getProjects(),
    getJournalEntries()
  ]);

  return (
    <main>
      <Hero locale={locale} />

      <SectionRibbon>{home.indexLabel[locale]}</SectionRibbon>
      <MotionReveal className="section-shell">
        <div className="project-grid featured-grid">
          {projects.map((project, index) => (
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

      <SectionRibbon id="practice">{home.practice.label[locale]}</SectionRibbon>
      <MotionReveal className="practice-panel">
        <p className="kicker">METHOD / MATERIAL / MEMORY</p>
        <h2>{home.practice.title[locale]}</h2>
        <p>{home.practice.copy[locale]}</p>
      </MotionReveal>

      <SectionRibbon>{home.journalLabel[locale]}</SectionRibbon>
      <MotionReveal className="section-shell">
        <JournalList entries={journalEntries} locale={locale} />
      </MotionReveal>

      <section className="two-column-band" id="films">
        <MotionReveal>
          <p className="kicker">{home.films.label[locale]}</p>
          <h2>{home.films.title[locale]}</h2>
        </MotionReveal>
        <MotionReveal delay={0.08}>
          <p>{home.films.copy[locale]}</p>
        </MotionReveal>
      </section>

      <section className="contact-band" id="contact">
        <p className="kicker">{home.contact.label[locale]}</p>
        <h2>{home.contact.title[locale]}</h2>
        <a href={`mailto:${home.contact.email}`}>{home.contact.email}</a>
      </section>
    </main>
  );
}
