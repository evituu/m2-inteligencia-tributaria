import { randomUUID } from "crypto";

const CSRF_COOKIE = "m2_csrf_token";
const CSRF_HEADER = "x-csrf-token";

export function getCsrfTokenFromCookie(req: Request): string | null {
  const cookieHeader = req.headers.get("cookie");
  if (!cookieHeader) {
    return null;
  }

  const chunks = cookieHeader.split(";");
  for (const chunk of chunks) {
    const [rawName, ...rawValue] = chunk.trim().split("=");
    if (rawName === CSRF_COOKIE) {
      return rawValue.join("=") || null;
    }
  }

  return null;
}

export function validateCsrf(req: Request): boolean {
  const cookieToken = getCsrfTokenFromCookie(req);
  const headerToken = req.headers.get(CSRF_HEADER);

  return Boolean(cookieToken && headerToken && cookieToken === headerToken);
}

export function createCsrfToken() {
  return randomUUID();
}

export function csrfCookieName() {
  return CSRF_COOKIE;
}

export function csrfHeaderName() {
  return CSRF_HEADER;
}
