import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { NavigationMenu } from "@/components/layout/navigation-menu";
import { Footer } from "@/components/layout/Footer";
import {
  formatArticleDate,
  getArticleBySlug,
} from "@/app/blog/_lib/articles";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Artigo nao encontrado | M2" };
  }

  return {
    title: `${article.title} | M2 Inteligencia Tributaria`,
    description: article.excerpt,
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
      <section className="relative overflow-hidden bg-[#04070d] pb-16 text-white md:pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(242,196,15,0.10),_transparent_40%)]" />
        <NavigationMenu />
        <div className="relative mx-auto w-full max-w-[860px] px-5 pt-32 md:px-8 md:pt-40">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition-colors hover:text-[#f2c40f]"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para insights
          </Link>
          <span className="inline-flex bg-[#f2c40f]/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[#f2c40f]">
            {article.category}
          </span>
          <h1 className="mt-5 text-3xl font-black uppercase leading-tight tracking-tight md:text-5xl">
            {article.title}
          </h1>
          <p className="mt-4 text-sm text-zinc-400">
            {formatArticleDate(article.publishedAt)} · {article.readingTimeMinutes} min de leitura
          </p>
          <p className="mt-8 text-base leading-8 text-zinc-300">{article.excerpt}</p>
          <p className="mt-6 text-sm text-zinc-500">
            Conteudo completo em breve. Esta pagina esta preparada para receber
            o corpo do artigo via CMS ou API.
          </p>
        </div>
      </section>
      <Footer />
    </>
  );
}
