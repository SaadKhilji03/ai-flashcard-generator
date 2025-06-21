import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function SessionsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect("/login")

  const sessions = await prisma.studySession.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: "desc" },
    include: {
      prompts: {
        include: { flashcards: true },
      },
    },
  })

  return (
    <div className="max-w-4xl mx-auto mt-12 px-4">
      <h1 className="text-3xl font-bold mb-8">📚 Your Study Sessions</h1>

      {sessions.length === 0 ? (
        <p className="text-muted-foreground">
          You haven’t saved any sessions yet.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {sessions.map((s) => {
            const flashcardCount = s.prompts.reduce(
              (acc, p) => acc + p.flashcards.length,
              0
            )

            return (
              <Card key={s.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{s.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Created on{" "}
                    {new Date(s.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 text-sm mb-3">
                    <Badge variant="outline">{s.prompts.length} prompt{s.prompts.length !== 1 ? "s" : ""}</Badge>
                    <Badge variant="outline">{flashcardCount} flashcard{flashcardCount !== 1 ? "s" : ""}</Badge>
                  </div>
                  <Link
                    href={`/sessions/${s.id}`}
                    className="text-gray-600 text-sm hover:underline"
                  >
                    View Session →
                  </Link>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
