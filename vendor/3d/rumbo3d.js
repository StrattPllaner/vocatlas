/* Rumbo en 3D manejando la avioneta: mismo estilo que los símbolos (tres tonos y contorno de tinta).
   Mira hacia la nariz del avión en tres cuartos, mueve el volante con las dos manos, se mece con él y parpadea.
   30 cuadros por segundo; se detiene cuando no se ve. Si no hay WebGL se queda el dibujo plano. */
import * as THREE from './three.module.min.js';
import {kit,rumbo3d} from './models.js';
const grad=new THREE.DataTexture(new Uint8Array([115,115,115,255,185,185,185,255,255,255,255,255]),3,1,THREE.RGBAFormat);grad.minFilter=grad.magFilter=THREE.NearestFilter;grad.needsUpdate=true;
function material(col,m){let c=new THREE.Color(col);const o={color:c,gradientMap:grad};
 if(m==='glass')Object.assign(o,{transparent:true,opacity:.5,depthWrite:false});
 const mt=new THREE.MeshToonMaterial(o);mt.userData.ink=c.clone().multiplyScalar(.38);mt.userData.glass=m==='glass';return mt}
function addInk(g){const L=[];g.traverse(o=>{if(o.isMesh&&!o.userData.ink)L.push(o)});
 L.forEach(o=>{if(!o.material.userData||o.material.userData.glass||!o.material.userData.ink)return;const im=new THREE.MeshBasicMaterial({color:o.material.userData.ink,side:THREE.BackSide});
  im.onBeforeCompile=sh=>{sh.vertexShader=sh.vertexShader.replace('#include <begin_vertex>','vec3 transformed = vec3( position ) + normalize(normal) * 1.1;')};const m=new THREE.Mesh(o.geometry,im);m.userData.ink=1;o.add(m)})}
export function mount(host,opt){opt=opt||{};
 let R;try{R=new THREE.WebGLRenderer({antialias:true,alpha:true})}catch(e){return null}
 const PX=Math.round((opt.px||90)*Math.min(2,window.devicePixelRatio||1));R.setPixelRatio(1);R.setSize(PX,PX,false);R.setClearColor(0,0);R.outputColorSpace=THREE.SRGBColorSpace;
 const cv=R.domElement;cv.className='rb3d';cv.setAttribute('aria-hidden','true');host.appendChild(cv);
 const scene=new THREE.Scene(),key=new THREE.DirectionalLight(0xffffff,2.6);key.position.set(-60,90,120);scene.add(key);scene.add(new THREE.AmbientLight(0xffffff,.55));
 const g=new THREE.Group();const body=rumbo3d(kit(material,g),{drive:true});addInk(g);
 const box=new THREE.Box3().setFromObject(g),c=box.getCenter(new THREE.Vector3()),sz=box.getSize(new THREE.Vector3());g.position.sub(c);
 const piv=new THREE.Group();piv.add(g);scene.add(piv);
 const cam=new THREE.PerspectiveCamera(26,1,1,2000),r=Math.max(sz.x,sz.y,sz.z)*.62+4,dist=r/Math.tan(THREE.MathUtils.degToRad(13));cam.position.set(0,0,dist);cam.lookAt(0,0,0);cam.near=dist/10;cam.far=dist*4;cam.updateProjectionMatrix();
 const face=body.userData.face,wheel=body.userData.wheel,RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
 let vis=true,last=0,t0=0,blinkAt=2,raf=0;
 const io='IntersectionObserver' in window?new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis&&!raf)raf=requestAnimationFrame(loop)}):null;if(io)io.observe(cv);
 function loop(ts){raf=0;if(!cv.isConnected){R.dispose();return}if(!vis||document.hidden)return;raf=requestAnimationFrame(loop);if(ts-last<32)return;last=ts;if(!t0)t0=ts;const t=(ts-t0)/1000,fast=host.closest('.is-flying')?1:0;
  const st=RM?0:((fast?.36:.22)*Math.sin(t*2*Math.PI/1.9)+.07*Math.sin(t*2*Math.PI/.73));
  if(wheel)wheel.rotation.z=-st*1.6;
  piv.rotation.set(.16,(opt.yaw==null?-.72:opt.yaw)+st*.25,st*.18);
  if(face){if(t>blinkAt&&t<blinkAt+.13)face.material.map=face.userData.tC;else{face.material.map=face.userData.tO;if(t>blinkAt+.13)blinkAt=t+2.5+Math.random()*3}}
  R.render(scene,cam)}
 raf=requestAnimationFrame(loop);return {canvas:cv}}
