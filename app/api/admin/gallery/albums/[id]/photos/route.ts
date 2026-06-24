import { randomUUID } from "crypto";
import { readFile, unlink } from "fs/promises";
import { Readable } from "stream";
import type { IncomingMessage } from "http";
import { NextResponse } from "next/server";
import { formidable } from "formidable";
import type { FormidableFile } from "formidable";

import { requireAdminFromRequest } from "@/lib/server/auth/guards";
import { prisma } from "@/lib/server/db";
import { validateCsrf } from "@/lib/server/security/csrf";
import { uploadToR2 } from "@/lib/server/storage/r2";
import { processImage } from "@/lib/server/storage/processImage";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB
const MAX_FILES = 20;
const CONCURRENCY = 3;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

function parseMultipart(req: Request): Promise<FormidableFile[]> {
  return new Promise((resolve, reject) => {
    const nodeStream = Readable.fromWeb(
      req.body as import("stream/web").ReadableStream,
    );
    const fakeReq = Object.assign(nodeStream, {
      headers: {
        "content-type": req.headers.get("content-type") ?? "",
        "content-length": req.headers.get("content-length") ?? "",
      },
      method: "POST",
      url: "",
    }) as unknown as IncomingMessage;

    const form = formidable({ maxFileSize: MAX_FILE_SIZE_BYTES, maxFiles: MAX_FILES, keepExtensions: true });
    form.parse(fakeReq, (err, _fields, files) => {
      if (err) return reject(err);
      const raw = files["files"] ?? [];
      resolve(Array.isArray(raw) ? raw : [raw]);
    });
  });
}

async function processOne(
  file: FormidableFile,
  albumId: string,
  order: number,
): Promise<{ id: string; url: string; order: number } | null> {
  try {
    const key = `gallery/${albumId}/${Date.now()}-${randomUUID()}.webp`;
    const rawBuffer = await readFile(file.filepath);
    const processed = await processImage(rawBuffer);
    const url = await uploadToR2(processed.buffer, key, processed.mimeType);
    const photo = await prisma.galleryPhoto.create({
      data: { albumId, url, r2Key: key, order },
      select: { id: true, url: true, order: true },
    });
    return photo;
  } catch (err) {
    console.error(`[gallery/photos] failed to process ${file.originalFilename}:`, err);
    return null;
  } finally {
    await unlink(file.filepath).catch(() => {});
  }
}

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

  let fileList: FormidableFile[];
  try {
    fileList = await parseMultipart(req);
  } catch (err) {
    console.error("[gallery/photos] multipart parse error:", err);
    return NextResponse.json({ message: "Payload invalido" }, { status: 400 });
  }

  if (fileList.length === 0) {
    return NextResponse.json({ message: "Nenhum arquivo enviado" }, { status: 400 });
  }

  // Validate all files before processing
  for (const file of fileList) {
    const mime = file.mimetype ?? "";
    if (!ALLOWED_MIME_TYPES.has(mime)) {
      await Promise.all(fileList.map((f) => unlink(f.filepath).catch(() => {})));
      return NextResponse.json({ message: `Formato invalido: ${file.originalFilename ?? mime}. Use JPG, PNG ou WEBP.` }, { status: 400 });
    }
    if (file.size <= 0 || file.size > MAX_FILE_SIZE_BYTES) {
      await Promise.all(fileList.map((f) => unlink(f.filepath).catch(() => {})));
      return NextResponse.json({ message: `Arquivo excede o limite de 100MB: ${file.originalFilename ?? ""}` }, { status: 400 });
    }
  }

  const maxOrderResult = await prisma.galleryPhoto.aggregate({
    _max: { order: true },
    where: { albumId },
  });
  const baseOrder = (maxOrderResult._max.order ?? -1) + 1;

  // Process files with bounded concurrency
  const created: { id: string; url: string; order: number }[] = [];
  let failedCount = 0;

  for (let i = 0; i < fileList.length; i += CONCURRENCY) {
    const chunk = fileList.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      chunk.map((file, idx) => processOne(file, albumId, baseOrder + i + idx)),
    );
    for (const result of results) {
      if (result) created.push(result);
      else failedCount++;
    }
  }

  if (!album.coverImage && maxOrderResult._max.order === null && created.length > 0) {
    await prisma.galleryAlbum.update({
      where: { id: albumId },
      data: { coverImage: created[0].url },
    });
  }

  return NextResponse.json({ items: created, failed: failedCount }, { status: 201 });
}
