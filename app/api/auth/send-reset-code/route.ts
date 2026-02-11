import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

function random6Digit() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const cleanEmail = email.toLowerCase().trim();
    const code = random6Digit();
    const code_hash = await bcrypt.hash(code, 10);
    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 min

    const { error: dbErr } = await supabaseAdmin
      .from("password_reset_codes")
      .upsert({
        email: cleanEmail,
        code_hash,
        expires_at,
        attempts: 0,
        updated_at: new Date().toISOString(),
      });

    if (dbErr) {
      return NextResponse.json({ error: dbErr.message }, { status: 500 });
    }

    const from = process.env.EMAIL_FROM!;
    const { error: mailErr } = await resend.emails.send({
      from,
      to: cleanEmail,
      subject: "Your password reset code",
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.6">
          <h2>Password Reset</h2>
          <p>Your verification code is:</p>
          <div style="font-size:28px;font-weight:700;letter-spacing:4px">${code}</div>
          <p>This code expires in <b>10 minutes</b>.</p>
          <p>If you didn’t request this, you can ignore this email.</p>
        </div>
      `,
    });

    if (mailErr) {
      return NextResponse.json({ error: mailErr.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}
