import { notFound } from "next/navigation";

import { JournalList } from "@/components/journal-list";
import { SectionRibbon } from "@/components/section-ribbon";
import { getJournalEntries } from "@/lib/content";
import { isLocale, type Locale } from "@/lib/i18n";

export const revalidate = 60;

type JournalPageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export default async function JournalPage({ params }: JournalPageProps) {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    notFound();
  }

  const locale = rawLocale as Locale;
  const journalEntries = await getJournalEntries();

  return (
    <main className="page-shell">
      <SectionRibbon>{locale === "zh" ? "日志" : "Journal"}</SectionRibbon>
      <header className="archive-heading">
        <p className="kicker">NEWS / PROCESS / RESEARCH</p>
        <h1>{locale === "zh" ? "持续更新的实践记录。" : "A living record of practice."}</h1>
        <p>
          {locale === "zh"
            ? "这里为事务所新闻、设计过程、材料研究和媒体内容预留长期结构。"
            : "This area is prepared for studio news, process notes, material research, and media records."}
        </p>
      </header>
      <JournalList entries={journalEntries} locale={locale} />
    </main>
  );
}
