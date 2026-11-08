/* ================= carreras: estructura y emblema =================
   Coordenadas locales: plataforma redonda centrada en (0,0), radio 46, cara de arriba en z=7.
   Cada carrera tiene dos versiones: s (estructura: el edificio donde se ejerce) y e (emblema: su objeto a escala gigante).
   d = detalle: 2 completo, 1 a 96 px, 0 a 64 px (misma silueta, menos detalle). Se dibuja de atrás hacia adelante. */
var ART=(function(I,E){
 var P=I.P,box=I.box,quad=I.quad,win=I.win,cyl=I.cyl,poly=I.poly,line=I.line,T=I.T,f1=I.f1,sm=I.smooth,shaded=I.shaded;
 var GLASS="#4FA8E0",FRAME="#E8EEF2",WALL="#F7F2E8",RED="#E2434B",Z=7;
 function at(x,y,z,s){var p=P(x,y,z==null?Z:z);return '<g transform="translate('+f1(p[0])+' '+f1(p[1])+')">'+s+'</g>'}
 function deco(k,x,y,o){return at(x,y,Z,E.one(k,o||{}))}
 var NOPLAT=false;
 function plat(top,side){return NOPLAT?'':I.platform(46,top,{side:side})}
 function ptsD(a){return "M"+a.map(function(p){return f1(p[0])+" "+f1(p[1])}).join("L")+"Z"}
 /* rueda o disco en un plano vertical a lo largo de x (cara izquierda de una caja) */
 function discX(x,y,z,r,fill,o){o=o||{};return '<g transform="'+I.planeX(x,y,z)+'"><circle r="'+r+'" fill="'+fill+'"/>'+(o.hub?'<circle r="'+(r*.42)+'" fill="'+o.hub+'"/>':'')+'</g>'}
 function discY(x,y,z,r,fill,o){o=o||{};return '<g transform="'+I.planeY(x,y,z)+'"><circle r="'+r+'" fill="'+fill+'"/>'+(o.hub?'<circle r="'+(r*.42)+'" fill="'+o.hub+'"/>':'')+'</g>'}
 /* puerta con arco en una cara */
 function arch(F,u,v,a,h,glass){glass=glass||GLASS;
  var s=quad(F,u-1,v,a+2,h+.6,"#D8E3EA");
  var a0=F(u,v),a1=F(u+a,v),a2=F(u+a,v+h*.66),a3=F(u+a/2,v+h-.4),a4=F(u,v+h*.66);
  s+='<path d="M'+f1(a0[0])+' '+f1(a0[1])+'L'+f1(a4[0])+' '+f1(a4[1])+'Q'+f1(a3[0]-2.4)+' '+f1(a3[1]-1.6)+' '+f1(a3[0])+' '+f1(a3[1])+'Q'+f1(a3[0]+2.4)+' '+f1(a3[1]+.4)+' '+f1(a2[0])+' '+f1(a2[1])+'L'+f1(a1[0])+' '+f1(a1[1])+'Z" fill="'+glass+'"/>';
  s+=line([F(u+a/2,v),F(u+a/2,v+h-.8)],FRAME,1);
  return s}

 /* ================= MEDICINA ================= */
 function ambulance(x,y,d){
  var s=I.shadowBox(x,y,Z,16,8,8);
  s+=box(x,y,Z,11,8,9,"#FFFFFF",{left:"#F6F4EF",right:"#D9DCE2",top:"#FFFFFF"});
  s+=box(x+11,y,Z,5,8,6,"#FFFFFF",{left:"#F6F4EF",right:"#D9DCE2",top:"#FFFFFF"});
  var L=I.faceL(x,y,Z,11,8),R=I.faceR(x+11,y,Z,5,8);
  s+=quad(L,0,3,11,1.6,RED,{st:false});
  if(d>0){s+=quad(I.faceL(x+11,y,Z,5,8),.6,3,3.6,2.4,GLASS,{st:false})+quad(R,1,3,6,2.2,GLASS,{st:false});s+=quad(L,4.6,4.2,1.6,4,RED,{st:false})+quad(L,3.4,5.4,4,1.6,RED,{st:false})}
  s+=box(x+3,y+3,Z+9,3,2,1.4,"#3D8BFF",{noGlint:true});
  [2.6,9,13.6].forEach(function(u){s+=discX(x+u,y+8,Z+1.1,1.9,"#2A3340",{hub:"#8A97A0"})});
  return s}
 function medicina_s(d){
  var s=plat("#8FD06A");
  if(d>0)s+=I.walk(-7,44,-7,30,8,"#F1E6CF");
  var x=-16,y=-16,w=26,dd=22,h=46;
  s+=I.shadowBox(x,y,Z,w,dd,h);
  s+=box(x,y,Z,w,dd,h,WALL,{left:"#F2ECE0",right:"#D9D3CC",top:"#FFFDF8"});
  var L=I.faceL(x,y,Z,w,dd),R=I.faceR(x,y,Z,w,dd),r,c;
  if(d>0){for(r=0;r<3;r++)for(c=0;c<3;c++)s+=win(L,3+c*8,12+r*10,5,6,GLASS,FRAME,r===2&&c===0);for(r=0;r<4;r++)for(c=0;c<2;c++)s+=win(R,4+c*9,6+r*9.5,5,5.5,GLASS,FRAME)}
  else{for(r=0;r<2;r++){s+=quad(L,3,14+r*14,20,6,GLASS,{st:false});s+=quad(R,3,10+r*14,16,6,I.shade(GLASS,.15),{st:false})}}
  s+=quad(L,0,h-5,w,2.2,RED,{st:false})+quad(R,0,h-5,dd,2.2,I.shade(RED,.25),{st:false});
  var Tp=I.faceTop(x,y,Z+h);
  s+=quad(Tp,6,4,14,14,"#FFFFFF",{st:"#E9E4DA",sw:1.2})+quad(Tp,11.2,5.8,3.6,10.4,RED,{st:false})+quad(Tp,7.8,9.2,10.4,3.6,RED,{st:false});
  var wx=10,wy=-12,ww=24,wd=18,wh=26;
  s+=box(wx,wy,Z,ww,wd,wh,WALL,{left:"#F2ECE0",right:"#D9D3CC",top:"#E9E6DF"});
  var L2=I.faceL(wx,wy,Z,ww,wd),R2=I.faceR(wx,wy,Z,ww,wd);
  if(d>0){for(c=0;c<3;c++){s+=win(L2,3+c*7,6,4.4,5,GLASS,FRAME);s+=win(L2,3+c*7,15,4.4,5,GLASS,FRAME)}for(c=0;c<2;c++){s+=win(R2,3+c*8,6,5,5,GLASS,FRAME);s+=win(R2,3+c*8,15,5,5,GLASS,FRAME)}}
  else{s+=quad(L2,3,8,18,9,GLASS,{st:false})+quad(R2,3,8,12,9,I.shade(GLASS,.15),{st:false})}
  s+=quad(L2,0,wh-4,ww,1.8,RED,{st:false});
  var hp=I.cylD(wx+ww/2,wy+wd/2,Z+wh,8.5);
  s+=I.cyl(wx+ww/2,wy+wd/2,Z+wh,8.5,1.2,"#5B6B78",{top:"#4A5A68",noGlint:true});
  s+='<ellipse cx="'+f1(hp.cx)+'" cy="'+f1(hp.cy-1.2)+'" rx="'+f1(hp.rx-2)+'" ry="'+f1(hp.ry-1)+'" fill="none" stroke="#FFD45C" stroke-width="1.1"/>';
  var Ht=I.faceTop(wx+ww/2-4,wy+wd/2-4,Z+wh+1.2);
  s+=line([Ht(1.5,1),Ht(1.5,7)],"#FFFFFF",1.8)+line([Ht(6.5,1),Ht(6.5,7)],"#FFFFFF",1.8)+line([Ht(1.5,4),Ht(6.5,4)],"#FFFFFF",1.8);
  var lx=-14,ly=6,lw=14,ld=24,lh=22;
  s+=box(lx,ly,Z,lw,ld,lh,WALL,{left:"#F2ECE0",right:"#D9D3CC",top:"#FFFDF8"});
  var L3=I.faceL(lx,ly,Z,lw,ld),R3=I.faceR(lx,ly,Z,lw,ld);
  s+=arch(L3,3,0,8,11);
  s+=box(lx+1,ly+ld,Z+12,10,5,2,RED,{right:I.shade(RED,.3),top:I.tint(RED,.25)});
  if(d>0)for(c=0;c<3;c++)s+=win(R3,2.5+c*7,8,4.4,6,GLASS,FRAME);else s+=quad(R3,2.5,8,18,6,I.shade(GLASS,.15),{st:false});
  s+=quad(R3,0,lh-4,ld,1.8,I.shade(RED,.25),{st:false});
  if(d>0){s+=deco("bush",-31,16,{k:.55,d:d})+deco("flowers",-34,27,{k:.8,d:d})}
  s+=ambulance(18,18,d);
  if(d>1)s+=deco("bush",31,-24,{k:.5,d:d,ph:2});
  return s}
 /* emblema: botiquín gigante con un estetoscopio enrollado */
 function medicina_e(d){
  var s=plat("#8FD06A");
  var x=-20,y=-16,w=34,dd=26,h=22,WH="#FFFFFF";
  s+=I.shadowBox(x,y,Z,w,dd,h+6);
  s+=box(x,y,Z,w,dd,h,WH,{left:"#F4F1EC",right:"#D7DCE3",top:"#FFFFFF"});
  var L=I.faceL(x,y,Z,w,dd),R=I.faceR(x,y,Z,w,dd),Tp=I.faceTop(x,y,Z+h);
  /* tapa: franja y bisagra */
  s+=quad(L,0,h-5.2,w,1.2,"#C9CFD8",{st:false})+quad(R,0,h-5.2,dd,1.2,"#B3BAC4",{st:false});
  /* cruces roja en el frente y en la tapa */
  s+=quad(L,w/2-3,3.6,6,12,RED,{st:false})+quad(L,w/2-8,6.6,16,6,RED,{st:false});
  s+=quad(Tp,w/2-3,dd/2-8,6,16,RED,{st:false})+quad(Tp,w/2-8,dd/2-3,16,6,RED,{st:false});
  if(d>0){s+=quad(R,dd/2-2,5,4,9,I.shade(RED,.25),{st:false})+quad(R,dd/2-5.5,7.6,11,3.6,I.shade(RED,.25),{st:false});
   /* broches */
   s+=quad(L,4,h-6.6,3,2.6,"#9AA3AE",{st:false})+quad(L,w-7,h-6.6,3,2.6,"#9AA3AE",{st:false})}
  /* asa arriba */
  var a1=P(x+w/2-7,y+dd/2,Z+h),a2=P(x+w/2+7,y+dd/2,Z+h);
  s+='<path d="M'+f1(a1[0])+' '+f1(a1[1])+'C'+f1(a1[0])+' '+f1(a1[1]-9)+' '+f1(a2[0])+' '+f1(a2[1]-9)+' '+f1(a2[0])+' '+f1(a2[1])+'" stroke="#5B6573" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M'+f1(a1[0]+1)+' '+f1(a1[1]-3)+'C'+f1(a1[0]+1)+' '+f1(a1[1]-8)+' '+f1(a2[0]-3)+' '+f1(a2[1]-9)+' '+f1(a2[0]-1)+' '+f1(a2[1]-5)+'" stroke="#8C96A3" stroke-width="1" fill="none" stroke-linecap="round"/>';
  /* estetoscopio: tubo que rodea el botiquín, sube a las olivas y baja a la campana en el piso */
  var TUBE="#38424F",tube=[P(x+w+1,y-1,Z+9),P(x+w+1,y+dd+1,Z+10),P(x-1,y+dd+1,Z+12)];
  var dT="M"+f1(tube[0][0])+" "+f1(tube[0][1])+"L"+f1(tube[1][0])+" "+f1(tube[1][1])+"L"+f1(tube[2][0])+" "+f1(tube[2][1]);
  s+='<path d="'+dT+'" stroke="'+TUBE+'" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="'+dT+'" stroke="#66717F" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round" transform="translate(-.4 -.9)"/>';
  /* la campana cuelga hasta el piso al frente */
  var c0=tube[1],c1=P(x+w-4,y+dd+12,Z+1.4);
  s+='<path d="M'+f1(c0[0])+' '+f1(c0[1])+'Q'+f1(c0[0]+4)+' '+f1(c0[1]+10)+' '+f1(c1[0])+' '+f1(c1[1]-1.6)+'" stroke="'+TUBE+'" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
  s+=I.cyl(x+w-4,y+dd+12,Z,3.4,1.6,"#C9D1DA",{top:"#E8EDF2",sideS:"#9AA5B1"})+I.ell(x+w-4,y+dd+12,Z+1.7,2.2,"#9AA5B1");
  /* olivas: horquilla que sale arriba a la izquierda */
  var f=tube[2],f2=P(x-6,y+dd-2,Z+22);
  s+='<path d="M'+f1(f[0])+' '+f1(f[1])+'Q'+f1(f[0]-6)+' '+f1(f[1]-6)+' '+f1(f2[0])+' '+f1(f2[1])+'" stroke="'+TUBE+'" stroke-width="2.4" fill="none" stroke-linecap="round"/>';
  s+='<path d="M'+f1(f2[0])+' '+f1(f2[1])+'l-4 -6M'+f1(f2[0])+' '+f1(f2[1])+'l4 -7" stroke="#B9C2CC" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="'+f1(f2[0]-4)+'" cy="'+f1(f2[1]-6.6)+'" r="1.5" fill="'+TUBE+'"/><circle cx="'+f1(f2[0]+4)+'" cy="'+f1(f2[1]-7.6)+'" r="1.5" fill="'+TUBE+'"/>';
  /* apoyo: frasco de pastillas y una planta */
  if(d>0){s+=I.cyl(24,-24,Z,3.2,7,"#F28C38",{noGlint:d<2})+I.cyl(24,-24,Z+7,3.4,2.2,"#FFFFFF",{noGlint:true});
   s+=deco("bush",-32,20,{k:.55,d:d})}
  if(d>1)s+=deco("flowers",30,26,{k:.8,d:d});
  return s}

 /* ================= DERECHO ================= */
 /* estatua de la justicia: una sola figura de bronce sobre pedestal de dos escalones */
 function justice(x,y,k,d){var s="",B=T("#C08A3E"),St=T("#E3D9C4");
  s+=I.shadowEll(x,y,Z,6*k);
  s+=box(x-4.4*k,y-4.4*k,Z,8.8*k,8.8*k,2.4*k,St.b,{left:St.b,right:St.s,top:St.l});
  s+=box(x-3.2*k,y-3.2*k,Z+2.4*k,6.4*k,6.4*k,6*k,St.b,{left:St.b,right:St.s,top:St.l});
  var b=P(x,y,Z+8.4*k),bx=b[0],by=b[1],u=k*1.05;
  function q(px,py){return f1(bx+px*u)+" "+f1(by+py*u)}
  /* figura: túnica larga, cabeza con venda, brazo izquierdo extendido; una sola silueta */
  var FIG="M"+q(-3.4,0)+"C"+q(-3.2,-4)+" "+q(-2.8,-9)+" "+q(-2.4,-12.4)+"C"+q(-3.6,-12.8)+" "+q(-6.4,-13.4)+" "+q(-8.6,-14.2)+"L"+q(-8.8,-15.6)+"C"+q(-6,-15.4)+" "+q(-3.6,-15)+" "+q(-1.8,-15.6)+"C"+q(-1.6,-16.2)+" "+q(-1.6,-16.8)+" "+q(-1.5,-17.2)+"C"+q(-2.2,-17.8)+" "+q(-2.2,-19.8)+" "+q(-.6,-20.4)+"C"+q(1,-20.8)+" "+q(2,-19.6)+" "+q(1.6,-17.8)+"C"+q(1.4,-17.2)+" "+q(1.4,-16.4)+" "+q(1.8,-15.6)+"C"+q(2.8,-15.2)+" "+q(3,-13.6)+" "+q(3,-12)+"C"+q(3.2,-9)+" "+q(3.4,-4)+" "+q(3.6,0)+"Z";
  var inner='<path d="M'+q(.6,1)+'L'+q(.8,-15)+'L'+q(5,-15)+'L'+q(5,1)+'Z" fill="'+B.s+'"/>';
  if(d>0)inner+='<path d="M'+q(-1.6,-.4)+'L'+q(-1.3,-11)+'M'+q(-.2,-.4)+'L'+q(0,-11.6)+'M'+q(1.6,-.4)+'L'+q(1.4,-11)+'" stroke="'+B.d+'" stroke-width="'+f1(.45*u)+'" opacity=".55"/>';
  inner+='<path d="M'+q(-2.4,-18.6)+'L'+q(1.8,-18.6)+'" stroke="#F4F0E6" stroke-width="'+f1(.9*u)+'"/>';
  inner+='<path d="M'+q(-1.2,-20)+'Q'+q(-.4,-20.6)+' '+q(.6,-20.2)+'" stroke="'+B.h+'" stroke-width="'+f1(.5*u)+'" fill="none"/>';
  s+=shaded(FIG,B.b,inner);
  /* balanza: barra, cadenas y platillos que cuelgan de la mano izquierda */
  var hx=bx-9*u,hy=by-15.2*u,bl=[hx-5*u,hy-.6*u],br=[hx+5*u,hy+.6*u];
  s+='<path d="M'+f1(hx)+' '+f1(hy)+'L'+f1(hx)+' '+f1(hy-2.4*u)+'M'+f1(bl[0])+' '+f1(bl[1]-1.8*u)+'L'+f1(br[0])+' '+f1(br[1]-2*u)+'" stroke="'+B.s+'" stroke-width="'+f1(.7*u)+'" stroke-linecap="round"/>';
  [[bl[0],bl[1]-1.8*u],[br[0],br[1]-2*u]].forEach(function(p){s+='<path d="M'+f1(p[0])+' '+f1(p[1])+'L'+f1(p[0]-1.8*u)+' '+f1(p[1]+4.6*u)+'M'+f1(p[0])+' '+f1(p[1])+'L'+f1(p[0]+1.8*u)+' '+f1(p[1]+4.6*u)+'" stroke="'+B.s+'" stroke-width="'+f1(.35*u)+'"/><path d="M'+f1(p[0]-2.6*u)+' '+f1(p[1]+4.6*u)+'Q'+f1(p[0])+' '+f1(p[1]+7*u)+' '+f1(p[0]+2.6*u)+' '+f1(p[1]+4.6*u)+'Z" fill="'+B.b+'"/>'});
  /* espada en la mano derecha, bajada */
  s+='<path d="M'+q(3.2,-9.4)+'L'+q(5.4,-1.4)+'" stroke="#D8DEE4" stroke-width="'+f1(.8*u)+'" stroke-linecap="round"/><path d="M'+q(2.4,-9.6)+'L'+q(4.2,-10.2)+'" stroke="'+B.s+'" stroke-width="'+f1(.7*u)+'" stroke-linecap="round"/>';
  return s}
 function derecho_s(d){
  var s=plat("#9FD67E","#A98F67"),STONE="#EDE5D3";
  s+=I.ell(4,0,Z+.2,36,"#EEE6D4");
  var x=-26,y=-24,w=26,dd=30;
  s+=I.shadowBox(x,y,Z,w+18,dd,36);
  s+=box(x,y,Z,w,dd,28,STONE,{left:"#E4DAC5",right:"#CFC3AA",top:"#F6F0E2"});
  var L=I.faceL(x,y,Z,w,dd);
  if(d>0)for(var c=0;c<3;c++)s+=win(L,3.4+c*8,8,4.6,11,"#5D7FA3","#D9CDB3");else s+=quad(L,3,8,20,11,"#5D7FA3",{st:false});
  /* escalinata de seis escalones: cada uno con cara de arriba clara y frente en sombra */
  var n=d>0?6:4,sx=x+w,stepW=2.2,stepH=1.5;
  for(var i=0;i<n;i++){var xi=sx+(n-1-i)*stepW,z=Z+i*stepH;s+=box(sx,y-2,z,(n-i)*stepW+1.6,dd+4,stepH,"#F1EADB",{left:"#E2D7C2",right:"#C7BA9F",top:"#FBF7EE",noGlint:i<n-1})}
  /* columnas sobre el último escalón */
  var cz=Z+n*stepH,cx0=sx+3.4,colH=22;
  for(c=0;c<5;c++)s+=I.cyl(cx0,y+2.6+c*6.2,cz,1.9,colH,"#F6F0E2",{sideS:"#D3C7AE",noGlint:true});
  /* entablamento, frontón y techo */
  var ez=cz+colH;
  s+=box(x+w-1,y-3,ez,10,dd+6,3.4,STONE,{left:"#E4DAC5",right:"#D6CAB1",top:"#F6F0E2"});
  var fx=x+w+9,rz=ez+3.4;
  s+=poly([P(x-1,y-3,rz-2),P(fx,y-3,rz),P(fx,y+dd/2,rz+10),P(x-1,y+dd/2,rz+8)],"#B5544A");
  s+=poly([P(x-1,y+dd/2,rz+8),P(fx,y+dd/2,rz+10),P(fx,y+dd+3,rz),P(x-1,y+dd+3,rz-2)],"#D9705F");
  s+=line([P(x-1,y+dd/2,rz+8),P(fx,y+dd/2,rz+10)],"#FFD9C7",1.4);
  s+=poly([P(fx,y-3,rz),P(fx,y+dd+3,rz),P(fx,y+dd/2,rz+10)],"#E4D8BF");
  if(d>0){s+=poly([P(fx,y+2,rz+1.4),P(fx,y+dd-2,rz+1.4),P(fx,y+dd/2,rz+8)],"#CDBFA2",{st:false});var e=P(fx,y+dd/2,rz+4.4);s+='<circle cx="'+f1(e[0])+'" cy="'+f1(e[1])+'" r="2" fill="#C99A2E"/>'}
  s+=line([P(fx,y+dd+3,rz),P(fx,y+dd/2,rz+10)],"#FFF8EA",1.2);
  /* estatua en la plaza, al frente: la mitad de la altura de las columnas */
  s+=justice(-8,26,1.05,d);
  if(d>0)s+=deco("bush",-34,8,{k:.5,d:d})+deco("lamp",22,30,{d:d});
  if(d>1)s+=deco("flowers",-24,34,{k:.8,d:d});
  return s}
 /* emblema: balanza gigante, mazo de juez y libro de leyes */
 function derecho_e(d){
  var s=plat("#9FD67E","#A98F67"),G=T("#D9A441"),Dk=T("#5A3A28");
  s+=I.ell(0,-2,Z+.2,26,"#EEE6D4");
  /* pedestal escalonado redondo */
  s+=I.cyl(0,-4,Z,12,3,"#E8DFCC",{sideS:"#C9BBA0"})+I.cyl(0,-4,Z+3,8,2.6,"#F1EADB",{sideS:"#D3C7AE"});
  /* columna central */
  var cz=Z+5.6;s+=I.cyl(0,-4,cz,2,40,G.b,{sideS:G.s,noGlint:true})+I.ell(0,-4,cz+40,2.6,G.l);
  /* barra a lo largo de y (se ve de lado a lado) con remates */
  var bz=cz+38,b1=P(-1,-24,bz),b2=P(-1,16,bz),top=P(0,-4,cz+44);
  s+='<path d="M'+f1(b1[0])+' '+f1(b1[1])+'L'+f1(b2[0])+' '+f1(b2[1])+'" stroke="'+G.s+'" stroke-width="3" stroke-linecap="round"/><path d="M'+f1(b1[0])+' '+f1(b1[1]-1)+'L'+f1(b2[0])+' '+f1(b2[1]-1)+'" stroke="'+G.l+'" stroke-width="1" stroke-linecap="round"/>';
  s+=I.dome(0,-4,cz+41,3,"#D9A441")+'<circle cx="'+f1(top[0])+'" cy="'+f1(top[1]-3)+'" r="1.4" fill="'+G.l+'"/>';
  /* platillos colgando de cadenas */
  [[-24,1],[16,-1]].forEach(function(q){var py=q[0],hz=bz-16-q[1]*2,a=P(-1,py,bz),c=I.cylD(-1,py,hz,8);
   s+='<path d="M'+f1(a[0])+' '+f1(a[1])+'L'+f1(c.cx-c.rx*.8)+' '+f1(c.cy)+'M'+f1(a[0])+' '+f1(a[1])+'L'+f1(c.cx+c.rx*.8)+' '+f1(c.cy)+'M'+f1(a[0])+' '+f1(a[1])+'L'+f1(c.cx)+' '+f1(c.cy+c.ry*.8)+'" stroke="'+G.s+'" stroke-width=".8"'+(d>0?' stroke-dasharray="1.6 .8"':'')+'/>';
   s+='<path d="M'+f1(c.cx-c.rx)+' '+f1(c.cy)+'A'+f1(c.rx)+' '+f1(c.ry)+' 0 0 0 '+f1(c.cx+c.rx)+' '+f1(c.cy)+'Q'+f1(c.cx)+' '+f1(c.cy+c.ry*3.4)+' '+f1(c.cx-c.rx)+' '+f1(c.cy)+'Z" fill="'+G.s+'"/><ellipse cx="'+f1(c.cx)+'" cy="'+f1(c.cy)+'" rx="'+f1(c.rx)+'" ry="'+f1(c.ry)+'" fill="'+G.l+'"/>'});
  /* libro de leyes acostado y mazo sobre su base, al frente */
  if(d>0){s+=box(16,14,Z,16,12,4,"#8E2F2B",{top:"#A63B35",right:"#6E2421"});s+=box(16.6,14.6,Z+.4,15.2,11.4,3.2,"#F6F0E2",{noTop:true,left:"#EFE6D2",right:"#DCCFB4",noGlint:true});s+=box(16,14,Z+4,16,12,.01,"#A63B35",{left:"#A63B35",right:"#6E2421",top:"#A63B35",noGlint:true});
   var Tb=I.faceTop(16,14,Z+4.1);s+=quad(Tb,3,4,10,1.4,"#E8B33A",{st:false})+quad(Tb,3,6.8,7,1,"#E8B33A",{st:false})}
  s+=I.cyl(-20,26,Z,6,2,Dk.b,{top:Dk.l,sideS:Dk.s});
  /* mazo: mango en diagonal y cabeza cilíndrica a lo largo de x */
  var mh=P(-24,32,Z+2.6),m2=P(-12,18,Z+4);
  s+='<path d="M'+f1(mh[0])+' '+f1(mh[1])+'L'+f1(m2[0])+' '+f1(m2[1])+'" stroke="'+Dk.b+'" stroke-width="2.2" stroke-linecap="round"/>';
  var hd=P(-14,18,Z+4);s+='<g transform="'+I.planeY(-14,14,Z+4.6)+'"><rect x="-2" y="-4.4" width="13" height="8.8" rx="4" fill="'+Dk.b+'"/><rect x="-2" y="-4.4" width="13" height="3.2" rx="1.6" fill="'+Dk.l+'"/><rect x="1.4" y="-4.5" width="1.8" height="9" fill="#C99A2E"/><rect x="6.6" y="-4.5" width="1.8" height="9" fill="#C99A2E"/></g>';
  if(d>1)s+=deco("bush",30,-26,{k:.5,d:d});
  return s}

 /* ================= COMPUTACIÓN ================= */
 function codeScreen(F,u0,v0,w,h,d){
  var s=quad(F,u0,v0,w,h,"#0F2236",{st:false});
  s+='<g class="iso-screen">'+quad(F,u0,v0,w,h,"#12324E",{st:false,op:.6})+'</g>';
  function brace(u,dir,v1,hh){var pts=[[0,0],[-1.4*dir,0],[-2*dir,-hh*.12],[-2*dir,-hh*.4],[-3.2*dir,-hh*.5],[-2*dir,-hh*.6],[-2*dir,-hh*.88],[-1.4*dir,-hh],[0,-hh]];return line(pts.map(function(q){return F(u+q[0],v1+q[1])}),"#7CF2C8",1.6)}
  var hh=h*.7,vt=v0+h*.85;
  s+=brace(u0+w*.22,1,vt,hh)+brace(u0+w*.78,-1,vt,hh);
  if(d>0){var CL=["#FFC857","#FF7AA2","#8AB8FF","#7CF2C8"];[[.3,.2,.32],[.34,.36,.4],[.34,.52,.22],[.3,.68,.3]].forEach(function(q,i){s+=quad(F,u0+w*q[0],vt-hh*q[1]-1,w*q[2],1.5,CL[i],{st:false})});
   s+=quad(F,u0+w*.66,vt-hh*.68-1,1,1.8,"#FFFFFF",{st:false,cls:"iso-blink"})}
  else s+=quad(F,u0+w*.32,vt-hh*.5-1,w*.34,2,"#FFC857",{st:false});
  s+=poly([F(u0+1,v0+h-1),F(u0+w*.25,v0+h-1),F(u0+2,v0+1),F(u0+1,v0+1)],"#FFFFFF",{op:.08,st:false});
  return s}
 function serverRack(x,y,h,d){
  var s=I.shadowBox(x,y,Z,7,8,h);
  s+=box(x,y,Z,7,8,h,"#3A4656",{left:"#404D5E",right:"#2C3644",top:"#56657A"});
  var L=I.faceL(x,y,Z,7,8),n=0,cols=["#57F2A0","#57F2A0","#FFC857","#57F2A0","#4FA8E0","#FF6B7A"];
  for(var k=3;k<h-2;k+=d>0?4.2:7){s+=quad(L,1,k,5,2.6,"#2A3340",{st:false});var p=L(5.2,k+1.3);s+='<circle class="iso-led" style="--dl:'+((n*.37)%1.6).toFixed(2)+'s" cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r="1" fill="'+cols[n%cols.length]+'"/>';n++}
  return s}
 function computacion_s(d){
  var s=plat("#7FD3C8","#4E8F97");
  if(d>0)for(var g=-36;g<=36;g+=12){var q=Math.sqrt(1600-g*g)*.95;s+=line([P(g,-q,Z+.2),P(g,q,Z+.2)],"#A8E6DD",.8,{op:.8})+line([P(-q,g,Z+.2),P(q,g,Z+.2)],"#A8E6DD",.8,{op:.8})}
  /* edificio de oficinas: la fachada izquierda es una pantalla enorme */
  var x=-22,y=-18,w=36,dd=22,h=44;
  s+=I.shadowBox(x,y,Z,w,dd,h);
  s+=box(x,y,Z,w,dd,h,"#E6ECF0",{left:"#DDE5EA",right:"#B9C6D0",top:"#F2F6F8"});
  var L=I.faceL(x,y,Z,w,dd),R=I.faceR(x,y,Z,w,dd);
  s+='<g class="iso-glow">'+poly([L(-1,8),L(w+1,8),L(w+1,h+1),L(-1,h+1)],"#7CF2C8",{op:.18,st:false})+'</g>';
  s+=quad(L,1.4,9,w-2.8,h-12,"#2A3A4A",{st:false})+codeScreen(L,2.6,10.2,w-5.2,h-14.4,d);
  /* planta baja con puerta de vidrio */
  s+=quad(L,w/2-4,0,8,7,"#4FA8E0",{st:false})+line([L(w/2,0),L(w/2,7)],"#E6ECF0",.9);
  if(d>0)for(var r=0;r<4;r++){s+=win(R,3,6+r*9,6,5,"#5BB4E8","#E6ECF0");s+=win(R,12,6+r*9,6,5,"#5BB4E8","#E6ECF0")}
  else s+=quad(R,3,8,15,28,"#5BB4E8",{st:false});
  /* antena en el techo */
  if(d>0){var a=P(x+6,y+5,Z+h),a2=P(x+6,y+5,Z+h+9);s+='<path d="M'+f1(a[0])+' '+f1(a[1])+'L'+f1(a2[0])+' '+f1(a2[1])+'" stroke="#56657A" stroke-width="1.2"/><circle class="iso-led" cx="'+f1(a2[0])+'" cy="'+f1(a2[1])+'" r="1.3" fill="#FF6B7A"/>'}
  /* servidores a un costado, con cables */
  s+=serverRack(20,-14,26,d)+serverRack(22,-2,20,d);
  if(d>0)s+=line([P(14,-8,Z+.6),P(20,-2,Z+.4)],"#2E3A46",1.4)+line([P(14,-12,Z+.6),P(20,-10,Z+.4)],"#E2434B",1.2);
  if(d>1)s+=deco("bush",-30,22,{k:.5,d:d})+deco("lamp",4,32,{d:d});
  return s}
 /* emblema: computadora de escritorio en isométrico real, con teclado y torre */
 function computacion_e(d){
  var s=plat("#7FD3C8","#4E8F97");
  /* monitor: pantalla en la cara izquierda */
  var x=-24,y=-12,w=38,dd=5,z=Z+12,h=30;
  s+=box(-10,-14,Z,14,10,1.6,"#3F4C5A",{top:"#5A6878"})+box(-6,-11,Z+1.6,6,4,10.4,"#4E5C6C");
  s+=I.shadowBox(x,y,Z,w,dd,h+12);
  s+='<g class="iso-glow">'+poly([P(x-2,y+dd+3,z-2),P(x+w+2,y+dd+3,z-2),P(x+w+2,y+dd+3,z+h+2),P(x-2,y+dd+3,z+h+2)],"#7CF2C8",{op:.16,st:false})+'</g>';
  s+=box(x,y,z,w,dd,h,"#2F3A47",{left:"#34404E",right:"#26303B",top:"#4A5767"});
  var L=I.faceL(x,y,z,w,dd);
  s+=codeScreen(L,2,2.4,w-4,h-4.8,d);
  /* teclado al frente */
  var kx=-20,ky=4,kw=30,kd=10;
  s+=box(kx,ky,Z,kw,kd,2,"#DDE3E8",{left:"#CDD5DC",right:"#B3BEC8",top:"#EEF2F5"});
  if(d>0){var K=I.faceTop(kx,ky,Z+2.01);for(var r=0;r<3;r++)for(var c=0;c<(d>1?9:5);c++){var cw=(kw-3)/(d>1?9:5);s+=quad(K,1.5+c*cw,1.4+r*2.8,cw-.8,2,"#FFFFFF",{st:"#C9D2DA",sw:.4})}}
  /* ratón */
  if(d>0)s+='<g transform="'+I.planeG(16,10,Z+.2)+'"><ellipse cx="2.6" cy="1.8" rx="2.6" ry="1.8" fill="#C9D2DA"/></g>'+at(16,10,Z+1.2,'<ellipse cx="1" cy="0" rx="2.6" ry="1.6" fill="#EEF2F5"/>');
  /* torre de servidores con luces */
  s+=serverRack(22,-18,30,d)+(d>0?serverRack(30,-6,22,d):"");
  if(d>0)s+=line([P(18,-8,Z+.6),P(22,-10,Z+.4)],"#E2434B",1.2)+line([P(14,-10,Z+.6),P(24,-4,Z+.4)],"#2E3A46",1.4);
  if(d>1)s+=deco("bush",-32,22,{k:.5,d:d});
  return s}

 /* ================= CINE ================= */
 function searchlight(x,y,dir,d){var s="",M=T("#4A5562");
  s+=I.cyl(x,y,Z,3.4,2,M.b,{top:M.l,noGlint:true});
  var b=P(x,y,Z+6);
  s+='<g transform="translate('+f1(b[0])+' '+f1(b[1])+') rotate('+(dir*24)+')"><path class="iso-beam2" d="M0 -6L-12 -80L12 -80Z" fill="url(#isoBeam2)" opacity=".85"/><rect x="-3.4" y="-6" width="6.8" height="9" rx="2" fill="'+M.b+'"/><ellipse cx="0" cy="-6" rx="3.4" ry="1.6" fill="#FFF3B0"/></g>';
  s+='<path d="M'+f1(b[0]-2)+' '+f1(b[1]+4)+'L'+f1(b[0])+' '+f1(b[1])+'L'+f1(b[0]+2)+' '+f1(b[1]+4)+'" stroke="'+M.s+'" stroke-width="1.2" fill="none"/>';
  return s}
 function cine_s(d){
  var s=plat("#E9DDCB","#A98F67"),RW="#B0303A";
  /* alfombra roja */
  s+=poly([P(-2,10,Z+.3),P(10,10,Z+.3),P(10,46,Z+.3),P(-2,46,Z+.3)],"#C83A43",{st:false});
  if(d>1)s+=searchlight(-30,-18,-1,d);
  var x=-24,y=-24,w=44,dd=32,h=38;
  s+=I.shadowBox(x,y,Z,w,dd,h);
  s+=box(x,y,Z,w,dd,h,"#7C4A8F",{left:"#8B57A0",right:"#5E3870",top:"#9A6BAE"});
  var L=I.faceL(x,y,Z,w,dd),R=I.faceR(x,y,Z,w,dd);
  /* cornisa dorada y carteles */
  s+=quad(L,0,h-3,w,3,"#E8B33A",{st:false})+quad(R,0,h-3,dd,3,"#C4932A",{st:false});
  if(d>0){s+=quad(L,3,8,7,11,"#F2E6C8",{st:false})+quad(L,3.6,8.6,5.8,9.8,"#3F7DA6",{st:false})+quad(L,w-10,8,7,11,"#F2E6C8",{st:false})+quad(L,w-9.4,8.6,5.8,9.8,"#E2434B",{st:false});
   s+=quad(R,4,8,8,11,"#F2E6C8",{st:false})+quad(R,4.6,8.6,6.8,9.8,"#E8B33A",{st:false})}
  /* puertas */
  s+=quad(L,w/2-5,0,10,9,"#2B1E33",{st:false})+line([L(w/2,0),L(w/2,9)],"#E8B33A",.8);
  /* marquesina iluminada que sobresale */
  var mx=x+6,mw=28;
  s+=box(mx,y+dd,Z+10.6,mw,7,2,"#3A2142",{top:"#4B2D55",right:"#2B1833",noGlint:true});
  s+=box(mx+2,y+dd+4.4,Z+12.6,mw-4,1.4,8,"#FFF4D6",{left:"#FFF4D6",right:"#E8D7A8",top:"#FFFFFF"});
  var M=I.faceL(mx+2,y+dd+4.4,Z+12.6,mw-4,1.4);
  if(d>0){var bulbs="";for(var u=1;u<mw-4;u+=2.2){[[u,.8],[u,7.2]].forEach(function(q){var p=M(q[0],q[1]);bulbs+='<circle class="iso-bulb" cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r=".75" fill="#FFC857"/>'})}s+=bulbs;
   /* letras CINE en la marquesina */
   s+='<g transform="'+I.planeX(mx+2+5,y+dd+5.8,Z+12.6+5.8)+'"><text x="0" y="0" font-size="5.2" font-weight="900" fill="#B0303A" letter-spacing=".6">CINE</text></g>'}
  else s+=quad(M,3,2.4,mw-10,3.2,"#B0303A",{st:false});
  /* rollo de película en el techo */
  s+=discX(x+w/2,y+dd/2,Z+h+8,8,"#2E2A33",{hub:"#8C8494"});
  if(d>0)[0,1,2,3,4,5].forEach(function(i){var a=i/6*Math.PI*2;s+='<g transform="'+I.planeX(x+w/2,y+dd/2,Z+h+8)+'"><circle cx="'+f1(Math.cos(a)*5)+'" cy="'+f1(Math.sin(a)*5)+'" r="1.5" fill="#8C8494"/></g>'});
  s+=box(x+w/2-1.5,y+dd/2-1,Z+h,3,2,1.6,"#2E2A33",{noGlint:true});
  s+=searchlight(26,10,1,d);
  if(d>0)s+=deco("lamp",-30,30,{d:d});
  return s}
 /* emblema: cámara clásica en trípode con dos rollos, claqueta y reflector */
 function cine_e(d){
  var s=plat("#E9DDCB","#A98F67"),K=T("#2E3138"),g="";
  var o0=P(-2,-4,Z);
  /* trípode */
  var hub=P(-2,-4,Z+22);
  [[-14,-10],[10,-14],[0,12]].forEach(function(q){var f=P(q[0],q[1],Z);g+='<path d="M'+f1(hub[0])+' '+f1(hub[1])+'L'+f1(f[0])+' '+f1(f[1])+'" stroke="'+K.b+'" stroke-width="2" stroke-linecap="round"/>'+I.contact(1.4,{x:f[0],y:f[1]})});
  /* cuerpo de la cámara */
  var x=-12,y=-10,w=20,dd=12,z=Z+22,h=13;
  g+=box(x,y,z,w,dd,h,K.b,{left:"#3A3E46",right:"#25282E",top:"#4B505A"});
  if(d>0){var L=I.faceL(x,y,z,w,dd);g+=quad(L,2,2,6,4,"#C8A24A",{st:false})+discX(x+14,y+dd,z+6,2.4,"#4B505A",{hub:"#25282E"})}
  /* objetivo que apunta al frente derecho */
  g+=box(x+w,y+3,z+3,7,6,6,"#3A3E46",{noGlint:true});
  var lp=P(x+w+7,y+6,z+6);g+='<g transform="'+I.planeY(x+w+7.1,y+6,z+6)+'"><circle r="3.6" fill="#25282E"/><circle r="2.4" fill="#4FA8E0"/><circle cx="-.8" cy="-.8" r=".8" fill="#FFFFFF" opacity=".8"/></g>';
  /* dos rollos encima */
  [[x+5,9],[x+15,8]].forEach(function(q){g+=discX(q[0],y+dd/2,z+h+q[1],q[1]-.5,"#2E3138",{hub:"#8C8494"});if(d>0)for(var i=0;i<5;i++){var a=i/5*Math.PI*2;g+='<g transform="'+I.planeX(q[0],y+dd/2,z+h+q[1])+'"><circle cx="'+f1(Math.cos(a)*(q[1]*.55))+'" cy="'+f1(Math.sin(a)*(q[1]*.55))+'" r="'+f1(q[1]*.16)+'" fill="#8C8494"/></g>'}});
  /* película entre rollos */
  if(d>0){var r1=P(x+5,y+dd/2,z+h+9),r2=P(x+15,y+dd/2,z+h+8);g+='<path d="M'+f1(r1[0])+' '+f1(r1[1]+8)+'Q'+f1((r1[0]+r2[0])/2)+' '+f1(r1[1]+16)+' '+f1(r2[0])+' '+f1(r2[1]+7)+'" stroke="#1C1E22" stroke-width="1.4" fill="none"/>'}
  s+='<g transform="translate('+f1(o0[0])+' '+f1(o0[1])+') scale(1.5) translate('+f1(-o0[0])+' '+f1(-o0[1])+')">'+g+'</g>';
  /* claqueta al frente */
  var cx=-32,cy=22;
  s+=I.shadowBox(cx,cy,Z,14,2,10);
  s+='<g transform="'+I.planeX(cx,cy+2,Z)+'"><rect x="0" y="-11" width="14" height="11" rx="1" fill="#2E3138"/><rect x="1.4" y="-6.4" width="11.2" height="1" fill="#FFFFFF" opacity=".7"/><rect x="1.4" y="-3.4" width="7" height="1" fill="#FFFFFF" opacity=".7"/>'+
   '<g transform="rotate(-16 0 -11)"><rect x="0" y="-14.2" width="14" height="3" fill="#FFFFFF"/>'+[0,1,2,3].map(function(i){return '<path d="M'+(1+i*3.4)+' -11.2l2 -3h1.6l-2 3z" fill="#2E3138"/>'}).join("")+'</g></g>';
  /* reflector a un lado */
  if(d>0){var sp=P(30,-24,Z);s+=I.cyl(30,-24,Z,2.4,1.2,"#4A5562",{noGlint:true});var t=P(30,-24,Z+18);s+='<path d="M'+f1(sp[0])+' '+f1(sp[1]-1)+'L'+f1(t[0])+' '+f1(t[1])+'" stroke="#4A5562" stroke-width="1.4"/>';
   s+='<g transform="translate('+f1(t[0])+' '+f1(t[1])+') rotate(-30)"><path d="M0 0L-30 -10L-30 12Z" fill="url(#isoBeam)" opacity=".7"/><rect x="-1" y="-4" width="8" height="8" rx="2" fill="#4A5562"/><ellipse cx="-1" cy="0" rx="1.4" ry="3.6" fill="#FFF3B0"/></g>'}
  if(d>1)s+=deco("flowers",28,24,{k:.8,d:d});
  return s}

 /* ================= ARQUITECTURA ================= */
 function houseModel(x,y,z,k,d,half){var s="",W=T("#F4EFE6"),Rf=T("#C96A4A");
  var w=12*k,dd=10*k,h=8*k;
  s+=box(x,y,z,w,dd,h,W.b,{left:W.b,right:W.s,top:W.l,noGlint:true});
  if(d>0){var L=I.faceL(x,y,z,w,dd);s+=quad(L,2*k,3*k,2.6*k,2.6*k,"#7FB6DA",{st:false})+quad(L,7*k,0,2.6*k,4.6*k,"#9A6B45",{st:false})}
  if(half){/* techo a medio construir: vigas visibles */
   var rh=6*k,r1=P(x,y+dd/2,z+h+rh),r2=P(x+w,y+dd/2,z+h+rh);
   s+=I.poly([P(x,y+dd/2,z+h+rh),P(x+w*.45,y+dd/2,z+h+rh),P(x+w*.45,y+dd,z+h),P(x,y+dd,z+h)],Rf.b);
   for(var i=0;i<=4;i++){var xx=x+w*.45+i*(w*.55/4);s+=line([P(xx,y+dd,z+h),P(xx,y+dd/2,z+h+rh),P(xx,y,z+h)],"#B07B4E",.9)}
   s+=line([r1,r2],"#8A5E3C",1.1);
  }else s+=I.gable(x,y,z+h,w,dd,6*k,"#C96A4A",{ov:1});
  return s}
 function arquitectura_s(d){
  var s=plat("#D9E8C9","#9A8B6E");
  var x=-24,y=-22,w=34,dd=28,h=30;
  s+=I.shadowBox(x,y,Z,w,dd,h);
  s+=box(x,y,Z,w,dd,h,"#F2EEE6",{left:"#E9E3D8",right:"#CFC6B6",top:"#FAF8F3"});
  var L=I.faceL(x,y,Z,w,dd),R=I.faceR(x,y,Z,w,dd);
  /* ventanal de cortina de vidrio en la fachada izquierda */
  s+=quad(L,2,2,w-4,h-6,"#7FB6DA",{st:false});
  if(d>0){for(var u=2;u<=w-2;u+=d>1?4:8)s+=line([L(u,2),L(u,h-4)],"#E9E3D8",.9);for(var v=2;v<=h-4;v+=8)s+=line([L(2,v),L(w-2,v)],"#E9E3D8",.9);s+=poly([L(4,h-6),L(12,h-6),L(4,6)],"#FFFFFF",{op:.22,st:false})}
  if(d>0)for(var r=0;r<2;r++)s+=win(R,4,6+r*11,dd-8,6,"#7FB6DA","#E9E3D8");else s+=quad(R,4,6,dd-8,16,"#6EA3C6",{st:false});
  /* losa voladiza */
  s+=box(x-2,y-2,Z+h,w+6,dd+4,2,"#3D4652",{top:"#57616E",right:"#2D343D"});
  /* maqueta en la entrada sobre su mesa */
  s+=box(12,14,Z,14,12,6,"#8A5E3C",{top:"#B07B4E",noGlint:true})+houseModel(13,15,Z+6,1,d,false);
  if(d>0)s+=deco("treeRound",-30,22,{k:.6,d:d})+deco("bush",24,-24,{k:.45,d:d});
  return s}
 /* emblema: maqueta a medio construir sobre un plano, compás gigante y regla */
 function arquitectura_e(d){
  var s=plat("#D9E8C9","#9A8B6E"),BL="#2F6FB0";
  /* plano extendido con rollo en un extremo */
  var px=-30,py=-18,pw=46,pd=34;
  s+=poly([P(px,py,Z+.3),P(px+pw,py,Z+.3),P(px+pw,py+pd,Z+.3),P(px,py+pd,Z+.3)],BL,{st:false});
  if(d>0){var Tg=I.faceTop(px,py,Z+.35);for(var g=4;g<pw;g+=6)s+=line([Tg(g,2),Tg(g,pd-2)],"#5C93CC",.5);for(g=4;g<pd;g+=6)s+=line([Tg(2,g),Tg(pw-2,g)],"#5C93CC",.5);
   s+=line([Tg(6,6),Tg(26,6),Tg(26,22),Tg(6,22),Tg(6,6)],"#FFFFFF",.8)+line([Tg(30,10),Tg(42,10)],"#FFFFFF",.8)}
  s+=discY(px,py+pd*.5,Z+3,3,"#5C93CC",{hub:"#2F6FB0"});
  s+='<g transform="'+I.planeY(px,py,Z+3)+'"><rect x="0" y="-3" width="'+pd+'" height="6" fill="#4A84C2"/><rect x="0" y="-3" width="'+pd+'" height="2" fill="#7FB0E0"/></g>';
  /* maqueta a medio construir */
  s+=houseModel(-20,-10,Z+.4,1.8,d,true);
  /* regla acostada */
  if(d>0){s+=box(-26,22,Z,30,4,1.2,"#F2C14E",{noGlint:true});var Rt=I.faceTop(-26,22,Z+1.21);for(var t=1;t<30;t+=d>1?2:4)s+=line([Rt(t,0),Rt(t,t%4<2?2.2:1.2)],"#8A6A1E",.4)}
  /* compás gigante de pie, abierto, en el plano y */
  var cx=18,cy=6,M=T("#7F8C99");
  s+=I.contact(1.6,{x:P(cx,cy-9,Z)[0],y:P(cx,cy-9,Z)[1]})+I.contact(1.6,{x:P(cx,cy+11,Z)[0],y:P(cx,cy+11,Z)[1]});
  s+='<g transform="'+I.planeY(cx,cy-10,Z)+'">'+
   '<path d="M0 0L9.6 -44L11.4 -44L3 0Z" fill="'+M.b+'"/><path d="M1.6 0L10.6 -44L11.4 -44L3 0Z" fill="'+M.s+'"/>'+
   '<path d="M21 0L11.4 -44L13 -44L22.6 0Z" fill="'+M.l+'"/><path d="M21.8 0L12.4 -44L13 -44L22.6 0Z" fill="'+M.b+'"/>'+
   '<path d="M19.4 -6L23 0L21.4 -6Z" fill="#3A4452"/>'+
   (d>0?'<path d="M4.6 -18L18 -18" stroke="'+M.s+'" stroke-width="1.2"/>':'')+
   '<circle cx="12.2" cy="-45.4" r="3.2" fill="#C99A2E"/><circle cx="12.2" cy="-45.4" r="1.2" fill="#8A6A1E"/><rect x="11.4" y="-52" width="1.6" height="5" rx=".8" fill="#5A6573"/></g>';
  if(d>1)s+=deco("bush",30,-22,{k:.45,d:d});
  return s}

 /* ================= VETERINARIA ================= */
 /* perro sentado, de tres cuartos, mirando al frente izquierdo; una sola silueta */
 var DOG="M-12 0C-12.4 -6 -12.6 -16 -13.2 -24C-14 -29 -14.2 -33 -12.6 -37C-13.6 -38.4 -15.6 -40 -18 -41C-21 -41.6 -24.4 -42.4 -25.6 -44.6C-26.4 -46.4 -25.2 -48.6 -22.8 -49.6C-20 -51 -17.2 -54 -15.2 -57.4C-13.4 -60.4 -9.6 -62 -6 -61.4C-3 -61 -.6 -59 .2 -56.2C1.2 -53.4 1.6 -50 .4 -47.2C-.6 -45 -2.4 -44 -3.4 -42.6C-1.6 -40.6 1.2 -38.8 4.6 -36.4C9.4 -33 13.8 -28.6 16.4 -23C19.4 -17 20.4 -10.8 19.8 -5.6C21.6 -6.2 23.8 -6.8 25.4 -5.6C26.8 -4.4 26 -2.4 24.2 -1.6C21.6 -.6 18.4 -.2 15.6 0C11 .4 6.4 .2 2.4 -.4C1.2 -1.6 -.8 -2.2 -2.6 -1.2C-3.4 -.6 -4 -.2 -4.8 0C-7.2 .4 -9.8 .4 -12 0Z";
 var EAR="M-6.8 -59.2C-3.8 -59.6 -1.2 -57.6 -.6 -54.4C-.2 -51.4 -1 -47.4 -3.6 -45.2C-5.2 -43.8 -7.2 -44.6 -7.4 -46.6C-7.8 -50 -8.6 -54.6 -6.8 -59.2Z";
 function dog(x,y,k,d,o){o=o||{};var D=T(o.c||"#E3A45C"),s="",p=P(x,y,Z);
  var inner='<path d="M2 -40C8 -34 14 -26 16 -18C18 -10 18 -4 16 2L30 2L30 -50Z" fill="'+D.s+'"/>';
  inner+='<path d="M-11 -2C-11.4 -10 -11.6 -18 -12 -26L-8 -26C-8 -18 -7.8 -10 -7.4 -2Z" fill="'+D.l+'" opacity=".55"/>';
  inner+='<path d="M-24.6 -44.6C-22 -43.4 -18.6 -42.6 -16 -41.4C-17 -43.6 -19.6 -45.4 -22.6 -46.2Z" fill="#F6E3C6"/>';
  if(d>0)inner+='<path d="M-14.6 -56.4C-12 -59.4 -8 -60.6 -4.6 -59.6" stroke="'+D.h+'" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M6 -2C8 -8 8.6 -14 8 -20" stroke="'+D.s+'" stroke-width="1" fill="none" opacity=".6"/>';
  var body=shaded(DOG,D.b,inner)+shaded(EAR,D.s,'<path d="M-6.8 -59.2L-3 -58L-6 -46Z" fill="'+D.d+'" opacity=".35"/>');
  body+='<circle cx="-25.6" cy="-45.6" r="1.7" fill="#2A1E1A"/>';
  if(d>0)body+='<circle cx="-14.6" cy="-50.6" r="1.25" fill="#2A1E1A"/><circle cx="-15" cy="-51" r=".4" fill="#FFFFFF"/><path d="M-25 -43.6Q-22.6 -42 -20 -42.6" stroke="#8A4E2A" stroke-width=".7" fill="none"/>';
  /* collar y placa */
  body+='<path d="M-14.2 -38.8C-10.6 -37 -6 -36.6 -2.6 -38.6" stroke="'+(o.collar||"#E2434B")+'" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="-9" cy="-35" r="2" fill="#F2C14E"/><circle cx="-9.4" cy="-35.4" r=".6" fill="#FFF3C0"/>';
  if(o.steth){body+='<path d="M-12.6 -37.4C-14.4 -31 -13 -26 -9.6 -24.4C-6 -23 -3 -26 -3 -30C-3 -33 -3.4 -36 -3.8 -37.8" stroke="#38424F" stroke-width="1.5" fill="none" stroke-linecap="round"/><circle cx="-9.6" cy="-24.2" r="2.2" fill="#C9D1DA"/><circle cx="-9.6" cy="-24.2" r="1.2" fill="#9AA5B1"/>'}
  s+=I.cast(16*k,26*k,{x:p[0]+2*k,y:p[1]+.6*k})+I.contact(14*k,{x:p[0]+4*k,y:p[1]});
  s+='<g transform="translate('+f1(p[0])+' '+f1(p[1])+') scale('+k+')">'+body+'</g>';
  return s}
 function paw(F,u,v,k,col){var s="";[[0,0,2.2,1.8],[-2.8,2.4,1,1.2],[-1,3.6,1,1.2],[1,3.6,1,1.2],[2.8,2.4,1,1.2]].forEach(function(q){var c=F(u+q[0]*k,v+q[1]*k),c2=F(u+q[0]*k+q[2]*k,v+q[1]*k);s+='<ellipse cx="'+f1(c[0])+'" cy="'+f1(c[1])+'" rx="'+f1(q[2]*k)+'" ry="'+f1(q[3]*k)+'" fill="'+col+'"/>'});return s}
 function veterinaria_s(d){
  var s=plat("#9FD67E","#A98F67");
  if(d>0)s+=I.walk(-4,44,-4,24,8,"#EFE4CC");
  var x=-24,y=-20,w=30,dd=24,h=20;
  s+=I.shadowBox(x,y,Z,w,dd,h+12);
  s+=box(x,y,Z,w,dd,h,WALL,{left:"#F2ECE0",right:"#D9D3CC",top:"#FFFDF8"});
  s+=I.gable(x,y,Z+h,w,dd,12,"#4FA8A0",{ov:2});
  var L=I.faceL(x,y,Z,w,dd),R=I.faceR(x,y,Z,w,dd);
  s+=arch(L,w/2-4,0,8,11,"#7FC3E8");
  if(d>0){s+=win(L,3,6,6,6,GLASS,FRAME)+win(L,w-9,6,6,6,GLASS,FRAME)+win(R,4,6,6,6,GLASS,FRAME)+win(R,14,6,6,6,GLASS,FRAME)}
  else s+=quad(L,3,6,6,6,GLASS,{st:false})+quad(L,w-9,6,6,6,GLASS,{st:false});
  /* letrero con huella en el frente del techo */
  var sx=x+w/2-7;s+=box(sx,y+dd+1.6,Z+h+1,14,1.4,11,"#FFFFFF",{left:"#FFFFFF",right:"#D9DCE2",top:"#FFFFFF"});
  var S=I.faceL(sx,y+dd+1.6,Z+h+1,14,1.4);s+=paw(S,7,3,1.1,"#4FA8A0");
  /* casita de perro */
  s+=box(14,12,Z,10,10,8,"#C96A4A",{left:"#D07A58",right:"#A8553A"})+I.gable(14,12,Z+8,10,10,5,"#8A5E3C",{ov:1});
  var Dh=I.faceL(14,12,Z,10,10);s+='<path d="M'+f1(Dh(3,0)[0])+' '+f1(Dh(3,0)[1])+'L'+f1(Dh(3,4)[0])+' '+f1(Dh(3,4)[1])+'Q'+f1(Dh(5,6.4)[0])+' '+f1(Dh(5,6.4)[1])+' '+f1(Dh(7,4)[0])+' '+f1(Dh(7,4)[1])+'L'+f1(Dh(7,0)[0])+' '+f1(Dh(7,0)[1])+'Z" fill="#3A2420"/>';
  /* perro esperando en la entrada */
  s+=dog(4,30,.3,d);
  if(d>0){var bw=P(26,30,Z);s+='<g transform="'+I.planeG(26,28,Z)+'"><ellipse cx="0" cy="0" rx="4" ry="4" fill="#4FA8E0"/><ellipse cx="0" cy="0" rx="2.6" ry="2.6" fill="#2F7FB0"/></g>'}
  if(d>1)s+=deco("bush",-32,14,{k:.5,d:d});
  return s}
 /* emblema: perro gigante sentado con collar, placa y estetoscopio, plato con hueso */
 function veterinaria_e(d){
  var s=plat("#9FD67E","#A98F67");
  s+=dog(-2,6,.92,d,{steth:d>0});
  /* plato con hueso */
  var bx=22,by=22;s+=I.shadowEll(bx,by,Z,7)+I.cyl(bx,by,Z,7,2.4,"#E2434B",{top:"#F4F1EC",sideS:"#B8303A"})+I.ell(bx,by,Z+2.5,5.2,"#E7E2DA");
  var b=P(bx,by,Z+3.2);s+='<g transform="translate('+f1(b[0])+' '+f1(b[1])+') rotate(-18)"><path d="M-6 -1C-7.6 -2.8 -6 -4.4 -4.6 -3C-4 -3.8 -2.4 -3 -3 -1.6L3 -1.6C2.4 -3 4 -3.8 4.6 -3C6 -4.4 7.6 -2.8 6 -1C7.6 .8 6 2.4 4.6 1C4 1.8 2.4 1 3 -.4L-3 -.4C-2.4 1 -4 1.8 -4.6 1C-6 2.4 -7.6 .8 -6 -1Z" fill="#FFF8EA"/><path d="M-3 -.4L3 -.4L3 .4L-3 .4Z" fill="#E4D8BF"/></g>';
  if(d>0)s+=deco("bush",30,-26,{k:.5,d:d});
  if(d>1)s+=deco("flowers",-30,26,{k:.8,d:d});
  return s}

 /* ================= CIENCIA DE DATOS ================= */
 var BARS=["#3F7DA6","#5BA3D0","#7CC4E8","#F2B544"];
 function datos_s(d){
  var s=plat("#7FD3C8","#4E8F97");
  var x=-18,y=-18,w=24,dd=24,h=50;
  s+=I.shadowBox(x,y,Z,w,dd,h+14);
  s+=box(x,y,Z,w,dd,h,"#5BB4E8",{left:"#62B8EA",right:"#3E8CC4",top:"#B7E3FA"});
  var L=I.faceL(x,y,Z,w,dd),R=I.faceR(x,y,Z,w,dd);
  for(var v=5;v<h;v+=d>0?6:12){s+=line([L(0,v),L(w,v)],"#DDF3FF",.8,{op:.75})+line([R(0,v),R(dd,v)],"#9BD0F2",.8,{op:.6})}
  if(d>0)for(var u=6;u<w;u+=6)s+=line([L(u,0),L(u,h)],"#DDF3FF",.6,{op:.5});
  s+=poly([L(2,h-2),L(9,h-2),L(2,6)],"#FFFFFF",{op:.22,st:false});
  s+=quad(L,w/2-3,0,6,6,"#2F5A82",{st:false});
  /* cartelera con gráfica de barras en el techo */
  var bz=Z+h,bx=x+2,by=y+dd/2;
  s+=line([P(bx+4,by,bz),P(bx+4,by,bz+6)],"#56657A",1.2)+line([P(bx+18,by,bz),P(bx+18,by,bz+6)],"#56657A",1.2);
  s+=box(bx,by,bz+6,22,1.6,14,"#FFFFFF",{left:"#FFFFFF",right:"#D9DCE2",top:"#F2F4F6"});
  var B=I.faceL(bx,by,bz+6,22,1.6);
  [[3,4],[7.6,7],[12.2,5.4],[16.8,10]].forEach(function(q,i){s+=quad(B,q[0],1.6,3.2,q[1],BARS[i],{st:false})});
  if(d>0)s+=line([B(4.6,6),B(9.2,9),B(13.8,7.6),B(18.4,12.4)],"#E2434B",1.1);
  if(d>0)s+=deco("bush",-30,22,{k:.5,d:d})+deco("lamp",22,20,{d:d});
  if(d>1)s+=deco("bench",4,28,{d:d});
  return s}
 /* emblema: gráfica de barras 3D gigante con línea de tendencia y lupa enorme */
 function datos_e(d){
  var s=plat("#7FD3C8","#4E8F97");
  s+=box(-30,-20,Z,46,22,2,"#E6ECF0",{top:"#F2F6F8",right:"#B9C6D0"});
  var H=[12,22,17,34],X=[-28,-17,-6,5];
  X.forEach(function(x,i){s+=I.shadowBox(x,-16,Z+2,8,12,H[i]);s+=box(x,-16,Z+2,8,12,H[i],BARS[i])});
  /* línea de tendencia con flecha, por encima de las barras */
  var tp=X.map(function(x,i){return P(x+4,-10,Z+2+H[i]+7)});
  s+='<path d="M'+tp.map(function(p){return f1(p[0])+" "+f1(p[1])}).join("L")+'" stroke="#E2434B" stroke-width="2.4" fill="none" stroke-linejoin="round" stroke-linecap="round"/>';
  var a=tp[3],b=tp[2],ang=Math.atan2(a[1]-b[1],a[0]-b[0]);
  s+='<path d="M'+f1(a[0]+Math.cos(ang)*5)+' '+f1(a[1]+Math.sin(ang)*5)+'L'+f1(a[0]+Math.cos(ang+2.5)*5)+' '+f1(a[1]+Math.sin(ang+2.5)*5)+'L'+f1(a[0]+Math.cos(ang-2.5)*5)+' '+f1(a[1]+Math.sin(ang-2.5)*5)+'Z" fill="#E2434B"/>';
  if(d>0)tp.forEach(function(p){s+='<circle cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r="1.8" fill="#FFFFFF" stroke="#E2434B" stroke-width="1"/>'});
  /* lupa enorme apoyada: aro con grosor, cristal y mango hasta el piso */
  var lc=P(10,16,Z+18),M=T("#3A4452");
  var h0=P(20,30,Z+.8);
  s+=I.contact(2.4,{x:h0[0],y:h0[1]});
  s+='<path d="M'+f1(lc[0]+9)+' '+f1(lc[1]+8)+'L'+f1(h0[0])+' '+f1(h0[1])+'" stroke="'+M.b+'" stroke-width="4.4" stroke-linecap="round"/><path d="M'+f1(lc[0]+9)+' '+f1(lc[1]+7)+'L'+f1(h0[0]-.8)+' '+f1(h0[1]-1.4)+'" stroke="'+M.l+'" stroke-width="1.2" stroke-linecap="round"/>';
  s+='<g transform="translate('+f1(lc[0])+' '+f1(lc[1])+') rotate(-24)"><ellipse rx="13" ry="11.4" fill="'+M.b+'"/><ellipse rx="10.6" ry="9" fill="#BFE6F7" opacity=".72"/><path d="M-6 -5Q-2 -8.4 3 -7.6" stroke="#FFFFFF" stroke-width="1.6" fill="none" stroke-linecap="round"/><ellipse rx="13" ry="11.4" fill="none" stroke="'+M.l+'" stroke-width="1" stroke-dasharray="20 60"/></g>';
  if(d>0)s+=deco("bush",-34,14,{k:.5,d:d});
  if(d>1)s+=deco("lamp",26,-24,{d:d});
  return s}

 var A={
  medicina:{s:medicina_s,e:medicina_e},derecho:{s:derecho_s,e:derecho_e},computacion:{s:computacion_s,e:computacion_e},
  cine:{s:cine_s,e:cine_e},arquitectura:{s:arquitectura_s,e:arquitectura_e},veterinaria:{s:veterinaria_s,e:veterinaria_e},datos:{s:datos_s,e:datos_e}
 };
 /* elección guardada en el dispositivo: estructura (s) o emblema (e); mientras no elijas, estructura */
 var PICK={};try{PICK=JSON.parse(localStorage.getItem("vocatlas_estilo")||"{}")||{}}catch(e){}
 function pick(id,v){if(v){PICK[id]=v;try{localStorage.setItem("vocatlas_estilo",JSON.stringify(PICK))}catch(e){}}return PICK[id]||"s"}
 function get(id,d,v,o){var a=A[id];if(!a)return null;NOPLAT=!!(o&&o.noPlat);var r=a[v||pick(id)](d==null?2:d);NOPLAT=false;return r}
 return {A:A,get:get,pick:pick,has:function(id){return !!A[id]},ids:Object.keys(A)};
})(ISO,ENV);
