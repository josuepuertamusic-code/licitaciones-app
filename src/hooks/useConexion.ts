import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

export async function hayConexion(): Promise<boolean> {
  const estado = await NetInfo.fetch();
  return estado.isConnected !== false && estado.isInternetReachable !== false;
}

export function useConexion(): boolean {
  const [conectado, setConectado] = useState(true);
  useEffect(() => {
    const cancelar = NetInfo.addEventListener((e) => {
      setConectado(e.isConnected !== false && e.isInternetReachable !== false);
    });
    return cancelar;
  }, []);
  return conectado;
}
