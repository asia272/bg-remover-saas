"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaymentBanner() {
  const params = useSearchParams();
  const router = useRouter();
  const success = params.get("success") === "1";
  const canceled = params.get("canceled") === "1";

  // The webhook can arrive a moment after the redirect, so refresh the credits a few times.
  useEffect(() => {
    if (!success) return;
    const timers = [1500, 4000, 8000].map((ms) => setTimeout(() => router.refresh(), ms));
    return () => timers.forEach(clearTimeout);
  }, [success, router]);

  if (success) {
    return (
      <p className="mx-auto mt-6 max-w-xl rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
        Payment received! Your credits are being added.
      </p>
    );
  }
  if (canceled) {
    return (
      <p className="mx-auto mt-6 max-w-xl rounded-lg bg-gray-100 px-4 py-3 text-sm text-gray-600">
        Checkout canceled. You have not been charged.
      </p>
    );
  }
  return null;
}






