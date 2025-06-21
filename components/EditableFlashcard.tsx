'use client'

import { useState } from "react"
import { toast } from "sonner"

type Flashcard = {
  id: string;
  question: string;
  answer: string;
  // Add other fields if needed
};

export default function EditableFlashcard({ card }: { card: Flashcard }) {
  const [editing, setEditing] = useState(false)
  const [question, setQuestion] = useState(card.question)
  const [answer, setAnswer] = useState(card.answer)
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/flashcards/${card.id}/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer }),
      })

      if (res.ok) {
        toast.success("Flashcard updated!")
        setEditing(false)
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to update flashcard.")
      }
    } catch {
      toast.error("Error updating flashcard.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border p-4 rounded bg-white shadow-sm space-y-2">
      {editing ? (
        <>
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEditing(false)}
              className="text-sm text-gray-600 hover:underline"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <p><strong>Q:</strong> {question}</p>
          <p><strong>A:</strong> {answer}</p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setEditing(true)}
              className="text-sm text-blue-600 hover:underline"
            >
              Edit
            </button>
            <form action={`/api/flashcards/${card.id}/delete`} method="POST">
              <button className="text-sm text-red-600 hover:underline">
                Delete
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  )
}
