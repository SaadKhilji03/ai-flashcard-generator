'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const res = await signIn('credentials', {
      ...form,
      redirect: false,
    })

    if (res?.ok) {
      router.push('/')
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="flex justify-center items-center h-screen px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-sm text-red-500">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
            />
            <Button type="submit" className="w-full">
              Log In
            </Button>
          </form>

          <Button
            variant="secondary"
            onClick={() => signIn("github")}
            className="w-full"
          >
            Sign in with GitHub
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
