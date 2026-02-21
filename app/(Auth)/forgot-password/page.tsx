"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    setLoading(false);

    if (resetError) {
      setError(resetError.message);
    } else {
      setMessage("Check your email for a password reset link!");
    }
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      background: "linear-gradient(to bottom right, #f8f6fd, #e9e1ff)",
      padding: "20px"
    }}>
      <div style={{ 
        width: "100%", 
        maxWidth: "400px", 
        background: "white", 
        borderRadius: "24px", 
        padding: "32px",
        boxShadow: "0 10px 40px rgba(124, 77, 255, 0.15)",
        border: "1px solid #eae6ff"
      }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ 
            width: "64px", 
            height: "64px", 
            borderRadius: "16px", 
            background: "linear-gradient(135deg, #7c4dff, #5e35b1)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            margin: "0 auto 16px", 
            boxShadow: "0 4px 12px rgba(124, 77, 255, 0.3)" 
          }}>
            <span style={{ fontSize: "28px", color: "white" }}>🔑</span>
          </div>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#4a3780" }}>
            Forgot Password?
          </h1>
          <p style={{ marginTop: "8px", color: "#666", fontSize: "14px" }}>
            Enter your email to receive a reset link
          </p>
        </div>

        {message && (
          <div style={{
            background: "#f0fdf4",
            border: "1px solid #86efac",
            color: "#166534",
            borderRadius: "12px",
            padding: "12px 16px",
            marginBottom: "16px",
            fontSize: "14px"
          }}>
            ✅ {message}
          </div>
        )}

        {error && (
          <div style={{
            background: "#fff1f1",
            border: "1px solid #ffccc7",
            color: "#d32f2f",
            borderRadius: "12px",
            padding: "12px 16px",
            marginBottom: "16px",
            fontSize: "14px"
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "500", color: "#555" }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="your.email@example.com"
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "1px solid #d1c9f0",
                borderRadius: "14px",
                fontSize: "15px",
                outline: "none",
                opacity: loading ? 0.6 : 1,
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px 20px",
              background: loading ? "#9a81d9" : "linear-gradient(135deg, #7c4dff, #5e35b1)",
              color: "white",
              border: "none",
              borderRadius: "16px",
              fontSize: "16px",
              fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 15px rgba(124, 77, 255, 0.4)",
              transition: "all 0.3s"
            }}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p style={{ 
          marginTop: "24px", 
          textAlign: "center", 
          fontSize: "14px", 
          color: "#666",
          borderTop: "1px solid #eee",
          paddingTop: "20px"
        }}>
          Remember your password?{" "}
          <Link href="/login" style={{ color: "#7c4dff", fontWeight: "700", textDecoration: "none" }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}