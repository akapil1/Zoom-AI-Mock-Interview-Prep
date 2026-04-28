"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AIFeedbackItem = {
  question: string;
  answer: string;
  score: number;
  whatWentWell: string[];
  whatToImprove: string[];
  betterAnswer: string;
  nextTip: string;
};

type AIFeedback = {
  overallSummary: string;
  overallScore: number;
  strongestArea: string;
  weakestArea: string;
  items: AIFeedbackItem[];
};

function ScorePill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2">
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-base font-bold text-[#111827]">{value}/10</p>
    </div>
  );
}

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState<AIFeedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const generateFeedback = async () => {
      try {
        setLoading(true);
        setError("");

        const storedQuestions = sessionStorage.getItem("generatedQuestions");
        const storedAnswers = sessionStorage.getItem("interviewAnswers");
        const resume = sessionStorage.getItem("resumeText") || "";
        const jd = sessionStorage.getItem("jdText") || "";

        if (!storedQuestions || !storedAnswers) {
          throw new Error(
            "Interview data was not found. Please complete the interview first."
          );
        }

        const questions = JSON.parse(storedQuestions);
        const answers = JSON.parse(storedAnswers);

        const res = await fetch("/api/feedback", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            questions,
            answers,
            resume,
            jd,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to generate AI feedback.");
        }

        setFeedback(data.feedback);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while generating feedback."
        );
      } finally {
        setLoading(false);
      }
    };

    generateFeedback();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f4f7fb] px-4 py-6">
        <div className="mx-auto w-full max-w-[420px] rounded-[24px] bg-white p-6 text-center shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#2D8CFF]">
            Step 3
          </p>
          <h1 className="mt-3 text-xl font-bold text-[#111827]">
            Generating AI Feedback...
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            Your interview answers are being reviewed by the AI coach.
          </p>

          <div className="mt-6 h-2 w-full overflow-hidden rounded-full bg-gray-100">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-[#2D8CFF]" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !feedback) {
    return (
      <main className="min-h-screen bg-[#f4f7fb] px-4 py-6">
        <div className="mx-auto w-full max-w-[420px] rounded-[24px] bg-white p-6 shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-wide text-red-500">
            Feedback Error
          </p>
          <h1 className="mt-3 text-xl font-bold text-[#111827]">
            Could not generate feedback
          </h1>
          <p className="mt-3 text-sm leading-6 text-gray-600">
            {error || "Please try again."}
          </p>

          <Link
            href="/upload"
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#2D8CFF] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1a73e8]"
          >
            Try Another Interview
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f7fb] px-3 py-3">
      <div className="mx-auto w-full max-w-[420px] rounded-[24px] bg-white p-4 shadow-lg sm:p-5">
        <div className="border-b border-gray-100 pb-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2D8CFF]">
            Step 3
          </p>

          <h1 className="mt-2 text-xl font-bold leading-tight text-[#111827]">
            AI Interview Feedback
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Review your AI-generated coaching feedback, scores, and stronger sample answers.
          </p>
        </div>

        <section className="mt-4 rounded-2xl border border-gray-200 bg-[#f8fafc] p-4">
          <h2 className="text-base font-bold text-[#111827]">
            Overall Summary
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-700">
            {feedback.overallSummary}
          </p>

          <div className="mt-4">
            <ScorePill label="Overall Score" value={feedback.overallScore} />
          </div>

          <div className="mt-4 space-y-2">
            <div className="rounded-xl border border-green-200 bg-green-50 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-green-700">
                Strongest Area
              </p>
              <p className="mt-1 text-sm font-semibold text-[#111827]">
                {feedback.strongestArea}
              </p>
            </div>

            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-yellow-700">
                Weakest Area
              </p>
              <p className="mt-1 text-sm font-semibold text-[#111827]">
                {feedback.weakestArea}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-5 space-y-4">
          {feedback.items.map((item, index) => (
            <div
              key={`feedback-item-${index}`}
              className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-[#2D8CFF]">
                Question {index + 1}
              </p>

              <h2 className="mt-2 text-base font-bold leading-6 text-[#111827]">
                {item.question}
              </h2>

              <div className="mt-4">
                <ScorePill label="Answer Score" value={item.score} />
              </div>

              <div className="mt-4 rounded-xl bg-[#f8fafc] p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                  Your Answer
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                  {item.answer || "No answer captured."}
                </p>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-green-200 bg-green-50 p-3">
                  <h3 className="text-sm font-semibold text-green-700">
                    What Went Well
                  </h3>
                  <div className="mt-2 space-y-2 text-sm leading-6 text-gray-700">
                    {item.whatWentWell.map((point, i) => (
                      <p key={`went-well-${index}-${i}`}>• {point}</p>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-3">
                  <h3 className="text-sm font-semibold text-yellow-700">
                    What To Improve
                  </h3>
                  <div className="mt-2 space-y-2 text-sm leading-6 text-gray-700">
                    {item.whatToImprove.map((point, i) => (
                      <p key={`improve-${index}-${i}`}>• {point}</p>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">
                  <h3 className="text-sm font-semibold text-blue-700">
                    Next Attempt Tip
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {item.nextTip}
                  </p>
                </div>

                <div className="rounded-xl border border-purple-200 bg-purple-50 p-3">
                  <h3 className="text-sm font-semibold text-purple-700">
                    Stronger Sample Answer
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-gray-700">
                    {item.betterAnswer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <div className="mt-5 flex flex-col gap-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#2D8CFF] hover:text-[#2D8CFF]"
          >
            Back to Home
          </Link>

          <Link
            href="/upload"
            className="inline-flex items-center justify-center rounded-xl bg-[#2D8CFF] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#1a73e8]"
          >
            Try Another Interview
          </Link>
        </div>
      </div>
    </main>
  );
}