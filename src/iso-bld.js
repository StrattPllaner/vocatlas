/* ================= edificios isométricos =================
   Cada edificio vive en coordenadas locales: la plataforma está centrada en (0,0) con radio 46.
   Se dibuja de atrás (x+y chico) hacia adelante. */
var BLD=(function(I){
 var P=I.P,box=I.box,quad=I.quad,win=I.win,cyl=I.cyl,ball=I.ball,poly=I.poly,line=I.line,T=I.T,f1=I.f1;
 var GLASS="#4FA8E0",FRAME="#E8EEF2",WALL="#F7F2E8",RED="#E2434B";
 function lawn(){return "#8FD06A"}
 /* matorral redondo de adorno */
 function bush(x,y,r,c){return ball(x,y,0,r,c||"#5FB257")}
 function flowers(x,y,cols){var s="";cols=cols||["#FF8FA3","#FFD45C","#FFFFFF"];for(var i=0;i<5;i++){var a=i*1.3,p=P(x+Math.cos(a)*3.2,y+Math.sin(a)*3.2,1);s+='<circle cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r="1.6" fill="'+cols[i%cols.length]+'"/>'}return s}
 /* banda de pasto/piedra que sale de la plataforma: camino al frente */
 function arch(F,u,v,a,h){
  var s=quad(F,u-1,v,a+2,h+.6,"#D8E3EA");
  var a0=F(u,v),a1=F(u+a,v),a2=F(u+a,v+h*.66),a3=F(u+a/2,v+h-.4),a4=F(u,v+h*.66);
  s+='<path d="M'+f1(a0[0])+' '+f1(a0[1])+'L'+f1(a4[0])+' '+f1(a4[1])+'Q'+f1(a3[0]-2.4)+' '+f1(a3[1]-1.6)+' '+f1(a3[0])+' '+f1(a3[1])+'Q'+f1(a3[0]+2.4)+' '+f1(a3[1]+.4)+' '+f1(a2[0])+' '+f1(a2[1])+'L'+f1(a1[0])+' '+f1(a1[1])+'Z" fill="'+GLASS+'"/>';
  s+=line([F(u+a/2,v),F(u+a/2,v+h-.8)],FRAME,1);
  s+=poly([F(u+a*.1,v+h*.6),F(u+a*.35,v+h*.6),F(u+a*.15,v+h*.1),F(u+a*.02,v+h*.1)],"#FFFFFF",{op:.35,st:false});
  return s}
 function frontPath(col){return poly([P(4,30,7),P(16,30,7),P(16,46,7),P(4,46,7)],col||"#EFE4CC",{st:false,op:.95})}

 /* ---------- Medicina: hospital de tres cuerpos, cruz en el techo, arco de entrada, helipuerto y ambulancia ---------- */
 function medicina(){
  var s=I.platform(46,lawn());
  s+=I.walk(-7,44,-7,30,8,"#F1E6CF");
  /* cuerpo central */
  var x=-16,y=-16,w=26,d=22,h=46;
  s+=I.shadowBox(x,y,7,w,d,h);
  s+=box(x,y,7,w,d,h,WALL,{left:"#F2ECE0",right:"#D9D3CC",top:"#FFFDF8"});
  var L=I.faceL(x,y,7,w,d),R=I.faceR(x,y,7,w,d);
  for(var r=0;r<3;r++)for(var c=0;c<3;c++)if(!(r===0&&c===1))s+=win(L,3+c*8,12+r*10,5,6,GLASS,FRAME,r===2&&c===0);
  for(r=0;r<4;r++)for(c=0;c<2;c++)s+=win(R,4+c*9,6+r*9.5,5,5.5,GLASS,FRAME);
  /* franja roja bajo la cornisa */
  s+=quad(L,0,h-5,w,2.2,RED,{st:false});s+=quad(R,0,h-5,d,2.2,I.shade(RED,.25),{st:false});
  /* cruz roja y blanca en el techo */
  var Tp=I.faceTop(x,y,7+h);
  s+=quad(Tp,7,5,12,12,"#FFFFFF",{st:"#E9E4DA",sw:1.2});
  s+=quad(Tp,11.4,6.6,3.2,8.8,RED,{st:false});s+=quad(Tp,8.6,9.4,8.8,3.2,RED,{st:false});
  /* ala derecha con helipuerto */
  var wx=10,wy=-12,ww=24,wd=18,wh=26;
  s+=box(wx,wy,7,ww,wd,wh,WALL,{left:"#F2ECE0",right:"#D9D3CC",top:"#E9E6DF"});
  var L2=I.faceL(wx,wy,7,ww,wd),R2=I.faceR(wx,wy,7,ww,wd);
  for(c=0;c<3;c++){s+=win(L2,3+c*7,6,4.4,5,GLASS,FRAME);s+=win(L2,3+c*7,15,4.4,5,GLASS,FRAME)}
  for(c=0;c<2;c++){s+=win(R2,3+c*8,6,5,5,GLASS,FRAME);s+=win(R2,3+c*8,15,5,5,GLASS,FRAME)}
  s+=quad(L2,0,wh-4,ww,1.8,RED,{st:false});
  var hp=I.cylD(wx+ww/2,wy+wd/2,7+wh,8.5);
  s+=I.cyl(wx+ww/2,wy+wd/2,7+wh,8.5,1.2,"#5B6B78",{top:"#4A5A68",noGlint:true});
  s+='<ellipse cx="'+f1(hp.cx)+'" cy="'+f1(hp.cy-1.2)+'" rx="'+f1(hp.rx-2)+'" ry="'+f1(hp.ry-1)+'" fill="none" stroke="#FFD45C" stroke-width="1.1"/>';
  /* la H, dibujada sobre el plano del techo */
  var Ht=I.faceTop(wx+ww/2-4,wy+wd/2-4,7+wh+1.2);
  s+=line([Ht(1.5,1),Ht(1.5,7)],"#FFFFFF",1.6)+line([Ht(6.5,1),Ht(6.5,7)],"#FFFFFF",1.6)+line([Ht(1.5,4),Ht(6.5,4)],"#FFFFFF",1.6);
  /* ala izquierda baja */
  var lx=-14,ly=6,lw=14,ld=24,lh=22;
  s+=box(lx,ly,7,lw,ld,lh,WALL,{left:"#F2ECE0",right:"#D9D3CC",top:"#FFFDF8"});
  var L3=I.faceL(lx,ly,7,lw,ld),R3=I.faceR(lx,ly,7,lw,ld);
  s+=arch(L3,3,0,8,11);
  s+=box(lx+1,ly+ld,7+12,10,5,2,RED,{right:I.shade(RED,.3),top:I.tint(RED,.25)});
  for(c=0;c<3;c++)s+=win(R3,2.5+c*7,8,4.4,6,GLASS,FRAME);
  s+=quad(R3,0,lh-4,ld,1.8,I.shade(RED,.25),{st:false});
  /* jardín: arbustos y flores */
  s+=bush(-30,14,5.5)+bush(-26,26,4.5,"#4FA352")+flowers(-34,24);
  /* ambulancia estacionada */
  s+=ambulance(18,18);
  s+=bush(30,-24,5,"#5FB257");
  return s;
 }
 function ambulance(x,y){
  var s=I.shadowBox(x,y,7,16,8,8);
  s+=box(x,y,7,11,8,9,"#FFFFFF",{left:"#F6F4EF",right:"#D9DCE2",top:"#FFFFFF"});
  s+=box(x+11,y,7,5,8,6,"#FFFFFF",{left:"#F6F4EF",right:"#D9DCE2",top:"#FFFFFF"});
  var L=I.faceL(x,y,7,11,8),R=I.faceR(x+11,y,7,5,8);
  s+=quad(L,0,3,11,1.6,RED,{st:false});
  s+=quad(I.faceL(x+11,y,7,5,8),.6,3,3.6,2.4,"#4FA8E0",{st:false});
  s+=quad(R,1,3,6,2.2,"#4FA8E0",{st:false});
  /* cruz lateral */
  s+=quad(L,4.6,4.2,1.6,4,RED,{st:false})+quad(L,3.4,5.4,4,1.6,RED,{st:false});
  /* torreta */
  s+=box(x+3,y+3,16,3,2,1.4,"#3D8BFF",{noGlint:true});
  /* ruedas */
  [[2,0],[9,0],[14,0]].forEach(function(q){var p=L(q[0],0);s+='<ellipse cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" rx="1.9" ry="1.9" fill="#2A3340"/>'});
  return s;
 }

 /* ---------- Computación: edificio-monitor con llaves de código, servidores con luces y cables ---------- */
 function computacion(){
  var s=I.platform(46,"#7FD3C8",{side:"#4E8F97"});
  /* retícula de losas de vidrio */
  for(var g=-36;g<=36;g+=12){s+=line([P(g,-Math.sqrt(1600-g*g)*.95,7.2),P(g,Math.sqrt(1600-g*g)*.95,7.2)],"#A8E6DD",.8,{op:.8});s+=line([P(-Math.sqrt(1600-g*g)*.95,g,7.2),P(Math.sqrt(1600-g*g)*.95,g,7.2)],"#A8E6DD",.8,{op:.8})}
  s+=I.walk(-2,44,-2,14,9,"#E6F4F1");
  /* base y pie del monitor */
  s+=box(-22,-10,7,30,22,4,"#3F4C5A",{top:"#5A6878",left:"#46525F",right:"#36414D"});
  s+=box(-10,-4,11,8,6,12,"#4E5C6C");
  s+=quad(I.faceL(-10,-4,11,8,6),2,0,4,7,"#7FD3C8",{st:false});s+=quad(I.faceL(-10,-4,11,8,6),2.6,.4,1.2,6,"#D9FFF8",{st:false,op:.6});
  /* cuerpo del monitor: delgado en y, ancho en x; pantalla en la cara izquierda (mira al frente izquierdo) */
  var x=-26,y=-6,w=40,d=7,z=22,h=38;
  s+=I.shadowBox(x,y,7,w,d,h+15);
  s+=box(x,y,z,w,d,h,"#2F3A47",{left:"#34404E",right:"#26303B",top:"#4A5767"});
  var L=I.faceL(x,y,z,w,d);
  s+=quad(L,2.2,2.6,w-4.4,h-5,"#122638",{st:false});
  /* reflejo de vidrio */
  s+=poly([L(4,h-2.6),L(14,h-2.6),L(6,2.6),L(2.2,2.6),L(2.2,10)],"#FFFFFF",{op:.08,st:false});
  /* llaves de código { } y líneas de colores */
  function brace(u0,dir){var pts=[[0,0],[-1.6*dir,0],[-2.2*dir,-1.6],[-2.2*dir,-6],[-3.6*dir,-7.2],[-2.2*dir,-8.4],[-2.2*dir,-12.8],[-1.6*dir,-14.4],[0,-14.4]];return line(pts.map(function(q){return L(u0+q[0],h-8+q[1])}),"#7CF2C8",1.7)}
  s+=brace(10,1)+brace(w-10,-1);
  var CL=["#FFC857","#FF7AA2","#8AB8FF","#7CF2C8","#C79BFF"];
  [[13,h-12,8],[14.5,h-15.5,11],[14.5,h-19,6],[13,h-22.5,9]].forEach(function(q,i){s+=quad(L,q[0],q[1],q[2],1.6,CL[i%CL.length],{st:false})});
  /* cursor que parpadea */
  s+=quad(L,24,h-22.5,1.2,2,"#FFFFFF",{st:false,cls:"iso-blink"});
  /* barra inferior del monitor con logo */
  s+=I.ell(x+w/2,y+d,z+1.3,1,"#9FB8C6",{k:.9});
  /* torres de servidores */
  s+=server(16,-26,30)+server(24,-14,24)+server(22,4,18);
  /* cables */
  s+=line([P(14,-4,8),P(20,6,7.5),P(28,8,7.5)],"#2E3A46",1.5)+line([P(14,-6,9),P(18,-8,8),P(24,-12,7.5)],"#E2434B",1.3)+line([P(14,-8,8),P(16,-18,7.5),P(18,-22,7.5)],"#4FA8E0",1.3);
  /* banca y planta */
  s+=bush(-30,18,5,"#4FA352")+ball(-34,6,7,4,"#78C26A");
  return s;
 }
 function server(x,y,h){
  var s=I.shadowBox(x,y,7,7,8,h);
  s+=box(x,y,7,7,8,h,"#3A4656",{left:"#404D5E",right:"#2C3644",top:"#56657A"});
  var L=I.faceL(x,y,7,7,8),R=I.faceR(x,y,7,7,8);
  for(var k=3;k<h-2;k+=4.2){s+=quad(L,1,k,5,2.6,"#2A3340",{st:false});s+=line([R(1.2,k+1.3),R(6.8,k+1.3)],"#2A3340",1.1)}
  var cols=["#57F2A0","#57F2A0","#FFC857","#57F2A0","#4FA8E0","#FF6B7A"],n=0;
  for(k=3;k<h-2;k+=4.2){var p=L(5.2,k+1.3);s+='<circle class="iso-led" style="--dl:'+((n*0.37)%1.6).toFixed(2)+'s" cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r=".95" fill="'+cols[n%cols.length]+'"/>';n++}
  return s;
 }

 /* ---------- Derecho: juzgado con columnas, escalinata y estatua de la justicia con balanza ---------- */
 function derecho(){
  var s=I.platform(46,"#9FD67E",{side:"#A98F67"});
  s+=I.ell(4,2,7.2,34,"#EEE6D4");
  s+=I.walk(44,-2,18,-2,10,"#EEE6D4");
  var STONE="#EDE5D3";
  /* edificio: la fachada mira a la derecha (cara +x) */
  var x=-24,y=-22,w=30,d=28;
  s+=I.shadowBox(x,y,7,w+10,d,40);
  s+=box(x,y,7,w,d,30,STONE,{left:"#E4DAC5",right:"#CFC3AA",top:"#F6F0E2"});
  var L=I.faceL(x,y,7,w,d);
  for(var c=0;c<3;c++)s+=win(L,4+c*9,9,5,10,"#5D7FA3","#D9CDB3");
  s+=quad(L,0,26,w,1.6,"#D9CDB3",{st:false});
  /* pórtico: escalinata y columnas al frente derecho */
  for(var k=0;k<3;k++)s+=box(x+w+k*0,y-2+k*0,7+k*2.2,12-k*3,d+4-k*0,2.2,"#F1EADB",{left:"#E2D7C2",right:"#CBBFA6",top:"#FAF5EA"});
  /* columnas */
  var cx0=x+w+4;
  for(c=0;c<5;c++)s+=I.cyl(cx0,y+2+c*6,13.6,1.8,22,"#F6F0E2",{sideS:"#D3C7AE",noGlint:true});
  /* entablamento y frontón triangular sobre la fachada */
  s+=box(x+w-1,y-3,35.6,9,d+6,3.4,STONE,{left:"#E4DAC5",right:"#D6CAB1",top:"#F6F0E2"});
  var fx=x+w+8;
  /* techo: dos planos que bajan hacia los lados, cumbrera a lo largo de x */
  s+=poly([P(x-1,y-3,37),P(fx,y-3,39),P(fx,y+d/2,49),P(x-1,y+d/2,47)],"#B5544A");
  s+=poly([P(x-1,y+d/2,47),P(fx,y+d/2,49),P(fx,y+d+3,39),P(x-1,y+d+3,37)],"#D9705F");
  s+=line([P(x-1,y+d/2,47),P(fx,y+d/2,49)],"#FFD9C7",1.4);
  /* frontón triangular sobre la fachada, al frente del techo */
  s+=poly([P(fx,y-3,39),P(fx,y+d+3,39),P(fx,y+d/2,49)],"#E4D8BF");
  s+=poly([P(fx,y+2,40.4),P(fx,y+d-2,40.4),P(fx,y+d/2,47)],"#CDBFA2",{st:false});
  s+=line([P(fx,y+d+3,39),P(fx,y+d/2,49)],"#FFF8EA",1.2);
  /* escudo en el frontón */
  var e=P(fx,y+d/2,43);s+='<circle cx="'+f1(e[0])+'" cy="'+f1(e[1])+'" r="2.2" fill="#C99A2E"/>';
  /* estatua de la justicia sobre pedestal, al frente izquierdo */
  s+=bush(-36,0,4.5,"#5FB257")+flowers(-30,20,["#FFD45C","#FFFFFF","#FF8FA3"]);
  s+=justice(-12,24);
  s+=bush(-2,40,4,"#4FA352");
  return s;
 }
 function justice(x,y){
  var s=I.shadowEll(x,y,7,5);
  s+=box(x-3,y-3,7,6,6,10,"#D9CDB3",{left:"#E4DAC5",right:"#C3B597",top:"#F1EADB"});
  var base=P(x,y,17),GOLD="#E8B33A",G=I.T(GOLD);
  var bx=base[0],by=base[1],fig='';
  /* túnica */
  fig+='<path d="M'+f1(bx-4)+' '+f1(by)+'L'+f1(bx-2.2)+' '+f1(by-14)+'L'+f1(bx+2.2)+' '+f1(by-14)+'L'+f1(bx+4)+' '+f1(by)+'Z" fill="'+G.b+'"/>';
  fig+='<path d="M'+f1(bx+.4)+' '+f1(by)+'L'+f1(bx+1)+' '+f1(by-14)+'L'+f1(bx+2.2)+' '+f1(by-14)+'L'+f1(bx+4)+' '+f1(by)+'Z" fill="'+G.s+'"/>';
  fig+='<circle cx="'+f1(bx)+'" cy="'+f1(by-16.4)+'" r="2.6" fill="'+G.b+'"/><circle cx="'+f1(bx-.8)+'" cy="'+f1(by-17.2)+'" r=".9" fill="'+G.h+'"/>';
  /* venda */
  fig+=line([[bx-2.5,by-16.8],[bx+2.5,by-16.8]],"#FFFFFF",.9);
  /* brazo en alto con la balanza */
  fig+=line([[bx+1.6,by-12],[bx+5,by-19]],G.b,1.6);
  fig+=line([[bx-2,by-21],[bx+12,by-17]],G.s,1.1);
  fig+=line([[bx+5,by-19],[bx+5,by-21.6]],G.s,1.1);
  [[bx-2,by-21],[bx+12,by-17]].forEach(function(q){fig+=line([[q[0],q[1]],[q[0]-1.6,q[1]+4.4]],G.s,.6)+line([[q[0],q[1]],[q[0]+1.6,q[1]+4.4]],G.s,.6)+'<path d="M'+f1(q[0]-2.6)+' '+f1(q[1]+4.4)+'Q'+f1(q[0])+' '+f1(q[1]+7)+' '+f1(q[0]+2.6)+' '+f1(q[1]+4.4)+'Z" fill="'+G.b+'"/>'});
  /* espada abajo */
  fig+=line([[bx-2,by-11],[bx-5,by-3]],"#C8D0D8",1);
  s+='<g transform="translate('+f1(bx)+' '+f1(by)+') scale(1.45) translate('+f1(-bx)+' '+f1(-by)+')">'+fig+'</g>';
  return s;
 }
 return {medicina:medicina,computacion:computacion,derecho:derecho};
})(ISO);
