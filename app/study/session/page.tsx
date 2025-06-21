// app/study/session/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import QuizClient from "./QuizClient";

export default async function StudySessionPage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string; limit?: string }>;
}) {
  const { ids, limit } = await searchParams;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/login");

  const idsArr = ids?.split(",").filter(Boolean) || [];
  const limitNum = parseInt(limit || "10");

  if (idsArr.length === 0) {
    return (
      <p className="text-center mt-10 text-red-600">No flashcards selected.</p>
    );
  }

  const flashcards = await prisma.flashcard.findMany({
    where: {
      id: { in: idsArr },
      prompt: {
        session: {
          user: { email: session.user.email },
        },
      },
    },
    take: limitNum,
    select: {
      id: true,
      question: true,
      answer: true,
      mcqOptions: true,
    },
  });

  return <QuizClient flashcards={flashcards} />;
}
