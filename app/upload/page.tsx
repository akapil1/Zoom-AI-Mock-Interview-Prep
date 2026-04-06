"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import mammoth from "mammoth";

type UploadType = "resume" | "jd";

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

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);

  const [resumeFileName, setResumeFileName] = useState("No file chosen");
  const [jdFileName, setJdFileName] = useState("No file chosen");

  const [loadingType, setLoadingType] = useState<UploadType | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canContinue = useMemo(() => {
    return resumeText.trim().length > 20 && jdText.trim().length > 20;
  }, [resumeText, jdText]);

  const handleFileSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: UploadType
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");

    if (type === "resume") {
      setResumeFile(file);
      setResumeFileName(file.name);
    } else {
      setJdFile(file);
      setJdFileName(file.name);
    }
  };

  const extractTextFromFile = async (file: File) => {
    const lowerName = file.name.toLowerCase();

    if (lowerName.endsWith(".txt")) {
      return await file.text();
    }

    if (lowerName.endsWith(".docx")) {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    }

    if (lowerName.endsWith(".pdf")) {
      throw new Error("PDF parsing is not connected yet. Use .txt or .docx for now.");
    }

    throw new Error("Unsupported file type. Please upload a .txt, .docx, or .pdf file.");
  };

  const handleUpload = async (type: UploadType) => {
    const file = type === "resume" ? resumeFile : jdFile;

    if (!file) {
      setError(`Please choose a ${type === "resume" ? "resume" : "job description"} file first.`);
      return;
    }

    try {
      setLoadingType(type);
      setError("");

      const text = await extractTextFromFile(file);

      if (type === "resume") {
        setResumeText(text);
      } else {
        setJdText(text);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while reading the file."
      );
    } finally {
      setLoadingType(null);
    }
  };

  const handleStartInterview = () => {
    if (!canContinue) {
      setError("Please provide both a meaningful resume and job description before continuing.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      sessionStorage.setItem("resumeText", resumeText);
      sessionStorage.setItem("jdText", jdText);
      sessionStorage.setItem("generatedQuestions", JSON.stringify(manualQuestions));
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
    <main className="min-h-screen bg-[#f4f7fb] px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl md:p-10">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-[#2D8CFF]">
            Step 1
          </p>
          <h1 className="mt-2 text-3xl font-bold text-[#1a1a1a]">
            Start Your Mock Interview
          </h1>
          <p className="mt-3 text-gray-600">
            Upload or paste your resume and job description to begin.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="space-y-4">
          <label className="block text-sm font-semibold text-gray-700">
            Resume
          </label>

          <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <span className="text-sm font-medium text-[#2D8CFF]">
                Upload Resume File (.txt, .docx, .pdf)
              </span>

              <label className="w-fit cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition hover:border-[#2D8CFF] hover:text-[#2D8CFF]">
                Choose File
                <input
                  type="file"
                  accept=".txt,.pdf,.docx"
                  onChange={(e) => handleFileSelect(e, "resume")}
                  className="hidden"
                />
              </label>

              <span className="break-all text-xs text-gray-500">
                {resumeFileName}
              </span>
            </div>

            <button
              onClick={() => handleUpload("resume")}
              disabled={loadingType === "resume"}
              className="rounded-md bg-[#1f4f8f] px-4 py-2 text-sm text-white transition hover:bg-[#163e70] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingType === "resume" ? "Uploading..." : "Upload File"}
            </button>
          </div>

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Or paste your resume here..."
            rows={8}
            className="w-full resize-none rounded-xl border border-gray-300 bg-white p-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#2D8CFF] focus:ring-2 focus:ring-[#2D8CFF]/20"
          />

          <p className="mt-2 text-xs text-gray-500">
            Resume characters: {resumeText.trim().length}
          </p>
        </section>

        <section className="mt-8 space-y-4">
          <label className="block text-sm font-semibold text-gray-700">
            Job Description
          </label>

          <div className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-[#f8fafc] px-4 py-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <span className="text-sm font-medium text-[#2D8CFF]">
                Upload Job Description (.txt, .docx, .pdf)
              </span>

              <label className="w-fit cursor-pointer rounded-md border border-gray-300 bg-white px-3 py-2 text-sm transition hover:border-[#2D8CFF] hover:text-[#2D8CFF]">
                Choose File
                <input
                  type="file"
                  accept=".txt,.pdf,.docx"
                  onChange={(e) => handleFileSelect(e, "jd")}
                  className="hidden"
                />
              </label>

              <span className="break-all text-xs text-gray-500">
                {jdFileName}
              </span>
            </div>

            <button
              onClick={() => handleUpload("jd")}
              disabled={loadingType === "jd"}
              className="rounded-md bg-[#1f4f8f] px-4 py-2 text-sm text-white transition hover:bg-[#163e70] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loadingType === "jd" ? "Uploading..." : "Upload File"}
            </button>
          </div>

          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Or paste the job description here..."
            rows={8}
            className="w-full resize-none rounded-xl border border-gray-300 bg-white p-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition focus:border-[#2D8CFF] focus:ring-2 focus:ring-[#2D8CFF]/20"
          />

          <p className="mt-2 text-xs text-gray-500">
            Job description characters: {jdText.trim().length}
          </p>
        </section>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-500">
            <p>Next step: begin the live mock interview.</p>
            <p className="mt-1">
              Ready to continue:{" "}
              <span className={canContinue ? "font-semibold text-green-600" : "font-semibold text-red-600"}>
                {canContinue ? "Yes" : "No"}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleStartInterview}
            disabled={!canContinue || submitting}
            className={`w-full rounded-xl px-6 py-3 text-lg font-semibold text-white transition sm:w-auto ${
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
