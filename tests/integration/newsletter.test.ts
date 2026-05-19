import { beforeEach, describe, expect, test, vi } from "vitest";

const prismaMock = {
  newsletterSubscriber: {
    upsert: vi.fn(),
  },
};

vi.mock("../../lib/server/db", () => ({
  prisma: prismaMock,
}));

describe("newsletter subscribe route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("POST /api/newsletter/subscribe aceita email valido", async () => {
    const newsletterRoute = await import("../../app/api/newsletter/subscribe/route");

    prismaMock.newsletterSubscriber.upsert.mockResolvedValue({
      id: "sub_1",
      email: "contato@empresa.com.br",
      status: "subscribed",
    });

    const req = new Request("http://localhost/api/newsletter/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "contato@empresa.com.br" }),
    });

    const res = await newsletterRoute.POST(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.email).toBe("contato@empresa.com.br");
  });
});
