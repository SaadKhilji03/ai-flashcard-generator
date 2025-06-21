// app/study/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import StudyPageClient from "./StudyPageClient"

export default async function StudyPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect("/login")

  const flashcards = await prisma.flashcard.findMany({
  where: {
    prompt: {
      session: {
        user: {
          email: session.user.email,
        },
      },
    },
  },
})


  return <StudyPageClient flashcards={flashcards || []} />
}
