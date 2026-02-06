"use client";

import Link from "next/link";

export default function StartPage() {
  return (
    <main style={styles.page}>
      {/* Left panel */}
      <section style={styles.left}>
        {/* top-left icon */}
        <div style={styles.topLeftIcon} aria-hidden="true">
          🔍
        </div>

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
        {/* top-right hamburger */}
        <div style={styles.topRightIcon} aria-hidden="true">
          ☰
        </div>

        <div style={styles.rightContent}>
          <p style={styles.quote}>
            “Lost something? Don’t worry — your campus community is here to
            help.”
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
    gridTemplateColumns: "1fr 420px",
    background: "#f8f6fd",
  },

  left: {
    position: "relative",
    background: "#ffffff",
    display: "grid",
    placeItems: "center",
    padding: "40px 24px",
  },
  topLeftIcon: {
    position: "absolute",
    top: 18,
    left: 18,
    width: 44,
    height: 44,
    borderRadius: 12,
    border: "2px solid #7c4dff",
    display: "grid",
    placeItems: "center",
    fontSize: 18,
    userSelect: "none",
  },
  illustrationWrap: {
    width: "min(520px, 90%)",
    display: "grid",
    placeItems: "center",
  },
  illustration: {
    width: "100%",
    height: "auto",
    display: "block",
  },

  right: {
    position: "relative",
    background: "#d9a8ff",
    display: "grid",
    placeItems: "center",
    padding: "40px 24px",
  },
  topRightIcon: {
    position: "absolute",
    top: 18,
    right: 18,
    fontSize: 22,
    userSelect: "none",
  },
  rightContent: {
    width: "100%",
    maxWidth: 280,
    textAlign: "center",
  },
  quote: {
    margin: 0,
    fontSize: 16,
    lineHeight: 1.6,
    fontWeight: 600,
    color: "#1f1f1f",
  },
  button: {
    display: "inline-block",
    marginTop: 18,
    padding: "12px 22px",
    borderRadius: 999,
    background: "#3f3f46",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 700,
  },
};
