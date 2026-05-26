import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/app/blog/_lib/types";
import { BlogArticleCard } from "@/app/blog/_components/BlogArticleCard";

interface ArticleRelatedPostsProps {
  articles: Article[];
}

export function ArticleRelatedPosts({ articles }: ArticleRelatedPostsProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-zinc-200 bg-[#f3f3f4] py-16 md:py-20">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="mb-3 block h-1 w-12 bg-[#f2c40f]" />
            <h2 className="text-2xl font-black uppercase tracking-tight text-[#1a1c1c] md:text-3xl">
              Continue{" "}
              <span className="text-gold-gradient">lendo</span>
            </h2>
            <p className="mt-2 text-sm leading-7 text-zinc-600 md:text-base">
              Outras matérias publicadas no blog da M2.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-[#735c00] transition-colors hover:text-[#12151b]"
          >
            Ver todas
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <BlogArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}
