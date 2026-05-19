import { NextResponse } from "next/server";

import { prisma } from "../../../lib/server/db";
import { leadSchema } from "../../../lib/server/validation/lead";

export async function POST(req: Request) {
  const rawBody = await req.json().catch(() => null);
  const parsedBody = leadSchema.safeParse(rawBody);

  if (!parsedBody.success) {
    return NextResponse.json({ message: "Payload invalido" }, { status: 400 });
  }

  const lead = await prisma.lead.create({
    data: {
      fullName: parsedBody.data.fullName,
      email: parsedBody.data.professionalEmail.toLowerCase(),
      phone: parsedBody.data.whatsapp,
      company: parsedBody.data.companyName,
      taxRegime: parsedBody.data.taxRegime,
      message: parsedBody.data.needDetails || null,
      source: `service:${parsedBody.data.service};challenge:${parsedBody.data.challenge};cnpj:${parsedBody.data.cnpj}`,
    },
    select: {
      id: true,
    },
  });

  return NextResponse.json({ id: lead.id }, { status: 201 });
}
