"use client";

import { useEffect } from "react";

interface ErrorStateProps {
  error: Error & { digest?: string };
  reset: () => void;
  title: string;
  description: string;
  /** Texto do botão de nova tentativa. */
  action?: string;
  /** Prefixo do log no console, para diferenciar as origens. */
  logLabel: string;
  /** Ocupa a tela inteira (erro raiz) ou apenas a área de conteúdo. */
  fullScreen?: boolean;
}

/**
 * Base dos error boundaries. A mensagem original vai só para o console:
 * exibir `error.message` na tela expõe detalhes internos do banco.
 */
export default function ErrorState({
  error,
  reset,
  title,
  description,
  action = "Tentar novamente",
  logLabel,
  fullScreen = false,
}: ErrorStateProps) {
  useEffect(() => {
    console.error(`${logLabel}:`, error);
  }, [error, logLabel]);

  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "min-h-screen bg-gray-50" : "min-h-96"
      }`}
    >
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold text-red-600 mb-3">{title}</h2>
        <p className="text-gray-700 mb-3">{description}</p>
        {error.digest && (
          <p className="text-xs text-gray-500 mb-3 font-mono bg-gray-100 p-2 rounded">
            Código do erro: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {action}
        </button>
      </div>
    </div>
  );
}
