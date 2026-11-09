/* ================= carreras v2 =================
   Misma plataforma, misma luz y mismo ensamblador por profundidad que Medicina, Derecho y Computación.
   Cada pieza declara sus partes con su huella en el suelo; el ensamblador las ordena. */
(function(I,E,H){
 var P=I.P,box=I.box,quad=I.quad,win=I.win,cyl=I.cyl,poly=I.poly,line=I.line,T=I.T,f1=I.f1,sm=I.smooth,shaded=I.shaded;
 var Z=H.Z,GLASS=H.GLASS,FRAME=H.FRAME,WALL=H.WALL,RED=H.RED,piece=H.piece,dp=H.dp,at=H.at,plat=H.plat;
 function pd(a){return "M"+a.map(function(p){return f1(p[0])+" "+f1(p[1])}).join("L")+"Z"}
 /* toldo de rayas inclinado, con grosor en el borde y faldón ondulado (sobre la cara izquierda de una caja) */
 function awning(x,y,z,w,dep,drop,c1,c2,n){var s="",st=w/n;
  for(var i=0;i<n;i++){var a=P(x+i*st,y,z),b=P(x+(i+1)*st,y,z),c=P(x+(i+1)*st,y+dep,z-drop),d=P(x+i*st,y+dep,z-drop);s+=poly([a,b,c,d],i%2?c2:c1,{st:i%2?c2:c1,sw:.3})}
  /* faldón: medialunas colgando del borde */
  for(i=0;i<n;i++){var p0=P(x+i*st,y+dep,z-drop),p1=P(x+(i+1)*st,y+dep,z-drop);s+='<path d="M'+f1(p0[0])+' '+f1(p0[1])+'Q'+f1((p0[0]+p1[0])/2)+' '+f1((p0[1]+p1[1])/2+3.2)+' '+f1(p1[0])+' '+f1(p1[1])+'Z" fill="'+I.shade(i%2?c2:c1,.12)+'"/>'}
  s+=line([P(x,y+dep,z-drop),P(x+w,y+dep,z-drop)],"#FFFFFF",.5,{op:.6,cap:"butt"});
  return s}
 /* fruta redonda con volumen: base, sombra abajo a la derecha y brillo */
 function fruit(x,y,z,r,c,o){o=o||{};var t=T(c),p=P(x,y,z),cx=p[0],cy=p[1]-r;var s='<circle cx="'+f1(cx)+'" cy="'+f1(cy)+'" r="'+f1(r)+'" fill="'+t.b+'"/><path d="M'+f1(cx+r)+' '+f1(cy)+'A'+f1(r)+' '+f1(r)+' 0 0 1 '+f1(cx-r*.5)+' '+f1(cy+r*.86)+'Q'+f1(cx+r*.4)+' '+f1(cy+r*.4)+' '+f1(cx+r)+' '+f1(cy)+'Z" fill="'+t.s+'"/><circle cx="'+f1(cx-r*.38)+'" cy="'+f1(cy-r*.4)+'" r="'+f1(r*.24)+'" fill="'+t.h+'" opacity=".9"/>';
  if(o.leaf)s+='<path d="M'+f1(cx)+' '+f1(cy-r)+'q.6 -1.6 2.2 -1.8q-.4 1.6 -2.2 1.8z" fill="#4E9E45"/>';return s}
 /* caja de fruta con tablillas y fruta asomando */
 function crate(x,y,w,d,c){var s=I.shadowBox(x,y,Z,w,d,5)+box(x,y,Z,w,d,4,"#C99A5B",{noGlint:true});var L=I.faceL(x,y,Z,w,d);s+=line([L(0,2),L(w,2)],"#9A6E3A",.5,{cap:"butt"});
  for(var i=0;i<3;i++)for(var j=0;j<2;j++)s+=fruit(x+1.6+i*(w-3)/2,y+1.4+j*(d-2.6),Z+3.4,1.5,c);return s}


 /* perro v2: sentado de tres cuartos mirando al frente izquierdo, para que se lea como perro a cualquier tamaño:
    cabeza grande con dos orejas caídas, hocico claro con nariz grande, pecho claro, dos patas delanteras con patitas,
    muslo trasero redondo y cola levantada */
 function dog2(x,y,k,d,o){o=o||{};var D=T(o.c||"#E3A45C"),EARC=o.ear||"#A8642F",CR="#FBEBD2",s="",p=P(x,y,Z),b="";
  /* cola levantada (detrás) */
  b+='<path d="M11 -9C17 -12 21 -18 21.6 -27" stroke="'+D.s+'" stroke-width="4.2" fill="none" stroke-linecap="round"/><path d="M20.6 -24C21.4 -26 21.6 -27 21.6 -28" stroke="'+CR+'" stroke-width="3.6" fill="none" stroke-linecap="round"/>';
  /* muslo trasero */
  b+=shaded("M1 -2C0 -10 4 -19 11 -19C17 -19 19 -12 18 -6C17.4 -2 15 0 12 0L2 0Z",D.b,'<path d="M10 -20C17 -16 19 -8 16 1L24 1L24 -20Z" fill="'+D.s+'"/>');
  b+='<ellipse cx="13.4" cy="-1" rx="5.4" ry="2.2" fill="'+CR+'"/>';
  /* cuerpo */
  b+=shaded("M-11 0C-12.4 -10 -11.6 -24 -7 -32C-3 -38 5 -38 8 -31C11.6 -23 12 -11 10.4 0Z",D.b,'<path d="M5 -38C10 -30 12 -16 10 2L16 2L16 -38Z" fill="'+D.s+'"/><path d="M-5.6 -4C-7.6 -12 -6.4 -24 -2 -30.6C1.8 -24 2 -12 .4 -4Z" fill="'+CR+'"/>');
  /* patas delanteras con patitas */
  b+='<path d="M-9.4 0L-9.4 -16Q-9.4 -18.4 -6.9 -18.4Q-4.4 -18.4 -4.4 -16L-4.4 0Z" fill="'+D.b+'"/><path d="M-2.6 0L-2.6 -16Q-2.6 -18.4 -.1 -18.4Q2.4 -18.4 2.4 -16L2.4 0Z" fill="'+D.s+'"/>';
  b+='<ellipse cx="-7.2" cy="-.6" rx="3.4" ry="1.9" fill="'+CR+'"/><ellipse cx=".2" cy="-.6" rx="3.4" ry="1.9" fill="#EBD7B8"/>';
  if(d>0)b+='<path d="M-8.2 -1.6V-.2M-6.2 -1.6V-.2M-.8 -1.6V-.2M1.2 -1.6V-.2" stroke="#C9A77A" stroke-width=".5"/>';
  /* collar y placa */
  b+='<path d="M-9.4 -34.6Q-1 -31 7.6 -34.6" stroke="'+(o.collar||"#E2434B")+'" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="-1" cy="-30.4" r="2.1" fill="#F2C14E"/><circle cx="-1.5" cy="-30.9" r=".7" fill="#FFF3C0"/>';
  if(o.steth)b+='<path d="M-8.4 -33C-10 -27 -8 -21.6 -3.6 -20.6C.6 -19.8 3.6 -23 3.4 -27.6C3.2 -30.4 4.6 -32.6 6.2 -33.4" stroke="#38424F" stroke-width="1.6" fill="none" stroke-linecap="round"/><circle cx="-3.4" cy="-20.4" r="2.6" fill="#C9D1DA"/><circle cx="-3.4" cy="-20.4" r="1.4" fill="#8E99A6"/><circle cx="-4.1" cy="-21.1" r=".6" fill="#FFFFFF"/>';
  /* cabeza */
  b+=shaded("M-13.4 -47C-13.4 -54.6 -7.6 -59 -1.4 -59C5.4 -59 9.6 -54.4 9.6 -47.6C9.6 -41 5 -36.4 -1.6 -36.4C-8.4 -36.4 -13.4 -40.6 -13.4 -47Z",D.b,'<path d="M3 -60C10 -56 11 -44 4 -35L14 -35L14 -60Z" fill="'+D.s+'"/>'+(d>0?'<path d="M-9.6 -54.4Q-5.6 -58.4 -.6 -58" stroke="'+D.h+'" stroke-width="1.3" fill="none" stroke-linecap="round"/>':''));
  /* orejas caídas */
  b+='<path d="M-10.6 -55.6C-15.4 -55 -17.4 -49 -16.6 -43C-16.2 -40.4 -13.8 -40 -12.8 -42C-11.6 -45 -10.4 -50 -8.6 -54Z" fill="'+EARC+'"/><path d="M5.4 -56.4C10.4 -56.4 12.6 -50.6 12 -44.4C11.8 -41.8 9.4 -41.2 8.4 -43.2C7.2 -46.4 6.4 -51 4.4 -54.6Z" fill="'+I.shade(EARC,.15)+'"/>';
  /* hocico, nariz, boca y lengua */
  b+='<ellipse cx="-5.2" cy="-41.6" rx="7.2" ry="5" fill="'+CR+'"/><path d="M-12.4 -41.6Q-5.2 -35.6 2 -41.6Q1 -37.2 -5.2 -36.6Q-11.4 -37.2 -12.4 -41.6Z" fill="#EBD7B8"/>';
  b+='<ellipse cx="-6" cy="-44.4" rx="3" ry="2.2" fill="#2A1E1A"/><ellipse cx="-6.9" cy="-45.1" rx="1" ry=".6" fill="#FFFFFF" opacity=".75"/>';
  b+='<path d="M-6 -42.2V-40.4M-9 -39.8Q-6 -38.2 -6 -40.4Q-6 -38.2 -3 -39.8" stroke="#5A3A22" stroke-width=".8" fill="none" stroke-linecap="round"/>';
  if(d>0)b+='<path d="M-6.8 -39.4Q-6 -36.6 -5.2 -39.4Z" fill="#F07C8A"/>';
  /* ojos con brillo y cejas */
  b+='<circle cx="-9.6" cy="-49.4" r="1.9" fill="#2A1E1A"/><circle cx="-1.8" cy="-50" r="1.9" fill="#2A1E1A"/><circle cx="-10.2" cy="-50.1" r=".7" fill="#FFFFFF"/><circle cx="-2.4" cy="-50.7" r=".7" fill="#FFFFFF"/>';
  if(d>0)b+='<path d="M-11.4 -53Q-9.6 -54.2 -8 -53.2M-3.4 -53.6Q-1.6 -54.8 0 -53.8" stroke="'+D.d+'" stroke-width=".8" fill="none" stroke-linecap="round"/>';
  s+=I.cast(14*k,24*k,{x:p[0]+4*k,y:p[1]+.6*k})+I.contact(15*k,{x:p[0]+2*k,y:p[1]});
  s+='<g transform="translate('+f1(p[0])+' '+f1(p[1])+') scale('+k+')">'+b+'</g>';
  return s}

 /* ================= VETERINARIA v2 ================= */
 function vet_s(d){
  var g=plat("#9FD67E","#A98F67"),s="";
  if(d>0)g+=I.walk(-2,44,-2,22,8,"#EFE4CC");
  var x=-26,y=-22,w=32,dd=26,h=20,TEAL="#3FA59B";
  s+=I.shadowBox(x,y,Z,w,dd,h+14);
  s+=box(x,y,Z,w,dd,h,WALL,{left:"#F3EDE2",right:"#D9D3CC",top:"#FFFDF8"});
  /* zócalo verde agua */
  var L=I.faceL(x,y,Z,w,dd),R=I.faceR(x,y,Z,w,dd);
  s+=quad(L,0,0,w,3,"#9ED4CD",{st:false})+quad(R,0,0,dd,3,"#7FBDB5",{st:false});
  s+=I.gable(x,y,Z+h,w,dd,13,TEAL,{ov:2.2,th:2});
  /* puerta de vidrio con marquesina */
  s+=H.arch(L,w/2-4,0,8,12,"#86CBEA");
  s+=box(x+w/2-6.5,y+dd,Z+13.2,13,4.4,1.6,TEAL,{right:I.shade(TEAL,.3),top:I.tint(TEAL,.2)});
  if(d>0){s+=win(L,3,6,7,7,GLASS,FRAME)+win(L,w-10,6,7,7,GLASS,FRAME)+win(R,4,6,7,7,GLASS,FRAME)+win(R,15,6,7,7,GLASS,FRAME)}
  else s+=quad(L,3,6,7,7,GLASS,{st:false})+quad(L,w-10,6,7,7,GLASS,{st:false})+quad(R,4,6,18,7,I.shade(GLASS,.15),{st:false});
  /* letrero con huella sobre el techo: tablero grueso en dos postes */
  var sx=x+w/2-8,sy=y+dd/2,sz=Z+h+9;
  s+=I.cyl(sx+3,sy+1,Z+h+6,.6,4,"#5A6573",{noGlint:true})+I.cyl(sx+13,sy+1,Z+h+6,.6,4,"#5A6573",{noGlint:true});
  s+=box(sx,sy,sz,16,2,12,"#FFFFFF",{left:"#FFFFFF",right:"#D7DDE3",top:"#F2F5F7"});
  var S=I.faceL(sx,sy,sz,16,2);s+=quad(S,1,1,14,10,"#E7F5F3",{st:false})+H.paw(S,8,3.4,1.25,TEAL);
  var cl=s;
  /* casita del perro con techo de dos aguas y entrada en arco */
  var dh=I.shadowBox(14,10,Z,11,11,11)+box(14,10,Z,11,11,8.4,"#D9614C",{left:"#E2725C",right:"#B24C3A"})+I.gable(14,10,Z+8.4,11,11,5.4,"#7A5236",{ov:1.2,th:1.2});
  var Dh=I.faceL(14,10,Z,11,11);dh+='<path d="M'+f1(Dh(3.2,0)[0])+' '+f1(Dh(3.2,0)[1])+'L'+f1(Dh(3.2,4.4)[0])+' '+f1(Dh(3.2,4.4)[1])+'Q'+f1(Dh(5.5,7.2)[0])+' '+f1(Dh(5.5,7.2)[1])+' '+f1(Dh(7.8,4.4)[0])+' '+f1(Dh(7.8,4.4)[1])+'L'+f1(Dh(7.8,0)[0])+' '+f1(Dh(7.8,0)[1])+'Z" fill="#3A2420"/>';
  if(d>0)dh+=quad(Dh,2.6,6.6,5.8,1.6,"#F2C14E",{st:false});
  /* plato con hueso */
  var bw=I.shadowEll(26,30,Z,3.6)+I.cyl(26,30,Z,3.6,1.4,"#3A8FC8",{top:"#7FC3E8",noGlint:true});
  if(d>0){var b=P(26,30,Z+1.6);bw+='<path transform="translate('+f1(b[0])+' '+f1(b[1])+') rotate(-18) scale(.6)" d="M-6 -1C-7.6 -2.8 -6 -4.4 -4.6 -3C-4 -3.8 -2.4 -3 -3 -1.6L3 -1.6C2.4 -3 4 -3.8 4.6 -3C6 -4.4 7.6 -2.8 6 -1C7.6 .8 6 2.4 4.6 1C4 1.8 2.4 1 3 -.4L-3 -.4C-2.4 1 -4 1.8 -4.6 1C-6 2.4 -7.6 .8 -6 -1Z" fill="#FFF8EA"/>'}
  return piece(g,[["clínica",[x-2.2,y-2.2,x+w+2.2,y+dd+4.4],cl],["casita",[13,9,26,22],dh],["perro",[3,25,13,35],dog2(8,30,.46,d)],["plato",[22,26,30,34],bw],
   d>0?dp("bush",-34,10,{k:.55,d:d}):null,d>1?dp("flowers",-26,30,{k:.8,d:d}):null]);
 }
 function vet_e(d){
  var g=plat("#9FD67E","#A98F67");
  var bowl=I.shadowEll(22,22,Z,7)+I.cyl(22,22,Z,7,2.6,"#E2434B",{top:"#F4F1EC",sideS:"#B8303A"})+I.ell(22,22,Z+2.7,5.2,"#E7E2DA");
  var b=P(22,22,Z+3.4);bowl+='<g transform="translate('+f1(b[0])+' '+f1(b[1])+') rotate(-18)"><path d="M-6 -1C-7.6 -2.8 -6 -4.4 -4.6 -3C-4 -3.8 -2.4 -3 -3 -1.6L3 -1.6C2.4 -3 4 -3.8 4.6 -3C6 -4.4 7.6 -2.8 6 -1C7.6 .8 6 2.4 4.6 1C4 1.8 2.4 1 3 -.4L-3 -.4C-2.4 1 -4 1.8 -4.6 1C-6 2.4 -7.6 .8 -6 -1Z" fill="#FFF8EA"/><path d="M-3 -.4L3 -.4L3 .4L-3 .4Z" fill="#E4D8BF"/></g>';
  /* huellas en el pasto, contando hacia el plato */
  var pw="";if(d>1)[[-30,22],[-24,28],[-30,32]].forEach(function(q){pw+='<g transform="'+I.planeG(q[0],q[1],Z+.2)+'"><ellipse cx="0" cy="0" rx="1.6" ry="1.3" fill="#7DB05E"/><circle cx="-1.6" cy="-1.8" r=".55" fill="#7DB05E"/><circle cx="0" cy="-2.3" r=".55" fill="#7DB05E"/><circle cx="1.6" cy="-1.8" r=".55" fill="#7DB05E"/></g>'});
  return piece(g+pw,[["perro",[-16,-6,10,16],dog2(-3,6,1.35,d,{steth:d>0})],["plato",[15,15,29,29],bowl],d>0?dp("bush",30,-26,{k:.55,d:d}):null]);
 }

 /* ================= ARQUITECTURA v2 ================= */
 /* estudio de autor: volumen bajo de vidrio, volumen alto en voladizo con techo inclinado y celosía de madera */
 function arq_s(d){
  var g=plat("#D9E8C9","#9A8B6E"),s="";
  if(d>0)g+=I.walk(30,8,46,8,8,"#EDE6D6");
  var x=-26,y=-20,w=30,dd=26,h=12;
  s+=I.shadowBox(x,y,Z,w+8,dd,34);
  /* planta baja: muros de vidrio con parteluces */
  s+=box(x,y,Z,w,dd,h,"#7FB6DA",{left:"#86BEE0",right:"#5E9AC4",top:"#E9E5DC",noGlint:true});
  var L=I.faceL(x,y,Z,w,dd),R=I.faceR(x,y,Z,w,dd);
  for(var u=0;u<=w;u+=d>0?5:10)s+=line([L(u,0),L(u,h)],"#EDEAE3",1,{cap:"butt"});for(u=0;u<=dd;u+=d>0?5:10)s+=line([R(u,0),R(u,h)],"#CFCABE",1,{cap:"butt"});
  s+=poly([L(2,h-1),L(8,h-1),L(2,2)],"#FFFFFF",{op:.22,st:false});
  /* volumen alto en voladizo, girado hacia el frente, con techo de una sola agua */
  var ux=x+6,uy=y-4,uw=w+4,ud=dd-6,uz=Z+h,uh=13,rise=7;
  s+=box(ux,uy,uz,uw,ud,uh,"#F4F1EA",{left:"#F2EEE6",right:"#D3CCBF",noTop:true,noGlint:true});
  var UL=I.faceL(ux,uy,uz,uw,ud),UR=I.faceR(ux,uy,uz,uw,ud);
  /* ventana corrida y celosía de madera */
  s+=quad(UL,3,4,uw-6,5,"#5E9AC4",{st:false})+poly([UL(4,8.6),UL(10,8.6),UL(4,4.4)],"#FFFFFF",{op:.25,st:false});
  if(d>0)for(u=2;u<ud-1;u+=2)s+=quad(UR,u,2,1,uh-4,"#B98656",{st:false});
  /* techo inclinado con grosor: sube hacia la fachada izquierda */
  var t1=P(ux-1,uy-1,uz+uh),t2=P(ux+uw+1,uy-1,uz+uh),t3=P(ux+uw+1,uy+ud+1,uz+uh+rise),t4=P(ux-1,uy+ud+1,uz+uh+rise);
  s+=poly([t1,t2,t3,t4],"#4A5563");
  s+=poly([t4,t3,[t3[0],t3[1]+1.8],[t4[0],t4[1]+1.8]],"#2F3742",{st:false})+poly([t3,t2,[t2[0],t2[1]+1.8],[t3[0],t3[1]+1.8]],"#3A434F",{st:false});
  s+=line([[t4[0]+.5,t4[1]+.4],[t3[0]-.5,t3[1]+.4]],"#7D8896",1,{cap:"butt"});
  /* hastial triangular de la fachada derecha bajo el techo */
  s+=poly([P(ux+uw,uy,uz+uh),P(ux+uw,uy+ud,uz+uh),P(ux+uw,uy+ud,uz+uh+rise)],"#C6BEAF");
  s+=poly([P(ux,uy+ud,uz+uh),P(ux+uw,uy+ud,uz+uh),P(ux+uw,uy+ud,uz+uh+rise),P(ux,uy+ud,uz+uh+rise)],"#E6E1D6");
  /* pilar del voladizo */
  s+=I.cyl(ux+uw-2,uy+ud-2,Z,1,h,"#8C96A3",{noGlint:true});
  var st=s;
  /* maqueta en la entrada, sobre pedestal */
  var md=I.shadowBox(14,16,Z,10,10,12)+box(14,16,Z,10,10,7,"#E8E3D8",{left:"#E2DCCF",right:"#C9C1B1"})+H.houseModel(15,17,Z+7,.66,d,false);
  /* tubo de planos apoyado */
  var tb="";if(d>0){tb=I.contact(1.6,{x:P(-30,24,Z)[0],y:P(-30,24,Z)[1]})+'<g transform="translate('+f1(P(-30,24,Z)[0])+' '+f1(P(-30,24,Z)[1])+') rotate(-14)"><rect x="-1.6" y="-16" width="3.2" height="16" rx="1.4" fill="#2F6FB0"/><rect x="-1.6" y="-16" width="1.4" height="16" rx=".7" fill="#5C93CC"/><ellipse cx="0" cy="-16" rx="1.6" ry=".7" fill="#BFD9F2"/></g>'}
  return piece(g,[["estudio",[x,y-5,ux+uw+1,y+dd+1],st],["maqueta",[14,16,24,26],md],d>0?["tubo",[-32,22,-28,26],tb]:null,d>0?dp("treeRound",-34,4,{k:.6,d:d}):null,d>1?dp("bush",28,-26,{k:.45,d:d}):null]);
 }
 /* emblema: maqueta a medio construir (mitad con estructura) sobre el plano; compás de pie al lado; regla y lápiz */
 function arq_e(d){
  var g=plat("#D9E8C9","#9A8B6E"),BL="#2F6FB0";
  var px=-34,py=-28,pw=42,pdp=36;
  g+=poly([P(px,py,Z+.3),P(px+pw,py,Z+.3),P(px+pw,py+pdp,Z+.3),P(px,py+pdp,Z+.3)],BL,{st:false});
  if(d>0){var Tg=I.faceTop(px,py,Z+.35);for(var gg=4;gg<pw;gg+=6)g+=line([Tg(gg,2),Tg(gg,pdp-2)],"#5C93CC",.5,{cap:"butt"});for(gg=4;gg<pdp;gg+=6)g+=line([Tg(2,gg),Tg(pw-2,gg)],"#5C93CC",.5,{cap:"butt"});
   g+=line([Tg(28,6),Tg(38,6),Tg(38,14)],"#FFFFFF",.8,{cap:"butt"})+line([Tg(4,30),Tg(18,30)],"#FFFFFF",.8,{cap:"butt"})}
  var roll=I.shadowBox(px-3,py,Z,3,pdp,6)+'<g transform="'+I.planeY(px,py,Z+3)+'"><rect x="0" y="-3" width="'+pdp+'" height="6" rx="1" fill="#4A84C2"/><rect x="0" y="-3" width="'+pdp+'" height="2" rx="1" fill="#7FB0E0"/></g>'+H.discY(px,py+pdp,Z+3,3,"#5C93CC",{hub:"#2F6FB0"});
  /* casa: muros completos a la izquierda y estructura de madera a la derecha */
  var hx=-26,hy=-22,hw=24,hd=20,hh=13,W=T("#F4EFE6"),RF=T("#C96A4A"),WD="#B98656",hs=I.shadowBox(hx,hy,Z,hw,hd,24);
  hs+=box(hx,hy,Z+.4,hw*.5,hd,hh,W.b,{left:W.b,right:W.s,top:W.l,noGlint:true});
  var HL=I.faceL(hx,hy,Z+.4,hw*.5,hd);hs+=quad(HL,2.4,4,3.6,4,"#7FB6DA",{st:false})+quad(HL,7.4,0,3.4,7,"#9A6B45",{st:false});
  /* entramado: postes y vigas con grosor */
  for(var k=0;k<=3;k++){var xx=hx+hw*.5+k*(hw*.5/3);hs+=box(xx-.5,hy+hd-1,Z+.4,1,1,hh,WD,{noGlint:true})+box(xx-.5,hy,Z+.4,1,1,hh,WD,{noGlint:true})}
  hs+=box(hx+hw*.5,hy+hd-1,Z+.4+hh-1,hw*.5,1,1,WD,{noGlint:true})+box(hx+hw*.5,hy,Z+.4+hh-1,hw*.5,1,1,WD,{noGlint:true});
  /* techo: mitad con tejas, mitad con cabios */
  var rz=Z+.4+hh,rh=9,r1=P(hx-1,hy+hd/2,rz+rh),rm=P(hx+hw*.5,hy+hd/2,rz+rh),r2=P(hx+hw+1,hy+hd/2,rz+rh);
  hs+=poly([P(hx-1,hy-1,rz),P(hx+hw*.5,hy-1,rz),rm,r1],RF.l)+poly([r1,rm,P(hx+hw*.5,hy+hd+1,rz),P(hx-1,hy+hd+1,rz)],RF.b);
  hs+=poly([P(hx-1,hy+hd+1,rz),P(hx+hw*.5,hy+hd+1,rz),[P(hx+hw*.5,hy+hd+1,rz)[0],P(hx+hw*.5,hy+hd+1,rz)[1]+1.4],[P(hx-1,hy+hd+1,rz)[0],P(hx-1,hy+hd+1,rz)[1]+1.4]],RF.d,{st:false});
  for(k=0;k<=4;k++){var xr=hx+hw*.5+k*(hw*.5+1)/4;hs+=line([P(xr,hy+hd+1,rz),P(xr,hy+hd/2,rz+rh),P(xr,hy-1,rz)],WD,1,{cap:"butt"})}
  hs+=line([rm,r2],"#8A5E3C",1.2,{cap:"butt"})+line([[r1[0]+.5,r1[1]+.3],[rm[0],rm[1]+.3]],RF.h,1,{cap:"butt"});
  /* regla y lápiz sobre el plano */
  var rl="";if(d>0){rl=box(-30,14,Z,28,4.4,1.3,"#F2C14E",{noGlint:true});var Rt=I.faceTop(-30,14,Z+1.31);for(var t=1;t<28;t+=d>1?2:4)rl+=line([Rt(t,0),Rt(t,t%4<2?2.4:1.3)],"#8A6A1E",.4,{cap:"butt"})}
  var pc="";if(d>1){var a=P(2,26,Z+1.2),b=P(14,20,Z+1.2);pc='<path d="M'+f1(a[0])+' '+f1(a[1])+'L'+f1(b[0])+' '+f1(b[1])+'" stroke="#F2B544" stroke-width="2.4" stroke-linecap="butt"/><path d="M'+f1(a[0])+' '+f1(a[1]-.8)+'L'+f1(b[0])+' '+f1(b[1]-.8)+'" stroke="#FFD27A" stroke-width=".8"/><path d="M'+f1(b[0])+' '+f1(b[1]-1.2)+'L'+f1(b[0]+3.2)+' '+f1(b[1]-1.6)+'L'+f1(b[0])+' '+f1(b[1]+1.2)+'Z" fill="#E8C9A0"/>'}
  /* compás de pie a la derecha, con aire */
  var cx=30,cy=-12,M=T("#7F8C99"),cp=I.contact(1.6,{x:P(cx,cy-10,Z)[0],y:P(cx,cy-10,Z)[1]})+I.contact(1.6,{x:P(cx,cy+12,Z)[0],y:P(cx,cy+12,Z)[1]});
  cp+='<g transform="'+I.planeY(cx,cy-11,Z)+'"><path d="M0 0L9.6 -46L11.4 -46L3 0Z" fill="'+M.b+'"/><path d="M1.8 0L10.6 -46L11.4 -46L3 0Z" fill="'+M.s+'"/><path d="M21 0L11.4 -46L13 -46L22.6 0Z" fill="'+M.l+'"/><path d="M21.8 0L12.4 -46L13 -46L22.6 0Z" fill="'+M.b+'"/><path d="M19.4 -6L22.6 0L21.2 -6Z" fill="#3A4452"/>'+(d>0?'<path d="M4.8 -19L17.8 -19" stroke="'+M.s+'" stroke-width="1.2"/>':'')+'<circle cx="12.2" cy="-47.4" r="3.4" fill="#C99A2E"/><circle cx="12.2" cy="-47.4" r="1.2" fill="#8A6A1E"/><rect x="11.4" y="-54" width="1.6" height="5" rx=".8" fill="#5A6573"/></g>';
  return piece(g,[["rollo",[px-3,py,px,py+pdp],roll],["casa",[hx-1,hy-1,hx+hw+1,hy+hd+1],hs],d>0?["regla",[-30,14,-2,18.4],rl]:null,d>1?["lápiz",[2,19,17,27],pc]:null,["compás",[28,-24,32,0],cp],d>1?dp("bush",26,16,{k:.45,d:d}):null]);
 }

 /* ================= CINE v2 ================= */
 /* cine clásico: letrero vertical iluminado, marquesina con focos, carteles, taquilla y alfombra con postes */
 function cine_s(d){
  var g=plat("#E9DDCB","#A98F67"),s="";
  g+=poly([P(-4,8,Z+.3),P(10,8,Z+.3),P(10,44,Z+.3),P(-4,44,Z+.3)],"#C83A43",{st:false});
  var x=-26,y=-24,w=40,dd=30,h=30,PU="#7C4A8F";
  s+=I.shadowBox(x,y,Z,w,dd,h+18);
  s+=box(x,y,Z,w,dd,h,PU,{left:"#8A57A0",right:"#5E3870",top:"#9A6BAE"});
  /* remate escalonado art déco */
  s+=box(x+8,y+4,Z+h,w-16,dd-8,4,PU,{left:"#8A57A0",right:"#5E3870",top:"#A47BB6"})+box(x+14,y+8,Z+h+4,w-28,dd-16,3,"#E8B33A",{left:"#E8B33A",right:"#C4932A",top:"#F6D27A"});
  var L=I.faceL(x,y,Z,w,dd),R=I.faceR(x,y,Z,w,dd);
  s+=quad(L,0,h-3,w,3,"#E8B33A",{st:false})+quad(R,0,h-3,dd,3,"#C4932A",{st:false});
  /* carteles con marco */
  if(d>0){[[3,"#3F7DA6"],[w-11,"#E2434B"]].forEach(function(q){s+=quad(L,q[0],7,8,12,"#F2E6C8",{st:false})+quad(L,q[0]+.8,7.8,6.4,10.4,q[1],{st:false})+quad(L,q[0]+1.6,12,4.8,1.4,"#FFFFFF",{st:false,op:.7})});
   s+=quad(R,4,7,9,12,"#F2E6C8",{st:false})+quad(R,4.8,7.8,7.4,10.4,"#E8B33A",{st:false})}
  s+=quad(L,w/2-6,0,12,9,"#2B1E33",{st:false})+line([L(w/2,0),L(w/2,9)],"#E8B33A",.8,{cap:"butt"});
  /* marquesina con grosor y focos en dos filas */
  var mx=x+5,mw=w-10;
  s+=box(mx,y+dd,Z+11,mw,7,2.2,"#3A2142",{top:"#4B2D55",right:"#2B1833",noGlint:true});
  s+=box(mx+1.4,y+dd+5,Z+13.2,mw-2.8,1.4,7,"#FFF4D6",{left:"#FFF4D6",right:"#E8D7A8",top:"#FFFFFF"});
  var M=I.faceL(mx+1.4,y+dd+5,Z+13.2,mw-2.8,1.4);
  if(d>0){for(var u=1.2;u<mw-4;u+=2.2)[[u,.8],[u,6.2]].forEach(function(q){var p=M(q[0],q[1]);s+='<circle cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r=".85" fill="#C98E1E"/><circle class="iso-bulb" cx="'+f1(p[0]-.1)+'" cy="'+f1(p[1]-.15)+'" r=".6" fill="#FFD66B"/>'});
   s+='<g transform="'+I.planeX(mx+1.4+4,y+dd+6.4,Z+13.2+5)+'"><text x="0" y="0" font-size="3.6" font-weight="900" fill="#B0303A" letter-spacing=".3">ESTRENO</text></g>'}
  /* letrero vertical sobre la esquina izquierda: tablero con grosor, letras y focos */
  var vx=x+4,vy=y+dd+.2,vz=Z+16;
  s+=box(vx,vy,vz,2.4,4,26,"#B0303A",{left:"#C23A44",right:"#8E2731",top:"#D6545D"});
  var V=I.faceL(vx,vy,vz,2.4,4);
  s+=quad(V,.3,1,1.8,24,"#FFF4D6",{st:false});
  ["C","I","N","E"].forEach(function(ch,i){var p=V(1.2,20.6-i*5.6);s+='<text x="'+f1(p[0])+'" y="'+f1(p[1]+1.6)+'" font-size="4.6" font-weight="900" text-anchor="middle" fill="#B0303A">'+ch+'</text>'});
  var sign=s;s="";
  /* taquilla: casetita con ventanilla */
  var tk=I.shadowBox(17,8,Z,8,8,10)+box(17,8,Z,8,8,9,"#E8B33A",{left:"#F0C04A",right:"#C4932A"})+box(16.4,7.4,Z+9,9.2,9.2,1.6,"#7C4A8F",{noGlint:true});
  var TL=I.faceL(17,8,Z,8,8);tk+=quad(TL,1.6,3.6,4.8,3.8,"#86CBEA",{st:false})+quad(TL,1.6,2.8,4.8,.8,"#7C4A8F",{st:false});
  /* postes con cordón rojo a los lados de la alfombra */
  var rp="";if(d>0){var pts=[[-6,24],[-6,36],[12,24],[12,36]];pts.forEach(function(q){rp+=I.cyl(q[0],q[1],Z,.8,5,"#E8B33A",{noGlint:true})+I.ell(q[0],q[1],Z+5.2,1,"#F6D27A")});
   [[[-6,24],[-6,36]],[[12,24],[12,36]]].forEach(function(pr){var a=P(pr[0][0],pr[0][1],Z+4.4),b=P(pr[1][0],pr[1][1],Z+4.4);rp+='<path d="M'+f1(a[0])+' '+f1(a[1])+'Q'+f1((a[0]+b[0])/2)+' '+f1((a[1]+b[1])/2+2.4)+' '+f1(b[0])+' '+f1(b[1])+'" stroke="#C83A43" stroke-width="1" fill="none"/>'})}
  return piece(g,[["cine",[x,y,x+w,y+dd+7],sign],["taquilla",[16.4,7.4,25.6,16.6],tk],d>0?["postes",[-7,23,13,37],rp]:null,d>1?["reflector",[26,-26,32,-20],H.searchlight(29,-23,1,d)]:null,d>0?dp("lamp",-32,26,{d:d}):null]);
 }
 /* emblema: cámara clásica de dos rollos en trípode, claqueta abierta y reflector con viseras */
 function cine_e(d){
  var g=plat("#E9DDCB","#A98F67"),K=T("#2E3138"),c0="";
  var o0=P(-2,-4,Z),hub=P(-2,-4,Z+21);
  [[-14,-10],[10,-14],[0,12]].forEach(function(q){var f=P(q[0],q[1],Z);c0+=I.contact(1.3,{x:f[0],y:f[1]})+'<path d="M'+f1(hub[0])+' '+f1(hub[1])+'L'+f1(f[0])+' '+f1(f[1])+'" stroke="'+K.b+'" stroke-width="2" stroke-linecap="round"/><path d="M'+f1(hub[0]-.5)+' '+f1(hub[1])+'L'+f1(f[0]-.5)+' '+f1(f[1])+'" stroke="#5A5E66" stroke-width=".6"/>'});
  c0+=I.cyl(-2,-4,Z+19,2.4,2,"#4B505A",{noGlint:true});
  var x=-13,y=-10,w=21,dd=12,z=Z+21,h=13;
  c0+=box(x,y,z,w,dd,h,K.b,{left:"#3A3E46",right:"#25282E",top:"#4B505A"});
  var L=I.faceL(x,y,z,w,dd);
  if(d>0){c0+=quad(L,2,2,7,4.4,"#C8A24A",{st:false})+quad(L,2.6,2.6,5.8,3.2,"#D9B85F",{st:false})+H.discX(x+15,y+dd,z+6.4,2.6,"#4B505A",{hub:"#25282E"});c0+=line([L(11,1),L(11,h-1)],"#25282E",.6,{cap:"butt"})}
  /* parasol del objetivo: caja que se abre hacia el frente */
  c0+=box(x+w,y+3,z+3.2,5,6,6,"#3A3E46",{noGlint:true});
  c0+=poly([P(x+w+5,y+2,z+2.2),P(x+w+5,y+10,z+2.2),P(x+w+8,y+11,z+1.2),P(x+w+8,y+1,z+1.2)],"#25282E")+poly([P(x+w+5,y+2,z+10.2),P(x+w+5,y+10,z+10.2),P(x+w+8,y+11,z+11.2),P(x+w+8,y+1,z+11.2)],"#4B505A");
  c0+='<g transform="'+I.planeY(x+w+5.1,y+6,z+6.2)+'"><circle r="3.4" fill="#25282E"/><circle r="2.4" fill="#4FA8E0"/><circle cx="-.8" cy="-.8" r=".8" fill="#FFFFFF" opacity=".8"/></g>';
  /* rollos con rayos calados y su eje */
  [[x+5,9],[x+16,8]].forEach(function(q){c0+=box(q[0]-1,y+dd/2-1,z+h,2,2,1.4,"#25282E",{noGlint:true})+H.discX(q[0],y+dd/2,z+h+q[1],q[1]-.4,"#2E3138",{hub:"#8C8494"});if(d>0)for(var i=0;i<5;i++){var a=i/5*Math.PI*2;c0+='<g transform="'+I.planeX(q[0],y+dd/2,z+h+q[1])+'"><circle cx="'+f1(Math.cos(a)*(q[1]*.56))+'" cy="'+f1(Math.sin(a)*(q[1]*.56))+'" r="'+f1(q[1]*.17)+'" fill="#E9DDCB"/></g>'}});
  if(d>0){var r1=P(x+5,y+dd/2,z+h+9),r2=P(x+16,y+dd/2,z+h+8);c0+='<path d="M'+f1(r1[0])+' '+f1(r1[1]+8.4)+'Q'+f1((r1[0]+r2[0])/2)+' '+f1(r1[1]+17)+' '+f1(r2[0])+' '+f1(r2[1]+7.4)+'" stroke="#1C1E22" stroke-width="1.6" fill="none"/>'}
  var cam='<g transform="translate('+f1(o0[0])+' '+f1(o0[1])+') scale(1.45) translate('+f1(-o0[0])+' '+f1(-o0[1])+')">'+c0+'</g>';
  /* claqueta con grosor y barra abierta */
  var cx=-40,cy=14,cl=I.shadowBox(cx,cy,Z,15,2.6,12)+box(cx,cy,Z,15,2.6,11,"#2E3138",{left:"#33373F",right:"#1F2228",top:"#454A54",noGlint:true});
  var Fc=I.faceL(cx,cy,Z,15,2.6);if(d>0)cl+=quad(Fc,1.4,3.6,12.2,.9,"#C9CED6",{st:false})+quad(Fc,1.4,6,7.6,.9,"#C9CED6",{st:false})+quad(Fc,9.6,6,3.8,.9,"#C9CED6",{st:false});
  var bx=I.faceL(cx,cy,Z+11,15,2.6),bar=[bx(0,0),bx(15,3.4),bx(15,6),bx(0,2.6)];
  cl+=poly(bar,"#F4F4F4",{st:false})+poly([bar[3],bar[2],[bar[2][0]+1.2,bar[2][1]-.6],[bar[3][0]+1.2,bar[3][1]-.6]],"#D8DCE2",{st:false});
  var id=I.uid("cl");cl+=I.clipDef(id,"M"+bar.map(function(p){return f1(p[0])+" "+f1(p[1])}).join("L")+"Z")+'<g clip-path="url(#'+id+')">';for(var i=0;i<4;i++)cl+=poly([bx(1+i*3.6,0),bx(3+i*3.6,0),bx(5.4+i*3.6,6),bx(3.4+i*3.6,6)],"#2E3138",{st:false});cl+='</g>';
  /* reflector con viseras sobre pie de tres patas */
  var rf="";if(d>0){var sp=P(30,-24,Z),t=P(30,-24,Z+19);
   [[-3,0],[2.4,-2],[1,3]].forEach(function(q){var f=P(30+q[0],-24+q[1],Z);rf+=I.contact(.9,{x:f[0],y:f[1]})+'<path d="M'+f1(P(30,-24,Z+6)[0])+' '+f1(P(30,-24,Z+6)[1])+'L'+f1(f[0])+' '+f1(f[1])+'" stroke="#4A5562" stroke-width="1"/>'});
   rf+='<path d="M'+f1(sp[0])+' '+f1(sp[1]-6)+'L'+f1(t[0])+' '+f1(t[1])+'" stroke="#4A5562" stroke-width="1.4"/>';
   rf+='<g transform="translate('+f1(t[0])+' '+f1(t[1])+') rotate(-24)"><path d="M8 0L36 -10L36 12Z" fill="url(#isoBeam)" opacity=".7"/><rect x="-2" y="-4.4" width="10" height="8.8" rx="2.2" fill="#4A5562"/><rect x="-2" y="-4.4" width="4" height="8.8" rx="1.6" fill="#5E6A78"/><path d="M8 -4.4L11 -7.4M8 4.4L11 7.4" stroke="#3A4452" stroke-width="1.6" stroke-linecap="round"/><ellipse cx="8" cy="0" rx="1.4" ry="3.8" fill="#FFF3B0"/></g>'}
  return piece(g,[["cámara",[-20,-19,16,20],cam],["claqueta",[cx,cy,cx+15,cy+2.6],cl],d>0?["reflector",[26,-28,34,-20],rf]:null,d>1?dp("flowers",30,22,{k:.8,d:d}):null]);
 }

 /* ================= CIENCIA DE DATOS v2 ================= */
 var BARS=["#3F7DA6","#5BA3D0","#7CC4E8","#F2B544"];
 function datos_s(d){
  var g=plat("#7FD3C8","#4E8F97"),s="";
  var x=-20,y=-20,w=24,dd=24,h=48;
  s+=I.shadowBox(x,y,Z,w,dd,h+16);
  /* torre de vidrio con esquina biselada y franjas */
  s+=box(x,y,Z,w,dd,h,"#5BB4E8",{left:"#62B8EA",right:"#3E8CC4",top:"#B7E3FA"});
  var L=I.faceL(x,y,Z,w,dd),R=I.faceR(x,y,Z,w,dd);
  for(var v=5;v<h;v+=d>0?6:12){s+=line([L(0,v),L(w,v)],"#DDF3FF",.8,{op:.75,cap:"butt"})+line([R(0,v),R(dd,v)],"#9BD0F2",.8,{op:.6,cap:"butt"})}
  if(d>0)for(var u=6;u<w;u+=6)s+=line([L(u,0),L(u,h)],"#DDF3FF",.6,{op:.5,cap:"butt"});
  s+=poly([L(2,h-2),L(9,h-2),L(2,6)],"#FFFFFF",{op:.22,st:false});
  /* acceso con marquesina */
  s+=quad(L,w/2-3.5,0,7,6.4,"#2F5A82",{st:false})+box(x+w/2-5,y+dd,Z+6.4,10,3,1.2,"#E6ECF0",{noGlint:true});
  /* cornisa y cartelera con gráfica, en dos postes con grosor */
  s+=box(x-.6,y-.6,Z+h,w+1.2,dd+1.2,1.6,"#E6ECF0",{top:"#F2F6F8",right:"#B9C6D0"});
  var bz=Z+h+1.6,bx=x+1,by=y+dd/2;
  s+=box(bx+3,by,bz,1.2,1.2,6,"#56657A",{noGlint:true})+box(bx+19,by,bz,1.2,1.2,6,"#56657A",{noGlint:true});
  s+=box(bx,by,bz+6,23,2,15,"#FFFFFF",{left:"#FFFFFF",right:"#D9DCE2",top:"#F2F4F6"});
  var B=I.faceL(bx,by,bz+6,23,2);
  s+=quad(B,.8,.8,21.4,13.4,"#F4F8FB",{st:false});
  [[3,4],[7.6,7.4],[12.2,5.6],[16.8,10.4]].forEach(function(q,i){s+=quad(B,q[0],1.6,3.4,q[1],BARS[i],{st:false})});
  if(d>0)s+=line([B(4.7,6.2),B(9.3,9.6),B(13.9,8),B(18.5,13.2)],"#E2434B",1.1,{cap:"butt"});
  var tw=s;
  /* puntos de datos flotando con su línea (al frente derecho) */
  var dt="";if(d>1){[[24,-4,24],[28,2,30],[24,8,34]].forEach(function(q){var p=P(q[0],q[1],q[2]);dt+='<circle cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r="1.6" fill="#FFFFFF" stroke="#3F7DA6" stroke-width=".8"/>'});
   var a=P(24,-4,24),b=P(28,2,30),c=P(24,8,34);dt='<path d="M'+f1(a[0])+' '+f1(a[1])+'L'+f1(b[0])+' '+f1(b[1])+'L'+f1(c[0])+' '+f1(c[1])+'" stroke="#3F7DA6" stroke-width=".6" stroke-dasharray="1.4 1" fill="none"/>'+dt}
  /* pantalla de datos en el piso: tótem con gráfica de pastel */
  var tt=I.shadowBox(14,12,Z,6,4,14)+box(14,12,Z,6,4,13,"#2F3A47",{left:"#34404E",right:"#26303B",top:"#4A5767"});
  var TF=I.faceL(14,12,Z,6,4);tt+=quad(TF,.6,1.4,4.8,10,"#12324E",{st:false});
  var pc=TF(3,8.4);tt+='<circle cx="'+f1(pc[0])+'" cy="'+f1(pc[1])+'" r="1.8" fill="#5BA3D0"/><path d="M'+f1(pc[0])+' '+f1(pc[1])+'L'+f1(pc[0])+' '+f1(pc[1]-1.8)+'A1.8 1.8 0 0 1 '+f1(pc[0]+1.7)+' '+f1(pc[1]+.5)+'Z" fill="#F2B544"/>';
  if(d>0)tt+=quad(TF,1.2,2.6,1,2.4,"#7CF2C8",{st:false})+quad(TF,2.6,2.6,1,3.6,"#7CF2C8",{st:false})+quad(TF,4,2.6,1,1.6,"#7CF2C8",{st:false});
  return piece(g,[["torre",[x-.6,y-.6,x+w+.6,y+dd+3],tw],["tótem",[14,12,20,16],tt],d>0?dp("bush",-32,22,{k:.5,d:d}):null,d>1?dp("bench",-12,26,{d:d}):null]);
 }
 /* emblema: barras 3D con ejes; la tendencia sale de la primera barra; la lupa queda a la izquierda, delante, sin tocar las barras */
 function datos_e(d){
  var g=plat("#7FD3C8","#4E8F97"),s="";
  var bx0=-20,by0=-30,bw=46,bd=20;
  s+=box(bx0,by0,Z,bw,bd,2,"#E6ECF0",{top:"#F2F6F8",right:"#B9C6D0"});
  /* ejes: placa de fondo con líneas guía */
  s+=box(bx0,by0-1.4,Z+2,bw,1.4,36,"#F8FAFC",{left:"#F2F5F8",right:"#D5DDE4",top:"#FFFFFF",noGlint:true});
  var Bk=I.faceL(bx0,by0-1.4,Z+2,bw,1.4);for(var k=6;k<36;k+=8)s+=line([Bk(1,k),Bk(bw-1,k)],"#D9E2EA",.6,{cap:"butt"});
  var H2=[12,22,17,32],X=[-18,-7,4,15];
  X.forEach(function(x,i){s+=box(x,-26,Z+2,8,12,H2[i],BARS[i])});
  var tp=X.map(function(x,i){return P(x+4,-20,Z+2+H2[i]+(i?6:0))});
  s+='<path d="M'+tp.map(function(p){return f1(p[0])+" "+f1(p[1])}).join("L")+'" stroke="#E2434B" stroke-width="2.4" fill="none" stroke-linejoin="round" stroke-linecap="butt"/>';
  var a=tp[3],b2=tp[2],ang=Math.atan2(a[1]-b2[1],a[0]-b2[0]);
  s+='<path d="M'+f1(a[0]+Math.cos(ang)*5)+' '+f1(a[1]+Math.sin(ang)*5)+'L'+f1(a[0]+Math.cos(ang+2.4)*4.6)+' '+f1(a[1]+Math.sin(ang+2.4)*4.6)+'L'+f1(a[0]+Math.cos(ang-2.4)*4.6)+' '+f1(a[1]+Math.sin(ang-2.4)*4.6)+'Z" fill="#E2434B"/>';
  if(d>0)tp.slice(1,3).forEach(function(p){s+='<circle cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r="1.8" fill="#FFFFFF" stroke="#E2434B" stroke-width="1"/>'});
  var chart=I.shadowBox(bx0,by0,Z,bw,bd,38)+s;
  /* lupa al frente izquierdo: aro con grosor, cristal y mango que toca el piso */
  var M=T("#3A4452"),lc=P(-24,10,Z+13),h0=P(-12,24,Z+.8),lp=I.contact(2.2,{x:h0[0],y:h0[1]})+I.cast(9,16,{x:lc[0]+2,y:P(-24,10,Z)[1]});
  lp+='<path d="M'+f1(lc[0]+8)+' '+f1(lc[1]+7.4)+'L'+f1(h0[0])+' '+f1(h0[1])+'" stroke="'+M.b+'" stroke-width="4" stroke-linecap="round"/><path d="M'+f1(lc[0]+8.4)+' '+f1(lc[1]+6.4)+'L'+f1(h0[0]-.6)+' '+f1(h0[1]-1.4)+'" stroke="'+M.l+'" stroke-width="1" stroke-linecap="butt"/>';
  var id=I.uid("lu");lp+='<g transform="translate('+f1(lc[0])+' '+f1(lc[1])+') rotate(-24)"><ellipse rx="11.6" ry="10" fill="'+M.b+'"/>'+I.clipDef(id,"M-9.4 0A9.4 8 0 1 0 9.4 0A9.4 8 0 1 0 -9.4 0Z")+'<ellipse rx="9.4" ry="8" fill="#BFE6F7" opacity=".8"/><g clip-path="url(#'+id+')"><path d="M-12 -2L-2 -12L2 -10L-10 2Z" fill="#FFFFFF" opacity=".55"/></g></g>';
  /* pastel de datos al frente derecho: cilindro con una rebanada levantada */
  var pie="";if(d>0){pie=I.shadowEll(22,18,Z,7)+I.cyl(22,18,Z,7,3,"#5BA3D0",{top:"#7CC4E8",sideS:"#3F7DA6"});var c=I.cylD(22,18,Z+3,7);pie+='<path d="M'+f1(c.cx)+' '+f1(c.cy)+'L'+f1(c.cx+c.rx)+' '+f1(c.cy)+'A'+f1(c.rx)+' '+f1(c.ry)+' 0 0 1 '+f1(c.cx+c.rx*.2)+' '+f1(c.cy+c.ry*.98)+'Z" fill="#F2B544" transform="translate(1.2 -2)"/><path d="M'+f1(c.cx+1.2)+' '+f1(c.cy-2)+'L'+f1(c.cx+c.rx*.2+1.2)+' '+f1(c.cy+c.ry*.98-2)+'L'+f1(c.cx+c.rx*.2+1.2)+' '+f1(c.cy+c.ry*.98+.8)+'L'+f1(c.cx+1.2)+' '+f1(c.cy+.8)+'Z" fill="#C98E25"/>'}
  return piece(g,[["gráfica",[bx0,by0-1.4,bx0+bw,by0+bd],chart],["lupa",[-34,0,-10,26],lp],d>0?["pastel",[15,11,29,25],pie]:null,d>1?dp("bush",32,2,{k:.45,d:d}):null]);
 }

 /* ================= NUTRICIÓN ================= */
 /* puesto de mercado con toldo de rayas, mostrador con fruta y báscula, pizarrón y huerto al frente */
 function nut_s(d){
  var g=plat("#9FD67E","#A98F67"),s="";
  /* huerto: surcos de tierra con lechugas y zanahorias */
  var hu="";var hx=-30,hy=8;hu+=box(hx,hy,Z,22,14,1.2,"#8A5E3C",{top:"#9C6B45",noGlint:true});
  for(var r=0;r<3;r++){hu+=box(hx+1,hy+1+r*4.4,Z+1.2,20,2.6,.8,"#7A5236",{top:"#6A4630",noGlint:true});
   for(var k=0;k<(d>0?5:3);k++){var px=hx+2.6+k*(d>0?4:6.4),py=hy+2.3+r*4.4;hu+=r===1?at(px,py,Z+2,'<path d="M-1.2 0q.2 -3 1.2 -4q1 1 1.2 4z" fill="#4E9E45"/><path d="M-.4 .4l.4 1.6l.4 -1.6z" fill="#F28C38"/>'):at(px,py,Z+2,E.bush({k:.24,ph:k}))}}
  /* puesto: mostrador, postes y toldo */
  var x=-8,y=-20,w=32,dd=14;
  s+=I.shadowBox(x,y,Z,w,dd,24);
  s+=box(x,y,Z,w,dd,9,"#D9A066",{left:"#E0AA70",right:"#B98250",top:"#F1D3A4"});
  var L=I.faceL(x,y,Z,w,dd);for(var u=4;u<w;u+=4)s+=line([L(u,0),L(u,9)],"#B98250",.5,{cap:"butt"});
  /* fruta sobre el mostrador */
  var fr=[[3,5,"#E2434B"],[7,6,"#F2B544"],[11,5,"#E2434B"],[15,6,"#7FC35A"],[19,5,"#F28C38"],[23,6,"#E2434B"],[27,5,"#F2B544"]];
  fr.slice(0,d>0?7:4).forEach(function(q,i){s+=fruit(x+q[0],y+q[1]+(i%2)*3,Z+9,2.1,q[2],{leaf:d>1&&i%2===0})});
  /* báscula sobre el mostrador */
  s+=box(x+24,y+2,Z+9,5,5,2.4,"#E6ECF0",{noGlint:true})+I.cyl(x+26.5,y+4.5,Z+11.4,.5,1.4,"#9AA5B1",{noGlint:true})+I.cyl(x+26.5,y+4.5,Z+12.8,3,.6,"#C9D1DA",{noGlint:true});
  /* postes y toldo de rayas */
  [[x,y+dd],[x+w,y+dd],[x,y],[x+w,y]].forEach(function(q){s+=I.cyl(q[0],q[1],Z,.7,22,"#8A5E3C",{noGlint:true})});
  s+=awning(x-1,y-2,Z+24,w+2,dd+6,6,"#E2434B","#FFF6E6",8);
  var stall=s;
  /* pizarrón de pie con el menú */
  var pz=I.shadowBox(18,8,Z,8,2,10)+'<g transform="'+I.planeX(18,10,Z)+'"><path d="M1 0L2 -12M7 0L6 -12" stroke="#8A5E3C" stroke-width="1"/><rect x="0" y="-13" width="8" height="8" rx="1" fill="#2F3A2F"/><rect x="0" y="-13" width="8" height="8" rx="1" fill="none" stroke="#B98656" stroke-width="1"/><path d="M1.6 -10.6H5.4M1.6 -8.6H6.2M1.6 -6.8H4.4" stroke="#FFFFFF" stroke-width=".5" opacity=".85"/></g>';
  /* cajas de fruta al pie del puesto */
  var cr=d>0?crate(30,0,6,5,"#E2434B")+crate(30,-8,6,5,"#F2B544"):"";
  return piece(g,[["huerto",[hx,hy,hx+22,hy+14],hu],["puesto",[x-1,y-2,x+w+1,y+dd+4],stall],["pizarrón",[18,8,26,12],pz],d>0?["cajas",[30,-8,36,5],cr]:null,d>1?dp("treeRound",-34,-14,{k:.6,d:d}):null]);
 }
 /* emblema: manzana gigante partida a la mitad (cara interior con semillas), canasta de verduras y báscula */
 function nut_e(d){
  var g=plat("#9FD67E","#A98F67"),RD=T("#E2434B");
  /* media manzana de pie, con la cara cortada hacia el frente izquierdo */
  var ax=-6,ay=-6;
  var APL="M0 -2C-8 -2 -15 -9 -15 -20C-15 -31 -8 -36 -2 -34C-1 -33.6 1 -33.6 2 -34C8 -36 15 -31 15 -20C15 -9 8 -2 0 -2Z";
  var ap=I.shadowEll(ax,ay,Z,14)+'<g transform="'+I.planeX(ax,ay+2.6,Z)+'"><path d="'+APL+'" fill="'+RD.s+'"/></g>'+'<g transform="'+I.planeX(ax,ay,Z)+'">';
  /* cáscara: borde rojo con grosor; pulpa crema; corazón con semillas */
  ap+='<path d="'+APL+'" fill="'+RD.b+'"/><path d="M0 -4.4C-6.8 -4.4 -12.6 -10.4 -12.6 -20C-12.6 -29 -7 -33 -2 -31.6C-1 -31.3 1 -31.3 2 -31.6C7 -33 12.6 -29 12.6 -20C12.6 -10.4 6.8 -4.4 0 -4.4Z" fill="#FFF3D6"/>';
  ap+='<path d="M0 -10C-3 -12 -4.4 -17 -3.4 -21C-2.6 -24 -1 -26 0 -27C1 -26 2.6 -24 3.4 -21C4.4 -17 3 -12 0 -10Z" fill="#F6E2B8"/>';
  ap+='<path d="M-1.6 -18.6Q-2.4 -20.6 -1.4 -22.2Q-.4 -20.4 -1.6 -18.6Z" fill="#5A3A22"/><path d="M1.6 -18.6Q2.4 -20.6 1.4 -22.2Q.4 -20.4 1.6 -18.6Z" fill="#5A3A22"/>';
  ap+='<path d="M-9.6 -26Q-10.6 -21 -9 -16" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round" opacity=".7"/>';
  ap+='<path d="M0 -33.6Q.6 -38 2.6 -40" stroke="#6A4630" stroke-width="1.6" fill="none" stroke-linecap="round"/><path d="M2 -38.6Q6 -42 10 -39.6Q6 -36.6 2 -38.6Z" fill="#4E9E45"/><path d="M2 -38.6Q6 -40 10 -39.6" stroke="#3E8037" stroke-width=".5" fill="none"/></g>';
  /* la otra mitad, acostada con la cáscara hacia arriba */
  /* la otra mitad, acostada con el corte hacia arriba: rodaja gruesa con cáscara roja, pulpa y estrella de semillas */
  var hb=I.shadowEll(16,-20,Z,8)+I.cyl(16,-20,Z,8,3,"#E2434B",{top:"#FFF3D6",sideS:"#B8303A",noGlint:true})+I.ell(16,-20,Z+3,6.6,"#FFF8E6");
  if(d>0){var cc=I.cylD(16,-20,Z+3,1);[0,1,2,3,4].forEach(function(i){var a=i/5*Math.PI*2-Math.PI/2;hb+='<ellipse cx="'+f1(cc.cx+Math.cos(a)*cc.rx*1.9)+'" cy="'+f1(cc.cy+Math.sin(a)*cc.ry*1.9)+'" rx=".9" ry=".55" fill="#5A3A22"/>'})}
  /* canasta tejida con verduras */
  var bk=I.shadowEll(-28,20,Z,7)+I.cyl(-28,20,Z,7,6,"#C99A5B",{top:"#8A5E3C",sideS:"#A67A44",noGlint:true});
  if(d>0){var bc=I.cylD(-28,20,Z+3,7);bk+='<path d="M'+f1(bc.cx-bc.rx)+' '+f1(bc.cy)+'A'+f1(bc.rx)+' '+f1(bc.ry)+' 0 0 0 '+f1(bc.cx+bc.rx)+' '+f1(bc.cy)+'" stroke="#A67A44" stroke-width=".7" fill="none"/>'}
  bk+=at(-30,18,Z+6,E.bush({k:.4,ph:.5}))+fruit(-25,22,Z+5,2.2,"#E2434B")+at(-27,17,Z+6.5,'<path d="M-.8 0L.8 0L0 -5Z" fill="#F28C38"/><path d="M-1 -5q1 -2.6 1 -3.2q.4 .8 1 3.2z" fill="#4E9E45"/>');
  /* báscula de cocina con plato y carátula */
  var sc="";if(d>0){sc=I.shadowBox(18,12,Z,10,8,8)+box(18,12,Z,10,8,6,"#E6ECF0",{left:"#EEF2F5",right:"#C3CCD5"});var SF=I.faceL(18,12,Z,10,8),sp=SF(5,3);sc+='<circle cx="'+f1(sp[0])+'" cy="'+f1(sp[1])+'" r="2.4" fill="#FFFFFF" stroke="#9AA5B1" stroke-width=".6"/><path d="M'+f1(sp[0])+' '+f1(sp[1])+'L'+f1(sp[0]+1.4)+' '+f1(sp[1]-1.2)+'" stroke="#E2434B" stroke-width=".6"/>';
   sc+=I.cyl(23,16,Z+6,.8,1.4,"#9AA5B1",{noGlint:true})+I.cyl(23,16,Z+7.4,5,.8,"#C9D1DA",{top:"#E8EDF2",noGlint:true})+fruit(23,16,Z+8.2,2,"#7FC35A")}
  return piece(g,[["manzana",[ax-15,ay,ax+15,ay+2.6],ap],["mitad",[8,-28,24,-12],hb],["canasta",[-35,13,-21,27],bk],d>0?["báscula",[18,12,28,20],sc]:null,d>1?dp("flowers",30,-6,{k:.8,d:d}):null]);
 }

 ART.addV2("veterinaria",{s:vet_s,e:vet_e});
 ART.addV2("arquitectura",{s:arq_s,e:arq_e});
 ART.addV2("cine",{s:cine_s,e:cine_e});
 ART.addV2("datos",{s:datos_s,e:datos_e});
 ART.addV2("nutricion",{s:nut_s,e:nut_e},"e");
})(ISO,ENV,ART.H);
