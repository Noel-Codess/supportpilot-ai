import { describe, expect, it } from "vitest";
import { FixtureOrderRepository } from "@/lib/repositories/orders";
import { InMemoryTicketRepository } from "@/lib/repositories/tickets";
import { createSupportTicket } from "@/lib/tools/create-support-ticket";

function context() {
  return {
    customerId: "mock-customer-001",
    orders: new FixtureOrderRepository(),
    tickets: new InMemoryTicketRepository(),
  };
}

describe("createSupportTicket", () => {
  it("persists and returns a real ticket record", async () => {
    const result = await createSupportTicket(
      { orderId: "ORD-1001", category: "damaged_item", description: "The backpack buckle arrived broken." },
      context(),
    );
    expect(result).toMatchObject({ created: true, status: "open", duplicate: false });
    if (result.created) expect(result.ticketId).toMatch(/^TKT-/);
  });

  it.each([
    { orderId: "ORD-1001", category: "invalid", description: "A valid length description" },
    { orderId: "ORD-1001", category: "other" },
  ])("rejects invalid or missing ticket fields", async (input) => {
    await expect(createSupportTicket(input, context())).rejects.toThrow();
  });

  it("does not create a ticket for an unknown order", async () => {
    await expect(createSupportTicket(
      { orderId: "ORD-9999", category: "other", description: "Please help investigate this order." },
      context(),
    )).resolves.toEqual({ created: false, reason: "order_not_found" });
  });

  it("returns the persisted ticket for duplicate submissions", async () => {
    const repositories = context();
    const input = { orderId: "ORD-1002", category: "delivery_issue" as const, description: "Tracking has not updated for several days." };
    const first = await createSupportTicket(input, repositories);
    const second = await createSupportTicket(input, repositories);
    expect(second).toMatchObject({ created: true, duplicate: true });
    expect(second.created && first.created && second.ticketId).toBe(first.created && first.ticketId);
  });
});
