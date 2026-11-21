/* ================= la espiral de la carrera =================
   Abajo, en el suelo, la isla de la carrera: empieza contaminada de boceto y se vuelve la isla a color conforme avanzas.
   Encima flotan los símbolos de la carrera, uno por unidad: figuras grandes en 3D, limpias, sin nada alrededor
   (una cruz para Medicina, una casa para Arquitectura, una balanza para Derecho…). Un camino sube en espiral, como una
   escalera de caracol, alrededor de ellos; las lecciones son botones que flotan sobre el camino. La espiral gira para dejar
   la lección actual al frente y al centro. Rumbo va arriba de su avioneta y vuela de una lección a la siguiente.
   Lo único que sube es Rumbo: la isla se queda en el suelo. */
var TORRE=(function(I){
 var P=I.P,f1=I.f1,R=84,FH=250,PF=.22,D2R=Math.PI/180,ISLE=140;

 /* ---------- figuras en 3D: un contorno plano (u a la derecha, v hacia arriba) con grosor ---------- */
 function circ(cx,cy,r,ry,n){var o=[];n=n||22;for(var i=0;i<n;i++){var a=i/n*Math.PI*2;o.push([cx+Math.cos(a)*r,cy+Math.sin(a)*(ry||r)])}return o}
 function rect(x0,y0,x1,y1){return [[x0,y0],[x1,y0],[x1,y1],[x0,y1]]}
 var SH={
  cruz:{p:[[[-17,0],[17,0],[17,33],[50,33],[50,67],[17,67],[17,100],[-17,100],[-17,67],[-50,67],[-50,33],[-17,33]]]},
  corazon:{p:[(function(){var o=[];for(var i=0;i<40;i++){var t=i/40*Math.PI*2;o.push([16*Math.pow(Math.sin(t),3)*3,(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))*3+52])}return o})()]},
  casa:{p:[[[-46,0],[46,0],[46,56],[0,98],[-46,56]]],d:[{c:"#FFFFFF",p:rect(-11,0,11,32)},{c:"#BFE3F5",p:rect(18,22,36,40)},{c:"#BFE3F5",p:rect(-36,22,-18,40)}]},
  libro:{p:[[[-56,12],[0,0],[56,12],[56,86],[0,74],[-56,86]]],d:[{c:"#FFFFFF",p:[[-48,20],[-4,10],[-4,68],[-48,77]]},{c:"#FFFFFF",p:[[4,10],[48,20],[48,77],[4,68]]}]},
  estrella:{p:[(function(){var o=[];for(var i=0;i<10;i++){var a=-Math.PI/2+i*Math.PI/5,r=i%2?22:52;o.push([Math.cos(a)*r,50-Math.sin(a)*r])}return o})()]},
  engrane:{p:[(function(){var o=[];for(var i=0;i<48;i++){var a=i/48*Math.PI*2,r=(Math.floor(i/3)%2)?40:50;o.push([Math.cos(a)*r,50+Math.sin(a)*r])}return o})()],d:[{c:"#FFFFFF",p:circ(0,50,16)}]},
  matraz:{p:[[[-12,100],[12,100],[12,62],[46,8],[40,0],[-40,0],[-46,8],[-12,62]]],d:[{c:"#FFFFFF",p:[[-32,10],[32,10],[24,24],[-24,24]],o:.7}]},
  huella:{p:[circ(0,30,30,24),circ(-34,64,11,14),circ(-12,82,11,14),circ(12,82,11,14),circ(34,64,11,14)]},
  monitor:{p:[rect(-56,26,56,98),rect(-8,8,8,26),rect(-30,0,30,8)],d:[{c:"#1F3B57",p:rect(-48,34,48,90)},{c:"#7CF2C8",p:rect(-38,70,4,76)},{c:"#FFC857",p:rect(-38,58,22,64)},{c:"#8AB8FF",p:rect(-38,46,-6,52)}]},
  foco:{p:[circ(0,64,36),rect(-16,6,16,34)],d:[{c:"#FFF6C8",p:circ(-10,74,10)},{c:"#8A8A8A",p:rect(-16,14,16,18)},{c:"#8A8A8A",p:rect(-16,22,16,26)}]},
  barras:{p:[rect(-50,0,-22,42),rect(-14,0,14,72),rect(22,0,50,100)]},
  lapiz:{p:[[[-13,24],[13,24],[13,100],[-13,100]],[[-13,24],[13,24],[0,0]]],d:[{c:"#F2D3A0",p:[[-13,24],[13,24],[0,0]]},{c:"#3A3026",p:[[-4,8],[4,8],[0,0]]}]},
  balanza:{p:[rect(-30,0,30,8),rect(-5,8,5,86),rect(-58,82,58,90),[[-74,44],[-36,44],[-44,34],[-66,34]],[[36,44],[74,44],[66,34],[44,34]]],d:[{c:"#FFFFFF",p:[[-56,82],[-54,82],[-55,44],[-57,44]],o:.8},{c:"#FFFFFF",p:[[54,82],[56,82],[57,44],[55,44]],o:.8}]},
  moneda:{p:[circ(0,50,48,48,30)],d:[{c:"#FFFFFF",p:circ(0,50,36,36,30),o:.25},{c:"#FFFFFF",p:rect(-5,26,5,74),o:.8}]},
  portafolio:{p:[rect(-52,0,52,66),[[-18,66],[18,66],[18,84],[-18,84],[-18,78],[10,78],[10,70],[-10,70],[-10,78],[-18,78]]],d:[{c:"#FFFFFF",p:rect(-52,36,52,42),o:.35},{c:"#F2C14E",p:rect(-6,32,6,46)}]},
  codigo:{p:[[[-20,82],[-56,50],[-20,18],[-10,28],[-34,50],[-10,72]],[[20,82],[56,50],[20,18],[10,28],[34,50],[10,72]],[[4,96],[14,96],[-4,4],[-14,4]]]},
  paleta:{p:[circ(0,50,54,46,30)],d:[{c:"#E2434B",p:circ(-26,66,8)},{c:"#3F7DA6",p:circ(0,76,8)},{c:"#F2C14E",p:circ(26,66,8)},{c:"#58B05A",p:circ(30,40,8)},{c:"#FFFFFF",p:circ(-20,32,10)}]},
  gota:{p:[(function(){var o=[];for(var i=0;i<30;i++){var t=i/30*Math.PI*2,x=Math.sin(t)*40,y=-Math.cos(t)*40;if(y>0)x*=1-y/40*.95;o.push([x,46+(y>0?y*1.4:y)])}return o})()]},
  hoja:{p:[(function(){var o=[];for(var i=0;i<30;i++){var t=i/30*Math.PI*2;o.push([Math.sin(t)*34,50-Math.cos(t)*50])}return o})(),rect(-3,-6,3,6)],d:[{c:"#FFFFFF",p:[[-1.5,4],[1.5,4],[1.5,92],[-1.5,92]],o:.6}]},
  diente:{p:[[[-40,100],[-14,92],[0,96],[14,92],[40,100],[46,70],[34,40],[24,0],[10,0],[2,30],[-2,30],[-10,0],[-24,0],[-34,40],[-46,70]]]},
  escudo:{p:[[[-46,100],[46,100],[46,52],[0,0],[-46,52]]],d:[{c:"#FFFFFF",p:[[-6,84],[6,84],[6,62],[22,62],[22,50],[6,50],[6,26],[-6,26],[-6,50],[-22,50],[-22,62],[-6,62]],o:.8}]},
  globo:{p:[circ(0,52,46,46,30),rect(-4,0,4,8),rect(-24,0,24,4)],d:[{c:"#58B05A",p:[[-30,64],[-6,78],[8,62],[-10,48],[-24,50]]},{c:"#58B05A",p:[[10,40],[28,50],[34,32],[18,22]]}]},
  claqueta:{p:[rect(-50,0,50,62),[[-50,64],[50,64],[54,86],[-46,86]]],d:[{c:"#FFFFFF",p:[[-38,66],[-26,66],[-22,84],[-34,84]]},{c:"#FFFFFF",p:[[-12,66],[0,66],[4,84],[-8,84]]},{c:"#FFFFFF",p:[[14,66],[26,66],[30,84],[18,84]]}]},
  vestido:{p:[[[-12,100],[12,100],[16,74],[48,0],[-48,0],[-16,74]]],d:[{c:"#FFFFFF",p:[[-16,60],[16,60],[18,54],[-18,54]],o:.6}]},
  microfono:{p:[circ(0,74,22,26),rect(-4,10,4,48),rect(-22,0,22,10)],d:[{c:"#FFFFFF",p:rect(-14,68,14,72),o:.6},{c:"#FFFFFF",p:rect(-14,80,14,84),o:.6}]},
  cohete:{p:[[[0,100],[18,72],[18,20],[34,0],[12,10],[-12,10],[-34,0],[-18,20],[-18,72]]],d:[{c:"#BFE3F5",p:circ(0,58,9)}]},
  birrete:{p:[[[-60,70],[0,94],[60,70],[0,46]],rect(-30,30,30,58)],d:[{c:"#F2C14E",p:[[40,70],[44,70],[44,30],[40,30]]}]}
 };
 /* extruye un contorno: caras laterales con sombra según su orientación, luego el frente y los detalles */
 /* de frente y sin deformar; el grosor se va hacia atrás, arriba a la derecha (como letras 3D) */
 function solid(sh,c,D){D=D||22;var T=I.T(c),side=[],front="",dec="",i,ox=D*.5,oy=-D*.38;
  var F=function(u,v){return [u,-v]},B=function(u,v){return [u+ox,-v+oy]};
  sh.p.forEach(function(poly){var n=poly.length,area=0;for(i=0;i<n;i++){var a=poly[i],b=poly[(i+1)%n];area+=a[0]*b[1]-b[0]*a[1]}var cw=area<0;
   for(i=0;i<n;i++){var a2=poly[i],b2=poly[(i+1)%n],du=b2[0]-a2[0],dv=b2[1]-a2[1],nu=cw?-dv:dv,nv=cw?du:-du,L=Math.hypot(nu,nv)||1;nu/=L;nv/=L;
    if(nu*.5+nv*.38<=0)continue;
    var col=nv>.6?T.l:nu>.6?T.s:I.shade(c,.1),q=[F(a2[0],a2[1]),F(b2[0],b2[1]),B(b2[0],b2[1]),B(a2[0],a2[1])];
    side.push({k:-(a2[0]+b2[0])-(a2[1]+b2[1]),s:I.poly(q,col,{st:col,sw:.8})})}
   front+=I.poly(poly.map(function(p){return F(p[0],p[1])}),I.tint(c,.06),{st:I.shade(c,.35),sw:1.6})});
  (sh.d||[]).forEach(function(d){dec+=I.poly(d.p.map(function(p){return F(p[0],p[1])}),d.c,{st:false,op:d.o})});
  side.sort(function(a,b){return a.k-b.k});
  return side.map(function(x){return x.s}).join("")+front+dec}

 /* ---------- qué símbolos lleva cada carrera: el suyo primero y luego los de su área ---------- */
 var AREA={salud:["corazon","matraz","gota","libro","estrella","foco"],ing:["engrane","casa","barras","foco","lapiz","estrella"],tec:["monitor","codigo","foco","barras","globo","estrella"],
  neg:["portafolio","moneda","barras","libro","globo","estrella"],arte:["paleta","lapiz","claqueta","libro","foco","estrella"]};
 var SIG={medicina:["cruz","corazon","matraz"],enfermeria:["cruz","corazon"],odontologia:["diente","cruz"],nutricion:["hoja","corazon"],psicologia:["foco","corazon"],veterinaria:["huella","cruz"],
  fisioterapia:["corazon","cruz"],qfb:["matraz","gota"],educfisica:["estrella","corazon"],derecho:["balanza","libro","escudo"],arquitectura:["casa","lapiz","engrane"],civil:["casa","engrane"],
  computacion:["codigo","monitor"],datos:["barras","monitor"],ia:["foco","codigo"],ciberseguridad:["escudo","codigo"],finanzas:["moneda","barras"],contaduria:["moneda","libro"],economia:["barras","moneda"],
  actuaria:["barras","moneda"],negocios:["portafolio","moneda"],mercadotecnia:["microfono","barras"],comext:["globo","portafolio"],turismo:["globo","estrella"],gastronomia:["hoja","corazon"],
  politicas:["balanza","globo"],rrii:["globo","balanza"],sociologia:["corazon","libro"],trabajosocial:["corazon","escudo"],criminologia:["escudo","balanza"],comunicacion:["microfono","claqueta"],
  cine:["claqueta","microfono"],moda:["vestido","paleta"],grafico:["paleta","lapiz"],disindustrial:["lapiz","engrane"],animacion:["paleta","claqueta"],biologia:["hoja","gota"],quimica:["matraz","gota"],
  quimicaing:["matraz","engrane"],biotec:["gota","matraz"],fisica:["foco","estrella"],matematicas:["barras","lapiz"],mecanica:["engrane","lapiz"],electrica:["foco","engrane"],electronica:["codigo","foco"],
  industrial:["engrane","barras"],biomedica:["corazon","engrane"],aeroespacial:["cohete","engrane"],ambiental:["hoja","gota"],mecatronica:["engrane","codigo"],educacion:["libro","birrete"]};
 function symbols(id){var c=byId[id]||{area:"neg"},o=(SIG[id]||[]).slice();(AREA[c.area]||AREA.neg).forEach(function(s){if(o.indexOf(s)<0)o.push(s)});
  ["estrella","libro","foco","globo"].forEach(function(s){if(o.indexOf(s)<0)o.push(s)});return o.slice(0,6)}
 var CACHE={};
 function symSVG(id,k){var c=(byId[id]||{}).color||"#3F7DA6",s=symbols(id)[k]||"estrella";return '<g transform="scale(1.25)">'+solid(SH[s],c,24)+'</g>'}
 function floorSVG(id,k){return symSVG(id,k)}
 /* los seis símbolos 3D de la carrera (media/sym), uno por unidad */
 function symKey(id,k){if(typeof SIMB!=="undefined"&&SIMB.has(id)){var q=SIMB.six(id)[k];if(q)return q.id+"."+q.v}return ""}
 /* símbolos 3D vivos: el motor se carga solo al abrir una espiral */
 var SYM3D=null;function live3d(host){if(!window.WebGLRenderingContext)return;(SYM3D||(SYM3D=import("./vendor/3d/sym3d.js"))).then(function(m){m.mount(host)}).catch(function(){})}
 function symImg(id,k){if(typeof SIMB!=="undefined"&&SIMB.has(id)){var q=SIMB.six(id)[k];if(q)return "media/sym/"+q.id+"."+q.v+".webp"}return ""}
 function has(id){return !!byId[id]&&typeof ISO!=="undefined"}
 function star(on){var r=40,ri=17,p=[];for(var i=0;i<10;i++){var a=-Math.PI/2+i*Math.PI/5,rr=i%2?ri:r;p.push(f1(Math.cos(a)*rr)+","+f1(Math.sin(a)*rr))}
  var pl=p.join(" ");return '<g class="tw-star'+(on?" is-on":"")+'"><polygon points="'+pl+'" transform="translate(0 6)" class="tw-star-b"/><polygon points="'+pl+'" class="tw-star-t"/></g>'}

 /* ---------- la avioneta de Rumbo: de lado, mirando a la derecha, con hélice que gira ---------- */
 var PLANE='<svg class="tw-plane" viewBox="-60 -40 130 70" aria-hidden="true">'+
  '<path d="M52 -2 L62 -26 L68 -26 L66 2 Z" fill="#B23A2E" stroke="#3A3026" stroke-width="2" stroke-linejoin="round"/>'+
  '<path d="M-40 4 C-40 -14 -20 -20 10 -18 C36 -16 60 -10 64 0 C60 10 30 14 0 14 C-26 14 -40 14 -40 4 Z" fill="#D9493B" stroke="#3A3026" stroke-width="2.4" stroke-linejoin="round"/>'+
  '<path d="M-34 -2 C-34 -10 -26 -14 -14 -14" fill="none" stroke="#F08A7E" stroke-width="3" stroke-linecap="round"/>'+
  '<path d="M-6 4 L20 4 L4 30 L-10 30 Z" fill="#F2C870" stroke="#3A3026" stroke-width="2" stroke-linejoin="round"/>'+
  '<path d="M48 0 L64 0 L58 10 L50 10 Z" fill="#F2C870" stroke="#3A3026" stroke-width="1.8" stroke-linejoin="round"/>'+
  '<path d="M-20 14 L-26 26 M-20 14 L-14 26" stroke="#7A2A22" stroke-width="2.4" stroke-linecap="round"/><circle cx="-24" cy="28" r="5" fill="#5A5A5A" stroke="#3A3026" stroke-width="1.6"/>'+
  '<ellipse cx="-42" cy="2" rx="6" ry="8" fill="#F2C870" stroke="#3A3026" stroke-width="2"/>'+
  '<g class="tw-prop"><ellipse cx="-47" cy="2" rx="4" ry="24" fill="#C9A86A" stroke="#3A3026" stroke-width="1.8"/></g></svg>';

 /* ---------- geometría de la espiral ---------- */
 function zAt(a){return FH*a/360+ISLE+70}
 function proj(a,rot,lift,r){r=r||R;var t=(a-rot+45)*D2R,x=Math.cos(t)*r,y=Math.sin(t)*r,z=zAt(a)+(lift||0),b=P(x,y,z),ax=P(0,0,z),d=Math.cos((a-rot)*D2R),k=1+PF*d;
  return {x:ax[0]+(b[0]-ax[0])*k,y:ax[1]+(b[1]-ax[1])*k+d*8,d:d,k:k}}
 var LAY=["sh","ed","bp","tp","ro","ri","pl"],RIBS=LAY.map(function(l){return '<path class="tw-rib L-'+l+' k0" data-l="'+l+'" data-k="0"/><path class="tw-rib L-'+l+' k1" data-l="'+l+'" data-k="1"/>'}).join("");
 function angles(u,m){var o=[];for(var i=0;i<m;i++)o.push(u*360+(i+.5)*360/m);return o}
 /* ---------- el suelo: la isla de la carrera, igual a las del mapa (playa, acantilado, ladera y pasto de su área),
    tan grande que cubre lo de abajo de orilla a orilla; encima, el edificio de la carrera y los árboles y objetos de su bioma ---------- */
 var BIO={salud:"jardin",ing:"industria",tec:"vidrio",neg:"ciudad",arte:"barrio"};
 function ground(id,vx,vy,vw,vh){var c=byId[id]||{},bio=BIO[c.area]||"ciudad",M=ISOMAP,look=M.look(bio),E=ENV,sd=7;for(var i=0;i<id.length;i++)sd=(sd*31+id.charCodeAt(i))>>>0;
  function rnd(){sd=(sd*1664525+1013904223)>>>0;return sd/4294967296}
  var S2=Math.SQRT2,need=Math.max((vw/2)/S2*1.5+90,(vy+vh)*S2+120),rb=92,ph=rnd()*6;
  function rad(t,ex){var b=-(Math.cos(t)+Math.sin(t))/S2,s=Math.pow((1-b)/2,.75);return (rb+(need-rb)*s)*(1+.035*Math.sin(3*t+ph)+.025*Math.sin(7*t+ph*2))+(ex||0)}
  function ring(ex){var o=[];for(var k=0;k<72;k++){var t=k/72*Math.PI*2,r=rad(t,ex);o.push([Math.cos(t)*r,Math.sin(t)*r])}return o}
  var plat=ring(0),coast=ring(22),Z=8,h="";
  /* mar detrás de la isla: se desvanece hacia el cielo */
  var hzY=P(-rb*.71,-rb*.71,0)[1];
  h+='<defs><linearGradient id="twSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#43B0E4" stop-opacity="0"/><stop offset=".35" stop-color="#43B0E4" stop-opacity=".9"/><stop offset="1" stop-color="#2E9BD6"/></linearGradient>'+E.DEFS+'</defs>';
  h+='<rect x="'+f1(vx)+'" y="'+f1(hzY-150)+'" width="'+f1(vw)+'" height="'+f1(vy+vh-hzY+150)+'" fill="url(#twSea)"/>';
  var dc=M.closed(coast,-Z);
  h+='<path d="'+dc+'" fill="none" stroke="rgba(120,214,230,.35)" stroke-width="150" stroke-linejoin="round"/><path d="'+dc+'" fill="#7CD3E2" stroke="#7CD3E2" stroke-width="70" stroke-linejoin="round"/><path d="'+dc+'" fill="#A6E6EC" stroke="#A6E6EC" stroke-width="30" stroke-linejoin="round"/>';
  h+='<path class="tw-foam" d="'+dc+'" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="14 10" stroke-linecap="round" opacity=".75" transform="translate(0 6)"/>';
  h+='<path d="'+M.closed(coast,-Z,14)+'" fill="'+M.CLIFF+'"/><path d="'+dc+'" fill="'+M.SAND+'"/><path d="'+M.closed(coast,-Z,1.5)+'" fill="none" stroke="#FFF6DA" stroke-width="1.6" opacity=".8" transform="translate(0 -3)"/>';
  h+='<path d="'+M.closed(plat,-Z)+'" fill="'+look.side+'"/>';
  var dp=M.closed(plat,0);h+='<path d="'+dp+'" fill="'+look.grass+'"/><clipPath id="twPl"><path d="'+dp+'"/></clipPath><g clip-path="url(#twPl)">';
  function vis(x,y,m){var q=P(x,y,0);return q[0]>vx-m&&q[0]<vx+vw+m&&q[1]>vy-m&&q[1]<vy+vh+m}
  for(var k=0;k<60;k++){var a=rnd()*Math.PI*2,r=rnd()*need,x=Math.cos(a)*r,y=Math.sin(a)*r;if(!vis(x,y,60))continue;var t=rnd(),cc=t<.6?look.grass2:t<.85?"#D3B886":"#BDB6AA",rr=14+rnd()*26,q=P(x,y,0);
   h+='<ellipse cx="'+f1(q[0])+'" cy="'+f1(q[1])+'" rx="'+f1(rr*1.3)+'" ry="'+f1(rr*.62)+'" fill="'+cc+'" opacity="'+(t<.6?.8:.55)+'"/>'}
  h+='</g><path d="'+dp+'" fill="none" stroke="#C8F0A8" stroke-width="1.4" opacity=".7"/>';
  /* el edificio de la carrera, el mismo del mapa, a un lado de la espiral; luego árboles y objetos de su bioma */
  var objs=[],BX=150,BY=30;
  var bld=typeof ART!=="undefined"&&ART.has(id)?ART.get(id,2,null,{noPlat:true}):E.generic(bio,c.color||"#3F7DA6",7);
  if(bld){var bq=P(BX,BY,0);objs.push({k:BX+BY,s:'<g transform="translate('+f1(bq[0])+' '+f1(bq[1])+') scale(1.15)">'+bld+'</g>'})}
  var B=E.BIOME[bio]||E.BIOME.ciudad,placed=[[BX,BY,80],[0,0,108]],want=Math.round(vw*vh/9500);
  function inP(x,y,ex){var r=Math.hypot(x,y),t=Math.atan2(y,x);return r<rad(t,ex)}
  for(var tr=0;tr<600&&objs.length<want+1;tr++){var a2=rnd()*Math.PI*2,r2=Math.sqrt(rnd())*(need+20),x2=Math.cos(a2)*r2,y2=Math.sin(a2)*r2;
   if(!vis(x2,y2,30)||!inP(x2,y2,18))continue;var ok=true;placed.forEach(function(o){if(Math.hypot(o[0]-x2,o[1]-y2)<(o[2]||16))ok=false});if(!ok)continue;placed.push([x2,y2]);
   var top=inP(x2,y2,-6),kind;if(!top)kind=rnd()<.55?"palm":"rock";else{var u=rnd();kind=u<.62?(B.tree==="pine"?"treePine":B.tree==="palm"?(rnd()<.6?"palm":"treeRound"):"treeRound"):B.deco[Math.floor(rnd()*B.deco.length)]}
   var q2=P(x2,y2,top?0:-Z);objs.push({k:x2+y2,s:'<g transform="translate('+f1(q2[0])+' '+f1(q2[1])+')">'+E.one(kind,{d:2,k:/tree|palm/.test(kind)?.85:1,ph:rnd()*3,flip:rnd()<.5})+'</g>'})}
  objs.sort(function(a,b){return a.k-b.k});h+=objs.map(function(o){return o.s}).join("");
  return '<svg class="tw-ground" viewBox="'+f1(vx)+' '+f1(vy)+' '+f1(vw)+' '+f1(vh)+'" preserveAspectRatio="xMidYMin slice" aria-hidden="true">'+h+'</svg>'}
 function symZ(u){return zAt(u*360+180)-48}

 /* ---------- arma la escena ---------- */
 function build(o){
  var id=o.id,host=o.host,A=[];
  o.units.forEach(function(u,ui){var an=angles(ui,u.items.length);u.items.forEach(function(it,j){it.a=an[j];A.push(it)})});
  var nf=Math.max(1,Math.min(6,o.units.length)),a0=-(ISLE+70-12)*360/FH,a1=nf*360+20,xs=R*1.414*(1+PF)+40,ytop=-(zAt(a1)+150),ybot=150,Wd=xs*2,Hd=ybot-ytop;
  var vw=host.clientWidth||360,k=Math.max(.92,Math.min(1.6,(vw-12)/Wd)),Wp=Wd*k,Hp=Hd*k,padT=150,padB=150;
  var toPx=function(p){if(p.length)p={x:p[0],y:p[1]};return {x:(p.x+xs)*k,y:(p.y-ytop)*k}};
  /* la isla en el suelo: boceto que se vuelve isla a color con el avance de toda la carrera */
  var ic=toPx(P(0,0,0)),iw=Wp*1.02;
  var gW=host.clientWidth||(host.parentNode&&host.parentNode.clientWidth)||window.innerWidth||vw,SH2=Hp+padT+padB,gTop=Math.max(0,padT+ic.y-iw*.75),gx=gW/2-Wp/2+ic.x;
  var h='<div class="tw-scene" style="height:'+SH2+'px"><div class="tw-clouds" aria-hidden="true"><i></i><i></i><i></i><i></i></div>'+
   '<div class="tw-gwrap" style="top:'+f1(gTop)+'px">'+ground(id,(-gx)/k,ytop+(gTop-padT)/k,gW/k,(SH2-gTop)/k)+'</div>'+
   '<div class="tw-stage" style="width:'+Wp+'px;height:'+Hp+'px;top:'+padT+'px">'+
   '<svg class="tw-l tw-pb" viewBox="'+(-xs)+' '+ytop+' '+Wd+' '+Hd+'" aria-hidden="true">'+RIBS+'</svg>';
  var sw=230*k,sh=230*k;
  for(var f=0;f<nf;f++){var u=o.units[f]||{done:0},L2=u.items?u.items.filter(function(it){return it.lid}):[],p=L2.length?u.done/L2.length:0,c=toPx(P(0,0,symZ(f)));
   var im=symImg(id,f);
   h+='<div class="tw-sym tw-floor tw-3d'+(p>=1?" is-done":"")+'" data-k="'+symKey(id,f)+'" data-f="'+f+'" style="left:'+f1(c.x-sw/2)+'px;top:'+f1(c.y-sh*.72)+'px;width:'+f1(sw)+'px;height:'+f1(sh)+'px;animation-delay:-'+(f*.9)+'s">'+
    '<img class="tw-col" src="'+im+'" alt="" decoding="async"></div>';
   h+='<span class="tw-ul s-'+(u.state||"lock")+'" data-u="'+f+'">'+(f+1)+' · '+esc(u.t||"")+'</span>'}
  var stc=toPx(P(0,0,zAt(a1)+70));
  h+='<div class="tw-sym tw-starw" style="left:'+f1(stc.x-55*k)+'px;top:'+f1(stc.y-55*k)+'px;width:'+f1(110*k)+'px;height:'+f1(110*k)+'px"><svg viewBox="-50 -50 100 100" aria-hidden="true">'+star(o.mastered)+'</svg></div>';
  h+='<svg class="tw-l tw-pf" viewBox="'+(-xs)+' '+ytop+' '+Wd+' '+Hd+'" aria-hidden="true">'+RIBS+'</svg>';
  A.forEach(function(it){h+='<button type="button" class="rt3-n tw-n s-'+it.state+(it.chest!=null?" is-chest":"")+'" data-i="'+it.k2+'" aria-label="'+(it.lid?it.lid+" ":"")+esc(it.n)+(it.state==="done"?", hecha":it.state==="lock"?", todavía no":it.state==="soon"?", llega pronto":"")+'">'+o.nodeHTML(it)+'</button>'});
  h+='<div class="tw-globe" id="twGlobe" hidden></div><div class="tw-rb" id="lpRb"><div class="tw-ship">'+PLANE+'<div class="tw-pilot">'+o.rb+'</div></div></div></div></div>';
  host.innerHTML=h;
  var S={host:host,k:k,xs:xs,ytop:ytop,toPx:toPx,items:A,padT:padT,a0:a0,a1:a1,rb:host.querySelector("#lpRb"),ship:host.querySelector(".tw-ship"),sc:host.closest(".tw-wrap")||host.parentNode,
   ul:host.querySelectorAll(".tw-ul"),pb:host.querySelectorAll(".tw-pb path"),pf:host.querySelectorAll(".tw-pf path"),btn:{},cur:o.cur,rot:A[o.cur]?A[o.cur].a:0,base:Math.round(58*Math.min(1.2,k))};
  host.__S=S;setTimeout(function(){live3d(host)},60);
  /* al subir o bajar, la espiral gira: el tramo que queda a media pantalla siempre viene al frente */
  if(S.sc&&!S.sc.__twScroll){var tk=0;S.sc.__twScroll=1;S.sc.addEventListener("scroll",function(){var s2=S.sc.__S2||S;if(s2.raf||performance.now()<(s2.quiet||0)||tk)return;tk=requestAnimationFrame(function(){tk=0;var a=angleAtScroll(s2);if(a!=null&&Math.abs(a-s2.rot)>.3){s2.rot=a;render(s2)}})},{passive:true})}
  if(S.sc)S.sc.__S2=S;
  A.forEach(function(it){S.btn[it.k2]=host.querySelector('.tw-n[data-i="'+it.k2+'"]')});
  S.first=o.units.map(function(u){var it=u.items[0];return it?A.indexOf(it):null});
  var r=-1;A.forEach(function(it,j){if(it.done&&r===j-1)r=j});S.doneA=r<0?a0:A[r].a+(A[r+1]?(A[r+1].a-A[r].a)/2:0);
  S.lift=S.base*.62+26*k;render(S);return S}

 /* ---------- dibuja con el giro actual: camino (atrás y adelante), botones, etiquetas y Rumbo ---------- */
 function render(S,rbA,arc){
  /* el camino es una banda de nubes: cara de arriba blanca, orillas esponjadas que siguen la perspectiva, panza azulada y destellos */
  var rot=S.rot,st=4,HW=17,TH=9,sc0=S.sc?S.sc.scrollTop-S.padT:0,vh=S.sc?S.sc.clientHeight:900,pyMin=sc0-350,pyMax=sc0+vh+350,run=null,n=0,seg={b:{},f:{}};
  LAY.forEach(function(l){seg.b[l]=["",""];seg.f[l]=["",""]});
  function pt(q){return f1(q.x)+" "+f1(q.y)}
  function flush(){if(run&&run.c.length>1){var g=seg[run.side],k=run.kind,rim=run.side==="f"?run.o:run.i,rb=run.side==="f"?run.ob:run.ib;
    g.tp[k]+="M"+run.o.join("L")+"L"+run.i.slice().reverse().join("L")+"Z";g.ed[k]+="M"+rim.join("L")+"L"+rb.slice().reverse().join("L")+"Z";
    g.sh[k]+="M"+run.c.join("L");g.pl[k]+="M"+run.c.join("L");g.bp[k]+="M"+rb.join("L");g.ro[k]+="M"+run.o.join("L");g.ri[k]+="M"+run.i.join("L")}run=null}
  for(var a=S.a0;a<=S.a1+.1;a+=st,n++){var q=proj(a,rot),py=(q.y-S.ytop)*S.k;if(py<pyMin||py>pyMax){flush();continue}
   var side=q.d<0?"b":"f",kind=a<=S.doneA?1:0,key=side+kind,o=pt(proj(a,rot,0,R+HW)),i2=pt(proj(a,rot,0,R-HW)),ob=pt(proj(a,rot,-TH,R+HW)),ib=pt(proj(a,rot,-TH,R-HW)),c=pt(q);
   if(run&&run.key!==key){var last=run;flush();run={key:key,side:side,kind:kind,o:[last.o[last.o.length-1]],i:[last.i[last.i.length-1]],ob:[last.ob[last.ob.length-1]],ib:[last.ib[last.ib.length-1]],c:[last.c[last.c.length-1]],sm:""}}
   if(!run)run={key:key,side:side,kind:kind,o:[],i:[],ob:[],ib:[],c:[],sm:""};
   run.o.push(o);run.i.push(i2);run.ob.push(ob);run.ib.push(ib);run.c.push(c)}
  flush();
  [[S.pb,"b"],[S.pf,"f"]].forEach(function(x){for(var pi=0;pi<x[0].length;pi++){var e=x[0][pi];e.setAttribute("d",seg[x[1]][e.getAttribute("data-l")][e.getAttribute("data-k")])}});
  S.items.forEach(function(it){var b=S.btn[it.k2];if(!b)return;var q=proj(it.a,rot),p=S.toPx(q),sc=.8+.2*(q.d+1)/2,bz=it.chest!=null?S.base*1.15:S.base;
   it.px=p.x;it.py=p.y;it.sz=bz*sc;it.d=q.d;
   if(b.__bz!==bz){b.__bz=bz;b.style.width=b.style.height=bz+"px"}
   b.style.transform="translate("+f1(p.x-bz/2)+"px,"+f1(p.y-bz*.62)+"px) scale("+sc.toFixed(3)+")";
   var z=q.d<-.15?2:6;if(b.__z!==z){b.__z=z;b.style.zIndex=z;b.classList.toggle("is-back",z===2)}});
  for(var u=0;u<S.ul.length;u++){var e=S.ul[u],fi=S.first[u],q2=proj(fi!=null?S.items[fi].a:u*360,rot),p2=S.toPx(q2),bs=S.base*(.8+.2*(q2.d+1)/2);
   e.style.transform="translate(-50%,0) translate("+f1(p2.x)+"px,"+f1(p2.y+bs*.38+3)+"px)";
   var z3=q2.d<-.15?2:5;if(e.__z!==z3){e.__z=z3;e.style.zIndex=z3;e.style.opacity=z3===2?.45:1}
   var ly=p2.y+bs*.38+3,lw=(e.__w||(e.__w=e.offsetWidth||90))/2+4,hit=false;[fi-1,fi+1,fi+2].forEach(function(j){var o=S.items[j];if(!o||o.px==null)return;if(Math.abs(o.px-p2.x)<lw+o.sz/2&&ly+18>o.py-o.sz*.62&&ly<o.py+o.sz*.38)hit=true});
   if(e.__s!==!hit){e.__s=!hit;e.style.display=hit?"none":""}}
  var ra=rbA!=null?rbA:(S.items[S.cur]?S.items[S.cur].a:S.a1-10),rq=proj(ra,rot),rp=S.toPx(rq);
  S.rb.style.transform="translate("+f1(rp.x)+"px,"+f1(rp.y-S.lift-(arc||0))+"px)";S.rb.__d=rq.d;
  var z2=rq.d<-.15?2:7;if(S.rb.__z!==z2){S.rb.__z=z2;S.rb.style.zIndex=z2}
  if(S.onRender)S.onRender();return rp}
 function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}
 function anim(S,dur,step,done){var t0=null;if(typeof RM==="function"&&RM()){step(1,1);done&&done();return}
  function fr(ts){if(!t0)t0=ts;var t=Math.min(1,(ts-t0)/dur);step(ease(t),t);if(t<1)S.raf=requestAnimationFrame(fr);else{S.raf=0;S.quiet=performance.now()+260;done&&done()}}
  cancelAnimationFrame(S.raf);S.raf=requestAnimationFrame(fr)}
 function focus(S,i,done){var it=S.items[i];if(!it){done&&done();return}var r0=S.rot,r1=it.a;if(Math.abs(r1-r0)<.5){render(S);done&&done();return}
  anim(S,Math.min(900,300+Math.abs(r1-r0)*1.2),function(e){S.rot=r0+(r1-r0)*e;render(S);follow(S,it.py)},done)}
 function place(S,i){var it=S.items[i];if(!it)return;S.cur=i;S.rot=it.a;render(S)}
 /* la avioneta vuela a la siguiente lección: la espiral gira y sube con ella, así Rumbo siempre queda al frente */
 function fly(S,a0,a1,dur,bob,done){S.ship.classList.add("is-flying");
  anim(S,dur,function(e,t){var a=a0+(a1-a0)*e;S.rot=a;var p=render(S,a,Math.sin(Math.PI*t)*(bob||30)*S.k);follow(S,p.y)},function(){S.ship.classList.remove("is-flying");S.rot=a1;render(S);done&&done()})}
 function hop(S,i0,i1,done){var A=S.items,a0=A[i0]?A[i0].a:S.rot,a1=A[i1]?A[i1].a:S.a1;S.cur=i1;fly(S,a0,a1,Math.min(1300,600+Math.abs(a1-a0)*1.2),30,done)}
 function climbTop(S,i0,done){var a0=S.items[i0]?S.items[i0].a:S.rot;S.cur=-1;fly(S,a0,S.a1-10,1800,20,done)}
 function angleAtScroll(S){var sc=S.sc;if(!sc)return null;var yc=sc.scrollTop-S.padT+sc.clientHeight*.55,lo=S.a0,hi=S.a1;
  for(var n=0;n<22;n++){var m=(lo+hi)/2,y=S.toPx(proj(m,m)).y;if(y>yc)lo=m;else hi=m}return Math.max(S.a0,Math.min(S.a1,(lo+hi)/2))}
 function follow(S,y){var sc=S.sc;if(!sc)return;var want=y+S.padT-sc.clientHeight*.55;sc.scrollTop+=(want-sc.scrollTop)*.14}
 function scrollTo(S,y,smooth){var sc=S.sc;if(!sc)return;var t=Math.max(0,y+S.padT-sc.clientHeight*.58);if(smooth&&sc.scrollTo)sc.scrollTo({top:t,behavior:"smooth"});else sc.scrollTop=t}
 function pos(S,i){var it=S.items[i];return it?{x:it.px,y:it.py,sz:it.sz}:null}
 /* vista previa para #art: los seis símbolos de la carrera */
 function preview(id,p){var s="";for(var f=0;f<6;f++){var q=Math.max(0,Math.min(1,p*6-f)),im=symImg(id,f);s+='<div class="tw-3d tw-pv"><img class="tw-col" src="'+im+'" alt=""></div>'}return '<div class="tw-pvg">'+s+'</div>'}
 return {has:has,build:build,preview:preview,render:render,focus:focus,place:place,hop:hop,climbTop:climbTop,scrollTo:scrollTo,pos:pos,floorSVG:floorSVG,star:star,symbols:symbols};
})(ISO);
