"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isValidSession, setIsValidSession] = useState(true);

  // Verify session on mount
  useEffect(() => {
    const verified = localStorage.getItem("resetVerified");
    if (verified !== "true") {
      setIsValidSession(false);
      router.push("/forgot-password");
    }
  }, [router]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { password: "", confirmPassword: "" };

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Must contain an uppercase letter";
      isValid = false;
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Must contain a number";
      isValid = false;
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSuccessMessage("");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear reset session data
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetCode");
      localStorage.removeItem("resetVerified");
      
      setSuccessMessage("Password reset successfully! Redirecting to login...");
      
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error("Reset password error:", error);
      setErrors(prev => ({
        ...prev,
        confirmPassword: "Failed to reset password. Please try again."
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  if (!isValidSession) {
    return null;
  }

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
            background: "linear-gradient(135deg, #66bb6a, #2e7d32)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 4px 12px rgba(102, 187, 106, 0.3)"
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="white" viewBox="0 0 24 24">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
            </svg>
          </div>
          <h1 style={{ 
            margin: 0, 
            fontSize: 24, 
            fontWeight: 700, 
            color: "#4a3780",
            lineHeight: 1.3
          }}>
            Reset Password
          </h1>
          <p style={{ 
            marginTop: 8, 
            fontSize: 14, 
            color: "#666",
            fontWeight: 500
          }}>
            Create a new secure password for your account
          </p>
        </div>

        {successMessage && (
          <div style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            color: "#166534",
            borderRadius: 12,
            padding: "12px 16px",
            marginBottom: 16,
            fontSize: 14,
            display: "flex",
            alignItems: "center"
          }}>
            <span style={{ marginRight: 8 }}>✅</span>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* New Password */}
          <div style={{ marginTop: 8 }}>
            <label style={{ 
              display: "block", 
              marginBottom: 6, 
              fontSize: 13, 
              fontWeight: 500, 
              color: "#555" 
            }}>
              New Password
            </label>
            <div style={{ position: "relative" }}>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  borderRadius: 14,
                  border: errors.password 
                    ? "1px solid #ff7043" 
                    : "1px solid #d1c9f0",
                  outline: "none",
                  fontSize: 15,
                  transition: "border-color 0.2s",
                  paddingRight: formData.password ? 40 : 16
                }}
                placeholder="Create a new password"
                disabled={isSubmitting || !!successMessage}
              />
              {formData.password && (
                <div style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#4caf50"
                }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                  </svg>
                </div>
              )}
            </div>
            {errors.password && (
              <p style={{ 
                marginTop: 6, 
                fontSize: 13, 
                color: "#ff7043",
                display: "flex",
                alignItems: "center"
              }}>
                <span style={{ marginRight: 6 }}>⚠️</span>
                {errors.password}
              </p>
            )}
            <div style={{ 
              display: "flex", 
              gap: 6, 
              marginTop: 10,
              height: 6
            }}>
              <div style={{
                flex: 1,
                borderRadius: 3,
                background: formData.password.length >= 8 ? "#4caf50" : "#e0e0e0",
                transition: "background 0.3s"
              }}></div>
              <div style={{
                flex: 1,
                borderRadius: 3,
                background: /[A-Z]/.test(formData.password) ? "#4caf50" : "#e0e0e0",
                transition: "background 0.3s"
              }}></div>
              <div style={{
                flex: 1,
                borderRadius: 3,
                background: /[0-9]/.test(formData.password) ? "#4caf50" : "#e0e0e0",
                transition: "background 0.3s"
              }}></div>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginTop: 20 }}>
            <label style={{ 
              display: "block", 
              marginBottom: 6, 
              fontSize: 13, 
              fontWeight: 500, 
              color: "#555" 
            }}>
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 14,
                border: errors.confirmPassword 
                  ? "1px solid #ff7043" 
                  : "1px solid #d1c9f0",
                outline: "none",
                fontSize: 15,
                transition: "border-color 0.2s"
              }}
              placeholder="Re-enter your new password"
              disabled={isSubmitting || !!successMessage}
            />
            {errors.confirmPassword && (
              <p style={{ 
                marginTop: 6, 
                fontSize: 13, 
                color: "#ff7043",
                display: "flex",
                alignItems: "center"
              }}>
                <span style={{ marginRight: 6 }}>⚠️</span>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !!successMessage}
            style={{
              marginTop: 28,
              width: "100%",
              padding: "14px 20px",
              borderRadius: 16,
              background: (isSubmitting || !!successMessage) 
                ? "#9a81d9" 
                : "linear-gradient(135deg, #7c4dff, #5e35b1)",
              color: "white",
              border: "none",
              fontWeight: 700,
              fontSize: 16,
              cursor: (isSubmitting || !!successMessage) ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 4px 15px rgba(124, 77, 255, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8
            }}
            onMouseEnter={(e) => {
              if (!(isSubmitting || !!successMessage)) e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              if (!(isSubmitting || !!successMessage)) e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Resetting Password...
              </>
            ) : successMessage ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                Redirecting...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div style={{
          marginTop: 24,
          padding: 16,
          background: "#f8f6ff",
          borderRadius: 16,
          border: "1px solid #eae6ff"
        }}>
          <h3 style={{ 
            fontSize: 13, 
            fontWeight: 700, 
            color: "#4a3780",
            marginBottom: 10,
            display: "flex",
            alignItems: "center",
            gap: 8
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#7c4dff" viewBox="0 0 24 24">
              <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            </svg>
            Password Requirements
          </h3>
          <ul style={{ 
            margin: 0, 
            paddingLeft: 20, 
            fontSize: 13, 
            color: "#555",
            lineHeight: 1.6
          }}>
            <li style={{ marginBottom: 4 }}>At least 8 characters long</li>
            <li style={{ marginBottom: 4 }}>One uppercase letter (A-Z)</li>
            <li>One number (0-9)</li>
          </ul>
        </div>

        <p style={{ 
          marginTop: 24, 
          fontSize: 14, 
          textAlign: "center", 
          color: "#666",
          borderTop: "1px solid #eee",
          paddingTop: 20
        }}>
          <Link 
            href="/login" 
            style={{ 
              color: "#7c4dff", 
              fontWeight: 600, 
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              transition: "opacity 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.8"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
            Back to Login
          </Link>
        </p>
      </div>
    </main>
  );
}