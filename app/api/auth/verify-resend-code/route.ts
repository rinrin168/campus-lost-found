import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

// Use fallback values during build, real values at runtime
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-key";

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

export async function POST(req: Request) {
  try {
    // Check if we have real credentials at runtime
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Service configuration error" }, 
        { status: 503 }
      );
    }

    const body = await req.json();
    const emailRaw = body?.email;
    const codeRaw = body?.code;

    if (!emailRaw || typeof emailRaw !== "string" || !emailRaw.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (!codeRaw || typeof codeRaw !== "string" || codeRaw.trim().length !== 6) {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    const email = emailRaw.toLowerCase().trim();
    const code = codeRaw.trim();

    const { data, error } = await supabaseAdmin
      .from("password_reset_codes")
      .select("code_hash, expires_at, attempts")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "No reset request found for this email" }, { status: 400 });
    }

    if ((data.attempts ?? 0) >= 5) {
      return NextResponse.json({ error: "Too many attempts. Please request a new code." }, { status: 429 });
    }

    const expiresAt = new Date(data.expires_at).getTime();
    if (Date.now() > expiresAt) {
      return NextResponse.json({ error: "Code expired. Please request a new code." }, { status: 400 });
    }

    const ok = await bcrypt.compare(code, data.code_hash);
    if (!ok) {
      await supabaseAdmin
        .from("password_reset_codes")
        .update({ attempts: (data.attempts ?? 0) + 1, updated_at: new Date().toISOString() })
        .eq("email", email);

      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}