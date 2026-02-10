"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!user.trim() || !pass.trim()) {
      setError("Please enter both username/email and password");
      setIsLoading(false);
      return;
    }

    // Supabase requires email sign-in (Email Auth).
    // If user typed a username, this converts it to username@example.com (for your old UI behavior).
    const email = user.includes("@") ? user : `${user}@example.com`;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) {
      setError(error.message);
      setIsLoading(false);
      return;
    }

    // Keep your existing app routing logic working:
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: data.user?.id, // ✅ Supabase UUID
        username: user.includes("@") ? email.split("@")[0] : user,
        email: data.user?.email ?? email,
        telegram: "",
        reportMade: "0",
        lostOrFoundItem: "0",
      })
    );

    setIsLoading(false);
    router.push("/landing");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(to bottom right, #f8f6fd, #e9e1ff)",
        padding: 24,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "white",
          borderRadius: 24,
          padding: 32,
          boxShadow: "0 10px 40px rgba(124, 77, 255, 0.15)",
          border: "1px solid #eae6ff",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg, #7c4dff, #5e35b1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 4px 12px rgba(124, 77, 255, 0.3)",
            }}
          >
            <span style={{ fontSize: 28 }}>🔍</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#4a3780", lineHeight: 1.3 }}>
            Welcome Back!
          </h1>
          <p style={{ marginTop: 8, fontSize: 14, color: "#666", fontWeight: 500 }}>
            Sign in to your Campus Lost & Found account
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#fff1f1",
              border: "1px solid #ffccc7",
              color: "#d32f2f",
              borderRadius: 12,
              padding: "12px 16px",
              marginBottom: 16,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={{ marginRight: 8 }}>⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={onLogin}>
          <div style={{ marginTop: 8 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#555" }}>
              Username or Email
            </label>
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="Enter your username or email"
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 14,
                border: "1px solid #d1c9f0",
                outline: "none",
                fontSize: 15,
                boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
              }}
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#555" }}>
              Password
            </label>
            <input
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Enter your password"
              type="password"
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 14,
                border: "1px solid #d1c9f0",
                outline: "none",
                fontSize: 15,
                boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
              }}
            />
          </div>

          <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14 }}>
              <input type="checkbox" style={{ width: 18, height: 18, accentColor: "#7c4dff" }} />
              <span style={{ color: "#444", fontWeight: 500 }}>Remember me</span>
            </label>

            <Link href="/forgot-password" style={{ color: "#7c4dff", textDecoration: "none", fontWeight: 600, fontSize: 14 }}>
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: 24,
              width: "100%",
              padding: "14px 20px",
              borderRadius: 16,
              background: isLoading ? "#9a81d9" : "linear-gradient(135deg, #7c4dff, #5e35b1)",
              color: "white",
              border: "none",
              fontWeight: 700,
              fontSize: 16,
              cursor: isLoading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 15px rgba(124, 77, 255, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p
          style={{
            marginTop: 28,
            fontSize: 14,
            textAlign: "center",
            color: "#666",
            borderTop: "1px solid #eee",
            paddingTop: 20,
          }}
        >
          Don't have an account?{" "}
          <Link href="/signup" style={{ color: "#7c4dff", fontWeight: 700, textDecoration: "none" }}>
            Create Account
          </Link>
        </p>
      </div>
    </main>
  );
}
