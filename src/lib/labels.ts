import type { UserRole } from "@/types/database";

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  gestor: "Gestor",
  almoxarife: "Almoxarife",
  requisitante: "Requisitante",
};

export function roleLabel(role?: string | null): string {
  return ROLE_LABELS[role as UserRole] ?? role ?? "—";
}

export const PROTOCOL_STATUS_LABELS: Record<string, string> = {
  aberto: "Aberto",
  em_andamento: "Em andamento",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

export const PROTOCOL_STATUS_CLASSES: Record<string, string> = {
  aberto: "bg-blue-100 text-blue-800",
  em_andamento: "bg-yellow-100 text-yellow-800",
  concluido: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800",
};

export const PRIORITY_LABELS: Record<string, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

export const PRIORITY_CLASSES: Record<string, string> = {
  alta: "bg-red-100 text-red-800",
  media: "bg-yellow-100 text-yellow-800",
  baixa: "bg-green-100 text-green-800",
};

const FALLBACK_BADGE = "bg-gray-100 text-gray-800";

export function protocolStatusClass(status: string): string {
  return PROTOCOL_STATUS_CLASSES[status] ?? FALLBACK_BADGE;
}

export function protocolStatusLabel(status: string): string {
  return PROTOCOL_STATUS_LABELS[status] ?? status.replace("_", " ");
}

export function priorityClass(priority: string): string {
  return PRIORITY_CLASSES[priority] ?? FALLBACK_BADGE;
}

export function priorityLabel(priority: string): string {
  return PRIORITY_LABELS[priority] ?? priority;
}

/** Data e hora no formato brasileiro, a partir de um timestamp do banco. */
export function formatDateTime(value: string): string {
  return new Date(value).toLocaleString("pt-BR");
}

/** Apenas a data, no formato brasileiro. */
export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("pt-BR");
}
