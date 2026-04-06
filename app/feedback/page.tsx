"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type QuestionType =
  | "behavioral"
  | "motivation"
  | "strength"
  | "teamwork"
  | "problem-solving"
  | "general";

type ScoreCard = {
  relevance: number;
  structure: number;
  specificity: number;
  impact: number;
  confidence: number;
};

type FeedbackItem = {
  question: string;
  answer: string;
  questionType: QuestionType;
  scores: ScoreCard;
  strengths: string[];
  improvements: string[];
  nextTip: string;
  betterAnswer: string;
  starBreakdown?: {
    situation: boolean;
    task: boolean;
    action: boolean;
    result: boolean;
  };
};

const fillerWords = ["um", "uh", "like", "you know", "basically", "actually"];

function detectQuestionType(question: string): QuestionType {
  const q = question.toLowerCase();

  if (q.includes("tell me about yourself")) return "general";
  if (q.includes("why are you interested")) return "motivation";
  if (q.includes("strength")) return "strength";
  if (q.includes("team")) return "teamwork";
  if (
    q.includes("challenging problem") ||
    q.includes("solved a problem") ||
    q.includes("problem")
  ) {
    return "problem-solving";
  }
  if (q.includes("describe a time") || q.includes("tell me about a time")) {
    return "behavioral";
  }

  return "general";
}

function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function includesAny(text: string, patterns: string[]) {
  const lower = text.toLowerCase();
  return patterns.some((pattern) => lower.includes(pattern));
}

function countFillerWords(text: string) {
  const lower = text.toLowerCase();
  return fillerWords.reduce((count, word) => {
    const matches = lower.match(new RegExp(`\\b${word.replace(/\s+/g, "\\s+")}\\b`, "g"));
    return count + (matches ? matches.length : 0);
  }, 0);
}

function detectSTAR(answer: string) {
  const lower = answer.toLowerCase();

  const situation = includesAny(lower, [
    "in my internship",
    "in a project",
    "during my internship",
    "during a project",
    "when i was",
    "there was",
    "our team",
    "we were",
    "in one project",
  ]);

  const task = includesAny(lower, [
    "my responsibility",
    "my role",
    "i was responsible",
    "i needed to",
    "the goal was",
    "i had to",
  ]);

  const action = includesAny(lower, [
    "i created",
    "i organized",
    "i built",
    "i solved",
    "i decided",
    "i led",
    "i communicated",
    "i worked",
    "i implemented",
    "i improved",
  ]);

  const result = includesAny(lower, [
    "as a result",
    "result",
    "finally",
    "we completed",
    "we finished",
    "it improved",
    "it helped",
    "we delivered",
    "saved",
    "reduced",
    "increased",
    "%",
    "successfully",
  ]);

  return { situation, task, action, result };
}

function scoreAnswer(question: string, answer: string, type: QuestionType): ScoreCard {
  const words = countWords(answer);
  const lower = answer.toLowerCase();
  const fillerCount = countFillerWords(answer);

  let relevance = 6;
  let structure = 5;
  let specificity = 5;
  let impact = 4;
  let confidence = 6;

  if (words > 20) relevance += 1;
  if (words > 40) structure += 1;
  if (words > 35) specificity += 1;

  if (includesAny(lower, ["for example", "for instance", "specifically", "such as"])) {
    specificity += 2;
  }

  if (includesAny(lower, ["i", "my", "me"])) {
    relevance += 1;
  }

  if (
    includesAny(lower, [
      "improved",
      "increased",
      "reduced",
      "saved",
      "delivered",
      "completed",
      "launched",
      "successfully",
      "%",
      "faster",
    ])
  ) {
    impact += 3;
  }

  if (includesAny(lower, ["first", "then", "after that", "finally"])) {
    structure += 2;
  }

  if (fillerCount >= 3) confidence -= 2;
  if (fillerCount >= 1) confidence -= 1;

  if (words < 12) {
    relevance -= 2;
    specificity -= 2;
    impact -= 1;
  }

  if (type === "behavioral" || type === "problem-solving" || type === "teamwork") {
    const star = detectSTAR(answer);
    if (star.situation) structure += 1;
    if (star.task) structure += 1;
    if (star.action) specificity += 1;
    if (star.result) impact += 2;
  }

  const clamp = (n: number) => Math.max(1, Math.min(10, n));

  return {
    relevance: clamp(relevance),
    structure: clamp(structure),
    specificity: clamp(specificity),
    impact: clamp(impact),
    confidence: clamp(confidence),
  };
}

function buildBetterAnswer(type: QuestionType, question: string, answer: string) {
  switch (type) {
    case "motivation":
      return `I’m interested in this role because it aligns with both my technical background and my interest in building meaningful user-focused solutions. I’m especially excited by the opportunity to apply my skills, continue learning, and contribute to work that has measurable impact. What stands out to me most is how this role combines problem-solving, collaboration, and growth.`;

    case "strength":
      return `One of my greatest strengths is taking initiative in ambiguous situations. For example, when a project needed better structure, I stepped in to organize tasks, improve communication, and keep the team aligned. That helped us work more efficiently and deliver stronger results.`;

    case "teamwork":
      return `In one team project, we were struggling with coordination and unclear ownership. I helped improve communication by organizing responsibilities and checking in regularly with teammates. As a result, our collaboration became smoother and we completed the project more effectively.`;

    case "problem-solving":
      return `During a challenging project, we ran into a problem that was slowing progress and affecting the team’s momentum. I first identified the root cause, then broke the issue into smaller steps and worked through a practical solution. As a result, we were able to move forward more efficiently and complete the work successfully.`;

    case "behavioral":
      return `In one situation, my team faced a challenge that required quick problem-solving and clear communication. My role was to help organize the work and make sure we stayed on track. I took action by prioritizing tasks, collaborating closely with others, and following through on execution. As a result, we completed the work successfully and improved the overall outcome.`;

    default:
      return `I’d describe myself as someone who combines technical ability with a strong focus on communication, collaboration, and impact. Across my academic and professional experiences, I’ve enjoyed solving problems, learning quickly, and contributing to projects that help others. I’m especially motivated by opportunities where I can keep growing while creating meaningful results.`;
  }
}

function buildFeedback(question: string, answer: string): FeedbackItem {
  const questionType = detectQuestionType(question);
  const scores = scoreAnswer(question, answer, questionType);
  const words = countWords(answer);
  const fillerCount = countFillerWords(answer);

  const strengths: string[] = [];
  const improvements: string[] = [];

  if (scores.relevance >= 7) {
    strengths.push("Your answer stays reasonably relevant to the question.");
  } else {
    improvements.push("Make the answer more directly focused on what the interviewer asked.");
  }

  if (scores.structure >= 7) {
    strengths.push("Your response has a clear flow and is easier to follow.");
  } else {
    improvements.push("Organize the answer more clearly with a beginning, middle, and end.");
  }

  if (scores.specificity >= 7) {
    strengths.push("You included enough detail to make the answer feel more concrete.");
  } else {
    improvements.push("Add a more specific example instead of speaking in broad general statements.");
  }

  if (scores.impact >= 7) {
    strengths.push("You showed outcome or impact, which makes the answer stronger.");
  } else {
    improvements.push("Explain the result of your actions more clearly, ideally with measurable impact.");
  }

  if (fillerCount >= 2) {
    improvements.push("Reduce filler words to sound more polished and confident.");
  } else {
    strengths.push("Your response sounds fairly clean without too many filler phrases.");
  }

  if (words < 20) {
    improvements.push("Your answer is a bit short and could use more development.");
  } else if (words > 140) {
    improvements.push("Your answer may be too long; tighten it to keep the main point sharper.");
  } else {
    strengths.push("Your answer length is generally appropriate for a mock interview response.");
  }

  let nextTip = "Use one concrete example and end with a strong result.";
  let starBreakdown;

  if (
    questionType === "behavioral" ||
    questionType === "problem-solving" ||
    questionType === "teamwork"
  ) {
    starBreakdown = detectSTAR(answer);

    if (!starBreakdown.result) {
      nextTip = "Add the final result clearly. End with what changed because of your action.";
    } else if (!starBreakdown.action) {
      nextTip = "Focus more on what you specifically did, not just what the team faced.";
    } else if (!starBreakdown.situation) {
      nextTip = "Start with one sentence of context so the interviewer understands the scenario.";
    } else {
      nextTip = "Your STAR structure is decent; next, make the result more measurable.";
    }
  }

  if (questionType === "motivation") {
    nextTip = "Connect your interest to the role, the company, and how your background fits.";
  }

  if (questionType === "strength") {
    nextTip = "Name the strength, then prove it with a short real example.";
  }

  return {
    question,
    answer,
    questionType,
    scores,
    strengths,
    improvements,
    nextTip,
    betterAnswer: buildBetterAnswer(questionType, question, answer),
    starBreakdown,
  };
}

function averageScore(items: FeedbackItem[], key: keyof ScoreCard) {
  if (!items.length) return 0;
  const total = items.reduce((sum, item) => sum + item.scores[key], 0);
  return Math.round((total / items.length) * 10) / 10;
}

export default function FeedbackPage() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    const storedQuestions = sessionStorage.getItem("generatedQuestions");
    const storedAnswers = sessionStorage.getItem("interviewAnswers");

    if (storedQuestions) {
      setQuestions(JSON.parse(storedQuestions));
    }

    if (storedAnswers) {
      setAnswers(JSON.parse(storedAnswers));
    }
  }, []);

  const feedbackItems = useMemo(() => {
    return questions.map((question, index) =>
      buildFeedback(question, answers[index] || "")
    );
  }, [questions, answers]);

  const summary = useMemo(() => {
    if (!feedbackItems.length) return null;

    const avgRelevance = averageScore(feedbackItems, "relevance");
    const avgStructure = averageScore(feedbackItems, "structure");
    const avgSpecificity = averageScore(feedbackItems, "specificity");
    const avgImpact = averageScore(feedbackItems, "impact");
    const avgConfidence = averageScore(feedbackItems, "confidence");

    const allImprovements = feedbackItems.flatMap((item) => item.improvements);

    const mostCommonIssue =
      allImprovements.find(
        (item) =>
          item.includes("result") ||
          item.includes("specific") ||
          item.includes("filler") ||
          item.includes("short") ||
          item.includes("Organize")
      ) || "Add more measurable impact to your answers.";

    let strongestArea = "Relevance";
    let weakestArea = "Impact";

    const scoreMap = [
      { label: "Relevance", value: avgRelevance },
      { label: "Structure", value: avgStructure },
      { label: "Specificity", value: avgSpecificity },
      { label: "Impact", value: avgImpact },
      { label: "Confidence", value: avgConfidence },
    ];

    strongestArea = scoreMap.reduce((a, b) => (a.value > b.value ? a : b)).label;
    weakestArea = scoreMap.reduce((a, b) => (a.value < b.value ? a : b)).label;

    return {
      avgRelevance,
      avgStructure,
      avgSpecificity,
      avgImpact,
      avgConfidence,
      strongestArea,
      weakestArea,
      mostCommonIssue,
    };
  }, [feedbackItems]);

  return (
    <main className="min-h-screen bg-[#f4f7fb] px-6 py-10">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 shadow-xl md:p-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-[#2D8CFF]">
          Step 3
        </p>

        <h1 className="mt-2 text-3xl font-bold text-[#1a1a1a]">
          AI Interview Feedback
        </h1>

        <p className="mt-3 text-gray-600">
          This is a hardcoded coaching layer that simulates intelligent interview feedback.
        </p>

        {summary && (
          <section className="mt-8 rounded-3xl border border-gray-200 bg-[#f8fafc] p-6">
            <h2 className="text-2xl font-bold text-[#111827]">Overall Summary</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-5">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">Relevance</p>
                <p className="mt-2 text-2xl font-bold text-[#111827]">{summary.avgRelevance}/10</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">Structure</p>
                <p className="mt-2 text-2xl font-bold text-[#111827]">{summary.avgStructure}/10</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">Specificity</p>
                <p className="mt-2 text-2xl font-bold text-[#111827]">{summary.avgSpecificity}/10</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">Impact</p>
                <p className="mt-2 text-2xl font-bold text-[#111827]">{summary.avgImpact}/10</p>
              </div>
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">Confidence</p>
                <p className="mt-2 text-2xl font-bold text-[#111827]">{summary.avgConfidence}/10</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                <p className="text-sm font-semibold text-green-700">Strongest Area</p>
                <p className="mt-2 text-lg font-bold text-[#111827]">{summary.strongestArea}</p>
              </div>

              <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
                <p className="text-sm font-semibold text-yellow-700">Weakest Area</p>
                <p className="mt-2 text-lg font-bold text-[#111827]">{summary.weakestArea}</p>
              </div>

              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                <p className="text-sm font-semibold text-blue-700">Main Coaching Insight</p>
                <p className="mt-2 text-sm text-[#111827]">{summary.mostCommonIssue}</p>
              </div>
            </div>
          </section>
        )}

        <section className="mt-10 space-y-8">
          {feedbackItems.map((item, index) => (
            <div
              key={index}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-sm font-medium text-[#2D8CFF]">
                    Question {index + 1}
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-[#111827]">
                    {item.question}
                  </h2>
                  <p className="mt-2 inline-flex rounded-full bg-[#2D8CFF]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#2D8CFF]">
                    {item.questionType}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-[#f8fafc] p-5">
                <p className="text-sm font-semibold text-gray-500">Your Answer</p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-700">
                  {item.answer || "No spoken answer captured."}
                </p>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-5">
                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">Relevance</p>
                  <p className="mt-2 text-2xl font-bold text-[#111827]">{item.scores.relevance}/10</p>
                </div>
                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">Structure</p>
                  <p className="mt-2 text-2xl font-bold text-[#111827]">{item.scores.structure}/10</p>
                </div>
                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">Specificity</p>
                  <p className="mt-2 text-2xl font-bold text-[#111827]">{item.scores.specificity}/10</p>
                </div>
                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">Impact</p>
                  <p className="mt-2 text-2xl font-bold text-[#111827]">{item.scores.impact}/10</p>
                </div>
                <div className="rounded-2xl border border-gray-200 p-4">
                  <p className="text-sm text-gray-500">Confidence</p>
                  <p className="mt-2 text-2xl font-bold text-[#111827]">{item.scores.confidence}/10</p>
                </div>
              </div>

              {item.starBreakdown && (
                <div className="mt-6 rounded-2xl border border-gray-200 bg-[#f8fafc] p-5">
                  <p className="text-sm font-semibold text-gray-500">STAR Breakdown</p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                    {[
                      ["Situation", item.starBreakdown.situation],
                      ["Task", item.starBreakdown.task],
                      ["Action", item.starBreakdown.action],
                      ["Result", item.starBreakdown.result],
                    ].map(([label, ok]) => (
                      <div
                        key={label}
                        className={`rounded-xl px-4 py-3 text-sm font-medium ${
                          ok
                            ? "border border-green-200 bg-green-50 text-green-700"
                            : "border border-red-200 bg-red-50 text-red-700"
                        }`}
                      >
                        {label}: {ok ? "Present" : "Missing / Weak"}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
                  <h3 className="text-lg font-semibold text-green-700">What Went Well</h3>
                  <div className="mt-3 space-y-2 text-sm text-gray-700">
                    {item.strengths.map((point, i) => (
                      <p key={i}>• {point}</p>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5">
                  <h3 className="text-lg font-semibold text-yellow-700">What To Improve</h3>
                  <div className="mt-3 space-y-2 text-sm text-gray-700">
                    {item.improvements.map((point, i) => (
                      <p key={i}>• {point}</p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                  <h3 className="text-lg font-semibold text-blue-700">Next Attempt Tip</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-700">{item.nextTip}</p>
                </div>

                <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5">
                  <h3 className="text-lg font-semibold text-purple-700">Stronger Sample Answer</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-700">{item.betterAnswer}</p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:border-[#2D8CFF] hover:text-[#2D8CFF]"
          >
            Back to Home
          </Link>

          <Link
            href="/upload"
            className="inline-flex items-center justify-center rounded-xl bg-[#2D8CFF] px-6 py-3 font-semibold text-white transition hover:bg-[#1a73e8]"
          >
            Try Another Interview
          </Link>
        </div>
      </div>
    </main>
  );
}
