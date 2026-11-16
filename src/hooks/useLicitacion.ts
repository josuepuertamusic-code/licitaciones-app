import { useQuery } from "@tanstack/react-query";
import { obtenerLicitacion } from "@/services/secop";

export function useLicitacion(id: string | undefined) {
  return useQuery({
    queryKey: ["licitacion", id],
    queryFn: () => obtenerLicitacion(String(id)),
    enabled: typeof id === "string" && id.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}
