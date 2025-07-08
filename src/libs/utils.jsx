import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Función utilitaria para filtrar listas por múltiples campos
export function filtrarPorCampos(lista, searchTerm, campos) {
  const term = (searchTerm || "").toLowerCase();
  if (!term) return lista;
  return lista.filter((item) =>
    campos.some((campo) =>
      (item[campo] || "").toString().toLowerCase().includes(term)
    )
  );
}