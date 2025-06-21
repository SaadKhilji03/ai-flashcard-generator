'use client'

import StudySetupForm from './StudySetupForm'

type Flashcard = {
  id: string
  question: string
  answer: string
}

export default function StudyPageClient({ flashcards }: { flashcards: Flashcard[] }) {
  return (
    <div className="max-w-3xl mx-auto mt-10 px-4 space-y-6">
      <h1 className="text-3xl font-bold">🧠 Start Study Session</h1>
      <StudySetupForm flashcards={flashcards} />
    </div>
  )
}
