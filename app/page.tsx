import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"

export default async function Home() {
  const session = await getServerSession(authOptions)

  return (
    <main className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-4xl font-bold mb-2">AI Flashcard Generator 🧠</h1>
      <p className="text-muted-foreground max-w-md mb-6">
        Generate smart flashcards instantly from any topic using AI.
      </p>

      {session ? (
        <Link href="/dashboard">
          <Button variant="default">Go to Dashboard</Button>
        </Link>
      ) : (
        <Link href="/login">
          <Button variant="default">Login to Start</Button>
        </Link>
      )}
    </main>
  )
}
