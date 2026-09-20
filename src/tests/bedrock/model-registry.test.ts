import { describe, expect, it } from "vitest";
import { getModelRegistry, resolveModel } from "@/lib/bedrock/model-registry";

describe("model registry", () => {
  it("keeps catalog verification distinct from runtime configuration", () => {
    const registry = getModelRegistry({});
    expect(registry).toHaveLength(5);
    expect(registry.every((model) => model.verification === "catalog_verified")).toBe(true);
    expect(registry.every((model) => model.configuredModelId === null)).toBe(true);
  });

  it("uses only the allowlisted model configuration slot", () => {
    const model = resolveModel("claude-opus-5-5", { BEDROCK_OPUS_55_MODEL_ID: "global.anthropic.claude-opus-5-5" });
    expect(model.configuredModelId).toBe("global.anthropic.claude-opus-5-5");
  });
});
