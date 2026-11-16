import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { BannerSinConexion } from "@/components/BannerSinConexion";
import { Boton } from "@/components/Boton";
import { MapaLeaflet } from "@/components/MapaLeaflet";
import { useLicitacion } from "@/hooks/useLicitacion";
import { useUbicacion } from "@/hooks/useUbicacion";
import { useAppStore } from "@/store/useAppStore";
import { distanciaKm, formatearDistancia } from "@/utils/formato";
import { ubicarEntidad } from "@/utils/ubicaciones";

export default function MapaScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const empresa = useAppStore((s) => s.empresa);
  const favoritos = useAppStore((s) => s.favoritos);
  const { data: remota } = useLicitacion(id);
  const licitacion = remota ?? favoritos.find((f) => f.id === id) ?? null;
  const ub = useUbicacion();
  const [centrar, setCentrar] = useState(0);

  const oficina = useMemo(
    () => ({ punto: { latitud: empresa.latitud, longitud: empresa.longitud }, etiqueta: `Oficina: ${empresa.nombre}` }),
    [empresa],
  );

  const ubicacionEntidad = licitacion ? ubicarEntidad(licitacion.ciudad, licitacion.departamento) : null;
  const entidad = useMemo(
    () =>
      licitacion && ubicacionEntidad
        ? { punto: ubicacionEntidad.punto, etiqueta: `${licitacion.entidad} (${licitacion.ciudad || licitacion.departamento})` }
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [licitacion?.id, ubicacionEntidad?.punto.latitud, ubicacionEntidad?.punto.longitud],
  );

  const centrarEnMi = async () => {
    const p = await ub.obtenerActual();
    if (p) setCentrar((n) => n + 1);
  };

  const destino = entidad?.punto ?? oficina.punto;
  const distancia = ub.posicion ? distanciaKm(ub.posicion, destino) : null;

  return (
    <View className="flex-1 bg-surface">
      <BannerSinConexion />
      <View className="gap-1 bg-white px-4 py-3">
        {licitacion ? (
          <>
            <Text numberOfLines={1} className="font-semi text-base text-ink">
              {licitacion.entidad}
            </Text>
            <Text className="font-body text-sm text-muted">
              {ubicacionEntidad
                ? `${licitacion.ciudad || licitacion.departamento}${ubicacionEntidad.aproximada ? " (ubicación aproximada por departamento)" : ""}`
                : "No se pudo ubicar la entidad en el mapa; se muestra su oficina."}
            </Text>
          </>
        ) : (
          <Text className="font-body text-sm text-muted">
            Se muestra la oficina de su empresa. Abra el detalle de una licitación y pulse «Ver en mapa» para ubicar la entidad.
          </Text>
        )}
        {distancia !== null ? (
          <Text className="font-semi text-sm text-brand">
            Distancia a {entidad ? "la entidad" : "su oficina"}: {formatearDistancia(distancia)}
          </Text>
        ) : null}
        <Text className="font-body text-xs text-muted">Azul: oficina · Rojo: entidad · Verde: usted</Text>
      </View>

      <View className="flex-1 p-3">
        <MapaLeaflet oficina={oficina} entidad={entidad} usuario={ub.posicion} centrarUsuario={centrar} />
      </View>

      <View className="gap-2 bg-white px-4 py-3">
        {ub.error ? <Text className="font-body text-sm text-danger">{ub.error}</Text> : null}
        {ub.permiso === "bloqueado" ? (
          <Boton titulo="Abrir ajustes de la app" variante="secundario" onPress={ub.abrirAjustes} />
        ) : null}
        <Boton titulo="Centrar en mi ubicación" cargando={ub.cargando} onPress={centrarEnMi} />
        <View className="flex-row gap-2">
          <View className="flex-1">
            {!ub.siguiendo ? (
              <Boton titulo="Iniciar seguimiento" variante="secundario" onPress={ub.iniciarSeguimiento} />
            ) : ub.pausado ? (
              <Boton titulo="Reanudar" variante="secundario" onPress={ub.reanudarSeguimiento} />
            ) : (
              <Boton titulo="Pausar" variante="secundario" onPress={ub.pausarSeguimiento} />
            )}
          </View>
          {ub.siguiendo ? (
            <View className="flex-1">
              <Boton titulo="Detener" variante="peligro" onPress={ub.detenerSeguimiento} />
            </View>
          ) : null}
        </View>
        {ub.siguiendo ? (
          <View className="flex-row items-center gap-1">
            <Ionicons name={ub.pausado ? "pause-circle" : "radio-button-on"} size={16} color={ub.pausado ? "#8A8A85" : "#3F6B4F"} />
            <Text className="font-body text-xs text-muted">{ub.pausado ? "Seguimiento en pausa" : "Siguiendo su ubicación"}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}
