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
    shape(outer,holes,depth,c,o){o=o||{};const sh=new THREE.Shape(outer.map(p=>new THREE.Vector2(p[0],p[1])));(holes||[]).forEach(h=>sh.holes.push(new THREE.Path(h.map(p=>new THREE.Vector2(p[0],p[1])))));
      const bv=o.bevel==null?Math.min(1.5,depth*0.25):o.bevel;const geo=new THREE.ExtrudeGeometry(sh,{depth:depth,bevelEnabled:bv>0,bevelThickness:bv,bevelSize:bv*0.8,bevelSegments:4,curveSegments:24});geo.translate(0,0,-depth/2);return add(geo,c,o.m,o)},
    cap(r,len,c,o){o=o||{};return add(new THREE.CapsuleGeometry(r,len,8,20),c,o.m,o)},
    // extrusión de un contorno 2D (en coordenadas con y hacia arriba), centrada en z
    ext(d,depth,c,o){o=o||{};const data=new SVGLoader().parse('<svg xmlns="http://www.w3.org/2000/svg"><path transform="scale(1,-1)" d="'+d+'"/></svg>');const shapes=[];data.paths.forEach(p=>SVGLoader.createShapes(p).forEach(s=>shapes.push(s)));
      const bv=o.bevel==null?Math.min(2,depth*0.3):o.bevel;
      const geo=new THREE.ExtrudeGeometry(shapes,{depth:depth,bevelEnabled:bv>0,bevelThickness:bv,bevelSize:bv*0.8,bevelSegments:6,curveSegments:32});
      geo.translate(0,0,-depth/2);if(o.center){geo.computeBoundingBox();const b=geo.boundingBox;geo.translate(-(b.min.x+b.max.x)/2,-(b.min.y+b.max.y)/2,0)}
      return add(geo,c,o.m,o)},
  };
  return K;
}

const PU='#8E5BB5',TE='#2FA39A',OR='#F08A2E',PK='#F3A3B5',GL='#AEE0F2';const GY='#8C96A0',ST='#A9B6C2',BK='#3A4048',WH='#F3F1EA',RE='#DE4A3C',BL='#3F82C4',GR='#4FAE5B',YE='#F6CD3B',BR='#8A5A36',WO='#B9804B',GO='#E8B53C',NA='#2D4A6E',CR='#F0E2C2',SK='#E7A97C';

const circ=(cx,cy,r,n,a0,a1)=>{a0=a0==null?0:a0;a1=a1==null?Math.PI*2:a1;const o=[];for(let i=0;i<n;i++){const a=a0+(a1-a0)*i/(n-(Math.abs(a1-a0-Math.PI*2)<1e-6?0:1));o.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r])}return o};
export const MODELS={
  // avioneta de Rumbo, tipo Ryan STA: ala baja, cabina abierta, ruedas con carenado, timón y estabilizador. La nariz apunta a -x
  'avioneta'(K){
    const RD='#D9493B',YL='#F2C870',CRM='#F6EBD2',DK='#3A3026',MT='#B8C2CC';
    const prof=[[0,-44],[6,-43],[9.5,-40],[10.5,-34],[11,-24],[11,-12],[10.4,-2],[9,10],[7,20],[5,30],[3.2,38],[1.6,43],[0,44]];
    K.lathe(prof,RD,{r:[0,0,-90]});
    K.cyl(10.2,9.6,6,CRM,{r:[0,0,90],p:[-36,0,0],seg:48});
    K.cone(5,9,YL,{r:[0,0,90],p:[-48,0,0]});
    K.cyl(1.2,1.2,1,DK,{r:[0,0,90],p:[-44.5,0,0]});
    // franja crema a los lados
    [1,-1].forEach(s=>K.tube([[-30,3,10.9*s],[-12,3.2,11.2*s],[4,3,10.5*s],[20,2.4,7.4*s],[34,1.6,4.3*s]],0.9,CRM));
    // cabina abierta y parabrisas
    K.tor(5.4,1.1,DK,{r:[90,0,0],p:[-4,10.2,0]});
    K.cyl(5,5,1,DK,{p:[-4,9.6,0]});
    K.box(0.8,5,9,'#BFE3F5',{m:'glass',p:[-11,12.6,0],r:[0,0,-28],rad:0.3});
    // ala baja
    const wing=[[-22,0],[0,0],[-3,56],[-17,56]];
    [1,-1].forEach(s=>K.shape(wing.map(p=>[p[0],p[1]*s]),[],3,YL,{r:[90,0,0],p:[-4,-7,0],bevel:1}));
    // estabilizador y timón
    const hs=[[0,0],[10,0],[9,19],[3,19]];
    [1,-1].forEach(s=>K.shape(hs.map(p=>[p[0],p[1]*s]),[],1.8,YL,{r:[90,0,0],p:[33,1,0],bevel:.6}));
    K.ext('M30 0 L44 0 L46 -17 L40 -19 Z',2,RD,{bevel:.6,p:[0,1,0]});
    // tren de aterrizaje con carenado
    [1,-1].forEach(s=>{K.cyl(1,1,15,MT,{p:[-14,-14,13*s],r:[s*-12,0,0]});K.cap(4.2,8,YL,{r:[0,0,90],p:[-14,-22,14.6*s]});K.cyl(3.4,3.4,2.6,DK,{r:[90,0,0],p:[-14,-24.5,14.6*s]})});
    K.cyl(.7,.7,6,MT,{p:[40,-4,0],r:[0,0,25]});K.sph(1.4,DK,{p:[41.5,-6.5,0]});
  },
  // Capitolio: escalinata, columnas, frontón, tambor y cúpula
  'politicas.a'(K){
    const WH='#EFE6D2';
    [[80,4,44,-38],[72,4,40,-34],[64,4,36,-30]].forEach(([w,h,d,y])=>K.box(w,h,d,'#C9BC9E',{p:[0,y,0],rad:0.6}));
    for(let i=0;i<6;i++)[12,-16].forEach(z=>K.cyl(2.6,2.8,26,WH,{p:[-25+i*10,-15,z]}));
    K.box(62,24,20,'#D9CDB4',{p:[0,-15,-2],rad:0.6});
    K.box(66,4,36,WH,{p:[0,0,-2],rad:0.6});
    K.ext('M-33 0 L33 0 L0 -12 Z',36,WH,{bevel:0.6,p:[0,2,-2]});
    K.cyl(16,16,12,WH,{p:[0,20,-4]});for(let i=0;i<12;i++){const a=i/12*Math.PI*2;K.cyl(1,1,11,'#D5DCE2',{p:[Math.cos(a)*16.4,20,Math.sin(a)*16.4-4]})}
    const d=K.sph(16,ST,{m:'metal',p:[0,26,-4]});d.geometry=new THREE.SphereGeometry(16,40,20,0,Math.PI*2,0,Math.PI/2);
    K.cyl(3,3,8,WH,{p:[0,46,-4]});K.cone(2.4,6,ST,{m:'metal',p:[0,53,-4]});
  },
  // Urna de votación con boleta entrando
  'politicas.b'(K){
    K.box(64,46,40,BL,{p:[0,-12,0],rad:4});K.box(66,6,42,'#2C5E91',{p:[0,13,0],rad:2});
    K.box(30,3,4,'#1A3A5C',{p:[0,16.5,0],rad:1});
    [20.4,-20.4].forEach(z=>{K.box(26,14,1,WH,{p:[0,-12,z],rad:1.4});K.box(16,2,1.4,'#7FA8D6',{p:[0,-12,z],rad:0.6})});
    const b=K.group({p:[0,30,0],r:[0,0,8]});K.box(26,30,1,WH,{parent:b,rad:0.6});
    [0.8,-0.8].forEach(z=>K.tube([[-6,2,z],[-1,-4,z],[8,8,z]],1.4,GR,{parent:b,tension:0}));
  },
  // Molécula: tres átomos unidos por enlaces
  'quimica.a'(K){
    const A=[[0,20,0,15,RE],[-22,-16,6,12,BL],[22,-14,-6,13,WH]];
    A.forEach((a,i)=>{K.sph(a[3],a[4],{p:a.slice(0,3)});const b=A[(i+1)%3];K.tube([a.slice(0,3),b.slice(0,3)],2.4,'#8994A0',{nocap:true})});
  },
  // Matraz de laboratorio con líquido verde y engrane de ingeniería
  'quimicaing.a'(K){
    K.lathe([[0.01,-30],[26,-30],[28,-27],[9,10],[9,28],[11,30],[0.01,30]],'#DDF1FA',{m:'membrane',p:[-8,0,0]});
    K.lathe([[0.01,-29],[25,-29],[19,-12],[0.01,-12]].reverse(),GR,{p:[-8,0,0]});
    [[-12,-22],[-4,-18],[-10,-14]].forEach(([x,y])=>K.sph(1.8,'#BFF0C8',{p:[x,y,8]}));
    K.cyl(10,10,6,ST,{m:'metal',p:[-8,33,0]});
    const g=K.group({p:[26,22,0]});K.cyl(10,10,7,ST,{m:'metal',r:[90,0,0],parent:g});
    for(let i=0;i<8;i++){const a=i/8*Math.PI*2;K.box(5,5,7,ST,{m:'metal',p:[Math.cos(a)*11.5,Math.sin(a)*11.5,0],r:[0,0,a*180/Math.PI],rad:1,parent:g})}
    K.cyl(3.4,3.4,8,'#5B6670',{r:[90,0,0],parent:g});
  },
  // Torre de destilación con platos, tuberías y válvulas
  'quimicaing.b'(K){
    K.cap(14,62,ST,{m:'metal'});
    for(let i=0;i<5;i++)K.tor(14.2,0.9,'#3A82C4',{p:[0,-24+i*12,0],r:[90,0,0]});
    K.tube([[-14,18,0],[-26,18,0],[-26,-10,0]],2.4,GY,{m:'metal',tension:0});K.cyl(4,4,3,RE,{p:[-26,-12,0]});
    K.tube([[14,-6,0],[28,-6,0],[28,-34,0]],2.4,GY,{m:'metal',tension:0});K.cyl(4,4,3,OR,{p:[28,-36,0]});
    K.cyl(18,18,4,'#5B6670',{p:[0,-46,0]});K.sph(4,OR,{p:[0,-26,13]});
  },
  // Globo terráqueo con continentes y bandera
  'rrii.a'(K){
    K.sph(30,BL,{});
    const blob=(lat,lon,r,sx,sy)=>{const v=new THREE.Vector3().setFromSphericalCoords(29.4,(90-lat)*Math.PI/180,lon*Math.PI/180);const m=K.sph(r,GR,{p:[v.x,v.y,v.z],s:[sx,sy,0.14]});m.lookAt(0,0,0)};
    [[30,-100,11,1.2,1],[-15,-60,9,0.9,1.5],[45,10,9,1.3,0.8],[5,20,10,0.9,1.4],[50,90,12,1.6,0.9],[-25,135,7,1.2,0.9],[60,-40,5,1,1]].forEach(b=>blob(...b));
    K.cyl(1.4,1.4,24,GY,{m:'metal',p:[14,36,8],r:[0,0,-20]});K.ext('M0 0 L18 5 L0 10 Z',1.4,RE,{bevel:0.4,p:[18,36,8],r:[0,0,-20]});
  },
  // Pasaporte con escudo dorado
  'rrii.b'(K){
    K.box(54,74,8,NA,{rad:3});K.box(52,72,6,'#F4F2EC',{p:[1.4,0,0],rad:2});K.box(54,74,7,NA,{p:[0,0,0.6],rad:3,s:[1,1,1]});
    [4.3,-4.3].forEach(z=>{K.tor(11,1.2,GO,{m:'gold',p:[0,8,z]});K.box(22,1.6,0.6,GO,{m:'gold',p:[0,8,z],rad:0.4});K.box(1.6,22,0.6,GO,{m:'gold',p:[0,8,z],rad:0.4});
      K.box(30,2,0.6,GO,{m:'gold',p:[0,-18,z],rad:0.5});K.box(20,1.6,0.6,GO,{m:'gold',p:[0,-24,z],rad:0.5})});
  },
  // Maleta de viaje con asa, cintas, broches, ruedas y etiqueta
  'turismo.a'(K){
    K.box(70,54,28,OR,{p:[0,-4,0],rad:6});
    K.tube([[-14,23,0],[-14,32,0],[14,32,0],[14,23,0]],2.6,'#5E3A20',{tension:0.2});
    [-18,18].forEach(x=>{K.box(5,55,29,'#8A4A16',{p:[x,-4,0],rad:1.4});[14.8,-14.8].forEach(z=>K.box(6,5,1.4,ST,{m:'metal',p:[x,14,z],rad:0.8}))});
    [[-28,-14],[28,-14],[-28,14],[28,14]].forEach(([x,z])=>K.sph(3.4,BK,{p:[x,-33,z]}));
    K.box(14,10,1,WH,{p:[2,-8,14.6],rad:1});K.box(8,1,1.2,'#9AA3AC',{p:[2,-8,15],rad:0.3});
    K.box(30,22,1,'#C9661E',{p:[0,-4,-14.4],rad:2});[-8,8].forEach(x=>K.box(2,18,1.4,'#8A4A16',{p:[x,-4,-14.8],rad:0.6}));
  },

  // Silla de madera con respaldo de travesaños
  'disindustrial.a'(K){
    K.box(46,5,42,WO,{m:'wood',p:[0,0,0],rad:1.6});
    [[-19,-17],[19,-17],[-19,17],[19,17]].forEach(([x,z])=>K.box(4,36,4,'#8F5E30',{m:'wood',p:[x,-20,z],rad:1}));
    [-19,19].forEach(x=>K.box(4,44,4,'#8F5E30',{m:'wood',p:[x,24,-17],rad:1}));
    [36,26,16].forEach(y=>K.box(38,5,3,WO,{m:'wood',p:[0,y,-17],rad:1}));
    K.box(38,2.4,2.4,'#8F5E30',{m:'wood',p:[0,-26,0],rad:0.8,r:[0,90,0]});
  },
  // Lámpara de escritorio articulada
  'disindustrial.b'(K){
    K.cyl(18,20,5,'#2B3540',{p:[0,-40,0]});
    K.tube([[0,-38,0],[-12,0,0]],2,ST,{m:'metal'});K.sph(3.4,GY,{m:'metal',p:[-12,0,0]});
    K.tube([[-12,0,0],[14,22,0]],2,ST,{m:'metal'});K.sph(3.4,GY,{m:'metal',p:[14,22,0]});
    const h=K.group({p:[22,20,0],r:[0,0,-130]});K.lathe([[0.01,0],[6,0],[8,4],[16,16],[17,18],[0.01,6]].reverse(),YE,{parent:h});K.cyl(5,5,1,'#FFF6CC',{p:[0,14,0],parent:h});
  },
  // Gráfica en ascenso con flecha y moneda
  'economia.a'(K){
    K.tube([[-40,-30,0],[-18,-6,0],[-4,-16,0],[24,20,0]],4,GR,{tension:0});
    K.cone(9,16,GR,{p:[30,27,0],r:[0,0,-43]});
    K.cyl(12,12,4,GO,{m:'gold',p:[-26,24,0],r:[90,0,0]});K.tor(9,0.8,'#C9961E',{m:'gold',p:[-26,24,2.2]});
    K.tor(9,0.8,'#C9961E',{m:'gold',p:[-26,24,-2.2]});
  },
  // Billete con marco, retrato y signo de pesos
  'economia.b'(K){
    K.box(88,46,3,'#8CC47A',{rad:2});
    [1.8,-1.8].forEach(z=>{const g=K.group({p:[0,0,z],r:[0,z<0?180:0,0]});
      K.box(80,38,0.5,'#6BA85A',{rad:2,parent:g});K.box(76,34,0.6,'#9FD38C',{rad:2,parent:g});
      K.cyl(12,12,0.8,'#BFE3B0',{r:[90,0,0],parent:g});
      K.tube([[4,6,0.6],[0,8,0.6],[-4,6,0.6],[-3,2,0.6],[3,-1,0.6],[4,-5,0.6],[0,-8,0.6],[-4,-6,0.6]],1,'#2F6A2E',{parent:g});K.tube([[0,11,0.6],[0,-11,0.6]],0.9,'#2F6A2E',{parent:g});
      [[-32,-14],[32,14]].forEach(([x,y])=>K.cyl(4,4,0.8,'#BFE3B0',{p:[x,y,0],r:[90,0,0],parent:g}))});
  },
  // Gorro de chef con pliegues y banda
  'gastronomia.a'(K){
    K.cyl(22,22,22,WH,{p:[0,-20,0]});
    for(let i=0;i<16;i++){const a=i/16*Math.PI*2;K.box(1,20,1,'#E1DDD3',{p:[Math.cos(a)*22.2,-20,Math.sin(a)*22.2]})}
    [[0,14,0,20],[-16,8,0,15],[16,8,0,15],[0,8,-14,15],[0,8,14,15],[-10,18,8,13],[10,18,-8,13]].forEach(([x,y,z,r])=>K.sph(r,WH,{p:[x,y,z]}));
  },
  // Sartén con huevo estrellado y mango
  'gastronomia.b'(K){
    const g=K.group({r:[55,0,0]});
    K.lathe([[0.01,-4],[28,-4],[33,4],[31,5],[26,-1],[0.01,-1]],'#2B3540',{parent:g});
    K.cyl(14,14,1.6,WH,{p:[-2,0,2],parent:g,s:[1,1,0.8]});K.sph(6,YE,{p:[0,1,2],s:[1,0.6,1],parent:g});
    K.cyl(3,3,36,BR,{m:'wood',p:[48,2,0],r:[0,0,90],parent:g});
    [16,10].forEach(r=>K.tor(r,0.8,'#3A4652',{p:[0,-4.4,0],r:[90,0,0],parent:g}));K.box(10,0.8,3,'#5B6670',{p:[0,-4.6,0],parent:g,rad:0.3});
  },
  // Plumilla de pluma fuente dorada
  'grafico.a'(K){
    const g=K.group({r:[0,0,-35]});
    K.lathe([[0.01,0],[12,0],[11,10],[7,24],[3,34],[0.01,38]],GO,{m:'gold',s:[1,1,0.45],parent:g});
    [5.6,-5.6].forEach(z=>{K.box(1,20,0.6,'#7A5A1A',{p:[0,22,z*0.9],parent:g});K.cyl(2.2,2.2,0.6,'#7A5A1A',{p:[0,12,z],r:[90,0,0],parent:g})});
    K.cyl(10,12,14,'#2B3540',{p:[0,-7,0],parent:g});K.cyl(12.4,12.4,3,GO,{m:'gold',p:[0,-15,0],parent:g});
    K.cyl(12,11,30,'#2B3540',{p:[0,-32,0],parent:g});K.sph(11,'#2B3540',{p:[0,-47,0],s:[1,0.5,1],parent:g});
  },

  // Engrane con flecha de mejora alrededor
  'industrial.a'(K){
    K.cyl(26,26,12,ST,{m:'metal',r:[90,0,0]});
    for(let i=0;i<10;i++){const a=i/10*Math.PI*2;K.box(10,10,12,ST,{m:'metal',p:[Math.cos(a)*29,Math.sin(a)*29,0],r:[0,0,a*180/Math.PI],rad:1.6})}
    K.cyl(9,9,13,'#5B6670',{r:[90,0,0]});K.cyl(4,4,14,'#3A4048',{r:[90,0,0]});
    K.tor(44,3.6,OR,{arc:110,r:[0,0,95]});K.cone(8,14,OR,{p:[-5,44,0],r:[0,0,90]});
  },
  // Fábrica con techo de sierra, chimenea y humo
  'industrial.b'(K){
    K.box(70,30,36,'#B5583F',{p:[0,-14,0],rad:1});
    for(let i=0;i<3;i++){K.ext('M0 0 L22 -14 L22 0 Z',36,'#9A4430',{bevel:0.6,p:[-35+i*22,1,0]});K.box(0.6,10,32,GL,{p:[-13+i*22,7,0]})}
    K.cyl(5,6,52,'#9A4430',{p:[28,8,-8]});[0,10].forEach(y=>K.cyl(6.2,6.2,3,WH,{p:[28,14+y,-8]}));
    [[30,40,6],[36,48,8],[44,54,6]].forEach(([x,y,r])=>K.sph(r,'#D5DCE2',{p:[x,y,-8]}));
    for(let i=0;i<3;i++)K.box(10,8,1,YE,{p:[-22+i*18,-12,18.3],rad:1});K.box(12,16,1,'#5E3A20',{p:[-2,-21,18.3],rad:1});
    for(let i=0;i<3;i++)K.box(10,8,1,YE,{p:[-22+i*18,-12,-18.3],rad:1});
  },
  // Letra pi en 3D
  'matematicas.a'(K){
    K.box(76,12,14,BL,{p:[0,30,0],rad:5});
    K.ext('M-22 -28 H-10 V22 C-10 30 -16 34 -26 32 V22 C-22 22 -22 20 -22 18 Z',14,BL,{bevel:3});
    K.ext('M10 -28 H22 V16 C22 22 26 24 32 22 V32 C20 38 10 32 10 20 Z',14,BL,{bevel:3});
  },
  // Pizarrón de operaciones: + − × =
  'matematicas.b'(K){
    K.box(70,70,10,'#2F5E45',{rad:10});
    [5.4,-5.4].forEach(z=>{const g=K.group({p:[0,0,z]});
      K.box(16,4,2,WH,{p:[-16,16,0],rad:1.6,parent:g});K.box(4,16,2,WH,{p:[-16,16,0],rad:1.6,parent:g});
      K.box(16,4,2,WH,{p:[16,16,0],rad:1.6,parent:g});
      K.box(16,4,2,WH,{p:[-16,-16,0],r:[0,0,45],rad:1.6,parent:g});K.box(16,4,2,WH,{p:[-16,-16,0],r:[0,0,-45],rad:1.6,parent:g});
      K.box(16,4,2,WH,{p:[16,-12,0],rad:1.6,parent:g});K.box(16,4,2,WH,{p:[16,-20,0],rad:1.6,parent:g})});
  },
  // Brazo robótico industrial
  'mecatronica.a'(K){
    K.cyl(22,24,6,'#5B6670',{p:[0,-42,0]});K.cyl(14,14,10,OR,{p:[0,-34,0]});
    K.sph(7,'#3A4048',{p:[0,-26,0]});
    K.tube([[0,-26,0],[-10,4,0]],6,OR,{});K.sph(6,'#3A4048',{p:[-10,4,0]});
    K.tube([[-10,4,0],[18,22,0]],5,OR,{});K.sph(5,'#3A4048',{p:[18,22,0]});
    K.cyl(4,4,8,ST,{m:'metal',p:[24,26,0],r:[0,0,-60]});
    [-1,1].forEach(sd=>K.box(3,12,4,ST,{m:'metal',p:[30,30+sd*5,0],r:[0,0,-60+sd*20],rad:0.8}));
  },
  // Engrane con circuito
  'mecatronica.b'(K){
    K.cyl(34,34,12,ST,{m:'metal',r:[90,0,0]});
    for(let i=0;i<10;i++){const a=i/10*Math.PI*2;K.box(11,11,12,ST,{m:'metal',p:[Math.cos(a)*37,Math.sin(a)*37,0],r:[0,0,a*180/Math.PI],rad:1.6})}
    [6.4,-6.4].forEach(z=>{K.box(36,36,1,GR,{p:[0,0,z],rad:3});
      [[-8,8,16,0],[8,-6,0,14],[-10,-8,0,10]].forEach(([x,y,w,h])=>K.box(w||1.6,h||1.6,0.6,GO,{m:'gold',p:[x,y,z*1.12],rad:0.3}));
      K.box(12,12,1.6,'#2B3540',{p:[4,4,z*1.15],rad:1})});
  },
  // Etiqueta de precio con hilo y signo de pesos
  'mercadotecnia.b'(K){
    K.shape([[-12,0],[10,-24],[46,-24],[46,24],[10,24]],[circ(2,0,4.5,24)],8,YE,{bevel:2});
    [5,-5].forEach(z=>{const g=K.group({p:[28,0,z],r:[0,z<0?180:0,0]});K.tube([[6,10,0],[0,12,0],[-6,9,0],[-6,3,0],[2,-1,0],[6,-6,0],[2,-11,0],[-6,-9,0]],1.4,'#8A5F12',{parent:g});K.tube([[0,16,0],[0,-16,0]],1.2,'#8A5F12',{parent:g})});
    K.tube([[-1,0,0],[-10,10,4],[-20,22,4],[-30,26,0]],0.7,GY,{nocap:true});
  },
  // Vestido en gancho
  'moda.a'(K){
    K.tube([[-30,30,0],[0,40,0],[30,30,0]],1.4,ST,{m:'metal',tension:0});K.tube([[-30,30,0],[30,30,0]],1.4,ST,{m:'metal'});
    K.tube([[0,40,0],[0,46,0],[5,50,0],[8,46,0]],1.4,ST,{m:'metal'});
    K.lathe([[0.01,30],[10,30],[12,18],[9,6],[13,0],[34,-44],[0.01,-44]].reverse(),RE,{s:[1,1,0.55]});
    K.tor(10,1.6,PK,{p:[0,6,0],r:[90,0,0],s:[1.05,1,0.6]});
    [-6,6].forEach(x=>K.tube([[x,30,0],[x*1.4,36,0],[x*3,30,0]],1,RE,{}));
  },
  // Tijeras de costura con ojos rojos
  'moda.b'(K){
    [[-1,ST],[1,'#C9D0D6']].forEach(([sd,c])=>{const g=K.group({r:[0,0,sd*-22],p:[0,0,sd*1.4]});
      K.ext('M-3 0 L3 0 L1 -54 Z',2.4,c,{m:'metal',bevel:0.8,parent:g});
      K.tube([[0,0,0],[0,-10,0],[sd*-2,-16,0]],2.4,RE,{parent:g});K.tor(9,2.6,RE,{p:[sd*-6,-26,0],parent:g})});
    K.cyl(2.6,2.6,6,GY,{m:'metal',r:[90,0,0]});
  },

  // Portafolio de piel con asa, cierres y esquineros
  'negocios.a'(K){
    K.box(80,52,26,BR,{p:[0,-6,0],rad:4});K.box(81,4,27,'#6E4426',{p:[0,6,0],rad:1});
    K.tube([[-14,20,0],[-14,30,0],[14,30,0],[14,20,0]],2.8,'#5E3A20',{tension:0.2});
    [13.4,-13.4].forEach(z=>{[-24,24].forEach(x=>K.box(8,6,1.4,GO,{m:'gold',p:[x,6,z],rad:1}));});
    [[-38,18],[38,18],[-38,-30],[38,-30]].forEach(([x,y])=>[13,-13].forEach(z=>K.box(6,6,2,GO,{m:'gold',p:[x,y,z],rad:1.4})));
  },
  // Pelota de tenis con líneas de movimiento
  'o_pelota2.a'(K){
    K.sph(28,'#D9E85A',{p:[10,0,0]});
    const a=0.75,b=0.25,c=2*Math.sqrt(a*b),P=[];
    for(let i=0;i<=72;i++){const t=i/72*Math.PI*2;const v=new THREE.Vector3(a*Math.cos(t)+b*Math.cos(3*t),a*Math.sin(t)-b*Math.sin(3*t),c*Math.sin(2*t)).normalize().multiplyScalar(28.3);P.push([v.x+10,v.y,v.z])}
    K.tube(P,1.3,WH,{closed:true});
    [[-26,10],[-30,0],[-26,-10]].forEach(([x,y])=>K.cap(1.6,14,'#C9C2B4',{p:[x,y,0],r:[0,0,90]}));
  },


  // Puente colgante: torres, cables, tirantes, tablero y agua
  'civil.b'(K){
    K.box(96,4,14,'#B23A2E',{p:[0,-6,0],rad:1});
    [-26,26].forEach(x=>{K.box(6,60,4,RE,{p:[x,10,5]});K.box(6,60,4,RE,{p:[x,10,-5]});[30,14,-2].forEach(y=>K.box(6,3,10,RE,{p:[x,y,0]}))});
    [5,-5].forEach(z=>{const c=[[-48,-4,z]];for(let i=0;i<=20;i++){const x=-26+i*2.6;c.push([x,38-28*Math.sin(Math.PI*i/20),z])}c.push([48,-4,z]);
      K.tube([[-48,-4,z],[-26,38,z]],0.8,'#7A2A22',{nocap:true});K.tube(c.slice(1,-1),0.8,'#7A2A22',{nocap:true});K.tube([[26,38,z],[48,-4,z]],0.8,'#7A2A22',{nocap:true});
      for(let i=1;i<20;i+=2){const x=-26+i*2.6,y=38-28*Math.sin(Math.PI*i/20);K.cyl(0.35,0.35,y+4,'#7A2A22',{p:[x,(y-4)/2,z]})}});
    K.box(100,4,40,BL,{p:[0,-26,0],rad:2,m:'glass'});
  },
  // Barco carguero con contenedores de colores y puente de mando
  'comext.a'(K){
    K.ext('M-46 0 H46 L36 22 H-40 Z',30,RE,{bevel:2});
    K.box(92,2,31,WH,{p:[0,0.5,0],rad:0.6});K.box(92,2,31.4,WH,{p:[0,-8,0],rad:0.6});
    const C=[OR,BL,GR,YE,RE,BL];
    for(let i=0;i<4;i++)for(let j=0;j<2;j++)K.box(16,10,12,C[(i+j*3)%6],{p:[-30+i*17,7,-7+j*14],rad:1});
    for(let i=0;i<3;i++)K.box(16,10,12,C[(i+2)%6],{p:[-22+i*17,17.4,0],rad:1});
    K.box(12,24,20,WH,{p:[38,13,0],rad:2});K.box(12.4,4,20.4,GL,{p:[38,20,0],rad:1});
    K.box(120,2,60,'#5FB4E8',{p:[0,-24,0],rad:1});
  },

  // Contenedor de carga corrugado con puertas y cerrojos
  'comext.b'(K){
    K.box(84,40,36,OR,{rad:1.2});
    for(let i=0;i<14;i++)[18.4,-18.4].forEach(z=>K.box(2.4,36,1,'#C9661E',{p:[-36+i*5.6,0,z],rad:0.4}));
    K.box(1,36,32,'#C9661E',{p:[42.4,0,0],rad:0.4});
    [-6,6].forEach(z=>K.cyl(0.9,0.9,34,ST,{m:'metal',p:[43,0,z]}));
    [[42,20,18],[-42,20,18],[42,-20,18],[-42,-20,18],[42,20,-18],[-42,20,-18],[42,-20,-18],[-42,-20,-18]].forEach(p=>K.box(5,5,5,'#9A4A16',{p,rad:1}));
  },
  // Micrófono de estudio con rejilla, soporte y base
  'comunicacion.a'(K){
    K.cap(13,22,ST,{m:'metal',p:[0,16,0]});
    for(let i=0;i<6;i++)K.tor(13.1,0.5,'#6B7884',{m:'metal',p:[0,6+i*5,0],r:[90,0,0]});
    K.cyl(13.4,13.4,4,BK,{p:[0,6,0]});
    K.tor(18,2,BK,{arc:180,r:[0,0,180],p:[0,4,0]});
    K.cyl(2.4,2.4,30,BK,{p:[0,-28,0]});K.cyl(16,18,4,BK,{p:[0,-44,0]});
  },
  // Periódico doblado con titular, foto y columnas
  'comunicacion.b'(K){
    K.box(60,78,4,'#F4F2EC',{rad:1});K.box(58,76,1,'#E9E6DE',{p:[4,-2,-2.6],rad:1});
    [[2.2,0],[-3.4,4]].forEach(([z,dx])=>{const g=K.group({p:[dx,-2*(dx>0),z],r:[0,z<0?180:0,0]});
      K.box(50,5,0.6,'#2B3540',{p:[0,30,0],rad:0.4,parent:g});K.box(22,16,0.6,'#A9B6C2',{p:[-12,12,0],rad:0.4,parent:g});
      for(let i=0;i<4;i++)K.box(20,1.4,0.6,'#8A939C',{p:[14,18-i*4,0],rad:0.3,parent:g});
      for(let i=0;i<7;i++)K.box(50,1.4,0.6,'#8A939C',{p:[0,-4-i*4.6,0],rad:0.3,parent:g})});
  },
  // Calculadora: pantalla con números, teclado de 20 teclas
  'contaduria.a'(K){
    K.box(54,80,10,'#4A5560',{rad:5});K.box(44,18,1,'#BFD8B0',{p:[0,24,5.2],rad:1.4});
    const t=K.group({p:[6,24,5.9]});[[-10,'M'],[-2,'M'],[6,'M']].forEach(([x])=>{});
    [-12,-4,4].forEach((x,i)=>{K.box(5,9,0.4,'#2F4A2F',{p:[x+8,24,5.9],rad:0.3})});
    for(let r=0;r<5;r++)for(let c=0;c<4;c++)K.box(9,7,3,c==3?(r==4?OR:'#9AA3AC'):WH,{p:[-15+c*10,8-r*9.5,5.4],rad:1.6});
    K.box(30,20,1,'#3A4048',{p:[0,-10,-5.4],rad:2});[[-20,-34],[20,-34],[-20,34],[20,34]].forEach(([x,y])=>K.cyl(3,3,2,'#2B3540',{p:[x,y,-5.6],r:[90,0,0]}));
  },
  // Recibo con borde dentado y renglones
  'contaduria.b'(K){
    const zig=[];for(let i=0;i<=10;i++)zig.push([-26+i*5.2,i%2?-44:-40]);
    K.shape([[-26,44],[26,44],...zig.reverse()],null,2,WH,{bevel:0.6});
    [1.4,-1.4].forEach(z=>{[30,22,14,6].forEach((y,i)=>K.box(i==3?24:40,1.6,0.4,'#9AA3AC',{p:[i==3?-8:0,y,z],rad:0.4}));K.box(40,2,0.4,GR,{p:[0,-14,z],rad:0.5});K.box(20,1.6,0.4,'#3A4048',{p:[10,-24,z],rad:0.4})});
  },
  // Lupa con huella digital en el lente
  'criminologia.a'(K){
    K.tor(26,4.4,'#3A4048',{});K.cyl(26,26,2,GL,{m:'glass',r:[90,0,0]});
    const g=K.group({p:[0,0,1.4]});
    for(let i=0;i<6;i++)K.tor(4+i*3,0.5,NA,{arc:220,r:[0,0,-20],parent:g});
    K.tube([[18,-18,0],[24,-24,0]],4,ST,{m:'metal'});K.tube([[24,-24,0],[46,-46,0]],5,'#2B3540',{});
  },
  // Placa de policía: escudo con estrella dorada
  'criminologia.b'(K){
    K.ext('M0 -46 C10 -40 24 -40 34 -42 C36 -10 30 22 0 46 C-30 22 -36 -10 -34 -42 C-24 -40 -10 -40 0 -46 Z',10,ST,{m:'metal',bevel:2.4});
    [6.6,-6.6].forEach(z=>{K.ext('M0 -34 C8 -30 16 -30 24 -32 C24 -8 20 14 0 32 C-20 14 -24 -8 -24 -32 C-16 -30 -8 -30 0 -34 Z',1,'#2C5E91',{bevel:0.6,p:[0,0,z]});
      K.cyl(12,12,1.6,GO,{m:'gold',p:[0,-4,z*1.2],r:[90,0,0]});K.ext('M0 -9 L2.6 -3 L9 -2.8 L4 1.4 L5.6 8 L0 4.4 L-5.6 8 L-4 1.4 L-9 -2.8 L-2.6 -3 Z',1,'#B8861C',{m:'gold',bevel:0.4,p:[0,-4,z*1.32]})});
  },
  // Gráfica de barras con lupa
  'datos.a'(K){
    [[-26,20,BL],[-8,36,TE],[10,26,OR]].forEach(([x,h,c])=>K.box(14,h,14,c,{p:[x,-30+h/2,0],rad:2}));
    K.box(60,2,22,'#D5DCE2',{p:[-8,-31,0],rad:0.8});
    K.tor(13,3,'#2B3540',{p:[18,18,10]});K.cyl(13,13,1.6,GL,{m:'glass',p:[18,18,10],r:[90,0,0]});K.tube([[27,9,10],[40,-4,10]],3.4,'#2B3540',{});
  },
  // Gráfica de pastel con una rebanada levantada
  'datos.b'(K){
    const g=K.group({r:[-30,0,0]});
    const sec=(a0,a1,r)=>{const o=[[0,0]];for(let i=0;i<=32;i++){const a=a0+(a1-a0)*i/32;o.push([Math.cos(a)*r,Math.sin(a)*r])}return o};
    K.shape(sec(Math.PI*0.5,Math.PI*1.6,36),null,12,BL,{bevel:1.4,parent:g});
    K.shape(sec(Math.PI*1.6,Math.PI*2.25,36),null,12,TE,{bevel:1.4,parent:g});
    const mid=Math.PI*0.25;K.shape(sec(0,Math.PI*0.5,36).map(p=>p),null,12,YE,{bevel:1.4,parent:g,p:[Math.cos(mid)*8,Math.sin(mid)*8,6]});
  },


  // Dado con puntos en las seis caras
  'actuaria.a'(K){
    K.box(56,56,56,WH,{rad:9});
    const pip=(n,c)=>{const P={1:[[0,0]],2:[[-1,-1],[1,1]],3:[[-1,-1],[0,0],[1,1]],4:[[-1,-1],[1,-1],[-1,1],[1,1]],5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],6:[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]]}[n];return P};
    const faces=[[5,[0,0,28.2],[90,0,0]],[2,[0,0,-28.2],[90,0,0]],[3,[28.2,0,0],[0,0,90]],[4,[-28.2,0,0],[0,0,90]],[1,[0,28.2,0],[0,0,0]],[6,[0,-28.2,0],[0,0,0]]];
    faces.forEach(([n,p,r])=>{const g=K.group({p,r});pip(n).forEach(([a,b])=>K.cyl(5,5,1,n==1||(n==5&&a==0)?RE:BK,{p:[a*14,0,b*14],parent:g}))});
  },
  // Cohete con ventanilla, aletas, franja y llama
  'aeroespacial.a'(K){
    K.lathe([[0.01,-26],[13,-26],[15,-10],[15,14],[12,28],[6,38],[0.01,42]],WH);
    K.lathe([[0.01,28],[12,28],[6,38],[0.01,42]].reverse().map(p=>p),RE,{s:[1.02,1,1.02]});
    K.tor(15.2,1.6,RE,{p:[0,0,0],r:[90,0,0]});
    K.cyl(6,6,4,ST,{m:'metal',p:[0,12,13.4],r:[90,0,0]});K.cyl(4.6,4.6,4.4,GL,{m:'glass',p:[0,12,13.6],r:[90,0,0]});
    for(let i=0;i<3;i++){const g=K.group({r:[0,i*120,0]});K.ext('M0 0 L14 14 L14 22 L0 16 Z',3,RE,{bevel:1,p:[13,-10,0],r:[180,0,0],parent:g})}
    K.cyl(9,12,8,GY,{m:'metal',p:[0,-30,0]});
    K.lathe([[0.01,-34],[9,-34],[7,-44],[0.01,-58]],OR);K.lathe([[0.01,-34],[5,-34],[4,-42],[0.01,-50]],YE,{s:[1.05,1.02,1.05]});
  },
  // Avión de pasajeros: fuselaje, alas, turbinas, cola y ventanillas
  'aeroespacial.b'(K){
    K.cap(8,70,WH,{r:[0,0,90]});
    K.box(10,1.6,74,'#E6ECEF',{p:[2,-2,0],r:[0,-20,0],rad:0.8,s:[1.6,1,1]});
    [-18,18].forEach(z=>K.cyl(3.6,3.6,12,GY,{m:'metal',p:[4,-6,z],r:[0,0,90]}));
    K.ext('M0 0 L12 -24 L20 -24 L16 0 Z',2,BL,{bevel:0.8,p:[-38,6,0]});
    K.box(6,1.2,28,'#E6ECEF',{p:[-38,4,0],r:[0,-20,0],rad:0.5});
    for(let i=0;i<9;i++)[8.1,-8.1].forEach(z=>K.cyl(1.2,1.2,0.6,'#2B4A6E',{p:[-22+i*6,2,z],r:[90,0,0]}));
    K.box(8,4,10,'#2B4A6E',{p:[39,2,0],rad:2});
  },
  // Hoja con nervaduras y gota de agua
  'ambiental.a'(K){
    const g=K.group({r:[0,0,-30]});
    K.ext('M0 -46 C26 -30 30 10 0 46 C-30 10 -26 -30 0 -46 Z',8,GR,{bevel:3,parent:g});
    K.tube([[0,-50,0],[0,40,0]],1.4,'#2F7F3E',{parent:g});
    [[-30,1],[-14,1],[2,1],[18,1],[-30,-1],[-14,-1],[2,-1],[18,-1]].forEach(([y,sd])=>[6.6,-6.6].forEach(z=>K.tube([[0,y,z],[sd*14,y+10,z]],0.7,'#2F7F3E',{parent:g,nocap:true})));
    K.lathe([[0.01,-10],[6,-6],[7,0],[4,6],[0.01,14]],BL,{m:'glass',p:[24,-26,10]});
  },
  // Aerogenerador: torre, góndola, rotor y tres aspas
  'ambiental.b'(K){
    K.cyl(2.4,4.6,80,WH,{p:[0,-10,0]});K.box(12,7,7,WH,{p:[0,32,-2],rad:2.4});K.sph(3.6,ST,{m:'metal',p:[0,32,3]});
    for(let i=0;i<3;i++){const g=K.group({p:[0,32,4],r:[0,0,i*120+10]});K.ext('M0 -2 C4 -10 4 -30 0 -40 C-2 -30 -3 -10 -2 -2 Z',1.8,WH,{bevel:0.6,parent:g})}
    K.cyl(16,16,3,GR,{p:[0,-51,0]});
  },
  // Pantalla de animación: tableta con pelota rebotando y lápiz
  'animacion.b'(K){
    K.box(76,54,6,'#2B3540',{rad:5});K.box(68,46,0.6,'#F3F6F8',{p:[0,0,3.2],rad:2});
    [[-20,-10,'#F4B4A8'],[-4,8,'#EE8F80'],[14,14,RE]].forEach(([x,y,c])=>K.sph(5,c,{p:[x,y,4],s:[1,1,0.4]}));
    K.tube([[-28,-16,3.4],[-14,10,3.4],[0,16,3.4],[14,14,3.4]],0.5,'#9AA3AC',{nocap:true});
    const p=K.group({p:[36,-28,6],r:[0,0,-40]});K.cyl(2,2,40,'#5B6670',{parent:p});K.cone(2,5,BK,{p:[0,-22,0],r:[180,0,0],parent:p});
    K.cyl(3,3,1,'#5B6670',{p:[-28,18,-3.4],r:[90,0,0]});K.cyl(6,6,0.8,'#3A4652',{p:[0,0,-3.2],r:[90,0,0]});
  },
  // Casa con plano: casa sobre un plano enrollado
  'arquitectura.b'(K){
    K.box(80,2,46,BL,{p:[0,-26,0],rad:0.8});K.cyl(5,5,46,'#5B9BD8',{p:[-40,-22,0],r:[90,0,0]});
    [[-16,10],[-4,16]].forEach(([z,w])=>K.box(w*2,0.4,1,'#EAF4FB',{p:[-6,-24.6,z],rad:0.2}));
    K.box(40,30,30,CR,{p:[6,-9,0],rad:1});
    const A=Math.atan2(20,24)*180/Math.PI,L=Math.hypot(24,20);
    K.box(L,2.4,36,RE,{p:[-6,15,0],r:[0,0,A],rad:0.8});K.box(L,2.4,36,RE,{p:[18,15,0],r:[0,0,-A],rad:0.8});
    [15.2,-15.2].forEach(z=>K.ext('M-20 0 L20 0 L0 -20 Z',0.6,CR,{bevel:0,p:[6,6,z]}));
    K.box(10,16,1,'#8A5A36',{p:[12,-16,15.4],rad:0.4});K.box(10,8,1,GL,{p:[-4,-6,15.4],rad:0.4});
    K.box(10,8,1,GL,{p:[14,-6,-15.4],rad:0.4});K.box(10,8,1,GL,{p:[-4,-6,-15.4],rad:0.4});
  },
  // Microscopio: base, brazo, platina, revólver, objetivos, ocular y perilla
  'biologia.a'(K){
    K.box(48,6,30,NA,{p:[0,-38,0],rad:2});
    K.tube([[14,-34,0],[18,-10,0],[14,14,0],[4,26,0]],5,NA,{});
    K.box(30,3,24,'#2B3540',{p:[-6,-10,0],rad:1});K.cyl(5,5,3,'#FFF1B0',{p:[-6,-20,0]});
    const t=K.group({p:[-4,18,0],r:[0,0,28]});K.cyl(5,5,34,WH,{parent:t,p:[0,8,0]});K.cyl(4,3,10,BK,{parent:t,p:[0,28,0]});K.cyl(6,6,4,ST,{m:'metal',parent:t,p:[0,-10,0]});
    [[-3,-14],[3,-14]].forEach(([x,y])=>K.cyl(1.8,1.4,8,ST,{m:'metal',p:[x-10,y+12,0]}));
    K.cyl(4,4,4,GY,{m:'metal',p:[18,-12,8],r:[90,0,0]});K.cyl(4,4,4,GY,{m:'metal',p:[18,-12,-8],r:[90,0,0]});
  },
  // Doble hélice de ADN con peldaños
  'biotec.a'(K){
    const A=[],B=[];for(let i=0;i<=40;i++){const t=i/40*Math.PI*3,y=-44+i*2.2;A.push([Math.cos(t)*16,y,Math.sin(t)*16]);B.push([-Math.cos(t)*16,y,-Math.sin(t)*16])}
    K.tube(A,3,BL,{});K.tube(B,3,RE,{});
    for(let i=2;i<40;i+=3)K.tube([A[i],B[i]],1.2,i%2?YE:GR,{nocap:true});
  },
  // Matraz con tierra y brote
  'biotec.b'(K){
    K.lathe([[0.01,-30],[28,-30],[30,-27],[10,14],[10,30],[12,32],[0.01,32]],'#DDF1FA',{m:'membrane'});
    K.cyl(23,27,9,'#8A5A36',{p:[0,-24.5,0]});
    K.tube([[0,-20,0],[0,-8,0],[2,0,0]],1.2,'#2F7F3E',{});
    K.ext('M0 0 C-6 -6 -14 -6 -18 0 C-14 4 -6 4 0 0 Z',1.4,GR,{bevel:0.6,p:[1,-4,0],r:[0,0,30]});K.ext('M0 0 C6 -6 14 -6 18 0 C14 4 6 4 0 0 Z',1.4,GR,{bevel:0.6,p:[2,0,0],r:[0,0,-30]});
    K.cyl(11,11,6,ST,{m:'metal',p:[0,35,0]});
  },
  // Escudo con candado
  'ciberseguridad.a'(K){
    K.ext('M0 -48 L36 -36 V-6 C36 22 20 38 0 48 C-20 38 -36 22 -36 -6 V-36 Z',14,BL,{bevel:3});
    [9.6,-9.6].forEach(z=>{K.box(26,22,5,GO,{m:'gold',p:[0,-6,z],rad:3});K.tube([[-8,4,z],[-8,12,z],[0,18,z],[8,12,z],[8,4,z]],2.2,ST,{m:'metal'});K.cyl(2.6,2.6,1,'#7A5A1A',{p:[0,-4,z+Math.sign(z)*2.6],r:[90,0,0]})});
  },
  // Claqueta con brazo de rayas y bisagra
  'cine.a'(K){
    K.box(70,48,6,'#2B3540',{p:[0,-10,0],rad:2});
    [[18,'#FFFFFF'],[6,'#FFFFFF'],[-6,'#FFFFFF']].forEach(([y,c])=>{});
    [3.2,-3.2].forEach(z=>{[-4,-14].forEach(y=>K.box(60,1.6,0.6,WH,{p:[0,y,z],rad:0.4}))});
    const arm=K.group({p:[-35,18,0],r:[0,0,14]});K.box(70,10,6,'#2B3540',{p:[35,0,0],rad:1.5,parent:arm});
    for(let i=0;i<5;i++)K.box(6,10.4,6.4,WH,{p:[8+i*14,0,0],r:[0,0,-30],rad:0.4,parent:arm});
    const b=K.group({p:[0,10,0]});for(let i=0;i<5;i++)K.box(6,8.4,6.4,WH,{p:[-27+i*14,4,0],r:[0,0,30],rad:0.4,parent:b});K.box(70,8,6,'#2B3540',{p:[0,4,0],rad:1.5,parent:b});
    K.cyl(3,3,7,ST,{m:'metal',p:[-35,18,0],r:[90,0,0]});
  },
  // Cámara de cine con dos rollos, cuerpo y lente
  'cine.b'(K){
    K.box(54,32,22,'#4A5560',{p:[-6,-10,0],rad:4});
    [[-20,22],[10,20]].forEach(([x,r])=>{K.cyl(r/1.4,r/1.4,8,BK,{p:[x,18,0],r:[90,0,0]});for(let i=0;i<5;i++)[4.2,-4.2].forEach(z=>K.box(1.4,r*1.2,0.6,'#5B6670',{p:[x,18,z],r:[0,0,i*36],rad:0.3}));K.cyl(2.4,2.4,9,ST,{m:'metal',p:[x,18,0],r:[90,0,0]})});
    K.cyl(8,12,16,BK,{p:[28,-10,0],r:[0,0,90]});K.cyl(9,9,1,'#7FC8F0',{m:'glass',p:[36.6,-10,0],r:[0,0,90]});
    K.box(10,6,1,RE,{p:[-18,-4,11.3],rad:1});K.box(24,8,16,BK,{p:[-6,-30,0],rad:2});
  },

  // Huella de perro con cruz veterinaria, almohadillas abombadas
  'veterinaria.a'(K){
    const B='#6B3F2A';
    K.sph(22,B,{p:[0,-12,0],s:[1.1,0.85,0.45]});
    [[-28,10,-25],[-11,26,-8],[11,26,8],[28,10,25]].forEach(([x,y,a])=>K.sph(9,B,{p:[x,y,0],s:[0.85,1.15,0.5],r:[0,0,a]}));
    [9.6,-9.6].forEach(z=>{K.box(16,5,2,WH,{p:[0,-12,z],rad:1});K.box(5,16,2,WH,{p:[0,-12,z],rad:1})});
  },
  // Cabeza de perro: hocico, nariz, ojos, orejas caídas
  'o_perro.a'(K){
    const C='#D9A06A';
    K.sph(26,C,{s:[1,1,0.9]});
    K.sph(14,'#F2D6B3',{p:[0,-10,16],s:[1,0.8,0.9]});
    K.sph(5,'#2B2B2B',{p:[0,-4,28],s:[1.2,0.9,0.9]});
    [-1,1].forEach(sd=>{K.sph(4,'#2B2B2B',{p:[sd*10,8,22]});K.sph(1.2,WH,{p:[sd*10-1,9.6,25.6]});
      K.sph(11,'#8A5A36',{p:[sd*25,-4,0],s:[0.55,1.3,0.9],r:[0,0,sd*15]})});
    K.tube([[-5,-16,26],[0,-19,27],[5,-16,26]],0.9,'#2B2B2B',{});
  },
  // Cabeza de gato: orejas con interior rosa, ojos, nariz, bigotes
  'o_gato.a'(K){
    const C='#B4BDC6';
    K.sph(28,C,{s:[1.05,0.95,0.85]});
    [-1,1].forEach(sd=>{const e=K.group({p:[sd*16,24,0],r:[0,0,-sd*20]});K.cone(10,20,C,{parent:e,seg:4,r:[0,45,0]});K.cone(6,12,PK,{parent:e,p:[0,-2,4],seg:4,r:[0,45,0]});
      K.sph(5,'#9BD58A',{p:[sd*10,4,21],s:[0.9,1.2,0.5]});K.sph(2,BK,{p:[sd*10,4,23.4],s:[0.5,1.4,0.5]});
      [-3,3].forEach(dy=>K.tube([[sd*12,-8+dy*0.3,20],[sd*38,-6+dy,16]],0.4,'#5B6670',{nocap:true}))});
    K.cone(3,3,PK,{p:[0,-5,24],r:[180,0,0]});
  },
  // Collar rojo con hebilla y placa dorada
  'o_collar.a'(K){
    K.tor(28,4.5,RE,{s:[1,1,0.7]});
    for(let i=0;i<10;i++){const a=Math.PI*0.65+i*0.17;K.cyl(1,1,2,'#B23A2E',{p:[Math.cos(a)*28,Math.sin(a)*28,3.4],r:[90,0,0]})}
    K.box(12,12,10,ST,{m:'metal',p:[0,28,0],rad:2});K.box(6,8,11,'#5B6670',{p:[0,28,0],rad:1});
    K.tor(3.4,1.1,GO,{m:'gold',p:[0,-33,0]});
    K.cyl(11,11,2.6,GO,{m:'gold',p:[0,-46,0],r:[90,0,0]});
    [1.6,-1.6].forEach(z=>K.ext('M0 -6 L1.8 -2 L6 -1.8 L2.8 1 L3.8 5.4 L0 3 L-3.8 5.4 L-2.8 1 L-6 -1.8 L-1.8 -2 Z',0.8,'#B8861C',{m:'gold',bevel:0.4,p:[0,-46,z]}));
  },

  // Plato de acero para mascota con croquetas
  'o_platom.a'(K){
    K.lathe([[0.01,-12],[38,-12],[40,-10],[30,10],[28,11],[24,4],[0.01,4]],ST,{m:'metal'});
    for(let i=0;i<22;i++){const a=i*2.4,r=4+i*0.95;K.sph(3.4,i%3?'#8A5A36':'#6E4426',{p:[Math.cos(a)*r,5+Math.sin(i)*1.4,Math.sin(a)*r],s:[1,0.7,1]})}
  },
  // Monitor de signos vitales con onda, base y perillas
  'biomedica.b'(K){
    K.box(76,52,22,'#5B6670',{p:[0,8,0],rad:5});K.box(58,38,1,'#13283B',{p:[-6,10,11.2],rad:2});
    K.tube([[-32,8,12],[-20,8,12],[-16,18,12],[-11,-4,12],[-7,12,12],[-4,8,12],[18,8,12]],1,'#5BE07A',{tension:0});
    [16,4,-8].forEach(y=>K.cyl(3,3,3,'#3A4048',{p:[30,y,11],r:[90,0,0]}));
    K.box(30,6,26,GY,{p:[0,-21,0],rad:2});K.box(60,4,1,'#3A4048',{p:[0,28,-11.4],rad:1});
    for(let i=0;i<5;i++)K.box(40,2,1,'#3A4048',{p:[0,18-i*6,-11.3],rad:0.6});K.box(18,8,3,'#4A5560',{p:[0,-6,-12],rad:2});
  },
  // Marcapasos con su cable
  'o_marcapasos.a'(K){
    K.cyl(24,24,9,ST,{m:'metal',r:[90,0,0],s:[1,1.1,1]});
    K.box(22,12,10,'#E9E3D6',{p:[0,30,0],rad:3});
    [5.2,-5.2].forEach(z=>K.tube([[-10,0,z],[-4,0,z],[-1,7,z],[3,-8,z],[6,0,z],[12,0,z]],0.8,'#3E9E78',{tension:0}));
    K.tube([[6,36,0],[14,46,0],[30,44,4],[38,26,6],[40,4,4]],1.6,BK,{});
  },
  // Silla de ruedas
  'o_silla.a'(K){
    [-1,1].forEach(sd=>{const z=sd*14;K.tor(24,1.6,BK,{p:[-4,-6,z]});K.tor(20,0.8,ST,{m:'metal',p:[-4,-6,z+sd*2]});
      for(let i=0;i<8;i++){const a=i/8*Math.PI*2;K.tube([[-4,-6,z],[-4+Math.cos(a)*23,-6+Math.sin(a)*23,z]],0.4,GY,{m:'metal',nocap:true})}
      K.cyl(4,4,3,BK,{p:[24,-26,z*0.9],r:[90,0,0]});K.tube([[18,0,z*0.9],[24,-22,z*0.9]],1.2,ST,{m:'metal'});
      K.tube([[-14,36,z],[-12,6,z],[18,0,z]],1.3,ST,{m:'metal',tension:0.1});K.tube([[-14,36,z],[-22,38,z]],1.6,BK,{})});
    K.box(30,4,28,BL,{p:[2,4,0],rad:2});K.box(4,26,28,BL,{p:[-13,20,0],r:[0,0,-6],rad:2});
  },
  // Grupo de tres personas
  'sociologia.a'(K){
    [[0,6,6,BL,1],[-24,0,-6,OR,0.85],[24,0,-6,GR,0.85]].forEach(([x,y,z,c,k])=>{K.sph(11*k,c,{p:[x,y+24*k,z]});K.cap(15*k,10*k,c,{p:[x,y-6*k,z],s:[1,1,0.7]})});
  },
  // Dos burbujas de diálogo con líneas de texto
  'sociologia.b'(K){
    K.ext('M-34 -36 H10 C16 -36 18 -32 18 -26 V-6 C18 0 16 4 10 4 H-16 L-26 14 V4 H-34 C-40 4 -42 0 -42 -6 V-26 C-42 -32 -40 -36 -34 -36 Z',10,BL,{bevel:2,p:[0,0,-6]});
    K.ext('M-6 -2 H34 C40 -2 42 2 42 8 V28 C42 34 40 38 34 38 H28 V48 L18 38 H-6 C-12 38 -14 34 -14 28 V8 C-14 2 -12 -2 -6 -2 Z',10,OR,{bevel:2,p:[2,0,8]});
    [[-30,24,22],[-30,18,14]].forEach(([x,y,w])=>K.box(w,2.4,1,WH,{p:[x+w/2,y,1.4],rad:1}));
    [[-6,-12,30],[-6,-20,20]].forEach(([x,y,w])=>K.box(w,2.4,1,WH,{p:[x+w/2,y,15.6],rad:1}));
    [[-30,24,22],[-30,18,14]].forEach(([x,y,w])=>K.box(w,2.4,1,WH,{p:[x+w/2,y,-13.6],rad:1}));
    [[-6,-12,30],[-6,-20,20]].forEach(([x,y,w])=>K.box(w,2.4,1,WH,{p:[x+w/2,y,0.2],rad:1}));
  },
  // Destellos de IA
  'o_chispa.a'(K){
    const st='M0 -40 C3 -10 10 -3 40 0 C10 3 3 10 0 40 C-3 10 -10 3 -40 0 C-10 -3 -3 -10 0 -40 Z';
    K.ext(st,10,PU,{bevel:3});
    const a=K.group({p:[32,30,0],s:[0.38,0.38,0.6]});K.ext(st,10,'#B78BE0',{bevel:3,parent:a});
    const b=K.group({p:[30,-32,0],s:[0.25,0.25,0.5]});K.ext(st,10,'#B78BE0',{bevel:3,parent:b});
  },
  // Robot: cabeza con visor, ojos, antena, orejas y rejilla
  'ia.a'(K){
    K.box(64,52,46,ST,{m:'metal',rad:12});K.box(50,24,4,'#2B3540',{p:[0,4,22],rad:8});
    [-12,12].forEach(x=>{K.sph(6,'#5BD3F5',{p:[x,4,24],s:[1,1,0.5]})});
    for(let i=0;i<5;i++)K.box(2,8,2,'#3A4048',{p:[-10+i*5,-16,23],rad:0.6});
    K.cyl(1.6,1.6,14,GY,{m:'metal',p:[0,32,0]});K.sph(5,RE,{p:[0,41,0]});
    [-1,1].forEach(sd=>K.cyl(8,8,8,GY,{m:'metal',p:[sd*35,0,0],r:[0,0,90]}));
    K.box(30,24,2,'#8994A0',{p:[0,2,-23.4],rad:3});for(let i=0;i<4;i++)K.box(22,1.6,1,'#5B6670',{p:[0,10-i*5,-24.6],rad:0.5});[-10,10].forEach(x=>K.cyl(1.6,1.6,1,'#5B6670',{p:[x,-14,-23.6],r:[90,0,0]}));
  },
  // Chip con patas en los cuatro lados
  'electronica.a'(K){
    K=Object.assign({},K);const G=K.group({r:[55,0,0]});const o=K;['box','cyl'].forEach(f=>{const fn=o[f];K[f]=(...a)=>{const op=a[a.length-1];op.parent=op.parent||G;return fn(...a)}});
    K.box(54,10,54,'#2B3540',{rad:3});K.cyl(3,3,1,'#5B6670',{p:[-18,5.2,-18]});
    for(let i=0;i<5;i++){const t=-18+i*9;[[t,0,31,0],[t,0,-31,0],[31,0,t,90],[-31,0,t,90]].forEach(([x,y,z,r])=>{K.box(4,2,10,'#C9D0D6',{m:'metal',p:[x,-1,z],r:[0,r,0],rad:0.5});K.box(4,6,2,'#C9D0D6',{m:'metal',p:[x+(r?Math.sign(x)*4:0),-4,z+(r?0:Math.sign(z)*4)],r:[0,r,0],rad:0.5})})}
  },
  // Placa de circuito con chip, componentes y pistas
  'electronica.b'(K){
    K=Object.assign({},K);const G=K.group({r:[55,0,0]});const o=K;['box','cyl'].forEach(f=>{const fn=o[f];K[f]=(...a)=>{const op=a[a.length-1];op.parent=op.parent||G;return fn(...a)}});
    K.box(80,4,62,'#2F8F4E',{rad:2});
    [[-20,-14,24,0],[-8,10,0,20],[10,-20,30,0],[30,-4,0,18]].forEach(([x,z,w,d])=>K.box(w||1.6,0.5,d||1.6,'#E3B54A',{m:'gold',p:[x,2.2,z],rad:0.2}));
    K.box(18,4,18,'#2B3540',{p:[0,4,0],rad:1});
    K.cyl(4,4,10,'#3A82C4',{p:[24,7,16]});K.cyl(3,3,8,'#1F1F1F',{p:[-26,6,16]});
    K.box(10,3,4,'#D9B48A',{p:[-22,3.6,-18],rad:1.4});
    [[-36,-27],[36,-27],[-36,27],[36,27]].forEach(([x,z])=>K.cyl(2.4,2.4,4.4,'#1F5E36',{p:[x,0,z]}));
    for(let i=0;i<24;i++)K.cyl(1.2,1.2,0.8,'#C9D0D6',{m:'metal',p:[-30+(i%8)*8.5,-2.4,-20+Math.floor(i/8)*20]});
  },
  // Rayo
  'electrica.a'(K){
    K.ext('M8 -46 L-24 6 L-2 6 L-12 46 L24 -8 L2 -8 L14 -46 Z',14,YE,{bevel:3});
  },
  // Clavija con patas, cuerpo estriado y cable
  'electrica.b'(K){
    K.box(40,34,24,WH,{rad:8});
    [-9,9].forEach(x=>{K.box(5,24,2,ST,{m:'metal',p:[x,28,0],rad:0.6});K.cyl(1.4,1.4,2.4,'#5B6670',{p:[x,32,0],r:[90,0,0]})});
    for(let i=0;i<4;i++)K.box(40.6,1,24.6,'#D9DCD6',{p:[0,-4-i*3.6,0],rad:0.5});
    K.cyl(7,5,10,'#2B3540',{p:[0,-22,0]});K.tube([[0,-26,0],[0,-36,0],[10,-44,6],[24,-42,10]],3,'#2B3540',{});
  },
  // Átomo: núcleo y tres órbitas con electrones
  'fisica.a'(K){
    K.sph(9,RE);
    [0,60,120].forEach((a,i)=>{const g=K.group({r:[0,0,a]});K.tor(36,1.6,BL,{parent:g,r:[90,0,0],s:[1,0.4,1]});
      const e=new THREE.Vector3(36,0,0);K.sph(3.6,'#5BD3F5',{p:[36*Math.cos(i),0,14*Math.sin(i)],parent:g})});
  },
  // Imán de herradura con polos plateados y chispas
  'fisica.b'(K){
    K.tor(22,8,RE,{arc:180,r:[0,0,180],p:[0,0,0]});
    [-22,22].forEach(x=>{K.cyl(8,8,20,RE,{p:[x,10,0]});K.cyl(8.1,8.1,12,ST,{m:'metal',p:[x,26,0]})});
  },

  // Silbato metálico con cámara, boquilla, ranura, argolla y cordón
  'educfisica.a'(K){
    K.cyl(16,16,16,ST,{m:'metal',r:[90,0,0]});K.box(36,13,16,ST,{m:'metal',p:[20,9,0],rad:3});
    K.box(8,2,10,'#3A4048',{p:[8,15.8,0],rad:0.6});
    K.tor(5,1.2,ST,{m:'metal',p:[-17,10,0],r:[90,0,0]});
    K.tube([[-20,6,0],[-30,-10,4],[-28,-30,2],[-18,-40,0]],1.4,RE,{});
  },
  // Balón de futbol: pentágonos negros repartidos en toda la esfera
  'educfisica.b'(K){
    K.sph(34,WH);
    const phi=(1+Math.sqrt(5))/2;const V=[[0,1,phi],[0,-1,phi],[0,1,-phi],[0,-1,-phi],[1,phi,0],[-1,phi,0],[1,-phi,0],[-1,-phi,0],[phi,0,1],[-phi,0,1],[phi,0,-1],[-phi,0,-1]];
    V.forEach(v=>{const n=new THREE.Vector3(...v).normalize();const m=K.cyl(10,10,2,'#2B3540',{seg:5,p:[n.x*33.4,n.y*33.4,n.z*33.4]});m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),n)});
  },
  // Cronómetro con corona, botón, carátula, manecillas y escala
  'o_cronometro.a'(K){
    K.cyl(32,32,12,'#5B6670',{m:'metal',r:[90,0,0],seg:64});K.cyl(27,27,12.6,WH,{r:[90,0,0],seg:64});
    K.cyl(5,5,8,ST,{m:'metal',p:[0,36,0]});K.cyl(7,7,4,'#3A4048',{p:[0,42,0]});
    K.cyl(3,3,7,ST,{m:'metal',p:[22,26,0],r:[0,0,-40]});
    [6.5,-6.5].forEach(z=>{for(let i=0;i<12;i++){const a=i/12*Math.PI*2;K.box(i%3?1:1.6,i%3?3:5,0.6,'#3A4048',{p:[Math.sin(a)*23,Math.cos(a)*23,z],r:[0,0,-a*180/Math.PI],rad:0.2})}
      K.box(2,18,0.8,'#2B3540',{p:[0,8,z*1.05],rad:0.5});K.box(2,13,0.8,'#2B3540',{p:[5,-3,z*1.05],r:[0,0,-50],rad:0.5});K.sph(2.4,RE,{p:[0,0,z]})});
  },
  // Trofeo: copa dorada con asas, estrella, pedestal y base con placa
  'o_trofeo.a'(K){
    K.lathe([[0.01,-2],[6,-2],[16,6],[22,20],[24,34],[22,34],[20,22],[14,10],[0.01,4]],GO,{m:'gold'});
    [-1,1].forEach(sd=>K.tor(9,2.2,GO,{m:'gold',p:[sd*24,22,0],arc:200,r:[0,0,sd<0?80:-100]}));
    K.cyl(3,5,14,GO,{m:'gold',p:[0,-9,0]});K.cyl(10,12,4,GO,{m:'gold',p:[0,-18,0]});
    K.box(34,14,24,'#6B4A2A',{m:'wood',p:[0,-27,0],rad:2});K.box(20,6,1,'#F3CB5E',{m:'gold',p:[0,-27,12.4],rad:0.6});
    K.ext('M0 -9 L2.6 -3 L9 -2.8 L4 1.4 L5.6 8 L0 4.4 L-5.6 8 L-4 1.4 L-9 -2.8 L-2.6 -3 Z',2,'#FFF1B0',{m:'gold',bevel:0.6,p:[0,22,23.2]});
    K.box(20,6,1,'#F3CB5E',{m:'gold',p:[0,-27,-12.4],rad:0.6});K.ext('M0 -9 L2.6 -3 L9 -2.8 L4 1.4 L5.6 8 L0 4.4 L-5.6 8 L-4 1.4 L-9 -2.8 L-2.6 -3 Z',2,'#FFF1B0',{m:'gold',bevel:0.6,p:[0,22,-23.2]});
  },
  // Tenis: suela, cuerpo, puntera, lengüeta, agujetas y franja
  'o_tenis.a'(K){
    const F=K.group({r:[180,0,0]});
    K.ext('M-38 -10 L-38 12 C-38 22 -30 24 -24 22 L-14 18 C-8 26 4 26 10 18 L30 6 C38 2 42 -4 42 -10 Z',22,WH,{bevel:4,parent:F});
    K.ext('M-41 -9 H44 C47 -9 47 -17 43 -17 H-39 C-43 -17 -43 -9 -41 -9 Z',28,'#F2EEE6',{bevel:1.5,parent:F});
    K.ext('M-40 -15 H44 C46 -15 46 -20 42 -20 H-38 C-42 -20 -42 -15 -40 -15 Z',28.4,'#E2683E',{bevel:1,parent:F});
    K.sph(9,'#3A4048',{p:[-28,27.6,0],s:[1.1,0.3,1]});
    K.box(12,10,12,BL,{p:[-17,29,0],r:[0,0,-30],rad:4});
    [[-8,28.5],[-2,29.5],[4,28.5],[10,24],[16,20.5]].forEach(([x,y])=>K.tube([[x,y-3,-12],[x,y+0.4,0],[x,y-3,12]],0.9,'#3A4048',{}));
    [14.6,-14.6].forEach(z=>{K.tube([[-30,-4,z],[-4,6,z],[24,0,z]],1.6,BL,{});K.box(8,8,1,'#D5DCE2',{p:[-34,2,z],rad:1})});
  },

  // Cono de entrenamiento con franjas y base cuadrada
  'o_cono.a'(K){
    K.box(56,4,56,OR,{p:[0,-30,0],rad:2});
    K.cyl(4,20,56,OR,{p:[0,0,0]});
    [[-6,15.6,10.6],[10,10.4,5.6]].forEach(([y,rb,rt])=>K.cyl(rt+0.3,rb+0.3,8,WH,{p:[0,y,0],open:true}));
  },
  // Receta médica: hoja con encabezado, Rx y líneas en ambas caras
  'o_receta.a'(K){
    K.box(60,78,3,WH,{rad:1.2});K.box(60,16,3.4,BL,{p:[0,31,0],rad:1.2});
    [1.9,-1.9].forEach(z=>{const g=K.group({p:[0,0,z],r:[0,z<0?180:0,0]});
      K.box(10,3,0.6,WH,{p:[22,31,0.2],rad:0.4,parent:g});K.box(3,10,0.6,WH,{p:[22,31,0.2],rad:0.4,parent:g});
      K.tube([[-16,-4,0],[-16,16,0],[-6,16,0],[-4,11,0],[-6,6,0],[-16,6,0]],1.4,NA,{tension:0.3,parent:g});K.tube([[-9,6,0],[2,-6,0]],1.4,NA,{parent:g});K.tube([[-4,4,0],[6,10,0]],1.4,NA,{parent:g});
      [-16,-22,-28].forEach((y,i)=>K.box(i==2?26:40,1.2,0.5,'#9AA3AC',{p:[i==2?-7:0,y,0],rad:0.3,parent:g}))});
  },
  // Bata médica con mangas, solapas, botones, bolsillos y pluma
  'o_bata.a'(K){
    K.box(50,70,16,WH,{p:[0,-6,0],rad:6});
    [-1,1].forEach(sd=>{K.cyl(7,8,54,WH,{p:[sd*30,-4,0],r:[0,0,sd*12]});
      K.box(14,24,2,'#E6ECEF',{p:[sd*8,20,8.6],r:[0,0,sd*-20],rad:1});K.box(14,10,1.4,'#E1E6EA',{p:[sd*14,-26,8.4],rad:1})});
    K.box(14,8,8,WH,{p:[0,30,-2],rad:3});
    [16,2,-12].forEach(y=>K.sph(1.6,'#9AA3AC',{p:[4,y,8.6]}));
    K.box(10,8,1.4,'#E1E6EA',{p:[14,10,8.4],rad:1});K.cyl(1,1,12,BL,{p:[12,14,9.4]});
    K.box(2,50,1,'#E1E6EA',{p:[0,-14,-8.6],rad:0.5});K.box(30,5,2,'#E6ECEF',{p:[0,-14,-8.8],rad:1.6});[-12,12].forEach(x=>K.sph(1.4,'#9AA3AC',{p:[x,-14,-10]}));K.box(16,6,2,'#E6ECEF',{p:[0,30,-6],rad:2});
  },
  // Plato con comida, tenedor y cuchillo
  'nutricion.b'(K){
    const g=K.group({r:[60,0,0]});
    K.lathe([[0.01,0],[22,0],[30,3],[34,5],[33,6],[24,3.4],[0.01,2.6]],WH,{parent:g});
    K.sph(7,GR,{p:[-8,6,-4],s:[1,0.7,1],parent:g});K.sph(6,RE,{p:[8,5,4],s:[1,0.7,1],parent:g});K.sph(5,YE,{p:[4,5,-10],s:[1,0.6,1],parent:g});
    K.box(3,2,40,ST,{m:'metal',p:[-44,2,6],parent:g,rad:0.8});for(let i=0;i<4;i++)K.box(0.9,1.6,12,ST,{m:'metal',p:[-45.4+i*1,2,-20],parent:g,rad:0.3});
    K.box(3,2,34,ST,{m:'metal',p:[44,2,10],parent:g,rad:0.8});K.box(6,1.4,22,ST,{m:'metal',p:[45,2,-16],parent:g,rad:0.6});
    K.tor(16,1.2,'#E6E1D6',{p:[0,-0.6,0],r:[90,0,0],parent:g});
  },
  // Cinta métrica: caja con cinta saliendo, freno y gancho
  'o_cinta.a'(K){
    K.box(44,44,18,'#2B3540',{rad:8});K.cyl(17,17,19,YE,{r:[90,0,0]});K.cyl(6,6,20,ST,{m:'metal',r:[90,0,0]});
    K.box(10,6,8,RE,{p:[-8,23,0],rad:2});
    K.box(40,1.2,12,'#F2C230',{p:[38,-20,0],rad:0.3});
    for(let i=0;i<10;i++)K.box(0.6,0.4,i%2?3:6,'#3A3026',{p:[22+i*4,-19.2,-3+(i%2?1.5:0)]});
    K.box(2,8,12,ST,{m:'metal',p:[58,-17,0],rad:0.6});
  },
  // Zanahoria con hojas
  'o_zanahoria.a'(K){
    const g=K.group({r:[0,0,-30]});
    K.lathe([[0.01,-40],[3,-34],[8,-10],[11,10],[10,18],[0.01,20]],OR,{parent:g});
    for(let i=0;i<6;i++)K.tor(9-i*1.2,0.4,'#C9661E',{p:[0,6-i*7,0],r:[90,0,i*13],arc:90,parent:g});
    [[-20,0],[0,0],[20,0],[-10,90],[10,90]].forEach(([a,b])=>{const q=K.group({p:[0,20,0],r:[a,b,0],parent:g});K.cap(2.6,18,GR,{p:[0,12,0],parent:q})});
  },
  // Pieza de rompecabezas con pestañas y hendiduras
  'o_rompecabezas.a'(K){
    const o=[];const sq=(x0,y0,x1,y1)=>{};
    const pts=[[-24,-24]];
    const tab=(ax,ay,bx,by,out)=>{const mx=(ax+bx)/2,my=(ay+by)/2,dx=(bx-ax)/48,dy=(by-ay)/48,nx=-dy*out,ny=dx*out;const res=[[mx-dx*7,my-dy*7]];for(let i=0;i<=16;i++){const a=Math.PI*1.25-i/16*Math.PI*1.5;res.push([mx+Math.cos(a)*8*dx*(-1)+nx*(14+Math.sin(a)*8)*0+(-dy*out)*0,0])}return res};
    const shp='M-24 -24 H-8 C-8 -32 8 -32 8 -24 H24 V-8 C32 -8 32 8 24 8 V24 H8 C8 16 -8 16 -8 24 H-24 V8 C-16 8 -16 -8 -24 -8 Z';
    K.ext(shp,12,PU,{bevel:2.4});
    [[-12,10,'#B78BE0',9],[10,-8,'#6E4592',7],[8,12,'#C9A6EA',5]].forEach(([x,y,c,r])=>K.cyl(r,r,1,c,{p:[x,y,8.6],r:[90,0,0]}));
    K.ext(shp,1,'#D9C6A8',{bevel:0,p:[0,0,-8.4]});for(let i=0;i<5;i++)K.box(40,0.8,0.6,'#C2AE8C',{p:[0,-16+i*8,-9.2],rad:0.2});
  },
  // Libreta de espiral con hojas y pluma
  'o_libreta.a'(K){
    K.box(54,70,8,'#F2C94C',{rad:2});K.box(48,64,1,WH,{p:[3,0,4.4],rad:1});
    for(let i=0;i<5;i++)K.box(36,1,0.5,'#9AA3AC',{p:[5,18-i*9,5],rad:0.3});
    for(let i=0;i<8;i++)K.tor(3.4,0.7,ST,{m:'metal',p:[-27,30-i*8.6,0],r:[0,90,0]});
    const p=K.group({p:[24,-4,9],r:[0,0,-25]});K.cyl(2.4,2.4,50,BL,{parent:p});K.cone(2.4,6,'#F2D3A0',{p:[0,-28,0],r:[180,0,0],parent:p});K.box(1.2,14,2,ST,{m:'metal',p:[2.6,16,0],parent:p});
    K.box(30,10,0.8,WH,{p:[0,14,-4.4],rad:1.4});K.box(22,1.4,1,'#9AA3AC',{p:[0,14,-4.8],rad:0.4});K.box(44,4,0.8,'#E0B23A',{p:[0,-26,-4.4],rad:1});
  },
  // Nube de pensamiento hecha de esferas con burbujas
  'o_pensamiento.a'(K){
    [[0,14,0,18],[-20,6,0,14],[20,6,0,14],[-10,-4,4,13],[10,-4,4,13],[-30,-4,0,10],[30,-4,0,10],[0,0,6,14]].forEach(([x,y,z,r])=>K.sph(r,WH,{p:[x,y,z],s:[1,1,0.8]}));
    K.sph(5,WH,{p:[-26,-24,4]});K.sph(3,WH,{p:[-34,-32,4]});
  },
  // Foco: bulbo de vidrio con filamento, rosca y contacto
  'o_foco.a'(K){
    K.lathe([[0.01,-6],[10,-6],[12,2],[22,16],[26,30],[24,42],[16,50],[0.01,53]],'#FFF3B8',{m:'glass'});
    K.tube([[-4,-4,0],[-4,12,0],[-6,20,0]],0.6,'#8994A0',{});K.tube([[4,-4,0],[4,12,0],[6,20,0]],0.6,'#8994A0',{});
    K.tube([[-6,20,0],[-3,24,0],[0,20,0],[3,24,0],[6,20,0]],0.7,'#F2A21E',{});
    K.cyl(11,10,14,ST,{m:'metal',p:[0,-13,0]});for(let i=0;i<4;i++)K.tor(11,1,'#8994A0',{m:'metal',p:[0,-8-i*3.4,0],r:[90,0,0]});
    K.cyl(7,4,5,'#3A4048',{p:[0,-23,0]});
  },

  // Cofia de enfermera con cruz roja al frente
  'enfermeria.a'(K){
    K.lathe([[0.01,0],[31,0],[30,4],[24,16],[14,24],[0.01,26]],WH,{s:[1,1,0.8]});
    K.box(66,6,30,WH,{p:[0,0,2],rad:3});
    [1,-1].forEach(sd=>{const c=K.group({p:[0,10,sd*22.4],r:[sd*-22,sd<0?180:0,0]});K.box(12,3.6,1.2,RE,{rad:0.6,parent:c});K.box(3.6,12,1.2,RE,{rad:0.6,parent:c})});
  },
  // Bolsa de suero colgando con puerto, cámara de goteo y tubo
  'o_suero.a'(K){
    K.box(44,54,10,'#EEF6FA',{m:'glass',p:[0,8,0],rad:5});
    K.box(40,30,7,'#F2D36B',{p:[0,-2,0],rad:3.4});
    K.box(26,10,1,WH,{p:[0,24,5.4],rad:1});K.box(18,1.2,1.2,'#7FA8D6',{p:[0,25,6],rad:0.4});
    K.tor(4,1.2,'#C9D3DA',{p:[0,39,0]});
    for(let i=0;i<4;i++)K.box(5,0.7,0.6,'#C9A23A',{p:[-16,-10+i*6,5.3],rad:0.2});
    K.cyl(3,3,6,'#E6ECEF',{p:[0,-22,0]});K.cyl(4.2,4.2,12,'#EEF6FA',{m:'glass',p:[0,-31,0]});K.cyl(1,1,16,'#C9D3DA',{p:[0,-44,0]});
    K.box(26,10,1,WH,{p:[0,24,-5.4],rad:1});K.box(18,1.2,1.2,'#7FA8D6',{p:[0,25,-6],rad:0.4});for(let i=0;i<4;i++)K.box(5,0.7,0.6,'#C9A23A',{p:[16,-10+i*6,-5.3],rad:0.2});
  },
  // Curita con almohadilla y orificios, en relieve
  'o_curita.a'(K){
    const g=K.group({r:[0,0,-35]});
    K.box(84,24,3,'#E8B98C',{rad:1.4,parent:g});
    [-36,36].forEach(x=>K.cyl(12,12,3,'#E8B98C',{p:[x*0.9,0,0],r:[90,0,0],parent:g}));
    K.box(30,20,3.6,'#F6E2CC',{rad:1.2,parent:g});
    for(const x of [-28,-20,20,28])for(const y of [-5,5])[1.6,-1.6].forEach(z=>K.cyl(0.9,0.9,0.4,'#B8875C',{p:[x,y,z],r:[90,0,0],parent:g}));
  },
  // Cubrebocas con pliegues y ligas
  'o_cubrebocas.a'(K){
    const g=K.group({});
    for(let i=0;i<3;i++)K.box(60,11,4,'#CFE8F7',{p:[0,10-i*10,-i*0.6],rad:2,parent:g});
    K.box(60,34,1.2,'#BFE0F5',{p:[0,0,-2.6],rad:0.6,parent:g});
    K.box(14,1.2,2,'#9AC4E0',{p:[0,16,2],rad:0.5,parent:g});
    [-1,1].forEach(sd=>K.tube([[sd*30,12,-1],[sd*44,10,-8],[sd*44,-10,-8],[sd*30,-12,-1]],1,'#E6EEF4',{parent:g,nocap:true}));
    for(let i=0;i<3;i++)K.box(58,1,1,'#A9CFE8',{p:[0,14-i*10,-3.6],rad:0.4});
  },
  // Sillón dental reclinado con lámpara
  'o_sillon.a'(K){
    K.cyl(16,18,3,ST,{m:'metal',p:[0,-34,0]});K.cyl(5,5,22,ST,{m:'metal',p:[0,-22,0]});
    K.box(36,6,22,TE,{p:[4,-8,0],rad:3});
    K.box(30,6,22,TE,{p:[-22,6,0],r:[0,0,-40],rad:3});
    K.box(26,6,18,TE,{p:[30,-14,0],r:[0,0,22],rad:3});
    K.box(14,6,16,'#2B8A82',{p:[-34,20,0],r:[0,0,-55],rad:3});
    [[-11],[11]].forEach(([z])=>K.box(20,3,4,'#2B8A82',{p:[4,0,z],rad:1.4}));
    K.tube([[-30,-34,-14],[-30,30,-14],[-20,40,-10],[-6,38,-4]],1.6,GY,{m:'metal'});
    K.cyl(7,5,5,ST,{m:'metal',p:[-4,34,0],r:[30,0,0]});K.cyl(5,5,0.6,'#FFF1B0',{p:[-4,31.6,1.4],r:[30,0,0]});
  },
  // Cepillo de dientes con cerdas
  'odontologia.b'(K){
    const g=K.group({r:[0,0,-30]});
    K.box(10,70,6,BL,{p:[0,-12,0],rad:3,parent:g});K.box(12,20,7,'#7FC8F0',{p:[0,-34,0],rad:3,parent:g});
    K.box(10,22,4,BL,{p:[0,32,0],rad:2,parent:g});
    for(let r=0;r<6;r++)for(let c=0;c<3;c++)K.cyl(1.2,1.2,10,c==1?'#7FC8F0':WH,{p:[-3+c*3,24+r*3.2,6.5],r:[90,0,0],parent:g});
  },
  // Espejo dental: mango, cuello y espejo
  'o_espejo.a'(K){
    const g=K.group({r:[0,0,-35]});
    K.cyl(2.6,2.2,56,ST,{m:'metal',p:[0,-12,0],parent:g});
    for(let i=0;i<6;i++)K.tor(2.7,0.4,'#8994A0',{m:'metal',p:[0,-30+i*3,0],r:[90,0,0],parent:g});
    K.tube([[0,16,0],[0,26,0],[2,32,2]],1,ST,{m:'metal',parent:g});
    const m=K.group({p:[3,38,3],r:[50,0,0],parent:g});K.cyl(8,8,2.4,'#8994A0',{m:'metal',parent:m});K.cyl(7,7,2.6,'#DDF1FA',{m:'glass',parent:m});
  },
  // Pasta de dientes: tubo con pliegue y tapa
  'o_pasta.a'(K){
    const g=K.group({r:[0,0,-15]});
    K.lathe([[0.01,-34],[10,-33],[12,-20],[12,24],[9,30],[5,32],[0.01,32]],WH,{s:[1,1,0.55],parent:g});
    K.box(26,4,5,'#D5DCE2',{p:[0,-36,0],rad:1,parent:g});
    for(let i=0;i<5;i++)K.box(26,0.6,5.6,'#A9B6C2',{p:[0,-37.5+i*0.8,0],rad:0.2,parent:g});
    K.cyl(6,6,10,BL,{p:[0,37,0],parent:g});
    for(let i=0;i<10;i++){const a=i/10*Math.PI*2;K.box(0.8,9,0.8,'#2C5E91',{p:[Math.cos(a)*6.1,37,Math.sin(a)*6.1],parent:g})}
    K.box(16,22,0.8,BL,{p:[0,0,6.7],rad:1,parent:g});K.box(16,22,0.8,BL,{p:[0,0,-6.7],rad:1,parent:g});
  },
  // Hilo dental: dispensador con tapa y hilo saliendo
  'o_hilo.a'(K){
    K.box(44,40,22,WH,{p:[0,-8,0],rad:6});K.box(46,14,24,'#5FB4D9',{p:[0,16,0],rad:6});
    K.box(22,10,1,'#E3F2F9',{p:[0,-8,11.4],rad:1.4});K.box(16,1.4,1.4,'#5FB4D9',{p:[0,-8,12],rad:0.5});
    K.tube([[16,22,0],[24,34,0],[34,38,0]],0.6,'#DDEFF7',{});
    K.box(22,10,1,'#E3F2F9',{p:[0,-8,-11.4],rad:1.4});K.box(16,1.4,1.4,'#5FB4D9',{p:[0,-8,-12],rad:0.5});
  },
  // Camilla con colchón, almohada, barandal y ruedas
  'o_camilla.a'(K){
    K.box(80,6,30,'#5FB4D9',{p:[0,6,0],rad:3});K.box(20,6,24,WH,{p:[-28,11,0],rad:3});
    K.box(84,2,30,ST,{m:'metal',p:[0,2,0],rad:0.8});
    [[-34,-12],[-34,12],[34,-12],[34,12]].forEach(([x,z])=>{K.cyl(1.4,1.4,26,ST,{m:'metal',p:[x,-12,z]});K.cyl(3.4,3.4,2.6,BK,{p:[x,-27,z],r:[90,0,0]})});
    K.cyl(1.2,1.2,70,ST,{m:'metal',p:[0,-20,12],r:[0,0,90]});K.cyl(1.2,1.2,70,ST,{m:'metal',p:[0,-20,-12],r:[0,0,90]});
    K.tube([[-30,2,16],[-30,14,16],[30,14,16],[30,2,16]],1,ST,{m:'metal',tension:0.1});
  },
  // Mancuerna hexagonal
  'fisioterapia.b'(K){
    K.cyl(4,4,40,ST,{m:'metal',r:[0,0,90]});
    for(let i=0;i<14;i++)K.tor(4.05,0.35,'#7C8792',{m:'metal',p:[-9+i*1.4,0,0],r:[0,90,0]});
    [-1,1].forEach(sd=>{K.cyl(14,14,18,BK,{p:[sd*28,0,0],r:[0,0,90],seg:6});K.cyl(5,5,18.4,ST,{m:'metal',p:[sd*28,0,0],r:[0,0,90]})});
  },
  // Muleta de antebrazo con abrazadera, agarradera y regatón
  'o_muleta.a'(K){
    K.cyl(2.6,2.6,70,ST,{m:'metal',p:[0,-6,0]});
    for(let i=0;i<6;i++)K.cyl(0.8,0.8,0.4,'#3A4048',{p:[0,-30+i*5,2.6],r:[90,0,0]});
    K.box(6,8,6,'#3A4048',{p:[0,30,0],rad:2});K.tube([[0,32,0],[0,40,-4]],2.4,ST,{m:'metal'});
    K.tor(8,2.6,'#3A4048',{p:[0,46,-8],arc:220,r:[90,0,-20]});
    K.box(22,7,8,'#2B3540',{p:[10,10,0],rad:3});
    K.cyl(3.8,3,8,'#2B3540',{p:[0,-44,0]});
  },
  // Cápsula de dos colores
  'qfb.a'(K){
    const g=K.group({r:[0,0,-50]});
    K.cap(12,26,RE,{p:[0,-9,0],parent:g});K.cap(12.4,24,WH,{p:[0,10,0],parent:g});
  },
  // Frasco de medicina con tapa estriada y etiqueta con cruz
  'qfb.b'(K){
    K.box(44,50,30,'#C9852F',{m:'glass',p:[0,-6,0],rad:8});
    K.cyl(12,12,6,'#C9852F',{m:'glass',p:[0,21,0]});
    K.cyl(16,16,12,WH,{p:[0,28,0]});for(let i=0;i<24;i++){const a=i/24*Math.PI*2;K.box(0.8,11,0.8,'#D9DCD6',{p:[Math.cos(a)*16.1,28,Math.sin(a)*16.1]})}
    [15.2,-15.2].forEach(z=>{K.box(36,24,0.8,WH,{p:[0,-6,z],rad:1});K.box(12,4,1.4,RE,{p:[0,-6,z],rad:0.5});K.box(4,12,1.4,RE,{p:[0,-6,z],rad:0.5})});
  },
  // Blíster de pastillas con burbujas
  'o_blister.a'(K){
    K.box(64,74,2,'#DCE2E8',{rad:3});
    for(let r=0;r<3;r++)for(let c=0;c<2;c++){const p=[-14+c*28,-22+r*22,1];K.sph(9,'#EEF6FA',{m:'glass',p,s:[1,0.8,0.5]});
      K.cap(5,6,r==0&&c==1?'#F2A94C':WH,{p:[p[0],p[1],2],r:[0,0,90]})}
    K.box(64,74,0.6,'#C9D0D6',{p:[0,0,-1.3],rad:3});
    for(let i=0;i<6;i++)K.box(i%2?40:52,1.6,0.4,'#8C96A0',{p:[0,26-i*10,-1.7],rad:0.3});
  },
  // Gotero con perilla de hule y vidrio
  'o_gotero.a'(K){
    const g=K.group({r:[0,0,-20]});
    K.cap(8,10,RE,{p:[0,32,0],parent:g});K.cyl(9,9,4,'#3A4048',{p:[0,22,0],parent:g});
    K.lathe([[0.01,-34],[1.2,-33],[3,-20],[5,-6],[5,20],[0.01,20]],'#E6F4FA',{m:'glass',parent:g});
    K.lathe([[0.01,-32],[1,-31],[2.6,-20],[4,-8],[4,2],[0.01,2]],'#8FC4E6',{parent:g});
    K.sph(2.6,'#8FC4E6',{p:[0,-42,0],s:[1,1.3,1],parent:g});
  },
  // Mortero con mano
  'o_mortero.a'(K){
    K.lathe([[0.01,-24],[16,-24],[17,-20],[26,-6],[30,10],[28,12],[24,0],[0.01,-8]],'#E9E3D6');
    K.cyl(24,24,1,'#B8AF9E',{p:[0,6,0]});
    K.cap(4.5,40,'#D5CEC0',{p:[12,20,0],r:[0,0,-35]});
  },

  // Llave española: boca abierta inclinada 15° arriba, estrella cerrada abajo, mango con rebaje
  'mecanica.a'(K){
    const g=K.group({r:[0,0,-40]});
    K.box(10,50,5,ST,{m:'metal',rad:2.4,parent:g});
    [2.7,-2.7].forEach(z=>K.box(5,30,0.6,'#8994A0',{m:'metal',p:[0,0,z],rad:0.3,parent:g}));
    const R=13,w=6.2,a0=Math.acos(w/R);const outer=[];
    for(let i=0;i<=40;i++){const a=a0-i/40*(Math.PI*2-(Math.PI-2*a0));outer.push([Math.cos(a)*R,Math.sin(a)*R])}
    outer.push([-w,0]);for(let i=1;i<20;i++){const a=Math.PI+i/20*Math.PI;outer.push([Math.cos(a)*w,Math.sin(a)*w])}outer.push([w,0]);
    const h1=K.group({p:[0,32,0],r:[0,0,15],parent:g});K.shape(outer,null,5,ST,{m:'metal',bevel:1,parent:h1});
    K.box(9,10,5,ST,{m:'metal',p:[0,24,0],rad:2,parent:g});
    const star=[];for(let i=0;i<24;i++){const a=i/24*Math.PI*2;const r=i%2?5.4:6.6;star.push([Math.cos(a)*r,Math.sin(a)*r])}
    const h2=K.group({p:[0,-32,0],parent:g});K.shape(circ(0,0,11,48),[star],5,ST,{m:'metal',bevel:1,parent:h2});
    K.box(9,10,5,ST,{m:'metal',p:[0,-23,0],rad:2,parent:g});
  },
  // Tuerca hexagonal con chaflán y rosca interior
  'mecanica.b'(K){
    const hex=circ(0,0,30,6,Math.PI/6,Math.PI/6+Math.PI*2);
    K.shape(hex,[circ(0,0,12,48)],16,ST,{m:'metal',bevel:2.6});
    for(let i=0;i<6;i++)K.tor(12,0.9,'#7C8792',{m:'metal',p:[0,0,-7.5+i*3]});
  },
  // Vaso de vidrio con agua y popote
  'o_vaso.a'(K){
    K.lathe([[0.01,-30],[19,-30],[20,-29],[24,30],[22.6,30.6],[21.4,30],[17.6,-27],[0.01,-27]],'#EEF8FC',{m:'glass'});
    K.cyl(20.2,17.4,40,'#8FD0F2',{p:[0,-7,0]});
    K.tube([[6,-22,2],[14,20,-2],[18,44,-4]],1.8,'#E2683E',{});
  },
  // Diván de psicoanálisis
  'o_divan.a'(K){
    [[-34,-11],[-34,11],[34,-11],[34,11]].forEach(([x,z])=>K.lathe([[0.01,-30],[2.4,-30],[3.4,-26],[2.2,-22],[3,-19],[0.01,-18]],'#6E4426',{m:'wood',p:[x,8,z]}));
    K.box(82,8,28,'#6E3528',{p:[0,-8,0],rad:2});
    K.box(80,9,26,'#8E4A3A',{p:[0,0,0],rad:4});
    K.box(28,10,26,'#8E4A3A',{p:[-30,10,0],r:[0,0,35],rad:4});
    for(let x=-16;x<=32;x+=12)[-6,6].forEach(z=>K.sph(1,'#5E2A1E',{p:[x,4.6,z]}));
    K.sph(9,'#E9D8B4',{p:[-28,16,0],s:[1.2,0.55,1.1],r:[0,0,35]});
    K.box(30,0.8,26.4,'#C9A04A',{p:[16,4.8,0],rad:0.3});K.box(30,12,0.8,'#C9A04A',{p:[16,-1,13.5],rad:0.3});
    for(let x=3;x<=29;x+=3)K.cyl(0.35,0.35,3,'#E3C26A',{p:[x,-8.5,13.6]});
  },
  // Pelota de terapia con costuras de gajos y válvula
  'o_pelota.a'(K){
    K.sph(32,'#5FC4B4');
    [0,45,90,135].forEach(a=>K.tor(32.05,0.45,'#BFEDE6',{r:[0,a,0]}));
    K.cyl(2.2,2.6,2.4,'#3E9E8E',{p:[0,32.6,0]});
  },
  // Rodillo de espuma con relieve y centro hueco
  'o_rodillo.a'(K){
    K.cyl(14,14,64,'#5B8DD6',{r:[0,0,90]});
    K.cyl(6,6,64.6,'#2E4E86',{r:[0,0,90]});
    for(let i=0;i<8;i++){for(let j=0;j<12;j++){const q=K.group({p:[-28+i*8,0,0],r:[j*30+(i%2)*15,0,0]});K.box(4.2,2.4,4.2,'#6E9FE4',{p:[0,14.4,0],rad:1,parent:q})}}
  },
  // Liga de resistencia con dos agarraderas
  'o_liga2.a'(K){
    const band=[[-30,16,0],[-16,26,6],[2,18,10],[16,2,4],[26,-14,-4],[30,-24,-6]];
    K.tube(band,2.2,'#4FB6A8',{});
    const handle=(A,d)=>{const L=Math.hypot(d[0],d[1]);const ux=d[0]/L,uy=d[1]/L,px=-uy,py=ux;const G=[A[0]+ux*13,A[1]+uy*13,A[2]];
      const E1=[G[0]+px*8,G[1]+py*8,G[2]],E2=[G[0]-px*8,G[1]-py*8,G[2]];
      K.tube([A,E1],1.1,'#3A4048',{});K.tube([A,E2],1.1,'#3A4048',{});
      K.cyl(3.8,3.8,15,'#2B3540',{p:G,r:[0,0,Math.atan2(py,px)*180/Math.PI-90]});K.sph(2.2,'#5B6670',{m:'metal',p:A})};
    handle(band[0],[-1,0.6]);handle(band[band.length-1],[0.3,-1]);
  },
  // Tubo de ensayo de vidrio con líquido y burbujas
  'quimica.b'(K){
    const g=K.group({r:[0,0,-12]});
    K.lathe([[0.01,-30],[5,-29],[8,-25],[9,-20],[9,32],[10.6,33],[10.6,34.6],[8.2,34.2],[8,-20],[7,-25],[4.4,-28],[0.01,-28.6]],'#E6F4FA',{m:'glass',parent:g});
    K.lathe([[0.01,-28.2],[4.2,-27.4],[6.8,-24.6],[7.7,-20],[7.7,6],[4,6.6],[0.01,7]],BL,{parent:g});
    [[2,-12,2],[-2,-4,1],[1,2,-2]].forEach(p=>K.sph(1.4,'#CFE9FA',{p,parent:g}));
    [12,18,24].forEach(y=>K.box(4,0.6,0.5,'#FFFFFF',{p:[-1,y,8.9],rad:0.2,parent:g}));
  },
  // Célula: membrana transparente con núcleo, mitocondrias, retículo, Golgi, ribosomas y vesículas
  'biologia.b'(K){
    K.sph(36,'#B9E6A8',{m:'membrane',s:[1.1,0.9,0.85]});
    K.sph(13,PU,{p:[-6,3,0]});K.sph(5,'#5A2E7E',{p:[-9,6,9]});
    [[16,12,6,30],[18,-12,-4,-40],[-20,-16,4,70]].forEach(([x,y,z,a])=>{const m=K.group({p:[x,y,z],r:[20,30,a]});K.cap(3.4,9,'#F08A2E',{parent:m});K.tube([[0,-5,3],[1.5,-2,3.3],[-1.5,1,3.3],[1.5,4,3]],0.5,'#B85E1A',{parent:m,nocap:true})});
    K.tube([[6,16,-6],[12,20,-4],[8,24,2],[0,22,6],[-8,20,4]],1.6,'#E58AA0',{});
    K.tube([[-22,6,-4],[-24,-4,0],[-18,-8,6]],1.6,'#E58AA0',{});
    [0,1,2].forEach(i=>K.tor(9-i*1.6,1,YE,{p:[22,0,-8+i*3.4],arc:150,r:[0,0,100]}));
    for(let i=0;i<14;i++){const a=i*2.4,r=24;K.sph(0.9,'#3A4048',{p:[Math.cos(a)*r*0.9,Math.sin(a*1.3)*16,Math.sin(a)*14]})}
    [[-4,-22,8],[26,16,-2],[-26,14,-6]].forEach(p=>K.sph(3,'#9BD58A',{p}));
  },
  // Megáfono: campana con rejilla y aro, cuerpo, tapa trasera, mango y gatillo
  'mercadotecnia.a'(K){
    K.cyl(22,8,36,RE,{p:[14,0,0],r:[0,0,-90]});
    K.cyl(19.6,19.6,1,'#2B3540',{p:[32.3,0,0],r:[0,0,-90]});
    K.tor(21,2,'#F3F1EA',{p:[32,0,0],r:[0,90,0]});
    K.cyl(9,9,22,RE,{p:[-14,0,0],r:[0,0,90]});
    K.cyl(9.6,9.6,5,'#E6E6E6',{p:[-27,0,0],r:[0,0,90]});
    K.box(9,24,8,BK,{p:[-12,-17,0],r:[0,0,-14],rad:3});
    K.box(4,8,4,'#5B6670',{p:[-5,-11,0],rad:1.2});
  },
  // Pincel: mango de madera, virola metálica con pliegues y cerdas con pintura
  'grafico.b'(K){
    const g=K.group({r:[0,0,-35]});
    K.lathe([[0.01,52],[2.6,51],[3.4,46],[4.6,20],[5.2,8],[0.01,8]],'#C68A4E',{m:'wood',parent:g});
    K.cyl(5.2,5.6,14,ST,{m:'metal',p:[0,1,0],parent:g});
    [4,-2].forEach(y=>K.tor(5.5,0.5,'#8994A0',{m:'metal',p:[0,y,0],r:[90,0,0],parent:g}));
    K.lathe([[0.01,-6],[5.6,-6],[6.6,-14],[6.5,-18],[0.01,-18.5]],'#E8D3A6',{parent:g});
    K.lathe([[0.01,-17.5],[6.5,-18],[6,-24],[3.6,-32],[0.01,-38]],RE,{parent:g});
  },

  // Estetoscopio: olivas, tubos metálicos en Y, manguera y campana con diafragma
  'medicina.a'(K){
    K.sph(3.4,BK,{p:[-16,60,4]});K.sph(3.4,BK,{p:[16,60,4]});
    K.tube([[-16,58,3],[-15,46,1],[-9,34,0],[0,28,0]],1.5,ST,{m:'metal'});
    K.tube([[16,58,3],[15,46,1],[9,34,0],[0,28,0]],1.5,ST,{m:'metal'});
    K.tube([[-10,40,0],[10,40,0]],0.8,ST,{m:'metal'});
    K.tube([[0,28,0],[0,16,0],[-6,2,2],[-2,-12,6],[12,-14,6],[20,-6,4]],2.4,BK);
    const h=K.group({p:[24,-4,4],r:[90,0,0]});
    K.cyl(9,9,4,ST,{m:'metal',parent:h});K.cyl(7.6,7.6,4.4,'#E6EBEF',{parent:h,p:[0,0.4,0]});K.cyl(3,3,5,'#9AA3AC',{m:'metal',parent:h,p:[0,-2,0]});
  },
  // Maletín médico con asa, cierre y cruz en ambas caras
  'medicina.b'(K){
    K.box(72,46,30,RE,{p:[0,0,0],rad:6});
    K.box(73,4,31,'#B23A2E',{p:[0,14,0],rad:1.5});
    K.tube([[-14,23,0],[-14,32,0],[14,32,0],[14,23,0]],2.6,BK,{tension:0.2});
    [15.3,-15.3].forEach(z=>{K.box(20,6,1.2,WH,{p:[0,-3,z],rad:0.6});K.box(6,20,1.2,WH,{p:[0,-3,z],rad:0.6})});
    K.box(6,4,2,GO,{m:'gold',p:[0,14,15.6],rad:0.6});
  },
  // Termómetro de vidrio con bulbo rojo, columna y escala
  'o_termometro.a'(K){
    K.cyl(7,7,70,'#EDF6FA',{m:'glass',p:[0,10,0]});K.sph(7,'#EDF6FA',{m:'glass',p:[0,45,0]});
    K.sph(11,RE,{p:[0,-30,0]});K.cyl(2.6,2.6,52,RE,{p:[0,0,0]});
    for(let i=0;i<9;i++)K.box(i%2?3:5,0.8,1,'#5B6670',{p:[8.5,-12+i*6,0],rad:0.2});
  },
  // Jeringa: barril de vidrio con líquido, émbolo, aletas y aguja
  'enfermeria.b'(K){
    const g=K.group({r:[0,0,-40]});
    K.cyl(8,8,50,'#DDF1FA',{m:'glass',parent:g});K.cyl(7,7,28,'#E9677A',{p:[0,-10,0],parent:g});
    K.box(30,3,8,ST,{m:'metal',p:[0,25,0],rad:1,parent:g});
    K.cyl(2.2,2.2,22,'#C9D0D6',{p:[0,36,0],parent:g});K.cyl(7,7,3,BK,{p:[0,47,0],parent:g});
    K.cyl(2.4,3.4,5,'#C9D0D6',{p:[0,-27,0],parent:g});K.cyl(0.6,0.6,22,ST,{m:'metal',p:[0,-40,0],parent:g});
    for(let i=0;i<5;i++)K.box(4,0.7,0.6,BL,{p:[-6,-18+i*8,7.6],rad:0.2,parent:g});
  },
  // Manzana con hendidura, tallo y hoja
  'nutricion.a'(K){
    K.lathe([[0.01,-30],[8,-31],[18,-27],[27,-16],[31,-2],[30,12],[25,22],[16,27],[8,25],[2,20],[0.01,18]],RE);
    K.tube([[0,18,0],[1,28,0],[4,34,0]],1.6,BR);
    K.ext('M0 0 C6 -8 18 -8 22 -2 C16 4 6 4 0 0 Z',2,GR,{bevel:0.8,p:[3,32,0],r:[0,-30,20]});
    K.sph(5,'#FF8A7A',{p:[-14,10,20],s:[1,1.6,0.4]});
  },

  // Balanza de la justicia: base, columna, brazo y platillos colgando de cadenas
  'derecho.a'(K){
    K.cyl(16,20,5,GO,{m:'gold',p:[0,-40,0]});K.cyl(8,10,4,GO,{m:'gold',p:[0,-36,0]});
    K.cyl(2.4,2.4,70,GO,{m:'gold',p:[0,-2,0]});K.sph(5,GO,{m:'gold',p:[0,36,0]});
    K.cyl(1.8,1.8,72,GO,{m:'gold',p:[0,30,0],r:[0,0,90]});
    [-36,36].forEach(x=>{K.sph(2.4,GO,{m:'gold',p:[x,30,0]});
      [[-9,0],[9,0],[0,-9],[0,9]].forEach(([dx,dz])=>K.tube([[x,30,0],[x+dx,0,dz]],0.5,'#C9A23A',{m:'gold',nocap:true}));
      K.lathe([[0.01,-6],[9,-5],[12,-1],[12.5,0]],GO,{m:'gold',p:[x,1,0]})});
  },
  // Mazo de juez con bandas doradas sobre su base
  'derecho.b'(K){
    K.cyl(18,20,5,'#8F5E30',{m:'wood',p:[6,-30,0]});
    const g=K.group({p:[-4,6,0],r:[0,0,32]});
    K.cyl(10,10,40,WO,{m:'wood',r:[0,0,90],parent:g});
    [-14,14].forEach(x=>K.cyl(10.6,10.6,3,GO,{m:'gold',p:[x,0,0],r:[0,0,90],parent:g}));
    K.cyl(3.4,3,48,'#A36E3E',{m:'wood',p:[0,-28,0],parent:g});K.sph(4,'#8F5E30',{m:'wood',p:[0,-52,0],parent:g});
  },
  // Monitor con código, marco, cuello y base; carcasa trasera con ventilación
  'computacion.a'(K){
    K.box(80,52,5,BK,{p:[0,14,0],rad:2});K.box(72,44,0.8,'#13283B',{p:[0,15,2.8],rad:0.4});
    const c=K.group({p:[0,15,3.4]});
    K.tube([[-14,9,0],[-24,0,0],[-14,-9,0]],1.8,'#5BE07A',{tension:0,parent:c});K.tube([[14,9,0],[24,0,0],[14,-9,0]],1.8,'#5BE07A',{tension:0,parent:c});K.tube([[5,11,0],[-5,-11,0]],1.8,YE,{parent:c});
    K.box(40,30,6,'#2E343B',{p:[0,14,-4.5],rad:3});
    for(let i=0;i<5;i++)K.box(24,1,1,'#22272D',{p:[0,6+i*4,-7.6],rad:0.3});
    K.box(8,16,5,GY,{m:'metal',p:[0,-17,-3],rad:1.5});K.box(36,3,20,GY,{m:'metal',p:[0,-25,-2],rad:1.4});
  },
  // Báscula de baño con pantalla y almohadillas antiderrapantes
  'o_bascula.a'(K){
    const g=K.group({r:[62,0,0]});
    K.box(70,10,70,'#EEF1F4',{rad:5,parent:g});K.box(64,1,64,'#DCE1E6',{p:[0,5.2,0],rad:3,parent:g});
    K.box(26,1.6,11,'#2B3540',{p:[0,5.8,-23],rad:1,parent:g});
    [-15,15].forEach(x=>K.box(16,1,30,'#D0D6DC',{p:[x,5.9,9],rad:3,parent:g}));
    [[-28,-28],[28,-28],[-28,28],[28,28]].forEach(([x,z])=>K.cyl(3,3,2,'#5B6670',{p:[x,-5.6,z],parent:g}));
    const t=K.group({p:[0,6.8,-23],r:[-90,0,0],parent:g});
    [-7,-2,4].forEach(x=>K.box(3,5,0.4,'#7CF2C8',{p:[x,0,0],rad:0.2,parent:t}));K.sph(0.6,'#7CF2C8',{p:[1,-2.4,0],parent:t});
  },

  // Alcancía de cerdito: cuerpo, hocico con fosas, orejas, patas, cola y moneda entrando
  'finanzas.b'(K){
    const P='#F2A7B8',PD='#E58AA0';
    K.sph(30,P,{s:[1.15,0.9,0.85]});
    const sn=K.group({p:[-34,0,0],r:[0,0,90]});K.cyl(9,10,8,P,{parent:sn});K.cyl(8,8,8.4,PD,{p:[0,0.4,0],parent:sn});
    [-3.5,3.5].forEach(z=>K.cyl(1.6,1.6,1,'#B9566E',{p:[-38.4,0,z],r:[0,0,90]}));
    [-10,10].forEach(z=>K.cone(5,10,PD,{p:[-18,26,z],r:[z<0?-20:20,0,-20]}));
    [[-16,-14],[-16,14],[16,-14],[16,14]].forEach(([x,z])=>K.cyl(5.4,5.4,12,PD,{p:[x,-28,z]}));
    [-14,14].forEach(z=>{K.sph(2.6,BK,{p:[-24,8,z*0.6]})});
    K.tube([[34,4,0],[40,8,0],[42,2,3],[38,0,0],[42,-2,0]],1.4,PD);
    K.box(16,1,3,'#B9566E',{p:[2,27,0],rad:0.4});
    K.cyl(9,9,2.6,GO,{m:'gold',p:[2,38,0],r:[90,0,0]});
  },
  // Moneda gruesa con borde estriado y signo de pesos en ambas caras
  'finanzas.a'(K){
    K.cyl(40,40,8,GO,{m:'gold',r:[90,0,0],seg:72});
    for(let i=0;i<60;i++){const a=i/60*Math.PI*2;K.box(1,1.2,8.4,'#C9961E',{m:'gold',p:[Math.cos(a)*40,Math.sin(a)*40,0],r:[0,0,a*180/Math.PI],rad:0.2})}
    [4.2,-4.2].forEach(z=>{K.tor(32,1,'#C9961E',{m:'gold',p:[0,0,z]});
      const g=K.group({p:[0,0,z],r:[0,z<0?180:0,0]});
      K.tube([[9,13,0],[4,16,0],[-6,15,0],[-10,8,0],[-4,1,0],[6,-1,0],[11,-7,0],[7,-15,0],[-4,-16,0],[-10,-12,0]],2.4,'#B8861C',{m:'gold',parent:g});
      K.tube([[0,22,0],[0,-22,0]],2,'#B8861C',{m:'gold',parent:g})});
  },
  // Pizarrón verde con marco de madera, escritura en gis, bandeja con gis y borrador, caballete
  'educacion.a'(K){
    K.box(80,56,4,'#9A6A3A',{m:'wood',p:[0,14,0],rad:1.4});K.box(72,48,0.8,'#2F5E45',{p:[0,14,2.2],rad:0.3});
    K.box(72,48,0.8,'#2F5E45',{p:[0,14,-2.2],rad:0.3});
    const w=K.group({p:[0,14,2.8]});
    [[-12,12,22],[-8,4,30],[-14,-4,18]].forEach(([x,y,l])=>K.tube([[x-l/2+6,y,0],[x+l/2+6,y,0]],0.9,'#F3F1EA',{parent:w}));
    K.tube([[16,10,0],[28,-2,0]],1,'#F3F1EA',{parent:w});K.tube([[28,10,0],[16,-2,0]],1,'#F3F1EA',{parent:w});
    K.box(70,2,6,'#8A5A36',{m:'wood',p:[0,-15,3],rad:0.6});K.box(10,1.6,1.6,WH,{p:[-12,-13.2,4],rad:0.6});K.box(12,3,4,'#E9677A',{p:[14,-12.6,4],rad:0.8});
    [[-30,6],[30,6]].forEach(([x,z])=>K.cyl(1.6,1.6,30,'#8A5A36',{m:'wood',p:[x*1.1,-26,z],r:[-10,0,x<0?-6:6]}));K.cyl(1.6,1.6,34,'#8A5A36',{m:'wood',p:[0,-24,-10],r:[20,0,0]});
    const wb=K.group({p:[0,14,-2.8],r:[0,180,0]});
    [[-6,14,30],[-2,6,22],[-10,-2,26]].forEach(([x,y,l])=>K.tube([[x-l/2,y,0],[x+l/2,y,0]],0.9,'#F3F1EA',{parent:wb}));
    K.tube([[16,12,0],[22,4,0],[28,12,0]],1,'#F3F1EA',{parent:wb,tension:0});K.tube([[16,-2,0],[28,-2,0]],1,'#F3F1EA',{parent:wb});
  },
  // Birrete: tablero, gorro, botón y borla
  'educacion.b'(K){
    K.cyl(22,24,20,'#2B3540',{p:[0,-8,0]});
    const b=K.box(66,3,66,'#3A4652',{p:[0,4,0],r:[0,45,0],rad:0.8});
    K.cyl(3,3,2,GO,{m:'gold',p:[0,6.4,0]});
    K.tube([[0,6.6,0],[20,6,20],[30,4,30]],0.8,GO,{m:'gold',nocap:true});
    K.tube([[30,4,30],[30,-14,30]],0.9,GO,{m:'gold'});K.cyl(2.6,4,10,GO,{m:'gold',p:[30,-18,30]});
  },
  // Casco de obra: casco con cresta y ala alrededor
  'civil.a'(K){
    K.sph(30,YE,{s:[1,0.95,1.08]}).geometry=new THREE.SphereGeometry(30,48,24,0,Math.PI*2,0,Math.PI/2);
    K.cyl(31,31,3,YE,{p:[0,0.5,0],s:[1,1,1.08]});
    K.cyl(40,40,2.4,'#E3B526',{p:[0,-1,9],s:[1,1,1.12],seg:64});
    K.tor(29,3.4,'#F8DA6A',{p:[0,0,0],r:[0,90,0],arc:180,s:[1,1,1.08]});
    const st=K.group({p:[0,13,29.4],r:[-26,0,0]});K.cyl(7,7,1,'#E2683E',{r:[90,0,0],parent:st});K.box(6,1.6,1.4,WH,{rad:0.5,parent:st});
  },

  // Llave perica con quijadas y tornillo sinfín




  // Candado dorado con arco de acero y ojo de cerradura
  'ciberseguridad.b'(K){
    K.box(56,46,18,GO,{m:'gold',p:[0,-10,0],rad:6});
    K.tube([[-17,12,0],[-17,30,0],[-12,40,0],[0,43,0],[12,40,0],[17,30,0],[17,12,0]],4,ST,{m:'metal'});
    [9.3,-9.3].forEach(z=>{K.cyl(5,5,1.2,'#7A5A1A',{p:[0,-6,z],r:[90,0,0]});K.box(4,12,1.2,'#7A5A1A',{p:[0,-14,z],rad:0.6})});
  },

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
