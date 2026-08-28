"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";

/**
 * Grupos e permissões são administração pura: apenas super_admin altera.
 * Antes a verificação existia só na UI — as actions aceitavam qualquer
 * usuário autenticado e dependiam exclusivamente do RLS.
 */
async function requireSuperAdmin() {
  const { supabase, user, profile } = await getSession();
  if (!user) throw new Error("Não autenticado");
  if (profile?.role !== "super_admin") {
    throw new Error("Sem permissão para gerenciar grupos");
  }
  return { supabase, user };
}

export async function createGroup(formData: FormData) {
  const { supabase, user } = await requireSuperAdmin();

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();

  if (!name) throw new Error("Nome do grupo é obrigatório");

  const { error } = await supabase.from("user_groups").insert({
    name: name.slice(0, 120),
    description: description || null,
    created_by: user.id,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/admin/grupos");
}

export async function updateGroup(groupId: string, formData: FormData) {
  const { supabase } = await requireSuperAdmin();

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();

  if (!name) throw new Error("Nome do grupo é obrigatório");

  const { error } = await supabase
    .from("user_groups")
    .update({
      name: name.slice(0, 120),
      description: description || null,
    })
    .eq("id", groupId);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/admin/grupos");
  revalidatePath(`/dashboard/admin/grupos/${groupId}`);
}

export async function deleteGroup(groupId: string) {
  const { supabase } = await requireSuperAdmin();

  const { error } = await supabase.from("user_groups").delete().eq("id", groupId);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/admin/grupos");
}

export async function addGroupMember(groupId: string, userId: string) {
  const { supabase, user } = await requireSuperAdmin();

  if (!userId) throw new Error("Selecione um usuário");

  const { error } = await supabase.from("group_members").insert({
    group_id: groupId,
    user_id: userId,
    added_by: user.id,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/admin/grupos/${groupId}`);
}

export async function removeGroupMember(groupId: string, userId: string) {
  const { supabase } = await requireSuperAdmin();

  const { error } = await supabase
    .from("group_members")
    .delete()
    .eq("group_id", groupId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/admin/grupos/${groupId}`);
}

export async function addGroupPermission(groupId: string, permissionId: string) {
  const { supabase, user } = await requireSuperAdmin();

  const { error } = await supabase.from("group_permissions").insert({
    group_id: groupId,
    permission_id: permissionId,
    granted_by: user.id,
  });

  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/admin/grupos/${groupId}`);
}

export async function removeGroupPermission(groupId: string, permissionId: string) {
  const { supabase } = await requireSuperAdmin();

  const { error } = await supabase
    .from("group_permissions")
    .delete()
    .eq("group_id", groupId)
    .eq("permission_id", permissionId);

  if (error) throw new Error(error.message);

  revalidatePath(`/dashboard/admin/grupos/${groupId}`);
}
