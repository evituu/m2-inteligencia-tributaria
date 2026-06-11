import { NextResponse } from "next/server";

import { requireAdminFromRequest } from "../../../../../lib/server/auth/guards";
import { prisma } from "../../../../../lib/server/db";

export async function GET(req: Request) {
  const guard = await requireAdminFromRequest(req);

  if (!guard.ok) {
    return guard.response;
  }

  const [published, draft, archived, total, albumCount, photoCount] = await Promise.all([
    prisma.post.count({ where: { status: "published" } }),
    prisma.post.count({ where: { status: "draft" } }),
    prisma.post.count({ where: { status: "archived" } }),
    prisma.post.count(),
    prisma.galleryAlbum.count(),
    prisma.galleryPhoto.count(),
  ]);

  return NextResponse.json({ published, draft, archived, total, albums: albumCount, photos: photoCount }, { status: 200 });
}
