/* Moneda cuántica: simulación de un qubit. Script clásico (funciona desde
   file://). La lógica pura (crearQubit, correrCircuito) se usa desde Node. */
(function (raiz) {
  "use strict";

  var R = Math.SQRT1_2;

  function limpiar(x) {
    return Math.abs(x) < 1e-12 ? 0 : Math.abs(Math.abs(x) - 1) < 1e-12 ? Math.sign(x) : x;
  }

  /* Un qubit con amplitudes reales [a0, a1] (alcanza para H y medición).
     Empieza en |0⟩. Medir colapsa el estado al resultado. */
  function crearQubit(rng) {
    var aleatorio = rng || Math.random;
    var a0 = 1, a1 = 0;
    return {
      hadamard: function () {
        var n0 = R * (a0 + a1), n1 = R * (a0 - a1);
        a0 = limpiar(n0); a1 = limpiar(n1);
      },
      medir: function () {
        var p0 = a0 * a0;
        var r = p0 >= 1 ? 0 : p0 <= 0 ? 1 : (aleatorio() < p0 ? 0 : 1);
        a0 = r === 0 ? 1 : 0;
        a1 = r === 1 ? 1 : 0;
        return r;
      },
      reiniciar: function () { a0 = 1; a1 = 0; },
      amplitudes: function () { return [a0, a1]; }
    };
  }

  /* Corre `veces` corridas nuevas: preparar |0⟩, aplicar las operaciones del
     circuito ("H" o "M" = medición intermedia) y medir al final.
     Devuelve [cantidad de 0, cantidad de 1]. */
  function correrCircuito(ops, veces, rng) {
    var cuentas = [0, 0];
    for (var k = 0; k < veces; k++) {
      var q = crearQubit(rng);
      for (var i = 0; i < ops.length; i++) {
        if (ops[i] === "H") q.hadamard();
        else if (ops[i] === "M") q.medir();
      }
      cuentas[q.medir()]++;
    }
    return cuentas;
  }

  function rngCripto() {
    var u = new Uint32Array(1);
    raiz.crypto.getRandomValues(u);
    return u[0] / 4294967296;
  }

  var api = { crearQubit: crearQubit, correrCircuito: correrCircuito, rngCripto: rngCripto };
  raiz.Cuantica = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;

  /* ---------- Interfaz (solo en el navegador) ---------- */
  if (typeof document === "undefined") return;

  function iniciar() {
    var q = crearQubit(rngCripto);
    var ops = [];
    var cuentas = [0, 0];
    var $ = function (id) { return document.getElementById(id); };

    function nombreEstado() {
      var a = q.amplitudes();
      if (a[1] === 0) return "|0⟩";
      if (a[0] === 0) return a[1] < 0 ? "−|1⟩" : "|1⟩";
      if (Math.abs(a[0] - a[1]) < 1e-9) return a[0] > 0 ? "(|0⟩ + |1⟩)/√2" : "−(|0⟩ + |1⟩)/√2";
      return a[0] > 0 ? "(|0⟩ − |1⟩)/√2" : "(−|0⟩ + |1⟩)/√2";
    }

    function descripcion() {
      var a = q.amplitudes();
      if (a[0] !== 0 && a[1] !== 0) return "Superposición: 50% de chances de medir 0 y 50% de medir 1.";
      return a[1] === 0 ? "Definido: medir da 0 seguro." : "Definido: medir da 1 seguro.";
    }

    function textoCircuito() {
      var partes = ["|0⟩"];
      ops.forEach(function (o) { partes.push(o === "H" ? "H" : "medir"); });
      partes.push("medir");
      return partes.join(" → ");
    }

    function pintar() {
      var a = q.amplitudes();
      $("estado").textContent = nombreEstado();
      $("estado-desc").textContent = descripcion();
      $("prob0").style.setProperty("--p", (a[0] * a[0] * 100).toFixed(1) + "%");
      $("prob1").style.setProperty("--p", (a[1] * a[1] * 100).toFixed(1) + "%");
      $("prob0-txt").textContent = Math.round(a[0] * a[0] * 100) + "%";
      $("prob1-txt").textContent = Math.round(a[1] * a[1] * 100) + "%";
      $("circuito").textContent = textoCircuito();
      var total = cuentas[0] + cuentas[1];
      [0, 1].forEach(function (v) {
        var pct = total ? (cuentas[v] / total) * 100 : 0;
        $("barra" + v).style.setProperty("--h", pct.toFixed(1) + "%");
        $("cuenta" + v).textContent = cuentas[v];
        $("pct" + v).textContent = total ? Math.round(pct) + "%" : "–";
      });
      $("total").textContent = total === 1 ? "1 medición" : total + " mediciones";
    }

    function mostrarResultado(texto) {
      var r = $("resultado");
      r.textContent = texto;
      r.classList.remove("pop");
      void r.offsetWidth;
      r.classList.add("pop");
    }

    $("btn-h").addEventListener("click", function () {
      q.hadamard();
      ops.push("H");
      mostrarResultado("H aplicada");
      pintar();
    });
    $("btn-medir").addEventListener("click", function () {
      var r = q.medir();
      ops.push("M");
      cuentas[r]++;
      mostrarResultado("Salió " + r);
      pintar();
    });
    $("btn-100").addEventListener("click", function () {
      var c = correrCircuito(ops, 100, rngCripto);
      cuentas[0] += c[0];
      cuentas[1] += c[1];
      mostrarResultado(c[0] + " ceros · " + c[1] + " unos");
      pintar();
    });
    $("btn-reiniciar").addEventListener("click", function () {
      q.reiniciar();
      ops = [];
      cuentas = [0, 0];
      mostrarResultado("|0⟩");
      pintar();
    });
    pintar();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})(typeof window !== "undefined" ? window : globalThis);
