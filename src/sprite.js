/* ================= sprites del mapa: edificios y vegetación como imágenes =================
   Dibujar cientos de piezas vectoriales (con recortes, degradados y rayado) cada vez que entra un pedazo nuevo del mapa
   a la pantalla es lo que trababa el mapa, sobre todo en Safari. Así que, después de armar el mapa, cada pieza se dibuja
   una sola vez en un lienzo (canvas) y se cambia por una imagen. Las piezas iguales comparten la misma imagen.
   La versión de noche se hornea en la imagen (más oscura y menos saturada), así el mapa ya no usa filtros en vivo.
   Si algo falla, la pieza se queda como vector: el mapa se ve igual, solo menos fluido. */
var SPR={gen:0,cache:{},q:[],t:0,meas:null};
/* resolución de la imagen: unidades del mapa → pixeles. Nítida hasta un acercamiento normal en pantallas de alta densidad */
function sprRes(){return Math.min(3.2,Math.max(2,(window.devicePixelRatio||1)*1.25))}
var SPR_NIGHT={"sk0":"#7E735F","sk1":"#93876F","sk2":"#A3977E","sk3":"#B3A78D","skl":"#3F3424"};
function sprTheme(str,night){return str.replace(/var\(--(sk\d|skl),\s*(#[0-9A-Fa-f]{6})\)/g,function(m,k,fb){return night&&SPR_NIGHT[k]?SPR_NIGHT[k]:fb})}
/* caja de una pieza, medida fuera de pantalla (las piezas ocultas no se pueden medir en su lugar) */
function sprBox(art){
 if(!SPR.meas){var d=document.createElementNS(NS,"svg");d.setAttribute("width","10");d.setAttribute("height","10");d.setAttribute("aria-hidden","true");d.style.cssText="position:absolute;left:-9999px;top:0;visibility:hidden;overflow:hidden";d.innerHTML="<defs>"+ENV.DEFS+"</defs><g></g>";document.body.appendChild(d);SPR.meas=d}
 var g=SPR.meas.lastChild;g.innerHTML=art;var b;try{b=g.getBBox()}catch(e){b=null}g.innerHTML="";
 if(!b||!b.width||!b.height)return null;return [Math.floor(b.x-3),Math.floor(b.y-3),Math.ceil(b.width+6),Math.ceil(b.height+6)]}
/* noche: oscurecer y bajar saturación, igual que el filtro que había (brightness .72, saturate .85) */
function sprNight(ctx,w,h){var im=ctx.getImageData(0,0,w,h),d=im.data;for(var i=0;i<d.length;i+=4){if(!d[i+3])continue;var r=d[i],g=d[i+1],b=d[i+2],l=.2126*r+.7152*g+.0722*b;
 d[i]=(l+(r-l)*.85)*.72;d[i+1]=(l+(g-l)*.85)*.72;d[i+2]=(l+(b-l)*.85)*.72}ctx.putImageData(im,0,0)}
/* las imágenes horneadas se guardan en el teléfono (Cache Storage): la siguiente vez que abres la app no se vuelven a dibujar */
var SPRC={p:null};
function sprCache(){if(SPRC.p)return SPRC.p;SPRC.p=(window.caches&&window.isSecureContext)?caches.open("vocatlas-spr-1").catch(function(){return null}):Promise.resolve(null);return SPRC.p}
/* las imágenes se dibujan de una en una, con una pausa entre cada una: así el arranque no se traba */
var SQ=[],SQB=false;
/* mientras tocas, arrastras, deslizas o hay otra pestaña al frente, el horneado espera: no compite con lo que haces */
var SQIN=0;["pointerdown","pointermove","wheel","touchmove","keydown"].forEach(function(e){addEventListener(e,function(){SQIN=performance.now()},{passive:true,capture:true})});addEventListener("scroll",function(){SQIN=performance.now()},{passive:true,capture:true});
function sNext(){if(!SQ.length){SQB=false;return}SQB=true;if(performance.now()-SQIN<700||window.__top||window.__view){setTimeout(sNext,350);return}var f=SQ.shift();f(function(){if(window.requestIdleCallback)requestIdleCallback(sNext,{timeout:120});else setTimeout(sNext,24)})}
function sQueue(f){SQ.push(f);if(!SQB)sNext()}
function sprMake(art,night,cb){
 var key=(night?"n":"d")+art;if(SPR.cache[key]){cb(SPR.cache[key]);return}
 var bx=sprBox(art);if(!bx){cb(null);return}
 var R=sprRes(),W=Math.max(1,Math.round(bx[2]*R)),H=Math.max(1,Math.round(bx[3]*R));
 var ck="/spr/"+hash(key).toString(36)+"-"+key.length.toString(36)+"-"+W+"x"+H;
 function keep(bl){var u=URL.createObjectURL(bl),o={u:u,b:bx};SPR.cache[key]=o;cb(o)}
 function draw(c){sQueue(function(next){draw1(c,next)})}
 function draw1(c,next){var fired=false,nx=function(){if(!fired){fired=true;next()}};
  var svg='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="'+W+'" height="'+H+'" viewBox="'+bx.join(" ")+'"><defs>'+ENV.DEFS+ISO.skDefs()+'</defs>'+sprTheme(art,night)+'</svg>';
  var img=new Image(),url=URL.createObjectURL(new Blob([sprTheme(svg,night)],{type:"image/svg+xml"}));
  img.onload=function(){URL.revokeObjectURL(url);try{
    var cv=document.createElement("canvas");cv.width=W;cv.height=H;var x=cv.getContext("2d");x.drawImage(img,0,0,W,H);if(night)sprNight(x,W,H);
    cv.toBlob(function(bl){nx();if(!bl){cb(null);return}keep(bl);if(c)try{c.put(ck,new Response(bl,{headers:{"Content-Type":"image/png"}})).catch(function(){})}catch(e){}},"image/png")}catch(e){nx();cb(null)}};
  img.onerror=function(){URL.revokeObjectURL(url);nx();cb(null)};
  img.src=url;
 }
 sprCache().then(function(c){if(!c){draw(null);return}
  c.match(ck).then(function(r){if(r)r.blob().then(keep,function(){draw(c)});else draw(c)},function(){draw(c)})},function(){draw(null)});
}
function sprImg(o){return '<image href="'+o.u+'" x="'+o.b[0]+'" y="'+o.b[1]+'" width="'+o.b[2]+'" height="'+o.b[3]+'" preserveAspectRatio="none"/>'}
/* cola: edificios (su <use> apunta a la definición) y vegetación (su dibujo va dentro del grupo) */
function sprStart(){
 if(typeof ENV==="undefined"||!window.URL||!window.Blob)return;
 /* de noche las islas conservan sus colores: ya no se hornea una versión oscura */
 var g=++SPR.gen,night=false,q=[],w=$("#world");if(!w)return;
 each(w.querySelectorAll(".m-objs .poi .pp>use"),function(u){var ref=document.getElementById((u.getAttribute("href")||"").slice(1));if(ref)q.push({el:u,art:ref.innerHTML,pp:true})});
 each(w.querySelectorAll(".m-objs .m-d>.vco>g,.m-objs .m-d>.vbz>g"),function(e){q.push({el:e,art:e.innerHTML})});
 each(w.querySelectorAll(".m-objs .m-gh"),function(e){q.push({el:e,art:e.innerHTML})});

 SPR.q=q;var done=0,n=q.length,ready=[];
 /* todas las piezas se cambian juntas al final: un solo redibujado en vez de cientos */
 function swap(){ready.forEach(function(it){if(!it.el.isConnected)return;var o=it.o;
  if(it.pp){var im=document.createElementNS(NS,"g");im.innerHTML=sprImg(o);it.el.parentNode.replaceChild(im.firstChild,it.el)}else{it.el.innerHTML=sprImg(o);if(it.edge)it.el.classList.add("sp")}});ready=[]}
 function step(){
  if(g!==SPR.gen)return;var t0=performance.now();
  while(SPR.q.length&&performance.now()-t0<10){var it=SPR.q.shift();(function(it){sprMake(it.art,night,function(o){if(g!==SPR.gen||!o){fin();return}it.o=o;ready.push(it);fin()})})(it)}
  if(SPR.q.length)setTimeout(step,16);
 }
 function fin(){done++;if(done===n&&g===SPR.gen){swap();w.classList.add("spr-ok");occKey="";
  /* luego, con calma, las ilustraciones de las otras pestañas */
  setTimeout(function(){if(typeof artDefs==="function")artDefs()},400)}}
 if(!n)return;setTimeout(step,RM()?60:400);
}
/* nubes de la orilla: racimos de bolas suaves del mismo tono que la neblina, sin base plana ni contorno,
   con el borde difuminado (el desenfoque solo cuesta al hornearlas una vez). Pocas variantes que se reusan. */
var EDGEART={};
function edgeArts(night){
 var C=night?{b:"#3A5674",h:"#48647F",s:"#34506D"}:{b:"#E6EFF6",h:"#FFFFFF",s:"#D5E2EC"},r=rng(hash("orilla2"));EDGEART={};
 for(var v=0;v<6;v++){var n=5+Math.floor(r()*3),balls=[];
  for(var i=0;i<n;i++){var t=i/(n-1),x=(t-.5)*220+(r()-.5)*24,R=34+r()*26+Math.sin(t*Math.PI)*22;balls.push([x,(r()-.5)*16-Math.sin(t*Math.PI)*20,R])}
  /* bolas de abajo: redondean la base para que no quede plana */
  for(var j=0;j<3;j++)balls.push([(r()-.5)*150,26+r()*12,30+r()*14]);
  var c=function(dx,dy,k,f,op){return balls.map(function(b){return '<circle cx="'+(b[0]+dx).toFixed(0)+'" cy="'+(b[1]+dy).toFixed(0)+'" r="'+(b[2]*k).toFixed(0)+'"/>'}).join("").replace(/<circle/g,'<circle fill="'+f+'"'+(op?' fill-opacity="'+op+'"':''))};
  EDGEART["e"+v]='<rect x="-190" y="-130" width="380" height="230" fill="none"/><filter id="eblur" x="-30%" y="-40%" width="160%" height="180%"><feGaussianBlur stdDeviation="11"/></filter>'+
   '<g filter="url(#eblur)">'+c(8,14,1,C.s)+c(0,0,1,C.b)+c(-8,-14,.62,C.h,.4)+'</g>'}
}
/* tiras de nubes para la neblina: se hornean las variantes y se acomodan en un lienzo que se repite a lo largo de cada orilla.
   Hay una tira horizontal (arriba y abajo) y una vertical (a los lados) */
function edgeStrips(night){
 var cw=$("#cwall");if(!cw||!window.URL)return;edgeArts(night);cw.classList.remove("ok");var g=++SPR.egen||(SPR.egen=1),ks=Object.keys(EDGEART),got={},left=ks.length;
 ks.forEach(function(k){sprMake(EDGEART[k],false,function(o){got[k]=o;if(--left===0&&g===SPR.egen)compose()})});
 function load(o,cb){var im=new Image();im.onload=function(){cb(im)};im.onerror=function(){cb(null)};im.src=o.u}
 function compose(){var ims={},n=ks.length;ks.forEach(function(k){if(!got[k]){if(--n===0)draw(ims);return}load(got[k],function(im){ims[k]=im;if(--n===0)draw(ims)})})}
 function draw(ims){if(g!==SPR.egen)return;var r=rng(hash("tira"+(night?1:0))),D=2,list=ks.filter(function(k){return ims[k]});if(!list.length)return;
  /* u: unidades de la nube (380 de ancho) a pixeles de pantalla */
  var vm=Math.min(window.innerWidth,window.innerHeight),u=Math.max(.42,Math.min(.75,vm/1200));
  function strip(W,H,horiz){var c=document.createElement("canvas");c.width=W*D;c.height=H*D;var x=c.getContext("2d");x.scale(D,D);
   function put(along,across,k){var im=ims[list[Math.floor(r()*list.length)]],sc=k*u,bw=im.width/sprRes(),bh=im.height/sprRes();
    /* cada nube se dibuja también desplazada un largo de tira para que la repetición no tenga corte */
    [0,horiz?W:H,horiz?-W:-H].forEach(function(sh){var cx=horiz?along+sh:across,cy=horiz?across:along+sh;x.drawImage(im,cx-bw*sc/2,cy-bh*sc/2,bw*sc,bh*sc)})}
   var L=horiz?W:H,T=horiz?H:W;
   /* de afuera hacia adentro: nubes grandes en la neblina, luego medianas, y al final las que asoman sobre el mar */
   for(var a=0;a<L;a+=230*u)put(a+(r()-.5)*70*u,T*.34+(r()-.5)*50*u,1.35+r()*.35);
   for(a=110*u;a<L;a+=270*u)if(r()<.7)put(a+(r()-.5)*80*u,T*.6+(r()-.5)*30*u,.95+r()*.3);
   return c}
  var Lh=Math.round(1800*u),T=Math.round(560*u);
  var h=strip(Lh,T,true),v=strip(T,Lh,false);
  var urls=[];function blob(c,cb){c.toBlob(function(bl){if(!bl){cb(null);return}var u2=URL.createObjectURL(bl);urls.push(u2);cb(u2)},"image/png")}
  blob(h,function(uh){blob(strip2(Lh,T),function(ub){blob(v,function(uv){blob(strip3(T,Lh),function(ur){if(g!==SPR.egen)return;
   (SPR.eurls||[]).forEach(function(x){try{URL.revokeObjectURL(x)}catch(e){}});SPR.eurls=urls;
   cw.style.setProperty("--cwh",'url("'+uh+'")');cw.style.setProperty("--cwb",'url("'+ub+'")');cw.style.setProperty("--cwv",'url("'+uv+'")');cw.style.setProperty("--cwr",'url("'+ur+'")');
   cw.style.setProperty("--csh",T+"px");cw.style.setProperty("--csw",T+"px");cw.style.setProperty("--cin",Math.round(T*.06)+"px");cw.style.setProperty("--fo",Math.round(T*.3)+"px");/* la neblina empieza debajo de las nubes: su orilla recta nunca se ve sobre el mar */
   requestAnimationFrame(function(){cw.classList.add("ok")})})})})});
  /* tiras con las nubes chicas del otro lado (abajo y a la derecha) */
  function strip2(W,H){r=rng(hash("tira2"+(night?1:0)));var c=document.createElement("canvas");c.width=W*D;c.height=H*D;var x=c.getContext("2d");x.scale(D,D);
   function put(along,across,k){var im=ims[list[Math.floor(r()*list.length)]],sc=k*u,bw=im.width/sprRes(),bh=im.height/sprRes();[0,W,-W].forEach(function(sh){x.drawImage(im,along+sh-bw*sc/2,across-bh*sc/2,bw*sc,bh*sc)})}
   for(var a=0;a<W;a+=230*u)put(a+(r()-.5)*70*u,H*.66+(r()-.5)*50*u,1.35+r()*.35);
   for(a=110*u;a<W;a+=270*u)if(r()<.7)put(a+(r()-.5)*80*u,H*.4+(r()-.5)*30*u,.95+r()*.3);
   return c}
  function strip3(W,H){r=rng(hash("tira3"+(night?1:0)));var c=document.createElement("canvas");c.width=W*D;c.height=H*D;var x=c.getContext("2d");x.scale(D,D);
   function put(along,across,k){var im=ims[list[Math.floor(r()*list.length)]],sc=k*u,bw=im.width/sprRes(),bh=im.height/sprRes();[0,H,-H].forEach(function(sh){x.drawImage(im,across-bw*sc/2,along+sh-bh*sc/2,bw*sc,bh*sc)})}
   for(var a=0;a<H;a+=230*u)put(a+(r()-.5)*70*u,W*.66+(r()-.5)*50*u,1.35+r()*.35);
   for(a=110*u;a<H;a+=270*u)if(r()<.7)put(a+(r()-.5)*80*u,W*.4+(r()-.5)*30*u,.95+r()*.3);
   return c}
 }
}
