import { useMemo, useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import {
  BORRADOR_INICIAL,
  calcularOferta,
  validarCostoItem,
  validarPorcentaje,
} from "@/utils/calculo";

/**
 * Cotización de una licitación.
 * Entradas: id de la licitación y su precio base.
 * Estado: ítems y porcentajes (en Zustand, persistidos) + campos del formulario (useState).
 * Efectos: recalcula el resultado (useMemo) cuando cambian ítems o porcentajes.
 * Salidas: resultado de la oferta, errores de validación y acciones.
 */
export function useCotizacion(licitacionId: string, precioBase: number) {
  const borrador = useAppStore((s) => s.borradores[licitacionId]) ?? BORRADOR_INICIAL;
  const agregarItemStore = useAppStore((s) => s.agregarItem);
  const quitarItem = useAppStore((s) => s.quitarItem);
  const cambiarCantidad = useAppStore((s) => s.cambiarCantidad);
  const fijarPorcentajes = useAppStore((s) => s.fijarPorcentajes);

  const [descripcion, setDescripcion] = useState("");
  const [costo, setCosto] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [utilidadTexto, setUtilidadTexto] = useState(String(borrador.utilidadPct));
  const [ivaTexto, setIvaTexto] = useState(String(borrador.ivaPct));
  const [errorItem, setErrorItem] = useState<string | null>(null);
  const [errorPorcentaje, setErrorPorcentaje] = useState<string | null>(null);

  const resultado = useMemo(
    () => calcularOferta(borrador.items, borrador.utilidadPct, borrador.ivaPct, precioBase),
    [borrador, precioBase],
  );

  const agregarItem = () => {
    const v = validarCostoItem(descripcion, costo);
    if (v.error || v.costo === undefined) {
      setErrorItem(v.error ?? "Datos inválidos.");
      return false;
    }
    agregarItemStore(licitacionId, { descripcion: descripcion.trim(), costoUnitario: v.costo, cantidad });
    setDescripcion("");
    setCosto("");
    setCantidad(1);
    setErrorItem(null);
    return true;
  };

  const aplicarPorcentajes = () => {
    const u = validarPorcentaje(utilidadTexto, "La utilidad", 100);
    if (u.error || u.valor === undefined) return setErrorPorcentaje(u.error ?? "Utilidad inválida.");
    const i = validarPorcentaje(ivaTexto, "El IVA", 100);
    if (i.error || i.valor === undefined) return setErrorPorcentaje(i.error ?? "IVA inválido.");
    fijarPorcentajes(licitacionId, u.valor, i.valor);
    setErrorPorcentaje(null);
  };

  return {
    borrador,
    resultado,
    campos: { descripcion, costo, cantidad, utilidadTexto, ivaTexto },
    setDescripcion,
    setCosto,
    setCantidad,
    setUtilidadTexto,
    setIvaTexto,
    errorItem,
    errorPorcentaje,
    agregarItem,
    aplicarPorcentajes,
    quitarItem: (itemId: string) => quitarItem(licitacionId, itemId),
    cambiarCantidad: (itemId: string, n: number) => cambiarCantidad(licitacionId, itemId, n),
    valorOferta: Math.round(resultado.total),
  };
}
