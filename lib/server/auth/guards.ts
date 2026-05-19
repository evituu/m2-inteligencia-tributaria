import { NextResponse } from "next/server";

import { verifyAccessToken } from "./jwt";

const ACCESS_COOKIE = "m2_access_token";

type GuardResult =
  | { ok: true; user: { id: string; role: string } }
  | { ok: false; response: NextResponse };

function readCookieFromHeader(cookieHeader: string | null, name: string) {
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";").map((entry) => entry.trim());
  const target = cookies.find((entry) => entry.startsWith(`${name}=`));

  return target ? target.slice(name.length + 1) : null;
}

export async function requireAdminFromRequest(req: Request): Promise<GuardResult> {
  const token = readCookieFromHeader(req.headers.get("cookie"), ACCESS_COOKIE);

  if (!token) {
    return { ok: false, response: NextResponse.json({ message: "Nao autorizado" }, { status: 401 }) };
  }

  try {
    const payload = await verifyAccessToken(token);

    if (!payload.sub || payload.role !== "admin") {
      return { ok: false, response: NextResponse.json({ message: "Nao autorizado" }, { status: 401 }) };
    }

    return { ok: true, user: { id: String(payload.sub), role: String(payload.role) } };
  } catch {
    return { ok: false, response: NextResponse.json({ message: "Nao autorizado" }, { status: 401 }) };
  }
}
