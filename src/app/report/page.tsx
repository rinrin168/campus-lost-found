// src/app/report/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function ReportPage() {
  const [form, setForm] = useState({
    reporter: "",
    email: "",
    itemName: "",
    waterBottle: "",
    location: "",
    date: "",
    description: "",
    status: "Lost",
  });

  const onChange = (key: string, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Submitted (demo)");
    console.log(form);
  };

  return (
    <div className="min-h-screen bg-purpleLighter">
      {/* Simple top bar */}
      <header className="bg-white border-b">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold text-purpleDark">← Back</Link>

          <div className="flex gap-2 text-sm">
            <Link href="/items" className="rounded-full bg-purpleLighter px-4 py-2 text-purpleDark hover:bg-purpleLight">
              Item
            </Link>
            <Link href="/report" className="rounded-full bg-purpleDark px-4 py-2 text-white font-semibold hover:bg-purpleDarker">
              Report
            </Link>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Upload box (UI only) */}
          <div className="flex items-center justify-center rounded-2xl bg-purpleLight p-8">
            <div className="w-full max-w-sm rounded-2xl bg-purpleLighter p-8 text-center">
              <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-2xl border-2 border-dashed border-purpleDark/30 bg-white">
                <span className="text-4xl">🖼️</span>
              </div>

              <p className="mt-4 text-sm font-semibold text-purpleDark">Edit Upload Photo</p>

              <button
                type="button"
                className="mt-4 rounded-full bg-white px-6 py-2 text-sm font-semibold text-purpleDark hover:bg-purpleLight"
              >
                Upload Photo
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl bg-purpleLight p-8">
            <h1 className="text-center text-lg font-bold text-purpleDark">Edit Post</h1>

            <form onSubmit={onSubmit} className="mt-5 space-y-3">
              <input
                className="w-full rounded-lg border bg-white p-2 text-sm"
                placeholder="Reporter Name/Email"
                value={form.reporter}
                onChange={(e) => onChange("reporter", e.target.value)}
              />

              <input
                className="w-full rounded-lg border bg-white p-2 text-sm"
                placeholder="Username or Email"
                value={form.email}
                onChange={(e) => onChange("email", e.target.value)}
              />

              <input
                className="w-full rounded-lg border bg-white p-2 text-sm"
                placeholder="Item Name"
                value={form.itemName}
                onChange={(e) => onChange("itemName", e.target.value)}
              />

              <input
                className="w-full rounded-lg border bg-white p-2 text-sm"
                placeholder="Ex. Water Bottle"
                value={form.waterBottle}
                onChange={(e) => onChange("waterBottle", e.target.value)}
              />

              <div className="grid gap-3 md:grid-cols-2">
                <input
                  className="w-full rounded-lg border bg-white p-2 text-sm"
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) => onChange("location", e.target.value)}
                />
                <input
                  className="w-full rounded-lg border bg-white p-2 text-sm"
                  placeholder="Date"
                  value={form.date}
                  onChange={(e) => onChange("date", e.target.value)}
                />
              </div>

              <textarea
                className="w-full rounded-lg border bg-white p-2 text-sm"
                placeholder="Description of the item (keep it short)"
                rows={3}
                value={form.description}
                onChange={(e) => onChange("description", e.target.value)}
              />

              <select
                className="w-full rounded-lg border bg-white p-2 text-sm"
                value={form.status}
                onChange={(e) => onChange("status", e.target.value)}
              >
                <option>Lost</option>
                <option>Found</option>
              </select>

              <div className="flex justify-between pt-2">
                <Link
                  href="/"
                  className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-purpleDark hover:bg-purpleLighter"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="rounded-full bg-purpleDark px-6 py-2 text-sm font-semibold text-white hover:bg-purpleDarker"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
