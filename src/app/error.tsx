"use client";

import ErrorState from "@/components/ui/ErrorState";

export default function Error(props: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorState
      {...props}
      title="Erro"
      description="Ocorreu um erro inesperado. Por favor, tente novamente."
      logLabel="Application error"
      fullScreen
    />
  );
}
