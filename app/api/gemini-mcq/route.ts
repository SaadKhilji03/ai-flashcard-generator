// app/api/gemini-mcq/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    const { question, answer } = await req.json();

    if (!question || !answer) {
      return NextResponse.json(
        { error: "Missing question or answer" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
Generate 3 plausible incorrect options and 1 correct option for this flashcard:

Q: ${question}
A: ${answer}

Return JSON like:
{
  "options": [
    { "text": "Option A", "isCorrect": true },
    { "text": "Option B", "isCorrect": false },
    ...
  ]
}
Ensure only one isCorrect: true.
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Failed to parse Gemini response");

    const parsed = JSON.parse(jsonMatch[0]);
    let options = parsed.options || [];

    // Fallback: If Gemini didn't include a correct option, fix it here
    if (!options.some((opt: any) => opt.isCorrect)) {
      // Add the correct answer manually
      options.push({ text: answer, isCorrect: true });
    }

    // Ensure only one is marked correct
    options = options.map((opt: any) => ({
      ...opt,
      isCorrect: opt.text === answer,
    }));

    // Shuffle the options
    options = options.sort(() => Math.random() - 0.5);

    return NextResponse.json({ options });
  } catch (err) {
    console.error("[GEMINI MCQ ERROR]", err);
    return NextResponse.json(
      { error: "Failed to generate MCQ" },
      { status: 500 }
    );
  }
}
