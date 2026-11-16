import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Boton } from "@/components/Boton";
import { CampoTexto } from "@/components/CampoTexto";
import { ContadorCantidad } from "@/components/ContadorCantidad";
import { EstadoCarga } from "@/components/EstadoCarga";
import { EstadoError } from "@/components/EstadoError";
import { EstadoVacio } from "@/components/EstadoVacio";
import { useCotizacion } from "@/hooks/useCotizacion";
import { useLicitacion } from "@/hooks/useLicitacion";
import { mensajeDeError } from "@/services/http";
import { useAppStore } from "@/store/useAppStore";
import { formatearPesos } from "@/utils/formato";

function Fila({ etiqueta, valor, fuerte }: { etiqueta: string; valor: string; fuerte?: boolean }) {
  return (
    <View className="flex-row justify-between py-1">
      <Text className={`font-body ${fuerte ? "font-bold text-ink" : "text-muted"}`}>{etiqueta}</Text>
      <Text className={fuerte ? "font-bold text-lg text-brand" : "font-body text-ink"}>{valor}</Text>
    </View>
  );
}

function Editor({ id, precioBase }: { id: string; precioBase: number }) {
  const router = useRouter();
  const c = useCotizacion(id, precioBase);
  const { resultado: r } = c;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
      <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
        <Text className="mb-2 font-bold text-lg text-ink">Ítems de la oferta</Text>
        {c.borrador.items.length === 0 ? (
          <EstadoVacio icono="cart-outline" titulo="Sin ítems" detalle="Agregue los bienes o servicios que ofertará." />
        ) : (
          c.borrador.items.map((i) => (
            <View key={i.id} className="border-b border-line py-3">
              <View className="flex-row items-start justify-between gap-2">
                <Text className="flex-1 font-semi text-ink">{i.descripcion}</Text>
                <Pressable accessibilityLabel={`Quitar ${i.descripcion}`} hitSlop={10} onPress={() => c.quitarItem(i.id)}>
                  <Ionicons name="trash-outline" size={20} color="#A63D3D" />
                </Pressable>
              </View>
              <Text className="font-body text-sm text-muted">{formatearPesos(i.costoUnitario)} c/u</Text>
              <View className="mt-2 flex-row items-center justify-between">
                <ContadorCantidad valor={i.cantidad} onCambiar={(n) => c.cambiarCantidad(i.id, n)} />
                <Text className="font-bold text-brand">{formatearPesos(i.costoUnitario * i.cantidad)}</Text>
              </View>
            </View>
          ))
        )}

        <View className="mb-6 mt-4 border-t border-line pt-4">
          <Text className="mb-2 font-semi text-ink">Nuevo ítem</Text>
          <CampoTexto etiqueta="Descripción" value={c.campos.descripcion} onChangeText={c.setDescripcion} />
          <CampoTexto
            etiqueta="Costo unitario (COP)"
            value={c.campos.costo}
            onChangeText={c.setCosto}
            keyboardType="numeric"
            placeholder="150000"
            error={c.errorItem}
          />
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="font-semi text-sm text-ink">Cantidad</Text>
            <ContadorCantidad valor={c.campos.cantidad} onCambiar={c.setCantidad} />
          </View>
          <Boton titulo="Agregar ítem" variante="secundario" onPress={c.agregarItem} />
        </View>

        <View className="mb-6">
          <Text className="mb-2 font-semi text-ink">Utilidad e IVA</Text>
          <View className="flex-row gap-3">
            <View className="flex-1">
              <CampoTexto etiqueta="Utilidad %" value={c.campos.utilidadTexto} onChangeText={c.setUtilidadTexto} keyboardType="numeric" />
            </View>
            <View className="flex-1">
              <CampoTexto etiqueta="IVA %" value={c.campos.ivaTexto} onChangeText={c.setIvaTexto} keyboardType="numeric" />
            </View>
          </View>
          {c.errorPorcentaje ? <Text className="mb-2 font-body text-sm text-danger">{c.errorPorcentaje}</Text> : null}
          <Boton titulo="Aplicar porcentajes" variante="secundario" onPress={c.aplicarPorcentajes} />
        </View>

        <View className="mb-6 border-t border-brand pt-3">
          <Fila etiqueta="Subtotal" valor={formatearPesos(r.subtotal)} />
          <Fila etiqueta={`Utilidad (${c.borrador.utilidadPct} %)`} valor={formatearPesos(r.utilidad)} />
          <Fila etiqueta={`IVA (${c.borrador.ivaPct} %)`} valor={formatearPesos(r.iva)} />
          <Fila etiqueta="Total de la oferta" valor={formatearPesos(r.total)} fuerte />
          {r.porcentajeDelPresupuesto !== null ? (
            <Text className={`mt-2 font-body text-sm ${r.superaPresupuesto ? "text-danger" : "text-ok"}`}>
              {r.superaPresupuesto
                ? `Su oferta supera el presupuesto oficial (${r.porcentajeDelPresupuesto.toFixed(1)} %). Podría ser rechazada.`
                : `Su oferta equivale al ${r.porcentajeDelPresupuesto.toFixed(1)} % del presupuesto oficial.`}
            </Text>
          ) : (
            <Text className="mt-2 font-body text-sm text-muted">El proceso no informa presupuesto para comparar.</Text>
          )}
        </View>

        <Boton
          titulo="Continuar a postulación"
          deshabilitado={c.borrador.items.length === 0}
          onPress={() => router.push({ pathname: "/postular/[id]", params: { id } })}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function CotizacionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError, error, refetch } = useLicitacion(id);
  const guardada = useAppStore((s) => s.favoritos.find((f) => f.id === id));
  const l = data ?? guardada;

  return (
    <SafeAreaView edges={["bottom"]} className="flex-1">
      {isLoading ? (
        <EstadoCarga />
      ) : l ? (
        <Editor id={l.id} precioBase={l.precioBase} />
      ) : isError ? (
        <EstadoError mensaje={mensajeDeError(error)} onReintentar={() => refetch()} />
      ) : (
        <EstadoVacio icono="alert-circle-outline" titulo="Proceso no encontrado" detalle={`No existe el proceso «${id}».`} />
      )}
    </SafeAreaView>
  );
}
