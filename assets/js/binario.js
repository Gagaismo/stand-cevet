/* Tu nombre en binario. Script clásico (funciona desde file://).
   La lógica pura (analizar, bitsCompletos) se usa desde Node. */
(function (raiz) {
  "use strict";

  var codificador = new TextEncoder();

  function aBinario(byte) {
    return ("00000000" + byte.toString(2)).slice(-8);
  }

  /* Una fila por carácter (por punto de código, así un emoji es uno solo):
     carácter, código Unicode, bytes UTF-8 en decimal y en binario. */
  function analizar(texto) {
    return Array.from(texto || "").map(function (c) {
      var cp = c.codePointAt(0);
      var hex = cp.toString(16).toUpperCase();
      while (hex.length < 4) hex = "0" + hex;
      var bytes = Array.from(codificador.encode(c));
      return { caracter: c, codigo: "U+" + hex, decimal: cp, bytes: bytes, binario: bytes.map(aBinario) };
    });
  }

  function bitsCompletos(texto) {
    return Array.from(codificador.encode(texto || "")).map(aBinario).join(" ");
  }

  var api = { analizar: analizar, bitsCompletos: bitsCompletos };
  raiz.Binario = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;

  /* ---------- Interfaz (solo en el navegador) ---------- */
  if (typeof document === "undefined") return;

  function iniciar() {
    var entrada = document.getElementById("nombre");
    var cuerpo = document.getElementById("tabla-cuerpo");
    var bits = document.getElementById("bits");
    var resumen = document.getElementById("resumen");

    function celda(fila, texto, clase) {
      var td = document.createElement("td");
      td.textContent = texto;
      if (clase) td.className = clase;
      fila.appendChild(td);
    }

    function pintar() {
      var texto = entrada.value;
      var filas = analizar(texto);
      cuerpo.innerHTML = "";
      filas.forEach(function (f) {
        var tr = document.createElement("tr");
        celda(tr, f.caracter === " " ? "␣" : f.caracter, "col-car");
        celda(tr, f.codigo + " (" + f.decimal + ")", "col-cod");
        celda(tr, f.bytes.join(" "), "col-dec");
        var td = document.createElement("td");
        td.className = "col-bin";
        f.binario.forEach(function (b) {
          var s = document.createElement("span");
          s.className = "byte";
          b.split("").forEach(function (bit) {
            var x = document.createElement("span");
            x.className = bit === "1" ? "bit uno" : "bit cero";
            x.textContent = bit;
            s.appendChild(x);
          });
          td.appendChild(s);
        });
        tr.appendChild(td);
        cuerpo.appendChild(tr);
      });
      var cadena = bitsCompletos(texto);
      bits.textContent = cadena || "Escribí algo y mirá cómo aparecen los ceros y unos.";
      var nBytes = cadena ? cadena.split(" ").length : 0;
      resumen.textContent = filas.length + (filas.length === 1 ? " carácter · " : " caracteres · ") +
        nBytes + (nBytes === 1 ? " byte · " : " bytes · ") + nBytes * 8 + " bits";
    }

    entrada.addEventListener("input", pintar);
    pintar();
    entrada.focus();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})(typeof window !== "undefined" ? window : globalThis);
