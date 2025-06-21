import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { question, answer } = await req.json()

  if (!question || !answer) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  })

  const existing = await prisma.flashcard.findUnique({ where: { id: params.id } })

  if (!existing || existing.userId !== user?.id) {
    return NextResponse.json({ error: "Not found or forbidden" }, { status: 403 })
  }

  const updated = await prisma.flashcard.update({
    where: { id: params.id },
    data: { question, answer },
  })

  return NextResponse.json(updated)
}
