export type BlogCategory =
  | "Recuperação de Crédito"
  | "Compliance"
  | "Holding"
  | "Reforma Tributária";

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  publishedAt: string;
  readingTimeMinutes: number;
  coverImage: string;
}

export interface ArticleAuthor {
  name: string;
  role: string;
  avatarUrl: string;
}

export interface ArticleDetail extends Article {
  content: string;
  author: ArticleAuthor;
}

export type BlogCategoryFilterId =
  | "all"
  | "recuperacao"
  | "compliance"
  | "holding"
  | "reforma";

export interface BlogCategoryFilter {
  id: BlogCategoryFilterId;
  label: string;
  value?: BlogCategory;
}
