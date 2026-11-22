/* ================= estructuras nuevas (v3) para las carreras que no tenían una propia =================
   Solo las pide #art (pestaña «Islas: rediseño»); la app sigue con el edificio genérico hasta que se aprueben.
   Cada una es el lugar real donde se ejerce, con la pieza que lo distingue en la vida real (no un objeto gigante):
   subestación con torre de transmisión, planta química con columnas y tanque esférico, invernadero, patio de
   contenedores con grúa, hotel con alberca, congreso con cúpula y banderas, etc. Mismo sistema que las demás:
   plataforma, luz arriba a la izquierda, ensamblador por profundidad y huella por parte. */
(function(I,E,H){
 if(typeof ART==="undefined"||!ART.addV3)return;
 var P=I.P,box=I.box,quad=I.quad,win=I.win,cyl=I.cyl,poly=I.poly,line=I.line,T=I.T,f1=I.f1;
 var Z=H.Z,GLASS=H.GLASS,FRAME=H.FRAME,piece=H.piece,dp=H.dp,at=H.at,plat=H.plat;
 function sh(x,y,w,d,h){return I.shadowBox(x,y,Z,w,d,h)}
 function door(F,u,w,h,col){return quad(F,u,0,w,h,col||"#7A5236",{st:false})+line([F(u+w/2,0),F(u+w/2,h)],"#00000033",.5,{cap:"butt"})}
 function wins(F,w,cols,rows,ww,wh,v0,gy,d,col){if(d===0)return quad(F,2,v0,w-4,Math.max(3,(rows-1)*gy+wh),I.shade(col||GLASS,.1),{st:false});
  var s="",gx=w/cols;for(var r=0;r<rows;r++)for(var c=0;c<cols;c++)s+=win(F,c*gx+(gx-ww)/2,v0+r*gy,ww,wh,col||GLASS,FRAME);return s}
 /* letrero sobre el techo: tablero con grosor en dos postes y un dibujo */
 function sign(x,y,z,w,col,icon){var s=cyl(x+2,y+1,z,.5,4,"#5A6573",{noGlint:true})+cyl(x+w-2,y+1,z,.5,4,"#5A6573",{noGlint:true});
  s+=box(x,y,z+4,w,1.6,9,"#FFFFFF",{left:"#FFFFFF",right:"#D7DDE3",top:"#F2F5F7"});var F=I.faceL(x,y,z+4,w,1.6);
  return s+quad(F,.8,.8,w-1.6,7.4,col,{st:false})+(icon?icon(F,w):"")}
 /* edificio base: muros, ventanas en las dos caras, franja, puerta y techo plano con pretil o de dos aguas */
 function B(o,d){var x=o.x,y=o.y,w=o.w,dd=o.d,h=o.h,t=T(o.c),rh=o.roof==="gable"?(o.roofH||8):1.2,s=o.noShadow?"":sh(x,y,w,dd,h+rh);
  s+=box(x,y,Z+(o.z||0),w,dd,h,o.c,{left:o.c,right:t.s,top:o.top||I.tint(o.c,.35)});
  var L=I.faceL(x,y,Z+(o.z||0),w,dd),R=I.faceR(x,y,Z+(o.z||0),w,dd);
  if(o.glass){s+=quad(L,1,1.4,w-2,h-3.2,o.glassC||"#6FB7E3",{st:false})+quad(R,1,1.4,dd-2,h-3.2,I.shade(o.glassC||"#6FB7E3",.18),{st:false});
   if(d>0){for(var u=1+(w-2)/4;u<w-1.5;u+=(w-2)/4)s+=line([L(u,1.4),L(u,h-1.8)],"#E8F2F8",.5,{cap:"butt"});for(var v=1.4+(h-3.2)/3;v<h-2;v+=(h-3.2)/3){s+=line([L(1,v),L(w-1,v)],"#E8F2F8",.5,{cap:"butt"})+line([R(1,v),R(dd-1,v)],"#C9DCE8",.5,{cap:"butt"})}}}
  else if(o.cols!==0){s+=wins(L,w,o.cols||3,o.rows||1,o.ww||4.4,o.wh||5,o.v0||(o.door!=null?10:4),o.gy||8,d,o.winC)+wins(R,dd,o.rcols||2,o.rows||1,o.ww||4.4,o.wh||5,o.v0||(o.door!=null?10:4),o.gy||8,d,o.winC)}
  if(o.band)s+=quad(L,0,h-3,w,2.2,o.band,{st:false})+quad(R,0,h-3,dd,2.2,I.shade(o.band,.25),{st:false});
  if(o.door!=null)s+=door(L,o.door,o.doorW||5,o.doorH||8,o.doorC||"#4C6A80");
  if(o.roof==="gable")s+=I.gable(x,y,Z+(o.z||0)+h,w,dd,rh,o.roofC||"#C9604F",{ov:1.6,th:1.4});
  else s+=box(x-.3,y-.3,Z+(o.z||0)+h,w+.6,dd+.6,1.2,I.tint(o.c,.12),{top:o.roofC||I.shade(o.c,.08),noGlint:true});
  return {s:s,L:L,R:R,zt:Z+(o.z||0)+h+(o.roof==="gable"?rh:1.2)}}
 function tree(x,y,d,k,c){return d>0?dp("treeRound",x,y,{k:k||.6,d:d,c:c}):null}
 function bush(x,y,d){return d>1?dp("bush",x,y,{k:.5,d:d}):null}
 /* piezas sueltas */
 function sphere(x,y,z,r,c){var p=P(x,y,z+r),t=T(c),R=r*1.22;return '<ellipse cx="'+f1(p[0]+R*.15)+'" cy="'+f1(P(x,y,z)[1]+1)+'" rx="'+f1(R*.9)+'" ry="'+f1(R*.35)+'" fill="#13213F" opacity=".18"/><circle cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r="'+f1(R)+'" fill="'+t.s+'"/><circle cx="'+f1(p[0]-R*.18)+'" cy="'+f1(p[1]-R*.18)+'" r="'+f1(R*.78)+'" fill="'+t.b+'"/><circle cx="'+f1(p[0]-R*.42)+'" cy="'+f1(p[1]-R*.42)+'" r="'+f1(R*.22)+'" fill="'+t.h+'" opacity=".8"/>'}
 function flag(x,y,h,cols,d){var s=I.contact(1,{x:P(x,y,Z)[0],y:P(x,y,Z)[1]})+cyl(x,y,Z,.45,h,"#C9D1DA",{noGlint:true}),p=P(x,y,Z+h),n=cols.length,wq=9/n;
  for(var i=0;i<n;i++){var u0=i*wq,u1=u0+wq,yy=function(u){return -1*Math.sin(Math.PI*u/4.5)};s+='<path d="M'+f1(p[0]+u0)+' '+f1(p[1]+yy(u0))+'L'+f1(p[0]+u1)+' '+f1(p[1]+yy(u1))+'L'+f1(p[0]+u1)+' '+f1(p[1]+yy(u1)+5)+'L'+f1(p[0]+u0)+' '+f1(p[1]+yy(u0)+5)+'Z" fill="'+cols[i]+'"/>'}
  return s}
 function car(x,y,c,d,o){o=o||{};var t=T(c),s=I.shadowBox(x,y,Z,12,6,5)+box(x,y,Z+1,12,6,3,c,{right:t.s,top:t.l});s+=box(x+2.6,y+.6,Z+4,6.4,4.8,2.4,o.cab||I.tint(c,.2),{top:t.l,noGlint:true});
  var L=I.faceL(x+2.6,y+.6,Z+4,6.4,4.8);s+=quad(L,.6,.4,5.2,1.6,"#7FB6DA",{st:false});if(o.bar)s+=box(x+4,y+1.5,Z+6.4,4,3,.8,o.bar,{noGlint:true});
  [2.4,9.4].forEach(function(u){s+=H.discX(x+u,y+6,Z+1.4,1.5,"#2A3340",{hub:"#8A97A0"})});return s}
 function container(x,y,z,c,d){var t=T(c),s=box(x,y,z,14,5.6,5.6,c,{right:t.s,top:t.l});if(d>0){var L=I.faceL(x,y,z,14,5.6);for(var u=1.4;u<14;u+=1.6)s+=line([L(u,.4),L(u,5.2)],t.s,.45,{cap:"butt"})}return s}
 function bench(x,y,d){return d>0?dp("bench",x,y,{d:d}):null}

 var F={};
 /* ---------------- SALUD ---------------- */
 F.enfermeria=function(d){var g=plat("#A9DCE6","#5E9CAA");
  var b=B({x:-26,y:-20,w:30,d:22,h:22,c:"#F7FAFB",band:"#2F8FB5",cols:4,rows:2,rcols:3,v0:4,gy:9,door:null},d),s=b.s;
  s+=door(b.L,11,8,9,"#5BB4E8")+box(-15.6,2,Z+9,10,4,1.2,"#2F8FB5",{noGlint:true});
  /* rampa con barandal para sillas de ruedas, como pide la norma de accesibilidad */
  var rp=poly([P(-6,2,Z),P(6,2,Z),P(6,8,Z+.2),P(-6,8,Z+.2)],"#E2E6EA",{st:false})+poly([P(-6,2,Z+2),P(-6,8,Z),P(-6,8,Z+.4),P(-6,2,Z+2.4)],"#C9D1DA",{st:false});
  if(d>0)rp+=line([P(-6,8,Z+3),P(-6,2,Z+5)],"#8A97A0",.6)+line([P(6,8,Z+3),P(6,2,Z+5)],"#8A97A0",.6);
  s+=sign(-17,-9,b.zt,14,"#FFFFFF",function(Fs,w){var c=Fs(w/2,3.7);return '<path d="M'+f1(c[0]-1.1)+' '+f1(c[1]-3.2)+'h2.2v2.1h2.1v2.2h-2.1v2.1h-2.2v-2.1h-2.1v-2.2h2.1z" fill="#2F8FB5"/>'});
  return piece(g,[["clínica",[-26,-20,4,2],s],["rampa",[-6,2,6,8],rp],["ambulancia",[12,8,24,14],car(12,8,"#FFFFFF",d,{bar:"#E2434B",cab:"#F3F5F7"})],tree(26,-16,d),bush(-32,18,d)])};
 F.odontologia=function(d){var g=plat("#BFE6F0","#6FA8B8");
  var b=B({x:-24,y:-16,w:28,d:20,h:15,c:"#FFFFFF",band:"#58B7D6",cols:3,rcols:2,v0:5,door:10,doorW:7,doorH:9,doorC:"#7FC6E0"},d),s=b.s;
  /* letrero con muela, como los consultorios dentales */
  s+=sign(-17,-7,b.zt,14,"#E6F6FB",function(Fs,w){var c=Fs(w/2,1.6);return '<path d="M'+f1(c[0]-3)+' '+f1(c[1]-5)+'c0-2 2-2.4 3-1.4c1-1 3-.6 3 1.4c0 2-1 3-1.2 5.4c-.2 1-1.2 1-1.3 0l-.5-2l-.5 2c-.1 1-1.1 1-1.3 0c-.2-2.4-1.2-3.4-1.2-5.4z" fill="#FFFFFF" stroke="#58B7D6" stroke-width=".7"/>'});
  var mac=d>0?box(10,6,Z,6,5,4,"#9BD47C",{noGlint:true})+at(13,8.5,Z+4,E.one("flowers",{d:d,k:.7})):"";
  return piece(g,[["consultorio",[-24,-16,4,4],s],d>0?["macetero",[10,6,16,11],mac]:null,tree(22,-14,d),bush(-30,16,d),bench(16,22,d)])};
 F.fisioterapia=function(d){var g=plat("#C7E8B6","#79A866");
  var b=B({x:-26,y:-20,w:32,d:20,h:14,c:"#F5F1E8",glass:true,glassC:"#8CCBEA"},d),s=b.s;s+=door(b.L,13,6,9,"#4C6A80");
  /* afuera: barras paralelas para reaprender a caminar y pelotas de terapia */
  var bp="";if(d>0){[[-12,10],[-12,15],[4,10],[4,15]].forEach(function(q){bp+=cyl(q[0],q[1],Z,.4,4.6,"#8A97A0",{noGlint:true})});bp+=line([P(-12,10,Z+4.6),P(4,10,Z+4.6)],"#C9D1DA",.9)+line([P(-12,15,Z+4.6),P(4,15,Z+4.6)],"#C9D1DA",.9)+poly([P(-12,10,Z+.1),P(4,10,Z+.1),P(4,15,Z+.1),P(-12,15,Z+.1)],"#7FB7E8",{st:false,op:.6})}
  var bl=d>0?sphere(14,14,Z,2.8,"#F28C38")+sphere(19,10,Z,2.2,"#5DA9E9"):"";
  return piece(g,[["centro",[-26,-20,6,0],s],d>0?["barras",[-12,10,4,15],bp]:null,d>0?["pelotas",[11,7,22,17],bl]:null,tree(24,-14,d),bush(-32,20,d)])};
 F.qfb=function(d){var g=plat("#CFE9D9","#7FAE92");
  var b=B({x:-24,y:-18,w:28,d:22,h:16,c:"#F7F7F2",band:"#2E9E5B",cols:3,rcols:3,v0:5,door:11,doorW:6,doorH:9,doorC:"#7FCB9F"},d),s=b.s;
  /* cruz verde de farmacia (como en México) y chimeneas de las campanas de extracción del laboratorio */
  s+=sign(-17,-8,b.zt,14,"#FFFFFF",function(Fs,w){var c=Fs(w/2,3.7);return '<path d="M'+f1(c[0]-1.1)+' '+f1(c[1]-3.2)+'h2.2v2.1h2.1v2.2h-2.1v2.1h-2.2v-2.1h-2.1v-2.2h2.1z" fill="#2E9E5B"/>'});
  s+=cyl(-2,-14,b.zt,1.4,6,"#C9D1DA",{noGlint:true})+cyl(1,-10,b.zt,1.4,5,"#C9D1DA",{noGlint:true});
  /* cilindros de gas encadenados junto al muro */
  var gs="";[["#3A7CC0",10],["#E2434B",13],["#9AA5B1",16]].forEach(function(q){gs+=cyl(q[1],-2,Z,1.3,9,q[0],{noGlint:true})+I.dome(q[1],-2,Z+9,1.3,"#C9D1DA")});
  return piece(g,[["laboratorio",[-24,-18,4,4],s],["cilindros",[8.6,-3.4,17.4,-.6],gs],tree(22,16,d),bush(-30,18,d),bench(14,24,d)])};
 F.educfisica=function(d){var g=plat("#A6D97A","#6FA34B");
  /* gimnasio con techo de arco y pista de atletismo con carriles al frente */
  var x=-26,y=-24,w=30,dd=20,h=11,s=sh(x,y,w,dd,h+8)+box(x,y,Z,w,dd,h,"#E9EEF2",{right:"#C3CED8"}),L=I.faceL(x,y,Z,w,dd);s+=wins(L,w,5,1,3.6,3,6,6,d)+door(L,12,6,6,"#3A5A7A");
  var ar="",prev=null,k;for(k=0;k<=12;k++){var a2=k/12*Math.PI,yb=y+dd/2+Math.cos(a2)*dd/2,zb=Z+h+Math.sin(a2)*8;if(prev)ar+=poly([P(x,prev[0],prev[1]),P(x+w,prev[0],prev[1]),P(x+w,yb,zb),P(x,yb,zb)],k>6?"#9CC3E0":"#7EA9CC",{st:false});prev=[yb,zb]}
  var arcP=[];for(k=0;k<=12;k++){var a3=k/12*Math.PI;arcP.push(P(x+w,y+dd/2+Math.cos(a3)*dd/2,Z+h+Math.sin(a3)*8))}s+=ar+poly(arcP,"#C3CED8",{st:false});
  var tr=poly([P(-30,4,Z+.1),P(26,4,Z+.1),P(26,26,Z+.1),P(-30,26,Z+.1)],"#C9573F",{st:false})+poly([P(-24,9,Z+.15),P(20,9,Z+.15),P(20,21,Z+.15),P(-24,21,Z+.15)],"#7CC35A",{st:false});
  if(d>0)[5.5,7].forEach(function(o){tr+=line([P(-30,o,Z+.2),P(26,o,Z+.2)],"#FFFFFF",.4,{cap:"butt"})});
  if(d>0){tr+=line([P(-22,13,Z+.2),P(-22,17,Z+.2),P(-22,17,Z+3),P(-22,13,Z+3),P(-22,13,Z+.2)],"#FFFFFF",.6)}
  return piece(g+tr,[["gimnasio",[x,y,x+w,y+dd],s],tree(22,-18,d),d>0?dp("bench",14,-2,{d:d}):null])};
 /* ---------------- INGENIERÍAS ---------------- */
 F.industrial=function(d){var g=plat("#D8CDB8","#9C8A6C");
  /* nave industrial (almacén) con andenes de carga, cortinas metálicas, tráiler y tarimas */
  var b=B({x:-28,y:-22,w:34,d:24,h:14,c:"#DDE3E8",cols:0,roof:"gable",roofC:"#8FA0B0",roofH:5},d),s=b.s;
  for(var k=0;k<3;k++)s+=quad(b.L,3+k*10.4,0,8,8,"#9AA5B1",{st:false})+(d>0?line([b.L(3+k*10.4,4),b.L(11+k*10.4,4)],"#7E8B98",.4,{cap:"butt"}):"");
  s+=box(-28,2,Z,34,3,1.6,"#B9C2CC",{noGlint:true});
  var tk=I.shadowBox(10,6,Z,20,7,9)+box(10,6,Z+1.4,14,7,8,"#F4F6F8",{right:"#C9D1DA"})+box(24,6,Z+1,6,7,6,"#E2434B",{right:"#B8303A"});var TF=I.faceL(24,6,Z+1,6,7);tk+=quad(TF,.6,3.4,4.6,2,"#7FB6DA",{st:false});
  [12,16,27].forEach(function(u){tk+=H.discX(u,13,Z+1.3,1.5,"#2A3340",{hub:"#8A97A0"})});
  var pl=d>0?box(-30,10,Z,7,7,1.2,"#C99A5B",{noGlint:true})+box(-30,10,Z+1.2,7,7,4,"#D9B07A",{noGlint:true})+box(-21,12,Z,7,7,1.2,"#C99A5B",{noGlint:true}):"";
  return piece(g,[["nave",[-28,-22,6,5],s],["tráiler",[10,6,30,13],tk],d>0?["tarimas",[-30,10,-14,19],pl]:null,bush(-34,-6,d)])};
 F.mecanica=function(d){var g=plat("#D9D2C2","#9C9178");
  /* taller con dos bahías: una con un coche en el elevador; llantas apiladas y letrero de engrane */
  var b=B({x:-26,y:-18,w:32,d:20,h:13,c:"#F2EFE8",band:"#E86E3A",cols:0},d),s=b.s;
  s+=quad(b.L,2,0,12,9,"#3A4452",{st:false})+quad(b.L,17,0,12,9,"#9AA5B1",{st:false});if(d>0)for(var v=1.5;v<9;v+=1.5)s+=line([b.L(17,v),b.L(29,v)],"#7E8B98",.4,{cap:"butt"});
  s+=box(-23,-2,Z,1,1,6,"#E2B13C",{noGlint:true})+box(-14,-2,Z,1,1,6,"#E2B13C",{noGlint:true});
  s+=sign(-17,-8,b.zt,14,"#2F3A47",function(Fs,w){var c=Fs(w/2,3.7),o="";for(var k=0;k<8;k++){var a=k/8*Math.PI*2;o+='<rect x="'+f1(c[0]-.6)+'" y="'+f1(c[1]-3.6)+'" width="1.2" height="1.6" fill="#E86E3A" transform="rotate('+(k*45)+' '+f1(c[0])+' '+f1(c[1])+')"/>'}return o+'<circle cx="'+f1(c[0])+'" cy="'+f1(c[1])+'" r="2.4" fill="#E86E3A"/><circle cx="'+f1(c[0])+'" cy="'+f1(c[1])+'" r="1" fill="#2F3A47"/>'});
  var cr=car(-22,4,"#3F7DA6",d);
  var ll="";if(d>0)[[12,8,3],[16,12,2]].forEach(function(q){for(var i=0;i<q[2];i++)ll+=cyl(q[0],q[1],Z+i*1.6,2.4,1.6,"#2A3340",{top:"#3A4452",noGlint:true})+I.ell(q[0],q[1],Z+i*1.6+1.61,1,"#8A97A0")});
  return piece(g,[["taller",[-26,-18,6,2],s],["coche",[-22,4,-10,10],cr],d>0?["llantas",[9,5,19,15],ll]:null,tree(24,-14,d)])};
 F.electrica=function(d){var g=plat("#D5DCC4","#8F9C78");
  /* subestación: casa de control, transformadores con aletas de enfriamiento, cerca y torre de transmisión */
  var b=B({x:-30,y:-2,w:16,d:12,h:10,c:"#E9E4D6",cols:2,rcols:1,v0:4,door:12,doorW:4,doorH:7,doorC:"#5A6573"},d),s=b.s;
  var tf="";[[-6,-6],[4,-6]].forEach(function(q){tf+=I.shadowBox(q[0],q[1],Z,6,6,8)+box(q[0],q[1],Z,6,6,7,"#6F8A6B",{right:"#57704F",top:"#8BA585"});var L=I.faceL(q[0],q[1],Z,6,6);if(d>0)for(var u=1;u<6;u+=1.2)tf+=line([L(u,1),L(u,6)],"#4E6346",.45,{cap:"butt"});
   [1.5,3,4.5].forEach(function(u){tf+=cyl(q[0]+u,q[1]+3,Z+7,.45,3,"#C9B48C",{noGlint:true})})});
  var fc=d>0?line([P(-10,-10,Z+4),P(14,-10,Z+4),P(14,4,Z+4),P(-10,4,Z+4),P(-10,-10,Z+4)],"#9AA5B1",.4)+[[-10,-10],[14,-10],[14,4],[-10,4]].map(function(q){return line([P(q[0],q[1],Z),P(q[0],q[1],Z+4)],"#9AA5B1",.5)}).join(""):"";
  /* torre de transmisión de celosía con crucetas, aisladores y cables */
  var tx=18,ty=-22,h=42,tw="",lg=[[-3,-3],[3,-3],[3,3],[-3,3]];lg.forEach(function(q){tw+=line([P(tx+q[0],ty+q[1],Z),P(tx+q[0]*.25,ty+q[1]*.25,Z+h)],"#7E8B98",.8)});
  if(d>0)for(var z=0;z<h-4;z+=6){var k0=1-.75*z/h,k1=1-.75*(z+6)/h;tw+=line([P(tx-3*k0,ty+3*k0,Z+z),P(tx+3*k1,ty+3*k1,Z+z+6)],"#9AA5B1",.4)+line([P(tx+3*k0,ty+3*k0,Z+z),P(tx-3*k1,ty+3*k1,Z+z+6)],"#9AA5B1",.4)+line([P(tx+3*k0,ty-3*k0,Z+z),P(tx+3*k1,ty+3*k1,Z+z+6)],"#7E8B98",.4)}
  [h-6,h-12].forEach(function(z,i){var a=10-i*2;tw+=line([P(tx,ty-a,Z+z),P(tx,ty+a,Z+z)],"#7E8B98",.9);[-a,a].forEach(function(o){tw+=line([P(tx,ty+o,Z+z),P(tx,ty+o,Z+z-2.4)],"#E6ECF0",.9);
   var p0=P(tx,ty+o,Z+z-2.4),p1=P(tx-34,ty+o-10,Z+z+6);tw+='<path d="M'+f1(p0[0])+' '+f1(p0[1])+'Q'+f1((p0[0]+p1[0])/2)+' '+f1((p0[1]+p1[1])/2+6)+' '+f1(p1[0])+' '+f1(p1[1])+'" stroke="#3A4452" stroke-width=".35" fill="none"/>'})});
  return piece(g,[["casa de control",[-30,-2,-14,10],s],["transformadores",[-10,-10,14,4],tf+fc],["torre",[tx-3,ty-3,tx+3,ty+3],tw],bush(-26,20,d),tree(20,16,d)])};
 F.electronica=function(d){var g=plat("#C7DCEB","#7E9BB4");
  /* planta de ensamble de electrónica: edificio de vidrio azul con letrero de chip y antena; patio con dibujo de pistas de circuito */
  var b=B({x:-24,y:-20,w:30,d:22,h:20,c:"#E8EEF3",glass:true,glassC:"#5D9FD3"},d),s=b.s;s+=door(b.L,12,6,7,"#2F5A82");
  s+=sign(-16,-10,b.zt,14,"#1F3B5A",function(Fs,w){var c=Fs(w/2,3.7),o='<rect x="'+f1(c[0]-2.6)+'" y="'+f1(c[1]-2.6)+'" width="5.2" height="5.2" rx=".6" fill="#7CF2C8"/>';for(var k=-1;k<=1;k++)o+='<path d="M'+f1(c[0]-4)+' '+f1(c[1]+k*1.6)+'h1.4M'+f1(c[0]+2.6)+' '+f1(c[1]+k*1.6)+'h1.4" stroke="#7CF2C8" stroke-width=".5"/>';return o});
  s+=cyl(2,-16,b.zt,.4,8,"#8A97A0",{noGlint:true});var ap=P(2,-16,b.zt+8);s+='<circle cx="'+f1(ap[0])+'" cy="'+f1(ap[1])+'" r="1" fill="#E2434B"/>';
  if(d>0){var pc=[[[-20,10],[-6,10],[-6,20],[12,20]],[[-14,14],[0,14],[0,26]],[[8,6],[20,6],[20,16]]];pc.forEach(function(q){g+=line(q.map(function(p){return P(p[0],p[1],Z+.2)}),"#E2B13C",.8);var e=P(q[q.length-1][0],q[q.length-1][1],Z+.2);g+='<circle cx="'+f1(e[0])+'" cy="'+f1(e[1])+'" r="1" fill="#E2B13C"/>'})}
  return piece(g,[["planta",[-24,-20,6,2],s],tree(24,-14,d),bush(-30,22,d),bench(16,24,d)])};
 F.quimicaing=function(d){var g=plat("#D8D4C6","#9A9480");
  /* planta química: columnas de destilación con plataformas, tanque esférico, tuberías y casa de control */
  var b=B({x:-28,y:4,w:14,d:12,h:8,c:"#EEF0F2",cols:2,rcols:1,v0:3},d),cb=b.s;
  var cl="";[[-14,-18,30,3.2],[-5,-20,24,2.6]].forEach(function(q){cl+=I.shadowEll(q[0],q[1],Z,q[3]+1)+cyl(q[0],q[1],Z,q[3],q[2],"#D5DCE3",{sideS:"#A9B4BF",noGlint:true})+I.dome(q[0],q[1],Z+q[2],q[3],"#E6ECF0");
   /* plataformas de servicio: anillos con barandal (no discos) alrededor de la columna */
   if(d>0)for(var z=7;z<q[2];z+=8){var e=I.cylD(q[0],q[1],Z+z,q[3]+1.6);cl+='<path d="M'+f1(e.cx-e.rx)+' '+f1(e.cy)+'A'+f1(e.rx)+' '+f1(e.ry)+' 0 0 0 '+f1(e.cx+e.rx)+' '+f1(e.cy)+'" stroke="#E2B13C" stroke-width="1.1" fill="none"/><path d="M'+f1(e.cx-e.rx)+' '+f1(e.cy-1.4)+'A'+f1(e.rx)+' '+f1(e.ry)+' 0 0 0 '+f1(e.cx+e.rx)+' '+f1(e.cy-1.4)+'" stroke="#E2B13C" stroke-width=".5" fill="none"/>'}});
  var sp=sphere(14,-10,Z+4,7,"#E8EDF2");sp=cyl(10,-12,Z,.5,6,"#8A97A0",{noGlint:true})+cyl(18,-8,Z,.5,6,"#8A97A0",{noGlint:true})+sp;
  var pp=d>0?line([P(-14,-18,Z+12),P(-14,-6,Z+12),P(14,-6,Z+12),P(14,-6,Z)],"#7E8B98",1.2)+line([P(-5,-20,Z+8),P(-5,-4,Z+8),P(8,-4,Z+8)],"#C9573F",1.1)+line([P(-5,-4,Z+8),P(-5,-4,Z)],"#C9573F",1.1):"";
  return piece(g,[["control",[-28,4,-14,16],cb],["columnas",[-17.2,-23,-2.4,-14.8],cl],["tanque",[7,-17,21,-3],sp+pp],bush(20,18,d),tree(-34,-8,d)])};
 F.biomedica=function(d){var g=plat("#D6E4F0","#8AA2B8");
  /* laboratorio de ingeniería biomédica: edificio con letrero de electrocardiograma; afuera, rampa y una banca */
  var b=B({x:-24,y:-18,w:30,d:22,h:18,c:"#FFFFFF",band:"#E0607A",cols:4,rows:1,rcols:3,v0:9,door:12,doorW:6,doorH:8,doorC:"#7FB6DA"},d),s=b.s;
  s+=quad(b.L,1,13,28,3,"#BFE3F2",{st:false});
  s+=sign(-16,-8,b.zt,14,"#1F2E44",function(Fs,w){var a=Fs(1.6,3.7),c=Fs(w-1.6,3.7),m=(a[0]+c[0])/2,y=(a[1]+c[1])/2,k=(c[1]-a[1])/(c[0]-a[0]);function Y(x,dy){return f1(a[1]+(x-a[0])*k+dy)}
   return '<path d="M'+f1(a[0])+' '+f1(a[1])+'L'+f1(m-3)+' '+Y(m-3,0)+'L'+f1(m-1.8)+' '+Y(m-1.8,-2.8)+'L'+f1(m-.4)+' '+Y(m-.4,2.6)+'L'+f1(m+.8)+' '+Y(m+.8,-1)+'L'+f1(m+1.6)+' '+Y(m+1.6,0)+'L'+f1(c[0])+' '+f1(c[1])+'" stroke="#7CF2C8" stroke-width=".7" fill="none"/>'});
  return piece(g,[["laboratorio",[-24,-18,6,4],s],tree(22,-14,d),bush(-30,18,d),bench(14,20,d),d>1?dp("lamp",2,28,{d:d}):null])};
 /* ---------------- TECNOLOGÍA Y CIENCIAS ---------------- */
 F.ia=function(d){var g=plat("#C9D9F0","#7E94B8");
  /* centro de investigación en IA: edificio de vidrio con letrero de red neuronal y, al frente, un robot de servicio */
  var b=B({x:-26,y:-22,w:28,d:22,h:26,c:"#EEF2F8",glass:true,glassC:"#7A8FD0"},d),s=b.s;s+=door(b.L,11,6,7,"#2F3F82");
  s+=sign(-19,-12,b.zt,16,"#1E2650",function(Fs,w){var N=[[3,2],[3,5.4],[8,1.4],[8,3.7],[8,6],[13,3.7]].map(function(q){return Fs(q[0],q[1])}),o="";[[0,2],[0,3],[0,4],[1,2],[1,3],[1,4],[2,5],[3,5],[4,5]].forEach(function(e){o+='<path d="M'+f1(N[e[0]][0])+' '+f1(N[e[0]][1])+'L'+f1(N[e[1]][0])+' '+f1(N[e[1]][1])+'" stroke="#8AB8FF" stroke-width=".35"/>'});N.forEach(function(p){o+='<circle cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r=".9" fill="#FFC857"/>'});return o});
  var rx=14,ry=14,rb=I.shadowEll(rx,ry,Z,3)+box(rx-2,ry-1.6,Z,4,3.2,2,"#5A6573",{noGlint:true})+box(rx-2.6,ry-2,Z+2,5.2,4,6,"#E6ECF0",{right:"#BFC9D3"})+box(rx-2,ry-1.6,Z+8,4,3.2,3.4,"#F4F6F8",{right:"#C9D1DA"});
  var RF=I.faceL(rx-2,ry-1.6,Z+8,4,3.2);rb+='<circle cx="'+f1(RF(1.2,2)[0])+'" cy="'+f1(RF(1.2,2)[1])+'" r=".6" fill="#4FA8E0"/><circle cx="'+f1(RF(2.8,2)[0])+'" cy="'+f1(RF(2.8,2)[1])+'" r=".6" fill="#4FA8E0"/>';
  return piece(g,[["centro",[-26,-22,2,0],s],["robot",[rx-2.6,ry-2,rx+2.6,ry+2],rb],tree(24,-12,d),bush(-30,16,d)])};
 F.ciberseguridad=function(d){var g=plat("#C3CCD6","#7A8796");
  /* centro de operaciones de seguridad: edificio cerrado con pocas ventanas, letrero de escudo, cámaras y caseta con pluma */
  var b=B({x:-24,y:-22,w:28,d:22,h:20,c:"#3B4A5C",band:"#2BC48A",cols:3,rows:1,rcols:2,v0:14,ww:5,wh:2.6,winC:"#1E2A38",door:12,doorW:5,doorH:8,doorC:"#1E2A38"},d),s=b.s;
  s+=sign(-17,-12,b.zt,14,"#1E2A38",function(Fs,w){var c=Fs(w/2,1.4);return '<path d="M'+f1(c[0])+' '+f1(c[1]-6)+'l3 1.2v2.4c0 2.2-1.4 3.6-3 4.2c-1.6-.6-3-2-3-4.2v-2.4z" fill="#2BC48A"/><rect x="'+f1(c[0]-.9)+'" y="'+f1(c[1]-3.4)+'" width="1.8" height="1.6" rx=".3" fill="#1E2A38"/>'});
  [[-24,0],[4,-22]].forEach(function(q){var p=P(q[0],q[1]+(q[1]===0?0:0),Z+18);s+='<rect x="'+f1(p[0]-1.6)+'" y="'+f1(p[1]-.8)+'" width="3.2" height="1.6" rx=".6" fill="#E6ECF0"/><circle cx="'+f1(p[0]-1.4)+'" cy="'+f1(p[1])+'" r=".5" fill="#E2434B"/>'});
  var gt=box(12,10,Z,5,5,6,"#E6ECF0",{right:"#BFC9D3"})+quad(I.faceL(12,10,Z,5,5),1,2.4,3,2.4,"#7FB6DA",{st:false})+box(12.4,10.4,Z+6,4.2,4.2,.8,"#3B4A5C",{noGlint:true});
  gt+=cyl(10,16,Z,.6,3,"#3B4A5C",{noGlint:true});gt+=line([P(10,16,Z+3),P(-6,16,Z+3)],"#E2434B",1.1,{dash:"2 2"});
  return piece(g,[["centro",[-24,-22,4,0],s],["caseta",[-6,10,17,16],gt],bush(-30,16,d),tree(24,-12,d)])};
 F.quimica=function(d){var g=plat("#D9E8C9","#8FA87A");
  /* laboratorio de química: chimeneas de campanas de extracción en la azotea, regadera de emergencia y letrero de matraz */
  var b=B({x:-24,y:-20,w:30,d:22,h:17,c:"#F6F4EC",band:"#7B5EA7",cols:4,rcols:3,v0:9,door:12,doorW:6,doorH:8,doorC:"#9E87C4"},d),s=b.s;
  for(var k=0;k<3;k++)s+=cyl(-20+k*6,-16,b.zt,1.1,6,"#C9D1DA",{noGlint:true})+box(-21.4+k*6,-17.4,b.zt+6,2.8,2.8,.6,"#9AA5B1",{noGlint:true});
  s+=sign(0,-10,b.zt,12,"#FFFFFF",function(Fs,w){var c=Fs(w/2,.8);return '<path d="M'+f1(c[0]-1)+' '+f1(c[1]-6.4)+'h2v2.4l2.6 3.6h-7.2l2.6-3.6z" fill="#7B5EA7"/><path d="M'+f1(c[0]-2.4)+' '+f1(c[1]-2)+'h4.8l.8 1.2h-6.4z" fill="#7CF2C8"/>'});
  var rg=d>0?cyl(14,6,Z,.5,11,"#2E9E5B",{noGlint:true})+line([P(14,6,Z+11),P(14,9,Z+11)],"#2E9E5B",1)+I.ell(14,9,Z+10.4,1.6,"#2E9E5B")+cyl(14,9,Z,1.6,.4,"#E2B13C",{noGlint:true}):"";
  return piece(g,[["laboratorio",[-24,-20,6,2],s],d>0?["regadera",[12.4,4.4,15.6,10.6],rg]:null,tree(24,-14,d),bush(-30,18,d),bench(18,22,d)])};
 F.biologia=function(d){var g=plat("#B6DE9A","#6FA34B");
  /* estación de biología: laboratorio pequeño y un invernadero de vidrio con plantas adentro */
  var b=B({x:-28,y:-22,w:18,d:16,h:12,c:"#F4EFE4",cols:2,rcols:2,v0:5,door:7,doorW:4,doorH:7,roof:"gable",roofC:"#5FA347",roofH:6},d),s=b.s;
  var gx=-6,gy=-14,gw=28,gd=16,gh=9,gr=I.shadowBox(gx,gy,Z,gw,gd,gh+6);
  gr+=box(gx,gy,Z,gw,gd,1.2,"#B9C2CC",{noGlint:true});
  if(d>0)for(var i=0;i<6;i++)gr+=at(gx+3+i*4.4,gy+gd/2,Z+1.2,E.one(i%2?"bush":"flowers",{d:d,k:.55,ph:i}));
  gr+=box(gx,gy,Z+1.2,gw,gd,gh,"#CFEFF7",{left:"#BFE6F2",right:"#A6D6E6",noTop:true,noGlint:true}).replace(/fill="#(CFEFF7|BFE6F2|A6D6E6)"/g,function(m){return m+' fill-opacity=".55"'});
  gr+=I.gable(gx,gy,Z+1.2+gh,gw,gd,6,"#CFEFF7",{ov:.4,th:.6}).replace(/<polygon /g,'<polygon fill-opacity=".7" ');
  var GL=I.faceL(gx,gy,Z+1.2,gw,gd);if(d>0)for(var u=0;u<=gw;u+=4)gr+=line([GL(u,0),GL(u,gh)],"#FFFFFF",.5,{cap:"butt",op:.9});
  return piece(g,[["laboratorio",[-28,-22,-10,-6],s],["invernadero",[gx,gy,gx+gw,gy+gd],gr],tree(-30,14,d,.6,"#3F9C4A"),tree(20,18,d),bush(8,24,d)])};
 F.matematicas=function(d){var g=plat("#D4DCEF","#8792B8");
  /* facultad de matemáticas: fachada con pizarrón y fórmula, y escultura de sólidos geométricos en la plaza */
  var b=B({x:-26,y:-20,w:30,d:22,h:20,c:"#F2EEE6",cols:0,door:12,doorW:6,doorH:8,doorC:"#5C6FA8"},d),s=b.s;
  s+=quad(b.L,2,10,26,8,"#2F4A3A",{st:false})+quad(b.L,2,10,26,8,"none",{st:"#C99A5B",sw:.8});
  if(d>0)s+='<g transform="'+I.planeX(-24,2,Z+12)+'"><text x="13" y="-1.2" text-anchor="middle" font-size="4.4" font-family="Georgia,serif" fill="#F4F6F8">e<tspan font-size="2.8" dy="-2">iπ</tspan><tspan dy="2"> + 1 = 0</tspan></text></g>';
  s+=wins(b.R,22,3,2,4,4,4,8,d);
  var sc=I.shadowEll(14,14,Z,6)+box(9,10,Z,10,8,2,"#C9CED8",{noGlint:true})+box(10,11,Z+2,4.4,4.4,4.4,"#E2434B",{right:"#B8303A",top:"#F07A80"})+sphere(17,15,Z+2,2.4,"#F2B544");
  var cn=P(13,17,Z+2);sc+='<path d="M'+f1(cn[0]-2.6)+' '+f1(cn[1])+'L'+f1(cn[0])+' '+f1(cn[1]-8)+'L'+f1(cn[0]+2.6)+' '+f1(cn[1])+'Z" fill="#4FA8E0"/><path d="M'+f1(cn[0])+' '+f1(cn[1]-8)+'L'+f1(cn[0]+2.6)+' '+f1(cn[1])+'L'+f1(cn[0]+.6)+' '+f1(cn[1]+.6)+'Z" fill="#3F7DA6"/>';
  return piece(g,[["facultad",[-26,-20,4,2],s],["escultura",[9,10,19,18],sc],tree(24,-14,d),bush(-30,18,d)])};
 /* ---------------- NEGOCIOS Y SOCIEDAD ---------------- */
 F.contaduria=function(d){var g=plat("#E3E0CF","#A39C78");
  /* despacho contable en edificio de oficinas de tres pisos, con letrero de calculadora */
  var b=B({x:-22,y:-20,w:24,d:20,h:30,c:"#EDE7DA",band:"#3F7D5C",cols:3,rows:3,rcols:2,v0:10,gy:7,door:9,doorW:6,doorH:8,doorC:"#5D8C72"},d),s=b.s;
  s+=sign(-17,-10,b.zt,12,"#FFFFFF",function(Fs,w){var a=Fs(3.6,1.2),o='<rect x="'+f1(a[0]-1.4)+'" y="'+f1(a[1]-6.2)+'" width="5" height="6.4" rx=".6" fill="#3F7D5C"/><rect x="'+f1(a[0]-.8)+'" y="'+f1(a[1]-5.6)+'" width="3.8" height="1.4" fill="#BFE8CF"/>';for(var r=0;r<2;r++)for(var c=0;c<3;c++)o+='<rect x="'+f1(a[0]-.8+c*1.3)+'" y="'+f1(a[1]-3.6+r*1.4)+'" width=".9" height=".9" fill="#FFFFFF"/>';return o});
  var bx=d>0?box(10,6,Z,6,5,4,"#D9B07A",{noGlint:true})+box(10,6,Z+4,6,5,4,"#C99A5B",{noGlint:true})+box(17,7,Z,5,4,4,"#D9B07A",{noGlint:true}):"";
  return piece(g,[["despacho",[-22,-20,2,0],s],d>0?["archivo",[10,6,22,11],bx]:null,tree(24,-12,d),bush(-30,16,d),bench(-8,22,d)])};
 F.economia=function(d){var g=plat("#E6DCC4","#A8956A");
  /* bolsa de valores: edificio de columnas con pantalla de cotizaciones en verde y rojo, y la escultura del toro */
  var x=-26,y=-22,w=30,dd=20,h=18,s=sh(x,y,w,dd+5,h+4)+box(x,y,Z,w,dd,h,"#F1EADB",{right:"#CFC3AA"}),L=I.faceL(x,y,Z,w,dd);
  for(var k=0;k<6;k++)s+=cyl(x+2.6+k*5,y+dd+1.4,Z,1.2,h-4,"#FFFFFF",{sideS:"#D3C7AE",noGlint:true});
  s+=box(x-.6,y-.6,Z+h-4,w+1.2,dd+3.4,4,"#E8DFCC",{top:"#F6F0E2"});var FR=I.faceL(x-.6,y-.6,Z+h-4,w+1.2,dd+3.4);s+=quad(FR,1,.8,w-.8,2.4,"#14202B",{st:false});
  if(d>0)s+='<g transform="'+I.planeX(x+.4,y+dd+2.8,Z+h-3.2)+'"><text x="1" y="-.3" font-size="1.9" font-weight="800" font-family="monospace"><tspan fill="#3DDC84">IPC ▲1.2%</tspan><tspan fill="#FF5A5A"> USD ▼0.4%</tspan><tspan fill="#3DDC84"> ORO ▲</tspan></text></g>';
  var bl=I.shadowEll(16,14,Z,6)+box(11,11,Z,10,6,1.6,"#9AA5B1",{noGlint:true});var bp=P(16,14,Z+1.6);
  bl+='<g transform="translate('+f1(bp[0])+' '+f1(bp[1])+')"><path d="M-7 -1l1-6c1-2 4-3 7-3c2 0 3-1 4-2l1 2l-1 1c1 1 1 3 0 4l1 4h-2l-1-3h-6l-1 3h-2z" fill="#8A5A2E"/><path d="M4 -12q2-2 3-1M4 -12q-1-2-3-2" stroke="#E8D8B8" stroke-width=".8" fill="none"/></g>';
  return piece(g,[["bolsa",[x-.6,y-.6,x+w+.6,y+dd+3],s],["toro",[10,10,22,18],bl],tree(-32,14,d),bush(24,-14,d)])};
 F.actuaria=function(d){var g=plat("#DCE3EE","#8E9CB4");
  /* aseguradora: torre de oficinas con letrero de paraguas (el símbolo de los seguros) */
  var b=B({x:-20,y:-20,w:20,d:20,h:40,c:"#5D86B8",glass:true,glassC:"#5D86B8"},d),s=b.s;s+=door(b.L,7,6,6,"#22436A");
  s+=sign(-17,-11,b.zt,14,"#FFFFFF",function(Fs,w){var c=Fs(w/2,4.6);return '<path d="M'+f1(c[0]-4)+' '+f1(c[1])+'a4 4 0 0 1 8 0z" fill="#E2434B"/><path d="M'+f1(c[0])+' '+f1(c[1])+'v2.6q0 1-1 1" stroke="#3A4452" stroke-width=".6" fill="none"/>'});
  var b2=B({x:4,y:-6,w:14,d:12,h:12,c:"#EFE7D8",cols:2,rcols:2,v0:5,door:5,doorW:4,doorH:6},d);
  return piece(g,[["torre",[-20,-20,0,0],s],["anexo",[4,-6,18,6],b2.s],tree(-28,14,d),bush(22,18,d),bench(8,20,d)])};
 F.mercadotecnia=function(d){var g=plat("#F2D9C4","#C08E6A");
  /* agencia de publicidad: edificio con fachada de color y un anuncio espectacular en la azotea */
  var b=B({x:-24,y:-18,w:28,d:20,h:16,c:"#FFF4E8",band:"#F2994A",cols:4,rcols:2,v0:8,door:11,doorW:6,doorH:7,doorC:"#F2994A"},d),s=b.s;
  var bx=-22,by=-12,bz=b.zt;s+=cyl(bx+4,by,bz,.6,7,"#5A6573",{noGlint:true})+cyl(bx+18,by,bz,.6,7,"#5A6573",{noGlint:true})+box(bx,by-1,bz+7,22,1.4,11,"#FFFFFF",{right:"#D7DDE3"});
  var BF=I.faceL(bx,by-1,bz+7,22,1.4);s+=quad(BF,.6,.6,20.8,9.8,"#5B3FA8",{st:false})+quad(BF,.6,.6,9,9.8,"#F2C744",{st:false});
  if(d>0)s+='<g transform="'+I.planeX(bx+10.6,by+.4,bz+11.4)+'"><text x="5" y="0" text-anchor="middle" font-size="3.2" font-weight="900" fill="#FFFFFF" font-family="Nunito,system-ui,sans-serif">¡NUEVO!</text></g>';
  return piece(g,[["agencia",[-24,-18,4,2],s],tree(22,-12,d),bush(-30,18,d),bench(14,20,d),d>1?dp("lamp",2,28,{d:d}):null])};
 F.comext=function(d){var g=plat("#C9D6DE","#7E95A3");
  /* recinto de comercio exterior: aduana, contenedores apilados y grúa pórtico que monta sobre una hilera de contenedores */
  var b=B({x:-30,y:-24,w:16,d:12,h:10,c:"#F2F4F6",band:"#2F6DB5",cols:2,rcols:1,v0:4,door:6,doorW:4,doorH:7},d),s=b.s;
  var ct=container(-12,-10,Z,"#E2434B",d)+container(-12,-10,Z+5.6,"#2F6DB5",d)+container(-12,-3,Z,"#F2994A",d)+container(-12,-3,Z+5.6,"#3FA34D",d)+container(-12,4,Z,"#2F6DB5",d);
  var cx0=8,cx1=28,y0=-14,y1=10,Y="#F2B544",bk="",fr="",rw=container(11,-8,Z,"#9AA5B1",d)+container(11,-1,Z,"#E2434B",d)+container(11,-1,Z+5.6,"#F2994A",d);
  [[cx0,y0],[cx1,y0]].forEach(function(q){bk+=box(q[0]-.6,q[1]-.6,Z,1.2,1.2,22,Y,{noGlint:true})});bk+=box(cx0-.6,y0-.6,Z+22,cx1-cx0+1.2,1.2,1.6,Y,{noGlint:true});
  [[cx0,y1],[cx1,y1]].forEach(function(q){fr+=box(q[0]-.6,q[1]-.6,Z,1.2,1.2,22,Y,{noGlint:true})});fr+=box(cx0-.6,y1-.6,Z+22,cx1-cx0+1.2,1.2,1.6,Y,{noGlint:true});
  /* dos vigas a lo largo y el carro con el gancho, que sostiene un contenedor */
  fr+=box(cx0-.6,y0-.6,Z+23.6,1.2,y1-y0+1.2,1.2,"#E0A43A",{noGlint:true})+box(cx1-.6,y0-.6,Z+23.6,1.2,y1-y0+1.2,1.2,"#E0A43A",{noGlint:true});
  fr+=box(cx0,-3,Z+24.8,cx1-cx0,4,1.6,"#5A6573",{noGlint:true});var hk=P(18,-1,Z+24.8),hk2=P(18,-1,Z+16);fr+='<path d="M'+f1(hk[0]-1)+' '+f1(hk[1])+'V'+f1(hk2[1])+'M'+f1(hk[0]+1)+' '+f1(hk[1])+'V'+f1(hk2[1])+'" stroke="#3A4452" stroke-width=".4"/>'+container(11,-3.8,Z+12.4,"#3FA34D",d);
  return piece(g,[["aduana",[-30,-24,-14,-12],s],["contenedores",[-12,-10,2,9.6],ct],["grúa atrás",[cx0-.6,y0-.6,cx1+.6,y0+.6],bk],["hilera",[11,-8,25,4.6],rw],["grúa frente",[cx0-.6,y1-.6,cx1+.6,y1+.6],fr],bush(-32,14,d)])};
 F.turismo=function(d){var g=plat("#BFE6E0","#6FA8A0");
  /* hotel de playa: torre con balcones, alberca con camastros y sombrillas, y palmeras */
  var b=B({x:-26,y:-24,w:22,d:16,h:32,c:"#FFF6EA",cols:4,rows:4,rcols:3,v0:9,gy:6,door:8,doorW:6,doorH:7,doorC:"#7FC6E0"},d),s=b.s;
  if(d>0)for(var r=0;r<4;r++)s+=box(-26,-8,Z+9+r*6-.6,22,1.6,.6,"#E8D7B8",{noGlint:true});
  s+=sign(-21,-16,b.zt,12,"#2F8FB5",function(Fs,w){var c=Fs(w/2,4.4);return '<text x="'+f1(c[0])+'" y="'+f1(c[1]+1.4)+'" text-anchor="middle" font-size="3.4" font-weight="900" fill="#FFFFFF" font-family="Nunito,system-ui,sans-serif">HOTEL</text>'});
  var pl=poly([P(0,0,Z+.15),P(26,0,Z+.15),P(26,14,Z+.15),P(0,14,Z+.15)],"#FFFFFF",{st:false})+poly([P(1.4,1.4,Z+.2),P(24.6,1.4,Z+.2),P(24.6,12.6,Z+.2),P(1.4,12.6,Z+.2)],"#4FC3E8",{st:false});
  if(d>0)pl+=line([P(4,4,Z+.25),P(10,4,Z+.25)],"#FFFFFF",.5,{op:.7})+line([P(12,8,Z+.25),P(20,8,Z+.25)],"#FFFFFF",.5,{op:.7});
  var um="";if(d>0)[[4,20],[14,22]].forEach(function(q){um+=box(q[0]-3,q[1]-1,Z,6,2.4,.8,"#FFFFFF",{noGlint:true})+cyl(q[0]+3,q[1],Z,.3,6,"#8A5E3C",{noGlint:true});var u=P(q[0]+3,q[1],Z+6);um+='<path d="M'+f1(u[0]-5)+' '+f1(u[1]+1.6)+'Q'+f1(u[0])+' '+f1(u[1]-3)+' '+f1(u[0]+5)+' '+f1(u[1]+1.6)+'Z" fill="#F2994A"/>'});
  return piece(g+pl,[["hotel",[-26,-24,-4,-8],s],d>0?["camastros",[1,18,20,24],um]:null,d>0?dp("palm",-30,6,{d:d,k:.8}):null,d>0?dp("palm",30,-6,{d:d,k:.75,flip:true}):null])};
 F.politicas=function(d){var g=plat("#E3DCCB","#A6987A");
  /* recinto legislativo: edificio de cantera con cúpula y linternilla, escalinata y asta con la bandera de México */
  var x=-24,y=-22,w=30,dd=22,h=16,s=sh(x,y,w,dd+4,h+20)+box(x,y,Z,w,dd,h,"#EDE5D3",{right:"#CFC3AA"}),L=I.faceL(x,y,Z,w,dd),R=I.faceR(x,y,Z,w,dd);
  s+=wins(L,w,5,1,3,7,4,8,d,"#5D7FA3")+wins(R,dd,4,1,3,7,4,8,d,"#5D7FA3");
  for(var k=0;k<3;k++)s+=box(x+6,y+dd+(2-k)*1.6,Z+k*1.2,18,1.6+k*0,1.2,"#F1EADB",{noGlint:true});
  s+=box(x-.4,y-.4,Z+h,w+.8,dd+.8,1.6,"#E4DAC5",{top:"#F6F0E2"});
  s+=cyl(x+w/2,y+dd/2,Z+h+1.6,8,5,"#E9E2D0",{sideS:"#C9BFA6",noGlint:true})+I.dome(x+w/2,y+dd/2,Z+h+6.6,8,"#7FA6A0")+cyl(x+w/2,y+dd/2,Z+h+14.6,1.6,3,"#EDE5D3",{noGlint:true})+I.dome(x+w/2,y+dd/2,Z+h+17.6,1.6,"#7FA6A0");
  var fl=flag(14,16,22,["#1F7A4D","#FFFFFF","#CE2B37"],d);
  return piece(g,[["congreso",[x,y,x+w,y+dd+5],s],["bandera",[13,15,15,17],fl],tree(-32,14,d),bush(24,-14,d)])};
 F.rrii=function(d){var g=plat("#DCE6EE","#8FA3B4");
  /* sede de organismo internacional o embajada: edificio moderno con hilera de astas con banderas de varios países */
  var b=B({x:-24,y:-22,w:30,d:18,h:22,c:"#F4F6F8",glass:true,glassC:"#8CB8DA"},d),s=b.s;s+=door(b.L,12,6,7,"#2F5A82");
  var FL=[["#1F7A4D","#FFFFFF","#CE2B37"],["#2F4FA8","#FFFFFF","#E2434B"],["#000000","#E2434B","#F2C744"],["#E2434B","#FFFFFF"],["#3A7CC0","#FFFFFF","#3A7CC0"]],fs="";
  FL.forEach(function(c,i){fs+=flag(-20+i*7,6,16,c,d)});
  return piece(g,[["sede",[-24,-22,6,-4],s],["banderas",[-21,5,9,7],fs],tree(24,-12,d),bush(-30,18,d),bench(14,20,d)])};
 F.sociologia=function(d){var g=plat("#F0DCC0","#B89668");
  /* centro comunitario con mural de colores y, enfrente, un kiosco como el de cualquier plaza de pueblo en México */
  var b=B({x:-28,y:-24,w:26,d:18,h:14,c:"#FFF1DC",cols:0,door:10,doorW:6,doorH:8,doorC:"#C9573F",roof:"gable",roofC:"#C9573F",roofH:6},d),s=b.s;
  var MC=["#F2994A","#2F8FB5","#3FA34D","#E2434B","#F2C744"];for(var k=0;k<5;k++)s+=quad(b.L,1+k*5,9,4.6,4,MC[k],{st:false});s+=wins(b.R,18,2,1,4,4,5,8,d);
  var kx=12,ky=10,ks=I.shadowEll(kx,ky,Z,9)+cyl(kx,ky,Z,9,2.4,"#E8DCC4",{sideS:"#C9BB9C",noGlint:true});
  for(var c=0;c<8;c++){var a=c/8*Math.PI*2,px=kx+Math.cos(a)*7.4,py=ky+Math.sin(a)*7.4;if(Math.sin(a)>-.2||c%2===0)ks+=cyl(px,py,Z+2.4,.5,8,"#2F6B4F",{noGlint:true})}
  ks+=cyl(kx,ky,Z+10.4,9.4,.8,"#2F6B4F",{noGlint:true});var kp=P(kx,ky,Z+11.2),kc=I.cylD(kx,ky,Z+11.2,9.4);ks+='<path d="M'+f1(kc.cx-kc.rx)+' '+f1(kc.cy)+'Q'+f1(kp[0])+' '+f1(kp[1]-12)+' '+f1(kc.cx+kc.rx)+' '+f1(kc.cy)+'A'+f1(kc.rx)+' '+f1(kc.ry)+' 0 0 1 '+f1(kc.cx-kc.rx)+' '+f1(kc.cy)+'Z" fill="#C9573F"/><circle cx="'+f1(kp[0])+'" cy="'+f1(kp[1]-8.6)+'" r="1" fill="#F2C744"/>';
  return piece(g,[["centro",[-28,-24,-2,-6],s],["kiosco",[kx-9,ky-9,kx+9,ky+9],ks],tree(-30,12,d),bush(24,-16,d)])};
 F.trabajosocial=function(d){var g=plat("#F2E0C8","#B99A70");
  /* centro de desarrollo comunitario: edificio con letrero de manos y corazón, y área de juegos (columpio y resbaladilla) */
  var b=B({x:-26,y:-22,w:28,d:18,h:14,c:"#FFF8EC",band:"#E0607A",cols:3,rcols:2,v0:6,door:11,doorW:6,doorH:8,doorC:"#E0607A"},d),s=b.s;
  s+=sign(-19,-14,b.zt,14,"#FFFFFF",function(Fs,w){var c=Fs(w/2,3);return '<path d="M'+f1(c[0])+' '+f1(c[1]-.6)+'c-1.6-1.2-3.2-2.4-3.2-3.8c0-1.4 2-2 3.2-.6c1.2-1.4 3.2-.8 3.2.6c0 1.4-1.6 2.6-3.2 3.8z" fill="#E0607A"/><path d="M'+f1(c[0]-4.6)+' '+f1(c[1]+.6)+'q2 1.6 4.6 1.2q2.6.4 4.6-1.2" stroke="#F2994A" stroke-width=".9" fill="none" stroke-linecap="round"/>'});
  var pg=poly([P(4,4,Z+.1),P(26,4,Z+.1),P(26,20,Z+.1),P(4,20,Z+.1)],"#E8C9A0",{st:false});
  var sw="";[[8,8],[8,16]].forEach(function(q){sw+=line([P(q[0]-2,q[1],Z),P(q[0],q[1],Z+9),P(q[0]+2,q[1],Z)],"#3F7DA6",.8)});sw+=line([P(8,8,Z+9),P(8,16,Z+9)],"#3F7DA6",.9)+line([P(8,10,Z+9),P(8,10,Z+3)],"#8A97A0",.3)+line([P(8,13,Z+9),P(8,13,Z+3)],"#8A97A0",.3)+box(7,9.6,Z+2.6,2,3.8,.5,"#E2434B",{noGlint:true});
  var sl=box(18,10,Z,3,3,7,"#F2C744",{noGlint:true})+poly([P(18,13,Z+7),P(21,13,Z+7),P(21,22,Z+.6),P(18,22,Z+.6)],"#E2434B",{st:false});
  return piece(g+pg,[["centro",[-26,-22,2,-4],s],["columpio",[6,8,10,16],sw],["resbaladilla",[18,10,21,22],sl],tree(-30,12,d),bush(26,-14,d)])};
 F.criminologia=function(d){var g=plat("#D4DAE4","#8A95A8");
  /* servicios periciales / fiscalía: edificio institucional azul y blanco con escudo, patrulla y cinta en una zona de evidencia */
  var b=B({x:-26,y:-22,w:30,d:20,h:18,c:"#F4F6F8",band:"#1F3F7A",cols:4,rows:1,rcols:3,v0:9,door:12,doorW:6,doorH:8,doorC:"#1F3F7A"},d),s=b.s;
  s+=sign(-18,-12,b.zt,14,"#1F3F7A",function(Fs,w){var c=Fs(w/2,1.4);return '<path d="M'+f1(c[0])+' '+f1(c[1]-6)+'l3 1.2v2.4c0 2.2-1.4 3.6-3 4.2c-1.6-.6-3-2-3-4.2v-2.4z" fill="#F2C744"/><path d="M'+f1(c[0])+' '+f1(c[1]-4.8)+'l.6 1.3l1.4.1l-1.1.9l.4 1.4l-1.3-.8l-1.3.8l.4-1.4l-1.1-.9l1.4-.1z" fill="#1F3F7A"/>'});
  var pc=car(10,6,"#FFFFFF",d,{bar:"#3A7CC0",cab:"#1F3F7A"});
  var tp=d>0?[[ -20,10],[-6,10],[-6,22],[-20,22]].map(function(q){return cyl(q[0],q[1],Z,.4,3.6,"#F2994A",{noGlint:true})}).join("")+line([P(-20,10,Z+3.2),P(-6,10,Z+3.2),P(-6,22,Z+3.2)],"#F2C744",.9,{dash:"1.4 .8"})+line([P(-20,10,Z+3.2),P(-20,22,Z+3.2),P(-6,22,Z+3.2)],"#F2C744",.9,{dash:"1.4 .8"})+at(-13,16,Z,'<path d="M-2 0l2-3l2 3z" fill="#F2C744" stroke="#3A4452" stroke-width=".3"/><text x="0" y="-.6" text-anchor="middle" font-size="1.8" font-weight="900" fill="#3A4452">1</text>'):"";
  return piece(g,[["fiscalía",[-26,-22,4,-2],s],["patrulla",[10,6,22,12],pc],d>0?["evidencia",[-20,10,-6,22],tp]:null,tree(26,-14,d)])};
 /* ---------------- ARTE Y COMUNICACIÓN ---------------- */
 F.grafico=function(d){var g=plat("#F2D6E4","#BE8AA4");
  /* estudio de diseño: edificio blanco con franjas CMYK en la fachada y letrero de pluma de vectores */
  var b=B({x:-24,y:-20,w:28,d:20,h:18,c:"#FFFFFF",cols:3,rcols:2,v0:10,door:11,doorW:6,doorH:8,doorC:"#3A4452"},d),s=b.s;
  ["#00AEEF","#EC008C","#FFF200","#231F20"].forEach(function(c,i){s+=quad(b.R,1+i*4.6,1,4,16,c,{st:false})});
  s+=sign(-17,-10,b.zt,14,"#FFFFFF",function(Fs,w){var c=Fs(w/2,1.4);return '<path d="M'+f1(c[0])+' '+f1(c[1]-6.4)+'l2.6 3.4l-1.2 2.4h-2.8l-1.2-2.4z" fill="#231F20"/><circle cx="'+f1(c[0])+'" cy="'+f1(c[1]-2.8)+'" r=".6" fill="#FFFFFF"/><path d="M'+f1(c[0]-5)+' '+f1(c[1]-1)+'q5-4 10 0" stroke="#EC008C" stroke-width=".6" fill="none"/>'});
  return piece(g,[["estudio",[-24,-20,4,0],s],tree(22,-12,d),bush(-30,18,d),bench(14,20,d),d>1?dp("lamp",0,26,{d:d}):null])};
 F.disindustrial=function(d){var g=plat("#E6DDD0","#A89A82");
  /* taller de diseño industrial: nave con ventanal, impresora 3D a la vista y una silla prototipo en la plaza */
  var b=B({x:-26,y:-22,w:30,d:20,h:14,c:"#E4E0DA",cols:0,roof:"gable",roofC:"#5C6B7A",roofH:6},d),s=b.s;
  s+=quad(b.L,2,2,26,9,"#9CCDE8",{st:false});if(d>0)for(var u=2;u<=28;u+=6.5)s+=line([b.L(u,2),b.L(u,11)],"#4C5866",.6,{cap:"butt"});
  s+=box(-22,-2,Z,6,4,7,"#3A4452",{noGlint:true});
  var ch=I.shadowEll(14,12,Z,6),cp=P(14,12,Z);ch+='<g transform="translate('+f1(cp[0])+' '+f1(cp[1])+')"><path d="M-6 0l1-5M6 0l-1-5M-2 3l1-5M3 3l-1-5" stroke="#3A4452" stroke-width=".8"/><path d="M-7 -6q7-3 14 0q-1 2-7 3q-6-1-7-3z" fill="#E86E3A"/><path d="M-6 -6q-1-6 2-9q4-1 8 0q2 3 2 9q-6-2-12 0z" fill="#F2994A"/></g>';
  return piece(g,[["taller",[-26,-22,4,-2],s],["silla",[8,8,20,16],ch],tree(-32,12,d),bush(24,-14,d)])};
 F.animacion=function(d){var g=plat("#E2D6F2","#9E8AC0");
  /* estudio de animación: edificio con fachada de cuadros de storyboard y un gran lápiz en la entrada */
  var b=B({x:-24,y:-20,w:30,d:20,h:18,c:"#FBF8FF",cols:0,door:12,doorW:6,doorH:8,doorC:"#6B4FA8"},d),s=b.s;
  var FR=["#F2C744","#4FC3E8","#F28CB2","#7CD38C"];for(var k=0;k<4;k++){s+=quad(b.L,1.4+k*7,10,6,6,"#FFFFFF",{st:"#3A4452",sw:.5});if(d>0){var c=b.L(4.4+k*7,13);s+='<circle cx="'+f1(c[0]+(k-1.5)*.6)+'" cy="'+f1(c[1])+'" r="1.4" fill="'+FR[k]+'"/>'}}
  s+=wins(b.R,20,2,1,4,4,8,8,d);
  var pc="",a=P(14,12,Z),bb=P(14,12,Z+20);pc=I.contact(1.8,{x:a[0],y:a[1]})+'<path d="M'+f1(a[0]-2.2)+' '+f1(a[1]-3)+'L'+f1(bb[0]-2.2)+' '+f1(bb[1])+'L'+f1(bb[0]+2.2)+' '+f1(bb[1])+'L'+f1(a[0]+2.2)+' '+f1(a[1]-3)+'Z" fill="#6B4FA8"/><path d="M'+f1(a[0]+.6)+' '+f1(a[1]-3)+'L'+f1(bb[0]+.6)+' '+f1(bb[1])+'L'+f1(bb[0]+2.2)+' '+f1(bb[1])+'L'+f1(a[0]+2.2)+' '+f1(a[1]-3)+'Z" fill="#53398A"/><path d="M'+f1(a[0]-2.2)+' '+f1(a[1]-3)+'L'+f1(a[0])+' '+f1(a[1]+1)+'L'+f1(a[0]+2.2)+' '+f1(a[1]-3)+'Z" fill="#E8C9A0"/><rect x="'+f1(bb[0]-2.2)+'" y="'+f1(bb[1]-3)+'" width="4.4" height="3" fill="#F28CB2"/>';
  return piece(g,[["estudio",[-24,-20,6,0],s],["lápiz",[12,10,16,14],pc],tree(24,-12,d),bush(-30,18,d)])};
 F.gastronomia=function(d){var g=plat("#F2DCC4","#BE9670");
  /* restaurante escuela: fachada de ladrillo con toldo, chimenea de la cocina, letrero de gorro de chef y terraza con mesas */
  var b=B({x:-26,y:-22,w:28,d:18,h:15,c:"#C9704F",cols:3,rcols:2,v0:6,ww:5,wh:6,door:11,doorW:6,doorH:8,doorC:"#5A3A22",top:"#B4603F"},d),s=b.s;
  if(d>0)for(var v=2;v<15;v+=2)s+=line([b.L(0,v),b.L(28,v)],"#B4603F",.35,{cap:"butt"});
  s+=box(-26,-4,Z+9,28,4,.8,"#2F6B4F",{noGlint:true});s+=cyl(-4,-18,b.zt,1.6,8,"#9AA5B1",{noGlint:true});
  s+=sign(-21,-14,b.zt,12,"#FFFFFF",function(Fs,w){var c=Fs(w/2,1.4);return '<path d="M'+f1(c[0]-2.4)+' '+f1(c[1]-1)+'v-2.4a1.8 1.8 0 0 1 .6-3.4a2.2 2.2 0 0 1 3.6 0a1.8 1.8 0 0 1 .6 3.4v2.4z" fill="#FFFFFF" stroke="#3A4452" stroke-width=".5"/>'});
  var tr="";if(d>0)[[8,8],[18,12],[10,20]].forEach(function(q){tr+=cyl(q[0],q[1],Z,2.6,.5,"#FFFFFF",{noGlint:true}).replace(/<polygon/,'<polygon')+cyl(q[0],q[1],Z,.3,3,"#5A3A22",{noGlint:true})+cyl(q[0],q[1],Z+3,2.6,.4,"#F7F2E8",{noGlint:true})+cyl(q[0],q[1],Z+3.4,.25,4.6,"#8A5E3C",{noGlint:true});var u=P(q[0],q[1],Z+8);tr+='<path d="M'+f1(u[0]-5)+' '+f1(u[1]+1.6)+'Q'+f1(u[0])+' '+f1(u[1]-3)+' '+f1(u[0]+5)+' '+f1(u[1]+1.6)+'Z" fill="#2F6B4F"/>'});
  return piece(g,[["restaurante",[-26,-22,2,-4],s],d>0?["terraza",[5,5,21,23],tr]:null,tree(-30,12,d),bush(26,-14,d)])};
 /* ---------------- versiones más completas de estructuras que se veían muy sencillas ---------------- */
 F.moda=function(d){var g=plat("#F2D3DA","#C38E9A");
  /* boutique de dos pisos: aparadores grandes con maniquíes, toldo, letrero colgante con gancho y una bolsa de compras al frente */
  var b=B({x:-24,y:-20,w:30,d:20,h:22,c:"#FFF6F2",cols:0,door:20,doorW:6,doorH:9,doorC:"#8E4E5E"},d),s=b.s;
  s+=quad(b.L,1.6,1,16,10,"#CFE9F4",{st:"#C77A8A",sw:.8})+wins(b.L,30,3,1,5,5,14,8,d)+wins(b.R,20,2,2,4,4,4,9,d);
  if(d>0)[4.6,9.6,14.6].forEach(function(u,i){var m=b.L(u,1.2);s+='<path d="M'+f1(m[0])+' '+f1(m[1]-8.4)+'l-1.2 1.2l-2.2 6.6h6.8l-2.2-6.6z" fill="'+["#D98C9C","#5B3FA8","#F2C744"][i]+'"/><circle cx="'+f1(m[0])+'" cy="'+f1(m[1]-9)+'" r=".9" fill="#E8C9A0"/>'});
  s+=box(-24,0,Z+11,30,4.4,.8,"#D98C9C",{noGlint:true});var AF=I.faceL(-24,0,Z+11,30,4.4);if(d>0)for(var u=0;u<30;u+=3)s+=quad(AF,u,-.6,1.5,1.4,"#FFFFFF",{st:false});
  var hg=b.L(26,17);s+='<path d="M'+f1(hg[0])+' '+f1(hg[1])+'h6" stroke="#5A6573" stroke-width=".6"/><rect x="'+f1(hg[0]+1.4)+'" y="'+f1(hg[1]+.6)+'" width="4.4" height="4.4" rx=".6" fill="#FFFFFF" stroke="#C77A8A" stroke-width=".5"/><path d="M'+f1(hg[0]+3.6)+' '+f1(hg[1]+1.6)+'l-1.6 2.4h3.2z" fill="none" stroke="#5A6573" stroke-width=".4"/>';
  var bg=I.shadowBox(14,12,Z,7,4,9)+box(14,12,Z,7,4,8,"#D98C9C",{right:"#B86E7E",top:"#E8AEBA"});var bp=P(17.5,14,Z+8);bg+='<path d="M'+f1(bp[0]-2)+' '+f1(bp[1])+'q2-4 4 0" stroke="#5A3A44" stroke-width=".7" fill="none"/>';
  return piece(g,[["boutique",[-24,-20,6,4.4],s],["bolsa",[14,12,21,16],bg],tree(24,-12,d),bush(-30,18,d)])};
 F.comunicacion=function(d){var g=plat("#D9D2EE","#9A8EC0");
  /* televisora: estudio con luz de «AL AIRE», torre de transmisión roja y blanca con antenas y unidad móvil con plato */
  var b=B({x:-26,y:-20,w:28,d:20,h:16,c:"#F4F2FA",band:"#5B3FA8",cols:3,rcols:2,v0:6,door:11,doorW:6,doorH:8,doorC:"#5B3FA8"},d),s=b.s;
  s+=sign(-20,-10,b.zt,14,"#1E1A2E",function(Fs,w){var c=Fs(w/2,4.4);return '<circle cx="'+f1(c[0]-4.6)+'" cy="'+f1(c[1]-.2)+'" r="1.2" fill="#FF4D4D"/><text x="'+f1(c[0]+1.2)+'" y="'+f1(c[1]+1)+'" text-anchor="middle" font-size="2.6" font-weight="900" fill="#FFFFFF" font-family="Nunito,system-ui,sans-serif">AL AIRE</text>'});
  var tx=-8,ty=-18,h=46,tw="";for(var z=0;z<h;z+=6){var k0=1-.7*z/h,k1=1-.7*(z+6)/h,c=(z/6)%2?"#FFFFFF":"#E2434B";
   [[-1,-1],[1,-1],[1,1],[-1,1]].forEach(function(q){tw+=line([P(tx+q[0]*2.4*k0,ty+q[1]*2.4*k0,b.zt+z),P(tx+q[0]*2.4*k1,ty+q[1]*2.4*k1,b.zt+z+6)],c,.9)});
   if(d>0)tw+=line([P(tx-2.4*k0,ty+2.4*k0,b.zt+z),P(tx+2.4*k1,ty+2.4*k1,b.zt+z+6)],c,.4)}
  [[h*.55,-1],[h*.72,1]].forEach(function(q){var p=P(tx+q[1]*1.6,ty+1.6,b.zt+q[0]);tw+='<ellipse cx="'+f1(p[0]+q[1]*1.6)+'" cy="'+f1(p[1])+'" rx="2.4" ry="1.4" fill="#F4F6F8" stroke="#9AA5B1" stroke-width=".4" transform="rotate('+(q[1]*20)+' '+f1(p[0])+' '+f1(p[1])+')"/>'});
  var tp=P(tx,ty,b.zt+h);tw+='<circle cx="'+f1(tp[0])+'" cy="'+f1(tp[1]-1)+'" r="1" fill="#FF4D4D"/>';
  var vn=car(10,8,"#F4F2FA",d,{cab:"#E6E2F2"});var dc=P(14,11,Z+8.6);vn+=cyl(14,11,Z+6.4,.4,2,"#5A6573",{noGlint:true})+'<g transform="translate('+f1(dc[0])+' '+f1(dc[1]-1)+') rotate(-25)"><ellipse rx="3.4" ry="1.8" fill="#F4F6F8" stroke="#9AA5B1" stroke-width=".4"/><path d="M0 0l1.6-2.4" stroke="#5A6573" stroke-width=".4"/></g>';
  return piece(g,[["estudio",[-26,-20,2,0],s+tw],["unidad móvil",[10,8,22,14],vn],tree(24,-14,d),bush(-30,18,d)])};
 F.ambiental=function(d){var g=plat("#A6D97A","#6FA34B");
  /* centro de ingeniería ambiental: oficina con techo verde, fila de tres aerogeneradores, paneles solares y contenedores de reciclaje */
  var b=B({x:-28,y:-6,w:18,d:14,h:10,c:"#F3EBDC",cols:2,rcols:1,v0:4,door:7,doorW:4,doorH:7,roof:"gable",roofC:"#6FB84E",roofH:6},d),s=b.s;
  var tb="";[[-16,-28,40],[-2,-30,44],[12,-28,40]].forEach(function(q,i){tb+=I.shadowEll(q[0],q[1],Z,2.4)+cyl(q[0],q[1],Z,2,1.6,"#D5DCE3",{noGlint:true})+cyl(q[0],q[1],Z+1.6,.9,q[2],"#F4F6F8",{sideS:"#CDD3DA",noGlint:true});
   var hb=P(q[0],q[1],Z+q[2]+2);tb+='<g transform="translate('+f1(hb[0])+' '+f1(hb[1])+')"><g class="iso-beam" style="animation-duration:'+(4.6+i*.7)+'s">'+[0,120,240].map(function(a){return '<path d="M0 0L-1.3 -14Q0 -16 1.3 -14Z" fill="#FFFFFF" stroke="#C9D1DA" stroke-width=".5" transform="rotate('+(a+i*40)+')"/>'}).join("")+'</g><circle r="1.6" fill="#C9D1DA"/></g>'});
  var sp="";[[4,-12],[4,-4],[4,4]].forEach(function(q){var a=P(q[0],q[1],Z+2),b2=P(q[0]+14,q[1],Z+2),c=P(q[0]+14,q[1]+6,Z+5.6),e=P(q[0],q[1]+6,Z+5.6);sp+=cyl(q[0]+7,q[1]+4,Z,.5,3.6,"#5A6573",{noGlint:true})+poly([a,b2,c,e],"#2D5C8A",{st:"#C9D1DA",sw:.6});if(d>0)for(var k=1;k<5;k++)sp+=line([P(q[0]+k*2.8,q[1],Z+2),P(q[0]+k*2.8,q[1]+6,Z+5.6)],"#6FA0CF",.4,{cap:"butt"})});
  var rc="";if(d>0)[["#3F9C4A",-6],["#2F6DB5",-2],["#F2C744",2]].forEach(function(q){rc+=box(q[1],16,Z,3.4,3.4,4.4,q[0],{noGlint:true})+box(q[1]-.2,15.8,Z+4.4,3.8,3.8,.6,I.shade(q[0],.2),{noGlint:true})});
  return piece(g,[["aerogeneradores",[-19,-33,15,-25],tb],["casa",[-29.6,-7.6,-8.4,9.6],s],["paneles",[4,-12,18,10],sp],d>0?["reciclaje",[-6.2,15.8,5.6,19.8],rc]:null,tree(26,18,d)])};
 F.mecatronica=function(d){var g=plat("#C9D6A6","#8C9C62");
  /* planta de manufactura: techo de dientes de sierra con vidrio, ventanal que deja ver la línea con brazos robóticos, andén y montacargas */
  var x=-28,y=-20,w=32,dd=22,h=13,s=sh(x,y,w,dd,h+8)+box(x,y,Z,w,dd,h,"#E6E9EC",{right:"#BCC4CC",noTop:true}),L=I.faceL(x,y,Z,w,dd);
  s+=quad(L,2,3,20,8,"#BFE0F2",{st:"#7E8B98",sw:.6});if(d>0){s+=line([L(2.6,5),L(21.4,5)],"#4C5866",1);[6,12,18].forEach(function(u){var p=L(u,5);s+='<path d="M'+f1(p[0])+' '+f1(p[1])+'l1.4-3l2 .8" stroke="#E36F32" stroke-width="1" fill="none" stroke-linecap="round"/>'})}
  s+=quad(L,24,0,6,9,"#9AA5B1",{st:false});
  for(var k=0;k<4;k++){var x0=x+k*8;s+=poly([P(x0,y,Z+h),P(x0+8,y,Z+h),P(x0+8,y,Z+h+6),P(x0,y,Z+h)],"#7F8C99")+poly([P(x0,y,Z+h),P(x0+8,y,Z+h+6),P(x0+8,y+dd,Z+h+6),P(x0,y+dd,Z+h)],"#A9B4BF")+poly([P(x0+8,y,Z+h),P(x0+8,y+dd,Z+h),P(x0+8,y+dd,Z+h+6),P(x0+8,y,Z+h+6)],GLASS)}
  s+=box(x+22,y+dd,Z,10,3,1.4,"#B9C2CC",{noGlint:true});
  var fk=I.shadowBox(10,8,Z,8,5,8)+box(10,8,Z,6,5,4,"#F2B544",{right:"#C99227"})+box(10.6,8.6,Z+4,3,3.8,4,"#F2B544",{noTop:true,noGlint:true}).replace(/fill="#F2B544"/g,'fill="#F2B544" fill-opacity=".25"')+box(10,8.4,Z+8,3.6,4.2,.5,"#3A4452",{noGlint:true});
  fk+=line([P(16,9,Z),P(16,9,Z+7)],"#3A4452",.6)+line([P(16,13,Z),P(16,13,Z+7)],"#3A4452",.6)+box(16,8.6,Z+.6,5,4,.5,"#3A4452",{noGlint:true})+box(16.6,9,Z+1.1,4,3.4,3,"#C99A5B",{noGlint:true});
  [11.4,14.6].forEach(function(u){fk+=H.discX(u,13,Z+1,1.1,"#2A3340",{hub:"#8A97A0"})});
  return piece(g,[["planta",[x,y,x+w,y+dd+3],s],["montacargas",[10,8,21,13],fk],tree(24,-14,d),bush(-32,18,d)])};
 Object.keys(F).forEach(function(id){ART.addV3(id,F[id])});
})(ISO,ENV,ART.H);
