import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { formatearFecha, formatearPesos } from "@/utils/formato";
import type { Licitacion } from "@/types";

interface Props {
  licitacion: Licitacion;
  favorito: boolean;
  onPress: () => void;
  onFavorito: () => void;
}

export function iconoPorContrato(tipo: string): keyof typeof Ionicons.glyphMap {
  const t = tipo.toLowerCase();
  if (t.includes("obra")) return "construct-outline";
  if (t.includes("suministro") || t.includes("compraventa")) return "cube-outline";
  if (t.includes("consultor")) return "briefcase-outline";
  return "document-text-outline";
}

export function TarjetaLicitacion({ licitacion: l, favorito, onPress, onFavorito }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Ver detalle de ${l.titulo}`}
      onPress={onPress}
      className="border-b border-line py-4 active:opacity-70"
    >
      <View className="flex-row items-start gap-3">
        <View className="flex-1">
          <Text numberOfLines={3} className="font-semi text-[15px] leading-5 text-ink">
            {l.titulo}
          </Text>
          <Text numberOfLines={1} className="mt-1 font-body text-xs text-muted">
            {l.entidad}
          </Text>
        </View>
        <Pressable
          accessibilityLabel={favorito ? "Quitar de favoritos" : "Agregar a favoritos"}
          hitSlop={10}
          onPress={onFavorito}
        >
          <Ionicons name={favorito ? "star" : "star-outline"} size={20} color={favorito ? "#9A7B4F" : "#B9B7B1"} />
        </Pressable>
      </View>
      <View className="mt-3 flex-row flex-wrap items-center justify-between gap-2">
        <Text className="font-semi text-[15px] text-ink">
          {l.precioBase > 0 ? formatearPesos(l.precioBase) : "Cuantía no informada"}
        </Text>
        <Text className="font-body text-[11px] text-muted">
          {l.ciudad || "Sin ciudad"} · {formatearFecha(l.fechaPublicacion)}
        </Text>
      </View>
      {l.modalidad ? <Text className="mt-1 font-body text-[11px] text-accent">{l.modalidad}</Text> : null}
    </Pressable>
  );
}
