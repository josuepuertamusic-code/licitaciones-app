import type { Licitacion, SecopProcesoDTO } from "@/types";

const sinDato = (v?: string) => (!v || /^no (definido|aplica)$/i.test(v.trim()) ? "" : v.trim());

function extraerUrl(u: SecopProcesoDTO["urlproceso"]): string | null {
  if (!u) return null;
  const url = typeof u === "string" ? u : u.url;
  return url && /^https?:\/\//i.test(url) ? url : null;
}

export function mapearLicitacion(dto: SecopProcesoDTO): Licitacion {
  const precio = Number(dto.precio_base);
  const duracion = Number(dto.duracion);
  return {
    id: dto.id_del_proceso,
    referencia: sinDato(dto.referencia_del_proceso) || dto.id_del_proceso,
    titulo: sinDato(dto.nombre_del_procedimiento) || "Proceso sin título",
    descripcion: sinDato(dto.descripci_n_del_procedimiento) || sinDato(dto.nombre_del_procedimiento),
    entidad: sinDato(dto.entidad) || "Entidad no informada",
    nitEntidad: sinDato(dto.nit_entidad),
    ciudad: sinDato(dto.ciudad_entidad),
    departamento: sinDato(dto.departamento_entidad),
    fase: sinDato(dto.fase),
    estado: sinDato(dto.estado_del_procedimiento),
    modalidad: sinDato(dto.modalidad_de_contratacion),
    tipoContrato: sinDato(dto.tipo_de_contrato),
    precioBase: Number.isFinite(precio) && precio > 0 ? precio : 0,
    duracion:
      Number.isFinite(duracion) && duracion > 0
        ? `${duracion} ${sinDato(dto.unidad_de_duracion) || "día(s)"}`
        : "No informada",
    fechaPublicacion: dto.fecha_de_publicacion_del ?? null,
    url: extraerUrl(dto.urlproceso),
  };
}

export function mapearLista(dtos: SecopProcesoDTO[]): Licitacion[] {
  const vistos = new Set<string>();
  const resultado: Licitacion[] = [];
  for (const dto of dtos) {
    if (!dto.id_del_proceso || vistos.has(dto.id_del_proceso)) continue;
    vistos.add(dto.id_del_proceso);
    resultado.push(mapearLicitacion(dto));
  }
  return resultado;
}
