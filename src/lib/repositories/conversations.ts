import type { ChatMessage } from "@/types";

export interface ConversationRecord {
  id: string;
  customerId: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface ConversationRepository {
  findAuthorizedById(id: string, customerId: string): Promise<ConversationRecord | null>;
  save(conversation: ConversationRecord): Promise<void>;
}

export class InMemoryConversationRepository implements ConversationRepository {
  private readonly conversations = new Map<string, ConversationRecord>();

  async findAuthorizedById(id: string, customerId: string) {
    const conversation = this.conversations.get(id);
    return conversation?.customerId === customerId ? conversation : null;
  }

  async save(conversation: ConversationRecord) {
    this.conversations.set(conversation.id, structuredClone(conversation));
  }
}
