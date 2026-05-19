import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

import { requireAdminFromRequest } from "@/lib/server/auth/guards";
import { validateCsrf } from "@/lib/server/security/csrf";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "covers");

function getExtensionByMime(mimeType: string) {
  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    default:
      return null;
  }
}

export async function POST(req: Request) {
  if (!validateCsrf(req)) {
    return NextResponse.json({ message: "CSRF invalido" }, { status: 403 });
  }

  const guard = await requireAdminFromRequest(req);
  if (!guard.ok) {
    return guard.response;
  }

  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ message: "Arquivo nao enviado" }, { status: 400 });
  }

  const extension = getExtensionByMime(file.type);
  if (!extension) {
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

  await mkdir(UPLOAD_DIR, { recursive: true });

  const fileName = `${Date.now()}-${randomUUID()}.${extension}`;
  const filePath = path.join(UPLOAD_DIR, fileName);
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, fileBuffer);

  return NextResponse.json({ url: `/uploads/covers/${fileName}` }, { status: 201 });
}

