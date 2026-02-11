"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VerifyCodePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const fullCode = code.join("");

    const res = await fetch("/api/auth/verify-reset-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code: fullCode }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Verification failed");
      setIsLoading(false);
      return;
    }

    localStorage.setItem("resetVerified", "true");
    router.push("/reset-password");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[400px] text-center">
        <h2 className="text-2xl font-bold text-purple-700 mb-2">
          Verify Code
        </h2>

        <p className="text-gray-600 mb-4">
          We sent a 6-digit code to
        </p>

        <p className="text-indigo-600 font-semibold mb-6">
          {email}
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-3 mb-6">
            {code.map((digit, index) => (
              <input
                key={index}
                value={digit}
                maxLength={1}
                onChange={(e) => handleChange(index, e.target.value)}
                className="w-12 h-12 text-center text-lg border-2 border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-semibold shadow-md hover:opacity-90 transition"
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </form>

        <button
          onClick={() => router.push("/forgot-password")}
          className="mt-4 text-purple-600 hover:underline"
        >
          Change Email
        </button>
      </div>
    </main>
  );
}
