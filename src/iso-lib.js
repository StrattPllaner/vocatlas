/* ================= ilustración isométrica: biblioteca =================
   Proyección 2:1. Coordenadas del mundo (x, y en el suelo; z hacia arriba) → pantalla.
   Luz desde arriba a la izquierda: tapa clara, cara izquierda (mira al suroeste) base, cara derecha (sureste) sombra.
   Cada color se usa en tres tonos (base, sombra, luz) y un destello en los bordes superiores. Sin contornos negros. */
var ISO=(function(){
 function P(x,y,z){return [x-y,(x+y)/2-(z||0)]}
 function f1(n){return Math.round(n*10)/10}
 function pts(a){var s="";for(var i=0;i<a.length;i++)s+=(i?" ":"")+f1(a[i][0])+","+f1(a[i][1]);return s}
 function hx(h){h=h.replace("#","");return [parseInt(h.slice(0,2),16),parseInt(h.slice(2,4),16),parseInt(h.slice(4,6),16)]}
 function toHex(c){return "#"+c.map(function(v){v=Math.max(0,Math.min(255,Math.round(v)));return (v<16?"0":"")+v.toString(16)}).join("").toUpperCase()}
 /* mezcla con un tono frío para sombra (no gris sucio) y con crema cálida para luz */
 function mix(a,b,k){var A=hx(a),B=hx(b);return toHex([A[0]+(B[0]-A[0])*k,A[1]+(B[1]-A[1])*k,A[2]+(B[2]-A[2])*k])}
 function shade(c,k){return mix(c,"#1D2C55",k)}
 function tint(c,k){return mix(c,"#FFF8E8",k)}
 var TC={};
 /* versión sin color de un tono: gris por luminancia, con un poco más de contraste para que siga legible.
    Se calcula una vez por color; así el mapa no usa filtros de escala de grises en vivo. */
 var GC={};
 function grey(c){var k=c.toUpperCase();if(GC[k])return GC[k];var q=hx(k),l=.299*q[0]+.587*q[1]+.114*q[2],v=Math.max(34,Math.min(246,128+(l-128)*1.06+10));return GC[k]=toHex([v,v*1.004,v*1.012])}
 function greyAll(svg){return svg.replace(/#[0-9A-Fa-f]{6}\b/g,function(m){return grey(m)})}
 function T(c){if(TC[c])return TC[c];return TC[c]={b:c,s:shade(c,.24),d:shade(c,.42),l:tint(c,.3),h:tint(c,.62),e:shade(c,.34)}}
 function poly(a,fill,o){o=o||{};return '<polygon points="'+pts(a)+'" fill="'+fill+'"'+(o.st===false?'':' stroke="'+(o.st||fill)+'" stroke-width="'+(o.sw||1)+'" stroke-linejoin="round"')+(o.op!=null?' opacity="'+o.op+'"':'')+(o.cls?' class="'+o.cls+'"':'')+'/>'}
 function line(a,col,w,o){o=o||{};return '<polyline points="'+pts(a)+'" fill="none" stroke="'+col+'" stroke-width="'+w+'" stroke-linecap="'+(o.cap||"round")+'" stroke-linejoin="'+(o.join||"round")+'"'+(o.op!=null?' opacity="'+o.op+'"':'')+(o.dash?' stroke-dasharray="'+o.dash+'"':'')+(o.cls?' class="'+o.cls+'"':'')+'/>'}
 function path(d,fill,o){o=o||{};return '<path d="'+d+'" fill="'+fill+'"'+(o.st?' stroke="'+o.st+'" stroke-width="'+(o.sw||1)+'" stroke-linejoin="round" stroke-linecap="round"':'')+(o.op!=null?' opacity="'+o.op+'"':'')+(o.cls?' class="'+o.cls+'"':'')+'/>'}
 /* caja: x,y esquina trasera; w a lo largo de x, d a lo largo de y, h alto */
 function box(x,y,z,w,d,h,c,o){
  o=o||{};var t=T(c),top=z+h,s="";
  var A=P(x,y,top),B=P(x+w,y,top),C=P(x+w,y+d,top),D=P(x,y+d,top),E=P(x,y+d,z),F=P(x+w,y+d,z),G=P(x+w,y,z);
  s+=poly([D,C,F,E],o.left||t.b,{st:o.left||t.b});
  s+=poly([C,B,G,F],o.right||t.s,{st:o.right||t.s});
  if(!o.noTop)s+=poly([A,B,C,D],o.top||t.l,{st:o.top||t.l});
  /* destello sobre las aristas de arriba, recortado: va por dentro de la tapa */
  if(!o.noGlint){var gi=.45;s+=line([P(x+gi,y+d-gi,top),P(x+w-gi,y+d-gi,top),P(x+w-gi,y+gi,top)],t.h,.9,{op:.9,cap:"butt",join:"miter"})}
  return s;
 }
 /* mapeo a puntos de una cara: L = cara frontal izquierda (y = y+d), R = cara frontal derecha (x = x+w) */
 function faceL(x,y,z,w,d){return function(u,v){return P(x+u,y+d,z+v)}}
 function faceR(x,y,z,w,d){return function(u,v){return P(x+w,y+u,z+v)}}
 function faceTop(x,y,z){return function(u,v){return P(x+u,y+v,z)}}
 function quad(f,u,v,a,b,fill,o){return poly([f(u,v),f(u+a,v),f(u+a,v+b),f(u,v+b)],fill,o)}
 /* ventana con marco, vidrio y reflejo diagonal */
 function win(f,u,v,a,b,glass,frame,lit){
  var g=T(glass),s=quad(f,u-.8,v-.8,a+1.6,b+1.6,frame);
  s+=quad(f,u,v,a,b,lit?"#FFE59A":g.b);
  s+=poly([f(u+a*.15,v+b),f(u+a*.45,v+b),f(u+a*.05,v),f(u,v),f(u,v+b*.2)],lit?"#FFF4CC":g.h,{op:.75,st:false});
  return s;
 }
 /* cilindro de pie: centro (x,y), radio r */
 var R2=Math.SQRT2;
 function cylD(x,y,z,r){var c=P(x,y,z);return {cx:c[0],cy:c[1],rx:r*R2,ry:r/R2}}
 function cyl(x,y,z,r,h,c,o){
  o=o||{};var t=T(c),b=cylD(x,y,z,r),a=cylD(x,y,z+h,r),s="";
  var side='M'+f1(b.cx-b.rx)+' '+f1(b.cy)+'A'+f1(b.rx)+' '+f1(b.ry)+' 0 0 0 '+f1(b.cx+b.rx)+' '+f1(b.cy)+'L'+f1(a.cx+a.rx)+' '+f1(a.cy)+'A'+f1(a.rx)+' '+f1(a.ry)+' 0 0 1 '+f1(a.cx-a.rx)+' '+f1(a.cy)+'Z';
  s+=path(side,o.side||t.b);
  /* mitad derecha en sombra */
  var sh='M'+f1(b.cx+b.rx*.15)+' '+f1(b.cy+b.ry*.99)+'A'+f1(b.rx)+' '+f1(b.ry)+' 0 0 0 '+f1(b.cx+b.rx)+' '+f1(b.cy)+'L'+f1(a.cx+a.rx)+' '+f1(a.cy)+'L'+f1(a.cx+a.rx*.15)+' '+f1(a.cy+a.ry*.99)+'Z';
  s+=path(sh,o.sideS||t.s);
  if(!o.noTop){s+='<ellipse cx="'+f1(a.cx)+'" cy="'+f1(a.cy)+'" rx="'+f1(a.rx)+'" ry="'+f1(a.ry)+'" fill="'+(o.top||t.l)+'"/>';
   if(!o.noGlint)s+='<path d="M'+f1(a.cx-a.rx*.96)+' '+f1(a.cy+a.ry*.28)+'A'+f1(a.rx)+' '+f1(a.ry)+' 0 0 0 '+f1(a.cx+a.rx*.2)+' '+f1(a.cy+a.ry*.99)+'" fill="none" stroke="'+t.h+'" stroke-width="1.4" stroke-linecap="round" opacity=".9"/>';}
  return s;
 }
 function ell(x,y,z,r,fill,o){var a=cylD(x,y,z,r);o=o||{};return '<ellipse cx="'+f1(a.cx)+'" cy="'+f1(a.cy)+'" rx="'+f1(a.rx*(o.k||1))+'" ry="'+f1(a.ry*(o.k||1))+'" fill="'+fill+'"'+(o.op!=null?' opacity="'+o.op+'"':'')+'/>'}
 /* esfera (copa de árbol, cúpula): círculo en pantalla con sombra abajo a la derecha y brillo arriba a la izquierda */
 function ball(x,y,z,r,c,o){
  o=o||{};var t=T(c),p=P(x,y,z),cx=p[0],cy=p[1]-r,s="";
  s+='<circle cx="'+f1(cx)+'" cy="'+f1(cy)+'" r="'+f1(r)+'" fill="'+t.b+'"/>';
  s+='<path d="M'+f1(cx+r*.97)+' '+f1(cy+r*.2)+'A'+f1(r)+' '+f1(r)+' 0 0 1 '+f1(cx-r*.55)+' '+f1(cy+r*.83)+'Q'+f1(cx+r*.35)+' '+f1(cy+r*.45)+' '+f1(cx+r*.97)+' '+f1(cy+r*.2)+'Z" fill="'+t.s+'"/>';
  s+='<ellipse cx="'+f1(cx-r*.36)+'" cy="'+f1(cy-r*.4)+'" rx="'+f1(r*.34)+'" ry="'+f1(r*.22)+'" transform="rotate(-35 '+f1(cx-r*.36)+' '+f1(cy-r*.4)+')" fill="'+t.l+'"/>';
  if(!o.noGlint)s+='<circle cx="'+f1(cx-r*.5)+'" cy="'+f1(cy-r*.55)+'" r="'+f1(Math.max(1.2,r*.1))+'" fill="'+t.h+'"/>';
  return s;
 }
 /* domo: media esfera sobre (x,y,z) */
 function dome(x,y,z,r,c,o){
  o=o||{};var t=T(c),b=cylD(x,y,z,r),cx=b.cx,cy=b.cy,s="";
  s+='<path d="M'+f1(cx-b.rx)+' '+f1(cy)+'A'+f1(b.rx)+' '+f1(b.rx*.92)+' 0 0 1 '+f1(cx+b.rx)+' '+f1(cy)+'A'+f1(b.rx)+' '+f1(b.ry)+' 0 0 1 '+f1(cx-b.rx)+' '+f1(cy)+'Z" fill="'+(o.fill||t.b)+'"'+(o.op!=null?' opacity="'+o.op+'"':'')+'/>';
  s+='<path d="M'+f1(cx+b.rx*.2)+' '+f1(cy+b.ry*.98)+'A'+f1(b.rx)+' '+f1(b.ry)+' 0 0 0 '+f1(cx+b.rx)+' '+f1(cy)+'A'+f1(b.rx)+' '+f1(b.rx*.92)+' 0 0 0 '+f1(cx+b.rx*.35)+' '+f1(cy-b.rx*.85)+'Q'+f1(cx+b.rx*.55)+' '+f1(cy-b.rx*.2)+' '+f1(cx+b.rx*.2)+' '+f1(cy+b.ry*.98)+'Z" fill="'+t.s+'"'+(o.op!=null?' opacity="'+o.op+'"':'')+'/>';
  s+='<path d="M'+f1(cx-b.rx*.78)+' '+f1(cy-b.rx*.28)+'Q'+f1(cx-b.rx*.6)+' '+f1(cy-b.rx*.75)+' '+f1(cx-b.rx*.1)+' '+f1(cy-b.rx*.86)+'" fill="none" stroke="'+t.h+'" stroke-width="'+f1(Math.max(1.4,r*.09))+'" stroke-linecap="round" opacity=".85"/>';
  return s;
 }
 /* techo a dos aguas sobre una caja (cumbrera a lo largo de x) */
 function gable(x,y,z,w,d,rh,c,o){
  o=o||{};var t=T(c),ov=o.ov||2,th=o.th||1.6,s="";
  var a=P(x-ov,y-ov,z),b=P(x+w+ov,y-ov,z),cc=P(x+w+ov,y+d+ov,z),dd=P(x-ov,y+d+ov,z),r1=P(x-ov,y+d/2,z+rh),r2=P(x+w+ov,y+d/2,z+rh);
  /* hastial derecho (muro bajo el techo) */
  s+=poly([P(x+w,y,z),P(x+w,y+d,z),P(x+w,y+d/2,z+rh)],o.wall||t.s);
  /* faldón trasero y delantero */
  s+=poly([r1,r2,b,a],t.l);
  s+=poly([dd,cc,r2,r1],t.b);
  /* alero con grosor: canto del faldón delantero y canto del extremo derecho */
  s+=poly([dd,cc,[cc[0],cc[1]+th],[dd[0],dd[1]+th]],t.d,{st:false});
  s+=poly([cc,r2,[r2[0],r2[1]+th],[cc[0],cc[1]+th]],t.s,{st:false});
  s+=poly([r2,b,[b[0],b[1]+th],[r2[0],r2[1]+th]],I_shade(t.l),{st:false});
  /* cumbrera: brillo que termina justo en los extremos del techo */
  s+=line([[r1[0]+.6,r1[1]+.3],[r2[0]-.6,r2[1]+.3]],t.h,1.1,{op:.9,cap:"butt"});
  return s;
 }
 function I_shade(c){return shade(c,.18)}
 /* sombra proyectada al suelo hacia abajo a la derecha (la luz viene de arriba a la izquierda) */
 function shadowEll(x,y,z,r,k){k=k==null?.35:k;var a=cylD(x+k*r,y-k*r*.2,z,r);return '<ellipse cx="'+f1(a.cx)+'" cy="'+f1(a.cy+2)+'" rx="'+f1(a.rx)+'" ry="'+f1(a.ry)+'" fill="#1D2C55" opacity=".13"/>'}
 function shadowBox(x,y,z,w,d,h){
  /* proyección simple: la caja se alarga hacia +x en el suelo */
  var o=Math.min(h*.4,18);return poly([P(x,y+d,z),P(x+w+o,y+d,z),P(x+w+o,y-o*.2,z),P(x+w,y-o*.2,z),P(x+w,y,z)],"#1D2C55",{op:.14,st:false});
 }
 /* plataforma de cada edificio: disco redondo con grosor y borde iluminado */
 function platform(r,top,o){
  o=o||{};var s="",side=o.side||"#C9B48C";
  s+=shadowEll(0,0,-1,r+1,.1);
  s+=cyl(0,0,0,r,7,side,{top:top,side:side,sideS:shade(side,.2),noGlint:true});
  var a=cylD(0,0,7,r);
  s+='<path d="M'+f1(a.cx-a.rx)+' '+f1(a.cy)+'A'+f1(a.rx)+' '+f1(a.ry)+' 0 0 0 '+f1(a.cx+a.rx)+' '+f1(a.cy)+'" fill="none" stroke="'+tint(top,.45)+'" stroke-width="1.6" opacity=".9"/>';
  /* borde de piedra: anillo un poco más claro */
  s+='<ellipse cx="'+f1(a.cx)+'" cy="'+f1(a.cy)+'" rx="'+f1(a.rx-5)+'" ry="'+f1(a.ry-2.5)+'" fill="none" stroke="'+shade(top,.12)+'" stroke-width="1.2" opacity=".55"/>';
  return s;
 }
 /* camino de losas sobre la plataforma: de (x0,y0) a (x1,y1), ancho w */
 function walk(x0,y0,x1,y1,w,col){var dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy),nx=-dy/L*w/2,ny=dx/L*w/2,z=7.2,s="";
  s+=poly([P(x0+nx,y0+ny,z),P(x1+nx,y1+ny,z),P(x1-nx,y1-ny,z),P(x0-nx,y0-ny,z)],col,{st:shade(col,.12),sw:1});
  for(var t=4;t<L-2;t+=5){var a=t/L;s+=line([P(x0+dx*a+nx,y0+dy*a+ny,z),P(x0+dx*a-nx,y0+dy*a-ny,z)],shade(col,.14),.7,{op:.7})}
  return s}

 /* ---------- método de silueta: una forma continua, tonos recortados dentro de ella ---------- */
 var UID=0;function uid(p){return (p||"i")+(++UID).toString(36)}
 /* curva cerrada suave por los puntos (Catmull-Rom → Bézier) */
 function smooth(q,closedP){var n=q.length;if(n<3)return "";var d="M"+f1(q[0][0])+" "+f1(q[0][1]),m=closedP===false?n-1:n;
  for(var i=0;i<m;i++){var p0=q[closedP===false?Math.max(0,i-1):(i-1+n)%n],p1=q[i],p2=q[(i+1)%n],p3=q[closedP===false?Math.min(n-1,i+2):(i+2)%n];
   d+="C"+f1(p1[0]+(p2[0]-p0[0])/6)+" "+f1(p1[1]+(p2[1]-p0[1])/6)+" "+f1(p2[0]-(p3[0]-p1[0])/6)+" "+f1(p2[1]-(p3[1]-p1[1])/6)+" "+f1(p2[0])+" "+f1(p2[1])}
  return d+(closedP===false?"":"Z")}
 /* masas fusionadas: borde ondulado con n bultos; flat recorta la base en línea recta */
 function blobPts(cx,cy,rx,ry,n,ph,amp,flat,N){N=N||84;var o=[];for(var i=0;i<N;i++){var a=i/N*Math.PI*2,b=Math.pow(Math.abs(Math.sin(n*a/2+ph)),.55),r=1-amp+amp*b,x=cx+Math.cos(a)*rx*r,y=cy+Math.sin(a)*ry*r;if(flat!=null)y=Math.min(y,cy+ry*flat);o.push([x,y])}return o}
 function blob(cx,cy,rx,ry,n,ph,amp,flat){return smooth(blobPts(cx,cy,rx,ry,n,ph,amp,flat))}
 function clipDef(id,d){return '<clipPath id="'+id+'"><path d="'+d+'"/></clipPath>'}
 /* plano vertical isométrico a lo largo del eje x (u hacia la derecha-abajo, v hacia arriba) */
 function planeX(x,y,z){var o=P(x,y,z);return 'matrix(1 .5 0 1 '+f1(o[0])+' '+f1(o[1])+')'}
 function planeY(x,y,z){var o=P(x,y,z);return 'matrix(-1 .5 0 1 '+f1(o[0])+' '+f1(o[1])+')'}
 /* plano del suelo (para dibujos planos acostados en el piso o el agua) */
 function planeG(x,y,z){var o=P(x,y,z);return 'matrix(1 .5 -1 .5 '+f1(o[0])+' '+f1(o[1])+')'}
 /* sombras: contacto oscuro y chico en la base, proyectada suave hacia abajo a la derecha */
 function contact(rx,o){o=o||{};return '<ellipse cx="'+f1(o.x||0)+'" cy="'+f1(o.y||0)+'" rx="'+f1(rx)+'" ry="'+f1(rx*.42)+'" fill="#13213F" opacity="'+(o.op||.32)+'"/>'}
 function cast(rx,len,o){o=o||{};var x=o.x||0,y=o.y||0;return '<path d="M'+f1(x-rx)+' '+f1(y)+'Q'+f1(x-rx*.4)+' '+f1(y+rx*.5)+' '+f1(x+len*.5)+' '+f1(y+rx*.62+len*.18)+'Q'+f1(x+len+rx*.4)+' '+f1(y+len*.3)+' '+f1(x+len*.9)+' '+f1(y+len*.08)+'Q'+f1(x+rx*.3)+' '+f1(y-rx*.36)+' '+f1(x-rx)+' '+f1(y)+'Z" fill="#13213F" opacity="'+(o.op||.13)+'"/>'}
 /* recorte por silueta: base en un tono, planos de sombra y luz dentro */
 function shaded(d,base,inner){var id=uid("k");return clipDef(id,d)+'<path d="'+d+'" fill="'+base+'"/><g clip-path="url(#'+id+')">'+inner+'</g>'}
 return {uid:uid,smooth:smooth,blobPts:blobPts,blob:blob,clipDef:clipDef,planeX:planeX,planeY:planeY,planeG:planeG,contact:contact,cast:cast,shaded:shaded,walk:walk,P:P,pts:pts,poly:poly,line:line,path:path,box:box,faceL:faceL,faceR:faceR,faceTop:faceTop,quad:quad,win:win,cyl:cyl,cylD:cylD,ell:ell,ball:ball,dome:dome,gable:gable,shadowEll:shadowEll,shadowBox:shadowBox,platform:platform,T:T,shade:shade,tint:tint,mix:mix,f1:f1,grey:grey,greyAll:greyAll};
})();
