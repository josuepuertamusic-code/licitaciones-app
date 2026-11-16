import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { listarLicitaciones } from "@/services/secop";
import type { FiltrosLicitaciones } from "@/types";

export function useLicitaciones(filtros: FiltrosLicitaciones) {
  return useQuery({
    queryKey: ["licitaciones", filtros],
    queryFn: () => listarLicitaciones(filtros),
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
