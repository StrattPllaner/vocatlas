/* ================= Probar: test de intereses, comparador =================
   El test es el O*NET Interest Profiler en español. Sus preguntas, opciones y tabla de calificación llegan en CAT.ip,
   que se llena con datos/onet/cargar.py desde el servicio oficial; aquí no hay ni una pregunta escrita.
   Mientras CAT.ip esté pendiente, la pantalla lo dice y no deja empezar. Lo único propio es la presentación
   (una pregunta por pantalla) y la sugerencia de carreras de Vocatlas (regla en datos/regla-intereses.json). */
var IPA=["realistic","investigative","artistic","social","enterprising","conventional"];
var IPL={realistic:["R","Realista"],investigative:["I","Investigador"],artistic:["A","Artístico"],social:["S","Social"],enterprising:["E","Emprendedor"],conventional:["C","Convencional"]};
var IPK={R:"realistic",I:"investigative",A:"artistic",S:"social",E:"enterprising",C:"conventional"};
function ipReady(v){var d=CAT.ip;return !!(d&&d.estado==="cargado"&&d.versiones&&d.versiones[v||"30"])}
function ipName(a){var d=CAT.ip&&CAT.ip.areas&&CAT.ip.areas[a];return d&&d.titulo?d.titulo:IPL[a][1]}
/* califica igual que el servicio oficial: base más los puntos medidos de cada respuesta */
function ipScore(ver,ans){var V=CAT.ip.versiones[ver],s={};IPA.forEach(function(a){s[a]=V.base[a]||0});
 V.preguntas.forEach(function(q){s[q.area]+=V.puntos[q.index-1][(+ans.charAt(q.index-1))-1]});IPA.forEach(function(a){s[a]=Math.round(s[a])});return s}
function ipMax(ver){var V=CAT.ip.versiones[ver],m=0;IPA.forEach(function(a){var s=V.base[a]||0;V.preguntas.forEach(function(q){if(q.area===a)s+=Math.max.apply(null,V.puntos[q.index-1])});m=Math.max(m,s)});return m||1}
/* carreras de Vocatlas hacia las que apuntan tus intereses. Regla nuestra, no de O*NET: cada carrera tiene el código de intereses
   de su ocupación de referencia; la primera letra pesa 3, la segunda 2 y la tercera 1. */
function ipMatch(sc,mx){var R=CAT.regla,out=[];
 C.forEach(function(c){var r=R.carreras[c.id];if(!r)return;var w=0,s=0,L=r.intereses.split("");
  L.forEach(function(l,i){var k=R.pesos[i]||1;w+=k;s+=k*(sc[IPK[l]]||0)/mx});out.push({id:c.id,m:s/w,L:L})});
 return out.sort(function(a,b){return b.m-a.m})}
function ipCredit(){return '<div class="ip-cred"><p lang="en">This application includes information from the <a href="https://www.onetcenter.org/tools.html" target="_blank" rel="noopener">O*NET Career Exploration Tools</a> by the U.S. Department of Labor, Employment and Training Administration (USDOL/ETA). Used under the <a href="https://www.onetcenter.org/license_tools.html" target="_blank" rel="noopener">O*NET Tools Developer License</a>. O*NET® is a trademark of USDOL/ETA. Vocatlas has modified all or some of this information. USDOL/ETA has not approved, endorsed, or tested these modifications.</p>'+
 '<p>En español: este test usa el Perfil de Intereses de las herramientas O*NET®, del Departamento del Trabajo de Estados Unidos. Ese departamento no revisó ni respalda esta app. <button type="button" class="ip-link" data-a="mod">Modificaciones y avisos (modifications and disclaimers)</button></p></div>'}
function ipMods(){var el=document.createElement("div");el.className="ui-sheet";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label","Modificaciones y avisos");
 el.innerHTML='<h3>Modificaciones y avisos</h3><div class="ip-mods"><p><b>Qué no cambiamos.</b> Las preguntas, las cinco opciones de respuesta y la forma de calificar son las del O*NET® Interest Profiler en español, tal como las entrega el servicio oficial.</p><p><b>Qué sí cambiamos.</b> La presentación: aquí ves una pregunta por pantalla, con el diseño de Vocatlas.</p><p><b>Qué agregamos.</b> La lista de «carreras de Vocatlas hacia las que apuntan tus intereses» es nuestra. Usa una regla sencilla entre los seis tipos de interés y nuestras carreras. No es parte de la herramienta O*NET®, que no la revisó ni la respalda. No mostramos las ocupaciones ni las zonas de trabajo de O*NET®.</p><p><b>Para qué sirve.</b> Mide lo que te gusta hacer, no para qué eres bueno. Es una brújula para explorar, no un veredicto. Es gratis.</p><p><a href="https://www.onetcenter.org/IP.html" target="_blank" rel="noopener">Qué es el O*NET® Interest Profiler</a> · <a href="https://www.onetcenter.org/license_tools.html" target="_blank" rel="noopener">Licencia</a></p></div><button type="button" class="ui-btn is-block is-sec">Cerrar</button>';
 var close=uiLayer(el,true);el.querySelector(".ui-btn").onclick=close}
function ipBindCred(root){each(root.querySelectorAll('[data-a="mod"]'),function(b){b.onclick=ipMods})}
function ipDate(t){try{return new Date(t).toLocaleDateString("es-MX",{day:"numeric",month:"long",year:"numeric"})}catch(e){return ""}}

/* pantalla de inicio del test */
function openIP(){if(!ipReady("30")&&!ipReady("60")){ipsfRun();return}
 var ok30=ipReady("30"),ok60=ipReady("60"),hist=S.ip||[],dr=S.ipd,ver=dr&&ipReady(dr.v)?dr.v:"30";
 var h='<div class="ip-hero">'+rumboEl()+'<div><h3>¿Qué te gusta hacer?</h3><p>Contestas qué tanto te gustaría hacer distintas actividades. Al final ves tus seis tipos de interés y hacia qué carreras de Vocatlas apuntan.</p></div></div>';
 if(!ok30&&!ok60)h+='<div class="ip-wait"><b>El test está construido, pero todavía no tiene cargadas las preguntas oficiales.</b><p>Usamos las preguntas exactas del O*NET® Interest Profiler en español y no vamos a inventar ni traducir ninguna. En cuanto se carguen desde el servicio oficial, aquí podrás empezar.</p></div>';
 else h+='<div class="ui-seg ip-ver" role="radiogroup" aria-label="Versión del test">'+(ok30?'<button type="button" role="radio" data-v="30" aria-checked="'+(ver==="30")+'">Rápida · 30</button>':'')+(ok60?'<button type="button" role="radio" data-v="60" aria-checked="'+(ver==="60")+'">Completa · 60</button>':'')+'</div>'+
  '<ul class="ip-tips"><li>No hay respuestas buenas ni malas.</li><li>Piensa si te gustaría hacerlo, no si sabes hacerlo ni cuánto se gana.</li><li>Es gratis y tus respuestas se quedan en este dispositivo.</li></ul>'+
  '<button type="button" class="ui-btn is-block" id="ipGo">'+(dr&&dr.a?"Seguir donde me quedé":"Empezar")+'</button>'+(dr&&dr.a?'<button type="button" class="ui-btn is-block is-ghost" id="ipNew">Empezar de nuevo</button>':'');
 if(hist.length)h+='<h3 class="ip-h">Tus resultados anteriores</h3><div class="ip-hist">'+hist.slice().reverse().map(function(e,i){var top=IPA.slice().sort(function(a,b){return e.s[b]-e.s[a]}).slice(0,3).map(function(a){return ipName(a)}).join(", ");
   return '<button type="button" class="ip-hi" data-h="'+(hist.length-1-i)+'"><b>'+ipDate(e.t)+'</b><span>'+e.v+' preguntas · '+esc(top)+'</span>'+ico("next")+'</button>'}).join("")+'</div>';
 h+=ipCredit();
 var el=atSub("Test de intereses",h,"is-ip");wireRumbo(el.querySelector(".rb"));ipBindCred(el);
 each(el.querySelectorAll(".ip-ver button"),function(b){b.onclick=function(){ver=b.getAttribute("data-v");each(el.querySelectorAll(".ip-ver button"),function(x){x.setAttribute("aria-checked",x===b?"true":"false")});if(S.ipd&&S.ipd.v!==ver){var g=el.querySelector("#ipGo");if(g)g.textContent="Empezar"}}});
 var go=el.querySelector("#ipGo");if(go)go.onclick=function(){if(S.ipd&&S.ipd.v!==ver)S.ipd=null;el.querySelector(".ui-iconbtn").click();setTimeout(function(){ipRun(ver)},RM()?0:200)};
 var nw=el.querySelector("#ipNew");if(nw)nw.onclick=function(){S.ipd=null;save();el.querySelector(".ui-iconbtn").click();setTimeout(function(){ipRun(ver)},RM()?0:200)};
 each(el.querySelectorAll(".ip-hi"),function(b){b.onclick=function(){ipResult(S.ip[+b.getAttribute("data-h")],true)}});
}
/* una pregunta por pantalla; el texto y las opciones son los del banco oficial */
function ipRun(ver){
 var V=CAT.ip.versiones[ver],n=V.preguntas.length,d=S.ipd&&S.ipd.v===ver?S.ipd:{v:ver,a:""},i=Math.min(d.a.length,n-1);
 var el=document.createElement("div");el.className="lc ip-run";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label","Test de intereses");
 el.style.setProperty("--c","#3F7DA6");el.style.setProperty("--cd","#2A5878");el.style.setProperty("--ct","#FFFFFF");
 el.innerHTML='<header class="lc-top"><button type="button" class="ui-iconbtn" id="ipX" aria-label="Salir del test">'+ico("x")+'</button><div class="ip-bar" role="progressbar" aria-valuemin="0" aria-valuemax="'+n+'"><i></i></div><span class="ip-n num"></span></header>'+
  '<div class="lc-body"><div class="lc-wrap"><div class="lc-eb">O*NET® Interest Profiler</div><div class="lc-card"></div></div></div>'+
  '<footer class="lc-foot"><div class="lc-footin ip-foot"><button type="button" class="ui-btn is-sec" id="ipB">Anterior</button><small>Preguntas del O*NET® Interest Profiler</small></div></footer>';
 document.body.appendChild(el);
 function setA(k,v){d.a=d.a.substr(0,k)+v+d.a.substr(k+1)}
 function draw(){var q=V.preguntas[i],cur=d.a.charAt(i);
  el.querySelector(".ip-bar").setAttribute("aria-valuenow",i);el.querySelector(".ip-bar i").style.width=(i/n*100)+"%";el.querySelector(".ip-n").textContent=(i+1)+" / "+n;
  var box=el.querySelector(".lc-card");box.innerHTML='<p class="lc-big ip-q">'+esc(q.text)+'</p><div class="ip-opts" role="radiogroup">'+V.opciones.map(function(o){return '<button type="button" role="radio" aria-checked="'+(cur===String(o.value))+'" data-v="'+o.value+'">'+esc(o.name)+'</button>'}).join("")+'</div>';
  restart(box,"in");el.querySelector("#ipB").disabled=i===0;el.querySelector("#ipB").setAttribute("aria-disabled",i===0?"true":"false");
  each(box.querySelectorAll(".ip-opts button"),function(b){b.onclick=function(){if(el._busy)return;el._busy=true;each(box.querySelectorAll(".ip-opts button"),function(x){x.setAttribute("aria-checked",x===b?"true":"false")});
   if(d.a.length<=i)d.a+=b.getAttribute("data-v");else setA(i,b.getAttribute("data-v"));S.ipd=d;save();if(typeof sfx==="function")sfx("tap");
   setTimeout(function(){el._busy=false;if(i<n-1){i++;draw()}else if(d.a.length>=n)end()},RM()?0:180)}})}
 function end(){var e={t:Date.now(),v:ver,a:d.a,s:ipScore(ver,d.a)};S.ip=(S.ip||[]).concat([e]).slice(-10);S.ipd=null;save();out();ipResult(e,false);if(typeof quizPreview==="function"&&$("#quiz").classList.contains("on"))try{quizPreview()}catch(x){}if(curView==="probar")renderProbar()}
 function out(){el.classList.remove("on");setTimeout(function(){el.remove()},RM()?0:260)}
 el.querySelector("#ipX").onclick=function(){out();if(curView==="probar")renderProbar()};
 el.querySelector("#ipB").onclick=function(){if(i>0){i--;draw()}};
 draw();requestAnimationFrame(function(){el.classList.add("on")});
}
function addToMap(id){if(picked(id))return;var sel=S.pick.concat([id]);S.pick=C.filter(function(c){return sel.indexOf(c.id)>-1}).map(function(c){return c.id});S.pk=1;save();
 if(typeof mapChange==="function")mapChange([id],[]);uiToast(byId[id].name+" ya está en tu mapa")}
/* resultados: los seis tipos y hacia qué carreras apuntan */
function ipResult(e,old){
 var mx=ipMax(e.v),ord=IPA.slice().sort(function(a,b){return e.s[b]-e.s[a]}),top=ord.slice(0,3),M=ipMatch(e.s,mx).slice(0,5),D=CAT.ip.areas||{};
 var h='<p class="ip-when">'+ipDate(e.t)+' · versión de '+e.v+' preguntas</p><div class="ui-card ip-bars">'+ord.map(function(a,k){return '<div class="ip-row'+(k<3?' is-top':'')+'"><span><b>'+IPL[a][0]+'</b>'+esc(ipName(a))+'</span><div><i style="width:'+Math.max(3,e.s[a]/mx*100)+'%"></i></div><em class="num">'+e.s[a]+'</em></div>'}).join("")+'</div>';
 h+='<h3 class="ip-h">Tus tres intereses más altos</h3>'+top.map(function(a){return '<div class="ui-card ip-area"><b>'+esc(ipName(a))+'</b>'+(D[a]&&D[a].descripcion?'<p>'+esc(D[a].descripcion)+'</p>':'')+'</div>'}).join("");
 h+='<h3 class="ip-h">Carreras de Vocatlas hacia las que apuntan</h3><p class="ip-note">Esta parte es de Vocatlas, no de O*NET®. Es una pista para explorar, no una calificación de qué tan compatible eres.</p><div class="ip-cars">'+M.map(function(m){var c=byId[m.id],hit=m.L.filter(function(l){return top.indexOf(IPK[l])>=0}).map(function(l){return ipName(IPK[l])});
  return '<div class="ui-card ip-car"><span class="sw" style="background:'+c.color+'"></span><div><b>'+esc(c.name)+'</b><small>'+(hit.length?'Coincide en: '+esc(hit.join(", ")):'Pide: '+esc(m.L.map(function(l){return ipName(IPK[l])}).join(", ")))+'</small></div>'+(picked(c.id)?'<span class="ip-in">'+ico("check")+'En tu mapa</span>':'<button type="button" class="ui-btn is-md is-sec" data-add="'+c.id+'">Agregar</button>')+'</div>'}).join("")+'</div>';
 h+='<div class="ip-lim"><b>Para leerlo bien</b><ul><li>Mide gusto, no capacidad. Para saber si se te da, prueba las lecciones de la carrera.</li><li>Tus intereses pueden cambiar. Repítelo en unos meses y compara.</li></ul></div>'+ipCredit();
 var el=atSub("Tus intereses",h,"is-ip");ipBindCred(el);
 each(el.querySelectorAll("[data-add]"),function(b){b.onclick=function(){addToMap(b.getAttribute("data-add"));b.outerHTML='<span class="ip-in">'+ico("check")+'En tu mapa</span>'}});
}
/* comparador: dos o tres carreras de tu mapa lado a lado */
function openCompare(){
 var cs=MC(),sel=cs.slice().sort(function(a,b){return progOf(b.id).p-progOf(a.id).p}).slice(0,Math.min(innerWidth<480?2:3,cs.length)).map(function(c){return c.id});
 var ROWS=[["Duración de la carrera","duracion"],["Ingreso mensual promedio (todo México)","ingreso"],["Trabajan en algo de su carrera","ocupacion_afin"]];
 function cell(id,k){var d=(CAT.cif||{})[id+"."+k];return d&&d.estado!=="pendiente"&&d.valor!=null?'<b class="num">'+esc(String(d.valor))+'</b> <small>'+esc(d.unidad||"")+'</small>':'<span class="cmp-p">Pendiente</span>'}
 function mine(id){var A=(S.auto||{})[id]||{},n=0,si=0,sc=0;for(var k in A){n++;si+=A[k].i;sc+=A[k].c}return {i:n?(si/n).toFixed(1):"—",c:n?(sc/n).toFixed(1):"—"}}
 var VER={si:"La guardo",duda:"En duda",no:"La descarto"};
 function body(){var L=sel.map(function(id){return byId[id]});
  var t='<div class="cmp-pick">'+cs.map(function(c){var on=sel.indexOf(c.id)>=0;return '<button type="button" class="ui-chip" aria-pressed="'+on+'" data-id="'+c.id+'" style="--chip:'+c.color+'"><i class="pk-dot"></i>'+esc(c.short||c.name)+'</button>'}).join("")+'</div><p class="ip-note">Elige dos o tres.</p>';
  if(L.length<2)return t+'<div class="ip-wait"><b>Elige al menos dos carreras.</b></div>';
  function row(lab,fn,cls){return '<tr'+(cls?' class="'+cls+'"':'')+'><th scope="row">'+lab+'</th>'+L.map(function(c){return '<td>'+fn(c)+'</td>'}).join("")+'</tr>'}
  t+='<div class="cmp-w"><table class="cmp"><thead><tr><th></th>'+L.map(function(c){return '<th scope="col"><span class="sw" style="background:'+c.color+'"></span>'+esc(c.short||c.name)+'</th>'}).join("")+'</tr></thead><tbody>'+
   '<tr class="cmp-s"><th colspan="'+(L.length+1)+'">Lo tuyo</th></tr>'+
   row("Lecciones hechas",function(c){var p=progOf(c.id);return '<b class="num">'+p.done+'</b> <small>de '+p.total+'</small>'})+
   row("Tu interés (1 a 5)",function(c){return '<b class="num">'+mine(c.id).i+'</b>'})+
   row("Qué tan capaz te sentiste",function(c){return '<b class="num">'+mine(c.id).c+'</b>'})+
   row("¿Cuánto te late? (0 a 10)",function(c){return S.rate[c.id]!=null?'<b class="num">'+S.rate[c.id]+'</b>':"—"})+
   row("Tu veredicto",function(c){return (S.ver||{})[c.id]?VER[S.ver[c.id]]:"—"})+
   '<tr class="cmp-s"><th colspan="'+(L.length+1)+'">Intereses que pide</th></tr>'+
   row("Según su ocupación de referencia",function(c){var r=CAT.regla.carreras[c.id];return r?esc(r.intereses.split("").map(function(l){return IPL[IPK[l]][1]}).join(", ")):"—"})+
   '<tr class="cmp-s"><th colspan="'+(L.length+1)+'">Datos de la carrera</th></tr>'+
   ROWS.map(function(r){return row(r[0],function(c){return cell(c.id,r[1])})}).join("")+'</tbody></table></div>'+
   '<p class="ip-note">«Pendiente» quiere decir que todavía no tenemos ese dato verificado con su fuente. No lo inventamos. Los intereses salen de O*NET OnLine (consultado el '+ipDate(CAT.regla.consultado+"T12:00:00")+').</p>';
  return t}
 var el=atSub("Comparar carreras",'<div id="cmpB">'+body()+'</div>',"is-ip");
 function bind(){each(el.querySelectorAll(".cmp-pick .ui-chip"),function(b){b.onclick=function(){var id=b.getAttribute("data-id"),k=sel.indexOf(id);if(k>=0)sel.splice(k,1);else{if(sel.length>=3)sel.shift();sel.push(id)}el.querySelector("#cmpB").innerHTML=body();bind()}})}
 bind();
}
/* tarjetas de entrada en la pestaña Probar */
function probarTop(){
 var hist=S.ip||[],last=hist[hist.length-1],ready=ipReady("30")||ipReady("60"),n=MC().length;
 var top=last?IPA.slice().sort(function(a,b){return last.s[b]-last.s[a]}).slice(0,3).map(function(a){return ipName(a)}).join(", "):"";
 return '<div class="pb-cards"><button type="button" class="ui-card pb-card" id="pbIP"><span class="pb-ic">'+ico("compass")+'</span><span class="pb-t"><b>Test de intereses</b><small>'+(last?'Tu último resultado: '+esc(top):ready?(S.ipd&&S.ipd.a?'Lo dejaste a la mitad. Síguele.':'Qué tipo de actividades te atraen. 5 a 10 min.'):'Muy pronto: faltan las preguntas oficiales.')+'</small></span>'+ico("next")+'</button></div>'}
function probarBind(v){var a=v.querySelector("#pbIP");if(a)a.onclick=openIP}

/* ================= test de intereses (versión corta de 60 actividades) =================
   Basado en el O*NET® Interest Profiler Short Form (60 actividades; se cuentan las que te gustaría hacer en cada una de las
   seis áreas, de 0 a 10). Traducción al español nuestra; ver ipsfCredit. Usado bajo la O*NET Tools Developer License. */
var IPSF={realistic:["Hacer muebles de cocina","Poner ladrillo o azulejo","Reparar aparatos de la casa","Criar peces en un criadero","Armar piezas electrónicas","Manejar un camión para entregar paquetes en oficinas y casas","Revisar la calidad de piezas antes de enviarlas","Reparar e instalar cerraduras","Preparar y operar máquinas para fabricar productos","Apagar incendios forestales"],
 investigative:["Crear una medicina nueva","Estudiar cómo reducir la contaminación del agua","Hacer experimentos de química","Estudiar el movimiento de los planetas","Examinar muestras de sangre con un microscopio","Investigar la causa de un incendio","Encontrar una forma de predecir mejor el clima","Trabajar en un laboratorio de biología","Inventar un sustituto del azúcar","Hacer pruebas de laboratorio para identificar enfermedades"],
 artistic:["Escribir libros u obras de teatro","Tocar un instrumento musical","Componer o hacer arreglos de música","Dibujar","Crear efectos especiales para películas","Pintar escenografías para obras de teatro","Escribir guiones de cine o televisión","Bailar jazz o tap","Cantar en una banda","Editar películas"],
 social:["Enseñarle a alguien una rutina de ejercicio","Ayudar a personas con problemas personales o emocionales","Dar orientación vocacional","Dar terapia de rehabilitación","Hacer voluntariado en una organización sin fines de lucro","Enseñarles a niños a practicar deportes","Enseñar lengua de señas a personas sordas","Ayudar a dirigir una sesión de terapia en grupo","Cuidar niños en una guardería","Dar clases en una prepa"],
 enterprising:["Comprar y vender acciones y bonos","Administrar una tienda","Tener un salón de belleza o una barbería","Dirigir un departamento en una empresa grande","Empezar tu propio negocio","Negociar contratos de negocios","Representar a un cliente en un juicio","Lanzar al mercado una nueva línea de ropa","Vender mercancía en una tienda departamental","Administrar una tienda de ropa"],
 conventional:["Hacer una hoja de cálculo en la computadora","Revisar registros o formularios para corregir errores","Instalar programas en las computadoras de una red grande","Usar una calculadora","Llevar el registro de envíos y recepciones","Calcular los sueldos de los empleados","Hacer inventario de material con una computadora de mano","Registrar pagos de renta","Llevar registros de inventario","Sellar, ordenar y repartir el correo de una organización"]};
var IPSF_N={realistic:["Hacer con las manos","Te gusta construir, reparar y trabajar con herramientas, máquinas o al aire libre."],investigative:["Investigar","Te gusta descubrir por qué pasan las cosas, experimentar y resolver problemas con ciencia."],
 artistic:["Crear","Te gusta expresarte: escribir, dibujar, actuar, la música, el diseño."],social:["Ayudar","Te gusta enseñar, cuidar, escuchar y trabajar con personas."],
 enterprising:["Emprender","Te gusta convencer, dirigir, vender y tomar decisiones."],conventional:["Organizar","Te gusta el orden: datos, registros, números y procesos claros."]};
function ipsfCredit(){return '<p class="ipsf-cred">Este test usa información de las <a href="https://www.onetcenter.org/tools.html" target="_blank" rel="noopener">O*NET® Career Exploration Tools</a> del Departamento del Trabajo de EE. UU. (USDOL/ETA), usada bajo la <a href="https://www.onetcenter.org/license_tools.html" target="_blank" rel="noopener">O*NET Tools Developer License</a>. O*NET es marca registrada de USDOL/ETA. Vocatlas tradujo y adaptó la presentación; USDOL/ETA no aprobó, respaldó ni probó estas modificaciones.</p>'}
function ipsfItems(){var L=[];IPA.forEach(function(a){IPSF[a].forEach(function(t,i){L.push({a:a,t:t,k:a.charAt(0)+i})})});
 /* se intercalan las áreas para que no salgan diez seguidas del mismo tipo */
 var o=[];for(var i=0;i<10;i++)IPA.forEach(function(a,j){o.push(L[j*10+((i*7+j*3)%10)])});return o}
function ipsfRun(){var Q=ipsfItems(),i=0,ans={},el=document.createElement("div");el.className="ipsf";el.setAttribute("role","dialog");el.setAttribute("aria-modal","true");el.setAttribute("aria-label","Test de intereses");
 el.innerHTML='<div class="ipsf-in"><header><button type="button" class="ipsf-x" aria-label="Cerrar">'+IC.x+'</button><div class="ipsf-bar"><i></i></div><span class="ipsf-n"></span></header><div class="ipsf-body"></div></div>';
 document.body.appendChild(el);void el.offsetWidth;el.classList.add("on");
 var body=el.querySelector(".ipsf-body");
 function close(){el.classList.remove("on");setTimeout(function(){el.remove()},RM()?0:300)}
 el.querySelector(".ipsf-x").onclick=close;
 function intro(){body.innerHTML='<div class="ipsf-intro"><h2>Test de intereses</h2><p>Te vamos a mostrar 60 actividades de trabajo. En cada una dinos si te gustaría hacerla.</p><ul><li>No pienses en cuánto se gana ni en cuánto hay que estudiar.</li><li>No hay respuestas buenas ni malas.</li><li>Son unos 5 minutos.</li></ul><button type="button" class="ui-btn is-block" id="ipsfGo">Empezar</button>'+ipsfCredit()+'</div>';el.querySelector(".ipsf-n").textContent="";body.querySelector("#ipsfGo").onclick=function(){draw()}}
 function draw(){var q=Q[i];el.querySelector(".ipsf-bar i").style.transform="scaleX("+(i/Q.length)+")";el.querySelector(".ipsf-n").textContent=(i+1)+" de "+Q.length;
  body.innerHTML='<div class="ipsf-card"><p class="ipsf-k">¿Te gustaría…</p><p class="ipsf-q">'+esc(q.t)+'?</p></div><div class="ipsf-a"><button type="button" class="ipsf-no" data-v="0">No</button><button type="button" class="ipsf-yes" data-v="1">Sí, me gustaría</button></div>'+(i?'<button type="button" class="ipsf-back">Regresar</button>':'');
  each(body.querySelectorAll(".ipsf-a button"),function(b){b.onclick=function(){ans[q.k]=b.getAttribute("data-v")==="1";b.classList.add("on");setTimeout(function(){i++;if(i<Q.length)draw();else done()},RM()?0:160)}});
  var bk=body.querySelector(".ipsf-back");if(bk)bk.onclick=function(){i--;draw()}}
 function done(){var sc={};IPA.forEach(function(a){sc[a]=0});Q.forEach(function(q){if(ans[q.k])sc[q.a]++});
  var e={t:Date.now(),v:"sf",s:sc};S.ip=(S.ip||[]).concat([e]).slice(-10);save();
  el.querySelector(".ipsf-bar i").style.transform="scaleX(1)";el.querySelector(".ipsf-n").textContent="";
  var top=IPA.slice().sort(function(a,b){return sc[b]-sc[a]}),M=ipMatch(sc,10).slice(0,5);
  body.innerHTML='<div class="ipsf-res"><h2>Tus intereses</h2><p>Tus tres áreas más fuertes:</p><ol class="ipsf-top">'+top.slice(0,3).map(function(a,k){return '<li><span class="ipsf-r">'+(k+1)+'</span><div><b>'+IPSF_N[a][0]+'</b><small>'+IPSF_N[a][1]+'</small><span class="ipsf-sb"><i style="width:'+(sc[a]*10)+'%"></i></span></div><em>'+sc[a]+'/10</em></li>'}).join("")+'</ol>'+
   '<h3>Carreras que van con eso</h3><ul class="ipsf-car">'+M.map(function(m){var c=byId[m.id];return c?'<li><i style="background:'+c.color+'"></i>'+esc(c.name)+'</li>':''}).join("")+'</ul>'+
   '<button type="button" class="ui-btn is-block" id="ipsfMap">Armar mi mapa con esto</button><button type="button" class="ui-btn is-block is-sec" id="ipsfBack">Elegir temas también</button>'+ipsfCredit()+'</div>';
  body.querySelector("#ipsfMap").onclick=function(){close();if(typeof quizPreview==="function")try{updateCount()}catch(x){}var g=$("#go");if(g){g.disabled=false;g.click()}};
  body.querySelector("#ipsfBack").onclick=function(){close();try{updateCount()}catch(x){}}}
 intro()}

/* ---------- Probar: el test al frente y, con tu resultado, carreras que van contigo ---------- */
function ipLastSF(){var h=(S.ip||[]).filter(function(e){return e.v==="sf"});return h[h.length-1]||null}
probarTop=function(){var e=ipLastSF();
 if(!e)return '<button type="button" class="pb2-hero" id="pbIP"><span class="pb2-k">Empieza aquí</span><b>Test de intereses</b><span>60 actividades · 5 minutos. Descubre tus 3 tipos de interés y qué carreras van contigo.</span><i class="pb2-go">Hacer el test</i></button>';
 var top=IPA.slice().sort(function(a,b){return e.s[b]-e.s[a]}).slice(0,3),M=ipMatch(e.s,10).filter(function(m){return byId[m.id]&&!(typeof carSoon==="function"&&carSoon(m.id))}).slice(0,6);
 return '<section class="pb2-res"><div class="pb2-rh"><span class="pb2-k">Tu perfil</span><button type="button" class="pb2-re" id="pbIP">Repetir test</button></div>'+
  '<div class="pb2-tags">'+top.map(function(a,i){return '<span class="pb2-tag" style="--o:'+(1-i*.25)+'">'+IPSF_N[a][0]+'</span>'}).join("")+'</div>'+
  '<p class="pb2-t">Carreras que van con eso</p><ul class="pb2-car">'+M.map(function(m){var c=byId[m.id],on=picked(m.id);return '<li style="--c:'+c.color+'"><i></i><span>'+esc(c.name)+'</span><b>'+Math.round(m.m*100)+'%</b>'+(on?'<em>En tu mapa</em>':'<button type="button" class="pb2-add" data-add="'+c.id+'" aria-label="Agregar '+esc(c.name)+'">+</button>')+'</li>'}).join("")+'</ul></section>'};
probarBind=function(v){var a=v.querySelector("#pbIP");if(a)a.onclick=function(){ipsfRun()};
 each(v.querySelectorAll("[data-add]"),function(b){b.onclick=function(){addToMap(b.getAttribute("data-add"));toast("Agregada a tu mapa");renderProbar()}})};
