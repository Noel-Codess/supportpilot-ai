import { describe, expect, it } from "vitest";
import { handleChatRequest } from "@/app/api/chat/route";
import { MAX_CHAT_MESSAGE_LENGTH } from "@/lib/validation/chat";

function request(body: string) {
  return new Request("http://localhost/api/chat", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });
}

describe("POST /api/chat", () => {
  it("rejects malformed JSON", async () => {
    const response = await handleChatRequest(request("{"));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ ok: false, error: { code: "INVALID_JSON" } });
  });

  it.each([
    ["empty", { message: "" }],
    ["oversized", { message: "x".repeat(MAX_CHAT_MESSAGE_LENGTH + 1) }],
    ["unknown fields", { message: "hello", modelId: "arbitrary-model" }],
  ])("rejects %s request bodies", async (_name, body) => {
    const response = await handleChatRequest(request(JSON.stringify(body)));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ ok: false, error: { code: "VALIDATION_ERROR" } });
  });

  it("reports an unavailable model configuration without using AWS", async () => {
    const response = await handleChatRequest(request(JSON.stringify({ message: "Where is my order?" })), { env: {} });
    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toMatchObject({ ok: false, error: { code: "MODEL_NOT_CONFIGURED" } });
  });

  it("returns the documented placeholder when a model is configured", async () => {
    const response = await handleChatRequest(request(JSON.stringify({ message: "What is your return policy?" })), {
      env: { BEDROCK_MODEL_ID: "global.anthropic.claude-sonnet-5-5" },
    });
    expect(response.status).toBe(501);
    await expect(response.json()).resolves.toMatchObject({ ok: false, error: { code: "NOT_IMPLEMENTED" } });
  });
});
