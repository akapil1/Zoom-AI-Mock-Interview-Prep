"use client";

import { useState } from "react";
import Link from "next/link";

const starterQuestions = [
  "Tell me about yourself.",
  "Why are you interested in this role?",
  "Describe a time you solved a challenging problem.",
];

export default function InterviewPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>(["", "", ""]);

  const currentQuestion = starterQuestions[currentIndex];

  const handleAnswerChange = (value: string) => {
    const updated = [...answers];
    updated[currentIndex] = value;
    setAnswers(updated);
  };

  const handleNext = () => {
    if (currentIndex < starterQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f7fb] px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl md:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#2D8CFF]">
          Step 3
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#1a1a1a]">
          Mock Interview
        </h1>

        <p className="mt-3 text-gray-600">
          Answer each question as if you were in a real interview.
        </p>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-[#f8fafc] p-6">
          <p className="text-sm font-medium text-[#2D8CFF]">
            Question {currentIndex + 1} of {starterQuestions.length}
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-[#111827]">
            {currentQuestion}
          </h2>

          <textarea
            value={answers[currentIndex]}
            onChange={(e) => handleAnswerChange(e.target.value)}
            placeholder="Type your answer here..."
            rows={10}
            className="mt-6 w-full resize-none rounded-xl border border-gray-300 p-4 text-sm outline-none transition focus:border-[#2D8CFF] focus:ring-2 focus:ring-[#2D8CFF]/20"
          />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {currentIndex < starterQuestions.length - 1 ? (
              <button
                onClick={handleNext}
                className="rounded-xl bg-[#2D8CFF] px-6 py-3 text-white transition hover:bg-[#1a73e8]"
              >
                Next Question
              </button>
            ) : (
              <Link
                href="/feedback"
                className="inline-flex items-center justify-center rounded-xl bg-[#2D8CFF] px-6 py-3 text-white transition hover:bg-[#1a73e8]"
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