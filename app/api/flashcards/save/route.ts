import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { flashcards } = await req.json();

  if (!flashcards || !Array.isArray(flashcards)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const created = await prisma.flashcard.createMany({
    data: flashcards
      .filter((fc: any) => fc.question && fc.answer)
      .map((fc: any) => ({
        question: fc.question,
        answer: fc.answer,
        userId: user.id,
      })),
    skipDuplicates: true, // 🔐 prevents inserting same question+answer again
  });

  return NextResponse.json({ count: created.count });
}
