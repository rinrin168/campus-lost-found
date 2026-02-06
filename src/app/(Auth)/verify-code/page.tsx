"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function VerifyCodePage() {
  const router = useRouter();
  const [code, setCode] = useState("");

  const onVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // demo verify success
    localStorage.setItem("isLoggedIn", "true");
    router.push("/landing");
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f8f6fd", padding: 24 }}>
      <form onSubmit={onVerify} style={{ width: 420, background: "white", borderRadius: 24, padding: 28, boxShadow: "0 10px 30px rgba(0,0,0,.08)" }}>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#4a3780", textAlign: "center" }}>
          Verify Code
        </h1>

        <p style={{ marginTop: 10, fontSize: 13, color: "#555", textAlign: "center" }}>
          Enter the 6-digit code sent to your email.
        </p>

        <div style={{ marginTop: 14 }}>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            style={{ width: "100%", padding: 12, borderRadius: 10, border: "1px solid #cfc7e6", outline: "none", letterSpacing: 3, textAlign: "center" }}
          />
        </div>

        <button
          type="submit"
          style={{ marginTop: 16, width: "100%", padding: 12, borderRadius: 12, background: "#4a3780", color: "white", border: "none", fontWeight: 700, cursor: "pointer" }}
        >
          Verify
        </button>
      </form>
    </main>
  );
}
