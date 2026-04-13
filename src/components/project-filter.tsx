"use client";

import { useMemo, useState } from "react";

import type { Project } from "@/content/site";
import type { Locale } from "@/lib/i18n";

import { ProjectCard } from "./project-card";

type ProjectFilterProps = {
  locale: Locale;
  projects: Project[];
  labels: {
    all: string;
    filter: string;
  };
};

export function ProjectFilter({ locale, projects, labels }: ProjectFilterProps) {
  const [activeType, setActiveType] = useState("all");
  const typologies = useMemo(
    () => Array.from(new Set(projects.map((project) => project.typology[locale]))),
    [locale, projects]
  );
  const visibleProjects =
    activeType === "all"
      ? projects
      : projects.filter((project) => project.typology[locale] === activeType);

  return (
    <section className="project-browser" aria-label={labels.filter}>
      <div className="filter-row">
        <button
          className={activeType === "all" ? "is-active" : ""}
          type="button"
          onClick={() => setActiveType("all")}
        >
          {labels.all}
        </button>
        {typologies.map((typology) => (
          <button
            className={activeType === typology ? "is-active" : ""}
            key={typology}
            type="button"
            onClick={() => setActiveType(typology)}
          >
            {typology}
          </button>
        ))}
      </div>
      <div className="project-grid">
        {visibleProjects.map((project, index) => (
          <ProjectCard
            key={project.slug}
            locale={locale}
            project={project}
            priority={index === 0}
          />
        ))}
      </div>
    </section>
  );
}
