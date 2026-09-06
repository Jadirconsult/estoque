"use client";

import ErrorState from "@/components/ui/ErrorState";

export default function DashboardError(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      {...props}
      title="Erro no Dashboard"
      description="Não foi possível carregar esta página. Tente novamente."
      action="Recarregar"
      logLabel="Dashboard error"
    />
  );
}
