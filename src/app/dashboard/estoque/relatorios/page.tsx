import { requireSession } from "@/lib/auth";
import { MANAGER_ROLES } from "@/lib/auth";
import ReportsClient from "./ReportsClient";

/** Relatórios são restritos a gestão — o menu já esconde, a rota também barra. */
export default async function ReportsPage() {
  await requireSession(MANAGER_ROLES);
  return <ReportsClient />;
}
