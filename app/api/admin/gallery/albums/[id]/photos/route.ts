import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { requireAdminFromRequest } from "@/lib/server/auth/guards";
import { prisma } from "@/lib/server/db";
import { validateCsrf } from "@/lib/server/security/csrf";
import { uploadToR2 } from "@/lib/server/storage/r2";
import { processImage } from "@/lib/server/storage/processImage";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_FILES = 10;

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!validateCsrf(req)) {
    return NextResponse.json({ message: "CSRF invalido" }, { status: 403 });
  }

  const guard = await requireAdminFromRequest(req);
  if (!guard.ok) return guard.response;

  const { id: albumId } = await params;

  const album = await prisma.galleryAlbum.findUnique({ where: { id: albumId } });
  if (!album) {
    return NextResponse.json({ message: "Album nao encontrado" }, { status: 404 });
  }

  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ message: "Payload invalido" }, { status: 400 });
  }

  const files = formData.getAll("files").filter((f): f is File => f instanceof File);

  if (files.length === 0) {
    return NextResponse.json({ message: "Nenhum arquivo enviado" }, { status: 400 });
  }

  if (files.length > MAX_FILES) {
    return NextResponse.json(
      { message: `Envie no maximo ${MAX_FILES} fotos por vez` },
      { status: 400 },
    );
  }

  for (const file of files) {
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { message: "Formato invalido. Use JPG, PNG ou WEBP." },
        { status: 400 },
      );
    }
    if (file.size <= 0 || file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { message: "Arquivo excede o limite de 5MB." },
        { status: 400 },
      );
    }
  }

  const maxOrderResult = await prisma.galleryPhoto.aggregate({
    _max: { order: true },
    where: { albumId },
  });
  let nextOrder = (maxOrderResult._max.order ?? -1) + 1;

  const created: { id: string; url: string; order: number }[] = [];

  for (const file of files) {
    const key = `gallery/${albumId}/${Date.now()}-${randomUUID()}.webp`;
    const rawBuffer = Buffer.from(await file.arrayBuffer());
    const processed = await processImage(rawBuffer);
    const url = await uploadToR2(processed.buffer, key, processed.mimeType);

    const photo = await prisma.galleryPhoto.create({
      data: { albumId, url, r2Key: key, order: nextOrder },
      select: { id: true, url: true, order: true },
    });

    created.push(photo);
    nextOrder++;
  }

  if (!album.coverImage && maxOrderResult._max.order === null && created.length > 0) {
    await prisma.galleryAlbum.update({
      where: { id: albumId },
      data: { coverImage: created[0].url },
    });
  }

  return NextResponse.json({ items: created }, { status: 201 });
}
