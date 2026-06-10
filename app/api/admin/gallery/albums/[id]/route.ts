import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminFromRequest } from "@/lib/server/auth/guards";
import { prisma } from "@/lib/server/db";
import { validateCsrf } from "@/lib/server/security/csrf";
import { deleteFromR2 } from "@/lib/server/storage/r2";

const patchAlbumSchema = z.object({
  title: z.string().min(1).max(120).optional(),
  slug: z.string().min(1).max(120).optional(),
  description: z.string().max(500).optional(),
  eventDate: z.string().max(50).optional(),
  location: z.string().max(120).optional(),
  isPublic: z.boolean().optional(),
  order: z.number().int().optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdminFromRequest(req);
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const album = await prisma.galleryAlbum.findUnique({
    where: { id },
    include: { photos: { orderBy: { order: "asc" } } },
  });

  if (!album) {
    return NextResponse.json({ message: "Album nao encontrado" }, { status: 404 });
  }

  return NextResponse.json(album);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!validateCsrf(req)) {
    return NextResponse.json({ message: "CSRF invalido" }, { status: 403 });
  }

  const guard = await requireAdminFromRequest(req);
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const rawBody = await req.json().catch(() => null);
  const parsed = patchAlbumSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json({ message: "Payload invalido" }, { status: 400 });
  }

  try {
    const album = await prisma.galleryAlbum.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json(album);
  } catch {
    return NextResponse.json({ message: "Album nao encontrado" }, { status: 404 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!validateCsrf(req)) {
    return NextResponse.json({ message: "CSRF invalido" }, { status: 403 });
  }

  const guard = await requireAdminFromRequest(req);
  if (!guard.ok) return guard.response;

  const { id } = await params;

  const photos = await prisma.galleryPhoto.findMany({
    where: { albumId: id },
    select: { r2Key: true },
  });

  await Promise.all(
    photos.map((photo) => deleteFromR2(photo.r2Key).catch(() => undefined)),
  );

  await prisma.galleryAlbum.delete({ where: { id } });

  return new Response(null, { status: 204 });
}
