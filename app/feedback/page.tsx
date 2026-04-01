export default function FeedbackPage() {
  return (
    <main className="min-h-screen bg-[#f4f7fb] px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-xl md:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#2D8CFF]">
          Step 4
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#1a1a1a]">
          Interview Feedback
        </h1>

        <p className="mt-3 text-gray-600">
          Here is your first MVP feedback summary.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-[#f8fafc] p-5">
            <h2 className="text-lg font-semibold text-[#111827]">Strengths</h2>
            <p className="mt-3 text-sm text-gray-600">
              Clear communication, relevant experience, and strong structure in responses.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-[#f8fafc] p-5">
            <h2 className="text-lg font-semibold text-[#111827]">Needs Work</h2>
            <p className="mt-3 text-sm text-gray-600">
              Some answers need more measurable outcomes and stronger examples.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-[#f8fafc] p-5">
            <h2 className="text-lg font-semibold text-[#111827]">STAR Tip</h2>
            <p className="mt-3 text-sm text-gray-600">
              Focus on Situation, Task, Action, and Result to make responses sharper.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}