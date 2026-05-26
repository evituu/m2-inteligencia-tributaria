import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, CalendarDays } from "lucide-react";
import { NavigationMenu } from "@/components/layout/navigation-menu";
import { Footer } from "@/components/layout/Footer";
import {
  formatArticleDate,
  getArticleBySlug,
} from "@/app/blog/_lib/articles";
import { ArticleShareButtons } from "@/app/blog/_components/ArticleShareButtons";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Artigo não encontrado | M2" };
  }

  return {
    title: `${article.title} | M2 Inteligência Tributária`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.coverImage ? [article.coverImage] : [],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      {/* ── Hero escuro ── */}
      <section className="relative overflow-hidden bg-[#04070d] pb-14 text-white md:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(242,196,15,0.12),_transparent_55%)]" />
        <NavigationMenu />

        <div className="relative mx-auto w-full max-w-[860px] px-5 pt-32 md:px-8 md:pt-40">

          {/* Categoria */}
          <span className="inline-flex bg-[#f2c40f]/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#f2c40f]">
            {article.category}
          </span>

          {/* Título */}
          <h1 className="mt-5 text-3xl font-black uppercase leading-tight tracking-tight md:text-5xl">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-zinc-400">
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4 text-[#f2c40f]" />
              {formatArticleDate(article.publishedAt)}
            </span>
            <span className="h-1 w-1 rounded-full bg-zinc-600" />
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-[#f2c40f]" />
              {article.readingTimeMinutes} min de leitura
            </span>
          </div>

          {/* Subtítulo / excerpt (fica no hero) */}
          <p className="mt-7 text-base leading-8 text-zinc-300 md:text-lg md:leading-9">
            {article.excerpt}
          </p>
        </div>
      </section>

      {/* ── Corpo do artigo — fundo branco ── */}
      <main className="bg-white">
        <div className="mx-auto w-full max-w-[860px] px-5 pb-24 pt-12 md:px-8">

          {/* Imagem de capa */}
          {article.coverImage && (
            <figure className="mb-12">
              <div className="overflow-hidden border border-zinc-100 shadow-sm">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  width={860}
                  height={480}
                  className="aspect-[16/9] w-full object-cover"
                  priority
                />
              </div>
            </figure>
          )}

          {/* Corpo do artigo */}
          <article className="prose prose-zinc max-w-none text-[#1a1a1a]">
            <p className="text-base leading-8 text-zinc-600 md:text-lg md:leading-9">
              Conteúdo completo em breve. Esta página está preparada para
              receber o corpo do artigo via CMS ou API.
            </p>
          </article>

          {/* Divisor */}
          <div className="my-14 h-px bg-zinc-100" />

          {/* Rodapé do artigo: tag + compartilhar */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            {/* Tag da categoria */}
            <span className="inline-flex border border-zinc-200 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:border-[#f2c40f] hover:text-[#12151b]">
              {article.category}
            </span>

            {/* Botões de compartilhamento */}
            <ArticleShareButtons title={article.title} slug={slug} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
