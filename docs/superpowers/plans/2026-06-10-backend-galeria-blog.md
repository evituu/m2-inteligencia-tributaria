# Backend completo + Galeria + Blog Markdown — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Completar o backend da aplicação M2 Inteligência Tributária: R2 para uploads, seed do admin, logout, Markdown no blog, e galeria de fotos gerenciada via admin com persistência no banco.

**Architecture:** Três features sequenciais — (1) infraestrutura base que as demais dependem, (2) Markdown no blog sem quebrar conteúdo existente, (3) galeria com schema Prisma + API admin + UI admin + páginas públicas lendo do banco em vez de dados estáticos.

**Tech Stack:** Next.js 16 App Router · Prisma + PostgreSQL · Cloudflare R2 via `@aws-sdk/client-s3` · react-markdown + remark-gfm · tsx (seed) · TypeScript

---

## File Map

### Criados
- `lib/server/storage/r2.ts` — `uploadToR2`, `deleteFromR2`
- `prisma/seed.ts` — cria admin user via env vars
- `app/galeria-m2/_lib/gallery.ts` — queries Prisma para galeria pública
- `app/api/admin/gallery/albums/route.ts` — GET list + POST create
- `app/api/admin/gallery/albums/[id]/route.ts` — GET detail + PATCH + DELETE
- `app/api/admin/gallery/albums/[id]/photos/route.ts` — POST upload fotos
- `app/api/admin/gallery/photos/[id]/route.ts` — DELETE foto
- `app/admin/gallery/page.tsx` — lista de álbuns no admin
- `app/admin/gallery/novo/page.tsx` — formulário de novo álbum
- `app/admin/gallery/[id]/page.tsx` — gerenciamento de fotos

### Modificados
- `lib/server/env.ts` — adiciona validação das 5 vars R2
- `.env.example` — adiciona vars R2 + seed
- `next.config.ts` — `remotePatterns` para R2
- `package.json` — `prisma.seed`, devDep `tsx`
- `prisma/schema.prisma` — modelos `GalleryAlbum` + `GalleryPhoto`
- `app/api/admin/uploads/cover/route.ts` — substitui `fs.writeFile` por `uploadToR2`
- `app/admin/_components/AdminShell.tsx` — botão logout + nav item Galeria
- `app/blog/page.tsx` — remove `<BlogNewsletterSection />`
- `app/blog/_components/ArticleBody.tsx` — adiciona caminho Markdown
- `app/admin/_components/PostEditorForm.tsx` — preview Markdown
- `app/galeria-m2/page.tsx` — lê DB em vez de `data/gallery.ts`
- `app/galeria-m2/[slug]/page.tsx` — lê DB em vez de `data/gallery.ts`

---

## Task 1: Instalar dependências

**Files:**
- Modify: `package.json`

- [ ] **Instalar dependências de produção e desenvolvimento**

```bash
npm install @aws-sdk/client-s3 react-markdown remark-gfm
npm install --save-dev tsx
```

- [ ] **Adicionar `prisma.seed` ao `package.json`**

Abrir `package.json` e adicionar ao objeto raiz (após `"scripts"`):

```json
"prisma": {
  "seed": "tsx prisma/seed.ts"
}
```

- [ ] **Verificar que não há erros**

```bash
npm run build 2>&1 | head -20
```

Esperado: sem erros de dependência (pode ter erros de tipos que serão resolvidos nas próximas tasks).

- [ ] **Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install @aws-sdk/client-s3, react-markdown, remark-gfm, tsx"
```

---

## Task 2: Remover newsletter do blog

**Files:**
- Modify: `app/blog/page.tsx`

- [ ] **Remover `BlogNewsletterSection` da página do blog**

Em `app/blog/page.tsx`, remover a linha de import e o componente:

```tsx
import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import {
  getArticlesExcludingFeatured,
  getFeaturedArticle,
} from "@/app/blog/_lib/articles";
import { BlogFeaturedHero } from "@/app/blog/_components/BlogFeaturedHero";
import { BlogArticlesSection } from "@/app/blog/_components/BlogArticlesSection";
import { BlogEbookBanner } from "@/app/blog/_components/BlogEbookBanner";

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
      <Footer />
    </>
  );
}
```

- [ ] **Commit**

```bash
git add app/blog/page.tsx
git commit -m "feat: remove newsletter section from blog page"
```

---

## Task 3: Módulo Cloudflare R2

**Files:**
- Modify: `lib/server/env.ts`
- Modify: `.env.example`
- Modify: `next.config.ts`
- Create: `lib/server/storage/r2.ts`

- [ ] **Atualizar `lib/server/env.ts` com as 5 variáveis R2**

```typescript
import { z } from "zod";

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_TTL: z.string(),
  JWT_REFRESH_TTL: z.string(),
  CLOUDFLARE_R2_ACCOUNT_ID: z.string().min(1),
  CLOUDFLARE_R2_ACCESS_KEY_ID: z.string().min(1),
  CLOUDFLARE_R2_SECRET_ACCESS_KEY: z.string().min(1),
  CLOUDFLARE_R2_BUCKET_NAME: z.string().min(1),
  CLOUDFLARE_R2_PUBLIC_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

- [ ] **Atualizar `.env.example`**

```
DATABASE_URL=postgresql://user:password@127.0.0.1:5432/m2_db
DIRECT_URL=postgresql://user:password@127.0.0.1:5432/m2_db
JWT_ACCESS_SECRET=change-me-min-32-chars-long-secret
JWT_REFRESH_SECRET=change-me-too-min-32-chars-long
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=30d
ADMIN_BOOTSTRAP_EMAIL=admin@empresa.com
ADMIN_BOOTSTRAP_PASSWORD=change-me

CLOUDFLARE_R2_ACCOUNT_ID=your-account-id
CLOUDFLARE_R2_ACCESS_KEY_ID=your-r2-access-key-id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-r2-secret-access-key
CLOUDFLARE_R2_BUCKET_NAME=your-bucket-name
CLOUDFLARE_R2_PUBLIC_URL=https://pub-xxx.r2.dev
```

- [ ] **Atualizar `next.config.ts` com remotePatterns para R2**

O R2_PUBLIC_URL não está disponível em build time via env schema (que usa `process.env` direto), então usar `process.env` diretamente:

```typescript
import type { NextConfig } from "next";

const r2PublicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL ?? "";
const r2Hostname = r2PublicUrl ? new URL(r2PublicUrl).hostname : "";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: r2Hostname
      ? [{ protocol: "https", hostname: r2Hostname }]
      : [],
  },
};

export default nextConfig;
```

- [ ] **Criar `lib/server/storage/r2.ts`**

```typescript
import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { env } from "../env";

const client = new S3Client({
  region: "auto",
  endpoint: `https://${env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

export async function uploadToR2(
  buffer: Buffer,
  key: string,
  mimeType: string,
): Promise<string> {
  await client.send(
    new PutObjectCommand({
      Bucket: env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: mimeType,
    }),
  );

  return `${env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
}

export async function deleteFromR2(key: string): Promise<void> {
  await client.send(
    new DeleteObjectCommand({
      Bucket: env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: key,
    }),
  );
}
```

- [ ] **Adicionar as 5 variáveis R2 ao seu `.env` real** (não commitado)

```
CLOUDFLARE_R2_ACCOUNT_ID=<seu account ID do Cloudflare>
CLOUDFLARE_R2_ACCESS_KEY_ID=<chave de acesso R2>
CLOUDFLARE_R2_SECRET_ACCESS_KEY=<secret da chave R2>
CLOUDFLARE_R2_BUCKET_NAME=<nome do bucket>
CLOUDFLARE_R2_PUBLIC_URL=<URL pública do bucket>
```

Para obter: Cloudflare Dashboard → R2 → bucket → Settings → Public access URL. Chaves em: R2 → Manage R2 API Tokens.

- [ ] **Verificar que o TypeScript compila sem erros**

```bash
npx tsc --noEmit 2>&1 | head -30
```

Esperado: sem erros relacionados a r2.ts ou env.ts.

- [ ] **Commit**

```bash
git add lib/server/env.ts lib/server/storage/r2.ts .env.example next.config.ts
git commit -m "feat: add Cloudflare R2 module and env validation"
```

---

## Task 4: Upload de capa → R2

**Files:**
- Modify: `app/api/admin/uploads/cover/route.ts`

- [ ] **Substituir implementação local por uploadToR2**

```typescript
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { requireAdminFromRequest } from "@/lib/server/auth/guards";
import { validateCsrf } from "@/lib/server/security/csrf";
import { uploadToR2 } from "@/lib/server/storage/r2";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

function getExtensionByMime(mimeType: string) {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return null;
  }
}

export async function POST(req: Request) {
  if (!validateCsrf(req)) {
    return NextResponse.json({ message: "CSRF invalido" }, { status: 403 });
  }

  const guard = await requireAdminFromRequest(req);
  if (!guard.ok) return guard.response;

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Arquivo nao enviado" }, { status: 400 });
  }

  const extension = getExtensionByMime(file.type);
  if (!extension) {
    return NextResponse.json(
      { message: "Formato invalido. Use JPG, PNG ou WEBP." },
      { status: 400 },
    );
  }

  if (file.size <= 0 || file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { message: "Arquivo excede o limite de 5MB." },
      { status: 400 },
    );
  }

  const key = `covers/${Date.now()}-${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadToR2(buffer, key, file.type);

  return NextResponse.json({ url }, { status: 201 });
}
```

- [ ] **Testar manualmente**: acesse `/admin/posts/novo`, faça upload de uma imagem de capa pequena (< 5MB). A URL retornada deve começar com o `CLOUDFLARE_R2_PUBLIC_URL` configurado.

- [ ] **Commit**

```bash
git add app/api/admin/uploads/cover/route.ts
git commit -m "feat: migrate cover upload from local filesystem to Cloudflare R2"
```

---

## Task 5: Seed do admin

**Files:**
- Create: `prisma/seed.ts`

- [ ] **Criar `prisma/seed.ts`**

```typescript
import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL;
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "ADMIN_BOOTSTRAP_EMAIL and ADMIN_BOOTSTRAP_PASSWORD must be set in .env",
    );
  }

  const passwordHash = hashSync(password, 12);

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      passwordHash,
      role: "admin",
      isActive: true,
    },
  });

  console.log(`Admin user ready: ${user.email} (id: ${user.id})`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
```

- [ ] **Garantir que `ADMIN_BOOTSTRAP_EMAIL` e `ADMIN_BOOTSTRAP_PASSWORD` estão no `.env`**

Verificar que o `.env` tem as duas variáveis preenchidas.

- [ ] **Rodar o seed**

```bash
npx prisma db seed
```

Esperado:
```
Admin user ready: admin@suaempresa.com (id: clxxxx...)
```

- [ ] **Verificar no banco** (opcional, via Prisma Studio)

```bash
npx prisma studio
```

Abrir `User`, confirmar que o registro foi criado.

- [ ] **Testar login**: acessar `/admin/login`, fazer login com as credenciais do seed. Deve redirecionar para `/admin`.

- [ ] **Commit**

```bash
git add prisma/seed.ts package.json
git commit -m "feat: add prisma seed for first admin user"
```

---

## Task 6: AdminShell — logout + nav Galeria

**Files:**
- Modify: `app/admin/_components/AdminShell.tsx`

- [ ] **Substituir `AdminShell.tsx` com logout e nav item Galeria**

```tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

type AdminShellProps = {
  title: string;
  subtitle?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  children: ReactNode;
};

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/posts", label: "Artigos" },
  { href: "/admin/gallery", label: "Galeria" },
];

export function AdminShell({ title, subtitle, primaryAction, children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/admin/login");
    }
  }

  return (
    <main className="min-h-screen bg-[#04070d] text-zinc-100">
      <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-6 px-4 py-6 md:px-8 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-zinc-800 bg-[#060b12] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#c9a84c]">M2 Admin</p>
          <p className="mt-1 text-lg font-bold text-white">Dashboard</p>
          <nav className="mt-5 flex flex-wrap gap-2 lg:flex-col">
            {navItems.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === item.href
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex h-10 items-center rounded-md px-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#f2c40f] text-[#12151b]"
                      : "bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={loggingOut}
              className="mt-2 inline-flex h-10 items-center rounded-md border border-zinc-700 px-3 text-sm font-medium text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200 disabled:opacity-50 lg:mt-4"
            >
              {loggingOut ? "Saindo..." : "Sair"}
            </button>
          </nav>
        </aside>

        <section className="space-y-6">
          <header className="rounded-2xl border border-zinc-800 bg-[#060b12] p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-white md:text-3xl">{title}</h1>
                {subtitle ? <p className="mt-1 text-sm text-zinc-400">{subtitle}</p> : null}
              </div>
              {primaryAction ? (
                <Link
                  href={primaryAction.href}
                  className="inline-flex h-10 items-center justify-center rounded-md bg-[#f2c40f] px-4 text-sm font-semibold text-[#12151b] transition hover:bg-[#e3b80d]"
                >
                  {primaryAction.label}
                </Link>
              ) : null}
            </div>
          </header>
          {children}
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Testar**: acessar o admin, verificar que "Galeria" aparece no sidebar (link ainda leva a 404 — normal, a página será criada na Task 13). Clicar em "Sair" deve redirecionar para `/admin/login` e limpar cookies.

- [ ] **Commit**

```bash
git add app/admin/_components/AdminShell.tsx
git commit -m "feat: add logout button and Gallery nav item to AdminShell"
```

---

## Task 7: Blog — Markdown no ArticleBody e preview do editor

**Files:**
- Modify: `app/blog/_components/ArticleBody.tsx`
- Modify: `app/admin/_components/PostEditorForm.tsx`

- [ ] **Atualizar `app/blog/_components/ArticleBody.tsx`**

Adicionar detecção de Markdown e renderização com react-markdown, mantendo os dois caminhos existentes:

```tsx
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ArticleBodyProps {
  content: string;
}

function looksLikeHtml(content: string) {
  return /<\/?[a-z][\s\S]*>/i.test(content);
}

function looksLikeMarkdown(content: string) {
  return /^#{1,6}\s|\*\*[\s\S]+?\*\*|^[-*]\s|^\d+\.\s|\[.+\]\(.+\)|```/m.test(content);
}

const proseClasses =
  "prose prose-zinc max-w-none text-[#1a1a1a] prose-headings:font-bold prose-headings:text-[#1a1a1a] prose-p:text-zinc-700 prose-p:leading-8 prose-a:text-[#735c00] prose-strong:text-[#1a1a1a]";

export function ArticleBody({ content }: ArticleBodyProps) {
  if (looksLikeHtml(content)) {
    return (
      <article
        className={proseClasses}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  if (looksLikeMarkdown(content)) {
    return (
      <article className={proseClasses}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    );
  }

  const paragraphs = content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return (
      <article className={proseClasses}>
        <p className="text-base leading-8 text-zinc-700 md:text-lg md:leading-9">
          Conteúdo em breve.
        </p>
      </article>
    );
  }

  return (
    <article className={proseClasses}>
      {paragraphs.map((paragraph) => (
        <p
          key={paragraph.slice(0, 48)}
          className="mb-8 text-base leading-8 text-zinc-700 last:mb-0 md:text-lg md:leading-9"
        >
          {paragraph}
        </p>
      ))}
    </article>
  );
}
```

- [ ] **Atualizar o bloco de preview em `PostEditorForm.tsx`**

Localizar o bloco de preview (por volta da linha 426):

```tsx
<div className="max-h-80 overflow-y-auto whitespace-pre-wrap rounded-lg border border-zinc-800 bg-zinc-900/70 p-3 text-sm leading-6 text-zinc-200">
  {content.trim() || "O conteudo completo aparece aqui em tempo real para revisao."}
</div>
```

Substituir por (adicionar os imports `ReactMarkdown` e `remarkGfm` no topo do arquivo):

```tsx
// no topo do arquivo, junto com os outros imports:
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// no lugar do div de preview:
<div className="max-h-80 overflow-y-auto rounded-lg border border-zinc-800 bg-zinc-900/70 p-3 text-sm leading-6 text-zinc-200 prose prose-sm prose-invert max-w-none">
  {content.trim() ? (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
  ) : (
    <span className="text-zinc-500">O conteudo completo aparece aqui em tempo real para revisao.</span>
  )}
</div>
```

- [ ] **Verificar build**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Esperado: sem erros de tipos em ArticleBody.tsx e PostEditorForm.tsx.

- [ ] **Commit**

```bash
git add app/blog/_components/ArticleBody.tsx app/admin/_components/PostEditorForm.tsx
git commit -m "feat: add Markdown rendering to ArticleBody and editor preview"
```

---

## Task 8: Schema Prisma — modelos GalleryAlbum e GalleryPhoto

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Adicionar os dois modelos ao final de `prisma/schema.prisma`**

```prisma
model GalleryAlbum {
  id          String         @id @default(cuid())
  title       String
  slug        String         @unique
  description String?
  coverImage  String?
  eventDate   String?
  location    String?
  order       Int            @default(0)
  isPublic    Boolean        @default(true)
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  photos      GalleryPhoto[]

  @@index([isPublic, order])
}

model GalleryPhoto {
  id        String       @id @default(cuid())
  albumId   String
  url       String
  r2Key     String
  alt       String?
  caption   String?
  order     Int          @default(0)
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt
  album     GalleryAlbum @relation(fields: [albumId], references: [id], onDelete: Cascade)

  @@index([albumId, order])
}
```

- [ ] **Criar e aplicar a migration**

```bash
npx prisma migrate dev --name add_gallery
```

Esperado:
```
✔ Generated Prisma Client (...)
The following migration(s) have been applied: .../add_gallery/migration.sql
```

- [ ] **Regenerar o Prisma Client**

```bash
npx prisma generate
```

- [ ] **Verificar que `PrismaClient` reconhece os novos modelos**

```bash
npx tsc --noEmit 2>&1 | head -10
```

Esperado: sem erros relacionados a `galleryAlbum` ou `galleryPhoto`.

- [ ] **Commit**

```bash
git add prisma/schema.prisma prisma/migrations/
git commit -m "feat: add GalleryAlbum and GalleryPhoto to Prisma schema"
```

---

## Task 9: Camada de dados pública da galeria

**Files:**
- Create: `app/galeria-m2/_lib/gallery.ts`

- [ ] **Criar `app/galeria-m2/_lib/gallery.ts`**

Esse arquivo espelha a interface de `data/gallery.ts` para que os componentes existentes funcionem sem alteração:

```typescript
import { prisma } from "@/lib/server/db";
import type { AlbumPhoto, GalleryAlbum } from "@/data/gallery";

const DEFAULT_COVER = "/imagens/office/fachada_m2.webp";

function mapAlbum(album: {
  slug: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  eventDate: string | null;
  location: string | null;
}): GalleryAlbum {
  return {
    slug: album.slug,
    title: album.title,
    description: album.description ?? "",
    coverImage: album.coverImage ?? DEFAULT_COVER,
    eventDate: album.eventDate ?? "",
    location: album.location ?? "",
    imageFolder: "",
  };
}

export async function getAllPublicAlbums(): Promise<GalleryAlbum[]> {
  const albums = await prisma.galleryAlbum.findMany({
    where: { isPublic: true },
    orderBy: { order: "asc" },
  });

  return albums.map(mapAlbum);
}

export async function getPublicAlbumBySlug(
  slug: string,
): Promise<{ album: GalleryAlbum; photos: AlbumPhoto[] } | null> {
  const album = await prisma.galleryAlbum.findFirst({
    where: { slug, isPublic: true },
    include: {
      photos: { orderBy: { order: "asc" } },
    },
  });

  if (!album) return null;

  const photos: AlbumPhoto[] = album.photos.map((photo, index) => ({
    src: photo.url,
    alt: photo.alt ?? `${album.title} — foto ${index + 1}`,
    caption: photo.caption ?? undefined,
  }));

  return { album: mapAlbum(album), photos };
}

export async function getOtherPublicAlbums(
  excludeSlug: string,
  limit = 3,
): Promise<GalleryAlbum[]> {
  const albums = await prisma.galleryAlbum.findMany({
    where: { isPublic: true, slug: { not: excludeSlug } },
    orderBy: { order: "asc" },
    take: limit,
  });

  return albums.map(mapAlbum);
}
```

- [ ] **Verificar tipos**

```bash
npx tsc --noEmit 2>&1 | grep "galeria-m2/_lib"
```

Esperado: nenhuma saída (sem erros).

- [ ] **Commit**

```bash
git add app/galeria-m2/_lib/gallery.ts
git commit -m "feat: add gallery DB data layer mirroring static data/gallery.ts interface"
```

---

## Task 10: Páginas públicas da galeria lendo do banco

**Files:**
- Modify: `app/galeria-m2/page.tsx`
- Modify: `app/galeria-m2/[slug]/page.tsx`

- [ ] **Atualizar `app/galeria-m2/page.tsx`**

```tsx
import { HeroGaleria } from "./_components/hero-galeria";
import { NavigationMenu } from "@/components/layout/navigation-menu";
import { Footer } from "@/components/layout/Footer";
import { GalleryAlbumCard } from "./_components/GalleryAlbumCard";
import { getAllPublicAlbums } from "./_lib/gallery";
import { SlideIn } from "@/components/animations/SlideIn";

export const metadata = {
  title: "Galeria - M2 Inteligência Tributária",
  description: "Conheça os bastidores, nossa cultura e estrutura através da Galeria M2.",
};

export default async function GaleriaPage() {
  const albums = await getAllPublicAlbums();

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <NavigationMenu />
      <HeroGaleria />

      <section className="w-full px-4 md:px-6 lg:px-8 py-16 md:py-20 bg-white">
        <div className="mx-auto max-w-6xl">
          <SlideIn from="bottom" duration={900} distance={60}>
            <div className="mb-10 text-center">
              <h2 className="mt-3 text-4xl md:text-3xl font-extrabold text-gold-gradient">
                ÁLBUNS M2
              </h2>
              <p className="mt-3 text-sm md:text-base text-zinc-600">
                Selecione um álbum para explorar nossos momentos e bastidores.
              </p>
            </div>
          </SlideIn>

          {albums.length === 0 ? (
            <p className="mt-8 text-center text-zinc-500">
              Nenhum álbum publicado no momento.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album, index) => (
                <SlideIn
                  key={album.slug}
                  from="bottom"
                  delay={index * 150}
                  duration={900}
                  distance={60}
                  className="h-full"
                >
                  <GalleryAlbumCard album={album} />
                </SlideIn>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
```

- [ ] **Atualizar `app/galeria-m2/[slug]/page.tsx`**

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NavigationMenu } from "@/components/layout/navigation-menu";
import { Footer } from "@/components/layout/Footer";
import { AlbumPhotoGrid } from "../_components/album-photo-grid";
import { HeroAlbum } from "../_components/hero-album";
import { AlbumRelatedAlbums } from "../_components/AlbumRelatedAlbums";
import { getPublicAlbumBySlug, getOtherPublicAlbums } from "../_lib/gallery";

interface AlbumPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AlbumPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublicAlbumBySlug(slug);
  if (!result) return { title: "Album não encontrado | M2" };
  return {
    title: `${result.album.title} | Galeria M2`,
    description: result.album.description,
  };
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { slug } = await params;
  const result = await getPublicAlbumBySlug(slug);
  if (!result) notFound();

  const { album, photos } = result;
  const otherAlbums = await getOtherPublicAlbums(slug, 3);

  return (
    <main className="flex min-h-screen flex-col bg-[#05090c]">
      <NavigationMenu />
      <HeroAlbum album={album} />
      <section className="w-full px-4 pb-24 md:px-8">
        <div className="mx-auto max-w-6xl pt-12 md:pt-16">
          <AlbumPhotoGrid photos={photos} />
        </div>
      </section>
      <AlbumRelatedAlbums albums={otherAlbums} />
      <Footer />
    </main>
  );
}
```

- [ ] **Verificar build**

```bash
npx tsc --noEmit 2>&1 | grep "galeria-m2"
```

Esperado: sem erros.

- [ ] **Testar**: se não houver álbuns no banco ainda, `/galeria-m2` deve mostrar "Nenhum álbum publicado no momento." (sem crash).

- [ ] **Commit**

```bash
git add app/galeria-m2/page.tsx app/galeria-m2/[slug]/page.tsx
git commit -m "feat: connect public gallery pages to database instead of static data"
```

---

## Task 11: API Admin — álbuns da galeria

**Files:**
- Create: `app/api/admin/gallery/albums/route.ts`
- Create: `app/api/admin/gallery/albums/[id]/route.ts`

- [ ] **Criar `app/api/admin/gallery/albums/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminFromRequest } from "@/lib/server/auth/guards";
import { prisma } from "@/lib/server/db";
import { validateCsrf } from "@/lib/server/security/csrf";

const createAlbumSchema = z.object({
  title: z.string().min(1).max(120),
  slug: z.string().min(1).max(120),
  description: z.string().max(500).optional(),
  eventDate: z.string().max(50).optional(),
  location: z.string().max(120).optional(),
  isPublic: z.boolean().default(true),
  order: z.number().int().default(0),
});

export async function GET(req: Request) {
  const guard = await requireAdminFromRequest(req);
  if (!guard.ok) return guard.response;

  const albums = await prisma.galleryAlbum.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { photos: true } } },
  });

  return NextResponse.json({ items: albums });
}

export async function POST(req: Request) {
  if (!validateCsrf(req)) {
    return NextResponse.json({ message: "CSRF invalido" }, { status: 403 });
  }

  const guard = await requireAdminFromRequest(req);
  if (!guard.ok) return guard.response;

  const rawBody = await req.json().catch(() => null);
  const parsed = createAlbumSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ message: "Payload invalido" }, { status: 400 });
  }

  try {
    const album = await prisma.galleryAlbum.create({ data: parsed.data });
    return NextResponse.json(album, { status: 201 });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json({ message: "Slug ja em uso" }, { status: 409 });
    }
    throw error;
  }
}

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}
```

- [ ] **Criar `app/api/admin/gallery/albums/[id]/route.ts`**

```typescript
import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminFromRequest } from "@/lib/server/auth/guards";
import { prisma } from "@/lib/server/db";
import { validateCsrf } from "@/lib/server/security/csrf";
import { deleteFromR2 } from "@/lib/server/storage/r2";

const patchAlbumSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  slug: z.string().min(1).max(120).optional(),
  description: z.string().max(500).optional(),
  eventDate: z.string().max(50).optional(),
  location: z.string().max(120).optional(),
  isPublic: z.boolean().optional(),
  order: z.number().int().optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminFromRequest(req);
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const album = await prisma.galleryAlbum.findUnique({
    where: { id },
    include: { photos: { orderBy: { order: "asc" } } },
  });

  if (!album) {
    return NextResponse.json({ message: "Album nao encontrado" }, { status: 404 });
  }

  return NextResponse.json(album);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!validateCsrf(req)) {
    return NextResponse.json({ message: "CSRF invalido" }, { status: 403 });
  }

  const guard = await requireAdminFromRequest(req);
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const rawBody = await req.json().catch(() => null);
  const parsed = patchAlbumSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ message: "Payload invalido" }, { status: 400 });
  }

  try {
    const album = await prisma.galleryAlbum.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json(album);
  } catch {
    return NextResponse.json({ message: "Album nao encontrado" }, { status: 404 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!validateCsrf(req)) {
    return NextResponse.json({ message: "CSRF invalido" }, { status: 403 });
  }

  const guard = await requireAdminFromRequest(req);
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const photos = await prisma.galleryPhoto.findMany({
    where: { albumId: id },
    select: { r2Key: true },
  });

  await Promise.all(photos.map((photo) => deleteFromR2(photo.r2Key)));

  await prisma.galleryAlbum.delete({ where: { id } });

  return new Response(null, { status: 204 });
}
```

- [ ] **Verificar tipos**

```bash
npx tsc --noEmit 2>&1 | grep "gallery/albums"
```

Esperado: sem saída.

- [ ] **Commit**

```bash
git add app/api/admin/gallery/
git commit -m "feat: add admin gallery albums API (GET, POST, PATCH, DELETE)"
```

---

## Task 12: API Admin — fotos da galeria

**Files:**
- Create: `app/api/admin/gallery/albums/[id]/photos/route.ts`
- Create: `app/api/admin/gallery/photos/[id]/route.ts`

- [ ] **Criar `app/api/admin/gallery/albums/[id]/photos/route.ts`**

```typescript
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { requireAdminFromRequest } from "@/lib/server/auth/guards";
import { prisma } from "@/lib/server/db";
import { validateCsrf } from "@/lib/server/security/csrf";
import { uploadToR2 } from "@/lib/server/storage/r2";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_FILES = 5;

const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!validateCsrf(req)) {
    return NextResponse.json({ message: "CSRF invalido" }, { status: 403 });
  }

  const guard = await requireAdminFromRequest(req);
  if (!guard.ok) return guard.response;

  const { id: albumId } = await params;

  const album = await prisma.galleryAlbum.findUnique({ where: { id: albumId } });
  if (!album) {
    return NextResponse.json({ message: "Album nao encontrado" }, { status: 404 });
  }

  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ message: "Payload invalido" }, { status: 400 });
  }

  const files = formData.getAll("files").filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ message: "Nenhum arquivo enviado" }, { status: 400 });
  }

  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { message: `Envie no maximo ${MAX_FILES} fotos por vez` },
      { status: 400 },
    );
  }

  const maxOrderResult = await prisma.galleryPhoto.aggregate({
    _max: { order: true },
    where: { albumId },
  });
  let nextOrder = (maxOrderResult._max.order ?? -1) + 1;

  const created: { id: string; url: string; order: number }[] = [];

  for (const file of files) {
    const ext = MIME_EXTENSIONS[file.type];
    if (!ext) {
      return NextResponse.json(
        { message: "Formato invalido. Use JPG, PNG ou WEBP." },
        { status: 400 },
      );
    }

    if (file.size <= 0 || file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { message: "Arquivo excede o limite de 5MB." },
        { status: 400 },
      );
    }

    const key = `gallery/${albumId}/${Date.now()}-${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadToR2(buffer, key, file.type);

    const photo = await prisma.galleryPhoto.create({
      data: { albumId, url, r2Key: key, order: nextOrder },
      select: { id: true, url: true, order: true },
    });

    created.push(photo);
    nextOrder++;
  }

  return NextResponse.json({ items: created }, { status: 201 });
}
```

- [ ] **Criar `app/api/admin/gallery/photos/[id]/route.ts`**

```typescript
import { NextResponse } from "next/server";

import { requireAdminFromRequest } from "@/lib/server/auth/guards";
import { prisma } from "@/lib/server/db";
import { validateCsrf } from "@/lib/server/security/csrf";
import { deleteFromR2 } from "@/lib/server/storage/r2";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!validateCsrf(req)) {
    return NextResponse.json({ message: "CSRF invalido" }, { status: 403 });
  }

  const guard = await requireAdminFromRequest(req);
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const photo = await prisma.galleryPhoto.findUnique({
    where: { id },
    select: { r2Key: true },
  });

  if (!photo) {
    return NextResponse.json({ message: "Foto nao encontrada" }, { status: 404 });
  }

  await deleteFromR2(photo.r2Key);
  await prisma.galleryPhoto.delete({ where: { id } });

  return new Response(null, { status: 204 });
}
```

- [ ] **Verificar tipos**

```bash
npx tsc --noEmit 2>&1 | grep "gallery/photos\|gallery/albums.*photos"
```

Esperado: sem saída.

- [ ] **Commit**

```bash
git add app/api/admin/gallery/
git commit -m "feat: add admin gallery photos API (upload to R2 and delete)"
```

---

## Task 13: Admin UI — lista de álbuns

**Files:**
- Create: `app/admin/gallery/page.tsx`

- [ ] **Criar `app/admin/gallery/page.tsx`**

```tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminShell } from "../_components/AdminShell";

type AdminAlbum = {
  id: string;
  title: string;
  slug: string;
  isPublic: boolean;
  order: number;
  _count: { photos: number };
};

async function getCsrfToken() {
  const res = await fetch("/api/auth/csrf", { credentials: "include", cache: "no-store" });
  if (!res.ok) return "";
  const data = (await res.json()) as { csrfToken?: string };
  return data.csrfToken ?? "";
}

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState<AdminAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadAlbums() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/gallery/albums");
    if (!res.ok) {
      setError("Não foi possível carregar os álbuns.");
      setLoading(false);
      return;
    }
    const data = (await res.json()) as { items: AdminAlbum[] };
    setAlbums(data.items ?? []);
    setLoading(false);
  }

  useEffect(() => {
    void loadAlbums();
  }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Excluir o álbum "${title}" e todas as suas fotos? Esta ação não pode ser desfeita.`)) {
      return;
    }

    const csrfToken = await getCsrfToken();
    const res = await fetch(`/api/admin/gallery/albums/${id}`, {
      method: "DELETE",
      headers: { "x-csrf-token": csrfToken },
    });

    if (!res.ok && res.status !== 204) {
      setError("Falha ao excluir álbum.");
      return;
    }

    await loadAlbums();
  }

  return (
    <AdminShell
      title="Galeria"
      subtitle="Gerencie álbuns e fotos."
      primaryAction={{ label: "Novo álbum", href: "/admin/gallery/novo" }}
    >
      <section className="rounded-2xl border border-zinc-800 bg-[#060b12] p-4 md:p-5">
        <h2 className="text-lg font-bold text-white">Álbuns</h2>

        {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
        {loading ? <p className="mt-4 text-sm text-zinc-400">Carregando...</p> : null}

        {!loading && albums.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-400">Nenhum álbum criado ainda.</p>
        ) : null}

        {!loading && albums.length > 0 ? (
          <div className="mt-4 space-y-3">
            {albums.map((album) => (
              <article
                key={album.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900/70 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-white">{album.title}</p>
                    <p className="text-xs text-zinc-400">
                      /{album.slug} ·{" "}
                      {album._count.photos} foto{album._count.photos !== 1 ? "s" : ""} ·{" "}
                      {album.isPublic ? "Público" : "Oculto"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/gallery/${album.id}`}
                      className="inline-flex h-8 items-center rounded-md border border-[#c9a84c]/40 bg-[#c9a84c]/15 px-3 text-xs font-semibold text-[#f2c40f]"
                    >
                      Fotos
                    </Link>
                    <button
                      type="button"
                      onClick={() => void handleDelete(album.id, album.title)}
                      className="h-8 rounded-md border border-red-900 bg-red-950/60 px-3 text-xs font-semibold text-red-200"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </AdminShell>
  );
}
```

- [ ] **Testar**: acessar `/admin/gallery`. Deve mostrar lista vazia (sem crash) com o botão "Novo álbum".

- [ ] **Commit**

```bash
git add app/admin/gallery/page.tsx
git commit -m "feat: add admin gallery album list page"
```

---

## Task 14: Admin UI — criação de álbum

**Files:**
- Create: `app/admin/gallery/novo/page.tsx`

- [ ] **Criar `app/admin/gallery/novo/page.tsx`**

```tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminShell } from "../../_components/AdminShell";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function getCsrfToken() {
  const res = await fetch("/api/auth/csrf", { credentials: "include", cache: "no-store" });
  if (!res.ok) return "";
  const data = (await res.json()) as { csrfToken?: string };
  return data.csrfToken ?? "";
}

export default function NewAlbumPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [manualSlug, setManualSlug] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!manualSlug) setSlug(slugify(value));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);

    const csrfToken = await getCsrfToken();
    if (!csrfToken) {
      setSaving(false);
      setError("Falha de CSRF. Recarregue a página.");
      return;
    }

    const res = await fetch("/api/admin/gallery/albums", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken,
      },
      body: JSON.stringify({
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
        eventDate: eventDate.trim() || undefined,
        location: location.trim() || undefined,
        isPublic,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { message?: string } | null;
      setError(body?.message ?? "Falha ao criar álbum.");
      return;
    }

    router.push("/admin/gallery");
  }

  return (
    <AdminShell title="Novo álbum">
      <section className="rounded-2xl border border-zinc-800 bg-[#060b12] p-4 md:p-5">
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4 max-w-lg">
          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-200" htmlFor="title">
              Título *
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none focus:border-[#c9a84c]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-200" htmlFor="slug">
              Slug *
            </label>
            <input
              id="slug"
              value={slug}
              onChange={(e) => {
                setManualSlug(true);
                setSlug(slugify(e.target.value));
              }}
              required
              className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none focus:border-[#c9a84c]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-zinc-200" htmlFor="description">
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-20 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-[#c9a84c]"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-200" htmlFor="eventDate">
                Data do evento
              </label>
              <input
                id="eventDate"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                placeholder="ex: Janeiro 2025"
                className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none focus:border-[#c9a84c]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-zinc-200" htmlFor="location">
                Localização
              </label>
              <input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="ex: Fortaleza, CE"
                className="h-10 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-zinc-100 outline-none focus:border-[#c9a84c]"
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-200">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="h-4 w-4 rounded"
            />
            Álbum público (visível no site)
          </label>

          {error ? <p className="text-sm text-red-400">{error}</p> : null}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center justify-center rounded-md bg-[#f2c40f] px-6 text-sm font-semibold text-[#12151b] disabled:opacity-60"
            >
              {saving ? "Salvando..." : "Criar álbum"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/gallery")}
              className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-700 px-4 text-sm font-medium text-zinc-300 hover:bg-zinc-800"
            >
              Cancelar
            </button>
          </div>
        </form>
      </section>
    </AdminShell>
  );
}
```

- [ ] **Testar**: em `/admin/gallery`, clicar em "Novo álbum", preencher o formulário com um título, submeter. Deve redirecionar para `/admin/gallery` com o álbum na lista.

- [ ] **Commit**

```bash
git add app/admin/gallery/novo/page.tsx
git commit -m "feat: add admin gallery new album form"
```

---

## Task 15: Admin UI — gerenciamento de fotos do álbum

**Files:**
- Create: `app/admin/gallery/[id]/page.tsx`

- [ ] **Criar `app/admin/gallery/[id]/page.tsx`**

```tsx
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AdminShell } from "../../_components/AdminShell";

type AdminPhoto = {
  id: string;
  url: string;
  alt: string | null;
  caption: string | null;
  order: number;
};

type AdminAlbumDetail = {
  id: string;
  title: string;
  slug: string;
  isPublic: boolean;
  photos: AdminPhoto[];
};

async function getCsrfToken() {
  const res = await fetch("/api/auth/csrf", { credentials: "include", cache: "no-store" });
  if (!res.ok) return "";
  const data = (await res.json()) as { csrfToken?: string };
  return data.csrfToken ?? "";
}

export default function AdminGalleryAlbumPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [album, setAlbum] = useState<AdminAlbumDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function loadAlbum() {
    setLoading(true);
    const res = await fetch(`/api/admin/gallery/albums/${id}`);
    if (!res.ok) {
      setLoading(false);
      return;
    }
    const data = (await res.json()) as AdminAlbumDetail;
    setAlbum(data);
    setLoading(false);
  }

  useEffect(() => {
    void loadAlbum();
  }, [id]);

  async function handleUpload() {
    const files = fileInputRef.current?.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);
    setSuccess(null);

    const csrfToken = await getCsrfToken();
    if (!csrfToken) {
      setUploading(false);
      setError("Falha de CSRF. Recarregue a página.");
      return;
    }

    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append("files", file));

    const res = await fetch(`/api/admin/gallery/albums/${id}/photos`, {
      method: "POST",
      headers: { "x-csrf-token": csrfToken },
      body: formData,
    });

    setUploading(false);

    if (!res.ok) {
      const body = (await res.json().catch(() => null)) as { message?: string } | null;
      setError(body?.message ?? "Falha no upload.");
      return;
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
    setSuccess("Fotos enviadas com sucesso.");
    await loadAlbum();
  }

  async function handleDeletePhoto(photoId: string) {
    if (!confirm("Excluir esta foto permanentemente?")) return;

    const csrfToken = await getCsrfToken();
    const res = await fetch(`/api/admin/gallery/photos/${photoId}`, {
      method: "DELETE",
      headers: { "x-csrf-token": csrfToken },
    });

    if (!res.ok && res.status !== 204) {
      setError("Falha ao excluir foto.");
      return;
    }

    await loadAlbum();
  }

  if (loading) {
    return (
      <AdminShell title="Álbum">
        <p className="text-sm text-zinc-400">Carregando...</p>
      </AdminShell>
    );
  }

  if (!album) {
    return (
      <AdminShell title="Álbum não encontrado">
        <p className="text-sm text-zinc-400">
          Este álbum não existe ou foi excluído.{" "}
          <button
            type="button"
            onClick={() => router.push("/admin/gallery")}
            className="text-[#f2c40f] underline"
          >
            Voltar para galeria
          </button>
        </p>
      </AdminShell>
    );
  }

  return (
    <AdminShell
      title={album.title}
      subtitle={`${album.photos.length} foto${album.photos.length !== 1 ? "s" : ""} · ${album.isPublic ? "Público" : "Oculto"}`}
    >
      <section className="rounded-2xl border border-zinc-800 bg-[#060b12] p-4 md:p-5">
        <h2 className="text-lg font-bold text-white">Enviar fotos</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Máximo 5 arquivos por vez, 5MB cada (JPG, PNG, WEBP).
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="text-sm text-zinc-300 file:mr-3 file:rounded file:border-0 file:bg-zinc-800 file:px-3 file:py-1.5 file:text-xs file:text-zinc-200 file:cursor-pointer"
          />
          <button
            type="button"
            onClick={() => void handleUpload()}
            disabled={uploading}
            className="inline-flex h-9 items-center justify-center rounded-md bg-[#f2c40f] px-5 text-sm font-semibold text-[#12151b] disabled:opacity-60"
          >
            {uploading ? "Enviando..." : "Enviar fotos"}
          </button>
        </div>
        {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
        {success ? <p className="mt-3 text-sm text-emerald-400">{success}</p> : null}
      </section>

      <section className="rounded-2xl border border-zinc-800 bg-[#060b12] p-4 md:p-5">
        <h2 className="text-lg font-bold text-white">
          Fotos ({album.photos.length})
        </h2>

        {album.photos.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-400">
            Nenhuma foto neste álbum. Use o formulário acima para enviar.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {album.photos.map((photo) => (
              <div key={photo.id} className="group relative">
                <div className="aspect-square overflow-hidden rounded-lg border border-zinc-700 bg-zinc-800">
                  <Image
                    src={photo.url}
                    alt={photo.alt ?? photo.caption ?? "Foto do álbum"}
                    width={200}
                    height={200}
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => void handleDeletePhoto(photo.id)}
                  className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-900/90 text-sm font-bold text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Excluir foto"
                >
                  ×
                </button>
                {photo.caption ? (
                  <p className="mt-1 truncate text-xs text-zinc-400">{photo.caption}</p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </AdminShell>
  );
}
```

- [ ] **Testar fluxo completo**:
  1. Em `/admin/gallery`, clicar em "Fotos" de um álbum criado na Task 14
  2. Selecionar 1-3 imagens JPG/PNG/WEBP (< 5MB cada)
  3. Clicar "Enviar fotos" — deve mostrar "Fotos enviadas com sucesso." e as thumbnails aparecem no grid
  4. Clicar no `×` de uma thumbnail — deve excluir a foto do grid
  5. Acessar `/galeria-m2` — o álbum deve aparecer (se `isPublic = true`)
  6. Acessar `/galeria-m2/<slug>` — as fotos devem aparecer no grid com lightbox funcionando

- [ ] **Commit final**

```bash
git add app/admin/gallery/[id]/page.tsx
git commit -m "feat: add admin gallery photo management page"
```

---

## Checklist de validação final

Após concluir todas as tasks:

- [ ] `npx tsc --noEmit` sem erros
- [ ] `npm run build` sem erros
- [ ] Login de admin funciona (`/admin/login`)
- [ ] Logout funciona (botão "Sair" no admin)
- [ ] Upload de capa de artigo retorna URL R2 (começa com `CLOUDFLARE_R2_PUBLIC_URL`)
- [ ] Blog `/blog/[slug]` renderiza Markdown corretamente para artigo com conteúdo Markdown
- [ ] Blog `/blog` não exibe seção de newsletter
- [ ] Admin `/admin/gallery` lista álbuns e permite criar/excluir
- [ ] Upload de fotos no admin vai para R2 e aparece no grid
- [ ] Galeria pública `/galeria-m2` exibe álbuns do banco
- [ ] Galeria pública `/galeria-m2/[slug]` exibe fotos do banco com lightbox
