import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import { Boton } from "@/components/Boton";

interface Props {
  mensaje: string;
  onReintentar?: () => void;
}

export function EstadoError({ mensaje, onReintentar }: Props) {
  return (
    <View className="items-center gap-3 p-8">
      <Ionicons name="cloud-offline-outline" size={44} color="#A63D3D" />
      <Text className="text-center font-semi text-base text-ink">Algo salió mal</Text>
      <Text className="text-center font-body text-muted">{mensaje}</Text>
      {onReintentar ? <Boton titulo="Reintentar" onPress={onReintentar} /> : null}
    </View>
  );
}
