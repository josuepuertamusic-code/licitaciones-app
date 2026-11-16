import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Linking, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Boton } from "@/components/Boton";
import { EstadoCarga } from "@/components/EstadoCarga";
import { EstadoError } from "@/components/EstadoError";
import { EstadoVacio } from "@/components/EstadoVacio";
import { useLicitacion } from "@/hooks/useLicitacion";
import { mensajeDeError } from "@/services/http";
import { useAppStore } from "@/store/useAppStore";
import { formatearFecha, formatearPesos } from "@/utils/formato";

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <View className="mb-3">
      <Text className="font-body text-xs uppercase text-muted">{etiqueta}</Text>
      <Text className="font-body text-base text-ink">{valor || "No informado"}</Text>
    </View>
  );
}

export default function DetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useLicitacion(id);
  const favoritos = useAppStore((s) => s.favoritos);
  const alternarFavorito = useAppStore((s) => s.alternarFavorito);
  const postulacion = useAppStore((s) => s.postulaciones.find((p) => p.licitacion.id === id));

  const guardada = favoritos.find((f) => f.id === id);
  const l = data ?? (isError ? guardada : null) ?? null;

  if (isLoading) return <EstadoCarga mensaje="Cargando detalle..." />;
  if (!l) {
    if (isError) return <EstadoError mensaje={mensajeDeError(error)} onReintentar={() => refetch()} />;
    return (
      <>
        <Stack.Screen options={{ title: "No encontrado" }} />
        <EstadoVacio
          icono="alert-circle-outline"
          titulo="Proceso no encontrado"
          detalle={`No existe un proceso con el identificador «${id}». Puede haber sido retirado de SECOP.`}
        />
        <View className="px-8">
          <Boton titulo="Volver" onPress={() => router.back()} />
        </View>
      </>
    );
  }

  const esFavorito = !!guardada;

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {isError ? (
          <Text className="mb-3 rounded-lg bg-accent/30 p-2 font-body text-sm text-ink">
            Sin conexión: se muestra la copia guardada en favoritos.
          </Text>
        ) : null}
        <Text className="font-semi text-xl leading-7 text-ink">{l.titulo}</Text>
        <Text className="mb-5 mt-1 font-body text-muted">{l.entidad}</Text>

        <View className="mb-5">
          <Text className="font-body text-[10px] uppercase tracking-widest text-muted">Presupuesto oficial</Text>
          <Text className="font-light text-3xl text-ink">
            {l.precioBase > 0 ? formatearPesos(l.precioBase) : "No informado"}
          </Text>
        </View>

        <Dato etiqueta="Referencia" valor={l.referencia} />
        <Dato etiqueta="Modalidad" valor={l.modalidad} />
        <Dato etiqueta="Tipo de contrato" valor={l.tipoContrato} />
        <Dato etiqueta="Fase" valor={l.fase} />
        <Dato etiqueta="Publicado" valor={formatearFecha(l.fechaPublicacion)} />
        <Dato etiqueta="Duración" valor={l.duracion} />
        <Dato etiqueta="Ubicación de la entidad" valor={[l.ciudad, l.departamento].filter(Boolean).join(", ")} />
        <Dato etiqueta="Descripción" valor={l.descripcion} />

        <View className="mt-2 gap-3">
          <Boton
            titulo={postulacion ? "Ya registró una postulación" : "Armar cotización"}
            deshabilitado={!!postulacion}
            onPress={() => router.push({ pathname: "/cotizacion/[id]", params: { id: l.id } })}
          />
          <Boton
            titulo="Ver en mapa"
            variante="secundario"
            onPress={() => router.push({ pathname: "/mapa", params: { id: l.id } })}
          />
          <Boton
            titulo={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
            variante="secundario"
            onPress={() => alternarFavorito(l)}
          />
          {l.url ? (
            <Boton titulo="Abrir en SECOP II" variante="secundario" onPress={() => Linking.openURL(l.url as string)} />
          ) : null}
        </View>
        <View className="mt-4 flex-row items-center gap-1">
          <Ionicons name="information-circle-outline" size={16} color="#8A8A85" />
          <Text className="flex-1 font-body text-xs text-muted">La oferta oficial se presenta en SECOP II.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
