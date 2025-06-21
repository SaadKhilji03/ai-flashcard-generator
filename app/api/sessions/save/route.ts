// app/api/sessions/save/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { getGeminiMCQ } from "@/lib/gemini" // You’ll create this helper

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json()
  const { title, prompts } = body

  try {
    const newSession = await prisma.studySession.create({
      data: {
        title,
        user: { connect: { email: session.user.email } },
        prompts: {
          create: await Promise.all(
            prompts.map(async (p: any) => {
              const flashcards = await Promise.all(
                p.flashcards.map(async (fc: any) => {
                  const mcq = await getGeminiMCQ(fc.question, fc.answer)
                  return {
                    question: fc.question,
                    answer: fc.answer,
                    mcqOptions: mcq.options, // store the parsed options
                  }
                })
              )
              return {
                prompt: p.prompt,
                numCards: p.numCards,
                flashcards: {
                  create: flashcards,
                },
              }
            })
          ),
        },
      },
    })

    return NextResponse.json({ sessionId: newSession.id })
  } catch (err) {
    console.error("[SAVE_SESSION_ERROR]", err)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
