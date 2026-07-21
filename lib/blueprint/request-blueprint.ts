import { generateMockBlueprint } from "./mock-generator";
import { productBlueprintSchema } from "./schema";
import type { BlueprintGenerationResult, IdeaInput } from "./types";
import { validateBlueprintSemantics } from "./validate-semantics";

const localFallback = (
  input: IdeaInput,
  fallbackReason: NonNullable<BlueprintGenerationResult["meta"]["fallbackReason"]>,
  notice: string,
): BlueprintGenerationResult => ({
  blueprint: generateMockBlueprint(input),
  meta: { mode: "mock", fallbackReason, notice },
});

export async function requestBlueprint(input: IdeaInput): Promise<BlueprintGenerationResult> {
  let response: Response;

  try {
    response = await fetch("/api/blueprint", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
  } catch {
    return localFallback(
      input,
      "request_failed",
      "The analysis service could not be reached. Showing the deterministic local blueprint instead.",
    );
  }

  if (!response.ok) {
    return localFallback(
      input,
      "request_failed",
      "The analysis service could not complete the request. Showing the deterministic local blueprint instead.",
    );
  }

  let result: BlueprintGenerationResult;
  try {
    result = await response.json() as BlueprintGenerationResult;
  } catch {
    return localFallback(
      input,
      "invalid_output",
      "The blueprint response failed local validation. Showing the deterministic local blueprint instead.",
    );
  }

  const parsed = productBlueprintSchema.safeParse(result.blueprint);
  if (
    !parsed.success
    || !validateBlueprintSemantics(parsed.data).valid
    || !result.meta
    || !["openai", "mock"].includes(result.meta.mode)
  ) {
    return localFallback(
      input,
      "invalid_output",
      "The blueprint response failed local validation. Showing the deterministic local blueprint instead.",
    );
  }

  return { ...result, blueprint: parsed.data };
}
