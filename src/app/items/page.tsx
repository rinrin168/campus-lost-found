// src/app/items/page.tsx
import Link from "next/link";
import Image from "next/image";

const demoItems = [
  { id: 1, name: "Water Bottle", location: "Room 21", date: "25/01/2026", user: "user#254" },
  { id: 2, name: "Notebook", location: "Room 12", date: "25/01/2026", user: "user#010" },
  { id: 3, name: "Phone", location: "Library", date: "26/01/2026", user: "user#016" },
];

export default function ItemsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-semibold text-purpleDark">
            ← Back
          </Link>

          <div className="flex items-center gap-2 text-sm">
            <Link
              href="/items"
              className="rounded-full bg-purpleDark px-4 py-2 font-semibold text-white hover:bg-purpleDarker"
            >
              Item
            </Link>
            <Link
              href="/report"
              className="rounded-full bg-purpleLighter px-4 py-2 text-purpleDark hover:bg-purpleLight"
            >
              Report
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-center text-lg font-bold text-purpleDark">Lost &amp; Found Items List</h1>

        <div className="mt-6 rounded-2xl bg-purpleLight p-6">
          <div className="max-h-[460px] space-y-4 overflow-auto pr-2">
            {demoItems.map((item) => (
              <div
                key={item.id}
                className="grid gap-4 rounded-2xl bg-white p-4 shadow-sm md:grid-cols-[110px_1fr]"
              >
                {/* Image */}
                <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-purpleLighter">
                  <Image
                    src={`/images/items/item${item.id}.png`}
                    alt={item.name}
                    fill
                    className="object-contain p-2"
                  />
                </div>

                {/* Info */}
                <div className="text-sm text-purpleDark">
                  <div className="grid gap-1 md:grid-cols-2">
                    <p><span className="font-semibold">Reporter:</span> Ruth</p>
                    <p><span className="font-semibold">Email:</span> Ruth06@gmail.com</p>
                    <p><span className="font-semibold">Item:</span> {item.name}</p>
                    <p><span className="font-semibold">Location:</span> {item.location}</p>
                    <p><span className="font-semibold">Date:</span> {item.date}</p>
                    <p><span className="font-semibold">User:</span> {item.user}</p>
                  </div>

                  <p className="mt-2 text-purpleDark/70">
                    <span className="font-semibold text-purpleDark">Description:</span>{" "}
                    Found on the floor; please contact to claim.
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              href="/report"
              className="rounded-full bg-purpleDark px-6 py-2 text-sm font-semibold text-white hover:bg-purpleDarker"
            >
              Report New Item
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
