const test = require("node:test");
const assert = require("node:assert/strict");
const { analizar, bitsCompletos } = require("../assets/js/binario.js");

test('"A" -> 01000001', () => {
  const [f] = analizar("A");
  assert.equal(f.caracter, "A");
  assert.equal(f.codigo, "U+0041");
  assert.deepEqual(f.bytes, [65]);
  assert.deepEqual(f.binario, ["01000001"]);
  assert.equal(bitsCompletos("A"), "01000001");
});

test('"ñ" -> [195,177] -> 11000011 10110001', () => {
  const [f] = analizar("ñ");
  assert.equal(f.codigo, "U+00F1");
  assert.deepEqual(f.bytes, [195, 177]);
  assert.equal(bitsCompletos("ñ"), "11000011 10110001");
});

test("á y emoji usan UTF-8 correcto y un emoji es un solo carácter", () => {
  assert.deepEqual(analizar("á")[0].bytes, [195, 161]);
  const filas = analizar("😀");
  assert.equal(filas.length, 1);
  assert.equal(filas[0].codigo, "U+1F600");
  assert.deepEqual(filas[0].bytes, [240, 159, 152, 128]);
});

test("texto vacío no da filas", () => {
  assert.deepEqual(analizar(""), []);
  assert.equal(bitsCompletos(""), "");
});
