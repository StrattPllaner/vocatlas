/* ================= Comparar: dos carreras frente a frente =================
   Pestaña propia. Dos lugares (izquierda y derecha) con las carreras de tu mapa y, debajo, pocas tarjetas muy visuales:
   lo que sentiste (barras en espejo), los intereses que pide cada una (hexágono, con los tuyos si hiciste el test),
   tu avance, los datos verificados (o «pendiente») y una pregunta final: ¿cuál te late más hoy?
   Nada de cifras inventadas: los datos salen de CAT.cif. */
var CMP={a:null,b:null};
function cmpMine(id){var A=(S.auto||{})[id]||{},n=0,si=0,sc=0;for(var k in A){n++;si+=A[k].i;sc+=A[k].c}return {i:n?si/n:null,c:n?sc/n:null}}
/* puntaje de cada tipo de interés que pide una carrera, según su código (primera letra 3, segunda 2, tercera 1), de 0 a 1 */
function cmpRia(id){var r=CAT.regla.carreras[id],o={};IPA.forEach(function(a){o[a]=0});if(!r)return o;r.intereses.split("").forEach(function(l,i){o[IPK[l]]=[1,.66,.4][i]||.3});return o}
function cmpPair(){var cs=MC();if(cs.length<2)return null;var ids=cs.map(function(c){return c.id});
 if(!CMP.a||ids.indexOf(CMP.a)<0)CMP.a=null;if(!CMP.b||ids.indexOf(CMP.b)<0||CMP.b===CMP.a)CMP.b=null;
 var by=cs.slice().sort(function(x,y){return progOf(y.id).p-progOf(x.id).p||scoreOf(y.id)-scoreOf(x.id)});
 if(!CMP.a)CMP.a=by[0].id;if(!CMP.b)CMP.b=(by.filter(function(c){return c.id!==CMP.a})[0]).id;return [byId[CMP.a],byId[CMP.b]]}
/* hexágono de intereses: los dos de las carreras y, punteado, el tuyo */
function cmpHex(A,B){var R=78,cx=110,cy=100,ang=function(i){return -Math.PI/2+i*Math.PI/3},pt=function(i,v){return [cx+Math.cos(ang(i))*R*v,cy+Math.sin(ang(i))*R*v]};
 var poly=function(o){return IPA.map(function(a,i){var p=pt(i,.12+.88*o[a]);return p[0].toFixed(1)+","+p[1].toFixed(1)}).join(" ")};
 var g="";[1,.66,.33].forEach(function(k){g+='<polygon points="'+IPA.map(function(a,i){var p=pt(i,k);return p[0].toFixed(1)+","+p[1].toFixed(1)}).join(" ")+'" class="cx-grid"/>'});
 IPA.forEach(function(a,i){var p=pt(i,1);g+='<line x1="'+cx+'" y1="'+cy+'" x2="'+p[0].toFixed(1)+'" y2="'+p[1].toFixed(1)+'" class="cx-grid"/>';var q=pt(i,1.24);g+='<text x="'+q[0].toFixed(1)+'" y="'+(q[1]+4).toFixed(1)+'" text-anchor="middle" class="cx-lab">'+IPL[a][1]+'</text>'});
 var last=(S.ip||[])[(S.ip||[]).length-1],me="";
 if(last){var mx=ipMax(last.v),o={};IPA.forEach(function(a){o[a]=last.s[a]/mx});me='<polygon points="'+poly(o)+'" class="cx-me"/>'}
 return '<svg viewBox="-12 -8 244 220" class="cx-hex" role="img" aria-label="Intereses que pide cada carrera">'+g+
  '<polygon points="'+poly(cmpRia(A.id))+'" class="cx-a" style="--k:'+A.color+'"/><polygon points="'+poly(cmpRia(B.id))+'" class="cx-b" style="--k:'+B.color+'"/>'+me+'</svg>'+
  '<div class="cx-key"><span><i style="background:'+A.color+'"></i>'+esc(A.short||A.name)+'</span><span><i style="background:'+B.color+'"></i>'+esc(B.short||B.name)+'</span>'+(last?'<span><i class="me"></i>Tú</span>':'')+'</div>'}
/* barras en espejo: la carrera de la izquierda crece hacia la izquierda y la otra hacia la derecha */
function cmpBar(lab,va,vb,max,fmt,A,B){var w=function(v){return v==null?0:Math.max(4,v/max*100)},t=function(v){return v==null?"—":fmt(v)};
 var win=va!=null&&vb!=null&&va!==vb?(va>vb?"a":"b"):"";
 return '<div class="cx-row"><b class="cx-v'+(win==="a"?" w":"")+'">'+t(va)+'</b><div class="cx-l"><i style="width:'+w(va)+'%;background:'+A.color+'"></i></div><span>'+lab+'</span><div class="cx-r"><i style="width:'+w(vb)+'%;background:'+B.color+'"></i></div><b class="cx-v'+(win==="b"?" w":"")+'">'+t(vb)+'</b></div>'}
function cmpDato(id,k){var d=(CAT.cif||{})[id+"."+k];return d&&d.estado!=="pendiente"&&d.valor!=null?'<b class="num">'+esc(String(d.valor))+'</b><small>'+esc(d.unidad||"")+'</small>':'<em class="cx-pend">Pendiente</em>'}
function renderComparar(){
 artDefs();var v=$("#v-comparar"),P=cmpPair();
 if(!P){v.innerHTML='<div class="vwrap cx"><div class="cx-empty">'+rumboEl()+'<h2>Comparar</h2><p>Necesitas al menos dos carreras en tu mapa.</p><button type="button" class="ui-btn is-block" id="cxAdd">Agregar carrera</button></div></div>';
  wireRumbo(v.querySelector(".rb"));v.querySelector("#cxAdd").onclick=function(){openPicker("edit")};return}
 var A=P[0],B=P[1],ma=cmpMine(A.id),mb=cmpMine(B.id),pa=progOf(A.id),pb=progOf(B.id),key=[A.id,B.id].sort().join("|"),pick=(S.duel||{})[key];
 var slot=function(c,side){return '<button type="button" class="cx-slot" data-s="'+side+'" style="--k:'+c.color+'" aria-label="Cambiar '+esc(c.name)+'"><span class="cx-art">'+artSVG(c.id,progOf(c.id).p)+'</span><b>'+esc(c.short||c.name)+'</b><small>Cambiar</small></button>'};
 var h='<div class="vwrap cx"><h2 class="cx-t">Comparar</h2>'+
  '<div class="cx-duel">'+slot(A,"a")+'<button type="button" class="cx-vs" id="cxSwap" aria-label="Intercambiar lados">VS</button>'+slot(B,"b")+'</div>'+
  '<section class="ui-card cx-card"><h3>Lo que sentiste</h3>'+
   cmpBar("Interés",ma.i,mb.i,5,function(x){return x.toFixed(1)},A,B)+
   cmpBar("Qué tan capaz",ma.c,mb.c,5,function(x){return x.toFixed(1)},A,B)+
   cmpBar("Cuánto te late",S.rate[A.id],S.rate[B.id],10,function(x){return String(x)},A,B)+
   (ma.i==null&&mb.i==null&&S.rate[A.id]==null&&S.rate[B.id]==null?'<p class="cx-hint">Se llena al terminar unidades de cada carrera.</p>':'')+'</section>'+
  '<section class="ui-card cx-card"><h3>Intereses que pide</h3>'+cmpHex(A,B)+((S.ip||[]).length?'':'<button type="button" class="cx-link" id="cxIP">Haz el test de intereses para verte aquí</button>')+'</section>'+
  '<section class="ui-card cx-card"><h3>Tu avance</h3><div class="cx-prog">'+[[A,pa],[B,pb]].map(function(q){var c=q[0],p=q[1],C=2*Math.PI*30;return '<div><div class="cx-ring"><svg viewBox="0 0 72 72" aria-hidden="true"><circle cx="36" cy="36" r="30" class="cx-track"/><circle cx="36" cy="36" r="30" class="cx-arc" style="stroke:'+c.color+';stroke-dasharray:'+(C*p.p).toFixed(1)+' '+C.toFixed(1)+'"/></svg><b class="num">'+p.done+'<small>/'+p.total+'</small></b></div><span>lecciones</span></div>'}).join("")+'</div></section>'+
  '<section class="ui-card cx-card"><h3>La carrera</h3><div class="cx-data">'+[["Duración","duracion"],["Costo en pública","costo_publica"],["Ingreso promedio","ingreso"]].map(function(r){return '<div class="cx-d"><div>'+cmpDato(A.id,r[1])+'</div><span>'+r[0]+'</span><div>'+cmpDato(B.id,r[1])+'</div></div>'}).join("")+'</div></section>'+
  '<section class="cx-final"><h3>Hoy, ¿cuál te late más?</h3><div class="cx-pick">'+[A,B].map(function(c){return '<button type="button" data-p="'+c.id+'" aria-pressed="'+(pick===c.id)+'" style="--k:'+c.color+'">'+esc(c.short||c.name)+'</button>'}).join("")+'</div>'+
   '<button type="button" class="cx-link" data-p="empate" aria-pressed="'+(pick==="empate")+'">Todavía no sé</button></section></div>';
 v.innerHTML=h;
 each(v.querySelectorAll(".cx-slot"),function(b){b.onclick=function(){cmpChoose(b.getAttribute("data-s"))}});
 v.querySelector("#cxSwap").onclick=function(){var t=CMP.a;CMP.a=CMP.b;CMP.b=t;renderComparar()};
 var ip=v.querySelector("#cxIP");if(ip)ip.onclick=openIP;
 each(v.querySelectorAll("[data-p]"),function(b){b.onclick=function(){S.duel=S.duel||{};S.duel[key]=b.getAttribute("data-p");save();if(typeof sfx==="function")sfx("tap");
  each(v.querySelectorAll("[data-p]"),function(x){x.setAttribute("aria-pressed",x===b?"true":"false")})}});
}
/* elegir qué carrera va en cada lado */
function cmpChoose(side){
 var cur=side==="a"?CMP.a:CMP.b,other=side==="a"?CMP.b:CMP.a;
 var el=document.createElement("div");el.className="ui-sheet";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label","Elegir carrera");
 el.innerHTML='<h3>Elige una carrera</h3><div class="cx-list">'+MC().filter(function(c){return c.id!==other}).map(function(c){return '<button type="button" data-id="'+c.id+'" aria-pressed="'+(c.id===cur)+'"><i style="background:'+c.color+'"></i>'+esc(c.name)+'</button>'}).join("")+'</div>';
 var close=uiLayer(el,true);
 each(el.querySelectorAll("[data-id]"),function(b){b.onclick=function(){if(side==="a")CMP.a=b.getAttribute("data-id");else CMP.b=b.getAttribute("data-id");close();renderComparar()}});
}
