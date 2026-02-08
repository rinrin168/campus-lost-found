"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ItemsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const ok = localStorage.getItem("isLoggedIn") === "true";
    if (!ok) router.replace("/login");
    
    // Get current user ID from localStorage
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setCurrentUser(parsed.userId || null);
      } catch (e) {
        setCurrentUser(null);
      }
    }
  }, [router]);
  
  const [items, setItems] = useState([
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
  ]);

  // Toggle claimed status
  const toggleClaimed = (id: number) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, claimed: !item.claimed } : item
      )
    );
    
    // In real app: API call to update claimed status
    const updatedItem = items.find(item => item.id === id);
    if (updatedItem) {
      console.log(`Item ${id} marked as ${!updatedItem.claimed ? 'claimed' : 'unclaimed'}`);
      alert(`Item "${updatedItem.item}" has been ${!updatedItem.claimed ? 'marked as claimed' : 'unclaimed'}`);
    }
  };

  // Navigate to edit page
  const handleEdit = (id: number) => {
    router.push(`/item/edit/${id}`);
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-[color:var(--purple-lighter)]">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/landing" className="font-semibold text-[color:var(--purple-dark)] flex items-center">
            ← Home
          </Link>
        </div>

        <h1 className="text-center text-xl font-extrabold mt-6 text-[color:var(--purple-dark)]">
          Lost & Found Items List
        </h1>

        <div className="mt-8 rounded-3xl bg-[color:var(--purple-light)] p-6">
          <div className="grid gap-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl bg-white p-5 shadow-sm border-l-4 border-[color:var(--purple-dark)]">
                <div className="flex flex-col md:flex-row">
                  {/* Image Column */}
                  <div className="w-full md:w-32 mb-4 md:mb-0 flex items-center justify-center">
                    <div className="bg-[color:var(--purple-light)] w-24 h-24 rounded-xl overflow-hidden relative">
                      <img 
                        src={item.image} 
                        alt={item.item}
                        className="object-cover w-full h-full"
                      />
                      {/* Claimed Badge Overlay */}
                      {item.claimed && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white font-bold text-xs px-2 py-1 bg-green-600 rounded-full">
                            CLAIMED
                          </span>
                        </div>
                      )}
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
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[color:var(--purple-dark)]">Status: </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.status === 'Found' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                        {item.claimed && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            Claimed
                          </span>
                        )}
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
                    
                    {/* Contact Information */}
                    <div className="flex flex-col sm:flex-row sm:justify-between mb-3">
                      <div>
                        <span className="font-bold text-[color:var(--purple-dark)]">Phone: </span>
                        <span className="text-[color:var(--purple-dark)]">{item.phone}</span>
                      </div>
                      <div>
                        <span className="font-bold text-[color:var(--purple-dark)]">Telegram: </span>
                        <span className="text-[color:var(--purple-dark)]">{item.telegram}</span>
                      </div>
                    </div>
                    
                    {/* Action Buttons - Only visible to item owner */}
                    {currentUser === item.userId && (
                      <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 pt-2 border-t border-gray-200 mt-2">
                        <div className="text-sm text-gray-500">
                          <span className="font-bold">Your Post • User ID: {item.userId}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleClaimed(item.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              item.claimed 
                                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                                : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                            }`}
                          >
                            {item.claimed ? 'Mark as Unclaimed' : 'Mark as Claimed'}
                          </button>
                          <button
                            onClick={() => handleEdit(item.id)}
                            className="px-3 py-1.5 bg-[color:var(--purple-dark)] text-white rounded-lg text-xs font-medium hover:bg-[color:var(--purple-darker)] transition-colors"
                          >
                            Edit Post
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* For non-owners or when not logged in */}
                    {currentUser !== item.userId && (
                      <div className="text-sm text-gray-500 pt-2 border-t border-gray-200 mt-2">
                        <span className="font-bold">User ID: {item.userId}</span>
                      </div>
                    )}
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