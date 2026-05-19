import { beforeEach, describe, expect, test, vi } from "vitest";

process.env.DATABASE_URL ??= "postgresql://user:pass@127.0.0.1:5432/m2_db";
process.env.JWT_ACCESS_SECRET ??= "12345678901234567890123456789012";
process.env.JWT_REFRESH_SECRET ??= "abcdefghijklmnopqrstuvwxyz123456";
process.env.JWT_ACCESS_TTL ??= "15m";
process.env.JWT_REFRESH_TTL ??= "30d";

const prismaMock = {
  post: {
    findMany: vi.fn(),
    count: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  author: {
    findFirst: vi.fn(),
    create: vi.fn(),
  },
};

vi.mock("../../lib/server/db", () => ({
  prisma: prismaMock,
}));

describe("admin posts contracts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("GET /api/admin/posts aplica filtros status e search", async () => {
    const { signAccessToken } = await import("../../lib/server/auth/jwt");
    const postsRoute = await import("../../app/api/admin/posts/route");

    prismaMock.post.findMany.mockResolvedValue([]);
    const token = await signAccessToken({ sub: "user_1", role: "admin" });

    const req = new Request("http://localhost/api/admin/posts?status=published&search=icms", {
      method: "GET",
      headers: { Cookie: `m2_access_token=${token}` },
    });

    const res = await postsRoute.GET(req);

    expect(res.status).toBe(200);
    expect(prismaMock.post.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: {
          status: "published",
          OR: [
            { title: { contains: "icms", mode: "insensitive" } },
            { slug: { contains: "icms", mode: "insensitive" } },
          ],
        },
      }),
    );
  });

  test("GET /api/admin/posts/metrics retorna contagens", async () => {
    const { signAccessToken } = await import("../../lib/server/auth/jwt");
    const metricsRoute = await import("../../app/api/admin/posts/metrics/route");

    prismaMock.post.count
      .mockResolvedValueOnce(8)
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(15);

    const token = await signAccessToken({ sub: "user_1", role: "admin" });

    const req = new Request("http://localhost/api/admin/posts/metrics", {
      method: "GET",
      headers: { Cookie: `m2_access_token=${token}` },
    });

    const res = await metricsRoute.GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body).toEqual({ published: 8, draft: 5, archived: 2, total: 15 });
  });

  test("POST /api/admin/posts retorna 409 quando slug já existe", async () => {
    const { signAccessToken } = await import("../../lib/server/auth/jwt");
    const postsRoute = await import("../../app/api/admin/posts/route");

    prismaMock.post.create.mockRejectedValue({ code: "P2002" });
    const token = await signAccessToken({ sub: "user_1", role: "admin" });

    const req = new Request("http://localhost/api/admin/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": "csrf123",
        Cookie: `m2_csrf_token=csrf123; m2_access_token=${token}`,
      },
      body: JSON.stringify({
        title: "Post teste",
        slug: "post-teste",
        content: "Conteudo",
        authorId: "author_1",
      }),
    });

    const res = await postsRoute.POST(req);

    expect(res.status).toBe(409);
  });

  test("PATCH /api/admin/posts/:id exige csrf", async () => {
    const { signAccessToken } = await import("../../lib/server/auth/jwt");
    const postByIdRoute = await import("../../app/api/admin/posts/[id]/route");
    const token = await signAccessToken({ sub: "user_1", role: "admin" });

    const req = new Request("http://localhost/api/admin/posts/post_1", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `m2_access_token=${token}`,
      },
      body: JSON.stringify({ title: "Novo titulo" }),
    });

    const res = await postByIdRoute.PATCH(req, { params: Promise.resolve({ id: "post_1" }) });

    expect(res.status).toBe(403);
  });

  test("PATCH /api/admin/posts/:id retorna 409 quando slug já existe", async () => {
    const { signAccessToken } = await import("../../lib/server/auth/jwt");
    const postByIdRoute = await import("../../app/api/admin/posts/[id]/route");

    prismaMock.post.update.mockRejectedValue({ code: "P2002" });
    const token = await signAccessToken({ sub: "user_1", role: "admin" });

    const req = new Request("http://localhost/api/admin/posts/post_1", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": "csrf123",
        Cookie: `m2_csrf_token=csrf123; m2_access_token=${token}`,
      },
      body: JSON.stringify({ slug: "slug-em-uso" }),
    });

    const res = await postByIdRoute.PATCH(req, { params: Promise.resolve({ id: "post_1" }) });

    expect(res.status).toBe(409);
  });

  test("DELETE /api/admin/posts/:id exige csrf", async () => {
    const { signAccessToken } = await import("../../lib/server/auth/jwt");
    const postByIdRoute = await import("../../app/api/admin/posts/[id]/route");
    const token = await signAccessToken({ sub: "user_1", role: "admin" });

    const req = new Request("http://localhost/api/admin/posts/post_1", {
      method: "DELETE",
      headers: {
        Cookie: `m2_access_token=${token}`,
      },
    });

    const res = await postByIdRoute.DELETE(req, { params: Promise.resolve({ id: "post_1" }) });

    expect(res.status).toBe(403);
  });
});
