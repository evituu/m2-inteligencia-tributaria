import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminFromRequest } from "../../../../lib/server/auth/guards";
import { prisma } from "../../../../lib/server/db";
import { validateCsrf } from "../../../../lib/server/security/csrf";
import { buildRateLimitKey, checkRateLimit, getClientIp } from "../../../../lib/server/security/rate-limit";

const createPostSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  excerpt: z.string().optional(),
  content: z.string().min(1),
  coverImageUrl: z.string().url().optional(),
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  publishedAt: z.string().datetime().optional(),
  authorId: z.string().min(1),
  categoryId: z.string().min(1).optional(),
});
const ADMIN_POSTS_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const ADMIN_POSTS_RATE_LIMIT_MAX_REQUESTS = 30;

export async function GET(req: Request) {
  const guard = await requireAdminFromRequest(req);

  if (!guard.ok) {
    return guard.response;
  }

  const items = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, slug: true } },
      category: { select: { id: true, name: true, slug: true } },
    },
  });

  return NextResponse.json({ items }, { status: 200 });
}

export async function POST(req: Request) {
  if (!validateCsrf(req)) {
    return NextResponse.json({ message: "CSRF invalido" }, { status: 403 });
  }

  const guard = await requireAdminFromRequest(req);

  if (!guard.ok) {
    return guard.response;
  }

  const rate = checkRateLimit({
    key: buildRateLimitKey(["admin-posts", guard.user.id, getClientIp(req)]),
    limit: ADMIN_POSTS_RATE_LIMIT_MAX_REQUESTS,
    windowMs: ADMIN_POSTS_RATE_LIMIT_WINDOW_MS,
  });

  if (!rate.allowed) {
    return NextResponse.json(
      { message: "Muitas tentativas. Tente novamente em instantes." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSec) } },
    );
  }

  const rawBody = await req.json().catch(() => null);
  const parsed = createPostSchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json({ message: "Payload invalido" }, { status: 400 });
  }

  const data = parsed.data;

  const post = await prisma.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImageUrl: data.coverImageUrl,
      status: data.status,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : null,
      authorId: data.authorId,
      categoryId: data.categoryId,
      createdById: guard.user.id,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
