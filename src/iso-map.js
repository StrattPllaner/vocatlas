/* ================= mapa isométrico: dibujo del mundo generado y visor con zoom, niveles de detalle y letreros ================= */
var ISOMAP=(function(I,E,G){
 var P=I.P,f1=I.f1;
 var Z_TOP=8; /* altura de la meseta de pasto: ahí se paran los edificios */
 function pj(p,z){return P(p[0],p[1],z||0)}
 /* contorno cerrado y suave (Catmull-Rom → Bézier) ya proyectado */
 function closed(pts,z,dy){var q=pts.map(function(p){var r=pj(p,z);return [r[0],r[1]+(dy||0)]}),n=q.length;if(n<3)return "";
  var d="M"+f1(q[0][0])+" "+f1(q[0][1]);
  for(var i=0;i<n;i++){var p0=q[(i-1+n)%n],p1=q[i],p2=q[(i+1)%n],p3=q[(i+2)%n];
   d+="C"+f1(p1[0]+(p2[0]-p0[0])/6)+" "+f1(p1[1]+(p2[1]-p0[1])/6)+" "+f1(p2[0]-(p3[0]-p1[0])/6)+" "+f1(p2[1]-(p3[1]-p1[1])/6)+" "+f1(p2[0])+" "+f1(p2[1])}
  return d+"Z"}
 function open(pts){return "M"+pts.map(function(p){return f1(p[0])+" "+f1(p[1])}).join("L")}
 var AREA_LOOK={
  jardin:{grass:"#8ED36B",grass2:"#79C25A",side:"#5FA347"},
  industria:{grass:"#A9CF72",grass2:"#97BE62",side:"#7FA453"},
  vidrio:{grass:"#86D49A",grass2:"#73C489",side:"#55A672"},
  ciudad:{grass:"#9BD47C",grass2:"#88C46A",side:"#6CA753"},
  barrio:{grass:"#A6D97A",grass2:"#93CA68",side:"#78AE52"}
 };
 var SAND="#F4DFA6",SAND_S="#D9B877",CLIFF="#C79A62";

 /* ---------- dibujo del mundo ---------- */
 function render(W,opt){
  opt=opt||{};var aff=opt.aff||{},sea="",land="",roads="",objs=[],top="",R=G.rng(7);
  function obj(x,y,s,cls){objs.push({k:x+y,s:'<g class="'+(cls||"m-o")+'">'+s+'</g>'})}
  /* aguas someras alrededor de cada isla: tres anillos */
  W.islands.forEach(function(L){var d=closed(L.coast,0);
   sea+='<path d="'+d+'" fill="none" stroke="var(--m-sh1)" stroke-width="150" stroke-linejoin="round"/>';
  });
  W.islands.forEach(function(L){var d=closed(L.coast,0);
   sea+='<path d="'+d+'" fill="var(--m-sh2)" stroke="var(--m-sh2)" stroke-width="70" stroke-linejoin="round"/>';
  });
  W.islands.forEach(function(L){var d=closed(L.coast,0);
   sea+='<path d="'+d+'" fill="var(--m-sh3)" stroke="var(--m-sh3)" stroke-width="30" stroke-linejoin="round"/>';
   sea+='<path class="m-foam" d="'+d+'" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="14 10" stroke-linecap="round" opacity=".75" transform="translate(0 6)"/>';
  });
  /* islas: acantilado de arena, playa, ladera y meseta de pasto con manchas de tierra y roca */
  W.islands.forEach(function(L,li){
   var look=AREA_LOOK[L.area.biome]||AREA_LOOK.ciudad,dc=closed(L.coast,0),dp=closed(L.plateau,Z_TOP),cid="mc"+li;
   land+='<g class="m-isle" data-a="'+L.id+'">';
   land+='<path d="'+closed(L.coast,0,14)+'" fill="'+CLIFF+'"/>';
   land+='<path d="'+dc+'" fill="'+SAND+'"/>';
   land+='<path d="'+closed(L.coast,0,1.5)+'" fill="none" stroke="#FFF6DA" stroke-width="1.6" opacity=".8" transform="translate(0 -3)"/>';
   land+='<path d="'+closed(L.plateau,0)+'" fill="'+look.side+'"/>';
   land+='<path d="'+dp+'" fill="'+look.grass+'"/>';
   land+='<clipPath id="'+cid+'"><path d="'+dp+'"/></clipPath><g clip-path="url(#'+cid+')">';
   /* manchas de pasto oscuro, tierra y roca */
   var rr=G.rng(G.hs(L.id+"t")),bx=W.bbox;
   for(var k=0;k<L.nodes.length*5+6;k++){var a=rr()*Math.PI*2,r=rr()*L.R,x=L.x+Math.cos(a)*r,y=L.y+Math.sin(a)*r,t=rr(),c=t<.6?look.grass2:t<.85?"#D3B886":"#BDB6AA",rad=14+rr()*26,p=pj([x,y],Z_TOP);
    land+='<ellipse cx="'+f1(p[0])+'" cy="'+f1(p[1])+'" rx="'+f1(rad*1.3)+'" ry="'+f1(rad*.62)+'" fill="'+c+'" opacity="'+(t<.6?.8:.55)+'"/>'}
   land+='</g>';
   land+='<path d="'+dp+'" fill="none" stroke="#C8F0A8" stroke-width="1.4" opacity=".7"/>';
   land+='</g>';
  });
  /* caminos de adoquín: borde, cuerpo y piedritas */
  var rd="";W.edges.forEach(function(e){var q=e.pts.map(function(p){var inT=W.inPoly(p[0],p[1],W.byId[e.a].isle.plateau);return pj(p,inT?Z_TOP:0)});rd+=open(q)});
  roads+='<path d="'+rd+'" fill="none" stroke="#B48F63" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>';
  roads+='<path d="'+rd+'" fill="none" stroke="#EAD5AA" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>';
  roads+='<path d="'+rd+'" fill="none" stroke="#D4BB8C" stroke-width="3.6" stroke-linecap="round" stroke-dasharray=".1 5.5"/>';
  roads+='<path d="'+rd+'" fill="none" stroke="#FFF2D2" stroke-width="1.2" stroke-linecap="round" stroke-dasharray=".1 9" transform="translate(-1 -1)" opacity=".8"/>';
  /* puentes de cuerda y madera con barandales */
  W.bridges.forEach(function(b){
   var a=b.p0,c=b.p1,dx=c[0]-a[0],dy=c[1]-a[1],l=Math.hypot(dx,dy),ux=dx/l,uy=dy/l,nx=-uy*7,ny=ux*7,s="";
   s+=I.poly([P(a[0]+nx,a[1]+ny,2),P(c[0]+nx,c[1]+ny,2),P(c[0]-nx,c[1]-ny,2),P(a[0]-nx,a[1]-ny,2)],"#9C7449",{st:false});
   for(var t=2;t<l-2;t+=4.2){var x=a[0]+ux*t,y=a[1]+uy*t;s+=I.poly([P(x+nx,y+ny,3),P(x+ux*3.2+nx,y+uy*3.2+ny,3),P(x+ux*3.2-nx,y+uy*3.2-ny,3),P(x-nx,y-ny,3)],(Math.round(t)%3)?"#C99A5B":"#D9AE70",{st:"#A57B4A",sw:.4})}
   [1,-1].forEach(function(sd){var post=[];for(var t=0;t<=l;t+=l/Math.max(2,Math.round(l/26))){var x=a[0]+ux*t+nx*sd,y=a[1]+uy*t+ny*sd;s+=I.line([P(x,y,2),P(x,y,11)],"#7A5634",1.8);post.push(P(x,y,10))}
    var dd="M"+f1(post[0][0])+" "+f1(post[0][1]);for(var k=1;k<post.length;k++){var m=[(post[k-1][0]+post[k][0])/2,(post[k-1][1]+post[k][1])/2+3];dd+="Q"+f1(m[0])+" "+f1(m[1])+" "+f1(post[k][0])+" "+f1(post[k][1])}
    s+='<path d="'+dd+'" fill="none" stroke="#E8D3A6" stroke-width="1.1"/>'});
   objs.push({k:(a[0]+c[0]+a[1]+c[1])/2-40,s:'<g class="m-o">'+s+'</g>'});
  });
  /* edificios */
  W.nodes.forEach(function(n){
   var c=n.c,art=typeof BLD!=="undefined"&&BLD[c.id],k=aff[c.id]!=null?aff[c.id]:.5,sc=(.92+.22*k).toFixed(3),p=pj([n.x,n.y],Z_TOP);
   var body=art?BLD[c.id]():E.generic(n.isle.area.biome,c.color,G.hs(c.id));
   objs.push({k:n.x+n.y,s:'<g class="m-b'+(k>.66?' hi':'')+'" data-id="'+c.id+'" transform="translate('+f1(p[0])+' '+f1(p[1])+') scale('+sc+')">'+(k>.66?'<ellipse class="m-glow" cx="0" cy="4" rx="80" ry="40"/>':'')+body+'</g>'});
  });
  /* vegetación y objetos según el bioma, lejos de edificios, caminos y costa */
  W.islands.forEach(function(L){
   var b=E.BIOME[L.area.biome]||E.BIOME.ciudad,rr=G.rng(G.hs(L.id+"d")),placed=[],tries=L.nodes.length*90+120,want=L.nodes.length*14+16;
   for(var t=0;t<tries&&placed.length<want;t++){
    var a=rr()*Math.PI*2,r=Math.sqrt(rr())*(L.R+40),x=L.x+Math.cos(a)*r,y=L.y+Math.sin(a)*r;
    if(!W.inPoly(x,y,L.coast)||W.edgeDist(x,y,L.coast)<12)continue;
    var onTop=W.inPoly(x,y,L.plateau)&&W.edgeDist(x,y,L.plateau)>6;
    var ok=true;for(var m=0;m<L.nodes.length;m++)if(Math.hypot(L.nodes[m].x-x,L.nodes[m].y-y)<62){ok=false;break}
    if(!ok)continue;
    for(m=0;m<W.edges.length&&ok;m++){var e=W.edges[m],q=e.pts;for(var j=0;j<q.length;j+=1)if(Math.hypot(q[j][0]-x,q[j][1]-y)<15){ok=false;break}}
    for(m=0;m<placed.length&&ok;m++)if(Math.hypot(placed[m][0]-x,placed[m][1]-y)<15)ok=false;
    if(!ok)continue;placed.push([x,y]);
    var kind;if(!onTop)kind=rr()<.55?"palm":"rock";else{var u=rr();kind=u<.5?(b.tree==="pine"?"treePine":b.tree==="palm"?(rr()<.6?"palm":"treeRound"):"treeRound"):b.deco[Math.floor(rr()*b.deco.length)]}
    var p=pj([x,y],onTop?Z_TOP:0);
    objs.push({k:x+y,s:'<g class="m-d" transform="translate('+f1(p[0])+' '+f1(p[1])+')">'+E.one(kind,G.hs(L.id)+t)+'</g>'});
   }
  });
  objs.sort(function(a,b){return a.k-b.k});
  /* mar abierto: faro en su islote, barcos, ballena, delfines; arriba, nubes y gaviotas */
  var bb=W.bbox,cx=(bb[0]+bb[2])/2,cy=(bb[1]+bb[3])/2;
  function seaSpot(seed,minD){var rr=G.rng(seed);for(var t=0;t<200;t++){var x=bb[0]-120+rr()*(bb[2]-bb[0]+240),y=bb[1]-120+rr()*(bb[3]-bb[1]+240),ok=true;
    for(var i=0;i<W.islands.length;i++){var L=W.islands[i];if(W.inPoly(x,y,L.coast)||W.edgeDist(x,y,L.coast)<minD){ok=false;break}}if(ok)return [x,y]}return [bb[0]-140,bb[1]-140]}
  function put(pt,s,cls){var p=pj(pt,0);return '<g class="'+(cls||"m-sea-o")+'" transform="translate('+f1(p[0])+' '+f1(p[1])+')">'+s+'</g>'}
  var seaObjs="";
  seaObjs+=put(seaSpot(11,110),E.lighthouse());
  seaObjs+=put(seaSpot(12,70),E.sailboat("#E2434B"))+put(seaSpot(13,70),E.sailboat("#3F7DA6"))+put(seaSpot(14,90),E.ferry());
  seaObjs+=put(seaSpot(15,120),E.whale())+put(seaSpot(16,80),E.dolphin()+'<g transform="translate(16 6)">'+E.dolphin()+'</g>');
  /* rosa de los vientos acostada sobre el agua */
  var cp=pj(seaSpot(17,150),0);seaObjs+='<g class="m-rose" transform="matrix(.9 .45 -.9 .45 '+f1(cp[0])+' '+f1(cp[1])+')">'+E.compass()+'</g>';
  /* olas lentas y brillos */
  var gl="";for(var w=0;w<70;w++){var sp=seaSpot(100+w,40),p=pj(sp,0);gl+='<path class="m-glint" style="--gd:'+(w%7*.6).toFixed(1)+'s" d="M'+f1(p[0])+' '+f1(p[1])+'q4 -2.4 8 0q4 -2.4 8 0" fill="none" stroke="#FFFFFF" stroke-width="1.3" stroke-linecap="round"/>'}
  for(var cl=0;cl<4;cl++){var sp2=seaSpot(200+cl,0),p2=pj(sp2,0);top+='<g transform="translate('+f1(p2[0])+' '+f1(p2[1]-120)+')">'+E.cloud(1.4+cl%2*.5)+'</g>'}
  for(var gu=0;gu<5;gu++){var sp3=seaSpot(300+gu,30),p3=pj(sp3,0);top+='<g transform="translate('+f1(p3[0])+' '+f1(p3[1]-70)+')">'+E.gull()+'</g>'}
  /* caja en pantalla */
  var sb=[1e9,1e9,-1e9,-1e9];W.islands.forEach(function(L){L.coast.forEach(function(p){var q=pj(p,0);sb[0]=Math.min(sb[0],q[0]);sb[1]=Math.min(sb[1],q[1]-120);sb[2]=Math.max(sb[2],q[0]);sb[3]=Math.max(sb[3],q[1]+20)})});
  return {svg:'<g class="m-sea">'+sea+gl+'</g><g class="m-land">'+land+'</g><g class="m-roads">'+roads+'</g>'+seaObjs+'<g class="m-objs">'+objs.map(function(o){return o.s}).join("")+'</g><g class="m-top">'+top+'</g>',box:sb};
 }

 /* ---------- visor ---------- */
 function mount(el,W,opt){
  opt=opt||{};var aff=opt.aff||{},ins=opt.insets||{t:0,b:0,l:0,r:0};
  var r=render(W,opt);
  el.innerHTML='<div class="gm"><svg class="gm-svg" xmlns="http://www.w3.org/2000/svg"><g class="gm-w">'+r.svg+'</g></svg><div class="gm-l"></div></div>';
  var gm=el.firstChild,svg=gm.firstChild,gw=svg.firstChild,lay=gm.lastChild,view={s:1,tx:0,ty:0},labels=[],lod="";
  /* etiquetas: áreas, subáreas con contador y letreros colgantes de cada carrera */
  function mk(cls,html,data){var e=document.createElement(data&&data.btn?"button":"div");e.className=cls;e.innerHTML=html;if(data&&data.btn)e.type="button";lay.appendChild(e);return e}
  W.islands.forEach(function(L){
   /* el nombre del área va sobre la isla, hacia el norte de la pantalla */
   var top=null;L.coast.forEach(function(p){var q=pj(p,0);if(!top||q[1]<top[1])top=q});
   var c=pj([L.x,L.y],0);
   labels.push({k:"al",el:mk("gm-al",'<span>'+esc(L.area.name)+'</span>'),x:c[0],y:top[1]-6,pri:10,isle:L.id});
  });
  /* la subárea se nombra al frente de su grupo de edificios */
  W.subs.forEach(function(s){var xs=0,yb=-1e9;s.ids.forEach(function(id){var p=pj([W.byId[id].x,W.byId[id].y],Z_TOP);xs+=p[0];yb=Math.max(yb,p[1])});labels.push({k:"sl",el:mk("gm-sl",'<span>'+esc(s.sub)+'</span><b>'+s.n+'</b>'),x:xs/s.ids.length,y:yb+44,pri:5})});
  W.nodes.forEach(function(n){var p=pj([n.x,n.y],Z_TOP),k=aff[n.id]!=null?aff[n.id]:.5;
   var e=mk("gm-pin",'<i class="pn"></i><span class="br"><b>'+esc(n.c.name)+'</b></span>',{btn:true});e.style.setProperty("--c",n.c.color);e.setAttribute("data-id",n.id);
   labels.push({k:"pin",el:e,x:p[0],y:p[1],pri:1+k*4,id:n.id})});
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  /* medidas de cada etiqueta (una vez) */
  function measure(){labels.forEach(function(l){l.el.style.transform="translate(-9999px,0)";l.el.style.visibility="";var b=l.el.getBoundingClientRect();l.w=b.width;l.h=b.height})}
  var BB={};function measureB(){each(gw.querySelectorAll('.m-b'),function(g){var bb=g.getBBox(),k=parseFloat((g.getAttribute('transform').match(/scale\(([\d.]+)\)/)||[0,1])[1]);var x0=Math.max(bb.x,-50),x1=Math.min(bb.x+bb.width,50);BB[g.getAttribute('data-id')]={x:x0*k,y:bb.y*k,w:(x1-x0)*k,h:(Math.min(bb.y+bb.height,14)-bb.y)*k}})}
  function each(l,f){for(var i=0;i<l.length;i++)f(l[i],i)}
  function clampS(s){return Math.max(.14,Math.min(1.8,s))}
  function W0(){return gm.clientWidth}function H0(){return gm.clientHeight}
  function fit(pad){var w=W0()-ins.l-ins.r,h=H0()-ins.t-ins.b,bw=r.box[2]-r.box[0],bh=r.box[3]-r.box[1];view.s=clampS(Math.min(w/bw,h/bh)*(pad||.92));view.tx=ins.l+w/2-(r.box[0]+bw/2)*view.s;view.ty=ins.t+h/2-(r.box[1]+bh/2)*view.s;apply()}
  function focus(id,s){var n=W.byId[id];if(!n)return;var p=pj([n.x,n.y],Z_TOP);view.s=clampS(s||view.s);view.tx=ins.l+(W0()-ins.l-ins.r)/2-p[0]*view.s;view.ty=ins.t+(H0()-ins.t-ins.b)*.55-(p[1]-40)*view.s;apply()}
  var raf=0;function apply(){if(!raf)raf=requestAnimationFrame(draw)}
  function draw(){raf=0;
   gw.setAttribute("transform","translate("+f1(view.tx)+" "+f1(view.ty)+") scale("+view.s.toFixed(4)+")");
   var L=view.s<.32?"far":view.s<.62?"mid":"near";if(L!==lod){gm.classList.remove("lod-"+lod);gm.classList.add("lod-"+L);lod=L}
   place();
  }
  /* colocación de etiquetas sin encimarse: prioridad, posiciones candidatas y zonas ocupadas por edificios y barras */
  function place(){
   var s=view.s,w=W0(),h=H0(),occ=[],M=6;
   function hit(a){if(a.x<ins.l+M||a.y<ins.t+M||a.x+a.w>w-ins.r-M||a.y+a.h>h-ins.b-M)return true;for(var i=0;i<occ.length;i++){var o=occ[i];if(a.x<o.x+o.w&&a.x+a.w>o.x&&a.y<o.y+o.h&&a.y+a.h>o.y)return true}return false}
   var showPins=lod==="near",showSubs=lod==="mid",showAreas=lod!=="near";
   /* los edificios ocupan su lugar (solo cuando se ven) */
   if(lod!=="far")W.nodes.forEach(function(n){var p=pj([n.x,n.y],Z_TOP),x=p[0]*s+view.tx,y=p[1]*s+view.ty,b=BB[n.id];occ.push({x:x+b.x*s,y:y+b.y*s,w:b.w*s,h:b.h*s,id:n.id})});
   var order=labels.slice().sort(function(a,b){return b.pri-a.pri});
   order.forEach(function(l){
    var vis=l.k==="pin"?showPins:l.k==="sl"?showSubs:showAreas,ok=null;
    if(vis){
     var x=l.x*s+view.tx,y=l.y*s+view.ty;
     var cands=l.k==="pin"?[[x-l.w/2,y+30*s],[x-l.w*.15,y+30*s],[x-l.w*.85,y+30*s],[x+50*s,y-l.h*.3],[x-50*s-l.w,y-l.h*.3],[x-l.w/2,y+30*s+l.h*.7],[x-l.w/2,y-96*s-l.h]]:l.k==="sl"?[[x-l.w/2,y],[x-l.w/2,y+l.h+4],[x-l.w*.9,y],[x-l.w*.1,y]]:[[x-l.w/2,y-l.h],[x-l.w*.8,y-l.h],[x-l.w*.2,y-l.h],[x-l.w/2,y-l.h*2]];
     for(var i=0;i<cands.length;i++){var a={x:cands[i][0],y:cands[i][1],w:l.w,h:l.h};
      /* un letrero no choca con su propio edificio */
      var mine=null;if(l.id){for(var q=0;q<occ.length;q++)if(occ[q].id===l.id){mine=occ[q];occ.splice(q,1);break}}
      var bad=hit(a);if(mine)occ.push(mine);
      if(!bad){ok=a;break}}
    }
    if(ok){occ.push(ok);l.el.style.transform="translate3d("+f1(ok.x)+"px,"+f1(ok.y)+"px,0)";if(l.hid){l.el.style.visibility="";l.hid=false}}
    else if(!l.hid){l.el.style.visibility="hidden";l.hid=true}
   });
  }
  /* gestos: arrastrar, pellizcar, rueda */
  var pts=new Map(),last=null,pd=0,moved=false;
  gm.addEventListener("pointerdown",function(e){pts.set(e.pointerId,[e.clientX,e.clientY]);try{gm.setPointerCapture(e.pointerId)}catch(_){}moved=false;last=[e.clientX,e.clientY];if(pts.size===2){var v=Array.from(pts.values());pd=Math.hypot(v[0][0]-v[1][0],v[0][1]-v[1][1])}});
  gm.addEventListener("pointermove",function(e){if(!pts.has(e.pointerId))return;var prev=pts.get(e.pointerId);pts.set(e.pointerId,[e.clientX,e.clientY]);
   if(pts.size===1){var dx=e.clientX-prev[0],dy=e.clientY-prev[1];if(Math.abs(e.clientX-last[0])+Math.abs(e.clientY-last[1])>6)moved=true;view.tx+=dx;view.ty+=dy;apply()}
   else if(pts.size===2){moved=true;var v=Array.from(pts.values()),d=Math.hypot(v[0][0]-v[1][0],v[0][1]-v[1][1]),cx=(v[0][0]+v[1][0])/2,cy=(v[0][1]+v[1][1])/2;zoomAt(cx,cy,d/(pd||d));pd=d}});
  function up(e){pts.delete(e.pointerId);if(!moved&&e.type==="pointerup"){var t=e.target.closest&&(e.target.closest(".gm-pin")||e.target.closest(".m-b"));if(t&&opt.onTap)opt.onTap(t.getAttribute("data-id"))}}
  gm.addEventListener("pointerup",up);gm.addEventListener("pointercancel",up);
  /* en una página que se desplaza, la rueda sola baja la página; pellizcar (ctrl + rueda) acerca */
  gm.addEventListener("wheel",function(e){if(opt.wheelZoom===false&&!e.ctrlKey)return;e.preventDefault();zoomAt(e.clientX,e.clientY,Math.exp(-e.deltaY*(e.ctrlKey?.01:.0022)))},{passive:false});
  function zoomAt(cx,cy,k){var b=gm.getBoundingClientRect(),px=cx-b.left,py=cy-b.top,ns=clampS(view.s*k),f=ns/view.s;view.tx=px-(px-view.tx)*f;view.ty=py-(py-view.ty)*f;view.s=ns;apply()}
  window.addEventListener("resize",function(){measure();apply()});
  measureB();measure();fit();
  return {view:view,fit:fit,focus:focus,zoomAt:zoomAt,apply:apply,setScale:function(s){var w=W0()/2,h=H0()/2;zoomAt(gm.getBoundingClientRect().left+w,gm.getBoundingClientRect().top+h,s/view.s)},world:W,el:gm};
 }
 return {render:render,mount:mount};
})(ISO,ENV,MAPGEN);
