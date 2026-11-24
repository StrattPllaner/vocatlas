/* ================= Claridad: qué carrera te interesa más, hacia qué área te inclinas y cómo cambia día a día =================
   Cada día calificas del 1 al 5 qué tanto te interesa cada carrera de tu mapa (S.dia[fecha][id]). Con eso, tu veredicto
   (S.rate) y lo que contestaste al cerrar lecciones (S.tev) se arma el ranking, la inclinación por área y la gráfica. */
var CLAR=(function(){
 function hoy(){var d=new Date();return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2)}
 function dias(n){var o=[],d=new Date();for(var i=n-1;i>=0;i--){var x=new Date(d);x.setDate(d.getDate()-i);o.push(x.getFullYear()+"-"+("0"+(x.getMonth()+1)).slice(-2)+"-"+("0"+x.getDate()).slice(-2))}return o}
 /* interés de 0 a 5: lo que dijiste en los últimos días pesa más; si no, tu veredicto o tus respuestas en lecciones */
 function score(id){var D=S.dia||{},v=[],w=0,s=0;dias(14).forEach(function(k,i){var r=D[k]&&D[k][id];if(r){s+=r*(i+1);w+=i+1;v.push(r)}});
  if(w)return s/w;if(S.rate&&S.rate[id]!=null)return S.rate[id]/2;var T=(S.tev||{})[id];if(T){var a=0,n=0;for(var k in T){a+=T[k];n++}if(n)return a/n}return null}
 function html(){var cs=MC();if(!cs.length)return "";var hd=(S.dia||{})[hoy()]||{};
  var R=cs.map(function(c){return {c:c,s:score(c.id)}}).sort(function(a,b){return (b.s==null?-1:b.s)-(a.s==null?-1:a.s)});
  /* inclinación por área: promedio de interés de sus carreras */
  var A={};R.forEach(function(r){if(r.s==null)return;var a=r.c.area;A[a]=A[a]||{s:0,n:0};A[a].s+=r.s;A[a].n++});
  var AL=Object.keys(A).map(function(a){return {a:a,v:A[a].s/A[a].n}}).sort(function(x,y){return y.v-x.v});
  var h='<section class="cl-sec at-in"><div class="at-sh"><h3>¿Qué tanto te interesa hoy?</h3></div><p class="cl-p">Califica cada día. Así ves cómo cambia lo que te late.</p><div class="cl-today">'+
   cs.map(function(c){var v=hd[c.id]||0;return '<div class="cl-card'+(v?' is-on':'')+'" style="--c:'+c.color+'">'+(typeof SIMB!=="undefined"&&SIMB.has(c.id)?SIMB.icon(c.id,"a",44):'')+'<span>'+esc(c.short||c.name)+'</span><div class="cl-stars" role="radiogroup" aria-label="Interés en '+esc(c.name)+'">'+[1,2,3,4,5].map(function(n){return '<button type="button" role="radio" aria-checked="'+(v===n)+'" aria-label="'+n+' de 5" data-c="'+c.id+'" data-n="'+n+'" class="'+(n<=v?"on":"")+'"></button>'}).join("")+'</div></div>'}).join("")+'</div></section>';
  h+='<section class="cl-sec at-in"><div class="at-sh"><h3>De más a menos interés</h3></div><ol class="cl-rank">'+R.map(function(r){return '<li style="--c:'+r.c.color+'"><span>'+esc(r.c.short||r.c.name)+'</span><div class="cl-bar"><i style="width:'+(r.s==null?0:r.s/5*100).toFixed(0)+'%"></i></div><b>'+(r.s==null?"—":r.s.toFixed(1))+'</b></li>'}).join("")+'</ol>'+
   (AL.length?'<p class="cl-lean">Te inclinas hacia <b>'+esc(AREAS[AL[0].a].n)+'</b></p><div class="cl-areas">'+AL.map(function(x){return '<div style="--c:'+(AREA_COL_FLOW[x.a]||"#3F7DA6")+';flex:'+x.v.toFixed(2)+'"><span>'+esc(AREAS[x.a].n)+'</span></div>'}).join("")+'</div>':'')+'</section>';
  /* gráfica de los últimos 14 días */
  var D14=dias(14),has=D14.some(function(k){return S.dia&&S.dia[k]});
  if(has){var W=320,H=120,px=function(i){return 10+i*(W-20)/13},py=function(v){return H-10-(v-1)/4*(H-20)},lines="";
   R.slice(0,5).forEach(function(r){var pts=[];D14.forEach(function(k,i){var v=S.dia[k]&&S.dia[k][r.c.id];if(v)pts.push(px(i).toFixed(1)+","+py(v).toFixed(1))});if(pts.length)lines+='<polyline points="'+pts.join(" ")+'" fill="none" stroke="'+r.c.color+'" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'+pts.map(function(p){var q=p.split(",");return '<circle cx="'+q[0]+'" cy="'+q[1]+'" r="3.4" fill="'+r.c.color+'"/>'}).join("")});
   h+='<section class="cl-sec at-in"><div class="at-sh"><h3>Últimos 14 días</h3></div><svg class="cl-chart" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Interés por día">'+[1,3,5].map(function(v){return '<line x1="10" x2="'+(W-10)+'" y1="'+py(v)+'" y2="'+py(v)+'" class="cl-gl"/>'}).join("")+lines+'</svg><div class="cl-key">'+R.slice(0,5).map(function(r){return '<span><i style="background:'+r.c.color+'"></i>'+esc(r.c.short||r.c.name)+'</span>'}).join("")+'</div></section>'}
  return h}
 function inject(){var v=$("#v-atlas");if(!v)return;var w=v.querySelector(".vwrap");if(!w)return;var at=w.querySelector(".at-next");var d=document.createElement("div");d.className="cl";d.innerHTML=html();
  if(at&&at.nextSibling)w.insertBefore(d,at.nextSibling);else w.appendChild(d);
  each(d.querySelectorAll(".cl-stars button"),function(b){b.onclick=function(){var k=hoy();S.dia=S.dia||{};S.dia[k]=S.dia[k]||{};S.dia[k][b.getAttribute("data-c")]=+b.getAttribute("data-n");save();var y=v.scrollTop;renderAtlas();v.scrollTop=y}})}
 return {inject:inject,score:score}})();
(function(){var _ra=renderAtlas;renderAtlas=function(){_ra();try{CLAR.inject()}catch(e){}}})();
