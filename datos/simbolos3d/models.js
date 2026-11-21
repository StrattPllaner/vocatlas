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

const PU='#8E5BB5',TE='#2FA39A';const GY='#8C96A0',ST='#A9B6C2',BK='#3A4048',WH='#F3F1EA',RE='#DE4A3C',BL='#3F82C4',GR='#4FAE5B',YE='#F6CD3B',BR='#8A5A36',WO='#B9804B',GO='#E8B53C',NA='#2D4A6E',CR='#F0E2C2',SK='#E7A97C';

const circ=(cx,cy,r,n,a0,a1)=>{a0=a0==null?0:a0;a1=a1==null?Math.PI*2:a1;const o=[];for(let i=0;i<n;i++){const a=a0+(a1-a0)*i/(n-(Math.abs(a1-a0-Math.PI*2)<1e-6?0:1));o.push([cx+Math.cos(a)*r,cy+Math.sin(a)*r])}return o};
export const MODELS={
  // Cofia de enfermera con cruz roja al frente
  'enfermeria.a'(K){
    K.lathe([[0.01,0],[31,0],[30,4],[24,16],[14,24],[0.01,26]],WH,{s:[1,1,0.8]});
    K.box(66,6,30,WH,{p:[0,0,2],rad:3});
    K.box(14,4,1,RE,{p:[0,14,23.6],rad:0.6});K.box(4,14,1,RE,{p:[0,14,23.6],rad:0.6});
    K.box(14,4,1,RE,{p:[0,14,-23.6],rad:0.6});K.box(4,14,1,RE,{p:[0,14,-23.6],rad:0.6});
  },
  // Bolsa de suero colgando con puerto, cámara de goteo y tubo
  'o_suero.a'(K){
    K.box(44,54,10,'#EEF6FA',{m:'glass',p:[0,8,0],rad:5});
    K.box(40,30,7,'#F2D36B',{p:[0,-2,0],rad:3.4});
    K.box(26,10,1,WH,{p:[0,24,5.4],rad:1});K.box(18,1.2,1.2,'#7FA8D6',{p:[0,25,6],rad:0.4});
    K.tor(4,1.2,'#C9D3DA',{p:[0,39,0]});
    for(let i=0;i<4;i++)K.box(5,0.7,0.6,'#C9A23A',{p:[-16,-10+i*6,5.3],rad:0.2});
    K.cyl(3,3,6,'#E6ECEF',{p:[0,-22,0]});K.cyl(4.2,4.2,12,'#EEF6FA',{m:'glass',p:[0,-31,0]});K.cyl(1,1,16,'#C9D3DA',{p:[0,-44,0]});
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
