/* ================= lecciones: reproductor de tarjetas =================
   El contenido viene del catálogo (datos/, inyectado como CAT por build.py); aquí solo está cómo se juega cada tipo de tarjeta.
   Una tarjeta pasa por dos momentos: responder y ver la revelación. Las de solo lectura pasan directo a «Seguir».
   Nada de cifras aquí: las tarjetas «rango» y «dato» apuntan a CAT.cif; si la cifra está pendiente se muestra un estado vacío. */
var LEC=(function(){
 var L=null; /* lección abierta: {id,les,cards,i,el,onDone,ctx} */
 function h(s){return esc(s)}
 function mix(a,k){var r=rng(hash(k)),o=a.map(function(x,i){return i});for(var i=o.length-1;i>0;i--){var j=Math.floor(r()*(i+1)),t=o[i];o[i]=o[j];o[j]=t}
  /* que nunca salga ya resuelto */
  if(o.length>1&&o.every(function(v,i){return v===i})){o.push(o.shift())}return o}
 function fb(kind,html){var f=L.el.querySelector(".lc-fb");f.className="lc-fb on is-"+kind;f.innerHTML='<span class="lc-fbi">'+ico(kind==="ok"?"check":kind==="no"?"x":"bulb")+'</span><div>'+html+'</div>';
  if(typeof sfx==="function")sfx(kind==="ok"?"ok":kind==="no"?"no":"tap");
  var b=L.el.querySelector(".lc-body");setTimeout(function(){b.scrollTo({top:b.scrollHeight,behavior:RM()?"auto":"smooth"})},60)}
 function main(label,on){var b=L.el.querySelector("#lcGo");b.textContent=label;b.setAttribute("aria-disabled",on?"false":"true");b.disabled=!on}
 function done(label){L.phase=1;main(label||(L.i>=L.cards.length-1?"Terminar":"Seguir"),true)}
 var EB={ficha:"La carrera en 30 segundos",pregunta:"Tú decides",teves:"Una última",resultado:"Resultado",escuelas:"Dónde estudiarla",info:"Lo que hay que saber",chat:"Habla con Rumbo",voltear:"Voltea y repasa",completar:"Completa",escena:"Imagina",decision:"Tú decides",vf:"¿Verdadero o falso?",rango:"Apuesta",ordenar:"Ordena",emparejar:"Une",clasificar:"Clasifica",dos_caminos:"¿Cuál va más contigo?",armar_dia:"Arma el día",reflexion:"Sobre ti",comparar:"Tus carreras",resumen:"Tus respuestas",testimonio:"Historia real",dato:"El dato",clave:"Idea clave",interes:"Una última",autoevaluacion:"Cierre de la unidad",veredicto:"Tu veredicto",armar:"Construye",bloques:"Depura",patron:"Encuentra el patrón",presupuesto:"Reparte",encuadre:"Encuadra",componer:"Compón"};
 function rb(m){return '<div class="lc-rb">'+rumboEl()+'</div>'}
 function datoHTML(key,bet,uni){var d=(CAT.cif||{})[key];
  if(!d||d.estado==="pendiente"||d.valor==null)return '<div class="lc-empty">'+rb()+'<p><b>Todavía no tenemos esta cifra verificada.</b> No la vamos a inventar.'+(d&&d.fuente_sugerida?' Puedes buscarla en '+h(d.fuente_sugerida)+'.':'')+'</p></div>'+(bet!=null?'<p class="lc-bet">Tu apuesta: <b>'+bet+'</b> '+h(uni||"")+'. La guardamos para compararla cuando llegue el dato.</p>':'');
  return '<div class="lc-dato'+(d.estado==="confirmar"?' is-conf':'')+(String(d.valor).length>14?' is-txt':'')+'">'+(d.estado==="confirmar"?'<em class="lc-conf">Por confirmar</em>':'')+'<b class="num">'+h(String(d.valor))+'</b> <span>'+h(d.unidad||"")+'</span>'+(d.nota?'<p class="lc-dnota">'+h(d.nota)+'</p>':'')+'<small>Fuente: '+(d.url?'<a href="'+h(d.url)+'" target="_blank" rel="noopener">'+h(d.fuente)+'</a>':h(d.fuente))+' · consultado el '+h(d.consultado||"")+'</small></div>'+(bet!=null?'<p class="lc-bet">Tu apuesta: <b>'+bet+'</b> '+h(uni||"")+'.</p>':'')}
 /* interacción común: elegir una pieza y luego un lugar */
 function pairUI(box,left,right,order,opts){
  /* left: textos fijos; right: textos; order: orden en que se muestran los de la derecha. Devuelve {get,lock,mark} */
  var sel=-1,map={};/* map[rightIndex]=leftIndex */
  box.innerHTML='<div class="lc-pair'+(opts&&opts.slots?' is-slots':'')+'"><div class="lc-pl">'+left.map(function(t,i){return '<button type="button" class="lc-pi" data-l="'+i+'"><i>'+(i+1)+'</i><span>'+h(t)+'</span></button>'}).join("")+'</div><div class="lc-pr">'+order.map(function(ri){return '<button type="button" class="lc-pi" data-r="'+ri+'"><i></i><span>'+h(right[ri])+'</span></button>'}).join("")+'</div></div>';
  function paint(){each(box.querySelectorAll("[data-l]"),function(b){var i=+b.getAttribute("data-l"),used=Object.keys(map).some(function(k){return map[k]===i});b.classList.toggle("on",sel===i);b.classList.toggle("used",used)});
   each(box.querySelectorAll("[data-r]"),function(b){var r=+b.getAttribute("data-r"),has=map[r]!=null;b.classList.toggle("used",has);b.querySelector("i").textContent=has?(map[r]+1):""});
   if(opts.onChange)opts.onChange(Object.keys(map).length===left.length)}
  each(box.querySelectorAll("[data-l]"),function(b){b.onclick=function(){if(L.phase)return;var i=+b.getAttribute("data-l");for(var k in map)if(map[k]===i)delete map[k];sel=sel===i?-1:i;paint()}});
  each(box.querySelectorAll("[data-r]"),function(b){b.onclick=function(){if(L.phase)return;var r=+b.getAttribute("data-r");
   if(map[r]!=null&&sel<0){delete map[r];paint();return}
   if(sel<0){/* sin pieza elegida: toma la primera libre */for(var i=0;i<left.length;i++){var u=false;for(var k in map)if(map[k]===i)u=true;if(!u){sel=i;break}}}
   if(sel<0)return;for(var k2 in map)if(map[k2]===sel)delete map[k2];map[r]=sel;sel=-1;paint()}});
  paint();
  return {mark:function(){var ok=0;each(box.querySelectorAll("[data-r]"),function(b){var r=+b.getAttribute("data-r"),good=map[r]===r;if(good)ok++;b.classList.add(good?"good":"bad");b.querySelector("i").textContent=r+1});return ok}}
 }
 function scale(box,labels,onPick){box.innerHTML='<div class="lc-scale" role="radiogroup">'+[1,2,3,4,5].map(function(n){return '<button type="button" role="radio" aria-checked="false" data-n="'+n+'" aria-label="'+n+' de 5">'+n+'</button>'}).join("")+'</div><div class="lc-scl"><span>'+h(labels[0])+'</span><span>'+h(labels[1])+'</span></div>';
  each(box.querySelectorAll("button"),function(b){b.onclick=function(){each(box.querySelectorAll("button"),function(x){x.setAttribute("aria-checked",x===b?"true":"false")});onPick(+b.getAttribute("data-n"))}})}
 function opts(box,list,onPick,cls){box.innerHTML='<div class="lc-opts '+(cls||"")+'" role="radiogroup">'+list.map(function(t,i){return '<button type="button" class="lc-opt" role="radio" aria-checked="false" data-i="'+i+'">'+h(t)+'</button>'}).join("")+'</div>';
  each(box.querySelectorAll(".lc-opt"),function(b){b.onclick=function(){if(L.phase)return;each(box.querySelectorAll(".lc-opt"),function(x){x.setAttribute("aria-checked",x===b?"true":"false")});onPick(+b.getAttribute("data-i"),b)}})}

 /* fórmula como en el pizarrón: «{arriba|abajo}» es una fracción; « ;; » separa dos fórmulas en la misma línea */
 function fml(s){return '<div class="lc-fml" role="math" aria-label="'+h(s.replace(/\{([^{}|]*)\|([^{}]*)\}/g,"$1 entre $2").replace(/ ;; /g,", "))+'">'+s.split(" ;; ").map(function(g){
   return '<span class="lc-fg">'+g.split(/(\{[^{}]*\})/).map(function(x){var m=/^\{([^{}|]*)\|([^{}]*)\}$/.exec(x);return m?'<span class="lc-frac"><span>'+h(m[1])+'</span><span>'+h(m[2])+'</span></span>':h(x)}).join("")+'</span>'}).join("")+'</div>'}
 function partes(P){return (P||[]).map(function(x){return x.f!=null?fml(x.f):'<p>'+h(x.t)+'</p>'}).join("")}
 /* ---------- formato 2: repaso de lo que fallaste y examen ---------- */
 function repOf(id){S.rep=S.rep||{};return S.rep[id]=S.rep[id]||{}}
 function qCopy(t,key,vez){var b=vez%2===1&&t.repaso?t.repaso:t,o={tipo:"pregunta",pregunta:b.pregunta,opciones:b.opciones,correcta:b.correcta,explicacion:b.explicacion,formula:b.formula||t.formula,adivina:t.adivina,_key:key,_vez:vez};return o}
 /* arma las tarjetas de una lección de formato 2: primero regresan las que fallaste en lecciones anteriores
    (otro orden de opciones y, si existe, la versión reescrita); en el examen, las que fallaste ahí vuelven reescritas en su lugar */
 function v2Cards(id,les,v2){var R0=repOf(id),pos=v2.order.indexOf(les.id),pre=[];
  Object.keys(R0).forEach(function(k){var p=k.split(":"),lid=p[0],i=+p[1];if(lid===les.id||v2.order.indexOf(lid)<0||v2.order.indexOf(lid)>pos)return;
   var src=carFind(v2.full,lid),t=src&&src.tarjetas[i];if(!t||t.tipo!=="pregunta"){delete R0[k];return}var q=qCopy(t,k,R0[k].n||1);q._rep=1;pre.push(q)});
  var cards=les.tarjetas.map(function(t,i){if(t.tipo!=="pregunta")return t;var k=les.id+":"+i;return qCopy(t,k,R0[k]?R0[k].n||1:0)});
  if(pre.length)pre.unshift({tipo:"info",titulo:"Repaso",partes:[{t:(pre.length===1?"Antes de seguir, regresa una pregunta que fallaste.":"Antes de seguir, regresan "+pre.length+" preguntas que fallaste.")+" Viene en otro orden, así que léela con calma."}]});
  if(les.examen)cards.push({tipo:"resultado"});
  return pre.concat(cards)}

 var FICHA_L={ingreso:"Sueldo promedio",duracion:"Duración",costo_publica:"Escuela pública",costo_privada:"Escuela privada",costo_tec:"Toda la carrera en el Tec",enarm:"Examen para especializarte",ocupacion_afin:"Trabajan en lo suyo"};
 /* ---------- tipos de tarjeta: cada uno recibe (tarjeta, caja) y deja lista la interacción ---------- */
 var R={
  /* lectura corta: lo que hay que saber antes de las preguntas */
  info:function(t,box){box.innerHTML='<div class="lc-info">'+(t.titulo?'<h3>'+h(t.titulo)+'</h3>':'')+(t.texto?'<p>'+h(t.texto)+'</p>':'')+partes(t.partes)+
   (t.puntos?'<ul>'+t.puntos.map(function(p){return '<li><span class="lc-dot"></span>'+h(p)+'</li>'}).join("")+'</ul>':'')+'</div>';done("Entendido")},
  /* plática con Rumbo: eliges qué preguntarle y te contesta; con un par de preguntas ya puedes seguir */
  chat:function(t,box){var asked=0,busy=false,min=Math.min(t.minimo||2,t.temas.length),left=t.temas.map(function(x,i){return i});
   box.innerHTML='<div class="lc-chat"><div class="lc-chh"><span class="lc-chav">'+rumboEl()+'</span><div><b>Rumbo</b><small>'+h(t.subtitulo||"Pregúntale lo que quieras saber")+'</small></div></div><div class="lc-log" aria-live="polite"></div><p class="lc-chq" hidden>Pregúntale:</p><div class="lc-chips"></div></div>';
   var log=box.querySelector(".lc-log"),chips=box.querySelector(".lc-chips"),body=L.el.querySelector(".lc-body");
   function down(){setTimeout(function(){body.scrollTo({top:body.scrollHeight,behavior:RM()?"auto":"smooth"})},30)}
   function say(who,txt){var d=document.createElement("div");d.className="lc-msg is-"+who;d.textContent=txt;log.appendChild(d);restart(d,"in");down()}
   function typing(on){var e=log.querySelector(".lc-typ");if(on&&!e){e=document.createElement("div");e.className="lc-msg is-rb lc-typ";e.innerHTML="<i></i><i></i><i></i>";log.appendChild(e);down()}else if(!on&&e)e.remove()}
   function seq(msgs,k,cb){if(k>=msgs.length){cb();return}typing(true);setTimeout(function(){typing(false);say("rb",msgs[k]);seq(msgs,k+1,cb)},RM()?0:Math.min(1100,380+msgs[k].length*9))}
   function paint(){chips.innerHTML=left.map(function(i){return '<button type="button" class="lc-chip" data-i="'+i+'">'+h(t.temas[i].q)+'</button>'}).join("");
    box.querySelector(".lc-chq").hidden=!left.length;
    each(chips.querySelectorAll(".lc-chip"),function(b){b.onclick=function(){if(busy)return;busy=true;var i=+b.getAttribute("data-i");left=left.filter(function(x){return x!==i});chips.innerHTML="";
     say("me",t.temas[i].q);if(typeof sfx==="function")sfx("tap");
     seq(t.temas[i].a,0,function(){busy=false;asked++;paint();if(asked>=min)done(left.length?"Seguir":null)})}})}
   main("Pregunta algo a Rumbo",false);
   seq(t.intro||[],0,paint)},
  /* tarjetas que se voltean: piensas la respuesta y la confirmas */
  voltear:function(t,box){var seen={};
   box.innerHTML='<p class="lc-q">'+h(t.pregunta)+'</p><p class="lc-note">Toca cada tarjeta para voltearla.</p><div class="lc-flip">'+t.cartas.map(function(c,i){return '<button type="button" class="lc-fc" data-i="'+i+'" aria-pressed="false"><span class="f">'+h(c.frente)+'</span><span class="b">'+h(c.reverso)+'</span></button>'}).join("")+'</div>';
   main("Voltea todas",false);
   each(box.querySelectorAll(".lc-fc"),function(b){b.onclick=function(){var on=b.getAttribute("aria-pressed")!=="true";b.setAttribute("aria-pressed",on?"true":"false");seen[b.getAttribute("data-i")]=1;if(typeof sfx==="function")sfx("tap");
    if(Object.keys(seen).length===t.cartas.length&&!L.phase)done()}})},
  /* completar la frase con la palabra correcta */
  completar:function(t,box){var pick=-1,ord=mix(t.opciones,L.id+L.les.id+L.i+"k"),parts=t.frase.split("___");
   box.innerHTML='<p class="lc-q">'+h(t.pregunta||"Completa la frase.")+'</p><p class="lc-big lc-fill">'+h(parts[0])+'<span class="lc-gap" id="lcGap">______</span>'+h(parts[1]||"")+'</p><div class="lc-in"></div>';
   opts(box.querySelector(".lc-in"),ord.map(function(i){return t.opciones[i]}),function(i){pick=ord[i];box.querySelector("#lcGap").textContent=t.opciones[pick];box.querySelector("#lcGap").classList.add("on");main("Comprobar",true)});
   main("Comprobar",false);
   L.check=function(){var ok=pick===t.correcta;each(box.querySelectorAll(".lc-opt"),function(b){var i=ord[+b.getAttribute("data-i")];if(i===t.correcta)b.classList.add("good");else if(i===pick)b.classList.add("bad")});
    var g=box.querySelector("#lcGap");g.textContent=t.opciones[t.correcta];g.classList.add("good");fb(ok?"ok":"no",h(t.revelacion||""));done()}},
  /* dónde estudiarla: las escuelas de tu estado, dentro de la lección */
  escuelas:function(t,box){var id=L.id,ok=typeof escHas==="function"&&escHas(id),mine=ok?escMine():null,d=ok?CAT.uni.car[id]:null,list=ok?d.donde.slice():[];
   if(ok)list.sort(function(a,b){var ma=mine&&a.edo.indexOf(mine)>=0?0:1,mb=mine&&b.edo.indexOf(mine)>=0?0:1;return ma-mb});
   box.innerHTML='<div class="lc-info lc-esc"><h3>Dónde estudiar '+h((byId[id]||{}).name||"")+'</h3>'+(ok?'<p>'+(mine?'Primero lo que hay en '+ESC_EDO[mine]+'.':'Opciones en Morelos y CDMX.')+'</p><ul class="lc-escl">'+list.slice(0,4).map(function(x){var u=escUni(x.u);return u?'<li><b>'+h(u.n)+'</b><span class="es-tag t-'+u.tipo+'">'+(u.tipo==="publica"?"Pública":"Privada")+'</span><small>'+h(x.sede)+'</small></li>':''}).join("")+'</ul><button type="button" class="ui-btn is-sec is-block" id="lcEsc">Ver todas, con costo y examen</button>':'<p>Todavía no tenemos escuelas para esta carrera. Busca su plan de estudios en la universidad de tu estado.</p>')+'</div>';
   var bt=box.querySelector("#lcEsc");if(bt)bt.onclick=function(){escSheet(id)};done()},
  /* la tarjeta de entrada: qué hace, y sus cifras con fuente (las pendientes no se muestran) */
  ficha:function(t,box){var id=L.id,cs=(t.cifras||[]).map(function(k){var d=CAT.cif[k];if(d)d._k=k;return d}).filter(function(d){return d&&d.estado!=="pendiente"&&d.valor!=null}),src=[];
   cs.forEach(function(d){var f=String(d.fuente).split(" · ")[0],k=f+(d.url||"");if(!src.some(function(x){return x.k===k}))src.push({k:k,f:f,d:d})});
   box.innerHTML='<div class="lc-info lc-ficha"><h3>'+h((byId[id]||{}).name||"")+'</h3><p>'+h(t.texto)+'</p>'+(cs.length?'<div class="lc-fgrid">'+cs.map(function(d){return '<div class="lc-ft'+(String(d.valor).length>12?' is-long':'')+'">'+(d.estado==="confirmar"?'<em class="lc-conf">Por confirmar</em>':'')+'<i class="lc-fl">'+h(FICHA_L[d._k.split(".").pop()]||"")+'</i><b class="num">'+h(String(d.valor))+'</b><span>'+h(d.unidad||"")+'</span></div>'}).join("")+'</div>':'')+
    (src.length?'<small class="lc-fsrc">Fuentes: '+src.map(function(x){return x.d.url?'<a href="'+h(x.d.url)+'" target="_blank" rel="noopener">'+h(x.f)+'</a>':h(x.f)}).join(" · ")+'</small>':'')+
    (typeof escHas==="function"&&escHas(id)?'<button type="button" class="ui-btn is-sec is-block" id="lcEsc">Dónde estudiarla</button>':'')+'</div>';
   var bt=box.querySelector("#lcEsc");if(bt)bt.onclick=function(){escSheet(id)};done()},
  /* caso con tres respuestas y una correcta; en formato 2 cuenta para el repaso y para el examen */
  pregunta:function(t,box){var pick=-1,ord=mix(t.opciones,L.id+L.les.id+(t._key||L.i)+"v"+(t._vez||0));
   if(t._rep)L.el.querySelector(".lc-eb").textContent="Repaso";else if(L.les.examen){var n=0,k=0;L.cards.forEach(function(c,j){if(c.tipo==="pregunta"&&!c._rep){n++;if(j<=L.i)k++}});L.el.querySelector(".lc-eb").textContent="Examen final · "+k+" de "+n}
   box.innerHTML='<p class="lc-q">'+h(t.pregunta)+'</p><div class="lc-in"></div>';
   opts(box.querySelector(".lc-in"),ord.map(function(i){return t.opciones[i]}),function(i){pick=ord[i];main("Comprobar",true)});
   main("Comprobar",false);
   L.check=function(){var ok=pick===t.correcta;
    each(box.querySelectorAll(".lc-opt"),function(b){var i=ord[+b.getAttribute("data-i")];if(i===t.correcta)b.classList.add("good");else if(i===pick)b.classList.add("bad")});
    /* preguntas para adivinar: no hay error, solo lo real; tampoco se repiten */
    if(t.adivina){fb(ok?"ok":"info",(ok?'<b>¡Le atinaste!</b> ':'<b>Lo real: '+h(t.opciones[t.correcta])+'.</b> ')+(t.explicacion?h(t.explicacion):""));done();return}
    if(t._key){var R0=repOf(L.id);if(ok)delete R0[t._key];else R0[t._key]={n:(R0[t._key]?R0[t._key].n||1:0)+1};save()}
    if(L.les.examen&&!t._rep){L.sc=L.sc||{ok:0,n:0};L.sc.n++;if(ok)L.sc.ok++}
    var ex=(t.explicacion?h(t.explicacion):"")+(t.formula?fml(t.formula):"");
    fb(ok?"ok":"no",(ok?'<b>¡Bien!</b> ':'<b>La correcta: '+h(t.opciones[t.correcta])+'.</b> ')+ex+(!ok&&!L.les.examen?'<small>Esta pregunta va a regresar al principio de la siguiente lección.</small>':''));done()}},
  /* cierre de cada lección: ¿te ves resolviendo esto?, del 1 al 5 */
  teves:function(t,box){var id=L.id,lid=L.les.id;box.innerHTML='<p class="lc-big">¿Te late lo que viste?</p><div class="lc-in"></div><p class="lc-note">Tu respuesta se guarda para tu veredicto.</p>';
   main("Terminar",false);
   scale(box.querySelector(".lc-in"),["Nada","Totalmente"],function(n){var k=n>=4?"yes":n===3?"mid":"no";S.tev=S.tev||{};S.tev[id]=S.tev[id]||{};S.tev[id][lid]=n;S.int=S.int||{};S.int[id]=S.int[id]||{};S.int[id][lid]=k;if(!S.res[id])S.res[id]=k;save();
    main(L.i>=L.cards.length-1?"Terminar":"Seguir",true);L.check=function(){next()}})},
  /* resultado del examen: con 7 de 10 apruebas y decides tu veredicto; si no, lo repites */
  resultado:function(t,box){var sc=L.sc||{ok:0,n:0},need=L.les.aprobar||7,pass=sc.ok>=need;L.pass=pass;
   box.innerHTML=rb()+'<p class="lc-big">'+(pass?'¡Aprobaste!':'Esta vez no')+'</p><div class="lc-dato lc-score"><b class="num">'+sc.ok+' de '+sc.n+'</b> <span>correctas</span></div><p class="lc-note">'+(pass?'Ya terminaste la carrera. Falta lo más importante: tu veredicto.':'Necesitas '+need+' para aprobar. Las que fallaste regresan con otras palabras cuando lo intentes de nuevo.')+'</p>';
   if(typeof sfx==="function")sfx(pass?"ok":"no");
   if(pass){if(typeof markLesson==="function")markLesson(L.id,L.les.id);if(L.cards[L.cards.length-1].tipo!=="veredicto"){L.cards.push({tipo:"veredicto"});var sg=L.el.querySelector(".lc-seg");if(sg)sg.appendChild(document.createElement("i"))}L.phase=1;main("Seguir",true)}
   else{L.phase=0;main("Intentar de nuevo",true);L.check=function(){close()}}},
  escena:function(t,box){box.innerHTML=rb()+'<p class="lc-big">'+h(t.texto)+'</p>';done()},
  clave:function(t,box){box.innerHTML='<div class="lc-key"><span>'+ico("bulb")+'</span><p>'+h(t.texto)+'</p></div>';done()},
  decision:function(t,box){var pick=-1,ord=mix(t.opciones,L.id+L.les.id+L.i);
   box.innerHTML='<p class="lc-q">'+h(t.pregunta)+'</p><div class="lc-in"></div>';
   opts(box.querySelector(".lc-in"),ord.map(function(i){return t.opciones[i].texto}),function(i){pick=ord[i];main("Comprobar",true)});
   main("Comprobar",false);
   L.check=function(){var o=t.opciones[pick],best=-1;t.opciones.forEach(function(x,i){if(x.mejor)best=i});
    each(box.querySelectorAll(".lc-opt"),function(b){var i=ord[+b.getAttribute("data-i")];if(i===best)b.classList.add("good");else if(i===pick)b.classList.add("bad")});
    fb(o.mejor?"ok":"no",h(o.consecuencia)+(o.mejor?"":'<small>La opción marcada en verde es la que más ayuda.</small>'));done()}},
  vf:function(t,box){box.innerHTML='<p class="lc-big">'+h(t.afirmacion)+'</p><div class="lc-vf"><button type="button" data-v="1">Verdadero</button><button type="button" data-v="0">Falso</button></div>';
   main("Seguir",false);
   each(box.querySelectorAll(".lc-vf button"),function(b){b.onclick=function(){if(L.phase)return;var v=b.getAttribute("data-v")==="1",ok=v===!!t.respuesta;
    each(box.querySelectorAll(".lc-vf button"),function(x){var xv=x.getAttribute("data-v")==="1";x.classList.add(xv===!!t.respuesta?"good":x===b?"bad":"off")});
    fb(ok?"ok":"no",'<b>'+(t.respuesta?"Verdadero.":"Falso.")+'</b> '+h(t.revelacion));done()}})},
  dos_caminos:function(t,box){box.innerHTML=(t.pregunta?'<p class="lc-q">'+h(t.pregunta)+'</p>':'')+'<div class="lc-two"><button type="button" data-k="a"><i>A</i>'+h(t.a.texto)+'</button><button type="button" data-k="b"><i>B</i>'+h(t.b.texto)+'</button></div><p class="lc-note">Aquí no hay respuesta correcta.</p>';
   main("Seguir",false);
   each(box.querySelectorAll(".lc-two button"),function(b){b.onclick=function(){if(L.phase)return;b.classList.add("on");fb("info",h(t[b.getAttribute("data-k")].dice));done()}})},
  reflexion:function(t,box){box.innerHTML='<p class="lc-q">'+h(t.pregunta)+'</p><div class="lc-in"></div><p class="lc-note">Contesta por ti. Nadie más ve esto.</p>';main("Seguir",false);
   if(t.opciones)opts(box.querySelector(".lc-in"),t.opciones,function(){L.phase=0;main(L.i>=L.cards.length-1?"Terminar":"Seguir",true);L.check=function(){next()}});
   else scale(box.querySelector(".lc-in"),t.escala||["Nada","Mucho"],function(){main(L.i>=L.cards.length-1?"Terminar":"Seguir",true);L.check=function(){next()}})},
  rango:function(t,box){var v=Math.round((t.min+t.max)/2/t.paso)*t.paso,fmt=function(n){return n.toLocaleString("es-MX")};
   box.innerHTML='<p class="lc-q">'+h(t.pregunta)+'</p><div class="lc-rng"><b class="num" id="lcRv">'+fmt(v)+'</b><span>'+h(t.unidad||"")+'</span></div><input type="range" class="range" id="lcRi" min="'+t.min+'" max="'+t.max+'" step="'+t.paso+'" value="'+v+'" aria-label="'+h(t.pregunta)+'" style="--p:50%"><div class="lc-scl"><span>'+fmt(t.min)+'</span><span>'+fmt(t.max)+'</span></div><div class="lc-out"></div>';
   var inp=box.querySelector("#lcRi");inp.oninput=function(){v=+inp.value;box.querySelector("#lcRv").textContent=fmt(v);inp.style.setProperty("--p",((v-t.min)/(t.max-t.min)*100)+"%")};
   main("Ver el dato",true);
   L.check=function(){inp.disabled=true;S.bet=S.bet||{};S.bet[t.dato]=v;save();box.querySelector(".lc-out").innerHTML=datoHTML(t.dato,fmt(v),t.unidad);done()}},
  dato:function(t,box){box.innerHTML='<p class="lc-q">'+h(t.titulo||"")+'</p>'+datoHTML(t.dato);done()},
  testimonio:function(t,box){
   if(t.estado!=="listo"){box.innerHTML='<div class="lc-empty">'+rb()+'<p><b>Aquí va a ir una historia real.</b> Estamos buscando a alguien que la cuente'+(t.perfil?': '+h(t.perfil.charAt(0).toLowerCase()+t.perfil.slice(1)):'')+'. No inventamos testimonios.</p></div>';done();return}
   box.innerHTML='<div class="lc-testi"><b>'+h(t.persona)+'</b><p><i>Lo que más me sorprendió:</i> '+h(t.sorprendio)+'</p><p><i>Lo más difícil:</i> '+h(t.dificil)+'</p><p><i>¿La recomendaría?</i> '+h(t.recomendaria)+'</p></div>';done()},
  ordenar:function(t,box){var ord=mix(t.pasos,L.id+L.les.id+"o"),seq=[];
   box.innerHTML='<p class="lc-q">'+h(t.pregunta)+'</p><p class="lc-note">Toca en el orden que creas correcto.</p><div class="lc-ord">'+ord.map(function(i){return '<button type="button" class="lc-oi" data-i="'+i+'"><i></i><span>'+h(t.pasos[i])+'</span></button>'}).join("")+'</div><button type="button" class="lc-link" id="lcClr">Borrar orden</button>';
   function paint(){each(box.querySelectorAll(".lc-oi"),function(b){var p=seq.indexOf(+b.getAttribute("data-i"));b.classList.toggle("used",p>=0);b.querySelector("i").textContent=p>=0?p+1:""});main("Comprobar",seq.length===t.pasos.length)}
   each(box.querySelectorAll(".lc-oi"),function(b){b.onclick=function(){if(L.phase)return;var i=+b.getAttribute("data-i"),p=seq.indexOf(i);if(p>=0)seq.splice(p,1);else seq.push(i);paint()}});
   box.querySelector("#lcClr").onclick=function(){if(L.phase)return;seq=[];paint()};paint();
   L.check=function(){var n=t.exige||t.pasos.length,ok=true;
    if(t.exige){for(var k=0;k<n;k++)if(seq[k]>=n)ok=false}else seq.forEach(function(v,k){if(v!==k)ok=false});
    var wrap=box.querySelector(".lc-ord");t.pasos.forEach(function(_,i){var b=wrap.querySelector('[data-i="'+i+'"]'),p=seq.indexOf(i);b.classList.add(t.exige?(i<n?(p<n?"good":"bad"):"off"):(p===i?"good":"bad"));b.querySelector("i").textContent=i+1;wrap.appendChild(b)});
    box.querySelector("#lcClr").style.display="none";fb(ok?"ok":"no",(ok?"":"<b>Así queda el orden.</b> ")+h(t.revelacion));done()}},
  emparejar:function(t,box,slots){var left=t.pares.map(function(p){return p[0]}),right=t.pares.map(function(p){return p[1]}),ui;
   box.innerHTML='<p class="lc-q">'+h(t.pregunta)+'</p><p class="lc-note">Toca uno de la izquierda y luego su pareja.</p><div class="lc-in"></div>';
   ui=pairUI(box.querySelector(".lc-in"),left,right,mix(right,L.id+L.les.id+"e"),{slots:slots,onChange:function(all){main("Comprobar",all)}});
   L.check=function(){var ok=ui.mark();fb(ok===left.length?"ok":"no",(ok===left.length?"":'<b>Acertaste '+ok+' de '+left.length+'.</b> El número muestra la pareja correcta. ')+h(t.revelacion));done()}},
  armar_dia:function(t,box){R.emparejar({pregunta:t.pregunta,pares:t.bloques.map(function(b,i){return [b,t.actividades[i]]}),revelacion:t.revelacion},box,true)},
  clasificar:function(t,box){var i=0,ok=0,ord=mix(t.elementos,L.id+L.les.id+"c");
   box.innerHTML='<p class="lc-q">'+h(t.pregunta)+'</p><div class="lc-cl"><div class="lc-cln"></div><div class="lc-clc"></div><div class="lc-clg">'+t.grupos.map(function(g,k){return '<button type="button" data-g="'+k+'">'+h(g)+'</button>'}).join("")+'</div></div>';
   main("Seguir",false);
   function show(){var e=t.elementos[ord[i]];box.querySelector(".lc-cln").textContent=(i+1)+" de "+ord.length;var c=box.querySelector(".lc-clc");c.textContent=e.texto;restart(c,"in");each(box.querySelectorAll(".lc-clg button"),function(b){b.className=""})}
   each(box.querySelectorAll(".lc-clg button"),function(b){b.onclick=function(){if(L.phase||L.busy)return;var e=t.elementos[ord[i]],g=+b.getAttribute("data-g"),good=g===e.grupo;if(good)ok++;
    b.classList.add(good?"good":"bad");if(!good)box.querySelector('.lc-clg [data-g="'+e.grupo+'"]').classList.add("good");if(typeof sfx==="function")sfx(good?"ok":"no");
    L.busy=true;setTimeout(function(){L.busy=false;i++;if(i<ord.length)show();else{box.querySelector(".lc-clc").textContent="Listo";box.querySelector(".lc-cln").textContent="";each(box.querySelectorAll(".lc-clg button"),function(x){x.className="off"});fb(ok===ord.length?"ok":"info",'<b>Acertaste '+ok+' de '+ord.length+'.</b> '+h(t.revelacion));done()}},RM()?500:good?520:1100)}});
   show()},
  interes:function(t,box){var id=L.id,lid=L.les.id;box.innerHTML='<p class="lc-big">'+h(t.pregunta||"¿Te ves haciendo esto?")+'</p><div class="lc-int"><button type="button" data-k="yes">Sí</button><button type="button" data-k="mid">No sé</button><button type="button" data-k="no">No</button></div><p class="lc-note">Tu respuesta se guarda para tu veredicto.</p>';
   main("Terminar",false);
   each(box.querySelectorAll(".lc-int button"),function(b){b.onclick=function(){each(box.querySelectorAll(".lc-int button"),function(x){x.classList.toggle("on",x===b)});S.int=S.int||{};S.int[id]=S.int[id]||{};S.int[id][lid]=b.getAttribute("data-k");save();main(L.i>=L.cards.length-1?"Terminar":"Seguir",true);L.check=function(){next()}}})},
  autoevaluacion:function(t,box){var a={i:0,c:0},u=L.ctx.unit;
   box.innerHTML='<p class="lc-big">Terminaste la unidad «'+h(L.ctx.unitName)+'».</p><p class="lc-q">¿Qué tanto te interesó?</p><div class="lc-a1"></div><p class="lc-q">¿Qué tan capaz te sentiste?</p><div class="lc-a2"></div>';
   main("Terminar",false);function chk(){if(a.i&&a.c){S.auto=S.auto||{};S.auto[L.id]=S.auto[L.id]||{};S.auto[L.id][u]={i:a.i,c:a.c};save();main("Terminar",true);L.check=function(){next()}}}
   scale(box.querySelector(".lc-a1"),["Nada","Mucho"],function(n){a.i=n;chk()});scale(box.querySelector(".lc-a2"),["Nada","Mucho"],function(n){a.c=n;chk()})},
  resumen:function(t,box){var A=(S.auto||{})[L.id]||{},I=(S.int||{})[L.id]||{},cn={yes:0,mid:0,no:0};for(var k in I)cn[I[k]]++;
   var rows=CAT.est.unidades.slice(0,5).map(function(u,ui){var a=A[ui];return '<div class="lc-sr"><span>'+h(u.titulo)+'</span>'+(a?'<div class="lc-sb"><i style="--v:'+a.i/5+'"></i><i class="c" style="--v:'+a.c/5+'"></i></div>':'<em>Sin respuesta</em>')+'</div>'}).join("");
   box.innerHTML='<p class="lc-q">Esto contestaste al cerrar cada unidad.</p><div class="lc-sum">'+rows+'<div class="lc-sk"><span><i></i>Interés</span><span><i class="c"></i>Qué tan capaz te sentiste</span></div></div><p class="lc-q">Y al terminar cada lección:</p><div class="lc-cnt"><span><b class="num">'+cn.yes+'</b> «sí me veo»</span><span><b class="num">'+cn.mid+'</b> «no sé»</span><span><b class="num">'+cn.no+'</b> «no»</span></div>';done()},
  comparar:function(t,box){var cs=MC().filter(function(c){return progOf(c.id).done>0||c.id===L.id});
   var rows=cs.map(function(c){var A=(S.auto||{})[c.id]||{},n=0,si=0,sc=0;for(var k in A){n++;si+=A[k].i;sc+=A[k].c}var pg=progOf(c.id);
    return '<tr'+(c.id===L.id?' class="me"':'')+'><th>'+h(c.short||c.name)+'</th><td>'+pg.done+' de '+pg.total+'</td><td>'+(n?(si/n).toFixed(1):"—")+'</td><td>'+(n?(sc/n).toFixed(1):"—")+'</td></tr>'}).join("");
   box.innerHTML='<p class="lc-q">Así van las carreras que has explorado.</p><div class="lc-tblw"><table class="lc-tbl"><thead><tr><th></th><th>Lecciones</th><th>Interés</th><th>Capacidad</th></tr></thead><tbody>'+rows+'</tbody></table></div><p class="lc-note">Interés y capacidad van de 1 a 5 y salen de tus propias respuestas. '+(cs.length<2?'Cuando explores otra carrera, aquí podrás compararlas.':'')+'</p>';done()},
  veredicto:function(t,box){var id=L.id,c=byId[id],v=S.rate[id]!=null?S.rate[id]:5,ver=(S.ver||{})[id]||null;
   box.innerHTML='<p class="lc-big">¿Qué decides sobre '+h(c.name)+'?</p>'+rateW(id,v)+'<div class="lc-ver"><button type="button" data-k="si">La guardo</button><button type="button" data-k="duda">Sigo en duda</button><button type="button" data-k="no">La descarto</button></div><p class="lc-note">Puedes cambiarlo cuando quieras.</p>';
   bindRate(box,null,false);main("Guardar",!!ver);
   each(box.querySelectorAll(".lc-ver button"),function(b){b.classList.toggle("on",b.getAttribute("data-k")===ver);b.onclick=function(){ver=b.getAttribute("data-k");each(box.querySelectorAll(".lc-ver button"),function(x){x.classList.toggle("on",x===b)});main("Guardar",true)}});
   L.check=function(){S.rate[id]=+box.querySelector("input[type=range]").value;S.ver=S.ver||{};S.ver[id]=ver;save();next()}},

  /* ---------- las seis dinámicas nuevas ---------- */
  armar:function(t,box){var sel=0,slots=[];for(var i=0;i<t.ranuras;i++)slots.push(-1);var tries=0;
   box.innerHTML='<p class="lc-q">'+h(t.pregunta)+'</p><div class="lc-arm"><div class="lc-armp">'+t.piezas.map(function(p,i){return '<button type="button" data-p="'+i+'"><b>'+h(p.texto)+'</b><small>Cuesta '+p.costo+' · aguanta '+p.fuerza+'</small></button>'}).join("")+'</div><div class="lc-arms">'+slots.map(function(_,i){return '<button type="button" data-s="'+i+'" aria-label="Tramo '+(i+1)+'"></button>'}).join("")+'</div><div class="lc-met"><span>Aguanta</span><div><i id="lcM1"></i></div><b id="lcT1"></b></div><div class="lc-met"><span>Costo</span><div><i id="lcM2"></i></div><b id="lcT2"></b></div></div>';
   function tot(k){return slots.reduce(function(s,v){return s+(v<0?0:t.piezas[v][k])},0)}
   function paint(){each(box.querySelectorAll("[data-p]"),function(b){b.classList.toggle("on",+b.getAttribute("data-p")===sel)});
    each(box.querySelectorAll("[data-s]"),function(b){var v=slots[+b.getAttribute("data-s")];b.textContent=v<0?"":t.piezas[v].texto;b.className=v<0?"":"k"+v});
    var f=tot("fuerza"),c=tot("costo");box.querySelector("#lcM1").style.width=Math.min(100,f/t.carga*100)+"%";box.querySelector("#lcT1").textContent=f+" de "+t.carga;
    var m2=box.querySelector("#lcM2");m2.style.width=Math.min(100,c/t.presupuesto*100)+"%";m2.classList.toggle("over",c>t.presupuesto);box.querySelector("#lcT2").textContent=c+" de "+t.presupuesto;
    main("Probar",slots.every(function(v){return v>=0}))}
   each(box.querySelectorAll("[data-p]"),function(b){b.onclick=function(){if(L.phase)return;sel=+b.getAttribute("data-p");paint()}});
   each(box.querySelectorAll("[data-s]"),function(b){b.onclick=function(){if(L.phase)return;var i=+b.getAttribute("data-s");slots[i]=slots[i]===sel?-1:sel;paint()}});paint();
   L.check=function(){var f=tot("fuerza"),c=tot("costo"),ok=f>=t.carga&&c<=t.presupuesto;tries++;
    if(ok){fb("ok",h(t.revelacion));done();return}
    var why=f<t.carga?"No aguanta la carga: le faltan "+(t.carga-f)+".":"Aguanta, pero te pasaste del presupuesto por "+(c-t.presupuesto)+".";
    if(tries>=3){fb("no",why+" "+h(t.revelacion));done()}else fb("no",why+" Cambia alguna pieza y prueba otra vez.")}},
  bloques:function(t,box){var step=0,pick=-1;
   box.innerHTML='<p class="lc-q">'+h(t.pregunta)+'</p><div class="lc-blk">'+t.bloques.map(function(b,i){return '<button type="button" data-b="'+i+'"><i>'+(i+1)+'</i>'+h(b)+'</button>'}).join("")+'</div><div class="lc-in"></div>';
   main("Comprobar",false);
   each(box.querySelectorAll("[data-b]"),function(b){b.onclick=function(){if(L.phase||step)return;var i=+b.getAttribute("data-b");
    if(i!==t.falla){restart(b,"shake");fb("no","Ese bloque está bien. Sigue el programa paso a paso y fíjate dónde empieza a desviarse.");return}
    step=1;b.classList.add("bad");var f=L.el.querySelector(".lc-fb");f.className="lc-fb";
    box.querySelector(".lc-in").innerHTML='<p class="lc-q">Ese es. ¿Por cuál lo cambias?</p><div class="lc-in2"></div>';
    opts(box.querySelector(".lc-in2"),t.opciones,function(k){pick=k;main("Comprobar",true)})}});
   L.check=function(){var ok=pick===t.correcta;each(box.querySelectorAll(".lc-opt"),function(b){var i=+b.getAttribute("data-i");if(i===t.correcta)b.classList.add("good");else if(i===pick)b.classList.add("bad")});
    if(ok){var bl=box.querySelector('[data-b="'+t.falla+'"]');bl.classList.remove("bad");bl.classList.add("good");bl.lastChild.textContent=t.opciones[t.correcta]}
    fb(ok?"ok":"no",h(t.revelacion));done()}},
  patron:function(t,box){var pick=-1,mx=Math.max.apply(null,t.serie.concat(t.opciones));
   box.innerHTML='<p class="lc-q">'+h(t.pregunta)+'</p><div class="lc-pat">'+t.serie.map(function(v,i){return '<div><b>'+v+'</b><i style="height:'+Math.max(6,v/mx*100)+'%"></i><span>'+h((t.etiquetas||[])[i]||"")+'</span></div>'}).join("")+'<div class="q"><b id="lcPv">?</b><i id="lcPb" style="height:6%"></i><span>'+h((t.etiquetas||[])[t.serie.length]||"")+'</span></div></div><div class="lc-in"></div>';
   opts(box.querySelector(".lc-in"),t.opciones.map(String),function(i){pick=i;box.querySelector("#lcPv").textContent=t.opciones[i];box.querySelector("#lcPb").style.height=Math.max(6,t.opciones[i]/mx*100)+"%";main("Comprobar",true)},"is-row");
   main("Comprobar",false);
   L.check=function(){var ok=pick===t.correcta;each(box.querySelectorAll(".lc-opt"),function(b){var i=+b.getAttribute("data-i");if(i===t.correcta)b.classList.add("good");else if(i===pick)b.classList.add("bad")});
    box.querySelector("#lcPv").textContent=t.opciones[t.correcta];box.querySelector("#lcPb").style.height=Math.max(6,t.opciones[t.correcta]/mx*100)+"%";fb(ok?"ok":"no",h(t.revelacion));done()}},
  presupuesto:function(t,box){var on={};
   box.innerHTML='<p class="lc-q">'+h(t.pregunta)+'</p><div class="lc-met"><span>Gastado</span><div><i id="lcM1"></i></div><b id="lcT1"></b></div><div class="lc-bud">'+t.partidas.map(function(p,i){return '<button type="button" role="checkbox" aria-checked="false" data-i="'+i+'"><span>'+h(p.texto)+'</span><b>'+p.costo+'</b></button>'}).join("")+'</div>';
   function sum(){var s=0;for(var k in on)if(on[k])s+=t.partidas[k].costo;return s}
   function paint(){var s=sum();box.querySelector("#lcM1").style.width=(s/t.limite*100)+"%";box.querySelector("#lcT1").textContent=s+" de "+t.limite;each(box.querySelectorAll(".lc-bud button"),function(b){b.setAttribute("aria-checked",on[b.getAttribute("data-i")]?"true":"false")});main("Listo",s>0)}
   each(box.querySelectorAll(".lc-bud button"),function(b){b.onclick=function(){if(L.phase)return;var i=b.getAttribute("data-i");if(!on[i]&&sum()+t.partidas[i].costo>t.limite){restart(b,"shake");fb("info","No te alcanza. Para agregar eso tienes que quitar otra cosa.");return}on[i]=!on[i];L.el.querySelector(".lc-fb").className="lc-fb";paint()}});paint();
   L.check=function(){var by={},top=null;for(var k in on)if(on[k]){var c=t.partidas[k].clase;by[c]=(by[c]||0)+t.partidas[k].costo}for(var c2 in by)if(!top||by[c2]>by[top])top=c2;
    var left=t.partidas.filter(function(p,i){return !on[i]}).map(function(p){return p.texto.toLowerCase()});
    fb("info",'<b>Le apostaste más a: '+h(top)+'.</b> '+(left.length?'Dejaste fuera: '+h(left.join(", "))+'. ':'')+h(t.revelacion));done()}},
  encuadre:function(t,box){var pick=-1,sc=sceneSVG();
   box.innerHTML='<p class="lc-q">'+h(t.pregunta)+'</p><div class="lc-enc" role="radiogroup">'+t.opciones.map(function(o,i){return '<button type="button" role="radio" aria-checked="false" data-i="'+i+'"><svg viewBox="'+o.vista+'" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'+sc+'</svg><span>'+h(o.texto)+'</span></button>'}).join("")+'</div>';
   main("Comprobar",false);
   each(box.querySelectorAll(".lc-enc button"),function(b){b.onclick=function(){if(L.phase)return;pick=+b.getAttribute("data-i");each(box.querySelectorAll(".lc-enc button"),function(x){x.setAttribute("aria-checked",x===b?"true":"false")});main("Comprobar",true)}});
   L.check=function(){var ok=pick===t.mejor;each(box.querySelectorAll(".lc-enc button"),function(b){var i=+b.getAttribute("data-i");if(i===t.mejor)b.classList.add("good");else if(i===pick)b.classList.add("bad")});
    fb(ok?"ok":"no",h(t.opciones[pick].efecto)+" "+h(t.revelacion));done()}},
  componer:function(t,box){var sel=-1,at={},tries=0,n=t.filas*t.columnas;/* at[zona]=elemento */
   box.innerHTML='<p class="lc-q">'+h(t.pregunta)+'</p><p class="lc-note">Toca un elemento y luego su lugar.</p><div class="lc-cmp"><div class="lc-cmpe">'+t.elementos.map(function(e,i){return '<button type="button" data-e="'+i+'">'+h(e)+'</button>'}).join("")+'</div><div class="lc-cmpg" style="grid-template-columns:repeat('+t.columnas+',1fr)">'+Array.apply(null,{length:n}).map(function(_,z){return '<button type="button" data-z="'+z+'" aria-label="Lugar '+(z+1)+'"></button>'}).join("")+'</div></div><ul class="lc-rules"></ul>';
   function placed(e){for(var z in at)if(at[z]===e)return +z;return -1}
   function paint(){each(box.querySelectorAll("[data-e]"),function(b){var e=+b.getAttribute("data-e");b.classList.toggle("on",sel===e);b.classList.toggle("used",placed(e)>=0)});
    each(box.querySelectorAll("[data-z]"),function(b){var z=b.getAttribute("data-z");b.textContent=at[z]!=null?t.elementos[at[z]]:"";b.classList.toggle("has",at[z]!=null)});
    main("Comprobar",Object.keys(at).length===t.elementos.length)}
   each(box.querySelectorAll("[data-e]"),function(b){b.onclick=function(){if(L.phase)return;var e=+b.getAttribute("data-e"),z=placed(e);if(z>=0)delete at[z];sel=sel===e?-1:e;paint()}});
   each(box.querySelectorAll("[data-z]"),function(b){b.onclick=function(){if(L.phase)return;var z=b.getAttribute("data-z");if(sel<0){if(at[z]!=null){sel=at[z];delete at[z]}paint();return}var o=placed(sel);if(o>=0)delete at[o];at[z]=sel;sel=-1;paint()}});paint();
   L.check=function(){tries++;var ok=0,ul=box.querySelector(".lc-rules");ul.innerHTML=t.reglas.map(function(r){var g=r.zonas.indexOf(placed(r.elemento))>=0;if(g)ok++;return '<li class="'+(g?"good":"bad")+'">'+ico(g?"check":"x")+h(r.texto)+'</li>'}).join("");
    if(ok===t.reglas.length||tries>=2){fb(ok===t.reglas.length?"ok":"info",h(t.revelacion));done()}else fb("no","Cumples "+ok+" de "+t.reglas.length+" reglas. Mueve lo que falta y comprueba otra vez.")}}
 };
 /* escena fija para «encuadre»: Rumbo solo en una isla, con mar y cielo */
 function sceneSVG(){return '<rect width="300" height="200" fill="#8FD0EE"/><rect y="118" width="300" height="82" fill="#2E9BD6"/><circle cx="244" cy="38" r="17" fill="#FFE9A8"/><path d="M0 118c40-26 76-30 118-12s84 20 182-6v18H0Z" fill="#6FB6C9" opacity=".7"/><ellipse cx="150" cy="150" rx="74" ry="20" fill="#F1DDAE"/><ellipse cx="150" cy="144" rx="52" ry="12" fill="#86BF73"/><path d="M104 144c-2-18-3-30 2-44" stroke="#8A5A34" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M106 100c-12-6-22-4-28 4M106 100c4-12 14-16 24-12M106 100c-10 2-16 10-16 20M106 100c10 0 18 6 22 16" stroke="#3F8F4F" stroke-width="4.5" fill="none" stroke-linecap="round"/><g transform="translate(132 86) scale(.36)">'+RUMBO.svg("U").replace(/^<svg[^>]*>/,'<svg viewBox="0 0 100 100" width="100" height="100" class="rbx-static">').replace(/class="rbx [^"]*"/,'')+'</g><path d="M20 150q6-4 12 0q6-4 12 0M236 168q6-4 12 0q6-4 12 0M52 182q6-4 12 0" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>'}

 function render(){
  var t=L.cards[L.i],box=L.el.querySelector(".lc-card");L.phase=0;L.check=null;L.busy=false;
  L.el.querySelector(".lc-fb").className="lc-fb";
  each(L.el.querySelectorAll(".lc-seg i"),function(s,i){s.className=i<L.i?"d":i===L.i?"c":""});
  L.el.querySelector(".lc-eb").textContent=(t.area?t.area+" · ":"")+(EB[t.tipo]||"");
  box.innerHTML="";box.setAttribute("data-t",t.tipo);
  (R[t.tipo]||R.escena)(t,box);
  var wr=box.querySelector(".rb");if(wr)wireRumbo(wr);
  restart(box,"in");L.el.querySelector(".lc-body").scrollTop=0;
  if(L.ctx.resume){S.lp=S.lp||{};S.lp[L.id+":"+L.les.id]=L.i;save()}
 }
 function next(){
  if(L.i>=L.cards.length-1){finish();return}
  L.i++;render()}
 function finish(){var l=L,el=L.el;if(l.ctx.resume&&S.lp)delete S.lp[l.id+":"+l.les.id];
  el.classList.remove("on");setTimeout(function(){el.remove()},RM()?0:260);L=null;if(l.onDone)l.onDone()}
 function close(){if(!L)return;var el=L.el;el.classList.remove("on");setTimeout(function(){el.remove()},RM()?0:260);var l=L;L=null;if(l.onClose)l.onClose()}
 /* abre una lección. ctx: {unit, unitName, unitEnd, color, resume} */
 function open(id,les,ctx,onDone,onClose){
  ctx=ctx||{};var c=byId[id]||{name:"",color:"#3F7DA6"},cards=ctx.v2?v2Cards(id,les,ctx.v2):les.tarjetas.slice();
  if(ctx.unitEnd)cards.push({tipo:"autoevaluacion"});
  var el=document.createElement("div");el.className="lc";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label",les.titulo);
  var col=ctx.color||c.color;el.style.setProperty("--c",col);el.style.setProperty("--cd",dk(col,.38));el.style.setProperty("--ct",lum(col)>.62?"#14323F":"#FFFFFF");
  el.innerHTML='<header class="lc-top"><button type="button" class="ui-iconbtn" id="lcX" aria-label="Salir de la lección">'+ico("x")+'</button><div class="lc-seg" aria-hidden="true">'+cards.map(function(){return "<i></i>"}).join("")+'</div></header>'+
   '<div class="lc-body"><div class="lc-wrap"><div class="lc-eb"></div><div class="lc-card"></div><div class="lc-fb" aria-live="polite"></div></div></div>'+
   '<footer class="lc-foot"><div class="lc-footin"><button type="button" class="ui-btn is-block" id="lcGo"></button></div></footer>';
  (document.getElementById("plaza").classList.contains("on")?document.getElementById("plaza"):document.body).appendChild(el);
  var start=0;if(ctx.resume&&S.lp&&S.lp[id+":"+les.id]!=null)start=Math.min(cards.length-1,S.lp[id+":"+les.id]);
  L={id:id,les:les,cards:cards,i:start,el:el,onDone:onDone,onClose:onClose,ctx:ctx,phase:0};
  el.querySelector("#lcX").onclick=close;
  el.querySelector("#lcGo").onclick=function(){if(!L||this.disabled)return;if(L.phase||!L.check)next();else L.check()};
  render();requestAnimationFrame(function(){el.classList.add("on")});
 }
 return {open:open,close:close,isOpen:function(){return !!L},types:Object.keys(R)};
})();
/* #din: las seis dinámicas nuevas en una lección de muestra, para probarlas sin entrar a una carrera */
function renderDin(){
 var d=document.createElement("div");d.className="din";d.innerHTML='<h1>Dinámicas nuevas</h1><p>Armar, depurar por bloques, encontrar el patrón, repartir un presupuesto, encuadrar y componer. Son de muestra: el contenido real de cada carrera va en su catálogo.</p><button type="button" class="ui-btn is-block" id="dinGo">Probar las seis</button>';
 document.body.appendChild(d);
 function go(){LEC.open("demo",{id:"demo",titulo:CAT.demo.titulo,tarjetas:CAT.demo.tarjetas},{color:"#3F7DA6"},function(){uiToast("Terminaste las seis dinámicas")})}
 d.querySelector("#dinGo").onclick=go;go();
}
