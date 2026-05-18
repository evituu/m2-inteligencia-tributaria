"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { BLOG_CATEGORY_FILTERS } from "@/app/blog/_lib/categories";
import { filterArticles } from "@/app/blog/_lib/articles";
import type { Article, BlogCategoryFilterId } from "@/app/blog/_lib/types";
import { BlogArticleCard } from "./BlogArticleCard";
import { SlideIn } from "@/components/animations/SlideIn";

interface BlogArticlesSectionProps {
  articles: Article[];
}

export function BlogArticlesSection({ articles }: BlogArticlesSectionProps) {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] =
    useState<BlogCategoryFilterId>("all");

  const filteredArticles = useMemo(
    () => filterArticles(articles, query, categoryId),
    [articles, query, categoryId]
  );

  return (
    <section className="bg-white py-16 text-white md:py-20">
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-black uppercase tracking-tight text-black md:text-4xl">
            Últimos <span className="text-gold-gradient">insights</span>
          </h2>
          <p className="mt-3 text-sm leading-7 text-zinc-400 md:text-base">
            Conteúdos técnicos sobre recuperação de crédito, compliance e
            planejamento tributário para sua empresa.
          </p>
        </div>

        <div className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Pesquisar artigos..."
              className="h-12 rounded-none border-zinc-700 bg-[#0a0f16] pr-4 pl-11 text-sm text-white placeholder:text-zinc-500 focus-visible:border-[#f2c40f] focus-visible:ring-[#f2c40f]/25"
              aria-label="Pesquisar artigos"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {BLOG_CATEGORY_FILTERS.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => setCategoryId(filter.id)}
                className={cn(
                  "border px-4 py-2 text-xs font-bold uppercase tracking-wide transition-colors",
                  categoryId === filter.id
                    ? "border-[#f2c40f] bg-gold-gradient text-[#0a0f16]"
                    : "border-zinc-700 bg-transparent text-zinc-300 hover:border-[#f2c40f]/60 hover:text-[#f2c40f]"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {filteredArticles.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article, index) => (
              <SlideIn
                key={article.id}
                from="bottom"
                delay={index * 120}
                duration={800}
                distance={60}
                className="h-full"
              >
                <BlogArticleCard article={article} />
              </SlideIn>
            ))}
          </div>
        ) : (
          <p className="border border-dashed border-zinc-700 bg-[#0a0f16] px-6 py-12 text-center text-sm text-zinc-400">
            Nenhum artigo encontrado para os filtros selecionados.
          </p>
        )}
      </div>
    </section>
  );
}
