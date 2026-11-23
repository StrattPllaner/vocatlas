/* Símbolos 3D vivos en la espiral de cada carrera.
   Un solo renderizador WebGL fuera de pantalla dibuja cada símbolo y lo copia a su <canvas>.
   Estilo de la app: tres tonos planos (luz arriba a la izquierda) y contorno de tinta del mismo color oscurecido.
   Giran despacio y además siguen el giro de la espiral; con «reducir movimiento» solo siguen la espiral.
   Mientras carga, se ve la imagen fija del símbolo (media/sym/*.webp). */
import * as THREE from './three.module.min.js';
import {MODELS,kit} from './models.js';

const PX = 300;
let R = null, scene, cam;
const grad = new THREE.DataTexture(new Uint8Array([115,115,115,255, 185,185,185,255, 255,255,255,255]), 3, 1, THREE.RGBAFormat);
grad.minFilter = grad.magFilter = THREE.NearestFilter; grad.needsUpdate = true;

function setup() {
  if (R) return true;
  try {
    R = new THREE.WebGLRenderer({antialias: true, alpha: true, preserveDrawingBuffer: true});
  } catch (e) { return false }
  R.setPixelRatio(1); R.setSize(PX, PX); R.setClearColor(0x000000, 0);
  R.outputColorSpace = THREE.SRGBColorSpace;
  scene = new THREE.Scene();
  const key = new THREE.DirectionalLight(0xffffff, 2.6); key.position.set(-60, 90, 120); scene.add(key);
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  cam = new THREE.PerspectiveCamera(26, 1, 1, 2000);
  return true;
}

function material(col, m) {
  let c = new THREE.Color(col);
  if (m === 'gold') c = new THREE.Color('#E8B53C');
  const o = {color: c, gradientMap: grad};
  if (m === 'glass') Object.assign(o, {transparent: true, opacity: 0.5, depthWrite: false});
  if (m === 'membrane') Object.assign(o, {transparent: true, opacity: 0.3, depthWrite: false, side: THREE.DoubleSide});
  const mt = new THREE.MeshToonMaterial(o);
  mt.userData.ink = c.clone().multiplyScalar(0.38); mt.userData.glass = m === 'glass' || m === 'membrane';
  return mt;
}

function addInk(g) {
  const list = []; g.traverse(o => { if (o.isMesh && !o.userData.ink) list.push(o) });
  list.forEach(o => {
    if (o.material.userData.glass) return;
    const im = new THREE.MeshBasicMaterial({color: o.material.userData.ink || new THREE.Color(0x222222), side: THREE.BackSide});
    im.onBeforeCompile = sh => { sh.vertexShader = sh.vertexShader.replace('#include <begin_vertex>', 'vec3 transformed = vec3( position ) + normalize(normal) * 1.5;') };
    const m = new THREE.Mesh(o.geometry, im); m.userData.ink = 1; o.add(m);
  });
}

const CACHE = {};
function model(k) {
  if (CACHE[k]) return CACHE[k];
  const f = MODELS[k]; if (!f) return null;
  const g = new THREE.Group(); f(kit(material, g)); addInk(g);
  const b = new THREE.Box3().setFromObject(g), c = b.getCenter(new THREE.Vector3()), s = b.getSize(new THREE.Vector3());
  g.position.sub(c);
  const pivot = new THREE.Group(); pivot.add(g);
  /* encuadre fijo: lo que mide al girar sobre su eje vertical, para que no cambie de tamaño */
  const r = s.length() * 0.5 + 2;
  return CACHE[k] = {pivot, r};
}

function draw(k, yaw, ctx) {
  const m = model(k); if (!m) return false;
  scene.add(m.pivot); m.pivot.rotation.set(0.2, yaw, 0);
  const dist = m.r / Math.tan(THREE.MathUtils.degToRad(13));
  cam.position.set(0, 0, dist); cam.lookAt(0, 0, 0); cam.near = dist / 10; cam.far = dist * 4; cam.updateProjectionMatrix();
  R.render(scene, cam); scene.remove(m.pivot);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.drawImage(R.domElement, 0, 0, ctx.canvas.width, ctx.canvas.height);
  return true;
}

let RAF = 0, T0 = 0;
const live = new Set();
const RM = () => window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

function loop(ts) {
  RAF = 0; if (!T0) T0 = ts;
  const t = (ts - T0) / 1000, still = RM();
  live.forEach(it => {
    if (!it.cv.isConnected) { live.delete(it); return }
    if (!it.vis || document.hidden || (window.__shown && !window.__shown(it.cv))) return;
    const S = it.host.__S, rot = S ? S.rot * Math.PI / 180 : 0;
    const yaw = -0.48 + it.ph + rot + (still ? 0 : t * 0.25);
    if (it.t && ts - it.t < (S && S.raf ? 32 : 66)) return;
    if (it.last !== undefined && Math.abs(yaw - it.last) < 0.004) return;
    if (it.t && ts - it.t < 32) return; it.t = ts;
    it.last = yaw;
    if (draw(it.k, yaw, it.ctx) && !it.on) { it.on = true; it.el.classList.add('is-3d') }
  });
  if (live.size) RAF = requestAnimationFrame(loop);
}

const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { const it = e.target.__sym; if (it) it.vis = e.isIntersecting }), {rootMargin: '200px'}) : null;

export function mount(host) {
  if (!setup()) return false;
  host.querySelectorAll('.tw-3d[data-k]').forEach((el, i) => {
    if (el.__sym) return;
    const k = el.getAttribute('data-k'); if (!MODELS[k]) return;
    const cv = document.createElement('canvas'); cv.className = 'tw-c3'; cv.width = cv.height = PX; cv.setAttribute('aria-hidden', 'true');
    el.appendChild(cv);
    const it = {k, el, cv, ctx: cv.getContext('2d'), host, ph: i * 0.9, vis: !io};
    el.__sym = it; live.add(it); if (io) io.observe(el);
  });
  if (!RAF && live.size) RAF = requestAnimationFrame(loop);
  return true;
}
