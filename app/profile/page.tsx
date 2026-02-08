"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "user123",
    email: "user123@example.com",
    telegram: "@user123",
    reportMade: "3",
    lostOrFoundItem: "2"
  });

  useEffect(() => {
    const userData = localStorage.getItem("userData");
    if (userData) {
      setFormData(JSON.parse(userData));
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("userData", JSON.stringify(formData));
    setIsEditing(false);
  };

  return (
    <main className="min-h-screen bg-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <div className="bg-purple-600 text-white w-8 h-8 rounded-lg flex items-center justify-center mr-2">
              CLF
            </div>
            <h1 className="text-xl font-bold text-gray-800">Campus Lost & Found</h1>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-purple-600 font-medium">Home</Link>
            <Link href="/report" className="text-gray-700 hover:text-purple-600 font-medium">Report</Link>
            <Link href="/items" className="text-gray-700 hover:text-purple-600 font-medium">Items</Link>
            <Link href="/profile" className="text-purple-600 font-medium">Profile</Link>
            <button 
              onClick={() => router.push("/login")} 
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      {/* Profile Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back button - Redirects to landing page */}
        <Link 
          href="/landing" 
          className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Home
        </Link>

        {/* Profile Header */}
        <div className="bg-purple-100 rounded-2xl p8 mb-8">
          <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-purple-200 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.935 13.935 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">My Profile</h1>
            <p className="text-gray-500 text-sm">Last Online 3 hours ago</p>
          </div>
        </div>

        {/* Profile Form */}
        <div className="bg-white rounded-2xl shadow-md p-6">
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
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    {formData.username}
                  </div>
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
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    {formData.email}
                  </div>
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
                  <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                    {formData.telegram}
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Report Made</label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-50">
                  {formData.reportMade}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">My Lost Or Found Item</label>
                <div className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50">
                  {formData.lostOrFoundItem}
                </div>
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
        </div>
      </div>
    </main>
  );
}