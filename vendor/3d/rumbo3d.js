/* Rumbo en 3D en toda la app, igual al dibujo de siempre: mismos colores, contorno café oscuro parejo y la cara real
   del dibujo (se copia en vivo de su versión plana, así parpadea, mira, habla y cambia de gesto igual).
   El Rumbo plano sigue vivo pero invisible: es el titiritero. Cada cuadro se copian sus articulaciones (cuerpo, cadera,
   rodillas, tobillos, manos, gorro, gafas y flecha) al modelo 3D, así camina, salta, baila y saluda igual que el dibujo.
   Caminando voltea hacia donde va. En la avioneta (drive) va de tres cuartos y mueve el volante.
   Un solo renderizador WebGL para todos (los navegadores permiten pocos); cada Rumbo copia su cuadro a su propio lienzo.
   30 cuadros por segundo; con muchos Rumbos a la vista se turnan. Si no hay WebGL se queda el dibujo plano.
   El diseño plano anterior está guardado en media/arte/rumbo-2d/. */
import * as THREE from './three.module.min.js';
import {kit,rumbo3d} from './models.js';
const grad=new THREE.DataTexture(new Uint8Array([115,115,115,255,185,185,185,255,255,255,255,255]),3,1,THREE.RGBAFormat);grad.minFilter=grad.magFilter=THREE.NearestFilter;grad.needsUpdate=true;
function material(col,m){let c=new THREE.Color(col);const o={color:c,gradientMap:grad};
 if(m==='glass')Object.assign(o,{transparent:true,opacity:.5,depthWrite:false});
 const mt=new THREE.MeshToonMaterial(o);mt.userData.ink=new THREE.Color('#4B2A13');mt.userData.glass=m==='glass';return mt}
function addInk(g){const L=[];g.traverse(o=>{if(o.isMesh&&!o.userData.ink)L.push(o)});
 L.forEach(o=>{if(!o.material.userData||o.material.userData.glass||!o.material.userData.ink)return;const im=new THREE.MeshBasicMaterial({color:o.material.userData.ink,side:THREE.BackSide});
  im.onBeforeCompile=sh=>{sh.vertexShader=sh.vertexShader.replace('#include <begin_vertex>','vec3 transformed = vec3( position ) + normalize(normal) * .9;')};const m=new THREE.Mesh(o.geometry,im);m.userData.ink=1;o.add(m)})}

/* ---------- renderizador compartido ---------- */
const MAXPX=768;let R=null,scene=null;
function setup(){if(R)return true;try{R=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true})}catch(e){return false}
 R.setPixelRatio(1);R.setSize(MAXPX,MAXPX,false);R.setClearColor(0,0);R.outputColorSpace=THREE.SRGBColorSpace;R.setScissorTest(true);
 scene=new THREE.Scene();const key=new THREE.DirectionalLight(0xffffff,2.6);key.position.set(-60,90,120);scene.add(key);scene.add(new THREE.AmbientLight(0xffffff,.55));
 R.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault()});return true}

const PARTS=['root','body','hat','gog','arrow','legL','kneeL','ftL','legR','kneeR','ftR','handL','handR'];
const CLS={root:'rk-root',body:'rk-body',hat:'rk-hat',gog:'rk-gog',arrow:'rk-arrow',legL:'rk-legL',kneeL:'rk-kneeL',ftL:'rk-ftL',legR:'rk-legR',kneeR:'rk-kneeR',ftR:'rk-ftR',handL:'rk-handL',handR:'rk-handR'};
const LEGS={legL:1,kneeL:1,ftL:1,legR:1,kneeR:1,ftR:1};
const live=new Set();let raf=0,turn=0,grabTurn=0;
const RM=()=>window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(e=>{const it=e.target.__r3;if(it){it.vis=e.isIntersecting;if(it.vis)go()}}),{rootMargin:'120px'}):null;
function go(){if(!raf)raf=requestAnimationFrame(loop)}

/* la cara: copia la carátula del Rumbo plano (sin gorro, piernas ni manos) */
function grab(it){const src=it.src;if(!src||it.busy||!src.isConnected)return;it.busy=true;const c=src.cloneNode(true);
 c.querySelectorAll('.rk-hat,.rk-legL,.rk-legR,.rk-handL,.rk-handR,.rk-shadow,.rk-wheel,.rk-zz').forEach(e=>e.remove());
 ['.rk-root','.rk-body'].forEach(q=>{const e=c.querySelector(q);if(e)e.removeAttribute('transform')});
 c.removeAttribute('style');c.setAttribute('viewBox','30.2 37.8 39.6 39.6');c.setAttribute('width','512');c.setAttribute('height','512');c.setAttribute('xmlns','http://www.w3.org/2000/svg');
 /* solo se vuelve a pintar si la cara cambió (parpadeo, boca, gesto); si es igual no se hace nada */
 const str=new XMLSerializer().serializeToString(c);if(str===it.lastFace){it.busy=false;return}it.lastFace=str;
 const u=URL.createObjectURL(new Blob([str],{type:'image/svg+xml'})),im=new Image();
 im.onload=()=>{const fx=it.fx;fx.fillStyle='#FBF3E2';fx.fillRect(0,0,512,512);fx.drawImage(im,0,0,512,512);URL.revokeObjectURL(u);it.busy=false;it.tex.needsUpdate=true};
 im.onerror=()=>{URL.revokeObjectURL(u);it.busy=false};im.src=u}

/* copia una articulación del dibujo: el transform de su grupo alrededor de su pivote */
function copyJoint(it,k,walk){const el=it.g2[k],o=it.J[k];if(!el||!o)return;const tl=el.transform&&el.transform.baseVal,m=tl&&tl.numberOfItems?tl.consolidate().matrix:null;
 const pv=o.userData.pv;if(!m){o.position.set(pv[0],pv[1],0);o.rotation.set(0,0,0);o.scale.set(1,1,1);return}
 const px=pv[0]+50,py=57.6-pv[1],dx=m.a*px+m.c*py+m.e-px,dy=m.b*px+m.d*py+m.f-py,det=m.a*m.d-m.b*m.c;
 /* si el dibujo se voltea en espejo (camina a la izquierda), se quita el espejo: en 3D eso volvería el modelo del revés
    (se vería el contorno café por delante). Hacia dónde mira ya lo decide el giro del modelo */
 const fa=det<0?-m.a:m.a,fb=det<0?-m.b:m.b,r=Math.atan2(fb,fa),sx=Math.hypot(fa,fb)||1,sy=Math.abs(det)/sx;
 if(walk&&LEGS[k]){/* caminando de lado: las piernas van de adelante hacia atrás */o.position.set(pv[0],pv[1]-dy,dx*.6);o.rotation.set(-r,0,0);o.scale.set(1,sy,1)}
 else{o.position.set(pv[0]+dx,pv[1]-dy,0);o.rotation.set(0,0,-r);o.scale.set(sx,sy,(sx+sy)/2)}}

function loop(ts){raf=0;if(document.hidden)return;
 const vis=[];live.forEach(it=>{if(!it.cv.isConnected){live.delete(it);it.dispose();return}if(it.vis)vis.push(it)});
 if(!live.size)return;raf=requestAnimationFrame(loop);if(!vis.length)return;
 /* hasta 4 Rumbos por cuadro (a 60 Hz cada uno va a 30 fps si hay 2; con muchos se turnan) */
 const n=Math.min(vis.length,4);const still=RM();
 for(let i=0;i<n;i++){const it=vis[(turn+i)%vis.length];if(ts-it.last<30&&vis.length<=2)continue;draw(it,ts,still)}
 turn=(turn+n)%Math.max(1,vis.length);
 /* la cara: una o dos copias por cuadro, repartidas */
 const gi=vis[grabTurn%vis.length];grabTurn++;if(gi&&ts-gi.lastGrab>140){gi.lastGrab=ts;grab(gi)}}

function draw(it,ts,still){it.last=ts;if(!it.t0)it.t0=ts;const t=(ts-it.t0)/1000,wr=it.wr;
 const walk=!!(wr&&(wr.classList.contains('walk')||wr.__wv>.05)),left=!!(wr&&wr.classList.contains('left'));
 if(it.drive){const fast=it.host.closest('.is-flying')?1:0;const st=still?0:((fast?.36:.22)*Math.sin(t*2*Math.PI/1.9)+.07*Math.sin(t*2*Math.PI/.73));
  if(it.wheel)it.wheel.rotation.z=-st*1.6;it.piv.rotation.set(.16,(it.yaw==null?-.72:it.yaw)+st*.25+(it.spin?t*it.spin:0),st*.18)}
 else{PARTS.forEach(k=>copyJoint(it,k,walk));
  /* caminando mira hacia donde va: de frente si baja por la pantalla, de espaldas si sube, de lado si cruza */
  const dir=wr&&wr.__dir;let target=walk?(dir?Math.atan2(dir[0],dir[1]):(left?-1.05:1.05)):(it.yaw==null?(left?.3:-.3):it.yaw)+(still?0:.1*Math.sin(t*.7));
  let dy=target-it.yawNow;while(dy>Math.PI)dy-=2*Math.PI;while(dy<-Math.PI)dy+=2*Math.PI;
  it.yawNow+=dy*Math.min(1,walk?.2:.08);it.piv.rotation.set(.1,it.yawNow+(it.spin?t*it.spin:0),0)}
 /* nitidez: el lienzo sigue el tamaño real en pantalla (con el zoom del mapa); así nunca se ve borroso */
 if(ts-(it.lastFit||0)>400){it.lastFit=ts;const w=it.cv.getBoundingClientRect().width;if(w>4){const want=Math.min(MAXPX,Math.max(48,Math.round(w*Math.min(3,window.devicePixelRatio||1))));
  if(Math.abs(want-it.PX)/it.PX>.12){it.PX=want;it.cv.width=it.cv.height=want}}}
 const PX=it.PX;R.setViewport(0,0,PX,PX);R.setScissor(0,0,PX,PX);R.setClearColor(0,0);R.clear();
 scene.add(it.piv);R.render(scene,it.cam);scene.remove(it.piv);
 const cx=it.ctx;cx.clearRect(0,0,PX,PX);cx.drawImage(R.domElement,0,MAXPX-PX,PX,PX,0,0,PX,PX)}

/* monta un Rumbo 3D en host. opt: px (tamaño en pantalla), src (svg plano que da la cara y los movimientos),
   drive (avioneta), yaw (giro fijo), spin (vueltas por segundo), wrap (el .rb que lleva clases walk/left) */
export function mount(host,opt){opt=opt||{};if(!setup())return null;const drive=opt.drive!==false;
 const PX=Math.min(MAXPX,Math.round((opt.px||90)*Math.min(3,window.devicePixelRatio||1)));
 const cv=document.createElement('canvas');cv.width=cv.height=PX;cv.className=drive?'rb3d':'rb3d rb3d-u';cv.setAttribute('aria-hidden','true');host.appendChild(cv);
 const fc=document.createElement('canvas');fc.width=fc.height=512;const fx=fc.getContext('2d');fx.fillStyle='#FBF3E2';fx.fillRect(0,0,512,512);
 const src=opt.src||host.querySelector('svg.rbx');
 const g=new THREE.Group();const top=rumbo3d(kit(material,g),{drive,faceCanvas:fc});addInk(g);
 const piv=new THREE.Group();piv.add(g);const cam=new THREE.PerspectiveCamera(22,1,1,3000);
 if(drive){/* encuadre del modelo entero, como antes */const box=new THREE.Box3().setFromObject(g),c=box.getCenter(new THREE.Vector3()),sz=box.getSize(new THREE.Vector3());g.position.sub(c);
  const r=Math.max(sz.x,sz.y,sz.z)*.62+4,d=r/Math.tan(THREE.MathUtils.degToRad(11));cam.position.set(0,0,d);cam.near=d/10;cam.far=d*4}
 else{/* mismo encuadre que el dibujo de 100: el lienzo mide 130 % y se centra en el punto (50,50) del dibujo */
  g.position.set(0,-7.6,0);const d=65/Math.tan(THREE.MathUtils.degToRad(11));cam.position.set(0,0,d);cam.near=d/10;cam.far=d*4}
 cam.lookAt(0,0,0);cam.updateProjectionMatrix();
 const g2={};if(src)PARTS.forEach(k=>{g2[k]=src.querySelector('.'+CLS[k])});
 const it={host,cv,ctx:cv.getContext('2d'),fx,tex:top.userData.faceTex,src,g2,J:top.userData.J||{},piv,cam,PX,drive,wheel:top.userData.wheel,yaw:opt.yaw,spin:opt.spin,
  wr:opt.wrap||(src&&src.closest('.rb')),yawNow:opt.yaw==null?-.3:opt.yaw,vis:!io,last:0,lastGrab:-1e9,t0:0,busy:false,
  dispose(){g.traverse(o=>{if(o.isMesh){if(o.material.map&&o.material.map!==grad)o.material.map.dispose();o.material.dispose()}})}};
 cv.__r3=it;live.add(it);if(io)io.observe(cv);grab(it);go();return {canvas:cv}}

/* ---------- todos los Rumbo de la app ----------
   Se cambia a 3D cada .rb con el Rumbo de siempre (modelo U). Se quedan planos: trajes (data-skin), dibujos fijos o en gris,
   siluetas, el de la avioneta (lo monta torre.js con su propio encuadre) y las comparaciones de diseños viejos. */
function eligible(rb){if(rb.__r3t||rb.classList.contains('is-3d')||rb.classList.contains('rb-debug'))return false;
 const s=rb.querySelector(':scope>svg.rbx-U');if(!s||s.getAttribute('data-skin')||s.getAttribute('viewBox')!=='0 0 100 100')return false;
 if(rb.closest('.tw-pilot,.ia-sil,.rb-2d'))return false;return true}
function upgrade(rb){rb.__r3t=1;const s=rb.querySelector(':scope>svg.rbx-U');const w=rb.getBoundingClientRect().width||rb.offsetWidth||88;
 const r=mount(rb,{px:Math.max(48,w*1.3),src:s,wrap:rb,drive:false});if(r)rb.classList.add('is-3d')}
let pend=0;function scan(){pend=0;document.querySelectorAll('.rb').forEach(rb=>{if(eligible(rb))upgrade(rb)})}
export function auto(){if(!setup())return false;scan();
 new MutationObserver(()=>{if(!pend)pend=requestAnimationFrame(scan)}).observe(document.body,{childList:true,subtree:true});return true}
