import { createHash } from "crypto";

type RateLimitInput = {
  key: string;
  limit: number;
  windowMs: number;
};

type Bucket = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Bucket>();

function nowMs() {
  return Date.now();
}

export function clearRateLimitBuckets() {
  buckets.clear();
}

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const candidate = forwarded.split(",")[0]?.trim();
    if (candidate) {
      return candidate;
    }
  }

  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) {
    return realIp;
  }

  return "unknown";
}

export function buildRateLimitKey(parts: string[]): string {
  return parts.join("|");
}

export function hashIdentifier(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function checkRateLimit(input: RateLimitInput) {
  const timestamp = nowMs();
  const current = buckets.get(input.key);

  if (!current || current.resetAt <= timestamp) {
    const next: Bucket = {
      count: 1,
      resetAt: timestamp + input.windowMs,
    };
    buckets.set(input.key, next);

    return {
      allowed: true,
      remaining: input.limit - 1,
      retryAfterSec: Math.ceil(input.windowMs / 1000),
    };
  }

  if (current.count >= input.limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((current.resetAt - timestamp) / 1000)),
    };
  }

  current.count += 1;
  buckets.set(input.key, current);

  return {
    allowed: true,
    remaining: Math.max(0, input.limit - current.count),
    retryAfterSec: Math.max(1, Math.ceil((current.resetAt - timestamp) / 1000)),
  };
}
