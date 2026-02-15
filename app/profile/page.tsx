// app/profile/page.tsx
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
  avatar_url: string;
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
    avatar_url: "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  // ✅ CORRECT AUTH CHECK
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setNotice("");

      // ✅ CORRECT: destructure { data, error }
      const { data: authData, error: authError } = await supabase.auth.getUser();

      // If no user or error → redirect to login
      if (authError || !authData?.user) {
        router.push("/login");
        return;
      }

      const user = authData.user;

      // Load profile from database
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("username,email,telegram,report_made,lost_or_found_item,avatar_url")
        .eq("id", user.id)
        .single();

      if (profileError) {
        setNotice("❌ Failed to load profile: " + profileError.message);
      } else if (profileData) {
        setFormData({
          username: profileData.username ?? "",
          email: profileData.email ?? user.email ?? "",
          telegram: profileData.telegram ?? "",
          reportMade: String(profileData.report_made ?? 0),
          lostOrFoundItem: String(profileData.lost_or_found_item ?? 0),
          avatar_url: profileData.avatar_url ?? "",
        });
        setAvatarPreview(profileData.avatar_url ? profileData.avatar_url : null);
      }

      setLoading(false);
    };

    loadProfile();
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setNotice("❌ Please upload an image (jpg, png, gif)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setNotice("❌ Image must be under 5MB");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setNotice("");
    
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData?.user) {
      router.push("/login");
      return;
    }

    const user = authData.user;
    let avatarUrl = formData.avatar_url;

    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, avatarFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        setNotice("❌ Upload failed: " + uploadError.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      avatarUrl = publicUrlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        username: formData.username,
        email: formData.email,
        telegram: formData.telegram,
        report_made: Number(formData.reportMade || 0),
        lost_or_found_item: Number(formData.lostOrFoundItem || 0),
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      setNotice("❌ Save failed: " + updateError.message);
      return;
    }

    setFormData(prev => ({ ...prev, avatar_url: avatarUrl }));
    setIsEditing(false);
    setNotice("✅ Profile saved!");
    setTimeout(() => setNotice(""), 3000);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="bg-purple-600 text-white w-10 h-10 rounded-lg flex items-center justify-center mr-2">CLF</div>
            <h1 className="text-xl font-bold text-gray-800">Campus Lost & Found</h1>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/landing" className="text-gray-700 hover:text-purple-600 font-medium">Home</Link>
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

      {/* Back link */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link href="/landing" className="flex items-center text-gray-600 hover:text-gray-800 mb-2">
          ← Back to Home
        </Link>
      </div>

      {/* Profile Card */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-700 p-6 text-white">
            <h1 className="text-2xl font-bold">Your Profile</h1>
            <p className="opacity-90 mt-1">Update your details and photo</p>
          </div>

          {/* Notice */}
          {notice && (
            <div className={`px-6 py-3 text-center ${
              notice.startsWith("✅") 
                ? "bg-green-50 text-green-700 border border-green-200" 
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {notice}
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Avatar Section */}
                <div className="lg:col-span-1 flex flex-col items-center">
                  <div className="relative mb-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : formData.avatar_url ? (
                        <img
                          src={formData.avatar_url}
                          alt="Current profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                          <span className="text-3xl">👤</span>
                        </div>
                      )}
                    </div>

                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 cursor-pointer shadow-md hover:bg-purple-700">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                      </label>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 text-center max-w-[180px]">
                    {isEditing ? "Click edit icon to change photo" : "Your profile picture"}
                  </p>
                </div>

                {/* Form Section */}
                <div className="lg:col-span-2 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Your display name"
                      />
                    ) : (
                      <div className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 font-medium">
                        {formData.username || "—"}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="your.email@example.com"
                      />
                    ) : (
                      <div className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 font-medium">
                        {formData.email || "—"}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Telegram</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="telegram"
                        value={formData.telegram}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="@username"
                      />
                    ) : (
                      <div className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 font-medium">
                        {formData.telegram || "—"}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Reports Made</label>
                      <div className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 font-medium text-center">
                        {formData.reportMade}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">My Lost or Found Items</label>
                      <div className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 font-medium text-center">
                        {formData.lostOrFoundItem}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-center">
                      {isEditing ? (
                        <button
                          onClick={handleSave}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                        >
                          Save Changes
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                        >
                          Edit Profile
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} Campus Lost & Found. All rights reserved.</p>
          </div>
        </div>
      </div>
    </main>
  );
}