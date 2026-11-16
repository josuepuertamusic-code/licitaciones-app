import { ActivityIndicator, Pressable, Text } from "react-native";

interface Props {
  titulo: string;
  onPress: () => void;
  variante?: "primario" | "secundario" | "peligro";
  deshabilitado?: boolean;
  cargando?: boolean;
}

const FONDO = {
  primario: "bg-brand",
  secundario: "border border-brand",
  peligro: "border border-danger",
};

export function Boton({ titulo, onPress, variante = "primario", deshabilitado, cargando }: Props) {
  const inactivo = deshabilitado || cargando;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={titulo}
      onPress={onPress}
      disabled={inactivo}
      className={`min-h-12 flex-row items-center justify-center rounded-md px-4 py-3 active:opacity-80 ${FONDO[variante]} ${inactivo ? "opacity-50" : ""}`}
    >
      {cargando ? (
        <ActivityIndicator color={variante === "primario" ? "#fff" : "#14181F"} />
      ) : (
        <Text
          className={`font-semi text-sm ${variante === "primario" ? "text-white" : variante === "peligro" ? "text-danger" : "text-brand"}`}
        >
          {titulo}
        </Text>
      )}
    </Pressable>
  );
}
