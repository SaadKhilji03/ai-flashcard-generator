"use client"

import { useState } from "react"
import PromptForm from "./PromptForm"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function NewSessionClient() {
  const [title, setTitle] = useState("")
  const [prompts, setPrompts] = useState([{ prompt: "", numCards: 5 }])
  const [flashcardsPerPrompt, setFlashcardsPerPrompt] = useState<
    { question: string; answer: string }[][]
  >([])
  const [saving, setSaving] = useState(false)

  const updatePrompt = (
    index: number,
    updated: { prompt: string; numCards: number }
  ) => {
    setPrompts((prev) => {
      const next = [...prev]
      next[index] = updated
      return next
    })
  }

  const updateFlashcards = (
    index: number,
    cards: { question: string; answer: string }[]
  ) => {
    setFlashcardsPerPrompt((prev) => {
      const next = [...prev]
      next[index] = cards
      return next
    })
  }

  const addPrompt = () => {
    setPrompts((prev) => [...prev, { prompt: "", numCards: 5 }])
  }

  const handleSave = async () => {
    setSaving(true)

    if (!title.trim()) {
      alert("Please enter a session title.")
      return
    }

    if (
      prompts.length === 0 ||
      flashcardsPerPrompt.some((fc) => !fc || fc.length === 0)
    ) {
      alert("Please generate flashcards for all prompts before saving.")
      return
    }

    const res = await fetch("/api/sessions/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        prompts: prompts.map((p, i) => ({
          prompt: p.prompt,
          numCards: p.numCards,
          flashcards: flashcardsPerPrompt[i] || [],
        })),
      }),
    })

    if (res.ok) {
      alert("✅ Session saved!")
      // router.push(`/sessions/${data.sessionId}`)
    } else {
      alert("❌ Failed to save session.")
    }

    setSaving(false)
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4 space-y-6">
      <h1 className="text-3xl font-bold">📝 New Study Session</h1>

      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Session Title (e.g. Biology - Evolution)"
      />

      <div className="space-y-6">
        {prompts.map((prompt, idx) => (
          <PromptForm
            key={idx}
            index={idx}
            prompt={prompt}
            onChange={(updated) => updatePrompt(idx, updated)}
            onFlashcardsGenerated={(cards) => updateFlashcards(idx, cards)}
          />
        ))}
      </div>

      <div className="flex flex-wrap gap-3 pt-4">
        <Button variant="outline" onClick={addPrompt}>
          ➕ Add Prompt
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "💾 Save Session"}
        </Button>
      </div>
    </div>
  )
}
