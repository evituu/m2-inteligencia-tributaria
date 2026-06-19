# Site Completion — Design Spec

**Date:** 2026-06-19  
**Status:** Approved  
**Scope:** Fix broken footer link, robust SEO across all pages, admin leads viewer, Google Sheets auto-sync

---

## 1. Footer Link Fix

**File:** `components/layout/Footer.tsx`  
Change `href: "/formulario"` → `href: "/#formulario"` in the `quickLinks` array.

The navigation menu already uses `/#formulario` correctly. This is a one-line fix.

---

## 2. SEO — Robusto e Completo

### 2.1 `metadataBase` no layout raiz

`app/layout.tsx` recebe `metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "https://m2inteligenciatributaria.com.br")` para que URLs absolutas em OG tags e sitemap funcionem corretamente.

Nova env var: `NEXT_PUBLIC_BASE_URL` (ex: `https://m2inteligenciatributaria.com.br`). Adicionar ao `.env.example`.

### 2.2 Metadata estática por página

Cada página pública recebe `export const metadata: Metadata` com os campos abaixo. A homepage recebe via `app/layout.tsx` (já existe — apenas enriquecer).

| Página | Title | Description foco |
|--------|-------|-----------------|
| `/` | `M2 Inteligência Tributária — Recuperação de Créditos Tributários` | Recuperação de créditos, honorários só sobre o recuperado |
| `/sobre` | `Sobre a M2 — Especialistas em Recuperação Tributária` | História, liderança, missão e valores |
| `/servicos` | `Serviços — Recuperação de PIS/COFINS, INSS, ICMS e mais` | Serviços de recuperação fiscal e compliance |
| `/blog` | já existe | já existe |
| `/galeria-m2` | já existe | já existe |

Estrutura por página:
```ts
export const metadata: Metadata = {
  title: "...",
  description: "...",
  openGraph: {
    title: "...",
    description: "...",
    url: "https://m2inteligenciatributaria.com.br/<rota>",
    siteName: "M2 Inteligência Tributária",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/imagens/og/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "...",
    description: "...",
    images: ["/imagens/og/og-default.jpg"],
  },
};
```

**OG image padrão:** `/imagens/office/fachada_m2.webp` — já existe em `/public`. Next.js aceita `.webp` em OG tags quando `metadataBase` está configurado. Usar diretamente, sem criar novo arquivo.

### 2.3 Metadata dinâmica nos artigos do blog

`app/blog/[slug]/page.tsx` ganha `generateMetadata({ params })` que:

1. Busca o post via `getArticleBySlug(slug)` — já existente
2. Extrai description: strip markdown/HTML dos primeiros 160 chars de `post.content`
3. Retorna:

```ts
{
  title: `${post.title} | M2 Inteligência Tributária`,
  description: strippedExcerpt,
  openGraph: {
    type: "article",
    title: post.title,
    description: strippedExcerpt,
    url: `${BASE_URL}/blog/${post.slug}`,
    publishedTime: post.publishedAt?.toISOString(),
    modifiedTime: post.updatedAt.toISOString(),
    authors: [post.author?.name ?? "M2 Inteligência Tributária"],
    images: post.coverImageUrl ? [{ url: post.coverImageUrl, width: 1200, height: 630 }] : [],
  },
  twitter: {
    card: "summary_large_image",
    title: post.title,
    description: strippedExcerpt,
    images: post.coverImageUrl ? [post.coverImageUrl] : [],
  },
}
```

**Description:** usa `post.excerpt` se disponível (campo já existe no banco). Caso `excerpt` seja nulo, faz strip do `post.content` com regex que remove tags HTML (`/<[^>]+>/g`) e marcadores markdown, depois `.slice(0, 160).trim()`. Sem dependência externa.

### 2.4 JSON-LD estruturado

Componente `<JsonLd data={...} />` em `components/shared/JsonLd.tsx` — renderiza `<script type="application/ld+json">` via `dangerouslySetInnerHTML`. Reutilizável em todas as páginas.

Schemas por página:

**Homepage** — `Organization`:
```json
{
  "@type": "Organization",
  "name": "M2 Inteligência Tributária",
  "url": "https://m2inteligenciatributaria.com.br",
  "logo": "https://m2inteligenciatributaria.com.br/imagens/logo/LOGO_M2.png",
  "telephone": "+5588992156717",
  "email": "m2inteligenciadptovendas@gmail.com",
  "address": { "@type": "PostalAddress", "addressLocality": "Juazeiro do Norte", "addressRegion": "CE", "addressCountry": "BR" },
  "sameAs": ["https://www.instagram.com/m2inteligenciatributaria", "https://www.linkedin.com/company/m2-inteligênciatributária", "https://www.youtube.com/@M2Inteligenciatributaria"]
}
```

**Sobre** — `AboutPage` wrapping `Organization`.

**Serviços** — `Service` array com os serviços principais.

**Artigos** — `Article`:
```json
{
  "@type": "Article",
  "headline": "...",
  "description": "...",
  "image": "...",
  "author": { "@type": "Person", "name": "..." },
  "publisher": { "@type": "Organization", "name": "M2 Inteligência Tributária", "logo": "..." },
  "datePublished": "...",
  "dateModified": "..."
}
```

### 2.5 Sitemap dinâmico

`app/sitemap.ts` — exporta função async:

```ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.post.findMany({ where: { status: "published" }, select: { slug: true, updatedAt: true } });
  const albums = await prisma.galleryAlbum.findMany({ where: { isPublic: true }, select: { slug: true, updatedAt: true } });

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/sobre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/servicos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/galeria-m2`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    ...posts.map(p => ({ url: `${BASE_URL}/blog/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...albums.map(a => ({ url: `${BASE_URL}/galeria-m2/${a.slug}`, lastModified: a.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
```

### 2.6 robots.txt

`app/robots.ts`:
```ts
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
```

---

## 3. Admin Leads Viewer

### 3.1 API `GET /api/admin/leads`

**Arquivo:** `app/api/admin/leads/route.ts`

- Protegido por `requireAdminFromRequest()` (cookie de auth)
- Query params: `?page=1` (default), pageSize fixo em 50
- Retorna:
```json
{
  "leads": [{ "id", "fullName", "email", "phone", "company", "companySize", "monthlyRevenue", "taxRegime", "message", "source", "createdAt" }],
  "total": 123,
  "page": 1,
  "pageSize": 50
}
```
- Ordenação: `createdAt DESC`

### 3.2 Página `app/admin/leads/page.tsx`

- Client component (padrão das outras páginas admin)
- Usa `AdminShell` com title "Leads" e sem primaryAction
- Table com colunas: **Data**, **Nome**, **E-mail**, **Telefone**, **Empresa**, **Porte**, **Faturamento**, **Regime**, **Origem**
- Coluna "Mensagem" como tooltip/expand (texto pode ser longo)
- Paginação simples: botões "Anterior" / "Próxima"
- Estado vazio: "Nenhum lead recebido ainda."

### 3.3 Nav do AdminShell

`app/admin/_components/AdminShell.tsx` — adicionar `{ href: "/admin/leads", label: "Leads" }` ao array `navItems`, entre "Categorias" e "Galeria".

---

## 4. Google Sheets Auto-Sync

### 4.1 Dependência

```bash
npm install googleapis
```

### 4.2 `lib/server/integrations/google-sheets.ts`

```ts
export async function appendLeadToSheet(lead: LeadPayload): Promise<void>
```

- Lê `GOOGLE_SHEETS_CLIENT_EMAIL`, `GOOGLE_SHEETS_PRIVATE_KEY`, `GOOGLE_SHEETS_SPREADSHEET_ID` das env vars
- Se qualquer uma estiver ausente: retorna silenciosamente (graceful skip)
- Autentica com `google.auth.JWT` usando as credenciais
- Usa `sheets.spreadsheets.values.append` com `valueInputOption: "USER_ENTERED"`, range `"Sheet1!A:I"`
- Linha a inserir: `[Data ISO, Nome, E-mail, Telefone, Empresa, Porte, Faturamento, Regime, Mensagem]`
- Erros são capturados e logados com `console.error` — nunca propagados

**Nota sobre `GOOGLE_SHEETS_PRIVATE_KEY`:** A chave privada do service account contém `\n` literais. No `.env`, envolver em aspas e usar `\n` como está. No código, fazer `key.replace(/\\n/g, "\n")` para garantir compatibilidade.

### 4.3 Integração em `app/api/leads/route.ts`

Após `prisma.lead.create()` bem-sucedido, adicionar:

```ts
void appendLeadToSheet(newLead).catch((err) => console.error("Sheets sync error:", err));
```

O `void` garante fire-and-forget — a resposta ao cliente não espera o Sheets.

### 4.4 Novas env vars

Adicionar ao `.env.example`:
```
NEXT_PUBLIC_BASE_URL=https://m2inteligenciatributaria.com.br
GOOGLE_SHEETS_CLIENT_EMAIL=
GOOGLE_SHEETS_PRIVATE_KEY=
GOOGLE_SHEETS_SPREADSHEET_ID=
```

---

## Resumo de arquivos afetados

| Arquivo | Ação |
|---------|------|
| `components/layout/Footer.tsx` | Fix link `/formulario` → `/#formulario` |
| `app/layout.tsx` | Adicionar `metadataBase`, enriquecer metadata global |
| `app/page.tsx` | Adicionar JSON-LD `Organization` |
| `app/sobre/page.tsx` | Adicionar `metadata` + JSON-LD `AboutPage` |
| `app/servicos/page.tsx` | Adicionar `metadata` + JSON-LD `Service` |
| `app/blog/[slug]/page.tsx` | Adicionar `generateMetadata` + JSON-LD `Article` |
| `app/sitemap.ts` | Criar — sitemap dinâmico |
| `app/robots.ts` | Criar — robots.txt |
| `components/shared/JsonLd.tsx` | Criar — componente reutilizável |
| `app/api/admin/leads/route.ts` | Criar — API de listagem de leads |
| `app/admin/leads/page.tsx` | Criar — página de leads no admin |
| `app/admin/_components/AdminShell.tsx` | Adicionar "Leads" ao nav |
| `lib/server/integrations/google-sheets.ts` | Criar — integração Sheets |
| `app/api/leads/route.ts` | Adicionar fire-and-forget para Sheets |
| `.env.example` | Adicionar `NEXT_PUBLIC_BASE_URL`, vars Google |
