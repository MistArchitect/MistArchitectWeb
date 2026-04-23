import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";

import { GsapPageMotion } from "@/components/gsap-page-motion";
import { getProjectBySlug, getProjectSlugs } from "@/lib/content";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import type { Project, ProjectFact, ProjectSection } from "@/content/site";

export const revalidate = 60;

type ProjectPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();

  return locales.flatMap((locale) =>
    slugs.map((slug) => ({
      locale,
      slug
    }))
  );
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;

  if (!isLocale(rawLocale)) {
    return {};
  }

  const project = await getProjectBySlug(slug);

  if (!project) {
    return {};
  }

  const locale = rawLocale as Locale;

  return {
    title: project.title[locale],
    description: project.dek[locale],
    openGraph: {
      title: project.title[locale],
      description: project.dek[locale],
      images: [project.heroImage]
    }
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { locale: rawLocale, slug } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const facts = getProjectFacts(project);
  const sections = getProjectSections(project);
  const heroSlides = getProjectHeroSlides(project);

  return (
    <main className="project-detail">
      <GsapPageMotion page="project" />
      <section className="project-immersive" aria-labelledby="project-title">
        <div className="project-immersive-sticky" aria-hidden="true">
          <div
            className="project-immersive-carousel"
            style={{ "--project-slide-count": heroSlides.length } as CSSProperties}
          >
            {heroSlides.map((slide, index) => (
              <Image
                alt=""
                className="project-immersive-slide"
                fill
                key={`${slide.src}-${index}`}
                priority={index === 0}
                sizes="100vw"
                src={slide.src}
                style={{ "--project-slide-index": index } as CSSProperties}
              />
            ))}
          </div>
          <div className="project-immersive-shade" />
        </div>

        <div className="project-immersive-panel project-immersive-lockup">
          <p className="kicker">
            {project.code} / {project.year} / {project.status[locale]}
          </p>
          <h1 id="project-title">{project.title[locale]}</h1>
          <div className="project-title-rule" />
          <p>{project.location[locale]}</p>
          <a
            aria-label={locale === "zh" ? "继续阅读项目简介" : "Continue to project introduction"}
            className="project-scroll-cue"
            href="#project-intro-text"
          />
        </div>

        <div className="project-immersive-panel project-immersive-copy" id="project-intro-text">
          <p>{project.body[locale][0] ?? project.dek[locale]}</p>
          <a
            aria-label={locale === "zh" ? "进入项目详情" : "Enter project details"}
            className="project-scroll-cue"
            href="#project-white-detail"
          />
        </div>
      </section>

      <div className="project-white-detail" id="project-white-detail">
        <nav className="project-local-nav" aria-label={locale === "zh" ? "项目章节" : "Project sections"}>
          {sections.map((section) => (
            <a href={`#${section.id}`} key={section.id}>
              {section.navLabel[locale]}
            </a>
          ))}
        </nav>

        <section className="project-data-grid" aria-label={locale === "zh" ? "项目资料" : "Project data"}>
          {facts.map((fact) => (
            <div key={`${fact.label.en}-${fact.value.en}`}>
              <span>{fact.label[locale]}</span>
              <strong>{fact.value[locale]}</strong>
            </div>
          ))}
        </section>

        <div className="project-story">
          {sections.map((section, index) => (
            <section className="project-story-block" id={section.id} key={section.id}>
              <div className="project-story-media" data-count={section.media.length}>
                {section.media.map((media) => (
                  <figure key={media.src}>
                    <Image
                      src={media.src}
                      alt={media.alt[locale]}
                      width={1800}
                      height={1200}
                      sizes="(min-width: 980px) 58vw, 100vw"
                    />
                    {media.credit ? (
                      <figcaption>
                        {locale === "zh" ? "影像" : "Image"} / {media.credit}
                      </figcaption>
                    ) : null}
                  </figure>
                ))}
              </div>
              <div className="project-story-copy">
                <p className="kicker">
                  {String(index + 1).padStart(2, "0")} / {section.navLabel[locale]}
                </p>
                <h2>{section.heading[locale]}</h2>
                {section.body[locale].map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.facts && section.facts.length > 0 ? (
                  <dl className="project-section-facts">
                    {section.facts.map((fact) => (
                      <div key={`${fact.label.en}-${fact.value.en}`}>
                        <dt>{fact.label[locale]}</dt>
                        <dd>{fact.value[locale]}</dd>
                      </div>
                    ))}
                  </dl>
                ) : null}
              </div>
            </section>
          ))}
        </div>

        {project.videoUrl ? (
          <section className="project-film" aria-label={locale === "zh" ? "项目影像" : "Project film"}>
            <div className="project-media-heading">
              <p className="kicker">{locale === "zh" ? "项目影像" : "Project Film"}</p>
              <h2>{locale === "zh" ? "现场与过程" : "Site and Process"}</h2>
            </div>
            <div>
              <video controls playsInline poster={project.heroImage} preload="metadata">
                <source src={project.videoUrl} type={getVideoType(project.videoUrl)} />
              </video>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

function getProjectHeroSlides(project: Project) {
  const slides = [
    {
      src: project.heroImage,
      alt: project.imageAlt,
      credit: project.credit
    },
    ...project.gallery
  ];

  return slides.slice(0, 4);
}

function getProjectFacts(project: Project): ProjectFact[] {
  return [
    {
      label: {
        zh: "地点",
        en: "Location"
      },
      value: project.location
    },
    {
      label: {
        zh: "年份",
        en: "Year"
      },
      value: {
        zh: project.year,
        en: project.year
      }
    },
    {
      label: {
        zh: "类型",
        en: "Typology"
      },
      value: project.typology
    },
    {
      label: {
        zh: "状态",
        en: "Status"
      },
      value: project.status
    },
    ...(project.facts ?? []),
    {
      label: {
        zh: "影像",
        en: "Image"
      },
      value: {
        zh: project.credit,
        en: project.credit
      }
    }
  ];
}

function getProjectSections(project: Project): ProjectSection[] {
  if (project.sections && project.sections.length > 0) {
    return project.sections;
  }

  const gallery = project.gallery.length > 0 ? project.gallery : [
    {
      src: project.heroImage,
      alt: project.imageAlt,
      credit: project.credit
    }
  ];

  return [
    {
      id: "overview",
      navLabel: {
        zh: "概览",
        en: "Overview"
      },
      heading: project.title,
      body: {
        zh: project.body.zh.slice(0, 1),
        en: project.body.en.slice(0, 1)
      },
      media: [
        {
          src: project.heroImage,
          alt: project.imageAlt,
          credit: project.credit
        }
      ]
    },
    {
      id: "site",
      navLabel: {
        zh: "场地",
        en: "Site"
      },
      heading: {
        zh: `${project.location.zh}的空间回应`,
        en: `A spatial response in ${project.location.en}`
      },
      body: {
        zh: project.body.zh.slice(1, 2),
        en: project.body.en.slice(1, 2)
      },
      media: gallery.slice(0, 1)
    },
    {
      id: "material",
      navLabel: {
        zh: "材料",
        en: "Material"
      },
      heading: {
        zh: "材料与光线的秩序",
        en: "Material and light order"
      },
      body: {
        zh: project.body.zh.slice(2),
        en: project.body.en.slice(2)
      },
      media: gallery.slice(1, 2)
    }
  ];
}

function getVideoType(url: string) {
  const cleanUrl = url.split("?")[0].toLowerCase();

  if (cleanUrl.endsWith(".webm")) {
    return "video/webm";
  }

  if (cleanUrl.endsWith(".mov")) {
    return "video/quicktime";
  }

  return "video/mp4";
}
