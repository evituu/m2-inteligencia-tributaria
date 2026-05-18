import type { BlogCategoryFilter } from "./types";

export const BLOG_CATEGORY_FILTERS: BlogCategoryFilter[] = [
  { id: "all", label: "Todos" },
  {
    id: "recuperacao",
    label: "Recuperação de Crédito",
    value: "Recuperação de Crédito",
  },
  { id: "compliance", label: "Compliance", value: "Compliance" },
  { id: "holding", label: "Holding", value: "Holding" },
  {
    id: "reforma",
    label: "Reforma Tributária",
    value: "Reforma Tributária",
  },
];
