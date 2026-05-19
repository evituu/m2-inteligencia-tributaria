import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import {
  getArticlesExcludingFeatured,
  getFeaturedArticle,
} from "@/app/blog/_lib/articles";
import { BlogFeaturedHero } from "@/app/blog/_components/BlogFeaturedHero";
import { BlogArticlesSection } from "@/app/blog/_components/BlogArticlesSection";
import { BlogEbookBanner } from "@/app/blog/_components/BlogEbookBanner";
import { BlogNewsletterSection } from "@/app/blog/_components/BlogNewsletterSection";

export const metadata: Metadata = {
  title: "Insights e Artigos | M2 Inteligencia Tributaria",
  description:
    "Conteudos tecnicos sobre recuperacao de credito, compliance fiscal, holding e reforma tributaria para empresas e contadores.",
};

export default async function BlogPage() {
  const featuredArticle = await getFeaturedArticle();
  const articles = await getArticlesExcludingFeatured();

  if (!featuredArticle) {
    return (
      <>
        <section className="bg-[#04070d] px-5 py-32 text-center text-zinc-300 md:px-8">
          Nenhum artigo publicado no momento.
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <BlogFeaturedHero article={featuredArticle} />
      <BlogArticlesSection articles={articles} />
      <BlogEbookBanner />
      <BlogNewsletterSection />
      <Footer />
    </>
  );
}
