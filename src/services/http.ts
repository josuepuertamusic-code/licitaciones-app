import axios from "axios";

export const SECOP_BASE_URL =
  process.env.EXPO_PUBLIC_SECOP_BASE_URL ?? "https://www.datos.gov.co/resource/p6dx-8zbt.json";

const appToken = process.env.EXPO_PUBLIC_SOCRATA_APP_TOKEN;

export const http = axios.create({
  baseURL: SECOP_BASE_URL,
  timeout: 15000,
  headers: appToken ? { "X-App-Token": appToken } : undefined,
});

export function mensajeDeError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return "No hay conexión con el servicio de SECOP. Revise su internet.";
    if (error.response.status === 429) return "Demasiadas consultas. Espere un momento e intente de nuevo.";
    return `El servicio respondió con un error (${error.response.status}).`;
  }
  return error instanceof Error ? error.message : "Ocurrió un error inesperado.";
}
