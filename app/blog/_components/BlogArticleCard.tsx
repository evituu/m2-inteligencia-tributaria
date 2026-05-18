import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import type { Article } from "@/app/blog/_lib/types";
import { formatArticleDate } from "@/app/blog/_lib/articles";

interface BlogArticleCardProps {
  article: Article;
}

export function BlogArticleCard({ article }: BlogArticleCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden border border-white/10 bg-[#11161f] transition-all duration-300 hover:-translate-y-1 hover:border-[#f2c40f]/50">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={article.coverImage}
          alt=""
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <span className="absolute left-4 top-4 bg-[#0a0f16]/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#f2c40f] backdrop-blur-sm">
          {article.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-black uppercase leading-tight tracking-tight text-white">
          {article.title}
        </h3>
        <p className="mt-3 flex-1 text-sm leading-7 text-zinc-400">
          {article.excerpt}
        </p>
        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-zinc-500">
          <time dateTime={article.publishedAt}>
            {formatArticleDate(article.publishedAt)}
          </time>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" />
            {article.readingTimeMinutes} min
          </span>
        </div>
        <Link
          href={`/blog/${article.slug}`}
          className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gold-gradient transition-colors hover:text-[#ffd82f]"
        >
          Ler mais
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
