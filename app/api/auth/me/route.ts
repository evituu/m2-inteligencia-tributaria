import { NextResponse } from "next/server";

import { verifyAccessToken } from "../../../../lib/server/auth/jwt";

const ACCESS_COOKIE = "m2_access_token";

export async function GET(req: Request) {
  const accessToken = req.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ACCESS_COOKIE}=`))
    ?.split("=")[1];

  if (!accessToken) {
    return NextResponse.json({ message: "Nao autenticado" }, { status: 401 });
  }

  try {
    const payload = await verifyAccessToken(accessToken);

    return NextResponse.json(
      {
        user: {
          id: payload.sub,
          role: payload.role,
        },
      },
      { status: 200 },
    );
  } catch {
    return NextResponse.json({ message: "Token invalido" }, { status: 401 });
  }
}
