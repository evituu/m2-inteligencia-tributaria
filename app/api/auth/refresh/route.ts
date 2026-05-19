import { NextResponse } from "next/server";

import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../../../lib/server/auth/jwt";
import { rotateRefreshSession } from "../../../../lib/server/auth/session";

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
  const refreshToken = req.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${REFRESH_COOKIE}=`))
    ?.split("=")[1];

  if (!refreshToken) {
    return NextResponse.json({ message: "Nao autenticado" }, { status: 401 });
  }

  try {
    const payload = await verifyRefreshToken(refreshToken);

    if (!payload.sid || !payload.sub || typeof payload.role !== "string") {
      return NextResponse.json({ message: "Token invalido" }, { status: 401 });
    }

    const nextRefreshToken = await signRefreshToken({
      sub: payload.sub,
      role: payload.role,
      sid: payload.sid,
    });

    const rotated = await rotateRefreshSession({
      sessionId: payload.sid,
      previousRefreshToken: refreshToken,
      nextRefreshToken,
    });

    if (!rotated) {
      return NextResponse.json({ message: "Sessao invalida" }, { status: 401 });
    }

    const accessToken = await signAccessToken({ sub: payload.sub, role: payload.role });

    const response = NextResponse.json(
      {
        user: {
          id: payload.sub,
          role: payload.role,
        },
      },
      { status: 200 },
    );

    response.cookies.set(ACCESS_COOKIE, accessToken, cookieOptions(15 * 60));
    response.cookies.set(REFRESH_COOKIE, nextRefreshToken, cookieOptions(30 * 24 * 60 * 60));

    return response;
  } catch {
    return NextResponse.json({ message: "Token invalido" }, { status: 401 });
  }
}
