"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ReportPage() {
  const router = useRouter();
  const [photo, setPhoto] = useState<File | null>(null);
  const [status, setStatus] = useState<'lost' | 'found'>('found');

  useEffect(() => {
    const ok = localStorage.getItem("isLoggedIn") === "true";
    if (!ok) router.replace("/login");
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app: handle form submission
    console.log("Form submitted:", {
      photo,
      status,
      // Other form data
    });
    alert("Demo: submitted!");
    router.push("/items");
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-[color:var(--purple-lighter)]">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <Link href="/landing" className="font-semibold text-[color:var(--purple-dark)] flex items-center">
            ← Back
          </Link>
          <Link href="/items" className="font-semibold text-[color:var(--purple-dark)] flex items-center">
            Items
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-[color:var(--purple-dark)] mb-2">
            Report Your Finding Here!
          </h1>
          <p className="text-[color:var(--purple-dark)]">
            Report the item you lost or found to help your campus community!
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-3xl bg-[color:var(--purple-light)] p-8 space-y-6"
        >
          {/* Reporter Name/Email */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
              Reporter Name/Email
            </label>
            <input 
              type="text" 
              placeholder="Username or Email" 
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[color:var(--purple-dark)]"
            />
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
              Item Name
            </label>
            <input 
              type="text" 
              placeholder="Ex. Water Bottle" 
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[color:var(--purple-dark)]"
            />
          </div>

          {/* Upload Photo */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
              Upload a Photo
            </label>
            <div className="border-2 border-dashed border-[color:var(--purple-dark)] rounded-xl p-6 text-center cursor-pointer hover:border-purple-700 transition-colors">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                id="photo-upload"
                onChange={(e) => e.target.files && setPhoto(e.target.files[0])}
              />
              <label 
                htmlFor="photo-upload"
                className="text-[color:var(--purple-dark)] font-medium hover:underline cursor-pointer"
              >
                Upload Photo
              </label>
              <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
              Location
            </label>
            <input 
              type="text" 
              placeholder="Where the item was last seen or found" 
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[color:var(--purple-dark)]"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
              Date
            </label>
            <input 
              type="date" 
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[color:var(--purple-dark)]"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
              Description
            </label>
            <textarea 
              placeholder="Description of the item (less than 100 words)" 
              rows={3}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[color:var(--purple-dark)]"
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">Max 100 words</p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
              Status
            </label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value as 'lost' | 'found')}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[color:var(--purple-dark)]"
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">(The item is a Lost or Found Item)</p>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              className="px-8 py-3 rounded-full font-semibold text-[color:var(--purple-dark)] border border-[color:var(--purple-dark)] hover:bg-[color:var(--purple-light)] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-full font-semibold text-white bg-[color:var(--purple-dark)] hover:bg-[color:var(--purple-darker)] transition-colors"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}