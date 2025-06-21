// app/study/session/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import QuizClient from "./QuizClient";

export default async function StudySessionPage({
  searchParams,
}: {
  searchParams: { ids?: string; limit?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const ids = searchParams.ids?.split(",").filter(Boolean) || [];
  const limit = parseInt(searchParams.limit || "10");

  if (ids.length === 0) {
    return (
      <p className="text-center mt-10 text-red-600">No flashcards selected.</p>
    );
  }

  const flashcards = await prisma.flashcard.findMany({
    where: {
      id: { in: ids },
      prompt: {
        session: {
          user: { email: session.user.email },
        },
      },
    },
    take: limit,
    select: {
      id: true,
      question: true,
      answer: true,
      mcqOptions: true, // <-- Include this
    },
  });

  return <QuizClient flashcards={flashcards} />;
}
