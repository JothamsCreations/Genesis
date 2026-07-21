import type { IdeaInput, ProductBlueprint } from "./types";

export interface BlueprintGenerator {
  generate(input: IdeaInput): Promise<ProductBlueprint> | ProductBlueprint;
}

