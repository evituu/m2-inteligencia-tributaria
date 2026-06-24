import { randomUUID } from "crypto";
import { mkdir, readFile, writeFile, rm } from "fs/promises";
import { join } from "path";
import { tmpdir } from "os";
import { NextResponse } from "next/server";

import { requireAdminFromRequest } from "@/lib/server/auth/guards";
import { prisma } from "@/lib/server/db";
import { validateCsrf } from "@/lib/server/security/csrf";
import { uploadToR2 } from "@/lib/server/storage/r2";
import { processImage } from "@/lib/server/storage/processImage";

export const runtime = "nodejs";

const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const MAX_FILE_SIZE = 100 * 1024 * 1024;

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

  const uploadId   = req.headers.get("x-upload-id");
  const chunkIndex = parseInt(req.headers.get("x-chunk-index") ?? "0");
  const totalChunks = parseInt(req.headers.get("x-total-chunks") ?? "1");
  const mimeType   = req.headers.get("x-mime-type") ?? "image/jpeg";
  const totalSize  = parseInt(req.headers.get("x-total-size") ?? "0");

  if (!uploadId || isNaN(chunkIndex) || isNaN(totalChunks) || totalChunks < 1) {
    return NextResponse.json({ message: "Headers invalidos" }, { status: 400 });
  }
  if (!ALLOWED_MIME_TYPES.has(mimeType)) {
    return NextResponse.json({ message: "Formato invalido. Use JPG, PNG ou WEBP." }, { status: 400 });
  }
  if (totalSize > MAX_FILE_SIZE) {
    return NextResponse.json({ message: "Arquivo excede o limite de 100MB." }, { status: 400 });
  }

  // Each chunk is ≤4 MB — always under Next.js 10 MB limit
  const chunkBuffer = Buffer.from(await req.arrayBuffer());

  const tempDir = join(tmpdir(), `gallery-${albumId}-${uploadId}`);
  await mkdir(tempDir, { recursive: true });
  await writeFile(join(tempDir, `chunk-${chunkIndex}`), chunkBuffer);

  // Not the last chunk — acknowledge and wait for the rest
  if (chunkIndex < totalChunks - 1) {
    return NextResponse.json({ received: chunkIndex }, { status: 206 });
  }

  // Last chunk arrived — assemble, convert, upload
  try {
    const parts: Buffer[] = [];
    for (let i = 0; i < totalChunks; i++) {
      parts.push(await readFile(join(tempDir, `chunk-${i}`)));
    }
    const fullBuffer = Buffer.concat(parts);

    const maxOrderResult = await prisma.galleryPhoto.aggregate({
      _max: { order: true },
      where: { albumId },
    });
    const order = (maxOrderResult._max.order ?? -1) + 1;

    const key = `gallery/${albumId}/${Date.now()}-${randomUUID()}.webp`;
    const processed = await processImage(fullBuffer);
    const url = await uploadToR2(processed.buffer, key, processed.mimeType);

    const photo = await prisma.galleryPhoto.create({
      data: { albumId, url, r2Key: key, order },
      select: { id: true, url: true, order: true },
    });

    // Auto-set cover on first upload
    const album = await prisma.galleryAlbum.findUnique({
      where: { id: albumId },
      select: { coverImage: true },
    });
    if (album && !album.coverImage) {
      await prisma.galleryAlbum.update({
        where: { id: albumId },
        data: { coverImage: url },
      });
    }

    return NextResponse.json({ item: photo }, { status: 201 });
  } finally {
    await rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
}
