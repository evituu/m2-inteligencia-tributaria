import { NextResponse } from "next/server";
import { PostStatus } from "@prisma/client";
import { prisma } from "../../../../lib/server/db";

export async function GET() {
  const posts = await prisma.post.findMany({
    where: {
      status: PostStatus.published,
      publishedAt: { not: null },
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverImageUrl: true,
      publishedAt: true,
      createdAt: true,
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  const items = posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt ?? "",
    category: post.category?.name ?? "Compliance",
    publishedAt: (post.publishedAt ?? post.createdAt).toISOString(),
    readingTimeMinutes: 6,
    coverImage: post.coverImageUrl ?? "/imagens/office/foto_material_m2.jpg",
  }));

  return NextResponse.json({ items }, { status: 200 });
}
