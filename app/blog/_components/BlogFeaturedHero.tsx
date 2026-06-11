import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NavigationMenu } from "@/components/layout/navigation-menu";
import type { Article } from "@/app/blog/_lib/types";
import { formatArticleDate } from "@/app/blog/_lib/articles";

interface BlogFeaturedHeroProps {
  article: Article;
}

export function BlogFeaturedHero({ article }: BlogFeaturedHeroProps) {
  return (
    <section className="relative isolate min-h-[620px] overflow-hidden bg-[#04070d] text-white md:min-h-[700px]">
      <Image
        src={article.coverImage}
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/80 to-black/55" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(242,196,15,0.12),_transparent_45%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#f2c40f]/60 to-transparent" />

      <NavigationMenu />

      <div className="relative z-10 mx-auto flex w-full max-w-[1280px] flex-col justify-end px-5 pt-32 pb-14 md:px-8 md:pt-40 md:pb-20">
        <span className="mb-6 inline-flex w-fit items-center bg-[#f2c40f]/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[#f2c40f]">
          {article.category}
        </span>
        <h1 className="max-w-[900px] break-words text-3xl font-black uppercase leading-[1.06] tracking-tight md:text-5xl lg:text-6xl">
          {article.title}
        </h1>
        <p className="mt-6 max-w-[720px] break-words text-base leading-relaxed text-zinc-300 md:text-lg">
          {article.excerpt}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-zinc-400">
          <time dateTime={article.publishedAt}>
            {formatArticleDate(article.publishedAt)}
          </time>
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-zinc-500" />
          <span>{article.readingTimeMinutes} min de leitura</span>
        </div>
        <Link
          href={`/blog/${article.slug}`}
          className="mt-10 inline-flex h-14 w-fit items-center justify-center gap-2 bg-gold-gradient px-8 text-sm font-black uppercase tracking-wide text-[#0a0f16] transition-all hover:brightness-105 md:text-base"
        >
          Ler artigo completo
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </section>
  );
}
