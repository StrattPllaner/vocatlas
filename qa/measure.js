// se inyecta en la página: mide desbordes, recortes, objetivos táctiles chicos, textos encimados y el mapa
window.__measure = function (screen) {
  const W = innerWidth, H = innerHeight, out = { screen, W, H, hscroll: 0, small: [], clipped: [], offscreen: [], overlaps: [], dupIds: [], map: null };
  const vis = e => { if (!e.isConnected) return false; const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) return false; let p = e; while (p && p !== document.documentElement) { const s = getComputedStyle(p); if (s.display === 'none' || +s.opacity === 0 || s.visibility === 'hidden') return false; p = p.parentElement } const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 };
  const name = e => { let s = e.tagName.toLowerCase(); if (e.id) s += '#' + e.id; if (typeof e.className === 'string' && e.className.trim()) s += '.' + e.className.trim().split(/\s+/).slice(0, 3).join('.'); const t = (e.getAttribute('aria-label') || e.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40); return s + (t ? ' «' + t + '»' : '') };
  const inView = r => r.bottom > 0 && r.top < H && r.right > 0 && r.left < W;
  out.hscroll = Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth);
  // ids repetidos en el DOM vivo
  const ids = {}; document.querySelectorAll('[id]').forEach(e => { ids[e.id] = (ids[e.id] || 0) + 1 }); out.dupIds = Object.keys(ids).filter(k => ids[k] > 1);
  // objetivos táctiles
  const inter = 'button,a[href],input:not([type=hidden]),select,textarea,[role=button],[role=tab],[role=switch],summary,[tabindex="0"]';
  document.querySelectorAll(inter).forEach(e => {
    if (!vis(e)) return; let t = e; const r0 = e.getBoundingClientRect(); if (!inView(r0)) return;
    // un radio o casilla oculto cuenta por su etiqueta
    if (e.matches('input[type=radio],input[type=checkbox]')) { const l = e.closest('label'); if (l) t = l; else return }
    const r = t.getBoundingClientRect(); if (e.disabled) return;
    if (r.width < 47.5 || r.height < 47.5) out.small.push(name(t) + ` ${Math.round(r.width)}×${Math.round(r.height)}`);
  });
  // texto recortado por su caja y elementos fuera del ancho de pantalla
  document.querySelectorAll('body *').forEach(e => {
    if (e.closest('svg') || e.closest('#mlayer')) return;
    if (!vis(e)) return; const r = e.getBoundingClientRect(); if (!inView(r)) return;
    const cs = getComputedStyle(e);
    const hasText = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    if (hasText && (cs.overflowX !== 'visible' || cs.textOverflow === 'ellipsis') && e.scrollWidth > e.clientWidth + 1) out.clipped.push(name(e) + ` ${e.scrollWidth}>${e.clientWidth}`);
    if (hasText && (cs.overflowY === 'hidden' || cs.overflowY === 'clip') && e.scrollHeight > e.clientHeight + 2 && !/-webkit-box/.test(cs.display)) out.clipped.push(name(e) + ` alto ${e.scrollHeight}>${e.clientHeight}`);
    if ((hasText || e.matches(inter)) && (r.right > W + 1 || r.left < -1)) { if (!e.closest('.view:not(.on)')) out.offscreen.push(name(e) + ` x ${Math.round(r.left)}..${Math.round(r.right)}`) }
    if ((cs.position === 'fixed' || cs.position === 'absolute' || cs.position === 'sticky') && e.matches(inter) && r.bottom > H + 1 && r.top < H) out.offscreen.push(name(e) + ` abajo ${Math.round(r.bottom)}>${H}`);
  });
  // textos encimados (fuera del mapa): rectángulos de nodos de texto
  const top = (x, y, el) => { const h = document.elementFromPoint(Math.min(W - 1, Math.max(0, x)), Math.min(H - 1, Math.max(0, y))); return h && (h === el || el.contains(h) || h.contains(el)) };
  const boxes = []; const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n; while ((n = tw.nextNode())) {
    const p = n.parentElement; if (!n.textContent.trim() || !p || p.closest('svg,#mlayer,script,style,#boot,.sr-only') || !vis(p)) continue;
    const rg = document.createRange(); rg.selectNodeContents(n); const rs = [...rg.getClientRects()].filter(r => r.width > 2 && r.height > 2 && inView(r));
    rs.forEach(r => { if (top(r.left + r.width / 2, r.top + r.height / 2, p)) boxes.push({ r, p, t: n.textContent.trim().slice(0, 30) }) });
  }
  for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
    const a = boxes[i], b = boxes[j]; if (a.p === b.p || a.p.contains(b.p) || b.p.contains(a.p)) continue;
    const ix = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left), iy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
    if (ix > 3 && iy > 3) { const cx = Math.max(a.r.left, b.r.left) + ix / 2, cy = Math.max(a.r.top, b.r.top) + iy / 2; if (ix < 6 && iy < 6) continue; out.overlaps.push(`«${a.t}» × «${b.t}»`) }
  }
  out.overlaps = [...new Set(out.overlaps)].slice(0, 30);
  // mapa: etiquetas, edificios, Rumbo
  const mapOn = document.querySelector('#app.on #v-map.on');
  if (mapOn) {
    const box = document.querySelector('#mapbox').getBoundingClientRect();
    const nav = document.querySelector('#nav'), navR = nav && vis(nav) ? nav.getBoundingClientRect() : null;
    const top2 = document.querySelector('#app header.top'), topR = top2 ? top2.getBoundingClientRect() : null;
    const lab = []; document.querySelectorAll('#mlayer .ml').forEach(e => { if (e.classList.contains('rbm') || e.classList.contains('deco') || e.classList.contains('fogd')) return; const t = e.querySelector('.t,.pl') || e; if (!vis(t)) return; const r = t.getBoundingClientRect(); if (r.width < 2 || !inView(r)) return; lab.push({ e, r, k: e.className.split(' ')[1], t: (e.getAttribute('data-id') || t.textContent.trim()).slice(0, 26) }) });
    const blds = []; document.querySelectorAll('#world .poi').forEach(g => { const r = g.getBoundingClientRect(); if (inView(r)) blds.push({ id: g.getAttribute('data-id'), r }) });
    const hit = (a, b, m = 0) => { const ix = Math.min(a.right, b.right) - Math.max(a.left, b.left) - m, iy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) - m; return ix > 0 && iy > 0 ? ix * iy : 0 };
    const M = { labelOverlap: [], labelOnBuilding: [], labelCut: [], labelUnderUI: [], rumboOnBuilding: [], small: [], heights: {}, zoom: null };
    for (let i = 0; i < lab.length; i++) for (let j = i + 1; j < lab.length; j++) if (hit(lab[i].r, lab[j].r, 2)) M.labelOverlap.push(`${lab[i].k}:${lab[i].t} × ${lab[j].k}:${lab[j].t}`);
    lab.forEach(l => {
      blds.forEach(b => { if (l.k === 'mpin' && l.t === b.id) return; const a = hit(l.r, b.r); if (a > 0.12 * l.r.width * l.r.height) M.labelOnBuilding.push(`${l.k}:${l.t} sobre ${b.id}`) });
      if (l.r.left < box.left - 1 || l.r.right > box.right + 1 || l.r.top < box.top - 1 || l.r.bottom > box.bottom + 1) { if (l.r.left < box.right && l.r.right > box.left && l.r.top < box.bottom && l.r.bottom > box.top) M.labelCut.push(`${l.k}:${l.t}`) }
      [navR, topR].forEach(u => { if (u && hit(l.r, u, 2)) M.labelUnderUI.push(`${l.k}:${l.t}`) });
    });
    const rb = document.querySelector('#mlayer .rbm .rb'); if (rb && rb.getBoundingClientRect().width) { const rr = rb.getBoundingClientRect(); blds.forEach(b => { const a = hit(rr, b.r); if (a > .2 * b.r.width * b.r.height) M.rumboOnBuilding.push(`${b.id} ${Math.round(100 * a / (b.r.width * b.r.height))}%`) }) }
    blds.forEach(b => { M.heights[b.id] = Math.round(b.r.height); if (b.r.height < 110) M.small.push(`${b.id} ${Math.round(b.r.width)}×${Math.round(b.r.height)}`) });
    if (navR) M.navBottom = Math.round(navR.bottom), M.navCut = navR.bottom > H + 1 || navR.right > W + 1 || navR.left < -1;
    if (navR) { M.navBtns = [...nav.querySelectorAll('button')].map(b => { const r = b.getBoundingClientRect(); return Math.round(r.width) + '×' + Math.round(r.height) }).join(' ') }
    M.labelOverlap = [...new Set(M.labelOverlap)]; M.labelOnBuilding = [...new Set(M.labelOnBuilding)];
    out.map = M;
  }
  return out;
};
