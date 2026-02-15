// app/update-password/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function UpdatePassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // 👈 Critical
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const type = searchParams.get("type");
    if (type !== "recovery") {
      router.push("/login");
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    }

    setLoading(false);
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "linear-gradient(to bottom right, #f8f6fd, #e9e1ff)", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 420, background: "white", borderRadius: 24, padding: 32, boxShadow: "0 10px 40px rgba(124, 77, 255, 0.15)", border: "1px solid #eae6ff", textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: "linear-gradient(135deg, #66bb6a, #2e7d32)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 4px 12px rgba(102, 187, 106, 0.3)" }}>
          <span style={{ fontSize: 26, color: "white" }}>✅</span>
        </div>

        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#4a3780" }}>Reset Password</h1>
        <p style={{ marginTop: 8, fontSize: 14, color: "#666" }}>Create a new secure password</p>

        {error && (
          <div style={{ marginTop: 14, background: "#fff1f1", border: "1px solid #ffccc7", color: "#d32f2f", borderRadius: 12, padding: "12px 16px", fontSize: 14, textAlign: "left" }}>
            ❌ {error}
          </div>
        )}

        {success && (
          <div style={{ marginTop: 14, background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#166534", borderRadius: 12, padding: "12px 16px", fontSize: 14, textAlign: "left" }}>
            ✅ Password updated! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password (min 8 chars)"
              disabled={loading || success}
              style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: "1px solid #d1c9f0", outline: "none", fontSize: 15 }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              disabled={loading || success}
              style={{ width: "100%", padding: "14px 16px", borderRadius: 14, border: "1px solid #d1c9f0", outline: "none", fontSize: 15 }}
            />
          </div>
          <button
            type="submit"
            disabled={loading || success}
            style={{ width: "100%", padding: "14px 20px", borderRadius: 16, background: loading || success ? "#9a81d9" : "linear-gradient(135deg, #7c4dff, #5e35b1)", color: "white", border: "none", fontWeight: 700, fontSize: 16, cursor: "not-allowed", boxShadow: "0 4px 15px rgba(124, 77, 255, 0.4)" }}
          >
            {loading ? "Updating..." : success ? "Updated!" : "Update Password"}
          </button>
        </form>

        <p style={{ marginTop: 24, fontSize: 14, color: "#666", borderTop: "1px solid #eee", paddingTop: 20 }}>
          <Link href="/login" style={{ color: "#7c4dff", fontWeight: 700, textDecoration: "none" }}>Back to Login</Link>
        </p>
      </div>
    </main>
  );
}