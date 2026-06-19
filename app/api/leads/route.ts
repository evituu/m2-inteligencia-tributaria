import { NextResponse } from "next/server";

import { prisma } from "../../../lib/server/db";
import { appendLeadToSheet } from "../../../lib/server/integrations/google-sheets";
import { validateCsrf } from "../../../lib/server/security/csrf";
import { buildRateLimitKey, checkRateLimit, getClientIp, hashIdentifier } from "../../../lib/server/security/rate-limit";
import { leadSchema } from "../../../lib/server/validation/lead";

const MAX_LEADS_PER_WINDOW = 3;
const LEAD_WINDOW_MINUTES = 30;
const LEADS_RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const LEADS_RATE_LIMIT_MAX_REQUESTS = 20;

export async function POST(req: Request) {
  if (!validateCsrf(req)) {
    return NextResponse.json({ message: "CSRF invalido" }, { status: 403 });
  }

  const ip = getClientIp(req);
  const ipRate = checkRateLimit({
    key: buildRateLimitKey(["leads-ip", ip]),
    limit: LEADS_RATE_LIMIT_MAX_REQUESTS,
    windowMs: LEADS_RATE_LIMIT_WINDOW_MS,
  });

  if (!ipRate.allowed) {
    return NextResponse.json(
      { message: "Muitas tentativas. Tente novamente em instantes." },
      { status: 429, headers: { "Retry-After": String(ipRate.retryAfterSec) } },
    );
  }

  const rawBody = await req.json().catch(() => null);
  const parsedBody = leadSchema.safeParse(rawBody);

  if (!parsedBody.success) {
    return NextResponse.json({ message: "Payload invalido" }, { status: 400 });
  }

  const email = parsedBody.data.professionalEmail.toLowerCase();
  const emailRate = checkRateLimit({
    key: buildRateLimitKey(["leads-email", hashIdentifier(email)]),
    limit: MAX_LEADS_PER_WINDOW,
    windowMs: LEAD_WINDOW_MINUTES * 60 * 1000,
  });

  if (!emailRate.allowed) {
    return NextResponse.json(
      {
        message:
          "Limite de envios atingido. Aguarde 30 minutos para enviar novamente.",
      },
      { status: 429, headers: { "Retry-After": String(emailRate.retryAfterSec) } },
    );
  }

  const windowStart = new Date(Date.now() - LEAD_WINDOW_MINUTES * 60 * 1000);

  const recentLeadsCount = await prisma.lead.count({
    where: {
      email,
      createdAt: {
        gte: windowStart,
      },
    },
  });

  if (recentLeadsCount >= MAX_LEADS_PER_WINDOW) {
    return NextResponse.json(
      {
        message:
          "Limite de envios atingido. Aguarde 30 minutos para enviar novamente.",
      },
      { status: 429 }
    );
  }

  const lead = await prisma.lead.create({
    data: {
      fullName: parsedBody.data.fullName,
      email,
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

  void appendLeadToSheet({
    fullName: parsedBody.data.fullName,
    email,
    phone: parsedBody.data.whatsapp,
    company: parsedBody.data.companyName,
    taxRegime: parsedBody.data.taxRegime,
    message: parsedBody.data.needDetails || null,
    source: `service:${parsedBody.data.service};challenge:${parsedBody.data.challenge};cnpj:${parsedBody.data.cnpj}`,
    createdAt: new Date(),
  }).catch((err: unknown) => {
    console.error("[google-sheets] sync error:", err);
  });

  return NextResponse.json({ id: lead.id }, { status: 201 });
}
