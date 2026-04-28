import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "OPENAI_API_KEY is missing in .env.local" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const body = await req.json();
    const questions = body.questions;
    const answers = body.answers;
    const resume = body.resume?.trim() || "";
    const jd = body.jd?.trim() || "";

    if (!Array.isArray(questions) || !Array.isArray(answers)) {
      return Response.json(
        { error: "Questions and answers are required." },
        { status: 400 }
      );
    }

    const prompt = `
You are an expert interview coach and recruiter.

Evaluate the candidate's mock interview answers using the resume and job description.

Return ONLY valid JSON in this exact structure:

{
  "overallSummary": "short summary",
  "overallScore": 8,
  "strongestArea": "string",
  "weakestArea": "string",
  "items": [
    {
      "question": "string",
      "answer": "string",
      "score": 8,
      "whatWentWell": ["string", "string"],
      "whatToImprove": ["string", "string"],
      "betterAnswer": "string",
      "nextTip": "string"
    }
  ]
}

Rules:
- Score each answer from 1 to 10
- Be specific and constructive
- If an answer is empty, score it low and explain why
- Better answers should sound realistic and polished
- No markdown
- No explanation outside JSON

Resume:
${resume}

Job Description:
${jd}

Interview:
${questions
  .map(
    (q: string, i: number) => `
Question ${i + 1}: ${q}
Answer ${i + 1}: ${answers[i] || ""}
`
  )
  .join("\n")}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    const content = response.choices[0]?.message?.content?.trim() || "{}";
    const cleaned = content.replace(/```json|```/g, "").trim();

    const feedback = JSON.parse(cleaned);

    return Response.json({ feedback });
  } catch (error) {
    console.error("Feedback API error:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate AI feedback.",
      },
      { status: 500 }
    );
  }
}