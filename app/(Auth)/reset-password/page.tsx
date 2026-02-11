"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("resetToken");
    const email = localStorage.getItem("resetEmail");
    if (!token || !email) router.push("/forgot-password");
  }, [router]);

  const validateForm = () => {
    let ok = true;
    const e = { password: "", confirmPassword: "" };

    if (formData.password.length < 8) {
      e.password = "Password must be at least 8 characters";
      ok = false;
    } else if (!/[A-Z]/.test(formData.password)) {
      e.password = "Must contain an uppercase letter";
      ok = false;
    } else if (!/[0-9]/.test(formData.password)) {
      e.password = "Must contain a number";
      ok = false;
    }

    if (formData.confirmPassword !== formData.password) {
      e.confirmPassword = "Passwords do not match";
      ok = false;
    }

    setErrors(e);
    return ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSuccessMessage("");

    const token = localStorage.getItem("resetToken");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: formData.password }),
      });

      const json = await res.json();

      if (!res.ok) {
        setErrors((prev) => ({ ...prev, confirmPassword: json?.error ?? "Reset failed" }));
        setIsSubmitting(false);
        return;
      }

      // Clear session after success
      localStorage.removeItem("resetToken");
      localStorage.removeItem("resetEmail");

      setSuccessMessage("Password reset successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 1800);
    } catch {
      setErrors((prev) => ({ ...prev, confirmPassword: "Reset failed. Please try again." }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name as keyof typeof errors]) setErrors((p) => ({ ...p, [name]: "" }));
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
              background: "linear-gradient(135deg, #66bb6a, #2e7d32)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 4px 12px rgba(102, 187, 106, 0.3)",
            }}
          >
            <span style={{ fontSize: 26, color: "white" }}>✅</span>
          </div>

          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700, color: "#4a3780" }}>Reset Password</h1>
          <p style={{ marginTop: 8, fontSize: 14, color: "#666", fontWeight: 500 }}>
            Create a new secure password for your account
          </p>
        </div>

        {successMessage && (
          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#166534",
              borderRadius: 12,
              padding: "12px 16px",
              marginBottom: 16,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
            }}
          >
            <span style={{ marginRight: 8 }}>✅</span>
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginTop: 8 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#555" }}>
              New Password
            </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a new password"
              disabled={isSubmitting || !!successMessage}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 14,
                border: errors.password ? "1px solid #ff7043" : "1px solid #d1c9f0",
                outline: "none",
                fontSize: 15,
              }}
            />
            {errors.password && <p style={{ marginTop: 6, fontSize: 13, color: "#ff7043" }}>{errors.password}</p>}
          </div>

          <div style={{ marginTop: 20 }}>
            <label style={{ display: "block", marginBottom: 6, fontSize: 13, fontWeight: 500, color: "#555" }}>
              Confirm New Password
            </label>
            <input
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your new password"
              disabled={isSubmitting || !!successMessage}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 14,
                border: errors.confirmPassword ? "1px solid #ff7043" : "1px solid #d1c9f0",
                outline: "none",
                fontSize: 15,
              }}
            />
            {errors.confirmPassword && (
              <p style={{ marginTop: 6, fontSize: 13, color: "#ff7043" }}>{errors.confirmPassword}</p>
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
              background: isSubmitting || !!successMessage ? "#9a81d9" : "linear-gradient(135deg, #7c4dff, #5e35b1)",
              color: "white",
              border: "none",
              fontWeight: 700,
              fontSize: 16,
              cursor: isSubmitting || !!successMessage ? "not-allowed" : "pointer",
              boxShadow: "0 4px 15px rgba(124, 77, 255, 0.4)",
            }}
          >
            {isSubmitting ? "Resetting..." : successMessage ? "Redirecting..." : "Reset Password"}
          </button>
        </form>

        <p style={{ marginTop: 24, fontSize: 14, textAlign: "center", color: "#666", borderTop: "1px solid #eee", paddingTop: 20 }}>
          <Link href="/login" style={{ color: "#7c4dff", fontWeight: 700, textDecoration: "none" }}>
            Back to Login
          </Link>
        </p>
      </div>
    </main>
  );
}
