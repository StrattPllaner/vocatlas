/* ================= página interna #art =================
   Comparación estructura contra emblema por carrera (con elección guardada), fila a 64 px sobre la noche,
   escenas de prueba, entorno antes y después con silueta, y el mapa generado. */
function renderArt(){
 var old=document.getElementById("art");if(old)old.remove();
 document.documentElement.classList.add("art-on");
 var E=ENV,h="",VB="-72 -110 144 160",NAMES={medicina:"Medicina",derecho:"Derecho",computacion:"Computación",cine:"Cine",arquitectura:"Arquitectura",veterinaria:"Veterinaria",datos:"Ciencia de datos"};
 var DESC={
  medicina:["Hospital de tres cuerpos con cruz, helipuerto y ambulancia","Botiquín gigante con un estetoscopio enrollado"],
  derecho:["Juzgado con columnas, escalinata y la estatua de la justicia","Balanza gigante, mazo de juez y libro de leyes"],
  computacion:["Oficinas con fachada-pantalla de código y servidores","Computadora de escritorio con teclado y torre con luces"],
  cine:["Cine con marquesina iluminada, alfombra y reflectores","Cámara clásica en trípode con rollos, claqueta y reflector"],
  arquitectura:["Estudio con ventanal y maqueta en la entrada","Maqueta a medio construir sobre un plano, compás y regla"],
  veterinaria:["Clínica con letrero de huella, casita y perro esperando","Perro gigante sentado con collar, estetoscopio y plato"],
  datos:["Torre de oficinas con cartelera de gráfica en el techo","Gráfica de barras gigante con tendencia y lupa"]};
 function svg(inner,px,cls){return '<svg class="'+(cls||"")+'" viewBox="'+VB+'" style="height:'+px+'px" aria-hidden="true">'+inner+'</svg>'}
 h+='<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>'+E.DEFS+'</defs></svg>';
 h+='<header class="ia-h"><h1>Ilustración del mapa</h1><p>Elige para cada carrera la versión que más te guste: la <b>estructura</b> (el lugar donde se ejerce) o el <b>emblema</b> (su objeto a escala gigante). Tu elección se guarda en este dispositivo y el mapa de abajo la usa. Mientras no elijas, se usa la estructura.</p></header>';
 /* ---------- comparación por carrera ---------- */
 h+='<section><h2>Estructura o emblema</h2><div class="ia-cards">';
 ART.ids.forEach(function(id){var cur=ART.pick(id);
  h+='<article class="ia-card" data-id="'+id+'"><h3>'+NAMES[id]+'</h3><div class="ia-vs">';
  [["s","Estructura"],["e","Emblema"]].forEach(function(v,i){
   h+='<div class="ia-opt'+(cur===v[0]?' on':'')+'" data-v="'+v[0]+'"><div class="ia-big">'+svg(ART.get(id,2,v[0]),230)+'</div><p class="ia-d">'+DESC[id][i]+'</p>'+
    '<div class="ia-small is-night"><div>'+svg(ART.get(id,1,v[0]),96)+'<span>96 px</span></div><div>'+svg(ART.get(id,0,v[0]),64)+'<span>64 px</span></div><div class="ia-sil">'+svg(ART.get(id,2,v[0],{noPlat:true}),64)+'<span>silueta</span></div></div>'+
    '<button type="button" class="ia-pick" aria-pressed="'+(cur===v[0])+'">'+(cur===v[0]?'Elegida: ':'Elegir ')+v[1].toLowerCase()+'</button></div>'});
  h+='</div></article>'});
 h+='</div></section>';
 /* ---------- Rumbo ---------- */
 function rbBox(px,html,cls){return '<div class="ia-rb '+(cls||"")+'" style="width:'+px+'px;height:'+px+'px">'+html+'</div>'}
 h+='<section><h2>Rumbo</h2><p class="ia-n">Mismo personaje, nueva construcción: esfera con volumen, continentes que siguen la curva, gorro que envuelve la cabeza con solapas y sombra, gafas con marco y reflejo, flecha que nace de un anillo y piernas que tocan el suelo.</p>'+
  '<div class="ia-rbrow"><figure>'+rbBox(200,'<div class="rb float" data-mood="idle">'+rumboSVGOld()+'</div>')+'<figcaption>Antes</figcaption></figure><figure>'+rbBox(200,rumboEl())+'<figcaption>Ahora</figcaption></figure><figure>'+rbBox(200,'<div class="rb" data-mood="idle">'+rumboSVG()+'</div>','ia-sil')+'<figcaption>Silueta</figcaption></figure></div>'+
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
 /* ---------- mapa generado ---------- */
 h+='<section><h2>Mapa generado desde el catálogo</h2><p class="ia-n">Usa tus elecciones. Lejos: islas y áreas. Medio: carreras simplificadas con nombre corto. Cerca: todo el detalle y nombres completos.</p>'+
  '<div class="ia-ctl"><div class="ia-seg" role="group" aria-label="Cantidad de carreras"><button type="button" data-n="20" aria-pressed="true">20 carreras</button><button type="button" data-n="50">50</button><button type="button" data-n="120">120</button></div><div class="ia-seg" role="group" aria-label="Zoom"><button type="button" data-z="fit">Lejos</button><button type="button" data-z=".45">Medio</button><button type="button" data-z=".9">Cerca</button></div><button type="button" class="ia-night" aria-pressed="false">Noche</button></div>'+
  '<div class="ia-map" id="iaMap"></div><p class="ia-n" id="iaStat"></p></section>';
 var el=document.createElement("div");el.id="art";el.className="ia";el.innerHTML=h;document.body.appendChild(el);
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
  each(card.querySelectorAll(".ia-pick"),function(b){b.onclick=function(){var v=b.closest(".ia-opt").getAttribute("data-v");ART.pick(id,v);
   each(card.querySelectorAll(".ia-opt"),function(o){var on=o.getAttribute("data-v")===v,bt=o.querySelector(".ia-pick");o.classList.toggle("on",on);bt.setAttribute("aria-pressed",on?"true":"false");bt.textContent=(on?"Elegida: ":"Elegir ")+(o.getAttribute("data-v")==="s"?"estructura":"emblema")});
   build(window.__art.N)}})});
 each(el.querySelectorAll("[data-n]"),function(b){b.onclick=function(){build(+b.getAttribute("data-n"))}});
 each(el.querySelectorAll("[data-z]"),function(b){b.onclick=function(){var z=b.getAttribute("data-z");if(z==="fit")M.fit();else M.focus(M.world.byId.medicina?"medicina":M.world.nodes[0].id,+z)}});
 el.querySelector(".ia-night").onclick=function(){var on=this.getAttribute("aria-pressed")!=="true";this.setAttribute("aria-pressed",on?"true":"false");M.el.classList.toggle("is-night",on)};
}
