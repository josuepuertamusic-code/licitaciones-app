import { http } from "@/services/http";
import { mapearLicitacion, mapearLista } from "@/mappers/licitacionMapper";
import type { FiltrosLicitaciones, Licitacion, SecopProcesoDTO } from "@/types";

export const MODALIDADES_LICITABLES = [
  "Licitación pública",
  "Mínima cuantía",
  "Selección Abreviada de Menor Cuantía",
  "Selección abreviada subasta inversa",
  "Concurso de méritos abierto",
];

const escapar = (v: string) => v.replace(/'/g, "''");

function construirWhere(filtros: FiltrosLicitaciones): string {
  const desde = new Date(Date.now() - 120 * 24 * 3600 * 1000).toISOString().slice(0, 10);
  const modalidades = filtros.modalidad ? [filtros.modalidad] : MODALIDADES_LICITABLES;
  return [
    "estado_de_apertura_del_proceso='Abierto'",
    `fecha_de_publicacion_del>'${desde}T00:00:00'`,
    `modalidad_de_contratacion in(${modalidades.map((m) => `'${escapar(m)}'`).join(",")})`,
  ].join(" AND ");
}

export async function listarLicitaciones(filtros: FiltrosLicitaciones): Promise<Licitacion[]> {
  const params: Record<string, string | number> = {
    $limit: filtros.limite,
    $order: "fecha_de_publicacion_del DESC",
    $where: construirWhere(filtros),
  };
  if (filtros.texto.trim()) params.$q = filtros.texto.trim();
  const { data } = await http.get<SecopProcesoDTO[]>("", { params });
  return mapearLista(data);
}

export async function obtenerLicitacion(id: string): Promise<Licitacion | null> {
  const { data } = await http.get<SecopProcesoDTO[]>("", {
    params: { id_del_proceso: id, $limit: 1 },
  });
  return data.length > 0 ? mapearLicitacion(data[0]) : null;
}
