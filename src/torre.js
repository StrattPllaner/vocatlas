/* ================= la espiral de la carrera =================
   Los símbolos de la carrera flotan en el aire, uno por unidad, uno arriba de otro (dibujados con el sistema de #art).
   Un camino da vueltas en espiral alrededor de ellos, una vuelta por unidad, y las lecciones son botones que flotan sobre él.
   La espiral gira: el botón de la lección que sigue siempre queda al frente y al centro, y al pasar a la siguiente lección
   gira y sube hasta traerla al frente mientras Rumbo salta hacia ella. Cada símbolo está en boceto y se pinta conforme
   avanzas su unidad. Arriba de todo, la estrella de maestría. */
var TORRE=(function(I){
 var P=I.P,f1=I.f1,R=86,FH=330,PF=.22,ZA=7,G=1.5;
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
 /* ---------- torre de cualquier carrera: su edificio abajo, sus piezas de #art en medio y su emblema arriba;
    lo que falte se completa con objetos de su área, en el color de la carrera ---------- */
 var DECO={bush:1,lamp:1,flowers:1,treeRound:1,treePine:1,palm:1,rock:1,bench:1,signpost:1,crate:1,cone:1};
 function fit(pc,z,big){var fp=pc.fp,w=Math.max(4,fp[2]-fp[0],fp[3]-fp[1]),k=Math.min(big?1.3:2.1,(big?64:52)/w);return put(pc,z,k,0,0)}
 var OBJ={
  libros:function(z,c){var T=I.T(c),s=I.box(-15,-10,z,30,20,6,T.s,{top:T.b,right:T.d,noGlint:true})+I.box(-14.4,-9.4,z+.7,29,19,4.6,"#F6F0E2",{noTop:true,left:"#EFE6D2",right:"#DCCFB4",noGlint:true});
   s+=I.box(-12,-12,z+6,26,18,6,"#2F5E8E",{top:"#3A6FA3",right:"#244A70",noGlint:true})+I.box(-11.4,-11.4,z+6.7,25,17,4.6,"#F6F0E2",{noTop:true,left:"#EFE6D2",right:"#DCCFB4",noGlint:true});
   return s+I.box(-13,-8,z+12,27,16,5.4,"#E8B33A",{top:"#F2C470",right:"#C9883A",noGlint:true})},
  columnata:function(z,c){var q=colonnade(z+3,22,8,30,"#F6F0E2");return I.cyl(0,0,z,26,3,"#E8DFCC",{sideS:"#CFC3AA"})+q.b+q.f+I.cyl(0,0,z+33,26,5,c,{sideS:I.shade(c,.2)})},
  globo:function(z,c){return I.cyl(0,0,z,9,3,"#8A6A4A",{sideS:"#6E5238"})+I.cyl(0,0,z+3,1.6,14,"#8A6A4A",{noGlint:true})+I.ball(0,0,z+15,17,c)},
  engrane:function(z,c){var s=I.cyl(0,0,z,20,7,c,{sideS:I.shade(c,.22)}),i;for(i=0;i<8;i++){var a=i/8*Math.PI*2,x=Math.cos(a)*20,y=Math.sin(a)*20;if(x+y<0)s=I.box(x-3,y-3,z,6,6,7,I.shade(c,.1),{noGlint:true})+s;else s+=I.box(x-3,y-3,z,6,6,7,I.shade(c,.1),{noGlint:true})}
   return s+I.cyl(0,0,z+7,6,2,"#E8DFCC",{sideS:"#CFC3AA"})},
  matraz:function(z,c){return I.cyl(0,0,z,14,2,"#DCE6EC",{sideS:"#B9C6CF"})+I.ball(0,0,z+2,14,c)+I.cyl(0,0,z+26,4,14,"#E6F2F8",{sideS:"#BFD3DE"})+I.cyl(0,0,z+40,5.5,2,"#C9883A",{sideS:"#A86E28"})},
  monitor:function(z,c){var s=I.cyl(0,0,z,8,2,"#3A4452",{sideS:"#2A323D"})+I.box(-2,-2,z+2,4,4,10,"#3A4452",{noGlint:true});s+=I.box(-18,-3,z+12,36,6,24,"#2A323D",{top:"#3A4452",noGlint:true});
   var F=I.faceL(-18,-3,z+12,36,6);return s+I.quad(F,2,2,32,20,c,{st:false})+I.quad(F,4,14,14,2,"#FFFFFF",{st:false,op:.7})+I.quad(F,4,9,22,2,"#FFFFFF",{st:false,op:.5})},
  trofeo:function(z,c){return I.box(-10,-10,z,20,20,6,"#6E5238",{top:"#8A6A4A",right:"#57412C",noGlint:true})+I.cyl(0,0,z+6,3,10,"#E2A72E",{noGlint:true})+I.dome(0,0,z+16,12,"#F2C14E")+I.cyl(0,0,z+16,12,2,"#F2C14E",{sideS:"#C98A1E"})},
  planta:function(z,c){return I.cyl(0,0,z,12,9,"#C9704F",{sideS:"#A85A3D"})+(typeof ENV!=="undefined"?'<g transform="translate(0 '+f1(-z-9+ZA)+')">'+ENV.one("treeRound",{d:2,k:1.3,ph:1})+'</g>':I.ball(0,0,z+9,14,"#58B05A"))}
 };
 var AREA={salud:["matraz","libros","globo","trofeo"],ing:["engrane","matraz","columnata","trofeo"],tec:["monitor","globo","matraz","libros"],neg:["libros","columnata","globo","trofeo"],arte:["columnata","globo","libros","trofeo"]};
 var BIO={salud:"jardin",ing:"industria",tec:"vidrio",neg:"ciudad",arte:"barrio"};
 function generic(id){
  var c=byId[id]||{color:"#3F7DA6",area:"neg"},art=typeof ART!=="undefined"&&ART.has(id),S=art?pieces(id,"s"):[],E=art?pieces(id,"e"):[];
  var mid=S.slice(1).concat(E).filter(function(p){var f=p&&p.fp;return p&&!DECO[p.n]&&p.s&&Math.min(f[2]-f[0],f[3]-f[1])>=7}),em=E[0]&&E[0].s?E[0]:null;
  if(em)mid=mid.filter(function(p){return p!==em});
  var list=AREA[c.area]||AREA.neg;
  return function(k,z){
   if(k===0){var base=art?ART.get(id,2,"s",{noPlat:true}):(typeof ENV!=="undefined"&&ENV.generic?ENV.generic(BIO[c.area]||"ciudad",c.color,hash(id)):"");
    return {f:'<g transform="translate(0 '+f1(-z+.9*ZA)+') scale(.9)">'+base+'</g>'}}
   if(k===5){if(em)return {f:fit(em,z,true)};var q=colonnade(z+3,15,6,22,"#F6F0E2");return {b:I.cyl(0,0,z,20,3,"#E8DFCC",{sideS:"#CFC3AA"})+q.b,f:q.f+I.cyl(0,0,z+25,18,3,"#EFE7D6",{sideS:"#D3C7AE"})+I.dome(0,0,z+28,16,c.color)}}
   var pc=mid[k-1];if(pc)return {f:fit(pc,z,false)};
   return {f:OBJ[list[(k-1)%list.length]](z,c.color)}}}
 var CACHE={},GEN={};
 function has(id){return !!(FLOORS[id]||byId[id])&&typeof ISO!=="undefined"}
 function floorsOf(id){return FLOORS[id]||GEN[id]||(GEN[id]=generic(id))}

 /* ---------- geometría ----------
    a: ángulo a lo largo del camino (grados; 360 por unidad). rot: cuánto está girada la espiral; con rot = a, ese punto
    queda al frente y al centro. d va de -1 (atrás) a 1 (frente). */
 var D2R=Math.PI/180;
 function zAt(a){return FH*a/360+30}
 function proj(a,rot,lift){var t=(a-rot+45)*D2R,x=Math.cos(t)*R,y=Math.sin(t)*R,z=zAt(a)+(lift||0),b=P(x,y,z),ax=P(0,0,z),d=Math.cos((a-rot)*D2R),k=1+PF*d;
  return {x:ax[0]+(b[0]-ax[0])*k,y:ax[1]+(b[1]-ax[1])*k+d*8,d:d,k:k}}
 /* paradas repartidas a lo largo de la vuelta de su unidad; el cofre al final */
 function angles(u,m){var o=[];for(var i=0;i<m;i++)o.push(u*360+(i+.5)*360/m);return o}
 /* altura del símbolo de cada unidad: a la mitad de su vuelta, un poco abajo para que el camino lo rodee */
 function symZ(u){return zAt(u*360+180)-40}

 /* ---------- símbolos: el elemento de la unidad, sin pisos ni torre, con una sombra suave abajo ---------- */
 function symSVG(id,k){var fl=floorsOf(id)(k,0)||{};return '<ellipse cx="0" cy="34" rx="46" ry="11" fill="#13213F" opacity=".1"/><g transform="scale('+G+')">'+(fl.b||"")+(fl.f||"")+'</g>'}
 function floorSVG(id,k){return symSVG(id,k)}
 function star(on){var r=40,ri=17,p=[];for(var i=0;i<10;i++){var a=-Math.PI/2+i*Math.PI/5,rr=i%2?ri:r;p.push(f1(Math.cos(a)*rr)+","+f1(Math.sin(a)*rr))}
  var pl=p.join(" ");
  return '<g class="tw-star'+(on?" is-on":"")+'"><polygon points="'+pl+'" transform="translate(0 6)" class="tw-star-b"/><polygon points="'+pl+'" class="tw-star-t"/></g>'}
 var VB="-100 -150 200 210";

 /* ---------- arma la escena ---------- */
 function build(o){
  /* o: {id, host, units, all, pg, rb, nodeHTML, mastered, cur} */
  var id=o.id,host=o.host,A=[];
  o.units.forEach(function(u,ui){var an=angles(ui,u.items.length);u.items.forEach(function(it,j){it.a=an[j];A.push(it)})});
  var a0=-50,a1=6*360+40,xs=R*1.414*(1+PF)+36,ytop=-(zAt(a1)+150),ybot=P(0,0,zAt(a0))[1]+R*.9+60,Wd=xs*2,Hd=ybot-ytop;
  var vw=host.clientWidth||360,k=Math.max(.92,Math.min(1.7,(vw-12)/Wd)),Wp=Wd*k,Hp=Hd*k,padT=150,padB=170;
  var toPx=function(p){if(p.length)p={x:p[0],y:p[1]};return {x:(p.x+xs)*k,y:(p.y-ytop)*k}};
  var C=CACHE[id]||(CACHE[id]=[0,1,2,3,4,5].map(function(f){var col=symSVG(id,f);return {c:col,s:I.sketchAll(col)}}));
  var h='<div class="tw-scene" style="height:'+(Hp+padT+padB)+'px"><div class="tw-clouds" aria-hidden="true"><i></i><i></i><i></i><i></i></div>'+
   '<div class="tw-stage" style="width:'+Wp+'px;height:'+Hp+'px;top:'+padT+'px">'+
   '<svg class="tw-l tw-pb" viewBox="'+(-xs)+' '+ytop+' '+Wd+' '+Hd+'" aria-hidden="true"><path class="tw-path is-rest"/><path class="tw-path is-done"/></svg>';
  /* símbolos flotando: cada uno en su propia capa, con su vaivén */
  var sw=200*k,sh=210*k;
  for(var f=0;f<6;f++){var u=o.units[f]||{done:0},L2=u.items?u.items.filter(function(it){return it.lid}):[],p=L2.length?u.done/L2.length:0,c=toPx(P(0,0,symZ(f)));
   h+='<div class="tw-sym tw-floor'+(p>=1?" is-done":"")+'" data-f="'+f+'" style="left:'+f1(c.x-sw/2)+'px;top:'+f1(c.y-sh*150/210)+'px;width:'+f1(sw)+'px;height:'+f1(sh)+'px;animation-delay:-'+(f*.9)+'s">'+
    '<svg viewBox="'+VB+'" aria-hidden="true"><defs>'+I.skDefs()+'</defs><g class="tw-sk">'+C[f].s+'</g><g class="tw-col" style="opacity:'+(p>=1?1:(p*.8).toFixed(2))+'">'+C[f].c+'</g></svg>'+
    '</div>';h+='<span class="tw-ul s-'+(u.state||"lock")+'" data-u="'+f+'">'+(f+1)+' · '+esc(u.t||"")+'</span>'}
  var stc=toPx(P(0,0,zAt(a1)+60));
  h+='<div class="tw-sym tw-starw" style="left:'+f1(stc.x-50*k)+'px;top:'+f1(stc.y-50*k)+'px;width:'+f1(100*k)+'px;height:'+f1(100*k)+'px"><svg viewBox="-50 -50 100 100" aria-hidden="true">'+star(o.mastered)+'</svg></div>';
  h+='<svg class="tw-l tw-pf" viewBox="'+(-xs)+' '+ytop+' '+Wd+' '+Hd+'" aria-hidden="true"><path class="tw-path is-rest"/><path class="tw-path is-done"/></svg>';
  A.forEach(function(it){h+='<button type="button" class="rt3-n tw-n s-'+it.state+(it.chest!=null?" is-chest":"")+'" data-i="'+it.k2+'" aria-label="'+(it.lid?it.lid+" ":"")+esc(it.n)+(it.state==="done"?", hecha":it.state==="lock"?", todavía no":it.state==="soon"?", llega pronto":"")+'">'+o.nodeHTML(it)+'</button>'});
  h+='<div class="tw-globe" id="twGlobe" hidden></div><div class="tw-rb" id="lpRb">'+o.rb+'</div></div></div>';
  host.innerHTML=h;
  var S={host:host,k:k,xs:xs,ytop:ytop,toPx:toPx,items:A,padT:padT,a0:a0,a1:a1,rb:host.querySelector("#lpRb"),sc:host.closest(".tw-wrap")||host.parentNode,
   ul:host.querySelectorAll(".tw-ul"),pb:host.querySelectorAll(".tw-pb path"),pf:host.querySelectorAll(".tw-pf path"),btn:{},cur:o.cur,rot:A[o.cur]?A[o.cur].a:0,lift:0,base:Math.round(58*Math.min(1.2,k))};
  A.forEach(function(it){S.btn[it.k2]=host.querySelector('.tw-n[data-i="'+it.k2+'"]')});
  S.first=o.units.map(function(u){var it=u.items[0];return it?A.indexOf(it):null});
  /* hasta dónde va pintado el camino: la última parada hecha seguida */
  var r=-1;A.forEach(function(it,j){if(it.done&&r===j-1)r=j});S.doneA=r<0?a0:A[r].a+(A[r+1]?(A[r+1].a-A[r].a)/2:0);
  S.lift=S.base*.42;render(S);return S}

 /* ---------- dibuja la espiral con su giro actual: camino (atrás y adelante), botones y Rumbo ---------- */
 function render(S,rbA,arc){
  var rot=S.rot,st=6,seg={b:["",""],f:["",""]},prev=null,sc0=S.sc?S.sc.scrollTop-S.padT:0,vh=S.sc?S.sc.clientHeight:900,ymin=(sc0-500)/S.k+S.ytop,ymax=(sc0+vh+500)/S.k+S.ytop;
  for(var a=S.a0;a<=S.a1+.1;a+=st){var zz=-zAt(a);if(zz<ymin-200||zz>ymax+200){prev=null;continue}var q=proj(a,rot),side=q.d<0?"b":"f",kind=a<=S.doneA?1:0,key=side+kind;
   var pt=f1(q.x)+" "+f1(q.y);
   if(prev&&prev.key===key)seg[side][kind]+="L"+pt;else{if(prev){seg[side][kind]+="M"+prev.pt+"L"+pt}else seg[side][kind]+="M"+pt}
   prev={key:key,pt:pt}}
  S.pb[0].setAttribute("d",seg.b[0]);S.pb[1].setAttribute("d",seg.b[1]);S.pf[0].setAttribute("d",seg.f[0]);S.pf[1].setAttribute("d",seg.f[1]);
  S.items.forEach(function(it){var b=S.btn[it.k2];if(!b)return;var q=proj(it.a,rot),p=S.toPx(q),sc=.82+.18*(q.d+1)/2,sz=(it.chest!=null?S.base*1.15:S.base)*sc;
   it.px=p.x;it.py=p.y;it.sz=sz;it.d=q.d;
   var bz=it.chest!=null?S.base*1.15:S.base;if(b.__bz!==bz){b.__bz=bz;b.style.width=b.style.height=bz+"px"}
   b.style.transform="translate("+f1(p.x-bz/2)+"px,"+f1(p.y-bz*.62)+"px) scale("+sc.toFixed(3)+")";
   var z=q.d<-.15?2:6;if(b.__z!==z){b.__z=z;b.style.zIndex=z;b.classList.toggle("is-back",z===2)}});
  /* etiqueta de cada unidad sobre el camino, donde empieza su vuelta */
  for(var u=0;u<S.ul.length;u++){var e=S.ul[u],fi=S.first[u],q2=proj(fi!=null?S.items[fi].a:u*360,rot),p2=S.toPx(q2),bs=S.base*(.82+.18*(q2.d+1)/2);e.style.transform="translate(-50%,0) translate("+f1(p2.x)+"px,"+f1(p2.y+bs*.38+3)+"px)";
   var z3=q2.d<-.15?2:5;if(e.__z!==z3){e.__z=z3;e.style.zIndex=z3;e.style.opacity=z3===2?.45:1}
   /* si caería encima de un botón vecino, no se muestra */
   var ly=p2.y+bs*.38+3,lw=(e.__w||(e.__w=e.offsetWidth||90))/2+4,hit=false;[fi-1,fi+1,fi+2].forEach(function(j){var o=S.items[j];if(!o||o.px==null)return;if(Math.abs(o.px-p2.x)<lw+o.sz/2&&ly+18>o.py-o.sz*.62&&ly<o.py+o.sz*.38)hit=true});
   var show=!hit;if(e.__s!==show){e.__s=show;e.style.display=show?"":"none"}}
  var ra=rbA!=null?rbA:(S.items[S.cur]?S.items[S.cur].a:0),rq=proj(ra,rot),rp=S.toPx(rq);
  S.rb.style.transform="translate("+f1(rp.x)+"px,"+f1(rp.y-S.lift-(arc||0))+"px)";S.rb.__d=rq.d;
  var z2=rq.d<-.15?2:7;if(S.rb.__z!==z2){S.rb.__z=z2;S.rb.style.zIndex=z2}
  if(S.onRender)S.onRender();return rp}
 function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}
 function anim(S,dur,step,done){var t0=null;if(typeof RM==="function"&&RM()){step(1);done&&done();return}
  function fr(ts){if(!t0)t0=ts;var t=Math.min(1,(ts-t0)/dur);step(ease(t),t);if(t<1)S.raf=requestAnimationFrame(fr);else{S.raf=0;done&&done()}}
  cancelAnimationFrame(S.raf);S.raf=requestAnimationFrame(fr)}
 /* gira la espiral hasta dejar la parada i al frente (Rumbo se queda en la suya) */
 function focus(S,i,done){var it=S.items[i];if(!it){done&&done();return}var r0=S.rot,r1=it.a;if(Math.abs(r1-r0)<.5){render(S);done&&done();return}
  anim(S,Math.min(900,300+Math.abs(r1-r0)*1.2),function(e){S.rot=r0+(r1-r0)*e;var p=render(S);follow(S,it.py)},done)}
 /* pone a Rumbo en la parada i, al frente */
 function place(S,i){var it=S.items[i];if(!it)return;S.cur=i;S.rot=it.a;render(S)}
 /* salto a la siguiente: la espiral gira y sube con él, así queda siempre al frente */
 function hop(S,i0,i1,done){var A=S.items,a0=A[i0]?A[i0].a:S.rot,a1=A[i1]?A[i1].a:S.a1,inner=S.rb.firstElementChild;S.cur=i1;
  if(inner){inner.classList.remove("tw-land");void inner.offsetWidth;inner.classList.add("tw-crouch")}
  setTimeout(function(){if(inner)inner.classList.remove("tw-crouch");
   anim(S,Math.min(1100,520+Math.abs(a1-a0)*1.1),function(e,t){var a=a0+(a1-a0)*e;S.rot=a;var p=render(S,a,Math.sin(Math.PI*t)*34*S.k);follow(S,p.y)},
    function(){S.rot=a1;render(S);if(inner)inner.classList.add("tw-land");done&&done()})},140)}
 /* maestría: Rumbo sube por el camino hasta arriba */
 function climbTop(S,i0,done){var a0=S.items[i0]?S.items[i0].a:S.rot,a1=S.a1-10;S.cur=-1;
  anim(S,1600,function(e,t){var a=a0+(a1-a0)*e;S.rot=a;var p=render(S,a,Math.abs(Math.sin(Math.PI*t*3))*22*S.k);follow(S,p.y)},function(){S.rot=a1;render(S,a1);done&&done()})}
 function follow(S,y){var sc=S.sc;if(!sc)return;var want=y+S.padT-sc.clientHeight*.55;sc.scrollTop+=(want-sc.scrollTop)*.14}
 function scrollTo(S,y,smooth){var sc=S.sc;if(!sc)return;var t=Math.max(0,y+S.padT-sc.clientHeight*.58);if(smooth&&sc.scrollTo)sc.scrollTo({top:t,behavior:"smooth"});else sc.scrollTop=t}
 /* vista previa para #art: los seis símbolos pintados hasta la fracción p, la espiral y la estrella */
 function preview(id,p){var C=CACHE[id]||(CACHE[id]=[0,1,2,3,4,5].map(function(f){var col=symSVG(id,f);return {c:col,s:I.sketchAll(col)}})),a0=-50,a1=6*360+40,xs=R*1.414*(1+PF)+36,yt=-(zAt(a1)+150),yb=P(0,0,zAt(a0))[1]+R*.9+60;
  var path=function(side){var d="",on=false;for(var a=a0;a<=a1;a+=5){var q=proj(a,0);if((q.d<0)===(side==="b")){d+=(on?"L":"M")+f1(q.x)+" "+f1(q.y);on=true}else on=false}return d};
  var s='<path d="'+path("b")+'" class="tw-path is-rest" opacity=".5"/>';
  for(var f=0;f<6;f++){var q=Math.max(0,Math.min(1,p*6-f)),c=P(0,0,symZ(f));s+='<g transform="translate(0 '+f1(c[1])+')"><g>'+C[f].s+'</g><g style="opacity:'+(q>=1?1:(q*.8).toFixed(2))+'">'+C[f].c+'</g></g>'}
  s+='<g transform="translate(0 '+f1(P(0,0,zAt(a1)+60)[1])+')">'+star(p>=1)+'</g><path d="'+path("f")+'" class="tw-path is-rest"/>';
  return '<svg viewBox="'+(-xs)+" "+yt+" "+(xs*2)+" "+(yb-yt)+'" class="tw-prev"><defs>'+I.skDefs()+'</defs>'+s+'</svg>'}
 function pos(S,i){var it=S.items[i];return it?{x:it.px,y:it.py,sz:it.sz}:null}
 return {has:has,build:build,preview:preview,render:render,focus:focus,place:place,hop:hop,climbTop:climbTop,scrollTo:scrollTo,pos:pos,floorSVG:floorSVG,star:star};
})(ISO);
