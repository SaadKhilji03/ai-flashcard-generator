'use client'

import { useState } from "react"
import { toast } from "sonner" // shadcn/ui toast

type Flashcard = { question: string; answer: string }

export default function GenerateForm() {
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [savedIndices, setSavedIndices] = useState<Set<number>>(new Set())

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setFlashcards([])
    setSavedIndices(new Set())

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      })

      const data = await res.json()
      setFlashcards(data.flashcards || [])
    } catch (err) {
      toast.error("Failed to generate flashcards.")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveCard = async (card: Flashcard, index: number) => {
    try {
      const res = await fetch("/api/flashcards/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flashcards: [card] }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Flashcard saved!")
        setSavedIndices((prev) => new Set(prev).add(index))
      } else {
        toast.error(data.error || "Failed to save flashcard.")
      }
    } catch {
      toast.error("Error saving flashcard.")
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full border rounded p-2 h-32"
          placeholder="Enter a topic or paragraph..."
          required
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Flashcards"}
        </button>
      </form>

      {flashcards.length > 0 && (
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-bold">Generated Flashcards:</h2>
          {flashcards.map((card, idx) => (
            <div key={idx} className="border rounded p-3 bg-gray-50 relative">
              <p><strong>Q:</strong> {card.question}</p>
              <p><strong>A:</strong> {card.answer}</p>

              <button
                onClick={() => handleSaveCard(card, idx)}
                className="absolute top-2 right-2 text-sm bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                disabled={savedIndices.has(idx)}
              >
                {savedIndices.has(idx) ? "Saved" : "Save"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
