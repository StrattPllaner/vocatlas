/* ================= ruta de lecciones de cada carrera =================
   Al entrar a una carrera se abre su ruta de viaje: seis regiones (una por unidad) y una parada por lección.
   La estructura es la misma para todas (CAT.est); el contenido de cada lección sale del catálogo de la carrera (CAT.car[id]).
   Las carreras que todavía no tienen catálogo conservan lo que ya existía (qué haces, mini reto y veredicto) y el resto
   de sus paradas dice «llega pronto». Usa el contenedor #plaza y sus transiciones. */

/* ---------- avance por lección (lo usa toda la app) ---------- */
function carCat(id){return (CAT.car||{})[id]||null}
function carLes(id,lid){var c=carCat(id);if(!c)return null;for(var u=0;u<c.unidades.length;u++)for(var l=0;l<c.unidades[u].lecciones.length;l++)if(c.unidades[u].lecciones[l].id===lid)return c.unidades[u].lecciones[l];return null}
var LEGACY={"1.1":1,"2.1":1,"6.2":1};
function lessHas(id,lid){return carCat(id)?!!carLes(id,lid):!!LEGACY[lid]}
function lessDone(id,lid){
 if(S.les&&S.les[id]&&S.les[id][lid])return true;
 if(carCat(id))return false;
 return lid==="1.1"?!!(S.st[id]&&S.st[id].hace):lid==="2.1"?!!S.res[id]:lid==="6.2"?S.rate[id]!=null:false}
function lessList(id){var o=[];CAT.est.unidades.forEach(function(u,ui){u.lecciones.forEach(function(l){if(lessHas(id,l[0])){var cl=carLes(id,l[0]);o.push([l[0],cl?cl.titulo:(l[0]==="1.1"?"Qué haces":l[0]==="2.1"?"Mini reto":l[1]),ui])}})});return o}
function progOf(id){var L=lessList(id),d=0;L.forEach(function(l){if(lessDone(id,l[0]))d++});return {done:d,total:L.length,p:L.length?d/L.length:0}}
function nextLesson(id){var L=lessList(id);for(var i=0;i<L.length;i++)if(!lessDone(id,L[i][0]))return L[i][1];return null}
function unitFull(id,ui){return CAT.est.unidades[ui].lecciones.every(function(l){return lessHas(id,l[0])})}
function unitDone(id,ui){return unitFull(id,ui)&&CAT.est.unidades[ui].lecciones.every(function(l){return lessDone(id,l[0])})}
function markLesson(id,lid){S.les=S.les||{};S.les[id]=S.les[id]||{};S.les[id][lid]=1;
 /* lo que el resto de la app ya leía: «qué haces», la reacción al reto y la calificación */
 if(lid==="1.1"){S.st[id]=S.st[id]||{};S.st[id].hace=1}
 if(lid==="2.1"&&!S.res[id]&&S.int&&S.int[id]&&S.int[id]["2.1"])S.res[id]=S.int[id]["2.1"];
 save()}
/* quien ya había avanzado en una carrera que ahora tiene catálogo completo conserva esas tres lecciones */
function migrateLessons(){(Object.keys(CAT.car||{})).forEach(function(id){S.mig=S.mig||{};if(S.mig[id])return;S.mig[id]=1;S.les=S.les||{};var L=S.les[id]=S.les[id]||{};
  if(S.st[id]&&S.st[id].hace)L["1.1"]=1;if(S.res[id])L["2.1"]=1;if(S.rate[id]!=null)L["6.2"]=1})}

var PATH=(function(){
 var LIC={
  libro:'<path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5z"/><path d="M12 6v13.5"/>',
  gente:'<circle cx="9" cy="8" r="3.2"/><path d="M3 20c.6-3.4 2.8-5.2 6-5.2s5.4 1.8 6 5.2"/><circle cx="17" cy="9" r="2.4"/><path d="M16.5 14.6c2.4.2 4 1.7 4.5 4.4"/>',
  mito:'<path d="M9.2 9a3 3 0 1 1 4.3 2.7c-.9.5-1.5 1.2-1.5 2.3"/><circle cx="12" cy="18" r=".6" fill="currentColor"/><circle cx="12" cy="12" r="9"/>',
  par:'<circle cx="9" cy="12" r="5.5"/><circle cx="15" cy="12" r="5.5"/>',
  reto:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  dia:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  dificil:'<path d="M3 19l6.5-10 4 6 2.5-3.5L21 19z"/>',
  testi:'<path d="M4 5h16v11H10l-5 4v-4H4z"/>',
  brujula:'<circle cx="12" cy="12" r="8.5"/><path d="m15.5 8.5-2 5-5 2 2-5 5-2Z"/>',
  etapas:'<path d="M4 18h4v-4h4v-4h4V6h4"/>',
  puerta:'<path d="M6 21V4h12v17M3 21h18"/><circle cx="14.5" cy="12.5" r=".8" fill="currentColor"/>',
  donde:'<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5M22 9v6"/>',
  lugar:'<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.400-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.4"/>',
  gana:'<ellipse cx="12" cy="7" rx="7" ry="3"/><path d="M5 7v5c0 1.7 3 3 7 3s7-1.3 7-3V7M5 12v5c0 1.7 3 3 7 3s7-1.3 7-3v-5"/>',
  chip:'<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
  flecha:'<path d="M5 19 19 5M10 5h9v9"/>',
  repaso:'<path d="M5 19V9M10 19V5M15 19v-7M20 19v-4"/>',
  veredicto:'<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v3M8 20h8M9 17h6"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',lock:'<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'
 };
 var LI={"1.1":"libro","1.2":"gente","1.3":"mito","1.4":"par","2.1":"reto","2.2":"reto","2.3":"reto","2.4":"reto","3.1":"dia","3.2":"dificil","3.3":"testi","3.4":"brujula","4.1":"etapas","4.2":"puerta","4.3":"donde","5.1":"lugar","5.2":"gana","5.3":"chip","5.4":"flecha","6.1":"repaso","6.2":"veredicto"};
 /* forma de cada parada: la misma silueta dos veces (la de abajo, más oscura, le da volumen) */
 var SH={
  sello:'<circle cx="40" cy="38" r="33"/>',
  hexagono:'<path d="M40 4 70 21v34L40 72 10 55V21Z" stroke-linejoin="round"/>',
  pergamino:'<path d="M14 12h52a6 6 0 0 1 6 6v0a6 6 0 0 1-6 6h-2v28h2a6 6 0 0 1 6 6v0a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6v0a6 6 0 0 1 6-6h2V24h-2a6 6 0 0 1-6-6v0a6 6 0 0 1 6-6Z"/>',
  brujula:'<path d="M40 3 75 38 40 73 5 38Z" stroke-linejoin="round"/>',
  final:'<path d="M48 4l8.300 7.500 11.100-1.500 2.400 11 9.800 5.500-4.600 10.200 4.600 10.200-9.800 5.500-2.400 11-11.100-1.500L48 71.400l-8.300-7.500-11.100 1.500-2.400-11-9.800-5.500L21 38.700l-4.600-10.200 9.800-5.500 2.400-11 11.100 1.500Z" stroke-linejoin="round"/>'
 };
 function nodeSVG(it){var f=it.parada==="final",w=f?96:80,sh=SH[it.parada]||SH.sello,inner=it.parada==="sello"?'<circle class="rt-perf" cx="40" cy="38" r="26.500"/>':"";
  return '<svg class="rt-shape" viewBox="0 0 '+w+' '+(f?90:88)+'" aria-hidden="true"><g class="rt-ex" transform="translate(0 8)">'+sh+'</g><g class="rt-top">'+sh+inner+'</g></svg>'}
 var st={id:null,el:null,sc:null,raf:0,items:[],units:[],headU:-1,onScroll:null};
 function chestKey(ui){return "u"+(ui+1)}
 function chestDone(id,ui){return !!(S.chest&&S.chest[id+":"+chestKey(ui)])}

 /* la ruta de la carrera: unidades, paradas y su estado */
 function catalog(id){
  var U=CAT.est.unidades.map(function(u,ui){
   var items=u.lecciones.map(function(l,li){var cl=carLes(id,l[0]);return {lid:l[0],n:cl?cl.titulo:(carCat(id)?l[1]:(l[0]==="1.1"?"Qué haces":l[0]==="2.1"?"Mini reto":l[1])),parada:l[2],les:cl,u:ui,li:li,min:cl?cl.minutos:null}});
   if(unitFull(id,ui))items.push({chest:ui,n:"Cofre de «"+u.titulo+"»",u:ui,li:items.length,parada:"cofre"});
   return {t:u.titulo,sub:u.sub,items:items,n:u.lecciones.length}});
  var all=[],blocked=false;U.forEach(function(u){u.items.forEach(function(it){all.push(it)})});
  all.forEach(function(it){
   if(it.chest!=null){it.done=chestDone(id,it.chest);it.state=it.done?"done":unitDone(id,it.chest)?"open":"lock";return}
   if(!lessHas(id,it.lid)){it.state="soon";return}
   it.done=lessDone(id,it.lid);it.state=it.done?"done":blocked?"lock":"cur";if(!it.done)blocked=true});
  U.forEach(function(u,ui){u.done=u.items.filter(function(it){return it.lid&&it.done}).length;u.avail=u.items.filter(function(it){return it.lid&&it.state!=="soon"}).length});
  return {units:U,all:all}}
 function chestSVG(open){
  return '<svg viewBox="0 0 80 72" aria-hidden="true"><ellipse cx="40" cy="64" rx="30" ry="6" fill="#000" opacity=".22"/>'+
   '<path d="M12 34L40 48L68 34V56L40 70L12 56Z" fill="#C98A3A"/><path d="M40 48L68 34V56L40 70Z" fill="#A86E28"/>'+
   '<path d="M12 34L40 48V70L12 56Z" fill="#D99A48"/><path d="M24 40V62M56 40V62" stroke="#F2C14E" stroke-width="3"/>'+
   (open?'<path d="M12 34L40 20L68 34L40 48Z" fill="#4A2C12"/><path d="M12 34L40 20L40 6L12 20Z" fill="#E0A54E"/><path d="M40 20L68 34L68 20L40 6Z" fill="#C9883A"/><circle cx="40" cy="30" r="5" fill="#FFE59A" opacity=".9"/>'
    :'<path d="M12 34L40 20L68 34L40 48Z" fill="#E8AE55"/><path d="M12 34L40 48L40 40L12 26Z" fill="#E8AE55"/><path d="M12 26L40 12L68 26L40 40Z" fill="#F2C470"/><path d="M40 40L68 26V34L40 48Z" fill="#C98A3A"/>')+
   '<rect x="35" y="'+(open?46:42)+'" width="10" height="10" rx="2" fill="#F2C14E" stroke="#8A5A1E" stroke-width="1.4"/><circle cx="40" cy="'+(open?50:46)+'" r="1.6" fill="#8A5A1E"/></svg>'}
 function art(id,v){if(typeof ART==="undefined"||!ART.has(id))return "";return '<svg viewBox="-72 -110 144 160" aria-hidden="true"><defs>'+(typeof ENV!=="undefined"?ENV.DEFS:"")+'</defs>'+ART.get(id,1,v)+'</svg>'}
 function envArt(k){if(typeof ENV==="undefined")return "";var vb={treeRound:"-22 -46 44 52",palm:"-24 -50 48 56",rock:"-14 -12 28 18",treePine:"-18 -46 36 52",bush:"-16 -18 32 24",lamp:"-10 -34 20 40",signpost:"-14 -30 28 36"}[k];return '<svg viewBox="'+vb+'" aria-hidden="true">'+ENV.one(k,{d:2,k:1.6})+'</svg>'}

 function build(id){
  st.headU=-1;var c=byId[id],p=$("#plaza"),dark=!!(DMQ&&DMQ.matches),cat=catalog(id);st.id=id;st.items=cat.all;st.units=cat.units;
  var col=c.color,cd=dk(col,.38),txt=lum(col)>.62?"#14323F":"#FFFFFF",base=dark?"#0B1626":"#FFFBF2";
  p.style.setProperty("--pc",col);
  var pg=progOf(id);
  var h='<div class="lp rt'+(dark?" lp-dark":"")+'" style="--c:'+col+';--cd:'+cd+';--ct:'+txt+'">'+
   '<header class="lp-head rt-head" id="lpHead"><button class="lp-back" id="pzx" aria-label="Volver al mapa"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></button>'+
   '<div class="lp-ht"><div class="lp-eb" id="lpEb"></div><h2 class="lp-tt">'+esc(c.name)+'</h2></div><div class="rt-pg" aria-label="'+pg.done+' de '+pg.total+' lecciones"><b class="num">'+pg.done+'</b><span>de '+pg.total+'</span></div><div class="rt-bar"><i style="width:'+(pg.p*100).toFixed(1)+'%"></i></div></header>'+
   '<div class="lp-scroll" id="lpScroll"><div class="lp-col rt-col" id="lpCol">';
  /* regiones y paradas. La ruta serpentea; cada parada lleva su nombre del lado que queda libre */
  var y=0,k=0,pts=[],bands="",nodes="",deco="",DK=["treeRound","rock","palm","bush","treePine","signpost","lamp"];
  cat.units.forEach(function(u,ui){
   var y0=y,tone=dark?[.80,.72][ui%2]:[.87,.79][ui%2];
   y+=26;
   nodes+='<div class="rt-ban '+(ui%2?"r":"l")+'" data-u="'+ui+'" style="top:'+y+'px"><div class="rt-bant"><span>Unidad '+(ui+1)+'</span><h3>'+esc(u.t)+'</h3><p>'+esc(u.sub)+'</p><em>'+(u.avail?u.done+' de '+u.avail+(u.avail<u.n?' disponibles':''):'Llega pronto')+'</em></div><div class="rt-bana">'+(art(id,ui%2?"e":"s")||"")+'</div></div>';
   y+=186;
   u.items.forEach(function(it){
    var big=it.parada==="final",ch=it.chest!=null,off=Math.round(Math.sin(k*Math.PI/2.5)*58),size=big?96:ch?84:76;
    it.x=off;it.y=y;it.k2=k;pts.push([off,y+size/2-4,it.state]);
    var cls="lp-n rt-n s-"+it.state+" p-"+it.parada,dl=(80+Math.min(k,8)*45)+"ms",side=off>8?"l":"r";
    var lab=ch?"":'<span class="rt-lab '+side+'"><b>'+it.lid+'</b>'+esc(it.n)+(it.state==="soon"?'<em>Llega pronto</em>':'')+'</span>';
    if(ch)nodes+='<button class="'+cls+' chest" data-i="'+k+'" style="left:calc(50% + '+off+'px);top:'+y+'px;--d:'+dl+'" aria-label="'+esc(it.n)+(it.done?", abierto":"")+'">'+chestSVG(it.done)+'</button>';
    else nodes+='<button class="'+cls+'" data-i="'+k+'" style="left:calc(50% + '+off+'px);top:'+y+'px;--d:'+dl+'" aria-label="'+it.lid+' '+esc(it.n)+(it.state==="done"?", hecha":it.state==="soon"?", llega pronto":it.state==="lock"?", bloqueada":"")+'">'+nodeSVG(it)+
     '<span class="lp-face">'+icon(it.state==="lock"||it.state==="soon"?LIC.lock:LIC[LI[it.lid]]||LIC.libro,"lp-ic")+'</span>'+(it.state==="done"?'<span class="lp-ok">'+icon(LIC.check)+'</span>':'')+lab+'</button>';
    /* vegetación del lado contrario al nombre, lejos de la parada */
    if(!ch&&k%2===0&&it.state!=="cur"){var dk2=DK[(k/2+ui)%DK.length],sx=side==="r"?-1:1;deco+='<div class="rt-deco" style="top:'+(y+8)+'px;left:calc(50% + '+(off+sx*96)+'px)">'+envArt(dk2)+'</div>'}
    y+=big?132:ch?124:104;k++;
   });
   y+=18;if(ui===cat.units.length-1)y+=110;
   bands+='<div class="rt-band" style="top:'+y0+'px;height:'+(y-y0)+'px;background:'+mixHex(col,base,tone)+'"><b>'+(ui+1)+'</b></div>';
  });
  /* trazo de la ruta: punteado completo y, encima, lo ya recorrido */
  function seg(a,b){var my=(a[1]+b[1])/2;return "C"+a[0]+" "+my+" "+b[0]+" "+my+" "+b[0]+" "+b[1]}
  var d="",dd="",lastDone=-1;pts.forEach(function(q,i){if(q[2]==="done")lastDone=i});
  pts.forEach(function(q,i){d+=i?seg(pts[i-1],q):"M"+q[0]+" "+q[1];if(i<=lastDone+1&&lastDone>=0)dd+=i?seg(pts[i-1],q):"M"+q[0]+" "+q[1]});
  h+=bands+'<svg class="rt-line" style="height:'+y+'px" viewBox="-280 0 560 '+y+'" aria-hidden="true"><path class="rt-l0" d="'+d+'"/><path class="rt-l1" d="'+dd+'"/></svg>'+deco+nodes;
  h+='<div class="lp-rb rt-rb" id="lpRb">'+(typeof skinOn==="function"&&RUMBO.SKINS[id]&&skinOn(id)?skinRb(id):rumboEl())+'</div><div class="lp-pop" id="lpPop" role="dialog"></div></div><div style="height:'+y+'px"></div></div>'+
   '<button class="lp-fab" id="lpFab" aria-label="Ir a la lección actual"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M6 13l6 6 6-6"/></svg></button></div>';
  p.innerHTML=h;
  st.el=p.querySelector(".lp");st.sc=$("#lpScroll");
  PZ.rb=p.querySelector(".lp-rb .rb");PZ.el=null;wireRumbo(PZ.rb);
  $("#pzx").onclick=function(){leave();exitPlaza()};
  each(p.querySelectorAll(".lp-n"),function(b){b.onclick=function(e){e.stopPropagation();tap(+b.getAttribute("data-i"))}});
  st.sc.addEventListener("click",function(e){if(!e.target.closest(".lp-pop"))closePop()});
  st.onScroll=function(){if(!st.raf)st.raf=requestAnimationFrame(onScroll)};st.sc.addEventListener("scroll",st.onScroll,{passive:true});
  $("#lpFab").onclick=function(){toCur(true)};
  placeRumbo(false);header(0,true);
 }
 function curIndex(){for(var i=0;i<st.items.length;i++)if(st.items[i].state==="open")return i;
  for(i=0;i<st.items.length;i++)if(st.items[i].state==="cur")return i;
  for(i=st.items.length-1;i>=0;i--)if(st.items[i].state==="done")return i;return 0}
 /* Rumbo junto a la parada actual, del lado contrario a su nombre */
 function placeRumbo(animate){
  var e=$("#lpRb");if(!e)return;var i=curIndex(),it=st.items[i],side=it.x>8?1:-1;
  e.style.top=(it.y-22)+"px";e.style.left="calc(50% + "+(it.x+side*84)+"px)";
  if(PZ.rb)PZ.rb.classList.toggle("left",side>0);
  var act=it.state==="cur"||it.state==="open",m=it.parada==="hexagono"?"curious":it.state==="done"||it.parada==="final"?"happy":"idle";
  if(PZ.rb){PZ.rb.classList.toggle("p-point",act);mood(PZ.rb,m,animate?"jump":null)}
  each(document.querySelectorAll("#lpCol .lp-tag"),function(t){t.remove()});
  if(act){var b=document.querySelector('#lpCol .lp-n[data-i="'+i+'"]');if(b){var t=document.createElement("span");t.className="lp-tag";t.textContent=it.chest!=null?"ABRIR":(S.lp&&S.lp[st.id+":"+it.lid]!=null?"SEGUIR":"EMPEZAR");b.appendChild(t)}}
 }
 function header(ui,instant){
  if(ui===st.headU)return;st.headU=ui;var u=st.units[ui],eb=$("#lpEb"),hd=$("#lpHead");if(!eb)return;
  var set=function(){eb.textContent="UNIDAD "+(ui+1)+" DE "+st.units.length+" · "+u.t.toUpperCase()};
  if(instant||RM()){set();return}
  hd.classList.add("sw");setTimeout(function(){set();hd.classList.remove("sw")},160);
 }
 function onScroll(){st.raf=0;var sc=st.sc;if(!sc)return;
  var ui=0;each(document.querySelectorAll("#lpCol .rt-ban"),function(s){if(s.offsetTop-sc.scrollTop<150)ui=+s.getAttribute("data-u")});header(ui);
  var it=st.items[curIndex()],vy=it.y-sc.scrollTop;var fb=$("#lpFab");fb.classList.toggle("on",vy<40||vy>sc.clientHeight-80);fb.classList.toggle("up",vy<40);
 }
 function toCur(smooth){var sc=st.sc;if(!sc)return;var it=st.items[curIndex()];var top=Math.max(0,it.y-sc.clientHeight*.42);if(curIndex()===0)top=0;
  if(smooth&&!RM())sc.scrollTo({top:top,behavior:"smooth"});else sc.scrollTop=top;onScroll()}
 /* tarjeta emergente debajo de la parada */
 function tap(i){
  var it=st.items[i],b=document.querySelector('#lpCol .lp-n[data-i="'+i+'"]'),pop=$("#lpPop"),c=byId[st.id];if(!b||!pop)return;
  restart(b,"press");
  var h='<h3>'+(it.lid?it.lid+" · ":"")+esc(it.n)+'</h3>',btn="";
  if(it.state==="soon")h+='<p>Esta lección todavía no tiene contenido. Llega pronto.</p>';
  else if(it.state==="lock")h+='<p>'+(it.chest!=null?"Se abre cuando termines las lecciones de esta unidad.":"Se desbloquea cuando termines la lección anterior.")+'</p>';
  else if(it.chest!=null){h+='<p>'+(it.done?"Ya lo abriste.":"Terminaste la unidad. Ábrelo.")+'</p>';if(!it.done)btn='<button class="btn primary wide" id="lpGo">Abrir</button>'}
  else{
   var keyi=it.les?(it.les.tarjetas.filter(function(t){return t.tipo==="clave"})[0]||{}).texto:null;
   h+='<p class="lp-meta">'+(it.min?it.min+" min":"Unos minutos")+(it.state==="done"?" · Hecha":"")+'</p>';
   if(it.state==="done"&&keyi)h+='<p>Idea clave: '+esc(keyi)+'</p>';
   else if(!it.les&&it.lid==="1.1")h+='<p>'+esc(c.desc)+'</p>';
   else if(!it.les&&it.lid==="2.1")h+='<p>'+esc(c.q)+'</p>';
   btn='<button class="btn primary wide" id="lpGo">'+(it.state==="done"?"Repasar":S.lp&&S.lp[st.id+":"+it.lid]!=null?"Seguir":"Empezar")+'</button>';
  }
  pop.innerHTML='<span class="lp-arrow"></span>'+h+btn;
  pop.style.top=(it.y+(it.parada==="final"?108:92))+"px";pop.style.setProperty("--ax",(it.x)+"px");
  pop.classList.remove("on");void pop.offsetWidth;pop.classList.add("on");
  var go=$("#lpGo");if(go)go.onclick=function(e){e.stopPropagation();closePop();run(it)};
  var sc=st.sc,need=it.y+300-(sc.scrollTop+sc.clientHeight);if(need>0){if(RM())sc.scrollTop+=need;else sc.scrollTo({top:sc.scrollTop+need,behavior:"smooth"})}
 }
 function closePop(){var p=$("#lpPop");if(p)p.classList.remove("on")}
 /* abrir una lección */
 function run(it){
  var id=st.id,c=byId[id];
  if(it.chest!=null){openChest(it);return}
  var was=it.done,fin=function(){markLesson(id,it.lid);if(!was)complete(it);else refresh(false)};
  if(it.les){var u=st.units[it.u],last=u.items.filter(function(x){return x.lid}).pop()===it;
   LEC.open(id,it.les,{unit:it.u,unitName:u.t,unitEnd:last&&unitFull(id,it.u)&&!(S.auto&&S.auto[id]&&S.auto[id][it.u]),resume:true},fin,function(){refresh(false)});return}
  /* carreras sin catálogo todavía: lo que ya existía */
  if(it.lid==="2.1"){openTest(id);return}
  if(it.lid==="1.1"){LEC.open(id,{id:"1.1",titulo:"Qué haces",tarjetas:[{tipo:"escena",texto:c.desc},{tipo:"interes"}]},{},fin);return}
  if(it.lid==="6.2"){LEC.open(id,{id:"6.2",titulo:"Tu veredicto",tarjetas:[{tipo:"veredicto"}]},{},fin);return}
 }
 function lesson(html,cta,onDone){
  var o=document.createElement("div");o.className="lp-lesson";o.id="lpLesson";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");
  o.innerHTML='<div class="lp-lin">'+html+'<button class="btn primary wide" id="lpLok">'+cta+'</button></div>';
  st.el.appendChild(o);requestAnimationFrame(function(){o.classList.add("on")});
  var rbw=o.querySelector(".rb");if(rbw)wireRumbo(rbw);
  $("#lpLok").onclick=function(){onDone();o.classList.remove("on");setTimeout(function(){o.remove()},RM()?0:T.med)};
 }
 function openChest(it){
  var id=st.id,c=byId[id],b=document.querySelector('#lpCol .lp-n[data-i="'+it.k2+'"]'),u=st.units[it.u];
  S.chest=S.chest||{};S.chest[id+":"+chestKey(it.chest)]=1;save();
  if(b){b.innerHTML=chestSVG(true);restart(b,"opened");burstAt(b)}
  /* al cerrar la unidad 2 se gana el Rumbo de la carrera */
  var skin=it.chest===1&&RUMBO.SKINS[id]&&!(S.skw&&S.skw[id]);
  setTimeout(function(){
   if(skin){S.skw=S.skw||{};S.skw[id]=1;save();
    lesson('<div class="rt-skin">'+skinRb(id,"cheer")+'</div><h2>¡Ganaste a '+esc(RUMBO.SKINS[id].n)+'!</h2><p>Terminaste «'+esc(u.t)+'». Este Rumbo ya está en tu colección; puedes ponértelo desde tu perfil o ahora mismo.</p><button class="btn wide" id="rtUse">Usar a '+esc(RUMBO.SKINS[id].n)+'</button>',"Seguir",function(){refresh(true)});
    var ub=$("#rtUse");if(ub)ub.onclick=function(){setSkin(id);$("#lpLok").click()};return}
   var left=progOf(id);
   lesson('<div class="lp-chestbig">'+chestSVG(true)+'</div><h2>¡Unidad completa!</h2><p>Terminaste «'+esc(u.t)+'». '+(left.p>=1?'Con esto completaste '+esc(c.name)+'. Vuelve al mapa: ahí te espera su sello.':'Te faltan '+(left.total-left.done)+' lecciones para el sello de '+esc(c.name)+'.')+'</p>',"Seguir",function(){refresh(true)})},RM()?0:500);
 }
 function burstAt(b){if(RM())return;var cols=["#F2B544","#FFFFFF","#7FB59A","#8FC9E8"];for(var i=0;i<12;i++){var s=document.createElement("i");s.className="lp-pt";s.style.background=cols[i%4];s.style.setProperty("--a",(i*30)+"deg");b.appendChild(s);setTimeout(function(x){return function(){x.remove()}}(s),700)}}
 /* al terminar una lección: la parada se llena, chispas, el siguiente se activa y Rumbo salta hasta él */
 function complete(it){
  var b=document.querySelector('#lpCol .lp-n[data-i="'+it.k2+'"]');if(b){b.classList.remove("s-cur");b.classList.add("s-done","fill");burstAt(b)}
  if(typeof sfx==="function")sfx("ok");
  setTimeout(function(){refresh(true)},RM()?0:650);
 }
 function refresh(animate){if(!st.sc||!$("#lpScroll"))return;var y=st.sc.scrollTop;build(st.id);st.sc.scrollTop=y;if(animate&&PZ.rb){mood(PZ.rb,"happy","jump")}if(animate)setTimeout(function(){toCur(true)},RM()?0:300)}
 function show(){document.body.classList.add("lp-open");toCur(false);if(PZ.rb)mood(PZ.rb,"happy","jump")}
 function react(id){var k=S.res[id];if(!carCat(id))markLesson(id,"2.1");refresh(true);if(PZ.rb)mood(PZ.rb,k==="yes"?"happy":k==="mid"?"meh":"no",k==="yes"?"jump":k==="mid"?"tilt":"shake")}
 function leave(){document.body.classList.remove("lp-open");ambSync();if(typeof LEC!=="undefined")LEC.close();if(st.sc&&st.onScroll)st.sc.removeEventListener("scroll",st.onScroll);cancelAnimationFrame(st.raf);st.raf=0;var l=$("#lpLesson");if(l)l.remove()}
 return {build:build,show:show,react:react,leave:leave,state:function(){},closePop:closePop,catalog:catalog};
})();
