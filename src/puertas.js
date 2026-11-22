/* ================= puertas en las nubes de la espiral =================
   A los lados de la espiral de cada carrera flota una nube con una puerta, una por unidad. La llave sale del cofre
   de esa unidad (el cofre de la unidad 2 trae además el Rumbo de la carrera). Detrás de cada puerta está lo que no
   cabe en una lección: cuánto cuesta, dónde se estudia, cómo se entra y cuánto dura, y de qué se vive al salir.
   Nada se inventa: todo sale de CAT.cif (cifras con fuente) y de CAT.uni (universidades con fuente); si un dato
   no está verificado se marca «por confirmar», y si no existe se dice. */
var PUERTAS=(function(){
 var D=[
  {k:"costo",t:"¿Cuánto cuesta?",s:"Colegiaturas, gastos y becas",col:"#E2A23A"},
  {k:"escuelas",t:"¿Dónde se estudia?",s:"Universidades con fuente",col:"#3F86C6"},
  {k:"entrar",t:"¿Cómo entras y cuánto dura?",s:"Examen de admisión y duración",col:"#7A5FB5"},
  {k:"trabajo",t:"¿De qué vas a vivir?",s:"Sueldo y en qué trabajan",col:"#3FA36B"}];
 function n(){return D.length}
 function hasKey(id,u){return !!(S.chest&&S.chest[id+":u"+(u+1)])}
 function seen(id,u){return !!(S.door&&S.door[id+":"+u])}
 function state(id,u){return !hasKey(id,u)?"lock":seen(id,u)?"seen":"ready"}
 function cif(id,k){var d=(CAT.cif||{})[id+"."+k];return d&&d.estado!=="pendiente"&&d.valor!=null?d:null}
 function src(d){if(!d||!d.fuente)return "";var f=esc(d.fuente);return '<small class="pt-src">'+(d.url?'<a href="'+esc(d.url)+'" target="_blank" rel="noopener">'+f+'</a>':f)+(d.estado&&d.estado!=="verificado"?' · <i>por confirmar</i>':'')+'</small>'}
 function srcU(o){if(!o||!o.fuente)return "";var f=o.fuente,link=/^https?:/.test(f);return '<small class="pt-src">'+(link?'<a href="'+esc(f)+'" target="_blank" rel="noopener">'+esc(f.replace(/^https?:\/\/(www\.)?/,"").split("/")[0])+'</a>':esc(f))+(o.conf&&o.conf!=="alta"?' · <i>por confirmar</i>':'')+'</small>'}

 /* ---------- la nube con su puerta (svg) ---------- */
 function cloudSVG(st,col,u){
  var s='<svg class="pt-cl" viewBox="0 0 170 132" aria-hidden="true"><defs><radialGradient id="ptg'+u+'" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".7" stop-color="#F3F6FC"/><stop offset="1" stop-color="#D9E1F0"/></radialGradient>'+
   '<linearGradient id="ptw'+u+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C98A4E"/><stop offset="1" stop-color="#9A6234"/></linearGradient>'+
   '<radialGradient id="ptl'+u+'" cx=".5" cy=".6" r=".7"><stop offset="0" stop-color="#FFF4C8"/><stop offset="1" stop-color="#F6C44E"/></radialGradient></defs>';
  /* nube: bultos con panza sombreada */
  /* nube translúcida, del mismo tono que el camino de nubes */
  s+='<g opacity=".62">';[[40,92,28],[70,80,34],[104,78,36],[134,92,26],[86,100,40],[52,104,24],[122,104,24]].forEach(function(c){s+='<circle cx="'+c[0]+'" cy="'+c[1]+'" r="'+c[2]+'" fill="url(#ptg'+u+')"/>'});
  s+='<path d="M22 104Q86 126 150 104Q146 118 86 120Q28 118 22 104Z" fill="#B9C6E0" opacity=".7"/></g>';
  /* marco de piedra con arco y escalón */
  s+='<path d="M58 106V56Q58 30 85 30Q112 30 112 56V106Z" fill="#E9E1D0"/><path d="M58 106V56Q58 30 85 30Q112 30 112 56V106" fill="none" stroke="#C9BCA2" stroke-width="2"/>';
  s+='<rect x="54" y="104" width="62" height="7" rx="2" fill="#D8CDB6"/>';
  /* hueco: luz cálida cuando ya se abrió */
  s+='<path d="M64 104V58Q64 37 85 37Q106 37 106 58V104Z" fill="'+(st==="seen"?'url(#ptl'+u+')':'#4A3322')+'"/>';
  if(st==="seen"){/* puerta entreabierta, girada hacia adentro */
   s+='<path d="M64 104V58Q64 40 76 38L80 40V102Z" fill="url(#ptw'+u+')"/><path d="M80 40V102L64 104V58Q64 40 76 38Z" fill="none" stroke="#7A4A26" stroke-width="1"/>';
   s+='<circle cx="76" cy="74" r="1.8" fill="#F2C14E"/><path d="M86 104L106 104L120 116L72 116Z" fill="#FFE9A8" opacity=".55"/>'}
  else{s+='<path d="M64 104V58Q64 37 85 37Q106 37 106 58V104Z" fill="url(#ptw'+u+')"/>';
   [71,78,85,92,99].forEach(function(x){s+='<path d="M'+x+' 42V104" stroke="#8A5A30" stroke-width="1" opacity=".55"/>'});
   s+='<path d="M64 62H106M64 92H106" stroke="#6E4524" stroke-width="2.6"/><circle cx="68" cy="62" r="1.3" fill="#3A2416"/><circle cx="68" cy="92" r="1.3" fill="#3A2416"/>';
   s+='<circle cx="99" cy="76" r="2.6" fill="#F2C14E" stroke="#8A5A1E" stroke-width=".8"/><path d="M99 80.5v4" stroke="#3A2416" stroke-width="1.6" stroke-linecap="round"/>'}
  /* letrero con el color de la puerta */
  s+='<rect x="70" y="18" width="30" height="13" rx="6.5" fill="'+col+'" stroke="#FFFFFF" stroke-width="1.6"/><text x="85" y="28" text-anchor="middle" font-size="9.5" font-weight="900" fill="#FFFFFF" font-family="Nunito,system-ui,sans-serif">'+(u+1)+'</text>';
  if(st==="lock")s+='<g transform="translate(85 70)"><path d="M-6 -2V-7Q-6 -13 0 -13Q6 -13 6 -7V-2" fill="none" stroke="#9AA5B1" stroke-width="3"/><rect x="-9" y="-3" width="18" height="15" rx="3" fill="#C9D1DA" stroke="#7E8B98" stroke-width="1.2"/><circle cx="0" cy="3" r="2.2" fill="#5A6573"/><path d="M0 4v4" stroke="#5A6573" stroke-width="1.8"/></g>';
  if(st==="ready")s+='<g class="pt-key" transform="translate(132 46) rotate(-30)"><circle r="7" fill="#F6C44E" stroke="#B07A16" stroke-width="1.4"/><circle r="2.6" fill="#FFF4C8"/><path d="M7 0H24M18 0V5M22 0V4" stroke="#B07A16" stroke-width="3" stroke-linecap="round"/><path d="M7 0H24" stroke="#F6C44E" stroke-width="1.4" stroke-linecap="round"/></g>';
  return s+'</svg>'}
 function doorHTML(id,u){var d=D[u],st=state(id,u);
  return cloudSVG(st,d.col,u)+'<span class="pt-lab"><b>'+esc(d.t)+'</b>'+(st==="ready"?'<small>¡Ya tienes la llave!</small>':'')+'</span>'}
 function label(id,u){var d=D[u],st=state(id,u);return "Puerta "+(u+1)+": "+d.t+(st==="lock"?". Cerrada, su llave está en el cofre de la unidad "+(u+1):st==="ready"?". Tienes la llave":"")}

 /* ---------- lo que hay detrás de cada puerta ---------- */
 function unisOf(id,edo){var d=CAT.uni&&CAT.uni.car&&CAT.uni.car[id];if(!d)return null;var seenU={},out=[];
  d.donde.forEach(function(x){if(edo&&x.edo.indexOf(edo)<0)return;var u=escUni(x.u);if(!u||seenU[u.id])return;seenU[u.id]=1;out.push({u:u,x:x})});
  return out.sort(function(a,b){return (a.u.tipo==="publica"?0:1)-(b.u.tipo==="publica"?0:1)})}
 function edoNow(id){var d=CAT.uni&&CAT.uni.car&&CAT.uni.car[id];if(!d)return null;var has={};d.donde.forEach(function(x){x.edo.forEach(function(e){has[e]=1})});
  var m=S.edo&&S.edo!==EDO_NONE?S.edo:null;return m&&has[m]?m:has.CMX?"CMX":Object.keys(has)[0]}
 function edoName(e){var o=typeof edoById==="function"&&edoById(e);return o?o.n:(ESC_EDO[e]||e)}
 function noUni(){return '<div class="pt-empty">'+(CAT.uni?'Todavía no tenemos universidades verificadas para esta carrera. No las vamos a inventar.':'Las universidades se están descargando. Revisa tu conexión y vuelve a abrir esta puerta.')+'</div>'}
 /* ---------- lo que hay detrás de cada puerta: poco texto, cifras grandes y claras; las fuentes van juntas al final ---------- */
 var SRC=[];function note(d){if(!d||!d.fuente)return;var k=d.fuente+(d.url||"");if(SRC.some(function(x){return x.k===k}))return;SRC.push({k:k,t:d.fuente,u:d.url||(/^https?:/.test(d.fuente)?d.fuente:null),c:d.estado?d.estado!=="verificado":d.conf&&d.conf!=="alta"})}
 function big(lab,val,unit,cls,d){note(d);return '<div class="pt-big '+(cls||"")+'"><span class="pt-tl">'+lab+'</span><b class="num">'+esc(val)+'</b>'+(unit?'<span class="pt-tu">'+esc(unit)+'</span>':'')+'</div>'}
 function money$(v){return String(v).replace(/(^|\s|a\s)(\d)/g,function(m,p,dg){return p+"$"+dg}).replace(/^Gratis a \$/,"Gratis a $")}
 function pubpri(u){return '<span class="pt-tag t-'+u.tipo+'">'+(u.tipo==="publica"?"Pública":"Privada")+'</span>'}
 var BODY={
  costo:function(id,c){var h="",pu=cif(id,"costo_publica"),pr=cif(id,"costo_privada"),be=cif(id,"becas");
   if(!pu&&!pr)return '<div class="pt-empty">Todavía no tenemos este dato verificado. No lo vamos a inventar.</div>';
   h+='<p class="pt-q">Lo que cobra la escuela, por semestre:</p><div class="pt-bigs">'+(pu?big("Escuela pública",money$(pu.valor),"",'is-pub',pu):'')+(pr?big("Escuela privada",money$(pr.valor),"",'is-pri',pr):'')+'</div>';
   h+='<p class="pt-tip">Aparte, cuenta lo de transporte, comida y materiales.</p>';
   if(be){note(be);h+='<div class="pt-card pt-beca"><b>¿No te alcanza? Hay becas</b><p>'+esc(String(be.valor))+'</p>'+(be.url?'<a class="pt-link" href="'+esc(be.url)+'" target="_blank" rel="noopener">Ver la beca</a>':'')+'</div>'}
   var e=edoNow(id),L=e?unisOf(id,e):null;
   if(L&&L.length)h+='<details class="pt-more"><summary>Ver escuela por escuela en '+esc(edoName(e))+'</summary><ul class="pt-list">'+L.map(function(o){note(o.u.costo);return '<li><div class="pt-lt"><b>'+esc(o.u.n)+'</b>'+pubpri(o.u)+'</div><p>'+esc(o.u.costo.txt)+'</p></li>'}).join("")+'</ul></details>';
   return h},
  escuelas:function(id,c,edo){var d=CAT.uni&&CAT.uni.car&&CAT.uni.car[id];if(!d||!d.donde.length)return noUni();
   var has={};d.donde.forEach(function(x){x.edo.forEach(function(e){has[e]=(has[e]||0)+1})});var cur=edo||edoNow(id),list=d.donde.filter(function(x){return x.edo.indexOf(cur)>=0}).sort(function(a,b){var ua=escUni(a.u),ub=escUni(b.u);return (ua&&ua.tipo==="publica"?0:1)-(ub&&ub.tipo==="publica"?0:1)});
   var h='<div class="pt-edos" role="tablist" aria-label="Estado">'+Object.keys(has).map(function(e){return '<button type="button" role="tab" class="pt-edo" data-edo="'+e+'" aria-selected="'+(e===cur)+'">'+esc(edoName(e))+' <b>'+has[e]+'</b></button>'}).join("")+'</div>';
   h+='<ul class="pt-list pt-unis">'+list.map(function(x){var u=escUni(x.u);if(!u)return "";note(u.costo);return '<li><div class="pt-lt"><b>'+esc(u.n)+'</b>'+pubpri(u)+'</div><p>'+esc(x.sede)+'</p>'+(u.url?'<a class="pt-link" href="'+esc(u.url)+'" target="_blank" rel="noopener">Sitio oficial</a>':'')+'</li>'}).join("")+'</ul>';
   return h},
  entrar:function(id,c){var h="",du=cif(id,"duracion");
   if(du)h+='<div class="pt-bigs">'+big("Dura",String(du.valor),du.unidad||"",'is-dur',du)+'</div>'+(du.nota&&du.nota.length<140?'<p class="pt-tip">'+esc(du.nota)+'</p>':'');
   var e=edoNow(id),L=e?unisOf(id,e):null;
   if(L&&L.length)h+='<p class="pt-q">Para entrar, haces un examen. En '+esc(edoName(e))+':</p><ul class="pt-list pt-exams">'+L.map(function(o){note(o.u.adm);return '<li><div class="pt-lt"><b>'+esc(o.u.n)+'</b>'+pubpri(o.u)+'</div><p>'+esc(o.u.adm.examen)+'</p></li>'}).join("")+'</ul>';
   else if(!du)h+=noUni();
   return h},
  trabajo:function(id,c){var d=cif(id,"ingreso");if(!d)return '<div class="pt-empty">Todavía no tenemos este dato verificado. No lo vamos a inventar.</div>';
   note(d);var n=suNum(d),R=typeof suRank==="function"?suRank():[],pos=R.findIndex(function(x){return x.c.id===id})+1,oc=cif(id,"ocupacion_afin");if(oc)note(oc);
   var h='<p class="pt-q">Lo que gana en promedio quien estudió '+esc(c.name)+':</p><div class="pt-bigs">'+big("Al mes",suFmt(n),"",'is-pay',null)+'</div>';
   if(pos&&R.length){var max=R[0].n;h+='<div class="pt-card"><b>Lugar '+pos+' de '+R.length+' carreras</b><div class="pt-rank"><i style="width:'+(n/max*100).toFixed(0)+'%;background:'+c.color+'"></i></div></div>'}
   if(oc)h+='<div class="pt-card"><b>'+esc(String(oc.valor))+' de cada 100</b><p>trabajan en algo de su carrera.</p></div>';
   h+='<p class="pt-tip">Es un promedio: unos ganan más y otros menos.</p>';return h}};
 function body(k,id,c,x){SRC=[];var h=BODY[k](id,c,x);return h+srcList()}
 function srcList(){if(!SRC.length)return "";return '<details class="pt-srcs"><summary>¿De dónde salen estos datos?</summary><ul>'+SRC.map(function(x){return '<li>'+(x.u?'<a href="'+esc(x.u)+'" target="_blank" rel="noopener">'+esc(x.t.replace(/^https?:\/\/(www\.)?/,"").split("/")[0])+'</a>':esc(x.t))+(x.c?' <i>(por confirmar)</i>':'')+'</li>'}).join("")+'</ul><p>'+(CAT.uni?esc(CAT.uni.nota):'Las cifras cambian cada año.')+'</p></details>'}
 var SAY={costo:"¿Cuánto cuesta estudiar {c}? Depende mucho de la escuela.",escuelas:"Estas escuelas tienen {c}. Primero las públicas.",entrar:"Así entras a {c} y esto dura.",trabajo:"¿Y al terminar? Esto se gana."};

 /* ---------- abrir una puerta: la puerta se abre a pantalla completa y adentro está la información ---------- */
 function open(id,u,from){var c=byId[id],d=D[u];if(!c||!d)return;
  if(!hasKey(id,u)){if(typeof toast==="function")toast("Esta puerta se abre con la llave del cofre de la unidad "+(u+1)+".");return}
  var first=!seen(id,u);S.door=S.door||{};S.door[id+":"+u]=1;save();
  var el=document.createElement("div");el.className="pt-room"+(first?" is-first":"");el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label",d.t+" "+c.name);el.style.setProperty("--pc",d.col);el.style.setProperty("--cc",c.color);
  el.innerHTML='<div class="pt-door" aria-hidden="true"><i class="pt-leaf l"></i><i class="pt-leaf r"></i></div>'+
   '<div class="pt-in"><header class="pt-head"><button type="button" class="pt-x" aria-label="Cerrar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>'+
   '<div class="pt-ht"><small>Puerta '+(u+1)+' de '+D.length+' · '+esc(c.name)+'</small><h3>'+esc(d.t)+'</h3></div></header>'+
   '<div class="pt-body"><div class="pt-hero"><div class="pt-rb">'+(typeof skinOn==="function"&&RUMBO.SKINS[id]&&skinOn(id)?skinRb(id):rumboEl())+'</div><p class="pt-say">'+esc(SAY[d.k].replace("{c}",c.name))+'</p></div>'+
   '<div class="pt-content">'+body(d.k,id,c)+'</div>'+
   nav(id,u)+'</div></div>';
  var close=uiLayer(el,false,function(){if(from&&from.focus)from.focus();sync(id)});
  el.querySelector(".pt-x").onclick=close;
  var rb=el.querySelector(".pt-rb .rb");if(rb&&typeof wireRumbo==="function")wireRumbo(rb);
  wire(el,id,u,close);
  if(typeof sfx==="function")sfx("ok");
  setTimeout(function(){var x=el.querySelector(".pt-x");if(x)x.focus()},RM()?0:420)}
 function nav(id,u){var o="";for(var i=0;i<D.length;i++){if(i===u)continue;var st=state(id,i);o+='<button type="button" class="pt-nb s-'+st+'" data-u="'+i+'"'+(st==="lock"?' aria-disabled="true"':'')+'><span class="pt-nd" style="background:'+D[i].col+'">'+(st==="lock"?'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4"><rect x="6" y="11" width="12" height="9" rx="2"/><path d="M9 11V8a3 3 0 016 0v3"/></svg>':(i+1))+'</span><span><b>'+esc(D[i].t)+'</b><small>'+(st==="lock"?"Llave en el cofre "+(i+1):D[i].s)+'</small></span></button>'}
  return '<div class="pt-nav" role="navigation" aria-label="Otras puertas"><h4>Otras puertas</h4>'+o+'</div>'}
 function wire(el,id,u,close){
  each(el.querySelectorAll(".pt-edo"),function(b){b.onclick=function(){var box=el.querySelector(".pt-content");box.innerHTML=body("escuelas",id,byId[id],b.getAttribute("data-edo"));wire(el,id,u,close)}});
  each(el.querySelectorAll(".pt-nb"),function(b){b.onclick=function(){var i=+b.getAttribute("data-u");if(!hasKey(id,i)){if(typeof toast==="function")toast("Esta puerta se abre con la llave del cofre de la unidad "+(i+1)+".");return}close();setTimeout(function(){open(id,i)},RM()?0:320)}})}
 /* actualiza las nubes de la espiral (al abrir un cofre o al cerrar una puerta) */
 function sync(id,anim){each(document.querySelectorAll('.tw-door[data-c="'+id+'"]'),function(b){var u=+b.getAttribute("data-u"),st=state(id,u);if(b.__st===st)return;var was=b.__st;b.__st=st;
  b.className="tw-door s-"+st+(b.classList.contains("is-r")?" is-r":"");b.innerHTML=doorHTML(id,u);b.setAttribute("aria-label",label(id,u));
  if(anim&&was==="lock"&&st==="ready"&&!RM()){b.classList.add("unlock");setTimeout(function(){b.classList.remove("unlock")},1600)}})}
 function bind(host,id){each(host.querySelectorAll(".tw-door"),function(b){b.__st=b.className.match(/s-(\w+)/)[1];b.onclick=function(e){e.stopPropagation();open(id,+b.getAttribute("data-u"),b)}})}
 /* el icono de llave para el cofre */
 var KEY='<svg viewBox="0 0 120 60" aria-hidden="true"><g transform="translate(30 30) rotate(-12)"><circle r="20" fill="#F6C44E" stroke="#B07A16" stroke-width="3"/><circle r="8" fill="#FFF4C8" stroke="#B07A16" stroke-width="2"/><path d="M20 0H78M62 0V14M72 0V11" stroke="#B07A16" stroke-width="9" stroke-linecap="round"/><path d="M20 0H78M62 0V14M72 0V11" stroke="#F6C44E" stroke-width="5" stroke-linecap="round"/><path d="M-10 -10Q-4 -16 4 -15" stroke="#FFFFFF" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/></g></svg>';

 /* ---------- el cofre: aparece al centro, se abre, sale la llave de la carrera y vuela a su puerta ---------- */
 function hsh(t){var h=7;for(var i=0;i<t.length;i++)h=(h*31+t.charCodeAt(i))>>>0;return h}
 function chestArt(id){var c=(byId[id]||{}).color||"#3F7DA6",d=I3.shade(c,.3),l=I3.tint(c,.25),G="#F2C14E",GD="#B07A16";
  var base='<svg class="cer-base" viewBox="0 0 220 130" aria-hidden="true"><ellipse cx="110" cy="122" rx="96" ry="9" fill="#0B1A2A" opacity=".25"/>'+
   '<rect x="14" y="8" width="192" height="108" rx="16" fill="'+c+'"/><rect x="14" y="78" width="192" height="38" rx="16" fill="'+d+'"/><rect x="14" y="8" width="192" height="12" rx="6" fill="'+l+'"/>'+
   '<rect x="40" y="8" width="16" height="108" fill="'+G+'"/><rect x="164" y="8" width="16" height="108" fill="'+G+'"/><rect x="40" y="8" width="5" height="108" fill="#FFE29A" opacity=".7"/><rect x="164" y="8" width="5" height="108" fill="#FFE29A" opacity=".7"/>'+
   '<rect x="10" y="4" width="200" height="10" rx="5" fill="'+G+'" stroke="'+GD+'" stroke-width="1.5"/><rect class="cer-hole" x="18" y="0" width="184" height="12" rx="6" fill="#3A2416"/><rect class="cer-hole" x="30" y="2" width="160" height="6" rx="3" fill="#FFE29A" opacity=".8"/>'+
   '<circle cx="110" cy="58" r="34" fill="'+G+'" stroke="'+GD+'" stroke-width="3"/><circle cx="110" cy="58" r="27" fill="#FFF6DA"/></svg>';
  var lid='<svg class="cer-lid" viewBox="0 0 220 80" aria-hidden="true"><path d="M14 78V44Q14 6 110 6Q206 6 206 44V78Z" fill="'+l+'"/><path d="M14 78V60Q60 70 110 70Q160 70 206 60V78Z" fill="'+c+'"/>'+
   '<path d="M40 76V16Q46 12 56 10V76Z" fill="'+G+'"/><path d="M164 10Q174 12 180 16V76H164Z" fill="'+G+'"/><rect x="10" y="70" width="200" height="10" rx="5" fill="'+G+'" stroke="'+GD+'" stroke-width="1.5"/>'+
   '<path d="M96 70h28v14a14 14 0 0 1-28 0z" fill="'+G+'" stroke="'+GD+'" stroke-width="2"/><circle cx="110" cy="80" r="3.4" fill="#5A3A0E"/><path d="M30 30Q70 12 110 12" stroke="#FFFFFF" stroke-width="5" fill="none" stroke-linecap="round" opacity=".35"/></svg>';
  return '<div class="cer-chest">'+base+'<span class="cer-emb">'+(typeof SIMB!=="undefined"?SIMB.icon(id,"a",46):'')+'</span>'+lid+'</div>'}
 function keyArt(id){var c=(byId[id]||{}).color||"#3F7DA6",h=hsh(id),t="";for(var i=0;i<3;i++){var w=6+(h>>(i*3)&3)*3;t+='<rect x="'+(118+i*14)+'" y="44" width="9" height="'+w+'" rx="2" fill="#F2C14E" stroke="#B07A16" stroke-width="1.5"/>'}
  return '<div class="cer-key"><svg viewBox="0 0 170 80" aria-hidden="true"><rect x="58" y="34" width="104" height="12" rx="6" fill="#F2C14E" stroke="#B07A16" stroke-width="2"/>'+t+
   '<rect x="60" y="36" width="98" height="3" rx="1.5" fill="#FFF1B8" opacity=".8"/><circle cx="40" cy="40" r="36" fill="#F2C14E" stroke="#B07A16" stroke-width="3"/><circle cx="40" cy="40" r="27" fill="'+c+'"/><circle cx="40" cy="40" r="27" fill="none" stroke="#FFF1B8" stroke-width="2" opacity=".6"/></svg>'+
   '<span class="cer-kemb">'+(typeof SIMB!=="undefined"?SIMB.icon(id,"a",34):'')+'</span></div>'}
 var I3=typeof ISO!=="undefined"?ISO:{shade:function(c){return c},tint:function(c){return c}};
 /* o: {skin:html|null, skinName, onSkin(), focus(u,cb(el)), done()} */
 function ceremony(id,u,o){o=o||{};var d=D[u],c=byId[id];if(typeof I!=="undefined"&&I.shade)I3=I;
  var el=document.createElement("div");el.className="cer";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label","Cofre de la unidad "+(u+1));
  el.innerHTML='<div class="cer-glow" aria-hidden="true"></div><div class="cer-stage">'+chestArt(id)+keyArt(id)+'<div class="cer-spark" aria-hidden="true">'+'<i></i>'.repeat(10)+'</div></div>'+
   '<div class="cer-txt"><h2>'+(d?'¡La llave de la puerta '+(u+1)+'!':'¡Unidad completa!')+'</h2>'+(d?'<p>'+esc(d.t)+'</p>':'')+'</div>'+
   (o.skin?'<div class="cer-skin"><div class="cer-srb">'+o.skin+'</div><div><b>¡Y ganaste a '+esc(o.skinName||"un Rumbo nuevo")+'!</b><button type="button" class="ui-btn is-sec cer-use">Ponérmelo</button></div></div>':'')+
   '<div class="cer-act"><button type="button" class="ui-btn is-block cer-go">'+(d?'Abrir la puerta':'Seguir')+'</button>'+(d?'<button type="button" class="cer-later">Después</button>':'')+'</div>';
  document.body.appendChild(el);void el.offsetWidth;el.classList.add("on");
  if(typeof sfx==="function")setTimeout(function(){sfx("ok")},RM()?0:650);
  var gone=false;function close(cb){if(gone)return;gone=true;el.classList.add("out");setTimeout(function(){el.remove();cb&&cb()},RM()?0:300)}
  var use=el.querySelector(".cer-use");if(use)use.onclick=function(){o.onSkin&&o.onSkin();use.textContent="¡Puesto!";use.disabled=true};
  var later=el.querySelector(".cer-later");if(later)later.onclick=function(){close(function(){o.done&&o.done(false)})};
  function fly(){if(gone)return;var k=el.querySelector(".cer-key"),r=k.getBoundingClientRect(),fk=k.cloneNode(true);
   fk.className="cer-key cer-fly";fk.style.cssText="left:"+r.left+"px;top:"+r.top+"px;width:"+r.width+"px;height:"+r.height+"px";
   close(function(){});document.body.appendChild(fk);
   if(!o.focus){fk.remove();o.done&&o.done(true);return}
   o.focus(u,function(door){if(!door||RM()){fk.remove();o.done&&o.done(true);return}
    var dr=door.getBoundingClientRect(),tx=dr.left+dr.width/2-(r.left+r.width/2),ty=dr.top+dr.height*.42-(r.top+r.height/2);
    var an=fk.animate([{transform:"translate(0,0) rotate(0) scale(1)"},{transform:"translate("+(tx*.5)+"px,"+(ty*.5-90)+"px) rotate(-200deg) scale(.8)",offset:.55},{transform:"translate("+tx+"px,"+ty+"px) rotate(-360deg) scale(.32)"}],{duration:1100,easing:"cubic-bezier(.45,0,.3,1)",fill:"forwards"});
    an.onfinish=function(){fk.classList.add("in");setTimeout(function(){fk.remove()},260);door.classList.add("unlock");setTimeout(function(){door.classList.remove("unlock");o.done&&o.done(true)},900)}})}
  el.querySelector(".cer-go").onclick=function(){if(!d){close(function(){o.done&&o.done(false)});return}fly()};
  setTimeout(function(){var b=el.querySelector(".cer-go");if(b)b.focus()},RM()?0:1500);
  /* sin traje que mostrar, la llave se va sola a su puerta */
  if(d&&!o.skin)el.__auto=setTimeout(fly,RM()?600:3200)}
 return {ceremony:ceremony,D:D,n:n,state:state,hasKey:hasKey,doorHTML:doorHTML,label:label,open:open,sync:sync,bind:bind,KEY:KEY}})();
