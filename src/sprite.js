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
function sprMake(art,night,cb){
 var key=(night?"n":"d")+art;if(SPR.cache[key]){cb(SPR.cache[key]);return}
 var bx=sprBox(art);if(!bx){cb(null);return}
 var R=sprRes(),W=Math.max(1,Math.round(bx[2]*R)),H=Math.max(1,Math.round(bx[3]*R));
 var svg='<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="'+W+'" height="'+H+'" viewBox="'+bx.join(" ")+'"><defs>'+ENV.DEFS+ISO.skDefs()+'</defs>'+sprTheme(art,night)+'</svg>';
 var img=new Image(),url=URL.createObjectURL(new Blob([sprTheme(svg,night)],{type:"image/svg+xml"}));
 img.onload=function(){URL.revokeObjectURL(url);try{
   var c=document.createElement("canvas");c.width=W;c.height=H;var x=c.getContext("2d");x.drawImage(img,0,0,W,H);if(night)sprNight(x,W,H);
   c.toBlob(function(bl){if(!bl){cb(null);return}var u=URL.createObjectURL(bl),o={u:u,b:bx};SPR.cache[key]=o;cb(o)},"image/png")}catch(e){cb(null)}};
 img.onerror=function(){URL.revokeObjectURL(url);cb(null)};
 img.src=url;
}
function sprImg(o){return '<image href="'+o.u+'" x="'+o.b[0]+'" y="'+o.b[1]+'" width="'+o.b[2]+'" height="'+o.b[3]+'" preserveAspectRatio="none"/>'}
/* cola: edificios (su <use> apunta a la definición) y vegetación (su dibujo va dentro del grupo) */
function sprStart(){
 if(typeof ENV==="undefined"||!window.URL||!window.Blob)return;
 var g=++SPR.gen,night=!!(DMQ&&DMQ.matches),q=[],w=$("#world");if(!w)return;
 each(w.querySelectorAll(".m-objs .poi .pp>use"),function(u){var ref=document.getElementById((u.getAttribute("href")||"").slice(1));if(ref)q.push({el:u,art:ref.innerHTML,pp:true})});
 each(w.querySelectorAll(".m-objs .m-d>.vco>g,.m-objs .m-d>.vbz>g"),function(e){q.push({el:e,art:e.innerHTML})});
 each(w.querySelectorAll(".m-objs .m-gh"),function(e){q.push({el:e,art:e.innerHTML})});
 each(w.querySelectorAll(".m-edge>g"),function(e){q.push({el:e,art:e.innerHTML})});
 SPR.q=q;var done=0,n=q.length;
 function step(){
  if(g!==SPR.gen)return;var t0=performance.now();
  while(SPR.q.length&&performance.now()-t0<10){var it=SPR.q.shift();(function(it){sprMake(it.art,night,function(o){if(g!==SPR.gen||!o||!it.el.isConnected){fin();return}
    if(it.pp){var im=document.createElementNS(NS,"g");im.innerHTML=sprImg(o);it.el.parentNode.replaceChild(im.firstChild,it.el)}else it.el.innerHTML=sprImg(o);fin()})})(it)}
  if(SPR.q.length)setTimeout(step,16);
 }
 function fin(){done++;if(done===n&&g===SPR.gen){w.classList.add("spr-ok");occKey="";
  /* luego, con calma, las ilustraciones de las otras pestañas */
  setTimeout(function(){if(typeof artDefs==="function")artDefs()},400)}}
 if(!n)return;setTimeout(step,RM()?60:400);
}
