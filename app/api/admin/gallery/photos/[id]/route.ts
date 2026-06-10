import { NextResponse } from "next/server";

import { requireAdminFromRequest } from "@/lib/server/auth/guards";
import { prisma } from "@/lib/server/db";
import { validateCsrf } from "@/lib/server/security/csrf";
import { deleteFromR2 } from "@/lib/server/storage/r2";

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

  const photo = await prisma.galleryPhoto.findUnique({
    where: { id },
    select: { r2Key: true },
  });

  if (!photo) {
    return NextResponse.json({ message: "Foto nao encontrada" }, { status: 404 });
  }

  await deleteFromR2(photo.r2Key);
  await prisma.galleryPhoto.delete({ where: { id } });

  return new Response(null, { status: 204 });
}
