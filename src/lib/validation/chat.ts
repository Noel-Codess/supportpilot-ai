import { z } from "zod";
import { MODEL_KEYS } from "@/lib/bedrock/model-registry";

export const MAX_CHAT_MESSAGE_LENGTH = 4_000;
export const MAX_CHAT_REQUEST_BYTES = 16_384;

export const chatRequestSchema = z
  .object({
    conversationId: z.string().uuid().optional(),
    message: z.string().trim().min(1, "Message is required").max(MAX_CHAT_MESSAGE_LENGTH),
    modelKey: z.enum(MODEL_KEYS).optional(),
  })
  .strict();

export type ChatRequest = z.infer<typeof chatRequestSchema>;
