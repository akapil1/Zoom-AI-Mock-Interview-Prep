"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const manualQuestions = [
  "Tell me about yourself.",
  "Why are you interested in this role?",
  "Describe a time you solved a challenging problem.",
  "Tell me about a time you worked effectively in a team.",
  "What is one of your greatest strengths, and how has it helped you succeed?",
];

export default function UploadPage() {
  const router = useRouter();

  const [resumeText, setResumeText] = useState("");
  const [jdText, setJdText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canContinue = useMemo(() => {
    return resumeText.trim().length > 20 && jdText.trim().length > 20;
  }, [resumeText, jdText]);

  const handleStartInterview = () => {
    if (!canContinue) {
      setError(
        "Please provide both a meaningful resume and job description before continuing."
      );
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      sessionStorage.setItem("resumeText", resumeText);
      sessionStorage.setItem("jdText", jdText);
      sessionStorage.setItem(
        "generatedQuestions",
        JSON.stringify(manualQuestions)
      );
      sessionStorage.removeItem("interviewAnswers");

      router.push("/interview");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to continue. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f7fb] px-4 py-4">
      <div className="mx-auto w-full max-w-[520px] rounded-2xl bg-white p-5 shadow-lg">

        {/* HEADER WITH CANCEL */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#2D8CFF]">
              Step 1
            </p>
            <h1 className="mt-1 text-2xl font-bold text-[#1a1a1a]">
              Start Your Mock Interview
            </h1>
          </div>

          <Link
            href="/"
            onClick={() => sessionStorage.clear()}
            className="text-sm font-medium text-red-500 hover:underline"
          >
            Cancel
          </Link>
        </div>

        <p className="mb-5 text-sm text-gray-600">
          Paste your resume and job description to begin.
        </p>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* RESUME */}
        <section className="space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Resume
          </label>

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume here..."
            rows={8}
            className="w-full resize-none rounded-xl border border-gray-300 bg-white p-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#2D8CFF] focus:ring-2 focus:ring-[#2D8CFF]/20"
          />

          <p className="text-xs text-gray-500">
            Characters: {resumeText.trim().length}
          </p>
        </section>

        {/* JOB DESCRIPTION */}
        <section className="mt-6 space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Job Description
          </label>

          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the job description here..."
            rows={8}
            className="w-full resize-none rounded-xl border border-gray-300 bg-white p-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#2D8CFF] focus:ring-2 focus:ring-[#2D8CFF]/20"
          />

          <p className="text-xs text-gray-500">
            Characters: {jdText.trim().length}
          </p>
        </section>

        {/* STATUS */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-4">
          <p className="text-sm text-gray-600">
            Ready to continue:{" "}
            <span
              className={
                canContinue
                  ? "font-semibold text-green-600"
                  : "font-semibold text-red-600"
              }
            >
              {canContinue ? "Yes" : "No"}
            </span>
          </p>
        </div>

        {/* CTA */}
        <div className="mt-6">
          <button
            type="button"
            onClick={handleStartInterview}
            disabled={!canContinue || submitting}
            className={`w-full rounded-xl px-6 py-3 text-sm font-semibold text-white transition ${
              !canContinue || submitting
                ? "cursor-not-allowed bg-gray-400 opacity-70"
                : "bg-[#2D8CFF] hover:bg-[#1a73e8]"
            }`}
          >
            {submitting ? "Starting..." : "Start Interview"}
          </button>
        </div>
      </div>
    </main>
  );
}
