import type { ModelDefinition, ModelKey } from "./types";

export const MODEL_KEYS = [
  "claude-opus-4-8",
  "claude-opus-5",
  "claude-opus-5-5",
  "claude-sonnet-5-5",
  "claude-haiku-5-5",
] as const;

const catalog: Record<
  ModelKey,
  Pick<ModelDefinition, "displayName" | "catalogModelId" | "envVar" | "verification" | "constraints">
> = {
  "claude-opus-4-8": {
    displayName: "Claude Opus 4.8",
    catalogModelId: "anthropic.claude-opus-4-8",
    envVar: "BEDROCK_OPUS_48_MODEL_ID",
    verification: "catalog_verified",
    constraints: ["Region and inference-profile availability must be checked for the deployment account."],
  },
  "claude-opus-5": {
    displayName: "Claude Opus 5",
    catalogModelId: "anthropic.claude-opus-5",
    envVar: "BEDROCK_OPUS_5_MODEL_ID",
    verification: "catalog_verified",
    constraints: ["Bedrock Runtime access is commonly provided through a geo or global inference profile."],
  },
  "claude-opus-5-5": {
    displayName: "Claude Opus 5.5",
    catalogModelId: "anthropic.claude-opus-5-5",
    envVar: "BEDROCK_OPUS_55_MODEL_ID",
    verification: "catalog_verified",
    constraints: ["Adaptive thinking is always enabled; feature and Region support can differ by endpoint."],
  },
  "claude-sonnet-5-5": {
    displayName: "Claude Sonnet 5.5",
    catalogModelId: "anthropic.claude-sonnet-5-5",
    envVar: "BEDROCK_SONNET_55_MODEL_ID",
    verification: "catalog_verified",
    constraints: ["Use the Bedrock Runtime endpoint for Converse and verify the selected profile's routing."],
  },
  "claude-haiku-5-5": {
    displayName: "Claude Haiku 5.5",
    catalogModelId: "anthropic.claude-haiku-5-5",
    envVar: "BEDROCK_HAIKU_55_MODEL_ID",
    verification: "catalog_verified",
    constraints: ["Use the Bedrock Runtime endpoint for Converse and verify account access."],
  },
};

export const DEFAULT_MODEL_KEY: ModelKey = "claude-sonnet-5-5";

export type Environment = Readonly<Record<string, string | undefined>>;

export function getModelRegistry(env: Environment = process.env): ModelDefinition[] {
  return MODEL_KEYS.map((key) => {
    const entry = catalog[key];
    const specific = env[entry.envVar]?.trim();
    const fallback = key === DEFAULT_MODEL_KEY ? env.BEDROCK_MODEL_ID?.trim() : undefined;
    return {
      key,
      ...entry,
      configuredModelId: specific || fallback || null,
      configurationSource: specific
        ? entry.envVar
        : fallback
          ? "BEDROCK_MODEL_ID"
          : "not_configured",
      capabilities: { converse: true, streaming: true, toolUse: true, vision: true },
    };
  });
}

export function resolveModel(key: ModelKey = DEFAULT_MODEL_KEY, env: Environment = process.env) {
  const model = getModelRegistry(env).find((candidate) => candidate.key === key);
  if (!model) throw new Error("Selected model is not allowlisted.");
  return model;
}

export function publicModelRegistry(env: Environment = process.env) {
  return getModelRegistry(env).map((model) => ({
    key: model.key,
    displayName: model.displayName,
    catalogModelId: model.catalogModelId,
    configuredModelId: model.configuredModelId,
    verification: model.verification,
    capabilities: model.capabilities,
    configurationSource: model.configurationSource,
    constraints: model.constraints,
  }));
}
