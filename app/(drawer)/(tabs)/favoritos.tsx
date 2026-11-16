import { useRouter } from "expo-router";
import { FlatList, View } from "react-native";
import { EstadoVacio } from "@/components/EstadoVacio";
import { TarjetaLicitacion } from "@/components/TarjetaLicitacion";
import { useAppStore } from "@/store/useAppStore";

export default function FavoritosScreen() {
  const router = useRouter();
  const favoritos = useAppStore((s) => s.favoritos);
  const alternarFavorito = useAppStore((s) => s.alternarFavorito);

  return (
    <View className="flex-1 bg-surface">
      <FlatList
        data={favoritos}
        keyExtractor={(l) => l.id}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        ListEmptyComponent={
          <EstadoVacio
            icono="star-outline"
            titulo="Aún no sigue ningún proceso"
            detalle="Marque la estrella en una licitación para guardarla aquí y consultarla sin conexión."
          />
        }
        renderItem={({ item }) => (
          <TarjetaLicitacion
            licitacion={item}
            favorito
            onPress={() => router.push({ pathname: "/licitacion/[id]", params: { id: item.id } })}
            onFavorito={() => alternarFavorito(item)}
          />
        )}
      />
    </View>
  );
}
