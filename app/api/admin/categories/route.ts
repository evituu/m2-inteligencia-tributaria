import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminFromRequest } from "../../../../lib/server/auth/guards";
import { prisma } from "../../../../lib/server/db";

const createCategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
});

export async function GET(req: Request) {
  const guard = await requireAdminFromRequest(req);

  if (!guard.ok) {
    return guard.response;
  }

  const items = await prisma.category.findMany({ orderBy: { createdAt: "desc" } });

  return NextResponse.json({ items }, { status: 200 });
}

export async function POST(req: Request) {
  const guard = await requireAdminFromRequest(req);

  if (!guard.ok) {
    return guard.response;
  }

  const rawBody = await req.json().catch(() => null);
  const parsed = createCategorySchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json({ message: "Payload invalido" }, { status: 400 });
  }

  const item = await prisma.category.create({ data: parsed.data });

  return NextResponse.json(item, { status: 201 });
}
