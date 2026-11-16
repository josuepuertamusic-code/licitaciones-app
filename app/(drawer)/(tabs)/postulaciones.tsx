import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, FlatList, Pressable, Text, View } from "react-native";
import { EstadoVacio } from "@/components/EstadoVacio";
import { useAppStore } from "@/store/useAppStore";
import { formatearFecha, formatearPesos } from "@/utils/formato";
import type { EstadoPostulacion } from "@/types";

const ESTADOS: EstadoPostulacion[] = ["Registrada", "Enviada en SECOP", "Adjudicada", "No adjudicada"];
const COLOR: Record<EstadoPostulacion, string> = {
  Registrada: "bg-brand-soft text-brand",
  "Enviada en SECOP": "bg-accent/30 text-ink",
  Adjudicada: "bg-ok/15 text-ok",
  "No adjudicada": "bg-danger/10 text-danger",
};

export default function PostulacionesScreen() {
  const router = useRouter();
  const postulaciones = useAppStore((s) => s.postulaciones);
  const cambiarEstado = useAppStore((s) => s.cambiarEstado);
  const eliminar = useAppStore((s) => s.eliminarPostulacion);

  const confirmarEliminar = (id: string) =>
    Alert.alert("Eliminar postulación", "Se borrará del historial de este teléfono.", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => eliminar(id) },
    ]);

  return (
    <View className="flex-1 bg-surface">
      <FlatList
        data={postulaciones}
        keyExtractor={(p) => p.id}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        ListEmptyComponent={
          <EstadoVacio
            icono="document-text-outline"
            titulo="Sin postulaciones"
            detalle="Cuando registre una oferta aparecerá aquí con su estado de seguimiento."
          />
        }
        renderItem={({ item: p }) => (
          <View className="border-b border-line py-4">
            <Pressable onPress={() => router.push({ pathname: "/licitacion/[id]", params: { id: p.licitacion.id } })}>
              <Text numberOfLines={2} className="font-semi text-base text-ink">
                {p.licitacion.titulo}
              </Text>
              <Text numberOfLines={1} className="font-body text-sm text-muted">
                {p.licitacion.entidad}
              </Text>
            </Pressable>
            <View className="mt-2 flex-row items-center justify-between">
              <Text className="font-bold text-brand">{formatearPesos(p.valorOferta)}</Text>
              <Text className="font-body text-xs text-muted">{formatearFecha(p.creadaEn)}</Text>
            </View>
            <View className="mt-3 flex-row flex-wrap gap-2">
              {ESTADOS.map((e) => (
                <Pressable
                  key={e}
                  accessibilityLabel={`Marcar como ${e}`}
                  onPress={() => cambiarEstado(p.id, e)}
                  className={`rounded-full px-3 py-1.5 ${p.estado === e ? COLOR[e].split(" ")[0] : "bg-surface"}`}
                >
                  <Text className={`font-body text-xs ${p.estado === e ? COLOR[e].split(" ")[1] : "text-muted"}`}>{e}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable
              accessibilityLabel="Eliminar postulación"
              onPress={() => confirmarEliminar(p.id)}
              className="mt-3 flex-row items-center gap-1 self-end"
            >
              <Ionicons name="trash-outline" size={16} color="#A63D3D" />
              <Text className="font-body text-sm text-danger">Eliminar</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
