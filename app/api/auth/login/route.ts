import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "../../../../lib/server/db";
import { signAccessToken, signRefreshToken } from "../../../../lib/server/auth/jwt";
import { verifyPassword } from "../../../../lib/server/auth/password";
import { createRefreshSession, hashRefreshToken } from "../../../../lib/server/auth/session";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const ACCESS_COOKIE = "m2_access_token";
const REFRESH_COOKIE = "m2_refresh_token";

function cookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}

export async function POST(req: Request) {
  const rawBody = await req.json().catch(() => null);
  const parsedBody = loginSchema.safeParse(rawBody);

  if (!parsedBody.success) {
    return NextResponse.json({ message: "Payload invalido" }, { status: 400 });
  }

  const email = parsedBody.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.isActive) {
    return NextResponse.json({ message: "Credenciais invalidas" }, { status: 401 });
  }

  const isPasswordValid = await verifyPassword(parsedBody.data.password, user.passwordHash);

  if (!isPasswordValid) {
    return NextResponse.json({ message: "Credenciais invalidas" }, { status: 401 });
  }

  const tempRefreshToken = randomUUID();
  const session = await createRefreshSession({
    userId: user.id,
    refreshToken: tempRefreshToken,
    userAgent: req.headers.get("user-agent") ?? undefined,
    ipAddress: req.headers.get("x-forwarded-for") ?? undefined,
  });

  const refreshToken = await signRefreshToken({
    sub: user.id,
    role: user.role,
    sid: session.id,
  });

  await prisma.session.update({
    where: { id: session.id },
    data: {
      refreshTokenHash: hashRefreshToken(refreshToken),
    },
  });

  const accessToken = await signAccessToken({ sub: user.id, role: user.role });

  const response = NextResponse.json(
    {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    },
    { status: 200 },
  );

  response.cookies.set(ACCESS_COOKIE, accessToken, cookieOptions(15 * 60));
  response.cookies.set(REFRESH_COOKIE, refreshToken, cookieOptions(30 * 24 * 60 * 60));

  return response;
}
