import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AboutHeroCarousel } from "@/components/about-hero-carousel";
import { GsapPageMotion } from "@/components/gsap-page-motion";
import { MotionReveal } from "@/components/motion-reveal";
import { OssPicture } from "@/components/oss-picture";
import { WechatQrDialog } from "@/components/wechat-qr-dialog";
import { about } from "@/content/site";
import { isLocale, type Locale } from "@/lib/i18n";
import { mediaUrl } from "@/lib/media";
import { aboutPageJsonLd, buildPageMetadata, jsonLd, wechatSeoContact } from "@/lib/seo";

export const revalidate = 60;

type AboutPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    return {};
  }

  const locale = rawLocale as Locale;

  return buildPageMetadata({
    title: locale === "zh" ? "关于岚·建筑设计" : "About",
    description:
      locale === "zh"
        ? "了解岚·建筑设计的事务所背景、创始人、获奖出版经历、业务方向、微信公众号 MIST-ARCH、二维码与联系方式。"
        : "Learn about MIST Architects' studio background, founders, awards, publications, services, WeChat public account MIST-ARCH, QR code, and contact details.",
    locale,
    path: "/about",
    image: mediaUrl(about.heroImage, { width: 1920, quality: "std" }),
    imageAlt: about.hero.title[locale],
    keywords:
      locale === "zh"
        ? [
            "建筑事务所简介",
            "建筑师程博",
            "建筑师李博",
            "联系方式",
            "MIST-ARCH",
            "岚建筑设计微信公众号",
            "岚建筑设计二维码",
            "微信公众号",
            "微信二维码"
          ]
        : [
            "architecture studio profile",
            "Cheng Bo architect",
            "Li Bo architect",
            "contact",
            "MIST-ARCH",
            "MIST-ARCH WeChat",
            "MIST Architects WeChat QR code",
            "WeChat QR code"
          ]
  });
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const introHeading = locale === "zh" ? "岚" : "MIST Architects";
  const foundersHeading = locale === "zh" ? "创始人" : "Founders";
  const mediaGroups = [
    {
      label: locale === "zh" ? "行业及获奖经历" : "Awards and Recognition",
      items: about.media.body[locale]
    },
    {
      label: about.publications.label[locale],
      items: about.publications.body[locale]
    }
  ];

  return (
    <main className="about-page about-office-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(aboutPageJsonLd(locale)) }}
      />
      <GsapPageMotion page="about" />
      <section className="about-scroll-overlay" aria-label={locale === "zh" ? "岚" : "About"}>
        <div className="about-hero-sticky">
          <section className="about-hero" aria-labelledby="about-title">
            <h1 id="about-title" className="sr-only">{about.hero.title[locale]}</h1>
            <AboutHeroCarousel
              horizontal={about.aboutHero.horizontal}
              vertical={about.aboutHero.vertical}
              altPrefix={
                locale === "zh"
                  ? "岚·建筑设计办公室照片"
                  : "MIST Architects studio office photograph"
              }
            />
            <a
              aria-label={locale === "zh" ? "向下滚动查看更多" : "Scroll down for more"}
              className="about-scroll-hint"
              href="#intro"
            >
              <span className="hero-scroll-hint-chevron" aria-hidden="true" />
            </a>
          </section>
        </div>
        <div className="about-overlay-spacer" aria-hidden="true" />
        <div className="about-overlay-content">
          <div className="about-office-shell">
            <aside className="about-office-index">
              <nav
                className="about-subnav"
                aria-label={locale === "zh" ? "岚页面导航" : "About page navigation"}
              >
                {about.nav.map((item) => (
                  <a key={item.id} href={`#${item.id}`}>
                    {item.label[locale]}
                  </a>
                ))}
              </nav>
            </aside>

            <div className="about-office-content">
              <MotionReveal className="about-office-section about-intro-section" delay={0.05}>
                <section id="intro">
                  <h2>{introHeading}</h2>
                  <div className="about-long-copy">
                    <p className="about-lead">{about.intro.title[locale]}</p>
                    {about.intro.body[locale].map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              </MotionReveal>

              <section className="about-office-section about-founders" id="founders">
                <MotionReveal className="about-founders-image">
                  <OssPicture
                    path={about.foundersImage}
                    layout="portrait"
                    alt={
                      locale === "zh"
                        ? "创始人合影，左侧为李博，右侧为程博"
                        : "Founders, Li Bo on the left and Cheng Bo on the right"
                    }
                  />
                </MotionReveal>
                <MotionReveal className="about-founders-copy" delay={0.12}>
                  <h2>{foundersHeading}</h2>
                  <div className="founder-list">
                    {about.founders.map((founder, index) => (
                      <article className="founder-entry" key={`${founder.name[locale]}-${index}`}>
                        <p className="founder-position" aria-label={founder.positionLabel[locale]}>
                          {founder.position[locale]}
                        </p>
                        <h3>{founder.name[locale]}</h3>
                        <ul>
                          {founder.credentials[locale].map((credential) => (
                            <li key={credential}>{credential}</li>
                          ))}
                        </ul>
                      </article>
                    ))}
                  </div>
                </MotionReveal>
              </section>

              <MotionReveal className="about-office-section about-archive-section" delay={0.05}>
                <section id="media">
                  <h2>{about.media.label[locale]}</h2>
                  <div className="about-media-groups">
                    {mediaGroups.map((group) => (
                      <article className="about-media-group" key={group.label}>
                        <h3>{group.label}</h3>
                        <div className="about-archive-list">
                          {group.items.map((paragraph, index) => (
                            <p key={`${paragraph}-${index}`}>{paragraph}</p>
                          ))}
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </MotionReveal>

              <MotionReveal className="about-office-section about-services-section" delay={0.05}>
                <section id="services">
                  <h2>{about.services.label[locale]}</h2>
                  <ul className="about-services-list">
                    {about.services.body[locale].map((service) => (
                      <li key={service}>{service}</li>
                    ))}
                  </ul>
                </section>
              </MotionReveal>

              <MotionReveal
                className="about-office-section about-contact-section"
                delay={0.05}
              >
                <section id="contact">
                  <h2>{about.contact.label[locale]}</h2>
                  <div className="about-contact-lines">
                    {about.contact.items.map((item) => (
                      <div className="about-contact-line" key={item.label[locale]}>
                        <span className="about-contact-label">{item.label[locale]}</span>
                        {item.href ? (
                          <a className="about-contact-value" href={item.href}>
                            {item.value[locale]}
                          </a>
                        ) : item.qrImage ? (
                          <WechatQrDialog
                            alt={
                              locale === "zh"
                                ? `${wechatSeoContact.publicAccountName.zh}微信公众号 ${wechatSeoContact.publicAccountId} 二维码`
                                : `MIST Architects WeChat public account ${wechatSeoContact.publicAccountId} QR code`
                            }
                            backdropLabel={locale === "zh" ? "关闭二维码浮层" : "Close QR code overlay"}
                            closeLabel={locale === "zh" ? "关闭" : "Close"}
                            imageSrc={item.qrImage}
                            label={item.value[locale]}
                          />
                        ) : (
                          <span className="about-contact-value">{item.value[locale]}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              </MotionReveal>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
