"use client"

import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Props = {
  index: number
  prompt: { prompt: string; numCards: number }
  onChange: (val: { prompt: string; numCards: number }) => void
  onFlashcardsGenerated: (
    cards: { question: string; answer: string }[]
  ) => void
}

export default function PromptForm({
  index,
  prompt,
  onChange,
  onFlashcardsGenerated,
}: Props) {
  const [flashcards, setFlashcards] = useState<
    { question: string; answer: string }[]
  >([])
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    setLoading(true)

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        input: prompt.prompt,
        numCards: prompt.numCards,
      }),
    })

    const data = await res.json()
    const cards = data.flashcards || []

    setFlashcards(cards)
    onFlashcardsGenerated(cards)
    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Prompt {index + 1}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="Enter a topic or question..."
          value={prompt.prompt}
          onChange={(e) => onChange({ ...prompt, prompt: e.target.value })}
        />
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={1}
            max={5}
            value={prompt.numCards}
            onChange={(e) =>
              onChange({ ...prompt, numCards: Number(e.target.value) })
            }
            className="w-24"
          />
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate Flashcards"}
          </Button>
        </div>

        {flashcards.length > 0 && (
          <div className="space-y-2 pt-2">
            {flashcards.map((card, idx) => (
              <Card key={idx} className="bg-muted/50">
                <CardContent className="p-3 space-y-1">
                  <p>
                    <strong>Q:</strong> {card.question}
                  </p>
                  <p>
                    <strong>A:</strong> {card.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
