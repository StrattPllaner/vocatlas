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
   var look=AREA_LOOK[L.area.biome]||AREA_LOOK.ciudad,dc=closed(L.coast,0),dp=closed(L.plateau,Z_TOP),cid=I.uid("mc");
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
  /* edificios: cada carrera se define una vez (completa y simplificada) y se reutiliza; usa la versión elegida */
  var defs=E.DEFS;
  W.nodes.forEach(function(n){
   var c=n.c,k=aff[c.id]!=null?aff[c.id]:.5,sc=(.92+.22*k).toFixed(3),p=pj([n.x,n.y],Z_TOP),v=opt.style||null,id=I.uid("b");
   var full,lite;
   if(opt.app){/* app: una sola versión (estructura), con id de edificio para tocar y redibujar delante de Rumbo */
    full=typeof ART!=="undefined"&&ART.has(c.id)?ART.get(c.id,opt.detail||2,"s"):E.generic(n.isle.area.biome,c.color,G.hs(c.id));
    defs+='<g id="'+id+'f">'+full+'</g>';
    objs.push({k:n.x+n.y,s:'<g class="poi m-b" id="poi-'+c.id+'" data-id="'+c.id+'" transform="translate('+f1(p[0])+' '+f1(p[1])+') scale('+sc+')"><use href="#'+id+'f"/></g>'});return}
   if(typeof ART!=="undefined"&&ART.has(c.id)){full=ART.get(c.id,2,v);lite=ART.get(c.id,0,v)}
   else{full=E.generic(n.isle.area.biome,c.color,G.hs(c.id));lite=full}
   defs+='<g id="'+id+'f">'+full+'</g><g id="'+id+'l">'+lite+'</g>';
   objs.push({k:n.x+n.y,s:'<g class="m-b'+(k>.66?' hi':'')+'" data-id="'+c.id+'" transform="translate('+f1(p[0])+' '+f1(p[1])+') scale('+sc+')">'+(k>.66?'<ellipse class="m-glow" cx="0" cy="4" rx="80" ry="40"/>':'')+'<use class="m-full" href="#'+id+'f"/><use class="m-lite" href="#'+id+'l"/></g>'});
  });
  /* vegetación y objetos según el bioma, lejos de edificios, caminos y costa */
  W.islands.forEach(function(L){
   var b=E.BIOME[L.area.biome]||E.BIOME.ciudad,rr=G.rng(G.hs(L.id+"d")),placed=[],tries=L.nodes.length*90+120,want=opt.budget?opt.budget.isle:L.nodes.length*4+4,kinds=opt.decor||null;
   for(var t=0;t<tries&&placed.length<want;t++){
    var a=rr()*Math.PI*2,r=Math.sqrt(rr())*(L.R+40),x=L.x+Math.cos(a)*r,y=L.y+Math.sin(a)*r;
    if(!W.inPoly(x,y,L.coast)||W.edgeDist(x,y,L.coast)<12)continue;
    var onTop=W.inPoly(x,y,L.plateau)&&W.edgeDist(x,y,L.plateau)>6;
    var ok=true;for(var m=0;m<L.nodes.length;m++)if(Math.hypot(L.nodes[m].x-x,L.nodes[m].y-y)<62){ok=false;break}
    if(!ok)continue;
    for(m=0;m<W.edges.length&&ok;m++){var e=W.edges[m],q=e.pts;for(var j=0;j<q.length;j+=1)if(Math.hypot(q[j][0]-x,q[j][1]-y)<15){ok=false;break}}
    for(m=0;m<placed.length&&ok;m++)if(Math.hypot(placed[m][0]-x,placed[m][1]-y)<15)ok=false;
    if(!ok)continue;placed.push([x,y]);
    var kind;if(kinds)kind=kinds[placed.length%kinds.length];else if(!onTop)kind=rr()<.55?"palm":"rock";else{var u=rr();kind=u<.5?(b.tree==="pine"?"treePine":b.tree==="palm"?(rr()<.6?"palm":"treeRound"):"treeRound"):b.deco[Math.floor(rr()*b.deco.length)]}
    var p=pj([x,y],onTop?Z_TOP:0);
    objs.push({k:x+y,s:'<g class="m-d" transform="translate('+f1(p[0])+' '+f1(p[1])+')">'+E.one(kind,{d:2,k:kind==="treeRound"||kind==="treePine"||kind==="palm"?.85:1,ph:rr()*3,flip:rr()<.5})+'</g>'});
   }
  });
  objs.sort(function(a,b){return a.k-b.k});
  /* mar abierto: faro en su islote, barcos, ballena, delfines; arriba, nubes y gaviotas */
  var bb=W.bbox,cx=(bb[0]+bb[2])/2,cy=(bb[1]+bb[3])/2;
  function seaSpot(seed,minD){var rr=G.rng(seed);for(var t=0;t<200;t++){var x=bb[0]-120+rr()*(bb[2]-bb[0]+240),y=bb[1]-120+rr()*(bb[3]-bb[1]+240),ok=true;
    for(var i=0;i<W.islands.length;i++){var L=W.islands[i];if(W.inPoly(x,y,L.coast)||W.edgeDist(x,y,L.coast)<minD){ok=false;break}}if(ok)return [x,y]}return [bb[0]-140,bb[1]-140]}
  function put(pt,s,cls){var p=pj(pt,0);return '<g class="'+(cls||"m-sea-o")+'" transform="translate('+f1(p[0])+' '+f1(p[1])+')">'+s+'</g>'}
  var seaObjs="",SEA=opt.sea||["lighthouse","sailboat","whale","dolphins","ferry","compass"];
  if(opt.budget)SEA=SEA.slice(0,opt.budget.sea);
  SEA.forEach(function(k,i){var sp=seaSpot(11+i*7,k==="lighthouse"?110:k==="compass"?150:80);
   var art=k==="lighthouse"?E.lighthouse():k==="sailboat"?E.sailboat({c:i%2?"#3F7DA6":"#E0434B"}):k==="ferry"?E.ferry():k==="whale"?E.whale():k==="dolphins"?E.dolphins():k==="compass"?E.compass():"";
   seaObjs+=put(sp,'<g class="m-sea-'+k+'">'+art+'</g>')});
  /* olas lentas y brillos */
  var gl="";for(var w=0;w<(opt.budget?24:60);w++){var sp=seaSpot(100+w,40),p=pj(sp,0);gl+='<path class="m-glint" style="--gd:'+(w%7*.6).toFixed(1)+'s" d="M'+f1(p[0])+' '+f1(p[1])+'q4 -2.4 8 0q4 -2.4 8 0" fill="none" stroke="#FFFFFF" stroke-width="1.3" stroke-linecap="round"/>'}
  for(var cl=0;cl<(opt.budget?1:3);cl++){var sp2=seaSpot(200+cl,260),p2=pj(sp2,0);top+='<g transform="translate('+f1(p2[0])+' '+f1(p2[1]-120)+')">'+E.cloud({k:1.4+cl%2*.5,ph:cl})+'</g>'}
  for(var gu=0;gu<(opt.budget?1:4);gu++){var sp3=seaSpot(300+gu,30),p3=pj(sp3,0);top+='<g transform="translate('+f1(p3[0])+' '+f1(p3[1]-70)+')">'+E.gull()+'</g>'}
  /* caja en pantalla */
  var sb=[1e9,1e9,-1e9,-1e9];W.islands.forEach(function(L){L.coast.forEach(function(p){var q=pj(p,0);sb[0]=Math.min(sb[0],q[0]);sb[1]=Math.min(sb[1],q[1]-120);sb[2]=Math.max(sb[2],q[0]);sb[3]=Math.max(sb[3],q[1]+20)})});
  var objsS=objs.map(function(o){return o.s}).join("");
  return {parts:{defs:defs,sea:sea+gl,land:land,roads:roads,seaObjs:seaObjs,objs:objsS,top:top},svg:'<defs>'+defs+'</defs><g class="m-sea">'+sea+gl+'</g><g class="m-land">'+land+'</g><g class="m-roads">'+roads+'</g>'+seaObjs+'<g class="m-objs">'+objs.map(function(o){return o.s}).join("")+'</g><g class="m-top">'+top+'</g>',box:sb};
 }

 /* ---------- visor ---------- */
 function mount(el,W,opt){
  opt=opt||{};var aff=opt.aff||{},ins=opt.insets||{t:0,b:0,l:0,r:0};
  /* celular: presupuesto de decoración (3 por isla, 2 en el mar) */
  var mobile=opt.mobile!=null?opt.mobile:el.clientWidth<600;if(mobile&&!opt.budget)opt.budget={isle:3,sea:2};
  var many=W.nodes.length>24;
  var r=render(W,opt);
  el.innerHTML='<div class="gm"><svg class="gm-svg" xmlns="http://www.w3.org/2000/svg"><g class="gm-w">'+r.svg+'</g></svg><div class="gm-l"></div></div>';
  var gm=el.firstChild,svg=gm.firstChild,gw=svg.firstChild,lay=gm.lastChild,view={s:1,tx:0,ty:0},labels=[],hits=[],lod="";
  if(mobile)gm.classList.add("is-mobile");
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
   var e=mk("gm-pin",'<i class="pn"></i><span class="br"><b class="nf">'+esc(n.c.name)+'</b><b class="ns">'+esc(n.c.short||n.c.name)+'</b></span>',{btn:true});e.style.setProperty("--c",n.c.color);e.setAttribute("data-id",n.id);e.setAttribute("aria-label",n.c.name);
   labels.push({k:"pin",el:e,x:p[0],y:p[1],pri:1+k*4,id:n.id});
   /* área de toque de al menos 48 px sobre el edificio */
   var hb=document.createElement("button");hb.type="button";hb.className="gm-hit";hb.setAttribute("data-id",n.id);hb.setAttribute("aria-label",n.c.name);hb.tabIndex=-1;lay.appendChild(hb);hits.push({el:hb,n:n,x:p[0],y:p[1]})});
  function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  /* medidas de cada etiqueta (una vez) */
  function measure(){gm.classList.add("m-measure");labels.forEach(function(l){l.el.style.transform="translate(-9999px,0)";l.el.style.visibility="";var b=l.el.getBoundingClientRect();l.w=b.width;l.h=b.height;if(l.k==="pin"){gm.classList.add("m-short");var b2=l.el.getBoundingClientRect();l.ws=b2.width;gm.classList.remove("m-short")}});gm.classList.remove("m-measure")}
  var BB={};function measureB(){each(gw.querySelectorAll('.m-b'),function(g){var bb=g.getBBox(),k=parseFloat((g.getAttribute('transform').match(/scale\(([\d.]+)\)/)||[0,1])[1]);var x0=Math.max(bb.x,-50),x1=Math.min(bb.x+bb.width,50);BB[g.getAttribute('data-id')]={x:x0*k,y:bb.y*k,w:(x1-x0)*k,h:(Math.min(bb.y+bb.height,14)-bb.y)*k}})}
  function each(l,f){for(var i=0;i<l.length;i++)f(l[i],i)}
  function clampS(s){return Math.max(.14,Math.min(1.8,s))}
  function W0(){return gm.clientWidth}function H0(){return gm.clientHeight}
  var IB=(function(){var b=[1e9,1e9,-1e9,-1e9];W.islands.forEach(function(L){L.coast.forEach(function(p){var q=pj(p,0);b[0]=Math.min(b[0],q[0]);b[1]=Math.min(b[1],q[1]-90);b[2]=Math.max(b[2],q[0]);b[3]=Math.max(b[3],q[1]+30)})});return b})();
  var lastFit=null;
  function fit(pad){lastFit=pad||.92;var w=W0()-ins.l-ins.r,h=H0()-ins.t-ins.b,bw=IB[2]-IB[0],bh=IB[3]-IB[1];if(w<10||h<10)return;view.s=clampS(Math.min(w/bw,h/bh)*(pad||.92));view.tx=ins.l+w/2-(IB[0]+bw/2)*view.s;view.ty=ins.t+h/2-(IB[1]+bh/2)*view.s;apply()}
  function focus(id,s){var n=W.byId[id];if(!n)return;var p=pj([n.x,n.y],Z_TOP);view.s=clampS(s||view.s);view.tx=ins.l+(W0()-ins.l-ins.r)/2-p[0]*view.s;view.ty=ins.t+(H0()-ins.t-ins.b)*.55-(p[1]-40)*view.s;apply()}
  var raf=0;function apply(){if(!raf)raf=requestAnimationFrame(draw)}
  function draw(){raf=0;
   gw.setAttribute("transform","translate("+f1(view.tx)+" "+f1(view.ty)+") scale("+view.s.toFixed(4)+")");
   var L=opt.lod||(view.s<.32?"far":view.s<.62?"mid":"near");if(L!==lod){gm.classList.remove("lod-"+lod);gm.classList.add("lod-"+L);lod=L}
   place();placeHits();
  }
  /* colocación de etiquetas sin encimarse: prioridad, posiciones candidatas y zonas ocupadas por edificios y barras */
  function place(){
   var s=view.s,w=W0(),h=H0(),occ=[],M=6;
   function hit(a){if(a.x<ins.l+M||a.y<ins.t+M||a.x+a.w>w-ins.r-M||a.y+a.h>h-ins.b-M)return true;for(var i=0;i<occ.length;i++){var o=occ[i];if(a.x<o.x+o.w&&a.x+a.w>o.x&&a.y<o.y+o.h&&a.y+a.h>o.y)return true}return false}
   var showPins=lod==="near"||(lod==="mid"&&!many),showSubs=lod==="mid"&&many,showAreas=lod==="far"||(lod==="mid"&&many);
   gm.classList.toggle("m-short",lod==="mid");
   /* los edificios ocupan su lugar (solo cuando se ven) */
   if(lod!=="far")W.nodes.forEach(function(n){var p=pj([n.x,n.y],Z_TOP),x=p[0]*s+view.tx,y=p[1]*s+view.ty,b=BB[n.id];occ.push({x:x+b.x*s,y:y+b.y*s,w:b.w*s,h:b.h*s,id:n.id})});
   var order=labels.slice().sort(function(a,b){return b.pri-a.pri});
   order.forEach(function(l){
    var vis=l.k==="pin"?showPins:l.k==="sl"?showSubs:showAreas,ok=null;
    if(vis){
     var x=l.x*s+view.tx,y=l.y*s+view.ty,lw=l.k==="pin"&&lod==="mid"?l.ws:l.w;
     var cands=l.k==="pin"?[[x-lw/2,y+30*s],[x-lw*.15,y+30*s],[x-lw*.85,y+30*s],[x+50*s,y-l.h*.3],[x-50*s-lw,y-l.h*.3],[x-lw/2,y+30*s+l.h*.7],[x-lw/2,y-96*s-l.h]]:l.k==="sl"?[[x-lw/2,y],[x-lw/2,y+l.h+4],[x-lw*.9,y],[x-lw*.1,y]]:[[x-lw/2,y-l.h],[x-lw*.8,y-l.h],[x-lw*.2,y-l.h],[x-lw/2,y-l.h*2]];
     for(var i=0;i<cands.length;i++){var a={x:cands[i][0],y:cands[i][1],w:lw,h:l.h};
      /* un letrero no choca con su propio edificio */
      var mine=null;if(l.id){for(var q=0;q<occ.length;q++)if(occ[q].id===l.id){mine=occ[q];occ.splice(q,1);break}}
      var bad=hit(a);if(mine)occ.push(mine);
      if(!bad){ok=a;break}}
    }
    if(ok){occ.push(ok);l.el.style.transform="translate3d("+f1(ok.x)+"px,"+f1(ok.y)+"px,0)";if(l.hid){l.el.style.visibility="";l.hid=false}}
    else if(!l.hid){l.el.style.visibility="hidden";l.hid=true}
   });
  }
  function placeHits(){var s=view.s,on=lod!=="far",sz=Math.max(48,Math.min(110*s,150*Math.SQRT2*s*.8));
   hits.forEach(function(h){if(!on){if(!h.hid){h.el.style.display="none";h.hid=true}return}if(h.hid){h.el.style.display="";h.hid=false}
    var x=h.x*s+view.tx,y=(h.y-38)*s+view.ty;h.el.style.width=h.el.style.height=f1(sz)+"px";h.el.style.transform="translate3d("+f1(x-sz/2)+"px,"+f1(y-sz/2)+"px,0)"})}
  /* gestos: arrastrar, pellizcar, rueda */
  var pts=new Map(),last=null,pd=0,moved=false;
  gm.addEventListener("pointerdown",function(e){pts.set(e.pointerId,[e.clientX,e.clientY]);try{gm.setPointerCapture(e.pointerId)}catch(_){}moved=false;last=[e.clientX,e.clientY];if(pts.size===2){var v=Array.from(pts.values());pd=Math.hypot(v[0][0]-v[1][0],v[0][1]-v[1][1])}});
  gm.addEventListener("pointermove",function(e){if(!pts.has(e.pointerId))return;var prev=pts.get(e.pointerId);pts.set(e.pointerId,[e.clientX,e.clientY]);
   if(pts.size===1){var dx=e.clientX-prev[0],dy=e.clientY-prev[1];if(Math.abs(e.clientX-last[0])+Math.abs(e.clientY-last[1])>6)moved=true;view.tx+=dx;view.ty+=dy;apply()}
   else if(pts.size===2){moved=true;var v=Array.from(pts.values()),d=Math.hypot(v[0][0]-v[1][0],v[0][1]-v[1][1]),cx=(v[0][0]+v[1][0])/2,cy=(v[0][1]+v[1][1])/2;zoomAt(cx,cy,d/(pd||d));pd=d}});
  function up(e){pts.delete(e.pointerId);if(!moved&&e.type==="pointerup"){var t=e.target.closest&&(e.target.closest(".gm-pin")||e.target.closest(".gm-hit")||e.target.closest(".m-b"));if(t&&opt.onTap)opt.onTap(t.getAttribute("data-id"))}}
  gm.addEventListener("pointerup",up);gm.addEventListener("pointercancel",up);
  /* en una página que se desplaza, la rueda sola baja la página; pellizcar (ctrl + rueda) acerca */
  gm.addEventListener("wheel",function(e){if(opt.wheelZoom===false&&!e.ctrlKey)return;e.preventDefault();zoomAt(e.clientX,e.clientY,Math.exp(-e.deltaY*(e.ctrlKey?.01:.0022)))},{passive:false});
  function zoomAt(cx,cy,k){var b=gm.getBoundingClientRect(),px=cx-b.left,py=cy-b.top,ns=clampS(view.s*k),f=ns/view.s;view.tx=px-(px-view.tx)*f;view.ty=py-(py-view.ty)*f;view.s=ns;apply()}
  /* si el contenedor cambia de tamaño (o estaba oculto al cargar), se vuelve a encuadrar */
  var lastStart=opt.start||null,sz=[0,0];
  function refit(){var w=W0(),h=H0();if(w<10||h<10||(w===sz[0]&&h===sz[1]))return;var first=!sz[0];sz=[w,h];measure();if(lastStart&&(first||!userMoved))startView(lastStart);else if(lastFit&&(first||!userMoved))fit(lastFit);else apply()}
  var userMoved=false;gm.addEventListener("pointerdown",function(){userMoved=true});gm.addEventListener("wheel",function(){userMoved=true});
  if(window.ResizeObserver)new ResizeObserver(refit).observe(gm);else window.addEventListener("resize",refit);
  /* vista inicial en celular: la escala que deja ver entre 6 y 8 carreras alrededor de una */
  function startView(id){var n=W.byId[id]||W.nodes[0],near=W.nodes.slice().sort(function(a,b){return Math.hypot(a.x-n.x,a.y-n.y)-Math.hypot(b.x-n.x,b.y-n.y)}).slice(0,7);
   var cx=0,cy=0;near.forEach(function(m){var p=pj([m.x,m.y],Z_TOP);cx+=p[0];cy+=p[1]});cx/=near.length;cy/=near.length;
   function center(sc){view.s=clampS(sc);view.tx=ins.l+(W0()-ins.l-ins.r)/2-cx*view.s;view.ty=ins.t+(H0()-ins.t-ins.b)*.46-(cy-40)*view.s}
   var best=.95;for(var sc=.95;sc>=.5;sc-=.05){center(sc);var c=0;W.nodes.forEach(function(m){var p=pj([m.x,m.y],Z_TOP),x=p[0]*sc+view.tx,y=p[1]*sc+view.ty;if(x>ins.l+30&&x<W0()-ins.r-30&&y>ins.t+60&&y<H0()-ins.b-40)c++});if(c>8)break;best=sc;if(c>=6)break}
   center(best);apply()}
  measureB();measure();fit();if(opt.start)startView(opt.start);
  return {startView:startView,view:view,fit:fit,focus:focus,zoomAt:zoomAt,apply:apply,setScale:function(s){var w=W0()/2,h=H0()/2;zoomAt(gm.getBoundingClientRect().left+w,gm.getBoundingClientRect().top+h,s/view.s)},world:W,el:gm};
 }
 return {render:render,mount:mount};
})(ISO,ENV,MAPGEN);
