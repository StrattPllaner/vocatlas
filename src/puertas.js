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
 function money(d,cls,lab){return '<div class="pt-tile '+cls+'"><span class="pt-tl">'+lab+'</span><b class="num">'+esc(String(d.valor))+'</b><span class="pt-tu">'+esc(d.unidad||"")+'</span>'+(d.nota?'<p>'+esc(d.nota)+'</p>':'')+src(d)+'</div>'}
 var BODY={
  costo:function(id,c){var h="",pu=cif(id,"costo_publica"),pr=cif(id,"costo_privada"),be=cif(id,"becas");
   if(pu||pr)h+='<section class="pt-sec"><h4>Lo que cobra la escuela</h4><div class="pt-tiles">'+(pu?money(pu,"is-pub","Pública"):'')+(pr?money(pr,"is-pri","Privada"):'')+'</div></section>';
   else h+='<div class="pt-empty">Todavía no tenemos este dato verificado. No lo vamos a inventar.</div>';
   var tec=cif(id,"costo_tec");if(tec)h+='<section class="pt-sec">'+money(tec,"is-pri","Tec de Monterrey")+'</section>';
   var e=edoNow(id),L=e?unisOf(id,e):null;
   if(L&&L.length)h+='<section class="pt-sec"><h4>Escuela por escuela en '+esc(edoName(e))+'</h4><ul class="pt-list">'+L.map(function(o){return '<li><div class="pt-lt"><b>'+esc(o.u.n)+'</b><span class="pt-tag t-'+o.u.tipo+'">'+(o.u.tipo==="publica"?"Pública":"Privada")+'</span></div><p>'+esc(o.u.costo.txt)+'</p>'+srcU(o.u.costo)+'</li>'}).join("")+'</ul></section>';
   if(be||(CAT.uni&&CAT.uni.becas)){h+='<section class="pt-sec"><h4>Becas para pagarla</h4>';if(be)h+='<div class="pt-note"><b>'+esc(String(be.valor))+'</b>: '+esc(be.unidad||"")+'. '+esc(be.nota||"")+src(be)+'</div>';
    if(CAT.uni&&CAT.uni.becas)h+='<ul class="pt-list pt-becas">'+CAT.uni.becas.filter(function(b){return !be||b.n!==be.valor}).map(function(b){return '<li><div class="pt-lt"><b>'+esc(b.n)+'</b></div><p>'+esc(b.quien)+'</p>'+(b.url?'<small class="pt-src"><a href="'+esc(b.url)+'" target="_blank" rel="noopener">Ver convocatoria</a></small>':'')+'</li>'}).join("")+'</ul>';h+='</section>'}
   return h},
  escuelas:function(id,c,edo){var d=CAT.uni&&CAT.uni.car&&CAT.uni.car[id];if(!d||!d.donde.length)return noUni();
   var has={};d.donde.forEach(function(x){x.edo.forEach(function(e){has[e]=(has[e]||0)+1})});var cur=edo||edoNow(id),list=d.donde.filter(function(x){return x.edo.indexOf(cur)>=0}).sort(function(a,b){var ua=escUni(a.u),ub=escUni(b.u);return (ua&&ua.tipo==="publica"?0:1)-(ub&&ub.tipo==="publica"?0:1)});
   var h='<div class="pt-edos" role="tablist" aria-label="Estado">'+Object.keys(has).map(function(e){return '<button type="button" role="tab" class="pt-edo" data-edo="'+e+'" aria-selected="'+(e===cur)+'">'+esc(edoName(e))+' <b>'+has[e]+'</b></button>'}).join("")+'</div>';
   h+='<p class="pt-lead">'+list.length+' opci'+(list.length===1?'ón':'ones')+' en '+esc(edoName(cur))+', primero las públicas. Toca una para ver su costo y cómo se entra.</p><ul class="es-list pt-es">'+list.map(escItem).join("")+'</ul>';
   return h},
  entrar:function(id,c){var h="",du=cif(id,"duracion");
   if(du)h+='<section class="pt-sec"><h4>Cuánto dura</h4><div class="pt-tiles">'+money(du,"is-dur","Duración")+'</div></section>';
   var as=cif(id,"aspirantes");if(as)h+='<section class="pt-sec">'+money(as,"is-dur","Competencia")+'</section>';
   var en=cif(id,"enarm");if(en)h+='<section class="pt-sec"><h4>Después de la carrera</h4>'+money(en,"is-dur","ENARM")+'</section>';
   var e=edoNow(id),L=e?unisOf(id,e):null;
   if(L&&L.length)h+='<section class="pt-sec"><h4>Cómo se entra en '+esc(edoName(e))+'</h4><ul class="pt-list">'+L.map(function(o){return '<li><div class="pt-lt"><b>'+esc(o.u.n)+'</b><span class="pt-tag t-'+o.u.tipo+'">'+(o.u.tipo==="publica"?"Pública":"Privada")+'</span></div><p><b>'+esc(o.u.adm.examen)+'.</b> '+esc(o.u.adm.txt)+'</p>'+srcU(o.u.adm)+(o.u.url?'<a class="pt-site" href="'+esc(o.u.url)+'" target="_blank" rel="noopener">Sitio oficial</a>':'')+'</li>'}).join("")+'</ul></section>';
   else if(!du)h+=noUni();
   return h},
  trabajo:function(id,c){var d=cif(id,"ingreso");if(!d)return '<div class="pt-empty">Todavía no tenemos este dato verificado. No lo vamos a inventar. Lo puedes buscar en <a href="https://imco.org.mx/comparacarreras/" target="_blank" rel="noopener">IMCO, Compara Carreras</a>.</div>';
   return typeof suBody==="function"?suBody(id):money(d,"is-pay","Sueldo promedio")}};
 var SAY={costo:"Esto es lo que cuesta estudiar {c}. Cada cifra trae su fuente.",escuelas:"Aquí se estudia {c}. Toca una escuela para ver más.",entrar:"Así se entra a {c} y esto dura.",trabajo:"Esto gana en promedio quien estudió {c}."};

 /* ---------- abrir una puerta: la puerta se abre a pantalla completa y adentro está la información ---------- */
 function open(id,u,from){var c=byId[id],d=D[u];if(!c||!d)return;
  if(!hasKey(id,u)){if(typeof toast==="function")toast("Esta puerta se abre con la llave del cofre de la unidad "+(u+1)+".");return}
  var first=!seen(id,u);S.door=S.door||{};S.door[id+":"+u]=1;save();
  var el=document.createElement("div");el.className="pt-room"+(first?" is-first":"");el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label",d.t+" "+c.name);el.style.setProperty("--pc",d.col);el.style.setProperty("--cc",c.color);
  el.innerHTML='<div class="pt-door" aria-hidden="true"><i class="pt-leaf l"></i><i class="pt-leaf r"></i></div>'+
   '<div class="pt-in"><header class="pt-head"><button type="button" class="pt-x" aria-label="Cerrar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button>'+
   '<div class="pt-ht"><small>Puerta '+(u+1)+' de '+D.length+' · '+esc(c.name)+'</small><h3>'+esc(d.t)+'</h3></div></header>'+
   '<div class="pt-body"><div class="pt-hero"><div class="pt-rb">'+(typeof skinOn==="function"&&RUMBO.SKINS[id]&&skinOn(id)?skinRb(id):rumboEl())+'</div><p class="pt-say">'+esc(SAY[d.k].replace("{c}",c.name))+'</p></div>'+
   '<div class="pt-content">'+BODY[d.k](id,c)+'</div>'+
   '<p class="pt-foot">'+(CAT.uni?esc(CAT.uni.nota)+' Datos reunidos al '+esc(CAT.uni.corte)+'.':'Las cifras cambian cada año: confírmalas en el sitio oficial de cada universidad.')+'</p>'+
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
  each(el.querySelectorAll(".pt-edo"),function(b){b.onclick=function(){var box=el.querySelector(".pt-content");box.innerHTML=BODY.escuelas(id,byId[id],b.getAttribute("data-edo"));wire(el,id,u,close)}});
  each(el.querySelectorAll(".pt-nb"),function(b){b.onclick=function(){var i=+b.getAttribute("data-u");if(!hasKey(id,i)){if(typeof toast==="function")toast("Esta puerta se abre con la llave del cofre de la unidad "+(i+1)+".");return}close();setTimeout(function(){open(id,i)},RM()?0:320)}})}
 /* actualiza las nubes de la espiral (al abrir un cofre o al cerrar una puerta) */
 function sync(id,anim){each(document.querySelectorAll('.tw-door[data-c="'+id+'"]'),function(b){var u=+b.getAttribute("data-u"),st=state(id,u);if(b.__st===st)return;var was=b.__st;b.__st=st;
  b.className="tw-door s-"+st+(b.classList.contains("is-r")?" is-r":"");b.innerHTML=doorHTML(id,u);b.setAttribute("aria-label",label(id,u));
  if(anim&&was==="lock"&&st==="ready"&&!RM()){b.classList.add("unlock");setTimeout(function(){b.classList.remove("unlock")},1600)}})}
 function bind(host,id){each(host.querySelectorAll(".tw-door"),function(b){b.__st=b.className.match(/s-(\w+)/)[1];b.onclick=function(e){e.stopPropagation();open(id,+b.getAttribute("data-u"),b)}})}
 /* el icono de llave para el cofre */
 var KEY='<svg viewBox="0 0 120 60" aria-hidden="true"><g transform="translate(30 30) rotate(-12)"><circle r="20" fill="#F6C44E" stroke="#B07A16" stroke-width="3"/><circle r="8" fill="#FFF4C8" stroke="#B07A16" stroke-width="2"/><path d="M20 0H78M62 0V14M72 0V11" stroke="#B07A16" stroke-width="9" stroke-linecap="round"/><path d="M20 0H78M62 0V14M72 0V11" stroke="#F6C44E" stroke-width="5" stroke-linecap="round"/><path d="M-10 -10Q-4 -16 4 -15" stroke="#FFFFFF" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/></g></svg>';
 return {D:D,n:n,state:state,hasKey:hasKey,doorHTML:doorHTML,label:label,open:open,sync:sync,bind:bind,KEY:KEY}})();
