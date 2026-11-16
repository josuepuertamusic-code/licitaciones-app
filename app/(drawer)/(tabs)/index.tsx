import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from "react-native";
import { BannerSinConexion } from "@/components/BannerSinConexion";
import { Boton } from "@/components/Boton";
import { EstadoCarga } from "@/components/EstadoCarga";
import { EstadoError } from "@/components/EstadoError";
import { EstadoVacio } from "@/components/EstadoVacio";
import { TarjetaLicitacion } from "@/components/TarjetaLicitacion";
import { useDebounce } from "@/hooks/useDebounce";
import { useLicitaciones } from "@/hooks/useLicitaciones";
import { mensajeDeError } from "@/services/http";
import { MODALIDADES_LICITABLES } from "@/services/secop";
import { useAppStore } from "@/store/useAppStore";

const PAGINA = 20;

export default function BuscarScreen() {
  const router = useRouter();
  const [texto, setTexto] = useState("");
  const [modalidad, setModalidad] = useState("");
  const [limite, setLimite] = useState(PAGINA);
  const textoFiltro = useDebounce(texto, 500);
  const favoritos = useAppStore((s) => s.favoritos);
  const alternarFavorito = useAppStore((s) => s.alternarFavorito);

  const { data, isLoading, isError, error, refetch, isFetching, isRefetching } = useLicitaciones({
    texto: textoFiltro,
    modalidad,
    limite,
  });

  const elegirModalidad = (m: string) => {
    setModalidad(m);
    setLimite(PAGINA);
  };

  return (
    <View className="flex-1 bg-surface">
      <BannerSinConexion />
      <View className="gap-3 bg-surface px-5 pb-2 pt-3">
        <View className="min-h-11 flex-row items-center gap-2 border-b border-brand">
          <Ionicons name="search-outline" size={20} color="#8A8A85" />
          <TextInput
            accessibilityLabel="Buscar licitaciones"
            value={texto}
            onChangeText={(t) => {
              setTexto(t);
              setLimite(PAGINA);
            }}
            placeholder="Buscar por objeto, entidad o palabra clave"
            placeholderTextColor="#8A8A85"
            returnKeyType="search"
            className="flex-1 font-body text-base text-ink"
          />
          {texto ? (
            <Pressable accessibilityLabel="Borrar búsqueda" hitSlop={10} onPress={() => setTexto("")}>
              <Ionicons name="close-outline" size={20} color="#8A8A85" />
            </Pressable>
          ) : null}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-5">
          {["", ...MODALIDADES_LICITABLES].map((m) => (
            <Pressable
              key={m || "todas"}
              onPress={() => elegirModalidad(m)}
              className={`border-b-2 pb-1 ${modalidad === m ? "border-accent" : "border-transparent"}`}
            >
              <Text className={`text-sm ${modalidad === m ? "font-semi text-ink" : "font-body text-muted"}`}>{m || "Todas"}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <EstadoCarga mensaje="Consultando SECOP II..." />
      ) : isError ? (
        <EstadoError mensaje={mensajeDeError(error)} onReintentar={() => refetch()} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(l) => l.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16 }}
          keyboardShouldPersistTaps="handled"
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={() => {
            refetch();
          }} />}
          ListEmptyComponent={
            <EstadoVacio
              titulo="Sin resultados"
              detalle="No hay procesos abiertos que coincidan con su búsqueda. Pruebe otra palabra o modalidad."
            />
          }
          renderItem={({ item }) => (
            <TarjetaLicitacion
              licitacion={item}
              favorito={favoritos.some((f) => f.id === item.id)}
              onPress={() => router.push({ pathname: "/licitacion/[id]", params: { id: item.id } })}
              onFavorito={() => alternarFavorito(item)}
            />
          )}
          ListFooterComponent={
            data && data.length >= limite ? (
              <Boton
                titulo="Cargar más resultados"
                variante="secundario"
                cargando={isFetching}
                onPress={() => setLimite((l) => l + PAGINA)}
              />
            ) : undefined
          }
        />
      )}
    </View>
  );
}
