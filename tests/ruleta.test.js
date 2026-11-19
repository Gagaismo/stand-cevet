const test = require("node:test");
const assert = require("node:assert/strict");
const { TEMAS, BANCO } = require("../assets/js/preguntas.js");
const { crearSelector, temaPorAngulo } = require("../assets/js/ruleta.js");

test("hay cuatro temas: IA, Cuántica, Viaje, Sistemas", () => {
  assert.deepEqual(TEMAS, ["IA", "Cuántica", "Viaje", "Sistemas"]);
  for (const t of TEMAS) assert.ok(BANCO[t].length >= 6, `pocas preguntas en ${t}`);
});

test("cada pregunta tiene una sola respuesta correcta en rango y explicación", () => {
  for (const t of TEMAS) {
    for (const p of BANCO[t]) {
      assert.ok(typeof p.pregunta === "string" && p.pregunta.trim(), "pregunta vacía");
      assert.ok(Array.isArray(p.opciones) && p.opciones.length >= 3 && p.opciones.length <= 4, p.pregunta);
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
