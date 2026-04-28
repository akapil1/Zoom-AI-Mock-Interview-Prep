"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

export default function InterviewPage() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState<string[]>([]);
  const [interimTranscript, setInterimTranscript] = useState("");

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [error, setError] = useState("");

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const storedQuestions = sessionStorage.getItem("generatedQuestions");

    if (storedQuestions) {
      const parsedQuestions: string[] = JSON.parse(storedQuestions);
      setQuestions(parsedQuestions);
      setAnswers(new Array(parsedQuestions.length).fill(""));
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setSpeechSupported(false);
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setError("");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      setError(
        `Voice input error: ${event.error}. You can type your answer below instead.`
      );
    };

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let liveTranscript = "";

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0]?.transcript || "";

        if (result.isFinal) {
          finalTranscript += text + " ";
        } else {
          liveTranscript += text;
        }
      }

      if (finalTranscript.trim()) {
        setAnswers((prev) => {
          const updated = [...prev];
          const existing = updated[currentIndex] || "";
          updated[currentIndex] = `${existing} ${finalTranscript}`.trim();
          return updated;
        });
      }

      setInterimTranscript(liveTranscript);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [currentIndex]);

  const currentQuestion = questions[currentIndex] || "";
  const currentAnswer = answers[currentIndex] || "";

  const updateCurrentAnswer = (value: string) => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentIndex] = value;
      return updated;
    });
  };

  const speakQuestion = (text: string) => {
    if (!text || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (!currentQuestion) return;

    setInterimTranscript("");

    const timer = setTimeout(() => {
      speakQuestion(currentQuestion);
    }, 700);

    return () => clearTimeout(timer);
  }, [currentQuestion]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      recognitionRef.current?.stop();
    };
  }, []);

  const startListening = () => {
    if (!recognitionRef.current) {
      setError("Speech recognition is not available here. Please type your answer below.");
      return;
    }

    try {
      setInterimTranscript("");
      recognitionRef.current.start();
    } catch {
      setError("Microphone could not start. Please type your answer below instead.");
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  const saveAnswers = () => {
    sessionStorage.setItem("interviewAnswers", JSON.stringify(answers));
  };

  const handleNext = () => {
    stopListening();
    saveAnswers();

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleFinish = () => {
    stopListening();

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    saveAnswers();
  };

  if (questions.length === 0) {
    return (
      <main className="min-h-screen bg-[#f4f7fb] px-4 py-4">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-[#1a1a1a]">No interview loaded</h1>
          <p className="mt-3 text-gray-600">
            Please go back and start the interview first.
          </p>
          <Link
            href="/upload"
            className="mt-6 inline-flex rounded-xl bg-[#2D8CFF] px-6 py-3 text-white hover:bg-[#1a73e8]"
          >
            Go to Upload
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-6">
      <div className="mx-auto w-full max-w-[520px] rounded-2xl bg-white p-5 shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#2D8CFF]">
          Step 2
        </p>

        <h1 className="mt-2 text-2xl font-bold text-[#1a1a1a]">
          AI Mock Interview
        </h1>

        <p className="mt-3 text-gray-600">
          Listen to the question, then answer by voice or type your response below.
        </p>

        {!speechSupported && (
          <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            Voice input is not supported inside this browser environment. You can still
            complete the interview by typing your answer.
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-gray-200 bg-[#f8fafc] p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-[#2D8CFF]">
              Question {currentIndex + 1} of {questions.length}
            </p>

            <button
              type="button"
              onClick={() => speakQuestion(currentQuestion)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-[#2D8CFF] hover:text-[#2D8CFF]"
            >
              {isSpeaking ? "Speaking..." : "Repeat Question"}
            </button>
          </div>

          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-5">
            <p className="text-sm font-medium text-blue-700">
              Interviewer Question
            </p>
            <h2 className="mt-2 text-xl font-semibold text-[#111827]">
              {currentQuestion}
            </h2>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {!isListening ? (
              <button
                type="button"
                onClick={startListening}
                disabled={!speechSupported}
                className={`rounded-xl px-6 py-3 text-white transition ${
                  speechSupported
                    ? "bg-[#2D8CFF] hover:bg-[#1a73e8]"
                    : "cursor-not-allowed bg-gray-400 opacity-70"
                }`}
              >
                Start Speaking
              </button>
            ) : (
              <button
                type="button"
                onClick={stopListening}
                className="rounded-xl bg-red-500 px-6 py-3 text-white transition hover:bg-red-600"
              >
                Stop Recording
              </button>
            )}
          </div>

          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
            <p className="text-sm font-medium text-[#2D8CFF]">
              Answer
            </p>

            <textarea
              value={
                interimTranscript
                  ? `${currentAnswer} ${interimTranscript}`.trim()
                  : currentAnswer
              }
              onChange={(e) => {
                setInterimTranscript("");
                updateCurrentAnswer(e.target.value);
              }}
              placeholder="Type your answer here if voice input does not work inside Zoom..."
              className="mt-3 min-h-[180px] w-full resize-none rounded-xl border border-gray-200 bg-[#f8fafc] p-4 text-sm leading-7 text-gray-700 outline-none transition focus:border-[#2D8CFF] focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-2 text-xs text-gray-500">
              Your answer will be saved and used for AI feedback.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {currentIndex < questions.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-xl bg-[#111827] px-6 py-3 text-white transition hover:bg-[#1f2937]"
              >
                Next Question
              </button>
            ) : (
              <Link
                href="/feedback"
                onClick={handleFinish}
                className="inline-flex items-center justify-center rounded-xl bg-[#111827] px-6 py-3 text-white transition hover:bg-[#1f2937]"
              >
                Finish Interview
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}