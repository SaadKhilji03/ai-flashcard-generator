"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type Flashcard = {
  id: string
  question: string
  answer: string
}

export default function ClientFlashcardToggle({
  prompt,
  flashcards,
}: {
  prompt: string
  flashcards: Flashcard[]
}) {
  const [showAll, setShowAll] = useState(false)

  const visibleCards = showAll ? flashcards : flashcards.slice(0, 3)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          Prompt: <span className="font-medium">{prompt}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {visibleCards.map((card) => (
          <Card key={card.id} className="bg-muted/50">
            <CardContent className="space-y-1 p-3 text-sm">
              <p>
                <strong>Q:</strong> {card.question}
              </p>
              <p>
                <strong>A:</strong> {card.answer}
              </p>
            </CardContent>
          </Card>
        ))}
        {flashcards.length > 3 && (
          <div className="pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show Less" : `Show All (${flashcards.length})`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
