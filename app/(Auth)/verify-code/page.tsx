// app/verify-code/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function VerifyCode() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (!storedEmail) {
      router.push("/forgot-password");
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(0, 1);
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      setError("Please enter a 6-digit code");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: fullCode,
      type: "email",
    });

    if (error) {
      setError("Invalid or expired code. Please try again.");
      setLoading(false);
      return;
    }

    localStorage.setItem("resetVerified", "true");
    router.push("/reset-password");
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
          Verify Code
        </h1>
        <p style={{ textAlign: "center", marginTop: "8px", color: "#666" }}>
          We sent a 6-digit code to:
        </p>
        <p style={{ textAlign: "center", fontWeight: "600", color: "#7c4dff", marginBottom: "24px" }}>
          {email}
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
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "24px" }}>
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                maxLength={1}
                style={{
                  width: "50px",
                  height: "50px",
                  textAlign: "center",
                  fontSize: "20px",
                  border: "1px solid #d1c9f0",
                  borderRadius: "8px",
                  outline: "none"
                }}
              />
            ))}
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
            {loading ? "Verifying..." : "Verify Code"}
          </button>
        </form>

        <p style={{ marginTop: "16px", textAlign: "center", fontSize: "14px", color: "#666" }}>
          Didn't receive the code?{" "}
          <a href="/forgot-password" style={{ color: "#7c4dff", fontWeight: "600" }}>
            Resend
          </a>
        </p>
      </div>
    </div>
  );
}