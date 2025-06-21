import { NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
  const { input, numCards } = await req.json()

  const safeNumCards = Math.min(Math.max(Number(numCards) || 5, 1), 5) // default 5, clamp between 1–5

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `
You are an AI that generates flashcards. For the topic or text below, create ${safeNumCards} question-answer pairs in JSON array format like:
[
  {"question": "...", "answer": "..."},
  ...
]

Important: Return ONLY the JSON array, no additional text or formatting.

Text: """${input}"""
`

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Clean and extract JSON
    let cleanText = text.trim()

    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.replace(/```json\n?/, "").replace(/\n?```$/, "")
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.replace(/```\n?/, "").replace(/\n?```$/, "")
    }

    const jsonStart = cleanText.indexOf("[")
    const jsonEnd = cleanText.lastIndexOf("]") + 1

    if (jsonStart === -1 || jsonEnd === 0) {
      throw new Error("No valid JSON array found in response")
    }

    const jsonString = cleanText.slice(jsonStart, jsonEnd)
    const flashcards = JSON.parse(jsonString)

    const validFlashcards = flashcards.filter(
      (card: any) =>
        card.question &&
        card.answer &&
        typeof card.question === "string" &&
        typeof card.answer === "string"
    )

    if (validFlashcards.length === 0) {
      throw new Error("No valid flashcards generated")
    }

    return NextResponse.json({ flashcards: validFlashcards })
  } catch (err) {
    console.error("Gemini error:", err)
    return NextResponse.json(
      {
        error: "Failed to generate flashcards. Please try again.",
        details: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
