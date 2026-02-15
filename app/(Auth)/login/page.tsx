// app/login/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/landing");
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "linear-gradient(to bottom right, #f8f6fd, #e9e1ff)", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420, background: "white", borderRadius: 24, padding: 32, boxShadow: "0 10px 40px rgba(124, 77, 255, 0.15)", border: "1px solid #eae6ff" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg, #7c4dff, #5e35b1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 4px 12px rgba(124, 77, 255, 0.3)" }}>
            <span style={{ fontSize: 28 }}>🔍</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#4a3780" }}>Welcome Back!</h1>
          <p style={{ marginTop: 8, fontSize: 14, color: "#666" }}>Sign in to your Campus Lost & Found account</p>
        </div>

        {error && (
          <div style={{ background: "#fff1f1", border: "1px solid #ffccc7", color: "#d32f2f", borderRadius: 12, padding: "12px 16px", marginBottom: 16, fontSize: 14 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={onLogin}>
          <div style={{ marginTop: 8 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#555" }}>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: "1px solid #d1c9f0", outline: "none", fontSize: 15 }}
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#555" }}>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              type="password"
              style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: "1px solid #d1c9f0", outline: "none", fontSize: 15 }}
            />
          </div>

          {/* ✅ REMEMBER ME CHECKBOX + FORGOT PASSWORD */}
          <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                id="remember-me"
                style={{
                  width: "18px",
                  height: "18px",
                  marginRight: "8px",
                  accentColor: "#7c4dff",
                }}
              />
              <label htmlFor="remember-me" style={{ fontSize: 14, color: "#444" }}>
                Remember me
              </label>
            </div>
            <Link href="/forgot-password" style={{ color: "#7c4dff", textDecoration: "none", fontWeight: 600, fontSize: 14 }}>
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: 24,
              width: "100%",
              padding: "14px 20px",
              borderRadius: 16,
              background: loading ? "#9a81d9" : "linear-gradient(135deg, #7c4dff, #5e35b1)",
              color: "white",
              border: "none",
              fontWeight: 700,
              fontSize: 16,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 15px rgba(124, 77, 255, 0.4)",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ marginTop: 28, fontSize: 14, textAlign: "center", color: "#666", borderTop: "1px solid #eee", paddingTop: 20 }}>
          Don't have an account?{" "}
          <Link href="/signup" style={{ color: "#7c4dff", fontWeight: 700, textDecoration: "none" }}>
            Create Account
          </Link>
        </p>
      </div>
    </main>
  );
}