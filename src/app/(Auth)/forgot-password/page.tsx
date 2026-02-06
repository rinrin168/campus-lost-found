"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const onSend = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("pendingEmail", email);
    router.push("/verify-code");
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f8f6fd", padding: 24 }}>
      <form onSubmit={onSend} style={{ width: 420, background: "white", borderRadius: 24, padding: 28, boxShadow: "0 10px 30px rgba(0,0,0,.08)" }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#4a3780", textAlign: "center" }}>
          Forgot Password
        </h1>

        <p style={{ marginTop: 10, fontSize: 13, color: "#555", textAlign: "center" }}>
          Enter your email and we’ll send a verification code.
        </p>

        <div style={{ marginTop: 14 }}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #cfc7e6", outline: "none" }}
          />
        </div>

        <button
          type="submit"
          style={{ marginTop: 16, width: "100%", padding: 12, borderRadius: 12, background: "#4a3780", color: "white", border: "none", fontWeight: 700, cursor: "pointer" }}
        >
          Send
        </button>
      </form>
    </main>
  );
}
