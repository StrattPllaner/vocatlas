/* ================= carreras: estructura y emblema =================
   Coordenadas locales: plataforma redonda centrada en (0,0), radio 46, cara de arriba en z=7.
   Cada carrera tiene dos versiones: s (estructura: el edificio donde se ejerce) y e (emblema: su objeto a escala gigante).
   d = detalle: 2 completo, 1 a 96 px, 0 a 64 px (misma silueta, menos detalle). Se dibuja de atrás hacia adelante. */
var ART=(function(I,E){
 var P=I.P,box=I.box,quad=I.quad,win=I.win,cyl=I.cyl,poly=I.poly,line=I.line,T=I.T,f1=I.f1,sm=I.smooth,shaded=I.shaded;
 var GLASS="#4FA8E0",FRAME="#E8EEF2",WALL="#F7F2E8",RED="#E2434B",Z=7;
 function at(x,y,z,s){var p=P(x,y,z==null?Z:z);return '<g transform="translate('+f1(p[0])+' '+f1(p[1])+')">'+s+'</g>'}
 function deco(k,x,y,o){return at(x,y,Z,E.one(k,o||{}))}
 /* parte de deco con su huella (radio aproximado en el suelo) */
 var DR={bush:7,flowers:4.5,treeRound:7,treePine:6,palm:5,lamp:2.4,bench:7,rock:5,signpost:2,crate:3,cone:3};
 function dp(k,x,y,o){o=o||{};var r=(DR[k]||4)*(o.k||1);return [k,[x-r,y-r,x+r,y+r],deco(k,x,y,o)]}
 /* ensambla: suelo primero; luego las partes ordenadas por profundidad isométrica
    (una parte va antes que otra si queda detrás en x o en y) */
 var REC=null;
 function behind(a,b){return a[1][2]<=b[1][0]+.01||a[1][3]<=b[1][1]+.01}
 function piece(ground,parts){
  parts=parts.filter(function(p){return p&&p[2]});
  var n=parts.length,inD=new Array(n).fill(0),adj=[];for(var i=0;i<n;i++)adj.push([]);
  for(i=0;i<n;i++)for(var j=0;j<n;j++)if(i!==j&&behind(parts[i],parts[j])&&!behind(parts[j],parts[i])){adj[i].push(j);inD[j]++}
  var out=[],used=[],key=function(k){var f=parts[k][1];return f[0]+f[1]+f[2]+f[3]};
  while(out.length<n){var c=-1;for(i=0;i<n;i++)if(!used[i]&&inD[i]===0&&(c<0||key(i)<key(c)))c=i;
   if(c<0){for(i=0;i<n;i++)if(!used[i]&&(c<0||key(i)<key(c)))c=i}
   used[c]=1;out.push(c);adj[c].forEach(function(j){inD[j]--})}
  if(REC)REC.push(parts.map(function(p){return {n:p[0],fp:p[1]}}));
  return ground+out.map(function(k){return parts[k][2]}).join("");
 }
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
  var g=plat("#8FD06A");
  if(d>0)g+=I.walk(-7,44,-7,30,8,"#F1E6CF");
  var x=-16,y=-16,w=26,dd=22,h=46,s="";
  s+=I.shadowBox(x,y,Z,w,dd,h);
  s+=box(x,y,Z,w,dd,h,WALL,{left:"#F2ECE0",right:"#D9D3CC",top:"#FFFDF8"});
  var L=I.faceL(x,y,Z,w,dd),R=I.faceR(x,y,Z,w,dd),r,c;
  if(d>0){for(r=0;r<3;r++)for(c=0;c<3;c++)s+=win(L,3+c*8,12+r*10,5,6,GLASS,FRAME,r===2&&c===0);for(r=0;r<4;r++)for(c=0;c<2;c++)s+=win(R,4+c*9,6+r*9.5,5,5.5,GLASS,FRAME)}
  else{for(r=0;r<2;r++){s+=quad(L,3,14+r*14,20,6,GLASS,{st:false});s+=quad(R,3,10+r*14,16,6,I.shade(GLASS,.15),{st:false})}}
  s+=quad(L,0,h-5,w,2.2,RED,{st:false})+quad(R,0,h-5,dd,2.2,I.shade(RED,.25),{st:false});
  var Tp=I.faceTop(x,y,Z+h);
  s+=quad(Tp,6,4,14,14,"#FFFFFF",{st:"#E9E4DA",sw:1.2})+quad(Tp,11.2,5.8,3.6,10.4,RED,{st:false})+quad(Tp,7.8,9.2,10.4,3.6,RED,{st:false});
  var main=s;s="";
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
  s+=line([Ht(1.5,1),Ht(1.5,7)],"#FFFFFF",1.8,{cap:"butt"})+line([Ht(6.5,1),Ht(6.5,7)],"#FFFFFF",1.8,{cap:"butt"})+line([Ht(1.5,4),Ht(6.5,4)],"#FFFFFF",1.8,{cap:"butt"});
  var wingR=s;s="";
  var lx=-14,ly=6,lw=14,ld=24,lh=22;
  s+=box(lx,ly,Z,lw,ld,lh,WALL,{left:"#F2ECE0",right:"#D9D3CC",top:"#FFFDF8"});
  var L3=I.faceL(lx,ly,Z,lw,ld),R3=I.faceR(lx,ly,Z,lw,ld);
  s+=arch(L3,3,0,8,11);
  s+=box(lx+1,ly+ld,Z+12,10,5,2,RED,{right:I.shade(RED,.3),top:I.tint(RED,.25)});
  if(d>0)for(c=0;c<3;c++)s+=win(R3,2.5+c*7,8,4.4,6,GLASS,FRAME);else s+=quad(R3,2.5,8,18,6,I.shade(GLASS,.15),{st:false});
  s+=quad(R3,0,lh-4,ld,1.8,I.shade(RED,.25),{st:false});
  return piece(g,[["cuerpo central",[x,y,x+w,y+dd],main],["ala derecha",[wx,wy,wx+ww,wy+wd],wingR],["ala izquierda",[lx,ly,lx+lw,ly+ld+5],s],
   ["ambulancia",[18,18,34,26],ambulance(18,18,d)],
   d>0?dp("bush",-32,15,{k:.55,d:d}):null,d>0?dp("flowers",-29,26,{k:.8,d:d}):null,d>1?dp("bush",32,-26,{k:.5,d:d,ph:2}):null]);
 }
 /* emblema: botiquín gigante; el estetoscopio descansa sobre la tapa, baja por el frente y la campana queda en el piso */
 function medicina_e(d){
  var g=plat("#8FD06A"),s="";
  var x=-20,y=-16,w=34,dd=26,h=22,Zt=Z+h,TUBE="#38424F",TL="#6B7684";
  s+=I.shadowBox(x,y,Z,w,dd,h+6);
  s+=box(x,y,Z,w,dd,h,"#FFFFFF",{left:"#F4F1EC",right:"#D7DCE3",top:"#FFFFFF"});
  var L=I.faceL(x,y,Z,w,dd),R=I.faceR(x,y,Z,w,dd),Tp=I.faceTop(x,y,Zt);
  s+=quad(L,0,h-5.2,w,1.2,"#C9CFD8",{st:false})+quad(R,0,h-5.2,dd,1.2,"#B3BAC4",{st:false});
  s+=quad(L,w/2-3,3.6,6,12,RED,{st:false})+quad(L,w/2-8,6.6,16,6,RED,{st:false});
  s+=quad(Tp,w/2-3,dd/2-8,6,16,RED,{st:false})+quad(Tp,w/2-8,dd/2-3,16,6,RED,{st:false});
  if(d>0){s+=quad(R,dd/2-2,5,4,9,I.shade(RED,.25),{st:false})+quad(R,dd/2-5.5,7.6,11,3.6,I.shade(RED,.25),{st:false});
   s+=quad(L,4,h-6.6,3,2.6,"#9AA3AE",{st:false})+quad(L,w-7,h-6.6,3,2.6,"#9AA3AE",{st:false})}
  /* asa: sale de dos soportes sobre la tapa */
  [[w/2-7],[w/2+7]].forEach(function(q){s+=box(x+q[0]-1,y+dd/2-1,Zt,2,2,1.2,"#5B6573",{noGlint:true})});
  var a1=P(x+w/2-7,y+dd/2,Zt+1.2),a2=P(x+w/2+7,y+dd/2,Zt+1.2);
  s+='<path d="M'+f1(a1[0])+' '+f1(a1[1])+'C'+f1(a1[0])+' '+f1(a1[1]-9)+' '+f1(a2[0])+' '+f1(a2[1]-9)+' '+f1(a2[0])+' '+f1(a2[1])+'" stroke="#5B6573" stroke-width="3.2" fill="none" stroke-linecap="butt"/><path d="M'+f1(a1[0]+1)+' '+f1(a1[1]-3.4)+'C'+f1(a1[0]+1.6)+' '+f1(a1[1]-7.6)+' '+f1(a2[0]-3.6)+' '+f1(a2[1]-8.4)+' '+f1(a2[0]-1.4)+' '+f1(a2[1]-5)+'" stroke="#8C96A3" stroke-width=".9" fill="none" stroke-linecap="round"/>';
  /* estetoscopio acostado sobre la tapa, en el borde derecho: olivas atrás, tubo hacia el frente y baja por la cara izquierda */
  var tube=[P(x+w-5,y+7,Zt),P(x+w-4,y+14,Zt),P(x+w-6,y+21,Zt),P(x+w-5,y+dd,Zt)];
  s+='<path d="'+sm(tube.map(function(p){return [p[0]+.8,p[1]+.9]}),false)+'" stroke="#13213F" stroke-width="2.4" fill="none" opacity=".14" stroke-linecap="round"/>';
  s+='<g transform="'+I.planeG(x+w-10,y+1,Zt)+'"><path d="M5 6L1.6 1.4M5 6L8.6 1" stroke="#B9C2CC" stroke-width="1.5" fill="none" stroke-linecap="round"/><circle cx="1.4" cy="1.2" r="1.4" fill="'+TUBE+'"/><circle cx="8.8" cy=".8" r="1.4" fill="'+TUBE+'"/></g>';
  s+='<path d="'+sm(tube,false)+'" stroke="'+TUBE+'" stroke-width="2.6" fill="none" stroke-linecap="round"/><path d="'+sm(tube.map(function(p){return [p[0]-.3,p[1]-.8]}),false)+'" stroke="'+TL+'" stroke-width=".8" fill="none" stroke-linecap="round"/>';
  var down=[P(x+w-5,y+dd,Zt),P(x+w-4.4,y+dd,Zt-8),P(x+w-5,y+dd,Z+1.4)];
  s+='<path d="M'+down.map(function(p){return f1(p[0])+" "+f1(p[1])}).join("L")+'" stroke="'+TUBE+'" stroke-width="2.6" fill="none" stroke-linejoin="round"/>';
  var kit=s;s="";
  /* en el piso: el tubo sigue y termina en la campana con su sombra */
  var gt=[P(x+w-5,y+dd,Z+1.3),P(x+w-5,y+dd+5,Z+1.3),P(x+w-4,y+dd+9,Z+1.3)];
  s+='<path d="'+sm(gt.map(function(p){return [p[0]+.8,p[1]+1]}),false)+'" stroke="#13213F" stroke-width="2.4" fill="none" opacity=".16" stroke-linecap="round"/>';
  s+='<path d="'+sm(gt,false)+'" stroke="'+TUBE+'" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
  s+=I.contact(4,{x:P(x+w-4,y+dd+12,Z)[0],y:P(x+w-4,y+dd+12,Z)[1]});
  s+=I.cyl(x+w-4,y+dd+12,Z,3.4,1.8,"#C9D1DA",{top:"#E8EDF2",sideS:"#9AA5B1",noGlint:true})+I.ell(x+w-4,y+dd+12,Z+1.9,2.1,"#9AA5B1");
  var bell=s;
  return piece(g,[["botiquín",[x,y,x+w,y+dd],kit],["campana",[x+w-12,y+dd,x+w,y+dd+16],bell],
   d>0?["frasco",[20.5,-27.5,27.5,-20.5],I.contact(3)+I.cyl(24,-24,Z,3.2,7,"#F28C38",{noGlint:d<2})+I.cyl(24,-24,Z+7,3.4,2.2,"#FFFFFF",{noGlint:true})]:null,
   d>0?dp("bush",-33,20,{k:.55,d:d}):null,d>1?dp("flowers",-24,32,{k:.8,d:d}):null]);
 }

 /* ================= DERECHO ================= */
 /* estatua de la justicia: figura de una pieza sobre pedestal de dos escalones; brazo izquierdo en alto con la balanza */
 var JF="M-4.6 0C-4.2 -4 -3.2 -7.2 -2.8 -10C-3 -12 -3.3 -13.6 -3.2 -14.8C-3.6 -15.4 -4.2 -16.4 -4.6 -17.6L-6.1 -22.6C-6.4 -23.6 -7.6 -23.8 -7.8 -22.8C-7.8 -22.4 -7.7 -22.1 -7.6 -21.8L-6.1 -16.8C-5.6 -15.4 -5 -14.6 -4.2 -14.4L-1.1 -15.4C-1.2 -15.9 -1.2 -16.3 -1.1 -16.6C-2.2 -17.2 -2.6 -18.2 -2.4 -19.2C-2.2 -20.6 -1 -21.2 0 -21.2C1.2 -21.2 2.4 -20.4 2.4 -18.9C2.4 -17.9 1.9 -17 1.1 -16.6C1.2 -16.2 1.2 -15.8 1.1 -15.4L3.2 -14.8C3.6 -13.4 3.4 -11.6 3 -10C3.4 -7.2 4.4 -4 4.6 0Z";
 function justice(x,y,k,d){var s="",B=T("#C79140"),St=T("#E3D9C4");
  s+=I.shadowEll(x,y,Z,5.4*k);
  s+=box(x-4.4*k,y-4.4*k,Z,8.8*k,8.8*k,2.2*k,St.b,{left:St.b,right:St.s,top:St.l});
  s+=box(x-3.2*k,y-3.2*k,Z+2.2*k,6.4*k,6.4*k,5*k,St.b,{left:St.b,right:St.s,top:St.l});
  var b=P(x,y,Z+7.2*k),u=k*1.1,tr='translate('+f1(b[0])+' '+f1(b[1])+') scale('+f1(u)+')';
  var inner='<path d="M.4 1L.6 -15L6 -15L6 1Z" fill="'+B.s+'"/>';
  if(d>0)inner+='<path d="M-2 -.4L-1.6 -9.6M-.4 -.4L-.3 -10.4M1.4 -.4L1.2 -9.6" stroke="'+B.d+'" stroke-width=".42" opacity=".6"/><path d="M-2.4 -19.4L2.4 -19.4L2.4 -18.4L-2.4 -18.4Z" fill="#F4F0E6"/>';
  inner+='<path d="M-1.6 -20.6Q-.6 -21.2 .6 -20.8" stroke="'+B.h+'" stroke-width=".5" fill="none"/><path d="M-7.4 -22.4L-6 -17.4" stroke="'+B.h+'" stroke-width=".45" opacity=".8"/>';
  var fig=shaded(JF,B.b,inner);
  /* balanza colgando de la mano levantada */
  var hx=-7,hy=-23.2;
  fig+='<path d="M'+(hx-5)+' '+(hy-.2)+'L'+(hx+5)+' '+(hy+.2)+'" stroke="'+B.s+'" stroke-width=".8" stroke-linecap="round"/>';
  [[hx-5,hy-.2],[hx+5,hy+.2]].forEach(function(p){fig+='<path d="M'+p[0]+' '+p[1]+'L'+(p[0]-1.7)+' '+(p[1]+4.2)+'M'+p[0]+' '+p[1]+'L'+(p[0]+1.7)+' '+(p[1]+4.2)+'" stroke="'+B.s+'" stroke-width=".35"/><path d="M'+(p[0]-2.6)+' '+(p[1]+4.2)+'Q'+p[0]+' '+(p[1]+6.8)+' '+(p[0]+2.6)+' '+(p[1]+4.2)+'Z" fill="'+B.b+'"/><path d="M'+(p[0]+.4)+' '+(p[1]+4.3)+'Q'+(p[0]+1.8)+' '+(p[1]+5.6)+' '+(p[0]+2.6)+' '+(p[1]+4.2)+'Z" fill="'+B.s+'"/>'});
  /* espada en la mano derecha, bajada */
  fig+='<path d="M3.6 -8.4L5.6 -.8" stroke="#DCE2E8" stroke-width=".9" stroke-linecap="round"/><path d="M2.6 -8.8L4.6 -9.4" stroke="'+B.s+'" stroke-width=".8" stroke-linecap="round"/>';
  s+='<g transform="'+tr+'">'+fig+'</g>';
  return s}
 function derecho_s(d){
  var g=plat("#9FD67E","#A98F67"),STONE="#EDE5D3",s="";
  g+=I.ell(4,0,Z+.2,36,"#EEE6D4");
  var x=-26,y=-24,w=26,dd=30;
  s+=I.shadowBox(x,y,Z,w+18,dd,36);
  s+=box(x,y,Z,w,dd,28,STONE,{left:"#E4DAC5",right:"#CFC3AA",top:"#F6F0E2"});
  var L=I.faceL(x,y,Z,w,dd);
  if(d>0)for(var c=0;c<3;c++)s+=win(L,3.4+c*8,8,4.6,11,"#5D7FA3","#D9CDB3");else s+=quad(L,3,8,20,11,"#5D7FA3",{st:false});
  var n=d>0?6:4,sx=x+w,stepW=2.2,stepH=1.5;
  for(var i=0;i<n;i++){var z=Z+i*stepH;s+=box(sx,y-2,z,(n-i)*stepW+1.6,dd+4,stepH,"#F1EADB",{left:"#E2D7C2",right:"#BDAF92",top:"#FBF7EE",noGlint:true});
   if(d>0){var Rs=I.faceR(sx,y-2,z,(n-i)*stepW+1.6,dd+4);s+=line([Rs(0,stepH),Rs(dd+4,stepH)],"#FFFFFF",.5,{cap:"butt",op:.9})}}
  var cz=Z+n*stepH,cx0=sx+3.4,colH=22;
  for(c=0;c<5;c++)s+=I.cyl(cx0,y+2.6+c*6.2,cz,1.9,colH,"#F6F0E2",{sideS:"#D3C7AE",noGlint:true});
  var ez=cz+colH;
  s+=box(x+w-1,y-3,ez,10,dd+6,3.4,STONE,{left:"#E4DAC5",right:"#D6CAB1",top:"#F6F0E2"});
  /* techo de dos aguas con alero y frontón */
  var fx=x+w+9,rz=ez+3.4,th=1.6,RF=T("#C9604F");
  var a=P(x-1,y-3,rz-2),b=P(fx,y-3,rz),r1=P(x-1,y+dd/2,rz+8),r2=P(fx,y+dd/2,rz+10),cc=P(fx,y+dd+3,rz),ddp=P(x-1,y+dd+3,rz-2);
  s+=poly([a,b,r2,r1],RF.s)+poly([r1,r2,cc,ddp],RF.b);
  s+=poly([ddp,cc,[cc[0],cc[1]+th],[ddp[0],ddp[1]+th]],RF.d,{st:false});
  s+=line([[r1[0]+.6,r1[1]+.3],[r2[0]-.8,r2[1]+.3]],RF.h,1.1,{cap:"butt",op:.9});
  s+=poly([b,cc,r2],"#E4D8BF");
  s+=poly([[r2[0],r2[1]],[cc[0],cc[1]],[cc[0],cc[1]+th],[r2[0],r2[1]+th]],RF.d,{st:false})+poly([[r2[0],r2[1]],[b[0],b[1]],[b[0],b[1]+th],[r2[0],r2[1]+th]],RF.s,{st:false});
  if(d>0){s+=poly([P(fx,y+2,rz+1.4),P(fx,y+dd-2,rz+1.4),P(fx,y+dd/2,rz+8)],"#CDBFA2",{st:false});var e=P(fx,y+dd/2,rz+4.4);s+='<circle cx="'+f1(e[0])+'" cy="'+f1(e[1])+'" r="2" fill="#C99A2E"/>'}
  return piece(g,[["juzgado",[x,y-3,fx,y+dd+3],s],["estatua",[-14,20,-4,30],justice(-9,25,1,d)],
   d>0?dp("bush",-35,6,{k:.5,d:d}):null,d>0?dp("lamp",22,28,{d:d}):null,d>1?dp("flowers",-22,33,{k:.8,d:d}):null]);
 }
 /* emblema: balanza gigante; libro de leyes y mazo grandes al frente, sin tocarla */
 function derecho_e(d){
  var g=plat("#9FD67E","#A98F67"),G=T("#D9A441"),Dk=T("#6A4430"),s="";
  g+=I.ell(-4,-8,Z+.2,24,"#EEE6D4");
  s+=I.cyl(-4,-8,Z,11,3,"#E8DFCC",{sideS:"#C9BBA0"})+I.cyl(-4,-8,Z+3,7.4,2.6,"#F1EADB",{sideS:"#D3C7AE"});
  var cz=Z+5.6;s+=I.cyl(-4,-8,cz,2,40,G.b,{sideS:G.s,noGlint:true})+I.ell(-4,-8,cz+40,2.6,G.l);
  var bz=cz+38,b1=P(-5,-28,bz),b2=P(-5,12,bz),top=P(-4,-8,cz+44);
  s+='<path d="M'+f1(b1[0])+' '+f1(b1[1])+'L'+f1(b2[0])+' '+f1(b2[1])+'" stroke="'+G.s+'" stroke-width="3" stroke-linecap="round"/><path d="M'+f1(b1[0]+.4)+' '+f1(b1[1]-.9)+'L'+f1(b2[0]-.4)+' '+f1(b2[1]-.9)+'" stroke="'+G.l+'" stroke-width=".9" stroke-linecap="butt"/>';
  s+=I.dome(-4,-8,cz+41,3,"#D9A441")+'<circle cx="'+f1(top[0])+'" cy="'+f1(top[1]-3)+'" r="1.4" fill="'+G.l+'"/>';
  [[-28,1],[12,-1]].forEach(function(q){var py=q[0],hz=bz-16-q[1]*2,a=P(-5,py,bz),c=I.cylD(-5,py,hz,8);
   s+='<path d="M'+f1(a[0])+' '+f1(a[1])+'L'+f1(c.cx-c.rx*.8)+' '+f1(c.cy)+'M'+f1(a[0])+' '+f1(a[1])+'L'+f1(c.cx+c.rx*.8)+' '+f1(c.cy)+'M'+f1(a[0])+' '+f1(a[1])+'L'+f1(c.cx)+' '+f1(c.cy+c.ry*.8)+'" stroke="'+G.s+'" stroke-width=".8"'+(d>0?' stroke-dasharray="1.6 .8"':'')+'/>';
   s+='<path d="M'+f1(c.cx-c.rx)+' '+f1(c.cy)+'A'+f1(c.rx)+' '+f1(c.ry)+' 0 0 0 '+f1(c.cx+c.rx)+' '+f1(c.cy)+'Q'+f1(c.cx)+' '+f1(c.cy+c.ry*3.4)+' '+f1(c.cx-c.rx)+' '+f1(c.cy)+'Z" fill="'+G.s+'"/><ellipse cx="'+f1(c.cx)+'" cy="'+f1(c.cy)+'" rx="'+f1(c.rx)+'" ry="'+f1(c.ry)+'" fill="'+G.l+'"/>'});
  var bal=s;
  /* libro de leyes grande, acostado */
  var bk=I.shadowBox(10,10,Z,22,16,6);
  bk+=box(10,10,Z,22,16,5.6,"#8E2F2B",{top:"#A63B35",right:"#6E2421",noGlint:true});
  bk+=box(10.8,10.6,Z+.6,21.2,15.4,4.4,"#F6F0E2",{noTop:true,left:"#EFE6D2",right:"#DCCFB4",noGlint:true});
  bk+=box(10,10,Z+5.6,22,16,.01,"#A63B35",{left:"#A63B35",right:"#6E2421",top:"#A63B35",noGlint:true});
  var Tb=I.faceTop(10,10,Z+5.62);bk+=quad(Tb,4,5,14,1.8,"#E8B33A",{st:false})+(d>0?quad(Tb,4,8.6,10,1.2,"#E8B33A",{st:false})+quad(Tb,1,0,1.6,16,"#7A2622",{st:false}):"");
  if(d>0){var Lb=I.faceL(10.8,10.6,Z+.6,21.2,15.4);for(var k=1;k<4;k++)bk+=line([Lb(1,k*1.1),Lb(20.2,k*1.1)],"#D9CBAE",.4,{cap:"butt"})}
  /* mazo grande sobre su base */
  var gv=I.contact(7,{x:P(-24,20,Z)[0],y:P(-24,20,Z)[1]})+I.cyl(-24,20,Z,7.4,2.4,Dk.b,{top:Dk.l,sideS:Dk.s});
  var mh=P(-30,30,Z+.6),m2=P(-19,19,Z+5.4);
  gv+='<path d="M'+f1(mh[0]+.6)+' '+f1(mh[1]+1)+'L'+f1(m2[0]+.6)+' '+f1(m2[1]+1)+'" stroke="#13213F" stroke-width="2.4" opacity=".16" stroke-linecap="round"/>';
  gv+='<path d="M'+f1(mh[0])+' '+f1(mh[1])+'L'+f1(m2[0])+' '+f1(m2[1])+'" stroke="'+Dk.b+'" stroke-width="2.6" stroke-linecap="round"/><path d="M'+f1(mh[0])+' '+f1(mh[1]-.8)+'L'+f1(m2[0])+' '+f1(m2[1]-.8)+'" stroke="'+Dk.l+'" stroke-width=".8" stroke-linecap="butt"/>';
  gv+=I.cyl(-17,13,Z+2.4,3.8,.01,Dk.b,{top:Dk.b,noGlint:true});
  gv+='<g transform="'+I.planeY(-17,9,Z+2.4+3.8)+'"><rect x="0" y="-3.8" width="14" height="7.6" rx="3.6" fill="'+Dk.b+'"/><rect x="0" y="-3.8" width="14" height="2.8" rx="1.4" fill="'+Dk.l+'"/><rect x="2.4" y="-3.9" width="1.8" height="7.8" fill="#C99A2E"/><rect x="9.6" y="-3.9" width="1.8" height="7.8" fill="#C99A2E"/></g>';
  return piece(g,[["balanza",[-15,-19,7,3],bal],["libro",[10,10,32,26],bk],["mazo",[-31.4,9,-10,30],gv],d>1?dp("bush",30,-24,{k:.5,d:d}):null]);
 }

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
  var s=I.contact(4,{x:P(x+3.5,y+4,Z)[0],y:P(x+3.5,y+4,Z)[1]})+I.shadowBox(x,y,Z,7,8,h);
  s+=box(x,y,Z,7,8,h,"#3A4656",{left:"#404D5E",right:"#2C3644",top:"#56657A"});
  var L=I.faceL(x,y,Z,7,8),n=0,cols=["#57F2A0","#57F2A0","#FFC857","#57F2A0","#4FA8E0","#FF6B7A"];
  for(var k=3;k<h-2;k+=d>0?4.2:7){s+=quad(L,1,k,5,2.6,"#2A3340",{st:false});
   /* luz con volumen: piloto con su brillo, metido en el panel */
   var p=L(5.1,k+1.3);s+='<circle cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r="1.05" fill="#1B222C"/><circle class="iso-led" style="--dl:'+((n*.37)%1.6).toFixed(2)+'s" cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r=".75" fill="'+cols[n%cols.length]+'"/><circle cx="'+f1(p[0]-.25)+'" cy="'+f1(p[1]-.3)+'" r=".25" fill="#FFFFFF" opacity=".8"/>';n++}
  return s}
 function computacion_s(d){
  var g=plat("#7FD3C8","#4E8F97"),s="";
  if(d>0)for(var gg=-36;gg<=36;gg+=12){var q=Math.sqrt(1600-gg*gg)*.95;g+=line([P(gg,-q,Z+.2),P(gg,q,Z+.2)],"#A8E6DD",.8,{op:.8})+line([P(-q,gg,Z+.2),P(q,gg,Z+.2)],"#A8E6DD",.8,{op:.8})}
  var x=-22,y=-18,w=36,dd=22,h=44;
  s+=I.shadowBox(x,y,Z,w,dd,h);
  s+=box(x,y,Z,w,dd,h,"#E6ECF0",{left:"#DDE5EA",right:"#B9C6D0",top:"#F2F6F8"});
  var L=I.faceL(x,y,Z,w,dd),R=I.faceR(x,y,Z,w,dd);
  s+=quad(L,1.4,9,w-2.8,h-12,"#2A3A4A",{st:false})+codeScreen(L,2.6,10.2,w-5.2,h-14.4,d);
  s+=quad(L,w/2-4,0,8,7,"#4FA8E0",{st:false})+line([L(w/2,0),L(w/2,7)],"#E6ECF0",.9,{cap:"butt"});
  if(d>0)for(var r=0;r<4;r++){s+=win(R,3,6+r*9,6,5,"#5BB4E8","#E6ECF0");s+=win(R,12,6+r*9,6,5,"#5BB4E8","#E6ECF0")}
  else s+=quad(R,3,8,15,28,"#5BB4E8",{st:false});
  if(d>0){var a=P(x+6,y+5,Z+h),a2=P(x+6,y+5,Z+h+9);s+=I.cyl(x+6,y+5,Z+h,1.2,.8,"#56657A",{noGlint:true})+'<path d="M'+f1(a[0])+' '+f1(a[1]-.8)+'L'+f1(a2[0])+' '+f1(a2[1])+'" stroke="#56657A" stroke-width="1.1"/><circle class="iso-led" cx="'+f1(a2[0])+'" cy="'+f1(a2[1])+'" r="1.3" fill="#FF6B7A"/>'}
  var cab=d>0?line([P(14.5,-8,Z+.4),P(20,-6,Z+.4)],"#2E3A46",1.3)+line([P(14.5,-12,Z+.4),P(20,-12,Z+.4)],"#E2434B",1.1):"";
  return piece(g,[["oficinas",[x,y,x+w,y+dd],s],["servidor 1",[20,-17,27,-9],cab+serverRack(20,-17,26,d)],["servidor 2",[22,-4,29,4],serverRack(22,-4,20,d)],
   d>1?dp("bush",-31,22,{k:.5,d:d}):null,d>1?dp("lamp",4,32,{d:d}):null]);
 }
 /* emblema: computadora de escritorio; la torre queda a la derecha con aire, sin encimarse con el monitor */
 function computacion_e(d){
  var g=plat("#7FD3C8","#4E8F97");
  var x=-26,y=-14,w=36,dd=5,z=Z+12,h=28,mon="";
  mon+=box(-12,-17,Z,14,10,1.6,"#3F4C5A",{top:"#5A6878"})+box(-8,-14,Z+1.6,6,4,10.4,"#4E5C6C");
  mon+=I.shadowBox(x,y,Z,w,dd,h+12);
  mon+=box(x,y,z,w,dd,h,"#2F3A47",{left:"#34404E",right:"#26303B",top:"#4A5767"});
  var L=I.faceL(x,y,z,w,dd);
  mon+=codeScreen(L,2,2.4,w-4,h-4.8,d);
  var kx=-22,ky=2,kw=28,kd=10,kb=box(kx,ky,Z,kw,kd,2,"#DDE3E8",{left:"#CDD5DC",right:"#B3BEC8",top:"#EEF2F5"});
  if(d>0){var K=I.faceTop(kx,ky,Z+2.01),nc=d>1?9:5;for(var r=0;r<3;r++)for(var c=0;c<nc;c++){var cw=(kw-3)/nc;kb+=quad(K,1.5+c*cw,1.4+r*2.8,cw-.8,2,"#FFFFFF",{st:"#C9D2DA",sw:.4})}}
  var ms=d>0?I.contact(2.4,{x:P(12,8,Z)[0],y:P(12,8,Z)[1]})+at(12,8,Z,'<path d="M-2.6 0C-2.6 -2 2.6 -2 2.6 0C2.6 1.4 -2.6 1.4 -2.6 0Z" fill="#EEF2F5"/><path d="M0 -1.4V.6" stroke="#C9D2DA" stroke-width=".5"/>'):"";
  var cab=d>0?line([P(18.5,-10,Z+.4),P(14,-12,Z+.4)],"#2E3A46",1.3):"";
  return piece(g,[["monitor",[x,-17,x+w,y+dd],mon],["teclado",[kx,ky,kx+kw,ky+kd],kb],d>0?["ratón",[9,5,15,11],ms]:null,
   ["torre 1",[19,-20,26,-12],cab+serverRack(19,-20,30,d)],d>0?["torre 2",[28,-8,35,0],serverRack(28,-8,22,d)]:null,d>1?dp("bush",-33,20,{k:.5,d:d}):null]);
 }

 /* ================= CINE ================= */
 function searchlight(x,y,dir,d){var s="",M=T("#4A5562");
  s+=I.contact(3.4,{x:P(x,y,Z)[0],y:P(x,y,Z)[1]})+I.cyl(x,y,Z,3.4,2,M.b,{top:M.l,noGlint:true});
  var b=P(x,y,Z+6);
  s+='<g transform="translate('+f1(b[0])+' '+f1(b[1])+') rotate('+(dir*24)+')"><path d="M0 -6L-12 -80L12 -80Z" fill="url(#isoBeam2)" opacity=".85"/><rect x="-3.4" y="-6" width="6.8" height="9" rx="2" fill="'+M.b+'"/><rect x=".4" y="-6" width="3" height="9" rx="1.4" fill="'+M.s+'"/><ellipse cx="0" cy="-6" rx="3.4" ry="1.6" fill="#FFF3B0"/></g>';
  s+='<path d="M'+f1(b[0]-2)+' '+f1(b[1]+4)+'L'+f1(b[0])+' '+f1(b[1])+'L'+f1(b[0]+2)+' '+f1(b[1]+4)+'" stroke="'+M.s+'" stroke-width="1.2" fill="none"/>';
  return s}
 function cine_s(d){
  var g=plat("#E9DDCB","#A98F67"),s="";
  g+=poly([P(-2,10,Z+.3),P(10,10,Z+.3),P(10,44,Z+.3),P(-2,44,Z+.3)],"#C83A43",{st:false});
  var x=-24,y=-24,w=44,dd=32,h=38;
  s+=I.shadowBox(x,y,Z,w,dd,h);
  s+=box(x,y,Z,w,dd,h,"#7C4A8F",{left:"#8B57A0",right:"#5E3870",top:"#9A6BAE"});
  var L=I.faceL(x,y,Z,w,dd),R=I.faceR(x,y,Z,w,dd);
  s+=quad(L,0,h-3,w,3,"#E8B33A",{st:false})+quad(R,0,h-3,dd,3,"#C4932A",{st:false});
  if(d>0){s+=quad(L,3,8,7,11,"#F2E6C8",{st:false})+quad(L,3.6,8.6,5.8,9.8,"#3F7DA6",{st:false})+quad(L,w-10,8,7,11,"#F2E6C8",{st:false})+quad(L,w-9.4,8.6,5.8,9.8,"#E2434B",{st:false});
   s+=quad(R,4,8,8,11,"#F2E6C8",{st:false})+quad(R,4.6,8.6,6.8,9.8,"#E8B33A",{st:false})}
  s+=quad(L,w/2-5,0,10,9,"#2B1E33",{st:false})+line([L(w/2,0),L(w/2,9)],"#E8B33A",.8,{cap:"butt"});
  var mx=x+6,mw=28;
  s+=box(mx,y+dd,Z+10.6,mw,7,2,"#3A2142",{top:"#4B2D55",right:"#2B1833",noGlint:true});
  s+=box(mx+2,y+dd+4.4,Z+12.6,mw-4,1.4,8,"#FFF4D6",{left:"#FFF4D6",right:"#E8D7A8",top:"#FFFFFF"});
  var M=I.faceL(mx+2,y+dd+4.4,Z+12.6,mw-4,1.4);
  if(d>0){for(var u=1.2;u<mw-4.4;u+=2.2){[[u,.8],[u,7.2]].forEach(function(q){var p=M(q[0],q[1]);s+='<circle cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r=".85" fill="#C98E1E"/><circle class="iso-bulb" cx="'+f1(p[0]-.1)+'" cy="'+f1(p[1]-.15)+'" r=".6" fill="#FFD66B"/>'})}
   s+='<g transform="'+I.planeX(mx+2+5,y+dd+5.8,Z+12.6+5.8)+'"><text x="0" y="0" font-size="5.2" font-weight="900" fill="#B0303A" letter-spacing=".6">CINE</text></g>'}
  else s+=quad(M,3,2.4,mw-10,3.2,"#B0303A",{st:false});
  s+=box(x+w/2-1.5,y+dd/2-1,Z+h,3,2,1.6,"#2E2A33",{noGlint:true});
  s+=discX(x+w/2,y+dd/2,Z+h+8,8,"#2E2A33",{hub:"#8C8494"});
  if(d>0)[0,1,2,3,4,5].forEach(function(i){var a=i/6*Math.PI*2;s+='<g transform="'+I.planeX(x+w/2,y+dd/2,Z+h+8)+'"><circle cx="'+f1(Math.cos(a)*5)+'" cy="'+f1(Math.sin(a)*5)+'" r="1.5" fill="#8C8494"/></g>'});
  return piece(g,[["cine",[x,y,x+w,y+dd+7],s],["reflector",[23,7,29,13],searchlight(26,10,1,d)],d>1?["reflector 2",[-33,-21,-27,-15],searchlight(-30,-18,-1,d)]:null,d>0?dp("lamp",-30,30,{d:d}):null]);
 }
 /* emblema: cámara clásica en trípode con dos rollos, claqueta con grosor y reflector en su pie */
 function cine_e(d){
  var g=plat("#E9DDCB","#A98F67"),K=T("#2E3138"),c0="";
  var o0=P(-2,-4,Z),hub=P(-2,-4,Z+22);
  [[-14,-10],[10,-14],[0,12]].forEach(function(q){var f=P(q[0],q[1],Z);c0+=I.contact(1.3,{x:f[0],y:f[1]})+'<path d="M'+f1(hub[0])+' '+f1(hub[1])+'L'+f1(f[0])+' '+f1(f[1])+'" stroke="'+K.b+'" stroke-width="1.8" stroke-linecap="round"/>'});
  c0+=I.cyl(-2,-4,Z+20.6,2,1.6,"#4B505A",{noGlint:true});
  var x=-12,y=-10,w=20,dd=12,z=Z+22,h=13;
  c0+=box(x,y,z,w,dd,h,K.b,{left:"#3A3E46",right:"#25282E",top:"#4B505A"});
  if(d>0){var L=I.faceL(x,y,z,w,dd);c0+=quad(L,2,2,6,4,"#C8A24A",{st:false})+discX(x+14,y+dd,z+6,2.4,"#4B505A",{hub:"#25282E"})}
  c0+=box(x+w,y+3,z+3,7,6,6,"#3A3E46",{noGlint:true});
  c0+='<g transform="'+I.planeY(x+w+7.05,y+6,z+6)+'"><circle r="3.6" fill="#25282E"/><circle r="2.4" fill="#4FA8E0"/><circle cx="-.8" cy="-.8" r=".8" fill="#FFFFFF" opacity=".8"/></g>';
  /* rollos con su eje sobre el cuerpo */
  [[x+5,9],[x+15,8]].forEach(function(q){c0+=box(q[0]-1,y+dd/2-1,z+h,2,2,1.4,"#25282E",{noGlint:true})+discX(q[0],y+dd/2,z+h+q[1],q[1]-.5,"#2E3138",{hub:"#8C8494"});if(d>0)for(var i=0;i<5;i++){var a=i/5*Math.PI*2;c0+='<g transform="'+I.planeX(q[0],y+dd/2,z+h+q[1])+'"><circle cx="'+f1(Math.cos(a)*(q[1]*.55))+'" cy="'+f1(Math.sin(a)*(q[1]*.55))+'" r="'+f1(q[1]*.16)+'" fill="#8C8494"/></g>'}});
  if(d>0){var r1=P(x+5,y+dd/2,z+h+9),r2=P(x+15,y+dd/2,z+h+8);c0+='<path d="M'+f1(r1[0])+' '+f1(r1[1]+8)+'Q'+f1((r1[0]+r2[0])/2)+' '+f1(r1[1]+16)+' '+f1(r2[0])+' '+f1(r2[1]+7)+'" stroke="#1C1E22" stroke-width="1.4" fill="none"/>'}
  var cam='<g transform="translate('+f1(o0[0])+' '+f1(o0[1])+') scale(1.5) translate('+f1(-o0[0])+' '+f1(-o0[1])+')">'+c0+'</g>';
  /* claqueta con grosor: tabla y barra de rayas en su plano */
  var cx=-38,cy=16,cl=I.shadowBox(cx,cy,Z,14,2.4,11);
  cl+=box(cx,cy,Z,14,2.4,10,"#2E3138",{left:"#33373F",right:"#1F2228",top:"#454A54",noGlint:true});
  var Fc=I.faceL(cx,cy,Z,14,2.4);
  if(d>0)cl+=quad(Fc,1.4,3.6,11.2,.9,"#C9CED6",{st:false})+quad(Fc,1.4,6,7,.9,"#C9CED6",{st:false});
  /* barra superior abierta, con grosor; rayas dentro de ella */
  var bx=I.faceL(cx,cy,Z+10,14,2.4);
  var bar=[bx(0,0),bx(14,3.2),bx(14,5.6),bx(0,2.4)];
  cl+=poly(bar,"#F4F4F4",{st:false})+poly([bar[3],bar[2],[bar[2][0]+1.2,bar[2][1]-.6],[bar[3][0]+1.2,bar[3][1]-.6]],"#D8DCE2",{st:false});
  var id=I.uid("cl");cl+=I.clipDef(id,"M"+bar.map(function(p){return f1(p[0])+" "+f1(p[1])}).join("L")+"Z")+'<g clip-path="url(#'+id+')">';
  for(var i=0;i<4;i++){cl+=poly([bx(1+i*3.4,0),bx(3+i*3.4,0),bx(5.2+i*3.4,6),bx(3.2+i*3.4,6)],"#2E3138",{st:false})}
  cl+='</g>';
  /* reflector en su pie de tres patas */
  var rf="";if(d>0){var sp=P(30,-24,Z),t=P(30,-24,Z+18);
   [[-3,0],[2.4,-2],[1,3]].forEach(function(q){var f=P(30+q[0],-24+q[1],Z);rf+=I.contact(.9,{x:f[0],y:f[1]})+'<path d="M'+f1(P(30,-24,Z+6)[0])+' '+f1(P(30,-24,Z+6)[1])+'L'+f1(f[0])+' '+f1(f[1])+'" stroke="#4A5562" stroke-width="1"/>'});
   rf+='<path d="M'+f1(sp[0])+' '+f1(sp[1]-6)+'L'+f1(t[0])+' '+f1(t[1])+'" stroke="#4A5562" stroke-width="1.4"/>';
   rf+='<g transform="translate('+f1(t[0])+' '+f1(t[1])+') rotate(-24)"><path d="M7 0L34 -9L34 11Z" fill="url(#isoBeam)" opacity=".7"/><rect x="-1" y="-4" width="8" height="8" rx="2" fill="#4A5562"/><rect x="-1" y="-4" width="3.4" height="8" rx="1.4" fill="#5E6A78"/><ellipse cx="7" cy="0" rx="1.4" ry="3.6" fill="#FFF3B0"/></g>'}
  return piece(g,[["cámara",[-20,-19,16,20],cam],["claqueta",[cx,cy,cx+14,cy+2.4],cl],d>0?["reflector",[26,-28,34,-20],rf]:null,d>1?dp("flowers",28,24,{k:.8,d:d}):null]);
 }

 /* ================= ARQUITECTURA ================= */
 function houseModel(x,y,z,k,d,half){var s="",W=T("#F4EFE6"),Rf=T("#C96A4A");
  var w=12*k,dd=10*k,h=8*k;
  s+=box(x,y,z,w,dd,h,W.b,{left:W.b,right:W.s,top:W.l,noGlint:true});
  if(d>0){var L=I.faceL(x,y,z,w,dd);s+=quad(L,2*k,3*k,2.6*k,2.6*k,"#7FB6DA",{st:false})+quad(L,7*k,0,2.6*k,4.6*k,"#9A6B45",{st:false})}
  if(half){
   var rh=6*k,r1=P(x,y+dd/2,z+h+rh),r2=P(x+w,y+dd/2,z+h+rh);
   s+=I.poly([P(x,y+dd/2,z+h+rh),P(x+w*.45,y+dd/2,z+h+rh),P(x+w*.45,y+dd,z+h),P(x,y+dd,z+h)],Rf.b);
   s+=I.poly([P(x,y+dd,z+h),P(x+w*.45,y+dd,z+h),P(x+w*.45,y+dd,z+h-1.2),P(x,y+dd,z+h-1.2)],Rf.d,{st:false});
   for(var i=0;i<=4;i++){var xx=x+w*.45+i*(w*.55/4);s+=line([P(xx,y+dd,z+h),P(xx,y+dd/2,z+h+rh),P(xx,y,z+h)],"#B07B4E",.9,{cap:"butt"})}
   s+=line([r1,r2],"#8A5E3C",1.1,{cap:"butt"});
  }else s+=I.gable(x,y,z+h,w,dd,6*k,"#C96A4A",{ov:1,th:1});
  return s}
 function arquitectura_s(d){
  var g=plat("#D9E8C9","#9A8B6E"),s="";
  var x=-24,y=-22,w=34,dd=28,h=30;
  s+=I.shadowBox(x,y,Z,w,dd,h);
  s+=box(x,y,Z,w,dd,h,"#F2EEE6",{left:"#E9E3D8",right:"#CFC6B6",top:"#FAF8F3"});
  var L=I.faceL(x,y,Z,w,dd),R=I.faceR(x,y,Z,w,dd);
  s+=quad(L,2,2,w-4,h-6,"#7FB6DA",{st:false});
  if(d>0){for(var u=2;u<=w-2;u+=d>1?4:8)s+=line([L(u,2),L(u,h-4)],"#E9E3D8",.9,{cap:"butt"});for(var v=2;v<=h-4;v+=8)s+=line([L(2,v),L(w-2,v)],"#E9E3D8",.9,{cap:"butt"});s+=poly([L(4,h-6),L(12,h-6),L(4,6)],"#FFFFFF",{op:.22,st:false})}
  if(d>0)for(var r=0;r<2;r++)s+=win(R,4,6+r*11,dd-8,6,"#7FB6DA","#E9E3D8");else s+=quad(R,4,6,dd-8,16,"#6EA3C6",{st:false});
  s+=box(x-2,y-2,Z+h,w+6,dd+4,2,"#3D4652",{top:"#57616E",right:"#2D343D"});
  var md=box(12,14,Z,14,12,6,"#8A5E3C",{top:"#B07B4E",noGlint:true})+houseModel(13,15,Z+6,1,d,false);
  return piece(g,[["estudio",[x-2,y-2,x+w+4,y+dd+2],s],["maqueta",[12,14,26,26],I.shadowBox(12,14,Z,14,12,14)+md],d>0?dp("treeRound",-32,22,{k:.6,d:d}):null,d>1?dp("bush",26,-28,{k:.45,d:d}):null]);
 }
 /* emblema: maqueta a medio construir sobre el plano; el compás está de pie a un lado, con aire */
 function arquitectura_e(d){
  var g=plat("#D9E8C9","#9A8B6E"),BL="#2F6FB0";
  var px=-32,py=-26,pw=40,pd=34;
  g+=poly([P(px,py,Z+.3),P(px+pw,py,Z+.3),P(px+pw,py+pd,Z+.3),P(px,py+pd,Z+.3)],BL,{st:false});
  if(d>0){var Tg=I.faceTop(px,py,Z+.35);for(var gg=4;gg<pw;gg+=6)g+=line([Tg(gg,2),Tg(gg,pd-2)],"#5C93CC",.5,{cap:"butt"});for(gg=4;gg<pd;gg+=6)g+=line([Tg(2,gg),Tg(pw-2,gg)],"#5C93CC",.5,{cap:"butt"});
   g+=line([Tg(4,4),Tg(24,4),Tg(24,20),Tg(4,20),Tg(4,4)],"#FFFFFF",.8,{cap:"butt"})+line([Tg(28,8),Tg(36,8)],"#FFFFFF",.8,{cap:"butt"})}
  var roll=I.shadowBox(px-3,py,Z,3,pd,6)+'<g transform="'+I.planeY(px,py,Z+3)+'"><rect x="0" y="-3" width="'+pd+'" height="6" rx="1" fill="#4A84C2"/><rect x="0" y="-3" width="'+pd+'" height="2" rx="1" fill="#7FB0E0"/></g>'+discY(px,py+pd,Z+3,3,"#5C93CC",{hub:"#2F6FB0"});
  var house=I.shadowBox(-26,-20,Z,21.6,18,24)+houseModel(-26,-20,Z+.4,1.8,d,true);
  var ruler="";if(d>0){ruler=I.shadowBox(-30,14,Z,30,4.6,1.4)+box(-30,14,Z,30,4.6,1.4,"#F2C14E",{noGlint:true});var Rt=I.faceTop(-30,14,Z+1.41);for(var t=1;t<30;t+=d>1?2:4)ruler+=line([Rt(t,0),Rt(t,t%4<2?2.4:1.3)],"#8A6A1E",.4,{cap:"butt"})}
  /* compás de pie en su plano, a la derecha de la casa */
  var cx=22,cy=-15,M=T("#7F8C99"),cp="";
  cp+=I.contact(1.6,{x:P(cx,cy-10,Z)[0],y:P(cx,cy-10,Z)[1]})+I.contact(1.6,{x:P(cx,cy+12,Z)[0],y:P(cx,cy+12,Z)[1]});
  cp+='<g transform="'+I.planeY(cx,cy-11,Z)+'">'+
   '<path d="M0 0L9.6 -44L11.4 -44L3 0Z" fill="'+M.b+'"/><path d="M1.8 0L10.6 -44L11.4 -44L3 0Z" fill="'+M.s+'"/>'+
   '<path d="M21 0L11.4 -44L13 -44L22.6 0Z" fill="'+M.l+'"/><path d="M21.8 0L12.4 -44L13 -44L22.6 0Z" fill="'+M.b+'"/>'+
   '<path d="M19.4 -6L22.6 0L21.2 -6Z" fill="#3A4452"/>'+(d>0?'<path d="M4.8 -18L17.8 -18" stroke="'+M.s+'" stroke-width="1.2"/>':'')+
   '<circle cx="12.2" cy="-45.4" r="3.2" fill="#C99A2E"/><circle cx="12.2" cy="-45.4" r="1.2" fill="#8A6A1E"/><rect x="11.4" y="-52" width="1.6" height="5" rx=".8" fill="#5A6573"/></g>';
  return piece(g,[["rollo",[px-3,py,px,py+pd],roll],["maqueta",[-26,-20,-4.4,-2],house],d>0?["regla",[-30,14,0,18.6],ruler]:null,["compás",[20,-26,24,-3],cp],d>1?dp("bush",30,-22,{k:.45,d:d}):null]);
 }

 /* ================= VETERINARIA ================= */
 /* perro sentado de tres cuartos: hocico largo, oreja caída, dos patas delanteras rectas, cola en el piso */
 var DOG="M-12.6 0C-12.8 -6 -12.9 -15 -13.4 -23C-14 -28.6 -14.2 -32.6 -12.8 -36.6C-14 -38 -16.4 -39.2 -19.2 -40C-22.6 -40.6 -27.4 -41.4 -29 -43.2C-30 -44.8 -29 -47 -26.4 -48C-23.6 -49.2 -20 -51.4 -17.6 -55.6C-15.6 -59.6 -11.6 -61.8 -7.6 -61.4C-4.2 -61 -1.2 -59 -.2 -55.8C.8 -52.8 1.2 -49.6 .2 -46.8C-.6 -44.8 -2.4 -43.6 -3.4 -42.4C-1.6 -40.4 1.2 -38.6 4.6 -36.2C9.4 -32.8 13.8 -28.4 16.4 -22.8C19.4 -16.8 20.4 -10.8 19.8 -5.6C21.6 -6.2 23.8 -6.8 25.4 -5.6C26.8 -4.4 26 -2.4 24.2 -1.6C21.6 -.6 18.4 -.2 15.6 0C11 .4 6.4 .2 2.4 -.4C1.2 -1.4 -.6 -1.8 -2.2 -1.2C-3.4 -.6 -4.2 .2 -5.6 .3C-7.6 .5 -9.4 .2 -10.4 -.2C-11 .3 -11.8 .3 -12.6 0Z";
 var EAR="M-9.6 -59.6C-6 -60 -3.4 -58 -2.8 -54.6C-2.4 -51.4 -3.2 -47.2 -5.8 -45C-7.4 -43.6 -9.6 -44.4 -9.8 -46.6C-10.2 -50 -11.4 -55 -9.6 -59.6Z";
 function dog(x,y,k,d,o){o=o||{};var D=T(o.c||"#E3A45C"),s="",p=P(x,y,Z);
  var inner='<path d="M2 -40C8 -34 14 -26 16 -18C18 -10 18 -4 16 2L30 2L30 -50Z" fill="'+D.s+'"/>';
  inner+='<path d="M-11.6 -2C-11.8 -10 -12 -18 -12.4 -26L-8.8 -26C-8.8 -18 -8.6 -10 -8.2 -2Z" fill="'+D.l+'" opacity=".55"/>';
  /* separación entre las dos patas delanteras */
  inner+='<path d="M-6.4 -1.2C-6.6 -8 -6.8 -16 -7.2 -24" stroke="'+D.s+'" stroke-width="1" fill="none"/>';
  inner+='<path d="M-29 -43.2C-25.4 -42 -21 -41.4 -17.6 -40.4C-19 -42.8 -22.4 -44.6 -26 -45.6Z" fill="#F6E3C6"/>';
  if(d>0)inner+='<path d="M-17.4 -55.8C-15 -59.6 -11 -61 -7.2 -60.2" stroke="'+D.h+'" stroke-width="1.2" fill="none" stroke-linecap="round"/>';
  var body=shaded(DOG,D.b,inner)+shaded(EAR,D.s,'<path d="M-9.6 -59.6L-5.6 -58L-8.6 -45Z" fill="'+D.d+'" opacity=".35"/>');
  /* nariz con brillo */
  body+='<ellipse cx="-29.4" cy="-44.6" rx="1.9" ry="1.5" fill="#2A1E1A"/><ellipse cx="-29.9" cy="-45.1" rx=".6" ry=".4" fill="#FFFFFF" opacity=".7"/>';
  if(d>0)body+='<circle cx="-16.6" cy="-50.8" r="1.3" fill="#2A1E1A"/><circle cx="-17" cy="-51.2" r=".42" fill="#FFFFFF"/><path d="M-28.2 -42.2Q-25.4 -40.8 -22.6 -41.6" stroke="#8A4E2A" stroke-width=".7" fill="none"/>';
  body+='<path d="M-14.4 -38.4C-10.8 -36.6 -6.2 -36.2 -2.8 -38.2" stroke="'+(o.collar||"#E2434B")+'" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="-9" cy="-34.6" r="2" fill="#F2C14E"/><circle cx="-9.4" cy="-35" r=".6" fill="#FFF3C0"/>';
  if(o.steth)body+='<path d="M-12.8 -37C-14.4 -31 -13 -26 -9.6 -24.4C-6 -23 -3 -26 -3 -30C-3 -33 -3.4 -36 -3.8 -37.6" stroke="#38424F" stroke-width="1.5" fill="none" stroke-linecap="round"/><circle cx="-9.6" cy="-24.2" r="2.2" fill="#C9D1DA"/><circle cx="-9.6" cy="-24.2" r="1.2" fill="#9AA5B1"/>';
  s+=I.cast(16*k,26*k,{x:p[0]+2*k,y:p[1]+.6*k})+I.contact(14*k,{x:p[0]+4*k,y:p[1]});
  s+='<g transform="translate('+f1(p[0])+' '+f1(p[1])+') scale('+k+')">'+body+'</g>';
  return s}
 function paw(F,u,v,k,col){var s="";[[0,0,2.2,1.8],[-2.8,2.4,1,1.2],[-1,3.6,1,1.2],[1,3.6,1,1.2],[2.8,2.4,1,1.2]].forEach(function(q){var c=F(u+q[0]*k,v+q[1]*k);s+='<ellipse cx="'+f1(c[0])+'" cy="'+f1(c[1])+'" rx="'+f1(q[2]*k)+'" ry="'+f1(q[3]*k)+'" fill="'+col+'"/>'});return s}
 function veterinaria_s(d){
  var g=plat("#9FD67E","#A98F67"),s="";
  if(d>0)g+=I.walk(-4,44,-4,24,8,"#EFE4CC");
  var x=-24,y=-20,w=30,dd=24,h=20;
  s+=I.shadowBox(x,y,Z,w,dd,h+12);
  s+=box(x,y,Z,w,dd,h,WALL,{left:"#F2ECE0",right:"#D9D3CC",top:"#FFFDF8"});
  s+=I.gable(x,y,Z+h,w,dd,12,"#4FA8A0",{ov:2,th:1.8});
  var L=I.faceL(x,y,Z,w,dd),R=I.faceR(x,y,Z,w,dd);
  s+=arch(L,w/2-4,0,8,11,"#7FC3E8");
  if(d>0){s+=win(L,3,6,6,6,GLASS,FRAME)+win(L,w-9,6,6,6,GLASS,FRAME)+win(R,4,6,6,6,GLASS,FRAME)+win(R,14,6,6,6,GLASS,FRAME)}
  else s+=quad(L,3,6,6,6,GLASS,{st:false})+quad(L,w-9,6,6,6,GLASS,{st:false});
  /* letrero con huella: tablero con grosor apoyado en el alero */
  var sx=x+w/2-7;s+=box(sx,y+dd+1.6,Z+h+1.2,14,1.4,11,"#FFFFFF",{left:"#FFFFFF",right:"#D9DCE2",top:"#FFFFFF"});
  var S=I.faceL(sx,y+dd+1.6,Z+h+1.2,14,1.4);s+=paw(S,7,3,1.1,"#4FA8A0");
  var dh=I.shadowBox(14,12,Z,10,10,10)+box(14,12,Z,10,10,8,"#C96A4A",{left:"#D07A58",right:"#A8553A"})+I.gable(14,12,Z+8,10,10,5,"#8A5E3C",{ov:1,th:1});
  var Dh=I.faceL(14,12,Z,10,10);dh+='<path d="M'+f1(Dh(3,0)[0])+' '+f1(Dh(3,0)[1])+'L'+f1(Dh(3,4)[0])+' '+f1(Dh(3,4)[1])+'Q'+f1(Dh(5,6.4)[0])+' '+f1(Dh(5,6.4)[1])+' '+f1(Dh(7,4)[0])+' '+f1(Dh(7,4)[1])+'L'+f1(Dh(7,0)[0])+' '+f1(Dh(7,0)[1])+'Z" fill="#3A2420"/>';
  var bw=d>0?'<g transform="'+I.planeG(26,30,Z)+'"><ellipse cx="0" cy="0" rx="4" ry="4" fill="#3A8FC8"/><ellipse cx="0" cy="0" rx="2.8" ry="2.8" fill="#7FC3E8"/></g>':"";
  return piece(g,[["clínica",[x-2,y-2,x+w+2,y+dd+3],s],["casita",[13,11,25,23],dh],["perro",[0,26,8,32],dog(4,30,.3,d)],d>0?["plato",[22,26,30,34],bw]:null,d>1?dp("bush",-33,14,{k:.5,d:d}):null]);
 }
 function veterinaria_e(d){
  var g=plat("#9FD67E","#A98F67");
  var bowl=I.shadowEll(22,24,Z,7)+I.cyl(22,24,Z,7,2.4,"#E2434B",{top:"#F4F1EC",sideS:"#B8303A"})+I.ell(22,24,Z+2.5,5.2,"#E7E2DA");
  var b=P(22,24,Z+3.2);bowl+='<g transform="translate('+f1(b[0])+' '+f1(b[1])+') rotate(-18)"><path d="M-6 -1C-7.6 -2.8 -6 -4.4 -4.6 -3C-4 -3.8 -2.4 -3 -3 -1.6L3 -1.6C2.4 -3 4 -3.8 4.6 -3C6 -4.4 7.6 -2.8 6 -1C7.6 .8 6 2.4 4.6 1C4 1.8 2.4 1 3 -.4L-3 -.4C-2.4 1 -4 1.8 -4.6 1C-6 2.4 -7.6 .8 -6 -1Z" fill="#FFF8EA"/><path d="M-3 -.4L3 -.4L3 .4L-3 .4Z" fill="#E4D8BF"/></g>';
  return piece(g,[["perro",[-14,-4,10,16],dog(-2,6,.9,d,{steth:d>0})],["plato",[15,17,29,31],bowl],d>0?dp("bush",30,-26,{k:.5,d:d}):null,d>1?dp("flowers",-30,26,{k:.8,d:d}):null]);
 }

 /* ================= CIENCIA DE DATOS ================= */
 var BARS=["#3F7DA6","#5BA3D0","#7CC4E8","#F2B544"];
 function datos_s(d){
  var g=plat("#7FD3C8","#4E8F97"),s="";
  var x=-18,y=-18,w=24,dd=24,h=50;
  s+=I.shadowBox(x,y,Z,w,dd,h+14);
  s+=box(x,y,Z,w,dd,h,"#5BB4E8",{left:"#62B8EA",right:"#3E8CC4",top:"#B7E3FA"});
  var L=I.faceL(x,y,Z,w,dd),R=I.faceR(x,y,Z,w,dd);
  for(var v=5;v<h;v+=d>0?6:12){s+=line([L(0,v),L(w,v)],"#DDF3FF",.8,{op:.75,cap:"butt"})+line([R(0,v),R(dd,v)],"#9BD0F2",.8,{op:.6,cap:"butt"})}
  if(d>0)for(var u=6;u<w;u+=6)s+=line([L(u,0),L(u,h)],"#DDF3FF",.6,{op:.5,cap:"butt"});
  s+=poly([L(2,h-2),L(9,h-2),L(2,6)],"#FFFFFF",{op:.22,st:false});
  s+=quad(L,w/2-3,0,6,6,"#2F5A82",{st:false});
  var bz=Z+h,bx=x+2,by=y+dd/2;
  s+=I.cyl(bx+4,by+.8,bz,.8,6,"#56657A",{noGlint:true})+I.cyl(bx+18,by+.8,bz,.8,6,"#56657A",{noGlint:true});
  s+=box(bx,by,bz+6,22,1.6,14,"#FFFFFF",{left:"#FFFFFF",right:"#D9DCE2",top:"#F2F4F6"});
  var B=I.faceL(bx,by,bz+6,22,1.6);
  [[3,4],[7.6,7],[12.2,5.4],[16.8,10]].forEach(function(q,i){s+=quad(B,q[0],1.6,3.2,q[1],BARS[i],{st:false})});
  if(d>0)s+=line([B(4.6,6),B(9.2,9),B(13.8,7.6),B(18.4,12.4)],"#E2434B",1.1);
  return piece(g,[["torre",[x,y,x+w,y+dd],s],d>0?dp("bush",-31,22,{k:.5,d:d}):null,d>0?dp("lamp",22,20,{d:d}):null,d>1?dp("bench",4,26,{d:d}):null]);
 }
 /* emblema: barras 3D; la tendencia sale de la primera barra y sube con flecha; la lupa va adelante, en el piso */
 function datos_e(d){
  var g=plat("#7FD3C8","#4E8F97"),s="";
  s+=box(-32,-30,Z,46,20,2,"#E6ECF0",{top:"#F2F6F8",right:"#B9C6D0"});
  var H=[12,22,17,34],X=[-30,-19,-8,3];
  X.forEach(function(x,i){s+=box(x,-26,Z+2,8,12,H[i],BARS[i])});
  var tp=X.map(function(x,i){return P(x+4,-20,Z+2+H[i]+(i?7:0))});
  s+='<path d="M'+tp.map(function(p){return f1(p[0])+" "+f1(p[1])}).join("L")+'" stroke="#E2434B" stroke-width="2.4" fill="none" stroke-linejoin="round" stroke-linecap="butt"/>';
  var a=tp[3],b2=tp[2],ang=Math.atan2(a[1]-b2[1],a[0]-b2[0]);
  s+='<path d="M'+f1(a[0]+Math.cos(ang)*5)+' '+f1(a[1]+Math.sin(ang)*5)+'L'+f1(a[0]+Math.cos(ang+2.4)*4.6)+' '+f1(a[1]+Math.sin(ang+2.4)*4.6)+'L'+f1(a[0]+Math.cos(ang-2.4)*4.6)+' '+f1(a[1]+Math.sin(ang-2.4)*4.6)+'Z" fill="#E2434B"/>';
  if(d>0)tp.slice(1,3).forEach(function(p){s+='<circle cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" r="1.8" fill="#FFFFFF" stroke="#E2434B" stroke-width="1"/>'});
  var chart=I.shadowBox(-32,-30,Z,46,20,36)+s;
  /* lupa: aro con grosor y mango hasta el piso, delante de las barras */
  var M=T("#3A4452"),lc=P(-6,14,Z+14),h0=P(8,28,Z+.8),lp="";
  lp+=I.contact(2.2,{x:h0[0],y:h0[1]})+I.cast(10,18,{x:lc[0]+2,y:P(-6,14,Z)[1]});
  lp+='<path d="M'+f1(lc[0]+9)+' '+f1(lc[1]+8)+'L'+f1(h0[0])+' '+f1(h0[1])+'" stroke="'+M.b+'" stroke-width="4.2" stroke-linecap="round"/><path d="M'+f1(lc[0]+9.4)+' '+f1(lc[1]+7)+'L'+f1(h0[0]-.6)+' '+f1(h0[1]-1.4)+'" stroke="'+M.l+'" stroke-width="1.1" stroke-linecap="butt"/>';
  var id=I.uid("lu");
  lp+='<g transform="translate('+f1(lc[0])+' '+f1(lc[1])+') rotate(-24)"><ellipse rx="12.6" ry="11" fill="'+M.b+'"/>'+I.clipDef(id,"M-10.4 0A10.4 8.8 0 1 0 10.4 0A10.4 8.8 0 1 0 -10.4 0Z")+'<ellipse rx="10.4" ry="8.8" fill="#BFE6F7" opacity=".8"/><g clip-path="url(#'+id+')"><path d="M-12 -2L-2 -12L2 -10L-10 2Z" fill="#FFFFFF" opacity=".55"/></g><path d="M-9.4 -5.2A11 9.4 0 0 1 2 -10.6" stroke="'+M.l+'" stroke-width="1" fill="none" stroke-linecap="butt"/></g>';
  return piece(g,[["gráfica",[-32,-30,14,-10],chart],["lupa",[-18,4,10,30],lp],d>0?dp("bush",-34,8,{k:.5,d:d}):null,d>1?dp("lamp",32,8,{d:d}):null]);
 }

 var A={
  medicina:{s:medicina_s,e:medicina_e},derecho:{s:derecho_s,e:derecho_e},computacion:{s:computacion_s,e:computacion_e},
  cine:{s:cine_s,e:cine_e},arquitectura:{s:arquitectura_s,e:arquitectura_e},veterinaria:{s:veterinaria_s,e:veterinaria_e},datos:{s:datos_s,e:datos_e}
 };
 /* elección guardada en el dispositivo: estructura (s) o emblema (e); mientras no elijas, estructura */
 var PICK={};try{PICK=JSON.parse(localStorage.getItem("vocatlas_estilo")||"{}")||{}}catch(e){}
 /* elecciones del equipo; el usuario puede cambiarlas desde #art */
 var DEF={medicina:"s",derecho:"e",computacion:"e",cine:"e",arquitectura:"e",veterinaria:"s",datos:"e"};
 function pick(id,v){if(v){PICK[id]=v;try{localStorage.setItem("vocatlas_estilo",JSON.stringify(PICK))}catch(e){}}return PICK[id]||DEF[id]||"s"}
 /* revisión: registra las partes de una pieza (nombre y huella en el suelo) */
 function parts(id,v,d){REC=[];A[id][v](d==null?2:d);var r=REC[0]||[];REC=null;return r}
 function get(id,d,v,o){var a=A[id];if(!a)return null;NOPLAT=!!(o&&o.noPlat);var r=a[v||pick(id)](d==null?2:d);NOPLAT=false;return r}
 return {parts:parts,DEF:DEF,A:A,get:get,pick:pick,has:function(id){return !!A[id]},ids:Object.keys(A)};
})(ISO,ENV);
