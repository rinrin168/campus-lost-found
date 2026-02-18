"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Item = {
  id: string;
  reporter_name: string;
  email: string;
  phone: string | null;
  telegram: string | null;
  item_name: string;
  location: string;
  date: string;
  description: string;
  status: "Lost" | "Found";
  claimed: boolean;
  image_url: string | null;
  user_id: string;
  created_at: string;
};

export default function ItemsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Lost" | "Found">("all");
  const [claimedFilter, setClaimedFilter] = useState<"all" | "true" | "false">("all");

  useEffect(() => {
    const loadItems = async () => {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError || !session) {
        router.replace("/login");
        return;
      }
      setCurrentUser(session.user.id);

      const { data, error } = await supabase
        .from("items")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading items:", error);
        alert("Failed to load items.");
      } else {
        setItems(data || []);
      }
      setLoading(false);
    };

    loadItems();

    const channel = supabase
      .channel('items-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'items' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setItems(prev => [payload.new as Item, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setItems(prev => prev.map(item => 
              item.id === payload.new.id ? payload.new as Item : item
            ));
          } else if (payload.eventType === 'DELETE') {
            setItems(prev => prev.filter(item => item.id !== (payload.old as Item).id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }
      
      if (claimedFilter === "true" && !item.claimed) {
        return false;
      }
      if (claimedFilter === "false" && item.claimed) {
        return false;
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.item_name.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.reporter_name.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [items, searchQuery, statusFilter, claimedFilter]);

  const toggleClaimed = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, claimed: newStatus } : item
    ));

    const { error } = await supabase
      .from("items")
      .update({ claimed: newStatus })
      .eq("id", id);

    if (error) {
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, claimed: currentStatus } : item
      ));
      alert("Failed to update item: " + error.message);
    }
  };

  const handleDelete = async (id: string, imageUrl: string | null) => {
    if (!confirm("Are you sure? This cannot be undone.")) return;

    const deletedItem = items.find(item => item.id === id);
    setItems(prev => prev.filter(item => item.id !== id));

    try {
      if (imageUrl && !imageUrl.includes('default-item.jpg')) {
        const fileName = imageUrl.split('/').slice(-2).join('/');
        await supabase.storage.from('item-images').remove([fileName]);
      }

      const { error } = await supabase.from("items").delete().eq("id", id);
      if (error) throw error;
    } catch (error: any) {
      if (deletedItem) setItems(prev => [deletedItem, ...prev]);
      alert("Delete failed: " + error.message);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/item/edit/${id}`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--purple-lighter)]">
        <p className="text-[color:var(--purple-dark)]">Loading items...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-[color:var(--purple-lighter)]">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <Link href="/landing" className="font-semibold text-[color:var(--purple-dark)] hover:underline">
            ← Back to Home
          </Link>
          <div className="flex gap-3">
            <Link href="/report" className="px-6 py-2 bg-[color:var(--purple-dark)] text-white rounded-full font-semibold hover:bg-[color:var(--purple-darker)]">
              + Report Item
            </Link>
            <button onClick={handleLogout} className="px-6 py-2 border-2 border-[color:var(--purple-dark)] text-[color:var(--purple-dark)] rounded-full font-semibold hover:bg-[color:var(--purple-light)]">
              Logout
            </button>
          </div>
        </div>

        <h1 className="text-center text-3xl font-extrabold mb-2 text-[color:var(--purple-dark)]">
          Lost & Found Items
        </h1>

        <div className="mb-6 rounded-3xl bg-[color:var(--purple-light)] p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Item, location, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--purple-dark)]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as "all" | "Lost" | "Found")}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--purple-dark)]"
              >
                <option value="all">All Items</option>
                <option value="Lost">Lost</option>
                <option value="Found">Found</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
                Claim Status
              </label>
              <select
                value={claimedFilter}
                onChange={(e) => setClaimedFilter(e.target.value as "all" | "true" | "false")}
                className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[color:var(--purple-dark)]"
              >
                <option value="all">All</option>
                <option value="false">Not Claimed</option>
                <option value="true">Claimed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mb-4 text-[color:var(--purple-dark)]">
          Showing <span className="font-bold">{filteredItems.length}</span> of <span className="font-bold">{items.length}</span> items
        </div>

        <div className="rounded-3xl bg-[color:var(--purple-light)] p-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-[color:var(--purple-dark)]">No items match your filters.</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setClaimedFilter("all");
                }}
                className="mt-4 text-[color:var(--purple-dark)] underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredItems.map((item) => (
                <div key={item.id} className="rounded-2xl bg-white p-5 shadow-sm border-l-4 border-[color:var(--purple-dark)]">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-32 flex-shrink-0 flex items-center justify-center">
                      <div className="bg-[color:var(--purple-light)] w-32 h-32 rounded-xl overflow-hidden relative">
                        <img 
                          src={item.image_url || '/images/default-item.jpg'} 
                          alt={item.item_name}
                          className="object-cover w-full h-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/images/default-item.jpg';
                          }}
                        />
                        {item.claimed && (
                          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                            <span className="text-white font-bold text-xs px-3 py-1 bg-green-600 rounded-full">
                              CLAIMED
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                        <h3 className="text-xl font-bold text-[color:var(--purple-dark)]">
                          {item.item_name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            item.status === 'Found' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {item.status}
                          </span>
                          {item.claimed && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                              Claimed
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-sm">
                        <div>
                          <span className="font-semibold text-[color:var(--purple-dark)]">Reporter: </span>
                          <span className="text-gray-700">{item.reporter_name}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-[color:var(--purple-dark)]">Location: </span>
                          <span className="text-gray-700">{item.location}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-[color:var(--purple-dark)]">Date: </span>
                          <span className="text-gray-700">
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold text-[color:var(--purple-dark)]">Email: </span>
                          <a href={`mailto:${item.email}`} className="text-blue-600 hover:underline">
                            {item.email}
                          </a>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <span className="font-semibold text-[color:var(--purple-dark)]">Description: </span>
                        <p className="text-gray-700 mt-1">{item.description}</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm mb-3">
                        {item.phone && (
                          <div>
                            <span className="font-semibold text-[color:var(--purple-dark)]">Phone: </span>
                            <a href={`tel:${item.phone}`} className="text-blue-600 hover:underline">
                              {item.phone}
                            </a>
                          </div>
                        )}
                        {item.telegram && (
                          <div>
                            <span className="font-semibold text-[color:var(--purple-dark)]">Telegram: </span>
                            <a 
                              href={`https://t.me/${item.telegram.replace('@', '')}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {item.telegram}
                            </a>
                          </div>
                        )}
                      </div>
                      
                      {currentUser === item.user_id && (
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-200">
                          <span className="text-sm font-semibold text-[color:var(--purple-dark)]">
                            Your Post
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => toggleClaimed(item.id, item.claimed)}
                              className={`px-4 py-2 rounded-lg text-xs font-medium ${
                                item.claimed 
                                  ? 'bg-gray-200 text-gray-700' 
                                  : 'bg-blue-500 text-white'
                              }`}
                            >
                              {item.claimed ? 'Mark Unclaimed' : 'Mark Claimed'}
                            </button>
                            <button
                              onClick={() => handleEdit(item.id)}
                              className="px-4 py-2 bg-[color:var(--purple-dark)] text-white rounded-lg text-xs font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, item.image_url)}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg text-xs font-medium"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}