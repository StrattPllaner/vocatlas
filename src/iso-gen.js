/* ================= generador del mapa a partir del catálogo =================
   Entrada: carreras {id,name,area,sub,tags[]} y áreas {id,name,biome}.
   Salida (coordenadas del suelo, antes de la proyección isométrica):
   islas con contorno orgánico, carreras con separación mínima, caminos (árbol de expansión mínima + extras),
   puentes entre islas afines y regiones por subárea. Todo es determinista: mismo catálogo, mismo mapa. */
var MAPGEN=(function(){
 function hs(str){var h=2166136261;for(var i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
 function rng(seed){var a=seed>>>0;return function(){a=(a+0x6D2B79F5)>>>0;var t=a;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296}}
 function jac(a,b){if(!a.length||!b.length)return 0;var n=0;for(var i=0;i<a.length;i++)if(b.indexOf(a[i])>-1)n++;return n/(a.length+b.length-n)}
 var D=150;          /* separación mínima entre carreras (la plataforma mide 46 de radio) */
 var GAP=90;         /* mar mínimo entre islas */

 /* ---------- 1. islas: radio por cantidad de carreras, acomodo compacto cerca de las más afines ---------- */
 function placeIslands(areas,byArea,tagsOf){
  var list=areas.filter(function(a){return byArea[a.id]&&byArea[a.id].length}).map(function(a){var n=byArea[a.id].length;return {a:a,n:n,R:D*.62*Math.sqrt(n)+70,x:0,y:0}});
  list.sort(function(p,q){return q.n-p.n||(p.a.id<q.a.id?-1:1)});
  function aff(p,q){return jac(tagsOf(p.a.id),tagsOf(q.a.id))}
  var placed=[];
  list.forEach(function(I,k){
   if(!k){placed.push(I);return}
   var best=null,bs=-1e9,cx=0,cy=0;
   placed.forEach(function(p){cx+=p.x;cy+=p.y});cx/=placed.length;cy/=placed.length;
   placed.forEach(function(J){
    for(var t=0;t<72;t++){
     var an=t/72*Math.PI*2,dd=I.R+J.R+GAP,x=J.x+Math.cos(an)*dd,y=J.y+Math.sin(an)*dd,ok=true;
     for(var m=0;m<placed.length;m++){var Q=placed[m];if(Math.hypot(x-Q.x,y-Q.y)<I.R+Q.R+GAP-1){ok=false;break}}
     if(!ok)continue;
     /* compacto: lo más cerca posible del centro; a igual distancia, junto a las islas más afines */
     var sc=-Math.hypot(x-cx,y-cy);placed.forEach(function(Q){sc+=aff(I,Q)*60*Math.max(0,1-(Math.hypot(x-Q.x,y-Q.y)-I.R-Q.R-GAP)/200)});
     if(sc>bs){bs=sc;best=[x,y]}
    }
   });
   I.x=best[0];I.y=best[1];placed.push(I);
  });
  return placed;
 }

 /* ---------- 2. carreras dentro de la isla: sectores por subárea y relajación con separación mínima ---------- */
 function placeCareers(I,cs,subs){
  var R=rng(hs(I.a.id)),n=cs.length,sk=subs.slice();
  var out=cs.map(function(c,i){return {c:c,x:0,y:0}});
  if(n===1){out[0].x=I.x;out[0].y=I.y;return out}
  var tot=0,start=R()*Math.PI*2,acc=0,sec={};
  sk.forEach(function(s){var m=cs.filter(function(c){return c.sub===s}).length;sec[s]={a0:start+acc/n*Math.PI*2,a1:start+(acc+m)/n*Math.PI*2,m:m};acc+=m});
  var cnt={};
  out.forEach(function(o){var s=sec[o.c.sub],k=cnt[o.c.sub]=(cnt[o.c.sub]||0)+1;var an=s.a0+(s.a1-s.a0)*(k-.5)/s.m,rr=(I.R-70)*(.35+.55*R());o.x=I.x+Math.cos(an)*rr;o.y=I.y+Math.sin(an)*rr});
  var lim=Math.max(20,I.R-62);
  for(var it=0;it<260;it++){
   var cool=1-it/260;
   for(var i=0;i<n;i++){var A=out[i],fx=0,fy=0;
    for(var j=0;j<n;j++){if(i===j)continue;var B=out[j],dx=A.x-B.x,dy=A.y-B.y,d=Math.hypot(dx,dy)||.01;
     if(d<D*1.08){var k2=(D*1.08-d)/d*.5;fx+=dx*k2;fy+=dy*k2}
     else{var w=(jac(A.c.tags,B.c.tags)*.5+(A.c.sub===B.c.sub?.4:0))*.004;fx-=dx*w;fy-=dy*w}
    }
    A.x+=fx*cool+(R()-.5)*.6*cool;A.y+=fy*cool+(R()-.5)*.6*cool;
    var ox=A.x-I.x,oy=A.y-I.y,od=Math.hypot(ox,oy);if(od>lim){A.x=I.x+ox/od*lim;A.y=I.y+oy/od*lim}
   }
  }
  return out;
 }

 /* ---------- 3. contorno orgánico: campo de manchas alrededor de cada carrera + ruido, curvas de nivel ---------- */
 function noise2(seed){var R=rng(seed),g=[];for(var i=0;i<64;i++)g.push(R()*Math.PI*2);
  return function(x,y){var s=0;for(var k=0;k<3;k++){var f=.006*(k+1),a=g[k*3],b=g[k*3+1],c=g[k*3+2];s+=Math.sin(x*f*Math.cos(a)+y*f*Math.sin(a)+c)*(.5/(k+1))+Math.sin(x*f*Math.cos(b)-y*f*Math.sin(b)+a)*(.35/(k+1))}return s}}
 function field(nodes,seed,sig){var nz=noise2(seed);return function(x,y){var v=0;for(var i=0;i<nodes.length;i++){var dx=x-nodes[i].x,dy=y-nodes[i].y;v+=Math.exp(-(dx*dx+dy*dy)/(sig*sig))}return v+nz(x,y)*.12}}
 function contour(F,bb,th,cell){
  /* marching squares → segmentos → lazos; se queda con el lazo más grande */
  var nx=Math.ceil((bb[2]-bb[0])/cell)+1,ny=Math.ceil((bb[3]-bb[1])/cell)+1,v=[],x,y;
  for(y=0;y<ny;y++){v[y]=[];for(x=0;x<nx;x++)v[y][x]=F(bb[0]+x*cell,bb[1]+y*cell)-th}
  function ip(x0,y0,x1,y1,a,b){var t=a/(a-b);return [bb[0]+(x0+(x1-x0)*t)*cell,bb[1]+(y0+(y1-y0)*t)*cell]}
  var seg=[];
  for(y=0;y<ny-1;y++)for(x=0;x<nx-1;x++){
   var a=v[y][x],b=v[y][x+1],c=v[y+1][x+1],d=v[y+1][x],k=(a>0?8:0)|(b>0?4:0)|(c>0?2:0)|(d>0?1:0);if(k===0||k===15)continue;
   var T=ip(x,y,x+1,y,a,b),Rr=ip(x+1,y,x+1,y+1,b,c),B=ip(x,y+1,x+1,y+1,d,c),L=ip(x,y,x,y+1,a,d);
   var map={1:[[L,B]],2:[[B,Rr]],3:[[L,Rr]],4:[[T,Rr]],5:[[L,T],[B,Rr]],6:[[T,B]],7:[[L,T]],8:[[L,T]],9:[[T,B]],10:[[T,Rr],[L,B]],11:[[T,Rr]],12:[[L,Rr]],13:[[B,Rr]],14:[[L,B]]};
   map[k].forEach(function(s){seg.push(s)});
  }
  /* unir segmentos por sus puntas */
  function key(p){return Math.round(p[0]*10)+","+Math.round(p[1]*10)}
  var adj={};seg.forEach(function(s,i){[key(s[0]),key(s[1])].forEach(function(k){(adj[k]=adj[k]||[]).push(i)})});
  var used=new Array(seg.length),loops=[];
  for(var i=0;i<seg.length;i++){if(used[i])continue;used[i]=1;var loop=[seg[i][0],seg[i][1]],cur=seg[i][1],guard=0;
   while(guard++<seg.length){var ks=adj[key(cur)]||[],nxt=-1;for(var q=0;q<ks.length;q++)if(!used[ks[q]]){nxt=ks[q];break}
    if(nxt<0)break;used[nxt]=1;var s2=seg[nxt],o=key(s2[0])===key(cur)?s2[1]:s2[0];loop.push(o);cur=o}
   loops.push(loop)}
  function area(p){var A=0;for(var i=0,j=p.length-1;i<p.length;j=i++)A+=(p[j][0]+p[i][0])*(p[j][1]-p[i][1]);return Math.abs(A/2)}
  loops.sort(function(p,q){return area(q)-area(p)});
  return loops[0]||[];
 }
 function chaikin(p,k){for(var it=0;it<k;it++){var o=[];for(var i=0;i<p.length;i++){var a=p[i],b=p[(i+1)%p.length];o.push([a[0]*.75+b[0]*.25,a[1]*.75+b[1]*.25],[a[0]*.25+b[0]*.75,a[1]*.25+b[1]*.75])}p=o}return p}
 function simplify(p,d){var o=[p[0]];for(var i=1;i<p.length;i++){var l=o[o.length-1];if(Math.hypot(p[i][0]-l[0],p[i][1]-l[1])>=d)o.push(p[i])}return o}
 function inPoly(x,y,P){var c=false;for(var i=0,j=P.length-1;i<P.length;j=i++){if((P[i][1]>y)!==(P[j][1]>y)&&x<(P[j][0]-P[i][0])*(y-P[i][1])/(P[j][1]-P[i][1])+P[i][0])c=!c}return c}
 function edgeDist(x,y,P){var m=1e9;for(var i=0,j=P.length-1;i<P.length;j=i++){var ax=P[j][0],ay=P[j][1],dx=P[i][0]-ax,dy=P[i][1]-ay,t=Math.max(0,Math.min(1,((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy||1)));m=Math.min(m,Math.hypot(x-ax-t*dx,y-ay-t*dy))}return m}

 /* ---------- 4. caminos: árbol de expansión mínima + atajos que no se cruzan ---------- */
 function cross(a,b,c,d){function o(p,q,r){return (q[0]-p[0])*(r[1]-p[1])-(q[1]-p[1])*(r[0]-p[0])}return o(a,b,c)*o(a,b,d)<0&&o(c,d,a)*o(c,d,b)<0}
 function mst(nodes){
  var n=nodes.length,inT=[0],E=[],best=[],from=[];if(n<2)return E;
  for(var i=0;i<n;i++){best[i]=Math.hypot(nodes[i].x-nodes[0].x,nodes[i].y-nodes[0].y);from[i]=0}
  var used={0:1};
  for(var k=1;k<n;k++){var m=-1,bv=1e18;for(i=0;i<n;i++)if(!used[i]&&best[i]<bv){bv=best[i];m=i}
   used[m]=1;E.push([from[m],m]);
   for(i=0;i<n;i++)if(!used[i]){var d=Math.hypot(nodes[i].x-nodes[m].x,nodes[i].y-nodes[m].y);if(d<best[i]){best[i]=d;from[i]=m}}}
  return E;
 }
 function roads(nodes){
  var E=mst(nodes),has={};E.forEach(function(e){has[e[0]+"-"+e[1]]=has[e[1]+"-"+e[0]]=1});
  var mx=0;E.forEach(function(e){mx=Math.max(mx,Math.hypot(nodes[e[0]].x-nodes[e[1]].x,nodes[e[0]].y-nodes[e[1]].y))});
  var cand=[];for(var i=0;i<nodes.length;i++)for(var j=i+1;j<nodes.length;j++)if(!has[i+"-"+j])cand.push([i,j,Math.hypot(nodes[i].x-nodes[j].x,nodes[i].y-nodes[j].y)]);
  cand.sort(function(a,b){return a[2]-b[2]});
  var extra=Math.ceil(nodes.length/4);
  for(var c=0;c<cand.length&&extra>0;c++){var e=cand[c];if(e[2]>mx*1.6)break;
   var A=[nodes[e[0]].x,nodes[e[0]].y],B=[nodes[e[1]].x,nodes[e[1]].y],bad=false;
   for(var q=0;q<E.length;q++){var f=E[q];if(f[0]===e[0]||f[1]===e[0]||f[0]===e[1]||f[1]===e[1])continue;if(cross(A,B,[nodes[f[0]].x,nodes[f[0]].y],[nodes[f[1]].x,nodes[f[1]].y])){bad=true;break}}
   /* que no pase encima de otra carrera */
   for(q=0;q<nodes.length&&!bad;q++){if(q===e[0]||q===e[1])continue;var px=nodes[q].x,py=nodes[q].y,dx=B[0]-A[0],dy=B[1]-A[1],t=Math.max(0,Math.min(1,((px-A[0])*dx+(py-A[1])*dy)/(dx*dx+dy*dy)));if(Math.hypot(px-A[0]-t*dx,py-A[1]-t*dy)<56)bad=true}
   if(!bad){E.push([e[0],e[1],1]);extra--}
  }
  return E;
 }
 function curve(a,b,seed){var R=rng(seed),dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy),k=(R()-.5)*.28*L,mx=(a[0]+b[0])/2-dy/L*k,my=(a[1]+b[1])/2+dx/L*k,o=[];for(var t=0;t<=1.0001;t+=1/Math.max(4,Math.round(L/14))){var u=1-t;o.push([u*u*a[0]+2*u*t*mx+t*t*b[0],u*u*a[1]+2*u*t*my+t*t*b[1]])}return o}

 /* ---------- generar ---------- */
 function build(cat,areas){
  var byArea={},tagsOf={};
  cat.forEach(function(c){(byArea[c.area]=byArea[c.area]||[]).push(c)});
  areas.forEach(function(a){var t={};(byArea[a.id]||[]).forEach(function(c){c.tags.forEach(function(g){t[g]=1})});tagsOf[a.id]=Object.keys(t)});
  var isl=placeIslands(areas,byArea,function(id){return tagsOf[id]});
  var W={islands:[],nodes:[],edges:[],bridges:[],subs:[],byId:{}};
  isl.forEach(function(I){
   var cs=byArea[I.a.id].slice().sort(function(p,q){return p.id<q.id?-1:1}),subs=[];
   cs.forEach(function(c){if(subs.indexOf(c.sub)<0)subs.push(c.sub)});
   var ns=placeCareers(I,cs,subs);
   var F=field(ns,hs(I.a.id),78),pad=200,xs=ns.map(function(o){return o.x}),ys=ns.map(function(o){return o.y});
   var bb=[Math.min.apply(null,xs)-pad,Math.min.apply(null,ys)-pad,Math.max.apply(null,xs)+pad,Math.max.apply(null,ys)+pad];
   var cell=12,coast=chaikin(simplify(contour(F,bb,.32,cell),10),2),plateau=chaikin(simplify(contour(F,bb,.52,cell),10),2);
   var isle={id:I.a.id,area:I.a,x:I.x,y:I.y,R:I.R,coast:coast,plateau:plateau,nodes:[],F:F};
   ns.forEach(function(o){var nd={id:o.c.id,c:o.c,x:o.x,y:o.y,isle:isle};isle.nodes.push(nd);W.nodes.push(nd);W.byId[o.c.id]=nd});
   roads(isle.nodes).forEach(function(e){var a=isle.nodes[e[0]],b=isle.nodes[e[1]];W.edges.push({a:a.id,b:b.id,extra:!!e[2],pts:curve([a.x,a.y],[b.x,b.y],hs(a.id+b.id))})});
   subs.forEach(function(s){var m=isle.nodes.filter(function(o){return o.c.sub===s}),x=0,y=0;m.forEach(function(o){x+=o.x;y+=o.y});W.subs.push({isle:isle.id,sub:s,x:x/m.length,y:y/m.length,n:m.length,ids:m.map(function(o){return o.id})})});
   W.islands.push(isle);
  });
  /* ---------- 5. puentes: árbol entre islas, pesado por cercanía y temas en común, más uno extra ---------- */
  var L=W.islands,cand=[];
  for(var i=0;i<L.length;i++)for(var j=i+1;j<L.length;j++){var gap=Math.hypot(L[i].x-L[j].x,L[i].y-L[j].y)-L[i].R-L[j].R;cand.push({i:i,j:j,w:gap/(1+3*jac(tagsOf[L[i].id],tagsOf[L[j].id]))})}
  cand.sort(function(a,b){return a.w-b.w});
  var comp=L.map(function(_,k){return k});function fd(k){while(comp[k]!==k)k=comp[k]=comp[comp[k]];return k}
  var chosen=[];cand.forEach(function(c){var a=fd(c.i),b=fd(c.j);if(a!==b){comp[a]=b;chosen.push(c)}});
  var rest=cand.filter(function(c){return chosen.indexOf(c)<0});if(rest.length&&L.length>2)chosen.push(rest[0]);
  chosen.forEach(function(c){
   var A=L[c.i],B=L[c.j],best=null,bd=1e9;
   for(var p=0;p<A.coast.length;p+=2)for(var q=0;q<B.coast.length;q+=2){var d=Math.hypot(A.coast[p][0]-B.coast[q][0],A.coast[p][1]-B.coast[q][1]);if(d<bd){bd=d;best=[A.coast[p],B.coast[q]]}}
   if(!best)return;
   /* el puente entra un poco a cada isla y se une con la carrera más cercana por un camino */
   var a=best[0],b=best[1],dx=b[0]-a[0],dy=b[1]-a[1],l=Math.hypot(dx,dy)||1,ux=dx/l,uy=dy/l;
   var a2=[a[0]-ux*16,a[1]-uy*16],b2=[b[0]+ux*16,b[1]+uy*16];
   W.bridges.push({a:A.id,b:B.id,p0:a2,p1:b2,len:l+32});
   [[A,a2],[B,b2]].forEach(function(z){var isle=z[0],pt=z[1],nn=null,nd=1e9;isle.nodes.forEach(function(o){var d=Math.hypot(o.x-pt[0],o.y-pt[1]);if(d<nd){nd=d;nn=o}});if(nn)W.edges.push({a:nn.id,b:null,dock:true,pts:curve([nn.x,nn.y],pt,hs(nn.id+"b"))})});
  });
  /* caja del mundo */
  var bx=[1e9,1e9,-1e9,-1e9];W.islands.forEach(function(I){I.coast.forEach(function(p){bx[0]=Math.min(bx[0],p[0]);bx[1]=Math.min(bx[1],p[1]);bx[2]=Math.max(bx[2],p[0]);bx[3]=Math.max(bx[3],p[1])})});
  W.bbox=bx;W.inPoly=inPoly;W.edgeDist=edgeDist;W.rng=rng;W.hs=hs;
  return W;
 }
 return {build:build,rng:rng,hs:hs,jac:jac,inPoly:inPoly,edgeDist:edgeDist};
})();
