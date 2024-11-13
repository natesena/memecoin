"use client";
import { useRouter } from "next/navigation";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie =
      "memecoin_terminal_isAuthorized=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/");
  };

  return (
    <html lang="en">
      <body className={`antialiased`} suppressHydrationWarning>
        <header className="flex items-center justify-between p-4">
          <Link href="/">
            <h1 className="text-2xl font-bold">Memecoin Terminal</h1>
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border rounded-lg 
              bg-gray-100 dark:bg-gray-700
              hover:bg-gray-200 dark:hover:bg-gray-600
              text-gray-900 dark:text-gray-100
              border-gray-200 dark:border-gray-600"
          >
            Logout
          </button>
        </header>
        {children}
      </body>
    </html>
  );
}
