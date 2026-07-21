import { generateMockBlueprint } from "./mock-generator";
import { ideaInputSchema, productBlueprintSchema } from "./schema";
import type { BlueprintGenerationResult, IdeaInput } from "./types";
import { validateBlueprintSemantics } from "./validate-semantics";

export const DEFAULT_OPENAI_MODEL = "gpt-5.6-sol";

export type BlueprintRequester = (options: {
  apiKey: string;
  input: IdeaInput;
  model: string;
}) => Promise<{ payload: unknown; requestId?: string }>;

type GenerationOptions = {
  aiMode?: "auto" | "mock" | "live";
  apiKey?: string;
  model?: string;
  requester?: BlueprintRequester;
};

type FallbackReason = NonNullable<BlueprintGenerationResult["meta"]["fallbackReason"]>;

const fallback = (
  input: IdeaInput,
  fallbackReason: FallbackReason,
  notice: string,
): BlueprintGenerationResult => ({
  blueprint: generateMockBlueprint(input),
  meta: { mode: "mock", fallbackReason, notice },
});

function resolveAiMode(value: string | undefined): "auto" | "mock" | "live" {
  return value === "mock" || value === "live" ? value : "auto";
}

function isQuotaError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const candidate = error as { status?: unknown; code?: unknown; error?: { code?: unknown } };
  return candidate.status === 429
    || candidate.code === "insufficient_quota"
    || candidate.error?.code === "insufficient_quota";
}

async function defaultRequester(options: Parameters<BlueprintRequester>[0]) {
  const { requestOpenAIBlueprint } = await import("./openai-requester");
  return requestOpenAIBlueprint(options);
}

export async function generateBlueprint(
  rawInput: IdeaInput,
  options: GenerationOptions = {},
): Promise<BlueprintGenerationResult> {
  const input = ideaInputSchema.parse(rawInput);
  const aiMode = options.aiMode ?? resolveAiMode(process.env.GENESIS_AI_MODE);
  const apiKey = options.apiKey?.trim() ?? process.env.OPENAI_API_KEY?.trim() ?? "";
  const model = options.model ?? process.env.OPENAI_MODEL ?? DEFAULT_OPENAI_MODEL;

  if (aiMode === "mock") {
    return fallback(
      input,
      "demo_mode",
      "Demo mode is active. Showing a deterministic local blueprint; no OpenAI request was made.",
    );
  }

  if (!apiKey) {
    return fallback(
      input,
      "missing_api_key",
      "The OpenAI API key is not configured. Showing the deterministic local blueprint.",
    );
  }

  try {
    const response = await (options.requester ?? defaultRequester)({ apiKey, input, model });
    const parsed = productBlueprintSchema.safeParse(response.payload);

    if (!parsed.success) {
      return fallback(
        input,
        "invalid_output",
        "The live response could not be validated. Showing the deterministic local blueprint instead.",
      );
    }

    const semanticResult = validateBlueprintSemantics(parsed.data);
    if (!semanticResult.valid) {
      return fallback(
        input,
        "invalid_dependencies",
        "The live response failed dependency integrity checks. Showing the deterministic local blueprint instead.",
      );
    }

    return {
      blueprint: { ...parsed.data, intake: input },
      meta: { mode: "openai", model, requestId: response.requestId },
    };
  } catch (error) {
    if (isQuotaError(error)) {
      return fallback(
        input,
        "quota_unavailable",
        "OpenAI quota is unavailable. Showing the deterministic local blueprint instead.",
      );
    }

    return fallback(
      input,
      "request_failed",
      "Live analysis was unavailable. Showing the deterministic local blueprint instead.",
    );
  }
}
