/* ================= página interna #rumbo: modelos de la mascota lado a lado ================= */
function renderRumbo(){
 var old=document.getElementById("art");if(old)old.remove();
 document.documentElement.classList.add("art-on");
 var M=RUMBO.models,NM=RUMBO.NAMES,cur=RUMBO.pick(),h="";
 var DESC={R:"El del boceto: brújula con cara, ojos enormes bajitos y juntos, gorro de aviador ladeado con orejeras desiguales, flecha que escapa por arriba, manitas con guante y botitas.",v1:"El que se usa hoy: gorro detrás con correa en diagonal y volumen con degradado.",A:"El mismo Rumbo con cuerpo de globo, en estilo plano: formas grandes, un tono de sombra, ojos grandes.",B:"El cuerpo es una brújula: aro grueso de latón, carátula crema con marcas simples; la flecha hace de aguja.",C:"Globo terráqueo dentro de un aro de brújula con marcas cardinales."};
 var EXP=[["idle","Neutral"],["happy","Feliz"],["joy","Muy feliz"],["curious","Curioso"],["think","Pensando"],["wow","Sorprendido"],["wink","Guiño"],["sad","Triste"],["sadhope","Triste con ánimo"],["sleep","Dormido"],["joy","Celebrando","cheer"]];
 var POS=[["","De pie","idle"],["p-wave","Saludando","happy"],["p-point","Señalando","curious"],["cheer","Saltando","happy"],["walk","Caminando","idle"]];
 function rb(m,px,mood,cls){return '<div class="ia-rb" style="width:'+px+'px;height:'+px+'px"><div class="rb float '+(cls||"")+'" data-mood="'+(mood||"idle")+'">'+RUMBO.svg(m)+'<div class="burst"></div></div></div>'}
 h+='<header class="ia-h"><h1>Rumbo</h1><p>Elige qué modelo usa la app. Tu elección se guarda en este dispositivo y cambia a Rumbo en todas las pantallas: carga, inicio, perfil, test, mapa, avisos y estados vacíos. Mientras no elijas, la app usa el modelo B. Los ojos siguen tu dedo o tu cursor.</p></header>';
 h+='<section><h2>Referencias para el nuevo Rumbo</h2><p class="ia-d">Cuatro estilos generados a partir de tu boceto. Elige el que más te guste y reconstruyo a Rumbo en ese estilo, animable.</p><div class="ia-rbrow"><figure><img src="media/rumbo-boceto.png" alt="Tu boceto" style="height:300px;border-radius:12px;background:#fff"><figcaption>Tu boceto</figcaption></figure>'+
  [["1","Vector plano con contorno"],["2","3D suave, tipo juguete"],["3","Kawaii de sticker"],["4","Libro ilustrado infantil"]].map(function(r){return '<figure><img src="media/rumbo-ref-'+r[0]+'.png" alt="Referencia '+r[0]+'" style="height:300px;border-radius:12px;background:#fff"><figcaption>'+r[0]+'. '+r[1]+'</figcaption></figure>'}).join("")+'</div></section>';
 h+='<section><h2>Elige el modelo</h2><div class="ia-rbpick" role="radiogroup" aria-label="Modelo de Rumbo">'+M.map(function(m){return '<button type="button" role="radio" class="ia-rbopt" data-m="'+m+'" aria-checked="'+(m===cur)+'">'+rb(m,120)+'<b>'+NM[m]+'</b><span>'+DESC[m]+'</span></button>'}).join("")+'</div></section>';
 M.forEach(function(m){
  h+='<section class="ia-rbmodel"><h2>'+NM[m]+'</h2>';
  if(m==="R")h+='<h3>Tu boceto y el modelo</h3><div class="ia-rbrow"><figure><img src="media/rumbo-boceto.png" alt="Boceto de Rumbo" style="height:360px;border-radius:12px;background:#fff"><figcaption>Tu boceto</figcaption></figure><figure>'+rb(m,360,"happy","p-wave")+'<figcaption>Modelo R, saludando</figcaption></figure></div>';
  h+='<h3>Tamaños y silueta</h3><div class="ia-rbrow">'+(m==="R"||m==="T"?[32,48,64,128,400]:[32,64,128,300]).map(function(px){return '<figure>'+rb(m,px)+'<figcaption>'+px+' px</figcaption></figure>'}).join("")+
   '<figure><div class="ia-sil" style="padding:6px;border-radius:12px;background:#FFF">'+rb(m,128)+'</div><figcaption>Silueta</figcaption></figure><figure class="is-night" style="padding:10px;border-radius:14px">'+rb(m,96)+'<figcaption>96 px, noche</figcaption></figure></div>';
  h+='<h3>Expresiones</h3><div class="ia-rbrow">'+EXP.map(function(e){return '<figure>'+rb(m,110,e[0],e[2])+'<figcaption>'+e[1]+'</figcaption></figure>'}).join("")+'</div>';
  if(m!=="v1")h+='<h3>Poses</h3><div class="ia-rbrow">'+POS.map(function(p){return '<figure>'+rb(m,130,p[2],p[0])+'<figcaption>'+p[1]+'</figcaption></figure>'}).join("")+'</div>';
  h+='<h3>Animaciones</h3><div class="ia-rbanim"><div class="ia-rbstage">'+rb(m,180)+'</div><div class="ia-rbbtns">'+[["blink","Parpadear"],["breathe","Respirar"],["wave","Saludar"],["yes","Acierto"],["oops","Error con ánimo"],["cheer","Celebración grande"],["walk","Caminar / detenerse"],["point","Señalar"],["look","Mirar alrededor"],["adjust","Acomodarse las gafas"],["sway","Balancearse"],["yawn","Bostezar"],["jump","Saltar"],["tilt","Ladear"],["shake","Negar"],["talk","Hablar"]].map(function(b){return '<button type="button" class="ia-pick" data-a="'+b[0]+'">'+b[1]+'</button>'}).join("")+'</div></div>';
  h+='</section>';
 });
 h+='<h2 class="ia-old">Versiones anteriores: acabados y ojos de los modelos A, B y C</h2>';
 /* ---------- acabados ---------- */
 var fk=RUMBO.finPick(),mm0=cur==="v1"?"B":cur;
 h+='<section><h2>Elige el acabado</h2><p class="ia-d">El mismo Rumbo con cuatro maneras de dibujarlo. Los tres nuevos llevan el gorro ladeado y una orejera levantada para que no se vea perfecto ni genérico.</p><div class="ia-eyes" role="radiogroup" aria-label="Acabado">'+
  RUMBO.FINK.map(function(k){var F=RUMBO.FIN[k];
   return '<div class="ia-eyeopt ia-finopt" data-k="'+k+'" aria-checked="'+(k===fk)+'"><div class="ia-rb" style="width:200px;height:200px"><div class="rb float" data-mood="happy">'+RUMBO.svg(mm0,null,k)+'</div></div>'+
    '<div class="ia-eyemini">'+["idle","joy","wow","sad"].map(function(md){return '<div class="ia-rb" style="width:64px;height:64px"><div class="rb" data-mood="'+md+'">'+RUMBO.svg(mm0,null,k)+'</div></div>'}).join("")+'</div>'+
    '<b>'+F.n+'</b><span>'+F.d+'</span><button type="button" role="radio" class="ia-pick" aria-checked="'+(k===fk)+'" aria-pressed="'+(k===fk)+'">'+(k===fk?"Elegido":"Elegir este acabado")+'</button></div>'}).join("")+'</div></section>';
 /* ---------- muestrario de ojos ---------- */
 var ek=RUMBO.eyePick(),mm=cur==="v1"?"B":cur;
 h+='<section><h2>Elige los ojos</h2><p class="ia-d">Los seis están vivos: parpadean, siguen tu dedo o tu cursor y cambian de expresión. Abajo de cada uno: feliz, muy feliz, sorprendido y triste.</p><div class="ia-eyes" role="radiogroup" aria-label="Estilo de ojos">'+
  RUMBO.EYEK.map(function(k){var E0=RUMBO.EYES[k];
   return '<div class="ia-eyeopt" data-k="'+k+'" aria-checked="'+(k===ek)+'"><div class="ia-rb" style="width:170px;height:170px"><div class="rb float" data-mood="idle">'+RUMBO.svg(mm,k)+'</div></div>'+
    '<div class="ia-eyemini">'+["happy","joy","wow","sad"].map(function(md){return '<div class="ia-rb" style="width:64px;height:64px"><div class="rb" data-mood="'+md+'">'+RUMBO.svg(mm,k)+'</div></div>'}).join("")+'</div>'+
    '<b>'+E0.n+'</b><span>'+E0.d+'</span><button type="button" role="radio" class="ia-pick" aria-checked="'+(k===ek)+'" aria-pressed="'+(k===ek)+'">'+(k===ek?"Elegidos":"Elegir estos ojos")+'</button></div>'}).join("")+'</div></section>';
 var el=document.createElement("div");el.id="art";el.className="ia";el.innerHTML=h;document.body.appendChild(el);
 each(el.querySelectorAll(".ia-finopt .ia-pick"),function(bt){bt.onclick=function(){var k=bt.closest(".ia-finopt").getAttribute("data-k");RUMBO.finPick(k);toast("Listo: acabado «"+RUMBO.FIN[k].n+"»");var y=scrollY;renderRumbo();scrollTo(0,y)}});
 each(el.querySelectorAll(".ia-eyeopt:not(.ia-finopt) .ia-pick"),function(bt){bt.onclick=function(){var k=bt.closest(".ia-eyeopt").getAttribute("data-k");RUMBO.eyePick(k);toast("Listo: Rumbo usará los ojos «"+RUMBO.EYES[k].n+"»");var y=scrollY;renderRumbo();scrollTo(0,y)}});
 each(el.querySelectorAll(".ia-rbopt"),function(b){b.onclick=function(){RUMBO.pick(b.getAttribute("data-m"));each(el.querySelectorAll(".ia-rbopt"),function(o){o.setAttribute("aria-checked",o===b?"true":"false")});toast("Listo: la app usará "+NM[b.getAttribute("data-m")])}});
 each(el.querySelectorAll(".ia-rbanim"),function(box){var r=box.querySelector(".rb");
  each(box.querySelectorAll("[data-a]"),function(b){b.onclick=function(){var a=b.getAttribute("data-a");
   if(a==="breathe"){r.classList.toggle("float")}
   else if(a==="walk"){r.classList.toggle("walk")}
   else if(a==="point"){r.classList.toggle("p-point");r.setAttribute("data-mood",r.classList.contains("p-point")?"curious":"idle")}
   else if(a==="talk"){r.setAttribute("data-mood",r.getAttribute("data-mood")==="talk"?"idle":"talk")}
   else if(a==="shake"){r.setAttribute("data-mood","no");r.classList.add("a-shake");setTimeout(function(){r.setAttribute("data-mood","idle")},1400)}
   else r.classList.add("a-"+a);
  }})});
}
window.__RUMBO=RUMBO;window.__ART=ART;

window.__OLD=function(){return rumboSVGOld()};window.__V1=function(){return rumboSVG()};
