import type { Article, BlogCategoryFilterId } from "./types";
import { BLOG_CATEGORY_FILTERS } from "./categories";

/** Substituir por fetch CMS/API quando o conteúdo for dinâmico. */
const ARTICLES: Article[] = [
  {
    id: "1",
    slug: "reforma-tributaria-impactos-2026",
    title: "Reforma Tributária: impactos práticos para empresas em 2026",
    excerpt:
      "Entenda como a transição do modelo atual afeta créditos, compliance e planejamento tributário de médio prazo.",
    category: "Reforma Tributária",
    publishedAt: "2026-05-10",
    readingTimeMinutes: 8,
    coverImage: "/imagens/office/foto_material_m2.jpg",
  },
  {
    id: "2",
    slug: "compliance-fiscal-auditavel",
    title: "Compliance fiscal auditável: o que exigir do seu processo de revisão",
    excerpt:
      "Critérios técnicos e documentais para garantir segurança jurídica em recuperações e compensações.",
    category: "Compliance",
    publishedAt: "2026-04-28",
    readingTimeMinutes: 6,
    coverImage: "/imagens/office/veimar_aula_m2.jpg",
  },
  {
    id: "3",
    slug: "recuperacao-creditos-pis-cofins",
    title: "Recuperação de créditos de PIS/COFINS: quando vale a pena revisar",
    excerpt:
      "Sinais de oportunidade, documentos necessários e como estruturar a análise sem risco operacional.",
    category: "Recuperação de Crédito",
    publishedAt: "2026-04-15",
    readingTimeMinutes: 7,
    coverImage: "/imagens/office/foto_veimar_m2.jpg",
  },
  {
    id: "4",
    slug: "holding-familiar-planejamento",
    title: "Holding familiar: planejamento tributário com governança e previsibilidade",
    excerpt:
      "Estruturação patrimonial com foco em eficiência fiscal, sucessão e conformidade regulatória.",
    category: "Holding",
    publishedAt: "2026-03-22",
    readingTimeMinutes: 9,
    coverImage: "/imagens/office/foto_material_m2.jpg",
  },
  {
    id: "5",
    slug: "inss-patronal-verbas-indenizatorias",
    title: "INSS patronal e verbas indenizatórias: oportunidades nos últimos 5 anos",
    excerpt:
      "Como identificar valores indevidamente incluídos na base de contribuição previdenciária patronal.",
    category: "Recuperação de Crédito",
    publishedAt: "2026-03-08",
    readingTimeMinutes: 5,
    coverImage: "/imagens/office/veimar_aula_m2.jpg",
  },
  {
    id: "6",
    slug: "checklist-compliance-revisao-fiscal",
    title: "Checklist de compliance para revisão fiscal corporativa",
    excerpt:
      "Passo a passo para validar integridade documental, memória de cálculo e rastreabilidade do crédito.",
    category: "Compliance",
    publishedAt: "2026-02-18",
    readingTimeMinutes: 6,
    coverImage: "/imagens/office/foto_veimar_m2.jpg",
  },
  {
    id: "7",
    slug: "cbs-ibs-transicao-empresas",
    title: "CBS e IBS na transição: o que empresas do Lucro Real precisam monitorar",
    excerpt:
      "Panorama das mudanças e ajustes de governança tributária para o novo ambiente de conformidade.",
    category: "Reforma Tributária",
    publishedAt: "2026-01-30",
    readingTimeMinutes: 10,
    coverImage: "/imagens/office/foto_material_m2.jpg",
  },
  {
    id: "8",
    slug: "holding-operacional-riscos",
    title: "Holding operacional: riscos comuns e como mitigá-los na estrutura societária",
    excerpt:
      "Boas práticas para evitar questionamentos e manter a eficiência do planejamento patrimonial.",
    category: "Holding",
    publishedAt: "2026-01-12",
    readingTimeMinutes: 7,
    coverImage: "/imagens/office/veimar_aula_m2.jpg",
  },
  {
    id: "9",
    slug: "restituicao-compensacao-receita",
    title: "Restituição ou compensação: qual caminho escolher na homologação",
    excerpt:
      "Comparativo técnico entre modalidades e impacto no fluxo de caixa e na gestão de passivos fiscais.",
    category: "Recuperação de Crédito",
    publishedAt: "2025-12-20",
    readingTimeMinutes: 6,
    coverImage: "/imagens/office/foto_veimar_m2.jpg",
  },
];

function sortByPublishedAtDesc(articles: Article[]): Article[] {
  return [...articles].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getPublishedArticles(): Article[] {
  return sortByPublishedAtDesc(ARTICLES);
}

export function getFeaturedArticle(): Article {
  return getPublishedArticles()[0];
}

export function getLatestArticles(limit = 3): Article[] {
  return getPublishedArticles().slice(0, limit);
}

export function getArticlesExcludingFeatured(): Article[] {
  return getPublishedArticles().slice(1);
}

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
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
