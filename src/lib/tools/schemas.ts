import { z } from "zod";

export const orderIdSchema = z.string().trim().regex(/^ORD-\d{4}$/, "Order ID must look like ORD-1001");

export const lookupOrderInputSchema = z.object({ orderId: orderIdSchema }).strict();

export const ticketCategorySchema = z.enum([
  "damaged_item",
  "delivery_issue",
  "refund_request",
  "other",
]);

export const createSupportTicketInputSchema = z
  .object({
    orderId: orderIdSchema,
    category: ticketCategorySchema,
    description: z.string().trim().min(10).max(1_000),
  })
  .strict();
