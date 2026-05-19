# Backend + Blog + Cadastro em VPS Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Entregar backend funcional (auth JWT, leads, newsletter e blog dinâmico com admin) no projeto Next.js monolítico rodando na VPS.

**Architecture:** App Router com Route Handlers (`app/api/*`), domínio separado em `lib/server/*`, Prisma como camada de persistência e PostgreSQL local da VPS. Admin protegido por middleware + validação server-side com Zod em todos os endpoints mutáveis.

**Tech Stack:** Next.js 16, TypeScript, Prisma, PostgreSQL, Zod, JWT (`jose`), bcrypt/argon2, Vitest + Supertest.

---

## File Structure (alvo)

- Criar `prisma/schema.prisma`: modelos de dados (users, sessions, posts, categories, authors, leads, newsletter).
- Criar `prisma/migrations/*`: histórico de migrações.
- Criar `lib/server/db.ts`: singleton do PrismaClient.
- Criar `lib/server/env.ts`: validação de env com Zod.
- Criar `lib/server/auth/jwt.ts`: assinatura/verificação de tokens.
- Criar `lib/server/auth/password.ts`: hash e verify de senha.
- Criar `lib/server/auth/session.ts`: rotação/revogação de refresh token.
- Criar `lib/server/auth/guards.ts`: utilitários de autorização.
- Criar `lib/server/validation/*.ts`: schemas de entrada.
- Criar `app/api/auth/*/route.ts`: login/refresh/logout/me.
- Criar `app/api/leads/route.ts`: captação de lead.
- Criar `app/api/newsletter/subscribe/route.ts`: subscribe.
- Criar `app/api/blog/posts/route.ts`: listagem pública.
- Criar `app/api/blog/posts/[slug]/route.ts`: detalhe público.
- Criar `app/api/admin/posts/*.ts` e `app/api/admin/categories/*.ts`: CRUD admin.
- Criar `app/admin/*`: telas básicas de gestão.
- Modificar `components/home/LeadQualificationForm.tsx`: enviar para `/api/leads`.
- Modificar `app/blog/_components/BlogNewsletterSection.tsx`: enviar para `/api/newsletter/subscribe`.
- Modificar `app/blog/_lib/articles.ts` e consumidores: substituir mock local por fetch na API.
- Criar `middleware.ts`: proteção de `/admin` e `/api/admin`.
- Criar `tests/integration/*.test.ts`: integração de auth, leads e blog.
- Modificar `README.md` e `ARQUITETURA.md`: operação backend e variáveis.

### Task 1: Base de ambiente e dependências

**Files:**
- Modify: `package.json`
- Create: `.env.example`
- Create: `lib/server/env.ts`

- [ ] **Step 1: Adicionar dependências backend/teste**

```json
{
  "dependencies": {
    "@prisma/client": "^6.0.0",
    "jose": "^5.9.6",
    "bcryptjs": "^2.4.3"
  },
  "devDependencies": {
    "prisma": "^6.0.0",
    "vitest": "^2.0.0",
    "supertest": "^7.0.0"
  }
}
```

- [ ] **Step 2: Definir variáveis mínimas no `.env.example`**

```env
DATABASE_URL=postgresql://user:password@127.0.0.1:5432/m2_db
JWT_ACCESS_SECRET=change-me
JWT_REFRESH_SECRET=change-me-too
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=30d
ADMIN_BOOTSTRAP_EMAIL=admin@empresa.com
ADMIN_BOOTSTRAP_PASSWORD=change-me
```

- [ ] **Step 3: Validar env no bootstrap**

```ts
// lib/server/env.ts
import { z } from "zod";
export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_TTL: z.string(),
  JWT_REFRESH_TTL: z.string(),
});
export const env = envSchema.parse(process.env);
```

- [ ] **Step 4: Validar lint/build**

Run: `npm run lint && npm run build`  
Expected: comandos executam sem erro de sintaxe/tipagem.

- [ ] **Step 5: Commit**

Run:
```powershell
git add package.json package-lock.json .env.example lib/server/env.ts
git commit -m "chore: prepara stack backend com env validado"
```

### Task 2: Prisma + schema inicial + migration

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/migrations/*`
- Create: `lib/server/db.ts`

- [ ] **Step 1: Escrever teste de smoke do cliente Prisma**

```ts
// tests/integration/db-health.test.ts
import { expect, test } from "vitest";
test("db client module exports prisma instance", async () => {
  const mod = await import("@/lib/server/db");
  expect(mod.prisma).toBeDefined();
});
```

- [ ] **Step 2: Executar teste para falhar**

Run: `npx vitest run tests/integration/db-health.test.ts`  
Expected: FAIL por módulo inexistente.

- [ ] **Step 3: Implementar schema e client**

```prisma
model User {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String
  role         String   @default("admin")
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  sessions     Session[]
}
```

```ts
// lib/server/db.ts
import { PrismaClient } from "@prisma/client";
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 4: Gerar migration e rerodar teste**

Run:
```powershell
npx prisma migrate dev --name init_backend
npx vitest run tests/integration/db-health.test.ts
```
Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add prisma lib/server/db.ts tests/integration/db-health.test.ts
git commit -m "feat: adiciona schema inicial prisma e client db"
```

### Task 3: Auth JWT (login, refresh, logout, me)

**Files:**
- Create: `lib/server/auth/jwt.ts`
- Create: `lib/server/auth/password.ts`
- Create: `lib/server/auth/session.ts`
- Create: `app/api/auth/login/route.ts`
- Create: `app/api/auth/refresh/route.ts`
- Create: `app/api/auth/logout/route.ts`
- Create: `app/api/auth/me/route.ts`
- Test: `tests/integration/auth.test.ts`

- [ ] **Step 1: Escrever teste falhando para login**

```ts
test("POST /api/auth/login retorna 200 com credenciais válidas", async () => {
  const res = await request(app).post("/api/auth/login").send({
    email: "admin@empresa.com",
    password: "12345678",
  });
  expect(res.status).toBe(200);
  expect(res.body.user.email).toBe("admin@empresa.com");
});
```

- [ ] **Step 2: Executar teste e validar falha**

Run: `npx vitest run tests/integration/auth.test.ts`  
Expected: FAIL por rota inexistente.

- [ ] **Step 3: Implementação mínima de auth**

```ts
// jwt.ts
import { SignJWT, jwtVerify } from "jose";
export async function signAccessToken(payload: { sub: string; role: string }) { /* ... */ }
export async function verifyAccessToken(token: string) { /* ... */ }
```

```ts
// route login
export async function POST(req: Request) {
  // valida payload zod, busca user, verifica senha,
  // cria access/refresh e seta cookies httpOnly
}
```

- [ ] **Step 4: Reexecutar teste**

Run: `npx vitest run tests/integration/auth.test.ts`  
Expected: PASS no caso feliz e falha 401 em credencial inválida.

- [ ] **Step 5: Commit**

```powershell
git add lib/server/auth app/api/auth tests/integration/auth.test.ts
git commit -m "feat: implementa auth jwt com refresh rotativo"
```

### Task 4: Endpoint de lead e integração do formulário

**Files:**
- Create: `lib/server/validation/lead.ts`
- Create: `app/api/leads/route.ts`
- Modify: `components/home/LeadQualificationForm.tsx`
- Test: `tests/integration/leads.test.ts`

- [ ] **Step 1: Escrever teste falhando para criação de lead**

```ts
test("POST /api/leads persiste lead válido", async () => {
  const res = await request(app).post("/api/leads").send(validLeadPayload);
  expect(res.status).toBe(201);
  expect(res.body.id).toBeTruthy();
});
```

- [ ] **Step 2: Rodar teste e confirmar falha**

Run: `npx vitest run tests/integration/leads.test.ts`  
Expected: FAIL por rota ausente.

- [ ] **Step 3: Implementar rota + integração frontend**

```ts
// app/api/leads/route.ts
export async function POST(req: Request) {
  // parse zod, create prisma.lead, return 201
}
```

```ts
// LeadQualificationForm.tsx
const response = await fetch("/api/leads", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data),
});
if (!response.ok) throw new Error("Falha ao enviar formulário");
```

- [ ] **Step 4: Reexecutar teste + lint/build**

Run: `npx vitest run tests/integration/leads.test.ts && npm run lint && npm run build`  
Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add app/api/leads lib/server/validation/lead.ts components/home/LeadQualificationForm.tsx tests/integration/leads.test.ts
git commit -m "feat: adiciona endpoint de leads e integra formulario"
```

### Task 5: Newsletter subscribe

**Files:**
- Create: `lib/server/validation/newsletter.ts`
- Create: `app/api/newsletter/subscribe/route.ts`
- Modify: `app/blog/_components/BlogNewsletterSection.tsx`
- Test: `tests/integration/newsletter.test.ts`

- [ ] **Step 1: Teste falhando para subscribe**

```ts
test("POST /api/newsletter/subscribe aceita email válido", async () => {
  const res = await request(app)
    .post("/api/newsletter/subscribe")
    .send({ email: "contato@empresa.com.br" });
  expect(res.status).toBe(201);
});
```

- [ ] **Step 2: Rodar teste e confirmar falha**

Run: `npx vitest run tests/integration/newsletter.test.ts`  
Expected: FAIL.

- [ ] **Step 3: Implementar rota e atualização de UI**

```ts
// route.ts
export async function POST(req: Request) {
  // upsert por email + status subscribed
}
```

```ts
// BlogNewsletterSection.tsx
await fetch("/api/newsletter/subscribe", { method: "POST", ... });
setSubmitted(true);
```

- [ ] **Step 4: Reexecutar teste**

Run: `npx vitest run tests/integration/newsletter.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add app/api/newsletter app/blog/_components/BlogNewsletterSection.tsx lib/server/validation/newsletter.ts tests/integration/newsletter.test.ts
git commit -m "feat: adiciona subscribe de newsletter com persistencia"
```

### Task 6: Blog dinâmico público + endpoints

**Files:**
- Create: `app/api/blog/posts/route.ts`
- Create: `app/api/blog/posts/[slug]/route.ts`
- Modify: `app/blog/page.tsx`
- Modify: `app/blog/[slug]/page.tsx`
- Modify: `app/blog/_lib/articles.ts`
- Test: `tests/integration/blog-public.test.ts`

- [ ] **Step 1: Testes falhando de listagem e detalhe**

```ts
test("GET /api/blog/posts retorna apenas published", async () => {
  const res = await request(app).get("/api/blog/posts");
  expect(res.status).toBe(200);
  expect(Array.isArray(res.body.items)).toBe(true);
});
```

- [ ] **Step 2: Rodar e validar falha**

Run: `npx vitest run tests/integration/blog-public.test.ts`  
Expected: FAIL.

- [ ] **Step 3: Implementar API e substituir mock local**

```ts
// app/blog/_lib/articles.ts
export async function getPublishedArticles(): Promise<Article[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/blog/posts`, { cache: "no-store" });
  return (await res.json()).items;
}
```

- [ ] **Step 4: Reexecutar teste + validação build**

Run: `npx vitest run tests/integration/blog-public.test.ts && npm run build`  
Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add app/api/blog app/blog/page.tsx app/blog/[slug]/page.tsx app/blog/_lib/articles.ts tests/integration/blog-public.test.ts
git commit -m "feat: publica blog dinamico com api e slug"
```

### Task 7: Admin (CRUD posts/categorias) + proteção

**Files:**
- Create: `middleware.ts`
- Create: `app/admin/page.tsx`
- Create: `app/admin/posts/page.tsx`
- Create: `app/api/admin/posts/route.ts`
- Create: `app/api/admin/posts/[id]/route.ts`
- Create: `app/api/admin/categories/route.ts`
- Create: `app/api/admin/categories/[id]/route.ts`
- Test: `tests/integration/admin-authz.test.ts`

- [ ] **Step 1: Testes falhando de autorização**

```ts
test("POST /api/admin/posts sem auth retorna 401", async () => {
  const res = await request(app).post("/api/admin/posts").send(postPayload);
  expect(res.status).toBe(401);
});
```

- [ ] **Step 2: Rodar e confirmar falha**

Run: `npx vitest run tests/integration/admin-authz.test.ts`  
Expected: FAIL.

- [ ] **Step 3: Implementar guardas e CRUD mínimo**

```ts
// middleware.ts
export function middleware(req: NextRequest) {
  // proteger /admin e /api/admin por cookie jwt válido
}
```

```ts
// POST /api/admin/posts
// validar role, validar payload, criar post draft
```

- [ ] **Step 4: Reexecutar teste**

Run: `npx vitest run tests/integration/admin-authz.test.ts`  
Expected: PASS (401 sem auth, 200/201 com auth admin).

- [ ] **Step 5: Commit**

```powershell
git add middleware.ts app/admin app/api/admin tests/integration/admin-authz.test.ts
git commit -m "feat: adiciona area admin com autorizacao e crud de blog"
```

### Task 8: Hardening mínimo (rate limit, csrf, logs)

**Files:**
- Create: `lib/server/security/rate-limit.ts`
- Create: `lib/server/security/csrf.ts`
- Modify: `app/api/auth/login/route.ts`
- Modify: `app/api/leads/route.ts`
- Modify: `app/api/newsletter/subscribe/route.ts`
- Modify: `app/api/admin/posts/route.ts`
- Test: `tests/integration/security.test.ts`

- [ ] **Step 1: Escrever testes falhando de proteção**

```ts
test("login bloqueia após limite de tentativas", async () => {
  // múltiplas tentativas inválidas
  // espera 429
});
```

- [ ] **Step 2: Rodar e validar falha**

Run: `npx vitest run tests/integration/security.test.ts`  
Expected: FAIL.

- [ ] **Step 3: Implementar proteção mínima**

```ts
// rate-limit.ts
export function checkRateLimit(key: string, limit: number, windowMs: number) { /* ... */ }
```

```ts
// csrf.ts
export function validateCsrf(req: Request) { /* ... */ }
```

- [ ] **Step 4: Reexecutar testes**

Run: `npx vitest run tests/integration/security.test.ts`  
Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add lib/server/security app/api/auth/login/route.ts app/api/leads/route.ts app/api/newsletter/subscribe/route.ts app/api/admin/posts/route.ts tests/integration/security.test.ts
git commit -m "feat: aplica rate limit e csrf nas rotas criticas"
```

### Task 9: Documentação operacional + handoff VPS

**Files:**
- Modify: `README.md`
- Modify: `ARQUITETURA.md`
- Create: `docs/operations/vps-deploy.md`

- [ ] **Step 1: Atualizar README com backend real**

```md
## Backend
- Endpoints disponíveis
- Variáveis de ambiente necessárias
- Comandos de migration e seed
```

- [ ] **Step 2: Atualizar ARQUITETURA com módulos server**

```md
Adicionar seções: auth, api handlers, prisma, segurança, operação VPS.
```

- [ ] **Step 3: Criar runbook de deploy VPS**

```md
Passos: build, migrate deploy, restart serviço, health-check, rollback.
```

- [ ] **Step 4: Validação final**

Run: `npm run lint && npm run build && npx vitest run`  
Expected: PASS geral.

- [ ] **Step 5: Commit**

```powershell
git add README.md ARQUITETURA.md docs/operations/vps-deploy.md
git commit -m "docs: atualiza arquitetura e runbook de deploy vps"
```

## Self-review do plano

- Cobertura do spec: auth, blog dinâmico, leads, newsletter, admin, segurança mínima, operação VPS e documentação estão mapeados em tasks.
- Placeholder scan: sem `TODO/TBD` no fluxo de execução.
- Consistência: convenções de rota e módulos mantidas entre tasks.

