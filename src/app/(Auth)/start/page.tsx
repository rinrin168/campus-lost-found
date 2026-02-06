"use client";

import Link from "next/link";

export default function StartPage() {
  return (
    <main className="startWrap">
      <section className="startFrame">
        <div className="startLeft">
          <div className="startIconBtn startIconLeft" aria-hidden="true">
            🔍
          </div>

          <div className="startIconRight" aria-hidden="true">
            ☰
          </div>

          <img className="startIllustration" src="/window.svg" alt="Campus Lost & Found" />
        </div>

        <div className="startRight">
          <div>
            <div className="startQuote">
              “Lost something? Don’t worry — your campus community is here to help.”
            </div>

            <Link className="startBtn" href="/login">
              Get started
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
