import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text } from "react-native";
import { Boton } from "@/components/Boton";
import { CampoTexto } from "@/components/CampoTexto";
import { useUbicacion } from "@/hooks/useUbicacion";
import { useAppStore } from "@/store/useAppStore";
import { parsearNumero } from "@/utils/calculo";

export default function EmpresaScreen() {
  const empresa = useAppStore((s) => s.empresa);
  const guardar = useAppStore((s) => s.guardarEmpresa);
  const ubicacion = useUbicacion();
  const [nombre, setNombre] = useState(empresa.nombre);
  const [nit, setNit] = useState(empresa.nit);
  const [ciudad, setCiudad] = useState(empresa.ciudad);
  const [lat, setLat] = useState(String(empresa.latitud));
  const [lon, setLon] = useState(String(empresa.longitud));
  const [errores, setErrores] = useState<Record<string, string>>({});

  const usarUbicacionActual = async () => {
    const punto = await ubicacion.obtenerActual();
    if (!punto) return;
    setLat(punto.latitud.toFixed(6));
    setLon(punto.longitud.toFixed(6));
    setErrores((actuales) => ({ ...actuales, lat: "", lon: "" }));
  };

  const enviar = () => {
    const e: Record<string, string> = {};
    if (nombre.trim().length < 3) e.nombre = "Ingrese el nombre de la empresa.";
    const nitLimpio = nit.replace(/[.\s-]/g, "");
    if (nitLimpio && !/^\d{8,10}$/.test(nitLimpio)) e.nit = "El NIT debe tener entre 8 y 10 dígitos.";
    const la = parsearNumero(lat);
    const lo = parsearNumero(lon);
    if (la === null || la < -90 || la > 90) e.lat = "Latitud inválida (entre -90 y 90).";
    if (lo === null || lo < -180 || lo > 180) e.lon = "Longitud inválida (entre -180 y 180).";
    setErrores(e);
    if (Object.keys(e).length > 0 || la === null || lo === null) return;
    guardar({ nombre: nombre.trim(), nit: nitLimpio, ciudad: ciudad.trim(), latitud: la, longitud: lo });
    Alert.alert("Perfil guardado", "Los datos se usarán en el mapa y al registrar postulaciones.");
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
      <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <Text className="mb-4 font-body text-sm text-muted">
          Estos datos se guardan en este teléfono. La ubicación de la oficina aparece en el mapa.
        </Text>
        <CampoTexto etiqueta="Nombre de la empresa" value={nombre} onChangeText={setNombre} error={errores.nombre} />
        <CampoTexto etiqueta="NIT" value={nit} onChangeText={setNit} keyboardType="numeric" error={errores.nit} />
        <CampoTexto etiqueta="Ciudad" value={ciudad} onChangeText={setCiudad} />
        <Text className="mb-2 font-body text-sm text-muted">
          Puede completar las coordenadas de la oficina con la ubicación actual del dispositivo.
        </Text>
        <Boton
          titulo="Usar ubicación actual"
          variante="secundario"
          cargando={ubicacion.cargando}
          onPress={usarUbicacionActual}
        />
        {ubicacion.error ? <Text className="mb-3 mt-2 font-body text-sm text-danger">{ubicacion.error}</Text> : null}
        {ubicacion.permiso === "bloqueado" ? (
          <Boton titulo="Abrir ajustes de la app" variante="secundario" onPress={ubicacion.abrirAjustes} />
        ) : null}
        <CampoTexto etiqueta="Latitud de la oficina" value={lat} onChangeText={setLat} keyboardType="numbers-and-punctuation" error={errores.lat} />
        <CampoTexto etiqueta="Longitud de la oficina" value={lon} onChangeText={setLon} keyboardType="numbers-and-punctuation" error={errores.lon} />
        <Text className="mb-3 font-body text-xs text-muted">
          Después de obtener la ubicación, pulse «Guardar perfil» para conservarla.
        </Text>
        <Boton titulo="Guardar perfil" onPress={enviar} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
