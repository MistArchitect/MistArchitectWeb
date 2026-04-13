import Image from "next/image";
import Link from "next/link";

import type { Project } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { withLocale } from "@/lib/i18n";

type ProjectCardProps = {
  locale: Locale;
  project: Project;
  priority?: boolean;
};

export function ProjectCard({ locale, project, priority = false }: ProjectCardProps) {
  return (
    <article className="story-tile project-tile">
      <Link href={withLocale(locale, `/projects/${project.slug}`)} aria-label={project.title[locale]}>
        <Image
          src={project.image}
          alt={project.imageAlt[locale]}
          width={1200}
          height={900}
          priority={priority}
          sizes="(min-width: 1100px) 33vw, (min-width: 720px) 50vw, 100vw"
        />
      </Link>
      <div className="story-copy">
        <p className="kicker">
          {project.code} / {project.year} / {project.location[locale]}
        </p>
        <h2>
          <Link href={withLocale(locale, `/projects/${project.slug}`)}>
            {project.title[locale]}
          </Link>
        </h2>
        <p>{project.dek[locale]}</p>
      </div>
    </article>
  );
}
