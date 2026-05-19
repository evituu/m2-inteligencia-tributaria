import { NextResponse } from "next/server";

import { prisma } from "../../../../lib/server/db";
import { newsletterSubscribeSchema } from "../../../../lib/server/validation/newsletter";

export async function POST(req: Request) {
  const rawBody = await req.json().catch(() => null);
  const parsedBody = newsletterSubscribeSchema.safeParse(rawBody);

  if (!parsedBody.success) {
    return NextResponse.json({ message: "Payload invalido" }, { status: 400 });
  }

  const email = parsedBody.data.email.toLowerCase();

  const subscriber = await prisma.newsletterSubscriber.upsert({
    where: { email },
    update: {
      status: "subscribed",
      unsubscribedAt: null,
    },
    create: {
      email,
      status: "subscribed",
    },
    select: {
      id: true,
      email: true,
      status: true,
    },
  });

  return NextResponse.json(subscriber, { status: 201 });
}
