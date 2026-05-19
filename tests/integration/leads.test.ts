import { describe, expect, test, vi } from "vitest";

const prismaMock = {
  lead: {
    create: vi.fn(),
  },
};

vi.mock("@/lib/server/db", () => ({
  prisma: prismaMock,
}));

describe("leads route", () => {
  test("POST /api/leads persiste lead valido", async () => {
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
        needDetails: "Buscamos recuperar creditos tributarios.",
      }),
    });

    const res = await leadsRoute.POST(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.id).toBeTruthy();
  });
});
