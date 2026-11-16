import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { CANTIDAD_MAX, CANTIDAD_MIN, limitarCantidad } from "@/utils/calculo";

interface Props {
  valor: number;
  onCambiar: (nuevo: number) => void;
  min?: number;
  max?: number;
}

export function ContadorCantidad({ valor, onCambiar, min = CANTIDAD_MIN, max = CANTIDAD_MAX }: Props) {
  const cambiar = (n: number) => onCambiar(Math.min(max, Math.max(min, limitarCantidad(n))));
  return (
    <View className="flex-row items-center gap-3">
      <Pressable
        accessibilityLabel="Disminuir cantidad"
        disabled={valor <= min}
        onPress={() => cambiar(valor - 1)}
        className={`h-10 w-10 items-center justify-center rounded-full border border-line ${valor <= min ? "opacity-40" : ""}`}
      >
        <Ionicons name="remove-outline" size={20} color="#14181F" />
      </Pressable>
      <Text className="min-w-10 text-center font-bold text-lg text-ink">{valor}</Text>
      <Pressable
        accessibilityLabel="Aumentar cantidad"
        disabled={valor >= max}
        onPress={() => cambiar(valor + 1)}
        className={`h-10 w-10 items-center justify-center rounded-full border border-line ${valor >= max ? "opacity-40" : ""}`}
      >
        <Ionicons name="add-outline" size={20} color="#14181F" />
      </Pressable>
    </View>
  );
}
