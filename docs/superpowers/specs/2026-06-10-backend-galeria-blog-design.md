# Design: Backend completo + Galeria + Blog Markdown

**Data:** 2026-06-10 (revisado após git pull)
**Abordagem:** B — feature a feature, completa do início ao fim
**Stack:** Next.js 16 App Router · Prisma + PostgreSQL · Cloudflare R2 · react-markdown

---

## Estado atual (pós git pull)

| Área | Status |
|------|--------|
| Auth (login/logout/refresh/CSRF/middleware) | ✅ Completo |
| Formulário de leads (frontend + API + DB) | ✅ Completo |
| Newsletter (API + DB) | ✅ — mas UI será **removida** do blog |
| Blog público (listagem, detalhe, author, share, relacionados) | ✅ Completo |
| `ArticleBody` (HTML e texto puro) | ✅ — Markdown ainda falta |
| Galeria pública `/galeria-m2/` (grid + lightbox + álbuns) | ✅ Completo — mas **100% estático** (`data/gallery.ts`) |
| Admin posts/categorias | ✅ Completo |
| Upload de capa | ⚠️ Usa disco local — não sobrevive restart de container |
| Admin galeria | ❌ Ausente |
| Admin logout | ❌ Ausente |
| Seed admin | ❌ Ausente |

---

## Feature 1 — Infraestrutura base

### 1.1 Remover Newsletter do frontend

Único arquivo a modificar: `app/blog/page.tsx` — remover a importação e uso de `<BlogNewsletterSection />`.  
API `/api/newsletter/subscribe` e modelo `NewsletterSubscriber` permanecem intactos (sem migration).

### 1.2 Cloudflare R2

**Novas variáveis de ambiente** (`.env` e `.env.example`):
```
CLOUDFLARE_R2_ACCOUNT_ID=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET_NAME=
CLOUDFLARE_R2_PUBLIC_URL=   # ex: https://pub-xxx.r2.dev ou domínio próprio
```

**Novo módulo** `lib/server/storage/r2.ts`:
- `uploadToR2(buffer: Buffer, key: string, mimeType: string): Promise<string>` — retorna URL pública
- `deleteFromR2(key: string): Promise<void>`
- SDK: `@aws-sdk/client-s3` com endpoint `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`
- Key pattern: `<prefixo>/<timestamp>-<uuid>.<ext>` (prefixo = `covers` ou `gallery`)

**`lib/server/env.ts`** — adiciona as 5 variáveis R2 ao `envSchema`.

**`app/api/admin/uploads/cover/route.ts`**:
- Mantém interface idêntica (mesmo multipart, mesmo JSON `{ url }`)
- Remove `fs/promises`, `path`, `UPLOAD_DIR`
- Chama `uploadToR2(buffer, key, mimeType)`

### 1.3 Seed do primeiro admin

**Instalar:** `tsx` como devDependency.

**`prisma/seed.ts`**:
- Lê `ADMIN_BOOTSTRAP_EMAIL` + `ADMIN_BOOTSTRAP_PASSWORD` do `process.env`; falha com mensagem clara se ausentes
- `bcryptjs` hash (salt rounds 12)
- `prisma.user.upsert` — idempotente

**`package.json`**:
```json
"prisma": { "seed": "tsx prisma/seed.ts" }
```

### 1.4 Logout no AdminShell

**`app/admin/_components/AdminShell.tsx`** — botão "Sair" no final do sidebar:
1. `GET /api/auth/csrf` → obtém token
2. `POST /api/auth/logout` com header `x-csrf-token`
3. `router.push("/admin/login")`

---

## Feature 2 — Blog: Markdown no ArticleBody

### Estado atual

`ArticleBody` (`app/blog/_components/ArticleBody.tsx`) tem dois caminhos:
- Se detectar HTML → `dangerouslySetInnerHTML` (funcional, risco XSS baixo pois só admins escrevem)
- Caso contrário → split por `\n\n` em parágrafos (sem formatação)

Markdown não é suportado.

### Mudança

**Instalar:** `react-markdown` `remark-gfm`

**`app/blog/_components/ArticleBody.tsx`** — adicionar terceiro caminho:
- Detectar se não é HTML e contém sintaxe Markdown (presença de `#`, `**`, `- `, `[`, etc.)
- Renderizar com `<ReactMarkdown remarkPlugins={[remarkGfm]}>`
- Manter os dois caminhos existentes para retrocompatibilidade com conteúdo já salvo

**`app/admin/_components/PostEditorForm.tsx`** — atualizar o bloco de preview:
- Substituir `<div className="whitespace-pre-wrap">` por `<ReactMarkdown remarkPlugins={[remarkGfm]}>`
- Sem mudança na API ou schema

---

## Feature 3 — Galeria: conectar ao banco

### Contexto

O frontend público (`/galeria-m2/` e `/galeria-m2/[slug]`) já está completo e funcional. Os componentes `AlbumPhotoGrid`, `AlbumPhotoLightbox`, `GalleryAlbumCard`, `AlbumRelatedAlbums` existem e funcionam bem. O único problema é que os dados vêm de `data/gallery.ts` (estático hardcoded).

O objetivo é:
1. Criar modelos no banco que espelham os tipos de `data/gallery.ts`
2. Criar API admin + UI para gerenciar álbuns e fotos
3. Atualizar as páginas públicas para ler do banco em vez do arquivo estático

### 3.1 Schema Prisma

Dois novos modelos:

```prisma
model GalleryAlbum {
  id          String         @id @default(cuid())
  title       String
  slug        String         @unique
  description String?
  coverImage  String?        // URL pública (R2 ou local)
  eventDate   String?        // ex: "2024" ou "Janeiro 2025"
  location    String?        // ex: "Fortaleza, CE"
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
  url       String       // URL pública no R2
  r2Key     String       // chave no R2, necessária para deletar
  alt       String?
  caption   String?
  order     Int          @default(0)
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt
  album     GalleryAlbum @relation(fields: [albumId], references: [id], onDelete: Cascade)

  @@index([albumId, order])
}
```

Migration: `npx prisma migrate dev --name add_gallery`

### 3.2 Camada de dados pública

**`app/galeria-m2/_lib/gallery.ts`** (novo arquivo):
- `getAllPublicAlbums(): Promise<GalleryAlbum[]>` — equivalente a `getAllAlbums()` de `data/gallery.ts`
- `getPublicAlbumBySlug(slug): Promise<GalleryAlbum & { photos: GalleryPhoto[] } | null>`
- `getOtherPublicAlbums(excludeSlug, limit): Promise<GalleryAlbum[]>`

Esses tipos são mapeados para o formato esperado pelos componentes existentes.

### 3.3 Atualizar páginas públicas

**`app/galeria-m2/page.tsx`**:
- Troca `getAllAlbums()` por `getAllPublicAlbums()` da nova lib
- Adapta o shape dos dados para o que `GalleryAlbumCard` espera

**`app/galeria-m2/[slug]/page.tsx`**:
- Troca `getAlbumBySlug` + `getAlbumPhotos` pela query do banco
- `AlbumPhotoGrid` recebe `AlbumPhoto[]` — mapear `GalleryPhoto` para esse formato

**`data/gallery.ts`** — mantido como fallback durante a transição; pode ser removido após confirmar que o banco está populado.

### 3.4 API Admin (JWT + CSRF obrigatórios)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/admin/gallery/albums` | Lista álbuns |
| POST | `/api/admin/gallery/albums` | Cria álbum |
| PATCH | `/api/admin/gallery/albums/[id]` | Edita álbum |
| DELETE | `/api/admin/gallery/albums/[id]` | Deleta todas as fotos do R2 → deleta álbum (cascade DB) |
| POST | `/api/admin/gallery/albums/[id]/photos` | Upload de foto(s) → R2 → cria `GalleryPhoto` |
| DELETE | `/api/admin/gallery/photos/[id]` | Remove do R2 + remove do DB |

Upload: max 5 arquivos por request, max 5MB cada, formatos jpg/png/webp.

### 3.5 Admin UI

**`app/admin/_components/AdminShell.tsx`** — adiciona `{ href: "/admin/gallery", label: "Galeria" }` ao `navItems`.

**`app/admin/gallery/page.tsx`**:
- Lista álbuns (nome, slug, `isPublic`, contagem de fotos)
- Botões: "Fotos" (link para `/admin/gallery/[id]`), "Excluir"

**`app/admin/gallery/novo/page.tsx`**:
- Formulário: título, slug (auto-gerado), descrição, data do evento, localização, visibilidade
- POST → `/api/admin/gallery/albums` → redireciona para `/admin/gallery`

**`app/admin/gallery/[id]/page.tsx`**:
- Header com metadados do álbum + botão editar (PATCH inline)
- Grid de fotos com thumbnail + botão excluir
- Input `<file multiple>` para upload (max 5 por vez) com feedback de progresso

---

## Dependências novas

| Pacote | Tipo | Motivo |
|--------|------|--------|
| `@aws-sdk/client-s3` | dependency | Upload/delete no R2 via API S3-compatível |
| `react-markdown` | dependency | Renderizar Markdown no blog e no editor |
| `remark-gfm` | dependency | Tabelas, listas de tarefas, strikethrough |
| `tsx` | devDependency | Rodar `prisma/seed.ts` sem configuração extra |

---

## Variáveis de ambiente — estado final

```
DATABASE_URL=
DIRECT_URL=
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=30d
ADMIN_BOOTSTRAP_EMAIL=
ADMIN_BOOTSTRAP_PASSWORD=
CLOUDFLARE_R2_ACCOUNT_ID=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET_NAME=
CLOUDFLARE_R2_PUBLIC_URL=
```

---

## Fora de escopo

- Editor rich text (WYSIWYG) — conteúdo fica como Markdown em `<textarea>`
- Sanitização HTML de `ArticleBody` — risco aceitável pois só admins escrevem
- Paginação de álbuns/fotos
- Reordenação drag-and-drop
- Processamento/resize de imagens
