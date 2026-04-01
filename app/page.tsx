import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f4f7fb] to-white">
      <section className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
        <div className="grid w-full gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex rounded-full border border-[#2D8CFF]/20 bg-[#2D8CFF]/10 px-4 py-1 text-sm font-medium text-[#2D8CFF]">
              AI-Powered Interview Practice
            </span>

            <h1 className="mt-6 text-5xl font-bold leading-tight text-[#111827] sm:text-6xl">
              Practice interviews with AI that feels real.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Upload your resume and a job description, generate tailored interview
              questions, practice in a realistic flow, and receive structured
              feedback instantly.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/upload"
                className="inline-flex items-center justify-center rounded-xl bg-[#2D8CFF] px-6 py-3 text-lg font-semibold text-white shadow-md transition hover:bg-[#1a73e8]"
              >
                Start Interview
              </Link>

              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 text-lg font-semibold text-gray-700 transition hover:border-[#2D8CFF] hover:text-[#2D8CFF]"
              >
                See How It Works
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
            <div className="space-y-5">
              <div className="rounded-2xl bg-[#f8fbff] p-5">
                <p className="text-sm font-semibold text-[#2D8CFF]">
                  1. Upload Resume + JD
                </p>
                <p className="mt-2 text-gray-600">
                  Personalize your interview based on your actual target role.
                </p>
              </div>

              <div className="rounded-2xl bg-[#f8fbff] p-5">
                <p className="text-sm font-semibold text-[#2D8CFF]">
                  2. Generate Smart Questions
                </p>
                <p className="mt-2 text-gray-600">
                  Get role-specific questions tailored to your skills and experience.
                </p>
              </div>

              <div className="rounded-2xl bg-[#f8fbff] p-5">
                <p className="text-sm font-semibold text-[#2D8CFF]">
                  3. Practice + Improve
                </p>
                <p className="mt-2 text-gray-600">
                  Receive clear feedback on strengths, weak areas, and STAR-based improvements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="border-t border-gray-200 bg-white px-6 py-20"
      >
        <div className="mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-[#111827]">How it works</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-[#111827]">Upload</h3>
              <p className="mt-3 text-gray-600">
                Add your resume and the job description you are preparing for.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-[#111827]">Practice</h3>
              <p className="mt-3 text-gray-600">
                The system generates realistic interview prompts tailored to the role.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-[#111827]">Improve</h3>
              <p className="mt-3 text-gray-600">
                Get actionable written feedback so you know what to fix next.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}