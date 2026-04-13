import Image from "next/image";
import Link from "next/link";

import type { JournalEntry } from "@/content/site";
import type { Locale } from "@/lib/i18n";
import { withLocale } from "@/lib/i18n";

type JournalListProps = {
  entries: JournalEntry[];
  locale: Locale;
};

export function JournalList({ entries, locale }: JournalListProps) {
  return (
    <div className="journal-list">
      {entries.map((entry) => (
        <article className="story-tile journal-tile" key={entry.slug}>
          <Link href={withLocale(locale, `/journal#${entry.slug}`)} aria-label={entry.title[locale]}>
            <Image
              src={entry.image}
              alt={entry.imageAlt[locale]}
              width={1000}
              height={700}
              sizes="(min-width: 960px) 50vw, 100vw"
            />
          </Link>
          <div className="story-copy">
            <p className="kicker">
              {entry.category[locale]} / {entry.date}
            </p>
            <h2>
              <Link href={withLocale(locale, `/journal#${entry.slug}`)}>
                {entry.title[locale]}
              </Link>
            </h2>
            <p>{entry.dek[locale]}</p>
          </div>
        </article>
      ))}
    </div>
  );
}
