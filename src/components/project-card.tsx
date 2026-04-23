import Image from "next/image";

import type { Project } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { withLocale } from "@/lib/i18n";
import { ProjectTransitionLink } from "@/components/project-transition-link";

type ProjectCardProps = {
  locale: Locale;
  project: Project;
  priority?: boolean;
  displayEyebrow?: string;
  displayTitle?: string;
  hideMeta?: boolean;
  isDisabled?: boolean;
};

export function ProjectCard({
  locale,
  project,
  priority = false,
  displayEyebrow,
  displayTitle,
  hideMeta = false,
  isDisabled = false
}: ProjectCardProps) {
  const title = displayTitle || project.title[locale];
  const href = withLocale(locale, `/projects/${project.slug}`);
  const image = (
    <Image
      src={project.image}
      alt={project.imageAlt[locale]}
      width={1200}
      height={900}
      priority={priority}
      sizes="(min-width: 1100px) 33vw, (min-width: 720px) 50vw, 100vw"
    />
  );

  return (
    <article className="story-tile project-tile">
      {isDisabled ? (
        <div className="project-card-media" aria-label={title}>
          {image}
        </div>
      ) : (
        <ProjectTransitionLink
          ariaLabel={title}
          className="project-card-media-link"
          href={href}
          transitionId={project.slug}
        >
          <span className="project-card-media" data-project-transition-source={project.slug}>
            {image}
          </span>
        </ProjectTransitionLink>
      )}
      <div className="story-copy">
        {hideMeta && displayEyebrow ? (
          <p className="featured-project-eyebrow">{displayEyebrow}</p>
        ) : null}
        {hideMeta ? null : (
          <p className="kicker">
            {project.code} / {project.year} / {project.location[locale]}
          </p>
        )}
        <h2 className={hideMeta ? "featured-project-title" : undefined}>
          {isDisabled ? title : (
            <ProjectTransitionLink href={href} transitionId={project.slug}>
              {title}
            </ProjectTransitionLink>
          )}
        </h2>
        {hideMeta ? null : <p>{project.dek[locale]}</p>}
      </div>
    </article>
  );
}
