import { Hero } from "@/components/hero";
import { FeaturedProjectField } from "@/components/featured-project-field";
import { GsapPageMotion } from "@/components/gsap-page-motion";
import { HomeProjectIntro } from "@/components/home-project-intro";
import { heroSlides } from "@/content/site";
import { getProjects } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n";
import { mediaUrl } from "@/lib/media";
import { buildPageMetadata, siteDescription } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 60;

type HomePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    return {};
  }

  const locale = rawLocale as Locale;
  const heroImage = heroSlides[0]?.horizontalWide ?? heroSlides[0]?.horizontal;

  return buildPageMetadata({
    title: locale === "zh" ? "岚·建筑设计 | MIST Architects" : "MIST Architects",
    description: siteDescription[locale],
    locale,
    image: heroImage ? mediaUrl(heroImage, { width: 1920, quality: "high" }) : undefined,
    imageAlt: locale === "zh" ? "岚·建筑设计项目影像" : "MIST Architects project imagery",
    keywords:
      locale === "zh"
        ? ["建筑事务所", "深圳建筑设计", "项目作品集"]
        : ["architecture portfolio", "Shenzhen architects", "project archive"]
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const projects = await getProjects();

  return (
    <main className="home-page">
      <GsapPageMotion page="home" />
      <section className="home-scroll-overlay" aria-label={locale === "zh" ? "首页" : "Home"}>
        <div className="home-hero-sticky">
          <Hero locale={locale} />
        </div>
        <div className="home-overlay-spacer" aria-hidden="true" />
        <div className="home-overlay-content">
          <div className="section-shell home-featured-shell">
            <HomeProjectIntro locale={locale}>
              <FeaturedProjectField locale={locale} projects={projects} />
            </HomeProjectIntro>
          </div>
        </div>
      </section>
    </main>
  );
}
