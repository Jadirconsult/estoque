import Link from "next/link";
import { requireSession } from "@/lib/auth";
import {
  gedStatusClass,
  GED_SETORES,
  type GedDocument,
} from "@/types/modules/ged";

interface SearchParams {
  q?: string;
  setor?: string;
}

export default async function GedBuscaPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { supabase } = await requireSession();

  const term = searchParams.q?.trim() ?? "";
  const setor = searchParams.setor ?? "";

  let documents: GedDocument[] = [];

  // Sem termo nem setor não buscamos nada: evita varrer o acervo inteiro
  // só para preencher a tela na primeira visita.
  if (term || setor) {
    let query = supabase.from("ged_documents").select("*").limit(100);

    if (setor) query = query.eq("setor", setor);

    if (term) {
      // `,` separa alternativas no or() do PostgREST — escapamos para não
      // quebrar a expressão com um termo digitado pelo usuário.
      const safe = term.replace(/[,()]/g, " ").trim();
      query = query.or(
        [
          `nome.ilike.%${safe}%`,
          `cliente.ilike.%${safe}%`,
          `resumo.ilike.%${safe}%`,
          `tipo.ilike.%${safe}%`,
          `codigo.ilike.%${safe}%`,
        ].join(",")
      );
    }

    const { data } = await query
      .order("created_at", { ascending: false })
      .returns<GedDocument[]>();
    documents = data ?? [];
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text)]">Busca GED</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Pesquisa por nome, cliente, tipo, código e resumo do documento.
        </p>
      </div>

      <section className="neo-card p-5">
        <form
          method="get"
          className="grid grid-cols-1 gap-4 lg:grid-cols-[1.5fr_0.7fr_auto]"
        >
          <div>
            <label
              htmlFor="q"
              className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]"
            >
              Termo de busca
            </label>
            <input
              id="q"
              name="q"
              defaultValue={term}
              placeholder="Buscar por palavra-chave, cliente, documento ou código"
              className="mt-2 w-full rounded-[1rem] border border-[var(--stroke)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)]"
            />
          </div>
          <div>
            <label
              htmlFor="setor"
              className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]"
            >
              Setor
            </label>
            <select
              id="setor"
              name="setor"
              defaultValue={setor}
              className="mt-2 w-full rounded-[1rem] border border-[var(--stroke)] bg-[var(--surface)] px-3 py-2.5 text-sm text-[var(--text)]"
            >
              <option value="">Todos</option>
              {GED_SETORES.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="flex-1 rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-bold text-white shadow-[10px_10px_18px_rgba(122,109,216,0.28)] lg:flex-none"
            >
              Buscar
            </button>
            <Link
              href="/dashboard/ged/busca"
              className="rounded-full border border-[var(--stroke)] px-4 py-2.5 text-sm font-semibold text-[var(--muted)]"
            >
              Limpar
            </Link>
          </div>
        </form>
      </section>

      <section className="neo-card p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-[var(--text)]">Resultados</h2>
          <span className="shrink-0 rounded-full bg-[var(--primary-soft)] px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-[var(--primary-strong)]">
            {documents.length} itens
          </span>
        </div>

        <div className="space-y-3">
          {!term && !setor ? (
            <div className="rounded-2xl border border-dashed border-[var(--stroke)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--muted)]">
              Digite um termo ou escolha um setor para buscar no acervo.
            </div>
          ) : documents.length > 0 ? (
            documents.map((document) => (
              <div
                key={document.id}
                className="rounded-2xl border border-[var(--stroke)] bg-[var(--surface)] p-4"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="font-semibold text-[var(--text)]">{document.nome}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {document.cliente} • {document.setor}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 self-start rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] sm:self-auto ${gedStatusClass(document.status)}`}
                  >
                    {document.status}
                  </span>
                </div>
                {document.resumo && (
                  <p className="mt-3 text-sm text-[var(--muted)]">{document.resumo}</p>
                )}
                {document.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {document.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[var(--stroke)] bg-[var(--surface-strong)] px-2 py-1 text-[10px] uppercase tracking-[0.1em] text-[var(--muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-[var(--stroke)] bg-[var(--surface)] p-8 text-center text-sm text-[var(--muted)]">
              Nenhum resultado encontrado para a busca atual.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
