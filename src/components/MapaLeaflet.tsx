import { useEffect, useMemo, useRef, useState, type ComponentType, type Ref } from "react";
import { Text, View } from "react-native";
import { WebView, type WebViewMessageEvent, type WebViewProps } from "react-native-webview";
import { Boton } from "@/components/Boton";
import type { Coordenada } from "@/types";

interface WebViewHandle {
  injectJavaScript: (script: string) => void;
}

// Los tipos publicados de react-native-webview chocan con los de React 19 al usar ref/key.
const Web = WebView as unknown as ComponentType<WebViewProps & { ref?: Ref<WebViewHandle> }>;

export interface PuntoMapa {
  punto: Coordenada;
  etiqueta: string;
}

interface Props {
  oficina: PuntoMapa;
  entidad: PuntoMapa | null;
  usuario: Coordenada | null;
  /** Cambia cada vez que se pide centrar el mapa en el usuario. */
  centrarUsuario: number;
}

const HTML = `<!DOCTYPE html><html><head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<style>html,body,#mapa{height:100%;margin:0;padding:0}</style>
</head><body><div id="mapa"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
function enviar(t){window.ReactNativeWebView.postMessage(t)}
if(typeof L==='undefined'){enviar('error')}else{
var mapa=L.map('mapa').setView([4.6,-74.1],6);
var capa=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap'}).addTo(mapa);
var avisado=false;capa.on('tileerror',function(){if(!avisado){avisado=true;enviar('tiles')}});
var marcadores={};
function poner(k,p,txt,color){
 if(marcadores[k]){mapa.removeLayer(marcadores[k]);delete marcadores[k]}
 if(!p)return;
 marcadores[k]=L.circleMarker([p.latitud,p.longitud],{radius:9,color:'#fff',weight:2,fillColor:color,fillOpacity:1}).addTo(mapa).bindPopup(txt);
}
window.actualizar=function(d){
 poner('oficina',d.oficina&&d.oficina.punto,d.oficina&&d.oficina.etiqueta, '#14181F');
  poner('entidad',d.entidad&&d.entidad.punto,d.entidad&&d.entidad.etiqueta,'#9A7B4F');
  poner('usuario',d.usuario,'Su ubicación actual','#3F6B4F');
 if(d.ajustar){var pts=[];['oficina','entidad'].forEach(function(k){if(d[k])pts.push([d[k].punto.latitud,d[k].punto.longitud])});
  if(pts.length>1)mapa.fitBounds(pts,{padding:[40,40]});else if(pts.length===1)mapa.setView(pts[0],12)}
 if(d.centrar&&d.usuario)mapa.setView([d.usuario.latitud,d.usuario.longitud],15);
};
enviar('listo');
}
</script></body></html>`;

export function MapaLeaflet({ oficina, entidad, usuario, centrarUsuario }: Props) {
  const ref = useRef<WebViewHandle>(null);
  const [listo, setListo] = useState(false);
  const [fallo, setFallo] = useState<string | null>(null);
  const [recarga, setRecarga] = useState(0);
  const ultimoCentrado = useRef(0);
  const ajustado = useRef("");

  const clave = useMemo(
    () => `${oficina.punto.latitud},${oficina.punto.longitud}|${entidad?.punto.latitud},${entidad?.punto.longitud}`,
    [oficina, entidad],
  );

  useEffect(() => {
    if (!listo) return;
    const centrar = centrarUsuario !== ultimoCentrado.current;
    ultimoCentrado.current = centrarUsuario;
    const ajustar = ajustado.current !== clave;
    ajustado.current = clave;
    ref.current?.injectJavaScript(
      `window.actualizar(${JSON.stringify({ oficina, entidad, usuario, centrar, ajustar })});true;`,
    );
  }, [listo, oficina, entidad, usuario, centrarUsuario, clave]);

  const alMensaje = (e: WebViewMessageEvent) => {
    const m = e.nativeEvent.data;
    if (m === "listo") setListo(true);
    else if (m === "error") setFallo("No se pudo cargar la librería del mapa. Verifique su conexión.");
    else if (m === "tiles") setFallo("Algunas zonas del mapa no se pudieron descargar. Verifique su conexión.");
  };

  const reintentar = () => {
    setFallo(null);
    setListo(false);
    ajustado.current = "";
    setRecarga((n) => n + 1);
  };

  return (
    <View className="flex-1 overflow-hidden rounded-md border border-line bg-surface">
      <Web
        key={recarga}
        ref={ref}
        originWhitelist={["*"]}
        source={{ html: HTML, baseUrl: "https://localhost" }}
        javaScriptEnabled
        onMessage={alMensaje}
        onError={() => setFallo("No se pudo cargar el mapa. Verifique su conexión.")}
        onHttpError={() => setFallo("El mapa respondió con un error. Intente de nuevo.")}
      />
      {fallo ? (
        <View className="absolute inset-x-0 bottom-0 gap-2 bg-white/95 p-3">
          <Text className="font-body text-sm text-danger">{fallo}</Text>
          <Boton titulo="Reintentar mapa" variante="secundario" onPress={reintentar} />
        </View>
      ) : null}
    </View>
  );
}
