// app/report/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ReportPage() {
  const router = useRouter();
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<'lost' | 'found'>('found');
  
  const [reporterName, setReporterName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [itemName, setItemName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  // ✅ CORRECT AUTH CHECK
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        router.replace("/login");
        return;
      }
    };

    checkAuth();
  }, [router]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("❌ Please upload an image (jpg, png, gif)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("❌ Image must be under 5MB");
      return;
    }

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { data: { session }, error: authError } = await supabase.auth.getSession();
    if (authError || !session) {
      router.push("/login");
      return;
    }
    const userId = session.user.id;

    let imageUrl = "/images/default-item.jpg";
    if (photo) {
      const fileExt = photo.name.split(".").pop();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("item-images")
        .upload(fileName, photo, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        alert("❌ Image upload failed: " + uploadError.message);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("item-images")
        .getPublicUrl(fileName);
      imageUrl = publicUrlData.publicUrl;
    }

    const { error } = await supabase
      .from("items")
      .insert({
        reporter_name: reporterName,
        email: email,
        phone: phone,
        telegram: telegram,
        item_name: itemName,
        location: location,
        date: new Date(date),
        description: description,
        status: status.charAt(0).toUpperCase() + status.slice(1),
        claimed: false,
        image_url: imageUrl,
        user_id: userId,
      });

    if (error) {
      alert("❌ Submission failed: " + error.message);
      return;
    }

    alert("✅ Report submitted successfully!");
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
          <h1 className="text-2xl font-extrabold text-[color:var(--purple-dark)]">
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
          {/* Reporter Information */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
              Reporter Name *
            </label>
            <input 
              type="text" 
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              placeholder="Your full name" 
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[color:var(--purple-dark)]"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
              Email *
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com" 
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[color:var(--purple-dark)]"
              required
            />
          </div>

          {/* Contact Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-[color:var(--purple-dark)] mb-4">Contact Information</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
                Phone Number (Optional)
              </label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g., +1 555-123-4567" 
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[color:var(--purple-dark)]"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
                Telegram Handle (Optional)
              </label>
              <input 
                type="text" 
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="e.g., @username" 
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[color:var(--purple-dark)]"
              />
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
              Item Name *
            </label>
            <input 
              type="text" 
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Ex. Water Bottle" 
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[color:var(--purple-dark)]"
              required
            />
          </div>

          {/* Upload Photo - With Preview */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
              Upload a Photo *
            </label>
            <div className="border-2 border-dashed border-[color:var(--purple-dark)] rounded-xl p-6 text-center cursor-pointer hover:border-purple-700 transition-colors">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                id="photo-upload"
                onChange={handlePhotoChange}
              />
              <label 
                htmlFor="photo-upload"
                className="text-[color:var(--purple-dark)] font-medium hover:underline cursor-pointer"
              >
                {photo ? 'Change Photo' : 'Upload Photo'}
              </label>
              <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
              
              {/* Preview */}
              {photoPreview && (
                <div className="mt-4">
                  <div className="relative inline-block">
                    <img 
                      src={photoPreview} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded-lg mx-auto border-2 border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPhoto(null);
                        setPhotoPreview(null);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Click to change</p>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
              Location *
            </label>
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where the item was last seen or found" 
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[color:var(--purple-dark)]"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
              Date *
            </label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[color:var(--purple-dark)]"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
              Description *
            </label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description of the item (less than 100 words)" 
              rows={3}
              maxLength={100}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[color:var(--purple-dark)]"
              required
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">{description.length}/100 characters</p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
              Status *
            </label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value as 'lost' | 'found')}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[color:var(--purple-dark)]"
              required
            >
              <option value="lost">Lost</option>
              <option value="found">Found</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">(The item is a Lost or Found Item)</p>
          </div>

          <div className="flex justify-end space-x-4 mt-8">
            <button
              type="button"
              onClick={() => router.push("/items")}
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