/* ================= ¿cuánto ganan? =================
   Solo cifras verificadas de CAT.cif (IMCO, Compara Carreras). Si una carrera no tiene dato, se dice y no se inventa. */
function suDato(id,k){var d=(CAT.cif||{})[id+"."+k];return d&&d.estado!=="pendiente"&&d.valor!=null?d:null}
function suNum(d){return d?parseFloat(String(d.valor).replace(/[^\d.]/g,""))||0:0}
function suHas(id){return !!suDato(id,"ingreso")}
function suFmt(n){return "$"+Math.round(n).toLocaleString("es-MX")}
/* todas las carreras con sueldo verificado, de mayor a menor */
function suRank(){return C.filter(function(c){return suHas(c.id)}).map(function(c){return {c:c,n:suNum(suDato(c.id,"ingreso"))}}).sort(function(a,b){return b.n-a.n})}
function suBtn(id){var d=suDato(id,"ingreso");
 return '<button type="button" class="rt-su" id="lpSu" aria-label="Cuánto ganan en '+esc((byId[id]||{}).name||"")+'"><svg viewBox="0 0 24 24" class="lp-ic" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M15 9.2c-.5-1-1.6-1.6-3-1.6-1.8 0-3 .9-3 2.2 0 3 6 1.6 6 4.6 0 1.3-1.3 2.3-3 2.3-1.5 0-2.7-.7-3.1-1.8M12 6v1.6M12 16.7V18"/></svg>'+
  '<span><b>¿Cuánto ganan?</b><small>'+(d?suFmt(suNum(d))+' al mes':'Sin dato todavía')+'</small></span></button>'}
function suSheet(id){var c=byId[id],h='<h3>¿Cuánto gana alguien de '+esc(c.name)+'?</h3>'+suBody(id);
 var el=document.createElement("div");el.className="ui-sheet su-sheet";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label","Cuánto ganan en "+c.name);
 el.innerHTML=h;uiLayer(el,true)}
function suBody(id){var c=byId[id],d=suDato(id,"ingreso"),h='';
 if(!d){h+='<p class="su-lead"><b>Todavía no tenemos este dato verificado.</b> No lo vamos a inventar. Lo puedes buscar en <a href="https://imco.org.mx/comparacarreras/" target="_blank" rel="noopener">IMCO, Compara Carreras</a>.</p>'}
 else{var R=suRank(),pos=R.findIndex(function(x){return x.c.id===id})+1,max=R[0].n,n=suNum(d);
  h+='<div class="su-big"><b class="num">'+suFmt(n)+'</b><span>'+esc(d.unidad||"")+'</span></div>'+
   '<p class="su-lead">Es el promedio nacional de quienes estudiaron esta carrera y trabajan. Es un promedio: hay quien gana más y quien gana menos.</p>'+
   '<p class="su-pos">Lugar <b>'+pos+'</b> de '+R.length+' carreras con dato en Vocatlas.</p>';
  /* contra tus otras carreras */
  var mine=MC().filter(function(x){return suHas(x.id)});if(mine.map(function(x){return x.id}).indexOf(id)<0&&suHas(id))mine.push(c);
  var rows=mine.length>1?mine:[R[0].c,c,R[R.length-1].c].filter(function(x,i,a){return a.indexOf(x)===i});
  rows=rows.map(function(x){return {c:x,n:suNum(suDato(x.id,"ingreso"))}}).sort(function(a,b){return b.n-a.n});
  h+='<h4 class="su-h">'+(mine.length>1?'Contra tus otras carreras':'Para darte idea: la que más y la que menos')+'</h4><ul class="su-bars">'+rows.map(function(r){
   return '<li class="'+(r.c.id===id?'is-me':'')+'"><span class="su-n">'+esc(r.c.short||r.c.name)+'</span><span class="su-b"><i style="width:'+(r.n/max*100).toFixed(1)+'%;background:'+r.c.color+'"></i></span><b class="num">'+suFmt(r.n)+'</b></li>'}).join("")+'</ul>';
  var oc=suDato(id,"ocupacion_afin");if(oc)h+='<div class="su-x"><b class="num">'+esc(String(oc.valor))+'</b><span>'+esc(oc.unidad||"")+' trabajan en algo de su carrera</span></div>';
  h+='<p class="su-src">Fuente: '+(d.url?'<a href="'+esc(d.url)+'" target="_blank" rel="noopener">'+esc(d.fuente)+'</a>':esc(d.fuente))+'. Consultado el '+esc(d.consultado||"")+'.</p>'}
 return h}
