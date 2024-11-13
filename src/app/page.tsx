"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const [password, setPassword] = useState("");

  const [error, setError] = useState(false);

  const checkPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "500gwei" || password === "tango") {
      // You can change this password
      document.cookie = "memecoin_terminal_isAuthorized=true; path=/";
      localStorage.setItem("memecoin_terminal_isAuthorized", "true");
      router.push("/tokens/holders");
    } else {
      setError(true);
    }
  };

  // Check if already authorized
  useEffect(() => {
    if (localStorage.getItem("memecoin_terminal_isAuthorized") === "true") {
      router.push("/tokens/holders");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={checkPassword}
        className="flex flex-col gap-4 w-full max-w-sm p-8"
      >
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="w-full px-3 py-2 border rounded-lg 
            bg-gray-50 dark:bg-gray-800 
            text-gray-900 dark:text-gray-100
            border-gray-200 dark:border-gray-700
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600"
        />
        {error && <p className="text-sm text-gray-500">Incorrect password</p>}
        <button
          type="submit"
          className="px-4 py-2 border rounded-lg 
            bg-gray-100 dark:bg-gray-700
            hover:bg-gray-200 dark:hover:bg-gray-600
            text-gray-900 dark:text-gray-100
            border-gray-200 dark:border-gray-600"
        >
          Enter
        </button>
      </form>
    </div>
  );
}
