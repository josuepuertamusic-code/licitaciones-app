import assert from "node:assert/strict";
import { test } from "node:test";
import { calcularOferta, limitarCantidad, parsearNumero, validarCostoItem, validarPorcentaje } from "../src/utils/calculo.ts";
import { mapearLista } from "../src/mappers/licitacionMapper.ts";
import { validarPostulacion } from "../src/utils/validacion.ts";
import { ubicarEntidad } from "../src/utils/ubicaciones.ts";

test("parsearNumero acepta formatos y rechaza texto", () => {
  assert.equal(parsearNumero("1500"), 1500);
  assert.equal(parsearNumero("1.500,50"), 1500.5);
  assert.equal(parsearNumero(""), null);
  assert.equal(parsearNumero("abc"), null);
});

test("limitarCantidad respeta mínimo y máximo", () => {
  assert.equal(limitarCantidad(0), 1);
  assert.equal(limitarCantidad(-5), 1);
  assert.equal(limitarCantidad(100000), 9999);
});

test("calcularOferta aplica utilidad e IVA y compara con presupuesto", () => {
  const items = [{ id: "1", descripcion: "x", costoUnitario: 1000, cantidad: 10 }];
  const r = calcularOferta(items, 10, 19, 20000);
  assert.equal(r.subtotal, 10000);
  assert.equal(r.utilidad, 1000);
  assert.equal(Math.round(r.iva), 2090);
  assert.equal(Math.round(r.total), 13090);
  assert.equal(r.superaPresupuesto, false);
  assert.equal(calcularOferta(items, 10, 19, 10000).superaPresupuesto, true);
});

test("calcularOferta evita división por cero con presupuesto 0", () => {
  const r = calcularOferta([], 10, 19, 0);
  assert.equal(r.porcentajeDelPresupuesto, null);
  assert.equal(r.total, 0);
});

test("validaciones de ítem y porcentaje", () => {
  assert.ok(validarCostoItem("", "10").error);
  assert.ok(validarCostoItem("Silla", "").error);
  assert.ok(validarCostoItem("Silla", "abc").error);
  assert.ok(validarCostoItem("Silla", "-5").error);
  assert.equal(validarCostoItem("Silla", "150000").costo, 150000);
  assert.ok(validarPorcentaje("-1", "La utilidad").error);
  assert.ok(validarPorcentaje("101", "La utilidad").error);
  assert.equal(validarPorcentaje("19", "El IVA").valor, 19);
});

test("mapper adapta DTO, deduplica y limpia 'No definido'", () => {
  const lista = mapearLista([
    {
      id_del_proceso: "CO1.REQ.1",
      nombre_del_procedimiento: "Compra de sillas",
      precio_base: "1000000",
      ciudad_entidad: "No Definido",
      duracion: "30",
      unidad_de_duracion: "día(s)",
      urlproceso: { url: "https://community.secop.gov.co/x" },
    },
    { id_del_proceso: "CO1.REQ.1" },
  ]);
  assert.equal(lista.length, 1);
  assert.equal(lista[0].precioBase, 1000000);
  assert.equal(lista[0].ciudad, "");
  assert.equal(lista[0].duracion, "30 día(s)");
  assert.equal(lista[0].url, "https://community.secop.gov.co/x");
});

test("validarPostulacion devuelve mensajes específicos", () => {
  const e = validarPostulacion({ nit: "12", contacto: "", email: "x", telefono: "1", valor: 0 });
  assert.ok(e.nit && e.contacto && e.email && e.telefono && e.valor);
  const ok = validarPostulacion({ nit: "900123456-7", contacto: "Ana Gómez", email: "a@b.co", telefono: "3001234567", valor: 10 });
  assert.deepEqual(ok, {});
});

test("ubicarEntidad por ciudad y por departamento", () => {
  assert.equal(ubicarEntidad("Bogotá", "").aproximada, false);
  assert.equal(ubicarEntidad("Pueblito", "Antioquia")?.aproximada, true);
  assert.equal(ubicarEntidad("", ""), null);
});
