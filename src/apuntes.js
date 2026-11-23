/* ================= Apuntes: un cuaderno por carrera =================
   Al terminar cada lección, lo que se vio queda resumido en el cuaderno de esa carrera: las explicaciones, las listas,
   cada pregunta con su respuesta real y el porqué, los datos con su fuente y las ideas clave. Cada unidad abre con su
   símbolo. No se guarda texto aparte: se arma de la lección misma, así nunca se desactualiza ni se omite nada.
   El menú de tres barras del mapa junta «Mis carreras» (agregar o quitar) y «Apuntes». */
var APUNTES=(function(){
 function h(t){return esc(String(t==null?"":t))}
 function cifTxt(k){var d=(CAT.cif||{})[k];if(!d||d.estado==="pendiente"||d.valor==null)return null;return {v:String(d.valor)+(d.unidad?" "+d.unidad:""),f:d.fuente||"",u:d.url||null}}
 /* resumen de una lección a partir de sus tarjetas */
 function resumen(les){var o="";
  (les.tarjetas||[]).forEach(function(t){
   if(t.tipo==="info"||t.tipo==="ficha"){if(t.titulo&&t.titulo!==les.titulo)o+='<h5>'+h(t.titulo)+'</h5>';if(t.texto)o+='<p>'+h(t.texto)+'</p>';
    (t.partes||[]).forEach(function(x){if(x.t)o+='<p>'+h(x.t)+'</p>'});if(t.puntos)o+='<ul>'+t.puntos.map(function(p){return '<li>'+h(p)+'</li>'}).join("")+'</ul>';
    (t.cifras||[]).forEach(function(k){var c=cifTxt(k);if(c)o+='<p class="ap-dato"><b>'+h(c.v)+'</b><small>'+h(c.f)+'</small></p>'})}
   else if(t.tipo==="pregunta"&&t.opciones)o+='<div class="ap-q"><span>'+h(t.pregunta)+'</span><b>'+h(t.opciones[t.correcta])+'</b>'+(t.explicacion?'<small>'+h(t.explicacion)+'</small>':'')+'</div>';
   else if(t.tipo==="vf")o+='<div class="ap-q"><span>'+h(t.afirmacion)+'</span><b>'+(t.respuesta?"Verdadero":"Falso")+'</b>'+(t.revelacion?'<small>'+h(t.revelacion)+'</small>':'')+'</div>';
   else if(t.tipo==="decision"&&t.opciones){var m=t.opciones.filter(function(x){return x.mejor})[0];if(m)o+='<div class="ap-q"><span>'+h(t.pregunta)+'</span><b>'+h(m.texto)+'</b><small>'+h(m.consecuencia||"")+'</small></div>'}
   else if(t.tipo==="rango"||t.tipo==="dato"){var c=cifTxt(t.dato);if(c)o+='<p class="ap-dato"><span>'+h(t.pregunta||t.titulo||"")+'</span><b>'+h(c.v)+'</b><small>'+(c.u?'<a href="'+h(c.u)+'" target="_blank" rel="noopener">'+h(c.f)+'</a>':h(c.f))+'</small></p>'}
   else if(t.tipo==="clave")o+='<p class="ap-clave">'+h(t.texto)+'</p>';
   else if(t.tipo==="chat"&&t.temas)t.temas.forEach(function(x){if(x.respuesta||x.r)o+='<p><b>'+h(x.pregunta||x.p||"")+'</b> '+h(x.respuesta||x.r)+'</p>'});
   else if(t.tipo==="ordenar"&&t.pasos)o+='<div class="ap-q"><span>'+h(t.pregunta)+'</span><ol>'+t.pasos.map(function(p){return '<li>'+h(p)+'</li>'}).join("")+'</ol></div>'});
  return o||'<p class="ap-mut">Esta lección fue de tu opinión: no hay nada que anotar.</p>'}
 function symImg(id,k){if(typeof SIMB==="undefined"||!SIMB.has(id))return "";var q=SIMB.six(id)[k];return q?"media/sym/"+q.id+"."+q.v+".webp":""}
 function body(id,box){var c=byId[id];box.innerHTML='<p class="ap-mut">Abriendo el cuaderno…</p>';
  carCards(id,function(full){if(!full||!full.unidades){box.innerHTML='<p class="ap-mut">Esta carrera todavía no tiene lecciones.</p>';return}
   var n=0,o="";full.unidades.forEach(function(u,ui){var L=u.lecciones||[],done=L.filter(function(l){return lessDone(id,l.id)});
    var im=symImg(id,ui);o+='<section class="ap-u"><header>'+(im?'<img src="'+im+'" alt="" loading="lazy">':'')+'<div><small>Unidad '+(ui+1)+'</small><h4>'+h(u.titulo)+'</h4>'+(u.sub?'<span>'+h(u.sub)+'</span>':'')+'</div></header>';
    L.forEach(function(l){var d=lessDone(id,l.id);if(d)n++;
     o+='<article class="ap-l'+(d?'':' is-lock')+'"><h4>'+h(l.titulo)+'</h4>'+(d?resumen(l):'<p class="ap-mut">Termina esta lección y aquí se escriben tus apuntes.</p>')+'</article>'});
    o+='</section>'});
   box.innerHTML=(n?'':'<div class="ap-empty"><p><b>Tu cuaderno de '+h(c.name)+' está en blanco.</b> Cada lección que termines se anota aquí, resumida.</p></div>')+o})}
 function open(id0){var cs=(typeof MC==="function"?MC():C).filter(function(c){return CAT.car&&CAT.car[c.id]});if(!cs.length){toast("Agrega una carrera a tu mapa para tener su cuaderno.");return}
  var id=id0&&cs.some(function(c){return c.id===id0})?id0:(cs.slice().sort(function(a,b){return progOf(b.id).done-progOf(a.id).done})[0].id);
  var el=document.createElement("div");el.className="ap";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label","Apuntes");
  el.innerHTML='<div class="ap-in"><header class="ap-hd"><button type="button" class="ap-x" aria-label="Cerrar">'+IC.x+'</button><div><small>Cuaderno</small><h3>Apuntes</h3></div></header>'+
   '<div class="ap-tabs" role="tablist">'+cs.map(function(c){var p=progOf(c.id);return '<button type="button" role="tab" data-id="'+c.id+'" aria-selected="'+(c.id===id)+'" style="--c:'+c.color+'"><i></i>'+h(c.short||c.name)+' <small>'+p.done+'/'+p.total+'</small></button>'}).join("")+'</div>'+
   '<div class="ap-book"><div class="ap-page"></div></div></div>';
  var close=uiLayer(el,true);el.querySelector(".ap-x").onclick=close;
  var page=el.querySelector(".ap-page");
  function show(k){id=k;each(el.querySelectorAll(".ap-tabs button"),function(b){b.setAttribute("aria-selected",String(b.getAttribute("data-id")===k))});page.style.setProperty("--c",byId[k].color);
   page.innerHTML='<h2 class="ap-tt" style="color:'+byId[k].color+'">'+h(byId[k].name)+'</h2><div class="ap-bd"></div>';body(k,page.querySelector(".ap-bd"));page.parentNode.scrollTop=0}
  each(el.querySelectorAll(".ap-tabs button"),function(b){b.onclick=function(){show(b.getAttribute("data-id"))}});show(id)}
 /* menú de tres barras: se abre en un recuadro arriba; se cierra al tocar fuera, con Esc o al elegir */
 function menu(btn){var m=document.querySelector(".mm-pop");if(m){m.__close();return}
  m=document.createElement("div");m.className="mm-pop";m.setAttribute("role","menu");
  m.innerHTML='<button type="button" role="menuitem" data-k="car"><span class="mm-ic">'+ico("plus")+'</span><span><b>Mis carreras</b><small>Agregar o quitar del mapa</small></span></button>'+
   '<button type="button" role="menuitem" data-k="ap"><span class="mm-ic">'+ico("book")+'</span><span><b>Apuntes</b><small>Tu cuaderno de cada carrera</small></span></button>';
  document.body.appendChild(m);var r=btn.getBoundingClientRect();m.style.top=(r.bottom+8)+"px";m.style.right=Math.max(8,innerWidth-r.right)+"px";
  requestAnimationFrame(function(){m.classList.add("on")});btn.setAttribute("aria-expanded","true");
  function out(e){if(!m.contains(e.target)&&!btn.contains(e.target))cl()}function key(e){if(e.key==="Escape"){cl();btn.focus()}}
  function cl(){document.removeEventListener("pointerdown",out,true);document.removeEventListener("keydown",key);btn.setAttribute("aria-expanded","false");m.classList.remove("on");setTimeout(function(){m.remove()},RM()?0:180)}
  m.__close=cl;setTimeout(function(){document.addEventListener("pointerdown",out,true);document.addEventListener("keydown",key)},0);
  each(m.querySelectorAll("[data-k]"),function(b){b.onclick=function(){var k=b.getAttribute("data-k");cl();if(k==="car")openPicker("edit");else open()}});
  var f=m.querySelector("button");if(f)f.focus()}
 return {open:open,menu:menu,resumen:resumen}})();
