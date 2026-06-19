# Site Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corrigir link quebrado do footer, implementar SEO robusto em todas as páginas, criar visualizador de leads no admin, e sincronizar leads automaticamente com Google Sheets.

**Architecture:** Sem test runner configurado — cada tarefa usa `npm run build` e `npm run lint` como verificação de tipo/lint, mais verificação manual no browser para UIs. SEO via metadata API nativa do Next.js App Router + JSON-LD inline. Integração Google Sheets via `googleapis` com fire-and-forget pós-criação de lead no banco.

**Tech Stack:** Next.js 16 App Router · TypeScript · Prisma · googleapis · Tailwind CSS · shadcn/ui

## Global Constraints

- Nunca importar `lib/server/*` em client components (`"use client"`)
- Admin pages usam `AdminShell` sem NavigationMenu/Footer externos (seguir padrão de `app/admin/posts/page.tsx`)
- `requireAdminFromRequest` retorna `{ ok: boolean }` — verificar `if (!guard.ok) return guard.response`
- Imports em `app/api/*` usam caminhos relativos (ex: `"../../../lib/server/db"`)
- `ArticleDetail.coverImage` é sempre string não-nula (tem fallback definido em `mapPostToArticle`)
- `ArticleDetail.excerpt` é sempre string (tem fallback `?? ""`)
- `getArticleBySlug` retorna `ArticleDetail | undefined` (não null)
- `NEXT_PUBLIC_BASE_URL` = `https://m2inteligenciatributaria.com.br` em produção
- Google Sheets: graceful skip silencioso se qualquer uma das 3 env vars estiver ausente

---

## File Map

| Arquivo | Ação |
|---------|------|
| `components/layout/Footer.tsx` | Modificar — fix link `/formulario` → `/#formulario` |
| `.env.example` | Modificar — adicionar `NEXT_PUBLIC_BASE_URL` + vars Google |
| `app/layout.tsx` | Modificar — `metadataBase`, `title.template`, OG global |
| `components/shared/JsonLd.tsx` | Criar — componente reutilizável `<script type="application/ld+json">` |
| `app/page.tsx` | Modificar — adicionar JSON-LD `Organization` |
| `app/sobre/page.tsx` | Modificar — `metadata` + JSON-LD `AboutPage` |
| `app/servicos/page.tsx` | Modificar — `metadata` + JSON-LD `ProfessionalService` |
| `app/blog/[slug]/page.tsx` | Modificar — enriquecer `generateMetadata` + JSON-LD `Article` |
| `app/sitemap.ts` | Criar — sitemap dinâmico Next.js |
| `app/robots.ts` | Criar — robots.txt Next.js |
| `app/api/admin/leads/route.ts` | Criar — `GET` paginado protegido por auth |
| `app/admin/leads/page.tsx` | Criar — tabela de leads no admin |
| `app/admin/_components/AdminShell.tsx` | Modificar — adicionar item "Leads" ao nav |
| `lib/server/integrations/google-sheets.ts` | Criar — `appendLeadToSheet()` |
| `app/api/leads/route.ts` | Modificar — fire-and-forget para Sheets após `prisma.lead.create` |

---

## Task 1: Fix footer link + env vars

**Files:**
- Modify: `components/layout/Footer.tsx`
- Modify: `.env.example`

**Interfaces:**
- Produces: link `/formulario` corrigido para `/#formulario`; `.env.example` documentando as 4 novas vars

- [ ] **Step 1: Corrigir o link no Footer**

Em `components/layout/Footer.tsx`, linha 18, alterar:
```ts
// antes
{ label: "Contato", href: "/formulario" },
// depois
{ label: "Contato", href: "/#formulario" },
```

- [ ] **Step 2: Adicionar env vars ao .env.example**

Abrir `.env.example` e adicionar no final:
```env
# URL pública do site (usada em OG tags e sitemap)
NEXT_PUBLIC_BASE_URL=https://m2inteligenciatributaria.com.br

# Google Sheets — sincronização automática de leads
GOOGLE_SHEETS_CLIENT_EMAIL=
GOOGLE_SHEETS_PRIVATE_KEY=
GOOGLE_SHEETS_SPREADSHEET_ID=
```

- [ ] **Step 3: Verificar lint**

```bash
npm run lint
```
Esperado: sem erros.

- [ ] **Step 4: Commit**

```bash
git add components/layout/Footer.tsx .env.example
git commit -m "fix(footer): corrigir link /formulario para /#formulario e documentar env vars"
```

---

## Task 2: SEO foundation — metadataBase + JsonLd component

**Files:**
- Modify: `app/layout.tsx`
- Create: `components/shared/JsonLd.tsx`

**Interfaces:**
- Produces:
  - `metadataBase` configurado no layout raiz para URLs absolutas funcionarem em OG tags
  - `title.template` = `"%s | M2 Inteligência Tributária"` — páginas filhas só precisam definir o título curto
  - `<JsonLd data={obj} />` — componente server-side que renderiza `<script type="application/ld+json">`

- [ ] **Step 1: Criar o componente JsonLd**

Criar `components/shared/JsonLd.tsx`:
```tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

- [ ] **Step 2: Atualizar metadados do layout raiz**

Substituir o bloco `export const metadata` em `app/layout.tsx` pelo seguinte (manter tudo mais no arquivo intacto):
```ts
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL ?? "https://m2inteligenciatributaria.com.br",
  ),
  title: {
    default: "M2 Inteligência Tributária — Recuperação de Créditos Tributários",
    template: "%s | M2 Inteligência Tributária",
  },
  description:
    "Especialistas em recuperação de créditos tributários para empresas de todos os portes. Honorários apenas sobre o que for recuperado. Análise inicial gratuita.",
  openGraph: {
    siteName: "M2 Inteligência Tributária",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "/imagens/office/fachada_m2.webp",
        width: 1200,
        height: 630,
        alt: "M2 Inteligência Tributária",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/imagens/office/fachada_m2.webp"],
  },
  icons: {
    icon: "/imagens/logo/LOGO_M2_CLEAN.png",
  },
};
```

- [ ] **Step 3: Verificar build**

```bash
npm run build
```
Esperado: compilação sem erros de tipo.

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx components/shared/JsonLd.tsx
git commit -m "feat(seo): add metadataBase, title template, and reusable JsonLd component"
```

---

## Task 3: Metadata estática + JSON-LD — Home, Sobre, Serviços

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/sobre/page.tsx`
- Modify: `app/servicos/page.tsx`

**Interfaces:**
- Consumes: `<JsonLd>` de `components/shared/JsonLd.tsx` (Task 2)
- Produces: metadata e JSON-LD em cada uma das 3 páginas

- [ ] **Step 1: Adicionar JSON-LD Organization na homepage**

Em `app/page.tsx`, adicionar import:
```ts
import { JsonLd } from "@/components/shared/JsonLd";
```

No `return` da função `Home`, adicionar `<JsonLd>` antes do `<Hero />`:
```tsx
export default function Home() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "M2 Inteligência Tributária",
          url: "https://m2inteligenciatributaria.com.br",
          logo: "https://m2inteligenciatributaria.com.br/imagens/logo/LOGO_M2.png",
          telephone: "+5588992156717",
          email: "m2inteligenciadptovendas@gmail.com",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Av. Ana Saraiva de Menezes, 938",
            addressLocality: "Juazeiro do Norte",
            addressRegion: "CE",
            postalCode: "63046-515",
            addressCountry: "BR",
          },
          sameAs: [
            "https://www.instagram.com/m2inteligenciatributaria",
            "https://www.linkedin.com/company/m2-intelig%C3%AAnciatribut%C3%A1ria",
            "https://www.youtube.com/@M2Inteligenciatributaria",
          ],
        }}
      />
      <Hero />
      <LatestInsightsTicker />
      <ExpertiseSection />
      <NumbersSection />
      <HowItWorksSection />
      <ServicesSummarySection />
      <LeadQualificationSection />
      <FaqSection />
      <WhatsAppCtaSection />
      <Footer />
      <WhatsAppFab />
    </>
  );
}
```

- [ ] **Step 2: Adicionar metadata + JSON-LD na página Sobre**

No topo de `app/sobre/page.tsx`, adicionar os imports:
```ts
import type { Metadata } from "next";
import { JsonLd } from "@/components/shared/JsonLd";
```

Adicionar export de metadata:
```ts
export const metadata: Metadata = {
  title: "Sobre a M2",
  description:
    "Conheça a M2 Inteligência Tributária: nossa história, liderança, missão e diferenciais. Mais de 15 anos atuando em recuperação de créditos tributários em todo o Brasil.",
  openGraph: {
    title: "Sobre a M2 Inteligência Tributária",
    description:
      "Conheça a M2 Inteligência Tributária: nossa história, liderança, missão e diferenciais. Mais de 15 anos atuando em recuperação de créditos tributários em todo o Brasil.",
    url: "/sobre",
    type: "website",
    images: [
      {
        url: "/imagens/office/fachada_m2.webp",
        width: 1200,
        height: 630,
        alt: "Equipe M2 Inteligência Tributária",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sobre a M2 Inteligência Tributária",
    description:
      "Conheça a M2 Inteligência Tributária: nossa história, liderança, missão e diferenciais.",
    images: ["/imagens/office/fachada_m2.webp"],
  },
};
```

Atualizar o `return` da `SobrePage` para incluir `<JsonLd>`:
```tsx
export default function SobrePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "Sobre a M2 Inteligência Tributária",
          description:
            "Especialistas em recuperação de créditos tributários com mais de 15 anos de experiência, atuando em todo o Brasil.",
          url: "https://m2inteligenciatributaria.com.br/sobre",
          publisher: {
            "@type": "Organization",
            name: "M2 Inteligência Tributária",
            url: "https://m2inteligenciatributaria.com.br",
          },
        }}
      />
      <AboutHeroSection />
      <CompanyStorySection />
      <WorkEnvironmentSection />
      <WhatWeDoSection />
      <MissionVisionValuesSection />
      <LeadershipSection />
      <InstitutionalDifferentialsSection />
      <AboutCtaSection />
      <Footer />
    </>
  );
}
```

- [ ] **Step 3: Adicionar metadata + JSON-LD na página Serviços**

No topo de `app/servicos/page.tsx`, adicionar os imports:
```ts
import type { Metadata } from "next";
import { JsonLd } from "@/components/shared/JsonLd";
```

Adicionar export de metadata:
```ts
export const metadata: Metadata = {
  title: "Serviços de Recuperação Tributária",
  description:
    "Recuperação de PIS/COFINS sobre produtos monofásicos, INSS sobre folha, ICMS-ST e outros tributos pagos indevidamente. Compliance fiscal e holding patrimonial para empresas de todos os portes.",
  openGraph: {
    title: "Serviços de Recuperação Tributária — M2 Inteligência Tributária",
    description:
      "Recuperação de PIS/COFINS, INSS, ICMS-ST e outros créditos tributários. Atendemos empresas de todos os portes em todo o Brasil.",
    url: "/servicos",
    type: "website",
    images: [
      {
        url: "/imagens/office/fachada_m2.webp",
        width: 1200,
        height: 630,
        alt: "Serviços M2 Inteligência Tributária",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Serviços de Recuperação Tributária — M2",
    description:
      "Recuperação de PIS/COFINS, INSS, ICMS-ST e outros créditos tributários para sua empresa.",
    images: ["/imagens/office/fachada_m2.webp"],
  },
};
```

Atualizar o `return` da `ServicosPage` para incluir `<JsonLd>`:
```tsx
export default function ServicosPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "M2 Inteligência Tributária",
          description:
            "Serviços especializados em recuperação de créditos tributários, compliance fiscal e holding patrimonial.",
          url: "https://m2inteligenciatributaria.com.br/servicos",
          areaServed: "BR",
          serviceType: [
            "Recuperação de PIS/COFINS",
            "Recuperação de INSS sobre Folha",
            "Recuperação de ICMS-ST",
            "Compliance Fiscal",
            "Holding Patrimonial",
          ],
          provider: {
            "@type": "Organization",
            name: "M2 Inteligência Tributária",
            url: "https://m2inteligenciatributaria.com.br",
          },
        }}
      />
      <ServicesHeroSection />
      <ServicesIntroSection />
      {/* <ServicesGridSection /> */}
      <ServicesSummarySection />
      <MethodologySection />
      <SegmentsSection />
      <ComplianceSection />
      <FaqSection />
      <ServicesCtaSection />
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Verificar build**

```bash
npm run build
```
Esperado: sem erros de tipo.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx app/sobre/page.tsx app/servicos/page.tsx
git commit -m "feat(seo): add metadata and JSON-LD to home, sobre, and servicos pages"
```

---

## Task 4: Blog article metadata enrichment + JSON-LD

**Files:**
- Modify: `app/blog/[slug]/page.tsx`

**Interfaces:**
- Consumes: `ArticleDetail` de `app/blog/_lib/types.ts`; `<JsonLd>` de Task 2
- Produces: `generateMetadata` completo com OG article + Twitter card; JSON-LD `Article` por artigo

**Notas importantes:**
- `generateMetadata` já existe no arquivo — substituir o `return` dentro do bloco `if (article)`
- `article.coverImage` é sempre string não-nula (tem fallback em `mapPostToArticle`)
- `article.excerpt` é sempre string (tem fallback `?? ""`)
- `article.publishedAt` é string ISO (ex: `"2026-01-15T00:00:00.000Z"`)

- [ ] **Step 1: Enriquecer o generateMetadata existente**

Em `app/blog/[slug]/page.tsx`, substituir o bloco `return` dentro de `generateMetadata` (manter o `if (!article)` de erro):

```ts
const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://m2inteligenciatributaria.com.br";

// Dentro de generateMetadata, substituir o return:
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
```

A constante `BASE_URL` deve ser declarada **fora** das funções, no escopo do módulo, logo após os imports.

- [ ] **Step 2: Adicionar import de JsonLd e adicionar JSON-LD Article no return da página**

Adicionar import no topo:
```ts
import { JsonLd } from "@/components/shared/JsonLd";
```

No `return` de `ArticlePage`, adicionar `<JsonLd>` logo antes do `<div className="min-h-screen ...">`:
```tsx
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
      {/* ... resto do JSX existente inalterado ... */}
    </div>
    <Footer />
  </>
);
```

- [ ] **Step 3: Verificar build**

```bash
npm run build
```
Esperado: sem erros. Verificar que `generateMetadata` e `ArticlePage` compilam sem problemas de tipo.

- [ ] **Step 4: Commit**

```bash
git add app/blog/[slug]/page.tsx
git commit -m "feat(seo): enrich blog article metadata with full OG, Twitter card, and Article JSON-LD"
```

---

## Task 5: Sitemap dinâmico + robots.txt

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

**Interfaces:**
- Consumes: `prisma` de `lib/server/db`; `PostStatus` de `@prisma/client`
- Produces: `/sitemap.xml` acessível publicamente com rotas estáticas + dinâmicas; `/robots.txt` apontando para o sitemap

- [ ] **Step 1: Criar app/sitemap.ts**

```ts
import type { MetadataRoute } from "next";
import { PostStatus } from "@prisma/client";
import { prisma } from "@/lib/server/db";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://m2inteligenciatributaria.com.br";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, albums] = await Promise.all([
    prisma.post.findMany({
      where: { status: PostStatus.published },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.galleryAlbum.findMany({
      where: { isPublic: true },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/sobre`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/servicos`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/galeria-m2`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const albumRoutes: MetadataRoute.Sitemap = albums.map((album) => ({
    url: `${BASE_URL}/galeria-m2/${album.slug}`,
    lastModified: album.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes, ...albumRoutes];
}
```

- [ ] **Step 2: Criar app/robots.ts**

```ts
import type { MetadataRoute } from "next";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ?? "https://m2inteligenciatributaria.com.br";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: Verificar build**

```bash
npm run build
```
Esperado: sem erros. Next.js vai gerar `/sitemap.xml` e `/robots.txt` automaticamente a partir dessas rotas.

- [ ] **Step 4: Verificar as rotas em dev**

```bash
npm run dev
```
Acessar `http://localhost:3000/sitemap.xml` e `http://localhost:3000/robots.txt` no browser. O sitemap deve listar as rotas estáticas + artigos publicados + álbuns. O robots.txt deve proibir `/admin/` e `/api/` e apontar para o sitemap.

- [ ] **Step 5: Commit**

```bash
git add app/sitemap.ts app/robots.ts
git commit -m "feat(seo): add dynamic sitemap and robots.txt"
```

---

## Task 6: Admin leads API

**Files:**
- Create: `app/api/admin/leads/route.ts`

**Interfaces:**
- Consumes: `requireAdminFromRequest` de `lib/server/auth/guards`; `prisma` de `lib/server/db`
- Produces: `GET /api/admin/leads?page=N` → `{ leads: Lead[], total: number, page: number, pageSize: number }`

- [ ] **Step 1: Criar a rota**

Criar `app/api/admin/leads/route.ts`:
```ts
import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "../../../../lib/server/auth/guards";
import { prisma } from "../../../../lib/server/db";

const PAGE_SIZE = 50;

export async function GET(req: Request) {
  const guard = await requireAdminFromRequest(req);

  if (!guard.ok) {
    return guard.response;
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        company: true,
        companySize: true,
        monthlyRevenue: true,
        taxRegime: true,
        message: true,
        source: true,
        createdAt: true,
      },
    }),
    prisma.lead.count(),
  ]);

  return NextResponse.json({ leads, total, page, pageSize: PAGE_SIZE });
}
```

- [ ] **Step 2: Verificar build**

```bash
npm run build
```
Esperado: sem erros de tipo.

- [ ] **Step 3: Commit**

```bash
git add app/api/admin/leads/route.ts
git commit -m "feat(admin): add GET /api/admin/leads with pagination"
```

---

## Task 7: Admin leads page + nav

**Files:**
- Create: `app/admin/leads/page.tsx`
- Modify: `app/admin/_components/AdminShell.tsx`

**Interfaces:**
- Consumes: `GET /api/admin/leads` (Task 6); `AdminShell` de `app/admin/_components/AdminShell.tsx`
- Produces: página `/admin/leads` com tabela paginada; item "Leads" no nav do AdminShell

- [ ] **Step 1: Adicionar "Leads" ao nav do AdminShell**

Em `app/admin/_components/AdminShell.tsx`, localizar o array `navItems` e adicionar entre "Categorias" e "Galeria":
```ts
const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/posts", label: "Artigos" },
  { href: "/admin/categorias", label: "Categorias" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/gallery", label: "Galeria" },
];
```

- [ ] **Step 2: Criar a página de leads**

Criar `app/admin/leads/page.tsx`:
```tsx
"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "../_components/AdminShell";

type AdminLead = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  company: string | null;
  companySize: string | null;
  monthlyRevenue: string | null;
  taxRegime: string | null;
  message: string | null;
  source: string | null;
  createdAt: string;
};

type LeadsResponse = {
  leads: AdminLead[];
  total: number;
  page: number;
  pageSize: number;
};

export default function AdminLeadsPage() {
  const [data, setData] = useState<LeadsResponse | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadLeads(targetPage: number) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/leads?page=${targetPage}`);
      if (!res.ok) throw new Error("Falha ao carregar leads.");
      const json = (await res.json()) as LeadsResponse;
      setData(json);
    } catch {
      setError("Não foi possível carregar os leads.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadLeads(page);
  }, [page]);

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 1;

  return (
    <AdminShell
      title="Leads"
      subtitle="Contatos recebidos pelo formulário do site."
    >
      <section className="rounded-2xl border border-zinc-800 bg-[#060b12] p-4 md:p-5">
        {error ? <p className="text-sm text-red-400">{error}</p> : null}
        {loading ? <p className="text-sm text-zinc-400">Carregando...</p> : null}

        {!loading && data && data.leads.length === 0 ? (
          <p className="text-sm text-zinc-400">Nenhum lead recebido ainda.</p>
        ) : null}

        {!loading && data && data.leads.length > 0 ? (
          <>
            <p className="mb-4 text-xs text-zinc-500">
              {data.total} lead{data.total !== 1 ? "s" : ""} no total · página {data.page} de {totalPages}
            </p>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-sm">
                <thead>
                  <tr className="border-b border-zinc-700 text-left text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    <th className="pb-3 pr-4">Data</th>
                    <th className="pb-3 pr-4">Nome</th>
                    <th className="pb-3 pr-4">E-mail</th>
                    <th className="pb-3 pr-4">Telefone</th>
                    <th className="pb-3 pr-4">Empresa</th>
                    <th className="pb-3 pr-4">Regime</th>
                    <th className="pb-3">Mensagem</th>
                  </tr>
                </thead>
                <tbody>
                  {data.leads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="border-b border-zinc-800/60 transition hover:bg-zinc-900/40"
                    >
                      <td className="py-3 pr-4 text-xs text-zinc-400 whitespace-nowrap">
                        {new Date(lead.createdAt).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3 pr-4 font-medium text-white whitespace-nowrap">
                        {lead.fullName}
                      </td>
                      <td className="py-3 pr-4 text-zinc-300">
                        <a
                          href={`mailto:${lead.email}`}
                          className="hover:text-[#f2c40f] transition-colors"
                        >
                          {lead.email}
                        </a>
                      </td>
                      <td className="py-3 pr-4 text-zinc-300 whitespace-nowrap">
                        {lead.phone ?? "—"}
                      </td>
                      <td className="py-3 pr-4 text-zinc-300">
                        {lead.company ?? "—"}
                      </td>
                      <td className="py-3 pr-4 text-zinc-300 whitespace-nowrap">
                        {lead.taxRegime ?? "—"}
                      </td>
                      <td className="py-3 max-w-[200px]">
                        {lead.message ? (
                          <span
                            title={lead.message}
                            className="block truncate text-zinc-400"
                          >
                            {lead.message}
                          </span>
                        ) : (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-700 px-4 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Anterior
              </button>
              <span className="text-xs text-zinc-500">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-700 px-4 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Próxima →
              </button>
            </div>
          </>
        ) : null}
      </section>
    </AdminShell>
  );
}
```

- [ ] **Step 3: Verificar build**

```bash
npm run build
```
Esperado: sem erros.

- [ ] **Step 4: Verificar manualmente**

```bash
npm run dev
```
Acessar `http://localhost:3000/admin/leads` (após login). Verificar que o item "Leads" aparece no nav lateral e que a tabela renderiza corretamente (estado vazio se não houver leads).

- [ ] **Step 5: Commit**

```bash
git add app/admin/leads/page.tsx app/admin/_components/AdminShell.tsx
git commit -m "feat(admin): add leads viewer page with pagination"
```

---

## Task 8: Google Sheets auto-sync

**Files:**
- Install: `googleapis`
- Create: `lib/server/integrations/google-sheets.ts`
- Modify: `app/api/leads/route.ts`

**Interfaces:**
- Consumes: env vars `GOOGLE_SHEETS_CLIENT_EMAIL`, `GOOGLE_SHEETS_PRIVATE_KEY`, `GOOGLE_SHEETS_SPREADSHEET_ID`
- Produces: `appendLeadToSheet(lead: LeadForSheet): Promise<void>` — chamada fire-and-forget após `prisma.lead.create` na rota de leads

**Pré-requisito para testar:** Você precisará de:
1. Uma conta de serviço Google (service account) com permissão de edição na planilha
2. O JSON de credenciais do service account (extrair `client_email` e `private_key`)
3. O ID da planilha (parte da URL: `https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/`)
4. Adicionar o `client_email` da service account como editor na planilha

**Estrutura esperada da planilha (Sheet1):**
Cabeçalho na linha 1: `Data | Nome | E-mail | Telefone | Empresa | Regime Tributário | Mensagem | Origem`

- [ ] **Step 1: Instalar googleapis**

```bash
npm install googleapis
```

- [ ] **Step 2: Criar lib/server/integrations/google-sheets.ts**

```ts
import { google } from "googleapis";

export interface LeadForSheet {
  fullName: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  taxRegime?: string | null;
  message?: string | null;
  source?: string | null;
  createdAt: Date;
}

export async function appendLeadToSheet(lead: LeadForSheet): Promise<void> {
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  if (!clientEmail || !privateKey || !spreadsheetId) {
    return;
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1!A:H",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [
        [
          lead.createdAt.toISOString(),
          lead.fullName,
          lead.email,
          lead.phone ?? "",
          lead.company ?? "",
          lead.taxRegime ?? "",
          lead.message ?? "",
          lead.source ?? "",
        ],
      ],
    },
  });
}
```

- [ ] **Step 3: Modificar app/api/leads/route.ts para fire-and-forget**

Adicionar o import no topo do arquivo (junto com os outros imports):
```ts
import { appendLeadToSheet } from "../../../lib/server/integrations/google-sheets";
```

Logo após `const lead = await prisma.lead.create(...)` e antes do `return NextResponse.json(...)`, adicionar:
```ts
void appendLeadToSheet({
  fullName: parsedBody.data.fullName,
  email,
  phone: parsedBody.data.whatsapp,
  company: parsedBody.data.companyName,
  taxRegime: parsedBody.data.taxRegime,
  message: parsedBody.data.needDetails || null,
  source: `service:${parsedBody.data.service};challenge:${parsedBody.data.challenge};cnpj:${parsedBody.data.cnpj}`,
  createdAt: new Date(),
}).catch((err: unknown) => {
  console.error("[google-sheets] sync error:", err);
});
```

O arquivo final do bloco `POST` ficará assim (apenas mostrando a parte modificada após `prisma.lead.create`):
```ts
  const lead = await prisma.lead.create({
    data: {
      fullName: parsedBody.data.fullName,
      email,
      phone: parsedBody.data.whatsapp,
      company: parsedBody.data.companyName,
      taxRegime: parsedBody.data.taxRegime,
      message: parsedBody.data.needDetails || null,
      source: `service:${parsedBody.data.service};challenge:${parsedBody.data.challenge};cnpj:${parsedBody.data.cnpj}`,
    },
    select: {
      id: true,
    },
  });

  void appendLeadToSheet({
    fullName: parsedBody.data.fullName,
    email,
    phone: parsedBody.data.whatsapp,
    company: parsedBody.data.companyName,
    taxRegime: parsedBody.data.taxRegime,
    message: parsedBody.data.needDetails || null,
    source: `service:${parsedBody.data.service};challenge:${parsedBody.data.challenge};cnpj:${parsedBody.data.cnpj}`,
    createdAt: new Date(),
  }).catch((err: unknown) => {
    console.error("[google-sheets] sync error:", err);
  });

  return NextResponse.json({ id: lead.id }, { status: 201 });
```

- [ ] **Step 4: Verificar build**

```bash
npm run build
```
Esperado: sem erros de tipo. O pacote `googleapis` inclui suas próprias definições TypeScript.

- [ ] **Step 5: Testar sem credenciais (graceful skip)**

Com as env vars `GOOGLE_SHEETS_*` ausentes no `.env` local, enviar um lead pelo formulário do site. Verificar que:
- O formulário submete com sucesso (status 201)
- Nenhum erro aparece no console do servidor relacionado ao Sheets

- [ ] **Step 6: Commit**

```bash
git add lib/server/integrations/google-sheets.ts app/api/leads/route.ts package.json package-lock.json
git commit -m "feat(leads): add Google Sheets auto-sync on lead creation via googleapis"
```

---

## Checklist final

Após todas as tasks, verificar:

- [ ] `http://localhost:3000` → inspecionar `<head>` e confirmar OG tags e JSON-LD Organization
- [ ] `http://localhost:3000/sobre` → confirmar `<title>` = "Sobre a M2 | M2 Inteligência Tributária"
- [ ] `http://localhost:3000/servicos` → confirmar metadata e JSON-LD
- [ ] `http://localhost:3000/blog/<slug>` → confirmar OG `type: article`, Twitter card e JSON-LD Article
- [ ] `http://localhost:3000/sitemap.xml` → confirmar todas as rotas listadas
- [ ] `http://localhost:3000/robots.txt` → confirmar `Disallow: /admin/` e link para sitemap
- [ ] Footer: clicar em "Contato" → deve rolar para o formulário na homepage (não 404)
- [ ] `/admin/leads` → tabela renderiza, nav mostra "Leads" ativo
