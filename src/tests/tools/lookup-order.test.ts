import { describe, expect, it } from "vitest";
import { FixtureOrderRepository } from "@/lib/repositories/orders";
import { lookupOrder } from "@/lib/tools/lookup-order";

const context = { customerId: "mock-customer-001", orders: new FixtureOrderRepository() };

describe("lookupOrder", () => {
  it("returns permitted details for a valid order", async () => {
    await expect(lookupOrder({ orderId: "ORD-1002" }, context)).resolves.toMatchObject({
      found: true,
      order: { orderId: "ORD-1002", status: "in_transit", estimatedDeliveryDate: "2026-10-13" },
    });
  });

  it("returns a structured result for an unknown order", async () => {
    await expect(lookupOrder({ orderId: "ORD-9999" }, context)).resolves.toEqual({ found: false, orderId: "ORD-9999" });
  });

  it("does not expose an order to a different customer", async () => {
    await expect(lookupOrder({ orderId: "ORD-1001" }, { ...context, customerId: "someone-else" })).resolves.toEqual({
      found: false,
      orderId: "ORD-1001",
    });
  });
});
