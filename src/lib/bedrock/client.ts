import { BedrockRuntimeClient } from "@aws-sdk/client-bedrock-runtime";

let client: BedrockRuntimeClient | undefined;

export function getBedrockClient() {
  const region = process.env.AWS_REGION?.trim();
  if (!region) throw new Error("AWS_REGION is not configured.");
  client ??= new BedrockRuntimeClient({ region });
  return client;
}
