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
 var SYM3D=null;function live3d(host){if(!window.WebGLRenderingContext)return;(SYM3D||(SYM3D=import("./vendor/3d/sym3d.js?v=__V3D__"))).then(function(m){m.mount(host)}).catch(function(){})}
 function symImg(id,k){if(typeof SIMB!=="undefined"&&SIMB.has(id)){var q=SIMB.six(id)[k];if(q)return "media/sym/"+q.id+"."+q.v+".webp"}return ""}
 function has(id){return !!byId[id]&&typeof ISO!=="undefined"}
 /* la cima: medalla de oro con rosa de los vientos (el rumbo), corona de laurel y listón del color de la carrera.
    Bloqueada se ve en piedra clara; al dominar la carrera se vuelve de oro y brilla */
 function star(on0,col){return '<g class="tw-star tw-medal'+(on0?" is-on":"")+'"><g class="m0">'+medal(false,col)+'</g><g class="m1">'+medal(true,col)+'</g></g>'}
 function medal(on,col){col=col||"#3F7DA6";var u="twm"+(on?1:0),G=on?["#FFF1B8","#F6C64E","#C98A1E"]:["#F6F1E6","#E3DACA","#B9AE97"],lf=on?["#7CC35A","#4E9A3A"]:["#D8D2C4","#BDB5A4"],rb=on?col:"#CFC6B4",rb2=on?I.shade(col,.25):"#B5AB97";
  var o='<defs><radialGradient id="'+u+'g" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="'+G[0]+'"/><stop offset=".55" stop-color="'+G[1]+'"/><stop offset="1" stop-color="'+G[2]+'"/></radialGradient></defs>';
  /* listón */
  o+='<path d="M-6 14L-20 44L-13 40L-9 48L2 18Z" fill="'+rb2+'"/><path d="M6 14L20 44L13 40L9 48L-2 18Z" fill="'+rb+'"/>';
  /* laurel: hojas a lo largo de dos arcos */
  for(var sd=-1;sd<=1;sd+=2)for(var k=0;k<7;k++){var a=Math.PI*(.5+.12+k*.105),x=sd*Math.cos(a)*-31,y=Math.sin(a)*31+2;
   o+='<ellipse cx="'+f1(x)+'" cy="'+f1(y)+'" rx="7.4" ry="3.4" fill="'+(k%2?lf[0]:lf[1])+'" transform="rotate('+f1(Math.atan2(y-2,x)*180/Math.PI+90+sd*38)+' '+f1(x)+' '+f1(y)+')"/>'}
  /* medalla con canto, aro interior y rosa de los vientos */
  o+='<circle cx="0" cy="3" r="25" fill="'+G[2]+'"/><circle cx="0" cy="0" r="25" fill="url(#'+u+'g)"/><circle cx="0" cy="0" r="19.5" fill="none" stroke="'+G[2]+'" stroke-width="1.6" opacity=".7"/>';
  o+='<path d="M0 -16L3.6 -3.6L16 0L3.6 3.6L0 16L-3.6 3.6L-16 0L-3.6 -3.6Z" fill="'+G[0]+'" stroke="'+G[2]+'" stroke-width="1" stroke-linejoin="round"/><path d="M0 -16L3.6 -3.6L0 0ZM16 0L3.6 3.6L0 0ZM0 16L-3.6 3.6L0 0ZM-16 0L-3.6 -3.6L0 0Z" fill="'+G[2]+'" opacity=".45"/>';
  o+='<path d="M-9 -9L-2 -2M9 -9L2 -2M9 9L2 2M-9 9L-2 2" stroke="'+G[2]+'" stroke-width="1.4" stroke-linecap="round" opacity=".6"/><circle cx="0" cy="0" r="2.4" fill="'+(on?rb:G[2])+'"/>';
  o+='<ellipse cx="-9" cy="-12" rx="7" ry="3.4" fill="#FFFFFF" opacity=".45" transform="rotate(-35 -9 -12)"/>';
  return o}

 /* ---------- la avioneta de Rumbo ---------- */
 /* avioneta 3D (tipo Ryan STA, ala baja y cabina abierta), mismo estilo que los símbolos; la hélice gira enfrente de la nariz */
 var PLANE='<img class="tw-plane" src="media/plane.webp" alt="" decoding="async">'+
  '<svg class="tw-propw" viewBox="-8 -30 16 60" aria-hidden="true"><g class="tw-prop"><ellipse rx="4" ry="27" fill="#C9A86A" fill-opacity=".85" stroke="#3A3026" stroke-width="1.6"/><ellipse rx="1.6" ry="24" fill="#8A6A3A" fill-opacity=".6"/></g></svg>';

 /* ---------- geometría de la espiral ---------- */
 function zAt(a){return FH*a/360+ISLE+70}
 function proj(a,rot,lift,r){r=r||R;var t=(a-rot+45)*D2R,x=Math.cos(t)*r,y=Math.sin(t)*r,z=zAt(a)+(lift||0),b=P(x,y,z),ax=P(0,0,z),d=Math.cos((a-rot)*D2R),k=1+PF*d;
  return {x:ax[0]+(b[0]-ax[0])*k,y:ax[1]+(b[1]-ax[1])*k+d*8,d:d,k:k}}
 var LAY=["pl"],RIBS=LAY.map(function(l){return '<path class="tw-rib L-'+l+' k0" data-l="'+l+'" data-k="0"/><path class="tw-rib L-'+l+' k1" data-l="'+l+'" data-k="1"/>'}).join("");
 function angles(u,m){var o=[];for(var i=0;i<m;i++)o.push(u*360+(i+.5)*360/m);return o}
 /* ---------- el suelo: la isla de la carrera, igual a las del mapa (playa, acantilado, ladera y pasto de su área),
    tan grande que cubre lo de abajo de orilla a orilla; encima, el edificio de la carrera y los árboles y objetos de su bioma ---------- */
 var BIO={salud:"jardin",ing:"industria",tec:"vidrio",neg:"ciudad",arte:"barrio"};
 function ground(id,vx,vy,vw,vh){var c=byId[id]||{},bio=BIO[c.area]||"ciudad",M=ISOMAP,look=typeof ISLAS3!=="undefined"&&ISLAS3.look?ISLAS3.look(c.area,bio):M.look(bio),E=ENV,sd=7;for(var i=0;i<id.length;i++)sd=(sd*31+id.charCodeAt(i))>>>0;
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
  /* el edificio de la carrera, el mismo del mapa, en el centro: la escalera de caracol arranca desde ahí; luego árboles y objetos de su bioma */
  var objs=[],BX=0,BY=0;
  /* el edificio va en su propia capa (bldHTML), entre las nubes de atrás y las de adelante */
  var B=E.BIOME[bio]||E.BIOME.ciudad,placed=[[0,0,112]],want=Math.round(vw*vh/9500);
  function inP(x,y,ex){var r=Math.hypot(x,y),t=Math.atan2(y,x);return r<rad(t,ex)}
  for(var tr=0;tr<600&&objs.length<want+1;tr++){var a2=rnd()*Math.PI*2,r2=Math.sqrt(rnd())*(need+20),x2=Math.cos(a2)*r2,y2=Math.sin(a2)*r2;
   if(!vis(x2,y2,30)||!inP(x2,y2,18))continue;var ok=true;placed.forEach(function(o){if(Math.hypot(o[0]-x2,o[1]-y2)<(o[2]||16))ok=false});if(!ok)continue;placed.push([x2,y2]);
   var top=inP(x2,y2,-6),kind;if(!top)kind=rnd()<.55?"palm":"rock";else{var u=rnd();kind=u<.62?(B.tree==="pine"?"treePine":B.tree==="palm"?(rnd()<.6?"palm":"treeRound"):"treeRound"):B.deco[Math.floor(rnd()*B.deco.length)]}
   var q2=P(x2,y2,top?0:-Z);objs.push({k:x2+y2,s:'<g transform="translate('+f1(q2[0])+' '+f1(q2[1])+')">'+E.one(kind,{d:2,k:/tree|palm/.test(kind)?.85:1,ph:rnd()*3,flip:rnd()<.5})+'</g>'})}
  objs.sort(function(a,b){return a.k-b.k});h+=objs.map(function(o){return o.s}).join("");
  return '<svg class="tw-ground" viewBox="'+f1(vx)+' '+f1(vy)+' '+f1(vw)+' '+f1(vh)+'" preserveAspectRatio="xMidYMin slice" aria-hidden="true">'+h+'</svg>'}
 /* el edificio de la carrera, el mismo del mapa, en el centro donde arranca la escalera: capa propia para que se note
    (las nubes de atrás pasan detrás de él y solo las de adelante lo cruzan); una luz suave en el piso lo destaca */
 function bldHTML(id,x,y,k){var c=byId[id]||{},bio=BIO[c.area]||"ciudad",E=ENV;
  var v3=typeof ART!=="undefined"&&ART.has3&&ART.has3(id),b=typeof ART!=="undefined"&&(ART.has(id)||v3)?ART.get(id,2,null,{noPlat:true,ver:v3?"v3":null}):E.generic(bio,c.color||"#3F7DA6",7);if(!b)return "";
  var sc=(2*k).toFixed(3);
  return '<svg class="tw-bld" style="left:'+f1(x)+'px;top:'+f1(y)+'px" width="1" height="1" aria-hidden="true"><defs>'+E.DEFS+'<radialGradient id="twBG"><stop offset="0" stop-color="#FFF3C4" stop-opacity=".75"/><stop offset="1" stop-color="#FFF3C4" stop-opacity="0"/></radialGradient></defs>'+
   '<ellipse cx="0" cy="'+f1(6*k)+'" rx="'+f1(150*k)+'" ry="'+f1(62*k)+'" fill="url(#twBG)"/><g transform="scale('+sc+')">'+b+'</g></svg>'}
 function symZ(u){return zAt(u*360+180)-48}

 /* ---------- nubes: bolitas con volumen (luz arriba a la izquierda, panza azulada, orilla suave) ---------- */
 function puffs(tint){var out=[],L=[[[64,68,48]],[[54,72,38],[80,68,34],[62,48,32]],[[72,72,40],[44,70,30],[62,46,34]],[[64,64,52]]];
  L.forEach(function(blobs,bi){var c=document.createElement("canvas");c.width=c.height=128;var g=c.getContext("2d");
   blobs.forEach(function(b){var r=g.createRadialGradient(b[0]-b[2]*.25,b[1]-b[2]*.3,b[2]*.1,b[0],b[1],b[2]);
    r.addColorStop(0,"rgba(255,255,255,1)");r.addColorStop(.6,"rgba(251,252,255,.97)");r.addColorStop(.84,"rgba(232,238,248,.75)");r.addColorStop(1,"rgba(220,228,242,0)");
    g.fillStyle=r;g.beginPath();g.arc(b[0],b[1],b[2],0,7);g.fill()});
   g.globalCompositeOperation="source-atop";
   var sh=g.createLinearGradient(0,40,0,124);if(bi===3){sh.addColorStop(0,"rgba(150,168,204,.35)");sh.addColorStop(1,"rgba(112,132,176,.8)")}else{sh.addColorStop(0,"rgba(160,178,212,0)");sh.addColorStop(.5,"rgba(160,178,212,.18)");sh.addColorStop(.78,"rgba(140,160,200,.5)");sh.addColorStop(1,"rgba(118,140,186,.8)")}g.fillStyle=sh;g.fillRect(0,0,128,128);
   var hl=g.createRadialGradient(46,38,2,46,38,40);hl.addColorStop(0,"rgba(255,250,236,.85)");hl.addColorStop(1,"rgba(255,250,236,0)");g.fillStyle=hl;g.fillRect(0,0,128,128);
   var rim=g.createLinearGradient(0,8,0,60);rim.addColorStop(0,"rgba(255,226,170,.55)");rim.addColorStop(1,"rgba(255,226,170,0)");g.fillStyle=rim;g.fillRect(0,0,128,128);
   if(tint){g.fillStyle=tint;g.globalAlpha=.34;g.fillRect(0,0,128,128);g.globalAlpha=1}
   out.push(c)});
  /* sombra suave debajo de la banda: se ve que flota */
  var c5=document.createElement("canvas");c5.width=c5.height=128;var g5=c5.getContext("2d"),r5=g5.createRadialGradient(64,64,4,64,64,62);r5.addColorStop(0,"rgba(52,74,128,.55)");r5.addColorStop(1,"rgba(52,74,128,0)");g5.fillStyle=r5;g5.fillRect(0,0,128,128);out.push(c5);
  return out}
 /* las mismas bolitas de nube del camino, como imágenes (para la nube de las puertas) */
 var PU=null;function puffURL(){if(!PU)try{PU=puffs(null).slice(0,4).map(function(c){return c.toDataURL("image/png")})}catch(e){PU=[]}return PU}
 function hsh(a,j){var x=Math.sin(a*12.9898+j*78.233)*43758.5453;return x-Math.floor(x)}
 /* dibuja la banda de nubes en dos lienzos del tamaño de la pantalla (atrás y adelante de los símbolos) */
 function clouds(S,rot,sc0,vh){var dpr=Math.min(1.25,window.devicePixelRatio||1),W=Math.round(S.Wp*dpr),top=sc0-140,H=Math.round((vh+280)*dpr),k=S.k,HW=17;
  [S.cb,S.cf].forEach(function(c){if(!c)return;if(c.width!==W||c.height!==H){c.width=W;c.height=H;c.style.width=S.Wp+"px";c.style.height=(vh+280)+"px"}c.style.transform="translateY("+f1(top)+"px)";c.getContext("2d").clearRect(0,0,W,H)});
  if(!S.cb||!S.cf)return;
  var P2=[],ymin=top-60,ymax=top+vh+340;
  for(var a=S.a0;a<=S.a1+.1;a+=8){var q=proj(a,rot),py=(q.y-S.ytop)*k;if(py<ymin||py>ymax)continue;var kind=a<=S.doneA?1:0,n=Math.round(a/8),fa=Math.min(1,.22+.78*Math.max(0,a-S.a0)/330);
   /* bultos grandes y de tamaños distintos: uno al centro y, alternando, uno por orilla; la base más plana y sombreada */
   for(var j=-1;j<=1;j++){if(j!==0&&(n+j+3)%2)continue;var hj=hsh(a,j),big=hj>.72?1.45:1,r=R+j*HW*.62+(hj-.5)*6,lf=(j===0?6:2)+hj*7*big,p=proj(a,rot,lf,r),sz=(HW*(j===0?1.85:1.5)+hj*10)*big*k*p.k;
    P2.push({x:(p.x+S.xs)*k,y:(p.y-S.ytop)*k-top,s:sz,d:q.d+j*.02*(q.d<0?-1:1)+lf*.001,b:q.d<0,v:Math.floor(hj*3)%3,t:kind,al:fa})}
   if(n%2===0){var ps=proj(a,rot,-20,R);P2.push({x:(ps.x+S.xs)*k,y:(ps.y-S.ytop)*k-top,s:HW*2.6*k*ps.k,d:q.d-.09,b:q.d<0,v:4,t:0,al:.32})}
   var hb=hsh(a,9),pb=proj(a,rot,-3,R+(hb-.5)*10);P2.push({x:(pb.x+S.xs)*k,y:(pb.y-S.ytop)*k-top,s:HW*2*k*pb.k,d:q.d-.04,b:q.d<0,v:3,t:kind,al:fa});
   if(n%3===0){var hw=hsh(a,5),pw=proj(a,rot,-6,R+(hw-.5)*22);P2.push({x:(pw.x+S.xs)*k,y:(pw.y-S.ytop)*k-top,s:HW*4*k*pw.k,d:q.d-.06,b:q.d<0,v:0,t:kind,al:.18})}}
  P2.sort(function(a,b){return a.d-b.d});
  var gb=S.cb.getContext("2d"),gf=S.cf.getContext("2d");
  for(var i=0;i<P2.length;i++){var o=P2[i],g=o.b?gb:gf,sp=(o.t?S.sprD:S.spr)[o.v];g.globalAlpha=o.al;g.drawImage(sp,(o.x-o.s/2)*dpr,(o.y-o.s*.55)*dpr,o.s*dpr,o.s*dpr)}
  gb.globalAlpha=gf.globalAlpha=1}
 /* Rumbo manejando: puños en el volante (dentro de su dibujo, entre el cuerpo y las manos) */
 var WHEEL='<g class="rk-wheel"><path d="M50 77V92" stroke="#3A3026" stroke-width="3.2" stroke-linecap="round"/><circle cx="50" cy="77" r="9.4" fill="none" stroke="#3A3026" stroke-width="4.6"/><circle cx="50" cy="77" r="9.4" fill="none" stroke="#5B4A3A" stroke-width="2.6"/>'+
  '<path d="M41 77H59M50 77V86" stroke="#5B4A3A" stroke-width="2" stroke-linecap="round"/><circle cx="50" cy="77" r="2.6" fill="#E3A845" stroke="#3A3026" stroke-width="1"/></g>';
 /* Rumbo en 3D en la cabina (se ve bien desde cualquier ángulo); si no hay WebGL, queda el dibujo plano de frente */
 var RB3D=null;function drive3d(host){var pl=host.querySelector(".tw-pilot");if(!pl||!window.WebGLRenderingContext||pl.__r3)return;pl.__r3=1;
  (RB3D||(RB3D=import("./vendor/3d/rumbo3d.js?v=__V3D__"))).then(function(m){var r=m.mount(pl,{px:150});if(r)pl.classList.add("is-3d")}).catch(function(){})}
 function drive(host){setTimeout(function(){drive3d(host)},120);var rb=host.querySelector(".tw-pilot .rb");if(!rb)return;rb.classList.add("drive");rb.classList.remove("float");rb.setAttribute("data-pose-l","puño");rb.setAttribute("data-pose-r","puño");
  var root=rb.querySelector(".rk-root"),hd=rb.querySelector(".rk-handL");if(root&&hd&&!root.querySelector(".rk-wheel")){var t=document.createElementNS("http://www.w3.org/2000/svg","g");t.innerHTML=WHEEL;root.insertBefore(t.firstChild,hd)}}
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
   '<canvas class="tw-cv tw-cb" aria-hidden="true"></canvas><svg class="tw-l tw-pb" viewBox="'+(-xs)+' '+ytop+' '+Wd+' '+Hd+'" aria-hidden="true">'+RIBS+'</svg>'+bldHTML(id,ic.x,ic.y,k);
  var sw=176*k,sh=176*k;
  for(var f=0;f<nf;f++){var u=o.units[f]||{done:0},L2=u.items?u.items.filter(function(it){return it.lid}):[],p=L2.length?u.done/L2.length:0,c=toPx(P(0,0,symZ(f)));
   var im=symImg(id,f);
   h+='<div class="tw-sym tw-floor tw-3d'+(p>=1?" is-done":"")+'" data-k="'+symKey(id,f)+'" data-f="'+f+'" style="left:'+f1(c.x-sw/2)+'px;top:'+f1(c.y-sh*.72)+'px;width:'+f1(sw)+'px;height:'+f1(sh)+'px;animation-delay:-'+(f*.9)+'s">'+
    '<img class="tw-col" src="'+im+'" alt="" decoding="async"></div>';
   h+='<span class="tw-ul s-'+(u.state||"lock")+'" data-u="'+f+'">'+(f+1)+' · '+esc(u.t||"")+'</span>'}
  /* una nube con puerta por unidad, pegada por fuera al camino a media unidad: gira, sube y baja con la espiral */
  if(o.door){var dw=Math.max(118,Math.min(150,Wp*.34));for(var f2=0;f2<nf;f2++)
   h+='<button type="button" class="tw-door s-'+o.door.state(id,f2)+'" data-c="'+id+'" data-u="'+f2+'" aria-label="'+esc(o.door.label(id,f2))+'" style="width:'+f1(dw)+'px">'+o.door.doorHTML(id,f2)+'</button>'}
  var stc=toPx(P(0,0,zAt(a1)+70));
  h+='<div class="tw-sym tw-starw" style="left:'+f1(stc.x-55*k)+'px;top:'+f1(stc.y-55*k)+'px;width:'+f1(110*k)+'px;height:'+f1(110*k)+'px"><svg viewBox="-50 -50 100 100" aria-hidden="true">'+star(o.mastered,(byId[id]||{}).color)+'</svg></div>';
  h+='<canvas class="tw-cv tw-cf" aria-hidden="true"></canvas><svg class="tw-l tw-pf" viewBox="'+(-xs)+' '+ytop+' '+Wd+' '+Hd+'" aria-hidden="true">'+RIBS+'</svg>';
  A.forEach(function(it){h+='<button type="button" class="rt3-n tw-n s-'+it.state+(it.chest!=null?" is-chest":"")+'" data-i="'+it.k2+'" aria-label="'+(it.lid?it.lid+" ":"")+esc(it.n)+(it.state==="done"?", hecha":it.state==="lock"?", todavía no":it.state==="soon"?", llega pronto":"")+'">'+o.nodeHTML(it)+'</button>'});
  h+='<div class="tw-globe" id="twGlobe" hidden></div><div class="tw-rb" id="lpRb"><div class="tw-ship">'+PLANE+
   /* Rumbo va sentado dentro de la cabina: una copia de la parte de enfrente del avión le tapa el cuerpo; bufanda al viento y líneas de velocidad */
   '<svg class="tw-scarf" viewBox="0 0 40 16" aria-hidden="true"><path d="M2 5 C12 2 20 9 30 5 L38 8 L30 10 C20 14 12 9 2 11 Z" fill="#F2A23A" stroke="#3A3026" stroke-width="1.4" stroke-linejoin="round"/></svg>'+
   '<div class="tw-pilot">'+o.rb+'</div><img class="tw-plane tw-plane-f" src="media/plane.webp" alt="" decoding="async"><div class="tw-wind" aria-hidden="true"><i></i><i></i><i></i></div></div></div></div></div>';
  host.innerHTML=h;
  var S={host:host,k:k,Wp:Wp,xs:xs,ytop:ytop,toPx:toPx,items:A,padT:padT,a0:a0,a1:a1,rb:host.querySelector("#lpRb"),ship:host.querySelector(".tw-ship"),sc:host.closest(".tw-wrap")||host.parentNode,
   ul:host.querySelectorAll(".tw-ul"),pb:host.querySelectorAll(".tw-pb path"),pf:host.querySelectorAll(".tw-pf path"),btn:{},cur:o.cur,rot:A[o.cur]?A[o.cur].a:0,base:Math.round(58*Math.min(1.2,k))};
  S.cb=host.querySelector(".tw-cb");S.cf=host.querySelector(".tw-cf");S.spr=puffs(null);S.sprD=puffs((byId[id]||{}).color||"#3F7DA6");host.__S=S;setTimeout(function(){live3d(host)},60);drive(host);
  /* al subir o bajar, la espiral gira: el tramo que queda a media pantalla siempre viene al frente */
  if(S.sc&&!S.sc.__twScroll){var tk=0;S.sc.__twScroll=1;S.sc.addEventListener("scroll",function(){var s2=S.sc.__S2||S;s2.stop=null;if(s2.raf||tk)return;tk=requestAnimationFrame(function(){tk=0;s2.stop=S.sc.scrollTop;if(performance.now()>=(s2.quiet||0)){var a=angleAtScroll(s2);if(a!=null)s2.rot=a}render(s2)})},{passive:true})}
  if(S.sc){S.sc.__S2=S;if(!S.sc.__rz){S.sc.__rz=1;window.addEventListener("resize",function(){var s3=S.sc.__S2;if(s3){s3.vh=0;s3.vw2=0}})}}
  A.forEach(function(it){S.btn[it.k2]=host.querySelector('.tw-n[data-i="'+it.k2+'"]')});
  S.doors=[];each(host.querySelectorAll(".tw-door"),function(b){var u=+b.getAttribute("data-u");S.doors.push({el:b,a:u*360+180,w:parseFloat(b.style.width)||110})});
  S.first=o.units.map(function(u){var it=u.items[0];return it?A.indexOf(it):null});
  var r=-1;A.forEach(function(it,j){if(it.done&&r===j-1)r=j});S.doneA=r<0?a0:A[r].a+(A[r+1]?(A[r+1].a-A[r].a)/2:0);
  S.lift=S.base*.62+26*k;render(S);return S}

 /* ---------- dibuja con el giro actual: camino (atrás y adelante), botones, etiquetas y Rumbo ---------- */
 function render(S,rbA,arc){
  /* el camino es una banda de nubes (lienzos) con destellos que viajan por el centro (svg) */
  var rot=S.rot,sc0=S.sc?(S.stop!=null?S.stop:S.sc.scrollTop)-S.padT:0,vh=S.vh||(S.vh=S.sc?S.sc.clientHeight:900),pyMin=sc0-350,pyMax=sc0+vh+350,run=null,seg={b:{pl:["",""]},f:{pl:["",""]}};
  /* la banda de nubes es lo más caro de pintar: mientras se mueve se repinta a lo más 20 veces por segundo, y al detenerse una vez más */
  var nw=performance.now();if(nw-(S.clT||0)>48){S.clT=nw;clouds(S,rot,sc0,vh)}clearTimeout(S.clTm);S.clTm=setTimeout(function(){S.clT=0;clouds(S,S.rot,S.sc?S.sc.scrollTop-S.padT:0,S.vh||vh)},90);
  for(var a=S.a0;a<=S.a1+.1;a+=5){var q=proj(a,rot,6),py=(q.y-S.ytop)*S.k;if(py<pyMin||py>pyMax){run=null;continue}
   var side=q.d<0?"b":"f",kind=a<=S.doneA?1:0,key=side+kind,c=f1(q.x)+" "+f1(q.y);
   if(run&&run.key===key)seg[side].pl[kind]+="L"+c;else{seg[side].pl[kind]+=(run?"M"+run.c+"L":"M")+c}run={key:key,c:c}}
  [[S.pb,"b"],[S.pf,"f"]].forEach(function(x){for(var pi=0;pi<x[0].length;pi++){var e=x[0][pi];e.setAttribute("d",seg[x[1]][e.getAttribute("data-l")][e.getAttribute("data-k")])}});
  S.items.forEach(function(it){var b=S.btn[it.k2];if(!b)return;var q=proj(it.a,rot),p=S.toPx(q),sc=.8+.2*(q.d+1)/2,bz=it.chest!=null?S.base*1.15:S.base;
   it.px=p.x;it.py=p.y;it.sz=bz*sc;it.d=q.d;
   if(b.__bz!==bz){b.__bz=bz;b.style.width=b.style.height=bz+"px"}
   b.style.transform="translate("+f1(p.x-bz/2)+"px,"+f1(p.y-bz*.62)+"px) scale("+sc.toFixed(3)+")";
   var z=q.d<-.15?2:6;if(b.__z!==z){b.__z=z;b.style.zIndex=z;b.classList.toggle("is-back",z===2)}});
  (S.doors||[]).forEach(function(o){var q=proj(o.a,rot,4,R+46),p=S.toPx(q),sc=.84+.16*(q.d+1)/2,back=q.d<-.2,b=o.el,hw=o.w*sc/2,vw2=S.vw2||(S.vw2=(S.sc&&S.sc.clientWidth)||S.Wp),ox=(S.Wp-vw2)/2,px=Math.max(ox+hw+4,Math.min(ox+vw2-hw-4,p.x));
   b.style.transform="translate("+f1(px-o.w/2)+"px,"+f1(p.y-o.w*.78)+"px) scale("+sc.toFixed(3)+")";
   if(b.__bk!==back){b.__bk=back;b.style.zIndex=back?2:5;b.classList.toggle("is-back",back)}});
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
 function fly(S,a0,a1,dur,bob,done){S.ship.classList.add("is-flying");var prb=S.ship.querySelector(".rb");if(prb)prb.classList.add("fast");
  anim(S,dur,function(e,t){var a=a0+(a1-a0)*e;S.rot=a;var p=render(S,a,Math.sin(Math.PI*t)*(bob||30)*S.k);follow(S,p.y)},function(){S.ship.classList.remove("is-flying");var prb=S.ship.querySelector(".rb");if(prb)prb.classList.remove("fast");S.rot=a1;render(S);done&&done()})}
 function hop(S,i0,i1,done){var A=S.items,a0=A[i0]?A[i0].a:S.rot,a1=A[i1]?A[i1].a:S.a1;S.cur=i1;fly(S,a0,a1,Math.min(1300,600+Math.abs(a1-a0)*1.2),30,done)}
 function climbTop(S,i0,done){var a0=S.items[i0]?S.items[i0].a:S.rot;S.cur=-1;fly(S,a0,S.a1-10,1800,20,done)}
 function angleAtScroll(S){var sc=S.sc;if(!sc)return null;var yc=sc.scrollTop-S.padT+sc.clientHeight*.55,lo=S.a0,hi=S.a1;
  for(var n=0;n<22;n++){var m=(lo+hi)/2,y=S.toPx(proj(m,m)).y;if(y>yc)lo=m;else hi=m}return Math.max(S.a0,Math.min(S.a1,(lo+hi)/2))}
 function follow(S,y){var sc=S.sc;if(!sc)return;var want=y+S.padT-sc.clientHeight*.55;var nt=(S.stop!=null?S.stop:sc.scrollTop);nt+=(want-nt)*.14;sc.scrollTop=nt;S.stop=nt}
 function scrollTo(S,y,smooth){var sc=S.sc;if(!sc)return;var t=Math.max(0,y+S.padT-sc.clientHeight*.58);if(smooth&&sc.scrollTo)sc.scrollTo({top:t,behavior:"smooth"});else{sc.scrollTop=t;S.stop=t}}
 /* trae al frente la puerta de una unidad: la espiral gira hasta ella y la pantalla baja o sube a su altura */
 function doorFocus(S,u,done){var o=(S.doors||[])[u];if(!o){done&&done();return}var r0=S.rot,r1=o.a;
  anim(S,Math.min(1100,350+Math.abs(r1-r0)*1.1),function(e){S.rot=r0+(r1-r0)*e;render(S);var q=proj(o.a,S.rot,4,R+46);follow(S,S.toPx(q).y-30)},function(){render(S);done&&done(o.el)})}
 function pos(S,i){var it=S.items[i];return it?{x:it.px,y:it.py,sz:it.sz}:null}
 /* vista previa para #art: los seis símbolos de la carrera */
 function preview(id,p){var s="";for(var f=0;f<6;f++){var q=Math.max(0,Math.min(1,p*6-f)),im=symImg(id,f);s+='<div class="tw-3d tw-pv"><img class="tw-col" src="'+im+'" alt=""></div>'}return '<div class="tw-pvg">'+s+'</div>'}
 return {has:has,build:build,preview:preview,render:render,focus:focus,place:place,hop:hop,climbTop:climbTop,scrollTo:scrollTo,pos:pos,doorFocus:doorFocus,puffURL:puffURL,floorSVG:floorSVG,star:star,symbols:symbols};
})(ISO);
