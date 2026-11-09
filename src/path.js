/* ================= camino de lecciones de cada carrera =================
   Al entrar a una carrera se abre un camino vertical de lecciones (unidades, nodos, cofres e ilustraciones a los lados).
   Las lecciones salen de lo que la app ya tiene por carrera: qué haces, mini reto y tu veredicto. Lo que todavía no
   tiene contenido (un día real, lo difícil, cuánto se gana, testimonio, dónde se estudia, repaso) aparece bloqueado
   con el aviso de que llega pronto; no se inventan datos. Usa el contenedor #plaza y sus transiciones. */
var PATH=(function(){
 var LIC={
  concepto:'<path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5z"/><path d="M12 6v13.5"/>',
  dia:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  reto:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
  dificil:'<path d="M3 19l6.5-10 4 6 2.5-3.5L21 19z"/>',
  gana:'<ellipse cx="12" cy="7" rx="7" ry="3"/><path d="M5 7v5c0 1.7 3 3 7 3s7-1.3 7-3V7M5 12v5c0 1.7 3 3 7 3s7-1.3 7-3v-5"/>',
  donde:'<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5M22 9v6"/>',
  testi:'<path d="M4 5h16v11H10l-5 4v-4H4z"/>',
  repaso:'<path d="M20 11a8 8 0 0 0-14.5-4.5L4 8M4 4v4h4M4 13a8 8 0 0 0 14.5 4.5L20 16M20 20v-4h-4"/>',
  veredicto:'<path d="M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4M12 14v3M8 20h8M9 17h6"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',lock:'<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'
 };
 /* fondo: un icono de línea por área, en patrón tenue */
 var PAT={salud:'<path d="M9 4h6v5h5v6h-5v5H9v-5H4V9h5z"/>',ing:'<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',
  tec:'<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',neg:'<path d="M12 3v18M5 7h14M7 7l-3 7h6zM17 7l-3 7h6z"/>',arte:'<path d="M3 7h18v12H3zM3 11h18M7 7l2-4M13 7l2-4"/>'};
 var PATC={medicina:PAT.salud,cine:PAT.arte,computacion:PAT.tec,derecho:PAT.neg,arquitectura:'<path d="M3 21h18M5 21L12 4l7 17M12 4v3M8 14h8"/>'};
 var DUR={concepto:"1 min",reto:"2 min",veredicto:"1 min"};
 var st={id:null,el:null,sc:null,raf:0,cur:null,items:[],units:[],headU:-1,onScroll:null};

 function chestDone(id,k){return !!(S.chest&&S.chest[id+":"+k])}
 /* catálogo de la carrera: unidades y lecciones con el contenido que existe hoy */
 function catalog(id){var c=byId[id];
  var U=[
   {t:"Conoce "+c.name,items:[{k:"hace",ty:"concepto",n:"Qué haces"},{k:"reto",ty:"reto",n:"Pruébalo: mini reto"},{chest:"c1",n:"Sello de pasaporte"}]},
   {t:"Un día real en "+c.name,items:[{k:"dia",ty:"dia",n:"Un día real",soon:1},{k:"dificil",ty:"dificil",n:"Lo difícil",soon:1},{k:"gana",ty:"gana",n:"Cuánto se gana",soon:1},{k:"testi",ty:"testi",n:"Testimonio",soon:1},{chest:"c2",n:"Cofre de la unidad",soon:1}]},
   {t:"Tu veredicto",items:[{k:"donde",ty:"donde",n:"Dónde se estudia",soon:1},{k:"repaso",ty:"repaso",n:"Repaso",soon:1},{k:"veredicto",ty:"veredicto",n:"Tu veredicto",fin:1}]}
  ];
  var all=[];U.forEach(function(u,ui){u.items.forEach(function(it,li){it.u=ui;it.li=li;all.push(it)})});
  /* estado: hecho, disponible (siguiente en la ruta) o bloqueado; lo que llega pronto no frena la ruta */
  var blocked=false;
  all.forEach(function(it){
   if(it.chest){it.done=chestDone(id,it.chest);it.state=it.soon?"soon":it.done?"done":blocked?"lock":"open";return}
   it.done=it.k==="hace"?stSeen(id,"hace"):it.k==="reto"?!!S.res[id]:it.k==="veredicto"?S.rate[id]!=null:false;
   if(it.soon){it.state="soon";return}
   it.state=it.done?"done":blocked?"lock":"cur";if(!it.done)blocked=true;
  });
  return {units:U,all:all};
 }
 function nodeIcon(it){return it.state==="soon"||it.state==="lock"?LIC.lock:LIC[it.ty]}

 /* cofre isométrico sencillo */
 function chestSVG(open){
  return '<svg viewBox="0 0 80 72" aria-hidden="true"><ellipse cx="40" cy="64" rx="30" ry="6" fill="#000" opacity=".22"/>'+
   '<path d="M12 34L40 48L68 34V56L40 70L12 56Z" fill="#C98A3A"/><path d="M40 48L68 34V56L40 70Z" fill="#A86E28"/>'+
   '<path d="M12 34L40 48V70L12 56Z" fill="#D99A48"/><path d="M24 40V62M56 40V62" stroke="#F2C14E" stroke-width="3"/>'+
   (open?'<path d="M12 34L40 20L68 34L40 48Z" fill="#4A2C12"/><path d="M12 34L40 20L40 6L12 20Z" fill="#E0A54E"/><path d="M40 20L68 34L68 20L40 6Z" fill="#C9883A"/><circle cx="40" cy="30" r="5" fill="#FFE59A" opacity=".9"/>'
    :'<path d="M12 34L40 20L68 34L40 48Z" fill="#E8AE55"/><path d="M12 34L40 48L40 40L12 26Z" fill="#E8AE55"/><path d="M12 26L40 12L68 26L40 40Z" fill="#F2C470"/><path d="M40 40L68 26V34L40 48Z" fill="#C98A3A"/>')+
   '<rect x="35" y="'+(open?46:42)+'" width="10" height="10" rx="2" fill="#F2C14E" stroke="#8A5A1E" stroke-width="1.4"/><circle cx="40" cy="'+(open?50:46)+'" r="1.6" fill="#8A5A1E"/></svg>'}

 function art(id,v,d){if(typeof ART==="undefined"||!ART.has(id))return "";return '<svg viewBox="-72 -110 144 160" aria-hidden="true"><defs>'+(typeof ENV!=="undefined"?ENV.DEFS:"")+'</defs>'+ART.get(id,d||1,v)+'</svg>'}

 function build(id){
  st.headU=-1;var c=byId[id],p=$("#plaza"),dark=!!(DMQ&&DMQ.matches),cat=catalog(id);st.id=id;st.items=cat.all;st.units=cat.units;
  var col=c.color,cd=dk(col,.38),txt=lum(col)>.62?"#14323F":"#FFFFFF";
  var bg=dark?mixHex(col,"#0B1626",.82):mixHex(col,"#FFFBF2",.86),bg2=dark?mixHex(col,"#0B1626",.74):mixHex(col,"#FFFBF2",.78);
  var patIc=PATC[id]||PAT[c.area]||PAT.salud,patCol=dark?"%23FFFFFF":"%23"+dk(col,.3).slice(1);
  var pat="url(\"data:image/svg+xml,"+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><g fill="none" stroke="'+decodeURIComponent(patCol)+'" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><g transform="translate(18 18) scale(1.1)">'+patIc+'</g><g transform="translate(76 70) scale(1.1) rotate(12 12 12)">'+patIc+'</g></g></svg>')+"\")";
  p.style.setProperty("--pc",col);
  var h='<div class="lp'+(dark?" lp-dark":"")+'" style="--c:'+col+';--cd:'+cd+';--ct:'+txt+';--lb:'+bg+';--lb2:'+bg2+';--pat:'+pat.replace(/"/g,"'")+'">'+
   '<div class="lp-bg" id="lpBg"></div>'+
   '<header class="lp-head" id="lpHead"><button class="lp-back" id="pzx" aria-label="Volver al mapa"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg></button>'+
   '<div class="lp-ht"><div class="lp-eb" id="lpEb"></div><h2 class="lp-tt" id="lpTt"></h2></div></header>'+
   '<div class="lp-scroll" id="lpScroll"><div class="lp-col" id="lpCol">';
  /* nodos en zigzag: la onda se repite cada seis nodos */
  var y=150,k=0,rows=[],deco=[];
  cat.units.forEach(function(u,ui){
   if(ui>0){h+='<div class="lp-sep" style="top:'+y+'px" data-u="'+ui+'"><span>'+esc(u.t)+'</span></div>';y+=86}
   else{h+='<div class="lp-u0" data-u="0" style="top:0px"></div>'}
   u.items.forEach(function(it,li){
    var off=Math.round(Math.sin(k*Math.PI/3)*72),size=it.fin?92:it.chest?84:72;
    it.x=off;it.y=y;it.k2=k;rows.push(it);
    var cls="lp-n s-"+it.state+(it.fin?" fin":"")+(it.chest?" chest":""),dl=(120+k*55)+"ms";
    if(it.chest){
     h+='<button class="'+cls+'" data-i="'+k+'" style="left:calc(50% + '+off+'px);top:'+y+'px;--d:'+dl+'" aria-label="'+esc(it.n)+'">'+chestSVG(it.done)+'</button>';
    }else{
     h+='<button class="'+cls+'" data-i="'+k+'" style="left:calc(50% + '+off+'px);top:'+y+'px;--d:'+dl+'" aria-label="'+esc(it.n)+(it.state==="done"?", hecha":it.state==="soon"?", llega pronto":"")+'">'+
      '<span class="lp-face">'+icon(nodeIcon(it),"lp-ic")+'</span>'+(it.state==="done"?'<span class="lp-ok">'+icon(LIC.check)+'</span>':'')+'</button>';
    }
    /* ilustraciones a los lados, alternando, donde el camino se va al lado contrario */
    if(k%4===1)deco.push({y:y,k:k,kind:deco.length%3});
    y+=it.fin?128:it.chest?118:104;k++;
   });
  });
  y+=60;
  /* cada ilustración va del lado contrario a donde se cargan sus nodos vecinos, para no taparlos */
  deco.forEach(function(d){var sum=0;rows.forEach(function(r){if(Math.abs(r.y-d.y)<170)sum+=r.x});d.side=sum>0?-1:1;
   var lim=rows.filter(function(r){return Math.abs(r.y-d.y)<170&&(d.side<0?r.x<-10:r.x>10)});d.skip=lim.length>0});
  deco.forEach(function(d,i){
   if(d.skip)return;var side=d.side<0?"l":"r",inner="";
   if(d.kind===0)inner='<div class="lp-board"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">'+patIc+'</svg></div>'+art(id,"e",1);
   else if(d.kind===1)inner=art(id,"s",1);
   else inner='<div class="lp-board"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">'+(SIC.dia||patIc)+'</svg></div>';
   if(!inner)return;
   h+='<div class="lp-art '+side+'" style="top:'+(d.y-30)+'px;--d:'+(300+i*120)+'ms"><span class="lp-sh"></span>'+inner+'</div>';
  });
  h+='<div class="lp-rb" id="lpRb">'+rumboEl()+'</div><div class="lp-pop" id="lpPop" role="dialog"></div></div><div style="height:'+y+'px"></div></div>'+
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
 function curIndex(){for(var i=0;i<st.items.length;i++)if(st.items[i].state==="cur"||(st.items[i].chest&&st.items[i].state==="open"))return i;
  for(i=st.items.length-1;i>=0;i--)if(st.items[i].state==="done")return i;return 0}
 /* Rumbo junto a la lección actual, del lado contrario al desvío del camino */
 function placeRumbo(animate){
  var e=$("#lpRb");if(!e)return;var i=curIndex(),it=st.items[i],side=it.x>0?-1:1;
  e.style.top=(it.y-34)+"px";e.style.left="calc(50% + "+(it.x+side*92)+"px)";
  setFacingRb(side>0);
  var m=it.ty==="reto"?"curious":it.ty==="veredicto"?"happy":it.state==="done"?"happy":"idle";
  if(PZ.rb){PZ.rb.classList.toggle("p-point",it.state==="cur");mood(PZ.rb,m,animate?"jump":null)}
  /* globo EMPEZAR/SEGUIR/ABRIR encima del nodo actual */
  each(document.querySelectorAll("#lpCol .lp-tag"),function(t){t.remove()});
  if(it.state==="cur"||(it.chest&&it.state==="open")){
   var b=document.querySelector('#lpCol .lp-n[data-i="'+i+'"]');if(b){var t=document.createElement("span");t.className="lp-tag";t.textContent=it.chest?"ABRIR":"EMPEZAR";b.appendChild(t);
    if(!it.chest){b.insertAdjacentHTML("afterbegin",'<svg class="lp-ring" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46"/><circle class="lp-rp" cx="50" cy="50" r="46" style="stroke-dasharray:0 290"/></svg>')}}
  }
 }
 function setFacingRb(left){if(PZ.rb)PZ.rb.classList.toggle("left",!!left)}
 function header(ui,instant){
  if(ui===st.headU)return;st.headU=ui;var u=st.units[ui],it=st.items[curIndex()],eb=$("#lpEb"),tt=$("#lpTt"),hd=$("#lpHead");if(!eb)return;
  var li=it&&it.u===ui?it.li+1:1;
  var set=function(){eb.textContent="UNIDAD "+(ui+1)+" · LECCIÓN "+li;tt.textContent=u.t;hd.style.setProperty("--hc",ui===0?"var(--c)":ui===1?"color-mix(in srgb, var(--c) 82%, #14323F)":"color-mix(in srgb, var(--c) 70%, #14323F)");
   st.el.style.setProperty("--lbu",ui===0?"var(--lb)":ui===1?"var(--lb2)":"color-mix(in srgb, var(--lb2) 85%, #14323F)")};
  if(instant||RM()){set();return}
  hd.classList.add("sw");setTimeout(function(){set();hd.classList.remove("sw")},160);
 }
 function onScroll(){st.raf=0;var sc=st.sc;if(!sc)return;
  $("#lpBg").style.transform="translate3d(0,"+(-sc.scrollTop*.35).toFixed(1)+"px,0)";
  var ui=0;each(document.querySelectorAll("#lpCol .lp-sep"),function(s){if(s.offsetTop-sc.scrollTop<120)ui=+s.getAttribute("data-u")});header(ui);
  var it=st.items[curIndex()],vy=it.y-sc.scrollTop;var fb=$("#lpFab");fb.classList.toggle("on",vy<40||vy>sc.clientHeight-80);fb.classList.toggle("up",vy<40);
 }
 function toCur(smooth){var sc=st.sc;if(!sc)return;var it=st.items[curIndex()];var top=Math.max(0,it.y-sc.clientHeight*.45);
  if(smooth&&!RM())sc.scrollTo({top:top,behavior:"smooth"});else sc.scrollTop=top;onScroll()}
 /* tarjeta emergente debajo del nodo */
 function tap(i){
  var it=st.items[i],b=document.querySelector('#lpCol .lp-n[data-i="'+i+'"]'),pop=$("#lpPop"),c=byId[st.id];if(!b||!pop)return;
  restart(b,"press");
  var h='<h3>'+esc(it.n)+'</h3>',btn="";
  if(it.state==="soon")h+='<p>Esta lección todavía no tiene contenido. Llega pronto.</p>';
  else if(it.state==="lock")h+='<p>Se desbloquea cuando termines la lección anterior.</p>';
  else if(it.chest){h+='<p>'+(it.done?"Ya lo abriste: el sello de "+esc(c.name)+" está en tu pasaporte.":"Termina la unidad y gana el sello de "+esc(c.name)+" para tu pasaporte.")+'</p>';if(!it.done)btn='<button class="btn primary wide" id="lpGo">Abrir</button>'}
  else{
   h+='<p class="lp-meta">'+(DUR[it.ty]||"")+(it.state==="done"?" · Hecha":" · Pendiente")+'</p>';
   if(it.k==="hace")h+='<p>'+esc(c.desc)+'</p>';
   if(it.k==="reto")h+='<p>'+esc(c.q)+'</p>';
   if(it.k==="veredicto")h+='<p>Di cuánto te late '+esc(c.name)+'. Cuenta para tu atlas.</p>';
   btn='<button class="btn primary wide" id="lpGo">'+(it.state==="done"?"Repasar":"Empezar")+'</button>';
  }
  pop.innerHTML='<span class="lp-arrow"></span>'+h+btn;
  pop.style.top=(it.y+(it.fin?62:52))+"px";pop.style.setProperty("--ax",(it.x)+"px");
  pop.classList.remove("on");void pop.offsetWidth;pop.classList.add("on");
  var go=$("#lpGo");if(go)go.onclick=function(e){e.stopPropagation();closePop();run(it)};
  var sc=st.sc,need=it.y+260-(sc.scrollTop+sc.clientHeight);if(need>0){if(RM())sc.scrollTop+=need;else sc.scrollTo({top:sc.scrollTop+need,behavior:"smooth"})}
 }
 function closePop(){var p=$("#lpPop");if(p)p.classList.remove("on")}
 /* abrir una lección */
 function run(it){
  var id=st.id,c=byId[id];
  if(it.chest){openChest(it);return}
  if(it.k==="reto"){openTest(id);return}
  if(it.k==="hace"){lesson('<div class="eyebrow">'+esc(c.name)+'</div><h2>Qué haces</h2><p>'+esc(c.desc)+'</p>'+
   (AFF[id]&&AFF[id].matches.length?'<div class="lbl-s">Coincide con lo que elegiste</div><div class="tags">'+AFF[id].matches.map(function(m){return '<span class="tag">'+esc(m)+'</span>'}).join("")+'</div>':''),
   "Entendido",function(){var was=stSeen(id,"hace");S.st[id]=S.st[id]||{};S.st[id].hace=1;save();if(!was)complete(it)});return}
  if(it.k==="veredicto"){var was0=S.rate[id]!=null;lesson('<div class="eyebrow">'+esc(c.name)+'</div><h2>Tu veredicto</h2><p>¿Cuánto te late? Esto cuenta para tu atlas.</p>'+rateW(id,S.rate[id]!=null?S.rate[id]:5)+'<div class="score-line" id="lpScore">'+scoreLine(id)+'</div>',
   "Guardar",function(){if(S.rate[id]==null){var r=document.querySelector("#lpLesson input[type=range]");S.rate[id]=r?+r.value:5;save()}if(!was0)complete(it)},function(box){bindRate(box,function(){var sl=$("#lpScore");if(sl)sl.innerHTML=scoreLine(id)},true)});return}
 }
 function lesson(html,cta,onDone,bind){
  var o=document.createElement("div");o.className="lp-lesson";o.id="lpLesson";o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");
  o.innerHTML='<div class="lp-lin">'+html+'<button class="btn primary wide" id="lpLok">'+cta+'</button></div>';
  st.el.appendChild(o);if(bind)bind(o);requestAnimationFrame(function(){o.classList.add("on")});
  $("#lpLok").onclick=function(){onDone();o.classList.remove("on");setTimeout(function(){o.remove()},RM()?0:T.med)};
 }
 function openChest(it){
  var id=st.id,c=byId[id],b=document.querySelector('#lpCol .lp-n[data-i="'+it.k2+'"]');
  S.chest=S.chest||{};S.chest[id+":"+it.chest]=1;save();
  if(b){b.innerHTML=chestSVG(true);restart(b,"opened");burstAt(b)}
  setTimeout(function(){lesson('<div class="lp-stamp" style="--c:'+c.color+'"><b>'+esc(c.name.toUpperCase())+'</b><span>VOCATLAS · PASAPORTE</span></div><h2>¡Sello nuevo!</h2><p>Ya tienes el sello de '+esc(c.name)+' en tu pasaporte de exploración.</p>',"Seguir",function(){refresh(true)})},RM()?0:500);
 }
 function burstAt(b){if(RM())return;var cols=["#F2B544","#FFFFFF","#7FB59A","#8FC9E8"];for(var i=0;i<12;i++){var s=document.createElement("i");s.className="lp-pt";s.style.background=cols[i%4];s.style.setProperty("--a",(i*30)+"deg");b.appendChild(s);setTimeout(function(x){return function(){x.remove()}}(s),700)}}
 /* al terminar una lección: el nodo se llena, chispas, palomita, el siguiente se activa y Rumbo salta hasta él */
 function complete(it){
  var b=document.querySelector('#lpCol .lp-n[data-i="'+it.k2+'"]');if(b){b.classList.remove("s-cur");b.classList.add("s-done","fill");burstAt(b)}
  setTimeout(function(){refresh(true)},RM()?0:650);
 }
 function refresh(animate){var y=st.sc?st.sc.scrollTop:0;build(st.id);st.sc.scrollTop=y;if(animate&&PZ.rb){mood(PZ.rb,"happy","jump")}setTimeout(function(){toCur(true)},RM()?0:300)}
 function show(){document.body.classList.add("lp-open");toCur(false);if(PZ.rb)mood(PZ.rb,"happy","jump")}
 function react(id){var k=S.res[id];refresh(true);if(PZ.rb)mood(PZ.rb,k==="yes"?"happy":k==="mid"?"meh":"no",k==="yes"?"jump":k==="mid"?"tilt":"shake")}
 function leave(){document.body.classList.remove("lp-open");if(st.sc&&st.onScroll)st.sc.removeEventListener("scroll",st.onScroll);cancelAnimationFrame(st.raf);st.raf=0;var l=$("#lpLesson");if(l)l.remove()}
 return {build:build,show:show,react:react,leave:leave,state:function(){},closePop:closePop};
})();
