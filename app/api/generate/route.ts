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
    const resume = body.resume?.trim();
    const jd = body.jd?.trim();

    if (!resume || !jd) {
      return Response.json(
        { error: "Resume and job description are required." },
        { status: 400 }
      );
    }

    const prompt = `
You are an expert interview coach and recruiter.

Using the candidate's resume and the job description below, generate exactly 5 personalized interview questions.

Requirements:
- Questions must be specific to the job description
- Tailor them to the candidate's background
- Include a mix of behavioral, experience-based, and role-specific questions
- Keep them concise and realistic
- Return ONLY a valid JSON array of strings
- No markdown
- No explanation

Resume:
${resume}

Job Description:
${jd}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content?.trim() || "[]";

    let questions: string[] = [];

    try {
      questions = JSON.parse(content);
    } catch {
      questions = content
        .replace(/```json|```/g, "")
        .split("\n")
        .map((line) => line.replace(/^\d+[\).\s-]*/, "").trim())
        .filter(Boolean)
        .slice(0, 5);
    }

    if (!questions.length) {
      return Response.json(
        { error: "No interview questions were generated." },
        { status: 500 }
      );
    }

    return Response.json({ questions: questions.slice(0, 5) });
  } catch (error) {
    console.error("Generate API error:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate interview questions.",
      },
      { status: 500 }
    );
  }
}