/* ================= página interna #rumbo: modelos de la mascota lado a lado ================= */
function renderRumbo(){
 var old=document.getElementById("art");if(old)old.remove();
 document.documentElement.classList.add("art-on");
 var M=RUMBO.models,NM=RUMBO.NAMES,cur=RUMBO.pick(),h="";
 var DESC={v1:"El que se usa hoy: gorro detrás con correa en diagonal y volumen con degradado.",A:"El mismo Rumbo con cuerpo de globo, en estilo plano: formas grandes, un tono de sombra, ojos grandes.",B:"El cuerpo es una brújula: aro grueso de latón, carátula crema con marcas simples; la flecha hace de aguja.",C:"Globo terráqueo dentro de un aro de brújula con marcas cardinales."};
 var EXP=[["idle","Neutral"],["happy","Feliz"],["joy","Muy feliz"],["curious","Curioso"],["think","Pensando"],["wow","Sorprendido"],["wink","Guiño"],["sadhope","Triste con ánimo"],["sleep","Dormido"],["joy","Celebrando","cheer"]];
 var POS=[["","De pie","idle"],["p-wave","Saludando","happy"],["p-point","Señalando","curious"],["cheer","Saltando","happy"],["walk","Caminando","idle"]];
 function rb(m,px,mood,cls){return '<div class="ia-rb" style="width:'+px+'px;height:'+px+'px"><div class="rb float '+(cls||"")+'" data-mood="'+(mood||"idle")+'">'+RUMBO.svg(m)+'<div class="burst"></div></div></div>'}
 h+='<header class="ia-h"><h1>Rumbo</h1><p>Elige qué modelo usa la app. Tu elección se guarda en este dispositivo y cambia a Rumbo en todas las pantallas: carga, inicio, perfil, test, mapa, avisos y estados vacíos. Mientras no elijas, la app usa el modelo A.</p></header>';
 h+='<section><h2>Elige el modelo</h2><div class="ia-rbpick" role="radiogroup" aria-label="Modelo de Rumbo">'+M.map(function(m){return '<button type="button" role="radio" class="ia-rbopt" data-m="'+m+'" aria-checked="'+(m===cur)+'">'+rb(m,120)+'<b>'+NM[m]+'</b><span>'+DESC[m]+'</span></button>'}).join("")+'</div></section>';
 M.forEach(function(m){
  h+='<section class="ia-rbmodel"><h2>'+NM[m]+'</h2>';
  h+='<h3>Tamaños y silueta</h3><div class="ia-rbrow">'+[32,64,128,300].map(function(px){return '<figure>'+rb(m,px)+'<figcaption>'+px+' px</figcaption></figure>'}).join("")+
   '<figure><div class="ia-sil" style="padding:6px;border-radius:12px;background:#FFF">'+rb(m,128)+'</div><figcaption>Silueta</figcaption></figure><figure class="is-night" style="padding:10px;border-radius:14px">'+rb(m,96)+'<figcaption>96 px, noche</figcaption></figure></div>';
  h+='<h3>Expresiones</h3><div class="ia-rbrow">'+EXP.map(function(e){return '<figure>'+rb(m,110,e[0],e[2])+'<figcaption>'+e[1]+'</figcaption></figure>'}).join("")+'</div>';
  if(m!=="v1")h+='<h3>Poses</h3><div class="ia-rbrow">'+POS.map(function(p){return '<figure>'+rb(m,130,p[2],p[0])+'<figcaption>'+p[1]+'</figcaption></figure>'}).join("")+'</div>';
  h+='<h3>Animaciones</h3><div class="ia-rbanim"><div class="ia-rbstage">'+rb(m,180)+'</div><div class="ia-rbbtns">'+[["blink","Parpadear"],["breathe","Respirar"],["walk","Caminar"],["jump","Saltar"],["tilt","Ladear"],["shake","Negar"],["wave","Saludar"],["point","Señalar"],["look","Mirar alrededor"],["talk","Hablar"]].map(function(b){return '<button type="button" class="ia-pick" data-a="'+b[0]+'">'+b[1]+'</button>'}).join("")+'</div></div>';
  h+='</section>';
 });
 var el=document.createElement("div");el.id="art";el.className="ia";el.innerHTML=h;document.body.appendChild(el);
 each(el.querySelectorAll(".ia-rbopt"),function(b){b.onclick=function(){RUMBO.pick(b.getAttribute("data-m"));each(el.querySelectorAll(".ia-rbopt"),function(o){o.setAttribute("aria-checked",o===b?"true":"false")});toast("Listo: la app usará "+NM[b.getAttribute("data-m")])}});
 each(el.querySelectorAll(".ia-rbanim"),function(box){var r=box.querySelector(".rb");
  each(box.querySelectorAll("[data-a]"),function(b){b.onclick=function(){var a=b.getAttribute("data-a");
   if(a==="blink"){r.classList.add("blink");setTimeout(function(){r.classList.remove("blink")},140)}
   else if(a==="breathe"){r.classList.toggle("float")}
   else if(a==="walk"){r.classList.toggle("walk")}
   else if(a==="jump")mood(r,"joy","jump");
   else if(a==="tilt")mood(r,"happy","tilt");
   else if(a==="shake")mood(r,"no","shake");
   else if(a==="look")mood(r,"curious","look");
   else if(a==="wave"){r.classList.toggle("p-wave");mood(r,r.classList.contains("p-wave")?"happy":"idle")}
   else if(a==="point"){r.classList.toggle("p-point");mood(r,r.classList.contains("p-point")?"curious":"idle")}
   else if(a==="talk"){mood(r,r.getAttribute("data-mood")==="talk"?"idle":"talk")}
  }})});
}
