import { NextResponse } from "next/server";

import { requireAdminFromRequest } from "@/lib/server/auth/guards";
import { saveGalleryCover } from "@/lib/server/gallery/uploads";
import { validateCsrf } from "@/lib/server/security/csrf";

export const runtime = "nodejs";

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

  try {
    const url = await saveGalleryCover(file);
    return NextResponse.json({ url }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Falha no upload." },
      { status: 400 },
    );
  }
}
