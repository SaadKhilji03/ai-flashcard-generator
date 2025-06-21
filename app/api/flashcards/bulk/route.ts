import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { ids } = await req.json()

  if (!ids || !Array.isArray(ids)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }

  const flashcards = await prisma.flashcard.findMany({
    where: {
      id: { in: ids },
      user: { email: session.user.email },
    },
  })

  return NextResponse.json({ flashcards })
}
