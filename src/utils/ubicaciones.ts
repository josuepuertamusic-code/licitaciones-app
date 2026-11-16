import type { Coordenada } from "@/types";

const CIUDADES: Record<string, Coordenada> = {
  bogota: { latitud: 4.711, longitud: -74.0721 },
  medellin: { latitud: 6.2442, longitud: -75.5812 },
  cali: { latitud: 3.4516, longitud: -76.532 },
  barranquilla: { latitud: 10.9685, longitud: -74.7813 },
  cartagena: { latitud: 10.391, longitud: -75.4794 },
  bucaramanga: { latitud: 7.1193, longitud: -73.1227 },
  pereira: { latitud: 4.8133, longitud: -75.6961 },
  dosquebradas: { latitud: 4.8394, longitud: -75.6726 },
  manizales: { latitud: 5.0703, longitud: -75.5138 },
  armenia: { latitud: 4.5339, longitud: -75.6811 },
  cucuta: { latitud: 7.8939, longitud: -72.5078 },
  ibague: { latitud: 4.4389, longitud: -75.2322 },
  villavicencio: { latitud: 4.142, longitud: -73.6266 },
  pasto: { latitud: 1.2136, longitud: -77.2811 },
  neiva: { latitud: 2.9273, longitud: -75.2819 },
  popayan: { latitud: 2.4448, longitud: -76.6147 },
  santamarta: { latitud: 11.2408, longitud: -74.199 },
  monteria: { latitud: 8.7479, longitud: -75.8814 },
  valledupar: { latitud: 10.4631, longitud: -73.2532 },
  tunja: { latitud: 5.5353, longitud: -73.3678 },
  sincelejo: { latitud: 9.3047, longitud: -75.3978 },
  quibdo: { latitud: 5.6919, longitud: -76.6583 },
  florencia: { latitud: 1.6144, longitud: -75.6062 },
  riohacha: { latitud: 11.5444, longitud: -72.9072 },
  yopal: { latitud: 5.3378, longitud: -72.3959 },
  arauca: { latitud: 7.0847, longitud: -70.7591 },
  fusagasuga: { latitud: 4.3369, longitud: -74.3637 },
  soacha: { latitud: 4.5794, longitud: -74.2169 },
  bello: { latitud: 6.3373, longitud: -75.5579 },
  itagui: { latitud: 6.1846, longitud: -75.5991 },
  palmira: { latitud: 3.5394, longitud: -76.3036 },
  buenaventura: { latitud: 3.8801, longitud: -77.0312 },
};

const DEPARTAMENTOS: Record<string, Coordenada> = {
  antioquia: CIUDADES.medellin,
  atlantico: CIUDADES.barranquilla,
  bolivar: CIUDADES.cartagena,
  boyaca: CIUDADES.tunja,
  caldas: CIUDADES.manizales,
  caqueta: CIUDADES.florencia,
  cauca: CIUDADES.popayan,
  cesar: CIUDADES.valledupar,
  cordoba: CIUDADES.monteria,
  cundinamarca: CIUDADES.bogota,
  choco: CIUDADES.quibdo,
  huila: CIUDADES.neiva,
  laguajira: CIUDADES.riohacha,
  magdalena: CIUDADES.santamarta,
  meta: CIUDADES.villavicencio,
  narino: CIUDADES.pasto,
  nortedesantander: CIUDADES.cucuta,
  quindio: CIUDADES.armenia,
  risaralda: CIUDADES.pereira,
  santander: CIUDADES.bucaramanga,
  sucre: CIUDADES.sincelejo,
  tolima: CIUDADES.ibague,
  valledelcauca: CIUDADES.cali,
  arauca: CIUDADES.arauca,
  casanare: CIUDADES.yopal,
  distritocapital: CIUDADES.bogota,
};

const normalizar = (t: string) =>
  t
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");

/** Coordenadas aproximadas de la entidad: por ciudad o, si no se conoce, por capital del departamento. */
export function ubicarEntidad(
  ciudad: string,
  departamento: string,
): { punto: Coordenada; aproximada: boolean } | null {
  const c = CIUDADES[normalizar(ciudad)];
  if (c) return { punto: c, aproximada: false };
  const d = DEPARTAMENTOS[normalizar(departamento)];
  if (d) return { punto: d, aproximada: true };
  return null;
}
