import { AgentNotImplementedError, type AgentRequest, type AgentResponse, type BedrockConversePort } from "./types";

export interface SupportAgent {
  respond(request: AgentRequest): Promise<AgentResponse>;
}

/**
 * Candidate task: implement the Bedrock Converse orchestration loop.
 *
 * Acceptance criteria:
 * - Invoke only request.model.configuredModelId; never accept an arbitrary client model ID.
 * - Maintain multi-turn message history without mixing customer conversations.
 * - Retrieve policy evidence, keep source metadata, and pass untrusted passages as data.
 * - Expose only lookupOrder and createSupportTicket tool specifications.
 * - Validate every model-generated tool input with Zod before calling business code.
 * - Return tool results to the model until it produces a final response; cap loop iterations.
 * - Map access denied, throttling, timeout, unsupported model/capability, malformed output,
 *   and tool failures to safe application errors. Do not leak prompts, credentials, or stacks.
 * - Add ConverseStream only where request.model.capabilities.streaming is true.
 */
export class BedrockSupportAgent implements SupportAgent {
  constructor(private readonly bedrock: BedrockConversePort) {}

  async respond(request: AgentRequest): Promise<AgentResponse> {
    void this.bedrock;
    void request;
    throw new AgentNotImplementedError();
  }
}

export const placeholderAgent: SupportAgent = {
  async respond() {
    throw new AgentNotImplementedError();
  },
};
