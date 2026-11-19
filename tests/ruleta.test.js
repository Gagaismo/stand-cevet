const test = require("node:test");
const assert = require("node:assert/strict");
const { TEMAS, BANCO } = require("../assets/js/preguntas.js");
const { crearSelector, temaPorAngulo } = require("../assets/js/ruleta.js");

test("hay ocho temas y al menos 12 preguntas por tema", () => {
  assert.deepEqual(TEMAS, ["IA", "Cuántica", "Viaje", "Sistemas", "Internet y redes", "Celulares y apps", "Videojuegos", "Ciberseguridad"]);
  assert.deepEqual(Object.keys(BANCO).sort(), [...TEMAS].sort());
  for (const t of TEMAS) assert.ok(BANCO[t].length >= 12, `pocas preguntas en ${t}: ${BANCO[t].length}`);
});

test("no hay preguntas repetidas en todo el banco", () => {
  const todas = TEMAS.flatMap((t) => BANCO[t].map((p) => p.pregunta.trim().toLowerCase()));
  assert.equal(new Set(todas).size, todas.length);
});

test("cada pregunta tiene una sola respuesta correcta en rango y explicación", () => {
  for (const t of TEMAS) {
    for (const p of BANCO[t]) {
      assert.ok(typeof p.pregunta === "string" && p.pregunta.trim(), "pregunta vacía");
      assert.ok(Array.isArray(p.opciones) && p.opciones.length === 3, "no tiene 3 opciones: " + p.pregunta);
      for (const o of p.opciones) assert.ok(typeof o === "string" && o.trim(), "opción vacía: " + p.pregunta);
      assert.ok(Number.isInteger(p.correcta), p.pregunta);
      assert.ok(p.correcta >= 0 && p.correcta < p.opciones.length, p.pregunta);
      assert.equal(new Set(p.opciones).size, p.opciones.length, "opciones repetidas: " + p.pregunta);
      assert.ok(typeof p.explicacion === "string" && p.explicacion.trim().length > 0, p.pregunta);
    }
  }
});

test("las preguntas de Viaje no mencionan fechas 2027 ni ciudad española", () => {
  const prohibido = /San Sebasti|Donostia|Madrid|Barcelona|Bilbao|País Vasco|marzo de 2027|ExCeL/i;
  for (const p of BANCO.Viaje) {
    const texto = [p.pregunta, ...p.opciones, p.explicacion].join(" ");
    assert.ok(!prohibido.test(texto), texto);
  }
});

test("el selector no repite dentro de un tema hasta agotarlo y después rellena", () => {
  const banco = { A: [{ id: 1 }, { id: 2 }, { id: 3 }], B: [{ id: 9 }] };
  let s = 0.37;
  const rng = () => { s = (s * 9301 + 0.49297) % 1; return s; };
  const sel = crearSelector(banco, rng);
  const ronda1 = [sel.siguiente("A"), sel.siguiente("A"), sel.siguiente("A")].map((p) => p.id);
  assert.deepEqual([...ronda1].sort(), [1, 2, 3]);
  const ronda2 = [sel.siguiente("A"), sel.siguiente("A"), sel.siguiente("A")].map((p) => p.id);
  assert.deepEqual([...ronda2].sort(), [1, 2, 3]);
  assert.equal(sel.siguiente("B").id, 9);
  assert.equal(sel.siguiente("B").id, 9);
});

test("el selector agota el banco real de cada tema sin repetir", () => {
  const sel = crearSelector(BANCO, Math.random);
  for (const t of TEMAS) {
    const vistas = new Set();
    for (let i = 0; i < BANCO[t].length; i++) vistas.add(sel.siguiente(t));
    assert.equal(vistas.size, BANCO[t].length);
  }
});

test("temaPorAngulo mapea la rotación (horaria, en grados) al sector bajo el puntero de arriba", () => {
  assert.equal(temaPorAngulo(0, 4), 0);
  assert.equal(temaPorAngulo(45, 4), 3);
  assert.equal(temaPorAngulo(135, 4), 2);
  assert.equal(temaPorAngulo(225, 4), 1);
  assert.equal(temaPorAngulo(315, 4), 0);
  assert.equal(temaPorAngulo(360 * 5 + 45, 4), 3);
});

test("temaPorAngulo con ocho sectores de 45°", () => {
  assert.equal(temaPorAngulo(0, 8), 0);
  assert.equal(temaPorAngulo(-30, 8), 0);
  assert.equal(temaPorAngulo(-50, 8), 1);
  assert.equal(temaPorAngulo(30, 8), 7);
  assert.equal(temaPorAngulo(180 + 10, 8), 3);
  assert.equal(temaPorAngulo(360 * 5 - 100, 8), 2);
});

test("mezclarOpciones conserva las opciones y mueve la correcta con su texto", () => {
  const { mezclarOpciones } = require("../assets/js/ruleta.js");
  const p = { pregunta: "¿Cuántos bits tiene un byte?", opciones: ["4", "8", "16", "32"], correcta: 1, explicacion: "Un byte son 8 bits." };
  const seq = [0.1, 0.9, 0.5, 0.3, 0.7, 0.2];
  let k = 0;
  const m = mezclarOpciones(p, () => seq[k++ % seq.length]);
  assert.deepEqual([...m.opciones].sort(), [...p.opciones].sort());
  assert.equal(m.opciones[m.correcta], "8");
  assert.equal(m.pregunta, p.pregunta);
  assert.equal(m.explicacion, p.explicacion);
  assert.deepEqual(p.opciones, ["4", "8", "16", "32"], "no modifica la pregunta original");
  assert.equal(p.correcta, 1);
});

test("mezclarOpciones reparte la respuesta correcta entre las tres letras", () => {
  const { mezclarOpciones } = require("../assets/js/ruleta.js");
  const p = { pregunta: "x", opciones: ["a", "b", "c"], correcta: 1, explicacion: "y" };
  const cuentas = [0, 0, 0];
  for (let i = 0; i < 3000; i++) cuentas[mezclarOpciones(p, Math.random).correcta]++;
  for (const c of cuentas) assert.ok(c > 800 && c < 1200, "reparto sesgado: " + cuentas.join(","));
});
