import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface Props {
  titulo: string;
  detalle?: string;
  icono?: keyof typeof Ionicons.glyphMap;
}

export function EstadoVacio({ titulo, detalle, icono = "search-outline" }: Props) {
  return (
    <View className="items-center gap-2 p-8">
      <Ionicons name={icono} size={44} color="#8A8A85" />
      <Text className="text-center font-semi text-base text-ink">{titulo}</Text>
      {detalle ? <Text className="text-center font-body text-muted">{detalle}</Text> : null}
    </View>
  );
}
