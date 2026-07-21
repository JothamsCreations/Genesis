import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { VoiceIdeaInput } from "@/components/genesis/voice-idea-input";

type RecognitionResult = {
  isFinal: boolean;
  0: { transcript: string };
  length: number;
};

class MockSpeechRecognition {
  static latest: MockSpeechRecognition | null = null;

  continuous = false;
  interimResults = false;
  lang = "";
  onstart: ((event: Event) => void) | null = null;
  onresult: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  onend: ((event: Event) => void) | null = null;
  start = vi.fn(() => this.onstart?.(new Event("start")));
  stop = vi.fn(() => this.onend?.(new Event("end")));
  abort = vi.fn();

  constructor() {
    MockSpeechRecognition.latest = this;
  }

  emitResult(transcript: string, isFinal = true) {
    const result: RecognitionResult = { 0: { transcript }, isFinal, length: 1 };
    const event = Object.assign(new Event("result"), {
      resultIndex: 0,
      results: { 0: result, length: 1 },
    });
    this.onresult?.(event);
  }

  emitError(error: string) {
    this.onerror?.(Object.assign(new Event("error"), { error }));
  }
}

function setRecognitionConstructor(value: typeof MockSpeechRecognition | undefined) {
  Object.defineProperty(window, "webkitSpeechRecognition", {
    configurable: true,
    value,
  });
}

describe("VoiceIdeaInput", () => {
  beforeEach(() => {
    MockSpeechRecognition.latest = null;
    setRecognitionConstructor(MockSpeechRecognition);
  });

  afterEach(() => {
    setRecognitionConstructor(undefined);
  });

  it("starts and stops browser voice recognition from an accessible control", async () => {
    const user = userEvent.setup();
    render(<VoiceIdeaInput currentText="" maxLength={1200} onTranscript={vi.fn()} />);

    const startButton = await screen.findByRole("button", { name: /start voice input/i });
    await user.click(startButton);

    expect(MockSpeechRecognition.latest?.start).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: /stop voice input/i })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("status")).toHaveTextContent(/listening/i);

    await user.click(screen.getByRole("button", { name: /stop voice input/i }));
    expect(MockSpeechRecognition.latest?.stop).toHaveBeenCalledOnce();
  });

  it("appends recognized speech to an idea without exceeding the input limit", async () => {
    const user = userEvent.setup();
    const onTranscript = vi.fn();
    render(
      <VoiceIdeaInput
        currentText="Build a tool."
        maxLength={32}
        onTranscript={onTranscript}
      />,
    );

    await user.click(await screen.findByRole("button", { name: /start voice input/i }));
    act(() => MockSpeechRecognition.latest?.emitResult("It helps teachers understand every student."));

    expect(onTranscript).toHaveBeenLastCalledWith("Build a tool. It helps teachers");
  });

  it("explains microphone permission failures without blocking typed input", async () => {
    const user = userEvent.setup();
    render(<VoiceIdeaInput currentText="" maxLength={1200} onTranscript={vi.fn()} />);

    await user.click(await screen.findByRole("button", { name: /start voice input/i }));
    act(() => MockSpeechRecognition.latest?.emitError("not-allowed"));

    expect(screen.getByRole("status")).toHaveTextContent(/microphone permission was denied/i);
    expect(screen.getByRole("status")).toHaveTextContent(/keep typing/i);
  });

  it("shows a quiet fallback when the browser does not support speech recognition", async () => {
    setRecognitionConstructor(undefined);
    render(<VoiceIdeaInput currentText="" maxLength={1200} onTranscript={vi.fn()} />);

    expect(await screen.findByText(/voice input is unavailable in this browser/i)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /voice input/i })).not.toBeInTheDocument();
  });
});
