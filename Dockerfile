# Stage 1: instalar dependências
FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache vips
COPY package*.json ./
RUN npm ci

# Stage 2: build da aplicação
FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache vips
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Placeholders usados durante o build; valores reais injetados em runtime pelo EasyPanel
ARG DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
ARG CLOUDFLARE_R2_PUBLIC_URL="https://placeholder.r2.dev"
ENV DATABASE_URL=$DATABASE_URL
ENV CLOUDFLARE_R2_PUBLIC_URL=$CLOUDFLARE_R2_PUBLIC_URL

RUN npx prisma generate
RUN SKIP_ENV_VALIDATION=1 NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Stage 3: imagem final de produção
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN apk add --no-cache vips
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
