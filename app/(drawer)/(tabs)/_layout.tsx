import { Ionicons } from "@expo/vector-icons";
import type { ColorValue } from "react-native";
import { Tabs } from "expo-router";

type Icono = keyof typeof Ionicons.glyphMap;

const icono = (_activo: Icono, inactivo: Icono) =>
  ({ color, size }: { color: ColorValue; size: number }) => (
    <Ionicons name={inactivo} color={color as string} size={size} />
  );

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#14181F",
        tabBarInactiveTintColor: "#8A8A85",
        tabBarStyle: { backgroundColor: "#FAFAF9", borderTopColor: "#E8E6E1", elevation: 0, shadowOpacity: 0 },
        tabBarLabelStyle: { fontFamily: "Poppins_400Regular", fontSize: 11 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Buscar", tabBarIcon: icono("search", "search-outline") }} />
      <Tabs.Screen name="favoritos" options={{ title: "Favoritos", tabBarIcon: icono("star", "star-outline") }} />
      <Tabs.Screen
        name="postulaciones"
        options={{ title: "Postulaciones", tabBarIcon: icono("document-text", "document-text-outline") }}
      />
      <Tabs.Screen name="mapa" options={{ title: "Mapa", tabBarIcon: icono("map", "map-outline") }} />
    </Tabs>
  );
}
