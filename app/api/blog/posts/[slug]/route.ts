import { NextResponse } from "next/server";
import { PostStatus } from "@prisma/client";
import { prisma } from "../../../../../lib/server/db";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_: Request, context: RouteContext) {
  const { slug } = await context.params;

  const post = await prisma.post.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      content: true,
      coverImageUrl: true,
      status: true,
      publishedAt: true,
      createdAt: true,
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!post || post.status !== PostStatus.published) {
    return NextResponse.json({ message: "Artigo nao encontrado" }, { status: 404 });
  }

  const item = {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    content: post.content,
    category: post.category?.name ?? "Compliance",
    publishedAt: (post.publishedAt ?? post.createdAt).toISOString(),
    readingTimeMinutes: 6,
    coverImage: post.coverImageUrl ?? "/imagens/office/foto_material_m2.jpg",
  };

  return NextResponse.json({ item }, { status: 200 });
}
