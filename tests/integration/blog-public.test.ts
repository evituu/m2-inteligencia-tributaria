import { beforeEach, describe, expect, test, vi } from "vitest";

const prismaMock = {
  post: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
  },
};

vi.mock("../../lib/server/db", () => ({
  prisma: prismaMock,
}));

describe("blog public routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("GET /api/blog/posts retorna apenas published", async () => {
    const postsRoute = await import("../../app/api/blog/posts/route");

    prismaMock.post.findMany.mockResolvedValue([
      {
        id: "post_1",
        slug: "post-publicado",
        title: "Post publicado",
        excerpt: "Resumo",
        coverImageUrl: "/cover.jpg",
        publishedAt: new Date("2026-05-01T00:00:00.000Z"),
        createdAt: new Date("2026-05-01T00:00:00.000Z"),
        category: { name: "Compliance" },
      },
    ]);

    const req = new Request("http://localhost/api/blog/posts", { method: "GET" });
    const res = await postsRoute.GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items).toHaveLength(1);
    expect(body.items[0].slug).toBe("post-publicado");
  });

  test("GET /api/blog/posts/[slug] retorna 404 quando nao encontra", async () => {
    const postBySlugRoute = await import("../../app/api/blog/posts/[slug]/route");

    prismaMock.post.findUnique.mockResolvedValue(null);

    const req = new Request("http://localhost/api/blog/posts/inexistente", { method: "GET" });
    const res = await postBySlugRoute.GET(req, { params: Promise.resolve({ slug: "inexistente" }) });
    const body = await res.json();

    expect(res.status).toBe(404);
    expect(body.message).toContain("nao encontrado");
  });
});
