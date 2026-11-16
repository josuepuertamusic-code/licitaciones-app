import { ActivityIndicator, Text, View } from "react-native";

export function EstadoCarga({ mensaje = "Cargando..." }: { mensaje?: string }) {
  return (
    <View className="items-center justify-center gap-3 p-8">
      <ActivityIndicator size="large" color="#14181F" />
      <Text className="font-body text-muted">{mensaje}</Text>
    </View>
  );
}
