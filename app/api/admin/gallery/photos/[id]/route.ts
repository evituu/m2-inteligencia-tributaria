import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminFromRequest } from "@/lib/server/auth/guards";
import { prisma } from "@/lib/server/db";
import { validateCsrf } from "@/lib/server/security/csrf";
import { deleteFromR2 } from "@/lib/server/storage/r2";

const patchSchema = z.object({
  order: z.number().int().min(0),
});

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

  const body: unknown = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ message: "Dados invalidos", errors: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const updated = await prisma.galleryPhoto.update({
      where: { id },
      data: { order: parsed.data.order },
    });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const prismaErr = err as { code?: string };
    if (prismaErr?.code === "P2025") {
      return NextResponse.json({ message: "Foto nao encontrada" }, { status: 404 });
    }
    throw err;
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
