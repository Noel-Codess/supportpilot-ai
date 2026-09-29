import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { placeholderAgent, type SupportAgent } from "@/lib/bedrock/agent";
import { resolveModel, type Environment } from "@/lib/bedrock/model-registry";
import { AgentNotImplementedError } from "@/lib/bedrock/types";
import { chatRequestSchema, MAX_CHAT_REQUEST_BYTES } from "@/lib/validation/chat";
import type { ApiResponse } from "@/types";

function errorResponse(code: string, message: string, status: number, retryable = false) {
  return NextResponse.json<ApiResponse<never>>({ ok: false, error: { code, message, retryable } }, { status });
}

export async function handleChatRequest(
  request: Request,
  dependencies: { agent?: SupportAgent; env?: Environment } = {},
) {
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_CHAT_REQUEST_BYTES) {
    return errorResponse("REQUEST_TOO_LARGE", "Request body exceeds the 16 KB limit.", 413);
  }

  let body: unknown;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_CHAT_REQUEST_BYTES) {
      return errorResponse("REQUEST_TOO_LARGE", "Request body exceeds the 16 KB limit.", 413);
    }
    body = JSON.parse(rawBody);
  } catch {
    return errorResponse("INVALID_JSON", "Request body must be valid JSON.", 400);
  }

  try {
    const input = chatRequestSchema.parse(body);
    const model = resolveModel(input.modelKey, dependencies.env ?? process.env);
    if (!model.configuredModelId) {
      return errorResponse(
        "MODEL_NOT_CONFIGURED",
        `${model.displayName} is catalog-verified but not configured for this environment. Add its server-side model or inference profile ID.`,
        503,
      );
    }
    const result = await (dependencies.agent ?? placeholderAgent).respond({ ...input, model });
    return NextResponse.json<ApiResponse<typeof result>>({ ok: true, data: result });
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse("VALIDATION_ERROR", error.issues[0]?.message ?? "Invalid request.", 400);
    }
    if (error instanceof AgentNotImplementedError) {
      return errorResponse(
        "NOT_IMPLEMENTED",
        "The Bedrock support agent is intentionally not implemented in this starter. Complete src/lib/bedrock/agent.ts to enable responses.",
        501,
      );
    }
    return errorResponse("INTERNAL_ERROR", "Support is temporarily unavailable. Please try again later.", 500, true);
  }
}

export async function POST(request: Request) {
  return handleChatRequest(request);
}
