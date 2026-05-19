import { NextResponse } from "next/server";
import { z } from "zod";

import { requireAdminFromRequest } from "../../../../../lib/server/auth/guards";
import { prisma } from "../../../../../lib/server/db";

const updatePostSchema = z.object({
  title: z.string().min(3).optional(),
  slug: z.string().min(3).optional(),
  excerpt: z.string().nullable().optional(),
  content: z.string().min(1).optional(),
  coverImageUrl: z.string().url().nullable().optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  publishedAt: z.string().datetime().nullable().optional(),
  authorId: z.string().min(1).optional(),
  categoryId: z.string().min(1).nullable().optional(),
});

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: RouteParams) {
  const guard = await requireAdminFromRequest(req);

  if (!guard.ok) {
    return guard.response;
  }

  const { id } = await params;
  const item = await prisma.post.findUnique({ where: { id } });

  if (!item) {
    return NextResponse.json({ message: "Post nao encontrado" }, { status: 404 });
  }

  return NextResponse.json(item, { status: 200 });
}

export async function PATCH(req: Request, { params }: RouteParams) {
  const guard = await requireAdminFromRequest(req);

  if (!guard.ok) {
    return guard.response;
  }

  const rawBody = await req.json().catch(() => null);
  const parsed = updatePostSchema.safeParse(rawBody);

  if (!parsed.success) {
    return NextResponse.json({ message: "Payload invalido" }, { status: 400 });
  }

  const { id } = await params;

  const item = await prisma.post.update({
    where: { id },
    data: {
      ...parsed.data,
      publishedAt:
        parsed.data.publishedAt === undefined
          ? undefined
          : parsed.data.publishedAt === null
            ? null
            : new Date(parsed.data.publishedAt),
    },
  });

  return NextResponse.json(item, { status: 200 });
}

export async function DELETE(req: Request, { params }: RouteParams) {
  const guard = await requireAdminFromRequest(req);

  if (!guard.ok) {
    return guard.response;
  }

  const { id } = await params;

  await prisma.post.delete({ where: { id } });

  return new NextResponse(null, { status: 204 });
}
