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

  /* Devuelve una copia de la pregunta con las opciones en orden aleatorio y
     `correcta` apuntando a la misma respuesta; así la correcta no cae casi
     siempre en la misma letra. No modifica la pregunta original. */
  function mezclarOpciones(p, rng) {
    var aleatorio = rng || Math.random;
    var orden = p.opciones.map(function (_, i) { return i; });
    for (var i = orden.length - 1; i > 0; i--) {
      var j = Math.floor(aleatorio() * (i + 1));
      var tmp = orden[i]; orden[i] = orden[j]; orden[j] = tmp;
    }
    return {
      pregunta: p.pregunta,
      opciones: orden.map(function (k) { return p.opciones[k]; }),
      correcta: orden.indexOf(p.correcta),
      explicacion: p.explicacion
    };
  }

  function rngCripto() {
    if (raiz.crypto && raiz.crypto.getRandomValues) {
      var u = new Uint32Array(1);
      raiz.crypto.getRandomValues(u);
      return u[0] / 4294967296;
    }
    return Math.random();
  }

  var api = { crearSelector: crearSelector, temaPorAngulo: temaPorAngulo, mezclarOpciones: mezclarOpciones, rngCripto: rngCripto };
  raiz.Ruleta = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;

  /* ---------- Interfaz (solo en el navegador) ---------- */
  if (typeof document === "undefined") return;

  var SVG = "http://www.w3.org/2000/svg";
  var LETRAS = ["A", "B", "C", "D"];
  var ICONOS = {
    IA: "🤖", "Cuántica": "⚛️", Viaje: "✈️", Sistemas: "💻",
    "Internet y redes": "🌐", "Celulares y apps": "📱", Videojuegos: "🎮", Ciberseguridad: "🔒"
  };
  /* Cómo se escribe cada tema en la rueda (una o dos líneas, a lo largo del radio). */
  var RENGLONES = {
    "Internet y redes": ["Internet", "y redes"],
    "Celulares y apps": ["Celulares", "y apps"],
  };
  /* Largo máximo de un renglón a lo largo del radio (unidades del SVG): si una
     palabra larga no entra, se achica la letra en vez de cortarla con guion. */
  var LARGO_MAX = 132;
  var COLORES = ["amarillo", "tinta", "blanco", "gris"];
  var TEXTO_SOBRE = { amarillo: "sobre-claro", tinta: "sobre-tinta", blanco: "sobre-claro", gris: "sobre-claro" };

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
        var color = COLORES[i % COLORES.length];
        sector.setAttribute("class", "sector sector-" + color);
        g.appendChild(sector);

        /* El texto va a lo largo del radio, de adentro hacia afuera, para que
           entren los ocho temas con letra grande. */
        var medio = a0 + paso / 2;
        var pt = polar(112, medio);
        var texto = document.createElementNS(SVG, "text");
        texto.setAttribute("x", pt[0]);
        texto.setAttribute("y", pt[1]);
        /* En la mitad izquierda se gira 180° más para que no quede al revés. */
        var giroTexto = medio > 180 ? medio + 90 : medio - 90;
        texto.setAttribute("transform", "rotate(" + giroTexto + " " + pt[0] + " " + pt[1] + ")");
        texto.setAttribute("class", "sector-texto " + TEXTO_SOBRE[color]);
        texto.setAttribute("text-anchor", "middle");
        texto.setAttribute("dominant-baseline", "central");
        var renglones = RENGLONES[tema] || [tema];
        renglones.forEach(function (r, k) {
          var t = document.createElementNS(SVG, "tspan");
          t.setAttribute("x", pt[0]);
          t.setAttribute("dy", k === 0 ? (-(renglones.length - 1) * 0.55) + "em" : "1.1em");
          t.textContent = r;
          texto.appendChild(t);
        });
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
      ajustarRotulos(svg);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { ajustarRotulos(svg); });
    }

    function ajustarRotulos(svg) {
      Array.prototype.forEach.call(svg.querySelectorAll(".sector-texto"), function (t) {
        t.style.fontSize = "";
        var largo = 0;
        Array.prototype.forEach.call(t.querySelectorAll("tspan"), function (r) {
          largo = Math.max(largo, r.getComputedTextLength());
        });
        if (largo > LARGO_MAX) {
          var base = parseFloat(getComputedStyle(t).fontSize) || 17;
          t.style.fontSize = (base * LARGO_MAX / largo).toFixed(2) + "px";
        }
      });
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

      /* La pregunta aparece cuando la rueda termina de girar de verdad
         (transitionend), así el puntero siempre coincide con el tema. El
         temporizador es solo un respaldo por si el evento no llega. */
      var listo = false;
      var respaldo = null;
      function terminar() {
        if (listo) return;
        listo = true;
        clearTimeout(respaldo);
        giro.removeEventListener("transitionend", alTerminar);
        girando = false;
        botonGirar.disabled = false;
        var tema = temas[temaPorAngulo(rotacion, n)];
        mostrarPregunta(tema, mezclarOpciones(selector.siguiente(tema), rngCripto));
      }
      function alTerminar(e) { if (e.target === giro) terminar(); }
      if (instantaneo) { terminar(); return; }
      giro.addEventListener("transitionend", alTerminar);
      respaldo = setTimeout(terminar, 6000);
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
