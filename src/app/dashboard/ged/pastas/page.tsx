import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { GED_SETORES, type GedFolder, type GedSetor } from "@/types/modules/ged";

export default async function GedPastasPage() {
  const { supabase } = await requireSession();

  const { data: folders } = await supabase
    .from("ged_folders")
    .select("*")
    .order("setor")
    .order("caminho")
    .returns<GedFolder[]>();

  // Agrupa por setor mantendo a ordem canônica dos setores.
  const bySetor = new Map<GedSetor, GedFolder[]>();
  for (const folder of folders ?? []) {
    const list = bySetor.get(folder.setor) ?? [];
    list.push(folder);
    bySetor.set(folder.setor, list);
  }
  const setores = GED_SETORES.filter((setor) => bySetor.has(setor));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text)]">Pastas do GED</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Estrutura documental por setor, tipo e retenção.
          </p>
        </div>
        <Link
          href="/dashboard/ged"
          className="inline-flex shrink-0 items-center justify-center rounded-full border border-[var(--stroke)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:translate-y-[-1px]"
        >
          Voltar ao painel
        </Link>
      </div>

      {setores.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {setores.map((setor) => {
            const items = bySetor.get(setor) ?? [];
            return (
              <div key={setor} className="neo-card p-5">
                <div className="mb-4 flex items-center justify-between gap-2">
                  <h2 className="text-lg font-bold text-[var(--text)]">{setor}</h2>
                  <span className="shrink-0 rounded-full bg-[var(--primary-soft)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--primary-strong)]">
                    {items.length} pasta(s)
                  </span>
                </div>
                <div className="space-y-3">
                  {items.map((folder) => (
                    <div
                      key={folder.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--stroke)] bg-[var(--surface)] px-3 py-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[var(--primary-soft)] text-sm font-bold text-[var(--primary-strong)]">
                          {folder.nome.charAt(0).toUpperCase()}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-[var(--text)]">
                            {folder.nome}
                          </p>
                          <p className="truncate text-xs text-[var(--muted)]">
                            {folder.caminho}
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 text-xs text-[var(--muted)]">
                        {folder.ativa ? "Ativa" : "Inativa"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="neo-card p-10 text-center">
          <p className="font-semibold text-[var(--text)]">
            Nenhuma pasta cadastrada
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            A estrutura de pastas do GED ainda não foi criada no banco.
          </p>
        </div>
      )}
    </div>
  );
}
