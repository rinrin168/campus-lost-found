"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Basic email validation
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    // ✅ Step 1 only: save email then go to check-email page
    localStorage.setItem("resetEmail", email.trim());
    router.push("/check-email");
    setIsLoading(false);
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
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg, #ff7043, #e64a19)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 4px 12px rgba(255, 112, 67, 0.3)",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </svg>
          </div>

          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#4a3780", lineHeight: 1.3 }}>
            Forgot Password?
          </h1>

          <p style={{ marginTop: 8, fontSize: 14, color: "#666", fontWeight: 500 }}>
            Enter your email address and we'll send you a verification code
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#fff1f1",
              border: "1px solid #ffccc7",
              color: "#d32f2f",
              borderRadius: 12,
              padding: "12px 16px",
              marginBottom: 16,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={{ marginRight: 8 }}>❌</span>
            {error}
          </div>
        )}

        <form onSubmit={onSend}>
          <div style={{ marginTop: 8 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#555" }}>
              Email Address
            </label>

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 14,
                border: "1px solid #d1c9f0",
                outline: "none",
                fontSize: 15,
                transition: "border-color 0.2s, box-shadow 0.2s",
                boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#7c4dff")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#d1c9f0")}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: 24,
              width: "100%",
              padding: "14px 20px",
              borderRadius: 16,
              background: isLoading ? "#9a81d9" : "linear-gradient(135deg, #7c4dff, #5e35b1)",
              color: "white",
              border: "none",
              fontWeight: 700,
              fontSize: 16,
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(124, 77, 255, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Continuing...
              </>
            ) : (
              "Continue"
            )}
          </button>
        </form>

        <p style={{ marginTop: 28, fontSize: 14, textAlign: "center", color: "#666", borderTop: "1px solid #eee", paddingTop: 20 }}>
          <Link
            href="/login"
            style={{
              color: "#7c4dff",
              fontWeight: 600,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition: "opacity 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Back to Login
          </Link>
        </p>
      </div>
    </main>
  );
}
