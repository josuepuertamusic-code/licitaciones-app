import "../global.css";
import {
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  useFonts,
} from "@expo-google-fonts/poppins";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAppStore } from "@/store/useAppStore";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, gcTime: 30 * 60 * 1000 } },
});

export default function RootLayout() {
  const [fuentesListas, errorFuentes] = useFonts({ Poppins_300Light, Poppins_400Regular, Poppins_500Medium });
  const hidratado = useAppStore((s) => s.hidratado);
  const listo = (fuentesListas || !!errorFuentes) && hidratado;

  useEffect(() => {
    if (listo) SplashScreen.hideAsync();
  }, [listo]);

  if (!listo) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#FAFAF9" },
            headerShadowVisible: false,
            headerTintColor: "#14181F",
            headerTitleStyle: { fontFamily: "Poppins_500Medium", fontSize: 16 },
            contentStyle: { backgroundColor: "#FAFAF9" },
          }}
        >
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
          <Stack.Screen name="licitacion/[id]" options={{ title: "Detalle del proceso" }} />
          <Stack.Screen name="cotizacion/[id]" options={{ title: "Cotización" }} />
          <Stack.Screen name="postular/[id]" options={{ title: "Registrar postulación" }} />
        </Stack>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
