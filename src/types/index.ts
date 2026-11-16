export interface SecopProcesoDTO {
  entidad?: string;
  nit_entidad?: string;
  departamento_entidad?: string;
  ciudad_entidad?: string;
  id_del_proceso: string;
  referencia_del_proceso?: string;
  nombre_del_procedimiento?: string;
  descripci_n_del_procedimiento?: string;
  fase?: string;
  fecha_de_publicacion_del?: string;
  precio_base?: string;
  modalidad_de_contratacion?: string;
  duracion?: string;
  unidad_de_duracion?: string;
  estado_del_procedimiento?: string;
  estado_de_apertura_del_proceso?: string;
  tipo_de_contrato?: string;
  urlproceso?: { url?: string } | string;
}

export interface Licitacion {
  id: string;
  referencia: string;
  titulo: string;
  descripcion: string;
  entidad: string;
  nitEntidad: string;
  ciudad: string;
  departamento: string;
  fase: string;
  estado: string;
  modalidad: string;
  tipoContrato: string;
  precioBase: number;
  duracion: string;
  fechaPublicacion: string | null;
  url: string | null;
}

export interface FiltrosLicitaciones {
  texto: string;
  modalidad: string;
  limite: number;
}

export type EstadoPostulacion = "Registrada" | "Enviada en SECOP" | "Adjudicada" | "No adjudicada";

export interface ItemCotizacion {
  id: string;
  descripcion: string;
  costoUnitario: number;
  cantidad: number;
}

export interface BorradorCotizacion {
  items: ItemCotizacion[];
  utilidadPct: number;
  ivaPct: number;
}

export interface ResultadoOferta {
  subtotal: number;
  utilidad: number;
  iva: number;
  total: number;
  porcentajeDelPresupuesto: number | null;
  superaPresupuesto: boolean;
}

export interface Postulacion {
  id: string;
  licitacion: Licitacion;
  nit: string;
  contacto: string;
  email: string;
  telefono: string;
  valorOferta: number;
  observaciones: string;
  estado: EstadoPostulacion;
  creadaEn: string;
}

export interface PerfilEmpresa {
  nombre: string;
  nit: string;
  ciudad: string;
  latitud: number;
  longitud: number;
}

export interface Coordenada {
  latitud: number;
  longitud: number;
}
