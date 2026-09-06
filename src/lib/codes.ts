/**
 * Código legível de registro no formato PREFIXO-AAAAMMDD-XXXX.
 * O sufixo aleatório evita colisão quando dois registros nascem no mesmo
 * milissegundo — a unicidade real continua sendo garantida pelo banco.
 */
export function generateRecordCode(prefix: string, date = new Date()): string {
  const ymd = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");

  const suffix = Math.floor(Math.random() * 36 ** 4)
    .toString(36)
    .toUpperCase()
    .padStart(4, "0");

  return `${prefix}-${ymd}-${suffix}`;
}
