import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminFromRequest } from "@/lib/server/auth/guards";
import { prisma } from "@/lib/server/db";
import { validateCsrf } from "@/lib/server/security/csrf";
import { buildRateLimitKey, checkRateLimit, getClientIp } from "@/lib/server/security/rate-limit";

const createAlbumSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().optional(),
  coverImageUrl: z.string().min(1),
  eventDate: z.string().optional(),
  location: z.string().optional(),
  isPublished: z.boolean().default(true),
  sortOrder: z.number().int().optional(),
});

const ADMIN_ALBUMS_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const ADMIN_ALBUMS_RATE_LIMIT_MAX_REQUESTS = 30;

export async function GET(req: Request) {
  const guard = await requireAdminFromRequest(req);
  if (!guard.ok) return guard.response;

  const items = await prisma.galleryAlbum.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: {
      _count: { select: { photos: true } },
    },
  });

  return NextResponse.json({ items }, { status: 200 });
}

export async function POST(req: Request) {
  if (!validateCsrf(req)) {
    return NextResponse.json({ message: "CSRF invalido" }, { status: 403 });
  }

  const guard = await requireAdminFromRequest(req);
  if (!guard.ok) return guard.response;

  const rate = checkRateLimit({
    key: buildRateLimitKey(["admin-albums", guard.user.id, getClientIp(req)]),
    limit: ADMIN_ALBUMS_RATE_LIMIT_MAX_REQUESTS,
    windowMs: ADMIN_ALBUMS_RATE_LIMIT_WINDOW_MS,
  });

  if (!rate.allowed) {
    return NextResponse.json(
      { message: "Muitas tentativas. Tente novamente em instantes." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSec) } },
    );
  }

  const rawBody = await req.json().catch(() => null);
  const parsed = createAlbumSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ message: "Payload invalido" }, { status: 400 });
  }

  const data = parsed.data;

  try {
    const album = await prisma.galleryAlbum.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description ?? "",
        coverImageUrl: data.coverImageUrl,
        eventDate: data.eventDate,
        location: data.location,
        isPublished: data.isPublished,
        sortOrder: data.sortOrder ?? 0,
      },
    });

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
