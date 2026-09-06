"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ConfirmSubmitButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Pergunta exibida antes de enviar o formulário. */
  message: string;
  children: ReactNode;
}

/**
 * Botão de submit com confirmação. Existe porque handlers de evento não podem
 * ser declarados dentro de Server Components — passá-los quebra a renderização.
 */
export default function ConfirmSubmitButton({
  message,
  children,
  ...props
}: ConfirmSubmitButtonProps) {
  return (
    <button
      type="submit"
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
      {...props}
    >
      {children}
    </button>
  );
}
