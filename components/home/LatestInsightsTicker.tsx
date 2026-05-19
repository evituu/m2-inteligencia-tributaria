import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  formatArticleDate,
  getLatestArticles,
} from "@/app/blog/_lib/articles";
import type { Article } from "@/app/blog/_lib/types";

function TickerItem({ article }: { article: Article }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group inline-flex shrink-0 items-center gap-3 px-8 transition-opacity hover:opacity-90"
    >
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#f2c40f] md:text-xs">
        {article.category}
      </span>
      <span aria-hidden="true" className="text-zinc-600">
        ·
      </span>
      <span className="max-w-[min(52vw,520px)] truncate text-xs font-semibold text-zinc-100 md:max-w-[560px] md:text-sm">
        {article.title}
      </span>
      <span aria-hidden="true" className="hidden text-zinc-600 sm:inline">
        ·
      </span>
      <time
        dateTime={article.publishedAt}
        className="hidden shrink-0 text-[10px] font-medium uppercase tracking-wide text-zinc-500 sm:inline"
      >
        {formatArticleDate(article.publishedAt)}
      </time>
      <ArrowRight
        aria-hidden="true"
        className="h-3.5 w-3.5 shrink-0 text-[#f2c40f]/80 transition-transform group-hover:translate-x-0.5"
      />
    </Link>
  );
}

export async function LatestInsightsTicker() {
  const articles = await getLatestArticles(3);

  if (articles.length === 0) {
    return null;
  }

  const marqueeArticles = [...articles, ...articles];

  return (
    <section
      aria-label="Últimas análises do blog M2"
      className="insights-ticker relative z-10 border-y border-[#f2c40f]/20 bg-[#060b12]"
    >
      <div className="flex h-14 items-stretch md:h-16">
        <div className="flex shrink-0 items-center border-r border-[#f2c40f]/20 bg-[#0a0f12] px-4 md:px-6">
          <span className="whitespace-nowrap text-[10px] font-black uppercase tracking-[0.22em] text-[#f2c40f] md:text-xs">
            Últimos artigos
          </span>
        </div>

        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[#060b12] to-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[#060b12] to-transparent"
            aria-hidden="true"
          />

          <div className="hidden h-full items-center overflow-x-auto motion-reduce:flex">
            {articles.map((article) => (
              <TickerItem key={article.id} article={article} />
            ))}
          </div>

          <div className="flex h-full items-center motion-reduce:hidden">
            <div className="insights-ticker-marquee items-center py-1">
              {marqueeArticles.map((article, index) => (
                <TickerItem
                  key={`${article.id}-${index}`}
                  article={article}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
