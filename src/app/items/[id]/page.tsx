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
    image: "/images/water-bottle.jpg"
  },
  {
    id: 2,
    reporter: "A",
    email: "a@example.com",
    item: "Phone",
    location: "Room 12",
    date: "21/01/2026",
    description: "Found phone near classroom door",
    userId: "user:a123",
    image: "/images/phone.jpg"
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
    image: "/images/water-bottle.jpg"
  }
];

export default function ItemDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [item, setItem] = useState<Item | null>(null);
  const [editedItem, setEditedItem] = useState<Item | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [currentUser, setCurrentUser] = useState<string>("");

  useEffect(() => {
    // Get current user from localStorage
    const userData = localStorage.getItem("userData");
    if (userData) {
      const parsed = JSON.parse(userData);
      setCurrentUser(parsed.userId || "");
    }

    if (!params?.id) return;

    const itemId = Number(params.id);
    const found = sampleItems.find((x) => x.id === itemId);
    
    if (!found) {
      router.replace("/items");
      return;
    }
    
    setItem(found);
    setEditedItem({ ...found });
  }, [params?.id, router]);

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

  const isOwner = currentUser === item.userId;

  const handleSave = () => {
    if (!editedItem) return;
    
    // In a real app, you would save to a database here
    console.log("Saving item:", editedItem);
    alert("Post updated successfully!");
    setIsEditing(false);
    setItem(editedItem);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedItem(item ? { ...item } : null);
    setPhoto(null);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this post?")) {
      // In a real app, you would delete from database here
      console.log("Deleting item:", item.id);
      alert("Post deleted successfully!");
      router.push("/items");
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Column - Photo */}
      <div className="w-1/2 bg-[#f5e6ff] flex flex-col items-center justify-center p-12">
        <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-lg">
          <div className="bg-[#f5e6ff] rounded-xl p-12 flex flex-col items-center justify-center">
            {isEditing ? (
              // Edit mode - upload new photo
              <div className="w-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-purple-300 rounded-lg p-8">
                {photo ? (
                  <img 
                    src={URL.createObjectURL(photo)} 
                    alt="Preview" 
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : editedItem?.image ? (
                  <img 
                    src={editedItem.image} 
                    alt={editedItem.item} 
                    className="w-full h-full object-contain rounded-lg"
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
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => e.target.files && setPhoto(e.target.files[0])}
                  />
                </div>
              </div>
            ) : (
              // View mode - display photo
              <div className="w-full h-64 flex items-center justify-center">
                {item.image ? (
                  <img 
                    src={item.image} 
                    alt={item.item} 
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-32 h-32">
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
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column - Details/Form */}
      <div className="w-1/2 bg-[#f5e6ff] flex flex-col p-12">
        <div className="flex justify-between items-center mb-8">
          <Link href="/items" className="text-purple-600 text-xl">
            ←
          </Link>
          <h1 className="text-2xl font-bold text-purple-800">
            {isEditing ? "Edit Post" : "Post Details"}
          </h1>
          <div className="flex gap-2">
            {isOwner && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Edit
              </button>
            )}
            {isOwner && isEditing && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg flex-1 flex flex-col">
          {isEditing ? (
            // Edit Mode - Form
            <form className="space-y-6 flex-1 flex flex-col">
              {/* Reporter Name/Email */}
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-1">
                  Reporter Name
                </label>
                <input 
                  type="text" 
                  value={editedItem?.reporter || ""}
                  onChange={(e) => setEditedItem(prev => prev ? { ...prev, reporter: e.target.value } : null)}
                  placeholder="Your Name" 
                  className="w-full rounded-xl border border-purple-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Item Name */}
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-1">
                  Item Name
                </label>
                <input 
                  type="text" 
                  value={editedItem?.item || ""}
                  onChange={(e) => setEditedItem(prev => prev ? { ...prev, item: e.target.value } : null)}
                  placeholder="Ex. Water Bottle" 
                  className="w-full rounded-xl border border-purple-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-1">
                  Location
                </label>
                <input 
                  type="text" 
                  value={editedItem?.location || ""}
                  onChange={(e) => setEditedItem(prev => prev ? { ...prev, location: e.target.value } : null)}
                  placeholder="Where the item was last seen or found" 
                  className="w-full rounded-xl border border-purple-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-purple-800 mb-1">
                  Date
                </label>
                <input 
                  type="date" 
                  value={editedItem?.date || ""}
                  onChange={(e) => setEditedItem(prev => prev ? { ...prev, date: e.target.value } : null)}
                  className="w-full rounded-xl border border-purple-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              {/* Description */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-purple-800 mb-1">
                  Description
                </label>
                <textarea 
                  value={editedItem?.description || ""}
                  onChange={(e) => setEditedItem(prev => prev ? { ...prev, description: e.target.value } : null)}
                  placeholder="Description of the item" 
                  rows={4}
                  className="w-full rounded-xl border border-purple-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                ></textarea>
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
          ) : (
            // View Mode - Display Details
            <div className="space-y-4">
              <div>
                <span className="font-bold text-purple-800">Reporter:</span>
                <p className="text-gray-700 mt-1">{item.reporter}</p>
              </div>

              <div>
                <span className="font-bold text-purple-800">Email:</span>
                <p className="text-gray-700 mt-1">{item.email}</p>
              </div>

              <div>
                <span className="font-bold text-purple-800">Item:</span>
                <p className="text-gray-700 mt-1">{item.item}</p>
              </div>

              <div>
                <span className="font-bold text-purple-800">Location:</span>
                <p className="text-gray-700 mt-1">{item.location}</p>
              </div>

              <div>
                <span className="font-bold text-purple-800">Date:</span>
                <p className="text-gray-700 mt-1">{item.date}</p>
              </div>

              <div>
                <span className="font-bold text-purple-800">Description:</span>
                <p className="text-gray-700 mt-1">{item.description}</p>
              </div>

              <div>
                <span className="font-bold text-purple-800">User ID:</span>
                <p className="text-gray-700 mt-1 text-sm">{item.userId}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}