/* ================= dónde estudiar cada carrera (Morelos y CDMX) =================
   Sale de datos/universidades.json (CAT.uni), armado por datos/importar_carreras.py desde la base con fuentes.
   Primero lo de tu estado; cada costo y requisito trae su fuente, y lo que no está confirmado lo dice. */
var ESC_EDO={CMX:"CDMX",MOR:"Morelos",MEX:"Edomex"};
/* lo que dice la pastilla de Escuelas: cuántas hay en tu estado, o que todavía no hay datos de tu estado */
function escCount2(id){var d=CAT.uni.car[id],m=S.edo&&S.edo!==EDO_NONE?S.edo:null;if(!m)return d.donde.length+" opciones";var n=d.donde.filter(function(x){return x.edo.indexOf(m)>=0}).length,e=edoById(m);return n?n+" en "+(ESC_EDO[m]||(e?e.n:m)):"Pronto en "+(e?e.n:m)}
/* las universidades no van dentro de la página: se descargan al abrir la app (y quedan guardadas sin conexión) */
(function(){if(!CAT.unisrc||!window.fetch)return;fetch(CAT.unisrc).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(j){CAT.uni=j;
 if(typeof curView!=="undefined"&&curView==="yo"&&typeof renderYo==="function")renderYo(true)}).catch(function(){})})();
function escHas(id){return !!(CAT.uni&&CAT.uni.car&&CAT.uni.car&&CAT.uni.car[id]&&CAT.uni.car[id].donde.length)}
function escUni(uid){var L=(CAT.uni&&CAT.uni.unis)||[];for(var i=0;i<L.length;i++)if(L[i].id===uid)return L[i];return null}
/* tu estado, si está en la región que cubrimos */
function escMine(){return S.edo&&ESC_EDO[S.edo]?S.edo:null}
function escLink(f){return /^https?:\/\//.test(f||"")?'<a href="'+esc(f)+'" target="_blank" rel="noopener">fuente</a>':esc(f||"")}
/* hoja de escuelas: eliges el estado y ves solo lo de ese estado. Empieza en tu estado; si ahí todavía no hay
   escuelas verificadas, lo dice y ofrece los estados que sí tenemos (nunca inventa opciones) */
function escItem(x){var u=escUni(x.u);if(!u)return "";
 return '<li class="es-it"><div class="es-top"><b>'+esc(u.n)+'</b><span class="es-tag t-'+u.tipo+'">'+(u.tipo==="publica"?"Pública":"Privada")+'</span>'+(x.conf!=="alta"?'<span class="es-tag t-conf">Por confirmar</span>':'')+'</div>'+
  '<p class="es-prog">'+esc(x.prog)+'</p><p class="es-sede">'+esc(x.sede)+' · '+x.edo.map(function(e){return ESC_EDO[e]||e}).join(", ")+'</p>'+
  '<details class="es-more"><summary>Costo y cómo se entra</summary><p><b>Costo.</b> '+esc(u.costo.txt)+' <small>('+escLink(u.costo.fuente)+(u.costo.conf!=="alta"?', por confirmar':'')+')</small></p>'+
  '<p><b>Examen.</b> '+esc(u.adm.examen)+'. '+esc(u.adm.txt)+' <small>('+escLink(u.adm.fuente)+(u.adm.conf!=="alta"?', por confirmar':'')+')</small></p>'+
  (u.url?'<a class="es-site" href="'+esc(u.url)+'" target="_blank" rel="noopener">Sitio oficial de '+esc(u.n)+'</a>':'')+'</details></li>'}
function escSheet(id,edo){
 var c=byId[id],d=CAT.uni.car[id],has={};d.donde.forEach(function(x){x.edo.forEach(function(e){has[e]=(has[e]||0)+1})});
 var cur=edo||(S.edo&&S.edo!==EDO_NONE&&edoById(S.edo)?S.edo:(has.CMX?"CMX":Object.keys(has)[0]));
 var list=d.donde.filter(function(x){return x.edo.indexOf(cur)>=0}).sort(function(a,b){var ua=escUni(a.u),ub=escUni(b.u);return (ua&&ua.tipo==="publica"?0:1)-(ub&&ub.tipo==="publica"?0:1)});
 var opts=EDOS.map(function(e){return '<option value="'+e.id+'"'+(e.id===cur?' selected':'')+'>'+esc(e.n)+(has[e.id]?' ('+has[e.id]+')':'')+'</option>'}).join("");
 var en=edoById(cur),h='<h3>Dónde estudiar '+esc(c.name)+'</h3><label class="es-pick"><span>Estado</span><select id="esEdo">'+opts+'</select></label>';
 if(list.length)h+='<p class="es-lead">'+list.length+' opci'+(list.length===1?'ón':'ones')+' en '+esc(en?en.n:cur)+', primero las públicas.</p><ul class="es-list">'+list.map(escItem).join("")+'</ul>';
 else h+='<div class="es-empty"><p><b>Todavía no tenemos escuelas verificadas de '+esc(c.name)+' en '+esc(en?en.n:cur)+'.</b> No las vamos a inventar: cada opción que mostramos tiene su fuente. Por ahora puedes ver:</p><div class="es-alt">'+
  Object.keys(has).map(function(k){var e2=edoById(k);return '<button type="button" class="es-altb" data-edo="'+k+'">'+esc(e2?e2.n:k)+' · '+has[k]+'</button>'}).join("")+'</div></div>';
 h+='<p class="es-note">'+esc(CAT.uni.nota)+' Datos reunidos al '+esc(CAT.uni.corte)+'.</p>';
 var el=document.querySelector(".es-sheet");
 if(!el){el=document.createElement("div");el.className="ui-sheet es-sheet";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label","Dónde estudiar "+c.name);el.innerHTML=h;uiLayer(el,true)}else el.innerHTML=h;
 var sel=el.querySelector("#esEdo");if(sel)sel.onchange=function(){escSheet(id,sel.value)};
 each(el.querySelectorAll(".es-altb"),function(b){b.onclick=function(){escSheet(id,b.getAttribute("data-edo"))}});
}
/* en Yo: tus carreras y cuántas opciones hay para cada una en tu estado */
function escYo(){
 if(!CAT.uni)return "";var mine=escMine(),cs=MC().filter(function(c){return escHas(c.id)});if(!cs.length)return "";
 var h='<section class="at-sec es-yo"><div class="at-sh"><h3>Dónde estudiarlas</h3></div><p class="pf-lead">'+(mine?'Universidades en '+ESC_EDO[mine]+' para tus carreras.':'Por ahora tenemos Morelos y CDMX.'+(S.edo&&S.edo!==EDO_NONE?' Pronto llega tu estado.':' Elige tu estado abajo para ver primero lo más cerca.'))+'</p><div class="ui-card pf-list">';
 cs.forEach(function(c){var d=CAT.uni.car[c.id],n=mine?d.donde.filter(function(x){return x.edo.indexOf(mine)>=0}).length:d.donde.length;
  h+='<button type="button" class="pf-row" data-esc="'+c.id+'"><span class="pf-row-ic" style="color:'+c.color+'">'+ico("book")+'</span><span class="pf-row-t"><b>'+esc(c.name)+'</b><span>'+(n?n+' opci'+(n===1?'ón':'ones')+(mine?' en '+ESC_EDO[mine]:''):'Sin opciones en '+ESC_EDO[mine]+'; mira CDMX')+'</span></span>'+ico("next","pf-chev")+'</button>'});
 return h+'</div></section>'}
function escBind(root){each(root.querySelectorAll("[data-esc]"),function(b){b.onclick=function(){escSheet(b.getAttribute("data-esc"))}})}
