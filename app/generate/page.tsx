import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import GenerateForm from "@/components/GenerateForm"

export default async function GeneratePage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/login")

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">Generate Flashcards 🧠</h1>
      <GenerateForm />
    </div>
  )
}
