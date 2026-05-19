# Design: Backend + Blog + Cadastro em VPS (Next.js Monolítico)

Data: 2026-05-19  
Status: Proposto e validado em brainstorming

## 1) Escopo e objetivo

Construir backend para o site institucional com:
- Blog dinâmico com painel admin custom.
- Captação de leads/cadastros (formulário principal + newsletter).
- Autenticação própria com JWT (access + refresh).
- Banco PostgreSQL na própria VPS.
- Deploy único em VPS (site público + admin + API no mesmo app Next.js).

Fora de escopo neste ciclo:
- Multi-tenant.
- Workflow editorial complexo (aprovação em múltiplas etapas).
- SSO/OAuth externo.

## 2) Arquitetura escolhida

Abordagem recomendada: **Next.js monolítico** com fronteiras de domínio internas.

Blocos:
- `App Web`: páginas públicas (`/`, `/servicos`, `/blog`, etc.).
- `Admin`: rotas protegidas (`/admin/*`) para gestão de posts, categorias, autores e leads.
- `API`: route handlers em `/api/*`.
- `Prisma`: acesso a dados com migrations versionadas.
- `PostgreSQL`: banco único na VPS.
- `Nginx`: reverse proxy + TLS + headers de segurança + cache estático.
- `PM2` ou `systemd`: gestão de processo Node.

Motivo da escolha:
- Menor tempo de entrega e menor overhead operacional.
- Um único repositório e pipeline.
- Capacidade de evoluir para separação futura sem reescrita total se os domínios forem bem isolados.

## 3) Módulos de domínio

Módulos internos (organização lógica):
- `auth`: login, refresh, logout, rotação/revogação de sessão.
- `blog`: CRUD de posts, categorias e autores.
- `lead`: captação e qualificação de leads.
- `newsletter`: assinaturas e status opt-in.
- `admin`: autorização por papel, telas e operações internas.
- `shared`: validações Zod, utilitários de segurança e logging.

Regra arquitetural:
- UI não acessa banco diretamente; toda persistência passa por camada de serviço/repositório.
- Rotas API validam payload no servidor com Zod antes de tocar em banco.

## 4) Modelo de dados (primeira versão)

Tabelas principais:
- `users`: operadores do admin (`id`, `name`, `email`, `password_hash`, `role`, `is_active`, timestamps).
- `sessions`: controle de refresh token (`id`, `user_id`, `refresh_token_hash`, `expires_at`, `revoked_at`, `user_agent`, `ip`).
- `authors`: autores de posts (`id`, `name`, `slug`, `bio`, `avatar_url`).
- `categories`: categorias de blog (`id`, `name`, `slug`, `description`).
- `posts`: conteúdo (`id`, `title`, `slug`, `excerpt`, `content`, `cover_image_url`, `status`, `published_at`, `author_id`, timestamps).
- `post_categories`: relação N:N entre post e categoria.
- `leads`: formulário de qualificação (`full_name`, `company_name`, `cnpj`, `whatsapp`, `professional_email`, `tax_regime`, `service`, `challenge`, `need_details`, `source`, timestamps).
- `newsletter_subscriptions`: (`email`, `status`, `subscribed_at`, `unsubscribed_at`, `source`).
- `audit_logs` (opcional já no MVP, recomendado no hardening): trilha de ações admin.

Índices críticos:
- `users.email` único.
- `posts.slug`, `categories.slug`, `authors.slug` únicos.
- Índices por `posts.status` + `published_at`.
- Índices por `leads.created_at` e `newsletter_subscriptions.email`.

## 5) Contratos de API (MVP)

Auth:
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/auth/me`

Blog público:
- `GET /api/blog/posts` (filtros: categoria, busca, paginação)
- `GET /api/blog/posts/:slug`

Blog admin:
- `POST /api/admin/posts`
- `PATCH /api/admin/posts/:id`
- `DELETE /api/admin/posts/:id`
- `POST /api/admin/categories`
- `PATCH /api/admin/categories/:id`

Leads e newsletter:
- `POST /api/leads`
- `GET /api/admin/leads`
- `POST /api/newsletter/subscribe`
- `POST /api/newsletter/unsubscribe`

Regras de contrato:
- Erros padronizados (`code`, `message`, `details`).
- Paginação consistente (`page`, `pageSize`, `total`, `items`).
- Sanitização e validação server-side obrigatórias.

## 6) Segurança e conformidade

Autenticação JWT própria:
- Access token curto em cookie `httpOnly`, `secure`, `sameSite=lax`.
- Refresh token rotativo, hash persistido em `sessions`.
- Revogação por sessão e logout global por usuário (invalidate em lote).

Controles mínimos:
- Hash de senha com Argon2id (ou bcrypt com custo adequado).
- Rate limit por IP e rota crítica (login, leads, newsletter).
- Proteção CSRF para rotas mutáveis do admin.
- Headers de segurança no Nginx (`X-Frame-Options`, `X-Content-Type-Options`, CSP progressiva).
- Segredos em `.env` fora de log e fora de versionamento.

LGPD/risco:
- Minimização de dados em `leads`.
- Política de retenção para leads/newsletter.
- Endpoint/admin para exclusão ou anonimização quando necessário.

## 7) Deploy e operação na VPS

Stack operacional:
- Ubuntu LTS, Node LTS, PostgreSQL 16+, Nginx.
- App Next em modo standalone.
- Processo gerenciado por `systemd` (ou PM2).
- Backups automáticos via `pg_dump` + retenção (diário/semanal).

Ambientes:
- `staging` e `production` (mesmo que em VPS separadas ou portas separadas).
- Migrations executadas no deploy com controle de rollback.

Observabilidade:
- Logs estruturados de API e autenticação.
- Alertas básicos (processo down, disco, RAM, falha de backup).
- Métricas mínimas de funil (lead criado, login falho, post publicado).

## 8) Plano de execução por fases

Fase 1 — Fundação backend:
- Prisma + schema inicial + migrations.
- Módulo `auth` com JWT e sessões.
- Endpoint `POST /api/leads` e integração do formulário atual.
- Endpoint `POST /api/newsletter/subscribe`.

Critério de aceite:
- Cadastro de lead persistindo no Postgres.
- Login admin funcional com sessão segura.

Fase 2 — Blog dinâmico + admin:
- CRUD de autores/categorias/posts.
- Página pública de blog consumindo API/banco.
- Slug dinâmico, status draft/published e publicação agendada simples.

Critério de aceite:
- Equipe publica post no admin e post aparece no front sem alteração manual em código.

Fase 3 — Hardening e operação:
- Rate limit e CSRF no admin.
- Audit log e rotinas de backup/restore testadas.
- Observabilidade mínima e runbook operacional.

Critério de aceite:
- Checklist de segurança e operação validado.

## 9) Estratégia de testes e validação

Mínimo obrigatório por fase:
- `npm run lint`
- `npm run build`
- Testes de integração dos endpoints críticos (auth, leads, posts).

Testes recomendados:
- Fluxo de rotação de refresh token.
- Permissão por papel no admin.
- Regras de publicação de post (draft vs published).
- Cenários de erro de validação e rate limit.

## 10) Riscos e mitigação

Risco: acoplamento alto no monólito.  
Mitigação: separar domínios internamente desde o início (pastas, serviços e contratos claros).

Risco: operar banco na mesma VPS aumenta impacto de falha.  
Mitigação: backup diário testado + monitoramento + plano de restauração documentado.

Risco: JWT próprio mal implementado comprometer sessão.  
Mitigação: rotação de refresh, hash de token, expiração curta de access token, testes de segurança.

## 11) Decisões registradas

- Front + API + Admin no mesmo app Next.js na VPS.
- Banco PostgreSQL na VPS.
- Admin custom no próprio projeto.
- Autenticação JWT própria (sem NextAuth/Auth.js).

