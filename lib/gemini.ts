// lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function getGeminiMCQ(question: string, answer: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

  const prompt = `
Generate a multiple choice question based on the following:

Question: "${question}"
Correct Answer: "${answer}"

Return a JSON array of 4 options where one is correct, e.g.:
[
  { "text": "Option A", "isCorrect": true },
  { "text": "Option B", "isCorrect": false },
  ...
]
`

  const result = await model.generateContent(prompt)
  const text = result.response.text()

  const jsonMatch = text.match(/\[[\s\S]*\]/)
  const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : []

  return {
    options: parsed.map((opt: any) => opt.text),
    correct: parsed.find((opt: any) => opt.isCorrect)?.text,
  }
}
