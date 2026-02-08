"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function VerifyCodePage() {
  const router = useRouter();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(30);

  // Get email from localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (!storedEmail) {
      router.push("/forgot-password");
      return;
    }
    setEmail(storedEmail);

    // Setup resend cooldown timer
    const timer = setInterval(() => {
      setResendCooldown(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    
    const newCode = [...code];
    newCode[index] = value.slice(0, 1);
    setCode(newCode);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    
    setResendCooldown(30);
    setError("");
    
    try {
      // Simulate resending code
      await new Promise(resolve => setTimeout(resolve, 1000));
      setError("Verification code resent successfully!");
    } catch (err) {
      setError("Failed to resend code. Please try again.");
      setResendCooldown(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const fullCode = code.join("");
    if (fullCode.length < 6) {
      setError("Please enter the complete 6-digit verification code");
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store verification status for reset password page
      localStorage.setItem("resetVerified", "true");
      localStorage.setItem("resetCode", fullCode);
      
      router.push("/reset-password");
    } catch (err) {
      setError("Invalid verification code. Please try again.");
      setCode(["", "", "", "", "", ""]);
      document.getElementById("code-0")?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main style={{ 
      minHeight: "100vh", 
      display: "grid", 
      placeItems: "center", 
      background: "linear-gradient(to bottom right, #f8f6fd, #e9e1ff)",
      padding: 24,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      <div style={{
        width: "100%",
        maxWidth: 420,
        background: "white",
        borderRadius: 24,
        padding: 32,
        boxShadow: "0 10px 40px rgba(124, 77, 255, 0.15)",
        border: "1px solid #eae6ff"
      }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: "linear-gradient(135deg, #29b6f6, #0288d1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 4px 12px rgba(41, 182, 246, 0.3)"
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24">
              <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
            </svg>
          </div>
          <h1 style={{ 
            margin: 0, 
            fontSize: 24, 
            fontWeight: 700, 
            color: "#4a3780",
            lineHeight: 1.3
          }}>
            Verify Your Identity
          </h1>
          <p style={{ 
            marginTop: 8, 
            fontSize: 14, 
            color: "#666",
            fontWeight: 500
          }}>
            We've sent a 6-digit code to{" "}
            <span style={{ fontWeight: 600, color: "#7c4dff" }}>{email}</span>
          </p>
        </div>

        {error && (
          <div style={{
            background: "#fff1f1",
            border: "1px solid #ffccc7",
            color: "#d32f2f",
            borderRadius: 12,
            padding: "12px 16px",
            marginBottom: 16,
            fontSize: 14,
            display: "flex",
            alignItems: "center"
          }}>
            <span style={{ marginRight: 8 }}>❌</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(6, 1fr)", 
            gap: 10,
            marginBottom: 24
          }}>
            {code.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                style={{
                  width: "100%",
                  height: 60,
                  textAlign: "center",
                  fontSize: 24,
                  fontWeight: 700,
                  borderRadius: 16,
                  border: error 
                    ? "2px solid #ff7043" 
                    : digit 
                      ? "2px solid #7c4dff" 
                      : "2px solid #d1c9f0",
                  background: digit ? "#f8f6ff" : "white",
                  outline: "none",
                  transition: "all 0.2s"
                }}
                autoFocus={index === 0}
                disabled={isLoading}
              />
            ))}
          </div>

          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || isLoading}
              style={{
                background: "none",
                border: "none",
                color: resendCooldown > 0 ? "#999" : "#7c4dff",
                fontWeight: 600,
                fontSize: 14,
                cursor: (resendCooldown > 0 || isLoading) ? "not-allowed" : "pointer",
                padding: "4px 8px",
                borderRadius: 8,
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                if (!(resendCooldown > 0 || isLoading)) {
                  e.currentTarget.style.background = "#f8f6ff";
                }
              }}
              onMouseLeave={(e) => {
                if (!(resendCooldown > 0 || isLoading)) {
                  e.currentTarget.style.background = "none";
                }
              }}
            >
              {resendCooldown > 0 
                ? `Resend code in ${resendCooldown}s` 
                : "Resend verification code"}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading || code.some(d => !d)}
            style={{
              width: "100%",
              padding: "14px 20px",
              borderRadius: 16,
              background: (isLoading || code.some(d => !d)) 
                ? "#9a81d9" 
                : "linear-gradient(135deg, #7c4dff, #5e35b1)",
              color: "white",
              border: "none",
              fontWeight: 700,
              fontSize: 16,
              cursor: (isLoading || code.some(d => !d)) ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(124, 77, 255, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8
            }}
            onMouseEnter={(e) => {
              if (!(isLoading || code.some(d => !d))) e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              if (!(isLoading || code.some(d => !d))) e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying Code...
              </>
            ) : (
              "Verify Code"
            )}
          </button>
        </form>

        <p style={{ 
          marginTop: 28, 
          fontSize: 14, 
          textAlign: "center", 
          color: "#666",
          borderTop: "1px solid #eee",
          paddingTop: 20
        }}>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("resetEmail");
              router.push("/forgot-password");
            }}
            style={{ 
              color: "#7c4dff", 
              fontWeight: 600, 
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: 0,
              fontSize: 14,
              transition: "opacity 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Change Email Address
          </button>
        </p>
      </div>
    </main>
  );
}