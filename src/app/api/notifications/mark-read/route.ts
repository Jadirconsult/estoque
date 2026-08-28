import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST() {
  const { supabase, user } = await getSession();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true, updated_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .eq("is_read", false);

  if (error) {
    return NextResponse.json(
      { error: "Não foi possível marcar as notificações como lidas." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
