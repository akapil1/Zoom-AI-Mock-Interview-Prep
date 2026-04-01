"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReviewPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<string[]>([]);

  useEffect(() => {
    const storedQuestions = sessionStorage.getItem("generatedQuestions");

    if (!storedQuestions) {
      router.push("/upload");
      return;
    }

    try {
      const parsed = JSON.parse(storedQuestions);
      setQuestions(parsed);
    } catch {
      router.push("/upload");
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-[#f4f7fb] px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl md:p-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#2D8CFF]">
            Step 2
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#1a1a1a]">
            Your Interview Questions
          </h1>
          <p className="mt-3 text-gray-600">
            These questions were generated based on your resume and job description.
          </p>
        </div>

        <div className="space-y-4">
          {questions.length > 0 ? (
            questions.map((question, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-200 bg-[#f8fafc] p-5"
              >
                <p className="text-sm font-semibold text-[#2D8CFF]">
                  Question {index + 1}
                </p>
                <p className="mt-2 text-base text-gray-800">{question}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Loading questions...</p>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={() => router.push("/upload")}
            className="rounded-xl border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Back
          </button>

          <button
            onClick={() => router.push("/interview")}
            className="rounded-xl bg-[#2D8CFF] px-6 py-3 font-semibold text-white transition hover:bg-[#1a73e8]"
          >
            Continue to Interview
          </button>
        </div>
      </div>
    </main>
  );
}