import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import ClientFlashcardToggle from "./ClientFlashcardToggle" // You'll create this component below

export default async function SessionDetailPage(props: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect("/login")

  const { id } = await props.params

  const dbUser = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true },
  })

  const studySession = await prisma.studySession.findUnique({
    where: { id },
    include: {
      prompts: {
        include: { flashcards: true },
      },
    },
  })

  if (!studySession || studySession.userId !== dbUser?.id) {
    redirect("/sessions")
  }

  const allFlashcards = studySession.prompts.flatMap((p) => p.flashcards)

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4 space-y-8">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold">{studySession.title}</h1>
          <p className="text-muted-foreground mt-1">
            Created on{" "}
            {studySession.createdAt
              ? new Date(studySession.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "Unknown"}
          </p>
        </div>

        {allFlashcards.length > 0 && (
          <Link
            href={`/study/session?ids=${allFlashcards
              .map((fc) => fc.id)
              .join(",")}`}
          >
            <Button>🎯 Start Quiz</Button>
          </Link>
        )}
      </div>

      {studySession.prompts.length === 0 ? (
        <p className="text-muted-foreground italic">
          No prompts or flashcards found in this session.
        </p>
      ) : (
        <div className="space-y-6">
          {studySession.prompts.map((prompt) => (
            <ClientFlashcardToggle
              key={prompt.id}
              prompt={prompt.prompt}
              flashcards={prompt.flashcards}
            />
          ))}
        </div>
      )}

      {allFlashcards.length > 0 && (
        <div className="pt-4 text-center">
          <Link
            href={`/study/session?ids=${allFlashcards
              .map((fc) => fc.id)
              .join(",")}`}
          >
            <Button className="w-full sm:w-auto">
              🎯 Start Quiz with All Flashcards
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
