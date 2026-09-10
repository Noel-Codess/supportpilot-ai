import type { OrderRepository } from "@/lib/repositories/orders";
import { lookupOrderInputSchema } from "./schemas";

export type LookupOrderResult =
  | { found: false; orderId: string }
  | {
      found: true;
      order: {
        orderId: string;
        status: string;
        estimatedDeliveryDate: string;
        carrier: string | null;
        items: { name: string; quantity: number }[];
      };
    };

/** Candidate-safe business operation. The agent must still implement the validated tool wrapper. */
export async function lookupOrder(
  rawInput: unknown,
  context: { customerId: string; orders: OrderRepository },
): Promise<LookupOrderResult> {
  const { orderId } = lookupOrderInputSchema.parse(rawInput);
  const order = await context.orders.findAuthorizedById(orderId, context.customerId);
  if (!order) return { found: false, orderId };
  return {
    found: true,
    order: {
      orderId: order.id,
      status: order.status,
      estimatedDeliveryDate: order.estimatedDeliveryDate,
      carrier: order.carrier,
      items: order.items,
    },
  };
}
