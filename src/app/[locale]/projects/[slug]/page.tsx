/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GsapPageMotion } from "@/components/gsap-page-motion";
import { ProjectImmersiveBackground } from "@/components/project-immersive-background";
import { getProjectBySlug, getProjectSlugs } from "@/lib/content";
import { isLocale, locales, type Locale, withLocale } from "@/lib/i18n";
import {
  breadcrumbJsonLd,
  buildPageMetadata,
  jsonLd,
  projectJsonLd
} from "@/lib/seo";
import type { Project, ProjectFact, ProjectSection } from "@/content/site";

export const revalidate = 60;

type ProjectPageProps = {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
};

const COMPLETE_PROJECT_SLUGS = new Set(["field-academy"]);

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

  return buildPageMetadata({
    title: project.title[locale],
    description: project.dek[locale],
    locale,
    path: `/projects/${project.slug}`,
    image: project.heroImage,
    imageAlt: project.imageAlt[locale],
    keywords: [project.title[locale], project.location[locale], project.typology[locale]],
    type: "article"
  });
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
  const heroSlides = getProjectHeroSlides(project, locale);
  const projectMeta = [project.code, project.year, project.status[locale]].filter(Boolean).join(" / ");
  const projectIndexHref = `${withLocale(locale, "/")}#projects`;
  const breadcrumbData = breadcrumbJsonLd(locale, [
    {
      name: locale === "zh" ? "首页" : "Home",
      path: "/"
    },
    {
      name: locale === "zh" ? "项目索引" : "Project Index",
      path: "/projects"
    },
    {
      name: project.title[locale],
      path: `/projects/${project.slug}`
    }
  ]);

  if (!COMPLETE_PROJECT_SLUGS.has(project.slug)) {
    return (
      <main className="project-detail project-detail-development">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(projectJsonLd(locale, project)) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbData) }}
        />
        <GsapPageMotion page="project" />
        <section className="project-immersive project-immersive-development" aria-labelledby="project-title">
          <ProjectImmersiveBackground heroSlides={heroSlides} />

          <div className="project-immersive-panel project-immersive-lockup">
            {projectMeta ? <p className="kicker">{projectMeta}</p> : null}
            <h1 id="project-title">{project.title[locale]}</h1>
            <div className="project-title-rule" />
            <p>{project.location[locale]}</p>
            <a
              aria-label={locale === "zh" ? "查看项目状态" : "View project status"}
              className="project-scroll-cue"
              href="#project-development-status"
            />
          </div>

          <div
            className="project-immersive-panel project-immersive-copy project-development-status"
            id="project-development-status"
          >
            <p>{locale === "zh" ? "项目详情正在整理中。" : "Project details are in development."}</p>
            <Link className="project-development-back" href={projectIndexHref}>
              <span aria-hidden="true">←</span>
              {locale === "zh" ? "返回项目索引" : "Back to Project Index"}
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const facts = getProjectFacts(project);
  const sections = getProjectSections(project);

  return (
    <main className="project-detail">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(projectJsonLd(locale, project)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbData) }}
      />
      <GsapPageMotion page="project" />
      <section className="project-immersive" aria-labelledby="project-title">
        <ProjectImmersiveBackground heroSlides={heroSlides} />

        <div className="project-immersive-panel project-immersive-lockup">
          {projectMeta ? <p className="kicker">{projectMeta}</p> : null}
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
          <Link
            aria-label={locale === "zh" ? "返回项目索引" : "Back to project index"}
            className="project-local-back"
            href={projectIndexHref}
          >
            <span aria-hidden="true">←</span>
          </Link>
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
          {sections.map((section, index) => {
            const sectionNumber = String(index + 1).padStart(2, "0");
            const isDrawingsSection = section.id === "drawings";

            return (
              <section className="project-story-block" id={section.id} key={section.id}>
                {isDrawingsSection ? (
                  <div className="project-story-heading">
                    <p className="kicker">
                      {sectionNumber} / {section.navLabel[locale]}
                    </p>
                    <h2>{section.heading[locale]}</h2>
                  </div>
                ) : null}
                <div className="project-story-media" data-count={section.media.length}>
                  {section.media.map((media) => (
                    <figure
                      data-media-aspect={media.aspect}
                      data-media-kind={media.kind ?? "photo"}
                      key={media.src}
                    >
                      <img
                        alt={media.alt[locale]}
                        loading="lazy"
                        src={media.src}
                      />
                    </figure>
                  ))}
                </div>
                <div className="project-story-copy">
                  {isDrawingsSection ? null : (
                    <>
                      <p className="kicker">
                        {sectionNumber} / {section.navLabel[locale]}
                      </p>
                      <h2>{section.heading[locale]}</h2>
                    </>
                  )}
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
            );
          })}
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

function getProjectHeroSlides(project: Project, locale: Locale) {
  const slides = [
    {
      src: project.heroImage,
      alt: project.imageAlt[locale],
      credit: project.credit
    },
    ...project.gallery.map((media) => ({
      src: media.src,
      alt: media.alt[locale],
      credit: media.credit
    }))
  ];

  const seenSlideIdentities = new Set<string>();
  const uniqueSlides = slides.filter((slide) => {
    const identity = getSlideVisualIdentity(slide.src);
    if (seenSlideIdentities.has(identity)) {
      return false;
    }

    seenSlideIdentities.add(identity);
    return true;
  });

  return uniqueSlides.slice(0, 4);
}

function getSlideVisualIdentity(src: string) {
  const assetPath = getSlideAssetPath(src);
  const filename = assetPath.split("/").pop() ?? assetPath;
  const extensionless = filename.replace(/\.[^.]+$/, "");
  const decimalVariant = extensionless.match(/^\d+\.(\d+)/)?.[1] ?? "";
  const withoutSequence = extensionless
    .replace(/^\d+(?:\.\d+)?[_\s-]*/, "")
    .replace(/\b(?:4:3|16:9)\b/g, "")
    .replace(/^(?:\d{4})[·\s_-]*/, "");
  const normalizedName = withoutSequence.replace(/[\s·_:：-]+/g, "").toLowerCase();

  return decimalVariant ? `${normalizedName}#${decimalVariant}` : normalizedName;
}

function getSlideAssetPath(src: string) {
  try {
    const url = new URL(src, "https://mist-arch.local");
    return url.searchParams.get("path") ?? decodeURIComponent(url.pathname.replace(/^\/+/, ""));
  } catch {
    return src.split("?")[0];
  }
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
    ...(project.year ? [
      {
        label: {
          zh: "年份",
          en: "Year"
        },
        value: {
          zh: project.year,
          en: project.year
        }
      }
    ] : []),
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
    ...(project.facts ?? [])
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
