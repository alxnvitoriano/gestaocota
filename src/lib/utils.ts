import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Comparador estável para strings em pt-BR, evitando diferenças de ordenação
// entre servidor (Node) e cliente (browser) que podem causar hydration mismatch.
export const brCollator = new Intl.Collator("pt-BR", {
  sensitivity: "base",
  numeric: true,
});

export function compareStrings(a?: string, b?: string) {
  return brCollator.compare(a ?? "", b ?? "");
}
