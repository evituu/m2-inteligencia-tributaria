import { NextResponse } from "next/server";

import { prisma } from "../../../../lib/server/db";
import { validateCsrf } from "../../../../lib/server/security/csrf";
import { buildRateLimitKey, checkRateLimit, getClientIp } from "../../../../lib/server/security/rate-limit";
import { newsletterSubscribeSchema } from "../../../../lib/server/validation/newsletter";

const NEWSLETTER_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const NEWSLETTER_RATE_LIMIT_MAX_REQUESTS = 10;

export async function POST(req: Request) {
  if (!validateCsrf(req)) {
    return NextResponse.json({ message: "CSRF invalido" }, { status: 403 });
  }

  const ip = getClientIp(req);
  const rate = checkRateLimit({
    key: buildRateLimitKey(["newsletter-subscribe", ip]),
    limit: NEWSLETTER_RATE_LIMIT_MAX_REQUESTS,
    windowMs: NEWSLETTER_RATE_LIMIT_WINDOW_MS,
  });

  if (!rate.allowed) {
    return NextResponse.json(
      { message: "Muitas tentativas. Tente novamente em instantes." },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSec) } },
    );
  }

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
