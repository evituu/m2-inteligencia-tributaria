import { NextResponse } from "next/server";
import { createCsrfToken, csrfCookieName } from "@/lib/server/security/csrf";

export async function GET() {
  const token = createCsrfToken();
  const response = NextResponse.json({ csrfToken: token }, { status: 200 });

  response.cookies.set(csrfCookieName(), token, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60,
  });

  return response;
}

