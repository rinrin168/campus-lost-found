// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campus Lost & Found",
  description:
    "Helping campus belongings find their way back! Report lost items, post found items, and reunite them with their owners.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[var(--purple-lighter)] antialiased">
        {children}
      </body>
    </html>
  );
}
