"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const ok = localStorage.getItem("isLoggedIn") === "true";
    if (!ok) router.replace("/login");
  }, [router]);

  function logout() {
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  }

  // Sample items data
  const items = [
    {
      id: 1,
      name: "Water Bottle",
      location: "Found on floor in Room 101",
      date: "27/03/2023",
      image: "/images/water-bottle.jpg"
    },
    {
      id: 2,
      name: "Laptop",
      location: "Found in Library",
      date: "28/03/2023",
      image: "/images/laptop.jpg"
    },
    {
      id: 3,
      name: "Backpack",
      location: "Found in Cafeteria",
      date: "29/03/2023",
      image: "/images/back-pack.jpg"
    },
    {
      id: 4,
      name: "Keys",
      location: "Found in Hallway",
      date: "30/03/2023",
      image: "/images/key.jpg"
    },
    {
      id: 5,
      name: "Phone",
      location: "Found in Classroom",
      date: "31/03/2023",
      image: "/images/phone.jpg"
    }
  ];

  return (
    <main className="min-h-screen bg-purple-50 overflow-y-auto">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="bg-purple-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold mr-2">
              CLF
            </div>
            <h1 className="text-xl font-bold text-gray-800">Campus Lost & Found</h1>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-gray-700 hover:text-purple-600 font-medium">Home</Link>
            <Link href="/report" className="text-gray-700 hover:text-purple-600 font-medium">Report</Link>
            <Link href="/items" className="text-gray-700 hover:text-purple-600 font-medium">Items</Link>
            {/* "Profile" */}
            <Link href="/profile" className="text-gray-700 hover:text-purple-600 font-medium">Profile</Link>
            <button 
              onClick={logout} 
              className="bg-purple-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center">
          {/* Picture on Left */}
          <div className="md:w-1/2 flex justify-center mb-8 md:mb-0">
            <div className="bg-purple-100 p-4 rounded-2xl w-full max-w-md">
              <div className="bg-white rounded-xl p-4 shadow-md">
                <div className="flex justify-center mb-4">
                  <div className="w-48 h-48 rounded-lg overflow-hidden">
                    <img src="/images/photo5.jpg"/>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="bg-gray-200 rounded h-12"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Text on Right */}
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              "Lost it? Don't worry— For we are the campus detectives"
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              From water bottles to laptops, our platform makes finding lost items way less stressful and a lot more fun. 
              Post it, search it, and let the magic of campus kindness do the rest.
            </p>
            <Link 
              href="/explore" 
              className="bg-purple-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-purple-700 transition-colors inline-flex items-center"
            >
              Explore More →
            </Link>
          </div>
        </div>
      </section>

      {/* Lost & Found Items List */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Lost & Found Items List</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="h-40 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23e0e0e0" width="400" height="300"/%3E%3Ctext fill="%23999" font-size="24" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{item.location}</p>
                <p className="text-gray-500 text-xs">{item.date}</p>
                <Link 
                  href={`/item/${item.id}`} 
                  className="mt-3 inline-block text-purple-600 font-medium hover:underline"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Review From Our User</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow-md">
              <div className="flex items-start mb-4">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-bold">U</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">User {i + 1}</h3>
                  <p className="text-gray-500 text-sm">Student</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "I honestly didn't expect to get my item back so fast! The website is so easy to use, 
                and I got my lost item back in a 'wow, this actually works!' experience."
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-purple-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Campus Lost & Found</h3>
            <p className="text-gray-600 mb-4">Helping campus belongings find their way back!</p>
            <div className="flex justify-center gap-4 mb-4">
              <Link href="#" className="text-gray-600 hover:text-purple-600">Facebook</Link>
              <Link href="#" className="text-gray-600 hover:text-purple-600">Twitter</Link>
              <Link href="#" className="text-gray-600 hover:text-purple-600">Instagram</Link>
              <Link href="#" className="text-gray-600 hover:text-purple-600">LinkedIn</Link>
            </div>
            <p className="text-gray-500 text-sm">© 2023 Campus Lost & Found. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}