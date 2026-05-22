import { NextResponse } from "next/server";

import { requireAdminFromRequest } from "@/lib/server/auth/guards";
import { extractPhotosFromZip } from "@/lib/server/gallery/zip";
import { MAX_PHOTOS_PER_UPLOAD, saveGalleryPhotoFile } from "@/lib/server/gallery/uploads";
import { prisma } from "@/lib/server/db";
import { validateCsrf } from "@/lib/server/security/csrf";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: RouteParams) {
  if (!validateCsrf(req)) {
    return NextResponse.json({ message: "CSRF invalido" }, { status: 403 });
  }

  const guard = await requireAdminFromRequest(req);
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const album = await prisma.galleryAlbum.findUnique({ where: { id } });
  if (!album) {
    return NextResponse.json({ message: "Album nao encontrado" }, { status: 404 });
  }

  const formData = await req.formData().catch(() => null);
  if (!formData) {
    return NextResponse.json({ message: "Formulario invalido" }, { status: 400 });
  }

  const zipFile = formData.get("zip");
  const files = formData.getAll("files").filter((item): item is File => item instanceof File);

  const savedUrls: string[] = [];
  const errors: string[] = [];

  try {
    if (zipFile instanceof File && zipFile.size > 0) {
      const fromZip = await extractPhotosFromZip(album.id, zipFile);
      savedUrls.push(...fromZip);
    }

    const remainingSlots = MAX_PHOTOS_PER_UPLOAD - savedUrls.length;
    const filesToProcess = files.slice(0, remainingSlots);

    for (const file of filesToProcess) {
      if (file.size <= 0) continue;
      try {
        const src = await saveGalleryPhotoFile(album.id, file);
        savedUrls.push(src);
      } catch (error) {
        errors.push(error instanceof Error ? error.message : "Erro ao salvar foto.");
      }
    }
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Falha no upload." },
      { status: 400 },
    );
  }

  if (savedUrls.length === 0) {
    return NextResponse.json(
      { message: errors[0] || "Nenhuma foto valida enviada." },
      { status: 400 },
    );
  }

  const currentMax = await prisma.galleryPhoto.aggregate({
    where: { albumId: album.id },
    _max: { sortOrder: true },
  });
  const startOrder = (currentMax._max.sortOrder ?? -1) + 1;

  const created = await prisma.$transaction(
    savedUrls.map((src, index) =>
      prisma.galleryPhoto.create({
        data: {
          albumId: album.id,
          src,
          alt: `${album.title} — foto ${startOrder + index + 1}`,
          sortOrder: startOrder + index,
          layout: "default",
        },
      }),
    ),
  );

  return NextResponse.json(
    {
      items: created,
      uploaded: created.length,
      errors: errors.length > 0 ? errors : undefined,
    },
    { status: 201 },
  );
}

export async function DELETE(req: Request, { params }: RouteParams) {
  if (!validateCsrf(req)) {
    return NextResponse.json({ message: "CSRF invalido" }, { status: 403 });
  }

  const guard = await requireAdminFromRequest(req);
  if (!guard.ok) return guard.response;

  const { id: albumId } = await params;
  const { searchParams } = new URL(req.url);
  const photoId = searchParams.get("photoId");

  if (!photoId) {
    return NextResponse.json({ message: "photoId obrigatorio" }, { status: 400 });
  }

  try {
    await prisma.galleryPhoto.delete({
      where: { id: photoId, albumId },
    });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Foto nao encontrada" }, { status: 404 });
  }
}
