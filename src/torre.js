/* ================= la torre de la carrera: escalera en espiral =================
   Seis pisos, uno por unidad, con elementos de la carrera dibujados con el sistema de #art, unidos por un eje central.
   Una escalera de piedra sube alrededor en espiral, una vuelta por unidad. Las paradas van solo en la parte de enfrente
   y a los lados; atrás la escalera es solo camino y la tapa la torre. Rumbo sube saltando y, si el camino pasa por detrás,
   lo hace en la capa de atrás (nunca atraviesa la torre). Cada piso está en boceto y se pinta conforme avanzas su unidad.
   En la cima, la estrella de maestría. Prototipo con Derecho; las demás carreras siguen con el temario. */
var TORRE=(function(I){
 var P=I.P,f1=I.f1,R=92,W=26,FH=580,DR=72,DH=16,CORE=36,PF=.16,ZA=7,G=1.9,FZ=.44,FWD=18,STONE="#E9DFC9";
 var D2R=Math.PI/180;
 /* ---------- pisos de cada carrera: devuelven {b: lo que va detrás del eje, f: lo de enfrente} con el suelo en z ---------- */
 function pieces(id,v){try{var L=ART.parts(id,v,2);return L||[]}catch(e){return []}}
 function find(L,n){for(var i=0;i<L.length;i++)if(L[i].n===n)return L[i];return null}
 /* coloca una pieza de #art centrada en el eje, con su suelo a la altura z y a escala k */
 function put(pc,z,k,dx,dy){if(!pc)return "";var fp=pc.fp,cx=(fp[0]+fp[2])/2,cy=(fp[1]+fp[3])/2,c=P(cx,cy,0),o=P(dx||0,dy||0,0);
  return '<g transform="translate('+f1(o[0])+' '+f1(-z+k*ZA+o[1])+') scale('+k+')"><g transform="translate('+f1(-c[0])+' '+f1(-c[1])+')">'+pc.s+'</g></g>'}
 function colonnade(z,r,n,h,col){var b="",f="",i;for(i=0;i<n;i++){var a=i/n*Math.PI*2,x=Math.cos(a)*r,y=Math.sin(a)*r,s=I.cyl(x,y,z,2.3,h,col,{sideS:I.shade(col,.18),noGlint:true});if(x+y<0)b+=s;else f+=s}return {b:b,f:f}}
 var FLOORS={
  derecho:function(k,z){
   var S=pieces("derecho","s"),E=pieces("derecho","e");
   if(k===0)return {f:put(find(S,"juzgado"),z,.92,4,-2)+put(find(S,"estatua"),z,.92,-22,20)};
   if(k===1){var c=colonnade(z+3,25,10,34,"#F6F0E2");
    return {b:I.cyl(0,0,z,30,3,"#E8DFCC",{sideS:"#CFC3AA"})+c.b,f:c.f+I.cyl(0,0,z+37,30,5,"#EFE7D6",{sideS:"#D3C7AE"})}}
   if(k===2){var bk=I.box(-17,-11,z,34,22,7,"#8E2F2B",{top:"#A63B35",right:"#6E2421",noGlint:true})+I.box(-16.4,-10.4,z+.8,33,21,5.4,"#F6F0E2",{noTop:true,left:"#EFE6D2",right:"#DCCFB4",noGlint:true});
    bk+=I.box(-13,-14,z+7,28,20,6.5,"#2F5E8E",{top:"#3A6FA3",right:"#244A70",noGlint:true})+I.box(-12.4,-13.4,z+7.7,27,19,5,"#F6F0E2",{noTop:true,left:"#EFE6D2",right:"#DCCFB4",noGlint:true});
    bk+=I.box(-15,-8,z+13.5,30,18,6,"#3E7A4A",{top:"#4A8C57",right:"#2F5E39",noGlint:true})+I.box(-14.4,-7.4,z+14.2,29,17,4.6,"#F6F0E2",{noTop:true,left:"#EFE6D2",right:"#DCCFB4",noGlint:true});
    var Tb=I.faceTop(-15,-8,z+19.5);bk+=I.quad(Tb,4,6,18,2,"#E8B33A",{st:false})+I.quad(Tb,4,10,12,1.4,"#E8B33A",{st:false});
    return {f:bk}}
   if(k===3)return {f:put(find(E,"mazo"),z,1.55,0,0)};
   if(k===4)return {f:put(find(E,"balanza"),z,1.05,0,0)};
   var c2=colonnade(z+3,15,6,22,"#F6F0E2");
   return {b:I.cyl(0,0,z,20,3,"#E8DFCC",{sideS:"#CFC3AA"})+c2.b,f:c2.f+I.cyl(0,0,z+25,18,3,"#EFE7D6",{sideS:"#D3C7AE"})+I.dome(0,0,z+28,16,"#D9A441")}
  }
 };
 var CACHE={};
 function has(id){return !!FLOORS[id]&&typeof ART!=="undefined"&&ART.has(id)}

 /* ---------- geometría: punto de la escalera en el ángulo a (grados), con un poco de perspectiva ---------- */
 function zAt(a){return FH*(a+20)/360+4}
 function pt(r,a,z){var x=Math.cos(a*D2R)*r,y=Math.sin(a*D2R)*r,b=P(x,y,z),ax=P(0,0,z),d=(x+y)/(R*1.414),k=1+PF*d;
  return {x:ax[0]+(b[0]-ax[0])*k,y:ax[1]+(b[1]-ax[1])*k+d*6,d:d,k:k}}
 function onStair(a){return pt(R,a,zAt(a)+2)}
 /* ángulos de las paradas de una unidad: de la derecha a la izquierda por el frente */
 function angles(u,m){var o=[];for(var i=0;i<m;i++)o.push(u*360+(m>1?-18+166*i/(m-1):65));return o}

 /* ---------- dibujo de la escalera: tramos de piedra con peldaños; atrás y adelante por separado ---------- */
 function stair(a0,a1){var back=[],front=[],st=4;
  for(var a=a0;a<a1;a+=st){var b=Math.min(a1,a+st),z0=zAt(a),z1=zAt(b),
   i0=pt(R-W/2,a,z0),o0=pt(R+W/2,a,z0),i1=pt(R-W/2,b,z1),o1=pt(R+W/2,b,z1),dm=(i0.d+o1.d)/2,t=7;
   var top='<polygon points="'+[i0,o0,o1,i1].map(function(p){return f1(p.x)+","+f1(p.y)}).join(" ")+'" class="tw-tread"/>';
   var side='<polygon points="'+[o0,o1,{x:o1.x,y:o1.y+t},{x:o0.x,y:o0.y+t}].map(function(p){return f1(p.x)+","+f1(p.y)}).join(" ")+'" class="tw-riser"/>';
   var step=(Math.round(a)%12===0)?'<line x1="'+f1(i0.x)+'" y1="'+f1(i0.y)+'" x2="'+f1(o0.x)+'" y2="'+f1(o0.y)+'" class="tw-step"/>':'';
   (dm<0?back:front).push({d:dm,s:side+top+step})}
  var srt=function(L){return L.sort(function(p,q){return p.d-q.d}).map(function(p){return p.s}).join("")};
  return {back:srt(back),front:srt(front)}}

 /* ---------- la torre: pisos de abajo hacia arriba; cada uno en boceto y en color (el color se ve según avance) ---------- */
 /* cada piso: el eje que sube desde el piso de abajo (con anillos de piedra), el disco del piso y su elemento a escala G */
 /* cuerpo de la torre: piedra que se adelgaza al subir, con anillos de cantera y ventanitas al frente */
 function coreR(z){return CORE-z/(6*FH)*10}
 function shaft(z0,z1){var r=coreR(z0),s=I.cyl(0,0,z0,r,z1-z0,"#EDE3CE",{sideS:"#CFC0A0",noTop:true,noGlint:true});
  for(var z=z0+70;z<z1-20;z+=120){s+=I.cyl(0,0,z,r+2.5,6,"#DCCFB2",{sideS:"#BFAF8F",noTop:true,noGlint:true});
   var w=P(r*.62,r*.62,z+52);s+='<path d="M'+f1(w[0]-5)+' '+f1(w[1]+10)+'v-13a5 5 0 0 1 10 0v13z" fill="#5E6F86" stroke="#CFC0A0" stroke-width="1.6"/>'}
  return s}
 function floorSVG(id,k){var z=k*FH+FZ*FH,zt=z+DH,fl=FLOORS[id](k,zt)||{},s="",sc=function(x){return x?'<g transform="translate(0 '+f1(-zt)+') scale('+G+') translate(0 '+f1(zt)+')">'+x+'</g>':""};
  /* abajo: base y eje hasta el primer piso; cada piso: su disco, el eje que sube al siguiente (detrás) y su elemento */
  if(k===0)s+=I.cyl(0,0,0,DR+10,10,"#DCCFB2",{sideS:"#BFAF8F",top:"#E9DFC9"})+shaft(10,z);
  s+=I.cyl(0,0,z,DR,DH,"#E4D8BF",{sideS:"#C7B898",top:"#F1E8D5"});
  s+=shaft(zt,k<5?z+FH:6*FH+20);if(k<5)s+="";
  /* el elemento va al frente del balcón, delante del cuerpo de la torre */
  var o=P(FWD,FWD,0),fw=function(x){return x?'<g transform="translate('+f1(o[0])+' '+f1(o[1])+')">'+sc(x)+'</g>':""};
  s+=fw(fl.b)+fw(fl.f);
  return s}
 function star(on){var c=P(0,0,6*FH+80),r=44,ri=19,p=[];for(var i=0;i<10;i++){var a=-Math.PI/2+i*Math.PI/5,rr=i%2?ri:r;p.push(f1(c[0]+Math.cos(a)*rr)+","+f1(c[1]+Math.sin(a)*rr))}
  var pl=p.join(" ");
  return '<g class="tw-star'+(on?" is-on":"")+'"><polygon points="'+pl+'" transform="translate(0 6)" class="tw-star-b"/><polygon points="'+pl+'" class="tw-star-t"/></g>'}

 /* ---------- arma la escena completa en el contenedor ---------- */
 function build(o){
  /* o: {id, host, units:[{items:[...], done, n, state}], all, pg, color, rb(html de Rumbo), nodeHTML(it), mastered} */
  var id=o.id,host=o.host,unitsN=6;
  var A=[];o.units.forEach(function(u,ui){var an=angles(ui,u.items.length);u.items.forEach(function(it,j){it.a=an[j];A.push(it)})});
  var aEnd=6*360-30,sc=stair(-70,aEnd);
  /* límites de la escena en unidades de dibujo */
  var xs=R*1.414*(1+PF)+40,ytop=-(6*FH+80)-70,ybot=onStair(-70).y+40,Wd=xs*2,Hd=ybot-ytop;
  var vw=host.clientWidth||360,k=Math.max(.92,Math.min(1.7,(vw-12)/Wd));
  var Wp=Wd*k,Hp=Hd*k,padT=140,padB=150,vb=(-xs)+" "+ytop+" "+Wd+" "+Hd;
  /* los dibujos de cada piso (color y boceto) se calculan una vez por carrera */
  var C=CACHE[id]||(CACHE[id]=[0,1,2,3,4,5].map(function(f){var col=floorSVG(id,f);return {c:col,s:I.sketchAll(col)}}));
  var tw="";for(var f=0;f<unitsN;f++){var u=o.units[f]||{done:0,n:1},L2=u.items?u.items.filter(function(it){return it.lid}):[],p=L2.length?u.done/L2.length:0;
   tw+='<g class="tw-floor'+(p>=1?" is-done":"")+'" data-f="'+f+'"><g class="tw-sk">'+C[f].s+'</g><g class="tw-col" style="opacity:'+(p>=1?1:(p*.8).toFixed(2))+'">'+C[f].c+'</g></g>'}
  tw+=I.cyl(0,0,6*FH+20,coreR(6*FH)+6,10,"#E4D8BF",{sideS:"#C7B898",top:"#F1E8D5"})+star(o.mastered);
  var h='<div class="tw-scene" style="height:'+(Hp+padT+padB)+'px">'+
   '<div class="tw-clouds" aria-hidden="true"><i></i><i></i><i></i><i></i></div>'+
   '<div class="tw-stage" style="width:'+Wp+'px;height:'+Hp+'px;top:'+padT+'px">'+
   '<svg class="tw-l tw-back" viewBox="'+vb+'" aria-hidden="true"><defs>'+I.skDefs()+'</defs>'+sc.back+'</svg>'+
   '<svg class="tw-l tw-tower" viewBox="'+vb+'" aria-hidden="true"><defs>'+I.skDefs()+'</defs>'+tw+'</svg>'+
   '<svg class="tw-l tw-front" viewBox="'+vb+'" aria-hidden="true">'+sc.front+'</svg>'+
   '<div class="tw-l tw-stops">';
  var toPx=function(p){return {x:(p.x+xs)*k,y:(p.y-ytop)*k}};
  /* etiqueta de cada unidad al empezar su vuelta, del lado derecho */
  o.units.forEach(function(u,ui){var it=u.items[0];if(!it)return;var q=onStair(it.a),p=toPx(q);h+='<span class="tw-ul s-'+u.state+'" style="left:'+f1(p.x)+'px;top:'+f1(p.y+30*Math.min(1.25,k))+'px">'+(ui+1)+' · '+esc(u.t)+'</span>'});
  A.forEach(function(it){var q=onStair(it.a),p=toPx(q),sz=Math.max(48,Math.round((it.chest!=null?66:56)*q.k*Math.min(1.25,k)));it.px=p.x;it.py=p.y;it.sz=sz;it.d=q.d;
   h+='<button type="button" class="rt3-n tw-n s-'+it.state+(it.chest!=null?" is-chest":"")+'" data-i="'+it.k2+'" style="left:'+f1(p.x)+'px;top:'+f1(p.y)+'px;width:'+sz+'px;height:'+sz+'px" aria-label="'+(it.lid?it.lid+" ":"")+esc(it.n)+(it.state==="done"?", hecha":it.state==="lock"?", todavía no":it.state==="soon"?", llega pronto":"")+'">'+o.nodeHTML(it)+'</button>'});
  var top=toPx(P(0,0,6*FH+120));
  h+='<div class="tw-globe" id="twGlobe" hidden></div></div>'+
   '<div class="tw-rb" id="lpRb">'+o.rb+'</div></div></div>';
  host.innerHTML=h;
  var S={host:host,k:k,xs:xs,ytop:ytop,toPx:toPx,items:A,top:top,padT:padT,rb:host.querySelector("#lpRb"),sc:host.closest(".tw-wrap")||host.parentNode};
  return S}

 /* ---------- Rumbo: de pie en una parada; salta siguiendo la espiral, por detrás de la torre cuando toca ---------- */
 function layer(S,d){var z=d<-.05?2:7;if(S.rb.__z!==z){S.rb.__z=z;S.rb.style.zIndex=z;S.rb.classList.toggle("is-back",z===2)}}
 function standAt(S,a,lift){var q=onStair(a),p=S.toPx(q);S.rb.style.transform="translate("+f1(p.x)+"px,"+f1(p.y-(lift||0))+"px)";layer(S,q.d);S.rb.__d=q.d;return p}
 function hop(S,a0,a1,done){
  var span=a1-a0,n=Math.max(1,Math.ceil(Math.abs(span)/48)),i=0,inner=S.rb.firstElementChild;
  if(typeof RM==="function"&&RM()){S.rb.style.opacity=0;setTimeout(function(){standAt(S,a1,S.lift);S.rb.style.opacity=1;done&&done()},180);return}
  function one(){if(i>=n){done&&done();return}var b0=a0+span*i/n,b1=a0+span*(i+1)/n,t0=null,dur=n>1?300:420;
   if(inner){inner.classList.remove("tw-land");void inner.offsetWidth;inner.classList.add("tw-crouch")}
   setTimeout(function(){if(inner)inner.classList.remove("tw-crouch");
    function fr(ts){if(!t0)t0=ts;var t=Math.min(1,(ts-t0)/dur),e=t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2,a=b0+(b1-b0)*e,arc=Math.sin(Math.PI*t)*(n>1?18:30)*S.k;
     var p=standAt(S,a,S.lift+arc);follow(S,p.y);
     if(t<1)requestAnimationFrame(fr);else{if(inner){inner.classList.add("tw-land")}i++;setTimeout(one,n>1?40:120)}}
    requestAnimationFrame(fr)},n>1?60:140)}
  one()}
 /* la cámara sigue a Rumbo con suavidad */
 function follow(S,y){var sc=S.sc;if(!sc)return;var want=y+S.padT-sc.clientHeight*.55;sc.scrollTop+= (want-sc.scrollTop)*.12}
 function scrollTo(S,y,smooth){var sc=S.sc;if(!sc)return;var t=Math.max(0,y+S.padT-sc.clientHeight*.58);if(smooth&&sc.scrollTo)sc.scrollTo({top:t,behavior:"smooth"});else sc.scrollTop=t}
 /* vista previa para #art: torre y escalera completas, con los pisos pintados hasta la fracción p (0 a 1) */
 function preview(id,p){var C=CACHE[id]||(CACHE[id]=[0,1,2,3,4,5].map(function(f){var col=floorSVG(id,f);return {c:col,s:I.sketchAll(col)}})),sc=stair(-70,6*360-30),tw="";
  for(var f=0;f<6;f++){var q=Math.max(0,Math.min(1,p*6-f));tw+='<g><g>'+C[f].s+'</g><g style="opacity:'+(q>=1?1:(q*.8).toFixed(2))+'">'+C[f].c+'</g></g>'}
  tw+=I.cyl(0,0,6*FH+20,coreR(6*FH)+6,10,"#E4D8BF",{sideS:"#C7B898",top:"#F1E8D5"})+star(p>=1);
  var xs=R*1.414*(1+PF)+40,yt=-(6*FH+80)-70,yb=onStair(-70).y+40;
  return '<svg viewBox="'+(-xs)+" "+yt+" "+(xs*2)+" "+(yb-yt)+'" class="tw-prev"><defs>'+I.skDefs()+'</defs><g class="tw-back">'+sc.back+'</g>'+tw+sc.front+'</svg>'}
 /* las capas quietas (escalera de atrás, torre y escalera de enfrente) se vuelven imagen: así nada se redibuja mientras
    Rumbo salta o te desplazas. Si algo de la torre se anima (un piso que se pinta, la estrella), se muestra el dibujo un rato
    y luego se vuelve a hacer la imagen. */
 /* las reglas de estilo que usan las capas: una imagen no hereda las de la página */
 var BAKECSS='.tw-tread{fill:#EFE6D3;stroke:#C9B994;stroke-width:.8;stroke-linejoin:round}.tw-riser{fill:#BFAE8B;stroke:#A8966F;stroke-width:.6;stroke-linejoin:round}.tw-step{stroke:#C9B994;stroke-width:1}'+
  '.tw-star-b{fill:#B9AE97}.tw-star-t{fill:#ECE4D2;stroke:#9C8F75;stroke-width:1.5;stroke-linejoin:round}.tw-star.is-on .tw-star-b{fill:#C98A1E}.tw-star.is-on .tw-star-t{fill:#F6C64E;stroke:#E2A72E}';
 function bake(svg,cb){if(!svg||!window.URL||!window.Blob){cb&&cb();return}
  var w=svg.clientWidth,h=svg.clientHeight,r=Math.min(2,window.devicePixelRatio||1);if(!w||!h){cb&&cb();return}
  while(w*h*r*r>15e6&&r>1)r-=.25;
  var str=svg.outerHTML.replace(/^<svg/,'<svg xmlns="http://www.w3.org/2000/svg" width="'+Math.round(w*r)+'" height="'+Math.round(h*r)+'"').replace(/(<svg[^>]*>)/,'$1<style>'+BAKECSS+'</style>');
  if(typeof sprTheme==="function")str=sprTheme(str,false);
  var img=new Image(),url=URL.createObjectURL(new Blob([str],{type:"image/svg+xml"}));
  img.onload=function(){URL.revokeObjectURL(url);try{var cv=document.createElement("canvas");cv.width=Math.round(w*r);cv.height=Math.round(h*r);cv.getContext("2d").drawImage(img,0,0,cv.width,cv.height);
   cv.toBlob(function(bl){if(!bl||!svg.isConnected){cb&&cb();return}var old=svg.__img;var im=document.createElement("img");im.className="tw-l tw-img "+(svg.getAttribute("class")||"").replace("tw-l","");im.alt="";im.src=URL.createObjectURL(bl);
    im.onload=function(){if(old){URL.revokeObjectURL(old.src);old.remove()}svg.parentNode.insertBefore(im,svg);svg.__img=im;svg.style.visibility="hidden";cb&&cb()}},"image/png")}catch(e){cb&&cb()}};
  img.onerror=function(){URL.revokeObjectURL(url);cb&&cb()};img.src=url}
 /* muestra el dibujo vivo de una capa (para animarla) y, pasado el tiempo, la vuelve imagen otra vez */
 function live(svg,ms){if(!svg)return;svg.style.visibility="";if(svg.__img)svg.__img.style.visibility="hidden";clearTimeout(svg.__t);
  svg.__t=setTimeout(function(){bake(svg,function(){if(svg.__img)svg.__img.style.visibility=""})},ms||0)}
 function bakeAll(host){var L=["tw-back","tw-tower","tw-front"].map(function(c){return host.querySelector("svg."+c)});(function nx(i){if(i<L.length)bake(L[i],function(){nx(i+1)})})(0)}
 return {has:has,build:build,preview:preview,bake:bake,live:live,bakeAll:bakeAll,standAt:standAt,hop:hop,scrollTo:scrollTo,onStair:onStair,FH:FH,floorSVG:floorSVG,star:star};
})(ISO);
