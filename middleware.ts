import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const ACCESS_COOKIE = "m2_access_token";
const LOGIN_PATH = "/admin/login";

function unauthorized(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/admin")) {
    return NextResponse.json({ message: "Nao autorizado" }, { status: 401 });
  }

  const loginUrl = new URL(LOGIN_PATH, req.url);
  loginUrl.searchParams.set("next", req.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === LOGIN_PATH) {
    return NextResponse.next();
  }

  const token = req.cookies.get(ACCESS_COOKIE)?.value;

  if (!token) {
    return unauthorized(req);
  }

  const secret = process.env.JWT_ACCESS_SECRET;

  if (!secret || secret.length < 32) {
    return unauthorized(req);
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));

    if (payload.type !== "access" || payload.role !== "admin") {
      return unauthorized(req);
    }

    return NextResponse.next();
  } catch {
    return unauthorized(req);
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
