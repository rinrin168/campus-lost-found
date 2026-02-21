"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function UpdatePassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validSession, setValidSession] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setValidSession(true);
      } else {
        router.push("/login");
      }
    });
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

    setLoading(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password: password
    });

    setLoading(false);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  if (!validSession) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        background: "linear-gradient(to bottom right, #f8f6fd, #e9e1ff)"
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#666" }}>Loading...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        background: "linear-gradient(to bottom right, #f8f6fd, #e9e1ff)"
      }}>
        <div style={{ 
          textAlign: "center", 
          padding: "32px", 
          background: "white", 
          borderRadius: "24px", 
          boxShadow: "0 10px 40px rgba(124, 77, 255, 0.15)",
          border: "1px solid #eae6ff"
        }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
          <h2 style={{ color: "#4a3780", marginBottom: "8px", fontSize: "24px", fontWeight: "700" }}>
            Password Updated!
          </h2>
          <p style={{ color: "#666", fontSize: "14px" }}>Redirecting to login...</p>
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
            background: "linear-gradient(135deg, #66bb6a, #2e7d32)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center", 
            margin: "0 auto 16px", 
            boxShadow: "0 4px 12px rgba(102, 187, 106, 0.3)" 
          }}>
            <span style={{ fontSize: "26px", color: "white" }}>🔒</span>
          </div>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "700", color: "#4a3780" }}>
            Reset Password
          </h1>
          <p style={{ marginTop: "8px", color: "#666", fontSize: "14px" }}>
            Create a new secure password
          </p>
        </div>

        {error && (
          <div style={{
            marginBottom: "16px",
            background: "#fff1f1",
            border: "1px solid #ffccc7",
            color: "#d32f2f",
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "14px"
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "500", color: "#555" }}>
              New Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              disabled={loading}
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

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: "500", color: "#555" }}>
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              disabled={loading}
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
            {loading ? "Updating..." : "Update Password"}
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
          <Link href="/login" style={{ color: "#7c4dff", fontWeight: "700", textDecoration: "none" }}>
            ← Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}