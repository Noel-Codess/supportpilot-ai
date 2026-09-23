import type { BedrockConversePort } from "./types";

export class BedrockInvocationError extends Error {
  constructor(
    public readonly code: "ACCESS_DENIED" | "THROTTLED" | "TIMEOUT" | "MODEL_UNAVAILABLE" | "SERVICE_ERROR",
    message: string,
    public readonly retryable: boolean,
  ) {
    super(message);
    this.name = "BedrockInvocationError";
  }
}

/** Safe invocation boundary for the candidate's orchestration loop. */
export async function invokeConverse(client: BedrockConversePort, input: unknown) {
  try {
    return await client.converse(input);
  } catch (error) {
    const name = error instanceof Error ? error.name : "UnknownError";
    if (name === "AccessDeniedException") {
      throw new BedrockInvocationError("ACCESS_DENIED", "The configured AWS identity cannot access this model.", false);
    }
    if (name === "ThrottlingException") {
      throw new BedrockInvocationError("THROTTLED", "The model is busy. Retry after a short delay.", true);
    }
    if (name === "ModelNotReadyException" || name === "ResourceNotFoundException" || name === "ValidationException") {
      throw new BedrockInvocationError("MODEL_UNAVAILABLE", "The configured model is unavailable or invalid.", false);
    }
    if (name === "TimeoutError" || name === "AbortError") {
      throw new BedrockInvocationError("TIMEOUT", "The model request timed out.", true);
    }
    throw new BedrockInvocationError("SERVICE_ERROR", "Amazon Bedrock could not complete the request.", true);
  }
}
