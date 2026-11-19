/* Ruleta de temas + pregunta. Script clásico (funciona desde file://).
   La lógica pura (crearSelector, temaPorAngulo) se puede usar desde Node. */
(function (raiz) {
  "use strict";

  /* Devuelve un selector que no repite preguntas de un tema hasta agotarlo;
     cuando se agota, vuelve a mezclar todas. rng() devuelve [0, 1). */
  function crearSelector(banco, rng) {
    var aleatorio = rng || Math.random;
    var mazos = {};

    function mezclar(lista) {
      var copia = lista.slice();
      for (var i = copia.length - 1; i > 0; i--) {
        var j = Math.floor(aleatorio() * (i + 1));
        var tmp = copia[i];
        copia[i] = copia[j];
        copia[j] = tmp;
      }
      return copia;
    }

    return {
      siguiente: function (tema) {
        var lista = banco[tema];
        if (!lista || !lista.length) throw new Error("Tema sin preguntas: " + tema);
        if (!mazos[tema] || mazos[tema].length === 0) mazos[tema] = mezclar(lista);
        return mazos[tema].pop();
      },
      restantes: function (tema) {
        return mazos[tema] ? mazos[tema].length : banco[tema].length;
      }
    };
  }

  /* La rueda dibuja el sector i entre i*360/n y (i+1)*360/n grados, en sentido
     horario desde arriba. Si la rueda gira `rotacion` grados en sentido horario,
     el puntero de arriba queda sobre el ángulo (-rotacion) de la rueda. */
  function temaPorAngulo(rotacion, n) {
    var a = ((-rotacion % 360) + 360) % 360;
    return Math.floor(a / (360 / n)) % n;
  }

  function rngCripto() {
    if (raiz.crypto && raiz.crypto.getRandomValues) {
      var u = new Uint32Array(1);
      raiz.crypto.getRandomValues(u);
      return u[0] / 4294967296;
    }
    return Math.random();
  }

  var api = { crearSelector: crearSelector, temaPorAngulo: temaPorAngulo, rngCripto: rngCripto };
  raiz.Ruleta = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;

  /* ---------- Interfaz (solo en el navegador) ---------- */
  if (typeof document === "undefined") return;

  var SVG = "http://www.w3.org/2000/svg";
  var LETRAS = ["A", "B", "C", "D"];
  var ICONOS = { IA: "🤖", "Cuántica": "⚛️", Viaje: "✈️", Sistemas: "💻" };

  function iniciar() {
    var datos = raiz.PREGUNTAS;
    var temas = datos.TEMAS;
    var n = temas.length;
    var selector = crearSelector(datos.BANCO, rngCripto);

    var rueda = document.getElementById("rueda");
    var botonGirar = document.getElementById("girar");
    var tarjeta = document.getElementById("tarjeta");
    var reducir = raiz.matchMedia && raiz.matchMedia("(prefers-reduced-motion: reduce)");
    var rotacion = 0;
    var girando = false;

    dibujarRueda(rueda, temas);

    function polar(r, grados) {
      var rad = (grados - 90) * Math.PI / 180;
      return [200 + r * Math.cos(rad), 200 + r * Math.sin(rad)];
    }

    function dibujarRueda(svg, lista) {
      var paso = 360 / lista.length;
      var g = document.createElementNS(SVG, "g");
      g.setAttribute("id", "rueda-giro");
      lista.forEach(function (tema, i) {
        var a0 = i * paso, a1 = (i + 1) * paso;
        var p0 = polar(190, a0), p1 = polar(190, a1);
        var sector = document.createElementNS(SVG, "path");
        sector.setAttribute("d", "M200,200 L" + p0[0] + "," + p0[1] +
          " A190,190 0 " + (paso > 180 ? 1 : 0) + ",1 " + p1[0] + "," + p1[1] + " Z");
        sector.setAttribute("class", "sector sector-" + (i % 2 === 0 ? "amarillo" : "tinta"));
        g.appendChild(sector);

        var medio = a0 + paso / 2;
        var pt = polar(118, medio);
        var texto = document.createElementNS(SVG, "text");
        texto.setAttribute("x", pt[0]);
        texto.setAttribute("y", pt[1]);
        texto.setAttribute("transform", "rotate(" + medio + " " + pt[0] + " " + pt[1] + ")");
        texto.setAttribute("class", "sector-texto " + (i % 2 === 0 ? "sobre-amarillo" : "sobre-tinta"));
        texto.setAttribute("text-anchor", "middle");
        texto.setAttribute("dominant-baseline", "middle");
        var icono = document.createElementNS(SVG, "tspan");
        icono.setAttribute("x", pt[0]);
        icono.setAttribute("dy", "-0.7em");
        icono.textContent = ICONOS[tema] || "";
        var nombre = document.createElementNS(SVG, "tspan");
        nombre.setAttribute("x", pt[0]);
        nombre.setAttribute("dy", "1.4em");
        nombre.textContent = tema;
        texto.appendChild(icono);
        texto.appendChild(nombre);
        g.appendChild(texto);
      });
      var borde = document.createElementNS(SVG, "circle");
      borde.setAttribute("cx", 200); borde.setAttribute("cy", 200); borde.setAttribute("r", 190);
      borde.setAttribute("class", "rueda-borde");
      g.appendChild(borde);
      var centro = document.createElementNS(SVG, "circle");
      centro.setAttribute("cx", 200); centro.setAttribute("cy", 200); centro.setAttribute("r", 26);
      centro.setAttribute("class", "rueda-centro");
      svg.appendChild(g);
      svg.appendChild(centro);
    }

    var giro = document.getElementById("rueda-giro");

    function girar() {
      if (girando) return;
      girando = true;
      botonGirar.disabled = true;
      var paso = 360 / n;
      var destino = Math.floor(rngCripto() * n);
      /* Ángulo de la rueda que debe quedar bajo el puntero: dentro del sector
         destino, lejos de los bordes. */
      var dentro = destino * paso + paso * (0.15 + 0.7 * rngCripto());
      var actual = ((rotacion % 360) + 360) % 360;
      var objetivo = (360 - dentro) % 360;
      var delta = ((objetivo - actual) + 360) % 360;
      rotacion += 360 * 5 + delta;

      tarjeta.innerHTML = '<p class="tarjeta-espera">Girando…</p>';
      var instantaneo = reducir && reducir.matches;
      giro.style.transition = instantaneo ? "none" : "transform 3s cubic-bezier(0.17, 0.67, 0.21, 1)";
      giro.style.transform = "rotate(" + rotacion + "deg)";

      setTimeout(function () {
        girando = false;
        botonGirar.disabled = false;
        var tema = temas[temaPorAngulo(rotacion, n)];
        mostrarPregunta(tema, selector.siguiente(tema));
      }, instantaneo ? 0 : 3100);
    }

    function mostrarPregunta(tema, p) {
      tarjeta.innerHTML = "";
      var etiqueta = document.createElement("p");
      etiqueta.className = "tarjeta-tema";
      etiqueta.textContent = (ICONOS[tema] || "") + " " + tema;
      var titulo = document.createElement("h2");
      titulo.className = "tarjeta-pregunta";
      titulo.textContent = p.pregunta;
      var lista = document.createElement("ol");
      lista.className = "opciones";
      var resultado = document.createElement("div");
      resultado.className = "resultado";
      resultado.setAttribute("aria-live", "polite");

      var botones = p.opciones.map(function (texto, i) {
        var li = document.createElement("li");
        var b = document.createElement("button");
        b.type = "button";
        b.className = "opcion";
        b.innerHTML = '<span class="opcion-letra"></span><span class="opcion-texto"></span>';
        b.firstChild.textContent = LETRAS[i];
        b.lastChild.textContent = texto;
        b.addEventListener("click", function () { responder(i); });
        li.appendChild(b);
        lista.appendChild(li);
        return b;
      });

      function responder(i) {
        botones.forEach(function (b, j) {
          b.disabled = true;
          if (j === p.correcta) b.classList.add("correcta");
          else if (j === i) b.classList.add("incorrecta");
        });
        var acierto = i === p.correcta;
        var html = acierto
          ? '<p class="resultado-titulo gano">¡Ganaste un caramelo! 🍬</p>'
          : '<p class="resultado-titulo">Casi… era la ' + LETRAS[p.correcta] + "</p>";
        resultado.innerHTML = html + '<p class="explicacion"></p>';
        resultado.lastChild.textContent = p.explicacion;
        botonGirar.focus();
      }

      tarjeta.appendChild(etiqueta);
      tarjeta.appendChild(titulo);
      tarjeta.appendChild(lista);
      tarjeta.appendChild(resultado);
      botonGirar.textContent = "Girar de nuevo";
    }

    botonGirar.addEventListener("click", girar);
    document.addEventListener("keydown", function (e) {
      if (e.key !== " " && e.key !== "Enter") return;
      var t = e.target;
      if (t && t.closest && t.closest("button, a, input, textarea, select")) return;
      e.preventDefault();
      girar();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})(typeof window !== "undefined" ? window : globalThis);
