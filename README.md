# M2 Inteligência Tributária

Site institucional da **M2 Inteligência Tributária** — escritório especializado em recuperação de crédito tributário, cobrança extrajudicial e negociação de dívidas para o ecossistema contábil.

Aplicação construída com **Next.js 16 (App Router)**, **React 19**, **TypeScript** e **Tailwind CSS v4**, com componentes baseados em **shadcn/ui** (estilo `radix-nova`).

---

## Sumário

- [Stack](#stack)
- [Pré-requisitos](#pré-requisitos)
- [Como rodar localmente](#como-rodar-localmente)
- [Scripts disponíveis](#scripts-disponíveis)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Páginas e seções](#páginas-e-seções)
- [Convenções](#convenções)
- [Identidade visual](#identidade-visual)
- [Documentação adicional](#documentação-adicional)

---

## Stack

| Categoria | Tecnologia |
|-----------|------------|
| Framework | **Next.js 16** (App Router, RSC) |
| UI / Render | **React 19** + **React DOM 19** |
| Linguagem | **TypeScript 5** |
| Estilização | **Tailwind CSS 4** + `tw-animate-css` |
| Componentes | **shadcn/ui** (estilo `radix-nova`) + **Radix UI** |
| Utilitários CSS | `clsx`, `tailwind-merge`, `class-variance-authority` |
| Ícones | **lucide-react** + **react-icons** |
| Fontes | **Geist Sans** e **Geist Mono** (`next/font`) |
| Lint | **ESLint 9** + `eslint-config-next` |

Detalhamento completo em [`ARQUITETURA.md`](./ARQUITETURA.md).

---

## Pré-requisitos

- **Node.js 20+**
- **npm** (recomendado, pois o lockfile do projeto é `package-lock.json`)

---

## Como rodar localmente

```bash
git clone <repo-url>
cd m2-inteligencia-tributaria
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

---

## Scripts disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Sobe o servidor de desenvolvimento com hot reload. |
| `npm run build` | Gera o build de produção. |
| `npm run start` | Executa o build de produção localmente. |
| `npm run lint` | Roda o ESLint em todo o projeto. |

-----

## Estrutura de pastas

```text
m2-inteligencia-tributaria/
├── app/                              # App Router (rotas, layouts e páginas)
│   ├── layout.tsx                    # Root layout (HTML, fontes, metadata, favicon)
│   ├── globals.css                   # Estilos globais + tokens shadcn (light/dark)
│   ├── page.tsx                      # Home (/)
│   └── sobre/                        # Página Sobre (/sobre)
│       ├── page.tsx
│       └── _components/              # Componentes privados da rota /sobre
│           ├── AboutCtaSection.tsx
│           ├── CompanyStorySection.tsx
│           ├── InstitutionalDifferentialsSection.tsx
│           ├── LeadershipSection.tsx
│           └── MissionVisionValuesSection.tsx
│
├── components/                       # Componentes compartilhados
│   ├── layout/                       # Estruturais reutilizáveis em várias páginas
│   │   ├── navigation-menu.tsx       # Navbar institucional
│   │   ├── Hero.tsx                  # Hero da home
│   │   ├── ExpertiseSection.tsx
│   │   ├── NumbersSection.tsx        # "Nossos Números" com contador animado
│   │   └── Footer.tsx
│   ├── sections/                     # Seções específicas por contexto/página
│   │   └── about/
│   │       ├── AboutHeroSection.tsx
│   │       ├── WhatWeDoSection.tsx
│   │       └── WorkEnvironmentSection.tsx
│   └── ui/                           # Componentes shadcn/ui (button, card, etc.)
│
├── lib/
│   └── utils.ts                      # Função cn() (clsx + tailwind-merge)
│
├── public/                           # Assets estáticos
│   └── imagens/
│       ├── logo/
│       │   ├── m2_logo_branca.png
│       │   ├── m2_logo_preta.png
│       │   └── m2_logo_sem_fundo.png
│       └── office/
│           ├── fachada_m2.webp
│           ├── foto_calculadora_m2.png
│           ├── m2_colaboradores_trabalhando.png
│           └── m2_lideres_socios.png
│
├── ARQUITETURA.md
├── AGENTS.md / CLAUDE.md             # Diretrizes para agentes de IA
├── components.json                   # Configuração do shadcn (estilo radix-nova)
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
└── package.json
```

---

## Páginas e seções

### Home — `/`

1. **Hero** — chamada principal com imagem de fundo da fachada e CTA "Diagnóstico gratuito".
2. **ExpertiseSection** — "Expertise que gera confiança", com imagem da calculadora e CTA.
3. **NumbersSection** — "Nossos Números", cards com contagem animada via `IntersectionObserver`.
4. **Footer** — institucional com dados da empresa, menu rápido e redes sociais.

### Sobre — `/sobre`

1. **AboutHeroSection** — hero institucional da página Sobre.
2. **CompanyStorySection** — "Nossa Trajetória".
3. **WorkEnvironmentSection** — foto institucional (`m2_colaboradores_trabalhando.png`).
4. **WhatWeDoSection** — cards de áreas de atuação (fundo dourado).
5. **MissionVisionValuesSection** — Missão, Visão e Valores em 3 cards.
6. **LeadershipSection** — sócios e diretoria (`m2_lideres_socios.png`).
7. **InstitutionalDifferentialsSection** — 6 diferenciais institucionais.
8. **AboutCtaSection** — CTA final com botão **WhatsApp (verde oficial)** e link de serviços.

---

## Convenções

- **Server Components por padrão**. Só use `"use client"` quando precisar de estado, efeitos ou APIs do navegador (ex.: `NumbersSection`).
- **Alias de import** `@/*` apontando para a raiz (definido em `tsconfig.json`).
- **Componentes específicos de uma rota** ficam em `app/<rota>/_components` (pasta com `_` é ignorada como rota pelo Next.js).
- **Componentes reutilizáveis** ficam em `components/layout` ou `components/sections/<contexto>`.
- **Estilização exclusivamente com Tailwind v4** usando tokens CSS (`bg-background`, `text-foreground`, etc.).
- **Mescla de classes** sempre com `cn()` (em `lib/utils.ts`).
- **Imagens** sempre via `next/image` com `alt` descritivo.

---

## Identidade visual

- **Preto** — base/fundos institucionais (`#05090c`, `#0a0f16`)
- **Dourado** — cor de marca e destaques (`#f2c40f` / hover `#ffd82f`)
- **Branco/Cinzas claros** — contraste e legibilidade
- **Verde WhatsApp** — apenas no botão de contato direto (`#25D366`)

---

## Documentação adicional

- [`ARQUITETURA.md`](./ARQUITETURA.md) — visão arquitetural completa, stack detalhada e decisões técnicas.
- [`AGENTS.md`](./AGENTS.md) — diretrizes obrigatórias para agentes de IA que forem editar o projeto (atenção a breaking changes do Next.js 16).
