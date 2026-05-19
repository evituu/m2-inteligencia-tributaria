import { beforeEach, describe, expect, test, vi } from "vitest";
import { clearRateLimitBuckets } from "../../lib/server/security/rate-limit";

process.env.DATABASE_URL ??= "postgresql://user:pass@127.0.0.1:5432/m2_db";
process.env.JWT_ACCESS_SECRET ??= "12345678901234567890123456789012";
process.env.JWT_REFRESH_SECRET ??= "abcdefghijklmnopqrstuvwxyz123456";
process.env.JWT_ACCESS_TTL ??= "15m";
process.env.JWT_REFRESH_TTL ??= "30d";

const prismaMock = {
  user: { findUnique: vi.fn() },
  session: { create: vi.fn(), update: vi.fn() },
  lead: { count: vi.fn(), create: vi.fn() },
  newsletterSubscriber: { upsert: vi.fn() },
  post: { create: vi.fn() },
};

vi.mock("../../lib/server/db", () => ({
  prisma: prismaMock,
}));

describe("security protections", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clearRateLimitBuckets();
  });

  test("POST /api/auth/login retorna 403 sem csrf", async () => {
    const loginRoute = await import("../../app/api/auth/login/route");

    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "198.51.100.10" },
      body: JSON.stringify({ email: "admin@empresa.com", password: "12345678" }),
    });

    const res = await loginRoute.POST(req);
    expect(res.status).toBe(403);
  });

  test("POST /api/leads retorna 403 sem csrf", async () => {
    const leadsRoute = await import("../../app/api/leads/route");
    prismaMock.lead.create.mockResolvedValue({ id: "lead_1" });

    const req = new Request("http://localhost/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: "Maria da Silva",
        companyName: "Empresa XPTO",
        cnpj: "12.345.678/0001-90",
        whatsapp: "(11) 99999-9999",
        professionalEmail: "maria@empresa.com.br",
        taxRegime: "Lucro Presumido",
        service: "Exclusao do ICMS do PIS/COFINS",
        challenge: "Nao sei se tenho direito a creditos",
      }),
    });

    const res = await leadsRoute.POST(req);

    expect(res.status).toBe(403);
  });

  test("POST /api/newsletter/subscribe retorna 429 quando excede rate limit", async () => {
    const newsletterRoute = await import("../../app/api/newsletter/subscribe/route");
    prismaMock.newsletterSubscriber.upsert.mockResolvedValue({
      id: "sub_1",
      email: "contato@empresa.com.br",
      status: "subscribed",
    });

    for (let i = 0; i < 10; i += 1) {
      await newsletterRoute.POST(
        new Request("http://localhost/api/newsletter/subscribe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-forwarded-for": "198.51.100.77",
            "x-csrf-token": "csrf123",
            Cookie: "m2_csrf_token=csrf123",
          },
          body: JSON.stringify({ email: "contato@empresa.com.br" }),
        }),
      );
    }

    const blockedRes = await newsletterRoute.POST(
      new Request("http://localhost/api/newsletter/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forwarded-for": "198.51.100.77",
          "x-csrf-token": "csrf123",
          Cookie: "m2_csrf_token=csrf123",
        },
        body: JSON.stringify({ email: "contato@empresa.com.br" }),
      }),
    );

    expect(blockedRes.status).toBe(429);
  });

  test("POST /api/admin/posts retorna 403 sem csrf", async () => {
    const postsRoute = await import("../../app/api/admin/posts/route");

    const req = new Request("http://localhost/api/admin/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": "198.51.100.30",
      },
      body: JSON.stringify({
        title: "Post teste",
        slug: "post-teste",
        content: "Conteudo",
        authorId: "author_1",
      }),
    });

    const res = await postsRoute.POST(req);
    expect(res.status).toBe(403);
  });
});
