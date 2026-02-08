"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("isLoggedIn", "true");
    router.push("/landing");
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f8f6fd", padding: 24 }}>
      <form
        onSubmit={onLogin}
        style={{
          width: 420,
          background: "white",
          borderRadius: 24,
          padding: 28,
          boxShadow: "0 10px 30px rgba(0,0,0,.08)",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#4a3780", textAlign: "center" }}>
          Welcome to Campus Lost & Found!
        </h1>

        <div style={{ marginTop: 18 }}>
          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Username / Email"
            style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #cfc7e6", outline: "none" }}
          />
        </div>

        <div style={{ marginTop: 12 }}>
          <input
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Password"
            type="password"
            style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #cfc7e6", outline: "none" }}
          />
        </div>

        <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input type="checkbox" /> Remember me
          </label>

          <Link href="/forgot-password" style={{ color: "#4a3780", textDecoration: "none", fontWeight: 600 }}>
            Forgot?
          </Link>
        </div>

        <button
          type="submit"
          style={{
            marginTop: 16,
            width: "100%",
            padding: 12,
            borderRadius: 12,
            background: "#4a3780",
            color: "white",
            border: "none",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Login
        </button>

        <p style={{ marginTop: 16, fontSize: 13, textAlign: "center", color: "#555" }}>
          Don’t have an account?{" "}
          <Link href="/signup" style={{ color: "#4a3780", fontWeight: 700, textDecoration: "none" }}>
            Sign Up
          </Link>
        </p>
      </form>
    </main>
  );
}

