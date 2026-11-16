# Licitaciones Pro

App móvil (React Native + TypeScript + Expo) para que una empresa que participa en licitaciones con el Estado colombiano **encuentre procesos abiertos en SECOP II, cotice su oferta y registre/siga sus postulaciones**.

## Requisitos
- Node.js 20+ y npm
- Teléfono Android con **Expo Go** (misma red Wi-Fi que el PC) o un emulador Android con Android Studio

## Instalación y ejecución
```bash
npm install
cp .env.template .env   # en Windows: copy .env.template .env
npx expo start
```
Escanee el QR con Expo Go, o pulse `a` para abrir el emulador Android.

Otros comandos: `npm run typecheck` (TypeScript), `npm test` (lógica: cálculo, validaciones, mapper).

## Configuración (`.env`)
| Variable | Descripción |
|---|---|
| `EXPO_PUBLIC_SECOP_BASE_URL` | Endpoint Socrata de SECOP II en datos.gov.co (por defecto ya funciona, sin clave). |
| `EXPO_PUBLIC_SOCRATA_APP_TOKEN` | Opcional. Token gratuito de https://www.datos.gov.co/profile/edit/developer_settings para menos límites. |

Las variables `EXPO_PUBLIC_*` viajan dentro de la app: **no son secretos**.

## Servicio HTTP
API abierta «SECOP II – Procesos de Contratación» (`p6dx-8zbt`). Listado: `GET ?$where=...&$order=...&$q=texto&$limit=N`. Detalle: `GET ?id_del_proceso=CO1.REQ.xxxx&$limit=1`. Se muestran procesos abiertos de los últimos 120 días en modalidades licitables (licitación pública, mínima cuantía, selección abreviada, concurso de méritos).

## Probar el proceso principal en Android
1. **Buscar**: escriba una palabra (p. ej. «computadores») o elija una modalidad.
2. Abra un proceso (ruta dinámica `/licitacion/[id]`) y pulse **Armar cotización**.
3. Agregue ítems (descripción, costo, cantidad con +/−), ajuste utilidad e IVA y vea el total frente al presupuesto oficial.
4. **Continuar a postulación**: complete el formulario (NIT, contacto, correo, teléfono) y registre.
5. Cierre y reabra la app: la postulación sigue en la pestaña **Postulaciones**.
6. **Mapa**: desde el detalle pulse «Ver en mapa»; use «Centrar en mi ubicación» y el seguimiento (iniciar/pausar/reanudar/detener).
7. Active modo avión e intente registrar: la app avisa y **no** registra.

## Persistencia y límites
- Favoritos, postulaciones, borradores de cotización y perfil de empresa se guardan con Zustand `persist` + AsyncStorage **solo en el teléfono** (no se comparten entre dispositivos; se pierden al desinstalar).
- La «postulación» es un registro interno de seguimiento: la oferta oficial se presenta en SECOP II (hay enlace en el detalle). Antes de registrar, la app consulta de nuevo el proceso para confirmar conexión y vigencia.
- La ubicación de la entidad es aproximada (ciudad o capital del departamento) porque SECOP no publica coordenadas.
- Sin seguimiento en segundo plano ni autenticación.

## Estructura
```
app/                 rutas Expo Router: (drawer)/(tabs)/..., licitacion/[id], cotizacion/[id], postular/[id]
src/components/      Boton, TarjetaLicitacion, ContadorCantidad, CampoTexto, Estado*, MapaLeaflet
src/hooks/           useLicitaciones y useLicitacion (TanStack Query), useCotizacion, useUbicacion, useConexion, useDebounce
src/services/        http.ts (Axios, baseURL), secop.ts (listado/detalle)
src/mappers/         licitacionMapper.ts (DTO externo -> modelo interno)
src/store/           useAppStore.ts (Zustand persistente)
src/types/           interfaces y tipos
src/utils/           cálculo, validación, formato, ubicaciones
tests/               pruebas de lógica
```
Más detalle (matriz de requisitos, reglas de negocio, bitácora y prueba con el cliente) en [docs/INFORME.md](docs/INFORME.md).
