// src/app/landing/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const ok = localStorage.getItem("isLoggedIn") === "true";
    if (!ok) router.replace("/login");
  }, [router]);

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="w-full">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md border flex items-center justify-center">
              🔍
            </div>
            <span className="font-semibold text-[var(--purple-dark)]">Campus Lost & Found</span>
          </div>

          <nav className="flex items-center gap-3 text-sm">
            <Link href="/report" className="px-4 py-2 rounded-full bg-[var(--purple-light)] text-[var(--purple-dark)]">
              Report
            </Link>
            <Link href="/items" className="px-4 py-2 rounded-full bg-[var(--purple-light)] text-[var(--purple-dark)]">
              Items
            </Link>

            {/* ✅ Logout button goes here */}
            <button
              onClick={logout}
              className="px-4 py-2 rounded-full bg-[var(--purple-dark)] text-white"
            >
              Log Out
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-10 md:grid-cols-2 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--purple-dark)] leading-tight">
              “Lost it? Don’t worry —
              <br />
              For we are the campus detectives”
            </h1>

            <p className="mt-4 text-gray-600 max-w-md">
              From water bottles to laptops, our platform makes finding lost items way less stressful and a lot more fun.
              Post it, search it, and let the magic of campus kindness do the rest.
            </p>

            <div className="mt-6 flex gap-3">
              <Link
                href="/items"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--purple-dark)] text-white font-semibold"
              >
                Explore More →
              </Link>

              <Link
                href="/report"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[var(--purple-dark)] text-[var(--purple-dark)] font-semibold"
              >
                Report Item
              </Link>
            </div>
          </div>

          <div className="relative w-full h-[280px] md:h-[360px]">
            {/* Put your hero image in /public/images/hero.png */}
            <Image
              src="/images/hero.png"
              alt="Hero illustration"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </section>

      {/* Items preview */}
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <h2 className="text-center font-bold text-[var(--purple-dark)]">
          Lost &amp; Found Items List
        </h2>

        <div className="mt-4 rounded-2xl bg-[var(--purple-light)] p-6">
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-5">
            {[1, 2, 3, 4, 5].map((id) => (
              <div key={id} className="bg-white rounded-xl p-3 shadow-sm">
                <div className="relative h-28 w-full bg-[var(--purple-lighter)] rounded-lg overflow-hidden">
                  <Image
                    src={`/images/items/item${id}.png`}
                    alt={`Item ${id}`}
                    fill
                    className="object-contain p-2"
                  />
                </div>
                <p className="mt-2 text-xs text-gray-600">Found near the library.</p>
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-center">
            <Link
              href="/items"
              className="px-5 py-2 rounded-full bg-white text-[var(--purple-dark)] font-semibold"
            >
              Show More →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
