import { describe, expect, it } from "vitest";
import { LocalPolicyRetriever } from "@/lib/knowledge/retrieve";

describe("LocalPolicyRetriever", () => {
  it("retrieves relevant passages from supplied policy documents", async () => {
    const passages = await new LocalPolicyRetriever().retrieve("How long do returns take?", { limit: 2 });
    expect(passages.length).toBeGreaterThan(0);
    expect(passages[0]).toMatchObject({ title: "Returns and refunds", path: "src/data/policies/returns.md" });
    expect(passages[0].content.toLowerCase()).toContain("return");
  });

  it("returns no evidence for unrelated claims", async () => {
    await expect(new LocalPolicyRetriever().retrieve("moon colony warranty")).resolves.toEqual([]);
  });
});
