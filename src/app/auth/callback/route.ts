import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Troca o code do Supabase Auth por sessão (recovery, magic link, OAuth).
 * redirectTo dos e-mails deve apontar para /auth/callback?next=/auth/reset-password
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/dashboard";
  // "//host" e "/\host" também são absolutos para o navegador: só aceitamos
  // caminhos internos, senão o link do e-mail vira um open redirect.
  const isInternalPath =
    next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/\\");
  const safeNext = isInternalPath ? next : "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/auth/login?error=link_invalido`
  );
}
