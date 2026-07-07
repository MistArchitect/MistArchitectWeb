import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JournalList } from "@/components/journal-list";
import { SectionRibbon } from "@/components/section-ribbon";
import { getJournalEntries } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n";
import { buildPageMetadata, journalIndexJsonLd, jsonLd } from "@/lib/seo";

export const revalidate = 60;

type JournalPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({ params }: JournalPageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    return {};
  }

  const locale = rawLocale as Locale;

  return buildPageMetadata({
    title: locale === "zh" ? "日志" : "Journal",
    description:
      locale === "zh"
        ? "阅读岚·建筑设计关于事务所新闻、设计过程、材料研究和媒体记录的长期更新。"
        : "Read MIST Architects' ongoing notes on studio news, design process, material research, and media records.",
    locale,
    path: "/journal",
    keywords:
      locale === "zh"
        ? ["建筑日志", "设计过程", "材料研究"]
        : ["architecture journal", "design process", "material research"]
  });
}

export default async function JournalPage({ params }: JournalPageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const journalEntries = await getJournalEntries();

  return (
    <main className="page-shell">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(journalIndexJsonLd(locale, journalEntries)) }}
      />
      <SectionRibbon>{locale === "zh" ? "日志" : "Journal"}</SectionRibbon>
      <header className="archive-heading">
        <p className="kicker">NEWS / PROCESS / RESEARCH</p>
        <h1>{locale === "zh" ? "事务所实践记录。" : "A record of practice."}</h1>
        <p>
          {locale === "zh"
            ? "这里收录事务所新闻、设计过程、材料研究和媒体记录。"
            : "This journal gathers studio news, process notes, material research, and media records."}
        </p>
      </header>
      <JournalList entries={journalEntries} locale={locale} />
    </main>
  );
}
