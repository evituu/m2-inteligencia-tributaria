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
