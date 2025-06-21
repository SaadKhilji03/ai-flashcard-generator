'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Props = {
  user: { name?: string | null; email?: string | null }
}

export default function DashboardClient({ user }: Props) {
  return (
    <div className="max-w-3xl mx-auto mt-16 px-4 space-y-8 text-center">
      <h1 className="text-4xl font-bold">
        Welcome, {user.name || user.email}
      </h1>

      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <Link href="/sessions/new" className="block">
          <Card className="hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="text-2xl">➕ New Study Session</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Generate a new session with AI-powered flashcards.
              </p>
              <Button className="mt-4 w-full">Start Generating</Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/sessions" className="block">
          <Card className="hover:shadow-lg transition">
            <CardHeader>
              <CardTitle className="text-2xl">📂 View Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Browse your saved study sessions and flashcards.
              </p>
              <Button variant="outline" className="mt-4 w-full">
                View Sessions
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
