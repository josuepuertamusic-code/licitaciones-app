import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { BORRADOR_INICIAL, limitarCantidad } from "@/utils/calculo";
import type {
  BorradorCotizacion,
  EstadoPostulacion,
  ItemCotizacion,
  Licitacion,
  PerfilEmpresa,
  Postulacion,
} from "@/types";

interface AppState {
  favoritos: Licitacion[];
  postulaciones: Postulacion[];
  borradores: Record<string, BorradorCotizacion>;
  empresa: PerfilEmpresa;
  hidratado: boolean;

  alternarFavorito: (l: Licitacion) => void;
  agregarItem: (licitacionId: string, item: Omit<ItemCotizacion, "id">) => void;
  quitarItem: (licitacionId: string, itemId: string) => void;
  cambiarCantidad: (licitacionId: string, itemId: string, cantidad: number) => void;
  fijarPorcentajes: (licitacionId: string, utilidadPct: number, ivaPct: number) => void;
  registrarPostulacion: (p: Omit<Postulacion, "id" | "creadaEn" | "estado">) => Postulacion;
  cambiarEstado: (id: string, estado: EstadoPostulacion) => void;
  eliminarPostulacion: (id: string) => void;
  guardarEmpresa: (e: PerfilEmpresa) => void;
}

export const EMPRESA_INICIAL: PerfilEmpresa = {
  nombre: "Mi empresa S.A.S.",
  nit: "",
  ciudad: "Dosquebradas, Risaralda",
  latitud: 4.8394,
  longitud: -75.6726,
};

const nuevoId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

const borradorDe = (s: AppState, id: string): BorradorCotizacion => s.borradores[id] ?? BORRADOR_INICIAL;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      favoritos: [],
      postulaciones: [],
      borradores: {},
      empresa: EMPRESA_INICIAL,
      hidratado: false,

      alternarFavorito: (l) =>
        set((s) => ({
          favoritos: s.favoritos.some((f) => f.id === l.id)
            ? s.favoritos.filter((f) => f.id !== l.id)
            : [l, ...s.favoritos],
        })),

      agregarItem: (licitacionId, item) =>
        set((s) => {
          const b = borradorDe(s, licitacionId);
          const nuevo = { ...item, id: nuevoId(), cantidad: limitarCantidad(item.cantidad) };
          return { borradores: { ...s.borradores, [licitacionId]: { ...b, items: [...b.items, nuevo] } } };
        }),

      quitarItem: (licitacionId, itemId) =>
        set((s) => {
          const b = borradorDe(s, licitacionId);
          return {
            borradores: {
              ...s.borradores,
              [licitacionId]: { ...b, items: b.items.filter((i) => i.id !== itemId) },
            },
          };
        }),

      cambiarCantidad: (licitacionId, itemId, cantidad) =>
        set((s) => {
          const b = borradorDe(s, licitacionId);
          return {
            borradores: {
              ...s.borradores,
              [licitacionId]: {
                ...b,
                items: b.items.map((i) => (i.id === itemId ? { ...i, cantidad: limitarCantidad(cantidad) } : i)),
              },
            },
          };
        }),

      fijarPorcentajes: (licitacionId, utilidadPct, ivaPct) =>
        set((s) => ({
          borradores: { ...s.borradores, [licitacionId]: { ...borradorDe(s, licitacionId), utilidadPct, ivaPct } },
        })),

      registrarPostulacion: (datos) => {
        const nueva: Postulacion = {
          ...datos,
          id: nuevoId(),
          estado: "Registrada",
          creadaEn: new Date().toISOString(),
        };
        set((s) => {
          const { [datos.licitacion.id]: _descartado, ...resto } = s.borradores;
          return { postulaciones: [nueva, ...s.postulaciones], borradores: resto };
        });
        return nueva;
      },

      cambiarEstado: (id, estado) =>
        set((s) => ({ postulaciones: s.postulaciones.map((p) => (p.id === id ? { ...p, estado } : p)) })),

      eliminarPostulacion: (id) => set((s) => ({ postulaciones: s.postulaciones.filter((p) => p.id !== id) })),

      guardarEmpresa: (empresa) => set({ empresa }),
    }),
    {
      name: "licitaciones-pro-v1",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({
        favoritos: s.favoritos,
        postulaciones: s.postulaciones,
        borradores: s.borradores,
        empresa: s.empresa,
      }),
      onRehydrateStorage: () => () => {
        useAppStore.setState({ hidratado: true });
      },
    },
  ),
);

export const esFavorito = (id: string) => useAppStore.getState().favoritos.some((f) => f.id === id);
