/* ================= explicaciones animadas narradas por Rumbo =================
   Un proceso en 3 a 6 etapas de 30 a 60 s en total. Cada etapa enciende su escena (solo se animan transform y opacity,
   para ir a 60 cuadros por segundo) y Rumbo dice su frase. Controles: anterior, pausa o seguir, siguiente, repetir,
   silencio y velocidad. Sin sonido, la frase queda en el globo y se avanza al tocar "Siguiente".
   Al final, una pregunta sobre el proceso. El guion vive en datos/guiones/<carrera>.json (CAT.guiones). */
var EXPL=(function(){
 var INK="#3A3026";
 function ic(d,w){return '<path d="'+d+'" fill="none" stroke="'+INK+'" stroke-width="'+(w||3)+'" stroke-linecap="round" stroke-linejoin="round"/>'}
 /* personita sencilla del estilo de la app; c = color de la etiqueta del triaje */
 function per(x,y,col,tag,cls){return '<g class="'+(cls||"")+'" transform="translate('+x+' '+y+')"><ellipse cx="0" cy="34" rx="15" ry="4" fill="#13213F" opacity=".14"/>'+
  '<rect x="-11" y="2" width="22" height="30" rx="10" fill="'+col+'" stroke="'+INK+'" stroke-width="2.4"/><circle cx="0" cy="-8" r="10" fill="#F2C9A0" stroke="'+INK+'" stroke-width="2.4"/>'+
  (tag?'<rect x="-8" y="10" width="16" height="10" rx="3" fill="'+tag+'" stroke="'+INK+'" stroke-width="1.8"/>':'')+'</g>'}
 /* escenas de urgencias: cada una es un grupo que se enciende con su etapa */
 var SCENES={
  llegada:function(){return '<g class="ex-sc" data-s="llegada">'+
    '<g class="ex-in-r"><rect x="210" y="40" width="120" height="110" rx="10" fill="#F3F1EA" stroke="'+INK+'" stroke-width="3"/><rect x="210" y="40" width="120" height="22" rx="8" fill="#E2434B" stroke="'+INK+'" stroke-width="3"/>'+
    '<text x="270" y="56" text-anchor="middle" font-size="13" font-weight="800" fill="#fff">URGENCIAS</text><rect x="252" y="104" width="36" height="46" rx="4" fill="#BFE3F5" stroke="'+INK+'" stroke-width="3"/>'+
    '<path d="M232 76h16M240 68v16" stroke="#E2434B" stroke-width="5" stroke-linecap="round"/></g>'+
    '<g class="ex-walk">'+per(70,110,"#5B8FD6")+'</g></g>'},
  triaje:function(){return '<g class="ex-sc" data-s="triaje">'+
    '<g class="ex-pop" style="--d:0s">'+per(90,100,"#8FA0B5","#E2434B")+'</g><g class="ex-pop" style="--d:.25s">'+per(170,100,"#8FA0B5","#F2C14E")+'</g><g class="ex-pop" style="--d:.5s">'+per(250,100,"#8FA0B5","#58B05A")+'</g>'+
    '<g class="ex-pop" style="--d:.9s"><text x="90" y="170" text-anchor="middle" font-size="13" font-weight="800" fill="#B0303A">Ya</text><text x="170" y="170" text-anchor="middle" font-size="13" font-weight="800" fill="#9A7414">Pronto</text><text x="250" y="170" text-anchor="middle" font-size="13" font-weight="800" fill="#2F7A33">Espera</text></g></g>'},
  abc:function(){var L=[["Aire",'M-10 6c0-12 4-18 10-18s10 6 10 18M0-12v-8'],["Respira",'M-14 2c4-14 10-14 14 0c4-14 10-14 14 0M-14 14h28'],["Sangre y pulso",'M-14 0h8l4-10 6 20 4-10h6']];
   return '<g class="ex-sc" data-s="abc">'+L.map(function(q,i){var x=62+i*118;/* más separación: «2. Respira» y «3. Sangre y pulso» se encimaban */return '<g transform="translate('+x+' 90)"><g class="ex-pop" style="--d:'+(i*.7)+'s"><circle r="34" fill="#FFF8EA" stroke="'+INK+'" stroke-width="3"/>'+ic(q[1],3.4)+
    '<g class="ex-chk" style="--d:'+(i*.7+.4)+'s"><circle cx="24" cy="-24" r="11" fill="#58B05A" stroke="'+INK+'" stroke-width="2.4"/>'+'<path d="M19 -24l4 4 7-8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>'+
    '<text y="56" text-anchor="middle" font-size="12.5" font-weight="800" fill="'+INK+'">'+(i+1)+'. '+q[0]+'</text></g></g>'}).join("")+'</g>'},
  estudios:function(){return '<g class="ex-sc" data-s="estudios">'+
    '<g class="ex-pop" style="--d:0s"><rect x="40" y="50" width="150" height="96" rx="12" fill="#1F3B57" stroke="'+INK+'" stroke-width="3"/><g class="ex-ecg"><path d="M52 100h28l8-24 10 46 10-34 6 12h64" fill="none" stroke="#7CF2C8" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></g></g>'+
    '<g transform="translate(250 70)"><g class="ex-pop" style="--d:.5s"><rect x="-12" y="0" width="24" height="70" rx="12" fill="#FFFFFF" stroke="'+INK+'" stroke-width="3"/><rect x="-10" y="36" width="20" height="32" rx="10" fill="#E2434B"/><rect x="-16" y="-6" width="32" height="10" rx="4" fill="#8AB8FF" stroke="'+INK+'" stroke-width="2.4"/></g></g>'+
    '<g class="ex-pop" style="--d:1s"><text x="250" y="168" text-anchor="middle" font-size="12" font-weight="800" fill="'+INK+'">¿Qué pregunta contesta?</text></g></g>'},
  decision:function(){return '<g class="ex-sc" data-s="decision">'+per(180,60,"#5B8FD6","#F2C14E")+
    '<g class="ex-pop" style="--d:.3s">'+ic("M165 110L95 145",4)+ic("M195 110L265 145",4)+'</g>'+
    '<g class="ex-pop" style="--d:.7s"><rect x="40" y="140" width="110" height="34" rx="12" fill="#FFF8EA" stroke="'+INK+'" stroke-width="3"/><text x="95" y="162" text-anchor="middle" font-size="12.5" font-weight="800" fill="'+INK+'">Se queda</text></g>'+
    '<g class="ex-pop" style="--d:1s"><rect x="210" y="140" width="110" height="34" rx="12" fill="#FFF8EA" stroke="'+INK+'" stroke-width="3"/><text x="265" y="162" text-anchor="middle" font-size="12.5" font-weight="800" fill="'+INK+'">A su casa</text></g></g>'},
  seguimiento:function(){return '<g class="ex-sc" data-s="seguimiento">'+
    '<g class="ex-pop" style="--d:0s"><rect x="110" y="40" width="140" height="120" rx="12" fill="#FFF8EA" stroke="'+INK+'" stroke-width="3"/><rect x="110" y="40" width="140" height="26" rx="10" fill="#3F7DA6" stroke="'+INK+'" stroke-width="3"/>'+
    [0,1,2].map(function(r){return [0,1,2,3].map(function(c){return '<rect x="'+(124+c*30)+'" y="'+(78+r*26)+'" width="22" height="18" rx="4" fill="#fff" stroke="'+INK+'" stroke-width="1.6"/>'}).join("")}).join("")+'</g>'+
    '<g class="ex-chk" style="--d:.8s"><circle cx="248" cy="136" r="18" fill="#58B05A" stroke="'+INK+'" stroke-width="2.6"/><path d="M239 136l6 6 11-12" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g></g>'}
 };
 function icon(n){var P={prev:'M15 6l-6 6 6 6',next:'M9 6l6 6-6 6',play:'M8 5v14l11-7z',pause:'M8 5v14M16 5v14',again:'M4 12a8 8 0 1 0 3-6.2M4 4v5h5',snd:'M4 9v6h4l5 4V5L8 9z M17 8a5 5 0 0 1 0 8',mute:'M4 9v6h4l5 4V5L8 9z M17 9l5 6M22 9l-5 6'};
  return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+P[n]+'" fill="'+(n==="play"?"currentColor":"none")+'" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'}
 /* registra en el dispositivo qué formatos se completan y cuáles se saltan */
 function track(fmt,what){try{var k="vocatlas_fmt",o=JSON.parse(localStorage.getItem(k)||"{}");o[fmt]=o[fmt]||{};o[fmt][what]=(o[fmt][what]||0)+1;localStorage.setItem(k,JSON.stringify(o))}catch(e){}}
 function mount(box,g){
  var n=g.etapas.length,i=0,playing=false,gen=0;
  box.classList.add("ex");box.innerHTML='<div class="ex-head"><b>'+esc(g.titulo)+'</b><span class="ex-rev">'+(g.revisar==="medico"?"Por revisar con un médico":"")+'</span></div>'+
   '<div class="ex-stage"><svg class="ex-svg" viewBox="0 0 360 190" role="img" aria-label="'+esc(g.titulo)+'">'+g.etapas.map(function(e){return (SCENES[e.escena]||function(){return ""})()}).join("")+'</svg>'+
   '<div class="ex-rb">'+rumboEl()+'</div></div><div class="ex-say"></div>'+
   '<div class="ex-bar" aria-hidden="true">'+g.etapas.map(function(){return '<i></i>'}).join("")+'</div>'+
   '<div class="ex-ctl"><button type="button" class="ex-b" data-a="prev" aria-label="Etapa anterior">'+icon("prev")+'</button><button type="button" class="ex-b ex-main" data-a="play" aria-label="Escuchar la explicación">'+icon("play")+'</button><button type="button" class="ex-b" data-a="next" aria-label="Etapa siguiente">'+icon("next")+'</button>'+
   '<button type="button" class="ex-b" data-a="again" aria-label="Repetir desde el principio">'+icon("again")+'</button><button type="button" class="ex-b" data-a="snd" aria-label="Silenciar a Rumbo" aria-pressed="false">'+icon("snd")+'</button>'+
   '<select class="ex-rate" aria-label="Velocidad de la voz"><option value=".85">Lenta</option><option value="1">Normal</option><option value="1.15">Rápida</option></select><button type="button" class="ex-skip" data-a="skip">Saltar</button></div>'+
   '<details class="ex-log"><summary>Leer todo lo que dice Rumbo</summary><ol>'+g.etapas.map(function(e){return '<li>'+esc(e.dice)+'</li>'}).join("")+'</ol></details>'+
   '<div class="ex-q" hidden></div>';
  var stage=box.querySelector(".ex-say"),rbw=box.querySelector(".ex-rb"),rb=rbw.querySelector(".rb"),bars=box.querySelectorAll(".ex-bar i"),scs=box.querySelectorAll(".ex-sc"),bPlay=box.querySelector('[data-a="play"]'),bSnd=box.querySelector('[data-a="snd"]'),rate=box.querySelector(".ex-rate");
  rate.value=String(VOZ.P.rate);
  function sndUI(){bSnd.innerHTML=icon(VOZ.P.mute?"mute":"snd");bSnd.setAttribute("aria-pressed",VOZ.P.mute?"true":"false");bSnd.setAttribute("aria-label",VOZ.P.mute?"Activar la voz de Rumbo":"Silenciar a Rumbo")}sndUI();
  function show(k){i=Math.max(0,Math.min(n-1,k));for(var a=0;a<scs.length;a++){scs[a].classList.toggle("on",a===i);if(a===i){/* reinicia sus animaciones */scs[a].classList.remove("go");void scs[a].getBoundingClientRect();scs[a].classList.add("go")}}
   for(var b=0;b<bars.length;b++)bars[b].className=b<i?"done":b===i?"cur":""}
  function setPlay(p){playing=p;bPlay.innerHTML=icon(p?"pause":"play");bPlay.setAttribute("aria-label",p?"Pausa":"Seguir")}
  function run(k){var my=++gen;show(k);var e=g.etapas[i];
   VOZ.say({id:e.id,dice:e.dice},rb,stage).then(function(){if(my!==gen||!playing)return;
    /* sin sonido se avanza al tocar "Siguiente"; con sonido, sigue solo */
    if(VOZ.P.mute){box.querySelector('[data-a="next"]').classList.add("pulse");setPlay(false);return}
    setTimeout(function(){if(my!==gen||!playing)return;if(i<n-1)run(i+1);else end()},650)})}
  function end(){setPlay(false);gen++;track("animada","terminada");ask()}
  function ask(){var q=g.pregunta,qb=box.querySelector(".ex-q");if(!q)return;qb.hidden=false;
   qb.innerHTML='<p class="ex-qt">'+esc(q.texto)+'</p>'+q.opciones.map(function(o,k){return '<button type="button" class="ex-op" data-k="'+k+'">'+esc(o)+'</button>'}).join("");
   qb.querySelectorAll(".ex-op").forEach(function(b){b.onclick=function(){var k=+b.getAttribute("data-k"),ok=k===q.correcta;qb.querySelectorAll(".ex-op").forEach(function(x){x.disabled=true;var kk=+x.getAttribute("data-k");x.classList.toggle("is-ok",kk===q.correcta);x.classList.toggle("is-no",kk===k&&!ok)});
    var L=ok?q.bien:q.mal;mood(rb,ok?"joy":"sadhope",ok?"jump":"tilt");VOZ.say(L,rb,stage)}})}
  show(0);
  box.addEventListener("click",function(ev){var b=ev.target.closest("[data-a]");if(!b)return;var a=b.getAttribute("data-a");box.querySelector('[data-a="next"]').classList.remove("pulse");
   if(a==="play"){if(playing){setPlay(false);gen++;VOZ.stop();track("animada","pausa")}else{setPlay(true);track("animada","abierta");run(i)}}
   else if(a==="next"){if(i<n-1){setPlay(true);run(i+1)}else{VOZ.stop();end()}}
   else if(a==="prev"){setPlay(true);run(i-1)}
   else if(a==="again"){box.querySelector(".ex-q").hidden=true;setPlay(true);run(0)}
   else if(a==="snd"){VOZ.setMute(!VOZ.P.mute);sndUI();if(playing)run(i)}
   else if(a==="skip"){gen++;VOZ.stop();setPlay(false);track("animada","saltada");show(n-1);ask()}});
  rate.onchange=function(){VOZ.setRate(+rate.value)};
  return {stop:function(){gen++;VOZ.stop()}}}
 return {mount:mount,SCENES:SCENES,track:track};
})();

/* ================= video real =================
   Vertical, de 30 a 90 s, subtítulos siempre activados, miniatura, velocidad y transcripción.
   Se descarga solo al abrirlo (preload none). Sin grabación todavía: estado vacío con Rumbo. */
function videoHTML(v){v=v||{};
 if(!v.src)return '<div class="vd vd-empty"><div class="vd-ph" aria-hidden="true"><div class="vd-rb">'+rumboEl()+'</div><svg viewBox="0 0 24 24" class="vd-cam"><path d="M3 7h12v10H3zM15 10l6-3v10l-6-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg></div>'+
  '<b>'+esc(v.titulo||"Video")+'</b><p>Este video llega pronto. Lo estamos grabando con '+esc(v.quien||"alguien que estudia o ejerce la carrera")+'.</p></div>';
 return '<div class="vd"><video playsinline controls preload="none" poster="'+esc(v.poster||"")+'"><source src="'+esc(v.src)+'"><track kind="captions" srclang="es" label="Español" src="'+esc(v.vtt||"")+'" default></video>'+
  '<div class="vd-ctl"><label>Velocidad <select class="vd-rate"><option value=".75">0.75×</option><option value="1" selected>1×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option></select></label></div>'+
  '<details class="vd-tr"><summary>Leer la transcripción</summary><p>'+esc(v.transcripcion||"")+'</p></details></div>'}
function videoBind(root){root.querySelectorAll(".vd").forEach(function(d){var v=d.querySelector("video"),r=d.querySelector(".vd-rate");if(v&&r)r.onchange=function(){v.playbackRate=+r.value};
 if(v){v.addEventListener("play",function(){EXPL.track("video","abierto")});v.addEventListener("ended",function(){EXPL.track("video","terminado")});if(v.textTracks&&v.textTracks[0])v.textTracks[0].mode="showing"}})}
