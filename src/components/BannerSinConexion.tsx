import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { useConexion } from "@/hooks/useConexion";

export function BannerSinConexion() {
  const conectado = useConexion();
  if (conectado) return null;
  return (
    <View className="flex-row items-center gap-2 bg-accent px-4 py-2">
      <Ionicons name="wifi-outline" size={18} color="#14181F" />
      <Text className="flex-1 font-body text-sm text-ink">Sin conexión: se muestran datos guardados y no se podrá registrar postulaciones.</Text>
    </View>
  );
}
