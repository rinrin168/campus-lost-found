"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!fullName.trim()) {
      setError("Please enter your full name");
      setLoading(false);
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    // ✅ Sign up and store username in metadata (trigger will use it)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: fullName.toLowerCase().replace(/\s+/g, ""),
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);

    // If email confirmation is ON, user must confirm email first
    router.push("/login");
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f8f6fd", padding: 24 }}>
      <form
        onSubmit={onSignup}
        style={{
          width: 420,
          background: "white",
          borderRadius: 24,
          padding: 28,
          boxShadow: "0 10px 30px rgba(0,0,0,.08)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#4a3780", textAlign: "center" }}>Sign Up</h1>

        {error && (
          <div
            style={{
              marginTop: 14,
              background: "#fff1f1",
              border: "1px solid #ffccc7",
              color: "#d32f2f",
              borderRadius: 12,
              padding: "10px 12px",
              fontSize: 14,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginTop: 18 }}>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full name"
            style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #cfc7e6", outline: "none" }}
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #cfc7e6", outline: "none" }}
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password"
            style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #cfc7e6", outline: "none" }}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 16,
            width: "100%",
            padding: 12,
            borderRadius: 12,
            background: loading ? "#9a81d9" : "#4a3780",
            color: "white",
            border: "none",
            fontWeight: 700,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Creating..." : "Continue"}
        </button>

        <p style={{ marginTop: 16, fontSize: 13, textAlign: "center", color: "#555" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#4a3780", fontWeight: 700, textDecoration: "none" }}>
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}
