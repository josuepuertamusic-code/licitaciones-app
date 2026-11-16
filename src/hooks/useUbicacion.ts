import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { AppState, Linking } from "react-native";
import type { Coordenada } from "@/types";

export type EstadoPermiso = "desconocido" | "concedido" | "denegado" | "bloqueado";

/**
 * Ubicación del dispositivo en primer plano.
 * - Comprueba/solicita el permiso y lo vuelve a comprobar al regresar de Ajustes.
 * - obtenerActual(): una lectura puntual.
 * - iniciar/pausar/reanudar seguimiento con watchPositionAsync.
 * - Libera la suscripción al desmontar y al salir de la pantalla (blur).
 */
export function useUbicacion() {
  const [permiso, setPermiso] = useState<EstadoPermiso>("desconocido");
  const [posicion, setPosicion] = useState<Coordenada | null>(null);
  const [siguiendo, setSiguiendo] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const suscripcion = useRef<Location.LocationSubscription | null>(null);

  const detener = useCallback(() => {
    suscripcion.current?.remove();
    suscripcion.current = null;
  }, []);

  const aplicarPermiso = (r: Location.LocationPermissionResponse): EstadoPermiso => {
    const p: EstadoPermiso = r.granted ? "concedido" : r.canAskAgain ? "denegado" : "bloqueado";
    setPermiso(p);
    return p;
  };

  const revisarPermiso = useCallback(async () => {
    aplicarPermiso(await Location.getForegroundPermissionsAsync());
  }, []);

  useEffect(() => {
    revisarPermiso();
    const sub = AppState.addEventListener("change", (estado) => {
      if (estado === "active") revisarPermiso();
    });
    return () => {
      sub.remove();
      detener();
    };
  }, [revisarPermiso, detener]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        detener();
        setSiguiendo(false);
        setPausado(false);
      };
    }, [detener]),
  );

  const asegurarPermiso = async (): Promise<boolean> => {
    let respuesta = await Location.getForegroundPermissionsAsync();
    if (!respuesta.granted && respuesta.canAskAgain) {
      respuesta = await Location.requestForegroundPermissionsAsync();
    }
    if (aplicarPermiso(respuesta) !== "concedido") {
      setError("Sin permiso de ubicación. Puede seguir usando el resto de la app.");
      return false;
    }
    if (!(await Location.hasServicesEnabledAsync())) {
      setError("El GPS está desactivado. Actívelo en los ajustes del teléfono e intente de nuevo.");
      return false;
    }
    return true;
  };

  const obtenerActual = async (): Promise<Coordenada | null> => {
    setError(null);
    setCargando(true);
    try {
      if (!(await asegurarPermiso())) return null;
      const r = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const p = { latitud: r.coords.latitude, longitud: r.coords.longitude };
      setPosicion(p);
      return p;
    } catch {
      setError("No se pudo obtener la ubicación. Verifique el GPS e intente de nuevo.");
      return null;
    } finally {
      setCargando(false);
    }
  };

  const iniciarSeguimiento = async () => {
    setError(null);
    if (suscripcion.current) return;
    if (!(await asegurarPermiso())) return;
    try {
      suscripcion.current = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.Balanced, distanceInterval: 10, timeInterval: 3000 },
        (r) => setPosicion({ latitud: r.coords.latitude, longitud: r.coords.longitude }),
      );
      setSiguiendo(true);
      setPausado(false);
    } catch {
      setError("No se pudo iniciar el seguimiento.");
    }
  };

  const pausarSeguimiento = () => {
    detener();
    setPausado(true);
  };

  const reanudarSeguimiento = async () => {
    await iniciarSeguimiento();
  };

  const detenerSeguimiento = () => {
    detener();
    setSiguiendo(false);
    setPausado(false);
  };

  const abrirAjustes = () => Linking.openSettings();

  return {
    permiso,
    posicion,
    siguiendo,
    pausado,
    cargando,
    error,
    obtenerActual,
    iniciarSeguimiento,
    pausarSeguimiento,
    reanudarSeguimiento,
    detenerSeguimiento,
    abrirAjustes,
  };
}
