// app/reset-password/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const verified = localStorage.getItem("resetVerified");
    if (!verified) {
      router.push("/forgot-password");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      return;
    }

    setSuccess(true);
    localStorage.removeItem("resetVerified");
    localStorage.removeItem("resetEmail");

    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  if (success) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        background: "#f8f6fd"
      }}>
        <div style={{ textAlign: "center", padding: "32px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
          <h2>Password updated successfully!</h2>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

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
          Reset Password
        </h1>
        <p style={{ textAlign: "center", marginTop: "8px", color: "#666" }}>
          Enter a new password for your account.
        </p>

        {error && (
          <div style={{
            background: "#fff1f1",
            border: "1px solid #ffccc7",
            color: "#d32f2f",
            borderRadius: "8px",
            padding: "12px 16px",
            marginBottom: "20px",
            fontSize: "14px"
          }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#555" }}>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#555" }}>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: "#7c4dff",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}