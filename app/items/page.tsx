// app/items/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Item = {
  id: string;
  reporter_name: string;
  email: string;
  phone: string;
  telegram: string;
  item_name: string;
  location: string;
  date: string;
  description: string;
  status: "Lost" | "Found";
  claimed: boolean;
  image_url: string;
  user_id: string;
};

export default function ItemsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      // Check auth
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/login");
        return;
      }
      setCurrentUser(session.user.id);

      // Load items
      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading items:", error);
      } else {
        setItems(data || []);
      }
      setLoading(false);
    };

    loadItems();
  }, [router]);

  const toggleClaimed = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from("items")
      .update({ claimed: !currentStatus })
      .eq("id", id);

    if (error) {
      alert("Failed to update item: " + error.message);
    } else {
      setItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, claimed: !currentStatus } : item
        )
      );
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/item/edit/${id}`);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-[color:var(--purple-lighter)]">
      {/* ... your existing header ... */}
      
      <h1 className="text-center text-xl font-extrabold mt-6 text-[color:var(--purple-dark)]">
        Lost & Found Items List
      </h1>

      <div className="mt-8 rounded-3xl bg-[color:var(--purple-light)] p-6">
        <div className="grid gap-4">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl bg-white p-5 shadow-sm border-l-4 border-[color:var(--purple-dark)]">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-32 mb-4 md:mb-0 flex items-center justify-center">
                  <div className="bg-[color:var(--purple-light)] w-24 h-24 rounded-xl overflow-hidden relative">
                    <img 
                      src={item.image_url} 
                      alt={item.item_name}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/default-item.jpg';
                      }}
                    />
                    {item.claimed && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold text-xs px-2 py-1 bg-green-600 rounded-full">
                          CLAIMED
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="w-full md:pl-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between mb-2">
                    <div>
                      <span className="font-bold text-[color:var(--purple-dark)]">Reporter: </span>
                      <span className="text-[color:var(--purple-dark)]">{item.reporter_name}</span>
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
                      <span className="text-[color:var(--purple-dark)]">{item.item_name}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[color:var(--purple-dark)]">Location: </span>
                      <span className="text-[color:var(--purple-dark)]">{item.location}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[color:var(--purple-dark)]">Date: </span>
                      <span className="text-[color:var(--purple-dark)]">{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <span className="font-bold text-[color:var(--purple-dark)]">Description: </span>
                    <span className="text-[color:var(--purple-dark)]">{item.description}</span>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between mb-3">
                    <div>
                      <span className="font-bold text-[color:var(--purple-dark)]">Phone: </span>
                      <span className="text-[color:var(--purple-dark)]">{item.phone || "—"} </span>
                    </div>
                    <div>
                      <span className="font-bold text-[color:var(--purple-dark)]">Telegram: </span>
                      <span className="text-[color:var(--purple-dark)]">{item.telegram || "—"}</span>
                    </div>
                  </div>
                  
                  {currentUser === item.user_id && (
                    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-3 pt-2 border-t border-gray-200 mt-2">
                      <div className="text-sm text-gray-500">
                        <span className="font-bold">Your Post</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleClaimed(item.id, item.claimed)}
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}