"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export default function BuyButton({ packId, label }: { packId: string; label: string }) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    if (!isLoaded) return;
    if (!isSignedIn) return router.push("/sign-up");

    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.message ?? "Could not start checkout.");
      window.location.href = data.url; // go to Stripe's secure payment page
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="mt-auto">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="h-[55px] w-full rounded-[10px] bg-ink text-sm font-medium text-white transition hover:bg-black disabled:cursor-wait disabled:opacity-70"
      >
        {loading ? "Redirecting..." : label}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
