import { expect, test } from "vitest";

test("db client module exports prisma instance", async () => {
  const mod = await import("../../lib/server/db");
  expect(mod.prisma).toBeDefined();
});
