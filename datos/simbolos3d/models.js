// Modelos 3D completos de los símbolos: cada objeto armado con piezas reales (cajas redondeadas, cilindros,
// esferas, tornos, tubos y extrusiones) para que se vea bien desde cualquier ángulo.
// Coordenadas: x a la derecha, y arriba, z hacia la cámara. Tamaño aproximado 100.
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {SVGLoader} from 'three/addons/loaders/SVGLoader.js';

export function kit(material,g){
  const M=(c,m)=>material(c,m||'plastic');
  const add=(geo,c,m,o)=>{o=o||{};const mesh=new THREE.Mesh(geo,M(c,m));
    if(o.p)mesh.position.set(...o.p);if(o.r)mesh.rotation.set(...o.r.map(a=>a*Math.PI/180));if(o.s)mesh.scale.set(...o.s);
    mesh.castShadow=mesh.receiveShadow=true;(o.parent||g).add(mesh);return mesh};
  const K={
    group(o){o=o||{};const q=new THREE.Group();if(o.p)q.position.set(...o.p);if(o.r)q.rotation.set(...o.r.map(a=>a*Math.PI/180));(o.parent||g).add(q);return q},
    box(w,h,d,c,o){o=o||{};const r=o.rad==null?Math.min(w,h,d)*0.18:o.rad;return add(new RoundedBoxGeometry(w,h,d,4,Math.max(0.01,Math.min(r,Math.min(w,h,d)/2-0.01))),c,o.m,o)},
    cyl(rt,rb,h,c,o){o=o||{};return add(new THREE.CylinderGeometry(rt,rb,h,o.seg||40,1,!!o.open),c,o.m,o)},
    sph(r,c,o){o=o||{};return add(new THREE.SphereGeometry(r,40,28),c,o.m,o)},
    tor(R,r,c,o){o=o||{};return add(new THREE.TorusGeometry(R,r,20,56,o.arc?o.arc*Math.PI/180:Math.PI*2),c,o.m,o)},
    cone(r,h,c,o){o=o||{};return add(new THREE.ConeGeometry(r,h,o.seg||32),c,o.m,o)},
    lathe(pts,c,o){o=o||{};return add(new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(p[0],p[1])),56),c,o.m,o)},
    tube(pts,r,c,o){o=o||{};const v=pts.map(p=>new THREE.Vector3(p[0],p[1],p[2]||0));const path=new THREE.CatmullRomCurve3(v,!!o.closed,'catmullrom',o.tension==null?0.5:o.tension);
      const m=add(new THREE.TubeGeometry(path,Math.max(24,v.length*12),r,18,!!o.closed),c,o.m,o);
      if(!o.closed&&!o.nocap)[v[0],v[v.length-1]].forEach(p=>add(new THREE.SphereGeometry(r,18,12),c,o.m,{p:[p.x,p.y,p.z],parent:o.parent}));return m},
    // extrusión de un contorno 2D (en coordenadas con y hacia arriba), centrada en z
    ext(d,depth,c,o){o=o||{};const data=new SVGLoader().parse('<svg xmlns="http://www.w3.org/2000/svg"><path transform="scale(1,-1)" d="'+d+'"/></svg>');const shapes=[];data.paths.forEach(p=>SVGLoader.createShapes(p).forEach(s=>shapes.push(s)));
      const bv=o.bevel==null?Math.min(2,depth*0.3):o.bevel;
      const geo=new THREE.ExtrudeGeometry(shapes,{depth:depth,bevelEnabled:bv>0,bevelThickness:bv,bevelSize:bv*0.8,bevelSegments:6,curveSegments:32});
      geo.translate(0,0,-depth/2);if(o.center){geo.computeBoundingBox();const b=geo.boundingBox;geo.translate(-(b.min.x+b.max.x)/2,-(b.min.y+b.max.y)/2,0)}
      return add(geo,c,o.m,o)},
  };
  return K;
}

const GY='#8C96A0',ST='#A9B6C2',BK='#3A4048',WH='#F3F1EA',RE='#DE4A3C',BL='#3F82C4',GR='#4FAE5B',YE='#F6CD3B',BR='#8A5A36',WO='#B9804B',GO='#E8B53C',NA='#2D4A6E',CR='#F0E2C2',SK='#E7A97C';

export const MODELS={
  // Laptop: base con teclado y touchpad; pantalla inclinada con bisagra y código; tapa trasera con logo
  'computacion.b'(K){
    K.box(70,5,46,'#A9B6C2',{m:'metal',p:[0,0,0],rad:2});
    const kb=K.group({p:[0,2.6,-4]});
    for(let r=0;r<4;r++)for(let c=0;c<11;c++)K.box(4.6,1.2,4.2,'#3A4048',{p:[-27.5+c*5.5,0,-9+r*5.6],rad:0.6,parent:kb});
    K.box(30,1.4,4.2,'#3A4048',{p:[0,0,13.4],rad:0.6,parent:kb});
    K.box(20,0.6,10,'#8C96A0',{m:'metal',p:[0,2.6,17],rad:1});
    const lid=K.group({p:[0,1.5,-22],r:[-14,0,0]});
    K.cyl(2,2,56,'#8C96A0',{m:'metal',r:[0,0,90],parent:lid});
    K.box(70,46,3,'#3A4048',{p:[0,24,0],rad:1.4,parent:lid});
    K.box(62,38,0.6,'#13283B',{p:[0,25,1.5],rad:0.3,parent:lid});
    const code=K.group({p:[0,25,2.1],parent:lid});
    K.tube([[-12,7,0],[-20,0,0],[-12,-7,0]],1.3,'#5BE07A',{tension:0,parent:code});
    K.tube([[12,7,0],[20,0,0],[12,-7,0]],1.3,'#5BE07A',{tension:0,parent:code});
    K.tube([[4,9,0],[-4,-9,0]],1.3,YE,{parent:code});
    K.cyl(4,4,0.8,'#C9D0D6',{m:'metal',p:[0,24,-1.8],r:[90,0,0],parent:lid});
  },
  // Compás de dibujo sobre un plano enrollado a medias
  'arquitectura.a'(K){
    K.box(74,1.6,50,'#3F82C4',{p:[0,0,0],rad:0.6});
    [-14,-6,2,10].forEach((z,i)=>K.box(i%2?30:46,0.4,1.2,'#EAF4FB',{p:[-8,1,z],rad:0.2}));
    K.box(18,0.4,18,'#EAF4FB',{p:[22,1,10],rad:0.2});K.box(14,0.5,14,'#3F82C4',{p:[22,1.1,10],rad:0.2});
    K.cyl(5,5,50,'#5B9BD8',{p:[-37,5,0],r:[90,0,0]});K.cyl(2.2,2.2,50.4,'#2C6AA8',{p:[-37,5,0],r:[90,0,0]});
    const c=K.group({p:[6,1,0]});
    K.cyl(3.4,3.4,4,'#8C96A0',{m:'metal',p:[0,62,0],r:[90,0,0],parent:c});
    K.cyl(1.6,2,10,'#3A4048',{p:[0,70,0],parent:c});K.sph(2.4,'#3A4048',{p:[0,76,0],parent:c});
    K.tube([[0,60,0],[-16,2,6]],1.8,ST,{m:'metal',parent:c});
    K.cone(1.2,4,'#8C96A0',{m:'metal',p:[-16.6,0,6.2],r:[180,0,15],parent:c});
    K.tube([[0,60,0],[16,10,-4]],1.8,ST,{m:'metal',parent:c});
    K.cyl(2.2,2.2,8,'#F2D3A0',{p:[17.3,5.5,-5],r:[0,0,17],parent:c});
    K.cone(2.2,4,'#3A4048',{p:[18.6,0.8,-5],r:[180,0,17],parent:c});
    K.tube([[-6,38,1.5],[6,38,-1.5]],0.9,'#5B6670',{m:'metal',parent:c});
  },
  // Corbata con nudo, cuello de camisa y franjas en ambas caras
  'negocios.b'(K){
    const tie='M-9 -14 L9 -14 L14 50 L0 66 L-14 50 Z';
    K.ext(tie,6,RE,{bevel:1.6});
    K.ext('M-10 -26 L10 -26 L7 -12 L-7 -12 Z',9,'#C23B30',{bevel:2});
    [[0,4,12],[0,20,17],[0,36,21]].forEach(([x,y,w])=>{[4.9,-4.9].forEach(z=>K.box(w,3.6,0.9,NA,{p:[x,-y,z],r:[0,0,-30],rad:0.3}))});
    K.ext('M-12 -30 L-30 -36 L-20 -16 L-8 -22 Z',3,WH,{bevel:1,p:[0,0,3],r:[0,-18,0]});
    K.ext('M12 -30 L30 -36 L20 -16 L8 -22 Z',3,WH,{bevel:1,p:[0,0,3],r:[0,18,0]});
  },
  // Campana de Gauss: superficie con volumen sobre una base con ejes y marcas de desviación
  'actuaria.b'(K){
    K.box(90,4,30,'#E9EEF2',{p:[0,-2,0],rad:1.2});
    const pts=[];for(let i=0;i<=40;i++){const x=-40+i*2;pts.push([x,46*Math.exp(-(x*x)/(2*13*13))])}
    const d='M-40 0 '+pts.map(p=>'L'+p[0]+' '+(-p[1]).toFixed(2)).join(' ')+' L40 0 Z';
    K.ext(d,14,BL,{bevel:1.4});
    [-13,0,13].forEach(x=>{const h=46*Math.exp(-(x*x)/338);[8.1,-8.1].forEach(z=>K.box(x?1.4:2,h,0.6,x?'#1F4E7A':'#FFFFFF',{p:[x,h/2,z],rad:0.2}))});
    K.box(84,1.2,1.2,'#3A4048',{p:[0,0.6,15],rad:0.4});
  },
  // Palmera en isla: tronco curvo con anillos, hojas con folíolos en todas direcciones, cocos, arena y agua
  'turismo.b'(K){
    K.cyl(38,38,3,'#5FB4E8',{p:[0,-4,0],seg:56});
    K.sph(30,'#F3D98A',{p:[0,-4,0],s:[1,0.3,0.8]});
    const T=[[0,2,0],[3,20,0],[8,38,2],[14,56,3]];
    K.tube(T,4,'#9A6A3E',{});
    const curve=new THREE.CatmullRomCurve3(T.map(p=>new THREE.Vector3(...p)));
    for(let i=1;i<10;i++){const p=curve.getPoint(i/10);K.tor(4.2,0.9,'#7A4E26',{p:[p.x,p.y,p.z],r:[90,0,0]})}
    const top=[14,57,3];
    for(let k=0;k<7;k++){const a=k*360/7+10;const q=K.group({p:top,r:[0,a,0]});
      const sp=[[0,0,0],[12,3,0],[24,0,0],[34,-8,0],[40,-16,0]];
      K.tube(sp,0.9,'#2F7F3E',{parent:q,nocap:true});
      const crv=new THREE.CatmullRomCurve3(sp.map(v=>new THREE.Vector3(...v)));
      for(let j=1;j<14;j++){const t=j/14,pt=crv.getPoint(t),tg=crv.getTangent(t);const len=9*Math.sin(Math.PI*Math.min(1,t*1.1))+2;
        [1,-1].forEach(sd=>{const fz=sd*len;const tip=[pt.x+tg.x*4,pt.y-len*0.45,pt.z+fz];K.tube([[pt.x,pt.y,pt.z],[(pt.x+tip[0])/2,pt.y-len*0.15,pt.z+fz*0.55],tip],0.9,'#4FAE5B',{parent:q,nocap:true})})}}
    [[11,53,6],[17,52,7],[14,52,-1]].forEach(p=>K.sph(3.6,'#6B4423',{p}));
  },
  // Casa con techo de dos aguas, chimenea, puerta, ventanas en frente y costados, y corazón
  'trabajosocial.b'(K){
    K.box(50,36,40,CR,{p:[0,18,0],rad:1.2});
    const gable='M-25 0 L25 0 L0 -22 Z';
    [20.2,-20.2].forEach(z=>K.ext(gable,0.8,CR,{bevel:0,p:[0,36,z]}));
    const L=Math.hypot(30,24.5),A=Math.atan2(24.5,30)*180/Math.PI;
    K.box(L,2.6,48,RE,{p:[-15,46.3,0],r:[0,0,A],rad:0.8});
    K.box(L,2.6,48,RE,{p:[15,46.3,0],r:[0,0,-A],rad:0.8});
    K.cyl(2.2,2.2,49,'#C23B30',{p:[0,58.5,0],r:[90,0,0]});
    K.box(7,16,7,'#9A3A2E',{p:[14,55,-8],rad:0.8});
    K.box(14,22,1.6,'#8A5A36',{p:[9,11,20.4],rad:0.6});K.sph(1,GO,{m:'metal',p:[13,11,21.4]});
    K.box(13,11,1,'#AEE0F2',{p:[-12,25,20.3],rad:0.4});K.box(13,1,1.6,'#FFFFFF',{p:[-12,25,20.6],rad:0.3});K.box(1,11,1.6,'#FFFFFF',{p:[-12,25,20.6],rad:0.3});
    [25.3,-25.3].forEach(x=>{K.box(1,11,13,'#AEE0F2',{p:[x,24,0],rad:0.4});K.box(1.6,1,13,'#FFFFFF',{p:[x,24,0],rad:0.3});K.box(1.6,11,1,'#FFFFFF',{p:[x,24,0],rad:0.3})});
    K.box(13,11,1,'#AEE0F2',{p:[0,25,-20.3],rad:0.4});K.box(13,1,1.6,'#FFFFFF',{p:[0,25,-20.6],rad:0.3});K.box(1,11,1.6,'#FFFFFF',{p:[0,25,-20.6],rad:0.3});
    K.ext('M0 6 C-8 0 -10 -4 -8 -7 C-6 -10 -2 -9 0 -6 C2 -9 6 -10 8 -7 C10 -4 8 0 0 6 Z',2.4,RE,{bevel:0.8,p:[-12,12,21]});
  },
};
