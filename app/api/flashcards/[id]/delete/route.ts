import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Find the flashcard and include the prompt and session user
  const card = await prisma.flashcard.findUnique({
    where: { id },
    include: {
      prompt: {
        include: {
          session: true,
        },
      },
    },
  });

  if (!card)
    return NextResponse.json({ error: "Flashcard not found" }, { status: 404 });

  // Check ownership via session user
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (card.prompt.session.userId !== user?.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.flashcard.delete({ where: { id } });

  return NextResponse.redirect("/dashboard");
}
