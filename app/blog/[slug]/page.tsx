import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { NavigationMenu } from "@/components/layout/navigation-menu";
import { Footer } from "@/components/layout/Footer";
import {
  formatArticleDate,
  getArticleBySlug,
  getOtherArticles,
} from "@/app/blog/_lib/articles";
import { ArticleShareButtons } from "@/app/blog/_components/ArticleShareButtons";
import { ArticleBody } from "@/app/blog/_components/ArticleBody";
import { ArticleRelatedPosts } from "@/app/blog/_components/ArticleRelatedPosts";
import { LatestInsightsTicker } from "@/components/home/LatestInsightsTicker";
import { JsonLd } from "@/components/shared/JsonLd";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://m2inteligenciatributaria.com.br";

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
    title: article.title,
    description: article.excerpt || undefined,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt || undefined,
      url: `${BASE_URL}/blog/${article.slug}`,
      siteName: "M2 Inteligência Tributária",
      locale: "pt_BR",
      publishedTime: article.publishedAt,
      authors: [article.author.name],
      images: [
        {
          url: article.coverImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt || undefined,
      images: [article.coverImage],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const otherArticles = await getOtherArticles(slug, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.excerpt,
          image: article.coverImage,
          url: `${BASE_URL}/blog/${article.slug}`,
          datePublished: article.publishedAt,
          dateModified: article.publishedAt,
          author: {
            "@type": "Person",
            name: article.author.name,
          },
          publisher: {
            "@type": "Organization",
            name: "M2 Inteligência Tributária",
            logo: {
              "@type": "ImageObject",
              url: `${BASE_URL}/imagens/logo/LOGO_M2.png`,
            },
          },
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `${BASE_URL}/blog/${article.slug}`,
          },
        }}
      />
      <div className="min-h-screen bg-white text-[#1a1a1a]">
        <NavigationMenu />

        <main className="mx-auto w-full max-w-[800px] px-5 pb-24 pt-32 md:px-8 md:pt-36">
          
          {/* Metadados */}
          <div className="mb-6 flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#735c00]">
            <span>{article.category}</span>
            <span className="h-1 w-1 rounded-full bg-[#f2c40f]" />
            <span>{article.readingTimeMinutes} min de leitura</span>
            <span className="h-1 w-1 rounded-full bg-[#f2c40f]" />
            <span>{formatArticleDate(article.publishedAt)}</span>
          </div>

          {/* Título */}
          <h1 className="mb-6 break-words text-3xl font-black leading-tight tracking-tight text-[#1a1c1c] md:text-5xl">
            {article.title}
          </h1>

          {/* Subtítulo */}
          {article.excerpt ? (
            <p className="mb-10 break-words text-lg leading-relaxed text-zinc-600 md:text-xl md:leading-9">
              {article.excerpt}
            </p>
          ) : null}

          {/* Autor */}
          <div className="mb-12 flex items-center gap-4 border-y border-zinc-200 py-6">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border border-zinc-200 bg-white">
              <Image
                src={article.author.avatarUrl}
                alt={article.author.name}
                width={48}
                height={48}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-bold tracking-wide text-[#1a1c1c]">
                {article.author.name}
              </p>
              <p className="text-sm text-zinc-500">{article.author.role}</p>
            </div>
          </div>

          {/* Imagem de capa */}
          {article.coverImage ? (
            <figure className="mb-12">
              <div className="overflow-hidden border border-zinc-100 bg-white shadow-sm">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  width={800}
                  height={450}
                  className="aspect-[16/9] w-full object-cover"
                  priority
                />
              </div>
            </figure>
          ) : null}

          {/* Corpo do artigo */}
          <ArticleBody content={article.content} />

          {/* Rodapé: tag + compartilhar */}
          <div className="mt-16 flex flex-col gap-6 border-t border-zinc-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <span className="inline-flex border border-zinc-200 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-500 transition-colors hover:border-[#f2c40f] hover:text-[#12151b]">
              {article.category}
            </span>
            <ArticleShareButtons title={article.title} slug={slug} />
          </div>
        </main>

        <ArticleRelatedPosts articles={otherArticles} />
      </div>

      <Footer />
    </>
  );
}
