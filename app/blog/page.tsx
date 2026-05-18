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
  title: "Insights e Artigos | M2 Inteligência Tributária",
  description:
    "Conteúdos técnicos sobre recuperação de crédito, compliance fiscal, holding e reforma tributária para empresas e contadores.",
};

export default function BlogPage() {
  const featuredArticle = getFeaturedArticle();
  const articles = getArticlesExcludingFeatured();

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
