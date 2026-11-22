/* ================= islas, rediseño (solo en #art, pestaña «Islas: rediseño»; la app no lo usa) =================
   Qué cambia frente al mapa de la app y por qué (comparado con fotos de islas e islotes reales):
   - Agua somera: en una isla real el turquesa no hace anillos parejos; es más ancho donde el fondo es bajo
     (bancos de arena) y angosto donde cae rápido. Aquí cada anillo tiene ancho variable y hay bajos más claros.
   - Espuma: una línea continua pegada a la orilla y una segunda ola más afuera, no una raya punteada.
   - Orilla: arena mojada más oscura junto al agua; la pared de la isla en dos capas (roca y tierra).
   - Pasto: la orilla del pasto ya no es copia de la costa (es irregular), con un talud suave en dos tonos,
     manchas grandes de pasto claro y oscuro y matitas sueltas, en vez de óvalos de tierra y roca.
   - Vegetación: los árboles crecen en arboledas (grupos) con verdes distintos, palmeras solo en la arena
     y rocas en la orilla del agua, medio mojadas; no repartidos al azar por igual.
   - Modelo de la isla: la meseta avanza hacia el mar con ancho variable y forma cabos de roca; un cerro escalonado,
     una laguna con juncos, la base de la isla bajo el agua y un muelle con lancha en la playa del lado abierto.
   - Edificios: van sobre un montículo bajo de pasto con plaza, no sobre un disco alto (ver iso-bld.js, plat3),
     y con las correcciones v3 de cada estructura. */
var ISLAS3=(function(I,E,G,M){
 var P=I.P,f1=I.f1,Z_TOP=8;
 function pj(p,z){return P(p[0],p[1],z||0)}
 function area(pts){var a=0;for(var i=0;i<pts.length;i++){var p=pts[i],q=pts[(i+1)%pts.length];a+=p[0]*q[1]-q[0]*p[1]}return a/2}
 /* contorno desplazado hacia afuera con ancho variable (seno de dos frecuencias, distinto por isla) */
 function grow(pts,dist,amp,seed){var n=pts.length,o=[],r=G.rng(seed),p1=r()*6.28,p2=r()*6.28,sg=area(pts)>0?1:-1;
  for(var i=0;i<n;i++){var a=pts[(i-1+n)%n],b=pts[i],c=pts[(i+1)%n],tx=c[0]-a[0],ty=c[1]-a[1],l=Math.hypot(tx,ty)||1,nx=sg*ty/l,ny=-sg*tx/l,t=i/n*Math.PI*2;
   var k=dist*(1+amp*(.6*Math.sin(t*3+p1)+.4*Math.sin(t*7+p2)));o.push([b[0]+nx*k,b[1]+ny*k])}return o}
 function ringPts(cx,cy,r,seed,n){var rr=G.rng(seed),a0=rr()*6.28,o=[];n=n||14;for(var i=0;i<n;i++){var a=i/n*Math.PI*2,k=r*(.78+.3*rr()+.12*Math.sin(a*2+a0));o.push([cx+Math.cos(a)*k,cy+Math.sin(a)*k*.9])}return o}
 var SAND="#F4DFA6",WET="#E3C58A",CLIFF_T="#D7A86C",CLIFF_B="#B4844F";
 function sm(a,b,x){var t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t)}
 /* modelo de la isla: dónde va cada cosa (se calcula una vez por mundo y lo usan la tierra y los objetos)
    - meseta irregular: el pasto avanza hacia el mar con ancho variable; en algunos tramos llega hasta el agua (cabo de roca)
    - cerro escalonado en la zona más libre, laguna en otra zona libre y muelle en la playa del lado de mar abierto */
 function feats(W){if(W.__f3)return W.__f3;var F={};
  W.islands.forEach(function(L){var rr=G.rng(G.hs(L.id+"f")),f={};
   var roadOut=[];W.edges.forEach(function(e){e.pts.forEach(function(q){if(!W.inPoly(q[0],q[1],L.plateau)&&W.inPoly(q[0],q[1],L.coast))roadOut.push(q)})});
   W.bridges.forEach(function(b){roadOut.push(b.p0,b.p1)});
   function dn(x,y){var m=1e9;L.nodes.forEach(function(n){m=Math.min(m,Math.hypot(n.x-x,n.y-y))});return m}
   function de(x,y){var m=1e9;W.edges.forEach(function(e){e.pts.forEach(function(q){m=Math.min(m,Math.hypot(q[0]-x,q[1]-y))})});return m}
   /* meseta: cada punto avanza hacia la costa; los cabos llegan casi al agua (nunca donde cruza un camino o un puente) */
   var n=L.plateau.length,sg=area(L.plateau)>0?1:-1,p1=rr()*6.28,p2=rr()*6.28,pl=[],head=[];
   for(var i=0;i<n;i++){var a=L.plateau[(i-1+n)%n],b=L.plateau[i],c=L.plateau[(i+1)%n],tx=c[0]-a[0],ty=c[1]-a[1],l=Math.hypot(tx,ty)||1,nx=sg*ty/l,ny=-sg*tx/l,t=i/n*Math.PI*2;
    var gap=W.edgeDist(b[0],b[1],L.coast),ff=.5+.5*(.6*Math.sin(t*3+p1)+.4*Math.sin(t*5+p2)),h=sm(.7,.88,ff),near=1e9;
    roadOut.forEach(function(q){near=Math.min(near,Math.hypot(q[0]-b[0],q[1]-b[1]))});if(near<34)h=0;
    var e=gap*.42*ff*(1-h)+Math.max(0,gap-1.4)*h;pl.push([b[0]+nx*e,b[1]+ny*e]);head.push(h)}
   f.pl=pl;f.head=head;
   /* rocas del cabo: en la orilla, donde el pasto llega al agua */
   f.rocks=[];f.headPts=[];for(i=0;i<n;i++)if(head[i]>.5)f.headPts.push(pl[i]);
   for(i=0;i<n;i+=4)if(head[i]>.6){var q=L.plateau[i],best=null,bd=1e9;L.coast.forEach(function(c){var d=Math.hypot(c[0]-pl[i][0],c[1]-pl[i][1]);if(d<bd){bd=d;best=c}});if(best)f.rocks.push([best[0]+(rr()-.5)*6,best[1]+(rr()-.5)*6,.7+rr()*.8])}
   /* cerro: el punto más libre de la meseta */
   var bs=-1,hp=null;for(var k=0;k<500;k++){var aa=rr()*6.28,r=Math.sqrt(rr())*L.R,x=L.x+Math.cos(aa)*r,y=L.y+Math.sin(aa)*r;if(!W.inPoly(x,y,L.plateau))continue;
    var sc=Math.min(dn(x,y)-48,de(x,y)-12,W.edgeDist(x,y,L.plateau)+4);if(sc>bs){bs=sc;hp=[x,y]}}
   if(hp&&bs>=16)f.hill={x:hp[0],y:hp[1],R:Math.min(bs+4,46)};
   /* laguna: otro punto libre, lejos del cerro */
   bs=-1;var pp=null;for(k=0;k<500;k++){aa=rr()*6.28;r=Math.sqrt(rr())*L.R;x=L.x+Math.cos(aa)*r;y=L.y+Math.sin(aa)*r;if(!W.inPoly(x,y,L.plateau))continue;
    sc=Math.min(dn(x,y)-48,de(x,y)-12,W.edgeDist(x,y,L.plateau)-6,f.hill?Math.hypot(f.hill.x-x,f.hill.y-y)-f.hill.R-14:1e9);if(sc>bs){bs=sc;pp=[x,y]}}
   if(pp&&bs>=9)f.pond={x:pp[0],y:pp[1],r:Math.min(bs*.8,17)};
   /* muelle: punto de playa que mira al este (el muelle sale hacia +x), lejos de puentes y cabos */
   var bestI=-1,bv=-1,cs=area(L.coast)>0?1:-1,m=L.coast.length;for(i=0;i<m;i++){var A=L.coast[(i-1+m)%m],B=L.coast[i],C=L.coast[(i+1)%m],ux=C[0]-A[0],uy=C[1]-A[1],ll=Math.hypot(ux,uy)||1,ox=cs*uy/ll,oy=-cs*ux/ll;
    var okb=true;W.bridges.forEach(function(bb){if(Math.hypot(bb.p0[0]-B[0],bb.p0[1]-B[1])<60||Math.hypot(bb.p1[0]-B[0],bb.p1[1]-B[1])<60)okb=false});
    f.rocks.forEach(function(r){if(Math.hypot(r[0]-B[0],r[1]-B[1])<30)okb=false});if(okb&&ox>bv){bv=ox;bestI=i}}
   if(bestI>-1&&bv>.75)f.pier=[L.coast[bestI][0]-6,L.coast[bestI][1]];
   F[L.id]=f});
  return W.__f3=F}
 function land3(W,ALL){var sea="",land="";
  /* agua somera: tres bandas de ancho variable y bajos de arena más claros */
  ALL.forEach(function(L,li){var s0=G.hs(L.id+"s");
   sea+='<path d="'+M.closed(grow(L.coast,30,.55,s0),0)+'" fill="var(--m-sh1)" stroke="var(--m-sh1)" stroke-width="84" stroke-linejoin="round"/>'});
  ALL.forEach(function(L){var s0=G.hs(L.id+"s");sea+='<path d="'+M.closed(grow(L.coast,16,.7,s0+1),0)+'" fill="var(--m-sh2)" stroke="var(--m-sh2)" stroke-width="26" stroke-linejoin="round"/>';
   var rr=G.rng(s0+5);for(var k=0;k<3;k++){var i=Math.floor(rr()*L.coast.length),g2=grow(L.coast,30,.2,s0+2)[i];sea+='<path d="'+M.closed(ringPts(g2[0],g2[1],16+rr()*14,s0+k),0)+'" fill="var(--m-sh3)" opacity=".55"/>'}});
  ALL.forEach(function(L){var s0=G.hs(L.id+"s");sea+='<path d="'+M.closed(grow(L.coast,5,.9,s0+3),0)+'" fill="var(--m-sh3)" stroke="var(--m-sh3)" stroke-width="10" stroke-linejoin="round"/>';
   sea+='<path d="'+M.closed(grow(L.coast,15,.5,s0+4),0)+'" fill="none" stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="26 14 8 14" opacity=".45"/>';
   sea+='<path d="'+M.closed(grow(L.coast,3,.4,s0+6),0,4)+'" fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linejoin="round" opacity=".85"/>'});
  var FE=feats(W);
  /* base sumergida: la isla sigue bajo el agua, más oscura, y le da cuerpo */
  ALL.forEach(function(L){sea+='<path d="'+M.closed(grow(L.coast,5,.4,G.hs(L.id+"u")),0,27)+'" fill="#0B4A72" opacity=".22"/>'});
  ALL.forEach(function(L,li){var look=M.look(L.area.biome),gh=L.ghost,cid=I.uid("i3"),cid2=I.uid("i3"),s0=G.hs(L.id+"t"),fe=FE[L.id];
   var pl=fe?fe.pl:grow(L.plateau,2.5,1.4,s0),dp=M.closed(pl,Z_TOP);
   land+='<g class="m-isle'+(gh?' m-ghost':'')+'"><g class="m-isle-in">';
   /* pared: roca abajo, tierra arriba, línea mojada al pie */
   land+='<path d="'+M.closed(L.coast,0,15)+'" fill="'+(gh?"#B3A68C":CLIFF_B)+'"/><path d="'+M.closed(L.coast,0,8)+'" fill="'+(gh?"#C7BB9F":CLIFF_T)+'"/>';
   land+='<path d="'+M.closed(L.coast,0,15)+'" fill="none" stroke="#7D5A36" stroke-width="1.4" opacity=".35"/>';
   /* en los cabos la pared es de roca gris, no de tierra */
   if(fe&&fe.headPts.length){var hc=I.uid("i3");land+='<clipPath id="'+hc+'">'+fe.headPts.map(function(q){var c=pj(q,0);return '<ellipse cx="'+f1(c[0])+'" cy="'+f1(c[1]+8)+'" rx="26" ry="18"/>'}).join("")+'</clipPath><g clip-path="url(#'+hc+')"><path d="'+M.closed(L.coast,0,15)+'" fill="#7E7A73"/><path d="'+M.closed(L.coast,0,8)+'" fill="#9C968C"/></g>'}
   /* arena con su orilla mojada */
   land+='<clipPath id="'+cid+'"><path d="'+M.closed(L.coast,0)+'"/></clipPath><path d="'+M.closed(L.coast,0)+'" fill="'+(gh?"#EFE6CC":SAND)+'"/>';
   land+='<g clip-path="url(#'+cid+')"><path d="'+M.closed(L.coast,0)+'" fill="none" stroke="'+(gh?"#DDD3B8":WET)+'" stroke-width="9"/><path d="'+M.closed(L.coast,0)+'" fill="none" stroke="#FFF6DA" stroke-width="1.2" opacity=".7" transform="translate(0 -5)"/></g>';
   /* talud en dos tonos y meseta de pasto */
   var gr=gh?"#C3CDC2":look.grass,gr2=gh?"#B4BFB3":look.grass2,sd=gh?"#98A497":look.side;
   land+='<path d="'+M.closed(pl,0)+'" fill="'+I.shade(sd,.06)+'"/><path d="'+M.closed(pl,Z_TOP*.5)+'" fill="'+I.mix(sd,gr,.45)+'"/><path d="'+dp+'" fill="'+gr+'"/>';
   land+='<clipPath id="'+cid2+'"><path d="'+dp+'"/></clipPath><g clip-path="url(#'+cid2+')">';
   if(!gh){var rr=G.rng(s0+9),n=L.nodes.length*4+6;
    for(var k=0;k<n;k++){var a=rr()*6.28,r=Math.sqrt(rr())*L.R,x=L.x+Math.cos(a)*r,y=L.y+Math.sin(a)*r,big=22+rr()*30,lt=k%3===0;
     land+='<path d="'+M.closed(ringPts(x,y,big,s0+k*7,12),Z_TOP)+'" fill="'+(lt?I.tint(gr,.2):gr2)+'" opacity="'+(lt?.55:.45)+'"/>'}
    /* matitas sueltas */
    var tu="";for(k=0;k<L.nodes.length*40+30;k++){var a2=rr()*6.28,r2=Math.sqrt(rr())*L.R*1.05,x2=L.x+Math.cos(a2)*r2,y2=L.y+Math.sin(a2)*r2,p=pj([x2,y2],Z_TOP);
     tu+='M'+f1(p[0]-1.4)+' '+f1(p[1])+'l.5 -1.8M'+f1(p[0])+' '+f1(p[1])+'v-2.3M'+f1(p[0]+1.4)+' '+f1(p[1])+'l-.5 -1.8'}
    land+='<path d="'+tu+'" stroke="'+I.shade(gr2,.12)+'" stroke-width=".7" stroke-linecap="round" fill="none" opacity=".7"/>'}
   land+='</g><path d="'+dp+'" fill="none" stroke="'+I.tint(gr,.45)+'" stroke-width="1.2" opacity=".75"/>';
   /* laguna con orilla de arena, agua en dos tonos, brillo y lirios */
   if(fe&&fe.pond){var pd=fe.pond,ps=G.hs(L.id+"p"),ring=ringPts(pd.x,pd.y,pd.r,ps,16),wat=ring.map(function(q){return [pd.x+(q[0]-pd.x)*.82,pd.y+(q[1]-pd.y)*.82]}),deep=ring.map(function(q){return [pd.x+(q[0]-pd.x)*.5,pd.y+(q[1]-pd.y)*.5]});
    land+='<path d="'+M.closed(ring,Z_TOP)+'" fill="#E9D7A6"/><path d="'+M.closed(wat,Z_TOP-1)+'" fill="#5DBADA"/><path d="'+M.closed(deep,Z_TOP-1)+'" fill="#4AA3C6"/>';
    land+='<path d="'+M.closed(wat,Z_TOP-1)+'" fill="none" stroke="#FFFFFF" stroke-width=".9" opacity=".6" transform="translate(0 1.2)"/>';
    var lr=G.rng(ps+1);for(var lp=0;lp<3;lp++){var la=lr()*6.28,lq=pj([pd.x+Math.cos(la)*pd.r*.5,pd.y+Math.sin(la)*pd.r*.5],Z_TOP-1);land+='<ellipse cx="'+f1(lq[0])+'" cy="'+f1(lq[1])+'" rx="2.4" ry="1.2" fill="#5FAE4E"/>'+(lp===0?'<circle cx="'+f1(lq[0]+.6)+'" cy="'+f1(lq[1]-.4)+'" r=".8" fill="#F7A8C4"/>':'')}}
   land+='</g></g>'});
  return {sea:sea,land:land}}
 /* vegetación: arboledas, arbustos en sus orillas, flores en claros, palmeras en la arena y rocas en el agua */
 function extra(W,push){
  var FE=feats(W);
  W.islands.forEach(function(L){var b=E.BIOME[L.area.biome]||E.BIOME.ciudad,rr=G.rng(G.hs(L.id+"v")),placed=[],fe=FE[L.id]||{},look=M.look(L.area.biome);
   function far(x,y,dn,de,dp){if(fe.hill&&Math.hypot(fe.hill.x-x,fe.hill.y-y)<fe.hill.R+5)return false;if(fe.pond&&Math.hypot(fe.pond.x-x,fe.pond.y-y)<fe.pond.r+4)return false;for(var m=0;m<L.nodes.length;m++)if(Math.hypot(L.nodes[m].x-x,L.nodes[m].y-y)<dn)return false;
    for(m=0;m<W.edges.length;m++){var q=W.edges[m].pts;for(var j=0;j<q.length;j++)if(Math.hypot(q[j][0]-x,q[j][1]-y)<de)return false}
    for(m=0;m<placed.length;m++)if(Math.hypot(placed[m][0]-x,placed[m][1]-y)<dp)return false;return true}
   function onTop(x,y,m){return W.inPoly(x,y,L.plateau)&&W.edgeDist(x,y,L.plateau)>(m||7)}
   function put(x,y,z,art){placed.push([x,y]);var p=pj([x,y],z);push(x+y,'<g transform="translate('+f1(p[0])+' '+f1(p[1])+')">'+art+'</g>')}
   var GREENS=["#4FAE52","#3F9C4A","#5DBB5A","#46A35C"],tk=b.tree==="pine"?"treePine":"treeRound";
   /* arboledas */
   var groves=1+L.nodes.length;for(var gi=0,t=0;gi<groves&&t<300;t++){var a=rr()*6.28,r=Math.sqrt(rr())*L.R,cx=L.x+Math.cos(a)*r,cy=L.y+Math.sin(a)*r;
    if(!onTop(cx,cy,14)||!far(cx,cy,70,22,20))continue;gi++;var nT=4+Math.floor(rr()*3);
    for(var k=0,tt=0;k<nT&&tt<60;tt++){var x=cx+(rr()-.5)*34,y=cy+(rr()-.5)*30;if(!onTop(x,y)||!far(x,y,62,15,8.5))continue;k++;
     put(x,y,Z_TOP,E.one(tk==="treePine"&&rr()<.3?"treeRound":tk,{d:2,k:.72+rr()*.3,ph:rr()*3,flip:rr()<.5,c:GREENS[Math.floor(rr()*4)]}))}
    for(k=0;k<2;k++){var bx=cx+(rr()-.5)*44,by=cy+(rr()-.5)*40;if(onTop(bx,by)&&far(bx,by,60,13,7))put(bx,by,Z_TOP,E.one("bush",{d:2,k:.6+rr()*.25,ph:rr()*3}))}}
   /* flores y algo del bioma sueltos */
   for(var f=0,t2=0;f<L.nodes.length*2+1&&t2<200;t2++){var fx=L.x+(rr()-.5)*2*L.R,fy=L.y+(rr()-.5)*2*L.R;if(onTop(fx,fy)&&far(fx,fy,58,13,12)){f++;put(fx,fy,Z_TOP,E.one(f%2?"flowers":b.deco[Math.floor(rr()*b.deco.length)],{d:2,k:.85,ph:rr()*3}))}}
   /* palmeras en la arena */
   for(var pc=0,t3=0;pc<L.nodes.length+2&&t3<400;t3++){var a3=rr()*6.28,r3=L.R*(.7+rr()*.6),px=L.x+Math.cos(a3)*r3,py=L.y+Math.sin(a3)*r3;
    if(!W.inPoly(px,py,L.coast)||W.edgeDist(px,py,L.coast)<7||W.inPoly(px,py,L.plateau)||W.edgeDist(px,py,L.plateau)<4||!far(px,py,60,14,16))continue;pc++;
    put(px,py,0,E.one("palm",{d:2,k:.8+rr()*.15,ph:rr()*3,flip:Math.cos(a3)<0}))}
   /* cerro escalonado: dos o tres terrazas de pasto con talud, rocas que asoman y pinos arriba */
   if(fe.hill){var H=fe.hill,hs=G.hs(L.id+"h"),nl=H.R>30?3:2,o="",hr=G.rng(hs);
    for(var li2=0;li2<nl;li2++){var r0=H.R*(1-.3*li2),zb=Z_TOP+li2*9,pts=ringPts(H.x+(hr()-.5)*4,H.y+(hr()-.5)*4,r0,hs+li2,16),gT=I.tint(look.grass,.05*li2);
     o+='<path d="'+M.closed(pts,zb)+'" fill="'+I.shade(look.side,.04)+'"/><path d="'+M.closed(pts,zb+4.5)+'" fill="'+I.mix(look.side,look.grass,.4)+'"/><path d="'+M.closed(pts,zb+9)+'" fill="'+gT+'"/>';
     o+='<path d="'+M.closed(pts,zb+9)+'" fill="none" stroke="'+I.tint(gT,.4)+'" stroke-width="1" opacity=".7"/>';
     for(var ro=0;ro<2;ro++){var ra=Math.PI*.25+hr()*Math.PI*.5,rp=[H.x+Math.cos(ra)*r0*.92,H.y+Math.sin(ra)*r0*.92*.9],qq=pj(rp,zb+5);o+='<g transform="translate('+f1(qq[0])+' '+f1(qq[1])+')">'+E.one("rock",{d:2,k:.55+hr()*.3,c:"#9C968C"})+'</g>'}}
    var zt=Z_TOP+nl*9,tops=[[0,0,"treePine"],[-6,5,"treePine"],[6,-4,"rock"],[5,6,"bush"]];tops.forEach(function(q){var tp=pj([H.x+q[0],H.y+q[1]],zt);o+='<g transform="translate('+f1(tp[0])+' '+f1(tp[1])+')">'+E.one(q[2],{d:2,k:q[2]==="rock"?.8:.7,ph:hr()*3,c:q[2]==="treePine"?"#3F8F57":undefined})+'</g>'});
    push(H.x+H.y,o);placed.push([H.x,H.y])}
   /* juncos en la orilla de la laguna */
   if(fe.pond){var pd2=fe.pond;for(var jr=0;jr<4;jr++){var ja=Math.PI*(.15+jr*.22),jx=pd2.x+Math.cos(ja)*pd2.r*.95,jy=pd2.y+Math.sin(ja)*pd2.r*.95*.9,jp=pj([jx,jy],Z_TOP);
     push(jx+jy,'<g transform="translate('+f1(jp[0])+' '+f1(jp[1])+')"><path d="M-1.4 0q-.6 -4 -1.6 -7M0 0v-8.4M1.4 0q.6 -4 1.8 -6.6" stroke="#4E8F3A" stroke-width=".9" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="-8.6" rx=".7" ry="1.6" fill="#8A5E3C"/></g>')}}
   /* cabos: rocas grandes donde el pasto llega al mar */
   (fe.rocks||[]).forEach(function(r){put(r[0],r[1],-2,E.one("rock",{d:2,k:r[2],c:"#9C968C"}))});
   /* muelle con su lancha */
   if(fe.pier){var pq=pj(fe.pier,0);push(fe.pier[0]+fe.pier[1]+20,'<g transform="translate('+f1(pq[0])+' '+f1(pq[1])+')">'+E.pier({d:2,len:40})+'</g>');
    var bq=pj([fe.pier[0]+46,fe.pier[1]+12],0);push(fe.pier[0]+fe.pier[1]+60,'<g transform="translate('+f1(bq[0])+' '+f1(bq[1])+')">'+E.sailboat({c:"#E0434B"})+'</g>')}
   /* rocas en la orilla, medio en el agua */
   for(var rk=0;rk<3;rk++){var i=Math.floor(rr()*L.coast.length),q=grow(L.coast,3,0,1)[i];if(far(q[0],q[1],50,18,14))put(q[0],q[1],-1.5,E.one("rock",{d:2,k:.7+rr()*.4}))}
  })}
 /* página de la pestaña */
 function page(el){
  var W=MAPGEN.build(ISOFIX.catalog(20),ISOFIX.AREAS);
  function svgOf(R){var b=R.box;return '<svg class="gm isow i3-map" viewBox="'+[b[0]-90,b[1]-40,b[2]-b[0]+180,b[3]-b[1]+120].map(function(v){return Math.round(v)}).join(" ")+'" aria-hidden="true">'+R.svg+'</svg>'}
  var A=ISOMAP.render(W,{}),B=ISOMAP.render(W,{ver:"v3",land3:land3,noDecor:true,extra:extra});
  var NAMES={medicina:"Medicina",derecho:"Derecho",computacion:"Computación",nutricion:"Nutrición",civil:"Ing. Civil",aeroespacial:"Ing. Aeroespacial",fisica:"Física",finanzas:"Finanzas",educacion:"Educación"};
  var WHY={medicina:"Le faltaba la entrada de urgencias: ahora tiene bahía de asfalto, marquesina con postes, letrero URGENCIAS y la ambulancia estacionada ahí (no en el pasto).",
   derecho:"Los juzgados neoclásicos (como la Suprema Corte) son de cantera: el frontón y el techo ya no son de teja roja.",
   computacion:"Los servidores nunca van a la intemperie: se quitaron del jardín; en la azotea van los equipos de aire acondicionado.",
   nutricion:"Un puesto real tiene cajas de madera llenas de fruta, una por tipo, y un exhibidor escalonado al frente.",
   civil:"Una obra no tiene la planta baja terminada: concreto aparente, varillas arriba, malla verde de seguridad, cabina en la grúa, zapata y carga colgando.",
   aeroespacial:"La torre de servicio es de celosía de acero gris con pisos y brazos, hay foso de llamas bajo el cohete y tanque de agua (amortigua el despegue). El cohete es blanco con franja negra.",
   fisica:"Los telescopios no salen por arriba de la cúpula: la cúpula se abre por una ranura vertical y el telescopio queda adentro.",
   finanzas:"Un banco clásico (como el Banco de México) tiene escalinata a todo lo ancho, seis columnas, friso con su nombre, frontón y dos pisos de ventanas.",
   educacion:"Toda escuela en México tiene asta con la bandera nacional y patio cívico al frente."};
  var h='<section class="i3"><h2>Islas: rediseño</h2><p class="ia-n">Propuesta para revisar. <b>No está en la app</b>: el mapa de la app sigue igual hasta que lo apruebes. Mismo mundo de prueba (20 carreras), arriba como se ve hoy y abajo el rediseño.</p>'+
   '<ul class="i3-why"><li><b>Agua somera</b> de ancho variable, con bajos de arena, como en islas reales (no anillos parejos).</li><li><b>Espuma</b> continua pegada a la orilla y una ola más afuera.</li><li><b>Arena mojada</b> junto al agua y pared de la isla en dos capas.</li><li><b>Pasto</b> con orilla irregular, talud suave, manchas claras y oscuras y matitas.</li><li><b>Árboles en arboledas</b> con verdes distintos; palmeras solo en la arena; rocas en el agua.</li><li><b>Edificios</b> sobre un montículo bajo con plaza (antes, un disco alto que parecía posavasos).</li><li><b>Forma de la isla</b>: ya no es una losa plana con la misma franja de arena alrededor. El pasto avanza hacia el mar con ancho variable y en algunos tramos llega al agua como un cabo de roca gris con piedras.</li><li><b>Relieve</b>: un cerro escalonado de dos o tres terrazas con rocas y pinos en la zona más libre de cada isla.</li><li><b>Agua dulce</b>: una laguna con orilla de arena, juncos y lirios.</li><li><b>Muelle con lancha</b> en la playa que da a mar abierto, y la base de la isla se ve bajo el agua.</li></ul>'+
   '<h3>Hoy</h3><div class="i3-wrap">'+svgOf(A)+'</div><h3>Rediseño</h3><div class="i3-wrap">'+svgOf(B)+'</div>';
  /* de cerca: la isla de Salud, hoy y rediseñada */
  var LS=W.islands.filter(function(L){return L.area.id==="salud"})[0]||W.islands[0],bx=[1e9,1e9,-1e9,-1e9];LS.coast.forEach(function(q){var p=pj(q,0);bx[0]=Math.min(bx[0],p[0]);bx[1]=Math.min(bx[1],p[1]);bx[2]=Math.max(bx[2],p[0]);bx[3]=Math.max(bx[3],p[1])});
  var vbz=[bx[0]-20,bx[1]-90,bx[2]-bx[0]+40,bx[3]-bx[1]+120].map(function(v){return Math.round(v)}).join(" ");
  h+='<h3>De cerca: isla de Salud</h3><div class="i3-close"><figure><div class="i3-wrap"><svg class="gm isow i3-map" viewBox="'+vbz+'" aria-hidden="true">'+A.svg+'</svg></div><figcaption>Hoy</figcaption></figure><figure><div class="i3-wrap"><svg class="gm isow i3-map" viewBox="'+vbz+'" aria-hidden="true">'+B.svg+'</svg></div><figcaption>Rediseño</figcaption></figure></div>';
  h+='<h3>Estructuras corregidas</h3><p class="ia-n">Cada una comparada con fotos de edificios reales (Wikimedia Commons). Izquierda: hoy. Derecha: corregida.</p><div class="i3-grid">';
  var VB="-72 -110 144 160";Object.keys(WHY).forEach(function(id){h+='<article class="i3-card"><h4>'+NAMES[id]+'</h4><div class="i3-pair"><svg viewBox="'+VB+'" aria-hidden="true">'+ART.get(id,2,"s")+'</svg><svg viewBox="'+VB+'" aria-hidden="true">'+ART.get(id,2,"s",{ver:"v3"})+'</svg></div><p>'+WHY[id]+'</p></article>'});
  h+='</div></section>';el.innerHTML=h}
 return {land3:land3,extra:extra,page:page};
})(ISO,ENV,MAPGEN,ISOMAP);
