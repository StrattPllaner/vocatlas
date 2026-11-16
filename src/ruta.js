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
 var LI={"1.1":"libro","1.2":"gente","1.3":"mito","1.4":"par","2.1":"reto","2.2":"reto","2.3":"reto","2.4":"reto","3.1":"dia","3.2":"dificil","3.3":"testi","3.4":"brujula","4.1":"etapas","4.2":"puerta","4.3":"donde","5.1":"lugar","5.2":"gana","5.3":"chip","5.4":"flecha","6.1":"repaso","6.2":"veredicto"};
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
  var U=CAT.est.unidades.map(function(u,ui){
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

 /* ---------- la ruta es una espiral hacia el centro de la carrera ----------
    Una sola isla redonda. El sendero entra por la playa y da vueltas hacia el centro, donde está el edificio de la carrera.
    La isla empieza en boceto y se pinta a color por donde ya pasaste, igual que el mapa. Todo cabe en una pantalla. */
 var V=400,VH=400,KY=1,CX=200,CY=204,R0=150,R1=52,TURNS=2.15,A0=Math.PI*.5;
 /* en celular la isla se estira a lo alto para llenar la pantalla */
 function shape(){var vw=window.innerWidth,vh=window.innerHeight;KY=Math.max(.92,Math.min(1.5,(vh-230)/Math.max(200,vw-24)));VH=Math.round(400*KY);CY=Math.round(VH/2+4)}
 /* la espiral muestreada: puntos y largo acumulado */
 function spiral(){if(st.sp)return st.sp;var pts=[],L=[0],N=700,TH=TURNS*Math.PI*2;
  for(var i=0;i<=N;i++){var t=i/N,th=t*TH,r=R0-(R0-R1)*t,a=A0+th;pts.push([CX+Math.cos(a)*r,CY+Math.sin(a)*r*.96*KY]);if(i)L.push(L[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]))}
  st.sp={p:pts,L:L,T:L[N]};return st.sp}
 function at(f){var S=spiral(),want=f*S.T,lo=0,hi=S.L.length-1;while(hi-lo>1){var m=(lo+hi)>>1;if(S.L[m]<want)lo=m;else hi=m}return S.p[hi]}
 function pathTo(f){var S=spiral(),d="",want=f*S.T;for(var i=0;i<S.p.length&&S.L[i]<=want+.01;i+=3)d+=(i?"L":"M")+S.p[i][0].toFixed(1)+" "+S.p[i][1].toFixed(1);return d}
 /* dónde va cada parada sobre el sendero (las primeras un poco más separadas: la vuelta de afuera es más larga) */
 function posOf(k,n){return .035+.93*k/(n-1)}
 /* suelo de la isla (a color); la versión boceto sale de la misma con ISO.sketchAll */
 function ground(id){
  var c=byId[id],r=rng(hash(id+"espiral")),grass=mixHex(c.color,"#8CC772",.66),grass2=mixHex(c.color,"#72AE5F",.6),road=pathTo(1);
  var coast=ISO.smooth(ISO.blobPts(CX,CY,R0+30,(R0*.96+28)*KY,5,r()*6,.05,null,72)),top=ISO.smooth(ISO.blobPts(CX,CY-2,R0+12,(R0*.96+10)*KY,5,r()*6,.05,null,72));
  var g='<path d="'+coast+'" fill="#D9B97E" transform="translate(0 9)"/><path d="'+coast+'" fill="#F1DDAE"/>'+
   '<path d="'+top+'" fill="'+grass2+'" transform="translate(0 5)"/><path d="'+top+'" fill="'+grass+'"/>';
  /* manchas de pasto más claro entre las vueltas */
  for(var k=0;k<7;k++){var q=at(.06+k*.13),dx=(q[0]-CX)*.12,dy=(q[1]-CY)*.12;g+='<ellipse cx="'+(q[0]+dx).toFixed(0)+'" cy="'+(q[1]+dy).toFixed(0)+'" rx="'+(16+r()*12).toFixed(0)+'" ry="'+(7+r()*5).toFixed(0)+'" fill="'+mixHex(grass,"#FFFFFF",.18)+'"/>'}
  /* sendero: orilla, arena y huellas al centro */
  g+='<path d="'+road+'" fill="none" stroke="#C9A877" stroke-width="19" stroke-linecap="round" stroke-linejoin="round"/>'+
   '<path d="'+road+'" fill="none" stroke="#EED9AE" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>'+
   '<path d="'+road+'" fill="none" stroke="#D8BE8C" stroke-width="2" stroke-dasharray="3 9" stroke-linecap="round"/>';
  /* vegetación en medio de las vueltas, lejos de las paradas y del centro */
  var dec="",K=["palm","treeRound","rock","bush","treePine","flowers","palm","bush","treeRound","rock"],placed=[];
  for(var t=0;t<160&&placed.length<9;t++){var f=r(),q2=at(f),mid=[CX+(q2[0]-CX)*(1+.17*(r()<.5?1:-1)),CY+(q2[1]-CY)*(1+.17*(r()<.5?1:-1))],dc=Math.hypot(mid[0]-CX,mid[1]-CY);
   var de=Math.hypot(mid[0]-CX,(mid[1]-CY)/KY);if(de<R1+40||de>R0+6)continue;var ok=true;
   for(var j=0;j<=40;j++){var s2=at(j/40);if(Math.hypot(s2[0]-mid[0],s2[1]-mid[1])<20){ok=false;break}}
   placed.forEach(function(p){if(Math.hypot(p[0]-mid[0],p[1]-mid[1])<30)ok=false});if(ok)placed.push(mid)}
  var hand="";placed.sort(function(a,b){return a[1]-b[1]}).forEach(function(p,i){dec+='<g transform="translate('+p[0].toFixed(1)+' '+p[1].toFixed(1)+') scale(.62)">'+ENV.one(K[i%K.length],{d:2,k:1,ph:i,flip:i%2===1})+'</g>';
   /* en boceto: un arbolito dibujado a mano */
   hand+='<g transform="translate('+p[0].toFixed(1)+' '+p[1].toFixed(1)+')" fill="#F7EEDB" stroke="#A88B62" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="1" cy="1" rx="8" ry="2.6" fill="#E9DCC0" stroke="none"/><path d="M0 0V-6" fill="none"/><circle cx="-4.5" cy="-9" r="5.2"/><circle cx="4.5" cy="-9.5" r="5"/><circle cx="0" cy="-14" r="6"/><path d="M-2 -15q2-2 4 0" fill="none" stroke-width=".9"/></g>'});
  return {c:g+dec,s:ISO.sketchAll(g)+'<path d="'+coast+'" fill="none" stroke="#B79C74" stroke-width="1.6"/>'+hand}}
 function build(id){
  shape();var c=byId[id],p=$("#plaza"),dark=!!(DMQ&&DMQ.matches),cat=catalog(id),pg=progOf(id);st.id=id;st.items=cat.all;st.units=cat.units;st.sp=null;
  if(typeof artDefs==="function")artDefs();
  var col=c.color,cd=dk(col,.38),txt=lum(col)>.62?"#14323F":"#FFFFFF",n=cat.all.length;
  p.style.setProperty("--pc",col);
  /* cuánto del sendero ya se recorrió: hasta la última parada hecha seguida */
  var reach=-1;cat.all.forEach(function(it,k){if(it.done&&reach===k-1)reach=k});
  var fr=reach<0?0:Math.min(1,posOf(reach,n)+.5/(n-1)),g=ground(id),road=pathTo(fr);
  /* la parte a color se ve solo por donde ya pasaste (una franja del ancho de una vuelta sobre el sendero) */
  var band=((R0-R1)/TURNS).toFixed(0),mask=fr>=.995?'<rect x="0" y="0" width="'+V+'" height="'+VH+'" fill="#fff"/>':
   (fr>0?'<path d="'+road+'" fill="none" stroke="#fff" stroke-width="'+band+'" stroke-linecap="round" stroke-linejoin="round"/>':'');
  var waves="";for(var w=0;w<10;w++){var a=w/10*6.283+.3,rr=R0+58+(w%3)*14;waves+='<path d="M'+(CX+Math.cos(a)*rr*1.12-9).toFixed(0)+' '+(CY+Math.sin(a)*rr*KY).toFixed(0)+'q4.5-4 9 0q4.5-4 9 0"/>'}
  var svg='<svg class="rt3-svg" viewBox="0 0 '+V+' '+VH+'" aria-hidden="true"><defs>'+ENV.DEFS+ISO.skDefs()+'<mask id="rt3m" maskUnits="userSpaceOnUse" x="0" y="0" width="'+V+'" height="'+VH+'">'+mask+'</mask></defs>'+
   '<g class="rt3-waves">'+waves+'</g>'+
   '<ellipse cx="'+CX+'" cy="'+(CY+8)+'" rx="'+(R0+62)+'" ry="'+((R0*.96+60)*KY).toFixed(0)+'" class="rt3-sh1"/><ellipse cx="'+CX+'" cy="'+(CY+6)+'" rx="'+(R0+44)+'" ry="'+((R0*.96+42)*KY).toFixed(0)+'" class="rt3-sh2"/>'+
   '<g>'+g.s+'</g>'+(mask?'<g mask="url(#rt3m)">'+g.c+'</g>':'')+
   '<path d="'+pathTo(1)+'" class="rt3-trail" pathLength="1000" style="stroke-dashoffset:'+(1000*(1-fr)).toFixed(0)+'"/></svg>';
  var h='<div class="lp rt2 rt3'+(dark?" lp-dark":"")+'" style="--c:'+col+';--cd:'+cd+';--ct:'+txt+'">'+
   '<header class="rt2-head"><button class="lp-back rt2-back" id="pzx" aria-label="Volver al mapa"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button>'+
   '<div class="rt2-t"><h2>'+esc(c.name)+'</h2><div class="rt2-pg"><div class="rt2-bar"><i style="width:'+(pg.p*100).toFixed(1)+'%"></i></div><b class="num">'+pg.done+'/'+pg.total+'</b></div></div></header>'+
   '<div class="rt3-stage" id="lpScroll"><div class="rt3-map" id="lpCol">'+svg+
   '<div class="rt3-core" aria-hidden="true">'+artSVG(id,pg.p)+'</div>';
  /* marcas de unidad: un banderín con su número antes de su primera parada */
  cat.units.forEach(function(u,ui){var it=u.items[0];if(!it)return;var f=Math.max(.004,posOf(it.k2,n)-.42/(n-1)),q=at(f);
   h+='<span class="rt3-u s-'+u.state+'" style="left:'+(q[0]/V*100).toFixed(2)+'%;top:'+(q[1]/VH*100).toFixed(2)+'%" aria-hidden="true">'+(ui+1)+'</span>'});
  cat.all.forEach(function(it,k){var q=at(posOf(k,n));it.x=q[0];it.y=q[1];
   var ic=it.chest!=null?"":it.state==="done"?LIC.check:it.state==="lock"||it.state==="soon"?LIC.lock:LIC[LI[it.lid]]||LIC.libro;
   h+='<button type="button" class="rt3-n s-'+it.state+(it.chest!=null?" is-chest":"")+(it.parada==="final"?" is-final":"")+'" data-i="'+k+'" style="left:'+(q[0]/V*100).toFixed(2)+'%;top:'+(q[1]/VH*100).toFixed(2)+'%" aria-label="'+(it.lid?it.lid+" ":"")+esc(it.n)+(it.state==="done"?", hecha":it.state==="soon"?", llega pronto":it.state==="lock"?", bloqueada":"")+'">'+
    (it.chest!=null?chestSVG(it.done):icon(ic,"lp-ic"))+'</button>'});
  h+='<div class="rt2-rb rt3-rb" id="lpRb">'+(typeof skinOn==="function"&&RUMBO.SKINS[id]&&skinOn(id)?skinRb(id):rumboEl())+'</div></div></div>'+
   '<div class="rt2-card" id="lpPop" aria-live="polite"></div></div>';
  p.innerHTML=h;
  st.el=p.querySelector(".lp");st.sc=$("#lpScroll");
  PZ.rb=p.querySelector(".rt2-rb .rb");PZ.el=null;wireRumbo(PZ.rb);
  $("#pzx").onclick=function(){leave();exitPlaza()};
  each(p.querySelectorAll(".rt3-n"),function(b){b.onclick=function(e){e.stopPropagation();select(+b.getAttribute("data-i"),true)}});
  fit();if(!st.rz){st.rz=1;window.addEventListener("resize",function(){if(st.sc&&st.sc.isConnected)fit()})}
  var ci=curIndex();placeRumbo(ci,false);select(ci,false);
 }
 /* el cuadro de la isla: lo más grande que quepa entre el encabezado y la tarjeta */
 function fit(){var s=st.sc,m=$("#lpCol");if(!s||!m)return;var w=s.clientWidth-12,h=s.clientHeight-6,z=Math.max(240,Math.min(w,h/(VH/V),820));m.style.width=z+"px";m.style.height=(z*VH/V)+"px"}
 function curIndex(){for(var i=0;i<st.items.length;i++)if(st.items[i].state==="open")return i;
  for(i=0;i<st.items.length;i++)if(st.items[i].state==="cur")return i;
  for(i=st.items.length-1;i>=0;i--)if(st.items[i].state==="done")return i;return 0}
 /* Rumbo de pie junto a la parada actual */
 function placeRumbo(i,walk){var e=$("#lpRb");if(!e)return;var it=st.items[i];if(!it)return;
  e.style.left=(it.x/V*100).toFixed(2)+"%";e.style.top=(it.y/VH*100).toFixed(2)+"%";
  if(PZ.rb){if(walk&&!RM()){PZ.rb.classList.add("walk");setTimeout(function(){PZ.rb&&PZ.rb.classList.remove("walk")},720)}
   mood(PZ.rb,it.parada==="hexagono"?"curious":it.state==="done"?"happy":"idle")}}
 function unitOf(i){return st.items[i].u}
 /* tarjeta de abajo con la parada elegida */
 function select(i,scroll){
  st.sel=i;var it=st.items[i],u=st.units[it.u],pop=$("#lpPop");
  each(document.querySelectorAll(".rt3-n"),function(b){b.classList.toggle("is-sel",+b.getAttribute("data-i")===i)});
  var h='<div class="rt2-ci"><div class="rt2-ct"><span>Unidad '+(it.u+1)+' de '+st.units.length+' · '+esc(u.t)+'</span><h3>'+esc(it.n)+'</h3></div>',btn="",meta="";
  if(it.state==="soon")meta="Llega pronto";
  else if(it.state==="lock")meta=it.chest!=null?"Termina la unidad para abrirlo":"Termina la lección anterior";
  else if(it.chest!=null){meta=it.done?"Ya lo abriste":"Unidad terminada";if(!it.done)btn='<button class="ui-btn is-block" id="lpGo">Abrir</button>'}
  else{meta=(it.min?it.min+" min":"Unos minutos")+(it.state==="done"?" · Hecha":"");btn='<button class="ui-btn is-block'+(it.state==="done"?" is-sec":"")+'" id="lpGo">'+(it.state==="done"?"Repasar":S.lp&&S.lp[st.id+":"+it.lid]!=null?"Seguir":"Empezar")+'</button>'}
  h+='<em class="rt2-meta s-'+it.state+'">'+meta+'</em></div>'+btn;
  pop.innerHTML=h;
  var go=$("#lpGo");if(go)go.onclick=function(e){e.stopPropagation();run(it)};
 }
 function toIsle(){}
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
 function refresh(animate){if(!st.sc||!$("#lpScroll"))return;var prev=curIndex();build(st.id);
  var ci=curIndex();if(animate&&ci!==prev){placeRumbo(prev,false);void document.body.offsetWidth;setTimeout(function(){placeRumbo(ci,true)},RM()?0:60)}
  if(animate&&PZ.rb)setTimeout(function(){mood(PZ.rb,"happy","jump")},RM()?0:760)}
 function show(){document.body.classList.add("lp-open");fit();if(PZ.rb)mood(PZ.rb,"happy","wave")}
 function react(id){var k=S.res[id];if(!carCat(id))markLesson(id,"2.1");refresh(true);if(PZ.rb)mood(PZ.rb,k==="yes"?"happy":k==="mid"?"meh":"no",k==="yes"?"jump":k==="mid"?"tilt":"shake")}
 function leave(){document.body.classList.remove("lp-open");ambSync();if(typeof LEC!=="undefined")LEC.close();var l=$("#lpLesson");if(l)l.remove()}
 return {build:build,show:show,react:react,leave:leave,state:function(){},closePop:function(){},catalog:catalog};
})();
