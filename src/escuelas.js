/* ================= dónde estudiar cada carrera (Morelos y CDMX) =================
   Sale de datos/universidades.json (CAT.uni), armado por datos/importar_carreras.py desde la base con fuentes.
   Primero lo de tu estado; cada costo y requisito trae su fuente, y lo que no está confirmado lo dice. */
var ESC_EDO={CMX:"CDMX",MOR:"Morelos",MEX:"Edomex"};
function escHas(id){return !!(CAT.uni&&CAT.uni.car&&CAT.uni.car[id]&&CAT.uni.car[id].donde.length)}
function escUni(uid){var L=(CAT.uni&&CAT.uni.unis)||[];for(var i=0;i<L.length;i++)if(L[i].id===uid)return L[i];return null}
/* tu estado, si está en la región que cubrimos */
function escMine(){return S.edo&&ESC_EDO[S.edo]?S.edo:null}
function escLink(f){return /^https?:\/\//.test(f||"")?'<a href="'+esc(f)+'" target="_blank" rel="noopener">fuente</a>':esc(f||"")}
function escSheet(id){
 var c=byId[id],d=CAT.uni.car[id],mine=escMine(),list=d.donde.slice();
 /* lo de tu estado arriba; luego públicas antes que privadas */
 list.sort(function(a,b){var ua=escUni(a.u),ub=escUni(b.u),ma=mine&&a.edo.indexOf(mine)>=0?0:1,mb=mine&&b.edo.indexOf(mine)>=0?0:1;
  return ma-mb||((ua&&ua.tipo==="publica"?0:1)-(ub&&ub.tipo==="publica"?0:1))});
 var h='<h3>Dónde estudiar '+esc(c.name)+'</h3><p class="es-lead">'+(mine?'Primero lo que hay en '+ESC_EDO[mine]+'.':S.edo&&S.edo!==EDO_NONE?'Por ahora solo tenemos Morelos y CDMX. Pronto llegan más estados.':'Opciones en Morelos y CDMX.')+'</p><ul class="es-list">';
 list.forEach(function(x){var u=escUni(x.u);if(!u)return;var near=mine&&x.edo.indexOf(mine)>=0;
  h+='<li class="es-it'+(near?' is-near':'')+'"><div class="es-top"><b>'+esc(u.n)+'</b><span class="es-tag t-'+u.tipo+'">'+(u.tipo==="publica"?"Pública":"Privada")+'</span>'+(x.conf!=="alta"?'<span class="es-tag t-conf">Por confirmar</span>':'')+'</div>'+
   '<p class="es-prog">'+esc(x.prog)+'</p><p class="es-sede">'+esc(x.sede)+' · '+x.edo.map(function(e){return ESC_EDO[e]||e}).join(", ")+'</p>'+
   '<details class="es-more"><summary>Costo y cómo se entra</summary><p><b>Costo.</b> '+esc(u.costo.txt)+' <small>('+escLink(u.costo.fuente)+(u.costo.conf!=="alta"?', por confirmar':'')+')</small></p>'+
   '<p><b>Examen.</b> '+esc(u.adm.examen)+'. '+esc(u.adm.txt)+' <small>('+escLink(u.adm.fuente)+(u.adm.conf!=="alta"?', por confirmar':'')+')</small></p>'+
   (u.url?'<a class="es-site" href="'+esc(u.url)+'" target="_blank" rel="noopener">Sitio oficial de '+esc(u.n)+'</a>':'')+'</details></li>'});
 h+='</ul><p class="es-note">'+esc(CAT.uni.nota)+' Datos reunidos al '+esc(CAT.uni.corte)+'.</p>';
 var el=document.createElement("div");el.className="ui-sheet es-sheet";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label","Dónde estudiar "+c.name);
 el.innerHTML=h;uiLayer(el,true);
}
/* en Yo: tus carreras y cuántas opciones hay para cada una en tu estado */
function escYo(){
 if(!CAT.uni)return "";var mine=escMine(),cs=MC().filter(function(c){return escHas(c.id)});if(!cs.length)return "";
 var h='<section class="at-sec es-yo"><div class="at-sh"><h3>Dónde estudiarlas</h3></div><p class="pf-lead">'+(mine?'Universidades en '+ESC_EDO[mine]+' para tus carreras.':'Por ahora tenemos Morelos y CDMX.'+(S.edo&&S.edo!==EDO_NONE?' Pronto llega tu estado.':' Elige tu estado abajo para ver primero lo más cerca.'))+'</p><div class="ui-card pf-list">';
 cs.forEach(function(c){var d=CAT.uni.car[c.id],n=mine?d.donde.filter(function(x){return x.edo.indexOf(mine)>=0}).length:d.donde.length;
  h+='<button type="button" class="pf-row" data-esc="'+c.id+'"><span class="pf-row-ic" style="color:'+c.color+'">'+ico("book")+'</span><span class="pf-row-t"><b>'+esc(c.name)+'</b><span>'+(n?n+' opci'+(n===1?'ón':'ones')+(mine?' en '+ESC_EDO[mine]:''):'Sin opciones en '+ESC_EDO[mine]+'; mira CDMX')+'</span></span>'+ico("next","pf-chev")+'</button>'});
 return h+'</div></section>'}
function escBind(root){each(root.querySelectorAll("[data-esc]"),function(b){b.onclick=function(){escSheet(b.getAttribute("data-esc"))}})}
