// app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const cleanUser = username.toLowerCase().replace(/\s+/g, "");
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username: cleanUser },  // ✅ SAFE: inside JS, not JSX
      },
    });

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/login");
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
          Sign Up
        </h1>

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
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#555" }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: "100%", padding: "12px", border: "1px solid #d1c9f0", borderRadius: "8px", outline: "none" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#555" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: "12px", border: "1px solid #d1c9f0", borderRadius: "8px", outline: "none" }}
            />
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#555" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "12px", border: "1px solid #d1c9f0", borderRadius: "8px", outline: "none" }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", color: "#555" }}>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "12px", border: "1px solid #d1c9f0", borderRadius: "8px", outline: "none" }}
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
            Sign Up
          </button>
        </form>

        <p style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#666" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#7c4dff", fontWeight: "600" }}>
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}