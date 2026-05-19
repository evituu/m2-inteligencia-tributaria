import { NextResponse } from "next/server";

import { revokeRefreshSession } from "../../../../lib/server/auth/session";
import { verifyRefreshToken } from "../../../../lib/server/auth/jwt";

const ACCESS_COOKIE = "m2_access_token";
const REFRESH_COOKIE = "m2_refresh_token";

function clearCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  };
}

export async function POST(req: Request) {
  const refreshToken = req.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${REFRESH_COOKIE}=`))
    ?.split("=")[1];

  if (refreshToken) {
    try {
      const payload = await verifyRefreshToken(refreshToken);
      if (payload.sid) {
        await revokeRefreshSession(payload.sid);
      }
    } catch {
      // noop
    }
  }

  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.set(ACCESS_COOKIE, "", clearCookieOptions());
  response.cookies.set(REFRESH_COOKIE, "", clearCookieOptions());

  return response;
}
