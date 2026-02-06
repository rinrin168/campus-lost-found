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

  // Sample data - in real app, this would come from an API
  const items = [
    {
      id: 1,
      reporter: "Roth",
      email: "roth106@gmail.com",
      item: "Water Bottle",
      location: "Room 12",
      date: "21/01/2026",
      description: "Found on the floor, bottle is green and have initial S.R",
      userId: "user:roth234"
    },
    {
      id: 2,
      reporter: "Roth",
      email: "roth106@gmail.com",
      item: "Water Bottle",
      location: "Room 12",
      date: "21/01/2026",
      description: "Found on the floor, bottle is green and have initial S.R",
      userId: "user:roth234"
    },
    {
      id: 3,
      reporter: "Roth",
      email: "roth106@gmail.com",
      item: "Water Bottle",
      location: "Room 12",
      date: "21/01/2026",
      description: "Found on the floor, bottle is green and have initial S.R",
      userId: "user:roth234"
    }
  ];

  return (
    <div className="min-h-screen px-6 py-10 bg-[color:var(--purple-lighter)]">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <Link href="/landing" className="font-semibold text-[color:var(--purple-dark)] flex items-center">
            ← Back
          </Link>
          <Link href="/report" className="font-semibold text-[color:var(--purple-dark)] flex items-center">
            <span className="bg-[color:var(--purple-dark)] text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">+</span>
            Report
          </Link>
        </div>

        <h1 className="text-center text-xl font-extrabold mt-6 text-[color:var(--purple-dark)]">
          Lost & Found Items List
        </h1>

        <div className="mt-8 rounded-3xl bg-[color:var(--purple-light)] p-6">
          <div className="grid gap-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex flex-col md:flex-row">
                  {/* Image Column */}
                  <div className="w-full md:w-32 mb-4 md:mb-0 flex items-center justify-center">
                    <div className="bg-[color:var(--purple-light)] w-24 h-24 rounded-xl flex items-center justify-center">
                      <span className="text-[color:var(--purple-dark)] font-bold text-xl">B</span>
                    </div>
                  </div>
                  
                  {/* Details Column */}
                  <div className="w-full md:pl-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                      <div>
                        <span className="font-bold text-[color:var(--purple-dark)]">Reporter: </span>
                        <span className="text-[color:var(--purple-dark)]">{item.reporter}</span>
                      </div>
                      <div>
                        <span className="font-bold text-[color:var(--purple-dark)]">Email: </span>
                        <span className="text-[color:var(--purple-dark)]">{item.email}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                      <div>
                        <span className="font-bold text-[color:var(--purple-dark)]">Item: </span>
                        <span className="text-[color:var(--purple-dark)]">{item.item}</span>
                      </div>
                      <div>
                        <span className="font-bold text-[color:var(--purple-dark)]">Location: </span>
                        <span className="text-[color:var(--purple-dark)]">{item.location}</span>
                      </div>
                      <div>
                        <span className="font-bold text-[color:var(--purple-dark)]">Date: </span>
                        <span className="text-[color:var(--purple-dark)]">{item.date}</span>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <span className="font-bold text-[color:var(--purple-dark)]">Description: </span>
                      <span className="text-[color:var(--purple-dark)]">{item.description}</span>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                      <div className="text-sm text-gray-500">
                        <span className="font-bold">{item.userId}</span>
                      </div>
                      <Link 
                        href={`/item/${item.id}`} 
                        className="text-[color:var(--purple-dark)] font-medium hover:underline"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}