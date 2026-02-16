"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditItemPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<'Lost' | 'Found'>('Found');
  
  const [reporterName, setReporterName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [telegram, setTelegram] = useState('');
  const [itemName, setItemName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const loadItem = async () => {
      try {
        // Check authentication
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        
        if (authError || !session) {
          router.replace("/login");
          return;
        }

        // Load item data
        const { data: item, error: itemError } = await supabase
          .from("items")
          .select("*")
          .eq("id", itemId)
          .single();

        if (itemError) {
          console.error("Error loading item:", itemError);
          alert("❌ Failed to load item");
          router.push("/items");
          return;
        }

        // Check if user owns this item
        if (item.user_id !== session.user.id) {
          alert("❌ You don't have permission to edit this item");
          router.push("/items");
          return;
        }

        // Populate form with existing data
        setReporterName(item.reporter_name);
        setEmail(item.email);
        setPhone(item.phone || '');
        setTelegram(item.telegram || '');
        setItemName(item.item_name);
        setLocation(item.location);
        setDate(new Date(item.date).toISOString().split('T')[0]);
        setDescription(item.description);
        setStatus(item.status);
        setExistingImageUrl(item.image_url);
        setPhotoPreview(item.image_url);
        
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        alert("❌ An error occurred");
        router.push("/items");
      }
    };

    if (itemId) {
      loadItem();
    }
  }, [itemId, router]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("❌ Please upload an image file (jpg, png, gif, webp)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("❌ Image must be under 5MB");
      return;
    }

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const uploadNewImage = async (userId: string): Promise<string | null> => {
    if (!photo) return existingImageUrl;

    try {
      // Delete old image if exists and it's not the default
      if (existingImageUrl && !existingImageUrl.includes('default-item.jpg')) {
        const oldFileName = existingImageUrl.split('/').slice(-2).join('/');
        await supabase.storage
          .from("item-images")
          .remove([oldFileName]);
      }

      // Upload new image
      const fileExt = photo.name.split(".").pop()?.toLowerCase();
      const fileName = `${userId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("item-images")
        .upload(fileName, photo, { 
          cacheControl: '3600',
          upsert: false 
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from("item-images")
        .getPublicUrl(fileName);
      
      return publicUrlData.publicUrl;
    } catch (error) {
      console.error("Image upload error:", error);
      return existingImageUrl;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Check authentication
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError || !session) {
        alert("❌ Please log in to update this item");
        router.push("/login");
        return;
      }
      const userId = session.user.id;

      // Upload new image if changed
      const imageUrl = await uploadNewImage(userId);
      if (!imageUrl) {
        alert("❌ Failed to process image. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Update item in database
      const { error: updateError } = await supabase
        .from("items")
        .update({
          reporter_name: reporterName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim() || null,
          telegram: telegram.trim() || null,
          item_name: itemName.trim(),
          location: location.trim(),
          date: new Date(date).toISOString(),
          description: description.trim(),
          status: status,
          image_url: imageUrl,
        })
        .eq("id", itemId)
        .eq("user_id", userId);

      if (updateError) {
        console.error("Update error:", updateError);
        throw new Error(`Update failed: ${updateError.message}`);
      }

      alert("✅ Item updated successfully!");
      router.push("/items");
    } catch (error) {
      console.error("Update error:", error);
      alert(error instanceof Error ? error.message : "❌ An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--purple-lighter)]">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⏳</div>
          <p className="text-[color:var(--purple-dark)] font-medium">Loading item...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10 bg-[color:var(--purple-lighter)]">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <Link href="/items" className="font-semibold text-[color:var(--purple-dark)] flex items-center hover:underline">
            ← Back to Items
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-[color:var(--purple-dark)]">
            Edit Your Item
          </h1>
          <p className="text-[color:var(--purple-dark)] mt-2">
            Update the information about your lost or found item
          </p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-3xl bg-[color:var(--purple-light)] p-8 space-y-6">
          {/* Reporter Name */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
              Reporter Name <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              value={reporterName}
              onChange={(e) => setReporterName(e.target.value)}
              placeholder="Your full name" 
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[color:var(--purple-dark)]"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com" 
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[color:var(--purple-dark)]"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Contact Info */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-[color:var(--purple-dark)] mb-4">
              Contact Information (Optional)
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
                  Phone Number
                </label>
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g., +1 555-123-4567" 
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[color:var(--purple-dark)]"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
                  Telegram Handle
                </label>
                <input 
                  type="text" 
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder="e.g., @username" 
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[color:var(--purple-dark)]"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Ex. Water Bottle, Laptop, Keys" 
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[color:var(--purple-dark)]"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
              Item Photo
            </label>
            <div className="border-2 border-dashed border-[color:var(--purple-dark)] rounded-xl p-6 text-center cursor-pointer hover:border-purple-700 transition-colors">
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                id="photo-upload"
                onChange={handlePhotoChange}
                disabled={isSubmitting}
              />
              <label 
                htmlFor="photo-upload"
                className="text-[color:var(--purple-dark)] font-medium hover:underline cursor-pointer"
              >
                {photo ? '✓ New Photo Selected' : '📷 Change Photo (Optional)'}
              </label>
              <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF, WEBP up to 5MB</p>
              
              {photoPreview && (
                <div className="mt-4">
                  <div className="relative inline-block">
                    <img 
                      src={photoPreview} 
                      alt="Preview" 
                      className="w-40 h-40 object-cover rounded-lg mx-auto border-2 border-gray-300"
                    />
                    {photo && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setPhoto(null);
                          setPhotoPreview(existingImageUrl);
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold hover:bg-red-600"
                        disabled={isSubmitting}
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-2 font-medium">
                    {photo ? 'New photo preview' : 'Current photo'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
              Location <span className="text-red-500">*</span>
            </label>
            <input 
              type="text" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where the item was last seen or found" 
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[color:var(--purple-dark)]"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[color:var(--purple-dark)]"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the item in detail (color, brand, distinctive features, etc.)" 
              rows={4}
              maxLength={500}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[color:var(--purple-dark)] resize-none"
              required
              disabled={isSubmitting}
            />
            <p className="text-xs text-gray-500 mt-1">{description.length}/500 characters</p>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-[color:var(--purple-dark)] mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value as 'Lost' | 'Found')}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[color:var(--purple-dark)]"
              required
              disabled={isSubmitting}
            >
              <option value="Lost">Lost - I lost this item</option>
              <option value="Found">Found - I found this item</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Select whether you lost or found this item</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push("/items")}
              className="px-8 py-3 rounded-full font-semibold text-[color:var(--purple-dark)] border-2 border-[color:var(--purple-dark)] hover:bg-[color:var(--purple-light)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 rounded-full font-semibold text-white bg-[color:var(--purple-dark)] hover:bg-[color:var(--purple-darker)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Updating...
                </>
              ) : (
                'Update Item'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}