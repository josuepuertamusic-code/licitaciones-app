import { useEffect, useState } from "react";

/** Devuelve `valor` solo después de `ms` sin cambios; evita una petición por cada tecla. */
export function useDebounce<T>(valor: T, ms = 500): T {
  const [debounced, setDebounced] = useState(valor);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(valor), ms);
    return () => clearTimeout(t);
  }, [valor, ms]);
  return debounced;
}
