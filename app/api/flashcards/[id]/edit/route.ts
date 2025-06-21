import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { question, answer } = await req.json();

  if (!question || !answer) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  // Find the flashcard and include the prompt and session user
  const existing = await prisma.flashcard.findUnique({
    where: { id },
    include: {
      prompt: {
        include: {
          session: true,
        },
      },
    },
  });

  // Check ownership via session user
  if (
    !existing ||
    !existing.prompt ||
    !existing.prompt.session ||
    existing.prompt.session.userId !== user?.id
  ) {
    return NextResponse.json(
      { error: "Not found or forbidden" },
      { status: 403 }
    );
  }

  const updated = await prisma.flashcard.update({
    where: { id },
    data: { question, answer },
  });

  return NextResponse.json(updated);
}
