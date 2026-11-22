/* ================= página interna #art =================
   Comparación estructura contra emblema por carrera (con elección guardada), fila a 64 px sobre la noche,
   escenas de prueba, entorno antes y después con silueta, y el mapa generado. */
/* una carrera sola en su isla, con la misma mancha y los mismos recortes que el mapa de la app */
function inkStrip(c){
 var ar=ISOFIX.AREAS.filter(function(a){return a.id===c.area}),W=MAPGEN.build([c],ar.length?ar:ISOFIX.AREAS),R=ISOMAP.render(W,{app:true,amb:true,detail:2}),n=W.nodes[0],L=W.islands[0],P=ISO.P;
 var cb=P(n.x,n.y,42),Rz=150;L.coast.forEach(function(q){var sp=P(q[0],q[1],0);Rz=Math.max(Rz,Math.hypot((sp[0]-cb[0])/1.3,(sp[1]+16-cb[1])/.85)+36)});
 var xs=[],ys=[];L.coast.forEach(function(q){var sp=P(q[0],q[1],0);xs.push(sp[0]);ys.push(sp[1])});
 var x0=Math.min.apply(null,xs)-14,x1=Math.max.apply(null,xs)+14,y0=Math.min.apply(null,ys)-130,y1=Math.max.apply(null,ys)+28;
 var cp0=xs.map(function(x,i){return x.toFixed(1)+" "+ys[i].toFixed(1)}).join(" "),cp1=xs.map(function(x,i){return x.toFixed(1)+" "+(ys[i]+15).toFixed(1)}).join(" ");
 var wr=rng(hash(c.id+"w")),w1=wr()*6.283,w2=wr()*6.283,w3=wr()*6.283,big=Rz*6,outer="M"+(cb[0]-big).toFixed(0)+" "+(cb[1]-big).toFixed(0)+"h"+(2*big).toFixed(0)+"v"+(2*big).toFixed(0)+"h-"+(2*big).toFixed(0)+"Z";
 function blob(rad){var d="";for(var i=0;i<48;i++){var a=i/48*6.283,m=rad*(1+.1*Math.sin(a*3+w1)+.07*Math.sin(a*5+w2)+.045*Math.sin(a*9+w3));d+=(i?"L":"M")+(cb[0]+Math.cos(a)*m*1.3).toFixed(1)+" "+(cb[1]+Math.sin(a)*m*.85).toFixed(1)}return d+"Z"}
 return [0,.25,.5,.75,1].map(function(p,i){
  var b=p>0&&p<1?blob((.12+.88*p)*Rz):"",sfx="-"+c.id+"-"+i;
  var body='<defs>'+R.parts.defs+'<clipPath id="skc-'+c.id+'"><path clip-rule="evenodd" d="'+(p>=1?"M0 0":outer+b)+'"/></clipPath><clipPath id="isl'+sfx+'"><polygon points="'+cp0+'"/><polygon points="'+cp1+'"/></clipPath><clipPath id="col-'+c.id+'"><path d="'+(p<=0?"M0 0":p>=1?outer:b)+'"/></clipPath></defs>'+
   '<g class="m-land">'+R.parts.land+'</g><g class="m-roads">'+R.parts.roads+'</g><g clip-path="url(#skc-'+c.id+')"><use href="#skl-'+L.id+'"/><use href="#skroads"/></g>'+(b?'<g clip-path="url(#isl'+sfx+')"><path class="t-ring" fill="none" d="'+b+'"/></g>':'')+'<g class="m-objs">'+R.parts.objs+'</g>';
  body=body.split("skc-"+c.id).join("skc"+sfx).split("col-"+c.id).join("col"+sfx).split("skl-"+L.id).join("skl"+sfx).split("skroads").join("skroads"+sfx);
  return '<figure data-p="'+p+'"><svg class="gm isow" viewBox="'+[x0,y0,x1-x0,y1-y0].map(function(v){return v.toFixed(0)}).join(" ")+'" aria-hidden="true">'+body+'</svg><figcaption>'+Math.round(p*100)+' %</figcaption></figure>'}).join("")}
function renderArt(){
 var old=document.getElementById("art");if(old)old.remove();
 document.documentElement.classList.add("art-on");
 var E=ENV,h="",VB="-72 -110 144 160",NAMES={medicina:"Medicina",derecho:"Derecho",computacion:"Computación",cine:"Cine",arquitectura:"Arquitectura",veterinaria:"Veterinaria",datos:"Ciencia de datos",nutricion:"Nutrición"};
 var DESC={
  medicina:["Hospital de tres cuerpos con cruz, helipuerto y ambulancia","Botiquín gigante con un estetoscopio enrollado"],
  derecho:["Juzgado con columnas, escalinata y la estatua de la justicia","Balanza gigante, mazo de juez y libro de leyes"],
  computacion:["Oficinas con fachada-pantalla de código y servidores","Computadora de escritorio con teclado y torre con luces"],
  cine:["Cine con marquesina iluminada, alfombra y reflectores","Cámara clásica en trípode con rollos, claqueta y reflector"],
  arquitectura:["Estudio con ventanal y maqueta en la entrada","Maqueta a medio construir sobre un plano, compás y regla"],
  veterinaria:["Clínica con letrero de huella, casita y perro esperando","Perro gigante sentado con collar, estetoscopio y plato"],
  datos:["Torre de oficinas con cartelera de gráfica en el techo","Gráfica de barras gigante con tendencia y lupa"]};
 var DESC2={
  cine:["Cine clásico con letrero vertical CINE, marquesina con focos, carteles, taquilla y alfombra con postes","Cámara de dos rollos con parasol, trípode de tres patas, claqueta abierta y reflector con viseras"],
  arquitectura:["Estudio de autor: planta de vidrio, volumen en voladizo con techo inclinado y celosía; maqueta en pedestal","Casa a medio construir (muros y entramado) sobre el plano; compás de pie aparte, regla y lápiz"],
  veterinaria:["Clínica con techo a dos aguas, letrero de huella enmarcado, marquesina, casita y perro","Perro gigante sentado con collar, placa y estetoscopio; plato con hueso y huellas"],
  datos:["Torre de vidrio con cartelera de barras y tendencia, tótem con gráfica de pastel","Barras 3D con placa de ejes y tendencia que nace de la primera barra; lupa al frente sin tocarlas; pastel"],
  nutricion:["Puesto de mercado con toldo de rayas, fruta y báscula en el mostrador, pizarrón, cajas y huerto","Manzana gigante partida (corazón y semillas), la otra mitad, canasta de verduras y báscula"]};
 function svg(inner,px,cls){return '<svg class="'+(cls||"")+'" viewBox="'+VB+'" style="height:'+px+'px" aria-hidden="true">'+inner+'</svg>'}
 h+='<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>'+E.DEFS+'</defs></svg>';
 h+='<header class="ia-h"><h1>Ilustración del mapa</h1><p>Elige para cada carrera la versión que más te guste: la <b>estructura</b> (el lugar donde se ejerce) o el <b>emblema</b> (su objeto a escala gigante). Tu elección se guarda en este dispositivo y el mapa de abajo la usa. Si no eliges, se usa la estructura. Donde hay versión 2, puedes volver a la versión 1 con el selector de cada tarjeta; si no eliges, se usa la versión 2.</p></header>';
 /* ---------- símbolos de las carreras: seis por carrera, uno por unidad ---------- */
 if(typeof SIMB!=="undefined"){var AR=[["salud","Salud"],["ing","Ingenierías"],["tec","Tecnología y ciencias"],["neg","Negocios y sociedad"],["arte","Arte y comunicación"]];
  h+='<section id="iaSimb"><h2>Símbolos de las carreras</h2><p class="ia-n">Seis por carrera, uno por unidad de su espiral, en 3D con sus colores y materiales reales. Cada fila: a 64 px en fondo claro y oscuro, y a 32 px.</p>';
  AR.forEach(function(a){var L=SIMB.list().filter(function(c){return c.area===a[0]});if(!L.length)return;
   h+='<h3 class="sy-area" style="--ac:'+SIMB.AREAC[a[0]]+'">'+a[1]+'</h3><div class="sy-grid">';
   L.forEach(function(c){var r=function(sz){var o="";for(var k=0;k<6;k++)o+=SIMB.unit(c.id,k,sz);return o};
    h+='<div class="sy-car"><b>'+esc(c.name)+'</b><div class="sy-row is-light">'+r(64)+'</div><div class="sy-row is-dark">'+r(64)+'</div><div class="sy-row is-light is-small">'+r(32)+'</div></div>'});
   h+='</div>'});
  h+='</section>'}
 /* ---------- comparación por carrera ---------- */
 if(typeof TORRE!=="undefined"){h+='<section><h2>Torre de la carrera</h2><p class="ia-n">Cada carrera tiene su torre: su edificio abajo, sus piezas en los pisos de en medio y su emblema arriba; lo que falte se completa con objetos de su área. Derecho tiene la suya hecha a mano. En boceto, a medio pintar y terminada.</p>'+["derecho","medicina","arquitectura"].map(function(id){return '<h3 class="ia-n">'+esc(byId[id].name)+'</h3><div class="tw-prevs">'+[[0,'En boceto'],[.5,'A medio pintar'],[1,'Terminada']].map(function(x){return '<figure>'+TORRE.preview(id,x[0])+'<figcaption>'+x[1]+'</figcaption></figure>'}).join('')+'</div>'}).join('')+'</section>'}
 h+='<section><h2>Estructura o emblema</h2><div class="ia-cards">';
 function cardBody(id,vv){var cur=ART.pick(id),D=(vv==="v2"&&DESC2[id])||DESC[id]||["",""],o="";
  [["s","Estructura"],["e","Emblema"]].forEach(function(v,i){var q={ver:vv};
   o+='<div class="ia-opt'+(cur===v[0]?' on':'')+'" data-v="'+v[0]+'"><div class="ia-big">'+svg(ART.get(id,2,v[0],q),230)+'</div><p class="ia-d">'+D[i]+'</p>'+
    '<div class="ia-small is-night"><div>'+svg(ART.get(id,1,v[0],q),96)+'<span>96 px</span></div><div>'+svg(ART.get(id,0,v[0],q),64)+'<span>64 px</span></div><div class="ia-sil">'+svg(ART.get(id,2,v[0],{noPlat:true,ver:vv}),64)+'<span>silueta</span></div></div>'+
    '<button type="button" class="ia-pick" aria-pressed="'+(cur===v[0])+'">'+(cur===v[0]?'Elegida: ':'Elegir ')+v[1].toLowerCase()+'</button></div>'});
  return o}
 ART.ids.forEach(function(id){var vv=ART.ver(id),two=ART.hasV2(id)&&ART.hasV1(id);
  h+='<article class="ia-card" data-id="'+id+'"><h3>'+NAMES[id]+(ART.hasV2(id)?' <small class="ia-new">v2</small>':'')+'</h3>';
  if(two)h+='<div class="ia-ver" role="radiogroup" aria-label="Versión de '+NAMES[id]+'">'+["v1","v2"].map(function(x){return '<button type="button" role="radio" data-vv="'+x+'" aria-checked="'+(x===vv)+'">'+(x==="v1"?"Versión 1 (anterior)":"Versión 2 (nueva)")+'</button>'}).join("")+'</div>';
  h+='<div class="ia-vs">'+cardBody(id,vv)+'</div></article>'});
 h+='</div></section>';
 /* ---------- Rumbo ---------- */
 function rbBox(px,html,cls){return '<div class="ia-rb '+(cls||"")+'" style="width:'+px+'px;height:'+px+'px">'+html+'</div>'}
 h+='<section><h2>Rumbo</h2><p class="ia-n">Mismo personaje, nueva construcción: esfera con volumen, continentes que siguen la curva, gorro que envuelve la cabeza con solapas y sombra, gafas con marco y reflejo, flecha que nace de un anillo y piernas que tocan el suelo.</p>'+
  '<div class="ia-rbrow"><figure>'+rbBox(200,'<div class="rb float" data-mood="idle">'+rumboSVGOld()+'</div>')+'<figcaption>Original</figcaption></figure><figure>'+rbBox(200,'<div class="rb float" data-mood="idle">'+rumboSVGv2()+'</div>')+'<figcaption>Intento anterior</figcaption></figure><figure>'+rbBox(200,rumboEl())+'<figcaption>Ahora</figcaption></figure><figure>'+rbBox(200,'<div class="rb" data-mood="idle">'+rumboSVG()+'</div>','ia-sil')+'<figcaption>Silueta</figcaption></figure></div>'+
  '<h3>Tamaños</h3><div class="ia-rbrow ia-rbsizes">'+[48,96,200].map(function(px){return '<figure>'+rbBox(px,rumboEl())+'<figcaption>'+px+' px</figcaption></figure>'}).join("")+'<figure class="is-night" style="padding:10px;border-radius:14px">'+rbBox(96,rumboEl())+'<figcaption>96 px, noche</figcaption></figure></div>'+
  '<h3>Expresiones</h3><div class="ia-rbrow ia-rbmoods">'+[["idle","Tranquilo"],["happy","Contento"],["think","Pensando"],["meh","Más o menos"],["no","No le gustó"],["sad","Triste"],["talk","Hablando"]].map(function(m){return '<figure>'+rbBox(120,rumboEl().replace('data-mood="idle"','data-mood="'+m[0]+'"'))+'<figcaption>'+m[1]+'</figcaption></figure>'}).join("")+'</div>'+
  '<h3>En movimiento</h3><div class="ia-rbrow">'+[["walk","Caminando"],["cheer","Celebrando"]].map(function(m){return '<figure>'+rbBox(140,rumboEl(m[0]))+'<figcaption>'+m[1]+'</figcaption></figure>'}).join("")+'<figure>'+rbBox(140,rumboEl())+'<figcaption><button type="button" class="ia-pick ia-jump">Saltar</button></figcaption></figure></div></section>';
 /* ---------- pantallas de inicio y carga ---------- */
 h+='<section><h2>Pantallas de inicio y de carga</h2><p class="ia-n">Antes y después, en celular, iPad y computadora. La isla es isométrica con grosor, arena y espuma; las montañas tienen lado iluminado y lado en sombra; el globo de diálogo apunta a la boca de Rumbo.</p>';
 [["inicio","Inicio"],["carga","Carga"]].forEach(function(sc){h+='<h3>'+sc[1]+'</h3><div class="ia-shots">';
  [["celular","Celular"],["ipad","iPad"],["computadora","Computadora"],["celular-oscuro","Celular, modo oscuro"]].forEach(function(d){h+='<figure><div class="ia-ba"><img src="media/arte/antes-'+sc[0]+'-'+d[0]+'.webp" alt="Antes: '+sc[1]+' en '+d[1]+'"><img src="media/arte/despues-'+sc[0]+'-'+d[0]+'.webp" alt="Después: '+sc[1]+' en '+d[1]+'"></div><figcaption>'+d[1]+' · antes | después</figcaption></figure>'});
  h+='</div>'});
 h+='</section>';
 /* ---------- todas a 64 px ---------- */
 h+='<section><h2>Todas juntas a 64 px, de noche</h2><p class="ia-n">Para comprobar que se distinguen entre sí a como se verán muchas veces en el celular.</p>';
 [["s","Estructuras"],["e","Emblemas"]].forEach(function(v){h+='<h3>'+v[1]+'</h3><div class="ia-row64 is-night">'+ART.ids.map(function(id){return '<div>'+svg(ART.get(id,0,v[0]),64)+'<span>'+NAMES[id]+'</span></div>'}).join("")+'</div>'});
 h+='</section>';
 /* ---------- escenas de prueba ---------- */
 h+='<section><h2>La misma isla con cada estilo</h2><p class="ia-n">Las siete carreras con árboles, pinos, palmeras, arbustos, banca, farol, ballena y delfines. Arriba a 600 × 400; abajo, como se ve en un celular de 390 × 844 con el presupuesto de decoración del celular.</p><div class="ia-scenes">'+
  '<figure><div class="ia-scene" id="scS"></div><figcaption>Solo estructuras</figcaption></figure><figure><div class="ia-scene" id="scE"></div><figcaption>Solo emblemas</figcaption></figure></div>'+
  '<div class="ia-phones"><figure><div class="ia-phone"><div class="ia-phone-in" id="phS"></div></div><figcaption>Celular · estructuras</figcaption></figure><figure><div class="ia-phone"><div class="ia-phone-in" id="phE"></div></div><figcaption>Celular · emblemas</figcaption></figure></div></section>';
 /* ---------- entorno antes y después ---------- */
 var ENVL=[["Árbol redondo","treeRound","-20 -42 44 46",function(){return ENV0.treeRound(1.6)}],["Pino","treePine","-16 -42 34 46",function(){return ENV0.treePine(1.6)}],["Palmera","palm","-20 -44 46 48",function(){return ENV0.palm(1.5)}],["Arbusto","bush","-14 -16 32 20",function(){return ENV0.bush(1.8)}],["Flores","flowers","-9 -11 18 13",function(){return ENV0.flowers()}],["Roca","rock","-11 -10 24 13",function(){return ENV0.rock(2)}],["Banca","bench","-11 -12 28 22",function(){return ENV0.bench()}],["Farol","lamp","-6 -28 14 32",function(){return ENV0.lamp()}],["Señal","signpost","-12 -26 26 30",function(){return ENV0.signpost()}],["Caja","crate","-6 -10 14 14",function(){return ENV0.crate()}],["Cono","cone","-5 -10 11 13",function(){return ENV0.cone()}],["Muelle","pier","-6 -30 60 48",function(){return ENV0.pier(40)}],["Faro","lighthouse","-36 -56 80 70",function(){return ENV0.lighthouse()}],["Velero","sailboat","-26 -36 56 50",function(){return ENV0.sailboat()}],["Transbordador","ferry","-30 -26 66 46",function(){return ENV0.ferry()}],["Ballena","whale","-46 -34 76 48",function(){return ENV0.whale()}],["Delfines","dolphins","-24 -30 56 42",function(){return ENV0.dolphin()}],["Nube","cloud","-26 -22 52 26",function(){return ENV0.cloud(1.4)}],["Rosa de los vientos","compass","-36 -22 72 44",function(){return ENV0.compass()}]];
 h+='<section><h2>Entorno: antes y después</h2><p class="ia-n">Cada pieza nueva parte de una sola silueta; la sombra y la luz se pintan dentro de ella. A la derecha, su silueta en negro y su versión a 96 px de noche.</p><div class="ia-env-list">';
 ENVL.forEach(function(p){var nw=E[p[1]]({});var vb=p[2],sv=function(x,px,c){return '<svg class="'+(c||"")+'" viewBox="'+vb+'" style="height:'+px+'px" aria-hidden="true">'+x+'</svg>'};
  h+='<div class="ia-envrow"><h3>'+p[0]+'</h3><div class="ia-envc"><div class="old">'+sv(p[3](),110)+'<span>Antes</span></div><div>'+sv(nw,110)+'<span>Ahora</span></div><div class="ia-sil">'+sv(nw,110)+'<span>Silueta</span></div><div class="is-night">'+sv(E[p[1]]({d:1}),96)+'<span>96 px</span></div></div></div>'});
 h+='</div></section>';
 /* ---------- boceto y acuarela: cada carrera a 0, 25, 50, 75 y 100 % ---------- */
 h+='<section><h2>Boceto y acuarela por avance</h2><p class="ia-n">Cada carrera en su isla, a 0, 25, 50, 75 y 100 % de avance. A 0 % todo su territorio es boceto (suelo, ladera, caminos, edificio y vegetación); el color sale del edificio con una sola mancha que recorta todas las piezas a la vez.</p><div class="ia-ink" id="iaInk"></div></section>';
 /* ---------- mapa generado ---------- */
 h+='<section><h2>Mapa generado desde el catálogo</h2><p class="ia-n">Usa tus elecciones. Lejos: islas y áreas. Medio: carreras simplificadas con nombre corto. Cerca: todo el detalle y nombres completos.</p>'+
  '<div class="ia-ctl"><div class="ia-seg" role="group" aria-label="Cantidad de carreras"><button type="button" data-n="20" aria-pressed="true">20 carreras</button><button type="button" data-n="50">50</button><button type="button" data-n="120">120</button></div><div class="ia-seg" role="group" aria-label="Zoom"><button type="button" data-z="fit">Lejos</button><button type="button" data-z=".45">Medio</button><button type="button" data-z=".9">Cerca</button></div><button type="button" class="ia-night" aria-pressed="false">Noche</button></div>'+
  '<div class="ia-map" id="iaMap"></div><p class="ia-n" id="iaStat"></p></section>';
 /* Rumbo habla: explicación animada de Medicina, sus formas de boca y el componente de video vacío */
 var GU=(CAT.guiones||{}).medicina;
 h+='<section class="ia-sec" id="artVoz"><h2>Rumbo habla</h2><p>Explicación animada narrada por Rumbo (guion en datos/guiones/medicina.json). Toca ▶ para escuchar; con el botón de bocina se silencia y avanza al tocar.</p><div id="artEx"></div>'+
  '<h3>Formas de boca</h3><div class="vz-mouths">'+[["c","Cerrada"],["m","Entreabierta"],["a","Abierta (a)"],["o","Redonda (o, u)"],["e","Ancha (e, i)"]].map(function(q){return '<figure><div class="vz-mw" data-vis="'+q[0]+'">'+rumboEl()+'</div><figcaption>'+q[1]+'</figcaption></figure>'}).join("")+'</div>'+
  '<h3>Video (estado vacío)</h3>'+videoHTML({titulo:"Un día de internado",quien:"una persona que hace su internado"})+'</section>';
 var el=document.createElement("div");el.id="art";el.className="ia";el.innerHTML=h;document.body.appendChild(el);
 if(GU&&GU.explicaciones[0]&&typeof EXPL!=="undefined")EXPL.mount(el.querySelector("#artEx"),GU.explicaciones[0]);
 el.querySelectorAll(".vz-mouths .vz-mw").forEach(function(w){var r=w.querySelector(".rb");if(!r)return;r.classList.remove("float");r.setAttribute("data-mood","talk");r.__vis=VOZ.SHAPE[w.getAttribute("data-vis")]});
 videoBind(el);

 /* se dibuja por partes para no trabar la página */
 (function(){var cat=ISOFIX.catalog(20),host=document.getElementById("iaInk"),i=0;
  function one(){if(i>=cat.length)return;var c=cat[i++],d=document.createElement("div");d.className="ia-inkrow";d.innerHTML='<h3>'+c.name+'</h3><div class="ia-inkc">'+inkStrip(c)+'</div>';host.appendChild(d);setTimeout(one,30)}
  one()})();
 /* escenas */
 var SC=ISOFIX.catalog(20).filter(function(c){return ART.has(c.id)}).map(function(c){return {id:c.id,name:c.name,short:c.short,area:"escena",sub:"Prueba",color:c.color,tags:c.tags}});
 var SA=[{id:"escena",name:"Isla de prueba",biome:"jardin"}],SW=MAPGEN.build(SC,SA);
 var DEC=["treeRound","treePine","palm","bush","bench","lamp"];
 function scenes(){
  ISOMAP.mount(document.getElementById("scS"),SW,{style:"s",lod:"near",decor:DEC,sea:["whale","dolphins"],budget:{isle:6,sea:2},mobile:false,wheelZoom:false}).fit(.96);
  ISOMAP.mount(document.getElementById("scE"),SW,{style:"e",lod:"near",decor:DEC,sea:["whale","dolphins"],budget:{isle:6,sea:2},mobile:false,wheelZoom:false}).fit(.96);
  ISOMAP.mount(document.getElementById("phS"),SW,{style:"s",decor:DEC,sea:["whale","dolphins"],mobile:true,start:"medicina",wheelZoom:false});
  ISOMAP.mount(document.getElementById("phE"),SW,{style:"e",decor:DEC,sea:["whale","dolphins"],mobile:true,start:"medicina",wheelZoom:false});
 }
 var M=null;
 function build(n){var t0=performance.now(),W=MAPGEN.build(ISOFIX.catalog(n),ISOFIX.AREAS),t1=performance.now();M=ISOMAP.mount(document.getElementById("iaMap"),W,{wheelZoom:false});
  document.getElementById("iaStat").textContent="Generado en "+Math.round(t1-t0)+" ms y dibujado en "+Math.round(performance.now()-t1)+" ms: "+W.nodes.length+" carreras, "+W.islands.length+" islas, "+W.edges.length+" tramos de camino y "+W.bridges.length+" puentes.";
  each(el.querySelectorAll("[data-n]"),function(b){b.setAttribute("aria-pressed",+b.getAttribute("data-n")===n?"true":"false")});
  M.el.classList.toggle("is-night",el.querySelector(".ia-night").getAttribute("aria-pressed")==="true");
  window.__art.N=n;
 }
 window.__art={get M(){return M},build:build,N:20};
 scenes();build(20);
 var jb=el.querySelector(".ia-jump");if(jb)jb.onclick=function(){var r=jb.closest("figure").querySelector(".rb");mood(r,"happy","jump")};
 /* elegir estilo: se guarda y el mapa se vuelve a dibujar */
 each(el.querySelectorAll(".ia-card"),function(card){var id=card.getAttribute("data-id");
  function wire(){each(card.querySelectorAll(".ia-pick"),function(b){b.onclick=function(){var v=b.closest(".ia-opt").getAttribute("data-v");ART.pick(id,v);
   each(card.querySelectorAll(".ia-opt"),function(o){var on=o.getAttribute("data-v")===v,bt=o.querySelector(".ia-pick");o.classList.toggle("on",on);bt.setAttribute("aria-pressed",on?"true":"false");bt.textContent=(on?"Elegida: ":"Elegir ")+(o.getAttribute("data-v")==="s"?"estructura":"emblema")});
   build(window.__art.N)}})}
  wire();
  each(card.querySelectorAll("[data-vv]"),function(b){b.onclick=function(){var x=b.getAttribute("data-vv");ART.ver(id,x);
   each(card.querySelectorAll("[data-vv]"),function(o){o.setAttribute("aria-checked",o===b?"true":"false")});
   card.querySelector(".ia-vs").innerHTML=cardBody(id,x);wire();build(window.__art.N)}})});
 each(el.querySelectorAll("[data-n]"),function(b){b.onclick=function(){build(+b.getAttribute("data-n"))}});
 each(el.querySelectorAll("[data-z]"),function(b){b.onclick=function(){var z=b.getAttribute("data-z");if(z==="fit")M.fit();else M.focus(M.world.byId.medicina?"medicina":M.world.nodes[0].id,+z)}});
 el.querySelector(".ia-night").onclick=function(){var on=this.getAttribute("aria-pressed")!=="true";this.setAttribute("aria-pressed",on?"true":"false");M.el.classList.toggle("is-night",on)};
}
