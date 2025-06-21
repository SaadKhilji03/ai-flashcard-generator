import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const card = await prisma.flashcard.findUnique({ where: { id: params.id } })

  if (!card) return NextResponse.json({ error: "Flashcard not found" }, { status: 404 })

  // Optional: check ownership
  const user = await prisma.user.findUnique({ where: { email: session.user.email } })
  if (card.userId !== user?.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  await prisma.flashcard.delete({ where: { id: params.id } })

  return NextResponse.redirect("/dashboard")
}
