import { randomUUID } from "crypto";
import { readFile, unlink } from "fs/promises";
import { Readable } from "stream";
import type { IncomingMessage } from "http";
import { NextResponse } from "next/server";
import { formidable } from "formidable";

import { requireAdminFromRequest } from "@/lib/server/auth/guards";
import { prisma } from "@/lib/server/db";
import { validateCsrf } from "@/lib/server/security/csrf";
import { uploadToR2 } from "@/lib/server/storage/r2";
import { processImage } from "@/lib/server/storage/processImage";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100 MB
const MAX_FILES = 10;
const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

import type { FormidableFile } from "formidable";

function parseMultipart(req: Request): Promise<FormidableFile[]> {
  return new Promise((resolve, reject) => {
    // Read req.body as a raw Node.js stream — bypasses Next.js body buffering limit
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

    const form = formidable({
      maxFileSize: MAX_FILE_SIZE_BYTES,
      maxFiles: MAX_FILES,
      keepExtensions: true,
    });

    form.parse(fakeReq, (err, _fields, files) => {
      if (err) return reject(err);
      const raw = files["files"] ?? [];
      resolve(Array.isArray(raw) ? raw : [raw]);
    });
  });
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

  if (fileList.length > MAX_FILES) {
    return NextResponse.json(
      { message: `Envie no maximo ${MAX_FILES} fotos por vez` },
      { status: 400 },
    );
  }

  for (const file of fileList) {
    const mime = file.mimetype ?? "";
    if (!ALLOWED_MIME_TYPES.has(mime)) {
      return NextResponse.json(
        { message: "Formato invalido. Use JPG, PNG ou WEBP." },
        { status: 400 },
      );
    }
    if (file.size <= 0 || file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { message: "Arquivo excede o limite de 100MB." },
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

  for (const file of fileList) {
    const key = `gallery/${albumId}/${Date.now()}-${randomUUID()}.webp`;
    const rawBuffer = await readFile(file.filepath);
    const processed = await processImage(rawBuffer);
    const url = await uploadToR2(processed.buffer, key, processed.mimeType);

    const photo = await prisma.galleryPhoto.create({
      data: { albumId, url, r2Key: key, order: nextOrder },
      select: { id: true, url: true, order: true },
    });

    created.push(photo);
    nextOrder++;

    // Remove temp file written by formidable
    await unlink(file.filepath).catch(() => {});
  }

  if (!album.coverImage && maxOrderResult._max.order === null && created.length > 0) {
    await prisma.galleryAlbum.update({
      where: { id: albumId },
      data: { coverImage: created[0].url },
    });
  }

  return NextResponse.json({ items: created }, { status: 201 });
}
