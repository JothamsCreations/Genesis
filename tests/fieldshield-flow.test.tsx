import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { GenesisFlow } from "@/components/genesis/genesis-flow";
import { generateMockBlueprint } from "@/lib/blueprint/mock-generator";
import type { BlueprintGenerationResult, IdeaInput } from "@/lib/blueprint/types";

function generator(input: IdeaInput): Promise<BlueprintGenerationResult> {
  return Promise.resolve({
    blueprint: generateMockBlueprint(input),
    meta: {
      mode: "mock",
      fallbackReason: "demo_mode",
      notice: "Deterministic competition demo.",
    },
  });
}

describe("FieldShield GENESIS journey", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn().mockReturnValue("blob:fieldshield-document"),
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: vi.fn(),
    });
  });

  it("clarifies the vague request, builds FieldShield, and reveals working evidence", async () => {
    const user = userEvent.setup();
    render(<GenesisFlow generationDelay={0} generator={generator} />);

    await user.click(screen.getByRole("button", { name: /run fieldshield demo/i }));

    expect(screen.getByRole("heading", { name: /genesis found the product beneath the request/i })).toBeInTheDocument();
    expect(screen.getByText(/640 questionnaire responses/i)).toBeInTheDocument();
    expect(screen.getByText(/KoboToolbox already handles questionnaire administration/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /shape the fieldshield blueprint/i }));

    expect(await screen.findByText("FieldShield", { exact: true })).toBeInTheDocument();
    expect(screen.getByText("Research Operations Agent", { exact: true })).toBeInTheDocument();
    expect(screen.getByText(/do not begin with the dashboard/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /seven-document build pack/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "PREMORTEM.md" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /field operations dashboard/i })).toBeInTheDocument();
    expect(screen.getByText(/427 of 640 responses/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /review Akinyele fieldwork/i }));
    expect(screen.getByText(/54 responses remaining/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /activate handover mode/i }));
    expect(screen.getByRole("status")).toHaveTextContent(/handover mode is active/i);
  });
});
