"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckEmailPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (!storedEmail) {
      router.push("/forgot-password");
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  const sendCode = async () => {
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/send-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json?.error ?? "Failed to send code");
        setIsLoading(false);
        return;
      }

      setSuccess(true);

      setTimeout(() => {
        router.push("/verify-code");
      }, 800);
    } catch {
      setError("Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "linear-gradient(to bottom right, #f8f6fd, #e9e1ff)",
        padding: 24,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "white",
          borderRadius: 24,
          padding: 32,
          boxShadow: "0 10px 40px rgba(124, 77, 255, 0.15)",
          border: "1px solid #eae6ff",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "linear-gradient(135deg, #29b6f6, #0288d1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 4px 12px rgba(41, 182, 246, 0.3)",
          }}
        >
          <span style={{ fontSize: 28, color: "white" }}>📧</span>
        </div>

        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#4a3780" }}>
          Check Email
        </h1>

        <p style={{ marginTop: 10, fontSize: 14, color: "#666" }}>
          We will send a 6-digit verification code to:
        </p>

        <p style={{ marginTop: 8, fontSize: 15, fontWeight: 800, color: "#7c4dff" }}>
          {email}
        </p>

        {error && (
          <div
            style={{
              marginTop: 14,
              background: "#fff1f1",
              border: "1px solid #ffccc7",
              color: "#d32f2f",
              borderRadius: 12,
              padding: "12px 16px",
              fontSize: 14,
              textAlign: "left",
            }}
          >
            ❌ {error}
          </div>
        )}

        {success && (
          <div
            style={{
              marginTop: 14,
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#166534",
              borderRadius: 12,
              padding: "12px 16px",
              fontSize: 14,
              textAlign: "left",
            }}
          >
            ✅ Code sent! Redirecting…
          </div>
        )}

        <button
          onClick={sendCode}
          disabled={isLoading || success}
          style={{
            marginTop: 22,
            width: "100%",
            padding: "14px 20px",
            borderRadius: 16,
            background: isLoading || success ? "#9a81d9" : "linear-gradient(135deg, #7c4dff, #5e35b1)",
            color: "white",
            border: "none",
            fontWeight: 700,
            fontSize: 16,
            cursor: isLoading || success ? "not-allowed" : "pointer",
            boxShadow: "0 4px 15px rgba(124, 77, 255, 0.4)",
          }}
        >
          {isLoading ? "Sending..." : success ? "Sent" : "Send Verification Code"}
        </button>

        <p style={{ marginTop: 22, fontSize: 14, color: "#666", borderTop: "1px solid #eee", paddingTop: 18 }}>
          <Link href="/forgot-password" style={{ color: "#7c4dff", fontWeight: 700, textDecoration: "none" }}>
            Change Email
          </Link>
        </p>
      </div>
    </main>
  );
}
