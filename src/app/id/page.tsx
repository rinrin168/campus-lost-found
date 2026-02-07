"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Item = {
  id: number;
  reporter: string;
  email: string;
  itemName: string;
  location: string;
  date: string;
  description: string;
  userId: string;
  image: string;
  status: string;
};

const sampleItems: Item[] = [
  {
    id: 1,
    reporter: "Roth",
    email: "roth106@gmail.com",
    itemName: "Water Bottle",
    location: "Room 12",
    date: "21/01/2026",
    description: "Found on the floor, bottle is green and have initial S.R",
    userId: "user:roth234",
    image: "/images/water-bottle.jpg",
    status: "Found",
  },
  {
    id: 2,
    reporter: "A",
    email: "a@example.com",
    itemName: "Phone",
    location: "Room 12",
    date: "21/01/2026",
    description: "Found phone near classroom door",
    userId: "user:a123",
    image: "/images/phone.jpg",
    status: "Found",
  },
  {
    id: 3,
    reporter: "B",
    email: "b@example.com",
    itemName: "Laptop",
    location: "Library",
    date: "21/01/2026",
    description: "Laptop found on table in library",
    userId: "user:b456",
    image: "/images/laptop.jpg",
    status: "Found",
  },
];

export default function ItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const itemId = useMemo(() => Number(params?.id), [params?.id]);
  const [item, setItem] = useState<Item | null>(null);

  useEffect(() => {
    if (!itemId || Number.isNaN(itemId)) return;

    const found = sampleItems.find((x) => x.id === itemId);
    if (!found) {
      router.replace("/items");
      return;
    }
    setItem(found);
  }, [itemId, router]);

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mx-auto mb-4" />
          <p className="text-gray-700">Loading item details...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <Link href="/items" className="text-purple-700 font-semibold hover:underline">
            ← Back to Items
          </Link>

          <Link
            href="/report"
            className="bg-purple-700 text-white px-4 py-2 rounded-xl font-semibold hover:bg-purple-800 transition"
          >
            + Post
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image */}
            <div className="p-6">
              <div className="bg-purple-100 rounded-2xl p-6 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt={item.itemName}
                  className="w-full max-w-md h-72 object-contain"
                />
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-800">
                  Status: {item.status}
                </span>
                <span className="text-xs text-gray-500">ID: {item.id}</span>
              </div>
            </div>

            {/* Details */}
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{item.itemName}</h1>

              <div className="space-y-3 text-gray-800">
                <Row label="Reporter" value={item.reporter} />
                <Row label="Email" value={item.email} />
                <Row label="User" value={item.userId} />
                <Row label="Location" value={item.location} />
                <Row label="Date" value={item.date} />
              </div>

              <div className="mt-6">
                <p className="font-semibold text-gray-900 mb-2">Description</p>
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  className="flex-1 bg-purple-700 text-white rounded-xl py-2 font-semibold hover:bg-purple-800 transition"
                  onClick={() => alert("Contact feature later")}
                >
                  Contact Reporter
                </button>
                <button
                  className="flex-1 border border-purple-200 bg-white rounded-xl py-2 font-semibold text-purple-800 hover:bg-purple-50 transition"
                  onClick={() => router.push("/report")}
                >
                  Post Another
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="font-semibold text-purple-900 min-w-24">{label}:</span>
      <span className="text-gray-800">{value}</span>
    </div>
  );
}
