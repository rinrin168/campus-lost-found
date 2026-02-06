"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ItemsPage() {
  const router = useRouter();

  useEffect(() => {
    const ok = localStorage.getItem("isLoggedIn") === "true";
    if (!ok) router.replace("/login");
  }, [router]);

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <Link href="/landing" className="font-semibold text-[color:var(--purple-dark)]">
            ← Back
          </Link>
          <Link href="/report" className="font-semibold text-[color:var(--purple-dark)]">
            Report
          </Link>
        </div>

        <h1 className="text-center text-xl font-extrabold mt-6 text-[color:var(--purple-dark)]">
          Lost &amp; Found Items List
        </h1>

        <div className="mt-8 rounded-3xl bg-[color:var(--purple-light)] p-6">
          <div className="grid gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="font-bold text-[color:var(--purple-dark)]">Item #{i + 1}</div>
                <div className="text-sm text-gray-600 mt-1">
                  Found on the floor; please contact to claim.
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
