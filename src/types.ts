export type MessageRole = "user" | "assistant";

export interface SourceCitation {
  id: string;
  title: string;
  path: string;
  excerpt: string;
}

export interface TicketSummary {
  ticketId: string;
  status: "open" | "in_progress" | "resolved";
  category: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
  citations?: SourceCitation[];
  ticket?: TicketSummary;
  state?: "complete" | "pending" | "error";
}

export interface ApiError {
  code: string;
  message: string;
  retryable: boolean;
}

export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: ApiError };
