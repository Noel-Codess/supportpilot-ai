import { createHash } from "node:crypto";
import type { OrderRepository } from "@/lib/repositories/orders";
import type { TicketRepository } from "@/lib/repositories/tickets";
import { createSupportTicketInputSchema } from "./schemas";

export type CreateTicketResult =
  | { created: false; reason: "order_not_found" }
  | { created: true; ticketId: string; status: string; duplicate: boolean };

/**
 * Persists only after validating ownership. Production callers must derive customerId from
 * authenticated server context, never model output. The deterministic idempotency key prevents
 * immediate duplicate creation for the same customer/order/category/description payload.
 */
export async function createSupportTicket(
  rawInput: unknown,
  context: { customerId: string; orders: OrderRepository; tickets: TicketRepository },
): Promise<CreateTicketResult> {
  const input = createSupportTicketInputSchema.parse(rawInput);
  const order = await context.orders.findAuthorizedById(input.orderId, context.customerId);
  if (!order) return { created: false, reason: "order_not_found" };

  const idempotencyKey = createHash("sha256")
    .update(`${context.customerId}:${input.orderId}:${input.category}:${input.description}`)
    .digest("hex");
  const existing = await context.tickets.findByIdempotencyKey(idempotencyKey);
  if (existing) return { created: true, ticketId: existing.id, status: existing.status, duplicate: true };

  const ticket = await context.tickets.create({ ...input, customerId: context.customerId, idempotencyKey });
  return { created: true, ticketId: ticket.id, status: ticket.status, duplicate: false };
}
