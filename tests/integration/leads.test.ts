import { beforeEach, describe, expect, test, vi } from "vitest";

const prismaMock = {
  lead: {
    count: vi.fn(),
    create: vi.fn(),
  },
};

vi.mock("../../lib/server/db", () => ({
  prisma: prismaMock,
}));

describe("leads route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("POST /api/leads persiste lead valido", async () => {
    const leadsRoute = await import("../../app/api/leads/route");

    prismaMock.lead.count.mockResolvedValue(0);
    prismaMock.lead.create.mockResolvedValue({ id: "lead_1" });

    const req = new Request("http://localhost/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-csrf-token": "csrf123", Cookie: "m2_csrf_token=csrf123" },
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

  test("POST /api/leads bloqueia quando excede 3 envios em 30 minutos", async () => {
    const leadsRoute = await import("../../app/api/leads/route");

    prismaMock.lead.count.mockResolvedValue(3);

    const req = new Request("http://localhost/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-csrf-token": "csrf123", Cookie: "m2_csrf_token=csrf123" },
      body: JSON.stringify({
        fullName: "Joao da Silva",
        companyName: "Empresa XPTO",
        cnpj: "12.345.678/0001-90",
        whatsapp: "(11) 98888-7777",
        professionalEmail: "joao@empresa.com.br",
        taxRegime: "Lucro Presumido",
        service: "Exclusao do ICMS do PIS/COFINS",
        challenge: "Nao sei se tenho direito a creditos",
        needDetails: "Tentando novo envio.",
      }),
    });

    const res = await leadsRoute.POST(req);
    const body = await res.json();

    expect(res.status).toBe(429);
    expect(body.message).toContain("Limite de envios atingido");
    expect(prismaMock.lead.create).not.toHaveBeenCalled();
  });
});
