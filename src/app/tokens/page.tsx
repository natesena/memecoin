"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TokensPage() {
  const router = useRouter();

  // Redirect to holders view by default
  useEffect(() => {
    router.push("/tokens/holders");
  }, [router]);

  return <div>Redirecting...</div>;
}
