/* ================= ruta de lecciones de cada carrera =================
   Al entrar a una carrera se abre su ruta de viaje: seis regiones (una por unidad) y una parada por lección.
   La estructura es la misma para todas (CAT.est); el contenido de cada lección sale del catálogo de la carrera (CAT.car[id]).
   Las carreras que todavía no tienen catálogo conservan lo que ya existía (qué haces, mini reto y veredicto) y el resto
   de sus paradas dice «llega pronto». Usa el contenedor #plaza y sus transiciones. */

/* ---------- texto de las lecciones ----------
   La página trae solo los títulos; las tarjetas de cada carrera se descargan al abrir una lección y quedan guardadas
   (también sin conexión, por el service worker). Las carreras de tu mapa se descargan solas al rato de abrir la app. */
var CARDS={};
function carCards(id,cb){var c=carCat(id);if(!c){cb(null);return}if(CARDS[id]){cb(CARDS[id]);return}
 fetch(c.src).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){CARDS[id]=j;cb(j)}).catch(function(){cb(null)})}
function carFind(full,lid){for(var u=0;u<full.unidades.length;u++)for(var l=0;l<full.unidades[u].lecciones.length;l++)if(full.unidades[u].lecciones[l].id===lid)return full.unidades[u].lecciones[l];return null}
function carPrefetch(){(S.pick||[]).forEach(function(id,i){if(carCat(id)&&!CARDS[id])setTimeout(function(){carCards(id,function(){})},4000+i*700)})}
/* ---------- avance por lección (lo usa toda la app) ---------- */
function carCat(id){return (CAT.car||{})[id]||null}
function carLes(id,lid){var c=carCat(id);if(!c)return null;for(var u=0;u<c.unidades.length;u++)for(var l=0;l<c.unidades[u].lecciones.length;l++)if(c.unidades[u].lecciones[l].id===lid)return c.unidades[u].lecciones[l];return null}
/* la estructura de una carrera: la común (CAT.est) o la suya propia (formato 2: entrada, 7 lecciones y examen) */
function estOf(id){var c=carCat(id);if(!c||c.formato!==2)return CAT.est;if(!c._est)c._est={unidades:c.unidades.map(function(u){return {titulo:u.titulo,sub:u.sub,lecciones:u.lecciones.map(function(l){return [l.id,l.titulo,l.examen?"final":l.id==="0"?"brujula":"sello"]})}})};return c._est}
function isV2(id){var c=carCat(id);return !!(c&&c.formato===2)}
var LEGACY={"1.1":1,"2.1":1,"6.2":1};
function lessHas(id,lid){return carCat(id)?!!carLes(id,lid):!!LEGACY[lid]}
function lessDone(id,lid){
 if(S.les&&S.les[id]&&S.les[id][lid])return true;
 if(carCat(id))return false;
 return lid==="1.1"?!!(S.st[id]&&S.st[id].hace):lid==="2.1"?!!S.res[id]:lid==="6.2"?S.rate[id]!=null:false}
function lessList(id){var o=[];estOf(id).unidades.forEach(function(u,ui){u.lecciones.forEach(function(l){if(lessHas(id,l[0])){var cl=carLes(id,l[0]);o.push([l[0],cl?cl.titulo:(l[0]==="1.1"?"Qué haces":l[0]==="2.1"?"Mini reto":l[1]),ui])}})});return o}
function progOf(id){var L=lessList(id),d=0;L.forEach(function(l){if(lessDone(id,l[0]))d++});return {done:d,total:L.length,p:L.length?d/L.length:0}}
function nextLesson(id){var L=lessList(id);for(var i=0;i<L.length;i++)if(!lessDone(id,L[i][0]))return L[i][1];return null}
function unitFull(id,ui){return estOf(id).unidades[ui].lecciones.every(function(l){return lessHas(id,l[0])})}
function unitDone(id,ui){return unitFull(id,ui)&&estOf(id).unidades[ui].lecciones.every(function(l){return lessDone(id,l[0])})}
function markLesson(id,lid){S.les=S.les||{};S.les[id]=S.les[id]||{};S.les[id][lid]=1;
 /* lo que el resto de la app ya leía: «qué haces», la reacción al reto y la calificación */
 if(lid==="1.1"){S.st[id]=S.st[id]||{};S.st[id].hace=1}
 if(lid==="2.1"&&!S.res[id]&&S.int&&S.int[id]&&S.int[id]["2.1"])S.res[id]=S.int[id]["2.1"];
 save()}
/* quien ya había avanzado en una carrera que ahora tiene catálogo completo conserva esas tres lecciones */
function migrateLessons(){(Object.keys(CAT.car||{})).forEach(function(id){S.mig=S.mig||{};if(S.mig[id])return;S.mig[id]=1;S.les=S.les||{};var L=S.les[id]=S.les[id]||{};
  if(S.st[id]&&S.st[id].hace)L["1.1"]=1;if(S.res[id])L["2.1"]=1;if(S.rate[id]!=null)L["6.2"]=1})}

var PATH=(function(){
 /* ---------- la ruta como viaje entre islas ----------
    Cada unidad es una isla y sus lecciones son paradas sobre un sendero que la cruza. Las islas van una tras otra en el mar
    y se recorren de lado (deslizando). Lo que no has explorado está en boceto, igual que en el mapa.
    Abajo, una tarjeta fija dice qué parada tienes elegida y deja empezarla. */
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
  lugar:'<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.4"/>',
  gana:'<ellipse cx="12" cy="7" rx="7" ry="3"/><path d="M5 7v5c0 1.7 3 3 7 3s7-1.3 7-3V7M5 12v5c0 1.7 3 3 7 3s7-1.3 7-3v-5"/>',
  chip:'<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
  flecha:'<path d="M5 19 19 5M10 5h9v9"/>',
  repaso:'<path d="M5 19V9M10 19V5M15 19v-7M20 19v-4"/>',
  veredicto:'<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v3M8 20h8M9 17h6"/>',
  cofre:'<path d="M4 10h16v9H4zM4 10l2-5h12l2 5M12 10v4"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',lock:'<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'
 };
 var LI={"1.1":"libro","1.2":"gente","1.3":"mito","1.4":"par","2.1":"reto","2.2":"reto","2.3":"reto","2.4":"reto","3.1":"dia","3.2":"dificil","3.3":"testi","3.4":"brujula","4.1":"etapas","4.2":"puerta","4.3":"donde","5.1":"lugar","5.2":"gana","5.3":"chip","5.4":"flecha","6.1":"repaso","6.2":"veredicto","0":"brujula","ex":"veredicto"};
 /* forma de cada parada: la misma silueta dos veces (la de abajo, más oscura, le da volumen) */
 var SH={
  sello:'<circle cx="40" cy="38" r="33"/>',
  hexagono:'<path d="M40 4 70 21v34L40 72 10 55V21Z" stroke-linejoin="round"/>',
  pergamino:'<path d="M14 12h52a6 6 0 0 1 6 6v0a6 6 0 0 1-6 6h-2v28h2a6 6 0 0 1 6 6v0a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6v0a6 6 0 0 1 6-6h2V24h-2a6 6 0 0 1-6-6v0a6 6 0 0 1 6-6Z"/>',
  brujula:'<path d="M40 3 75 38 40 73 5 38Z" stroke-linejoin="round"/>',
  final:'<path d="M40 2l7 6.4 9.3-1.3 2 9.2 8.2 4.6-3.900 8.5 3.900 8.5-8.2 4.6-2 9.200-9.300-1.300L40 59.400l-7 6.300-9.300 1.300-2-9.200-8.200-4.600 3.900-8.500-3.900-8.500 8.200-4.600 2-9.200 9.300 1.300Z" transform="translate(0 6) scale(1 1)" stroke-linejoin="round"/>',
  cofre:'<rect x="10" y="16" width="60" height="50" rx="12"/>'
 };
 function nodeSVG(it){var sh=SH[it.parada]||SH.sello,inner=it.parada==="sello"?'<circle class="rt-perf" cx="40" cy="38" r="26.5"/>':"";
  return '<svg class="rt-shape" viewBox="0 0 80 88" aria-hidden="true"><g class="rt-ex" transform="translate(0 7)">'+sh+'</g><g class="rt-top">'+sh+inner+'</g></svg>'}
 var st={id:null,el:null,sc:null,items:[],units:[],sel:-1,geo:null};
 function chestKey(ui){return "u"+(ui+1)}
 function chestDone(id,ui){return !!(S.chest&&S.chest[id+":"+chestKey(ui)])}

 /* la ruta de la carrera: unidades, paradas y su estado */
 function catalog(id){
  var U=estOf(id).unidades.map(function(u,ui){
   var items=u.lecciones.map(function(l,li){var cl=carLes(id,l[0]);return {lid:l[0],n:cl?cl.titulo:(carCat(id)?l[1]:(l[0]==="1.1"?"Qué haces":l[0]==="2.1"?"Mini reto":l[1])),parada:l[2],les:cl,u:ui,li:li,min:cl?cl.minutos:null}});
   if(unitFull(id,ui))items.push({chest:ui,n:"Cofre de la unidad",u:ui,li:items.length,parada:"cofre"});
   return {t:u.titulo,sub:u.sub,items:items,n:u.lecciones.length}});
  var all=[],blocked=false;U.forEach(function(u){u.items.forEach(function(it){all.push(it)})});
  all.forEach(function(it,k){it.k2=k;
   if(it.chest!=null){it.done=chestDone(id,it.chest);it.state=it.done?"done":unitDone(id,it.chest)?"open":"lock";return}
   if(!lessHas(id,it.lid)){it.state="soon";return}
   it.done=lessDone(id,it.lid);it.state=it.done?"done":blocked?"lock":"cur";if(!it.done)blocked=true});
  U.forEach(function(u){var L=u.items.filter(function(it){return it.lid});u.done=L.filter(function(it){return it.done}).length;u.avail=L.filter(function(it){return it.state!=="soon"}).length;
   u.state=!u.avail?"soon":u.done===L.length?"done":L.some(function(it){return it.state==="cur"||it.done})?"cur":"lock"});
  return {units:U,all:all}}
 function chestSVG(open){
  return '<svg viewBox="0 0 80 72" aria-hidden="true"><ellipse cx="40" cy="64" rx="30" ry="6" fill="#000" opacity=".22"/>'+
   '<path d="M12 34L40 48L68 34V56L40 70L12 56Z" fill="#C98A3A"/><path d="M40 48L68 34V56L40 70Z" fill="#A86E28"/>'+
   '<path d="M12 34L40 48V70L12 56Z" fill="#D99A48"/><path d="M24 40V62M56 40V62" stroke="#F2C14E" stroke-width="3"/>'+
   (open?'<path d="M12 34L40 20L68 34L40 48Z" fill="#4A2C12"/><path d="M12 34L40 20L40 6L12 20Z" fill="#E0A54E"/><path d="M40 20L68 34L68 20L40 6Z" fill="#C9883A"/><circle cx="40" cy="30" r="5" fill="#FFE59A" opacity=".9"/>'
    :'<path d="M12 34L40 20L68 34L40 48Z" fill="#E8AE55"/><path d="M12 34L40 48L40 40L12 26Z" fill="#E8AE55"/><path d="M12 26L40 12L68 26L40 40Z" fill="#F2C470"/><path d="M40 40L68 26V34L40 48Z" fill="#C98A3A"/>')+
   '<rect x="35" y="'+(open?46:42)+'" width="10" height="10" rx="2" fill="#F2C14E" stroke="#8A5A1E" stroke-width="1.4"/><circle cx="40" cy="'+(open?50:46)+'" r="1.6" fill="#8A5A1E"/></svg>'}

 /* ---------- el temario de la carrera ----------
    Cada unidad es una sección con su número, de qué trata y su avance; debajo, sus lecciones con título, tipo y minutos.
    Rumbo se asoma en la que sigue. Al final, el edificio de la carrera como meta. */
 var KIND={chat:["Plática con Rumbo","chat"],reto:["Reto","bolt"],voltear:["Tarjetas","layers"],testi:["Historia real","quote"],dato:["Datos reales","chart"],lee:["Lectura y preguntas","book"],sobre:["Sobre ti","user"],juega:["Preguntas","check"],examen:["Examen · apruebas con 7","check"]};
 function build(id){
  var c=byId[id],p=$("#plaza"),dark=!!(DMQ&&DMQ.matches),cat=catalog(id),pg=progOf(id);st.id=id;carCards(id,function(){});st.items=cat.all;st.units=cat.units;
  if(typeof artDefs==="function")artDefs();
  var col=c.color,cd=dk(col,.38),txt=lum(col)>.62?"#14323F":"#FFFFFF";
  p.style.setProperty("--pc",col);
  st.tower=typeof TORRE!=="undefined"&&TORRE.has(id);
  var cu=cat.units.filter(function(u){return u.state==="cur"})[0]||cat.units.filter(function(u){return u.state!=="done"})[0]||cat.units[cat.units.length-1],cui=cat.units.indexOf(cu);
  var h='<div class="lp rt2 rt4 '+(st.tower?"rt8":"rt7")+(dark?" lp-dark":"")+'" style="--c:'+col+';--cd:'+cd+';--ct:'+txt+'">'+
   '<header class="rt2-head"><button class="lp-back rt2-back" id="pzx" aria-label="Volver al mapa"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>'+
   '<div class="rt2-t"><h2>'+esc(c.name)+'</h2>'+(st.tower?'<small class="rt8-unit">'+(pg.p>=1?"Carrera dominada":"Unidad "+(cui+1)+" · "+esc(cu.t))+'</small>':'')+'<div class="rt2-pg"><div class="rt2-bar"><i style="width:'+(pg.p*100).toFixed(1)+'%"></i></div><b class="num">'+pg.done+(st.tower?' de '+pg.total+' lecciones':'/'+pg.total)+'</b></div></div>'+(typeof escHas==="function"&&escHas(id)?'<button type="button" class="rt2-esc" id="lpEsc" aria-label="Dónde estudiar '+esc(c.name)+'">'+icon('<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5M22 9v6"/>',"lp-ic")+'<span><b>Escuelas</b><small>'+escCount(id)+'</small></span></button>':'')+'</header>'+
   (st.tower?'<div class="rt4-stage tw-wrap" id="lpScroll"><div class="tw-host" id="lpCol"></div></div>':'<div class="rt4-stage" id="lpScroll"><div class="rt4-col" id="lpCol"></div></div>')+
   '<div class="rt2-card" id="lpPop" aria-live="polite"></div></div>';
  p.innerHTML=h;st.el=p.querySelector(".lp");st.sc=$("#lpScroll");
  if(st.tower)drawTower(id,cat,pg);else draw(id,cat,pg);
  $("#pzx").onclick=function(){leave();exitPlaza()};var eb=$("#lpEsc");if(eb)eb.onclick=function(){escSheet(id)};
  if(!st.rz){st.rz=1;var tm;window.addEventListener("resize",function(){clearTimeout(tm);tm=setTimeout(function(){if(st.sc&&st.sc.isConnected)placeRumbo(curIndex(),false)},120)})}
  var ci=curIndex();placeRumbo(ci,false);select(ci,false);toCur(ci,false);
 }
 /* ---------- la torre (por ahora Derecho): ver src/torre.js ---------- */
 function towerNode(it){
  if(it.chest!=null)return '<span class="tw-face">'+chestSVG(it.done)+'</span>';
  var ic=it.state==="done"?LIC.check:LIC[LI[it.lid]]||LIC.libro;
  return nodeSVG(it)+'<span class="tw-ic">'+icon(ic,"lp-ic")+'</span>'+(it.state==="cur"?'<svg class="tw-ring" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46"/><circle cx="50" cy="50" r="46" class="v" pathLength="100" style="stroke-dasharray:'+ringOf(it)+' 100"/></svg>':'')}
 /* el aro de la parada actual: cuánto llevas de esa lección si la dejaste a la mitad */
 function ringOf(it){var c=CARDS[st.id],i=S.lp&&S.lp[st.id+":"+it.lid];if(c==null||i==null)return 0;var l=carFind(c,it.lid);return l?Math.round(i/l.tarjetas.length*100):0}
 function drawTower(id,cat,pg){
  var mastered=pg.p>=1;
  st.items=cat.all;
  st.tw=TORRE.build({id:id,host:$("#lpCol"),units:cat.units,all:cat.all,pg:pg,mastered:mastered&&!!(S.twm&&S.twm[id]),cur:curIndex(),
   rb:(typeof skinOn==="function"&&RUMBO.SKINS[id]&&skinOn(id)?skinRb(id):rumboEl()),nodeHTML:towerNode});
  st.tw.onRender=globeFollow;
  PZ.rb=st.tw.rb.querySelector(".rb");PZ.el=null;wireRumbo(PZ.rb);
  each(st.tw.host.querySelectorAll(".tw-n"),function(b){b.onclick=function(e){e.stopPropagation();select(+b.getAttribute("data-i"),true)}});
  /* el piso de una unidad recién terminada destella una vez */
  S.twf=S.twf||{};each(st.tw.host.querySelectorAll(".tw-floor.is-done"),function(g){var k=id+":"+g.getAttribute("data-f");if(!S.twf[k]){S.twf[k]=1;save();g.classList.add("flash");if(PZ.rb)setTimeout(function(){mood(PZ.rb,"happy","jump")},500)}});
  /* maestría: Rumbo sube a la cima y la estrella se enciende */
  if(mastered&&!(S.twm&&S.twm[id])){S.twm=S.twm||{};S.twm[id]=1;save();st.twMaster=true}
 }
 function draw(id,cat,pg){
  var col=$("#lpCol");st.items=cat.all;var h='';
  cat.units.forEach(function(u,ui){var L2=u.items.filter(function(it){return it.lid}),p=L2.length?u.done/L2.length:0;
   h+='<section class="rt7-u s-'+u.state+'"><header class="rt7-uh"><span class="rt7-un num">'+(ui+1)+'</span><div class="rt7-ut"><b>'+esc(u.t)+'</b><small>'+esc(u.sub||"")+'</small></div>'+
    '<div class="rt7-up"><em class="num">'+(u.state==="soon"?"Pronto":u.done+" de "+L2.length)+'</em><i style="--v:'+p.toFixed(3)+'"></i></div></header><div class="rt7-list">';
   u.items.forEach(function(it){var k=it.k2,kd=it.chest!=null?["Cofre de la unidad","gift"]:(KIND[it.les&&it.les.k]||(it.lid==="2.1"?KIND.reto:KIND.juega)),
     ic=it.chest!=null?"":LIC[LI[it.lid]]||LIC.libro;
    h+='<button type="button" class="rt3-n rt7-n s-'+it.state+(it.chest!=null?" is-chest":"")+'" data-i="'+k+'" aria-label="'+(it.lid?it.lid+" ":"")+esc(it.n)+(it.state==="done"?", hecha":it.state==="soon"?", llega pronto":it.state==="lock"?", todavía no":"")+'">'+
     '<span class="rt7-ic">'+(it.chest!=null?chestSVG(it.done):icon(it.state==="done"?LIC.check:ic,"lp-ic"))+'</span>'+
     '<span class="rt7-tx"><b>'+esc(it.n)+'</b><small>'+(it.chest!=null?(it.done?"Ya lo abriste":it.state==="open"?"Listo para abrir":"Se abre al terminar la unidad"):it.state==="soon"?"Llega pronto":esc(kd[0])+(it.min?" · "+it.min+" min":""))+'</small></span>'+
     '<span class="rt7-st">'+(it.state==="done"?'<i class="rt7-ok">Hecha</i>':it.state==="cur"||it.state==="open"?'<i class="rt7-go">'+(it.chest!=null?"Abrir":"Sigue")+'</i>':'')+'</span></button>'});
   h+='</div></section>'});
  h+='<div class="rt7-goal'+(pg.p>=1?" is-done":"")+'"><div class="rt4-gart">'+artSVG(id,pg.p)+'</div><div><b>'+(pg.p>=1?"¡Llegaste!":"La meta")+'</b><small>'+(pg.p>=1?"Ganaste el sello de la carrera":"Termina todo para ganar su sello")+'</small></div></div>';
  h+='<div class="rt2-rb rt7-rb" id="lpRb">'+(typeof skinOn==="function"&&RUMBO.SKINS[id]&&skinOn(id)?skinRb(id):rumboEl())+'</div>';
  col.style.width="";col.style.height="";col.innerHTML=h;
  PZ.rb=col.querySelector(".rt2-rb .rb");PZ.el=null;wireRumbo(PZ.rb);
  each(col.querySelectorAll(".rt7-n"),function(b){b.onclick=function(e){e.stopPropagation();var i=+b.getAttribute("data-i"),it=st.items[i];
   /* segundo toque sobre la ya elegida: empieza */
   if(st.sel===i&&it&&(it.state==="cur"||it.state==="open"||it.state==="done")){run(it);return}
   select(i,true)}});
 }
 function toCur(i,smooth){if(st.tower){var q=st.tw&&TORRE.pos(st.tw,i);if(q)TORRE.scrollTo(st.tw,q.y,smooth);return}var s=st.sc,b=s&&s.querySelector('.rt7-n[data-i="'+i+'"]');if(!b)return;var t=Math.max(0,b.offsetTop-s.clientHeight*.38);if(smooth&&!RM()&&s.scrollTo)s.scrollTo({top:t,behavior:"smooth"});else s.scrollTop=t}
 function fit(){}
 function curIndex(){for(var i=0;i<st.items.length;i++)if(st.items[i].state==="open")return i;
  for(i=0;i<st.items.length;i++)if(st.items[i].state==="cur")return i;
  for(i=st.items.length-1;i>=0;i--)if(st.items[i].state==="done")return i;return 0}
 /* en la espiral: Rumbo está en la parada actual, al frente; al avanzar, la espiral gira y sube con él */
 function towerRumbo(i,walk){var T=st.tw,it=st.items[i];if(!T||!it)return;
  if(st.twMaster){st.twMaster=false;var gl0=$("#twGlobe");if(gl0)gl0.hidden=true;TORRE.place(T,i);
   setTimeout(function(){TORRE.climbTop(T,i,function(){var s2=T.host.querySelector(".tw-star");if(s2)s2.classList.add("is-on","light");if(PZ.rb)mood(PZ.rb,"happy","jump");if(typeof sfx==="function")sfx("ok")})},500);return}
  if(walk&&T.cur!=null&&T.cur>=0&&T.cur!==i){var gl=$("#twGlobe");if(gl)gl.hidden=true;TORRE.hop(T,T.cur,i,function(){if(PZ.rb)mood(PZ.rb,"happy","jump");towerSelect(i)})}
  else TORRE.place(T,i);
  if(PZ.rb)mood(PZ.rb,it.state==="done"?"happy":"idle")}
 /* el globo acompaña a su botón mientras la espiral gira */
 function globeFollow(){var g=$("#twGlobe");if(!g||g.hidden||st.sel==null)return;var q=TORRE.pos(st.tw,st.sel);if(!q)return;
  var sw=g.parentNode.clientWidth,gw=g.offsetWidth||180,x=Math.max(gw/2+6,Math.min(sw-gw/2-6,q.x));
  g.style.setProperty("--ax",Math.max(-(gw/2-20),Math.min(gw/2-20,q.x-x))+"px");g.style.left=x+"px";g.style.top=(q.y+q.sz*.5+14)+"px"}
 /* Rumbo se asoma junto a la lección que sigue */
 function placeRumbo(i,walk){if(st.tower){towerRumbo(i,walk);return}var e=$("#lpRb"),b=document.querySelector('.rt7-n[data-i="'+i+'"]');if(!e||!b)return;var it=st.items[i];
  e.style.top=(b.offsetTop+b.offsetHeight/2)+"px";
  if(PZ.rb){if(walk&&!RM()){PZ.rb.classList.add("walk");setTimeout(function(){PZ.rb&&PZ.rb.classList.remove("walk")},720)}
   mood(PZ.rb,it&&it.state==="done"?"happy":"idle")}}
 function unitOf(i){return st.items[i].u}
 /* tarjeta de abajo con la parada elegida */
 function select(i,scroll){
  if(st.tower){towerSelect(i);return}
  st.sel=i;var it=st.items[i],u=st.units[it.u],pop=$("#lpPop");
  each(document.querySelectorAll(".rt7-n"),function(b){b.classList.toggle("is-sel",+b.getAttribute("data-i")===i)});
  var h='<div class="rt2-ci"><div class="rt2-ct"><span>Unidad '+(it.u+1)+' de '+st.units.length+' · '+esc(u.t)+'</span><h3>'+esc(it.n)+'</h3></div>',btn="",meta="";
  if(it.state==="soon")meta="Llega pronto";
  else if(it.state==="lock")meta=it.chest!=null?"Termina la unidad para abrirlo":"Termina la lección anterior";
  else if(it.chest!=null){meta=it.done?"Ya lo abriste":"Unidad terminada";if(!it.done)btn='<button class="ui-btn is-block" id="lpGo">Abrir</button>'}
  else{meta=(it.min?it.min+" min":"Unos minutos")+(it.state==="done"?" · Hecha":"");btn='<button class="ui-btn is-block'+(it.state==="done"?" is-sec":"")+'" id="lpGo">'+(it.state==="done"?"Repasar":S.lp&&S.lp[st.id+":"+it.lid]!=null?"Seguir":"Empezar")+'</button>'}
  h+='<em class="rt2-meta s-'+it.state+'">'+meta+'</em></div>'+btn;
  pop.innerHTML=h;
  var go=$("#lpGo");if(go)go.onclick=function(e){e.stopPropagation();run(it)};
 }
 /* globo sobre la parada elegida: título, minutos y el botón para empezar */
 function towerSelect(i){
  st.sel=i;var it=st.items[i],g=$("#twGlobe");if(!g||!it)return;
  each(document.querySelectorAll(".tw-n"),function(b){b.classList.toggle("is-sel",+b.getAttribute("data-i")===i)});
  var lab=null,meta="";
  if(it.state==="soon")meta="Llega pronto";
  else if(it.state==="lock")meta=it.chest!=null?"Termina la unidad para abrirlo":"Termina la lección anterior";
  else if(it.chest!=null){if(!it.done)lab="Abrir";else meta="Ya lo abriste"}
  else lab=it.state==="done"?"Repasar":S.lp&&S.lp[st.id+":"+it.lid]!=null?"Seguir":"Empezar";
  if(!lab&&it.state==="done"){g.hidden=true;TORRE.focus(st.tw,i);return}
  g.innerHTML='<b>'+esc(it.n)+'</b><small>'+(meta||((it.min?it.min+" min":"Unos minutos")+(it.state==="done"?" · Hecha":"")))+'</small>'+(lab?'<button type="button" class="ui-btn tw-go" id="lpGo">'+lab+'</button>':'');
  g.classList.toggle("is-lock",!lab);g.hidden=false;globeFollow();
  var go=$("#lpGo");if(go)go.onclick=function(e){e.stopPropagation();run(it)};
  /* la espiral gira para traer ese botón al frente */
  TORRE.focus(st.tw,i);
 }
 /* cuántas opciones hay en tu estado (o en toda la región) */
 function escCount(id){var d=CAT.uni.car[id],m=escMine(),n=m?d.donde.filter(function(x){return x.edo.indexOf(m)>=0}).length:d.donde.length;return m?(n?n+" en "+ESC_EDO[m]:"Ver en CDMX"):n+" opciones"}
 function toIsle(){}
 /* abrir una lección */
 function run(it){
  var id=st.id,c=byId[id];
  if(it.chest!=null){openChest(it);return}
  var was=it.done,fin=function(){markLesson(id,it.lid);if(!was)complete(it);else refresh(false)};
  if(it.les){var u=st.units[it.u],last=u.items.filter(function(x){return x.lid}).pop()===it;
   carCards(id,function(full){var les=full&&carFind(full,it.lid);
    if(!les){toast("No se pudo abrir la lección. Revisa tu conexión e intenta otra vez.");return}
   var v2=isV2(id)?{full:full,order:lessList(id).map(function(x){return x[0]})}:null;
   LEC.open(id,les,{unit:it.u,unitName:u.t,unitEnd:!v2&&last&&unitFull(id,it.u)&&!(S.auto&&S.auto[id]&&S.auto[id][it.u]),resume:!v2,v2:v2},fin,function(){refresh(false)})});return}
  /* carreras sin catálogo todavía: lo que ya existía */
  if(it.lid==="2.1"){openTest(id);return}
  if(it.lid==="1.1"){LEC.open(id,{id:"1.1",titulo:"Qué haces",tarjetas:[{tipo:"escena",texto:c.desc},{tipo:"interes"}]},{},fin);return}
  if(it.lid==="6.2"){LEC.open(id,{id:"6.2",titulo:"Tu veredicto",tarjetas:[{tipo:"veredicto"}]},{},fin);return}
 }
 function lesson(html,cta,onDone){
  var o=document.createElement("div");o.className="lp-lesson";o.id="lpLesson";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");
  o.innerHTML='<div class="lp-lin">'+html+'<button class="ui-btn is-block" id="lpLok">'+cta+'</button></div>';
  st.el.appendChild(o);requestAnimationFrame(function(){o.classList.add("on")});
  var rbw=o.querySelector(".rb");if(rbw)wireRumbo(rbw);
  $("#lpLok").onclick=function(){onDone();o.classList.remove("on");setTimeout(function(){o.remove()},RM()?0:T.med)};
 }
 function openChest(it){
  var id=st.id,c=byId[id],b=document.querySelector('.rt3-n[data-i="'+it.k2+'"]'),u=st.units[it.u];
  S.chest=S.chest||{};S.chest[id+":"+chestKey(it.chest)]=1;save();
  if(b){b.innerHTML=chestSVG(true);restart(b,"opened");burstAt(b)}
  /* al cerrar la unidad 2 se gana el Rumbo de la carrera */
  var skin=it.chest===1&&RUMBO.SKINS[id]&&!(S.skw&&S.skw[id]);
  setTimeout(function(){
   if(skin){S.skw=S.skw||{};S.skw[id]=1;save();
    lesson('<div class="rt-skin">'+skinRb(id,"cheer")+'</div><h2>¡Ganaste a '+esc(RUMBO.SKINS[id].n)+'!</h2><p>Ya está en tu colección.</p><button class="ui-btn is-block is-sec" id="rtUse">Ponérmelo</button>',"Seguir",function(){refresh(true)});
    var ub=$("#rtUse");if(ub)ub.onclick=function(){setSkin(id);$("#lpLok").click()};return}
   var left=progOf(id);
   lesson('<div class="lp-chestbig">'+chestSVG(true)+'</div><h2>¡Unidad completa!</h2><p>'+(left.p>=1?'Completaste '+esc(c.name)+'. Su sello te espera en el mapa.':'Te faltan '+(left.total-left.done)+' lecciones para el sello.')+'</p>',"Seguir",function(){refresh(true)})},RM()?0:500);
 }
 function burstAt(b){if(RM())return;var cols=["#F2B544","#FFFFFF","#7FB59A","#8FC9E8"];for(var i=0;i<12;i++){var s=document.createElement("i");s.className="lp-pt";s.style.background=cols[i%4];s.style.setProperty("--a",(i*30)+"deg");b.appendChild(s);setTimeout(function(x){return function(){x.remove()}}(s),700)}}
 /* al terminar una lección: la parada se llena, chispas, y Rumbo camina a la siguiente */
 function complete(it){
  var b=document.querySelector('.rt3-n[data-i="'+it.k2+'"]');if(b){b.classList.remove("s-cur");b.classList.add("s-done","fill");burstAt(b)}
  if(typeof sfx==="function")sfx("ok");
  setTimeout(function(){refresh(true)},RM()?0:650);
 }
 /* en la torre no se redibuja la escena: solo cambia lo que avanzó (paradas, pisos, encabezado y estrella) */
 function towerRefresh(animate){var prev=curIndex(),id=st.id,cat=catalog(id),pg=progOf(id),T=st.tw;
  cat.all.forEach(function(it,k){var o=st.items[k];it.a=o.a;it.px=o.px;it.py=o.py;it.sz=o.sz;it.d=o.d;T.items[k]=it;
   var b=T.host.querySelector('.tw-n[data-i="'+k+'"]'),cl="rt3-n tw-n s-"+it.state+(it.chest!=null?" is-chest":"");
   /* solo se toca la parada que cambió de estado (o su cofre al abrirse) */
   if(b&&(b.__cl!==cl||it.chest!=null&&b.__op!==it.done)){b.className=cl+(b.classList.contains("is-sel")?" is-sel":"");b.innerHTML=towerNode(it);b.__cl=cl;b.__op=it.done}});
  st.items=cat.all;st.units=cat.units;
  cat.units.forEach(function(u,ui){var L2=u.items.filter(function(it){return it.lid}),p=L2.length?u.done/L2.length:0,g=T.host.querySelector('.tw-floor[data-f="'+ui+'"]');
   if(g){var was=g.classList.contains("is-done");g.classList.toggle("is-done",p>=1);g.querySelector(".tw-col").style.opacity=p>=1?1:(p*.8).toFixed(2);
    S.twf=S.twf||{};if(p>=1&&!was&&!S.twf[id+":"+ui]){S.twf[id+":"+ui]=1;save();g.classList.remove("flash");setTimeout(function(){g.classList.add("flash")},animate?700:0)}}});
  var r=-1;cat.all.forEach(function(it,j){if(it.done&&r===j-1)r=j});T.doneA=r<0?T.a0:cat.all[r].a+(cat.all[r+1]?(cat.all[r+1].a-cat.all[r].a)/2:0);
  var bar=st.el.querySelector(".rt2-bar i");if(bar)bar.style.width=(pg.p*100).toFixed(1)+"%";
  var nb=st.el.querySelector(".rt2-pg b");if(nb)nb.textContent=pg.done+" de "+pg.total+" lecciones";
  var cu=cat.units.filter(function(u){return u.state==="cur"})[0]||cat.units.filter(function(u){return u.state!=="done"})[0]||cat.units[cat.units.length-1],ut=st.el.querySelector(".rt8-unit");
  if(ut)ut.textContent=pg.p>=1?"Carrera dominada":"Unidad "+(cat.units.indexOf(cu)+1)+" · "+cu.t;
  if(pg.p>=1&&!(S.twm&&S.twm[id])){S.twm=S.twm||{};S.twm[id]=1;save();st.twMaster=true}
  var ci=curIndex();st.sel=ci;
  if(animate&&ci!==prev)towerRumbo(ci,true);else{towerRumbo(ci,false);towerSelect(ci)}}
 function refresh(animate){if(!st.sc||!$("#lpScroll"))return;if(st.tower&&st.tw&&st.tw.host.isConnected){towerRefresh(animate);return}var prev=curIndex();build(st.id);
  var ci=curIndex();if(animate&&ci!==prev){var sc=st.sc.scrollTop;placeRumbo(prev,false);toCur(prev,false);void document.body.offsetWidth;setTimeout(function(){placeRumbo(ci,true);toCur(ci,true)},RM()?0:60)}
  if(animate&&PZ.rb)setTimeout(function(){mood(PZ.rb,"happy","jump")},RM()?0:760)}
 function show(){document.body.classList.add("lp-open");placeRumbo(curIndex(),false);toCur(curIndex(),false);if(PZ.rb)mood(PZ.rb,"happy","wave")}
 function react(id){var k=S.res[id];if(!carCat(id))markLesson(id,"2.1");refresh(true);if(PZ.rb)mood(PZ.rb,k==="yes"?"happy":k==="mid"?"meh":"no",k==="yes"?"jump":k==="mid"?"tilt":"shake")}
 function leave(){document.body.classList.remove("lp-open");ambSync();if(typeof LEC!=="undefined")LEC.close();var l=$("#lpLesson");if(l)l.remove()}
 return {build:build,show:show,react:react,leave:leave,_st:function(){return st},state:function(){},closePop:function(){},catalog:catalog};
})();
