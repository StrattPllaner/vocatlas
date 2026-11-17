/* ================= perfil (pestaña Yo) y colección de Rumbos =================
   Cada carrera completa regala a su Rumbo: la mascota con el gorro y las botas de esa carrera (src/skins.js).
   El que elijas se guarda en S.skin y lo usa Rumbo en toda la app. */
/* el Rumbo de una carrera se gana al terminar su unidad 2 (Pruébala); en las carreras que aún no tienen esa unidad completa, al terminar lo que hay */
function skinOn(k){return !k||unitDone(k,1)||progOf(k).p>=1}
function skinName(k){return k?RUMBO.SKINS[k].n:"Rumbo Aviador"}
function skinShort(k){return skinName(k).replace(/^Rumbo /,"")}
function skinStatic(k,off){var s=RUMBO.svg("U",null,null,k||null).replace('class="rbx ','class="rbx-static ');return off?ISO.greyAll(s):s}
function skinRb(k,extra){return '<div class="rb float '+(extra||"")+'" data-mood="idle">'+RUMBO.svg("U",null,null,k||null)+'<div class="burst"></div></div>'}
function skinsWon(){return C.filter(function(c){return RUMBO.SKINS[c.id]&&skinOn(c.id)}).map(function(c){return c.id})}
/* orden de la colección: el aviador, los ganados y luego los más cercanos a ganarse */
function skinOrder(){
 var ks=C.filter(function(c){return RUMBO.SKINS[c.id]}).map(function(c,i){var p=progOf(c.id).p;return {k:c.id,w:p>=1?3:picked(c.id)?1+p:0,i:i}});
 ks.sort(function(a,b){return b.w-a.w||a.i-b.i});
 return [""].concat(ks.map(function(o){return o.k}));
}
function setSkin(k){
 S.skin=k&&skinOn(k)?k:null;save();RUMBO.skin(S.skin);
 /* todos los Rumbos que ya están en pantalla se cambian de ropa en su lugar */
 [].forEach.call(document.querySelectorAll(".rb"),function(el){var sv=el.querySelector("svg.rbx");if(sv&&!el.hasAttribute("data-skinfix"))sv.outerHTML=RUMBO.svg()});
}
RUMBO.skin(S.skin&&RUMBO.SKINS[S.skin]&&skinOn(S.skin)?S.skin:null);

function skTile(k,i){
 var c=k?byId[k]:null,on=skinOn(k),use=(S.skin||"")===k,pg=k?progOf(k):null;
 var sub=use?"En uso":on?(k?esc(shortName(c)):"El original"):picked(k)?pg.done+" de "+pg.total:"Sin agregar";
 return '<button type="button" class="pf-sk'+(use?" is-use":"")+(on?"":" is-off")+' at-in" style="--i:'+Math.min(i,8)+'" data-k="'+k+'" aria-label="'+esc(skinName(k))+', '+(use?"en uso":on?"ganado":"por ganar")+'">'+
  '<span class="pf-sk-rb">'+skinStatic(k,!on)+'</span>'+
  (use?'<span class="pf-bdg is-use">'+ico("check")+'</span>':'')+
  '<b>'+esc(skinShort(k))+'</b><small>'+sub+'</small>'+(!on&&pg&&picked(k)?'<i class="pf-skbar" style="--v:'+pg.p.toFixed(3)+'"></i>':'')+'</button>';
}
function skGrid(ks){return '<div class="pf-grid">'+ks.map(skTile).join("")+'</div>'}
var PFSUB=null;
function skBind(root){[].forEach.call(root.querySelectorAll(".pf-sk"),function(b){b.onclick=function(){openSkin(b.getAttribute("data-k"))}})}
function skRefresh(){
 if(curView==="yo")renderYo(true);
 if(PFSUB&&PFSUB.isConnected){var g=PFSUB.querySelector(".pf-grid");if(g){g.outerHTML=skGrid(skinOrder());skBind(PFSUB)}}
}
function openSkin(k){
 var c=k?byId[k]:null,on=skinOn(k),use=(S.skin||"")===k,pg=k?progOf(k):null,left=pg?pg.total-pg.done:0,inMap=k?picked(k):true;
 var el=document.createElement("div");el.className="ui-sheet pf-sheet";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-labelledby","pfSkT");
 var txt=!k?"Es Rumbo como lo conociste: gorro de aviador, gafas y botas azules.":
  on?"Lo ganaste al completar "+esc(c.name)+".":
  inMap?(pg.done?"Te falta"+(left===1?"":"n")+" "+left+" "+(left===1?"lección":"lecciones")+" de "+esc(c.name)+" para ganarlo.":"Completa las "+pg.total+" lecciones de "+esc(c.name)+" para ganarlo."):
  "Agrega "+esc(c.name)+" a tu mapa y completa sus lecciones para ganarlo.";
 var act=use?'<button type="button" class="ui-btn is-block is-sec" data-a="x">En uso</button>':
  on?'<button type="button" class="ui-btn is-block" data-a="use">Usar este Rumbo</button>':
  inMap?'<button type="button" class="ui-btn is-block" data-a="go">Ir a '+esc(shortName(c))+ico("next")+'</button>':
  '<button type="button" class="ui-btn is-block" data-a="add">Agregar a mi mapa'+ico("plus")+'</button>';
 el.innerHTML='<div class="grab"></div><div class="pf-sh-rb'+(on?"":" is-off")+'">'+(on?'<div class="rb float" data-skinfix="1" data-mood="happy">'+RUMBO.svg("U",null,null,k||null)+'<div class="burst"></div></div>':skinStatic(k,true))+'</div>'+
  (on?'':'<div class="pf-sh-lock">Por ganar</div>')+
  '<h3 id="pfSkT">'+esc(skinName(k))+'</h3><p>'+txt+'</p>'+
  (!on&&inMap?'<div class="at-pr"><div class="ui-prog" style="--v:'+pg.p+'" role="img" aria-label="'+pg.done+' de '+pg.total+' lecciones"><i></i></div><span class="num">'+pg.done+'/'+pg.total+'</span></div>':'')+
  '<div class="acts">'+act+(use?'':'<button type="button" class="ui-btn is-block is-ghost" data-a="x">Cerrar</button>')+'</div>';
 var close=uiLayer(el,true),rb=el.querySelector(".rb");if(rb)wireRumbo(rb);
 [].forEach.call(el.querySelectorAll("[data-a]"),function(b){b.onclick=function(){
  var a=b.getAttribute("data-a");close();
  if(a==="use"){setSkin(k);sfx("ok");skRefresh();uiToast("Listo: ahora eres "+skinName(k))}
  else if(a==="go"){if(PFSUB&&PFSUB._close)PFSUB._close();setTimeout(function(){openCareer(k)},RM()?0:320)}
  else if(a==="add"){if(PFSUB&&PFSUB._close)PFSUB._close();setTimeout(function(){openPicker("edit",c.area)},RM()?0:320)}
 }});
 setTimeout(function(){uiFocus(el.querySelector(".ui-btn"))},60);
}
function openSkins(){
 var won=skinsWon().length+1,tot=Object.keys(RUMBO.SKINS).length+1;
 PFSUB=atSub("Tus Rumbos",'<p class="at-lead">Cada carrera tiene su Rumbo. Lo ganas cuando completas todas sus lecciones. Llevas '+won+' de '+tot+'.</p>'+skGrid(skinOrder()),"pf-sub");
 PFSUB._close=function(){var b=PFSUB.querySelector(".at-subh .ui-iconbtn");if(b)b.click()};
 skBind(PFSUB);
}

/* isla pequeña donde se para Rumbo en el perfil: mismos colores del mapa */
function pfIsle(){
 return '<svg class="pf-isle" viewBox="0 0 240 90" aria-hidden="true"><ellipse cx="120" cy="50" rx="112" ry="36" fill="var(--pf-sh1)"/><ellipse cx="120" cy="49" rx="98" ry="30" fill="var(--pf-sh2)"/>'+
  '<ellipse cx="120" cy="50" rx="86" ry="25" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="12 9" stroke-linecap="round" opacity=".7"/>'+
  '<ellipse cx="120" cy="47" rx="80" ry="22" fill="var(--pf-cliff)"/><ellipse cx="120" cy="43" rx="80" ry="22" fill="var(--pf-sand)"/><ellipse cx="120" cy="41" rx="64" ry="16.5" fill="var(--pf-grass2)"/><ellipse cx="120" cy="39.6" rx="64" ry="16.5" fill="var(--pf-grass)"/></svg>';
}
function renderYo(keep){
 var v=$("#v-yo"),sc=keep?v.scrollTop:0,NP=S.pick.length,Y=yoMeta(),en=edoName(),nt=S.interests.length+S.custom.length;
 var won=skinsWon().length+1,tot=Object.keys(RUMBO.SKINS).length+1,stamps=earnedStamps().length;
 var who=[S.grado?gradoName(S.grado):"",typeof S.edad==="number"?S.edad+" años":"",en||""].filter(Boolean);
 var row=function(id,ic,t,sub){return '<button type="button" class="pf-row" id="'+id+'"><span class="pf-row-ic">'+ico(ic)+'</span><span class="pf-row-t"><b>'+t+'</b><span>'+sub+'</span></span>'+ico("next","pf-chev")+'</button>'};
 var h='<div class="vwrap pf at'+(keep?" is-still":"")+'">';
 /* 1. quién eres: Rumbo con su ropa, tu nombre y tus números */
 h+='<section class="pf-hero at-in" style="--i:0"><div class="pf-stage">'+pfIsle()+rumboEl()+'<button type="button" class="pf-edit" id="edPerf" aria-label="Editar mi perfil y mi meta">'+ico("user")+'<span>Editar</span></button></div>'+
  '<div class="pf-id"><h2>'+(S.nick?esc(S.nick):"Tu perfil")+'</h2><span class="pf-tag">'+esc(skinName(S.skin||""))+'</span>'+(who.length?'<p>'+esc(who.join(" · "))+'</p>':'')+'</div>'+
  '<div class="pf-stats"><div><b class="num">'+clarity()+'<i>%</i></b><span>claridad</span></div><div><b class="num">'+Y.done+'<i>/'+NP+'</i></b><span>carrera'+(NP===1?"":"s")+' probada'+(NP===1?"":"s")+'</span></div><div><b class="num">'+stamps+'</b><span>sello'+(stamps===1?"":"s")+'</span></div></div></section>';
 /* 2. colección */
 h+='<section class="at-sec at-in" style="--i:1"><div class="at-sh"><h3>Tus Rumbos <span class="pf-count num">'+won+'/'+tot+'</span></h3><button type="button" class="at-link" id="pfAll">Ver todos</button></div>'+
  '<p class="pf-lead">Se ganan al terminar «Pruébala». Toca uno para ponértelo.</p>'+skGrid(skinOrder().slice(0,6))+'</section>';
 /* 3. meta */
 h+='<section class="ui-card pf-goal at-in" style="--i:2"><div class="at-eb">Tu siguiente meta</div>'+Y.meta+'<div class="ui-prog is-gold" style="--v:'+(keep?Y.pr.toFixed(3):0)+'" data-v="'+Y.pr.toFixed(3)+'"><i></i></div></section>';
 /* 4. ajustes */
 h+='<section class="at-sec at-in" style="--i:3"><div class="at-sh"><h3>Ajustes</h3></div><div class="ui-card pf-list">'+
  row("edPick","map","Mis carreras",NP+" elegida"+(NP===1?"":"s")+" en tu mapa")+
  row("chg","heart","Mis temas",nt+" tema"+(nt===1?"":"s")+" elegido"+(nt===1?"":"s"))+
  row("edPerf2","user","Mi perfil y mi meta",(S.nick?esc(S.nick):"Sin apodo")+(S.grado?" · "+esc(gradoName(S.grado)):""))+
  '<div class="pf-edo pf-tema"><span class="pf-row-ic">'+ico(TEMA.dark()?"moon":"sun")+'</span><div class="pf-row-t"><b id="yTemaLab">Día o noche</b><div class="ui-seg" id="yTema" role="group" aria-labelledby="yTemaLab">'+[["auto","Automático"],["light","Día"],["dark","Noche"]].map(function(o){return '<button type="button" data-t="'+o[0]+'" aria-pressed="'+(TEMA.get()===o[0])+'">'+o[1]+'</button>'}).join("")+'</div></div></div>'+
  '<div class="pf-edo"><span class="pf-row-ic">'+ico("globe")+'</span><div class="pf-row-t"><b id="yEdoLab">Mi estado</b><span>Opcional</span>'+edoWidget("y","yEdoLab")+'</div></div></div>'+
  (Y.where?'<div class="pf-soon">'+ico("book")+'<div>'+Y.where+'</div></div>':'')+
  '<details class="priv pf-priv"><summary>Aviso de privacidad</summary>'+PRIV_FULL+'</details>'+'</section></div>';
 v.innerHTML=h;if(keep)v.scrollTop=sc;
 wireRumbo(v.querySelector(".pf-stage .rb"));
 if(!keep)requestAnimationFrame(function(){requestAnimationFrame(function(){var p=v.querySelector(".pf-goal .ui-prog");if(p)p.style.setProperty("--v",p.getAttribute("data-v"))})});
 skBind(v);
 bindEdo("y",function(id){renderYo(true);toast(id===EDO_NONE?"Listo, no lo guardamos":"Guardado: "+edoById(id).n)});
 $("#edPerf").onclick=$("#edPerf2").onclick=function(){showFlow("perfil",1,"edit")};
 $("#edPick").onclick=function(){openPicker("edit")};
 $("#chg").onclick=function(){appToQuiz()};
 $("#pfAll").onclick=openSkins;
 [].forEach.call(v.querySelectorAll("#yTema button"),function(b){b.onclick=function(){var was=TEMA.dark();TEMA.set(b.getAttribute("data-t"));if(was!==TEMA.dark())themeChanged();renderYo(true)}});
}
