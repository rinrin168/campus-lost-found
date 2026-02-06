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

  return (
    <main style={{ minHeight: "100vh", padding: 24 }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <b>Campus Lost & Found</b>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/report">Report</Link>
          <Link href="/items">Items</Link>
          <button onClick={logout} style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #ddd", background: "white" }}>
            Logout
          </button>
        </div>
      </nav>

      <h1>Landing Page</h1>
      <p>After login you land here </p>
    </main>
  );
}
