import "./globals.css";
import { Inter } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers session={session}>
          <Navbar />
          <main className="p-4">{children}</main>
        </Providers>
      </body>
    </html>
  );
}