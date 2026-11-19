const test = require("node:test");
const assert = require("node:assert/strict");
const { crearQubit, correrCircuito } = require("../assets/js/cuantica.js");

const fijo = (v) => () => v;
const secuencia = (vals) => { let i = 0; return () => vals[i++ % vals.length]; };

test("|0⟩ sin Hadamard siempre mide 0", () => {
  for (const r of [0, 0.3, 0.5, 0.999999]) {
    const q = crearQubit(fijo(r));
    assert.equal(q.medir(), 0);
  }
});

test("H y medir da los dos resultados según el RNG inyectado", () => {
  const a = crearQubit(fijo(0.1)); a.hadamard();
  const b = crearQubit(fijo(0.9)); b.hadamard();
  assert.equal(a.medir(), 0);
  assert.equal(b.medir(), 1);
});

test("H·H vuelve a |0⟩ (interferencia)", () => {
  const q = crearQubit(fijo(0.999999));
  q.hadamard(); q.hadamard();
  const [a0, a1] = q.amplitudes();
  assert.ok(Math.abs(a0 - 1) < 1e-9);
  assert.ok(Math.abs(a1) < 1e-9);
  assert.equal(q.medir(), 0);
});

test("la medición colapsa: medir de nuevo sin H repite el valor", () => {
  const q = crearQubit(secuencia([0.9, 0.1, 0.2, 0.05]));
  q.hadamard();
  const primero = q.medir();
  assert.equal(primero, 1);
  assert.equal(q.medir(), 1);
  assert.equal(q.medir(), 1);
  q.reiniciar();
  assert.equal(q.medir(), 0);
});

test("correrCircuito hace corridas nuevas desde |0⟩", () => {
  const rng = secuencia([0.1, 0.9]);
  const c = correrCircuito(["H"], 100, rng);
  assert.equal(c[0] + c[1], 100);
  assert.equal(c[0], 50);
  assert.deepEqual(correrCircuito([], 100, rng), [100, 0]);
  assert.deepEqual(correrCircuito(["H", "H"], 100, rng), [100, 0]);
});
