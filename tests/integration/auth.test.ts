import bcrypt from "bcryptjs";
import { beforeEach, describe, expect, test, vi } from "vitest";

process.env.DATABASE_URL ??= "postgresql://user:pass@127.0.0.1:5432/m2_db";
process.env.JWT_ACCESS_SECRET ??= "12345678901234567890123456789012";
process.env.JWT_REFRESH_SECRET ??= "abcdefghijklmnopqrstuvwxyz123456";
process.env.JWT_ACCESS_TTL ??= "15m";
process.env.JWT_REFRESH_TTL ??= "30d";

const prismaMock = {
  user: {
    findUnique: vi.fn(),
  },
  session: {
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
};

vi.mock("../../lib/server/db", () => ({
  prisma: prismaMock,
}));

describe("auth routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("POST /api/auth/login retorna 200 com credenciais validas", async () => {
    const loginRoute = await import("../../app/api/auth/login/route");
    const passwordHash = await bcrypt.hash("12345678", 10);

    prismaMock.user.findUnique.mockResolvedValue({
      id: "user_1",
      email: "admin@empresa.com",
      passwordHash,
      role: "admin",
      isActive: true,
    });
    prismaMock.session.create.mockResolvedValue({ id: "session_1" });
    prismaMock.session.update.mockResolvedValue({ id: "session_1" });

    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-csrf-token": "csrf123", Cookie: "m2_csrf_token=csrf123" },
      body: JSON.stringify({ email: "admin@empresa.com", password: "12345678" }),
    });

    const res = await loginRoute.POST(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.user.email).toBe("admin@empresa.com");
  });

  test("POST /api/auth/login retorna 401 com credencial invalida", async () => {
    const loginRoute = await import("../../app/api/auth/login/route");

    prismaMock.user.findUnique.mockResolvedValue(null);

    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-csrf-token": "csrf123", Cookie: "m2_csrf_token=csrf123" },
      body: JSON.stringify({ email: "admin@empresa.com", password: "errada123" }),
    });

    const res = await loginRoute.POST(req);

    expect(res.status).toBe(401);
  });
});
