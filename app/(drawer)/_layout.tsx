import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";

export const unstable_settings = { initialRouteName: "(tabs)" };

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerStyle: { backgroundColor: "#FAFAF9" },
        headerShadowVisible: false,
        headerTintColor: "#14181F",
        headerTitleStyle: { fontFamily: "Poppins_500Medium", fontSize: 18 },
        drawerActiveTintColor: "#14181F",
        drawerInactiveTintColor: "#8A8A85",
        drawerActiveBackgroundColor: "#F1F0EC",
        drawerStyle: { backgroundColor: "#FAFAF9" },
        drawerLabelStyle: { fontFamily: "Poppins_400Regular" },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: "Licitaciones Pro",
          drawerLabel: "Inicio",
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" color={color as string} size={size} />,
        }}
      />
      <Drawer.Screen
        name="empresa"
        options={{
          title: "Perfil de la empresa",
          drawerIcon: ({ color, size }) => <Ionicons name="business-outline" color={color as string} size={size} />,
        }}
      />
      <Drawer.Screen
        name="ayuda"
        options={{
          title: "Ayuda y acerca de",
          drawerIcon: ({ color, size }) => <Ionicons name="help-circle-outline" color={color as string} size={size} />,
        }}
      />
    </Drawer>
  );
}
