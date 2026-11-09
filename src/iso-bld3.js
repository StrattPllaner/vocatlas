/* ================= carreras restantes: estructura isométrica =================
   Mismo sistema que las demás: plataforma, luz arriba a la izquierda, ensamblador por profundidad y huella por parte. */
(function(I,E,H){
 var P=I.P,box=I.box,quad=I.quad,win=I.win,cyl=I.cyl,poly=I.poly,line=I.line,T=I.T,f1=I.f1;
 var Z=H.Z,GLASS=H.GLASS,FRAME=H.FRAME,WALL=H.WALL,piece=H.piece,dp=H.dp,at=H.at,plat=H.plat;
 function sh(x,y,w,d,h){return I.shadowBox(x,y,Z,w,d,h)}
 function windows(F,w,h,cols,rows,u0,v0,ww,wh,gx,gy,d){var s="";if(d===0)return quad(F,u0,v0,w-2*u0,h-v0-4,I.shade(GLASS,.1),{st:false});
  for(var r=0;r<rows;r++)for(var c=0;c<cols;c++)s+=win(F,u0+c*gx,v0+r*gy,ww,wh,GLASS,FRAME);return s}
 function door(F,u,w,h,col){return quad(F,u,0,w,h,col||"#7A5236",{st:false})+line([F(u+w/2,0),F(u+w/2,h)],"#00000033",.5,{cap:"butt"})}
 /* letrero sobre el techo: tablero con grosor en dos postes, con un dibujo encima */
 function roofSign(x,y,z,w,col,icon){var s=I.cyl(x+2,y+1,z,.5,4,"#5A6573",{noGlint:true})+I.cyl(x+w-2,y+1,z,.5,4,"#5A6573",{noGlint:true});
  s+=box(x,y,z+4,w,1.6,9,"#FFFFFF",{left:"#FFFFFF",right:"#D7DDE3",top:"#F2F5F7"});var F=I.faceL(x,y,z+4,w,1.6);
  return s+quad(F,.8,.8,w-1.6,7.4,col,{st:false})+(icon?icon(F,w):"")}

 /* ---------- Psicología: consultorio tranquilo con techo a dos aguas, ventana redonda y banca ---------- */
 function psicologia_s(d){
  var g=plat("#A6D9C7","#5E9C8C"),s="",x=-24,y=-20,w=30,dd=24,h=18,TL="#4BAAA3";
  if(d>0)g+=I.walk(-2,44,-2,22,8,"#EFE4CC");
  s+=sh(x,y,w,dd,h+12)+box(x,y,Z,w,dd,h,"#F6F1EA",{left:"#F3EDE4",right:"#D8D1C6",top:"#FFFDF8"});
  var L=I.faceL(x,y,Z,w,dd),R=I.faceR(x,y,Z,w,dd);
  s+=quad(L,0,0,w,2.6,"#BFE3DA",{st:false})+quad(R,0,0,dd,2.6,"#9CCFC3",{st:false});
  s+=I.gable(x,y,Z+h,w,dd,11,TL,{ov:2,th:1.8});
  s+=door(L,w/2-3.5,7,11,"#5E8F86");
  var c=L(w/2,15);s+='<circle cx="'+f1(c[0])+'" cy="'+f1(c[1])+'" r="2.6" fill="'+FRAME+'"/><circle cx="'+f1(c[0])+'" cy="'+f1(c[1])+'" r="1.9" fill="'+GLASS+'"/>';
  s+=windows(L,w,h,2,1,3,6,6,6,w-12,0,d)+windows(R,dd,h,2,1,4,6,6,6,10,0,d);
  /* letrero con una nube de pensamiento */
  s+=roofSign(x+w/2-7,y+dd/2,Z+h+8,14,"#E7F5F3",function(F,w2){var p=F(w2/2,4.4);return '<path d="M'+f1(p[0]-3.4)+' '+f1(p[1]+1)+'a1.8 1.8 0 0 1 1.4 -3a2.2 2.2 0 0 1 4 -.4a1.8 1.8 0 0 1 1.6 3.4z" fill="'+TL+'"/><circle cx="'+f1(p[0]-3.6)+'" cy="'+f1(p[1]+2.6)+'" r=".6" fill="'+TL+'"/>'});
  return piece(g,[["consultorio",[x-2,y-2,x+w+2,y+dd+2],s],d>0?dp("bench",16,20,{d:d}):null,d>0?dp("treeRound",18,-18,{k:.6,d:d}):null,d>1?dp("flowers",-30,22,{k:.8,d:d}):null]);
 }

 /* ---------- Ing. Civil: edificio en obra con estructura y grúa torre ---------- */
 function civil_s(d){
  var g=plat("#D8CBA8","#9A8660"),s="",x=-24,y=-18,w=26,dd=22,ST="#8C96A3",OR="#E8603C";
  s+=sh(x,y,w,dd,30);
  /* planta baja terminada y pisos de estructura con losas */
  s+=box(x,y,Z,w,dd,10,"#E9E2D4",{left:"#E6DED0",right:"#C9BFAF"});var L=I.faceL(x,y,Z,w,dd);s+=windows(L,w,10,3,1,2.4,3,5,4.6,8,0,d);
  for(var f=1;f<=2;f++){var z=Z+10+(f-1)*9;
   [[0,0],[w-1.6,0],[0,dd-1.6],[w-1.6,dd-1.6]].forEach(function(q){s+=box(x+q[0],y+q[1],z,1.6,1.6,9,ST,{noGlint:true})});
   s+=box(x-.6,y-.6,z+8,w+1.2,dd+1.2,1.4,"#B8BEC6",{top:"#D5DADF"})}
  if(d>0)s+=line([I.faceL(x,y,Z+19,w,dd)(1.6,-8),I.faceL(x,y,Z+19,w,dd)(w-1.6,0)],OR,.6,{cap:"butt"});
  /* grúa torre: mástil, pluma, contrapluma, gancho */
  var mx=16,my=-14,cr="";cr+=sh(mx,my,3,3,40)+box(mx,my,Z,3,3,40,"#F2B544",{left:"#F2B544",right:"#C99227",top:"#FBD27A"});
  var M=I.faceL(mx,my,Z,3,3);if(d>0)for(var v=2;v<38;v+=4)cr+=line([M(0,v),M(3,v+4)],"#B07E1C",.45,{cap:"butt"});
  cr+=box(mx-22,my+.5,Z+40,32,2,2,"#F2B544",{left:"#F2B544",right:"#C99227",top:"#FBD27A"})+box(mx+6,my-1,Z+38.6,4,5,3,"#5A6573",{noGlint:true});
  var hk=P(mx-16,my+1.5,Z+40),hk2=P(mx-16,my+1.5,Z+26);cr+='<path d="M'+f1(hk[0])+' '+f1(hk[1])+'V'+f1(hk2[1])+'" stroke="#3A4452" stroke-width=".6"/><path d="M'+f1(hk2[0]-1)+' '+f1(hk2[1])+'q1 2.2 2 0" stroke="#3A4452" stroke-width=".9" fill="none"/>';
  var cn="";if(d>0)[[24,16],[30,10]].forEach(function(q){cn+=at(q[0],q[1],Z,E.one("cone",{d:d}))});
  return piece(g,[["obra",[x-.6,y-.6,x+w+.6,y+dd+.6],s],["grúa",[mx-1,my-1,mx+10,my+4],cr],d>0?["conos",[21,7,33,19],cn]:null,d>1?dp("crate",-30,20,{d:d}):null]);
 }

 /* ---------- Mecatrónica: fábrica con techo de dientes de sierra y brazo robótico ---------- */
 function mecatronica_s(d){
  var g=plat("#C9D6A6","#8C9C62"),s="",x=-26,y=-18,w=32,dd=22,h=13,BL="#5B6B7C";
  s+=sh(x,y,w,dd,h+10)+box(x,y,Z,w,dd,h,"#E6E9EC",{left:"#E2E6EA",right:"#BCC4CC",noTop:true});
  var L=I.faceL(x,y,Z,w,dd);s+=windows(L,w,h,4,1,2,4,5,4.4,7.6,0,d)+door(L,w-8,6,8,"#4C5866");
  /* dientes de sierra: cuatro faldones con vidrio hacia la izquierda */
  for(var k=0;k<4;k++){var x0=x+k*8;s+=poly([P(x0,y,Z+h),P(x0+8,y,Z+h),P(x0+8,y,Z+h+6),P(x0,y,Z+h)],"#7F8C99")+poly([P(x0,y,Z+h),P(x0+8,y,Z+h+6),P(x0+8,y+dd,Z+h+6),P(x0,y+dd,Z+h)],"#A9B4BF")+poly([P(x0+8,y,Z+h),P(x0+8,y+dd,Z+h),P(x0+8,y+dd,Z+h+6),P(x0+8,y,Z+h+6)],GLASS)}
  /* chimenea */
  s+=I.cyl(x+4,y+4,Z+h,1.6,10,"#C9573F",{noGlint:true});
  /* brazo robótico: base, dos segmentos y pinza */
  var ax=16,ay=10,ar=I.shadowEll(ax,ay,Z,4)+I.cyl(ax,ay,Z,4,2.4,"#F2894F",{top:"#F6A774"})+I.cyl(ax,ay,Z+2.4,2,3,"#5B6B7C",{noGlint:true});
  var j0=P(ax,ay,Z+5.4),j1=P(ax-3,ay-3,Z+15),j2=P(ax-9,ay-8,Z+11);
  ar+='<path d="M'+f1(j0[0])+' '+f1(j0[1])+'L'+f1(j1[0])+' '+f1(j1[1])+'L'+f1(j2[0])+' '+f1(j2[1])+'" stroke="#E36F32" stroke-width="3.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'+
   '<path d="M'+f1(j0[0]-.5)+' '+f1(j0[1])+'L'+f1(j1[0]-.5)+' '+f1(j1[1])+'" stroke="#F6A774" stroke-width="1" stroke-linecap="round"/>'+
   '<circle cx="'+f1(j1[0])+'" cy="'+f1(j1[1])+'" r="1.8" fill="'+BL+'"/><circle cx="'+f1(j0[0])+'" cy="'+f1(j0[1])+'" r="1.8" fill="'+BL+'"/>'+
   '<path d="M'+f1(j2[0])+' '+f1(j2[1])+'l-2.2 1.6M'+f1(j2[0])+' '+f1(j2[1])+'l-1 2.6" stroke="'+BL+'" stroke-width="1.2" stroke-linecap="round"/>';
  var cj=d>0?box(22,-8,Z,6,6,4,"#C99A5B",{noGlint:true})+box(22,-1,Z,6,5,3,"#C99A5B",{noGlint:true}):"";
  return piece(g,[["fábrica",[x,y,x+w,y+dd],s],["brazo",[11,5,21,15],ar],d>0?["cajas",[21,-9,29,5],cj]:null,d>1?dp("bush",-32,20,{k:.5,d:d}):null]);
 }

 /* ---------- Aeroespacial: cohete en su plataforma con torre de servicio y antena ---------- */
 function aeroespacial_s(d){
  var g=plat("#C9D3DC","#7E8B98"),s="";
  s+=box(-16,-16,Z,22,22,3,"#9AA5B1",{top:"#BAC3CC"})+(d>0?line([P(-14,-5,Z+3.1),P(4,-5,Z+3.1)],"#F2B544",1.2,{cap:"butt",dash:"3 2"}):"");
  /* cohete: cuerpo cilíndrico, franja, ventana, punta y aletas */
  var cx=-5,cy=-5,rk="";rk+=I.cyl(cx,cy,Z+3,4.4,26,"#F4F6F8",{top:"#FFFFFF",sideS:"#CDD3DA"});
  var b=I.cylD(cx,cy,Z+12,4.4);rk+='<rect x="'+f1(b.cx-b.rx)+'" y="'+f1(b.cy-2)+'" width="'+f1(b.rx*2)+'" height="2.6" fill="#E2434B"/>';
  var wn=P(cx+2,cy+4.4,Z+21);rk+='<circle cx="'+f1(wn[0])+'" cy="'+f1(wn[1])+'" r="1.8" fill="#5A6573"/><circle cx="'+f1(wn[0])+'" cy="'+f1(wn[1])+'" r="1.2" fill="'+GLASS+'"/>';
  var tp=P(cx,cy,Z+29),tb=I.cylD(cx,cy,Z+29,4.4);rk+='<path d="M'+f1(tb.cx-tb.rx)+' '+f1(tb.cy)+'Q'+f1(tp[0]-1)+' '+f1(tp[1]-9)+' '+f1(tp[0])+' '+f1(tp[1]-12)+'Q'+f1(tp[0]+1)+' '+f1(tp[1]-9)+' '+f1(tb.cx+tb.rx)+' '+f1(tb.cy)+'Z" fill="#E2434B"/><path d="M'+f1(tp[0])+' '+f1(tp[1]-12)+'Q'+f1(tp[0]+1)+' '+f1(tp[1]-9)+' '+f1(tb.cx+tb.rx)+' '+f1(tb.cy)+'L'+f1(tp[0]+1)+' '+f1(tb.cy)+'Z" fill="#B8303A"/>';
  var fb=P(cx,cy+4.4,Z+3);rk+='<path d="M'+f1(fb[0]-1.6)+' '+f1(fb[1]-7)+'L'+f1(fb[0]-1.6)+' '+f1(fb[1]+1)+'L'+f1(fb[0]+3)+' '+f1(fb[1]+3)+'L'+f1(fb[0]+2)+' '+f1(fb[1]-3)+'Z" fill="#E2434B"/>';
  var fl=P(cx-4.4,cy,Z+3);rk+='<path d="M'+f1(fl[0]+1)+' '+f1(fl[1]-7)+'L'+f1(fl[0]-3)+' '+f1(fl[1]+1)+'L'+f1(fl[0]+1)+' '+f1(fl[1]+1)+'Z" fill="#C8303A"/>';
  /* torre de servicio */
  var tw=sh(8,-14,4,4,34)+box(8,-14,Z,4,4,35,"#E2434B",{left:"#E2434B",right:"#B8303A",top:"#F07A80"});var TF=I.faceL(8,-14,Z,4,4);
  if(d>0)for(var v=2;v<30;v+=4)tw+=line([TF(0,v),TF(4,v+4)],"#8E2731",.5,{cap:"butt"});
  tw+=box(-.6,-12.6,Z+24,8.6,1.4,1.2,"#9AA5B1",{noGlint:true});
  /* edificio de control con antena parabólica */
  var cb=sh(16,10,12,10,10)+box(16,10,Z,12,10,8,"#E6ECF0",{left:"#E6ECF0",right:"#BAC6D0"});var CF=I.faceL(16,10,Z,12,10);cb+=quad(CF,2,3,8,3,"#4C7FA8",{st:false});
  if(d>0){var dc=P(22,15,Z+8);cb+=I.cyl(22,15,Z+8,.5,3,"#5A6573",{noGlint:true})+'<g transform="translate('+f1(dc[0])+' '+f1(dc[1]-4)+') rotate(-30)"><ellipse rx="4" ry="2.2" fill="#F2F5F7"/><ellipse rx="3" ry="1.4" fill="#D5DCE3"/><path d="M0 0l2 -3" stroke="#5A6573" stroke-width=".5"/></g>'}
  return piece(g,[["plataforma y cohete",[-16,-16,6,6],rk],["torre",[8,-14,12,-10],tw],["control",[16,10,28,20],cb],d>1?dp("rock",-30,20,{k:.6,d:d}):null]);
 }

 /* ---------- Ing. Ambiental: aerogenerador, paneles solares y casa con techo verde ---------- */
 function ambiental_s(d){
  var g=plat("#A6D97A","#6FA34B"),s="";
  /* casa con techo de pasto */
  var x=-26,y=-6,w=20,dd=16,h=10;s+=sh(x,y,w,dd,h+8)+box(x,y,Z,w,dd,h,"#F3EBDC",{left:"#EFE6D5",right:"#CFC4B0"});
  var L=I.faceL(x,y,Z,w,dd);s+=door(L,w/2-2.5,5,7,"#6B4A2C")+windows(L,w,h,2,1,2,3,4.4,4,11.6,0,d);
  s+=I.gable(x,y,Z+h,w,dd,7,"#6FB84E",{ov:1.6,th:1.6});
  /* aerogenerador */
  var tx=-6,ty=-22,tb=I.shadowEll(tx,ty,Z,3)+I.cyl(tx,ty,Z,2.2,2,"#D5DCE3",{noGlint:true})+I.cyl(tx,ty,Z+2,1,40,"#F4F6F8",{sideS:"#CDD3DA",noGlint:true});
  var hb=P(tx,ty,Z+42);tb+='<g transform="translate('+f1(hb[0])+' '+f1(hb[1])+')"><g class="iso-beam" style="animation-duration:5s">'+[0,120,240].map(function(a){return '<path d="M0 0L-1.4 -15Q0 -17 1.4 -15Z" fill="#FFFFFF" stroke="#C9D1DA" stroke-width=".5" transform="rotate('+a+')"/>'}).join("")+'</g><circle r="1.8" fill="#C9D1DA"/><circle r="1" fill="#FFFFFF"/></g>';
  /* paneles solares inclinados */
  var sp="";[[6,-16],[6,-6],[6,4]].forEach(function(q){var a=P(q[0],q[1],Z+2),b2=P(q[0]+12,q[1],Z+2),c=P(q[0]+12,q[1]+7,Z+6),e=P(q[0],q[1]+7,Z+6);
   sp+=I.cyl(q[0]+6,q[1]+5,Z,.6,4,"#5A6573",{noGlint:true})+poly([a,b2,c,e],"#2D5C8A",{st:"#C9D1DA",sw:.6});if(d>0)for(var k=1;k<4;k++){var m1=P(q[0]+k*3,q[1],Z+2),m2=P(q[0]+k*3,q[1]+7,Z+6);sp+=line([m1,m2],"#6FA0CF",.4,{cap:"butt"})}});
  return piece(g,[["casa",[x-1.6,y-1.6,x+w+1.6,y+dd+1.6],s],["aerogenerador",[tx-3,ty-3,tx+3,ty+3],tb],["paneles",[6,-16,18,11],sp],d>0?dp("treeRound",26,22,{k:.55,d:d}):null,d>1?dp("flowers",-10,30,{k:.8,d:d}):null]);
 }

 /* ---------- Biotecnología: laboratorio con cúpula de vidrio y letrero de ADN ---------- */
 function biotec_s(d){
  var g=plat("#86D49A","#4F9A68"),s="",x=-24,y=-18,w=30,dd=24,h=16;
  s+=sh(x,y,w,dd,h+16)+box(x,y,Z,w,dd,h,"#F2F6F8",{left:"#EEF3F6",right:"#C6D2DA",top:"#FFFFFF"});
  var L=I.faceL(x,y,Z,w,dd),R=I.faceR(x,y,Z,w,dd);s+=quad(L,0,h-3,w,3,"#2D6A8A",{st:false})+quad(R,0,h-3,dd,3,"#22526B",{st:false});
  s+=windows(L,w,h,4,1,2.4,4,4.6,6,7,0,d)+windows(R,dd,h,3,1,2.4,4,4.6,6,7,0,d)+door(L,w/2-2.5,5,8,"#2D6A8A");
  s+=I.dome(x+w/2,y+dd/2,Z+h,9,"#9FD6EE",{op:.95});
  if(d>0){var c=P(x+w/2,y+dd/2,Z+h);s+='<path d="M'+f1(c[0]-9)+' '+f1(c[1])+'Q'+f1(c[0])+' '+f1(c[1]-14)+' '+f1(c[0]+9)+' '+f1(c[1])+'M'+f1(c[0])+' '+f1(c[1]-12.8)+'V'+f1(c[1]+4)+'" stroke="#FFFFFF" stroke-width=".5" fill="none" opacity=".7"/>'}
  /* tótem de ADN: dos hebras y peldaños */
  var dx=16,dy=10,dn=I.shadowEll(dx,dy,Z,3)+I.cyl(dx,dy,Z,3,2,"#2D6A8A",{top:"#4F8EAE"}),b=P(dx,dy,Z+2),h1="",h2="",st="";
  for(var t=0;t<=24;t+=1){var yy=b[1]-t,a=t/24*Math.PI*3,x1=b[0]+Math.sin(a)*3.4,x2=b[0]-Math.sin(a)*3.4;h1+=(t?"L":"M")+f1(x1)+" "+f1(yy);h2+=(t?"L":"M")+f1(x2)+" "+f1(yy);if(d>0&&t%3===1)st+='<path d="M'+f1(x1)+' '+f1(yy)+'H'+f1(x2)+'" stroke="'+(t%2?"#F2B544":"#E2434B")+'" stroke-width="1"/>'}
  dn+=st+'<path d="'+h2+'" stroke="#2D6A8A" stroke-width="1.6" fill="none"/><path d="'+h1+'" stroke="#5BA3D0" stroke-width="1.6" fill="none"/>';
  return piece(g,[["laboratorio",[x,y,x+w,y+dd],s],["ADN",[13,7,19,13],dn],d>0?dp("bush",-32,20,{k:.5,d:d}):null,d>1?dp("treeRound",22,-22,{k:.55,d:d}):null]);
 }

 /* ---------- Física: observatorio con cúpula abierta y telescopio, y un átomo ---------- */
 function fisica_s(d){
  var g=plat("#B9D3EC","#6F8FB0"),s="",cx=-6,cy=-6;
  s+=I.shadowEll(cx,cy,Z,16)+I.cyl(cx,cy,Z,15,14,"#F2F5F7",{top:"#FFFFFF",sideS:"#C9D1DA",noGlint:true});
  var dc=P(cx,cy+15,Z);s+='<path d="M'+f1(dc[0]-3)+' '+f1(dc[1])+'V'+f1(dc[1]-9)+'Q'+f1(dc[0])+' '+f1(dc[1]-12)+' '+f1(dc[0]+3)+' '+f1(dc[1]-9)+'V'+f1(dc[1])+'Z" fill="#5A6573"/>';
  if(d>0)[-9,9].forEach(function(o){var wp=P(cx+o*.7,cy+15,Z+7);s+='<circle cx="'+f1(wp[0])+'" cy="'+f1(wp[1]+o*.1)+'" r="1.6" fill="'+GLASS+'"/>'});
  s+=I.dome(cx,cy,Z+14,15,"#9FB4C9");
  var tp=P(cx,cy,Z+14);s+='<path d="M'+f1(tp[0]-2.4)+' '+f1(tp[1]-1)+'L'+f1(tp[0]-1.6)+' '+f1(tp[1]-15)+'L'+f1(tp[0]+2.2)+' '+f1(tp[1]-15)+'L'+f1(tp[0]+3)+' '+f1(tp[1]-1)+'Z" fill="#2E3A46"/>';
  s+='<g transform="translate('+f1(tp[0]+1)+' '+f1(tp[1]-12)+') rotate(-38)"><rect x="-1.8" y="-14" width="3.6" height="14" rx="1" fill="#E6ECF0"/><rect x="-1.8" y="-14" width="1.4" height="14" rx=".7" fill="#FFFFFF"/><rect x="-2.3" y="-15" width="4.6" height="2.2" rx=".8" fill="#5A6573"/></g>';
  /* átomo flotando sobre un pedestal */
  var ax=18,ay=12,am=I.shadowEll(ax,ay,Z,3)+I.cyl(ax,ay,Z,2.6,6,"#6FA8DC",{top:"#9CC6EC"}),ap=P(ax,ay,Z+14);
  am+='<g transform="translate('+f1(ap[0])+' '+f1(ap[1])+')"><ellipse rx="6" ry="2.2" fill="none" stroke="#3F7DA6" stroke-width=".9"/><ellipse rx="6" ry="2.2" fill="none" stroke="#3F7DA6" stroke-width=".9" transform="rotate(60)"/><ellipse rx="6" ry="2.2" fill="none" stroke="#3F7DA6" stroke-width=".9" transform="rotate(-60)"/><circle r="1.6" fill="#E2434B"/></g>';
  return piece(g,[["observatorio",[cx-15,cy-15,cx+15,cy+15],s],["átomo",[15,9,21,15],am],d>1?dp("bush",-32,22,{k:.5,d:d}):null,d>0?dp("lamp",4,30,{d:d}):null]);
 }

 /* ---------- Negocios: dos torres de oficinas con letrero de tendencia ---------- */
 function negocios_s(d){
  var g=plat("#9BD47C","#6CA753"),s="",t2="";
  var x=-22,y=-20,w=18,dd=18,h=44;s+=sh(x,y,w,dd,h)+box(x,y,Z,w,dd,h,"#5BA3D0",{left:"#62A9D6",right:"#3E80B0",top:"#BFE3F7"});
  var L=I.faceL(x,y,Z,w,dd),R=I.faceR(x,y,Z,w,dd);for(var v=4;v<h;v+=d>0?5:10){s+=line([L(0,v),L(w,v)],"#DDF3FF",.7,{op:.8,cap:"butt"})+line([R(0,v),R(dd,v)],"#A8D2EE",.7,{op:.7,cap:"butt"})}
  s+=door(L,w/2-3,6,6,"#2F5A82");
  s+=roofSign(x+2,y+dd/2,Z+h,14,"#FFFFFF",function(F){var a=F(2,2),b=F(5.6,4.4),c=F(8.6,3.4),e=F(12,6.6);return '<path d="M'+f1(a[0])+' '+f1(a[1])+'L'+f1(b[0])+' '+f1(b[1])+'L'+f1(c[0])+' '+f1(c[1])+'L'+f1(e[0])+' '+f1(e[1])+'" stroke="#3F9C7A" stroke-width="1.2" fill="none" stroke-linejoin="round"/>'});
  var x2=2,y2=-6,w2=16,d2=16,h2=30;t2+=sh(x2,y2,w2,d2,h2)+box(x2,y2,Z,w2,d2,h2,"#F2E6C8",{left:"#EFE2C0",right:"#CDBF9C",top:"#FFF6DE"});
  var L2=I.faceL(x2,y2,Z,w2,d2),R2=I.faceR(x2,y2,Z,w2,d2);t2+=windows(L2,w2,h2,3,4,1.8,4,3.4,4,4.8,6.4,d)+windows(R2,d2,h2,3,4,1.8,4,3.4,4,4.8,6.4,d);
  var bc=d>0?box(22,14,Z,6,3,4,"#7A5236",{top:"#9A6B45"})+box(23.6,14.6,Z+4,2.8,1.8,1,"#5A3A22",{noGlint:true}):"";
  return piece(g,[["torre",[x,y,x+w,y+dd],s],["edificio",[x2,y2,x2+w2,y2+d2],t2],d>0?["portafolio",[22,14,28,17],bc]:null,d>1?dp("treeRound",-32,14,{k:.55,d:d}):null]);
 }

 /* ---------- Finanzas: banco con columnas, frontón y moneda gigante ---------- */
 function finanzas_s(d){
  var g=plat("#E8D9A8","#B39A5E"),s="",x=-24,y=-18,w=32,dd=22,h=16,ST="#F4EFE6";
  s+=sh(x,y,w,dd,h+10)+box(x-2,y-2,Z,w+4,dd+4,2,"#D9D1C2",{top:"#ECE6DA"})+box(x,y,Z+2,w,dd,h,ST,{left:"#EFE9DE",right:"#CEC6B6",top:"#FFFFFF"});
  var L=I.faceL(x,y,Z+2,w,dd);s+=door(L,w/2-3,6,9,"#7A5236");
  /* columnas al frente */
  for(var k=0;k<5;k++){if(k===2)continue;var cx=x+3+k*6.5;s+=I.cyl(cx,y+dd+1.4,Z+2,1.2,h,"#FFFFFF",{sideS:"#D8D1C4",noGlint:true})}
  s+=box(x-1,y-1,Z+2+h,w+2,dd+3,2,"#E9E2D4",{top:"#F6F2EA"});
  s+=poly([P(x-1,y+dd+2,Z+4+h),P(x+w+1,y+dd+2,Z+4+h),P(x+w/2,y+dd+2,Z+12+h)],"#F6F2EA",{st:"#CEC6B6",sw:.6})+poly([P(x+w+1,y+dd+2,Z+4+h),P(x+w+1,y-1,Z+4+h),P(x+w/2,y-1,Z+12+h),P(x+w/2,y+dd+2,Z+12+h)],"#C9BFAF");
  /* moneda gigante de pie */
  var mx=18,my=10,mn=I.shadowEll(mx,my,Z,5)+box(mx-3,my-1,Z,6,3,2,"#B8862A",{top:"#D9A845"});var mp=P(mx,my,Z+11);
  mn+='<g transform="'+I.planeX(mx,my+.5,Z+11)+'"><circle r="8.4" fill="#C98E1E"/><circle r="8" fill="#F2B544"/><circle r="6.2" fill="none" stroke="#C98E1E" stroke-width=".9"/><text x="0" y="3.6" text-anchor="middle" font-size="10" font-weight="900" fill="#B07A16">$</text><path d="M-5.6 -3.4A6.4 6.4 0 0 1 -1.6 -6.4" stroke="#FFF1B8" stroke-width="1.1" fill="none" stroke-linecap="round"/></g>';
  var st2="";if(d>0)[[26,-4,3],[29,2,2]].forEach(function(q){for(var i=0;i<q[2];i++)st2+=I.cyl(q[0],q[1],Z+i*1.4,2.2,1.4,"#F2B544",{top:"#F8D27A",sideS:"#C98E1E",noGlint:true})});
  return piece(g,[["banco",[x-2,y-2,x+w+2,y+dd+3],s],["moneda",[13,8,23,12],mn],d>0?["monedas",[23,-7,32,5],st2]:null,d>1?dp("bush",-32,22,{k:.5,d:d}):null]);
 }

 /* ---------- Educación: escuela con techo rojo, campanario, reloj y asta con bandera; lápiz gigante ---------- */
 function educacion_s(d){
  var g=plat("#A6D97A","#78AE52"),s="",x=-26,y=-16,w=34,dd=20,h=14,RD="#D9534F";
  s+=sh(x,y,w,dd,h+16)+box(x,y,Z,w,dd,h,"#F6E7C8",{left:"#F3E3C2",right:"#D3C29F"});
  var L=I.faceL(x,y,Z,w,dd),R=I.faceR(x,y,Z,w,dd);s+=windows(L,w,h,4,1,2.6,5,4.6,5,8,0,d)+door(L,w/2-3,6,9,"#7A5236")+windows(R,dd,h,2,1,3,5,4.6,5,9,0,d);
  s+=I.gable(x,y,Z+h,w,dd,9,RD,{ov:1.8,th:1.6});
  /* campanario con campana y reloj */
  var bx=x+w/2-3,by=y+dd/2-3;s+=box(bx,by,Z+h+5,6,6,7,"#F6E7C8",{left:"#F3E3C2",right:"#D3C29F",noTop:true})+I.gable(bx,by,Z+h+12,6,6,4,RD,{ov:.8,th:1});
  var BF=I.faceL(bx,by,Z+h+5,6,6);s+=quad(BF,1.4,1.4,3.2,4,"#5A3A22",{st:false});var bl=BF(3,3.6);s+='<path d="M'+f1(bl[0]-1.2)+' '+f1(bl[1]+1.4)+'Q'+f1(bl[0])+' '+f1(bl[1]-2)+' '+f1(bl[0]+1.2)+' '+f1(bl[1]+1.4)+'Z" fill="#F2B544"/>';
  var ck=L(w/2,h+3);s+='<circle cx="'+f1(ck[0])+'" cy="'+f1(ck[1])+'" r="2.4" fill="#FFFFFF" stroke="#5A3A22" stroke-width=".6"/><path d="M'+f1(ck[0])+' '+f1(ck[1])+'V'+f1(ck[1]-1.6)+'M'+f1(ck[0])+' '+f1(ck[1])+'H'+f1(ck[0]+1.2)+'" stroke="#5A3A22" stroke-width=".5"/>';
  /* asta con bandera */
  var fx=14,fy=14,fl=I.contact(1.2,{x:P(fx,fy,Z)[0],y:P(fx,fy,Z)[1]})+I.cyl(fx,fy,Z,.5,24,"#C9D1DA",{noGlint:true}),fp=P(fx,fy,Z+24);
  fl+='<path class="iso-bob" d="M'+f1(fp[0])+' '+f1(fp[1])+'q3 -1.4 6 0t6 0v5q-3 -1.4 -6 0t-6 0z" fill="#3F9C7A"/>';
  /* lápiz gigante recargado */
  var pc="";if(d>0){var a=P(24,-12,Z),b=P(24,-12,Z+18);pc=I.contact(1.6,{x:a[0],y:a[1]})+'<path d="M'+f1(a[0]-2)+' '+f1(a[1]-3)+'L'+f1(b[0]-2)+' '+f1(b[1])+'L'+f1(b[0]+2)+' '+f1(b[1])+'L'+f1(a[0]+2)+' '+f1(a[1]-3)+'Z" fill="#F2B544"/><path d="M'+f1(a[0]+.6)+' '+f1(a[1]-3)+'L'+f1(b[0]+.6)+' '+f1(b[1])+'L'+f1(b[0]+2)+' '+f1(b[1])+'L'+f1(a[0]+2)+' '+f1(a[1]-3)+'Z" fill="#D99A2A"/><path d="M'+f1(a[0]-2)+' '+f1(a[1]-3)+'L'+f1(a[0])+' '+f1(a[1]+1)+'L'+f1(a[0]+2)+' '+f1(a[1]-3)+'Z" fill="#E8C9A0"/><rect x="'+f1(b[0]-2)+'" y="'+f1(b[1]-3)+'" width="4" height="3" fill="#F28C9C"/>'}
  return piece(g,[["escuela",[x-1.8,y-1.8,x+w+1.8,y+dd+1.8],s],["bandera",[13,13,15,15],fl],d>0?["lápiz",[22,-14,26,-10],pc]:null,d>1?dp("treeRound",-32,14,{k:.55,d:d}):null]);
 }

 /* ---------- Moda: boutique con toldo de rayas, aparador con vestido y gancho gigante ---------- */
 function moda_s(d){
  var g=plat("#F2D3DA","#C38E9A"),s="",x=-24,y=-16,w=30,dd=20,h=16,PK="#D98C9C";
  s+=sh(x,y,w,dd,h+8)+box(x,y,Z,w,dd,h,"#FFF6F2",{left:"#FCEFEA",right:"#DCC9C3"});
  var L=I.faceL(x,y,Z,w,dd);s+=quad(L,2,1,14,10,"#BFE3F2",{st:false})+quad(L,2,1,14,10,"none",{st:"#C77A8A",sw:.8})+door(L,w-9,6,10,"#8E4E5E");
  /* vestido en el aparador */
  var mp=L(9,1);s+='<path d="M'+f1(mp[0])+' '+f1(mp[1]-9)+'l-1.4 1.4l-2.6 7.6h8l-2.6 -7.6z" fill="'+PK+'"/><circle cx="'+f1(mp[0])+'" cy="'+f1(mp[1]-9.6)+'" r="1" fill="#E8C9A0"/>';
  /* toldo de rayas con faldón */
  var st=4,aw="";for(var i=0;i<w/st;i++){var a=P(x+i*st,y+dd,Z+h-1),b=P(x+(i+1)*st,y+dd,Z+h-1),c=P(x+(i+1)*st,y+dd+5,Z+h-5),e=P(x+i*st,y+dd+5,Z+h-5);aw+=poly([a,b,c,e],i%2?"#FFFFFF":PK,{st:i%2?"#FFFFFF":PK,sw:.3})+'<path d="M'+f1(e[0])+' '+f1(e[1])+'Q'+f1((e[0]+c[0])/2)+' '+f1((e[1]+c[1])/2+2.6)+' '+f1(c[0])+' '+f1(c[1])+'Z" fill="'+(i%2?"#E8E2E4":"#C27585")+'"/>'}
  s+=aw+poly([P(x-.6,y-.6,Z+h),P(x+w+.6,y-.6,Z+h),P(x+w+.6,y+dd+.6,Z+h),P(x-.6,y+dd+.6,Z+h)],"#F6E3E7");
  /* letrero con gancho */
  s+=roofSign(x+w/2-7,y+dd/2,Z+h,14,"#FCEFF2",function(F,w2){var p=F(w2/2,2);return '<path d="M'+f1(p[0]-4)+' '+f1(p[1])+'L'+f1(p[0])+' '+f1(p[1]-3)+'L'+f1(p[0]+4)+' '+f1(p[1])+'Z" fill="none" stroke="#8E4E5E" stroke-width=".8" stroke-linejoin="round"/><path d="M'+f1(p[0])+' '+f1(p[1]-3)+'q0 -1.6 1 -1.6q1 0 1 1" stroke="#8E4E5E" stroke-width=".7" fill="none"/>'});
  /* maniquí afuera */
  var mx=16,my=12,mq=I.shadowEll(mx,my,Z,3)+I.cyl(mx,my,Z,2.2,1,"#5A3A22",{noGlint:true})+I.cyl(mx,my,Z+1,.4,6,"#5A3A22",{noGlint:true}),tp=P(mx,my,Z+7);
  mq+='<path d="M'+f1(tp[0]-2.6)+' '+f1(tp[1])+'Q'+f1(tp[0]-3.2)+' '+f1(tp[1]-6)+' '+f1(tp[0]-1.6)+' '+f1(tp[1]-9)+'H'+f1(tp[0]+1.6)+'Q'+f1(tp[0]+3.2)+' '+f1(tp[1]-6)+' '+f1(tp[0]+2.6)+' '+f1(tp[1])+'Z" fill="#9E86BF"/><circle cx="'+f1(tp[0])+'" cy="'+f1(tp[1]-10)+'" r="1" fill="#5A3A22"/>';
  return piece(g,[["boutique",[x-.6,y-.6,x+w+.6,y+dd+5],s],["maniquí",[13,9,19,15],mq],d>0?dp("flowers",-32,18,{k:.8,d:d}):null,d>1?dp("bush",24,-14,{k:.45,d:d}):null]);
 }

 /* ---------- Comunicación: estación de radio y TV con antena, antena parabólica y micrófono gigante ---------- */
 function comunicacion_s(d){
  var g=plat("#D7CBEA","#9483B6"),s="",x=-24,y=-14,w=28,dd=20,h=16,PU="#9E86BF";
  s+=sh(x,y,w,dd,h+8)+box(x,y,Z,w,dd,h,"#F4F1F8",{left:"#F0ECF6",right:"#CDC5DC"});
  var L=I.faceL(x,y,Z,w,dd);s+=quad(L,0,h-4,w,4,PU,{st:false})+windows(L,w,h,3,1,2.4,3,5,5,8.4,0,d)+door(L,w-8,5,8,"#5E4A80");
  /* letrero "AL AIRE" */
  if(d>0){var la=L(5,h-2);s+='<g transform="'+I.planeX(x+3,y+dd,Z+h-1)+'"><rect x="0" y="-2.8" width="9" height="2.8" rx=".6" fill="#E2434B"/><text x="4.5" y="-.7" font-size="2.1" font-weight="900" fill="#FFFFFF" text-anchor="middle">AL AIRE</text></g>'}
  /* antena de transmisión en celosía con luz */
  var ax=x+20,ay=y+4,an=box(ax-1.5,ay-1.5,Z+h,3,3,1,"#8C96A3",{noGlint:true}),p0=P(ax,ay,Z+h+1),p1=P(ax,ay,Z+h+30);
  an+='<path d="M'+f1(p0[0]-2.4)+' '+f1(p0[1])+'L'+f1(p1[0])+' '+f1(p1[1])+'L'+f1(p0[0]+2.4)+' '+f1(p0[1])+'" stroke="#C0392B" stroke-width="1" fill="none"/>';
  if(d>0)for(var k=1;k<6;k++){var t=k/6,yy=p0[1]+(p1[1]-p0[1])*t,ww=2.4*(1-t);an+='<path d="M'+f1(p0[0]-ww)+' '+f1(yy)+'L'+f1(p0[0]+ww)+' '+f1(yy+3)+'" stroke="#E8E2E4" stroke-width=".5"/>'}
  an+='<circle class="iso-led" cx="'+f1(p1[0])+'" cy="'+f1(p1[1]-.6)+'" r="1.2" fill="#FF5B5B"/>';
  s+=an;
  /* antena parabólica en el piso */
  var dx=14,dy=-12,dc=I.shadowEll(dx,dy,Z,3)+I.cyl(dx,dy,Z,1.6,4,"#8C96A3",{noGlint:true}),dp2=P(dx,dy,Z+4);
  dc+='<g transform="translate('+f1(dp2[0])+' '+f1(dp2[1]-3)+') rotate(-28)"><ellipse rx="6.4" ry="3.4" fill="#F2F5F7" stroke="#C9D1DA" stroke-width=".5"/><ellipse rx="4.6" ry="2.2" fill="#DDE3E8"/><path d="M0 0l3 -4" stroke="#5A6573" stroke-width=".6"/><circle cx="3" cy="-4" r=".7" fill="#5A6573"/></g>';
  /* micrófono gigante en su pie */
  var mx=16,my=12,mc=I.contact(1.6,{x:P(mx,my,Z)[0],y:P(mx,my,Z)[1]})+I.cyl(mx,my,Z,2.4,.8,"#3A4452",{noGlint:true})+I.cyl(mx,my,Z+.8,.5,12,"#5A6573",{noGlint:true}),mt=P(mx,my,Z+13);
  mc+='<rect x="'+f1(mt[0]-2.2)+'" y="'+f1(mt[1]-7)+'" width="4.4" height="8" rx="2.2" fill="#3A4452"/><rect x="'+f1(mt[0]-2.2)+'" y="'+f1(mt[1]-7)+'" width="4.4" height="4.6" rx="2.2" fill="#8C96A3"/>'+(d>0?'<path d="M'+f1(mt[0]-2)+' '+f1(mt[1]-5.4)+'h4M'+f1(mt[0]-2)+' '+f1(mt[1]-4)+'h4" stroke="#5A6573" stroke-width=".4"/>':'');
  return piece(g,[["estación",[x,y,x+w,y+dd],s],["parabólica",[11,-15,17,-9],dc],["micrófono",[13,9,19,15],mc],d>1?dp("bush",-32,20,{k:.5,d:d}):null]);
 }

 var F={psicologia:psicologia_s,civil:civil_s,mecatronica:mecatronica_s,aeroespacial:aeroespacial_s,ambiental:ambiental_s,biotec:biotec_s,fisica:fisica_s,negocios:negocios_s,finanzas:finanzas_s,educacion:educacion_s,moda:moda_s,comunicacion:comunicacion_s};
 Object.keys(F).forEach(function(id){ART.addV2(id,{s:F[id],e:F[id]})});
})(ISO,ENV,ART.H);
