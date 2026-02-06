"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const onSignup = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("pendingEmail", email);
    router.push("/verify-code");
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f8f6fd", padding: 24 }}>
      <form onSubmit={onSignup} style={{ width: 420, background: "white", borderRadius: 24, padding: 28, boxShadow: "0 10px 30px rgba(0,0,0,.08)" }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#4a3780", textAlign: "center" }}>
          Sign Up
        </h1>

        <div style={{ marginTop: 18 }}>
          <input placeholder="Full name" style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #cfc7e6", outline: "none" }} />
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
          <input placeholder="Password" type="password" style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #cfc7e6", outline: "none" }} />
        </div>

        <button
          type="submit"
          style={{ marginTop: 16, width: "100%", padding: 12, borderRadius: 12, background: "#4a3780", color: "white", border: "none", fontWeight: 700, cursor: "pointer" }}
        >
          Continue
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
