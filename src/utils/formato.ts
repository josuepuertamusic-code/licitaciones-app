export function formatearPesos(valor: number): string {
  if (!Number.isFinite(valor)) return "$ 0";
  const entero = Math.round(valor).toString();
  return "$ " + entero.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function formatearFecha(iso: string | null): string {
  if (!iso) return "Sin fecha";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Sin fecha";
  const meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  return `${d.getUTCDate()} ${meses[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function formatearDistancia(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

export function distanciaKm(
  a: { latitud: number; longitud: number },
  b: { latitud: number; longitud: number },
): number {
  const rad = (g: number) => (g * Math.PI) / 180;
  const R = 6371;
  const dLat = rad(b.latitud - a.latitud);
  const dLon = rad(b.longitud - a.longitud);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.latitud)) * Math.cos(rad(b.latitud)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
