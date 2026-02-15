// app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!email.trim() || !email.includes("@")) {
      setMessage("Please enter a valid email address");
      setLoading(false);
      return;
    }

    // Send OTP to email
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false, // Only send code if user exists
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      localStorage.setItem("resetEmail", email);
      router.push("/verify-code");
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      background: "#f8f6fd",
      padding: "20px"
    }}>
      <div style={{ 
        width: "100%", 
        maxWidth: "400px", 
        background: "white", 
        borderRadius: "16px", 
        padding: "32px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
      }}>
        <h1 style={{ textAlign: "center", fontSize: "24px", fontWeight: "700", color: "#4a3780" }}>
          Forgot Password?
        </h1>
        <p style={{ textAlign: "center", marginTop: "8px", color: "#666" }}>
          Enter your email to receive a verification code.
        </p>

        {message && (
          <div style={{
            background: message.toLowerCase().includes("successfully") ? "#f0fdf4" : "#fff1f1",
            border: message.toLowerCase().includes("successfully") ? "1px solid #bbf7d0" : "1px solid #ffccc7",
            color: message.toLowerCase().includes("successfully") ? "#166534" : "#d32f2f",
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "20px",
            fontSize: "14px"
          }}>
            {message.toLowerCase().includes("successfully") ? "✅" : "❌"} {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#555" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "1px solid #d1c9f0",
                borderRadius: "8px",
                fontSize: "16px",
                outline: "none"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: loading ? "#9a81d9" : "#7c4dff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Sending..." : "Send Verification Code"}
          </button>
        </form>

        <p style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#666" }}>
          <a href="/login" style={{ color: "#7c4dff", fontWeight: "600" }}>
            ← Back to Login
          </a>
        </p>
      </div>
    </div>
  );
}