"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReportPage() {
  const router = useRouter();

  useEffect(() => {
    const ok = localStorage.getItem("isLoggedIn") === "true";
    if (!ok) router.replace("/login");
  }, [router]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Demo: submitted!");
    router.push("/items");
  }

  return (
    <div className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <Link href="/landing" className="font-semibold text-[color:var(--purple-dark)]">
            ← Back
          </Link>
          <Link href="/items" className="font-semibold text-[color:var(--purple-dark)]">
            Items
          </Link>
        </div>

        <h1 className="text-center text-xl font-extrabold mt-6 text-[color:var(--purple-dark)]">
          Report New Item
        </h1>

        <form
          onSubmit={onSubmit}
          className="mt-8 rounded-3xl bg-[color:var(--purple-light)] p-8 space-y-4"
        >
          <input className="w-full rounded-xl border px-4 py-3" placeholder="Reporter Name" />
          <input className="w-full rounded-xl border px-4 py-3" placeholder="Email" />
          <input className="w-full rounded-xl border px-4 py-3" placeholder="Item Name" />
          <input className="w-full rounded-xl border px-4 py-3" placeholder="Location" />
          <textarea className="w-full rounded-xl border px-4 py-3" placeholder="Description" />

          <div className="flex justify-end">
            <button
              className="rounded-full px-8 py-3 font-semibold text-white"
              style={{ background: "var(--purple-dark)" }}
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
