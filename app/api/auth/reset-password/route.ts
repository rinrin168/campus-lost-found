import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
    }

    const cleanToken = String(token).trim();

    const { data: session, error: sessErr } = await supabaseAdmin
      .from("password_reset_sessions")
      .select("*")
      .eq("token", cleanToken)
      .single();

    if (sessErr || !session) {
      return NextResponse.json({ error: "Invalid reset session" }, { status: 400 });
    }

    if (new Date(session.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: "Reset session expired" }, { status: 400 });
    }

    // Find the user by email (simple approach for student projects)
    const { data: usersData, error: listErr } = await supabaseAdmin.auth.admin.listUsers();
    if (listErr) return NextResponse.json({ error: listErr.message }, { status: 500 });

    const user = usersData.users.find((u) => u.email?.toLowerCase() === session.email.toLowerCase());
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const { error: upErr } = await supabaseAdmin.auth.admin.updateUserById(user.id, { password });
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

    await supabaseAdmin.from("password_reset_sessions").delete().eq("token", cleanToken);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Server error" }, { status: 500 });
  }
}
