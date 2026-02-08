"use client";

import Link from "next/link";

export default function StartPage() {
  return (
    <main style={styles.page}>
      {/* Left panel */}
      <section style={styles.left}>
        <div style={styles.illustrationWrap}>
          <img
            src="/images/photo1.png"
            alt="Campus Lost & Found"
            style={styles.illustration}
          />
        </div>
      </section>

      {/* Right panel */}
      <section style={styles.right}>
        <div style={styles.rightContent}>
          <p style={styles.quote}>
            "Lost something? Don't worry — your campus community is here to help."
          </p>

          <Link href="/login" style={styles.button}>
            Get started
          </Link>
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    background: "#f8f6fd",
    height: "100vh",
    overflow: "hidden",
  },

  left: {
    position: "relative",
    background: "#ffffff",
    display: "grid",
    placeItems: "center",
    padding: "24px",
  },
  
  illustrationWrap: {
    width: "100%",
    display: "grid",
    placeItems: "center",
    height: "100%",
  },
  
  illustration: {
    width: "100%",
    height: "auto",
    maxWidth: "400px",
    maxHeight: "350px",
    objectFit: "contain",
    display: "block",
  },

  right: {
    position: "relative",
    background: "#f5e6ff",
    display: "grid",
    placeItems: "center",
    padding: "24px",
  },
  
  rightContent: {
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
    padding: "20px",
  },
  
  quote: {
    margin: 0,
    fontSize: "1.25rem",
    lineHeight: 1.5,
    fontWeight: 500,
    color: "#1f1f1f",
    fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    marginBottom: "24px",
    textAlign: "center",
  },
  
  button: {
    display: "inline-block",
    padding: "12px 28px",
    borderRadius: "8px",
    background: "#7c4dff",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "1rem",
    letterSpacing: "0.5px",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 12px rgba(124, 77, 255, 0.25)",
  },
  
  buttonHover: {
    background: "#6d38e6",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 16px rgba(124, 77, 255, 0.3)",
  },
};