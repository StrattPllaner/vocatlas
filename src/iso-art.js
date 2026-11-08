/* ================= página interna #art: ilustraciones a tres tamaños y el mapa generado ================= */
function renderArt(){
 var old=document.getElementById("art");if(old)old.remove();
 document.documentElement.classList.add("art-on");
 var I=ISO,E=ENV,h="";
 function tile(svg,vb,px,lab){return '<figure class="ia-t"><svg viewBox="'+vb+'" style="height:'+px+'px" aria-hidden="true">'+svg+'</svg><figcaption>'+lab+'</figcaption></figure>'}
 function row(name,svg,vb,sizes,note){var r='<div class="ia-row"><h3>'+name+(note?' <em>'+note+'</em>':'')+'</h3><div class="ia-sz">';sizes.forEach(function(px){r+=tile(svg,vb,px,px+" px")});return r+'</div></div>'}
 h+='<header class="ia-h"><h1>Ilustración del mapa</h1><p>Fase 2, muestra para aprobar el estilo: vista isométrica 2 : 1, luz desde arriba a la izquierda, tres tonos por color y un destello en los bordes de arriba. Cada pieza aparece a tres tamaños; el de 96 px comprueba que la silueta se reconoce reducida.</p></header>';
 h+='<section><h2>Edificios</h2><p class="ia-n">Tres de veinte, terminados para que juzgues el nivel antes de dibujar los otros diecisiete.</p>';
 [["medicina","Medicina","hospital de tres cuerpos, cruz en el techo, arco de entrada, helipuerto y ambulancia"],["computacion","Computación","edificio monitor con llaves de código, servidores con luces y cables"],["derecho","Derecho","juzgado con columnas, escalinata y estatua de la justicia"]].forEach(function(b){h+=row(b[1],BLD[b[0]](),"-72 -100 144 150",[96,170,320],b[2])});
 h+='</section>';
 h+='<section><h2>Edificios de reserva por bioma</h2><p class="ia-n">Los usa el mapa para cualquier carrera que todavía no tenga ilustración propia, con el color de la carrera.</p><div class="ia-grid">';
 [["jardin","Salud · jardín","#3F9C7A"],["industria","Ingenierías · industria","#E8603C"],["vidrio","Tecnología · vidrio","#3F7DA6"],["ciudad","Negocios · ciudad","#F2B544"],["barrio","Arte · barrio","#B88AA8"]].forEach(function(b){h+=tile(E.generic(b[0],b[2],7),"-58 -80 116 112",130,b[1])});
 h+='</div></section>';
 h+='<section><h2>Entorno</h2><div class="ia-grid">';
 var P=[["Árbol redondo",E.treeRound(1.6),"-26 -46 52 52"],["Pino",E.treePine(1.6),"-22 -50 44 56"],["Palmera",E.palm(1.5),"-22 -52 50 58"],["Arbusto",E.bush(1.8),"-14 -22 32 28"],["Roca",E.rock(2),"-12 -16 26 20"],["Flores",E.flowers(),"-7 -7 14 12"],["Farol",E.lamp(),"-6 -22 12 26"],["Señal",E.signpost(),"-12 -20 26 24"],["Banca",E.bench(),"-8 -6 18 12"],["Caja",E.crate(),"-6 -10 14 14"],["Cono",E.cone(),"-4 -8 8 10"],["Faro",E.lighthouse(),"-24 -50 120 74"],["Muelle",E.pier(40),"-12 -12 60 40"],["Velero",E.sailboat(),"-14 -26 30 34"],["Transbordador",E.ferry(),"-28 -24 56 36"],["Ballena",'<g style="opacity:1">'+E.whale().replace('class="iso-whale"','')+'</g>',"-22 -18 46 26"],["Delfines",E.dolphin().replace('class="iso-dolphin"','')+'<g transform="translate(16 6)">'+E.dolphin().replace('class="iso-dolphin"','')+'</g>',"-12 -12 40 24"],["Gaviota",E.gull(),"-7 -4 14 6"],["Nube",E.cloud(1.4).replace('class="iso-cloud"',''),"-16 -34 66 50"],["Rosa de los vientos",E.compass(),"-46 -54 92 100"]];
 var SEA={"Faro":1,"Muelle":1,"Velero":1,"Transbordador":1,"Ballena":1,"Delfines":1,"Gaviota":1,"Nube":1,"Rosa de los vientos":1};
 P.forEach(function(p){var v=p[2].split(" ").map(Number),wide=v[2]>v[3];h+='<div class="ia-env'+(SEA[p[0]]?' sea':'')+'"><div class="ia-sz">'+[32,56,96].map(function(px){return '<svg viewBox="'+p[2]+'" style="'+(wide?'width':'height')+':'+px+'px" aria-hidden="true">'+p[1]+'</svg>'}).join("")+'</div><span>'+p[0]+'</span></div>'});
 h+='</div></section>';
 h+='<section><h2>Letreros de carrera</h2><p class="ia-n">Cuelgan de un alfiler con el color de la carrera. Se colocan solos sin pisarse: debajo del edificio y, si no cabe, a un lado o arriba.</p><div class="ia-signs">';
 [["Medicina","#3F9C7A"],["Ciencia de datos","#5BA3D0"],["Arquitectura","#B88AA8"]].forEach(function(s){h+='<span class="gm-pin ia-pin" style="--c:'+s[1]+'"><i class="pn"></i><span class="br"><b>'+s[0]+'</b></span></span>'});
 h+='</div></section>';
 h+='<section><h2>Mapa generado desde el catálogo</h2><p class="ia-n">Cada área es una isla de tamaño proporcional a sus carreras; las subáreas forman regiones; los caminos salen de un árbol de expansión mínima más atajos; los puentes unen las islas más cercanas o con más temas en común. Lejos: islas y áreas. Medio: subáreas con contador. Cerca: edificios y letreros.</p>'+
  '<div class="ia-ctl"><div class="ia-seg" role="group" aria-label="Cantidad de carreras"><button type="button" data-n="20" aria-pressed="true">20 carreras</button><button type="button" data-n="50">50</button><button type="button" data-n="120">120</button></div><div class="ia-seg" role="group" aria-label="Zoom"><button type="button" data-z="fit">Lejos</button><button type="button" data-z=".45">Medio</button><button type="button" data-z=".9">Cerca</button></div><button type="button" class="ia-night" aria-pressed="false">Noche</button></div>'+
  '<div class="ia-map" id="iaMap"></div><p class="ia-n" id="iaStat"></p></section>';
 var el=document.createElement("div");el.id="art";el.className="ia";el.innerHTML=h;document.body.appendChild(el);
 var M=null,N=20;
 function build(n){N=n;var t0=performance.now(),W=MAPGEN.build(ISOFIX.catalog(n),ISOFIX.AREAS),t1=performance.now();M=ISOMAP.mount(document.getElementById("iaMap"),W,{wheelZoom:false});
  document.getElementById("iaStat").textContent="Generado en "+Math.round(t1-t0)+" ms y dibujado en "+Math.round(performance.now()-t1)+" ms: "+W.nodes.length+" carreras, "+W.islands.length+" islas, "+W.edges.length+" tramos de camino y "+W.bridges.length+" puentes.";
  each(el.querySelectorAll("[data-n]"),function(b){b.setAttribute("aria-pressed",+b.getAttribute("data-n")===n?"true":"false")});
  M.el.classList.toggle("is-night",el.querySelector(".ia-night").getAttribute("aria-pressed")==="true");
 }
 build(20);
 each(el.querySelectorAll("[data-n]"),function(b){b.onclick=function(){build(+b.getAttribute("data-n"))}});
 each(el.querySelectorAll("[data-z]"),function(b){b.onclick=function(){var z=b.getAttribute("data-z");if(z==="fit")M.fit();else M.focus(M.world.byId.medicina?"medicina":M.world.nodes[0].id,+z)}});
 el.querySelector(".ia-night").onclick=function(){var on=this.getAttribute("aria-pressed")!=="true";this.setAttribute("aria-pressed",on?"true":"false");M.el.classList.toggle("is-night",on)};
 window.__art={get M(){return M},build:build};
}
