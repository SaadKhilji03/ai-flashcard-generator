"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Flashcard = {
  id: string;
  question: string;
  answer: string;
  mcqOptions: string[];
};

export default function QuizClient({
  flashcards,
}: {
  flashcards: Flashcard[];
}) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const currentCard = flashcards[current];

  const handleSelect = (option: string) => {
    if (!submitted) setSelected(option);
  };

  const handleSubmit = () => {
    if (selected === currentCard.answer) {
      setScore((prev) => prev + 1);
    }
    setSubmitted(true);
  };

  const nextCard = () => {
    setCurrent((prev) => prev + 1);
    setSelected(null);
    setSubmitted(false);
  };

  if (!flashcards.length) {
    return (
      <p className="text-center mt-10 text-gray-600">
        No flashcards available.
      </p>
    );
  }

  if (current >= flashcards.length) {
    return (
      <div className="max-w-xl mx-auto mt-12 text-center space-y-6 px-4">
        <h1 className="text-3xl font-bold">🎉 Quiz Completed!</h1>
        <p className="text-lg text-gray-700">
          Your Score: <strong>{score}</strong> / {flashcards.length}
        </p>
        <Button
          onClick={() => {
            setCurrent(0);
            setScore(0);
            setSelected(null);
            setSubmitted(false);
          }}
        >
          🔁 Restart Quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 px-4 space-y-6 text-center">
      <p className="text-sm text-muted-foreground">
        Card {current + 1} of {flashcards.length}
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg text-left whitespace-normal break-words">
            {currentCard.question}
          </CardTitle>
        </CardHeader>
      </Card>

      <div className="space-y-2 text-left">
        {currentCard.mcqOptions.map((opt, idx) => {
          const isCorrect = submitted && opt === currentCard.answer;
          const isWrong =
            submitted && opt === selected && opt !== currentCard.answer;

          return (
            <Button
              key={idx}
              variant="outline"
              onClick={() => handleSelect(opt)}
              className={`w-full justify-start text-left whitespace-normal break-words ${
                isCorrect
                  ? "bg-green-100 border-green-500"
                  : isWrong
                  ? "bg-red-100 border-red-500"
                  : ""
              }`}
              disabled={submitted}
            >
              {opt}
            </Button>
          );
        })}
      </div>

      {!submitted && selected && (
        <Button onClick={handleSubmit} className="mt-4">
          ✅ Submit Answer
        </Button>
      )}

      {submitted && (
        <Button onClick={nextCard} className="mt-4">
          Next
        </Button>
      )}
    </div>
  );
}
