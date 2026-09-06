import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile, UserRole } from "@/types/database";

/** Papéis com poder de gestão (aprovar, atribuir, administrar). */
export const MANAGER_ROLES: UserRole[] = ["super_admin", "gestor"];

/** Papéis que operam o estoque (além dos gestores). */
export const STOCK_ROLES: UserRole[] = ["super_admin", "gestor", "almoxarife"];

export function isManager(role?: string | null): boolean {
  return MANAGER_ROLES.includes(role as UserRole);
}

export function canManageStock(role?: string | null): boolean {
  return STOCK_ROLES.includes(role as UserRole);
}

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

interface Session {
  supabase: SupabaseServerClient;
  user: { id: string; email?: string };
  profile: Profile | null;
}

/**
 * Sessão para Server Actions e Route Handlers: não redireciona,
 * devolve `user: null` para o chamador tratar o erro.
 */
export async function getSession(): Promise<
  Omit<Session, "user"> & { user: Session["user"] | null }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { supabase, user: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { supabase, user, profile: (profile as Profile) ?? null };
}

/**
 * Sessão para Server Components: redireciona para o login quando não há
 * usuário e, opcionalmente, para o dashboard quando o papel não é permitido.
 */
export async function requireSession(allowedRoles?: UserRole[]): Promise<Session> {
  const { supabase, user, profile } = await getSession();

  if (!user) redirect("/auth/login");

  if (allowedRoles && !allowedRoles.includes(profile?.role as UserRole)) {
    redirect("/dashboard");
  }

  return { supabase, user, profile };
}
