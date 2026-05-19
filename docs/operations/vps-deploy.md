# Runbook de Deploy VPS

Este runbook cobre deploy do app monolitico Next.js (frontend + API + admin) com PostgreSQL e Prisma.

## Pre-requisitos

- Acesso SSH na VPS.
- Node.js e npm instalados.
- Variaveis de ambiente configuradas no host (sem segredos no repositorio).
- Processo em gerenciamento por PM2 ou systemd.

## Deploy padrao

1. Atualizar codigo

```powershell
git fetch --all
git checkout <branch-ou-tag>
git pull --ff-only
```

2. Instalar dependencias

```powershell
npm.cmd ci
```

3. Gerar client Prisma

```powershell
npx.cmd prisma generate
```

4. Aplicar migrations em producao

```powershell
npx.cmd prisma migrate deploy
```

5. Build de producao

```powershell
npm.cmd run build
```

6. Restart da aplicacao

Com PM2:

```powershell
pm2 restart m2-app
pm2 save
```

Com systemd:

```powershell
sudo systemctl restart m2-app
sudo systemctl status m2-app --no-pager
```

## Health-check pos deploy

Executar checks minimos:

```powershell
curl.exe -i http://127.0.0.1:3000/
curl.exe -i http://127.0.0.1:3000/blog
curl.exe -i http://127.0.0.1:3000/api/blog/posts
curl.exe -i http://127.0.0.1:3000/admin/login
```

Critérios:
- Home e blog retornam 200.
- API publica de posts retorna 200.
- Login admin acessivel (200).

## Rollback

Use rollback quando build, migrate ou health-check falhar.

1. Voltar para tag/commit anterior estavel

```powershell
git checkout <tag-ou-commit-estavel>
```

2. Reinstalar e rebuild

```powershell
npm.cmd ci
npx.cmd prisma generate
npm.cmd run build
```

3. Restart

```powershell
pm2 restart m2-app
```

4. Reexecutar health-check.

## Observacoes operacionais

- Nunca rodar `prisma migrate dev` em producao.
- Fazer backup do PostgreSQL antes de janelas de alteracao estrutural.
- Em falha de migration, interromper deploy e corrigir antes de expor trafego.
