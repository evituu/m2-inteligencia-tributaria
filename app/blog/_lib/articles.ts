import { PostStatus } from "@prisma/client";
import { prisma } from "@/lib/server/db";
import type { Article, BlogCategory, BlogCategoryFilterId } from "./types";
import { BLOG_CATEGORY_FILTERS } from "./categories";

const DEFAULT_READING_TIME_MINUTES = 6;
const DEFAULT_COVER_IMAGE = "/imagens/office/foto_material_m2.jpg";

const VALID_CATEGORIES: BlogCategory[] = [
  "Recuperação de Crédito",
  "Compliance",
  "Holding",
  "Reforma Tributária",
];

function resolveCategory(value?: string | null): BlogCategory {
  if (!value) {
    return "Compliance";
  }

  return VALID_CATEGORIES.includes(value as BlogCategory)
    ? (value as BlogCategory)
    : "Compliance";
}

function mapPostToArticle(post: {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  coverImageUrl: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  category: { name: string } | null;
}): Article {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    category: resolveCategory(post.category?.name),
    publishedAt: (post.publishedAt ?? post.createdAt).toISOString(),
    readingTimeMinutes: DEFAULT_READING_TIME_MINUTES,
    coverImage: post.coverImageUrl ?? DEFAULT_COVER_IMAGE,
  };
}

export async function getPublishedArticles(): Promise<Article[]> {
  const posts = await prisma.post.findMany({
    where: {
      status: PostStatus.published,
      publishedAt: { not: null },
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverImageUrl: true,
      publishedAt: true,
      createdAt: true,
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  return posts.map(mapPostToArticle);
}

export async function getFeaturedArticle(): Promise<Article | null> {
  const articles = await getPublishedArticles();
  return articles[0] ?? null;
}

export async function getLatestArticles(limit = 3): Promise<Article[]> {
  const articles = await getPublishedArticles();
  return articles.slice(0, limit);
}

export async function getArticlesExcludingFeatured(): Promise<Article[]> {
  const articles = await getPublishedArticles();
  return articles.slice(1);
}

export async function getArticleBySlug(slug: string): Promise<Article | undefined> {
  const post = await prisma.post.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverImageUrl: true,
      publishedAt: true,
      createdAt: true,
      status: true,
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!post || post.status !== PostStatus.published) {
    return undefined;
  }

  return mapPostToArticle(post);
}

export function filterArticles(
  articles: Article[],
  query: string,
  categoryId: BlogCategoryFilterId
): Article[] {
  const normalizedQuery = query.trim().toLowerCase();
  const categoryFilter = BLOG_CATEGORY_FILTERS.find(
    (item) => item.id === categoryId
  );

  return articles.filter((article) => {
    const matchesCategory =
      categoryId === "all" || article.category === categoryFilter?.value;

    const matchesQuery =
      normalizedQuery.length === 0 ||
      article.title.toLowerCase().includes(normalizedQuery) ||
      article.excerpt.toLowerCase().includes(normalizedQuery) ||
      article.category.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });
}

export function formatArticleDate(isoDate: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(isoDate));
}
