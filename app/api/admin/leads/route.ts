import { NextResponse } from "next/server";
import { requireAdminFromRequest } from "../../../../lib/server/auth/guards";
import { prisma } from "../../../../lib/server/db";

const PAGE_SIZE = 50;

export async function GET(req: Request) {
  const guard = await requireAdminFromRequest(req);

  if (!guard.ok) {
    return guard.response;
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        company: true,
        companySize: true,
        monthlyRevenue: true,
        taxRegime: true,
        message: true,
        source: true,
        createdAt: true,
      },
    }),
    prisma.lead.count(),
  ]);

  return NextResponse.json({ leads, total, page, pageSize: PAGE_SIZE });
}
