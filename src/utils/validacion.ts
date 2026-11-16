export interface ErroresPostulacion {
  nit?: string;
  contacto?: string;
  email?: string;
  telefono?: string;
  valor?: string;
}

export function validarPostulacion(datos: {
  nit: string;
  contacto: string;
  email: string;
  telefono: string;
  valor: number | null;
}): ErroresPostulacion {
  const e: ErroresPostulacion = {};
  const nit = datos.nit.replace(/[.\s-]/g, "");
  if (!nit) e.nit = "Ingrese el NIT de la empresa.";
  else if (!/^\d{8,10}$/.test(nit)) e.nit = "El NIT debe tener entre 8 y 10 dígitos (con dígito de verificación).";

  if (!datos.contacto.trim()) e.contacto = "Ingrese el nombre del contacto.";
  else if (datos.contacto.trim().length < 3) e.contacto = "El nombre debe tener al menos 3 caracteres.";

  if (!datos.email.trim()) e.email = "Ingrese el correo electrónico.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(datos.email.trim())) e.email = "El correo no tiene un formato válido.";

  const tel = datos.telefono.replace(/[\s-]/g, "");
  if (!tel) e.telefono = "Ingrese el teléfono de contacto.";
  else if (!/^\d{7,10}$/.test(tel)) e.telefono = "El teléfono debe tener entre 7 y 10 dígitos.";

  if (datos.valor === null || datos.valor <= 0) {
    e.valor = "La oferta debe tener un valor mayor que cero; arme la cotización primero.";
  }
  return e;
}
