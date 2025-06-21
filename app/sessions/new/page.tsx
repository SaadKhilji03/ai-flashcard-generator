// app/sessions/new/page.tsx
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import NewSessionClient from "./NewSessionClient"

export default async function NewSessionPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) redirect("/login")

  return <NewSessionClient />
}
