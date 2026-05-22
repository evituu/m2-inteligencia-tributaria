import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminFromRequest } from "@/lib/server/auth/guards";
import { prisma } from "@/lib/server/db";
import { validateCsrf } from "@/lib/server/security/csrf";

const updateAlbumSchema = z.object({
  title: z.string().min(3).optional(),
  slug: z.string().min(3).optional(),
  description: z.string().optional(),
  coverImageUrl: z.string().min(1).optional(),
  eventDate: z.string().optional(),
  location: z.string().optional(),
  isPublished: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: RouteParams) {
  const guard = await requireAdminFromRequest(req);
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const album = await prisma.galleryAlbum.findUnique({
    where: { id },
    include: {
      photos: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!album) {
    return NextResponse.json({ message: "Album nao encontrado" }, { status: 404 });
  }

  return NextResponse.json(album, { status: 200 });
}

export async function PATCH(req: Request, { params }: RouteParams) {
  if (!validateCsrf(req)) {
    return NextResponse.json({ message: "CSRF invalido" }, { status: 403 });
  }

  const guard = await requireAdminFromRequest(req);
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const rawBody = await req.json().catch(() => null);
  const parsed = updateAlbumSchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json({ message: "Payload invalido" }, { status: 400 });
  }

  try {
    const album = await prisma.galleryAlbum.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json(album, { status: 200 });
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return NextResponse.json({ message: "Slug ja em uso" }, { status: 409 });
    }
    if (isNotFoundError(error)) {
      return NextResponse.json({ message: "Album nao encontrado" }, { status: 404 });
    }
    throw error;
  }
}

export async function DELETE(req: Request, { params }: RouteParams) {
  if (!validateCsrf(req)) {
    return NextResponse.json({ message: "CSRF invalido" }, { status: 403 });
  }

  const guard = await requireAdminFromRequest(req);
  if (!guard.ok) return guard.response;

  const { id } = await params;

  try {
    await prisma.galleryAlbum.delete({ where: { id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    if (isNotFoundError(error)) {
      return NextResponse.json({ message: "Album nao encontrado" }, { status: 404 });
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

function isNotFoundError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2025"
  );
}
