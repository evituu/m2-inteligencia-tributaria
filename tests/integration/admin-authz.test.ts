import { beforeEach, describe, expect, test, vi } from "vitest";

process.env.DATABASE_URL ??= "postgresql://user:pass@127.0.0.1:5432/m2_db";
process.env.JWT_ACCESS_SECRET ??= "12345678901234567890123456789012";
process.env.JWT_REFRESH_SECRET ??= "abcdefghijklmnopqrstuvwxyz123456";
process.env.JWT_ACCESS_TTL ??= "15m";
process.env.JWT_REFRESH_TTL ??= "30d";

const prismaMock = {
  post: {
    create: vi.fn(),
  },
};

vi.mock("../../lib/server/db", () => ({
  prisma: prismaMock,
}));

describe("admin authz", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("POST /api/admin/posts sem auth retorna 401", async () => {
    const postsRoute = await import("../../app/api/admin/posts/route");

    const req = new Request("http://localhost/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "Post teste",
        slug: "post-teste",
        content: "Conteudo",
        authorId: "author_1",
      }),
    });

    const res = await postsRoute.POST(req);

    expect(res.status).toBe(401);
  });

  test("POST /api/admin/posts com auth admin retorna sucesso", async () => {
    const { signAccessToken } = await import("../../lib/server/auth/jwt");
    const postsRoute = await import("../../app/api/admin/posts/route");

    prismaMock.post.create.mockResolvedValue({
      id: "post_1",
      title: "Post teste",
      slug: "post-teste",
      status: "draft",
      createdAt: new Date("2026-05-19T12:00:00.000Z"),
      updatedAt: new Date("2026-05-19T12:00:00.000Z"),
    });

    const token = await signAccessToken({ sub: "user_1", role: "admin" });

    const req = new Request("http://localhost/api/admin/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `m2_access_token=${token}`,
      },
      body: JSON.stringify({
        title: "Post teste",
        slug: "post-teste",
        content: "Conteudo",
        authorId: "author_1",
      }),
    });

    const res = await postsRoute.POST(req);

    expect(res.status).toBe(201);
  });
});
