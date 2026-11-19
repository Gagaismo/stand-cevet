// Kiosco CEVET: loop infinito de diapositivas, ~6 s cada una.
// Sin dependencias ni red; funciona desde file://.
// Teclas: → / ← cambian, espacio pausa, F pantalla completa.
(function () {
  "use strict";
  var SLIDE_MS = 6000;
  var IDLE_MS = 2500;
  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var bar = document.getElementById("progress");
  var fsBtn = document.getElementById("fs");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var i = 0, timer = null, paused = false;

  function startBar() {
    if (!bar || reduce) { if (bar) bar.style.width = "0"; return; }
    bar.style.transition = "none";
    bar.style.width = "0";
    void bar.offsetWidth; // reinicia la transición
    bar.style.transition = "width " + SLIDE_MS + "ms linear";
    bar.style.width = "100%";
  }

  function show(n) {
    slides[i].classList.remove("active");
    i = (n + slides.length) % slides.length;
    slides[i].classList.add("active");
    schedule();
  }

  function schedule() {
    clearTimeout(timer);
    if (paused) { if (bar) { bar.style.transition = "none"; bar.style.width = "0"; } return; }
    startBar();
    timer = setTimeout(function () { show(i + 1); }, SLIDE_MS);
  }

  function toggleFullscreen() {
    var d = document, el = d.documentElement;
    if (d.fullscreenElement || d.webkitFullscreenElement) {
      (d.exitFullscreen || d.webkitExitFullscreen).call(d);
    } else {
      var req = el.requestFullscreen || el.webkitRequestFullscreen;
      if (req) { var p = req.call(el); if (p && p.catch) p.catch(function () {}); }
    }
  }

  function syncFsLabel() {
    var on = !!(document.fullscreenElement || document.webkitFullscreenElement);
    fsBtn.textContent = on ? "Salir de pantalla completa" : "Pantalla completa";
  }

  // Cursor y botones se esconden cuando el mouse queda quieto.
  var idleTimer = null;
  function wake() {
    document.body.classList.remove("idle");
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () { document.body.classList.add("idle"); }, IDLE_MS);
  }

  fsBtn.addEventListener("click", toggleFullscreen);
  document.addEventListener("fullscreenchange", syncFsLabel);
  document.addEventListener("webkitfullscreenchange", syncFsLabel);
  ["mousemove", "mousedown", "touchstart", "keydown"].forEach(function (ev) {
    document.addEventListener(ev, wake, { passive: true });
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") show(i + 1);
    else if (e.key === "ArrowLeft") show(i - 1);
    else if (e.key === " " && e.target === document.body) { e.preventDefault(); paused = !paused; schedule(); }
    else if (e.key === "f" || e.key === "F") toggleFullscreen();
  });

  // Fondo de cada foto: la misma imagen, desenfocada, llenando la pantalla.
  slides.forEach(function (s) {
    var img = s.classList.contains("photo") && s.querySelector("img");
    if (!img) return;
    var bg = document.createElement("div");
    bg.className = "bg";
    bg.setAttribute("aria-hidden", "true");
    bg.style.backgroundImage = 'url("' + img.src + '")';
    s.insertBefore(bg, s.firstChild);
  });

  if (!slides.length) return;
  slides[0].classList.add("active");
  schedule();
  wake();
})();
