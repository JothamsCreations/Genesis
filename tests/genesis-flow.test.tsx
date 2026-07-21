import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GenesisFlow } from "@/components/genesis/genesis-flow";
import { generateMockBlueprint } from "@/lib/blueprint/mock-generator";
import type { BlueprintGenerationResult, IdeaInput } from "@/lib/blueprint/types";

function localResult(input: IdeaInput): BlueprintGenerationResult {
  return {
    blueprint: generateMockBlueprint(input),
    meta: {
      mode: "mock",
      fallbackReason: "demo_mode",
      notice: "Demo mode is active. Showing a deterministic local blueprint; no OpenAI request was made.",
    },
  };
}

function createGenerator() {
  return vi.fn(async (input: IdeaInput) => localResult(input));
}

function renderFlow(generator = createGenerator()) {
  return {
    generator,
    ...render(<GenesisFlow generationDelay={0} generator={generator} />),
  };
}

describe("GenesisFlow", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn().mockReturnValue("blob:genesis-build-pack"),
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: vi.fn(),
    });
  });

  it("introduces the product with one focused idea input", () => {
    renderFlow();

    expect(
      screen.getByRole("heading", { name: /turn an idea into a buildable product/i }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/describe what you want to create/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /shape the blueprint/i })).toBeInTheDocument();
    expect(screen.getByText(/demo mode stays local/i)).toBeInTheDocument();
    expect(screen.getByText(/demo-ready \/ openai-compatible/i)).toBeInTheDocument();
    expect(screen.getByText("Idea").closest("li")).toHaveAttribute("aria-current", "step");
  });

  it("shows an inline validation error for an underspecified idea", async () => {
    const user = userEvent.setup();
    renderFlow();

    await user.click(screen.getByRole("button", { name: /shape the blueprint/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(/at least 24 characters/i);
    expect(screen.getByLabelText(/describe what you want to create/i)).toHaveFocus();
  });

  it("generates and displays a complete blueprint from the sample idea", async () => {
    const user = userEvent.setup();
    renderFlow();

    await user.click(screen.getByRole("button", { name: /use sample idea/i }));
    await user.click(screen.getByRole("button", { name: /shape the blueprint/i }));

    expect(await screen.findByRole("heading", { name: /your genesis blueprint/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^purpose$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /premortem/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /foundations/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /ordered build plan/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /codex-ready task/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /specialist perspectives/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /completion review/i })).toBeInTheDocument();
    expect(screen.getAllByText(/demo blueprint/i).length).toBeGreaterThan(0);
    expect(screen.getByText("Review").closest("li")).toHaveAttribute("aria-current", "step");
  });

  it("copies the build pack and allows the builder to start again", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText");
    renderFlow();

    await user.click(screen.getByRole("button", { name: /use sample idea/i }));
    await user.click(screen.getByRole("button", { name: /shape the blueprint/i }));
    await screen.findByRole("heading", { name: /your genesis blueprint/i });

    await user.click(screen.getByRole("button", { name: /copy build pack/i }));
    await waitFor(() => expect(writeText).toHaveBeenCalledOnce());
    expect(screen.getByRole("status")).toHaveTextContent(/copied/i);

    await user.click(screen.getByRole("button", { name: /start another idea/i }));
    expect(screen.getByRole("button", { name: /shape the blueprint/i })).toBeInTheDocument();
  });

  it("reports a clipboard failure without losing the blueprint", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValueOnce(new Error("blocked"));
    renderFlow();

    await user.type(
      screen.getByLabelText(/describe what you want to create/i),
      "Create a calm weekly planning tool for independent designers and writers.",
    );
    await user.click(screen.getByRole("button", { name: /shape the blueprint/i }));
    await screen.findByRole("heading", { name: /your genesis blueprint/i });
    await user.click(screen.getByRole("button", { name: /copy build pack/i }));

    expect(await screen.findByRole("status")).toHaveTextContent(/copy failed/i);
    expect(screen.getByRole("heading", { name: /your genesis blueprint/i })).toBeInTheDocument();
  });

  it("shows the specialist work while the blueprint is being generated", async () => {
    const user = userEvent.setup();
    let completeGeneration!: (result: BlueprintGenerationResult) => void;
    const generator = vi.fn(
      () => new Promise<BlueprintGenerationResult>((resolve) => { completeGeneration = resolve; }),
    );
    renderFlow(generator);

    await user.click(screen.getByRole("button", { name: /use sample idea/i }));
    await user.click(screen.getByRole("button", { name: /shape the blueprint/i }));

    expect(screen.getByRole("heading", { name: /specialists are examining the idea/i })).toBeInTheDocument();
    expect(screen.getByText(/vision architect/i)).toBeInTheDocument();
    expect(screen.getByText(/risk strategist/i)).toBeInTheDocument();

    completeGeneration(localResult({
      idea: "Build a service that helps secondary-school teachers identify struggling students before examinations.",
      constraints: [],
    }));
    expect(await screen.findByRole("heading", { name: /your genesis blueprint/i })).toBeInTheDocument();
  });

  it("downloads the complete Codex build pack as Markdown", async () => {
    const user = userEvent.setup();
    const anchorClick = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
    renderFlow();

    await user.click(screen.getByRole("button", { name: /use sample idea/i }));
    await user.click(screen.getByRole("button", { name: /shape the blueprint/i }));
    await screen.findByRole("heading", { name: /your genesis blueprint/i });
    await user.click(screen.getByRole("button", { name: /download markdown/i }));

    expect(URL.createObjectURL).toHaveBeenCalledOnce();
    expect(anchorClick).toHaveBeenCalledOnce();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:genesis-build-pack");
  });
});
