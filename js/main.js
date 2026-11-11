/* =========================================================
   PIKI — Manual de marca · interacciones
   ========================================================= */
(() => {
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const L = window.PIKI_LOGO;
const ICONS = window.PIKI_ICONS;

/* ---------- Paleta ---------- */
const C = {
  petroleo: "#004856", celeste: "#009DB6", lima: "#B9D339", verde: "#4FA000", crema: "#F8F6F0", carbon: "#252525",
  piedra: "#8B877A", arena: "#BCB9AD", niebla: "#DDDCD8", blanco: "#FFFFFF", abismo: "#00333E", agua: "#4FD1E6", oliva: "#6D7A00"
};

/* ---------- Toast & portapapeles ---------- */
let toastT;
function toast(msg) {
  const t = $(".toast"); $("span", t).textContent = msg; t.classList.add("is-on");
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("is-on"), 2200);
}
async function copy(text, msg = "Copiado al portapapeles") {
  try { await navigator.clipboard.writeText(text); }
  catch { const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); }
  toast(msg);
}
function download(name, blob) {
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}

/* =========================================================
   LOGO
   ========================================================= */
const VB = L.vb; // [x, y, w, h] del isotipo
const ISO_W = 1000 * VB[2] / VB[3];
const X_MOD = L.head.r * 2; // diámetro de la cabeza en unidades del isotipo

function isoInner(fill = "currentColor", pieces = true, ring = false) {
  const body = L.parts.map(p => {
    const path = `<path d="${p.d}" fill-rule="evenodd"/>`;
    return pieces ? `<g class="piece pc-${p.id}" data-part="${p.id}" fill="${fill}">${path}</g>` : `<g fill="${fill}">${path}</g>`;
  }).join("");
  const hd = L.head;
  return body + (ring ? `<circle class="pc-ring" cx="${hd.cx}" cy="${hd.cy}" r="${hd.r}" fill="none" stroke="${C.lima}" stroke-width="3"/>` : "");
}
function isoGroup(fill, x = 0, y = 0, h = 1000, pieces = true, ring = false) {
  const s = h / VB[3];
  return `<g transform="translate(${x} ${y}) scale(${s}) translate(${-VB[0]} ${-VB[1]})">${isoInner(fill, pieces, ring)}</g>`;
}
/* Isologo (P + IKI + bajada) y logotipo (PIKI + línea + bajada): trazados de logo.ai, normalizados a 1000 de alto */
const IL = L.isologo, LT = L.logotipo;
const ILS = 1000 / IL.vb[3], LTS = 1000 / LT.vb[3];
const ISOLOGO_W = IL.vb[2] * ILS, LOGOTIPO_W = LT.vb[2] * LTS;
function isologoGroup(fill, pieces = true, ring = false, tag = true) {
  const hd = IL.head;
  return `<g transform="scale(${ILS})" fill="${fill}"><g class="${pieces ? "piece pc-p" : ""}" data-part="p"><path d="${IL.p}"/></g><g class="word"><path d="${IL.letters}"/></g>${tag ? `<g class="tag"><path d="${IL.tag}"/></g>` : ""}` +
    (ring ? `<circle class="pc-ring" cx="${hd.cx}" cy="${hd.cy}" r="${hd.r}" fill="none" stroke="${C.lima}" stroke-width="1.2"/>` : "") + `</g>`;
}
function logotipoGroup(fill) {
  return `<g transform="scale(${LTS})" fill="${fill}"><g class="word"><path d="${LT.letters}"/></g><g class="line"><path d="${LT.line}"/></g><g class="tag"><path d="${LT.tag}"/></g></g>`;
}
const LNAME = { h: "isologo", v: "logotipo", word: "logotipo", iso: "isotipo", fav: "icono" };
/* Devuelve {svg, w, h} para cada versión
   iso = isotipo · h = isologo · v / word = logotipo */
function logoSVG(type = "h", fill = "currentColor", opts = {}) {
  const pieces = opts.pieces !== false;
  let w, h, body;
  if (type === "iso") {
    w = ISO_W; h = 1000; body = isoGroup(fill, 0, 0, 1000, pieces, opts.ring);
  } else if (type === "h") {
    w = ISOLOGO_W; h = opts.tag === false ? 1000 * (IL.markH || 85.7) / IL.vb[3] : 1000; body = isologoGroup(fill, pieces, opts.ring, opts.tag !== false);
  } else if (type === "v" || type === "word") {
    w = LOGOTIPO_W; h = 1000; body = logotipoGroup(fill);
  } else if (type === "fav") {
    w = 1000; h = 1000;
    const ih = 1000 * 0.66 * VB[3] / VB[2];
    body = `<rect width="1000" height="1000" rx="220" fill="${opts.bg || C.petroleo}"/>` + isoGroup(opts.fg || "#fff", 170, (1000 - ih) / 2, ih, false);
  }
  if (opts.bgRect) body = `<rect x="${-opts.pad}" y="${-opts.pad}" width="${w + opts.pad * 2}" height="${h + opts.pad * 2}" fill="${opts.bgRect}"/>` + body;
  const pad = opts.pad || 0;
  const vb = `${-pad} ${-pad} ${w + pad * 2} ${h + pad * 2}`;
  const size = opts.px ? `width="${opts.px}" height="${Math.round(opts.px * (h + pad * 2) / (w + pad * 2))}"` : "";
  return { w, h, svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" ${size} role="img" aria-label="Piki">${body}</svg>` };
}
function mountLogos(root = document) {
  $$(".lg[data-lg]", root).forEach(el => {
    if (el.dataset.done) return;
    /* Por debajo de 48 px de alto el isologo pierde la bajada (deja de leerse) */
    let tag = el.dataset.tag !== "0";
    if (el.dataset.lg === "h" && tag && el.dataset.tag !== "1") {
      const hpx = parseFloat(el.style.height) || (el.getBoundingClientRect().width / (ISOLOGO_W / 1000));
      if (hpx && hpx < 48) tag = false;
    }
    const { svg } = logoSVG(el.dataset.lg, "currentColor", { ring: !!el.dataset.ring, tag });
    el.innerHTML = svg;
    const s = el.firstElementChild;
    const byH = el.style.height || el.classList.contains("logo-h");
    s.style.display = "block";
    if (byH) { s.style.height = "100%"; s.style.width = "auto"; } else { s.style.width = "100%"; s.style.height = "auto"; }
    el.dataset.done = 1;
  });
}

/* =========================================================
   ÍCONOS
   ========================================================= */
function iconSVG(name, size = 20) {
  const ic = ICONS[name]; if (!ic) return "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ic[2]}</svg>`;
}
function mountIcons(root = document) {
  $$("i[data-icon]", root).forEach(el => {
    el.outerHTML = iconSVG(el.dataset.icon, el.dataset.size || 20);
  });
}

/* =========================================================
   NAV, ÍNDICE, PROGRESO, BUSCADOR
   ========================================================= */
const sections = $$("main > section[data-title]");
const DESC = {
  introduccion: "Nombre, logotipo principal, claim y origen", identidad: "Concepto, valores, público, voz y competencia", logotipo: "Isotipo, construcción, versiones y usos",
  color: "Paleta, valores y contraste", tipografia: "Poppins, cursiva display y jerarquías", recursos: "Formas, patrones, puntos articulares e íconos",
  fotografia: "Imagen, iluminación, encuadre y motion", aplicaciones: "Piezas físicas y digitales en uso real", ui: "Tokens, componentes, grillas y pantallas",
  descargas: "Logos, paleta, recursos y plantillas", cierre: "Conclusión general y equipo"
};
const slug = t => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
function buildNav() {
  const nav = $("#nav"), idx = $("#indexGrid");
  sections.forEach(s => {
    const subs = $$(".h3[data-sub], .part[data-sub]", s);
    const g = document.createElement("div"); g.className = "nav__group"; g.dataset.sec = s.id;
    g.innerHTML = `<div class="nav__item"><a href="#${s.id}"><span class="n">${s.dataset.num}</span>${s.dataset.title}</a>${subs.length ? `<button class="nav__toggle" aria-expanded="false" aria-label="Desplegar ${s.dataset.title}">${iconSVG("chevron", 16)}</button>` : ""}</div>`;
    if (subs.length) {
      const box = document.createElement("div"); box.className = "nav__sub";
      const inner = document.createElement("div");
      subs.forEach(h => {
        h.id = h.id || s.id + "-" + slug(h.dataset.sub);
        const sa = document.createElement("a"); sa.href = "#" + h.id; sa.textContent = h.dataset.sub;
        if (h.classList.contains("part")) sa.style.fontWeight = 700;
        inner.appendChild(sa);
      });
      box.appendChild(inner); g.appendChild(box);
    }
    nav.appendChild(g);
    if (idx && s.id !== "portada" && s.id !== "cierre") {
      const c = document.createElement("a"); c.className = "index-card"; c.href = "#" + s.id;
      c.innerHTML = `<b>${s.dataset.num}</b><span>${s.dataset.title}</span><small>${DESC[s.id] || ""}</small>`;
      idx.appendChild(c);
    }
  });
  /* Acordeón */
  const setOpen = (g, o) => { g.classList.toggle("is-open", o); const t = $(".nav__toggle", g); if (t) t.setAttribute("aria-expanded", o); };
  nav.addEventListener("click", e => {
    const t = e.target.closest(".nav__toggle"); if (!t) return;
    const g = t.closest(".nav__group"); g.dataset.manual = 1; setOpen(g, !g.classList.contains("is-open"));
  });
  $("#navOpenAll").addEventListener("click", () => $$(".nav__group", nav).forEach(g => { g.dataset.manual = 1; setOpen(g, true); }));
  $("#navCloseAll").addEventListener("click", () => $$(".nav__group", nav).forEach(g => { g.dataset.manual = 1; setOpen(g, false); }));
  nav.setOpen = setOpen;
  /* Ocultar / mostrar el menú completo (escritorio) */
  const col = $(".sidebar-collapse");
  col.addEventListener("click", () => { const c = document.body.classList.toggle("nav-collapsed"); col.title = c ? "Mostrar menú" : "Ocultar menú"; });
}
function spy() {
  const nav = $("#nav"), groups = $$(".nav__group", nav), links = $$(".nav__item > a", nav);
  const io = new IntersectionObserver(es => {
    es.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(l => l.classList.toggle("is-active", l.getAttribute("href") === "#" + e.target.id));
      groups.forEach(g => { if (!g.dataset.manual) nav.setOpen(g, g.dataset.sec === e.target.id); });
      const act = links.find(l => l.classList.contains("is-active"));
      if (act) { const r = act.getBoundingClientRect(), nr = nav.getBoundingClientRect(); if (r.top < nr.top || r.bottom > nr.bottom) nav.scrollTop += r.top - nr.top - 60; }
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach(s => io.observe(s));
  const subLinks = $$(".nav__sub a");
  const io2 = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) subLinks.forEach(l => l.classList.toggle("is-active", l.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-20% 0px -70% 0px" });
  $$(".h3[data-sub], .part[data-sub]").forEach(h => io2.observe(h));
}
function progress() {
  const bar = $(".progress span"), top = $(".to-top");
  const on = () => {
    const h = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (scrollY / h * 100) + "%";
    top.classList.toggle("is-on", scrollY > innerHeight);
  };
  addEventListener("scroll", on, { passive: true }); on();
  top.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
}
function reveal() {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("is-in"); e.target.dispatchEvent(new CustomEvent("revealed")); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -8% 0px" });
  $$(".reveal").forEach(r => io.observe(r));
}
function mobileMenu() {
  const btn = $(".menu-btn"), sb = $(".sidebar");
  btn.addEventListener("click", () => { const o = sb.classList.toggle("is-open"); btn.setAttribute("aria-expanded", o); });
  $$(".nav a, .sidebar__brand").forEach(a => a.addEventListener("click", () => sb.classList.remove("is-open")));
}
function search() {
  const dlg = $("#searchDlg"), inp = $("#searchInput"), res = $("#searchRes");
  const items = [];
  sections.forEach(s => {
    if (s.id === "portada") return;
    items.push({ href: "#" + s.id, num: s.dataset.num, title: s.dataset.title, sub: DESC[s.id] || "", kw: (s.dataset.keywords || "") + " " + s.dataset.title });
    $$(".h3, .part__title", s).forEach((h, i) => {
      if (!h.id) h.id = s.id + "-h" + i;
      items.push({ href: "#" + h.id, num: s.dataset.num, title: h.childNodes[0].textContent.trim(), sub: s.dataset.title, kw: h.textContent });
    });
  });
  const norm = t => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  let sel = 0, list = [];
  const render = () => {
    const q = norm(inp.value.trim());
    list = !q ? items.filter(i => i.sub && DESC[i.href.slice(1)]) : items.filter(i => norm(i.title + " " + i.kw + " " + i.sub).includes(q));
    sel = 0;
    res.innerHTML = list.length ? list.slice(0, 30).map((i, k) => `<a href="${i.href}" class="${k === 0 ? "is-sel" : ""}"><b>${i.num}</b><span>${i.title}<small>${i.sub}</small></span></a>`).join("") : `<div class="empty">Sin resultados para “${inp.value}”</div>`;
  };
  const open = () => { dlg.classList.add("is-on"); inp.value = ""; render(); setTimeout(() => inp.focus(), 30); };
  const close = () => dlg.classList.remove("is-on");
  $$("[data-open-search]").forEach(b => b.addEventListener("click", open));
  addEventListener("keydown", e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); dlg.classList.contains("is-on") ? close() : open(); }
    if (e.key === "Escape") close();
  });
  dlg.addEventListener("click", e => { if (e.target === dlg) close(); });
  res.addEventListener("click", e => { if (e.target.closest("a")) close(); });
  inp.addEventListener("input", render);
  inp.addEventListener("keydown", e => {
    const as = $$("a", res);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault(); sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + as.length) % as.length;
      as.forEach((a, k) => a.classList.toggle("is-sel", k === sel)); as[sel]?.scrollIntoView({ block: "nearest" });
    }
    if (e.key === "Enter" && as[sel]) { location.hash = as[sel].getAttribute("href"); close(); }
  });
}
/* Segmented controls genéricos */
function seg(el, cb) {
  if (!el) return;
  el.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b || !el.contains(b)) return;
    $$("button", el).forEach(x => x.classList.toggle("is-on", x === b)); cb(b.dataset, b);
  });
}

/* =========================================================
   ATLETAS + PUNTOS ARTICULARES
   ========================================================= */
const ATH = {
  futbol: { w: 684, j: { a: [65, 14.4], hi: [38, 19.5], hd: [74, 26.1], ci: [21.2, 24.9], cd: [80.1, 39.8], mi: [4.9, 33.9], md: [96.4, 54.2], ki: [35.5, 50.1], kd: [60.1, 53.6], ri: [56.6, 64.5], rd: [40.6, 78.2], ti: [69.4, 91.7], td: [15, 87.8] } },
  running: { w: 350, j: { a: [71.6, 9.7], hi: [33.4, 20], hd: [90.2, 21.7], ci: [10, 25.3], cd: [95, 34], mi: [10, 42], md: [85.7, 37.4], ki: [40, 47.3], kd: [71.6, 49], ri: [58.9, 62.6], rd: [45.7, 71.7], ti: [14.9, 67.3], td: [12.9, 91.7] } },
  basquet: { w: 549, j: { a: [72.7, 11.6], hi: [40.5, 23.8], hd: [88.6, 23.8], ci: [27.1, 35.7], cd: [84.5, 41.9], mi: [5.6, 47.5], md: [62.4, 52.3], ki: [43.9, 48.5], kd: [77.2, 52.3], ri: [72.7, 63.4], rd: [91.2, 69.6], ti: [62.6, 94.1], td: [45.9, 79.4] } }
};
const BONES = [["hi", "hd"], ["hi", "ci"], ["ci", "mi"], ["hd", "cd"], ["cd", "md"], ["hi", "ki"], ["hd", "kd"], ["ki", "kd"], ["ki", "ri"], ["ri", "ti"], ["kd", "rd"], ["rd", "td"]];
const JNAME = { a: "Cabeza", h: "Hombro", c: "Codo", m: "Muñeca", k: "Cadera", r: "Rodilla", t: "Tobillo" };
const JTIP = { a: "descanso mental y sueño", h: "movilidad articular", c: "elongación", m: "carga y descarga", k: "estabilidad", r: "recuperación muscular", t: "prevención de lesiones" };
function athleteHTML(key, color = C.celeste) {
  const a = ATH[key], W = a.w, P = ([x, y]) => [x * W / 100, y * 10];
  const bones = BONES.map(([p, q]) => { const [x1, y1] = P(a.j[p]), [x2, y2] = P(a.j[q]); return `<line class="bone" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="4" stroke-linecap="round"/>`; }).join("");
  const [nx1, ny1] = P(a.j.a), [sx1, sy1] = P(a.j.hi), [sx2, sy2] = P(a.j.hd);
  const neck = `<line class="bone" x1="${nx1}" y1="${ny1}" x2="${(sx1 + sx2) / 2}" y2="${(sy1 + sy2) / 2}" stroke="${color}" stroke-width="4" stroke-linecap="round"/>`;
  const joints = Object.entries(a.j).map(([k, v], i) => { const [x, y] = P(v); return `<circle class="joint" data-j="${k}" cx="${x}" cy="${y}" r="14" fill="${color}" stroke="#fff" stroke-width="4" style="transition-delay:${0.3 + i * 0.06}s"/>`; }).join("");
  return `<img src="assets/img/${key}.webp" alt="Deportista de ${key}"><svg viewBox="0 0 ${W} 1000" preserveAspectRatio="xMidYMid meet">${neck}${bones}${joints}</svg>`;
}

/* ---------- Hero ---------- */
function hero() {
  const box = $("#heroLogo");
  box.innerHTML = logoSVG("h", "currentColor", { pieces: false }).svg;

  const keys = ["futbol", "running", "basquet"];
  const wrap = $("#heroAthlete"), dots = $("#heroDots");
  let i = 0, timer;
  const show = k => {
    wrap.innerHTML = `<div class="athlete" style="height:100%">${athleteHTML(keys[k], C.lima)}</div>`;
    requestAnimationFrame(() => setTimeout(() => $(".athlete", wrap).classList.add("is-on"), 60));
    $$("button", dots).forEach((d, n) => d.classList.toggle("is-on", n === k));
  };
  keys.forEach((k, n) => { const d = document.createElement("button"); d.setAttribute("aria-label", k); d.onclick = () => { i = n; show(i); restart(); }; dots.appendChild(d); });
  const restart = () => { clearInterval(timer); timer = setInterval(() => { i = (i + 1) % keys.length; show(i); }, 6000); };
  show(0); restart();
}

/* =========================================================
   02 — MARCA
   ========================================================= */
function marca() {
  const CL = [
    ["Recuperar también<br>es <em>entrenar.</em>", "<b>Claim principal.</b> Con esta frase resumimos el concepto: el descanso no es lo opuesto al esfuerzo, es parte del entrenamiento. Lo usamos en piezas de alto impacto, cierre de videos, merchandising y portada de la web."],
    ["Recuperación física y mental para <em>deportistas en formación.</em>", "<b>Bajada descriptiva.</b> Con ella explicamos qué es Piki en una línea. La usamos junto al logo en presentaciones, la web institucional, prensa y convocatorias a profesionales."],
    ["Hacemos visible el <em>trabajo invisible.</em>", "<b>Concepto de campaña.</b> Con esta frase expresamos la idea fundante del proyecto. La usamos en la web, el lanzamiento del videojuego y las piezas de concientización."],
    ["Escuchá a <em>tu cuerpo.</em>", "<b>Llamado a la acción.</b> La usamos como frase breve y directa en la app, las notificaciones, los stickers y las redes."]
  ];
  seg($(".claim-alts"), d => { $("#claimText").innerHTML = CL[d.claim][0]; $("#claimDesc").innerHTML = CL[d.claim][1]; });

  /* Ecosistema: solo texto e imágenes reales de cada plataforma, sin logos inventados ni contenedores */
  const ECO = {
    app: { t: "Piki App", txt: "Herramienta digital de autocuidado para el día a día del deportista.", li: ["Check-in diario, mapa corporal y batería del día", "Contenidos de recuperación validados por profesionales", "Planificación de cargas y seguimiento del progreso", "Integración con smartwatch y calendarios"], v: () => `<div class="realphone realphone--sm"><div class="realphone__screen"><img src="assets/app/app-inicio.webp" alt="Pantalla de Inicio de Piki App"></div></div>` },
    game: { t: "Piki Game", txt: "Videojuego para realidad virtual y web que simula la recuperación postpartido.", li: ["Tres etapas: física, nutricional y vuelta a la calma", "Interacción con un holograma del cuerpo humano", "Modo oscuro con paleta funcional", "Pensado para la sala VR del evento y para jugar en casa"], v: () => `<img class="eco-img" src="assets/redes/post-08-videojuego-vr.webp?v=3" alt="Pieza de Piki Game: videojuego VR" loading="lazy">` },
    day: { t: "Evento Piki", txt: "Evento presencial de dos jornadas en La Rural, Pabellón Ocre.", li: ["Zona de recuperación: crioterapia, masajes, compresión", "Salas inmersivas con videomapping 360°", "Charlas con profesionales de la salud", "Estación de realidad virtual con Piki Game"], v: () => `<img class="eco-img" src="assets/redes/post-02-save-the-date.webp?v=3" alt="Pieza del Evento Piki: save the date" loading="lazy">` },
    web: { t: "Sitio web", txt: "Centro de información de todo el ecosistema.", li: ["Presentación del proyecto y su fundamento", "Descarga de la app y acceso al juego web", "Información y venta de entradas del Evento Piki", "Novedades y contenidos educativos"], v: () => `<img class="eco-img eco-img--web" src="assets/web/web-desktop.webp?v=5" alt="Página web de Piki" loading="lazy">` },
    redes: { t: "Redes sociales", txt: "Instagram como canal principal y TikTok para ampliar alcance.", li: ["Antes del evento: expectativa, cuenta regresiva, consejos", "Durante: historias y videos en vivo", "Después: resúmenes y contenido educativo", "Formatos: feed 4:5, stories y reels 9:16"], v: () => `<div class="eco-posts">${["post-04-manifiesto", "post-09-app", "post-03-anuncio", "post-05-zona-recuperacion"].map(n => `<img src="assets/redes/${n}.webp?v=3" alt="" loading="lazy">`).join("")}</div>` }
  };
  const panel = $("#ecoPanel");
  const show = k => {
    const e = ECO[k];
    panel.innerHTML = `<div><p class="eyebrow">Plataforma</p><h4>${e.t}</h4><p class="p-muted" style="margin:0">${e.txt}</p><ul>${e.li.map(l => `<li>${l}</li>`).join("")}</ul></div><div class="eco__visual">${e.v()}</div>`;
  };
  seg($("#ecoTabs"), d => show(d.eco)); show("app");
}
function subBrand(desc, color, h = 60) {
  const lg = logoSVG("h", color, { tag: false });
  const ratio = lg.w / lg.h;
  return `<span style="display:inline-flex;align-items:center;gap:${h * .28}px;height:${h}px;color:${color}"><span style="height:100%;width:${h * ratio}px;display:block">${lg.svg.replace("<svg ", '<svg style="width:100%;height:100%" ')}</span><span style="width:2px;height:80%;background:currentColor;opacity:.6"></span><span style="font-family:var(--f-display);font-size:${h * .92}px;line-height:.8;letter-spacing:.03em;padding-top:${h * .08}px">${desc}</span></span>`;
}

/* =========================================================
   03 — REFERENTES
   ========================================================= */

/* =========================================================
   04 — VOZ Y TONO
   ========================================================= */
function voz() {
  const T = [["Distante", "Cercana", 82], ["Técnica", "Clara", 72], ["Exigente", "Motivadora", 75], ["Opinable", "Respaldada", 85], ["Infantil", "Juvenil", 64], ["Seria", "Lúdica", 58]];
  const box = $("#traits");
  box.innerHTML = T.map(([a, b, v]) => `<div class="trait"><span>${a}</span><div class="bar"><i data-v="${v}"></i></div><span>${b}</span></div>`).join("");
  box.addEventListener("revealed", () => setTimeout(() => $$("i", box).forEach(i => i.style.left = i.dataset.v + "%"), 200));

}

/* =========================================================
   05 — SIGNO
   ========================================================= */
function signo() {
  /* Anatomía: marcadores sobre un único trazado */
  const an = $("#anat"), al = $("#anatLogo"), hd = L.head;
  const [vx, vy, vw, vh] = VB;
  const pathD = L.parts[0].d;
  const MK = {
    p: `<path d="${pathD}" fill-rule="evenodd" fill="none" stroke="${C.celeste}" stroke-width="3.5"/><line x1="98.6" y1="81.1" x2="52" y2="289.7" stroke="${C.lima}" stroke-width="2.5" stroke-dasharray="6 5"/>`,
    cabeza: `<circle cx="${hd.cx}" cy="${hd.cy}" r="${hd.r + 7}" fill="none" stroke="${C.celeste}" stroke-width="4"/><circle cx="${hd.cx}" cy="${hd.cy}" r="${hd.r}" fill="${C.lima}" opacity=".85"/>`,
    k: `<path d="M64 222 Q150 128 250 155 Q262 160 270 163" fill="none" stroke="${C.lima}" stroke-width="9" stroke-linecap="round"/>`,
    cuerpo: `<path d="M222 170 Q150 172 100 222 Q75 250 58 284" fill="none" stroke="${C.celeste}" stroke-width="9" stroke-linecap="round"/><path d="M180 240 Q240 225 305 165" fill="none" stroke="${C.celeste}" stroke-width="6" stroke-linecap="round" stroke-dasharray="2 10"/>`
  };
  const fig = `<g class="anat-fig"><circle cx="${hd.cx}" cy="${hd.cy}" r="${hd.r + 6}" fill="none" stroke="${C.lima}" stroke-width="3"/><path d="M64 222 Q150 128 250 155" fill="none" stroke="${C.lima}" stroke-width="3"/><path d="M222 170 Q150 172 100 222 Q75 250 58 284" fill="none" stroke="${C.lima}" stroke-width="3"/>${[[64, 222], [150, 152], [250, 155], [222, 170], [100, 222], [58, 284]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="${C.lima}" stroke="#fff" stroke-width="2"/>`).join("")}</g>`;
  al.innerHTML = `<svg viewBox="${vx - 14} ${vy - 14} ${vw + 28} ${vh + 28}" style="width:72%;height:auto;overflow:visible"><path class="anat-base" d="${pathD}" fill-rule="evenodd" fill="${C.petroleo}" style="transition:opacity .4s"/>${Object.entries(MK).map(([k, v]) => `<g class="anat-mk" data-part="${k}" style="opacity:0;transition:opacity .35s">${v}</g>`).join("")}<g class="anat-fig-wrap" style="opacity:0;transition:opacity .4s">${fig}</g></svg>`;
  const hi = part => {
    $$(".anat-mk", al).forEach(g => g.style.opacity = g.dataset.part === part ? 1 : 0);
    $(".anat-base", al).style.opacity = part ? .35 : 1;
    $$("#anatList button").forEach(b => b.classList.toggle("is-on", b.dataset.part === part));
  };
  $$("#anatList button").forEach(b => { b.addEventListener("mouseenter", () => hi(b.dataset.part)); b.addEventListener("focus", () => hi(b.dataset.part)); b.addEventListener("click", () => hi(b.dataset.part)); });
  $("#anatList").addEventListener("mouseleave", () => hi(null));
  $("#explode").addEventListener("change", e => { $(".anat-fig-wrap", al).style.opacity = e.target.checked ? 1 : 0; });

  /* Construcción */
  const st = $("#constructStage");
  const x = X_MOD;
  let grid = ""; for (let gx = vx; gx <= vx + vw + 1; gx += x / 2) grid += `<line x1="${gx}" y1="${vy - x}" x2="${gx}" y2="${vy + vh + x}" stroke="${C.celeste}" stroke-width="${Math.round((gx - vx) / (x / 2)) % 2 ? .4 : .9}" opacity="${Math.round((gx - vx) / (x / 2)) % 2 ? .25 : .5}"/>`;
  for (let gy = vy + vh; gy >= vy - 1; gy -= x / 2) grid += `<line x1="${vx - x}" y1="${gy}" x2="${vx + vw + x}" y2="${gy}" stroke="${C.celeste}" stroke-width="${Math.round((vy + vh - gy) / (x / 2)) % 2 ? .4 : .9}" opacity="${Math.round((vy + vh - gy) / (x / 2)) % 2 ? .25 : .5}"/>`;
  const R = "#FF4D5E";
  const geo = `
    <circle cx="${hd.cx}" cy="${hd.cy}" r="${hd.r}" fill="none" stroke="${R}" stroke-width="1.6"/>
    <line x1="${hd.cx - hd.r}" y1="${hd.cy - hd.r - 10}" x2="${hd.cx + hd.r}" y2="${hd.cy - hd.r - 10}" stroke="${R}" stroke-width="1.2"/>
    <text x="${hd.cx}" y="${hd.cy - hd.r - 15}" fill="${R}" font-size="16" font-family="Poppins" font-weight="800" font-style="italic" text-anchor="middle">x</text>
    <rect x="${vx}" y="${vy}" width="${vw}" height="${vh}" fill="none" stroke="${C.lima}" stroke-width="1.4" stroke-dasharray="6 4"/>
    <line x1="98.6" y1="81.1" x2="52" y2="289.7" stroke="${C.verde}" stroke-width="1.4" stroke-dasharray="5 4"/>
    <line x1="330" y1="81.1" x2="283.3" y2="289.7" stroke="${C.verde}" stroke-width="1.4" stroke-dasharray="5 4"/>
    <line x1="52" y1="289.7" x2="52" y2="230" stroke="${C.verde}" stroke-width="1"/>
    <path d="M52 259.7 A30 30 0 0 1 58.5 260.4" fill="none" stroke="${C.verde}" stroke-width="1.2"/>
    <text x="60" y="252" fill="${C.verde}" font-size="15" font-family="Poppins" font-weight="800" font-style="italic">13°</text>
    <text x="${vx + vw + x * .55}" y="${vy + vh / 2}" fill="${R}" font-size="16" font-family="Poppins" font-weight="800" font-style="italic" text-anchor="middle">4,7x</text>
    <text x="${vx + vw / 2}" y="${vy + vh + x * .7}" fill="${R}" font-size="16" font-family="Poppins" font-weight="800" font-style="italic" text-anchor="middle">6x</text>`;
  st.innerHTML = `<svg class="main" viewBox="${vx - x * 1.2} ${vy - x * 1.2} ${vw + x * 2.4} ${vh + x * 2.4}"><g class="ov-grid">${grid}</g><g class="ov-logo"><path d="${pathD}" fill-rule="evenodd" fill="${C.petroleo}"/></g><g class="ov-geo">${geo}</g></svg>`;
  const upd = () => {
    $(".ov-grid", st).style.display = $("#cGrid").checked ? "" : "none";
    $(".ov-geo", st).style.display = $("#cGeo").checked ? "" : "none";
    $$(".ov-logo path", st).forEach(p => { const o = $("#cOutline").checked; p.setAttribute("fill", o ? "none" : C.petroleo); p.setAttribute("stroke", o ? C.petroleo : "none"); p.setAttribute("stroke-width", o ? 1.2 : 0); });
    $(".ov-logo", st).style.opacity = $("#cGrid").checked || $("#cGeo").checked ? .85 : 1;
  };
  ["#cGrid", "#cGeo", "#cOutline"].forEach(s => $(s).addEventListener("change", upd)); upd();

  /* Versiones */
  const VER = [["h", "Isologo", "Versión principal: el isotipo hace de P en PIKI, con la bajada. Web, papelería, firmas, encabezados."], ["v", "Logotipo", "Lectura tipográfica: PIKI, línea y bajada. Banners, merch, prensa y espacios donde el isotipo ya está presente."], ["iso", "Isotipo", "La P sola. Avatar, ícono de app, favicon, bug de video."]];
  $("#versions").innerHTML = VER.map(([k, n, d]) => `<div class="version"><div class="v-art"><span class="lg" data-lg="${k}" style="color:var(--petroleo);width:${k === "v" ? "62%" : k === "iso" ? "55%" : "80%"}"></span></div><div class="v-info"><b>${n}</b><small>${d}</small><div class="v-dl"><a class="btn btn--line btn--sm" href="assets/logo/piki-${k === "h" ? "isologo" : k === "v" ? "logotipo" : "isotipo"}-petroleo.svg" download>SVG</a><button class="btn btn--line btn--sm" data-gen="${k}">PNG</button></div></div></div>`).join("");
  $("#versions").addEventListener("click", e => { const b = e.target.closest("[data-gen]"); if (b) exportPNG(b.dataset.gen, C.petroleo, null, 2048); });


  /* Área de resguardo */
  const sb = $("#safeBox");
  const drawSafe = v => {
    const avail = Math.min(sb.parentElement.clientWidth * .62, 900), ratioV = { h: ISOLOGO_W / 1000, v: LOGOTIPO_W / 1000, iso: ISO_W / 1000 }[v];
    const H = Math.min(v === "iso" ? 180 : 160, avail / ratioV);
    /* x = cabeza del isotipo / del isologo; en el logotipo, el ancho del asta de la I */
    const xm = v === "iso" ? H * X_MOD / VB[3] : v === "h" ? H * IL.head.r * 2 / IL.vb[3] : H * (LT.letterBoxes[1][1] - LT.letterBoxes[1][0]) / LT.vb[3];
    const pad = xm;
    sb.style.setProperty("--x", pad + "px");
    sb.innerHTML = `<div class="inner"><span class="lg" data-lg="${v}" style="color:var(--petroleo);height:${H}px;display:block"></span></div>` +
      `<span class="x-mark" style="top:0;left:0;right:0;height:${pad}px">x</span><span class="x-mark" style="bottom:0;left:0;right:0;height:${pad}px">x</span><span class="x-mark" style="left:0;top:0;bottom:0;width:${pad}px">x</span><span class="x-mark" style="right:0;top:0;bottom:0;width:${pad}px">x</span>`;
    mountLogos(sb);
  };
  let safeV = "h";
  seg($("#safeVer"), d => { safeV = d.v; drawSafe(safeV); });
  $("#safeOn").addEventListener("change", e => sb.classList.toggle("is-on", e.target.checked));
  drawSafe("h");
  /* se vuelve a dibujar si cambia el ancho (girar el celular, achicar la ventana) */
  addEventListener("resize", () => drawSafe(safeV));

  /* Tamaño mínimo: se elige la versión; cada una tiene su mínimo */
  const ms = $("#minStage"), mr = $("#minRange");
  const MINS = { h: 48, v: 54, iso: 16 };
  let minV = "h";
  const updMin = () => {
    const v = +mr.value; $("#minLogo").style.height = v + "px";
    $("#minPx").textContent = v + " px"; $("#minMm").textContent = Math.round(v * 0.2646) + " mm";
    const ok = v >= MINS[minV]; const o = $("#minOk"); o.textContent = ok ? "Legible" : "Debajo del mínimo"; o.className = "min-ok " + (ok ? "ok" : "bad");
  };
  const MIN_INFO = {
    h: ["48 px de alto. Por debajo, usamos la versión sin bajada (P + IKI).", "13 mm de alto.", "La bajada “Recuperación para deportistas” es el elemento más chico del isologo: por debajo de 48 px deja de leerse y los vacíos de la P empiezan a cerrarse. Si el espacio es menor, lo usamos sin bajada o lo reemplazamos por el isotipo."],
    v: ["54 px de alto.", "14 mm de alto.", "Las letras de PIKI aguantan tamaños chicos, pero la bajada y la línea se pierden por debajo de 54 px. En espacios menores pasamos al isotipo."],
    iso: ["16 px de alto (favicon).", "6 mm de alto.", "Es la versión más compacta del sistema: la cabeza y la curva siguen leyéndose hasta 16 px. Por debajo, los vacíos de la P se cierran y el signo pierde la lectura de la persona."]
  };
  const drawMin = () => {
    const [dg, im, pq] = MIN_INFO[minV];
    $("#minInfo").innerHTML = `<div class="card"><h4>Digital</h4><p>${dg}</p></div><div class="card"><h4>Impreso</h4><p>${im}</p></div><div class="card"><h4>Por qué</h4><p>${pq}</p></div>`;
    ms.innerHTML = `<span class="lg" data-lg="${minV}" data-tag="1" id="minLogo" style="color:var(--petroleo);height:${mr.value}px;display:block"></span>`;
    mountLogos(ms); updMin();
  };
  seg($("#minVer"), d => { minV = d.v; drawMin(); });
  mr.addEventListener("input", updMin); drawMin();

  /* Versiones cromáticas: se elige qué versión mostrar */
  const CH = [["Petróleo sobre crema", "#EFEEE7", C.petroleo, "Principal"], ["Celeste sobre crema", "#EFEEE7", C.celeste, "Secundaria"], ["Negro sobre blanco", "#FFFFFF", "#000000", "1 tinta"], ["Blanco sobre negro", "#000000", "#FFFFFF", "1 tinta"], ["Petróleo sobre lima", C.lima, C.petroleo, "Sobre acento"], ["Blanco sobre petróleo", C.petroleo, "#FFFFFF", "Negativa"], ["Blanco sobre degradé", `radial-gradient(circle at 80% 90%, ${C.celeste}, transparent 60%), ${C.petroleo}`, "#FFFFFF", "Negativa"], ["Blanco sobre celeste", C.celeste, "#FFFFFF", "Negativa"], ["Lima sobre petróleo", C.petroleo, C.lima, "Acento"]];
  const drawChroma = k => {
    $("#chroma").innerHTML = CH.map(([n, bg, fg, tag]) => `<div class="c" style="background:${bg};color:${fg};border:1px solid var(--line)"><span class="lg lg-${k}" data-lg="${k}" data-tag="1" style="color:${fg}"></span><span>${n}</span>${tag ? `<em style="background:${fg};color:${bg.startsWith("radial") ? C.petroleo : bg}">${tag}</em>` : ""}</div>`).join("");
    mountLogos($("#chroma"));
  };
  seg($("#chromaVer"), d => drawChroma(d.v)); drawChroma("h");

  /* Sobre fotografía */
  const PH = {
    ok: ["", "#fff", "Sobre fotografías el signo va en blanco (o petróleo sobre fondos claros) en una zona de bajo ruido visual, respetando el área de resguardo. Si el fondo es complejo aplicamos un velo petróleo del 40–60%.", { left: "7%", top: "9%" }],
    low: ["rgba(79,209,230,.75)", "#9FE6F1", "Incorrecto: el signo pierde contraste con el fondo. Cuando el fondo es claro o de color medio, usar la versión petróleo o aplicar un velo.", { left: "7%", top: "9%" }],
    busy: ["", "#fff", "Incorrecto: el signo no puede superponerse a la figura ni competir con el rostro del deportista. Ubicarlo en el área libre de la composición.", { left: "48%", top: "38%" }]
  };
  let phV = "h", phM = "ok";
  const drawPhoto = () => {
    const p = PH[phM], el = $("#photoLogo");
    el.innerHTML = logoSVG(phV, "currentColor").svg; el.dataset.v = phV;
    el.style.color = p[1]; Object.assign(el.style, p[3]);
    $("#photoOv").style.background = p[0]; $("#photoTxt").textContent = p[2];
  };
  seg($("#photoMode"), d => { phM = d.m; drawPhoto(); });
  seg($("#photoVer"), d => { phV = d.v; drawPhoto(); });
  drawPhoto();

  /* Convivencia */
  const CB = {
    co: [`<span class="lg" data-lg="h" style="color:var(--petroleo);height:60px;display:block"></span><span class="div"></span><span class="lg" data-lg="v" style="color:${C.carbon};height:60px;display:block" title="Marca aliada (ejemplo)"></span>`, "En co-branding ambas marcas tienen el mismo peso visual: igual altura óptica, separadas por un filete vertical y con una distancia de 2x entre cada signo y el filete. Piki va siempre a la izquierda cuando es organizador."],
    spon: [`<div style="display:grid;gap:16px;justify-items:center"><span class="lg" data-lg="h" style="color:var(--petroleo);height:56px;display:block"></span><div style="font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-2);font-weight:600">Acompañan</div><div style="display:flex;gap:30px;flex-wrap:wrap;justify-content:center;align-items:center">${["v", "iso", "h"].map(k => `<span class="lg" data-lg="${k}" data-tag="0" style="color:${C.piedra};height:28px;display:block" title="Sponsor (ejemplo)"></span>`).join("")}</div></div>`, "Los sponsors se agrupan en una franja inferior, en versión monocroma (piedra, blanco o negro) y con una altura máxima del 50% del signo de Piki, bajo el título “Acompañan”."],
    inst: [`<div style="display:flex;align-items:center;gap:34px"><span class="lg" data-lg="h" style="color:var(--petroleo);height:60px;display:block"></span><span class="div"></span><span style="height:60px;align-content:start;display:grid;gap:6px;justify-items:start;font-size:12px;color:var(--ink-2);line-height:12px">Un proyecto de<img src="assets/img/uade.svg" alt="UADE" style="height:27.7px;width:auto;display:block"></span></div>`, "Con instituciones educativas o de salud, el signo institucional se presenta como respaldo con la fórmula “Un proyecto de” o “Con el aval de”, en monocromo y a la derecha del filete."]
  };
  const cbShow = m => { $("#cbRow").innerHTML = CB[m][0]; $("#cbTxt").textContent = CB[m][1]; mountLogos($("#cbRow")); };
  seg($("#cbMode"), d => cbShow(d.m)); cbShow("co");
}

/* =========================================================
   06 — COLOR
   ========================================================= */
const hexRgb = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const rgbCmyk = ([r, g, b]) => { const R = r / 255, G = g / 255, B = b / 255, K = 1 - Math.max(R, G, B); if (K === 1) return [0, 0, 0, 100]; return [(1 - R - K) / (1 - K), (1 - G - K) / (1 - K), (1 - B - K) / (1 - K), K].map(v => Math.round(v * 100)); };
const lum = h => { const a = hexRgb(h).map(v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); }); return .2126 * a[0] + .7152 * a[1] + .0722 * a[2]; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + .05) / (y + .05); };
const inkOn = h => ratio(h, "#FFFFFF") >= ratio(h, C.petroleo) ? "#FFFFFF" : C.petroleo;
function color() {
  const MAIN = [["Petróleo", C.petroleo, "3035 C", "Color institucional. Fondos, textos, acciones primarias."], ["Celeste", C.celeste, "3135 C", "Estructura, acciones secundarias, recursos gráficos."], ["Lima", C.lima, "2297 C", "Acento. Palabras clave, fechas, CTA."], ["Verde", C.verde, "362 C", "Confirmaciones, estados positivos."], ["Crema", C.crema, "—", "Fondo principal en claro. Reemplaza al blanco."], ["Carbón", C.carbon, "Neutral Black C", "Textos largos sobre claro, monocromos."]];
  const SEC = [["Piedra", C.piedra], ["Arena", C.arena], ["Niebla", C.niebla], ["Blanco", C.blanco], ["Abismo", C.abismo], ["Agua", C.agua], ["Oliva", C.oliva]];
  const sw = ([n, h, p, u], big) => {
    const rgb = hexRgb(h), cmyk = rgbCmyk(rgb), ink = inkOn(h);
    return `<button class="sw" data-hex="${h}" aria-label="Copiar ${n} ${h}"><div class="chip" style="background:${h};color:${ink};${h === C.blanco || h === C.crema ? "box-shadow:inset 0 -1px 0 var(--line)" : ""}"><b>${n}</b><span class="copy-hint">Copiar</span></div><div class="vals"><span>HEX <i>${h}</i></span><span>RGB <i>${rgb.join(" ")}</i></span><span>CMYK <i>${cmyk.join(" ")}</i></span>${big ? `<span>Pantone <i>${p}</i></span>` : ""}</div>${big ? `<div class="use">${u}</div>` : ""}</button>`;
  };
  $("#swMain").innerHTML = MAIN.map(m => sw(m, true)).join("");
  $("#swSec").innerHTML = SEC.map(m => sw(m, false)).join("");
  document.addEventListener("click", e => { const b = e.target.closest(".sw"); if (b) copy(b.dataset.hex, `${b.dataset.hex} copiado`); });

  const PR = [["Petróleo 40%", C.petroleo, 40], ["Crema 25%", C.crema, 25], ["Celeste 15%", C.celeste, 15], ["Lima 10%", C.lima, 10], ["Blanco 5%", "#fff", 5], ["Verde 5%", C.verde, 5]];
  $("#proportion").innerHTML = `<div class="proportion__bar">${PR.map(([n, c, v]) => `<i style="flex:${v};background:${c}"></i>`).join("")}</div>` +
    `<ul class="proportion__legend">${PR.map(([n, c, v]) => `<li style="--f:${v}"><i style="background:${c}"></i><b>${v}%</b><span>${n.replace(/ \d+%$/, "")}</span></li>`).join("")}</ul>`;

  const SEM = [["Acción", "#22F0BF", "Botón principal"], ["Correcto", "#3DDC97", "Zona óptima"], ["Error", "#FF4D5E", "Dolor · misión fallida"], ["Alerta", "#FF8A3D", "Molestia · CTA juego"], ["Nutrición", "#FFD93D", "Energía · fatiga"], ["Calma", "#B388FF", "Respiración · rigidez"], ["Fondo", "#04131F", "Base del juego"], ["Panel", "#0D1C30", "Tarjetas y HUD"]];
  $("#semantic").innerHTML = SEM.map(([n, h, u]) => `<div class="s" data-hex="${h}"><i style="background:${h};${h.startsWith("#0") ? "border:1px solid #23395A" : ""}"></i><b>${n}</b>${h}<br>${u}</div>`).join("");
  $("#semantic").addEventListener("click", e => { const s = e.target.closest(".s"); if (s) copy(s.dataset.hex, `${s.dataset.hex} copiado`); });

  /* Contraste */
  const OPTS = [C.petroleo, C.celeste, C.lima, C.verde, C.crema, C.carbon, "#FFFFFF", C.abismo, C.agua];
  let fg = C.petroleo, bg = C.crema;
  const dots = (box, cur, set) => { box.insertAdjacentHTML("beforeend", OPTS.map(c => `<button class="cdot ${c === cur ? "is-on" : ""}" data-c="${c}" style="background:${c}" aria-label="${c}"></button>`).join("")); box.addEventListener("click", e => { const b = e.target.closest(".cdot"); if (!b) return; $$(".cdot", box).forEach(x => x.classList.toggle("is-on", x === b)); set(b.dataset.c); upd(); }); };
  const upd = () => {
    const r = ratio(fg, bg), p = $("#ctPreview"); p.style.background = bg; p.style.color = fg;
    $("#ctRatio").textContent = r.toFixed(2) + ":1";
    const B = [["AA texto", r >= 4.5], ["AA grande", r >= 3], ["AAA texto", r >= 7]];
    $("#ctBadges").innerHTML = B.map(([n, ok]) => `<span class="${ok ? "ok" : "no"}">${ok ? "✓" : "✕"} ${n}</span>`).join("");
  };
  dots($("#ctFg"), fg, c => fg = c); dots($("#ctBg"), bg, c => bg = c); upd();

  const MX = [["Petróleo", C.petroleo], ["Celeste", C.celeste], ["Lima", C.lima], ["Crema", C.crema], ["Blanco", "#FFFFFF"], ["Carbón", C.carbon]];
  let mx = `<div class="lbl"></div>` + MX.map(([n]) => `<div class="lbl" style="justify-content:center">${n}</div>`).join("");
  MX.forEach(([n, f]) => { mx += `<div class="lbl">${n}</div>`; MX.forEach(([, b]) => { const r = ratio(f, b); mx += f === b ? `<div style="background:var(--surface-2)"></div>` : `<div style="background:${b};color:${f};${r < 3 ? "opacity:.35;text-decoration:line-through" : ""};border:1px solid var(--line)" title="${r.toFixed(2)}:1">${r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "Grande" : "✕"}</div>`; }); });
  $("#matrix").innerHTML = mx;
}

/* =========================================================
   07 — TIPOGRAFÍA
   ========================================================= */
function tipografia() {
  seg($("#popW"), d => { $("#popBig").style.fontWeight = d.w; $("#popChars").style.fontWeight = d.w; });
  const t = $("#tText"), fam = $("#tFam"), w = $("#tW"), s = $("#tS");
  const cBox = $("#tC");
  [C.petroleo, C.celeste, C.carbon, C.verde].forEach((c, i) => cBox.insertAdjacentHTML("beforeend", `<button class="${i ? "" : "is-on"}" data-c="${c}" style="background:${c};width:24px;height:24px" aria-label="${c}"></button>`));
  cBox.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; $$("button", cBox).forEach(x => x.classList.toggle("is-on", x === b)); t.style.color = b.dataset.c; });
  const upd = () => { t.style.fontFamily = "Poppins"; t.style.fontStyle = fam.value === "italic" ? "italic" : "normal"; t.style.fontWeight = w.value; t.style.fontSize = `min(${s.value}px, 11vw)`; $("#tSv").textContent = s.value + " px"; };
  [fam, w, s].forEach(x => x.addEventListener("input", upd)); upd();

  /* Jerarquía de la app: H1–H6 y P1–P3 */
  const H = [
    ["H1", "Poppins Bold · 32 / 38 px", "¿Cómo estás hoy?", "700", 32],
    ["H2", "Poppins SemiBold · 28 / 34 px", "Recuperá", "600", 28],
    ["H3", "Poppins Medium · 24 / 30 px", "Mapa corporal de frente", "500", 24],
    ["H4", "Poppins Medium · 20 / 26 px", "Acciones rápidas", "500", 20],
    ["H5", "Poppins SemiBold · 16 / 22 px", "Batería del día", "600", 16],
    ["H6", "Poppins Bold · 14 / 19 px", "Estado actual", "700", 14],
    ["P1", "Poppins Regular · 18 / 28 px", "Una jornada para conocer Piki y aprender a recuperarte.", "400", 18],
    ["P2", "Poppins Regular · 16 / 24 px", "Tocá las zonas donde sentís algo hoy. Podés seleccionar varias.", "400", 16],
    ["P3", "Poppins Medium · 14 / 20 px", "15 min · Recuperación activa", "500", 14],
  ];
  $("#hier").innerHTML = H.map(([k, sp, ex, wt, sz]) => `<tr><td class="k">${k}</td><td class="spec"><b>${sp.split("·")[0]}</b>·${sp.split("·").slice(1).join("·")}</td><td class="ex" style="font-weight:${wt};font-size:min(${sz}px, 9vw);line-height:1.15">${ex}</td></tr>`).join("");
}

/* =========================================================
   08 — ÍCONOS
   ========================================================= */
function iconografia() {
  const box = $("#icons");
  const names = Object.keys(ICONS).filter(n => !window.PIKI_UI_ONLY.includes(n)).concat(["mail", "web", "redes", "remera", "descargar", "copiar", "buscar", "check", "cerrar", "play"]);
  box.innerHTML = names.map(n => `<button class="ico" data-n="${n}" data-k="${(ICONS[n][0] + " " + ICONS[n][1] + " " + n).toLowerCase()}" title="Descargar ${ICONS[n][0]}">${iconSVG(n, 24)}<span>${ICONS[n][0]}</span><span class="dl">SVG ↓</span></button>`).join("");
  const norm = t => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  $("#iconSearch").addEventListener("input", e => { const q = norm(e.target.value); $$(".ico", box).forEach(i => i.style.display = norm(i.dataset.k).includes(q) ? "" : "none"); });
  $("#iconSize").addEventListener("input", e => { box.style.setProperty("--isz", e.target.value + "px"); $("#iconSizeV").textContent = e.target.value + " px"; });
  seg($("#iconMode"), d => box.classList.toggle("is-dark", d.m === "game"));
  box.addEventListener("click", e => { const b = e.target.closest(".ico"); if (!b) return; download(`piki-icono-${b.dataset.n}.svg`, new Blob([iconSVG(b.dataset.n, 24).replace('stroke="currentColor"', `stroke="${C.petroleo}"`)], { type: "image/svg+xml" })); toast(`Ícono “${ICONS[b.dataset.n][0]}” descargado`); });
  let g = ""; for (let i = 0; i <= 24; i++) g += `<line x1="${i}" y1="0" x2="${i}" y2="24" stroke="${C.celeste}" stroke-width="${i % 2 ? .03 : .06}" opacity=".6"/><line x1="0" y1="${i}" x2="24" y2="${i}" stroke="${C.celeste}" stroke-width="${i % 2 ? .03 : .06}" opacity=".6"/>`;
  $("#iconGrid").innerHTML = `<svg viewBox="-1 -1 26 26" style="position:absolute;inset:0;width:100%;height:100%">${g}<rect x="2" y="2" width="20" height="20" fill="rgba(185,211,57,.15)" stroke="${C.lima}" stroke-width=".1"/><circle cx="12" cy="12" r="10" fill="none" stroke="#FF4D5E" stroke-width=".08" stroke-dasharray=".4 .3"/></svg><svg class="ic" viewBox="-1 -1 26 26" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS["sueno"][2]}</svg>`;
}

/* =========================================================
   09 — RECURSOS
   ========================================================= */
function recursos() {
  const a = $("#athlete"), tip = $("#jointTip");
  let key = "futbol", col = C.celeste;
  const draw = () => { a.innerHTML = athleteHTML(key, col); a.classList.remove("is-on"); requestAnimationFrame(() => setTimeout(() => a.classList.toggle("is-on", $("#jOn").checked), 50)); };
  draw();
  seg($("#jColor"), d => { col = d.c; draw(); });
  seg($("#jAth"), d => { key = d.a; draw(); });
  $("#jOn").addEventListener("change", e => a.classList.toggle("is-on", e.target.checked));
  a.addEventListener("mousemove", e => {
    const j = e.target.closest(".joint");
    if (!j) { tip.classList.remove("is-on"); return; }
    const k = j.dataset.j, st = $("#jointStage").getBoundingClientRect(), r = j.getBoundingClientRect();
    tip.textContent = k === "a" ? `${JNAME.a} · ${JTIP.a}` : `${JNAME[k[0]]} ${k[1] === "i" ? "izquierdo/a" : "derecho/a"} · ${JTIP[k[0]]}`;
    tip.style.left = (r.left + r.width / 2 - st.left) + "px"; tip.style.top = (r.top - st.top) + "px"; tip.classList.add("is-on");
  });
  a.addEventListener("mouseleave", () => tip.classList.remove("is-on"));
}

/* =========================================================
   10 — FOTO Y VIDEO
   ========================================================= */
function fotografia() {
  const cmp = $("#compare"), r = $("input", cmp);
  r.addEventListener("input", () => cmp.style.setProperty("--cut", r.value + "%"));
  $("#gallery").innerHTML = ["voley", "futbol", "boxeo", "rugby", "hockey", "running", "voley2", "basquet-adaptado", "tenis", "basquet", "hockey2", "natacion"]
    .map(k => `<button aria-label="${k}"><img src="assets/img/${k}.webp" alt="Deportista: ${k}" loading="lazy"></button>`).join("");
  /* Video en sus 4 formatos: la miniatura elegida cambia el video y conserva el punto de reproducción */
  const vp = $("#vpVideo"), vf = $("#vpFormats");
  new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) vp.play().catch(() => {}); else vp.pause(); }), { threshold: .35 }).observe(vp);
  vf.addEventListener("click", e => {
    const b = e.target.closest(".fmt"); if (!b || b.classList.contains("is-on")) return;
    $$(".fmt", vf).forEach(x => x.classList.toggle("is-on", x === b));
    const t = vp.currentTime;
    $("#vplayer").style.setProperty("--ar", b.dataset.ar);
    vp.poster = `assets/video/posters/${b.dataset.src}.webp`; vp.src = `assets/video/${b.dataset.src}.mp4?v=2`;
    vp.setAttribute("aria-label", `Video de Piki en formato ${b.dataset.r}`);
    $("#vpNote").textContent = `${b.dataset.r} · ${b.dataset.u}`;
    vp.addEventListener("loadedmetadata", () => { vp.currentTime = Math.min(t, vp.duration || t); vp.play().catch(() => {}); }, { once: true });
  });
}

/* =========================================================
   USOS CORRECTOS E INCORRECTOS DEL SIGNO
   ========================================================= */
function usos() {
  const ok = $("#usosOk"), no = $("#usosNo"); if (!ok || !no) return;
  const lg = (v, fill, style = "") => `<span class="usos__lg usos__lg--${v}" style="${style}">${logoSVG(v, fill).svg}</span>`;
  const foto = (veil, inner) => `<img src="assets/img/futbol.webp" alt="" loading="lazy">${veil ? `<i class="usos__veil"></i>` : ""}${inner}`;
  const card = (cls, bg, inner, t, d) => `<figure class="usos__card usos__card--${cls}"><div class="usos__art" style="background:${bg}">${inner}</div><figcaption><b>${t}</b><small>${d}</small></figcaption></figure>`;
  const draw = v => {
    const OK = [
      [C.crema, lg(v, C.petroleo), "Petróleo sobre crema", "Es la versión principal: la usamos siempre que el fondo es claro."],
      [C.petroleo, lg(v, "#fff"), "Blanco sobre petróleo", "La versión negativa, sobre el color institucional."],
      [C.lima, lg(v, C.petroleo), "Petróleo sobre lima", "Sobre el color de acento, el signo va siempre en petróleo."],
      ["#000", foto(true, lg(v, "#fff")), "Sobre fotografía con velo", "En blanco, sobre una zona tranquila de la foto y con un velo petróleo del 40 al 60 %."],
    ];
    const tipo = v === "iso"
      ? [C.crema, `<span class="usos__crop">${lg(v, C.petroleo)}</span>`, "No recortar el signo", "La P se muestra siempre completa, con su área de resguardo."]
      : [C.crema, `<span class="usos__font">${v === "h" ? logoSVG("iso", C.petroleo).svg : ""}<b>PIKI</b></span>`, "No cambiar la tipografía", "No escribimos PIKI con otra fuente: usamos siempre los archivos del logo."];
    const NO = [
      [C.crema, lg(v, C.petroleo, "transform:scaleX(1.45)"), "No deformar", "No lo estiramos ni lo comprimimos: siempre se escala de forma proporcional."],
      [C.crema, lg(v, C.petroleo, "transform:rotate(-14deg)"), "No rotar", "No cambiamos su ángulo: la inclinación ya está dibujada en el signo."],
      [C.crema, lg(v, "#E5484D"), "No usar otros colores", "Solo petróleo, celeste, negro o blanco, según el fondo."],
      [C.celeste, lg(v, C.lima), "No combinar con bajo contraste", "Lima sobre celeste, o crema sobre blanco, no se leen."],
      [C.crema, lg(v, C.petroleo, "filter:drop-shadow(6px 8px 0 rgba(0,72,86,.35))"), "No agregar efectos", "Sin sombras, brillos, biseles ni degradés sobre el signo."],
      [C.crema, lg(v, "none", `stroke:${C.petroleo};stroke-width:1.6px`), "No usar en contorno", "El signo va siempre relleno, nunca solo con su línea."],
      ["#000", foto(false, lg(v, C.petroleo)), "No ubicar sobre fondos con ruido", "Sin velo y sobre una zona cargada de la foto, el signo se pierde."],
      tipo,
    ];
    ok.innerHTML = OK.map(([bg, inner, t, d]) => card("ok", bg, inner, t, d)).join("");
    no.innerHTML = NO.map(([bg, inner, t, d]) => card("no", bg, inner, t, d)).join("");
  };
  seg($("#usosVer"), d => draw(d.v)); draw("h");
}

/* =========================================================
   11 — UI
   ========================================================= */
function ui() {
  /* UI kit: componentes de Piki App exportados de Figma. Cada uno trae sus variantes; el clic cambia de variante */
  const show = (el, i) => {
    const vs = $$(".pkc__v", el); i = (i + vs.length) % vs.length;
    vs.forEach((v, k) => v.classList.toggle("is-on", k === i)); el.dataset.i = i;
    const item = el.closest(".uik__item"), st = item?.querySelector(".uik__state"); if (st) st.querySelector("i").textContent = stateName(el, i, vs.length);
    if (item && el.dataset.mode !== "spinner") $$(".uik__st", item).forEach(b => b.classList.toggle("is-on", +b.dataset.i === i));
  };
  /* estados documentados (js/uik-states.js): nombre y para qué se usa cada uno */
  const ST = window.PIKI_UIK_STATES || {};
  const statesOf = el => ST[el.getAttribute("aria-label")];
  /* nombre legible del estado (en Figma se llaman "Variante 2", "Estado 3"…) */
  const stateName = (el, i, n) => {
    const doc = statesOf(el); if (doc && doc[i]) return doc[i][0];
    const m = el.dataset.mode;
    if (m === "zone") return ["Sin marcar", "Fatiga", "Molestia", "Dolor"][i];
    if (m === "scale5") return i ? `Valor ${i} de 5` : "Sin elegir";
    if (m === "toggle") return i ? "Activo" : "Normal";
    if (m === "spinner") return "Cargando";
    if (m === "zonewin") return "Abierta";
    return `Estado ${i + 1} de ${n}`;
  };
  const fitThumbs = () => $$(".uik__thumb").forEach(t => {
    const inn = t.firstElementChild, c = inn && inn.firstElementChild; if (!c) return;
    const w = c.offsetWidth, h = c.offsetHeight, avail = t.clientWidth - 12; if (!w || avail <= 0) return;
    const k = Math.min(1, avail / w); inn.style.transform = `scale(${k})`; t.style.height = Math.ceil(h * k + 12) + "px";
  });
  const fitUik = () => { fitThumbs(); fitMain(); };
  const fitMain = () => $$(".pkc-fit").forEach(f => {
    const el = $(".pkc", f), v = $(".pkc__v.is-on > *", el); if (!v) return;
    /* PAD: aire para que los bordes de Figma (que caen justo en el límite del componente) no se recorten */
    const PAD = 6, w = v.offsetWidth, h = v.offsetHeight, avail = f.clientWidth - PAD * 2; if (!w || avail <= 0) return;
    const k = Math.min(1, avail / w); el.style.transform = k < 1 ? `scale(${k})` : ""; f.style.height = Math.ceil(h * k + PAD * 2) + "px";
  });
  $$(".pkc").forEach(el => {
    const doc = statesOf(el), item = el.closest(".uik__item"); if (!doc || !item) return;
    const vs = $$(".pkc__v", el), spin = el.dataset.mode === "spinner";
    const box = document.createElement("div"); box.className = "uik__states";
    box.innerHTML = `<p class="uik__states-h">${doc.filter(Boolean).length > 1 ? "Estados" : "Estado"}</p>`;
    doc.forEach((d, i) => {
      if (!d || !vs[i]) return;
      const b = document.createElement(spin ? "div" : "button"); b.className = "uik__st"; b.dataset.i = i;
      b.innerHTML = `<span class="uik__thumb" aria-hidden="true"><span class="uik__thumb-in">${vs[i].innerHTML}</span></span><b>${d[0]}</b><small>${d[1]}</small>`;
      if (!spin) { b.type = "button"; b.addEventListener("click", () => { show(el, i); fitUik(); }); }
      box.appendChild(b);
    });
    item.appendChild(box);
  });
  $$(".pkc").forEach(el => {
    const mode = el.dataset.mode, n = $$(".pkc__v", el).length;
    show(el, +(el.dataset.start || 0));
    if (mode === "spinner") { let i = 0; setInterval(() => { if (el.offsetParent) show(el, ++i); }, 140); return; }
    /* el componente no se toca: los estados se eligen solo con los botones de la galería */
    el.removeAttribute("role"); el.removeAttribute("tabindex"); return;
    el.addEventListener("click", e => {
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height, cur = +(el.dataset.i || 0);
      if (mode.startsWith("cols:")) { const [, cols, ord] = mode.split(":"), map = ord.split(",").map(Number); show(el, map[Math.min(+cols - 1, Math.floor(x * +cols))]); }
      else if (mode === "scale5") { if (y > .25) show(el, 1 + Math.min(4, Math.floor(x * 5))); }
      else if (mode === "grid2") { const idx = (y < .5 ? 0 : 2) + (x < .5 ? 0 : 1); show(el, cur === idx + 1 ? 0 : idx + 1); }
      else if (mode === "zonewin") { if (y > .35) { const z = $('.pkc[data-mode="zone"]'); if (z) show(z, 1 + Math.min(2, Math.floor(x * 3))); } }
      else if (mode === "zone") show(el, cur + 1);
      else show(el, cur + 1);
      fitUik();
    });
    el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(el, +(el.dataset.i || 0) + 1); } });
  });
  addEventListener("resize", fitUik);
  new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) fitUik(); })).observe($("#ui"));
  fitUik();
}

/* =========================================================
   12 — PLATAFORMAS
   ========================================================= */
function plataformas() {

  /* Web: el sitio real en un navegador. Escritorio a 1280 × 800 (escalado al ancho de la columna) o celular a 390 × 844 */
  const webB = $("#webBrowser"), webIf = $("#webIframe"), webDev = $("#webDev");
  const WEB = { desk: [1280, 800], mob: [390, 844] };
  let webD = "desk";
  const fitWeb = () => {
    const w = $("#webStage").clientWidth; if (!w) return;
    const [vw, vh] = WEB[webD], k = Math.min(1, w / vw);
    webB.style.setProperty("--vw", vw + "px"); webB.style.setProperty("--vh", vh + "px"); webB.style.setProperty("--wk", k);
    webB.classList.toggle("is-mob", webD === "mob");
  };
  new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { if (!webIf.src) webIf.src = webIf.dataset.src; fitWeb(); } }), { rootMargin: "200px" }).observe(webB);
  addEventListener("resize", fitWeb);
  $('[data-picker="dig"] .piece-list').addEventListener("click", () => setTimeout(fitWeb, 0));
  seg(webDev, d => { webD = d.d; fitWeb(); });
  fitWeb();

  /* App: primero las pantallas (imágenes fijas); el prototipo de Figma se carga solo si se elige */
  const proto = $("#appProto"), shot = $("#appScreen"), appImg = $("#appImg"), appChips = $("#appChips"), modeSeg = $("#appMode"), ph = $("#iphone");
  /* el teléfono se muestra al 82% (proporcional) y se achica más solo si no entra en la columna */
  const PHONE_SCALE = .82;
  const fitPhone = () => { const w = ph.closest(".app-real").clientWidth; if (!w) return; ph.style.setProperty("--k", Math.min(PHONE_SCALE, w / ph.offsetWidth)); };
  addEventListener("resize", fitPhone);
  $('[data-picker="dig"] .piece-list').addEventListener("click", () => setTimeout(fitPhone, 0));
  new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) fitPhone(); })).observe(ph);
  const setMode = m => {
    const p = m === "proto";
    if (p && !proto.src) proto.src = proto.dataset.src;
    proto.hidden = !p; shot.hidden = p; ph.classList.toggle("is-proto", p);
    $$("button", modeSeg).forEach(x => x.classList.toggle("is-on", x.dataset.m === m));
    fitPhone();
  };
  seg(modeSeg, d => setMode(d.m));
  appChips.addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    setMode("screens");
    $$("button", appChips).forEach(x => x.classList.toggle("is-on", x === b));
    appImg.src = `assets/app/app-${b.dataset.s}.webp`; appImg.alt = `Pantalla de ${b.textContent} de Piki App`;
    $("#appCaption").textContent = b.dataset.d;
  });

  /* Juego: build web de Unity embebido. Se carga recién al tocar "Jugar ahora" (pesa varios MB) */
  const gIf = $("#gameIframe"), gFr = $("#gameFrame");
  /* la build de Unity dibuja un lienzo fijo de 960 × 600: se escala para que ocupe todo el ancho de la columna */
  const fitGame = () => { const w = $("#gameEmbed").clientWidth; if (w) gFr.style.setProperty("--g", w / 960); };
  addEventListener("resize", fitGame);
  $('[data-picker="dig"] .piece-list').addEventListener("click", () => setTimeout(fitGame, 0));
  new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) fitGame(); })).observe($("#gameEmbed"));
  $("#gamePlay").addEventListener("click", () => { if (!gIf.src) gIf.src = gIf.dataset.src; $("#gameCover").hidden = true; gIf.focus(); });
  $("#gameFull").addEventListener("click", () => { if (!gIf.src) $("#gamePlay").click(); (gFr.requestFullscreen || gFr.webkitRequestFullscreen).call(gFr); });

  /* Instagram: posteos e historias reales de @piki.oficial (ver js/ig-data.js) */
  const IGD = window.PIKI_IG, feedPosts = IGD.posts.slice().reverse(); /* en el feed, lo más nuevo arriba */
  const fmtCap = t => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\n/g, "<br>").replace(/(#[\wÁÉÍÓÚáéíóúñÑ]+)/g, '<span class="hash">$1</span>');
  const showPost = i => {
    const p = feedPosts[i];
    $("#igDetailImg").src = `assets/redes/${p.f}.webp?v=3`; $("#igDetailImg").alt = p.t;
    $("#igDetailCap").innerHTML = fmtCap(p.c);
    $$("#igFeed button").forEach((b, k) => b.classList.toggle("is-on", k === i));
  };
  $("#igFeed").innerHTML = feedPosts.map((p, i) => `<button class="ig-post ig-post--real" data-i="${i}" aria-label="Posteo: ${p.t}"><img src="assets/redes/${p.f}.webp?v=3" alt="" loading="lazy"></button>`).join("");
  $("#igFeed").addEventListener("click", e => { const b = e.target.closest("button"); if (b) showPost(+b.dataset.i); });
  showPost(0);

  /* Historias: se avanzan solas cada 5 s; tocar a la derecha avanza y a la izquierda vuelve */
  const S = IGD.stories;
  let si = 0, sT;
  const story = $("#story");
  const drawStory = () => {
    story.innerHTML = `<img src="assets/redes/${S[si]}.webp?v=3" alt="Historia ${si + 1} de ${S.length}"><div class="bars">${S.map((_, i) => `<i class="${i < si ? "done" : i === si ? "run" : ""}"><b></b></i>`).join("")}</div><div class="who"><img src="assets/redes/ig-perfil.webp?v=3" alt="">piki.oficial</div>`;
    clearTimeout(sT); sT = setTimeout(() => go(1), 5000);
  };
  const go = d => { si = (si + d + S.length) % S.length; drawStory(); };
  story.addEventListener("click", e => { const r = story.getBoundingClientRect(); go(e.clientX - r.left < r.width * .35 ? -1 : 1); });
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) drawStory(); else clearTimeout(sT); }));
  io.observe(story);
}

/* =========================================================
   13 — PIEZAS
   ========================================================= */
function piezas() {
  $$(".piece-picker").forEach(pk => {
    const list = $(".piece-list", pk);
    list.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; $$("button", list).forEach(x => x.classList.toggle("is-on", x === b)); $$(".piece-view", pk).forEach(v => v.classList.toggle("is-on", v.dataset.pc === b.dataset.pc));
      /* con la lista fija: centrar el botón elegido en la tira y volver al inicio de la pieza si ya se bajó */
      if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: b.offsetLeft - (list.clientWidth - b.offsetWidth) / 2, behavior: "smooth" });
      const top = pk.getBoundingClientRect().top; if (top < 0) scrollBy({ top: top - 12, behavior: "smooth" }); });
  });
  /* Piezas físicas */
  const cm = $("#cartelMain"), ct = $("#cartelThumbs");
  ct.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; $$("button", ct).forEach(x => x.classList.toggle("is-on", x === b)); cm.src = b.dataset.src; cm.alt = `Cartel ${b.dataset.n}`; });
  /* en PC se dan vuelta con hover (CSS); en pantallas táctiles, tocando */
  const canHover = matchMedia("(hover: hover) and (pointer: fine)");
  $$(".flipcard").forEach(c => c.addEventListener("click", () => { if (!canHover.matches) c.classList.toggle("is-flip"); }));
  const setTri = side => { const t = $("#trifold"); t.style.setProperty("--img", `url("${new URL(`assets/piezas/triptico-${side}.webp?v=3`, location.href)}")`); t.setAttribute("aria-label", `Tríptico A4, ${side}`); t.classList.toggle("is-flat", side === "exterior"); };
  seg($("#triSide"), d => setTri(d.s)); setTri("exterior");

  /* Pulsera: la imagen plana se corta en tiras encadenadas; al curvar cada unión, la tira se cierra en un anillo */
  const band = $("#band3d");
  const N = 48, reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const buildBand = () => {
    const avail = band.clientWidth || band.closest(".piece-picker").clientWidth;
    const W = Math.min(720, avail - 20), w = W / N, h = W / 10, R = W / (2 * Math.PI);
    band.style.setProperty("--w", w + "px"); band.style.setProperty("--h", h + "px"); band.style.setProperty("--W", W + "px"); band.style.setProperty("--R", R + "px");
    band.style.setProperty("--bend", (360 / N) + "deg"); /* positivo: se curva hacia atrás y la cara impresa queda afuera */
    let html = "";
    for (let i = N - 1; i >= 0; i--) html = `<div class="s${i ? "" : " s0"}"><b class="fr" style="background-position:${-i * w}px 0"></b><b class="bk"></b>${html}</div>`;
    band.innerHTML = `<div class="band3d__tilt"><div class="band3d__spin"><div class="band3d__move">${html}</div></div></div>`;
  };
  const closeBand = () => { band.classList.remove("is-closed"); buildBand(); void band.offsetWidth; setTimeout(() => band.classList.add("is-closed"), reduce ? 0 : 450); };
  buildBand();
  addEventListener("resize", () => { const c = band.classList.contains("is-closed"); buildBand(); band.classList.toggle("is-closed", c); });
  $("#bandBtn").addEventListener("click", closeBand);
  /* se cierra sola cuando la pieza aparece en pantalla */
  new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && !band.classList.contains("is-closed")) closeBand(); }), { threshold: .6 }).observe(band);

  /* Favicon / app icon */
  $("#favSizes").innerHTML = [16, 32, 48, 64, 128].map(s => `<div><span style="width:${s}px;display:block">${logoSVG("fav").svg}</span>${s} px</div>`).join("");
  const apps = ["Calendario", "Fotos", "Mapas", "Clima", "Notas", "Piki", "Música", "Reloj", "Salud", "Ajustes", "Cámara", "Mail"];
  $("#homescreen").innerHTML = apps.map(a => a === "Piki" ? `<div class="app piki"><i>${logoSVG("iso", "#fff").svg}</i>Piki</div>` : `<div class="app"><i></i>${a}</div>`).join("");
  mountLogos($("#aplicaciones"));
  $$('.lg[data-lg="fav"]').forEach(el => { el.innerHTML = logoSVG("fav").svg; el.firstElementChild.style.cssText = "width:100%;height:100%;display:block"; });

  /* Exportaciones de piezas */
  document.addEventListener("click", e => {
    const b = e.target.closest("[data-export]"); if (!b) return;
    if (b.dataset.export === "appicon") exportRaw(logoSVG("fav", null, { bg: C.petroleo }).svg.replace('rx="220"', 'rx="0"'), 1024, "piki-icono-app-1024.png");
  });
}

/* =========================================================
   14 — DESCARGAS / GENERADOR
   ========================================================= */
function exportRaw(svg, width, name, bgFill) {
  const img = new Image();
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  img.onload = () => {
    const ratio = img.naturalHeight / img.naturalWidth || 1;
    const cv = document.createElement("canvas"); cv.width = width; cv.height = Math.round(width * ratio);
    const ctx = cv.getContext("2d"); if (bgFill) { ctx.fillStyle = bgFill; ctx.fillRect(0, 0, cv.width, cv.height); }
    ctx.drawImage(img, 0, 0, cv.width, cv.height);
    cv.toBlob(b => { download(name, b); toast(`${name} descargado`); }); URL.revokeObjectURL(url);
  };
  img.src = url;
}
function exportPNG(type, fill, bg, width) {
  const pad = bg ? 300 : 0;
  const { svg } = logoSVG(type, fill, { pieces: false, pad, bgRect: bg || null, px: 1000 });
  exportRaw(svg, width, `piki-${LNAME[type] || type}-${width}.png`);
}
function descargas() {
  const COLS = [["Petróleo", C.petroleo], ["Celeste", C.celeste], ["Negro", "#000000"], ["Blanco", "#FFFFFF"]];
  const BGS = [["Transparente", null], ["Crema", C.crema], ["Petróleo", C.petroleo], ["Blanco", "#FFFFFF"], ["Lima", C.lima], ["Celeste", C.celeste], ["Carbón", C.carbon]];
  let v = "h", col = C.petroleo, bg = C.crema, size = 1024;
  const gc = $("#genColor"), gb = $("#genBg");
  gc.innerHTML = COLS.map(([n, c], i) => `<button class="${i ? "" : "is-on"}" data-c="${c}" style="background:${c}" title="${n}" aria-label="${n}"></button>`).join("");
  gb.innerHTML = BGS.map(([n, c], i) => `<button class="${i === 1 ? "is-on" : ""} ${c ? "" : "transp"}" data-c="${c || ""}" style="${c ? "background:" + c : ""}" title="${n}" aria-label="${n}"></button>`).join("");
  const stage = $("#genStage");
  const draw = () => {
    stage.innerHTML = logoSVG(v, col).svg;
    stage.style.background = bg || "conic-gradient(#eee 0 25%, #fff 0 50%, #eee 0 75%, #fff 0) 0 0/20px 20px";
    const s = stage.firstElementChild; s.style.width = v === "v" ? "50%" : v === "iso" ? "44%" : "62%";
    const r = bg ? ratio(col, bg) : 99;
    $("#genWarn").innerHTML = bg && r < 3 ? `⚠️ Contraste insuficiente (${r.toFixed(1)}:1). Esta combinación no está aprobada.` : bg ? `✓ Combinación aprobada · contraste ${r.toFixed(1)}:1` : "Fondo transparente: verificá el contraste donde lo apliques.";
  };
  seg($("#genVer"), d => { v = d.v; draw(); });
  gc.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; $$("button", gc).forEach(x => x.classList.toggle("is-on", x === b)); col = b.dataset.c; draw(); });
  gb.addEventListener("click", e => { const b = e.target.closest("button"); if (!b) return; $$("button", gb).forEach(x => x.classList.toggle("is-on", x === b)); bg = b.dataset.c || null; draw(); });
  seg($("#genSize"), d => size = +d.s);
  $("#genSvg").addEventListener("click", () => {
    const { svg } = logoSVG(v, col, { pieces: false, pad: bg ? 300 : 0, bgRect: bg });
    download(`piki-${LNAME[v]}.svg`, new Blob([svg], { type: "image/svg+xml" })); toast(`piki-${LNAME[v]}.svg descargado`);
  });
  $("#genPng").addEventListener("click", () => exportPNG(v, col, bg, size));
  draw();
}


/* =========================================================
   v2 — bloques nuevos
   ========================================================= */
function v2() {
  /* Logo en movimiento: los videos se reproducen solos cuando están a la vista */
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const vids = $$(".motion-logo video");
  const setBtn = v => { const b = v.parentElement.querySelector(".ml-toggle"); if (!b) return; b.innerHTML = iconSVG(v.paused ? "play" : "pause", 16); b.setAttribute("aria-label", v.paused ? "Reproducir" : "Pausar"); };
  vids.forEach(v => {
    v.dataset.auto = reduce ? "" : "1";
    v.addEventListener("play", () => setBtn(v)); v.addEventListener("pause", () => setBtn(v)); setBtn(v);
    v.parentElement.querySelector(".ml-toggle").addEventListener("click", () => { v.dataset.auto = ""; v.paused ? v.play() : v.pause(); });
    v.addEventListener("click", () => { v.currentTime = 0; v.play(); });
  });
  const vio = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting && v.dataset.auto) v.play().catch(() => {}); else if (!e.isIntersecting && !v.paused) v.pause();
  }), { threshold: .5 });
  vids.forEach(v => vio.observe(v));
  const tr = $("#mlTrans"), steps = $$("#mlSteps button");
  steps.forEach(b => b.addEventListener("click", () => { tr.currentTime = +b.dataset.t + .01; tr.play().catch(() => {}); }));
  tr.addEventListener("timeupdate", () => steps.forEach(b => b.classList.toggle("is-on", tr.currentTime >= +b.dataset.t && tr.currentTime < +b.dataset.end)));

  /* Logotipo principal (intro) */
  /* Logo principal (intro): video del isologo; se reproduce una vez al entrar en pantalla y se puede repetir */
  const mm = $("#mainMark");
  const playMM = () => { mm.currentTime = 0; mm.play().catch(() => {}); };
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
    new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { playMM(); o.disconnect(); } }), { threshold: .4 }).observe(mm);
  else mm.addEventListener("loadeddata", () => { mm.currentTime = mm.duration || 5; }, { once: true });
  mm.addEventListener("click", playMM);
  $("#mainMarkPlay").addEventListener("click", playMM);

  /* Grillas: la app (402 de ancho, alto según la pantalla, 2 columnas) y la web (diseñada a 1920: 12 columnas, margen 195, medianil 32) */
  const lgH = (c, hh) => `<span class="lg" data-lg="h" style="color:${c};height:${hh}px;display:block"></span>`;
  const grStage = $("#grStage");
  let bpk = "m";
  const fitGrid = () => {
    const w = grStage.clientWidth; if (!w) return;
    const phone = $(".gr-phone"), web = $(".gr-browser");
    phone.style.setProperty("--k", Math.min(.82, (w - 60) / 426));
    web.style.setProperty("--k", Math.min(1, (w - 40) / 1920));
  };
  const setBP = k => {
    bpk = k; $$(".gr-view", grStage).forEach(v => v.classList.toggle("is-on", v.dataset.b === k));
    fitGrid();
  };
  seg($("#bpSel"), d => setBP(d.b));
  $("#bpCols").addEventListener("change", e => grStage.classList.toggle("no-cols", !e.target.checked));
  addEventListener("resize", fitGrid);
  new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) fitGrid(); })).observe(grStage);
  setBP("m");
}

/* TikTok: videos reales de Piki publicados en @pikirecovery; se reproducen al abrir la pestaña */
function tiktok() {
  const v = $("#ttVideo"), sel = $("#ttSel"); if (!v || !sel) return;
  const view = v.closest(".piece-view");
  const sync = () => { if (view.classList.contains("is-on")) v.play().catch(() => {}); else v.pause(); };
  new MutationObserver(sync).observe(view, { attributes: true, attributeFilter: ["class"] });
  seg(sel, d => { v.poster = `assets/video/posters/tiktok-${d.v}.webp?v=1`; v.src = `assets/video/tiktok-${d.v}.mp4?v=1`; sync(); });
}

/* =========================================================
   INIT
   ========================================================= */
mountIcons();
buildNav();
hero();
marca();

voz();
signo();
color();
tipografia();
iconografia();
recursos();
fotografia();
usos();
tiktok();
ui();
plataformas();
piezas();
descargas();
v2();
mountLogos();
mountIcons();
spy(); progress(); reveal(); mobileMenu(); search();
/* Versión para imprimir / PDF (?print=1 o al imprimir): todo visible, todas las piezas abiertas */
const preparePrint = () => {
  document.body.classList.add("is-print");
  $$(".reveal").forEach(r => r.classList.add("is-in"));
  $$(".piece-view").forEach(v => { const pk = v.closest(".piece-picker"); const b = pk && $(`.piece-list [data-pc="${v.dataset.pc}"]`, pk); if (b) v.dataset.printTitle = b.textContent.trim(); });
  /* la web embebida no se imprime: se reemplaza por una captura real del sitio */
  $$("#webIframe").forEach(f => { if (f.nextElementSibling?.classList.contains("print-shot")) return; f.insertAdjacentHTML("afterend", `<img class="print-shot" src="assets/web/web-desktop.webp?v=5" alt="Página web de Piki">`); });
  /* historias: la primera */
  const stEl = $("#story"); if (stEl && !stEl.querySelector("img") && window.PIKI_IG) stEl.innerHTML = `<img src="assets/redes/${PIKI_IG.stories[0]}.webp?v=3" alt="">`;
  /* videos: en el PDF va el póster de cada uno (un cuadro real exportado del MP4) */
  $$("video").forEach(v => {
    v.pause(); v.removeAttribute("autoplay");
    const n = (v.currentSrc || v.src).match(/video\/([\w-]+)\.mp4/);
    if (!n || v.nextElementSibling?.classList.contains("print-frame")) return;
    v.insertAdjacentHTML("afterend", `<img class="print-frame" src="assets/video/posters/${n[1]}.webp" alt="">`);
  });
  dispatchEvent(new Event("resize"));
};
if (new URLSearchParams(location.search).has("print")) preparePrint();
addEventListener("beforeprint", preparePrint);
/* ?print=largo: el PDF sale como una sola página larga, del alto de todo el manual */
if (new URLSearchParams(location.search).get("print") === "largo") {
  document.body.classList.add("is-print-long");
  const fitPage = () => {
    const h = Math.ceil(document.documentElement.scrollHeight) + 2;
    let st = $("#printPageSize"); if (!st) { st = document.createElement("style"); st.id = "printPageSize"; document.head.appendChild(st); }
    st.textContent = `@page { size: 1440px ${h}px; margin: 0; }`;
  };
  fitPage(); addEventListener("load", fitPage); setInterval(fitPage, 1000);
}
const endLogo = $("#endLogo");
new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { endLogo.classList.add("is-play"); o.disconnect(); } }), { threshold: .5 }).observe(endLogo);
})();

/* El ancho del contenido también cambia al abrir o cerrar el menú lateral, sin que la ventana cambie:
   en ese caso avisamos con un "resize" para que se reacomoden la web, el juego, las grillas y el UI kit */
(() => {
  const m = document.querySelector("main"); if (!m || !window.ResizeObserver) return;
  let w = m.clientWidth, t;
  new ResizeObserver(() => { if (m.clientWidth === w) return; w = m.clientWidth; clearTimeout(t); t = setTimeout(() => dispatchEvent(new Event("resize")), 60); }).observe(m);
})();
