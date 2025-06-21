'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

type Flashcard = {
  id: string
  question: string
  answer: string
}

export default function StudySetupForm({ flashcards }: { flashcards: Flashcard[] }) {
  const router = useRouter()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [limit, setLimit] = useState(10)

  const toggleCard = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    )
  }

  const startSession = () => {
    const params = new URLSearchParams({
      ids: selectedIds.join(","),
      limit: limit.toString(),
    })
    router.push(`/study/session?${params.toString()}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="limit" className="block mb-1 font-medium">How many cards?</Label>
        <Input
          id="limit"
          type="number"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          min={1}
          max={flashcards.length}
          className="w-32"
        />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Select Flashcards</h2>
        <div className="max-h-72 overflow-y-auto space-y-3 p-2 border rounded">
          {flashcards.map((card) => (
            <Card key={card.id}>
              <CardContent className="flex items-start gap-2 p-3">
                <Checkbox
                  id={`card-${card.id}`}
                  checked={selectedIds.includes(card.id)}
                  onCheckedChange={() => toggleCard(card.id)}
                />
                <Label htmlFor={`card-${card.id}`} className="font-normal cursor-pointer">
                  {card.question}
                </Label>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Button
        onClick={startSession}
        disabled={selectedIds.length === 0}
        className="w-full sm:w-auto"
      >
        🚀 Start Quiz
      </Button>
    </div>
  )
}
