import { jwtVerify, SignJWT } from "jose";

import { env } from "../env";

type TokenPayload = {
  sub: string;
  role: string;
  sid?: string;
  type: "access" | "refresh";
};

const accessSecret = new TextEncoder().encode(env.JWT_ACCESS_SECRET);
const refreshSecret = new TextEncoder().encode(env.JWT_REFRESH_SECRET);

export async function signAccessToken(payload: { sub: string; role: string }) {
  return new SignJWT({ role: payload.role, type: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(env.JWT_ACCESS_TTL)
    .sign(accessSecret);
}

export async function signRefreshToken(payload: { sub: string; role: string; sid: string }) {
  return new SignJWT({ role: payload.role, sid: payload.sid, type: "refresh" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(env.JWT_REFRESH_TTL)
    .sign(refreshSecret);
}

export async function verifyAccessToken(token: string) {
  const { payload } = await jwtVerify(token, accessSecret);

  if (payload.type !== "access") {
    throw new Error("Invalid token type");
  }

  return payload as unknown as TokenPayload;
}

export async function verifyRefreshToken(token: string) {
  const { payload } = await jwtVerify(token, refreshSecret);

  if (payload.type !== "refresh") {
    throw new Error("Invalid token type");
  }

  return payload as unknown as TokenPayload;
}
