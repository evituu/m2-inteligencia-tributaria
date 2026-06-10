# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Next.js)
npm run build        # Production build
npm run lint         # Run ESLint
npx prisma migrate dev --name <name>   # Create and apply a migration
npx prisma generate                    # Regenerate Prisma client after schema changes
npx prisma db seed                     # Create first admin user (reads ADMIN_BOOTSTRAP_* env vars)
npx prisma studio                      # Open Prisma GUI
```

No test runner is wired to `npm test`. Vitest and supertest are installed but not yet configured.

## Environment Variables

Copy `.env.example` to `.env` and fill in:

- `DATABASE_URL` — Supabase pooler connection string (used by Prisma at runtime)
- `DIRECT_URL` — Direct Supabase connection (used by Prisma for migrations)
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — secrets for signing JWTs (min 32 chars)
- `JWT_ACCESS_TTL` / `JWT_REFRESH_TTL` — e.g. `15m` / `30d`
- `ADMIN_BOOTSTRAP_EMAIL` / `ADMIN_BOOTSTRAP_PASSWORD` — seed credentials for first admin user
- `CLOUDFLARE_R2_ACCOUNT_ID` / `CLOUDFLARE_R2_ACCESS_KEY_ID` / `CLOUDFLARE_R2_SECRET_ACCESS_KEY` — R2 credentials
- `CLOUDFLARE_R2_BUCKET_NAME` — R2 bucket name
- `CLOUDFLARE_R2_PUBLIC_URL` — Public base URL for R2 objects (e.g. `https://pub-xxx.r2.dev`)

## Architecture

### Tech Stack

Next.js 16 App Router · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (Radix UI) · Prisma + PostgreSQL (Supabase) · Cloudflare R2 (`@aws-sdk/client-s3`) · Zod · jose (JWT) · bcryptjs · react-markdown + remark-gfm

### Deployment

Docker Compose on Hostinger VPS, managed via EasyPanel. The app and DB run as containers — no local filesystem persistence. All image uploads go to Cloudflare R2.

### Directory Structure

```
app/
  page.tsx                  # Homepage (marketing sections)
  sobre/                    # About page
  servicos/                 # Services page
  blog/                     # Public blog (server components, reads DB via Prisma)
    [slug]/page.tsx         # Article detail with Markdown/HTML rendering
    _components/            # ArticleBody, ArticleShareButtons, ArticleRelatedPosts, etc.
    _lib/                   # articles.ts (Prisma queries), types.ts, categories.ts
  galeria-m2/               # Public gallery (server components)
    page.tsx                # Album grid
    [slug]/page.tsx         # Photo grid + lightbox
    _components/            # AlbumPhotoGrid, AlbumPhotoLightbox, GalleryAlbumCard, etc.
    _lib/                   # gallery.ts (Prisma queries, mirrors data/gallery.ts interface)
  admin/                    # Private CMS (JWT-protected)
    page.tsx                # Dashboard (post metrics)
    posts/                  # Post list, new post, edit post
    gallery/                # Album list, new album, album photo management
    login/page.tsx
    _components/            # AdminShell (sidebar nav), PostEditorForm
  api/
    auth/                   # login, logout, me, csrf, refresh
    admin/                  # posts, categories, uploads/cover, gallery (albums + photos)
    blog/                   # public read endpoints
    leads/                  # contact form submissions
    newsletter/             # subscribe endpoint (UI removed, API kept)

components/
  ui/                       # shadcn/ui primitives (generated, rarely edited)
  home/                     # Homepage section components
  layout/                   # NavigationMenu, Footer
  animations/               # SlideIn, TypingText
  shared/                   # GoldText (SVG gradient text)

lib/server/                 # Server-only utilities — never import from client components
  db.ts                     # Prisma singleton (global guard for dev HMR)
  env.ts                    # Zod-validated env vars (DB, JWT, R2)
  storage/r2.ts             # uploadToR2(), deleteFromR2() — wraps @aws-sdk/client-s3
  auth/                     # jwt.ts, password.ts, session.ts, guards.ts
  security/                 # csrf.ts, rate-limit.ts
  validation/               # Zod schemas for leads and newsletter

data/
  gallery.ts                # Static gallery data (legacy — used as fallback, being replaced by DB)

prisma/
  schema.prisma             # Models: User, Session, Author, Category, Post, Lead,
                            #   NewsletterSubscriber, GalleryAlbum, GalleryPhoto
  seed.ts                   # Creates first admin user from ADMIN_BOOTSTRAP_* env vars
```

### Auth Flow

- Access token: `m2_access_token` (HttpOnly cookie, 15 min)
- Refresh token: `m2_refresh_token` (HttpOnly cookie, 30 days) — hashed and stored in `Session` table
- CSRF: double-submit cookie pattern — `m2_csrf_token` cookie must equal `x-csrf-token` header on every mutating request
- Admin guard: `requireAdminFromRequest()` in `lib/server/auth/guards.ts` — validates access token and enforces `role === "admin"`
- Middleware at `middleware.ts` protects all `/admin/*` and `/api/admin/*` routes; redirects to `/admin/login?next=<path>` for page routes, returns 401 JSON for API routes
- Rate limiting: in-memory, applied on `/api/auth/login`

### Image Storage (Cloudflare R2)

All uploaded images (blog covers and gallery photos) go to Cloudflare R2 via `lib/server/storage/r2.ts`. The module wraps `@aws-sdk/client-s3` against the R2 S3-compatible endpoint.

- Upload key pattern: `<prefix>/<timestamp>-<uuid>.<ext>` (prefix: `covers` or `gallery`)
- Public URL: `${CLOUDFLARE_R2_PUBLIC_URL}/<key>`
- `GalleryPhoto.r2Key` stores the key to enable deletion from R2

### Blog Content

Articles are stored as text in `Post.content`. `ArticleBody` supports three rendering modes detected at runtime:

1. HTML (contains `<tag>` pattern) → `dangerouslySetInnerHTML`
2. Markdown (contains `#`, `**`, `- `, etc.) → `react-markdown` + `remark-gfm`
3. Plain text → split by double newlines into paragraphs

`getArticleBySlug` returns `ArticleDetail` (includes `content` + `author`); list queries return `Article` (no `content` to avoid loading full body in listings).

### Gallery

The public gallery (`/galeria-m2/`) reads from `GalleryAlbum` and `GalleryPhoto` tables via `app/galeria-m2/_lib/gallery.ts`. Data shape mirrors the legacy `data/gallery.ts` types so existing components (`AlbumPhotoGrid`, `AlbumPhotoLightbox`, etc.) work without changes.

Admin manages albums and photos via `/admin/gallery/` UI backed by `/api/admin/gallery/*` routes.

### Admin CMS

`PostEditorForm` (`app/admin/_components/PostEditorForm.tsx`) handles:
- **Local autosave**: `localStorage` key `m2:post-editor:create` or `m2:post-editor:edit:<id>`
- **Remote autosave** (edit mode): PATCH after 1.8 s of inactivity
- **Unsaved-changes guard**: `beforeunload` event
- **Markdown preview**: live `react-markdown` render of the content field

### API Conventions

- All admin routes require access-token cookie (middleware) + CSRF header (`x-csrf-token`)
- Public routes (`/api/blog/*`, `/api/leads`, `/api/newsletter/subscribe`) have no auth
- Zod validates all request bodies; unrecognised shapes return 400
- Prisma unique constraint violations (P2002) return 409

### UI Conventions

- Font: Montserrat loaded locally from `public/fonte/` via `next/font/local`; CSS var `--font-montserrat`
- Gold gradient: SVG `<linearGradient id="gold-gradient">` defined once in `app/layout.tsx`; used by `<GoldText>` and `.text-gold-gradient` CSS class
- Dark theme (admin + article pages): zinc/slate scale; accent `#f2c40f`
- Light theme (homepage, gallery): white background
- Page sections: `app/<route>/_components/<SectionName>.tsx`
