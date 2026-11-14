/* ================= mapa personal =================
   El mapa se arma solo con las carreras que el estudiante elige (S.pick). Aquí viven: el avance por carrera,
   la pantalla de elección, agregar y quitar carreras en vivo, la celebración al completar una y el Atlas.
   El avance de una carrera quitada no se borra: sigue en S.res, S.rate, S.st y S.chest. */
function picked(id){return S.pick.indexOf(id)>-1}
function MC(){return C.filter(function(c){return S.pick.indexOf(c.id)>-1})}
/* lecciones que hoy tienen contenido; las que "llegan pronto" no cuentan para el avance */
var LESS=[["hace","Qué haces"],["reto","Mini reto"],["c1","Cofre de la unidad"],["veredicto","Tu veredicto"]];
function lessDone(id,k){return k==="hace"?!!(S.st[id]&&S.st[id].hace):k==="reto"?!!S.res[id]:k==="c1"?!!(S.chest&&S.chest[id+":c1"]):S.rate[id]!=null}
function progOf(id){var d=0;LESS.forEach(function(l){if(lessDone(id,l[0]))d++});return {done:d,total:LESS.length,p:d/LESS.length}}
function nextLesson(id){for(var i=0;i<LESS.length;i++)if(!lessDone(id,LESS[i][0]))return LESS[i][1];return null}
/* claridad: cuánto llevas explorado de tus carreras. Con menos de tres se mide contra tres, porque comparar pide al menos tres */
function clarity(){var cs=MC(),s=0;cs.forEach(function(c){s+=progOf(c.id).p});return Math.round(s/Math.max(3,cs.length)*100)}

var AREA_ORDER=["salud","ing","tec","neg","arte"];
var AREA_COL={salud:"#3F9C7A",ing:"#E0843F",tec:"#3F7DA6",neg:"#C99A2E",arte:"#9E86BF"};
function inArea(a){return C.filter(function(c){return c.area===a})}
function areaScore(a){var sc=inArea(a).filter(function(c){return picked(c.id)}).map(function(c){return scoreOf(c.id)});if(!sc.length)return null;var mx=Math.max.apply(null,sc),mean=sc.reduce(function(x,y){return x+y},0)/sc.length;return Math.round(mx*.6+mean*.4)}
function topCareer(){
 var best=null,bs=-1,L=MC();if(!L.length)L=C;
 L.forEach(function(c){var s=scoreOf(c.id)+(hasData(c.id)?.5:0)+AFF[c.id].aff*.01;if(s>bs){bs=s;best=c}});
 return best;
}
function backOut(t){var c1=1.3,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2)}
function tween(dur,fn,done){
 if(RM()){fn(1);if(done)done();return}
 var t0=performance.now();
 (function f(now){var t=Math.min(1,(now-t0)/dur);fn(t);if(t<1)requestAnimationFrame(f);else if(done)done()})(t0);
}

/* ---------- ilustraciones pequeñas: una sola copia de cada una (color y gris) y se reutilizan con <use> ---------- */
var ARTOK=false;
function artDefs(){
 if(ARTOK)return;ARTOK=true;isoDefs();
 var h="";
 C.forEach(function(c){
  var mk=function(){return typeof ART!=="undefined"&&ART.has(c.id)?ART.get(c.id,0,ART.pick(c.id)):'<circle cx="0" cy="-30" r="34" fill="'+c.color+'"/>'};
  h+='<g id="ad-'+c.id+'">'+mk()+'</g><g id="ad-'+c.id+'-g">'+(typeof ISO!=="undefined"?ISO.greyAll(mk()):mk())+'</g>';
 });
 var d=document.createElement("div");d.innerHTML='<svg id="artSprite" width="0" height="0" style="position:absolute" aria-hidden="true"><defs>'+h+'</defs></svg>';
 document.body.appendChild(d.firstChild);
}
/* p: avance de 0 a 1; mezcla gris y color igual que el mapa */
function artSVG(id,p){
 p=p==null?1:p;
 return '<svg class="ar" viewBox="-58 -84 116 116" aria-hidden="true">'+(p<1?'<use href="#ad-'+id+'-g"/>':'')+(p>0?'<use href="#ad-'+id+'"'+(p<1?' opacity="'+p.toFixed(2)+'"':'')+'/>':'')+'</svg>';
}
function shortName(c){return c.name.replace(/^Ing\. /,"")}

/* ---------- vista previa del mapa en miniatura ---------- */
function miniMap(ids){
 if(!ids.length||typeof MAPGEN==="undefined")return '<svg viewBox="0 0 72 52" aria-hidden="true"><ellipse cx="36" cy="28" rx="18" ry="9" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="4 4" opacity=".8"/></svg>';
 var FULL=ISOFIX.catalog(20),W=MAPGEN.build(FULL.filter(function(c){return ids.indexOf(c.id)>-1}),ISOFIX.AREAS,{stable:true,full:FULL}),P=ISO.P,b=[1e9,1e9,-1e9,-1e9],h="";
 function d(pts,z){return "M"+pts.map(function(p){var q=P(p[0],p[1],z);b[0]=Math.min(b[0],q[0]);b[1]=Math.min(b[1],q[1]);b[2]=Math.max(b[2],q[0]);b[3]=Math.max(b[3],q[1]);return q[0].toFixed(0)+" "+q[1].toFixed(0)}).join("L")+"Z"}
 W.islands.forEach(function(L){h+='<path d="'+d(L.coast,0)+'" fill="#F4DFA6" stroke="#F4DFA6" stroke-width="14" stroke-linejoin="round"/>'});
 W.islands.forEach(function(L){h+='<path d="'+d(L.plateau,8)+'" fill="'+ISOMAP.grass(L.area.biome)+'"/>';
  L.nodes.forEach(function(n){var q=P(n.x,n.y,8);h+='<circle cx="'+q[0].toFixed(0)+'" cy="'+q[1].toFixed(0)+'" r="30" fill="'+n.c.color+'" stroke="#FFFFFF" stroke-width="9"/>'})});
 var w=b[2]-b[0],hh=b[3]-b[1],pad=Math.max(w,hh)*.14+30;
 /* misma proporción que el recuadro, para que no se recorte */
 var vw=w+2*pad,vh=hh+2*pad;if(vw/vh<72/52){var nw=vh*72/52;b[0]-=(nw-vw)/2;vw=nw}else{var nh=vw*52/72;b[1]-=(nh-vh)/2;vh=nh}
 return '<svg viewBox="'+(b[0]-pad).toFixed(0)+" "+(b[1]-pad).toFixed(0)+" "+vw.toFixed(0)+" "+vh.toFixed(0)+'" aria-hidden="true">'+h+'</svg>';
}

/* ================= pantalla de elección de carreras ================= */
var PK={mode:"new",sel:[],q:"",area:"",mt:0};
function recoList(){
 var l=C.slice().sort(function(a,b){return AFF[b.id].score-AFF[a.id].score||(a.id<b.id?-1:1)}),top=l.filter(function(c){return AFF[c.id].score>0}).slice(0,5);
 /* sin coincidencias suficientes: una de cada área, para empezar variado */
 AREA_ORDER.forEach(function(a){var c=inArea(a)[0];if(top.length<3&&top.indexOf(c)<0)top.push(c)});
 return top;
}
function whyReco(c){
 var m=AFF[c.id].matches;
 return m.length?"Coincide con: "+m.slice(0,3).map(function(x){return x.charAt(0).toLowerCase()+x.slice(1)}).join(", "):"Para asomarte a "+AREAS[c.area].n.toLowerCase();
}
function pkCard(c,why){
 var on=PK.sel.indexOf(c.id)>-1;
 return '<button type="button" class="pk-card" role="checkbox" aria-checked="'+(on?"true":"false")+'" data-id="'+c.id+'" data-a="'+c.area+'" data-h="'+esc(normQ(c.name+" "+AREAS[c.area].n+" "+c.tags.split(" ").map(function(t){return LAB[t]||t}).join(" ")))+'">'+
  '<span class="pk-art">'+artSVG(c.id,1)+'</span><b>'+esc(c.name)+'</b><small>'+esc(AREAS[c.area].n)+'</small>'+(why?'<em class="pk-why">'+esc(why)+'</em>':'')+
  '<span class="pk-ck" aria-hidden="true">'+ico("check")+'</span></button>';
}
function openPicker(mode,area){
 computeAff();artDefs();
 var el=$("#pick"),reco=recoList(),inApp=$("#app").classList.contains("on");
 if(mode==="edit"&&!inApp)mode="new";
 PK.mode=mode;PK.q="";PK.area=area&&AREAS[area]?area:"";
 PK.sel=(mode==="new"&&!S.pick.length)?reco.slice(0,3).map(function(c){return c.id}):S.pick.slice();
 var sub=mode==="edit"?"Marca las que quieras agregar y desmarca las que quieras quitar. Tu avance se guarda.":
  mode==="migra"?"Tu mapa ahora es personal: solo muestra las carreras que tú eliges. Ya marcamos las que tenías con avance. Ajusta lo que quieras.":
  "Tu mapa se arma solo con estas. Después puedes agregar o quitar las que quieras.";
 var h='<div class="pk"><header class="pk-top"><div class="pk-topin">'+
  (mode==="migra"?'':'<button type="button" class="ui-iconbtn" id="pkBack" aria-label="'+(mode==="edit"?"Cerrar sin cambios":"Regresar a tus temas")+'">'+ico(mode==="edit"?"x":"back")+'</button>')+
  '<div class="pk-tt"><h1>Elige las carreras que quieres explorar</h1><p>'+sub+'</p></div></div></header>'+
  '<div class="pk-scroll" id="pkScroll"><div class="pk-in">'+
  '<div class="pk-tools"><label class="pk-search">'+ico("search")+'<input id="pkQ" type="search" inputmode="search" enterkeyhint="search" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Buscar carrera" aria-label="Buscar carrera"></label>'+
  '<div class="pk-filters" role="group" aria-label="Filtrar por área"><button type="button" class="ui-chip" data-f="" aria-pressed="'+(PK.area?"false":"true")+'">Todas</button>'+
  AREA_ORDER.map(function(a){return '<button type="button" class="ui-chip" data-f="'+a+'" aria-pressed="'+(PK.area===a?"true":"false")+'" style="--chip:'+AREA_COL[a]+'"><i class="pk-dot"></i>'+esc(AREAS[a].n)+'</button>'}).join("")+'</div></div>'+
  '<section class="pk-sec" id="pkReco"><h2>'+ico("starF")+'Recomendadas para ti</h2><div class="pk-grid">'+reco.map(function(c){return pkCard(c,whyReco(c))}).join("")+'</div></section>'+
  AREA_ORDER.map(function(a){return '<section class="pk-sec" data-sec="'+a+'" style="--c:'+AREA_COL[a]+'"><h2><i class="pk-dot"></i>'+esc(AREAS[a].n)+'</h2><div class="pk-grid">'+inArea(a).map(function(c){return pkCard(c)}).join("")+'</div></section>'}).join("")+
  '<p class="pk-empty" id="pkEmpty" hidden>No encontramos esa carrera. Prueba con otra palabra o quita el filtro.</p>'+
  '</div></div>'+
  '<footer class="pk-bar"><div class="pk-barin"><div class="pk-mini" id="pkMini"></div><div class="pk-ct" aria-live="polite"><b id="pkN"></b><span id="pkMsg"></span></div>'+
  '<button type="button" class="ui-btn" id="pkGo">'+(mode==="edit"?"Actualizar mi mapa":"Crear mi mapa")+ico("next")+'</button></div></footer></div>';
 el.innerHTML=h;
 el.classList.remove("leaving");el.classList.add("on");
 if(!RM())restart(el,"pk-enter");
 each(el.querySelectorAll(".pk-card"),function(b){b.onclick=function(){pkToggle(b.getAttribute("data-id"))}});
 each(el.querySelectorAll(".pk-filters .ui-chip"),function(b){b.onclick=function(){PK.area=b.getAttribute("data-f");each(el.querySelectorAll(".pk-filters .ui-chip"),function(x){x.setAttribute("aria-pressed",x===b?"true":"false")});pkFilter()}});
 $("#pkQ").oninput=function(){PK.q=normQ(this.value);pkFilter()};
 $("#pkGo").onclick=pkConfirm;
 var bk=$("#pkBack");if(bk)bk.onclick=function(){
  if(PK.mode==="edit"){closePicker();return}
  el.classList.remove("on");FL.fromFlow=true;$("#quiz").classList.add("on");$(".qscroll").scrollTop=0;renderQuiz();
 };
 pkFilter();pkBar(true);
}
function closePicker(){
 var el=$("#pick");if(!el.classList.contains("on"))return;
 if(RM()){el.classList.remove("on");el.innerHTML="";return}
 el.classList.add("leaving");setTimeout(function(){el.classList.remove("on","leaving");el.innerHTML=""},T.med);
}
function pkToggle(id){
 var i=PK.sel.indexOf(id),on=i<0;if(on)PK.sel.push(id);else PK.sel.splice(i,1);
 each(document.querySelectorAll('#pick .pk-card[data-id="'+id+'"]'),function(b){b.setAttribute("aria-checked",on?"true":"false");if(!RM())restart(b,on?"pop":"unpop")});
 sfx("tap");pkBar();
}
function pkFilter(){
 var any=false;
 each(document.querySelectorAll("#pick .pk-sec"),function(sec){
  var n=0;each(sec.querySelectorAll(".pk-card"),function(b){var ok=(!PK.area||b.getAttribute("data-a")===PK.area)&&(!PK.q||b.getAttribute("data-h").indexOf(PK.q)>-1);b.hidden=!ok;if(ok)n++});
  sec.hidden=!n;if(n)any=true;
 });
 $("#pkEmpty").hidden=any;
}
function pkBar(now){
 var n=PK.sel.length,go=$("#pkGo");
 $("#pkN").textContent=n===0?"Ninguna carrera":n===1?"1 carrera":n+" carreras";
 $("#pkMsg").textContent=n===0?"Elige al menos una para continuar.":n<3?"Buen comienzo. Con 3 a 6 se compara mejor.":n<=6?"¡Buena selección para empezar!":"Son bastantes. Ve a tu ritmo, sin prisa.";
 go.setAttribute("aria-disabled",n?"false":"true");
 clearTimeout(PK.mt);PK.mt=setTimeout(function(){var m=$("#pkMini");if(m){m.innerHTML=miniMap(PK.sel);if(!now&&!RM())restart(m,"pop")}},now?0:140);
}
function pkConfirm(){
 if(!PK.sel.length){restart($("#pkGo"),"shake");restart($("#pkMsg"),"pk-warn");return}
 var old=S.pick,add=PK.sel.filter(function(id){return old.indexOf(id)<0}),rem=old.filter(function(id){return PK.sel.indexOf(id)<0});
 if(PK.mode==="edit"&&rem.length){confirmRemove(rem,function(){pkApply(add,rem)});return}
 pkApply(add,rem);
}
/* confirmación dentro de la app: quitar no borra el avance */
function confirmRemove(rem,ok){
 var one=rem.length===1,nm=one?byId[rem[0]].name:rem.length+" carreras",el=document.createElement("div");
 el.className="ui-modal";el.setAttribute("role","alertdialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-labelledby","rmT");
 el.innerHTML=rumboEl()+'<h3 id="rmT">¿Quitar '+esc(nm)+' de tu mapa?</h3><p>'+(one?"Su avance se queda guardado en este dispositivo. Si la vuelves a agregar, regresa con su color y sus lecciones.":"Su avance se queda guardado en este dispositivo. Si las vuelves a agregar, regresan con su color y sus lecciones.")+
  '</p><div class="acts"><button type="button" class="ui-btn is-block" id="rmOk">'+(one?"Quitar del mapa":"Quitarlas del mapa")+'</button><button type="button" class="ui-btn is-block is-sec" id="rmNo">Mejor no</button></div>';
 var rb=el.querySelector(".rb");wireRumbo(rb);rb.setAttribute("data-mood","think");
 var close=uiLayer(el,true);
 el.querySelector("#rmNo").onclick=close;
 el.querySelector("#rmOk").onclick=function(){close();ok()};
 setTimeout(function(){uiFocus(el.querySelector("#rmNo"))},60);
}
function pkApply(add,rem){
 var first=!S.pk||!$("#app").classList.contains("on"),sel=PK.sel.slice();
 S.pick=C.filter(function(c){return sel.indexOf(c.id)>-1}).map(function(c){return c.id});S.pk=1;save();
 if(first){making(function(){var el=$("#pick");el.classList.remove("on");el.innerHTML="";enterApp(false,true)});return}
 closePicker();
 if(curView==="yo")renderYo();if(curView==="probar")renderProbar();if(curView==="atlas")renderAtlas();
 if(add.length||rem.length)mapChange(add,rem);
}
/* Rumbo avisa que está armando el mapa */
function making(cb){
 var o=document.createElement("div");o.className="mk";o.setAttribute("role","status");
 o.innerHTML='<div class="mk-in">'+rumboEl("walk")+'<p>Estoy armando tu mapa…</p></div>';
 document.body.appendChild(o);void o.offsetWidth;o.classList.add("on");
 wireRumbo(o.querySelector(".rb"));
 setTimeout(function(){cb();setTimeout(function(){o.classList.remove("on");setTimeout(function(){o.remove()},RM()?0:420)},RM()?60:650)},RM()?0:1150);
}
/* las islas emergen del mar una por una y la cámara termina con el mapa completo */
function emergeMap(){
 if(RM()||!ISOW)return;
 var w=$("#world"),L=$("#mlayer"),n=ISOW.W.islands.length,f=fitAll(),tot=800+n*280+1000;
 w.style.setProperty("--en",n);L.style.setProperty("--en",n);
 w.classList.add("emerge");L.classList.add("emerge");box.classList.add("emerging");
 var s0=Math.min(SMAX,f.s*1.3),c=framing(WW/2,WH/2,s0);view.s=c.s;view.tx=c.tx;view.ty=c.ty;commit();apply();
 setTimeout(function(){RB.follow=false;animView(f.s,f.tx,f.ty,Math.max(1300,tot-700))},650);
 setTimeout(function(){
  w.classList.remove("emerge");L.classList.remove("emerge");box.classList.remove("emerging");
  if(RB.rb){mood(RB.rb,"happy","jump")}
  uiToast("¡Listo! Este es tu mapa.");
 },tot+650);
}
/* agregar y quitar en vivo: lo que se quita se hunde, el mapa se reacomoda y lo nuevo emerge */
function mapChange(add,rem){
 showView("map",true);hideHint();stopWalk();
 var w=$("#world");
 function rebuild(){
  var oldN={};if(ISOW)ISOW.W.islands.forEach(function(L){oldN[L.id]=L.nodes.filter(function(n){return rem.indexOf(n.id)<0}).length});
  var an=RB.at&&picked(RB.at)&&byId[RB.at].cx!=null?byId[RB.at]:null,sx,sy;if(an){sx=an.cx*view.s+view.tx;sy=an.cy*view.s+view.ty}
  if(!picked(RB.at)){RB.at=bestStart();S.at=RB.at;save();an=null}
  RB.el=null;buildMap();refreshMap();sizeSvg();
  if(an){view.tx=sx-an.cx*view.s;view.ty=sy-an.cy*view.s}else{var n0=NODES[RB.at],f0=framing(n0[0],n0[1]-28,view.s);view.tx=f0.tx;view.ty=f0.ty}
  commit();apply();updateHud(true);idleLook();
  if(!add.length||RM()){
   if(!RM()){var fa=fitAll();RB.follow=false;animView(fa.s,fa.tx,fa.ty,T.long)}
   uiToast(add.length?(add.length===1?"¡"+byId[add[0]].name+" ya está en tu mapa!":"¡Agregué "+add.length+" carreras a tu mapa!"):(rem.length===1?"Listo. Su avance queda guardado.":"Listo. Su avance queda guardado."));
   return;
  }
  w=$("#world");box.classList.add("emerging");
  ISOW.W.islands.forEach(function(L){
   var g=w.querySelector('.m-isle[data-a="'+L.id+'"]'),isNew=!oldN[L.id],grew=!isNew&&L.nodes.length>oldN[L.id];
   if(g)g.classList.add(isNew?"is-new":grew?"is-grow":"is-same");
   var ti=w.querySelector('.t-isle[data-a="'+L.id+'"]');if(ti)ti.classList.add(isNew?"is-new":grew?"is-grow":"is-same");
   if(isNew)each(w.querySelectorAll('.m-d[data-a="'+L.id+'"]'),function(e){e.classList.add("is-new")});
  });
  add.forEach(function(id,i){
   var g=document.getElementById("poi-"+id),r=refs[id];
   if(g){g.classList.add("is-new");g.style.setProperty("--dl",(650+i*230)+"ms")}
   if(r&&r.pin){r.pin.classList.add("is-new");r.pin.style.setProperty("--dl",(950+i*230)+"ms")}
   if(r&&r.g){r.g.classList.add("is-new");r.g.style.setProperty("--dl",(450+i*230)+"ms")}
  });
  var c0=byId[add[0]],f=framing(c0.cx,c0.cy-30,Math.max(.7,Math.min(1.05,view.s)));
  RB.follow=false;animView(f.s,f.tx,f.ty,T.long);
  setTimeout(function(){
   box.classList.remove("emerging");
   each(w.querySelectorAll(".is-new,.is-grow,.is-same"),function(e){e.classList.remove("is-new","is-grow","is-same")});
   each(document.querySelectorAll("#mlayer .is-new"),function(e){e.classList.remove("is-new")});
   if(add.length>1){var fa=fitAll();animView(fa.s,fa.tx,fa.ty,T.long)}
   if(RB.rb)mood(RB.rb,"happy","jump");
   uiToast(add.length===1?"¡"+byId[add[0]].name+" ya está en tu mapa!":"¡Agregué "+add.length+" carreras a tu mapa!");
  },1250+add.length*230);
 }
 if(rem.length&&!RM()&&ISOW&&refs[rem[0]]){
  var c=byId[rem[0]],f=framing(c.cx,c.cy-30,Math.max(.7,Math.min(1.05,view.s)));
  RB.follow=false;box.classList.add("emerging");
  animView(f.s,f.tx,f.ty,T.med,function(){
   rem.forEach(function(id){var g=document.getElementById("poi-"+id),r=refs[id];if(g)g.classList.add("is-sink");if(r&&r.pin)r.pin.classList.add("is-out");if(r&&r.g)r.g.classList.add("is-out")});
   ISOW.W.islands.forEach(function(L){if(L.nodes.every(function(n){return rem.indexOf(n.id)>-1}))each(w.querySelectorAll('[data-a="'+L.id+'"]'),function(e){e.classList.add("is-sink")})});
   if(rem.indexOf(RB.at)>-1&&RB.el)RB.el.classList.add("hide");
   setTimeout(function(){box.classList.remove("emerging");rebuild()},820);
  });
 }else rebuild();
}
$("#addCar").onclick=function(){openPicker("edit")};

/* ---------- sello y celebración al completar una carrera ---------- */
function stampHTML(c,on){
 artDefs();
 return '<div class="stp'+(on?'':' is-off')+'" style="--c:'+c.color+'"><svg class="stp-r" viewBox="0 0 100 100" aria-hidden="true"><circle class="stp-i" cx="50" cy="50" r="44"/><circle class="stp-o" cx="50" cy="50" r="46"/><circle class="stp-o2" cx="50" cy="50" r="39"/></svg>'+artSVG(c.id,on?1:0)+'</div>';
}
function celebrate(id){
 var c=byId[id];if(!c||curView!=="map"||plazaId)return;
 if(RB.rb){mood(RB.rb,"happy","jump");burst(RB.rb)}
 var el=document.createElement("div");el.className="ui-modal cel";el.setAttribute("role","alertdialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-labelledby","celT");
 el.innerHTML='<div class="cel-top">'+rumboEl("cheer")+'<div class="stp-cell is-new" style="--k:0">'+stampHTML(c,true)+'</div></div><h3 id="celT">¡'+esc(c.name)+' completa!</h3><p>Terminaste todas sus lecciones y ya se ve a todo color. Su sello está en tu pasaporte.</p><div class="acts"><button type="button" class="ui-btn is-block is-ok">¡Vamos!</button></div>';
 var rb=el.querySelector(".rb");wireRumbo(rb);rb.setAttribute("data-mood","happy");
 S.stp[id]=1;save();sfx("ok");
 var close=uiLayer(el,true);el.querySelector(".ui-btn").onclick=close;
 setTimeout(function(){uiFocus(el.querySelector(".ui-btn"))},60);
}
/* abrir el camino de lecciones de una carrera desde cualquier pestaña */
function openCareer(id){
 if(!picked(id)||plazaId)return;
 showView("map",true);stopWalk();hideHint();
 RB.at=id;S.at=id;save();var n=NODES[id];RB.x=n[0];RB.y=n[1];
 var f=framing(n[0],n[1]-28,Math.max(view.s,.8));view.s=f.s;view.tx=f.tx;view.ty=f.ty;apply();
 enterPlaza(id);
}

/* ================= Atlas =================
   Resumen del viaje en cuatro bloques: claridad, dónde seguir, tus carreras y tu brújula.
   El pasaporte de sellos y el informe quedan a un toque. */
function contCareer(){
 var L=MC().filter(function(c){return progOf(c.id).p<1});if(!L.length)return null;
 var at=S.at&&picked(S.at)&&progOf(S.at).p<1?byId[S.at]:null;
 if(at&&progOf(at.id).done)return at;
 L.sort(function(a,b){return progOf(b.id).p-progOf(a.id).p||AFF[b.id].score-AFF[a.id].score});
 return progOf(L[0].id).done?L[0]:(at||L[0]);
}
function whyOf(id){
 var parts=[],m=AFF[id].matches.length,pg=progOf(id);
 if(S.rate[id]!=null)parts.push("le pusiste "+S.rate[id]+" de 10");
 if(S.res[id])parts.push({yes:"su reto te encendió",mid:"su reto te gustó más o menos",no:"su reto no fue lo tuyo"}[S.res[id]]);
 if(m)parts.push("coincide con "+m+(m===1?" tema tuyo":" temas tuyos"));
 if(pg.p>=1)parts.push("ya la exploraste completa");
 parts=parts.slice(0,3);if(!parts.length)return "";
 var t=parts.length>1?parts.slice(0,-1).join(", ")+" y "+parts[parts.length-1]:parts[0];
 return t.charAt(0).toUpperCase()+t.slice(1)+".";
}
function ranked(){return MC().filter(function(c){return hasData(c.id)}).sort(function(a,b){return scoreOf(b.id)-scoreOf(a.id)||(a.id<b.id?-1:1)}).slice(0,3)}
function earnedStamps(){return C.filter(function(c){return progOf(c.id).p>=1})}
function renderAtlas(){
 artDefs();
 var v=$("#v-atlas"),cs=MC(),cl=clarity(),nx=contCareer(),top=ranked(),CIRC=314.16;
 var h='<div class="vwrap at">';
 /* 1. saludo y claridad */
 h+='<header class="at-head at-in" style="--i:0"><div class="at-hi"><h2>'+(S.nick?"Hola, "+esc(S.nick):"Hola")+'</h2><p>La claridad es cuánto llevas explorado de tus carreras. Sube con cada lección.</p></div>'+
  '<div class="at-ring" role="img" aria-label="Claridad vocacional: '+cl+' por ciento"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="tr" cx="60" cy="60" r="50"/><circle class="arc" id="atArc" cx="60" cy="60" r="50" stroke-dasharray="'+CIRC+'" stroke-dashoffset="'+CIRC+'"/></svg><div class="at-rn"><b class="num" id="atPct">0<i>%</i></b><span>claridad</span></div></div></header>';
 /* 2. sigue donde te quedaste */
 if(nx){var pg=progOf(nx.id);
  h+='<section class="ui-card at-next at-in" style="--i:1"><div class="at-nx-top"><span class="at-nx-art">'+artSVG(nx.id,pg.p)+'</span><div class="at-nx-t"><div class="at-eb">'+(pg.done?"Sigue donde te quedaste":"Empieza por aquí")+'</div><h3>'+esc(nx.name)+'</h3><p>'+(pg.done?"Sigue: ":"Primera lección: ")+esc(nextLesson(nx.id))+'</p></div></div>'+
   '<div class="at-pr"><div class="ui-prog" data-v="'+pg.p+'" role="img" aria-label="'+pg.done+' de '+pg.total+' lecciones"><i></i></div><span class="num">'+pg.done+'/'+pg.total+'</span></div>'+
   '<button type="button" class="ui-btn is-block" id="atGo" data-id="'+nx.id+'">'+(pg.done?"Continuar":"Empezar")+ico("next")+'</button></section>';
 }else{
  h+='<section class="ui-card at-next at-in" style="--i:1"><div class="at-nx-top"><span class="at-nx-rb">'+rumboEl("cheer")+'</span><div class="at-nx-t"><div class="at-eb">Mapa completo</div><h3>Exploraste todas tus carreras</h3><p>'+(S.pick.length<C.length?"Agrega otra para seguir comparando.":"Revisa tu brújula y tu informe.")+'</p></div></div>'+
   (S.pick.length<C.length?'<button type="button" class="ui-btn is-block" id="atAddMain">Agregar carrera'+ico("plus")+'</button>':'')+'</section>';
 }
 /* 3. tus carreras */
 h+='<section class="at-sec at-in" style="--i:2"><div class="at-sh"><h3>Tus carreras</h3><button type="button" class="at-link" id="atEdit">Editar</button></div><div class="at-row">'+
  cs.map(function(c){var p=progOf(c.id),d=S.res[c.id];
   return '<button type="button" class="at-cc" data-id="'+c.id+'" aria-label="'+esc(c.name)+', '+Math.round(p.p*100)+' por ciento'+(d?', '+R[d].toLowerCase():'')+'"><span class="at-cc-art">'+artSVG(c.id,p.p)+(p.p>=1?'<span class="at-seal">'+ico("check")+'</span>':'')+'</span><b>'+esc(shortName(c))+'</b><div class="ui-prog" data-v="'+p.p+'"><i></i></div><span class="at-cc-re'+(d?' r-'+d:'')+'">'+(d?IC[d]+R[d]:"Sin reacción")+'</span></button>'}).join("")+
  (S.pick.length<C.length?'<button type="button" class="at-cc is-add" id="atAdd">'+ico("plus")+'Agregar</button>':'')+'</div></section>';
 /* 4. tu brújula */
 h+='<section class="at-sec at-in" style="--i:3"><div class="at-sh"><h3>Tu brújula</h3></div>';
 if(!top.length)h+='<div class="at-empty">'+rumboEl()+'<div><b>Todavía no apunta a ningún lado</b><p>Haz el mini reto de una carrera y di qué te pareció. Con eso empieza a moverse.</p></div></div>';
 else{
  h+='<ol class="at-top">'+top.map(function(c,i){return '<li><button type="button" class="at-tp" data-id="'+c.id+'" style="--c:'+c.color+';--ct:'+(lum(c.color)>.62?"#14323F":"#FFFFFF")+'"><span class="at-rk">'+(i+1)+'</span><span class="at-tpt"><b>'+esc(c.name)+'</b><span>'+esc(whyOf(c.id))+'</span></span><span class="at-sc num">'+scoreOf(c.id)+'<i>%</i></span></button></li>'}).join("")+'</ol>';
  if(top.length<3)h+='<p class="at-note">Te falta'+(3-top.length===1?" probar 1 carrera":" probar "+(3-top.length)+" carreras")+' para tener tu top 3.</p>';
 }
 h+='</section>';
 /* detrás de un toque */
 var es=earnedStamps().length;
 h+='<div class="at-more at-in" style="--i:4"><button type="button" class="at-tile" id="atPass">'+ico("flag")+'<b>Pasaporte</b><span>'+es+(es===1?" sello":" sellos")+'</span></button><button type="button" class="at-tile" id="atRep">'+ico("book")+'<b>Informe</b><span>Para guardar o enseñar</span></button></div>';
 v.innerHTML=h+'</div>';
 var er=v.querySelector(".at-empty .rb");if(er)wireRumbo(er);
 /* el anillo y las barras se llenan al abrir */
 var arc=$("#atArc"),pct=$("#atPct");
 function fill(){arc.style.strokeDashoffset=(CIRC*(1-Math.min(100,cl)/100)).toFixed(1);each(v.querySelectorAll(".ui-prog"),function(b){b.style.setProperty("--v",b.getAttribute("data-v"))})}
 if(RM()){fill();pct.innerHTML=cl+"<i>%</i>"}
 else{setTimeout(fill,260);setTimeout(function(){tween(900,function(t){pct.innerHTML=Math.round(cl*(1-Math.pow(1-t,3)))+"<i>%</i>"})},260)}
 var go=$("#atGo");if(go)go.onclick=function(){openCareer(go.getAttribute("data-id"))};
 each(v.querySelectorAll(".at-cc[data-id],.at-tp"),function(b){b.onclick=function(){openCareer(b.getAttribute("data-id"))}});
 ["atAdd","atAddMain","atEdit"].forEach(function(k){var b=$("#"+k);if(b)b.onclick=function(){openPicker("edit")}});
 $("#atPass").onclick=openPassport;$("#atRep").onclick=openReport;
}
function atSub(title,body,cls){
 var el=document.createElement("div");el.className="at-sub "+(cls||"");el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label",title);
 el.innerHTML='<header class="at-subh noprint"><button type="button" class="ui-iconbtn" aria-label="Volver al Atlas">'+ico("back")+'</button><h2>'+esc(title)+'</h2></header><div class="at-subb"><div class="at-subin">'+body+'</div></div>';
 var close=uiLayer(el,false,function(){document.body.classList.remove("rep-open")});
 el.querySelector(".ui-iconbtn").onclick=close;
 setTimeout(function(){uiFocus(el.querySelector(".ui-iconbtn"))},60);
 return el;
}
function openPassport(){
 artDefs();
 var cs=C.filter(function(c){return picked(c.id)||progOf(c.id).p>=1}),k=0,fresh=[];
 var h='<p class="at-lead">Ganas el sello de una carrera cuando completas todas sus lecciones.</p><div class="stp-grid">'+cs.map(function(c){
  var pg=progOf(c.id),on=pg.p>=1,nw=on&&!S.stp[c.id];if(nw)fresh.push(c.id);
  return '<div class="stp-cell'+(nw?' is-new':'')+'" style="--k:'+(nw?k++:0)+'">'+stampHTML(c,on)+'<b>'+esc(shortName(c))+'</b><small>'+(on?"Ganado":pg.done+" de "+pg.total+" lecciones")+'</small></div>';
 }).join("")+'</div>';
 atSub("Pasaporte de sellos",h);
 if(fresh.length){fresh.forEach(function(id){S.stp[id]=1});save();if(!RM())setTimeout(function(){sfx("ok")},500)}
}
function openReport(){
 var cs=MC(),top=ranked(),cl=clarity(),done=0,tot=0;cs.forEach(function(c){var p=progOf(c.id);done+=p.done;tot+=p.total});
 var day=new Date().toLocaleDateString("es-MX",{day:"numeric",month:"long",year:"numeric"}),who=[S.grado?gradoName(S.grado):"",edoName()].filter(Boolean).join(" · ");
 var temas=S.interests.map(function(t){return LAB[t]}).concat(S.custom);
 var h='<div class="rp-head"><div class="at-eb">Informe de exploración · '+esc(day)+'</div><h1>'+(S.nick?esc(S.nick):"Mi exploración")+'</h1>'+(who?'<p>'+esc(who)+'</p>':'')+'</div>'+
  '<div class="rp-stats"><div><b class="num">'+cl+'<i>%</i></b><span>claridad</span></div><div><b class="num">'+cs.length+'</b><span>'+(cs.length===1?"carrera elegida":"carreras elegidas")+'</span></div><div><b class="num">'+done+'<i>/'+tot+'</i></b><span>lecciones</span></div><div><b class="num">'+earnedStamps().length+'</b><span>'+(earnedStamps().length===1?"sello":"sellos")+'</span></div></div>';
 h+='<h2 class="rp-h">Lo que más te va hasta ahora</h2>';
 h+=top.length?'<ol class="rp-top">'+top.map(function(c,i){return '<li><span class="at-rk" style="--c:'+c.color+';--ct:'+(lum(c.color)>.62?"#14323F":"#FFFFFF")+'">'+(i+1)+'</span><div><b>'+esc(c.name)+'</b><span>'+esc(whyOf(c.id))+'</span></div></li>'}).join("")+'</ol>':'<p class="rp-p">Todavía no hay retos hechos. Aparecerá aquí cuando pruebes tu primera carrera.</p>';
 h+='<h2 class="rp-h">Tus carreras</h2><div class="rp-list">'+cs.map(function(c){var p=progOf(c.id),d=S.res[c.id];
  return '<div class="rp-row"><div class="rp-rt"><b>'+esc(c.name)+'</b><span>'+esc(AREAS[c.area].n)+(d?" · "+R[d]:"")+(S.rate[c.id]!=null?" · "+S.rate[c.id]+" de 10":"")+'</span></div><div class="ui-prog" style="--v:'+p.p+'"><i></i></div><span class="num">'+Math.round(p.p*100)+'%</span></div>'}).join("")+'</div>';
 var ar=AREA_ORDER.map(function(a){return [a,areaScore(a)]}).filter(function(x){return x[1]!=null});
 h+='<h2 class="rp-h">Por área</h2><div class="rp-list">'+ar.map(function(x){return '<div class="rp-row"><div class="rp-rt"><b>'+esc(AREAS[x[0]].n)+'</b></div><div class="ui-prog" style="--v:'+(x[1]/100)+';--fill:'+AREA_COL[x[0]]+'"><i></i></div><span class="num">'+x[1]+'%</span></div>'}).join("")+'</div>';
 if(temas.length)h+='<h2 class="rp-h">Temas que elegiste</h2><div class="rp-tags">'+temas.map(function(t){return '<span class="ui-badge">'+esc(t)+'</span>'}).join("")+'</div>';
 h+='<p class="rp-note">Este informe resume lo que exploraste y cómo reaccionaste. No es un test psicológico ni un diagnóstico: sirve para platicar en casa o con orientación.</p>'+
  '<button type="button" class="ui-btn is-block noprint" id="rpPrint">Guardar como PDF</button>';
 var el=atSub("Informe",h,"is-rep");document.body.classList.add("rep-open");
 el.querySelector("#rpPrint").onclick=function(){try{window.print()}catch(e){}};
}
/* solo para las pruebas automáticas (qa/): con la marca vocatlas_qa se puede inspeccionar el estado interno */
try{if(localStorage.getItem("vocatlas_qa"))window.__vt=function(c){return eval(c)}}catch(e){}
