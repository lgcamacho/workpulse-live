/* =========================================================================
   SEKAIA · Asistente de operaciones de WorkPulse (panel de chat)
   Lo usan index.html y sistema.html. Cada página le da su forma de llamar
   al servidor con WPSekaIA.configurar({ llamar, perfil }).
   ========================================================================= */
(function () {
  "use strict";
  if (window.WPSekaIA) return;

  var CSS = [
    ".sk-fondo{position:fixed;inset:0;background:rgba(15,23,42,.35);z-index:2147483200;opacity:0;transition:opacity .18s;}",
    ".sk-fondo.sk-on{opacity:1;}",
    ".sk-panel{position:fixed;top:0;right:0;bottom:0;width:min(460px,100vw);background:#f8fafc;z-index:2147483300;display:flex;flex-direction:column;",
    "  box-shadow:-12px 0 40px rgba(15,23,42,.25);transform:translateX(102%);transition:transform .22s ease;font-family:'Segoe UI',Arial,sans-serif;color:#0f172a;}",
    ".sk-panel.sk-on{transform:none;}",
    ".sk-cab{background:#0f172a;color:#fff;padding:14px 14px 12px;display:flex;align-items:center;gap:10px;flex:0 0 auto;}",
    ".sk-logo{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#009B4A,#7c3aed);display:flex;align-items:center;justify-content:center;",
    "  font-weight:900;font-size:14px;letter-spacing:.5px;flex:0 0 auto;}",
    ".sk-tit{flex:1;min-width:0;}",
    ".sk-tit b{display:block;font-size:16px;letter-spacing:.5px;}",
    ".sk-tit span{display:block;font-size:11.5px;color:#cbd5e1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}",
    ".sk-cab button{background:transparent;color:#e2e8f0;border:1px solid #334155;border-radius:8px;padding:7px 10px;font:800 12px 'Segoe UI',Arial,sans-serif;cursor:pointer;}",
    ".sk-cab button:hover{background:#1e293b;}",
    ".sk-msgs{flex:1 1 auto;overflow-y:auto;padding:16px 14px 8px;display:flex;flex-direction:column;gap:12px;scroll-behavior:smooth;}",
    ".sk-bien{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:16px;}",
    ".sk-bien h3{margin:0 0 4px;font-size:17px;}",
    ".sk-bien p{margin:0 0 12px;font-size:13px;color:#475569;line-height:1.45;}",
    ".sk-grupo{font-size:10.5px;font-weight:900;color:#64748b;letter-spacing:.8px;text-transform:uppercase;margin:12px 0 6px;}",
    ".sk-chips{display:flex;flex-wrap:wrap;gap:6px;}",
    ".sk-chip{background:#fff;border:1.5px solid #cbd5e1;color:#0f172a;border-radius:999px;padding:7px 12px;font:700 12.5px 'Segoe UI',Arial,sans-serif;cursor:pointer;text-align:left;}",
    ".sk-chip:hover{border-color:#009B4A;color:#007b3a;background:#f0fdf4;}",
    ".sk-yo{align-self:flex-end;max-width:85%;background:#009B4A;color:#fff;border-radius:14px 14px 4px 14px;padding:10px 13px;font-size:13.5px;line-height:1.45;white-space:pre-wrap;word-wrap:break-word;}",
    ".sk-ia{align-self:flex-start;max-width:94%;background:#fff;border:1px solid #e2e8f0;border-left:4px solid #7c3aed;border-radius:4px 14px 14px 14px;padding:11px 13px;",
    "  font-size:13.5px;line-height:1.5;word-wrap:break-word;overflow-x:auto;}",
    ".sk-ia.sk-basica{border-left-color:#94a3b8;}",
    ".sk-ia.sk-error{border-left-color:#dc2626;background:#fef2f2;}",
    ".sk-ia p{margin:0 0 8px;} .sk-ia p:last-child{margin-bottom:0;}",
    ".sk-ia ul,.sk-ia ol{margin:4px 0 8px;padding-left:20px;} .sk-ia li{margin:2px 0;}",
    ".sk-ia .sk-h{font-weight:900;margin:8px 0 4px;}",
    ".sk-ia code{background:#f1f5f9;border-radius:4px;padding:1px 4px;font-size:12.5px;}",
    ".sk-ia table{border-collapse:collapse;margin:6px 0 8px;font-size:12.5px;min-width:60%;}",
    ".sk-ia th{background:#0f172a;color:#fff;padding:5px 8px;text-align:left;font-size:11px;text-transform:uppercase;}",
    ".sk-ia td{padding:5px 8px;border-bottom:1px solid #e2e8f0;}",
    ".sk-pie{display:flex;align-items:center;gap:8px;margin-top:8px;padding-top:7px;border-top:1px dashed #e2e8f0;font-size:11px;color:#64748b;}",
    ".sk-pie span{flex:1;}",
    ".sk-pie button{background:none;border:1px solid #cbd5e1;border-radius:6px;padding:3px 8px;font:700 11px 'Segoe UI',Arial,sans-serif;color:#334155;cursor:pointer;}",
    ".sk-sug{display:flex;flex-wrap:wrap;gap:6px;margin-top:-4px;}",
    ".sk-pensando{align-self:flex-start;background:#fff;border:1px solid #e2e8f0;border-radius:4px 14px 14px 14px;padding:11px 14px;font-size:12.5px;color:#64748b;display:flex;align-items:center;gap:10px;}",
    ".sk-puntos{display:inline-flex;gap:4px;} .sk-puntos i{width:7px;height:7px;border-radius:50%;background:#7c3aed;opacity:.3;animation:skp 1.2s infinite;}",
    ".sk-puntos i:nth-child(2){animation-delay:.2s;} .sk-puntos i:nth-child(3){animation-delay:.4s;}",
    "@keyframes skp{0%,80%,100%{opacity:.25;transform:translateY(0);}40%{opacity:1;transform:translateY(-3px);}}",
    ".sk-entrada{flex:0 0 auto;background:#fff;border-top:1px solid #e2e8f0;padding:10px 12px 12px;}",
    ".sk-caja{display:flex;gap:8px;align-items:flex-end;border:2px solid #cbd5e1;border-radius:12px;padding:6px 6px 6px 10px;background:#fff;}",
    ".sk-caja:focus-within{border-color:#7c3aed;}",
    ".sk-caja textarea{flex:1;border:none;outline:none;resize:none;font:600 14px 'Segoe UI',Arial,sans-serif;max-height:120px;min-height:22px;padding:6px 0;background:transparent;color:#0f172a;}",
    ".sk-caja button{background:#7c3aed;color:#fff;border:none;border-radius:9px;padding:9px 14px;font:900 12.5px 'Segoe UI',Arial,sans-serif;cursor:pointer;}",
    ".sk-caja button:disabled{background:#cbd5e1;cursor:default;}",
    ".sk-nota{font-size:10.5px;color:#94a3b8;margin-top:6px;text-align:center;}",
    ".sk-panel[hidden],.sk-fondo[hidden]{display:none !important;}",
    "@media (max-width:560px){.sk-panel{width:100vw;}.sk-cab button.sk-nueva{display:none;}}"
  ].join("\n");

  var GRUPOS = [
    ["Producción", ["Resumen del turno actual", "¿Qué líneas van abajo de meta?", "¿Qué horas faltan por capturar?"]],
    ["Fallas y mantenimiento", ["Top 5 fallas de hoy y en qué líneas", "Mantenimientos abiertos más antiguos", "Refacciones pendientes"]],
    ["Mejora", ["Haz un 5 porqués de la falla con más minutos", "Redacta un mensaje para gerencia con el resultado de hoy"]]
  ];
  var MAX = 800;
  var conf = { llamar: null, perfil: null };
  var hist = [];               // [{ rol: 'usuario'|'sekaia', texto, html, fuente, corte, sugerencias }]
  var ocupado = false, construido = false;
  var el = {};

  try { hist = JSON.parse(sessionStorage.getItem("wpSekaIA") || "[]") || []; } catch (e) { hist = []; }
  function guardar() { try { sessionStorage.setItem("wpSekaIA", JSON.stringify(hist.slice(-30))); } catch (e) {} }

  // Solo se permiten etiquetas de formato; todo atributo se quita
  var PERMITIDAS = { B: 1, STRONG: 1, I: 1, EM: 1, BR: 1, P: 1, UL: 1, OL: 1, LI: 1, TABLE: 1, THEAD: 1, TBODY: 1, TR: 1, TH: 1, TD: 1, CODE: 1, DIV: 1, SPAN: 1 };
  function limpiar(html) {
    var doc = new DOMParser().parseFromString("<div>" + String(html || "") + "</div>", "text/html");
    var raiz = doc.body.firstChild;
    (function recorrer(nodo) {
      Array.prototype.slice.call(nodo.childNodes).forEach(function (h) {
        if (h.nodeType === 3) return;
        if (h.nodeType !== 1 || !PERMITIDAS[h.tagName]) {
          if (h.nodeType === 1 && !/^(SCRIPT|STYLE|IFRAME|OBJECT|EMBED|svg|SVG|MATH)$/.test(h.tagName)) {
            recorrer(h);
            while (h.firstChild) nodo.insertBefore(h.firstChild, h);
          }
          nodo.removeChild(h);
          return;
        }
        var cls = h.getAttribute("class");
        Array.prototype.slice.call(h.attributes).forEach(function (a) { h.removeAttribute(a.name); });
        if (h.tagName === "DIV" && cls === "sk-h") h.className = "sk-h";
        recorrer(h);
      });
    })(raiz);
    return raiz.innerHTML;
  }
  function textoPlano(html) {
    var d = document.createElement("div");
    d.innerHTML = limpiar(String(html || "").replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|li|tr|div)>/gi, "\n"));
    return (d.textContent || "").replace(/\n{3,}/g, "\n\n").trim();
  }

  function crear(tag, cls, txt) {
    var x = document.createElement(tag);
    if (cls) x.className = cls;
    if (txt !== undefined) x.textContent = txt;
    return x;
  }

  function construir() {
    if (construido) return;
    construido = true;
    var st = crear("style"); st.textContent = CSS; document.head.appendChild(st);

    el.fondo = crear("div", "sk-fondo"); el.fondo.hidden = true;
    el.fondo.addEventListener("click", cerrar);
    el.panel = crear("aside", "sk-panel");
    el.panel.setAttribute("role", "dialog"); el.panel.setAttribute("aria-label", "SekaIA, asistente de operaciones");
    el.panel.hidden = true;

    var cab = crear("div", "sk-cab");
    cab.appendChild(crear("div", "sk-logo", "AI"));
    var tit = crear("div", "sk-tit");
    tit.appendChild(crear("b", "", "SekaIA"));
    el.sub = crear("span", "", "Asistente de operaciones · datos de WorkPulse");
    tit.appendChild(el.sub);
    cab.appendChild(tit);
    var nueva = crear("button", "sk-nueva", "Nueva conversación"); nueva.type = "button";
    nueva.addEventListener("click", function () { if (ocupado) return; hist = []; guardar(); pintar(); el.txt.focus(); });
    var x = crear("button", "", "Cerrar"); x.type = "button"; x.addEventListener("click", cerrar);
    cab.appendChild(nueva); cab.appendChild(x);

    el.msgs = crear("div", "sk-msgs"); el.msgs.setAttribute("aria-live", "polite");

    var ent = crear("div", "sk-entrada");
    var caja = crear("div", "sk-caja");
    el.txt = crear("textarea"); el.txt.rows = 1; el.txt.maxLength = MAX;
    el.txt.placeholder = "Escribe tu pregunta de trabajo…";
    el.txt.addEventListener("input", function () { ajustar(); el.btn.disabled = ocupado || !el.txt.value.trim(); });
    el.txt.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" && !ev.shiftKey && !ev.isComposing) { ev.preventDefault(); enviar(); }
    });
    el.btn = crear("button", "", "Enviar"); el.btn.type = "button"; el.btn.disabled = true;
    el.btn.addEventListener("click", function () { enviar(); });
    caja.appendChild(el.txt); caja.appendChild(el.btn);
    ent.appendChild(caja);
    ent.appendChild(crear("div", "sk-nota", "Solo temas de trabajo de la planta. Verifica las cifras importantes en el pizarrón."));

    el.panel.appendChild(cab); el.panel.appendChild(el.msgs); el.panel.appendChild(ent);
    document.body.appendChild(el.fondo); document.body.appendChild(el.panel);
    document.addEventListener("keydown", function (ev) { if (ev.key === "Escape" && !el.panel.hidden) cerrar(); });
  }

  function ajustar() {
    el.txt.style.height = "auto";
    el.txt.style.height = Math.min(120, el.txt.scrollHeight) + "px";
  }

  function chip(texto) {
    var c = crear("button", "sk-chip", texto); c.type = "button";
    c.addEventListener("click", function () { enviar(texto); });
    return c;
  }

  function bienvenida() {
    var p = conf.perfil || {};
    var b = crear("div", "sk-bien");
    var nombre = String(p.nombre || p.usuario || "").split(" ")[0];
    b.appendChild(crear("h3", "", "Hola" + (nombre ? ", " + nombre.charAt(0) + nombre.slice(1).toLowerCase() : "") + "."));
    b.appendChild(crear("p", "", "Contesto con los datos de hoy de WorkPulse: pizarrón, downtime 6M, fallas, mantenimiento, refacciones y EHS. " +
      "También te ayudo a analizar problemas (5 porqués, Ishikawa, Pareto) y a redactar reportes."));
    var grupos = GRUPOS.slice();
    if (p.rol === "SUPERVISOR" && (p.lineas || []).length) grupos = [["Mi línea", ["¿Cómo va mi línea?", "¿Qué me falta capturar?"]]].concat(grupos);
    grupos.forEach(function (g) {
      b.appendChild(crear("div", "sk-grupo", g[0]));
      var cs = crear("div", "sk-chips");
      g[1].forEach(function (t) { cs.appendChild(chip(t)); });
      b.appendChild(cs);
    });
    return b;
  }

  function burbujaIA(m) {
    var d = crear("div", "sk-ia" + (m.fuente === "reglas" ? " sk-basica" : "") + (m.fuente === "error" || m.fuente === "limite" ? " sk-error" : ""));
    var cuerpo = crear("div");
    cuerpo.innerHTML = limpiar(m.html);
    d.appendChild(cuerpo);
    var pie = crear("div", "sk-pie");
    var etiqueta = m.fuente === "ia" ? "Datos de las " + (m.corte || "--:--") + " · IA"
      : m.fuente === "reglas" ? "Respuesta básica (sin IA)" + (m.corte ? " · " + m.corte : "")
      : m.fuente === "error" ? "No se pudo responder" : (m.corte || "");
    pie.appendChild(crear("span", "", etiqueta));
    var copiar = crear("button", "", "Copiar"); copiar.type = "button";
    copiar.addEventListener("click", function () {
      var t = textoPlano(m.html);
      var listo = function () { copiar.textContent = "Copiado"; setTimeout(function () { copiar.textContent = "Copiar"; }, 1500); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(listo, function () {});
      else { var a = crear("textarea"); a.value = t; document.body.appendChild(a); a.select(); try { document.execCommand("copy"); listo(); } catch (e) {} a.remove(); }
    });
    pie.appendChild(copiar);
    d.appendChild(pie);
    return d;
  }

  function pintar() {
    el.msgs.innerHTML = "";
    if (!hist.length) { el.msgs.appendChild(bienvenida()); return; }
    hist.forEach(function (m, i) {
      if (m.rol === "usuario") el.msgs.appendChild(crear("div", "sk-yo", m.texto));
      else {
        el.msgs.appendChild(burbujaIA(m));
        if (i === hist.length - 1 && (m.sugerencias || []).length) {
          var s = crear("div", "sk-sug");
          m.sugerencias.forEach(function (t) { s.appendChild(chip(t)); });
          el.msgs.appendChild(s);
        }
      }
    });
    el.msgs.scrollTop = el.msgs.scrollHeight;
  }

  function enviar(textoDirecto) {
    if (ocupado) return;
    var t = String(textoDirecto !== undefined ? textoDirecto : el.txt.value).trim().slice(0, MAX);
    if (!t) return;
    if (typeof conf.llamar !== "function") { alert("SekaIA todavía se está conectando. Intenta en unos segundos."); return; }
    var previo = hist.filter(function (m) { return m.fuente !== "error" && m.fuente !== "limite"; })
      .slice(-6).map(function (m) { return { rol: m.rol, texto: m.rol === "usuario" ? m.texto : (m.texto || textoPlano(m.html)).slice(0, 1500) }; });
    hist.push({ rol: "usuario", texto: t });
    guardar();
    el.txt.value = ""; ajustar();
    pintar();

    ocupado = true; el.btn.disabled = true;
    var p = crear("div", "sk-pensando");
    var puntos = crear("span", "sk-puntos"); puntos.innerHTML = "<i></i><i></i><i></i>";
    var lbl = crear("span", "", "Revisando los datos de la planta…");
    p.appendChild(puntos); p.appendChild(lbl);
    el.msgs.appendChild(p); el.msgs.scrollTop = el.msgs.scrollHeight;
    var t0 = Date.now();
    var reloj = setInterval(function () {
      var s = Math.round((Date.now() - t0) / 1000);
      if (s >= 8) lbl.textContent = "Revisando los datos de la planta… " + s + " s" + (s >= 25 ? " (la primera pregunta puede tardar hasta un minuto)" : "");
    }, 1000);

    var terminar = function (m) {
      clearInterval(reloj);
      ocupado = false;
      hist.push(m); guardar(); pintar();
      el.btn.disabled = !el.txt.value.trim();
    };
    Promise.resolve().then(function () { return conf.llamar(t, previo); }).then(function (r) {
      if (typeof r === "string") r = { html: r, fuente: "reglas" };
      r = r || {};
      terminar({ rol: "sekaia", html: r.html || "Sin respuesta.", texto: r.texto || "", fuente: r.fuente || "ia", corte: r.corte || "",
                 sugerencias: Array.isArray(r.sugerencias) ? r.sugerencias.slice(0, 3) : [] });
    }, function (err) {
      var msg = (err && err.message) || String(err || "Error");
      var d = document.createElement("div"); d.textContent = msg;
      terminar({ rol: "sekaia", html: d.innerHTML, fuente: "error", sugerencias: [] });
    });
  }

  function abrir(pregunta) {
    construir();
    el.fondo.hidden = false; el.panel.hidden = false;
    requestAnimationFrame(function () { el.fondo.classList.add("sk-on"); el.panel.classList.add("sk-on"); });
    pintar();
    if (conf.alAbrir) try { conf.alAbrir(); } catch (e) {}
    if (pregunta) enviar(pregunta);
    else setTimeout(function () { try { el.txt.focus(); } catch (e) {} }, 250);
  }

  function cerrar() {
    if (!construido) return;
    el.fondo.classList.remove("sk-on"); el.panel.classList.remove("sk-on");
    setTimeout(function () { el.fondo.hidden = true; el.panel.hidden = true; }, 230);
  }

  window.WPSekaIA = {
    configurar: function (o) { Object.keys(o || {}).forEach(function (k) { conf[k] = o[k]; }); if (construido && !hist.length) pintar(); },
    abrir: abrir,
    cerrar: cerrar,
    _limpiar: limpiar
  };
})();
