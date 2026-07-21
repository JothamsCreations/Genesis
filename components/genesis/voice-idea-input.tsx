"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type SpeechAlternative = { transcript: string };
type SpeechResult = {
  readonly [index: number]: SpeechAlternative;
  readonly isFinal: boolean;
  readonly length: number;
};
type SpeechResultList = {
  readonly [index: number]: SpeechResult;
  readonly length: number;
};
type SpeechResultEvent = Event & {
  readonly resultIndex: number;
  readonly results: SpeechResultList;
};
type SpeechErrorEvent = Event & { readonly error: string };

type SpeechRecognitionInstance = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((event: Event) => void) | null;
  onresult: ((event: SpeechResultEvent) => void) | null;
  onerror: ((event: SpeechErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

type VoiceWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

type VoiceState = "idle" | "listening" | "captured" | "error" | "unavailable";

type VoiceIdeaInputProps = {
  currentText: string;
  maxLength: number;
  onTranscript: (text: string) => void;
};

const errorMessages: Record<string, string> = {
  "not-allowed": "Microphone permission was denied. Allow microphone access or keep typing.",
  "service-not-allowed": "Microphone permission was denied. Allow microphone access or keep typing.",
  "audio-capture": "No microphone was found. Connect one or keep typing.",
  "no-speech": "No speech was detected. Try again or keep typing.",
  network: "Voice recognition needs a network connection in this browser. You can keep typing.",
};

function getRecognitionConstructor() {
  const browserWindow = window as VoiceWindow;
  return browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition;
}

const subscribeToBrowserCapability = () => () => undefined;

function combineTranscript(baseText: string, spokenText: string, maxLength: number) {
  return [baseText.trim(), spokenText.trim()]
    .filter(Boolean)
    .join(" ")
    .slice(0, maxLength)
    .trimEnd();
}

export function VoiceIdeaInput({ currentText, maxLength, onTranscript }: VoiceIdeaInputProps) {
  const supportsVoiceInput = useSyncExternalStore(
    subscribeToBrowserCapability,
    () => Boolean(getRecognitionConstructor()),
    () => false,
  );
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [message, setMessage] = useState("");
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const baseTextRef = useRef("");
  const receivedSpeechRef = useRef(false);
  const endedWithErrorRef = useRef(false);

  useEffect(() => {
    return () => recognitionRef.current?.abort();
  }, []);

  function stopListening() {
    recognitionRef.current?.stop();
  }

  function startListening() {
    const Recognition = getRecognitionConstructor();
    if (!Recognition) {
      setVoiceState("unavailable");
      return;
    }

    const recognition = new Recognition();
    recognitionRef.current = recognition;
    baseTextRef.current = currentText;
    receivedSpeechRef.current = false;
    endedWithErrorRef.current = false;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = navigator.language || "en-US";

    recognition.onstart = () => {
      setVoiceState("listening");
      setMessage("Listening. Speak naturally, then select Stop when you are finished.");
    };

    recognition.onresult = (event) => {
      let spokenText = "";
      for (let index = 0; index < event.results.length; index += 1) {
        spokenText += `${event.results[index][0]?.transcript ?? ""} `;
      }
      if (!spokenText.trim()) return;
      receivedSpeechRef.current = true;
      onTranscript(combineTranscript(baseTextRef.current, spokenText, maxLength));
      setMessage("Listening. Your words are appearing in the idea field.");
    };

    recognition.onerror = (event) => {
      endedWithErrorRef.current = true;
      setVoiceState("error");
      setMessage(errorMessages[event.error] ?? "Voice input stopped unexpectedly. Try again or keep typing.");
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      if (endedWithErrorRef.current) return;
      if (receivedSpeechRef.current) {
        setVoiceState("captured");
        setMessage("Voice captured. Review the text before shaping the blueprint.");
      } else {
        setVoiceState("idle");
        setMessage("Voice input stopped. Select Speak idea to try again.");
      }
    };

    try {
      recognition.start();
    } catch {
      recognitionRef.current = null;
      setVoiceState("error");
      setMessage("Voice input could not start. Try again or keep typing.");
    }
  }

  if (!supportsVoiceInput || voiceState === "unavailable") {
    return (
      <p className="voice-unavailable" role="status">
        Voice input is unavailable in this browser. You can continue typing.
      </p>
    );
  }

  const listening = voiceState === "listening";

  return (
    <div className="voice-input-row">
      <button
        aria-describedby="voice-input-status"
        aria-label={listening ? "Stop voice input" : "Start voice input"}
        aria-pressed={listening}
        className={listening ? "voice-input-button listening" : "voice-input-button"}
        onClick={listening ? stopListening : startListening}
        type="button"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M12 15.5a4 4 0 0 0 4-4v-4a4 4 0 0 0-8 0v4a4 4 0 0 0 4 4Zm-7-4a7 7 0 0 0 14 0M12 18.5V22M8.5 22h7" />
        </svg>
        <span>{listening ? "Stop listening" : "Speak idea"}</span>
      </button>
      <p className={voiceState === "error" ? "voice-status error" : "voice-status"} id="voice-input-status" role="status">
        {message || "Use your microphone to describe the idea. You can edit the transcript before submitting."}
      </p>
    </div>
  );
}
