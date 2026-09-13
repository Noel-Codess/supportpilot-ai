import { randomUUID } from "node:crypto";

export type TicketCategory = "damaged_item" | "delivery_issue" | "refund_request" | "other";

export interface TicketRecord {
  id: string;
  customerId: string;
  orderId: string;
  category: TicketCategory;
  description: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
  idempotencyKey: string;
}

export interface CreateTicketRecord {
  customerId: string;
  orderId: string;
  category: TicketCategory;
  description: string;
  idempotencyKey: string;
}

export interface TicketRepository {
  create(input: CreateTicketRecord): Promise<TicketRecord>;
  findByIdempotencyKey(key: string): Promise<TicketRecord | null>;
}

export class InMemoryTicketRepository implements TicketRepository {
  private readonly tickets = new Map<string, TicketRecord>();

  async findByIdempotencyKey(key: string) {
    return [...this.tickets.values()].find((ticket) => ticket.idempotencyKey === key) ?? null;
  }

  async create(input: CreateTicketRecord) {
    const existing = await this.findByIdempotencyKey(input.idempotencyKey);
    if (existing) return existing;
    const ticket: TicketRecord = {
      ...input,
      id: `TKT-${randomUUID().slice(0, 8).toUpperCase()}`,
      status: "open",
      createdAt: new Date().toISOString(),
    };
    this.tickets.set(ticket.id, ticket);
    return ticket;
  }
}
