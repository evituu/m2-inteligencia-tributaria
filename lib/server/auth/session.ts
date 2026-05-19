import { createHash } from "crypto";

import { prisma } from "../db";
import { env } from "../env";

function parseDurationToMs(duration: string) {
  const match = duration.trim().match(/^(\d+)([smhd])$/i);

  if (!match) {
    throw new Error("Invalid duration format");
  }

  const value = Number(match[1]);
  const unit = match[2].toLowerCase();

  const factor = unit === "s" ? 1000 : unit === "m" ? 60_000 : unit === "h" ? 3_600_000 : 86_400_000;

  return value * factor;
}

export function hashRefreshToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function getRefreshExpiryDate() {
  return new Date(Date.now() + parseDurationToMs(env.JWT_REFRESH_TTL));
}

export async function createRefreshSession(params: {
  userId: string;
  refreshToken: string;
  userAgent?: string;
  ipAddress?: string;
}) {
  return prisma.session.create({
    data: {
      userId: params.userId,
      refreshTokenHash: hashRefreshToken(params.refreshToken),
      userAgent: params.userAgent,
      ipAddress: params.ipAddress,
      expiresAt: getRefreshExpiryDate(),
    },
  });
}

export async function rotateRefreshSession(params: {
  sessionId: string;
  previousRefreshToken: string;
  nextRefreshToken: string;
}) {
  const session = await prisma.session.findUnique({
    where: { id: params.sessionId },
  });

  if (!session) {
    return null;
  }

  if (session.revokedAt || session.expiresAt.getTime() <= Date.now()) {
    return null;
  }

  if (session.refreshTokenHash !== hashRefreshToken(params.previousRefreshToken)) {
    return null;
  }

  return prisma.session.update({
    where: { id: params.sessionId },
    data: {
      refreshTokenHash: hashRefreshToken(params.nextRefreshToken),
      expiresAt: getRefreshExpiryDate(),
      revokedAt: null,
    },
  });
}

export async function revokeRefreshSession(sessionId: string) {
  return prisma.session.update({
    where: { id: sessionId },
    data: {
      revokedAt: new Date(),
    },
  });
}
