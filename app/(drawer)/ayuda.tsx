import { Linking, ScrollView, Text, View } from "react-native";
import { Boton } from "@/components/Boton";

const PASOS = [
  "Busque un proceso abierto en la pestaña Buscar (use texto y modalidad).",
  "Abra el detalle, revise cuantía, entidad y fechas, y márquelo como favorito si desea seguirlo.",
  "Pulse «Armar cotización»: agregue ítems, ajuste cantidades y porcentajes de utilidad e IVA.",
  "Compare su oferta con el presupuesto oficial y pulse «Registrar postulación».",
  "Haga el seguimiento en la pestaña Postulaciones y presente la oferta oficial en SECOP II.",
];

export default function AyudaScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text className="font-bold text-lg text-ink">Cómo usar Licitaciones Pro</Text>
      {PASOS.map((p, i) => (
        <View key={p} className="flex-row gap-3">
          <Text className="font-bold text-brand">{i + 1}.</Text>
          <Text className="flex-1 font-body text-ink">{p}</Text>
        </View>
      ))}
      <View className="border-t border-line pt-4">
        <Text className="font-semi text-ink">Acerca de</Text>
        <Text className="mt-1 font-body text-sm text-muted">
          Los procesos provienen del conjunto abierto «SECOP II – Procesos de Contratación» de datos.gov.co. La postulación
          registrada en la app es un control interno: la oferta oficial debe presentarse en la plataforma SECOP II. Sus
          datos se guardan solo en este teléfono.
        </Text>
      </View>
      <Boton
        titulo="Abrir SECOP II"
        variante="secundario"
        onPress={() => Linking.openURL("https://community.secop.gov.co/")}
      />
    </ScrollView>
  );
}
