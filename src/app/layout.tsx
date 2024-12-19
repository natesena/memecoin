"use client";
import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`} suppressHydrationWarning>
        <header className="flex items-center justify-between p-4">
          <Link href="/">
            <h1 className="text-2xl font-bold">Memecoin Terminal</h1>
          </Link>
        </header>
        {children}
      </body>
    </html>
  );
}
