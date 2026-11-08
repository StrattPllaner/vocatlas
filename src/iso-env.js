/* ================= entorno, segunda versión =================
   Método: cada pieza es una silueta continua; la sombra y la luz se pintan recortadas dentro de ella.
   Origen (0,0) = punto donde la pieza toca el suelo o el agua. Isométrico 2:1, luz desde arriba a la izquierda.
   d = nivel de detalle: 2 completo, 1 a 96 px, 0 a 64 px (misma silueta, menos detalle). */
var ENV=(function(I){
 var P=I.P,f1=I.f1,T=I.T,sm=I.smooth,blob=I.blob,shaded=I.shaded,box=I.box,poly=I.poly,line=I.line;
 function g(s,tr){return '<g'+(tr?' transform="'+tr+'"':'')+'>'+s+'</g>'}
 function pathD(pts){return "M"+pts.map(function(p){return f1(p[0])+" "+f1(p[1])}).join("L")+"Z"}
 function lerp(a,b,t){return a+(b-a)*t}

 /* ---------- árbol redondo: tronco que se abre en raíces y entra a la copa; copa de masas fusionadas ---------- */
 function treeRound(o){o=o||{};var c=o.c||"#4FAE52",t=T(c),d=o.d==null?2:o.d,k=o.k||1,ph=o.ph||.4,s="";
  var W=T("#8C5E3A");
  s+=I.cast(11*k,22*k,{x:2*k,y:.5*k})+I.contact(4.4*k);
  /* tronco con raíces: una sola forma */
  var tr="M"+f1(-4.6*k)+" 0C"+f1(-2.6*k)+" "+f1(-.4*k)+" "+f1(-1.9*k)+" "+f1(-2.4*k)+" "+f1(-1.7*k)+" "+f1(-5*k)+"L"+f1(-1.2*k)+" "+f1(-17*k)+"L"+f1(1.2*k)+" "+f1(-17*k)+"L"+f1(1.7*k)+" "+f1(-5*k)+"C"+f1(1.9*k)+" "+f1(-2.4*k)+" "+f1(2.6*k)+" "+f1(-.4*k)+" "+f1(4.6*k)+" 0C"+f1(2.4*k)+" "+f1(.9*k)+" "+f1(-2.4*k)+" "+f1(.9*k)+" "+f1(-4.6*k)+" 0Z";
  s+=shaded(tr,W.b,'<path d="M'+f1(.3*k)+' '+f1(1*k)+'L'+f1(.3*k)+' '+f1(-18*k)+'L'+f1(6*k)+' '+f1(-18*k)+'L'+f1(6*k)+' '+f1(1*k)+'Z" fill="'+W.s+'"/><rect x="'+f1(-3*k)+'" y="'+f1(-17.5*k)+'" width="'+f1(6*k)+'" height="'+f1(5*k)+'" fill="'+W.d+'" opacity=".55"/>'+(d>1?'<path d="M'+f1(-1*k)+' '+f1(-8*k)+'q'+f1(.6*k)+' '+f1(-1.4*k)+' 0 '+f1(-3*k)+'" stroke="'+W.s+'" stroke-width="'+f1(.6*k)+'" fill="none" stroke-linecap="round"/>':''));
  /* copa */
  var cx=0,cy=-24*k,rx=12.5*k,ry=11*k,n=d>0?5:4,D=blob(cx,cy,rx,ry,n,ph,.2,.78);
  var inner='<path d="'+blob(cx-3*k,cy-3.4*k,rx*.86,ry*.82,n,ph+.3,.2)+'" fill="'+t.b+'"/>';
  inner+='<path d="'+blob(cx-5.6*k,cy-6.4*k,rx*.46,ry*.4,3,ph+.9,.22)+'" fill="'+t.l+'"/>';
  if(d>0){inner+='<path d="M'+f1(cx+2*k)+' '+f1(cy+1*k)+'q'+f1(3*k)+' '+f1(2*k)+' '+f1(7*k)+' '+f1(1*k)+'M'+f1(cx-7*k)+' '+f1(cy+3.4*k)+'q'+f1(3*k)+' '+f1(2.2*k)+' '+f1(6*k)+' '+f1(.6*k)+'" stroke="'+t.s+'" stroke-width="'+f1(.9*k)+'" fill="none" stroke-linecap="round" opacity=".8"/>';}
  if(d>1)inner+='<path d="M'+f1(cx-9.6*k)+' '+f1(cy-3*k)+'q'+f1(1.4*k)+' '+f1(-5*k)+' '+f1(6*k)+' '+f1(-6.6*k)+'" stroke="'+t.h+'" stroke-width="'+f1(1.1*k)+'" fill="none" stroke-linecap="round"/>';
  s+=shaded(D,t.s,inner);
  return s}

 /* ---------- pino: niveles dentados que se traslapan y se angostan ---------- */
 function treePine(o){o=o||{};var c=o.c||"#2E8C68",t=T(c),d=o.d==null?2:o.d,k=o.k||1,s="";
  var W=T("#7E5536");
  s+=I.cast(8*k,26*k,{x:2*k,y:.5*k})+I.contact(3.6*k);
  s+=shaded("M"+f1(-1.8*k)+" 0L"+f1(-1.3*k)+" "+f1(-6*k)+"L"+f1(1.3*k)+" "+f1(-6*k)+"L"+f1(1.8*k)+" 0Q0 "+f1(.8*k)+" "+f1(-1.8*k)+" 0Z",W.b,'<rect x="0" y="'+f1(-7*k)+'" width="'+f1(3*k)+'" height="'+f1(8*k)+'" fill="'+W.s+'"/>');
  var tiers=d>0?[[-4,-17,11],[-11,-25,9],[-18,-32,7],[-24.5,-37.5,4.8]]:[[-4,-19,11],[-13,-30,8],[-22,-38,5]];
  tiers.forEach(function(q,i){var yb=q[0]*k,ya=q[1]*k,w=q[2]*k,teeth=d>0?5:3,pts=[[0,ya],[w*.5,lerp(ya,yb,.52)],[w,yb]];
   for(var j=1;j<teeth;j++){var x=w-2*w*j/teeth;pts.push([x+w/teeth,yb+1.5*k],[x,yb-.3*k])}
   pts.push([-w+w/teeth,yb+1.5*k],[-w,yb],[-w*.5,lerp(ya,yb,.52)]);
   var D="M"+pts.map(function(p){return f1(p[0])+" "+f1(p[1])}).join("L")+"Z";
   var inner='<path d="M0 '+f1(ya)+'L'+f1(w*1.4)+' '+f1(yb+2*k)+'L'+f1(w*.1)+' '+f1(yb+2*k)+'Z" fill="'+t.s+'"/>';
   /* sombra que el nivel de arriba deja sobre este */
   if(i<tiers.length-1)inner+='<path d="M'+f1(-w)+' '+f1(tiers[i+1][0]*k-1*k)+'Q0 '+f1(tiers[i+1][0]*k+3*k)+' '+f1(w)+' '+f1(tiers[i+1][0]*k-1*k)+'L'+f1(w)+' '+f1(ya-2*k)+'L'+f1(-w)+' '+f1(ya-2*k)+'Z" fill="'+t.d+'" opacity=".35"/>';
   if(d>0)inner+='<path d="M'+f1(-w*.12)+' '+f1(ya+2.4*k)+'L'+f1(-w*.6)+' '+f1(lerp(ya,yb,.72))+'" stroke="'+t.h+'" stroke-width="'+f1(1*k)+'" stroke-linecap="round" opacity=".85"/>';
   s+=shaded(D,t.b,inner);
  });
  return s}

 /* ---------- palmera: tronco curvo con anillos, hojas de pluma que salen de un punto ---------- */
 function palm(o){o=o||{};var d=o.d==null?2:o.d,k=o.k||1,fl=o.flip?-1:1,s="";
  var W=T("#A57449"),G=T("#3DA65A");
  var top=[6*fl*k,-31*k],ctl=[1*fl*k,-14*k];
  s+=I.cast(8*k,28*k,{x:2*k,y:.5*k})+I.contact(3.4*k);
  function at(t){var u=1-t;return [u*u*0+2*u*t*ctl[0]+t*t*top[0],u*u*0+2*u*t*ctl[1]+t*t*top[1]]}
  var L=[],R=[];for(var i=0;i<=12;i++){var t=i/12,p=at(t),p2=at(Math.min(1,t+.01)),p1=at(Math.max(0,t-.01)),dx=p2[0]-p1[0],dy=p2[1]-p1[1],l=Math.hypot(dx,dy)||1,w=lerp(2.5,1.2,t)*k;L.push([p[0]-dy/l*w,p[1]+dx/l*w]);R.push([p[0]+dy/l*w,p[1]-dx/l*w])}
  var TD="M"+L.concat(R.reverse()).map(function(p){return f1(p[0])+" "+f1(p[1])}).join("L")+"Z";R.reverse();
  var inner='<path d="M'+R.map(function(p,i){var m=at(i/12);return f1((m[0]+p[0])/2)+" "+f1((m[1]+p[1])/2)}).join("L")+'L'+R.slice().reverse().map(function(p){return f1(p[0]+3*k)+" "+f1(p[1])}).join("L")+'Z" fill="'+W.s+'"/>';
  if(d>0)for(i=1;i<12;i+=d>1?1:2){var a=L[i],b=R[i];inner+='<path d="M'+f1(a[0])+' '+f1(a[1])+'Q'+f1((a[0]+b[0])/2)+' '+f1((a[1]+b[1])/2+1*k)+' '+f1(b[0])+' '+f1(b[1])+'" stroke="'+W.d+'" stroke-width="'+f1(.55*k)+'" fill="none" opacity=".55"/>'}
  var back="",front="",cx=top[0],cy=top[1];
  var A=d>0?[-170,-140,-105,-60,-25,10,160,195]:[-160,-100,-30,20,170];
  A.forEach(function(deg,j){var a=deg*Math.PI/180,Lf=(13+(j%3))*k,ex=cx+Math.cos(a)*Lf,ey=cy+Math.sin(a)*Lf*.55+7*k,mx=cx+Math.cos(a)*Lf*.5,my=cy+Math.sin(a)*Lf*.3-4.5*k;
   var pts=[],pts2=[],N=d>0?14:8;
   for(var q=0;q<=N;q++){var tt=q/N,u=1-tt,x=u*u*cx+2*u*tt*mx+tt*tt*ex,y=u*u*cy+2*u*tt*my+tt*tt*ey,x2=u*u*cx+2*u*tt*mx+tt*tt*ex+.01,nx=-(2*u*(my-cy)+2*tt*(ey-my)),ny=2*u*(mx-cx)+2*tt*(ex-mx),nl=Math.hypot(nx,ny)||1,wd=Math.pow(Math.sin(Math.PI*tt),.75)*2.7*k*(d>0&&q%2?.55:1);pts.push([x+nx/nl*wd,y+ny/nl*wd]);pts2.push([x-nx/nl*wd*.8,y-ny/nl*wd*.8])}
   var Dl="M"+pts.concat(pts2.reverse()).map(function(p){return f1(p[0])+" "+f1(p[1])}).join("L")+"Z";
   var lit=Math.cos(a)<.2&&Math.sin(a)<.6,col=lit?G.b:G.s;
   var leaf='<path d="'+Dl+'" fill="'+col+'"/>'+(d>1?'<path d="M'+f1(cx)+' '+f1(cy)+'Q'+f1(mx)+' '+f1(my)+' '+f1(ex)+' '+f1(ey)+'" stroke="'+(lit?G.l:G.b)+'" stroke-width="'+f1(.6*k)+'" fill="none"/>':'');
   if(Math.sin(a)<-.2)back+=leaf;else front+=leaf});
  s+=back+shaded(TD,W.b,inner);
  var C=T("#7A4A2A");
  [[-1.4,1.6],[1.4,1.9],[0,3.1]].slice(0,d>0?3:2).forEach(function(q){var x=cx+q[0]*k,y=cy+q[1]*k,r=1.6*k;s+='<circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="'+f1(r)+'" fill="'+C.b+'"/><path d="M'+f1(x+r)+' '+f1(y)+'A'+f1(r)+' '+f1(r)+' 0 0 1 '+f1(x-r*.4)+' '+f1(y+r*.9)+'Q'+f1(x+r*.5)+' '+f1(y+r*.4)+' '+f1(x+r)+' '+f1(y)+'Z" fill="'+C.s+'"/>'});
  s+=front;
  return s}

 /* ---------- arbusto: volumen bajo y ancho, sin tronco, con bayas ---------- */
 function bush(o){o=o||{};var c=o.c||"#3F9E4E",t=T(c),d=o.d==null?2:o.d,k=o.k||1,ph=o.ph||1.1,s="";
  s+=I.cast(11*k,14*k,{x:1*k,y:.6*k})+I.contact(9*k,{op:.26});
  var rx=11*k,ry=7*k,cy=-ry*.8,D=blob(0,cy,rx,ry,5,ph,.18,.78);
  var inner='<path d="'+blob(-2.6*k,cy-2.4*k,rx*.84,ry*.74,5,ph+.4,.2)+'" fill="'+t.b+'"/><path d="'+blob(-5.2*k,cy-4*k,rx*.42,ry*.38,3,ph+.8,.22)+'" fill="'+t.l+'"/>';
  if(d>0)inner+='<path d="M'+f1(-2*k)+' '+f1(cy+2*k)+'q'+f1(3*k)+' '+f1(1.6*k)+' '+f1(6.4*k)+' '+f1(.2*k)+'" stroke="'+t.s+'" stroke-width="'+f1(.9*k)+'" fill="none" stroke-linecap="round"/>';
  s+=shaded(D,t.s,inner);
  if(d>0)[[-5,-7.6],[1.6,-9.4],[6.4,-5.6]].forEach(function(q){s+='<circle cx="'+f1(q[0]*k)+'" cy="'+f1(q[1]*k)+'" r="'+f1(1.15*k)+'" fill="'+(o.berry||"#E8445A")+'"/><circle cx="'+f1(q[0]*k-.35*k)+'" cy="'+f1(q[1]*k-.4*k)+'" r="'+f1(.38*k)+'" fill="#FFFFFF" opacity=".8"/>'});
  return s}

 /* ---------- flores: matas con hojas, tallos y flores en isométrico ---------- */
 function flowers(o){o=o||{};var d=o.d==null?2:o.d,k=o.k||1,cols=o.cols||["#FF6F91","#FFD04D","#FFFFFF"],s="",G=T("#3E9A4C");
  s+=I.contact(7*k,{op:.22});
  s+=shaded(blob(0,-1.6*k,7*k,3*k,6,.3,.3,.7),G.s,'<path d="'+blob(-1.4*k,-2.6*k,5.6*k,2.2*k,6,.6,.3)+'" fill="'+G.b+'"/>');
  var F=[[-4,-5.6],[-.6,-7.6],[3.2,-6],[1.4,-4.4],[-2.6,-3.6]].slice(0,d>0?5:3);
  F.forEach(function(q,i){var x=q[0]*k,y=q[1]*k,c=cols[i%cols.length],ct=T(c);
   s+='<path d="M'+f1(x)+' '+f1(y+.4*k)+'Q'+f1(x+.4*k)+' '+f1(y+2.4*k)+' '+f1(x*.6)+' '+f1(-1.4*k)+'" stroke="'+G.b+'" stroke-width="'+f1(.6*k)+'" fill="none"/>';
   /* corola de 5 pétalos achatada al plano del suelo */
   var pd="";for(var p=0;p<5;p++){var a=p/5*Math.PI*2-.3,px=x+Math.cos(a)*1.3*k,py=y+Math.sin(a)*.75*k;pd+='M'+f1(x)+' '+f1(y)+'Q'+f1(px+Math.cos(a+1.2)*.9*k)+' '+f1(py+Math.sin(a+1.2)*.5*k)+' '+f1(px+Math.cos(a)*.5*k)+' '+f1(py+Math.sin(a)*.3*k)+'Q'+f1(px+Math.cos(a-1.2)*.9*k)+' '+f1(py+Math.sin(a-1.2)*.5*k)+' '+f1(x)+' '+f1(y)+'Z'}
   s+='<path d="'+pd+'" fill="'+c+'"/><path d="M'+f1(x)+' '+f1(y)+'l'+f1(1.8*k)+' '+f1(.2*k)+'l'+f1(-.6*k)+' '+f1(.8*k)+'Z" fill="'+ct.s+'" opacity=".6"/><circle cx="'+f1(x)+'" cy="'+f1(y)+'" r="'+f1(.45*k)+'" fill="'+(c==="#FFD04D"?"#E07B2E":"#FFD04D")+'"/>'});
  return s}

 /* ---------- roca: facetas planas, medio hundida ---------- */
 function rock(o){o=o||{};var k=o.k||1,d=o.d==null?2:o.d,R=T(o.c||"#A8A29A"),s="";
  s+=I.cast(8*k,9*k,{x:1*k,y:.4*k})+'<ellipse cx="0" cy="'+f1(.2*k)+'" rx="'+f1(9.2*k)+'" ry="'+f1(2.8*k)+'" fill="#13213F" opacity=".26"/>';
  var A=[-8.2,0],B=[-7,-4.6],C=[-2.8,-7.6],Dd=[2.4,-8],E=[6.8,-4.8],F=[8.4,-1],G=[7.8,.2],M=[-3.2,-3.4],N=[1.8,-3.8],Q=[2,.6];
  function pp(a){return a.map(function(p){return [p[0]*k,p[1]*k]})}
  s+='<path d="'+pathD(pp([A,B,M,N,Q,[-2,.8]]))+'" fill="'+R.b+'" stroke="'+R.b+'" stroke-width=".6" stroke-linejoin="round"/>';
  s+='<path d="'+pathD(pp([N,E,F,G,Q]))+'" fill="'+R.s+'" stroke="'+R.s+'" stroke-width=".6" stroke-linejoin="round"/>';
  s+='<path d="'+pathD(pp([B,C,Dd,E,N,M]))+'" fill="'+R.l+'" stroke="'+R.l+'" stroke-width=".6" stroke-linejoin="round"/>';
  if(d>0)s+='<path d="M'+f1(B[0]*k)+' '+f1(B[1]*k)+'L'+f1(C[0]*k)+' '+f1(C[1]*k)+'L'+f1(Dd[0]*k)+' '+f1(Dd[1]*k)+'" stroke="'+R.h+'" stroke-width="'+f1(.8*k)+'" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
  if(d>1)s+='<path d="M'+f1(-5*k)+' '+f1(-1*k)+'l'+f1(2*k)+' '+f1(-1.4*k)+'" stroke="'+R.s+'" stroke-width="'+f1(.6*k)+'" stroke-linecap="round"/>';
  /* base hundida: la tierra tapa el pie de la roca */
  s+='<path d="M'+f1(-8.4*k)+' '+f1(.1*k)+'Q0 '+f1(2.4*k)+' '+f1(8*k)+' '+f1(.1*k)+'Q0 '+f1(1*k)+' '+f1(-8.4*k)+' '+f1(.1*k)+'Z" fill="#13213F" opacity=".22"/>';
  return s}

 /* ---------- banca: tres tablones de asiento, dos de respaldo inclinado, laterales de metal ---------- */
 function bench(o){o=o||{};var d=o.d==null?2:o.d,s="",Wd="#C98B4E",M="#38414C";
  var L=12;
  s+=I.poly([P(.4,4.8,0),P(L+3.4,4.8,0),P(L+3.4,-1.8,0),P(L-.4,-1.8,0)],"#13213F",{op:.12,st:false});
  [[1,4.4],[1,-.2],[L-1,4.4],[L-1,-.2]].forEach(function(q){var p=P(q[0],q[1],0);s+='<ellipse cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" rx="1.1" ry=".5" fill="#13213F" opacity=".4"/>'});
  function frame(x){var pts=[[4.4,0],[4.1,3.9],[0,3.9],[-.2,0]].map(function(q){return P(x,q[0],q[1])}),back=[[0,3.9],[-.6,6.6],[-1.2,9.4]].map(function(q){return P(x,q[0],q[1])}),arm=[[-.7,6.6],[1.6,7],[3.6,6.4],[4.2,5.2],[4.1,3.9]].map(function(q){return P(x,q[0],q[1])});
   return '<path d="M'+pts.map(function(p){return f1(p[0])+" "+f1(p[1])}).join("L")+'M'+back.map(function(p){return f1(p[0])+" "+f1(p[1])}).join("L")+'" stroke="'+M+'" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'+(d>0?'<path d="'+sm(arm,false)+'" stroke="'+M+'" stroke-width="1.1" fill="none" stroke-linecap="round"/>':'')}
  s+=frame(1);
  /* respaldo inclinado hacia atrás: dos tablones con grosor */
  [[5.9,6.9,-.5],[7.7,8.7,-1]].forEach(function(b){var z0=b[0],z1=b[1],y=b[2];s+=I.poly([P(.3,y+.6,z0),P(L-.3,y+.6,z0),P(L-.3,y+.6-.2,z1),P(.3,y+.6-.2,z1)],T(Wd).b)+I.poly([P(.3,y+.6-.2,z1),P(L-.3,y+.6-.2,z1),P(L-.3,y,z1),P(.3,y,z1)],T(Wd).l)+I.poly([P(L-.3,y,z0),P(L-.3,y+.6,z0),P(L-.3,y+.4,z1),P(L-.3,y-.2,z1)],T(Wd).s)});
  /* asiento: tres tablones con separación */
  [[0,1.25],[1.55,2.8],[3.1,4.35]].forEach(function(b){s+=box(.3,b[0],3.9,L-.6,b[1]-b[0],.65,Wd,{noGlint:d<2})});
  s+=frame(L-1);
  return s}

 /* ---------- farol: base ancha, fuste delgado, linterna con cristal y tapa ---------- */
 function lamp(o){o=o||{};var d=o.d==null?2:o.d,s="",M=T("#34404E");
  s+=I.cast(3,16,{x:.6,y:.4})+I.contact(2.4);
  s+=I.cyl(0,0,0,1.7,1.2,M.b,{top:M.l,noGlint:true});
  if(d>0)s+=I.cyl(0,0,1.2,1.1,1,M.b,{top:M.l,noGlint:true});
  var b=P(0,0,2),t2=P(0,0,19);
  s+='<path d="M'+f1(b[0]-.7)+' '+f1(b[1])+'L'+f1(t2[0]-.45)+' '+f1(t2[1])+'L'+f1(t2[0]+.45)+' '+f1(t2[1])+'L'+f1(b[0]+.7)+' '+f1(b[1])+'Z" fill="'+M.b+'"/><path d="M'+f1(b[0])+' '+f1(b[1])+'L'+f1(t2[0])+' '+f1(t2[1])+'L'+f1(t2[0]+.45)+' '+f1(t2[1])+'L'+f1(b[0]+.7)+' '+f1(b[1])+'Z" fill="'+M.s+'"/>';
  /* linterna: caja de cristal con marco y techo de cuatro aguas */
  s+='<circle class="iso-halo" cx="'+f1(t2[0])+'" cy="'+f1(t2[1]-3.4)+'" r="9" fill="url(#isoHalo)"/>';
  s+=box(-1.2,-1.2,19,2.4,2.4,3.6,"#FFE39A",{left:"#FFE7A6",right:"#F2C96A",top:"#FFF2C6",noGlint:true});
  if(d>0){var L=I.faceL(-1.2,-1.2,19,2.4,2.4),R=I.faceR(-1.2,-1.2,19,2.4,2.4);s+=line([L(1.2,0),L(1.2,3.6)],M.b,.45)+line([R(1.2,0),R(1.2,3.6)],M.s,.45)}
  var a=P(-1.6,-1.6,22.6),bb=P(1.6,-1.6,22.6),c=P(1.6,1.6,22.6),dd=P(-1.6,1.6,22.6),tp=P(0,0,25);
  s+=poly([dd,c,tp],M.b)+poly([c,bb,tp],M.s);
  s+='<circle cx="'+f1(tp[0])+'" cy="'+f1(tp[1]-.5)+'" r=".6" fill="'+M.b+'"/>';
  return s}

 /* ---------- señal: poste de madera con tablas en flecha, con grosor ---------- */
 function signpost(o){o=o||{};var d=o.d==null?2:o.d,W=T("#B07B4E"),s="";
  s+=I.cast(3,14,{x:.6,y:.4})+I.contact(2);
  s+=box(-.7,-.7,0,1.4,1.4,20,W.b,{noGlint:true});
  function board(face,u0,v0,len,dir,col){var t=T(col),q=[[0,0],[len,0],[len+2*dir,1.5],[len,3],[0,3]];
   var F=face==="L"?I.faceL(-.7,-.7,0,1.4,1.4):I.faceR(-.7,-.7,0,1.4,1.4);
   var pts=q.map(function(p){return F(u0+p[0]*dir,v0+p[1])}),top=q.slice(3,5).map(function(p){return F(u0+p[0]*dir,v0+p[1])});
   var dx=face==="L"?P(0,-.5,0):P(-.5,0,0),o0=P(0,0,0),off=[dx[0]-o0[0],dx[1]-o0[1]];
   var back=pts.map(function(p){return [p[0]+off[0],p[1]+off[1]]});
   return poly(back,t.s)+poly([pts[3],pts[4],back[4],back[3]],t.l)+poly(pts,t.b)+(d>1?line([pts[0],pts[1]],t.s,.4,{op:.6}):"")}
  s+=board("L",1.4,15,7.4,1,"#E2B04A");
  s+=board("R",.6,10.6,6.4,1,"#4FA0D8");
  if(d>0)s+=board("L",0,6.4,5.4,-1,"#E07A5F");
  return s}

 function crate(o){o=o||{};var d=o.d==null?2:o.d,s=I.cast(4,6,{x:1,y:.4})+I.contact(3.6),W="#C99A5B";s+=box(-2.6,-2.6,0,5.2,5.2,5,W);
  if(d>0){var L=I.faceL(-2.6,-2.6,0,5.2,5.2),R=I.faceR(-2.6,-2.6,0,5.2,5.2);s+=line([L(0,2.5),L(5.2,2.5)],I.shade(W,.3),.5)+line([R(0,2.5),R(5.2,2.5)],I.shade(W,.45),.5)}return s}
 /* ---------- cono: base cuadrada y cuerpo cónico con banda reflejante ---------- */
 function cone(o){o=o||{};var d=o.d==null?2:o.d,O=T("#FF8A3D"),s=I.cast(3,6,{x:.6,y:.3})+I.contact(3.2);
  s+=box(-2.4,-2.4,0,4.8,4.8,.6,O.s,{top:O.b,noGlint:true});
  var b=I.cylD(0,0,.6,1.9),ap=P(0,0,8.4);
  var D="M"+f1(b.cx-b.rx)+" "+f1(b.cy)+"L"+f1(ap[0])+" "+f1(ap[1])+"L"+f1(b.cx+b.rx)+" "+f1(b.cy)+"A"+f1(b.rx)+" "+f1(b.ry)+" 0 0 1 "+f1(b.cx-b.rx)+" "+f1(b.cy)+"Z";
  var band1=I.cylD(0,0,3.4,1.25),band2=I.cylD(0,0,5,.86);
  var inner='<path d="M'+f1(ap[0])+' '+f1(ap[1]-1)+'L'+f1(b.cx+b.rx+2)+' '+f1(b.cy+3)+'L'+f1(b.cx+.4)+' '+f1(b.cy+3)+'Z" fill="'+O.s+'"/>';
  inner+='<path d="M'+f1(band1.cx-band1.rx-2)+' '+f1(band1.cy)+'A'+f1(band1.rx+2)+' '+f1(band1.ry+1)+' 0 0 0 '+f1(band1.cx+band1.rx+2)+' '+f1(band1.cy)+'L'+f1(band2.cx+band2.rx+2)+' '+f1(band2.cy)+'A'+f1(band2.rx+2)+' '+f1(band2.ry+1)+' 0 0 1 '+f1(band2.cx-band2.rx-2)+' '+f1(band2.cy)+'Z" fill="#FFFFFF" opacity=".92"/>';
  s+=shaded(D,O.b,inner);return s}

 /* ================= agua ================= */
 /* espuma y anillos alrededor de una línea de flotación (puntos en el plano del agua, ya proyectados) */
 function foam(pts,o){o=o||{};var d=pts.map(function(p,i){return [p[0]+(i%2?.6:-.4),p[1]+(i%3?.3:-.2)]});return '<path d="'+sm(d)+'" fill="none" stroke="#FFFFFF" stroke-width="'+(o.w||1.6)+'" stroke-linejoin="round" opacity="'+(o.op||.9)+'"/>'}
 function ripple(rx,o){o=o||{};var x=o.x||0,y=o.y||0,s="";for(var i=0;i<(o.n||2);i++){var r=rx*(1.25+i*.4);s+='<ellipse class="iso-ripple" style="--rd:'+(i*.8).toFixed(1)+'s" cx="'+f1(x)+'" cy="'+f1(y)+'" rx="'+f1(r)+'" ry="'+f1(r*.5)+'" fill="none" stroke="#FFFFFF" stroke-width=".8" opacity="'+(.5-i*.18)+'"/>'}return s}
 function ringPts(rx,ry,n,x,y){var o=[];for(var i=0;i<n;i++){var a=i/n*Math.PI*2;o.push([(x||0)+Math.cos(a)*rx,(y||0)+Math.sin(a)*ry])}return o}

 /* ---------- muelle: tablones sobre pilotes que entran al agua ---------- */
 function pier(o){o=o||{};var d=o.d==null?2:o.d,len=o.len||44,W="#C69152",s="";
  /* sombra del muelle sobre el agua */
  s+=poly([P(0,-3.6,0),P(len,-3.6,0),P(len+4,3.6+3,0),P(4,3.6+3,0)],"#0E2A55",{op:.16,st:false});
  var piles=[];for(var x=1;x<=len-1;x+=d>0?8:14)piles.push([x,-3],[x,3]);
  piles.sort(function(a,b){return a[0]+a[1]-(b[0]+b[1])});
  function pile(p){var w=P(p[0],p[1],0);return '<ellipse cx="'+f1(w[0])+'" cy="'+f1(w[1])+'" rx="1.9" ry=".9" fill="none" stroke="#FFFFFF" stroke-width=".8" opacity=".85"/>'+I.cyl(p[0],p[1],0,.75,3.2,"#7A5534",{noGlint:true})}
  piles.filter(function(p){return p[1]<0}).forEach(function(p){s+=pile(p)});
  /* vigas laterales y tablones */
  s+=box(0,-3.8,3,len,.6,.8,I.shade(W,.15),{noGlint:true});
  for(x=0;x<len;x+=d>0?2.4:4)s+=box(x,-3.6,3.8,d>0?2:3.6,7.2,.55,(Math.round(x/2.4)%3)?W:I.tint(W,.08),{noGlint:true});
  s+=box(0,3.4,3,len,.6,.8,I.shade(W,.2),{noGlint:true});
  piles.filter(function(p){return p[1]>0}).forEach(function(p){s+=pile(p)});
  s+=line([P(0,3.6,4.35),P(len,3.6,4.35),P(len,-3.6,4.35)],I.tint(W,.5),.6,{op:.8});
  return s}

 /* ---------- faro: torre cónica con franjas, balcón con barandal, linterna de cristal y haz, sobre su roca ---------- */
 function lighthouse(o){o=o||{};var d=o.d==null?2:o.d,s="",R=T("#9C9389"),RED=T("#E0434B"),WH=T("#FFFFFF");
  /* roca con espuma */
  s+=foam(ringPts(30,15,24,0,1),{w:2});
  s+=I.ell(0,0,-.5,22,"#0E2A55",{op:.18});
  var rk=[[-30,0],[-26,-6],[-14,-11],[2,-13],[18,-10],[28,-5],[30,1],[16,6],[-4,7],[-22,5]];
  s+='<path d="'+sm(rk)+'" fill="'+R.b+'"/>';
  s+='<path d="'+sm([[-26,-6],[-14,-11],[2,-13],[18,-10],[28,-5],[10,-6],[-8,-5]])+'" fill="'+R.l+'"/>';
  s+='<path d="'+sm([[30,1],[16,6],[2,6],[10,-2],[28,-5]])+'" fill="'+R.s+'"/>';
  /* torre: tronco de cono entre z=4 (r 6) y z=34 (r 4.2), franjas sin costuras */
  function rad(z){return lerp(6,4.2,(z-4)/30)}
  var bands=[[4,10,RED],[10,16,WH],[16,22,RED],[22,28,WH],[28,34,RED]];
  bands.forEach(function(b){var e0=I.cylD(0,-4,b[0],rad(b[0])),e1=I.cylD(0,-4,b[1],rad(b[1])),c=b[2];
   var D="M"+f1(e0.cx-e0.rx)+" "+f1(e0.cy)+"A"+f1(e0.rx)+" "+f1(e0.ry)+" 0 0 0 "+f1(e0.cx+e0.rx)+" "+f1(e0.cy)+"L"+f1(e1.cx+e1.rx)+" "+f1(e1.cy)+"A"+f1(e1.rx)+" "+f1(e1.ry)+" 0 0 1 "+f1(e1.cx-e1.rx)+" "+f1(e1.cy)+"Z";
   var Sd="M"+f1(e0.cx+e0.rx*.25)+" "+f1(e0.cy+e0.ry*.97)+"A"+f1(e0.rx)+" "+f1(e0.ry)+" 0 0 0 "+f1(e0.cx+e0.rx)+" "+f1(e0.cy)+"L"+f1(e1.cx+e1.rx)+" "+f1(e1.cy)+"L"+f1(e1.cx+e1.rx*.25)+" "+f1(e1.cy+e1.ry*.97)+"Z";
   s+='<path d="'+D+'" fill="'+c.b+'" stroke="'+c.b+'" stroke-width=".4"/><path d="'+Sd+'" fill="'+c.s+'"/>'});
  if(d>0){var dr=I.faceL(-1,1.4,6,2,1);var dw=I.cylD(0,-4,5,6);s+='<path d="M'+f1(dw.cx-3)+' '+f1(dw.cy+2.6)+'l0 -5.4q1.6 -2 3.2 0l0 5.4z" fill="#5A4636"/>'}
  /* balcón con barandal */
  var bt=I.cylD(0,-4,34,6.4),bt2=I.cylD(0,-4,35,6.4);
  s+=I.cyl(0,-4,34,6.4,1,"#3A4452",{top:"#56606E",noGlint:true});
  /* linterna */
  var lb=I.cylD(0,-4,35,3.6),lt=I.cylD(0,-4,40,3.6);
  s+='<circle class="iso-halo" cx="'+f1(lt.cx)+'" cy="'+f1(lt.cy+2.4)+'" r="16" fill="url(#isoHalo)"/>';
  s+='<path d="M'+f1(lb.cx-lb.rx)+' '+f1(lb.cy)+'A'+f1(lb.rx)+' '+f1(lb.ry)+' 0 0 0 '+f1(lb.cx+lb.rx)+' '+f1(lb.cy)+'L'+f1(lt.cx+lt.rx)+' '+f1(lt.cy)+'L'+f1(lt.cx-lt.rx)+' '+f1(lt.cy)+'Z" fill="#FFE39A"/>';
  s+='<path d="M'+f1(lb.cx+1)+' '+f1(lb.cy+lb.ry)+'L'+f1(lt.cx+1)+' '+f1(lt.cy+lt.ry)+'M'+f1(lb.cx-lb.rx*.7)+' '+f1(lb.cy+lb.ry*.7)+'L'+f1(lt.cx-lt.rx*.7)+' '+f1(lt.cy+lt.ry*.7)+'M'+f1(lb.cx+lb.rx*.7)+' '+f1(lb.cy+lb.ry*.7)+'L'+f1(lt.cx+lt.rx*.7)+' '+f1(lt.cy+lt.ry*.7)+'" stroke="#3A4452" stroke-width=".7"/>';
  /* barandal: postes y pasamanos por delante */
  if(d>0){var rl="",N=10;for(var i=0;i<=N;i++){var a=Math.PI*i/N,x=bt2.cx+Math.cos(a)*bt2.rx,y=bt2.cy+Math.sin(a)*bt2.ry;rl+='M'+f1(x)+' '+f1(y)+'l0 -2.4'}
   s+='<path d="'+rl+'" stroke="#3A4452" stroke-width=".55"/><path d="M'+f1(bt2.cx-bt2.rx)+' '+f1(bt2.cy-2.4)+'A'+f1(bt2.rx)+' '+f1(bt2.ry)+' 0 0 0 '+f1(bt2.cx+bt2.rx)+' '+f1(bt2.cy-2.4)+'" stroke="#3A4452" stroke-width=".7" fill="none"/>'}
  s+=I.dome(0,-4,40,4.2,"#E0434B")+'<circle cx="'+f1(lt.cx)+'" cy="'+f1(lt.cy-5.6)+'" r=".8" fill="#3A4452"/>';
  /* haz de luz */
  s+='<g class="iso-beam" style="transform-origin:'+f1(lt.cx)+'px '+f1(lt.cy+2.4)+'px"><path d="M'+f1(lt.cx)+' '+f1(lt.cy+2.4)+'L'+f1(lt.cx+120)+' '+f1(lt.cy-14)+'L'+f1(lt.cx+120)+' '+f1(lt.cy+20)+'Z" fill="url(#isoBeam)"/></g>';
  return s}

 /* ---------- velero: casco con proa, cubierta, mástil, vela mayor y foque, estela ---------- */
 function sailboat(o){o=o||{};var d=o.d==null?2:o.d,H=T(o.c||"#E0434B"),s="",DK=T("#D9B07A"),SL=T("#FFF8EC");
  var deck=[[0,-2.6],[6,-3.3],[13,-3.3],[18.5,-2],[22,0],[18.5,2],[13,3.3],[6,3.3],[0,2.6]];
  /* estela y espuma */
  s+='<path d="M'+f1(P(0,-2,0)[0])+' '+f1(P(0,-2,0)[1])+'L'+f1(P(-26,-9,0)[0])+' '+f1(P(-26,-9,0)[1])+'M'+f1(P(0,2,0)[0])+' '+f1(P(0,2,0)[1])+'L'+f1(P(-26,9,0)[0])+' '+f1(P(-26,9,0)[1])+'" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round" opacity=".55" stroke-dasharray="4 3"/>';
  s+=foam(deck.map(function(p){var q=P(p[0]*1.04,p[1]*1.15,0);return q}),{w:1.6});
  var bot=deck.map(function(p){return P(p[0]*.96+.4,p[1]*.78,0)}),top=deck.map(function(p){return P(p[0],p[1],3)});
  /* costado visible (+y) y proa derecha (sombra) */
  var sideL=[];for(var i=4;i<deck.length;i++)sideL.push(i);
  s+='<path d="M'+[4,5,6,7,8].map(function(i){return f1(top[i][0])+" "+f1(top[i][1])}).join("L")+"L"+[8,7,6,5,4].map(function(i){return f1(bot[i][0])+" "+f1(bot[i][1])}).join("L")+'Z" fill="'+H.b+'"/>';
  s+='<path d="M'+[2,3,4].map(function(i){return f1(top[i][0])+" "+f1(top[i][1])}).join("L")+"L"+[4,3,2].map(function(i){return f1(bot[i][0])+" "+f1(bot[i][1])}).join("L")+'Z" fill="'+H.s+'"/>';
  if(d>0)s+='<path d="M'+[8,7,6,5,4].map(function(i){var a=top[i],b=bot[i];return f1(lerp(a[0],b[0],.3))+" "+f1(lerp(a[1],b[1],.3))}).join("L")+'" stroke="#FFFFFF" stroke-width=".9" fill="none"/>';
  s+='<path d="'+pathD(top)+'" fill="'+DK.b+'"/>';
  if(d>1)s+='<path d="'+pathD(deck.map(function(p){return P(p[0]*.86+1.4,p[1]*.7,3)}))+'" fill="'+DK.s+'" opacity=".5"/>';
  /* mástil, vela mayor y foque en el plano vertical del casco */
  var m=P(8,0,3),mt=P(8,0,32);
  s+='<g transform="'+I.planeX(8,0,3)+'"><path d="M-.6 -2Q-4 -14 -7.6 -2.4Z" fill="none"/>'+
   '<path d="M.6 -2.6L.6 -28Q-4 -14 -7.4 -2.4Z" fill="'+SL.b+'"/><path d="M.6 -2.6L.6 -28Q-1.2 -16 -2.2 -2.5Z" fill="'+SL.s+'" opacity=".55"/>'+
   '<path d="M1.2 -26L13.4 -.8L1.4 -1.6Z" fill="'+SL.l+'"/><path d="M1.2 -26L13.4 -.8L8 -1.1Z" fill="'+SL.s+'" opacity=".7"/>'+
   '<path d="M-7.6 -2.2L.6 -2.2" stroke="#5A4636" stroke-width=".8"/></g>';
  s+='<path d="M'+f1(m[0])+' '+f1(m[1])+'L'+f1(mt[0])+' '+f1(mt[1])+'" stroke="#5A4636" stroke-width="1"/>';
  if(d>0)s+='<path d="M'+f1(mt[0])+' '+f1(mt[1])+'l3 1.4l-3 1.4z" fill="'+H.b+'"/>';
  return s}

 /* ---------- transbordador: casco largo con proa, cabina con ventanas, chimenea y estela ---------- */
 function ferry(o){o=o||{};var d=o.d==null?2:o.d,s="",H=T("#E0434B"),WH=T("#FFFFFF");
  var deck=[[0,-5],[26,-5],[32,0],[26,5],[0,5]];
  s+='<path d="M'+f1(P(0,-4,0)[0])+' '+f1(P(0,-4,0)[1])+'L'+f1(P(-30,-12,0)[0])+' '+f1(P(-30,-12,0)[1])+'M'+f1(P(0,4,0)[0])+' '+f1(P(0,4,0)[1])+'L'+f1(P(-30,12,0)[0])+' '+f1(P(-30,12,0)[1])+'" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" opacity=".55"/>';
  s+=foam(deck.map(function(p){return P(p[0]*1.03-.4,p[1]*1.15,0)}),{w:1.8});
  var bot=deck.map(function(p){return P(p[0]*.97+.5,p[1]*.86,0)}),top=deck.map(function(p){return P(p[0],p[1],4.4)});
  s+='<path d="M'+[2,3,4].map(function(i){return f1(top[i][0])+" "+f1(top[i][1])}).join("L")+"L"+[4,3,2].map(function(i){return f1(bot[i][0])+" "+f1(bot[i][1])}).join("L")+'Z" fill="'+H.b+'"/>';
  s+='<path d="M'+[1,2].map(function(i){return f1(top[i][0])+" "+f1(top[i][1])}).join("L")+"L"+[2,1].map(function(i){return f1(bot[i][0])+" "+f1(bot[i][1])}).join("L")+'Z" fill="'+H.s+'"/>';
  s+='<path d="M'+[2,3,4].map(function(i){var a=top[i],b=bot[i];return f1(lerp(a[0],b[0],.32))+" "+f1(lerp(a[1],b[1],.32))}).join("L")+'" stroke="#FFFFFF" stroke-width="1.1" fill="none"/>';
  s+='<path d="'+pathD(top)+'" fill="#DCE1E6"/>';
  s+=box(5,-3.6,4.4,17,7.2,5,"#FFFFFF",{right:"#D8DEE4",left:"#F7F8FA"});
  var L=I.faceL(5,-3.6,4.4,17,7.2),R=I.faceR(5,-3.6,4.4,17,7.2);
  for(var x=1.4;x<16;x+=d>0?2.6:4.2)s+=I.quad(L,x,2,1.6,1.8,"#3E6E9A",{st:false});
  for(x=1.2;x<7;x+=2.6)s+=I.quad(R,x,2,1.6,1.8,"#2F5A82",{st:false});
  s+=box(8,-2.6,9.4,8,5.2,2.6,"#FFFFFF",{right:"#D8DEE4",left:"#F7F8FA"});
  if(d>0)s+=I.quad(I.faceR(8,-2.6,9.4,8,5.2),.8,.8,3.6,1.2,"#2F5A82",{st:false});
  s+=I.cyl(18,0,9.4,1.6,6,"#F2B544",{noGlint:true})+I.cyl(18,0,14.2,1.62,1.4,"#2B323A",{top:"#2B323A",noGlint:true});
  if(d>1){var ch=P(18,0,16);s+='<circle class="iso-smoke" cx="'+f1(ch[0]+1)+'" cy="'+f1(ch[1]-2)+'" r="2.4" fill="#FFFFFF" opacity=".75"/>'}
  return s}

 /* ---------- ballena: solo el lomo y la cabeza fuera del agua, una sola forma ---------- */
 function whale(o){o=o||{};var d=o.d==null?2:o.d,s="",B=T("#4D7097");
  /* sombra del cuerpo bajo el agua y ondas */
  var c=P(0,0,0);
  s+='<g transform="'+I.planeG(0,0,0)+'"><ellipse cx="0" cy="0" rx="18" ry="6" fill="#0E2A55" opacity=".22"/></g>';
  s+=ripple(16,{x:c[0],y:c[1]+1,n:d>0?2:1});
  /* lomo y cabeza que asoman: una sola silueta en el plano vertical del cuerpo; la cabeza va hacia el frente derecho */
  var BODY="M-22 0C-18 -2.2 -12 -6.6 -2 -8.4C6 -9.6 13 -8.8 17.6 -6.2C20.8 -4.3 22.6 -2.1 23 0Z";
  var FIN="M-6.6 -6.8C-7.8 -8.8 -9.6 -10.2 -12 -10.8C-11.2 -9 -11.4 -7.2 -12.4 -5.4Z";
  var inner='<path d="M-24 -2C-14 -6.6 2 -8.4 12 -7.4C16 -7 20 -5.4 24 -2.6L24 -12L-24 -12Z" fill="'+B.l+'"/>';
  inner+='<path d="M8 0C11 -2 15 -2.8 19 -2.4C21 -2.2 22.4 -1.2 23.4 0Z" fill="#DCE6EE"/>';
  inner+='<path d="M-24 -.6C-14 -2.6 -2 -3.2 8 -2.4L8 1L-24 1Z" fill="'+B.s+'" opacity=".55"/>';
  if(d>1)inner+='<path d="M-6 -7.2C2 -8.6 10 -8.2 15 -6.4" stroke="'+B.h+'" stroke-width=".8" fill="none" stroke-linecap="round"/>';
  var body=shaded(FIN,B.s,'')+shaded(BODY,B.b,inner);
  if(d>0)body+='<ellipse cx="15.6" cy="-3.6" rx=".8" ry=".7" fill="#13213F"/><path d="M22.6 -.8Q18 -1.6 13.4 -1.2" stroke="'+B.d+'" stroke-width=".5" fill="none" stroke-linecap="round"/>';
  s+='<g transform="'+I.planeX(0,0,0)+' scale(.78 1.45)">'+body+
   /* espuma solo en la línea de flotación de enfrente */
   '<path d="M-23 .4C-14 1.6 -2 1.8 8 1.4C14 1.2 19 1 24 .4" stroke="#FFFFFF" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".95"/>'+
   (d>0?'<path d="M-25 .2q1.4 -1.2 2.8 -.2M23.6 .2q1.6 -1.4 3 0" stroke="#FFFFFF" stroke-width="1.1" fill="none" stroke-linecap="round"/>':'')+
   /* chorro en abanico desde lo alto de la cabeza */
   '<g class="iso-spout" style="transform-origin:12px -8.6px"><path d="M12 -8.8q-4 -4 -9 -5M12 -8.8q-.6 -5 -1.4 -7.2M12 -8.8q2.4 -4.6 6.4 -5.8" stroke="#FFFFFF" stroke-width="1.5" fill="none" stroke-linecap="round"/>'+(d>0?'<ellipse cx="2.6" cy="-14.2" rx=".9" ry=".6" fill="#FFFFFF"/><ellipse cx="10.4" cy="-16.8" rx=".9" ry=".6" fill="#FFFFFF"/><ellipse cx="19" cy="-15.2" rx=".8" ry=".55" fill="#FFFFFF"/>':'')+'</g></g>';
  /* cola a lo lejos, unida por la estela */
  if(d>0&&o.tail!==false){var tp=P(-34,-8,0),st=P(-22,0,0);
   s+='<path d="M'+f1(st[0])+' '+f1(st[1])+'L'+f1(tp[0])+' '+f1(tp[1])+'" stroke="#FFFFFF" stroke-width="1.3" stroke-dasharray="3 3" stroke-linecap="round" opacity=".6"/>';
   s+=ripple(4.4,{x:tp[0],y:tp[1],n:1})+'<g transform="'+I.planeY(-34,-8,0)+'">'+shaded("M0 0C-.6 -3 -1 -5 -1.6 -7C-4 -8.2 -7 -8.6 -8.4 -10.6C-5.4 -10.4 -2.6 -9.6 0 -8.4C2.6 -9.6 5.4 -10.4 8.4 -10.6C7 -8.6 4 -8.2 1.6 -7C1 -5 .6 -3 0 0Z",B.b,'<path d="M0 0L0 -9L10 -12L10 2Z" fill="'+B.s+'"/>')+'<path d="M-3 .3q3 1 6 0" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round"/></g>'}
  return s}
 /* ---------- delfín: una sola silueta curva saltando en arco ---------- */
 var DOLPH="M24 6.4C23 5.8 22.4 5 21.6 4.2C20.6 2.6 19.6 1.2 18.2 .2C15.4 -1.8 12 -3 8.6 -3.2L6.6 -6.6C6.3 -7.1 5.6 -7 5.6 -6.4L5.2 -3C2.6 -2.6 .2 -1.4 -1.8 .1C-3.4 1.3 -4.8 2.6 -5.9 3.5C-7.3 2.5 -8.7 1.5 -10.3 1C-9.9 2.5 -9.3 3.7 -8.5 4.7C-8.9 6.1 -9 7.5 -8.7 8.9C-7.5 7.9 -6.3 6.5 -5.3 5.4C-2.6 5.6 .6 5.8 3.8 6C7 6.3 9.6 6.6 11.8 6.8L12 9.6C12.1 10.2 12.8 10.3 13.1 9.8L14.8 6.9C17 7 19 7.2 20.6 7.2C21.9 7.2 23.1 7 24 6.4Z";
 function dolphin(o){o=o||{};var d=o.d==null?2:o.d,rot=o.rot==null?0:o.rot,B=T("#5F84AC"),s="";
  var inner='<path d="M-10 4.2C-3 4.2 4 4.4 10 4.8C15 5.1 19 5.8 25 6L25 12L-10 12Z" fill="#E6EEF4"/><path d="M-10 -1C-2 -3.4 8 -4 14 -1.6C17 -.6 19 .6 21 2L26 -10L-10 -10Z" fill="'+B.s+'" opacity=".55"/>';
  if(d>1)inner+='<path d="M-.8 -.4C3 -2.2 9 -2.6 13.4 -1.4" stroke="'+B.h+'" stroke-width=".7" fill="none" stroke-linecap="round"/>';
  var body=shaded(DOLPH,B.b,inner)+(d>0?'<circle cx="19.2" cy="3" r=".65" fill="#13213F"/><path d="M20.2 6.2Q22.4 6.6 24 6.4" stroke="'+B.d+'" stroke-width=".45" fill="none"/>':'');
  return '<g transform="rotate('+rot+') scale('+(o.k||.62)+')">'+body+'</g>'}
 /* grupo de delfines a distintas alturas del salto, con salpicadura donde entran y salen */
 function dolphins(o){o=o||{};var d=o.d==null?2:o.d,s="";
  function splash(x,y){var w=P(x,y,0),r="";r+=ripple(4,{x:w[0],y:w[1],n:2});r+='<path d="M'+f1(w[0]-3)+' '+f1(w[1])+'q-1 -3 -2.4 -4M'+f1(w[0])+' '+f1(w[1]-.6)+'q0 -3.4 .4 -5M'+f1(w[0]+3)+' '+f1(w[1])+'q1.4 -2.6 2.6 -3.4" stroke="#FFFFFF" stroke-width="1" fill="none" stroke-linecap="round"/>';if(d>0)r+='<circle cx="'+f1(w[0]-4.4)+'" cy="'+f1(w[1]-5)+'" r=".6" fill="#FFFFFF"/><circle cx="'+f1(w[0]+5)+'" cy="'+f1(w[1]-4.4)+'" r=".55" fill="#FFFFFF"/>';return r}
  [[0,0,9,-14],[14,8,5,28],[-12,6,5,-38]].slice(0,d>0?3:2).forEach(function(q){var x=q[0],y=q[1],z=q[2];
   s+=splash(x-6,y)+(z<4?splash(x+8,y):"");
   s+='<g transform="'+I.planeX(x,y,z)+'">'+dolphin({d:d,rot:q[3]})+'</g>'});
  return s}
 function gull(o){o=o||{};return '<path class="iso-gull" d="M-6 0q3 -3.4 6 -.4q3 -3 6 .4" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"/><path d="M-6 0q3 -3.4 6 -.4" fill="none" stroke="#2B3F5C" stroke-width=".5" opacity=".35"/>'}

 /* ---------- nube: base plana en sombra y cumbre iluminada ---------- */
 function cloud(o){o=o||{};var k=o.k||1,d=o.d==null?2:o.d,ph=o.ph||.2,s="";
  var rx=20*k,ry=11*k,D=blob(0,-ry*.5,rx,ry,5,ph,.32,.5);
  var inner='<path d="M'+f1(-rx*1.2)+' '+f1(-ry*.5)+'L'+f1(rx*1.2)+' '+f1(-ry*.5)+'L'+f1(rx*1.2)+' '+f1(ry)+'L'+f1(-rx*1.2)+' '+f1(ry)+'Z" fill="#CFDCEA"/>';
  inner+='<path d="'+blob(-4*k,-ry*.86,rx*.62,ry*.6,4,ph+.5,.3)+'" fill="#FFFFFF"/>';
  if(d>0)inner+='<path d="M'+f1(-rx*.95)+' '+f1(-ry*.4)+'Q'+f1(-rx*.5)+' '+f1(-ry*.2)+' 0 '+f1(-ry*.38)+'Q'+f1(rx*.5)+' '+f1(-ry*.2)+' '+f1(rx*.95)+' '+f1(-ry*.4)+'" stroke="#E2EAF2" stroke-width="'+f1(1.4*k)+'" fill="none"/>';
  s+=shaded(D,"#EEF3F8",inner);
  return s}

 /* ---------- rosa de los vientos: disco flotante con grosor y onda ---------- */
 function compass(o){o=o||{};var d=o.d==null?2:o.d,s="",G="#F2B544",N="#E0434B",Dk="#14323F";
  s+=ripple(30,{x:0,y:2,n:2});
  s+=I.cyl(0,0,0,26,1.6,"#E9DFC8",{top:"#FFF8E8",side:"#D9CBAA",sideS:"#BFAE8A",noGlint:true});
  var r='<circle r="34" fill="none" stroke="'+Dk+'" stroke-width="1.4"/>'+(d>0?'<circle r="28" fill="none" stroke="'+Dk+'" stroke-width=".7" stroke-dasharray="1.4 2.8"/>':'');
  for(var i=0;i<8;i++){var a=i*Math.PI/4-Math.PI/2,L=i%2?17:30,w=i%2?4:6,c=Math.cos(a),sn=Math.sin(a),px=-sn*w,py=c*w;
   r+='<path d="M0 0L'+f1(px)+' '+f1(py)+'L'+f1(c*L)+' '+f1(sn*L)+'Z" fill="'+(i===0?N:i%2?"#C9B48C":G)+'"/><path d="M0 0L'+f1(-px)+' '+f1(-py)+'L'+f1(c*L)+' '+f1(sn*L)+'Z" fill="'+(i===0?I.shade(N,.25):i%2?"#A98F67":I.shade(G,.25))+'"/>'}
  r+='<circle r="3" fill="'+Dk+'"/>';
  var c=P(0,0,1.6);s+='<g transform="matrix(.52 .26 -.52 .26 '+f1(c[0])+' '+f1(c[1])+')">'+r+'</g>';
  if(d>0){var n=P(-21,-21,1.6);s+='<text x="'+f1(n[0])+'" y="'+f1(n[1]+2)+'" font-size="7" font-weight="800" fill="'+Dk+'" text-anchor="middle">N</text>'}
  return s}

 /* defs compartidos: halo de lámparas y haz del faro */
 var DEFS='<radialGradient id="isoHalo"><stop offset="0" stop-color="#FFE7A0" stop-opacity=".85"/><stop offset="1" stop-color="#FFE7A0" stop-opacity="0"/></radialGradient><linearGradient id="isoBeam2" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FFF3B0" stop-opacity=".7"/><stop offset="1" stop-color="#FFF3B0" stop-opacity="0"/></linearGradient><linearGradient id="isoBeam" x1="0" x2="1"><stop offset="0" stop-color="#FFF3B0" stop-opacity=".75"/><stop offset="1" stop-color="#FFF3B0" stop-opacity="0"/></linearGradient>';

 function one(k,o){switch(k){
  case "treeRound":return treeRound(o);case "treePine":return treePine(o);case "palm":return palm(o);case "bush":return bush(o);case "flowers":return flowers(o);
  case "rock":return rock(o);case "bench":return bench(o);case "lamp":return lamp(o);case "signpost":return signpost(o);case "crate":return crate(o);case "cone":return cone(o);}return ""}
 /* el resto (edificios de reserva) se toma de la versión anterior mientras se rehace en la siguiente etapa */
 return {treeRound:treeRound,treePine:treePine,palm:palm,bush:bush,flowers:flowers,rock:rock,bench:bench,lamp:lamp,signpost:signpost,crate:crate,cone:cone,
  pier:pier,lighthouse:lighthouse,sailboat:sailboat,ferry:ferry,whale:whale,dolphin:dolphin,dolphins:dolphins,gull:gull,cloud:cloud,compass:compass,
  foam:foam,ripple:ripple,ringPts:ringPts,one:one,DEFS:DEFS,
  generic:function(b,c,s){return ENV0.generic(b,c,s)},BIOME:ENV0.BIOME};
})(ISO);
