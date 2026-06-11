import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminFromRequest } from "../../../../../lib/server/auth/guards";
import { prisma } from "../../../../../lib/server/db";
import { validateCsrf } from "../../../../../lib/server/security/csrf";

const updateCategorySchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().nullable().optional(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: RouteParams) {
  const guard = await requireAdminFromRequest(req);

  if (!guard.ok) {
    return guard.response;
  }

  const { id } = await params;
  const item = await prisma.category.findUnique({ where: { id } });

  if (!item) {
    return NextResponse.json({ message: "Categoria nao encontrada" }, { status: 404 });
  }

  return NextResponse.json(item, { status: 200 });
}

export async function PATCH(req: Request, { params }: RouteParams) {
  if (!validateCsrf(req)) return NextResponse.json({ message: "CSRF invalido" }, { status: 403 });
  const guard = await requireAdminFromRequest(req);

  if (!guard.ok) {
    return guard.response;
  }

  const rawBody = await req.json().catch(() => null);
  const parsed = updateCategorySchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json({ message: "Payload invalido" }, { status: 400 });
  }

  const { id } = await params;
  const item = await prisma.category.update({ where: { id }, data: parsed.data });

  return NextResponse.json(item, { status: 200 });
}

export async function DELETE(req: Request, { params }: RouteParams) {
  if (!validateCsrf(req)) return NextResponse.json({ message: "CSRF invalido" }, { status: 403 });
  const guard = await requireAdminFromRequest(req);

  if (!guard.ok) {
    return guard.response;
  }

  const { id } = await params;

  await prisma.category.delete({ where: { id } });

  return new NextResponse(null, { status: 204 });
}
