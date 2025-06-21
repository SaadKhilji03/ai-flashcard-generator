"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white border-b shadow-sm p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold text-black">
        🧠 AI Flashcards
      </Link>

      <div className="space-x-4">
        {session?.user ? (
          <>
            <Link href="/dashboard" className="text-gray-700 hover:underline">
              Dashboard
            </Link>
            <Link href="/sessions" className="text-gray-700 hover:underline">
                My Study Sessions
            </Link>
            <span className="text-gray-500">
              Hi, {session.user.name || session.user.email}
            </span>
            <button
              onClick={() => signOut()}
              className="text-red-600 hover:underline"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-gray-700 hover:underline">
              Login
            </Link>
            <Link href="/register" className="text-gray-700 hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
