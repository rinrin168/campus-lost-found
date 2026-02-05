'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) router.replace('/login');
  }, [router]);

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('rememberMe');
    router.replace('/login');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg border flex items-center justify-center">
              🔍
            </div>
            <span className="font-bold text-purple-600">Campus Lost & Found</span>
          </div>

          <nav className="flex items-center gap-5 text-sm">
            <a href="#about" className="hover:text-purple-700">About Us</a>
            <a href="#items" className="hover:text-purple-700">Item</a>
            <Link href="/report" className="hover:text-purple-700">Report</Link>
            <a href="#reviews" className="hover:text-purple-700">More</a>

            <div className="hidden md:flex items-center gap-2 bg-purple-100 rounded-full px-3 py-1">
              <span className="text-purple-700">🔎</span>
              <input
                className="bg-transparent outline-none text-sm w-48"
                placeholder="Search"
              />
            </div>

            <button
              onClick={logout}
              className="bg-purple-200 hover:bg-purple-300 text-purple-900 px-4 py-2 rounded-full font-semibold"
            >
              Log Out
            </button>
          </nav>
        </div>
      </header>

      {/* Hero / About */}
      <section id="about" className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-purple-800 leading-tight">
              “Lost it? Don’t worry— <br />
              For we are the campus detectives”
            </h1>

            <p className="mt-6 text-lg text-purple-700 max-w-xl">
              From water bottles to laptops, our platform makes finding lost items way less stressful and a lot more fun.
              Post it, search it, and let the magic of campus kindness do the rest.
            </p>

            <Link
              href="/items"
              className="inline-flex items-center gap-3 mt-8 bg-purple-900 text-white px-7 py-3 rounded-full font-semibold hover:bg-purple-950"
            >
              Explore More <span aria-hidden>→</span>
            </Link>
          </div>

          <div className="flex justify-center">
            {/* Put your hero image in public/images/hero.png */}
            <div className="relative w-[360px] h-[260px]">
              <Image
                src="/images/hero.png"
                alt="Hero"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Items Preview */}
      <section id="items" className="mx-auto max-w-6xl px-6 pb-14">
        <h2 className="text-center text-2xl font-extrabold text-fuchsia-600 mb-6">
          Lost &amp; Found Items List
        </h2>

        <div className="bg-purple-100 rounded-3xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="relative h-28 w-full mb-3">
                  {/* Put items images in public/images/items/item1.png ... */}
                  <Image
                    src={`/images/items/item${i}.png`}
                    alt={`Item ${i}`}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-xs text-purple-900 font-semibold">
                  Green water bottle found on the floor.
                </p>
                <div className="flex justify-end mt-2 text-fuchsia-600 font-bold">→</div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-6">
            <Link
              href="/items"
              className="bg-white hover:bg-purple-50 border rounded-full px-6 py-2 font-semibold text-purple-800 inline-flex items-center gap-3"
            >
              Show More <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="text-center text-2xl font-extrabold text-fuchsia-600 mb-10">
          Review From Our User
        </h2>

        <div className="grid gap-10">
          <div className="relative">
            <div className="max-w-3xl mx-auto bg-purple-100 border border-fuchsia-300 rounded-full px-8 py-5 text-purple-900 font-semibold">
              “I honestly didn’t expect to get my item back so fast! The website is super easy to use, and everything is neatly organized…”
            </div>
            {/* Place images if you want */}
          </div>

          <div className="relative">
            <div className="max-w-3xl mx-auto bg-purple-100 border border-fuchsia-300 rounded-full px-8 py-5 text-purple-900 font-semibold">
              “It turned my ‘oh no, I lost it’ moment into a ‘wow, this actually works!’ experience.”
            </div>
          </div>

          <div className="relative">
            <div className="max-w-3xl mx-auto bg-purple-100 border border-fuchsia-300 rounded-full px-8 py-5 text-purple-900 font-semibold">
              “Posting and searching feels simple. I love how clean everything is!”
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-200">
        <div className="mx-auto max-w-6xl px-6 py-10 text-center">
          <div className="flex items-center justify-center gap-3 font-bold text-purple-900">
            <span className="h-9 w-9 rounded-lg border flex items-center justify-center bg-white">🔍</span>
            Campus Lost &amp; Found
          </div>

          <p className="text-sm text-purple-800 mt-4 max-w-2xl mx-auto">
            This platform encourages everyone to look out for one another by making it easy to report lost items,
            post found belongings, and reunite them with their rightful owners.
          </p>

          <button className="mt-6 bg-purple-900 text-white px-10 py-3 rounded-full font-semibold hover:bg-purple-950">
            Contact Us
          </button>

          <div className="mt-6 flex justify-center gap-4 text-purple-900">
            <span>🌐</span><span>📘</span><span>📸</span><span>💬</span><span>🎵</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

