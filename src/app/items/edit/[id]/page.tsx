"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type Item = {
  id: number;
  reporter: string;
  email: string;
  item: string;
  location: string;
  date: string;
  description: string;
  userId: string;
  image: string;
  telegram: string;
  phone: string;
  status: "Found" | "Lost";
  claimed: boolean;
};

const sampleItems: Item[] = [
  {
    id: 1,
    reporter: "Roth",
    email: "roth106@gmail.com",
    item: "Water Bottle",
    location: "Room 12",
    date: "21/01/2026",
    description: "Found on the floor, bottle is green and have initial S.R",
    userId: "user:roth234",
    image: "/images/water-bottle.jpg",
    telegram: "@roth234",
    phone: "+1 555-123-4567",
    status: "Found",
    claimed: false
  },
  {
    id: 2,
    reporter: "A",
    email: "a@example.com",
    item: "Phone",
    location: "Room 12",
    date: "21/01/2026",
    description: "Found on the floor, bottle is green and have initial S.R",
    userId: "user:a123",
    image: "/images/phone.jpg",
    telegram: "@a123",
    phone: "+1 555-987-6543",
    status: "Lost",
    claimed: true
  },
  {
    id: 3,
    reporter: "B",
    email: "b@example.com",
    item: "Water Bottle",
    location: "Room 12",
    date: "21/01/2026",
    description: "Found on the floor, bottle is green and have initial S.R",
    userId: "user:b456",
    image: "/images/water-bottle.jpg",
    telegram: "@b456",
    phone: "+1 555-456-7890",
    status: "Found",
    claimed: false
  }
];

export default function ItemEditPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    // Get current user
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setCurrentUser(parsed.userId || null);
      } catch (e) {
        setCurrentUser(null);
      }
    }

    // Get item data
    if (params?.id) {
      const itemId = Number(params.id);
      const found = sampleItems.find(x => x.id === itemId);
      if (found) {
        setItem(found);
      } else {
        router.push("/items");
      }
    }
  }, [params?.id, router]);

  // Check if user is the owner
  const isOwner = currentUser && item?.userId === currentUser;

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

  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Access Denied!</strong>
            <span className="block sm:inline">You don't have permission to edit this item.</span>
          </div>
          <button
            onClick={() => router.back()}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    console.log("Saving edited item:", item);
    alert("Item updated successfully!");
    router.push("/items");
  };

  const handleCancel = () => {
    router.push("/items");
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Column - Photo */}
      <div className="w-1/2 bg-[#f5e6ff] flex flex-col items-center justify-center p-12">
        <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-lg">
          <div className="bg-[#f5e6ff] rounded-xl p-12 flex flex-col items-center justify-center">
            {photo ? (
              <img 
                src={URL.createObjectURL(photo)} 
                alt="Preview" 
                className="w-full h-64 object-contain rounded-lg"
              />
            ) : item.image ? (
              <img 
                src={item.image} 
                alt={item.item} 
                className="w-full h-64 object-contain rounded-lg"
              />
            ) : (
              <div className="w-32 h-32 mb-4">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  className="w-full h-full text-purple-600"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
              </div>
            )}
            <div className="mt-4">
              <button
                onClick={() => document.getElementById("photo-upload")?.click()}
                className="text-purple-600 font-medium hover:underline"
              >
                {photo ? "Change Photo" : "Upload Photo"}
              </button>
            </div>
          </div>
          
          <input
            type="file"
            id="photo-upload"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files && setPhoto(e.target.files[0])}
          />
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="w-1/2 bg-[#f5e6ff] flex flex-col p-12">
        <div className="flex justify-between items-center mb-8">
          <Link href="/items" className="text-purple-600 text-xl">
            ←
          </Link>
          <h1 className="text-2xl font-bold text-purple-800">
            Edit Post
          </h1>
          <div className="w-8"></div>
        </div>

        <form 
          className="bg-white rounded-2xl p-8 shadow-lg flex-1 flex flex-col"
        >
          {/* Reporter Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-purple-800 mb-1">
              Reporter Name *
            </label>
            <input 
              type="text" 
              value={item.reporter}
              onChange={(e) => setItem({...item, reporter: e.target.value})}
              placeholder="Your Name" 
              className="w-full rounded-xl border border-purple-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-purple-800 mb-1">
              Email *
            </label>
            <input 
              type="email" 
              value={item.email}
              onChange={(e) => setItem({...item, email: e.target.value})}
              placeholder="your.email@example.com" 
              className="w-full rounded-xl border border-purple-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Item Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-purple-800 mb-1">
              Item Name *
            </label>
            <input 
              type="text" 
              value={item.item}
              onChange={(e) => setItem({...item, item: e.target.value})}
              placeholder="Ex. Water Bottle" 
              className="w-full rounded-xl border border-purple-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-purple-800 mb-1">
              Location *
            </label>
            <input 
              type="text" 
              value={item.location}
              onChange={(e) => setItem({...item, location: e.target.value})}
              placeholder="Where the item was last seen or found" 
              className="w-full rounded-xl border border-purple-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-purple-800 mb-1">
              Date *
            </label>
            <input 
              type="date" 
              value={item.date}
              onChange={(e) => setItem({...item, date: e.target.value})}
              className="w-full rounded-xl border border-purple-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4 flex-1">
            <label className="block text-sm font-medium text-purple-800 mb-1">
              Description *
            </label>
            <textarea 
              value={item.description}
              onChange={(e) => setItem({...item, description: e.target.value})}
              placeholder="Description of the item" 
              rows={4}
              className="w-full rounded-xl border border-purple-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            ></textarea>
          </div>

          {/* Status */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-purple-800 mb-1">
              Status *
            </label>
            <select 
              value={item.status}
              onChange={(e) => setItem({...item, status: e.target.value as "Found" | "Lost"})}
              className="w-full rounded-xl border border-purple-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Found">Found</option>
              <option value="Lost">Lost</option>
            </select>
          </div>

          {/* Claimed Status */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-purple-800 mb-1">
              Claimed Status
            </label>
            <select 
              value={item.claimed ? "claimed" : "unclaimed"}
              onChange={(e) => setItem({...item, claimed: e.target.value === "claimed"})}
              className="w-full rounded-xl border border-purple-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="unclaimed">Not Claimed</option>
              <option value="claimed">Claimed</option>
            </select>
          </div>

          {/* Phone Number */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-purple-800 mb-1">
              Phone Number
            </label>
            <input 
              type="tel" 
              value={item.phone}
              onChange={(e) => setItem({...item, phone: e.target.value})}
              placeholder="e.g., +1 555-123-4567" 
              className="w-full rounded-xl border border-purple-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Telegram Handle */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-purple-800 mb-1">
              Telegram Handle
            </label>
            <input 
              type="text" 
              value={item.telegram}
              onChange={(e) => setItem({...item, telegram: e.target.value})}
              placeholder="e.g., @username" 
              className="w-full rounded-xl border border-purple-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-auto pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2.5 rounded-xl font-semibold text-purple-600 border border-purple-200 hover:bg-purple-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}