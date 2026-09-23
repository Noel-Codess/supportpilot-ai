import { describe, expect, it, vi } from "vitest";
import { BedrockInvocationError, invokeConverse } from "@/lib/bedrock/invoke";

describe("invokeConverse", () => {
  it.each<[
    string,
    BedrockInvocationError["code"],
    boolean,
  ]>([
    ["AccessDeniedException", "ACCESS_DENIED", false],
    ["ThrottlingException", "THROTTLED", true],
    ["ModelNotReadyException", "MODEL_UNAVAILABLE", false],
    ["TimeoutError", "TIMEOUT", true],
  ])("maps mocked %s SDK errors", async (name, code, retryable) => {
    const sdkError = new Error("sensitive upstream detail");
    sdkError.name = name;
    const client = { converse: vi.fn().mockRejectedValue(sdkError) };
    const result = invokeConverse(client, { modelId: "configured-id" });
    await expect(result).rejects.toMatchObject({ code, retryable } satisfies Partial<BedrockInvocationError>);
    await expect(result).rejects.not.toThrow("sensitive upstream detail");
  });
});
