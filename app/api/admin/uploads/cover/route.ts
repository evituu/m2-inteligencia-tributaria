import { randomUUID } from "crypto";
import { NextResponse } from "next/server";

import { requireAdminFromRequest } from "@/lib/server/auth/guards";
import { validateCsrf } from "@/lib/server/security/csrf";
import { uploadToR2 } from "@/lib/server/storage/r2";

export const runtime = "nodejs";

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

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
  if (!guard.ok) return guard.response;

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

  const key = `covers/${Date.now()}-${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadToR2(buffer, key, file.type);

  return NextResponse.json({ url }, { status: 201 });
}

