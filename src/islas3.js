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
 /* estilos de isla para comparar: cada uno cambia el modelo (forma, relieve, costa) y no solo los colores */
 var STY={
  tropical:{id:"tropical",n:"A · Tropical",d:"Playa de ancho variable con cabos de roca, cerro escalonado, laguna y muelle.",sand:"#F4DFA6",wet:"#E3C58A",ct:"#D7A86C",cb:"#B4844F",wall:15,exp:.42,head:[.7,.88],sh:[30,84,16,26,5,10],hill:46,hillDn:48,layers:3,lz:9,pond:true,pier:true,palms:2,groves:1,pines:0},
  caribe:{id:"caribe",n:"B · Caribe",d:"Isla baja de playas anchas y blancas, agua muy turquesa con coral, muchas palmeras y sombrillas; casi sin relieve.",sand:"#FFF3D9",wet:"#F0DCAE",ct:"#E9C890",cb:"#CFA66C",wall:9,exp:.12,head:null,sh:[46,118,26,40,8,16],vars:"--m-sh1:rgba(120,236,232,.42);--m-sh2:#74E0DA;--m-sh3:#B6F3EA",coral:true,hill:0,pond:false,pier:true,palms:4,groves:.5,pines:0,umbrellas:true},
  roca:{id:"roca",n:"C · Acantilados",d:"Paredes altas de roca en capas, el pasto llega al borde casi en toda la isla, pinos, agua honda y faro en un cabo.",sand:"#D9C9A0",wet:"#C8B48A",ct:"#9C968C",cb:"#6F6A63",wall:28,strata:true,exp:1,head:"all",sh:[16,48,8,16,3,6],vars:"--m-sh1:rgba(70,150,190,.3);--m-sh2:#4FA2C6;--m-sh3:#7DC0D8",hill:40,hillDn:48,layers:2,lz:10,pond:true,pier:false,palms:0,groves:1.4,pines:.85,grass:.18,lighthouse:true},
  montana:{id:"montana",n:"D · Montaña",d:"Una montaña grande de hasta cuatro terrazas con un arroyo que baja y cae en cascada por la pared de la isla.",sand:"#F2DCA8",wet:"#DFC38C",ct:"#C99A62",cb:"#9E7448",wall:18,exp:.3,head:[.78,.92],sh:[28,76,14,24,5,10],hill:66,hillDn:40,layers:4,lz:11,pond:false,fall:true,pier:true,palms:1,groves:1,pines:.5},
  rio:{id:"rio",n:"E · Río y selva",d:"Un río cruza la isla de costa a costa entre las carreras, con puentes de madera donde lo cruzan los caminos, cascadita al bajar a la playa y selva espesa.",sand:"#EAD6A0",wet:"#D6BC84",ct:"#B98E5C",cb:"#8E6A42",wall:14,exp:.38,head:[.8,.94],sh:[26,70,14,22,5,10],vars:"--m-sh1:rgba(90,200,190,.34);--m-sh2:#5CC6BE;--m-sh3:#9EE0D4",hill:0,pond:false,river:true,pier:false,palms:2.4,groves:1.7,pines:0,grass:.08},
  pueblo:{id:"pueblo",n:"F · Pueblo",d:"En el claro más grande, una plaza empedrada con kiosco, faroles, bancas y bugambilias, como la plaza de un pueblo; playa con lanchas de pescadores.",sand:"#F2DCA8",wet:"#DFC38C",ct:"#C9946A",cb:"#9E6E4C",wall:15,exp:.4,head:[.78,.92],sh:[28,80,14,24,5,10],hill:0,hillDn:44,pond:false,plaza:true,pier:true,palms:1.2,groves:.8,pines:0,boats:true}};
 var ST=STY.tropical;
 function sm(a,b,x){var t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t)}
 /* modelo de la isla: dónde va cada cosa (se calcula una vez por mundo y lo usan la tierra y los objetos)
    - meseta irregular: el pasto avanza hacia el mar con ancho variable; en algunos tramos llega hasta el agua (cabo de roca)
    - cerro escalonado en la zona más libre, laguna en otra zona libre y muelle en la playa del lado de mar abierto */
 function feats(W){W.__f3=W.__f3||{};if(W.__f3[ST.id])return W.__f3[ST.id];var F={};
  W.islands.forEach(function(L){var rr=G.rng(G.hs(L.id+"f")),f={};
   var roadOut=[];W.edges.forEach(function(e){e.pts.forEach(function(q){if(!W.inPoly(q[0],q[1],L.plateau)&&W.inPoly(q[0],q[1],L.coast))roadOut.push(q)})});
   W.bridges.forEach(function(b){roadOut.push(b.p0,b.p1)});
   function dn(x,y){var m=1e9;L.nodes.forEach(function(n){m=Math.min(m,Math.hypot(n.x-x,n.y-y))});return m}
   function de(x,y){var m=1e9;W.edges.forEach(function(e){e.pts.forEach(function(q){m=Math.min(m,Math.hypot(q[0]-x,q[1]-y))})});return m}
   /* meseta: cada punto avanza hacia la costa; los cabos llegan casi al agua (nunca donde cruza un camino o un puente) */
   var n=L.plateau.length,sg=area(L.plateau)>0?1:-1,p1=rr()*6.28,p2=rr()*6.28,pl=[],head=[];
   for(var i=0;i<n;i++){var a=L.plateau[(i-1+n)%n],b=L.plateau[i],c=L.plateau[(i+1)%n],tx=c[0]-a[0],ty=c[1]-a[1],l=Math.hypot(tx,ty)||1,nx=sg*ty/l,ny=-sg*tx/l,t=i/n*Math.PI*2;
    var gap=W.edgeDist(b[0],b[1],L.coast),ff=.5+.5*(.6*Math.sin(t*3+p1)+.4*Math.sin(t*5+p2)),h=ST.head==="all"?1:ST.head?sm(ST.head[0],ST.head[1],ff):0,near=1e9;
    roadOut.forEach(function(q){near=Math.min(near,Math.hypot(q[0]-b[0],q[1]-b[1]))});var exq=ST.exp;if(near<34){h=0;exq=Math.min(exq,.3)}
    var e=gap*exq*(ST.head==="all"&&near>=34?1:ff)*(1-h)+Math.max(0,gap-1.4)*h;pl.push([b[0]+nx*e,b[1]+ny*e]);head.push(h)}
   f.pl=pl;f.head=head;
   /* rocas del cabo: en la orilla, donde el pasto llega al agua */
   f.rocks=[];f.headPts=[];for(i=0;i<n;i++)if(head[i]>.5)f.headPts.push(pl[i]);
   for(i=0;i<n;i+=4)if(head[i]>.6){var q=L.plateau[i],best=null,bd=1e9;L.coast.forEach(function(c){var d=Math.hypot(c[0]-pl[i][0],c[1]-pl[i][1]);if(d<bd){bd=d;best=c}});if(best)f.rocks.push([best[0]+(rr()-.5)*6,best[1]+(rr()-.5)*6,.7+rr()*.8])}
   /* cerro: el punto más libre de la meseta */
   var bs=-1,hp=null;for(var k=0;k<500;k++){var aa=rr()*6.28,r=Math.sqrt(rr())*L.R,x=L.x+Math.cos(aa)*r,y=L.y+Math.sin(aa)*r;if(!W.inPoly(x,y,L.plateau))continue;
    var sc=Math.min(dn(x,y)-ST.hillDn,de(x,y)-12,W.edgeDist(x,y,L.plateau)+4);if(sc>bs){bs=sc;hp=[x,y]}}
   if(ST.hill&&hp&&bs>=16)f.hill={x:hp[0],y:hp[1],R:Math.min(bs+4,ST.hill)};
   /* plaza de pueblo: en el claro más grande (el mismo lugar que tendría el cerro) */
   if(ST.plaza&&hp&&bs>=6)f.plaza={x:hp[0],y:hp[1],R:Math.min(bs+20,40)};
   /* río: la línea con curvas que cruza la isla de costa a costa lo más lejos posible de las carreras y de los puentes */
   if(ST.river){var rb=null,rv=-1;for(k=0;k<260;k++){var th=rr()*Math.PI,off=(rr()-.5)*L.R*.9,dx=Math.cos(th),dy=Math.sin(th),cx0=L.x-dy*off,cy0=L.y+dx*off;
     if(!W.inPoly(cx0,cy0,L.plateau))continue;
     var ex=function(sg){var t=0;while(t<L.R*3&&W.inPoly(cx0+dx*t*sg,cy0+dy*t*sg,L.coast))t+=3;return [cx0+dx*(t+8)*sg,cy0+dy*(t+8)*sg]},ra=ex(-1),rb2=ex(1),w1=(rr()-.5)*46,w2=(rr()-.5)*30,rp=[];
     for(var s2=0;s2<=30;s2++){var u=s2/30,wg=Math.sin(u*Math.PI)*(w1*Math.sin(u*Math.PI*2)+w2);rp.push([ra[0]+(rb2[0]-ra[0])*u-dy*wg,ra[1]+(rb2[1]-ra[1])*u+dx*wg])}
     var sc2=1e9;rp.forEach(function(q){sc2=Math.min(sc2,dn(q[0],q[1]));W.bridges.forEach(function(bb){sc2=Math.min(sc2,Math.hypot(bb.p0[0]-q[0],bb.p0[1]-q[1])+16,Math.hypot(bb.p1[0]-q[0],bb.p1[1]-q[1])+16)})});
     if(sc2>rv){rv=sc2;rb=rp}}
    if(rb&&rv>=50){f.river=rb;f.cross=[];
     /* cruces con los caminos: ahí van puentes */
     W.edges.forEach(function(e){var q=e.pts;for(var j=1;j<q.length;j++)for(var m2=1;m2<rb.length;m2++){var A=q[j-1],B2=q[j],C2=rb[m2-1],D=rb[m2],den=(B2[0]-A[0])*(D[1]-C2[1])-(B2[1]-A[1])*(D[0]-C2[0]);if(Math.abs(den)<1e-6)continue;
       var t1=((C2[0]-A[0])*(D[1]-C2[1])-(C2[1]-A[1])*(D[0]-C2[0]))/den,t2=((C2[0]-A[0])*(B2[1]-A[1])-(C2[1]-A[1])*(B2[0]-A[0]))/den;
       if(t1>=0&&t1<=1&&t2>=0&&t2<=1){var X=A[0]+(B2[0]-A[0])*t1,Y=A[1]+(B2[1]-A[1])*t1,ll2=Math.hypot(B2[0]-A[0],B2[1]-A[1])||1;
        if(!f.cross.some(function(c){return Math.hypot(c.x-X,c.y-Y)<10}))f.cross.push({x:X,y:Y,dx:(B2[0]-A[0])/ll2,dy:(B2[1]-A[1])/ll2,top:W.inPoly(X,Y,L.plateau)})}}});
     /* dónde baja de la meseta a la playa: ahí cae en cascadita */
     f.drops=[];for(var m3=1;m3<rb.length;m3++){var i0=W.inPoly(rb[m3-1][0],rb[m3-1][1],pl),i1=W.inPoly(rb[m3][0],rb[m3][1],pl);if(i0!==i1)f.drops.push(i0?rb[m3-1]:rb[m3])}}}
   /* laguna: otro punto libre, lejos del cerro */
   bs=-1;var pp=null;for(k=0;k<500;k++){aa=rr()*6.28;r=Math.sqrt(rr())*L.R;x=L.x+Math.cos(aa)*r;y=L.y+Math.sin(aa)*r;if(!W.inPoly(x,y,L.plateau))continue;
    sc=Math.min(dn(x,y)-48,de(x,y)-12,W.edgeDist(x,y,L.plateau)-6,f.hill?Math.hypot(f.hill.x-x,f.hill.y-y)-f.hill.R-14:1e9);if(sc>bs){bs=sc;pp=[x,y]}}
   if(ST.pond&&pp&&bs>=9)f.pond={x:pp[0],y:pp[1],r:Math.min(bs*.8,17)};
   /* cascada (montaña): un arroyo baja del cerro hasta el borde más cercano de la meseta y cae por la pared */
   if(ST.fall&&f.hill){var bi=0,bd2=1e9;pl.forEach(function(q,i){var dd=Math.hypot(q[0]-f.hill.x,q[1]-f.hill.y);var okr=true;roadOut.forEach(function(r){if(Math.hypot(r[0]-q[0],r[1]-q[1])<30)okr=false});if(okr&&dd<bd2&&(q[0]+q[1])>(f.hill.x+f.hill.y)){bd2=dd;bi=i}});
    var e2=pl[bi],cst=null,cd=1e9;L.coast.forEach(function(c){var dd=Math.hypot(c[0]-e2[0],c[1]-e2[1]);if(dd<cd){cd=dd;cst=c}});f.fall={a:[f.hill.x,f.hill.y],b:e2,c:cst}}
   /* faro (acantilados): en el cabo más lejos de los puentes */
   if(ST.lighthouse&&f.headPts.length){var lb=null,lv=-1;f.headPts.forEach(function(q){var m2=1e9;W.bridges.forEach(function(bb){m2=Math.min(m2,Math.hypot(bb.p0[0]-q[0],bb.p0[1]-q[1]),Math.hypot(bb.p1[0]-q[0],bb.p1[1]-q[1]))});m2=Math.min(m2,dn(q[0],q[1])-20,de(q[0],q[1]));if(m2>lv){lv=m2;lb=q}});if(lb&&lv>24)f.light=lb}
   /* muelle: punto de playa que mira al este (el muelle sale hacia +x), lejos de puentes y cabos */
   var bestI=-1,bv=-1,cs=area(L.coast)>0?1:-1,m=L.coast.length;for(i=0;i<m;i++){var A=L.coast[(i-1+m)%m],B=L.coast[i],C=L.coast[(i+1)%m],ux=C[0]-A[0],uy=C[1]-A[1],ll=Math.hypot(ux,uy)||1,ox=cs*uy/ll,oy=-cs*ux/ll;
    var okb=true;W.bridges.forEach(function(bb){if(Math.hypot(bb.p0[0]-B[0],bb.p0[1]-B[1])<60||Math.hypot(bb.p1[0]-B[0],bb.p1[1]-B[1])<60)okb=false});
    f.rocks.forEach(function(r){if(Math.hypot(r[0]-B[0],r[1]-B[1])<30)okb=false});if(okb&&ox>bv){bv=ox;bestI=i}}
   if(ST.pier&&bestI>-1&&bv>.75)f.pier=[L.coast[bestI][0]-6,L.coast[bestI][1]];
   F[L.id]=f});
  return W.__f3[ST.id]=F}
 function land3(W,ALL){var sea="",land="";
  /* agua somera: tres bandas de ancho variable y bajos de arena más claros */
  ALL.forEach(function(L,li){var s0=G.hs(L.id+"s");
   sea+='<path d="'+M.closed(grow(L.coast,ST.sh[0],.55,s0),0)+'" fill="var(--m-sh1)" stroke="var(--m-sh1)" stroke-width="'+ST.sh[1]+'" stroke-linejoin="round"/>'});
  ALL.forEach(function(L){var s0=G.hs(L.id+"s");sea+='<path d="'+M.closed(grow(L.coast,ST.sh[2],.7,s0+1),0)+'" fill="var(--m-sh2)" stroke="var(--m-sh2)" stroke-width="'+ST.sh[3]+'" stroke-linejoin="round"/>';
   var rr=G.rng(s0+5);for(var k=0;k<3;k++){var i=Math.floor(rr()*L.coast.length),g2=grow(L.coast,ST.sh[0],.2,s0+2)[i];sea+='<path d="'+M.closed(ringPts(g2[0],g2[1],16+rr()*14,s0+k),0)+'" fill="var(--m-sh3)" opacity=".55"/>'}
   /* coral (Caribe): manchas rosas y naranjas en el agua somera */
   if(ST.coral&&!L.ghost)for(k=0;k<7;k++){var ci=Math.floor(rr()*L.coast.length),cq=grow(L.coast,ST.sh[2]+6+rr()*16,.3,s0+9)[ci];sea+='<path d="'+M.closed(ringPts(cq[0],cq[1],3+rr()*4,s0+40+k,9),0)+'" fill="'+(k%2?"#F59A8C":"#F7B86A")+'" opacity=".75"/>'}});
  ALL.forEach(function(L){var s0=G.hs(L.id+"s");sea+='<path d="'+M.closed(grow(L.coast,ST.sh[4],.9,s0+3),0)+'" fill="var(--m-sh3)" stroke="var(--m-sh3)" stroke-width="'+ST.sh[5]+'" stroke-linejoin="round"/>';
   sea+='<path d="'+M.closed(grow(L.coast,15,.5,s0+4),0)+'" fill="none" stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="26 14 8 14" opacity=".45"/>';
   sea+='<path d="'+M.closed(grow(L.coast,3,.4,s0+6),0,4)+'" fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linejoin="round" opacity=".85"/>'});
  var FE=feats(W);
  /* base sumergida: la isla sigue bajo el agua, más oscura, y le da cuerpo */
  ALL.forEach(function(L){sea+='<path d="'+M.closed(grow(L.coast,5,.4,G.hs(L.id+"u")),0,ST.wall+12)+'" fill="#0B4A72" opacity=".22"/>'});
  ALL.forEach(function(L,li){var look=M.look(L.area.biome),gh=L.ghost,cid=I.uid("i3"),cid2=I.uid("i3"),s0=G.hs(L.id+"t"),fe=FE[L.id];
   var pl=fe?fe.pl:grow(L.plateau,2.5,1.4,s0),dp=M.closed(pl,Z_TOP);
   land+='<g class="m-isle'+(gh?' m-ghost':'')+'"><g class="m-isle-in">';
   /* pared: roca abajo, tierra arriba, línea mojada al pie */
   var Wd=ST.wall;land+='<path d="'+M.closed(L.coast,0,Wd)+'" fill="'+(gh?"#B3A68C":ST.cb)+'"/><path d="'+M.closed(L.coast,0,Wd*.53)+'" fill="'+(gh?"#C7BB9F":ST.ct)+'"/>';
   /* acantilados: estratos de roca (franjas) en la pared */
   if(ST.strata&&!gh)[.22,.38,.7,.84].forEach(function(k,i){land+='<path d="'+M.closed(L.coast,0,Wd*k)+'" fill="none" stroke="'+(i%2?"#5E5A54":"#B5AFA4")+'" stroke-width="'+(i%2?1.6:1)+'" opacity=".55"/>'});
   land+='<path d="'+M.closed(L.coast,0,Wd)+'" fill="none" stroke="#7D5A36" stroke-width="1.4" opacity=".35"/>';
   /* en los cabos la pared es de roca gris, no de tierra */
   if(fe&&fe.headPts.length&&!ST.strata){var hc=I.uid("i3");land+='<clipPath id="'+hc+'">'+fe.headPts.map(function(q){var c=pj(q,0);return '<ellipse cx="'+f1(c[0])+'" cy="'+f1(c[1]+8)+'" rx="26" ry="18"/>'}).join("")+'</clipPath><g clip-path="url(#'+hc+')"><path d="'+M.closed(L.coast,0,Wd)+'" fill="#7E7A73"/><path d="'+M.closed(L.coast,0,Wd*.53)+'" fill="#9C968C"/></g>'}
   /* arena con su orilla mojada */
   land+='<clipPath id="'+cid+'"><path d="'+M.closed(L.coast,0)+'"/></clipPath><path d="'+M.closed(L.coast,0)+'" fill="'+(gh?"#EFE6CC":ST.sand)+'"/>';
   land+='<g clip-path="url(#'+cid+')"><path d="'+M.closed(L.coast,0)+'" fill="none" stroke="'+(gh?"#DDD3B8":ST.wet)+'" stroke-width="9"/><path d="'+M.closed(L.coast,0)+'" fill="none" stroke="#FFF6DA" stroke-width="1.2" opacity=".7" transform="translate(0 -5)"/></g>';
   /* río sobre la arena, de la meseta al mar (la meseta lo tapa adentro) */
   if(fe&&fe.river){var rs=I.smooth(fe.river.map(function(q){return pj(q,0)}),false);land+='<g clip-path="url(#'+cid+')"><path d="'+rs+'" fill="none" stroke="'+ST.wet+'" stroke-width="16" stroke-linecap="round"/><path d="'+rs+'" fill="none" stroke="#5DBADA" stroke-width="10" stroke-linecap="round"/><path d="'+rs+'" fill="none" stroke="#8FD6EC" stroke-width="3" stroke-linecap="round" opacity=".8"/></g>'}
   /* talud en dos tonos y meseta de pasto */
   var gr=gh?"#C3CDC2":ST.grass?I.mix(look.grass,"#4F8A5E",ST.grass):look.grass,gr2=gh?"#B4BFB3":ST.grass?I.mix(look.grass2,"#4F8A5E",ST.grass):look.grass2,sd=gh?"#98A497":look.side;
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
   /* río sobre el pasto: orilla de tierra, agua en dos tonos y reflejos; cascadita donde baja a la playa */
   if(fe&&fe.river){var rt=I.smooth(fe.river.map(function(q){return pj(q,Z_TOP)}),false);
    land+='<g clip-path="url(#'+cid2+')"><path d="'+rt+'" fill="none" stroke="#B9A06C" stroke-width="17" stroke-linecap="round"/><path d="'+rt+'" fill="none" stroke="#4AA3C6" stroke-width="12" stroke-linecap="round"/><path d="'+rt+'" fill="none" stroke="#5DBADA" stroke-width="8" stroke-linecap="round"/><path d="'+rt+'" fill="none" stroke="#BFE8F6" stroke-width="1.2" stroke-dasharray="7 11" stroke-linecap="round" opacity=".9"/></g>';
    (fe.drops||[]).forEach(function(q){var a=pj(q,Z_TOP),b=pj(q,0);land+='<path d="M'+f1(a[0]-5)+' '+f1(a[1])+'L'+f1(a[0]+5)+' '+f1(a[1])+'L'+f1(b[0]+6)+' '+f1(b[1])+'L'+f1(b[0]-6)+' '+f1(b[1])+'Z" fill="#9ADCF0"/><path d="M'+f1(a[0]-2)+' '+f1(a[1])+'L'+f1(b[0]-2)+' '+f1(b[1])+'M'+f1(a[0]+2)+' '+f1(a[1])+'L'+f1(b[0]+2.4)+' '+f1(b[1])+'" stroke="#FFFFFF" stroke-width="1" opacity=".85"/><ellipse cx="'+f1(b[0])+'" cy="'+f1(b[1]+1)+'" rx="8" ry="2.6" fill="#FFFFFF" opacity=".7"/>'})}
   /* plaza empedrada del pueblo: anillo de cantera, piedras y jardineras en cruz */
   if(fe&&fe.plaza){var pz=fe.plaza,cir=[],cir2=[];for(var ci=0;ci<32;ci++){var an=ci/32*Math.PI*2;cir.push([pz.x+Math.cos(an)*pz.R,pz.y+Math.sin(an)*pz.R]);cir2.push([pz.x+Math.cos(an)*(pz.R-3),pz.y+Math.sin(an)*(pz.R-3)])}
    land+='<path d="'+M.closed(cir,Z_TOP)+'" fill="#CDB993"/><path d="'+M.closed(cir2,Z_TOP)+'" fill="#E6D8BC"/>';
    var cr=G.rng(G.hs(L.id+"pz")),cb2="";for(ci=0;ci<pz.R*7;ci++){var a5=cr()*6.28,r5=Math.sqrt(cr())*(pz.R-4),q5=pj([pz.x+Math.cos(a5)*r5,pz.y+Math.sin(a5)*r5],Z_TOP);cb2+='<ellipse cx="'+f1(q5[0])+'" cy="'+f1(q5[1])+'" rx="1.6" ry=".9" fill="#D2C2A0"/>'}land+=cb2;
    [0,1,2,3].forEach(function(qd){var a6=qd*Math.PI/2+Math.PI/4,jx=pz.x+Math.cos(a6)*pz.R*.62,jy=pz.y+Math.sin(a6)*pz.R*.62,jp=[];for(var c7=0;c7<12;c7++){var b7=c7/12*Math.PI*2;jp.push([jx+Math.cos(b7)*6,jy+Math.sin(b7)*6])}land+='<path d="'+M.closed(jp,Z_TOP)+'" fill="#7CC35A" stroke="#B8A47E" stroke-width="1.2"/>'})}
   /* laguna con orilla de arena, agua en dos tonos, brillo y lirios */
   if(fe&&fe.pond){var pd=fe.pond,ps=G.hs(L.id+"p"),ring=ringPts(pd.x,pd.y,pd.r,ps,16),wat=ring.map(function(q){return [pd.x+(q[0]-pd.x)*.82,pd.y+(q[1]-pd.y)*.82]}),deep=ring.map(function(q){return [pd.x+(q[0]-pd.x)*.5,pd.y+(q[1]-pd.y)*.5]});
    land+='<path d="'+M.closed(ring,Z_TOP)+'" fill="#E9D7A6"/><path d="'+M.closed(wat,Z_TOP-1)+'" fill="#5DBADA"/><path d="'+M.closed(deep,Z_TOP-1)+'" fill="#4AA3C6"/>';
    land+='<path d="'+M.closed(wat,Z_TOP-1)+'" fill="none" stroke="#FFFFFF" stroke-width=".9" opacity=".6" transform="translate(0 1.2)"/>';
    var lr=G.rng(ps+1);for(var lp=0;lp<3;lp++){var la=lr()*6.28,lq=pj([pd.x+Math.cos(la)*pd.r*.5,pd.y+Math.sin(la)*pd.r*.5],Z_TOP-1);land+='<ellipse cx="'+f1(lq[0])+'" cy="'+f1(lq[1])+'" rx="2.4" ry="1.2" fill="#5FAE4E"/>'+(lp===0?'<circle cx="'+f1(lq[0]+.6)+'" cy="'+f1(lq[1]-.4)+'" r=".8" fill="#F7A8C4"/>':'')}}
   /* arroyo y cascada (montaña) */
   if(fe&&fe.fall){var fa=fe.fall,mid=[(fa.a[0]+fa.b[0])/2+8,(fa.a[1]+fa.b[1])/2-6],sp=[fa.a,mid,fa.b].map(function(q){return pj(q,Z_TOP)});
    land+='<path d="'+I.smooth(sp,false)+'" fill="none" stroke="#7FC8E6" stroke-width="5" stroke-linecap="round"/><path d="'+I.smooth(sp,false)+'" fill="none" stroke="#4FA8D8" stroke-width="2.6" stroke-linecap="round"/>';
    var top=pj(fa.b,Z_TOP),bot=pj(fa.c,0);land+='<path d="M'+f1(top[0]-3)+' '+f1(top[1])+'L'+f1(top[0]+3)+' '+f1(top[1])+'L'+f1(bot[0]+4)+' '+f1(bot[1]+Wd)+'L'+f1(bot[0]-4)+' '+f1(bot[1]+Wd)+'Z" fill="#BFE8F6"/><path d="M'+f1(top[0])+' '+f1(top[1])+'L'+f1(bot[0])+' '+f1(bot[1]+Wd)+'" stroke="#FFFFFF" stroke-width="1.2" opacity=".9"/>'}
   land+='</g></g>'});
  /* espuma al pie de la cascada */
  ALL.forEach(function(L){var fe2=FE[L.id];if(fe2&&fe2.fall){var c=pj(fe2.fall.c,0);sea+='<ellipse cx="'+f1(c[0])+'" cy="'+f1(c[1]+ST.wall+2)+'" rx="9" ry="3.4" fill="#FFFFFF" opacity=".75"/>'}});
  return {sea:sea,land:land}}
 /* vegetación: arboledas, arbustos en sus orillas, flores en claros, palmeras en la arena y rocas en el agua */
 function extra(W,push){
  var FE=feats(W);
  W.islands.forEach(function(L){var b=E.BIOME[L.area.biome]||E.BIOME.ciudad,rr=G.rng(G.hs(L.id+"v")),placed=[],fe=FE[L.id]||{},look=M.look(L.area.biome);
   function far(x,y,dn,de,dp){if(fe.plaza&&Math.hypot(fe.plaza.x-x,fe.plaza.y-y)<fe.plaza.R+4)return false;if(fe.river&&dp>6&&fe.river.some(function(r){return Math.hypot(r[0]-x,r[1]-y)<12}))return false;if(fe.hill&&Math.hypot(fe.hill.x-x,fe.hill.y-y)<fe.hill.R+5)return false;if(fe.pond&&Math.hypot(fe.pond.x-x,fe.pond.y-y)<fe.pond.r+4)return false;for(var m=0;m<L.nodes.length;m++)if(Math.hypot(L.nodes[m].x-x,L.nodes[m].y-y)<dn)return false;
    for(m=0;m<W.edges.length;m++){var q=W.edges[m].pts;for(var j=0;j<q.length;j++)if(Math.hypot(q[j][0]-x,q[j][1]-y)<de)return false}
    for(m=0;m<placed.length;m++)if(Math.hypot(placed[m][0]-x,placed[m][1]-y)<dp)return false;return true}
   function onTop(x,y,m){return W.inPoly(x,y,L.plateau)&&W.edgeDist(x,y,L.plateau)>(m||7)}
   function put(x,y,z,art){placed.push([x,y]);var p=pj([x,y],z);push(x+y,'<g transform="translate('+f1(p[0])+' '+f1(p[1])+')">'+art+'</g>')}
   var GREENS=ST.grass?["#3F8F57","#357F4C","#4A9A5E","#2F7448"]:["#4FAE52","#3F9C4A","#5DBB5A","#46A35C"],tk=b.tree==="pine"||ST.pines>.6?"treePine":"treeRound";
   /* arboledas */
   var groves=Math.round((1+L.nodes.length)*ST.groves);for(var gi=0,t=0;gi<groves&&t<300;t++){var a=rr()*6.28,r=Math.sqrt(rr())*L.R,cx=L.x+Math.cos(a)*r,cy=L.y+Math.sin(a)*r;
    if(!onTop(cx,cy,14)||!far(cx,cy,70,22,20))continue;gi++;var nT=4+Math.floor(rr()*3);
    for(var k=0,tt=0;k<nT&&tt<60;tt++){var x=cx+(rr()-.5)*34,y=cy+(rr()-.5)*30;if(!onTop(x,y)||!far(x,y,62,15,8.5))continue;k++;
     put(x,y,Z_TOP,E.one(ST.pines&&rr()<ST.pines?"treePine":tk==="treePine"&&rr()<.3?"treeRound":tk,{d:2,k:.72+rr()*.3,ph:rr()*3,flip:rr()<.5,c:GREENS[Math.floor(rr()*4)]}))}
    for(k=0;k<2;k++){var bx=cx+(rr()-.5)*44,by=cy+(rr()-.5)*40;if(onTop(bx,by)&&far(bx,by,60,13,7))put(bx,by,Z_TOP,E.one("bush",{d:2,k:.6+rr()*.25,ph:rr()*3}))}}
   /* flores y algo del bioma sueltos */
   for(var f=0,t2=0;f<L.nodes.length*2+1&&t2<200;t2++){var fx=L.x+(rr()-.5)*2*L.R,fy=L.y+(rr()-.5)*2*L.R;if(onTop(fx,fy)&&far(fx,fy,58,13,12)){f++;put(fx,fy,Z_TOP,E.one(f%2?"flowers":b.deco[Math.floor(rr()*b.deco.length)],{d:2,k:.85,ph:rr()*3}))}}
   /* palmeras en la arena */
   for(var pc=0,t3=0;pc<(L.nodes.length+2)*ST.palms/2&&t3<600;t3++){var a3=rr()*6.28,r3=L.R*(.7+rr()*.6),px=L.x+Math.cos(a3)*r3,py=L.y+Math.sin(a3)*r3;
    if(!W.inPoly(px,py,L.coast)||W.edgeDist(px,py,L.coast)<7||W.inPoly(px,py,L.plateau)||W.edgeDist(px,py,L.plateau)<4||!far(px,py,60,14,16))continue;pc++;
    put(px,py,0,E.one("palm",{d:2,k:.8+rr()*.15,ph:rr()*3,flip:Math.cos(a3)<0}))}
   /* cerro escalonado: dos o tres terrazas de pasto con talud, rocas que asoman y pinos arriba */
   if(fe.hill){var H=fe.hill,hs=G.hs(L.id+"h"),nl=Math.min(ST.layers,H.R>50?4:H.R>30?3:2),o="",hr=G.rng(hs),LZ=ST.lz;
    for(var li2=0;li2<nl;li2++){var r0=H.R*(1-(.8/nl)*li2),zb=Z_TOP+li2*LZ,pts=ringPts(H.x+(hr()-.5)*4,H.y+(hr()-.5)*4,r0,hs+li2,16),gT=I.tint(look.grass,.05*li2);
     o+='<path d="'+M.closed(pts,zb)+'" fill="'+I.shade(look.side,.04)+'"/><path d="'+M.closed(pts,zb+LZ/2)+'" fill="'+I.mix(look.side,look.grass,.4)+'"/><path d="'+M.closed(pts,zb+LZ)+'" fill="'+gT+'"/>';
     o+='<path d="'+M.closed(pts,zb+LZ)+'" fill="none" stroke="'+I.tint(gT,.4)+'" stroke-width="1" opacity=".7"/>';
     for(var ro=0;ro<2;ro++){var ra=Math.PI*.25+hr()*Math.PI*.5,rp=[H.x+Math.cos(ra)*r0*.92,H.y+Math.sin(ra)*r0*.92*.9],qq=pj(rp,zb+5);o+='<g transform="translate('+f1(qq[0])+' '+f1(qq[1])+')">'+E.one("rock",{d:2,k:.55+hr()*.3,c:"#9C968C"})+'</g>'}}
    var zt=Z_TOP+nl*LZ,tops=[[0,0,"treePine"],[-6,5,"treePine"],[6,-4,"rock"],[5,6,"bush"]];tops.forEach(function(q){var tp=pj([H.x+q[0],H.y+q[1]],zt);o+='<g transform="translate('+f1(tp[0])+' '+f1(tp[1])+')">'+E.one(q[2],{d:2,k:q[2]==="rock"?.8:.7,ph:hr()*3,c:q[2]==="treePine"?"#3F8F57":undefined})+'</g>'});
    push(H.x+H.y,o);placed.push([H.x,H.y])}
   /* puentes de madera donde un camino cruza el río */
   (fe.cross||[]).forEach(function(c){var z=c.top?Z_TOP:0,nx=-c.dy,ny=c.dx,Lg=11,Wb=4.2,bp=function(u,v,h){return pj([c.x+c.dx*u+nx*v,c.y+c.dy*u+ny*v],z+h)},o="";
    o+='<path d="M'+[bp(-Lg,-Wb,.6),bp(0,-Wb,2.6),bp(Lg,-Wb,.6),bp(Lg,Wb,.6),bp(0,Wb,2.6),bp(-Lg,Wb,.6)].map(function(q){return f1(q[0])+' '+f1(q[1])}).join("L")+'Z" fill="#B98552"/>';
    for(var u=-Lg+1.5;u<Lg;u+=2.2){var a=bp(u,-Wb,.6+2*(1-Math.abs(u)/Lg)),b=bp(u,Wb,.6+2*(1-Math.abs(u)/Lg));o+='<path d="M'+f1(a[0])+' '+f1(a[1])+'L'+f1(b[0])+' '+f1(b[1])+'" stroke="#8E6238" stroke-width=".45"/>'}
    [-Wb,Wb].forEach(function(v){var r1=[bp(-Lg,v,3.6),bp(0,v,5.6),bp(Lg,v,3.6)];o+='<path d="M'+f1(r1[0][0])+' '+f1(r1[0][1])+'Q'+f1(r1[1][0])+' '+f1(r1[1][1]-2)+' '+f1(r1[2][0])+' '+f1(r1[2][1])+'" stroke="#7A5236" stroke-width=".9" fill="none"/>';
     [-Lg,-Lg/2,0,Lg/2,Lg].forEach(function(u){var h0=.6+2*(1-Math.abs(u)/Lg),a=bp(u,v,h0),b=bp(u,v,h0+3);o+='<path d="M'+f1(a[0])+' '+f1(a[1])+'L'+f1(b[0])+' '+f1(b[1])+'" stroke="#7A5236" stroke-width=".8"/>'})});
    push(c.x+c.y+3,o)});
   /* selva: más árboles y helechos a la orilla del río */
   if(fe.river){for(var rv2=0,t5=0;rv2<14&&t5<300;t5++){var q6=fe.river[2+Math.floor(rr()*(fe.river.length-4))],sd2=rr()<.5?-1:1,ox=q6[0]+sd2*(11+rr()*8),oy=q6[1]-sd2*(6+rr()*8);
     if(!onTop(ox,oy,5)||!far(ox,oy,56,12,8))continue;var near2=fe.river.some(function(r){return Math.hypot(r[0]-ox,r[1]-oy)<9});if(near2)continue;rv2++;put(ox,oy,Z_TOP,E.one(rv2%3?"treeRound":"bush",{d:2,k:.65+rr()*.3,ph:rr()*3,flip:rr()<.5,c:["#2F8F4A","#3F9C4A","#277A40"][rv2%3]}))}}
   /* plaza: kiosco al centro, faroles y bancas alrededor, bugambilias en las jardineras */
   if(fe.plaza){var pz=fe.plaza,kp=pj([pz.x,pz.y],Z_TOP),k8="",kr=9,ang;
    var kc=function(x,y,z){var p=pj([pz.x+x,pz.y+y],Z_TOP+z);return f1(p[0]-kp[0])+' '+f1(p[1]-kp[1])};
    k8+='<ellipse cx="'+kc(2,2,0).split(" ")[0]+'" cy="'+(+kc(2,2,0).split(" ")[1]+2)+'" rx="15" ry="7" fill="#13213F" opacity=".14"/>';
    var ring=function(r,z){var a=[];for(var i=0;i<16;i++){ang=i/16*Math.PI*2;a.push(kc(Math.cos(ang)*r,Math.sin(ang)*r,z))}return a};
    k8+='<path d="M'+ring(kr+1,0).join("L")+'Z" fill="#C9B48C"/><path d="M'+ring(kr+1,3).join("L")+'Z" fill="#EFE3C8"/>';
    for(var i8=0;i8<8;i8++){ang=i8/8*Math.PI*2+Math.PI/8;var cxp=Math.cos(ang)*kr*.85,cyp=Math.sin(ang)*kr*.85;k8+='<path d="M'+kc(cxp,cyp,3)+'L'+kc(cxp,cyp,13)+'" stroke="#2F6B4F" stroke-width="1"/>'}
    k8+='<path d="M'+ring(kr+.6,13).join("L")+'Z" fill="#2F6B4F"/><path d="M'+ring(kr+1.4,14).join("L")+'L'+kc(0,0,22)+'Z" fill="#C9573F"/>';var tip=kc(0,0,22).split(" ");k8+='<circle cx="'+tip[0]+'" cy="'+(tip[1]-1)+'" r="1.2" fill="#F2C744"/>';
    push(pz.x+pz.y,'<g transform="translate('+f1(kp[0])+' '+f1(kp[1])+')">'+k8+'</g>');placed.push([pz.x,pz.y]);
    [0,1,2,3].forEach(function(qd){var a7=qd*Math.PI/2,lx=pz.x+Math.cos(a7)*pz.R*.82,ly=pz.y+Math.sin(a7)*pz.R*.82;put(lx,ly,Z_TOP,E.one("lamp",{d:2}));
     var a8=a7+Math.PI/4,jx=pz.x+Math.cos(a8)*pz.R*.62,jy=pz.y+Math.sin(a8)*pz.R*.62;put(jx,jy,Z_TOP,E.one("bush",{d:2,k:.75,c:"#C2378A"})+'<circle cx="-2" cy="-6" r="1" fill="#F07AC0"/><circle cx="2" cy="-7" r="1" fill="#F07AC0"/><circle cx="0" cy="-4" r=".9" fill="#FFB3E0"/>');
     var bx=pz.x+Math.cos(a8)*pz.R*.36,by=pz.y+Math.sin(a8)*pz.R*.36;if(qd%2===0)put(bx,by,Z_TOP,E.one("bench",{d:2}))})}
   /* lanchas de pescadores en la arena */
   if(ST.boats)for(var bt=0,t6=0;bt<2&&t6<400;t6++){var a9=rr()*6.28,r9=L.R*(.8+rr()*.5),bx2=L.x+Math.cos(a9)*r9,by2=L.y+Math.sin(a9)*r9;
    if(!W.inPoly(bx2,by2,L.coast)||W.edgeDist(bx2,by2,L.coast)<5||W.inPoly(bx2,by2,L.plateau)||!far(bx2,by2,60,16,18))continue;bt++;var bc=["#2F8FB5","#E2434B"][bt%2];
    put(bx2,by2,0,'<g transform="scale(1.6)"><ellipse cx="0" cy="1.6" rx="9" ry="2.6" fill="#13213F" opacity=".15"/><path d="M-9 -2Q-8 2 -3 2.4H5Q9 2 10 -2.6Z" fill="'+bc+'"/><path d="M-9 -2H10L9.4 -3.2H-8.6Z" fill="#FFFFFF"/><path d="M-4 -2.6h6v1.2h-6z" fill="#B98552"/></g>')}
   /* juncos en la orilla de la laguna */
   if(fe.pond){var pd2=fe.pond;for(var jr=0;jr<4;jr++){var ja=Math.PI*(.15+jr*.22),jx=pd2.x+Math.cos(ja)*pd2.r*.95,jy=pd2.y+Math.sin(ja)*pd2.r*.95*.9,jp=pj([jx,jy],Z_TOP);
     push(jx+jy,'<g transform="translate('+f1(jp[0])+' '+f1(jp[1])+')"><path d="M-1.4 0q-.6 -4 -1.6 -7M0 0v-8.4M1.4 0q.6 -4 1.8 -6.6" stroke="#4E8F3A" stroke-width=".9" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="-8.6" rx=".7" ry="1.6" fill="#8A5E3C"/></g>')}}
   /* cabos: rocas grandes donde el pasto llega al mar */
   (fe.rocks||[]).forEach(function(r){put(r[0],r[1],-2,E.one("rock",{d:2,k:r[2],c:"#9C968C"}))});
   /* muelle con su lancha */
   if(fe.pier){var pq=pj(fe.pier,0);push(fe.pier[0]+fe.pier[1]+20,'<g transform="translate('+f1(pq[0])+' '+f1(pq[1])+')">'+E.pier({d:2,len:40})+'</g>');
    var bq=pj([fe.pier[0]+46,fe.pier[1]+12],0);push(fe.pier[0]+fe.pier[1]+60,'<g transform="translate('+f1(bq[0])+' '+f1(bq[1])+')">'+E.sailboat({c:"#E0434B"})+'</g>')}
   /* faro en el cabo (acantilados) */
   if(fe.light){var lq=pj(fe.light,Z_TOP);push(fe.light[0]+fe.light[1],'<g transform="translate('+f1(lq[0])+' '+f1(lq[1])+') scale(.8)">'+E.lighthouse()+'</g>')}
   /* sombrillas y toallas en la playa (Caribe) */
   if(ST.umbrellas)for(var um=0,t4=0;um<L.nodes.length+1&&t4<400;t4++){var a4=rr()*6.28,r4=L.R*(.8+rr()*.5),ux=L.x+Math.cos(a4)*r4,uy=L.y+Math.sin(a4)*r4;
    if(!W.inPoly(ux,uy,L.coast)||W.edgeDist(ux,uy,L.coast)<6||W.inPoly(ux,uy,L.plateau)||!far(ux,uy,60,14,12))continue;um++;var uc=["#E2434B","#2F8FB5","#F2C744","#3FA34D"][um%4];
    put(ux,uy,0,'<rect x="-4" y="-.6" width="6" height="2.4" rx=".4" fill="'+(um%2?"#FFFFFF":uc)+'" transform="skewX(-30)"/><path d="M1 0V-9" stroke="#8A5E3C" stroke-width=".7"/><path d="M-5 -8.4Q1 -13 7 -8.4Z" fill="'+uc+'"/><path d="M1 -11.6L-1.4 -8.4M1 -11.6L3.4 -8.4" stroke="#FFFFFF" stroke-width=".5" opacity=".7"/>')}
   /* rocas en la orilla, medio en el agua */
   for(var rk=0;rk<(ST.strata?7:3);rk++){var i=Math.floor(rr()*L.coast.length),q=grow(L.coast,3,0,1)[i];if(far(q[0],q[1],50,18,14))put(q[0],q[1],-1.5,E.one("rock",{d:2,k:.7+rr()*.4}))}
  })}
 /* página de la pestaña */
 var NEWD={enfermeria:"Torre de vidrio con letrero de red neuronal y el centro de datos con rejillas y enfriadores en la azotea; robot de servicio.",odontologia:"Consultorio dental con letrero de muela y macetero.",fisioterapia:"Centro de rehabilitación de vidrio con pérgola de madera sobre las barras paralelas y pelotas de terapia.",qfb:"Laboratorio con cruz verde de farmacia, chimeneas de campanas de extracción y cilindros de gas encadenados.",educfisica:"Gimnasio de techo de arco y pista de atletismo con carriles y cancha.",
  industrial:"Nave de almacén con cortinas metálicas, andén de carga, tráiler y tarimas.",mecanica:"Taller con dos bahías, elevador, letrero de engrane, coche y llantas apiladas.",electrica:"Subestación: patio de grava cercado, dos transformadores con radiadores y boquillas, pórtico de llegada y torre de transmisión; los cables van de la torre al pórtico y a los transformadores.",electronica:"Oficinas de vidrio con letrero de chip y la nave de producción con techo de dientes de sierra, andén y camioneta.",quimicaing:"Planta química: columnas de destilación, tanques con escalera, esfera de gas, rack de tuberías de colores, quemador encendido y casa de control.",biomedica:"Laboratorio con letrero de electrocardiograma.",
  ia:"Centro de investigación de vidrio con letrero de red neuronal y un robot de servicio.",ciberseguridad:"Centro de operaciones cerrado, letrero de escudo con candado, cámaras y caseta con pluma.",quimica:"Laboratorio con chimeneas de extracción, letrero de matraz y regadera de emergencia.",biologia:"Laboratorio pequeño e invernadero de vidrio con plantas.",matematicas:"Facultad con pizarrón en la fachada (identidad de Euler) y escultura de sólidos.",
  contaduria:"Despacho en edificio de oficinas con letrero de calculadora y cajas de archivo.",economia:"Torre de oficinas y sala de remates bajo una cúpula de vidrio, con cotizaciones corriendo en su base; toro en la plaza.",actuaria:"Torre de una aseguradora con letrero de paraguas.",mercadotecnia:"Agencia con anuncio espectacular en la azotea.",comext:"Aduana, contenedores apilados y grúa pórtico sobre una hilera de contenedores.",turismo:"Hotel de playa con balcones, alberca, camastros con sombrilla y palmeras.",politicas:"Recinto legislativo de cantera con cúpula, escalinata y bandera de México.",rrii:"Sede internacional con hilera de banderas de varios países.",sociologia:"Centro comunitario con mural y kiosco de plaza.",trabajosocial:"Centro comunitario con letrero de corazón y área de juegos.",criminologia:"Fiscalía con escudo, patrulla y zona de evidencia acordonada.",
  grafico:"Estudio de diseño con franjas CMYK y letrero de pluma de vectores.",disindustrial:"Taller con ventanal, impresora 3D, materiales apilados y la silla prototipo en un pedestal.",animacion:"Estudio con cuadros de storyboard en la fachada y pantalla exterior con la pelota que rebota.",gastronomia:"Restaurante escuela de ladrillo con toldo, chimenea, gorro de chef y terraza."};
 var BETTER={moda:"Antes: una tiendita con toldo. Ahora: boutique de dos pisos con aparadores y maniquíes, toldo, letrero colgante y bolsa de compras.",comunicacion:"Antes: caja con antena. Ahora: televisora con letrero «AL AIRE», torre roja y blanca con antenas y unidad móvil con plato.",ambiental:"Antes: una casa y un molino. Ahora: tres aerogeneradores, paneles solares, techo verde y contenedores de reciclaje.",mecatronica:"Antes: nave sencilla. Ahora: techo de dientes de sierra, ventanal con la línea de brazos robóticos, andén y montacargas."};
 function page(el){
  var W=MAPGEN.build(ISOFIX.catalog(20),ISOFIX.AREAS),cur="tropical";try{cur=sessionStorage.getItem("vocatlas_i3")||"tropical"}catch(e){}if(!STY[cur])cur="tropical";
  function box3(R,vb){var b=R.box;return vb||[b[0]-90,b[1]-40,b[2]-b[0]+180,b[3]-b[1]+120].map(function(v){return Math.round(v)}).join(" ")}
  function svgOf(R,vb,vars){return '<svg class="gm isow i3-map" viewBox="'+box3(R,vb)+'" aria-hidden="true"'+(vars?' style="'+vars+'"':'')+'>'+R.svg+'</svg>'}
  var A=ISOMAP.render(W,{});
  var LS=W.islands.filter(function(L){return L.area.id==="salud"})[0]||W.islands[0],bx=[1e9,1e9,-1e9,-1e9];LS.coast.forEach(function(q){var p=pj(q,0);bx[0]=Math.min(bx[0],p[0]);bx[1]=Math.min(bx[1],p[1]);bx[2]=Math.max(bx[2],p[0]);bx[3]=Math.max(bx[3],p[1])});
  var vbz=[bx[0]-20,bx[1]-90,bx[2]-bx[0]+40,bx[3]-bx[1]+130].map(function(v){return Math.round(v)}).join(" ");
  var NAMES={medicina:"Medicina",derecho:"Derecho",computacion:"Computación",nutricion:"Nutrición",civil:"Ing. Civil",aeroespacial:"Ing. Aeroespacial",fisica:"Física",finanzas:"Finanzas",educacion:"Educación"};
  function nm(id){var c=(typeof C!=="undefined"?C:[]).filter(function(x){return x.id===id})[0];return c?c.name:NAMES[id]||id}
  var WHY={medicina:"Le faltaba la entrada de urgencias: ahora tiene bahía de asfalto, marquesina con postes, letrero URGENCIAS y la ambulancia estacionada ahí (no en el pasto).",
   derecho:"Los juzgados neoclásicos (como la Suprema Corte) son de cantera: el frontón y el techo ya no son de teja roja.",
   computacion:"Los servidores nunca van a la intemperie: se quitaron del jardín; en la azotea van los equipos de aire acondicionado.",
   nutricion:"Un puesto real tiene cajas de madera llenas de fruta, una por tipo, y un exhibidor escalonado al frente.",
   civil:"Una obra no tiene la planta baja terminada: concreto aparente, varillas arriba, malla verde de seguridad, cabina en la grúa, zapata y carga colgando.",
   aeroespacial:"La torre de servicio es de celosía de acero gris con pisos y brazos, hay foso de llamas bajo el cohete y tanque de agua (amortigua el despegue). El cohete es blanco con franja negra.",
   fisica:"Los telescopios no salen por arriba de la cúpula: la cúpula se abre por una ranura vertical y el telescopio queda adentro.",
   finanzas:"Un banco clásico (como el Banco de México) tiene escalinata a todo lo ancho, seis columnas, friso con su nombre, frontón y dos pisos de ventanas.",
   educacion:"Toda escuela en México tiene asta con la bandera nacional y patio cívico al frente."};
  var h='<section class="i3"><h2>Islas: rediseño</h2><p class="ia-n">Propuesta para revisar. <b>No está en la app</b>: el mapa de la app sigue igual hasta que lo apruebes. Mismo mundo de prueba (20 carreras). Hay cuatro estilos de isla: cada uno cambia la forma, el relieve y la costa, no solo los colores. Elige uno para verlo.</p>'+
   '<div class="i3-sty" role="radiogroup" aria-label="Estilo de isla">'+Object.keys(STY).map(function(k){return '<button type="button" role="radio" data-s="'+k+'" aria-checked="'+(k===cur)+'"><b>'+STY[k].n+'</b><small>'+STY[k].d+'</small></button>'}).join("")+'</div>'+
   '<div id="i3Out"></div><h3>Hoy</h3><div class="i3-wrap">'+svgOf(A)+'</div>';
  h+='<h3>Estructuras nuevas</h3><p class="ia-n">Las 31 carreras que usaban un edificio genérico ya tienen el suyo: el lugar real donde se ejerce, con la pieza que lo distingue.</p><div class="i3-grid i3-new">';
  var VB="-72 -110 144 160";ART.v3ids().filter(function(id){return NEWD[id]}).forEach(function(id){h+='<article class="i3-card"><h4>'+nm(id)+'</h4><div class="i3-one"><svg viewBox="'+VB+'" aria-hidden="true">'+ART.get(id,2,"s",{ver:"v3"})+'</svg></div><p>'+NEWD[id]+'</p></article>'});
  h+='</div><h3>Estructuras más completas</h3><p class="ia-n">Las que se veían muy sencillas. Izquierda: hoy. Derecha: nueva.</p><div class="i3-grid">';
  Object.keys(BETTER).forEach(function(id){h+='<article class="i3-card"><h4>'+nm(id)+'</h4><div class="i3-pair"><svg viewBox="'+VB+'" aria-hidden="true">'+ART.get(id,2,"s")+'</svg><svg viewBox="'+VB+'" aria-hidden="true">'+ART.get(id,2,"s",{ver:"v3"})+'</svg></div><p>'+BETTER[id]+'</p></article>'});
  h+='</div><h3>Estructuras corregidas</h3><p class="ia-n">Cada una comparada con fotos de edificios reales (Wikimedia Commons). Izquierda: hoy. Derecha: corregida.</p><div class="i3-grid">';
  Object.keys(WHY).forEach(function(id){h+='<article class="i3-card"><h4>'+NAMES[id]+'</h4><div class="i3-pair"><svg viewBox="'+VB+'" aria-hidden="true">'+ART.get(id,2,"s")+'</svg><svg viewBox="'+VB+'" aria-hidden="true">'+ART.get(id,2,"s",{ver:"v3"})+'</svg></div><p>'+WHY[id]+'</p></article>'});
  h+='</div></section>';el.innerHTML=h;
  var out=el.querySelector("#i3Out");
  function show(k){use(k);cur=k;try{sessionStorage.setItem("vocatlas_i3",k)}catch(e){}el.querySelectorAll(".i3-sty [data-s]").forEach(function(b){b.setAttribute("aria-checked",String(b.getAttribute("data-s")===k))});
   var B=ISOMAP.render(W,{ver:"v3",land3:land3,noDecor:true,extra:extra});
   out.innerHTML='<h3>Rediseño: '+STY[k].n+'</h3><div class="i3-wrap">'+svgOf(B,null,STY[k].vars)+'</div><h3>De cerca: isla de Salud</h3><div class="i3-close"><figure><div class="i3-wrap">'+svgOf(A,vbz)+'</div><figcaption>Hoy</figcaption></figure><figure><div class="i3-wrap">'+svgOf(B,vbz,STY[k].vars)+'</div><figcaption>'+STY[k].n+'</figcaption></figure></div>'}
  el.querySelectorAll(".i3-sty [data-s]").forEach(function(b){b.onclick=function(){out.innerHTML='<p class="ia-n">Armando el mapa…</p>';var k=b.getAttribute("data-s");setTimeout(function(){show(k)},30)}});
  show(cur)}
 function use(id){ST=STY[id]||STY.tropical;return ST}
 return {land3:land3,extra:extra,page:page,use:use,STY:STY};
})(ISO,ENV,MAPGEN,ISOMAP);
