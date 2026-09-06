import { MANAGER_ROLES, requireSession } from "@/lib/auth";
import UsersClient from "./UsersClient";

export default async function UsersPage() {
  const { supabase, profile } = await requireSession(MANAGER_ROLES);

  const { data: users } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return <UsersClient users={users ?? []} currentRole={profile?.role ?? ""} />;
}
