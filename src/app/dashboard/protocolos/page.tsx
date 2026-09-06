import Link from "next/link";
import { isManager, requireSession } from "@/lib/auth";
import {
  formatDate,
  priorityClass,
  priorityLabel,
  protocolStatusClass,
  protocolStatusLabel,
} from "@/lib/labels";
import type { Protocol } from "@/types/database";

export default async function ProtocolosPage() {
  const { supabase, user, profile } = await requireSession();
  const canManage = isManager(profile?.role);

  let query = supabase
    .from("protocolos")
    .select(`
      *,
      requester:profiles!protocolos_requester_id_fkey(id, full_name, email),
      assigned_to:profiles!protocolos_assigned_to_fkey(id, full_name, email)
    `)
    .order("created_at", { ascending: false });

  if (!canManage) {
    query = query.eq("requester_id", user.id);
  }

  const { data: protocols } = await query.returns<Protocol[]>();

  return (
    <div>
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Protocolos</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie solicitações, acompanhe status e atribua responsáveis.
          </p>
        </div>
        <Link
          href="/dashboard/protocolos/novo"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Novo Protocolo
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NUP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Solicitante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsável
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Atualizado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {protocols && protocols.length > 0 ? (
                protocols.map((protocol) => (
                  <tr key={protocol.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {protocol.nup}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{protocol.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${protocolStatusClass(protocol.status)}`}>
                        {protocolStatusLabel(protocol.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${priorityClass(protocol.priority)}`}>
                        {priorityLabel(protocol.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {protocol.requester?.full_name || protocol.requester?.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {protocol.assigned_to?.full_name || protocol.assigned_to?.email || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(protocol.updated_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/dashboard/protocolos/${protocol.id}`}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        Ver
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhum protocolo encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
