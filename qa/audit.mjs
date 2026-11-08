// auditoría: recorre los flujos en un dispositivo, registra errores y mide cada pantalla
// uso: node audit.mjs <dispositivo> [claro|oscuro] [shots-dir]
import { chromium, webkit, devices } from 'playwright';
import fs from 'fs';
const SP = process.env.SP, URL = process.env.URL || 'http://localhost:8765/index.html';
const MEASURE = fs.readFileSync(SP + '/pw/measure.js', 'utf8');
const DEV = {
  'iphone-se': { ...devices['iPhone SE'], eng: 'webkit' },
  'iphone-15': { ...devices['iPhone 15'], eng: 'webkit' },
  'iphone-15-pro-max': { ...devices['iPhone 15 Pro Max'], eng: 'webkit' },
  'pixel-7': { ...devices['Pixel 7'], eng: 'chromium', cpu: 4 },
  'android-360': { viewport: { width: 360, height: 640 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: devices['Pixel 7'].userAgent, eng: 'chromium', cpu: 4 },
  'se-chromium': { viewport: { width: 320, height: 568 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: devices['Pixel 7'].userAgent, eng: 'chromium', cpu: 4 },
  'ipad': { ...devices['iPad (gen 7)'], eng: 'webkit' },
  'computadora': { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, eng: 'chromium' },
};
const devName = process.argv[2] || 'iphone-15', scheme = process.argv[3] === 'oscuro' ? 'dark' : 'light', shots = process.argv[4] || '';
const D = DEV[devName]; const { eng, cpu, defaultBrowserType, ...ctxOpts } = D;
const log = { device: devName, scheme, errors: [], console: [], failed: [], rejections: [], steps: [], measures: [], clickFail: [], perf: null, listeners: [] };
const browser = eng === 'webkit' ? await webkit.launch() : await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', args: ['--no-first-run'] });
async function ctx(extraInit) {
  const c = await browser.newContext({ ...ctxOpts, colorScheme: scheme, locale: 'es-MX' });
  await c.addInitScript(() => {
    window.addEventListener('unhandledrejection', e => console.error('UNHANDLED_REJECTION ' + (e.reason && (e.reason.stack || e.reason.message) || e.reason)));
    // contador de escuchadores activos, para detectar fugas
    const A = EventTarget.prototype.addEventListener, R = EventTarget.prototype.removeEventListener; window.__lc = 0; const seen = new WeakMap();
    EventTarget.prototype.addEventListener = function (t, f, o) { if (f) { let m = seen.get(this); if (!m) { m = new Set(); seen.set(this, m) } const k = t + (o === true || (o && o.capture) ? 'c' : ''); if (!m.has(f)) { m.add(f); f['__k' + k] = 1; window.__lc++ } } return A.call(this, t, f, o) };
    EventTarget.prototype.removeEventListener = function (t, f, o) { const m = seen.get(this); if (m && m.has(f)) { m.delete(f); window.__lc-- } return R.call(this, t, f, o) };
  });
  await c.addInitScript(MEASURE);
  if (extraInit) await c.addInitScript(extraInit);
  const p = await c.newPage();
  p.on('pageerror', e => log.errors.push(`[${cur}] ${e.message}`));
  p.on('console', m => { if (m.type() === 'error' || m.type() === 'warning') { const t = m.text(); (t.startsWith('UNHANDLED_REJECTION') ? log.rejections : log.console).push(`[${cur}] ${m.type()}: ${t.slice(0, 300)}`) } });
  p.on('requestfailed', r => log.failed.push(`[${cur}] ${r.url().slice(0, 120)} ${r.failure() && r.failure().errorText}`));
  p.on('response', r => { if (r.status() >= 400) log.failed.push(`[${cur}] ${r.status()} ${r.url().slice(0, 120)}`) });
  if (cpu && eng === 'chromium') { const s = await c.newCDPSession(p); await s.send('Emulation.setCPUThrottlingRate', { rate: cpu }); p.__cdp = s }
  return { c, p };
}
let cur = 'inicio';
const wait = ms => new Promise(r => setTimeout(r, ms));
async function step(p, name, fn) { cur = name; const t0 = Date.now(); try { await fn(); log.steps.push(`ok ${name} ${Date.now() - t0}ms`) } catch (e) { log.steps.push(`FALLA ${name}: ${e.message.split('\n')[0].slice(0, 200)}`) } }
async function measure(p, name) { try { const m = await p.evaluate(n => window.__measure(n), name); log.measures.push(m); if (shots) await p.screenshot({ path: `${shots}/${devName}-${scheme === 'dark' ? 'oscuro' : 'claro'}-${name}.png` }) } catch (e) { log.steps.push(`FALLA medir ${name}: ${e.message.slice(0, 120)}`) } }
async function tap(p, sel, label) { try { await p.locator(sel).first().click({ timeout: 5000 }) } catch (e) { log.clickFail.push(`[${cur}] ${label || sel}: ${e.message.split('\n').find(l => /intercepts|not visible|outside|Timeout/.test(l)) || e.message.split('\n')[0]}`.slice(0, 260)); throw e } }
async function tapPoi(p, id) { const r = await p.evaluate(id => { const g = document.querySelector(`#world .poi[data-id="${id}"]`); if (!g) return null; const b = g.getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height * .6, w: b.width, h: b.height, hit: document.elementsFromPoint(b.left + b.width / 2, b.top + b.height * .6).slice(0,5).map(e=>e.tagName+'.'+(e.getAttribute('class')||'')+(e.closest('[data-id]')?'['+e.closest('[data-id]').getAttribute('data-id')+']':'')).join(' > ') } }, id); if (!r) throw new Error('sin edificio ' + id); log.steps.push(`  toque en ${id}: cae sobre «${r.hit.slice(0, 200)}» (${Math.round(r.w)}×${Math.round(r.h)})`); if (ctxOpts.hasTouch) await p.touchscreen.tap(r.x, r.y); else await p.mouse.click(r.x, r.y) }

async function pickPoi(p, pref) { return p.evaluate(pref => { const out = []; document.querySelectorAll('#world .poi').forEach(e => { const id = e.getAttribute('data-id'), r = e.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height * .6; if (x < 50 || x > innerWidth - 50 || y < Math.min(110, innerHeight * .2) || y > innerHeight - Math.min(150, innerHeight * .25)) return; const h = document.elementFromPoint(x, y), d = h && h.closest('[data-id]'); out.push({ id, ok: !!d && d.getAttribute('data-id') === id }) }); const ok = out.filter(o => o.ok); window.__blocked = out.filter(o => !o.ok).map(o => o.id); return ((ok.find(o => o.id === pref) || ok[0]) || {}).id }, pref) }
async function enterPlazaOf(p, id) { await tapPoi(p, id); try { await p.waitForSelector('#plaza.on', { timeout: 12000 }) } catch (e) { log.steps.push('  plaza no abrió tras 12 s; estado ' + await p.evaluate(() => document.querySelector('#walkbar').className)); await p.click('#wskip', { timeout: 2000 }).catch(() => {}); await p.waitForSelector('#plaza.on', { timeout: 8000 }) } }
// ---------- 1. primer uso completo ----------
let { c, p } = await ctx();
await step(p, 'carga', async () => { await p.goto(URL); await p.waitForSelector('#flow.on #iGo', { timeout: 20000 }); await wait(900) });
await measure(p, '01-inicio');
await step(p, 'entrar', async () => { await tap(p, '#iGo'); await p.waitForSelector('#fNick', { timeout: 10000 }); await wait(700) });
await measure(p, '02-perfil-vacio');
await step(p, 'perfil-error', async () => { await p.click('#fGo', { force: true }); await wait(500) });
await measure(p, '03-perfil-errores');
await step(p, 'perfil', async () => { await p.fill('#fNick', '  José  Ñoño '); await tap(p, 'label.tl-o:nth-of-type(2)', 'grado'); await p.fill('#fAge', '16'); await wait(400) });
await measure(p, '04-perfil-lleno');
await step(p, 'teclado', async () => { await p.focus('#fAge'); const r = await p.evaluate(() => { const a = document.activeElement.getBoundingClientRect(); return { fs: getComputedStyle(document.activeElement).fontSize, nick: getComputedStyle(document.querySelector('#fNick')).fontSize, bottom: a.bottom } }); log.steps.push(`  campos: fuente ${r.nick}/${r.fs}`) });
await step(p, 'metas', async () => { await tap(p, '#fGo'); await p.waitForSelector('#mGo', { timeout: 8000 }); await wait(700) });
await measure(p, '05-metas');
await step(p, 'temas', async () => { await tap(p, '#mGo'); await p.waitForSelector('#quiz.on #chips .chip', { timeout: 8000 }); await wait(900) });
await measure(p, '06-temas-vacio');
await step(p, 'elegir-temas', async () => {
  const chips = p.locator('#chips .chip'); for (const i of [0, 2, 5, 8]) await chips.nth(i).click();
  for (const t of ['  Química   orgánica ', 'Ñandú y más', '<b>x</b>&amp;', 'música', 'Música', 'a', 'abcdefghijklmnopqrstuvwxyz0123456789']) { await p.fill('#custom', t); await tap(p, '#addc') }
  await wait(500);
  log.steps.push('  temas propios: ' + JSON.stringify(await p.$$eval('#chips .chip.custom', b => b.map(x => x.textContent))));
});
await measure(p, '07-temas-elegidos');
await step(p, 'armar-mapa-rapido', async () => { const b = await p.$('#go'); for (let i = 0; i < 5; i++) b.click().catch(() => {}); await p.waitForSelector('#app.on #world .poi', { timeout: 15000 }); await wait(2500) });
await measure(p, '08-mapa');
// zoom lejano y cercano
await step(p, 'zoom', async () => { await tap(p, '#zfit'); await wait(900) });
await measure(p, '09-mapa-todo');
await step(p, 'zoom-cerca', async () => { await tap(p, '#zin'); await wait(500); await tap(p, '#zin'); await wait(900) });
await measure(p, '10-mapa-cerca');
// fluidez del mapa al arrastrar
await step(p, 'fluidez', async () => {
  await tap(p, '#zfit'); await wait(800);
  await p.evaluate(() => { window.__fr = []; let l = performance.now(); (function f(t) { window.__fr.push(t - l); l = t; if (window.__fr.length < 400) requestAnimationFrame(f) })(l); window.__lt = 0; try { new PerformanceObserver(l => l.getEntries().forEach(e => window.__lt += e.duration)).observe({ entryTypes: ['longtask'] }) } catch (e) { } });
  const b = await p.$eval('#mapbox', e => { const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2] });
  await p.mouse.move(b[0], b[1]); await p.mouse.down();
  for (let k = 0; k < 3; k++) { for (let i = 0; i < 30; i++) await p.mouse.move(b[0] + Math.sin(i / 30 * Math.PI * 2) * 100, b[1] + Math.cos(i / 30 * Math.PI * 2) * 60, { steps: 1 }) }
  await p.mouse.up(); await wait(400);
  const fr = await p.evaluate(() => ({ fr: window.__fr.slice(5), lt: window.__lt })); const a = fr.fr.sort((x, y) => x - y);
  log.perf = { frames: a.length, medianMs: +a[Math.floor(a.length / 2)].toFixed(1), p95Ms: +a[Math.floor(a.length * .95)].toFixed(1), over33: a.filter(x => x > 33).length, longTasksMs: Math.round(fr.lt) };
});
// recorrido a una carrera, plaza, reto
await step(p, 'centrar', async () => { await tap(p, '#zfit'); await wait(700) });
const target = await pickPoi(p, 'medicina'); log.steps.push('  edificios tapados por otra cosa al centrar: ' + await p.evaluate(() => window.__blocked.join(',')));
await step(p, 'tocar-edificio', async () => { await tapPoi(p, target); await wait(600) });
await measure(p, '11-caminando');
await step(p, 'plaza', async () => { await p.waitForSelector('#plaza.on', { timeout: 12000 }).catch(async () => { await p.click('#wskip', { timeout: 2000 }).catch(() => {}); await p.waitForSelector('#plaza.on', { timeout: 8000 }) }); await wait(2200) });
await measure(p, '12-plaza');
await step(p, 'estacion-hace', async () => { await tap(p, '.stn[data-k=hace] button'); await p.waitForSelector('#pzcard.on', { timeout: 8000 }); await wait(900) });
await measure(p, '13-tarjeta-carrera');
await step(p, 'estacion-reto', async () => { await tap(p, '#pzcx'); await wait(300); await tap(p, '.stn[data-k=reto] button'); await p.waitForSelector('#pzgo', { timeout: 8000 }); await wait(700) });
await step(p, 'reto', async () => { await tap(p, '#pzgo'); await p.waitForSelector('#test.on .opt', { timeout: 8000 }); await wait(800) });
await measure(p, '14-reto');
await step(p, 'responder-rapido', async () => { const o = await p.$$('#test .opt'); o[0].click().catch(() => {}); o[1].click().catch(() => {}); await p.waitForSelector('#reacts .react', { timeout: 8000 }); await wait(1500) });
await measure(p, '15-revelacion');
await step(p, 'reaccion', async () => { await tap(p, '#reacts [data-k=yes]'); await p.waitForSelector('#rsave', { timeout: 6000 }); await wait(900) });
await measure(p, '16-calificar');
await step(p, 'guardar', async () => { await tap(p, '#rsave'); await wait(1600) });
await measure(p, '17-plaza-despues');
await step(p, 'volver-mapa', async () => { await tap(p, '#pzx'); await p.waitForFunction(() => !document.querySelector('#plaza').classList.contains('on'), null, { timeout: 8000 }); await wait(1800) });
await measure(p, '18-mapa-despues');
for (const v of ['probar', 'atlas', 'yo']) { await step(p, 'pestaña-' + v, async () => { await tap(p, `#nav [data-v=${v}]`); await wait(900) }); await measure(p, '19-' + v) }
// pulsaciones muy rápidas en pestañas
await step(p, 'pestañas-rapido', async () => { const n = ['map', 'probar', 'atlas', 'yo']; for (let i = 0; i < 24; i++) p.click(`#nav [data-v=${n[i % 4]}]`, { timeout: 2000 }).catch(() => {}); await wait(2500); const st = await p.evaluate(() => [...document.querySelectorAll('.view.on')].map(e => e.id)); log.steps.push('  vistas visibles tras toques rápidos: ' + st.join(',')) });
// fugas: ciclos de plaza y de pestañas
await step(p, 'fugas', async () => {
  await tap(p, '#nav [data-v=map]'); await wait(800);
  for (let k = 0; k < 4; k++) {
    for (const v of ['probar', 'atlas', 'yo', 'map']) { await p.click(`#nav [data-v=${v}]`); await wait(250) }
    const id = await pickPoi(p, '');
    if (id) { await enterPlazaOf(p, id); await wait(1200); await p.click('#pzx'); await p.waitForFunction(() => !document.querySelector('#plaza').classList.contains('on'), null, { timeout: 8000 }); await wait(1600) }
    const m = await p.evaluate(() => ({ l: window.__lc, n: document.getElementsByTagName('*').length, h: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1e6) : null }));
    log.listeners.push(m);
  }
});
// recarga con progreso
await step(p, 'recarga', async () => { await p.reload(); await p.waitForSelector('#flow.on #iGo', { timeout: 20000 }); await wait(900); log.steps.push('  botón al volver: ' + await p.textContent('#iGo')) });
await measure(p, '20-inicio-regreso');
await step(p, 'entrar-mapa', async () => { await tap(p, '#iGo'); await p.waitForSelector('#app.on #world .poi', { timeout: 15000 }); await wait(2200); const st = await p.evaluate(() => JSON.parse(localStorage.getItem('vocatlas_v1'))); log.steps.push(`  progreso tras recargar: res=${JSON.stringify(st.res)} custom=${JSON.stringify(st.custom)}`) });
// rotar
await step(p, 'rotar', async () => { const v = ctxOpts.viewport; await p.setViewportSize({ width: Math.max(v.width, (ctxOpts.screen || v).height), height: v.width }); await wait(1200) });
await measure(p, '21-mapa-horizontal');
await step(p, 'rotar-plaza', async () => { const id = await pickPoi(p, ''); await enterPlazaOf(p, id); await wait(2000) });
await measure(p, '22-plaza-horizontal');
await step(p, 'regresar-vertical', async () => { await p.setViewportSize(ctxOpts.viewport); await wait(1000) });
await measure(p, '23-plaza-vertical');
await step(p, 'salir-plaza', async () => { await tap(p, '#pzx'); await wait(1800) });
// cambiar temas
await step(p, 'cambiar-temas', async () => { await tap(p, '#nav [data-v=yo]'); await wait(800); await tap(p, '#chg'); await p.waitForSelector('#quiz.on', { timeout: 6000 }); await wait(800); await p.locator('#chips .chip:not(.custom)').nth(1).click(); await tap(p, '#go'); await p.waitForSelector('#app.on #world .poi', { timeout: 15000 }); await wait(2000) });
await measure(p, '24-mapa-temas-nuevos');
// borrar datos
await step(p, 'borrar', async () => { await tap(p, '#nav [data-v=yo]'); await wait(800); await p.locator('#rst').scrollIntoViewIfNeeded(); await tap(p, '#rst'); await wait(300); await tap(p, '#rst'); await p.waitForSelector('#flow.on #iGo', { timeout: 8000 }); await wait(900); const st = await p.evaluate(() => localStorage.getItem('vocatlas_v1')); log.steps.push('  storage tras borrar: ' + (st || '').slice(0, 160)); log.steps.push('  botón tras borrar: ' + await p.textContent('#iGo')) });
await measure(p, '25-inicio-borrado');
// sin conexión
await step(p, 'sin-conexion', async () => { await c.setOffline(true); try { await p.reload({ timeout: 8000 }); await wait(1500); log.steps.push('  sin conexión: la página cargó → ' + await p.evaluate(() => !!document.querySelector('#boot'))) } catch (e) { log.steps.push('  sin conexión: NO carga (' + e.message.split('\n')[0].slice(0, 80) + ')') } await c.setOffline(false) });
await c.close();

// ---------- 2. localStorage bloqueado ----------
({ c, p } = await ctx(() => { Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('bloqueado', 'SecurityError') } }) }));
cur = 'storage-bloqueado';
await step(p, 'storage-bloqueado', async () => { await p.goto(URL); await p.waitForSelector('#flow.on #iGo', { timeout: 20000 }); await wait(700); await tap(p, '#iGo'); await p.waitForSelector('#fNick', { timeout: 10000 }); await p.fill('#fNick', 'Ana'); await tap(p, 'label.tl-o:nth-of-type(3)'); await tap(p, '#fGo'); await p.waitForSelector('#mGo', { timeout: 8000 }); await wait(500); await tap(p, '#mGo'); await p.waitForSelector('#quiz.on .chip', { timeout: 8000 }); await wait(600); const ch = p.locator('#chips .chip'); for (const i of [0, 1, 2]) await ch.nth(i).click(); await tap(p, '#go'); await p.waitForSelector('#app.on #world .poi', { timeout: 15000 }); await wait(1500) });
await measure(p, '26-mapa-sin-storage');
await c.close();
// ---------- 3. fuentes caídas (red lenta o bloqueada) ----------
({ c, p } = await ctx());
cur = 'sin-fuentes';
await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
await step(p, 'sin-fuentes', async () => { const t0 = Date.now(); await p.goto(URL); await p.waitForSelector('#flow.on #iGo', { timeout: 20000 }); log.steps.push('  arranque sin fuentes: ' + (Date.now() - t0) + 'ms') });
await c.close();
await browser.close();
log.failed = log.failed.filter(f => !/sin-fuentes|sin-conexion/.test(f));
fs.writeFileSync(`${SP}/pw/out/${devName}-${scheme}.json`, JSON.stringify(log, null, 1));
console.log(devName, scheme, 'errores', log.errors.length, 'consola', log.console.length, 'rechazos', log.rejections.length, 'fallidas', log.failed.length, 'clics fallidos', log.clickFail.length);
log.steps.filter(s => /FALLA/.test(s)).forEach(s => console.log(' ', s));
