import type { BorradorCotizacion, ItemCotizacion, ResultadoOferta } from "@/types";

export const CANTIDAD_MIN = 1;
export const CANTIDAD_MAX = 9999;

export function limitarCantidad(n: number): number {
  if (!Number.isFinite(n)) return CANTIDAD_MIN;
  return Math.min(CANTIDAD_MAX, Math.max(CANTIDAD_MIN, Math.round(n)));
}

/** Convierte texto del usuario a número; acepta "1.500,50" y "1500.50". */
export function parsearNumero(texto: string): number | null {
  const t = texto.trim().replace(/\s/g, "");
  if (!t) return null;
  const normal = t.includes(",") ? t.replace(/\./g, "").replace(",", ".") : t;
  if (!/^-?\d+(\.\d+)?$/.test(normal)) return null;
  return Number(normal);
}

export function calcularOferta(
  items: ItemCotizacion[],
  utilidadPct: number,
  ivaPct: number,
  precioBase: number,
): ResultadoOferta {
  const subtotal = items.reduce((s, i) => s + i.costoUnitario * i.cantidad, 0);
  const utilidad = subtotal * (utilidadPct / 100);
  const iva = (subtotal + utilidad) * (ivaPct / 100);
  const total = subtotal + utilidad + iva;
  const porcentajeDelPresupuesto = precioBase > 0 ? (total / precioBase) * 100 : null;
  return {
    subtotal,
    utilidad,
    iva,
    total,
    porcentajeDelPresupuesto,
    superaPresupuesto: precioBase > 0 && total > precioBase,
  };
}

export function validarCostoItem(descripcion: string, costoTexto: string): { error?: string; costo?: number } {
  if (!descripcion.trim()) return { error: "Escriba la descripción del ítem." };
  if (descripcion.trim().length < 3) return { error: "La descripción debe tener al menos 3 caracteres." };
  if (!costoTexto.trim()) return { error: "Ingrese el costo unitario." };
  const costo = parsearNumero(costoTexto);
  if (costo === null) return { error: "El costo unitario debe ser un número (ej. 150000)." };
  if (costo <= 0) return { error: "El costo unitario debe ser mayor que cero." };
  if (costo > 1e12) return { error: "El costo unitario es demasiado alto." };
  return { costo };
}

export function validarPorcentaje(texto: string, etiqueta: string, max = 100): { error?: string; valor?: number } {
  if (!texto.trim()) return { error: `Ingrese ${etiqueta}.` };
  const v = parsearNumero(texto);
  if (v === null) return { error: `${etiqueta} debe ser un número.` };
  if (v < 0) return { error: `${etiqueta} no puede ser negativo.` };
  if (v > max) return { error: `${etiqueta} no puede superar ${max} %.` };
  return { valor: v };
}

export const BORRADOR_INICIAL: BorradorCotizacion = { items: [], utilidadPct: 10, ivaPct: 19 };
