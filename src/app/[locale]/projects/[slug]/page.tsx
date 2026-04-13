import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import { SectionRibbon } from "@/components/section-ribbon";
import { getProjectBySlug, getProjectSlugs } from "@/lib/content";
import { isLocale, locales, type Locale } from "@/lib/i18n";

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

  return (
    <main className="project-detail">
      <section className="project-hero">
        <Image
          src={project.heroImage}
          alt={project.imageAlt[locale]}
          width={2400}
          height={1400}
          priority
          sizes="100vw"
        />
        <div className="project-title-block">
          <p className="kicker">
            {project.code} / {project.year} / {project.status[locale]}
          </p>
          <h1>{project.title[locale]}</h1>
          <p>{project.dek[locale]}</p>
        </div>
      </section>

      <SectionRibbon>{locale === "zh" ? "项目资料" : "Project Data"}</SectionRibbon>
      <section className="project-data-grid">
        <div>
          <span>{locale === "zh" ? "地点" : "Location"}</span>
          <strong>{project.location[locale]}</strong>
        </div>
        <div>
          <span>{locale === "zh" ? "类型" : "Typology"}</span>
          <strong>{project.typology[locale]}</strong>
        </div>
        <div>
          <span>{locale === "zh" ? "状态" : "Status"}</span>
          <strong>{project.status[locale]}</strong>
        </div>
        <div>
          <span>{locale === "zh" ? "影像" : "Image"}</span>
          <strong>{project.credit}</strong>
        </div>
      </section>

      <article className="project-narrative">
        {project.body[locale].map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </article>

      {project.videoUrl ? (
        <>
          <SectionRibbon>{locale === "zh" ? "项目影像" : "Project Film"}</SectionRibbon>
          <section className="project-film">
            <video controls playsInline poster={project.heroImage} preload="metadata">
              <source src={project.videoUrl} type={getVideoType(project.videoUrl)} />
            </video>
          </section>
        </>
      ) : null}

      {project.gallery.length > 0 ? (
        <>
          <SectionRibbon>{locale === "zh" ? "项目图集" : "Project Gallery"}</SectionRibbon>
          <section className="project-gallery">
            {project.gallery.map((image, index) => (
              <figure key={`${image.src}-${index}`}>
                <Image
                  src={image.src}
                  alt={image.alt[locale]}
                  width={1800}
                  height={1200}
                  sizes="(min-width: 980px) 50vw, 100vw"
                />
                {image.credit ? (
                  <figcaption>
                    {locale === "zh" ? "影像" : "Image"} / {image.credit}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </section>
        </>
      ) : null}
    </main>
  );
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
