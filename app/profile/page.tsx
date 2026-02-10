"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type FormData = {
  username: string;
  email: string;
  telegram: string;
  reportMade: string;
  lostOrFoundItem: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState<string>("");

  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    telegram: "",
    reportMade: "0",
    lostOrFoundItem: "0",
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      setNotice("");

      const { data: userRes } = await supabase.auth.getUser();
      const user = userRes?.user;

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("username,email,telegram,report_made,lost_or_found_item")
        .eq("id", user.id)
        .single();

      if (error) {
        setNotice("❌ Failed to load profile: " + error.message);
      } else if (data) {
        setFormData({
          username: data.username ?? "",
          email: data.email ?? user.email ?? "",
          telegram: data.telegram ?? "",
          reportMade: String(data.report_made ?? 0),
          lostOrFoundItem: String(data.lost_or_found_item ?? 0),
        });
      }

      setLoading(false);
    }

    load();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setNotice("");

    const { data: userRes } = await supabase.auth.getUser();
    const user = userRes?.user;

    if (!user) {
      router.push("/login");
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        username: formData.username,
        email: formData.email,
        telegram: formData.telegram,
        report_made: Number(formData.reportMade || 0),
        lost_or_found_item: Number(formData.lostOrFoundItem || 0),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      setNotice("❌ Save failed: " + error.message);
      return;
    }

    setIsEditing(false);
    setNotice("✅ Saved!");
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userData");
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-purple-50">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="bg-purple-600 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-2">CLF</div>
            <h1 className="text-xl font-bold text-gray-800">Campus Lost & Found</h1>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-purple-600 font-medium">Home</Link>
            <Link href="/report" className="text-gray-700 hover:text-purple-600 font-medium">Report</Link>
            <Link href="/items" className="text-gray-700 hover:text-purple-600 font-medium">Items</Link>
            <Link href="/profile" className="text-purple-600 font-medium">Profile</Link>
            <button
              onClick={logout}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/landing" className="flex items-center text-gray-600 hover:text-gray-800 mb-6">
          ← Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-md p-6">
          {loading ? (
            <p className="text-gray-600">Loading profile...</p>
          ) : (
            <>
              {notice && <p className="mb-4 text-sm">{notice}</p>}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    ) : (
                      <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">{formData.username}</div>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    ) : (
                      <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">{formData.email}</div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telegram</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="telegram"
                        value={formData.telegram}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    ) : (
                      <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">{formData.telegram}</div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Report Made</label>
                    <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">{formData.reportMade}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">My Lost Or Found Item</label>
                    <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">{formData.lostOrFoundItem}</div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                {isEditing ? (
                  <button
                    onClick={handleSave}
                    className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    Save Changes
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-purple-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
