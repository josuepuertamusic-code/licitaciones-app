import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Boton } from "@/components/Boton";
import { CampoTexto } from "@/components/CampoTexto";
import { EstadoVacio } from "@/components/EstadoVacio";
import { hayConexion } from "@/hooks/useConexion";
import { useLicitacion } from "@/hooks/useLicitacion";
import { mensajeDeError } from "@/services/http";
import { obtenerLicitacion } from "@/services/secop";
import { useAppStore } from "@/store/useAppStore";
import { calcularOferta } from "@/utils/calculo";
import { formatearPesos } from "@/utils/formato";
import { type ErroresPostulacion, validarPostulacion } from "@/utils/validacion";

export default function PostularScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { data } = useLicitacion(id);
  const guardada = useAppStore((s) => s.favoritos.find((f) => f.id === id));
  const licitacion = data ?? guardada;
  const empresa = useAppStore((s) => s.empresa);
  const borrador = useAppStore((s) => s.borradores[id]);
  const yaPostulada = useAppStore((s) => s.postulaciones.some((p) => p.licitacion.id === id));
  const registrar = useAppStore((s) => s.registrarPostulacion);

  const [nit, setNit] = useState(empresa.nit);
  const [contacto, setContacto] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [errores, setErrores] = useState<ErroresPostulacion>({});
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  if (!licitacion || !borrador || borrador.items.length === 0) {
    return (
      <EstadoVacio
        icono="alert-circle-outline"
        titulo={yaPostulada ? "Postulación registrada" : "Falta la cotización"}
        detalle={
          yaPostulada
            ? "Este proceso ya tiene una postulación en su historial."
            : "Arme la cotización del proceso antes de registrar la postulación."
        }
      />
    );
  }

  const valor = Math.round(
    calcularOferta(borrador.items, borrador.utilidadPct, borrador.ivaPct, licitacion.precioBase).total,
  );

  const enviar = async () => {
    setErrorEnvio(null);
    const e = validarPostulacion({ nit, contacto, email, telefono, valor });
    setErrores(e);
    if (Object.keys(e).length > 0) return;
    if (yaPostulada) {
      setErrorEnvio("Ya existe una postulación registrada para este proceso.");
      return;
    }
    setEnviando(true);
    try {
      if (!(await hayConexion())) {
        setErrorEnvio("Sin conexión: la postulación NO fue registrada. Conéctese e intente de nuevo.");
        return;
      }
      const vigente = await obtenerLicitacion(licitacion.id);
      if (!vigente) {
        setErrorEnvio("El proceso ya no existe en SECOP; no se registró la postulación.");
        return;
      }
      registrar({
        licitacion: vigente,
        nit: nit.replace(/[.\s-]/g, ""),
        contacto: contacto.trim(),
        email: email.trim(),
        telefono: telefono.replace(/[\s-]/g, ""),
        valorOferta: valor,
        observaciones: observaciones.trim(),
      });
      Alert.alert(
        "Postulación registrada",
        "Quedó guardada en su historial. Recuerde presentar la oferta oficial en SECOP II.",
        [
          {
            text: "Ver postulaciones",
            onPress: () => {
              router.dismissAll();
              router.navigate("/postulaciones");
            },
          },
        ],
        { cancelable: false },
      );
    } catch (err) {
      setErrorEnvio(`${mensajeDeError(err)} La postulación NO fue registrada.`);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1">
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
          <Text numberOfLines={2} className="font-semi text-base text-ink">
            {licitacion.titulo}
          </Text>
          <View className="mb-5 mt-2">
            <Text className="font-body text-[10px] uppercase tracking-widest text-muted">Valor de su oferta</Text>
            <Text className="font-light text-3xl text-ink">{formatearPesos(valor)}</Text>
          </View>
          {errores.valor ? <Text className="mb-2 font-body text-sm text-danger">{errores.valor}</Text> : null}
          <CampoTexto etiqueta="NIT de la empresa" value={nit} onChangeText={setNit} keyboardType="numeric" error={errores.nit} />
          <CampoTexto etiqueta="Nombre del contacto" value={contacto} onChangeText={setContacto} error={errores.contacto} />
          <CampoTexto
            etiqueta="Correo electrónico"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={errores.email}
          />
          <CampoTexto etiqueta="Teléfono" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" error={errores.telefono} />
          <CampoTexto
            etiqueta="Observaciones (opcional)"
            value={observaciones}
            onChangeText={setObservaciones}
            multiline
            style={{ minHeight: 80, textAlignVertical: "top" }}
          />
          {errorEnvio ? <Text className="mb-3 font-body text-sm text-danger">{errorEnvio}</Text> : null}
          <Boton titulo="Registrar postulación" cargando={enviando} onPress={enviar} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
