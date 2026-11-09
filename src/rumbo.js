/* ================= Rumbo: modelos =================
   v1 = el actual (rumboSVG). Modelos nuevos, de estilo plano: formas grandes y redondas, un solo tono de sombra,
   brillo mínimo, ojos grandes con párpados y cejas simples.
   A: globo terráqueo · B: brújula · C: globo dentro de un aro de brújula.
   Todos usan las mismas clases (rb-b, rb-head, rb-n, rb-face, rb-gaze, rb-eyes, rb-hat, rb-legL/R, rb-armL/R)
   y coordenadas de 0 a 100 con pivotes propios (clase rbx en el svg). */
var RUMBO=(function(){
 var N=0;
 var INK="#1B2340",LEG="#3E68A0",LEGS="#2C4F80",SOLE="#223E66",CAP="#9A5A32",CAPS="#764224",CAPH="#B97A4C",LIN="#EED3AB",STRAP="#5E3420",BR="#E6AA4D",BRS="#C68A31",BRH="#F8D88F",LENS="#A9D8DE",GOLD="#F2B13C",GOLDS="#D88E25",CHK="#F4A08E";
 /* proyección de un disco plano a una esfera: lo del borde se aprieta */
 function sph(pts,cx,cy,r){return pts.map(function(q){var d=Math.hypot(q[0],q[1])||1e-6,t=Math.min(1,d)*Math.PI/2,k=Math.sin(t)/d;return [cx+q[0]*k*r,cy+q[1]*k*r]})}
 function sm(q){var n=q.length,d="M"+q[0][0].toFixed(2)+" "+q[0][1].toFixed(2);for(var i=0;i<n;i++){var p0=q[(i-1+n)%n],p1=q[i],p2=q[(i+1)%n],p3=q[(i+2)%n];d+="C"+(p1[0]+(p2[0]-p0[0])/6).toFixed(2)+" "+(p1[1]+(p2[1]-p0[1])/6).toFixed(2)+" "+(p2[0]-(p3[0]-p1[0])/6).toFixed(2)+" "+(p2[1]-(p3[1]-p1[1])/6).toFixed(2)+" "+p2[0].toFixed(2)+" "+p2[1].toFixed(2)}return d+"Z"}
 /* sombra plana: media luna abajo a la derecha (círculo menos círculo desplazado) */
 function crescent(cx,cy,r,dx,dy,fill,op){return '<path d="M'+(cx-r)+' '+cy+'A'+r+' '+r+' 0 1 0 '+(cx+r)+' '+cy+'A'+r+' '+r+' 0 1 0 '+(cx-r)+' '+cy+'ZM'+(cx-r+dx)+' '+(cy+dy)+'A'+r+' '+r+' 0 1 1 '+(cx+r+dx)+' '+(cy+dy)+'A'+r+' '+r+' 0 1 1 '+(cx-r+dx)+' '+(cy+dy)+'Z" fill="'+fill+'" fill-rule="evenodd"'+(op!=null?' opacity="'+op+'"':'')+'/>'}

 /* ---------- cuerpos ---------- */
 var CX=50,CY=55;
 var LANDS=[[[-.62,.44],[-.38,.48],[-.18,.62],[-.22,.8],[-.44,.86],[-.68,.72]],[[.2,.64],[.4,.52],[.64,.54],[.72,.72],[.5,.84],[.26,.82]],[[-.8,-.12],[-.62,-.22],[-.5,-.06],[-.6,.12],[-.78,.08]],[[.56,-.14],[.74,-.2],[.82,0],[.66,.08]]];
 function globe(id,r){var s='<clipPath id="'+id+'g"><circle cx="'+CX+'" cy="'+CY+'" r="'+r+'"/></clipPath>';
  s+='<circle cx="'+CX+'" cy="'+CY+'" r="'+r+'" fill="#F7E0BD"/>';
  s+='<g clip-path="url(#'+id+'g)"><g fill="#7FA2B3">'+LANDS.map(function(L){return '<path d="'+sm(sph(L,CX,CY,r))+'"/>'}).join("")+'</g>'+
   /* un solo tono de sombra encima de mar y tierra */
   crescent(CX,CY,r,-3.4,-3.8,"#6E4A26",.16)+'</g>';
  s+='<path d="M'+(CX-r*.86).toFixed(1)+' '+(CY+r*.1).toFixed(1)+'A'+r+' '+r+' 0 0 1 '+(CX-r*.66).toFixed(1)+' '+(CY-r*.48).toFixed(1)+'" stroke="#FFFFFF" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/>';
  return s}
 function compass(id,withGlobe){var s="",R=27;
  /* caja: aro grueso de latón con su sombra y un brillo */
  s+='<circle cx="'+CX+'" cy="'+CY+'" r="'+R+'" fill="'+BR+'"/>'+crescent(CX,CY,R,-3.4,-3.8,BRS)+
   '<path d="M'+(CX-R*.86).toFixed(1)+' '+(CY-R*.2).toFixed(1)+'A'+R+' '+R+' 0 0 1 '+(CX-R*.42).toFixed(1)+' '+(CY-R*.82).toFixed(1)+'" stroke="'+BRH+'" stroke-width="1.8" fill="none" stroke-linecap="round"/>';
  var r=withGlobe?23.4:21.6;
  if(withGlobe){s+=globe(id,r)}
  else{s+='<circle cx="'+CX+'" cy="'+CY+'" r="'+r+'" fill="#FBF0DA"/><path d="M'+(CX-r)+' '+CY+'A'+r+' '+r+' 0 0 1 '+(CX+r*.2).toFixed(1)+' '+(CY-r*.98).toFixed(1)+'" stroke="#E7D1A8" stroke-width="2" fill="none"/>'}
  /* marcas cardinales muy simples: este, sur y oeste (el norte queda bajo el gorro; la flecha hace de aguja) */
  var mk=withGlobe?"#FBF0DA":"#C9B48C",L=withGlobe?3:2.6;
  [[1,0],[0,1],[-1,0]].forEach(function(v){var x0=CX+v[0]*(R-.6),y0=CY+v[1]*(R-.6),x1=CX+v[0]*(R-.6-L*1.6),y1=CY+v[1]*(R-.6-L*1.6);
   if(withGlobe)s+='<path d="M'+(x0-v[1]*1.8).toFixed(1)+' '+(y0-v[0]*1.8).toFixed(1)+'L'+x1.toFixed(1)+' '+y1.toFixed(1)+'L'+(x0+v[1]*1.8).toFixed(1)+' '+(y0+v[0]*1.8).toFixed(1)+'Z" fill="'+BRS+'"/>';
   else s+='<path d="M'+(CX+v[0]*(r-1.4)).toFixed(1)+' '+(CY+v[1]*(r-1.4)).toFixed(1)+'L'+(CX+v[0]*(r-4.6)).toFixed(1)+' '+(CY+v[1]*(r-4.6)).toFixed(1)+'" stroke="'+mk+'" stroke-width="2.2" stroke-linecap="round"/>'});
  if(!withGlobe)[[.71,.71],[-.71,.71]].forEach(function(v){s+='<circle cx="'+(CX+v[0]*(r-2.4)).toFixed(1)+'" cy="'+(CY+v[1]*(r-2.4)).toFixed(1)+'" r="1" fill="'+mk+'"/>'});
  return s}

 /* ---------- cara: expresiones con data-p (se muestran según data-mood) ---------- */
 function face(skin){
  var s='',E1=[41,55],E2=[59,55];
  function eye(c,rx,ry){return '<ellipse cx="'+c[0]+'" cy="'+c[1]+'" rx="'+rx+'" ry="'+ry+'" fill="'+INK+'"/><circle cx="'+(c[0]+1.5)+'" cy="'+(c[1]-2)+'" r="'+(rx*.38).toFixed(2)+'" fill="#FFFFFF"/><circle cx="'+(c[0]-1.3)+'" cy="'+(c[1]+2.2)+'" r="'+(rx*.17).toFixed(2)+'" fill="#FFFFFF"/>'}
  function arc(c,up){return '<path d="M'+(c[0]-4)+' '+(c[1]+(up?1.4:-.6))+'Q'+c[0]+' '+(c[1]+(up?-3.6:3.4))+' '+(c[0]+4)+' '+(c[1]+(up?1.4:-.6))+'" stroke="'+INK+'" stroke-width="2" fill="none" stroke-linecap="round"/>'}
  function brow(c,ang,dy){return '<path d="M'+(c[0]-3.4)+' '+(c[1]-8.2+dy)+'L'+(c[0]+3.4)+' '+(c[1]-8.2+dy)+'" stroke="'+INK+'" stroke-width="1.7" stroke-linecap="round" transform="rotate('+ang+' '+c[0]+' '+(c[1]-8.2+dy)+')"/>'}
  /* mejillas planas */
  s+='<ellipse cx="33.8" cy="62" rx="4.2" ry="2.7" fill="'+CHK+'" opacity=".8"/><ellipse cx="66.2" cy="62" rx="4.2" ry="2.7" fill="'+CHK+'" opacity=".8"/>';
  /* ojos normales con párpados (neutral, hablando, más o menos, triste con ánimo, triste) */
  s+='<g data-p="idle talk meh sadhope sad think curious"><g class="rk-gaze"><g class="rk-eyes"><g class="rb-eL">'+eye(E1,4.5,5.6)+'</g><g class="rb-eR">'+eye(E2,4.5,5.6)+'</g></g></g>'+
   '<path class="rk-lid" data-py="49" d="M35.8 49H46.2V60.8Q41 58.2 35.8 60.8Z" fill="'+skin+'" transform="scale(1 0)"/><path class="rk-lid" data-py="49" d="M53.8 49H64.2V60.8Q59 58.2 53.8 60.8Z" fill="'+skin+'" transform="scale(1 0)"/></g>';
  /* contento: ojos abiertos un poco más grandes */
  s+='<g data-p="happy wink"><g class="rk-gaze"><g class="rb-eL" data-p="happy">'+eye(E1,4.8,5.9)+'</g><g class="rb-eL" data-p="wink">'+eye(E1,4.8,5.9)+'</g><g class="rb-eR" data-p="happy">'+eye(E2,4.8,5.9)+'</g></g></g>';
  s+='<g data-p="wink">'+arc(E2,true)+'</g>';
  /* muy feliz y celebrando: ojos en arco */
  s+='<g data-p="joy">'+arc(E1,true)+arc(E2,true)+'</g>';
  /* sorprendido: ojos grandes y cejas arriba */
  s+='<g data-p="wow">'+eye(E1,5.4,6.6)+eye(E2,5.4,6.6)+'</g>';br+='<g data-p="wow">'+brow(E1,-6,-1.6)+brow(E2,6,-1.6)+'</g>';
  /* dormido: ojos cerrados y zetas */
  s+='<g data-p="sleep">'+arc(E1,false)+arc(E2,false)+'<g class="rk-zz"><text x="66" y="40" font-size="7" font-weight="900" fill="'+INK+'" opacity=".55">z</text><text x="71" y="33" font-size="5" font-weight="900" fill="'+INK+'" opacity=".4">z</text></g></g>';
  /* cejas por expresión */
  var br='<g data-p="curious">'+brow(E1,0,0)+brow(E2,-10,-2.2)+'</g><g data-p="think">'+brow(E1,10,.4)+brow(E2,-4,-.6)+'</g><g data-p="sad sadhope">'+brow(E1,-14,1.4)+brow(E2,14,1.4)+'</g>';
  /* bocas */
  s+='<path data-p="idle" d="M45.4 62Q50 66.4 54.6 62" stroke="'+INK+'" stroke-width="1.9" fill="none" stroke-linecap="round"/>';
  s+='<g data-p="happy wink"><path d="M44.6 61.2Q50 68.6 55.4 61.2Z" fill="'+INK+'" stroke="'+INK+'" stroke-width="1.2" stroke-linejoin="round"/><path d="M46.9 65.1Q50 67 53.1 65.1Q51.6 63.8 50 63.8Q48.4 63.8 46.9 65.1Z" fill="#E86A6A"/></g>';
  s+='<g data-p="joy"><path d="M43.6 60.4Q50 71 56.4 60.4Z" fill="'+INK+'" stroke="'+INK+'" stroke-width="1.2" stroke-linejoin="round"/><path d="M46.4 66.2Q50 68.8 53.6 66.2Q51.8 64.4 50 64.4Q48.2 64.4 46.4 66.2Z" fill="#E86A6A"/></g>';
  s+='<ellipse data-p="wow" cx="50" cy="64" rx="2.6" ry="3.2" fill="'+INK+'"/>';
  s+='<ellipse data-p="curious" cx="52.4" cy="63.6" rx="1.7" ry="1.9" fill="'+INK+'"/>';
  s+='<path data-p="think" d="M47 63.6Q50.4 62.6 53.4 64" stroke="'+INK+'" stroke-width="1.8" fill="none" stroke-linecap="round"/>';
  s+='<path data-p="sadhope" d="M46.4 63.4Q50 65.4 53.6 63.4" stroke="'+INK+'" stroke-width="1.8" fill="none" stroke-linecap="round"/>';
  s+='<path data-p="sad no" d="M46 64.6Q50 61.6 54 64.6" stroke="'+INK+'" stroke-width="1.9" fill="none" stroke-linecap="round"/>';
  s+='<path data-p="meh" d="M46.4 63.4H53.6" stroke="'+INK+'" stroke-width="1.9" stroke-linecap="round"/>';
  s+='<ellipse data-p="talk" class="rk-mouth" cx="50" cy="63.6" rx="3.2" ry="2.6" fill="'+INK+'"/>';
  s+='<ellipse data-p="sleep" cx="50" cy="64" rx="1.6" ry="1.3" fill="'+INK+'" opacity=".8"/>';
  /* "no le gustó": ojos de rayita */
  s+='<g data-p="no"><path d="M37.4 55H44.6M55.4 55H62.6" stroke="'+INK+'" stroke-width="2" stroke-linecap="round"/></g>';
  return [s,br]}

 /* ---------- gorro, solapas, gafas y anillo de la flecha ---------- */
 /* ---------- gorro: casquete, orejeras, gafas y flecha como hijos (cada uno con su pivote) ---------- */
 var CAPD="M22 51Q22 25.6 50 24Q78 25.6 78 51Q66 44 50 44Q34 44 22 51Z";
 function capParts(id){
  var s='<clipPath id="'+id+'c"><path d="'+CAPD+'"/></clipPath>';
  s+='<path d="'+CAPD+'" fill="'+CAP+'"/><g clip-path="url(#'+id+'c)"><path d="M54 20L84 20L84 55L60 55Q64 40 54 20Z" fill="'+CAPS+'"/><path d="M28 42Q29 31 40 27.4" stroke="'+CAPH+'" stroke-width="2" fill="none" stroke-linecap="round"/></g>';
  /* borde con grosor: baja un poco sobre la cabeza para que nunca aparezca un hueco */
  s+='<path d="M22 51Q34 44 50 44Q66 44 78 51L78 53.6Q66 46.6 50 46.6Q34 46.6 22 53.6Z" fill="'+CAPS+'"/>';
  s+='<path d="M23.2 41.4Q50 31.6 76.8 41.4L76.4 44.4Q50 34.8 23.6 44.4Z" fill="'+STRAP+'"/>';
  s+='<ellipse cx="50" cy="25.6" rx="4.6" ry="1.7" fill="'+BRS+'"/><ellipse cx="50" cy="24.8" rx="4.6" ry="1.7" fill="'+BR+'"/>';
  return s}
 /* orejeras: nacen dentro del borde del gorro (traslape) */
 function flapL(){return '<path d="M23.6 45Q17.4 47 17 56Q16.8 63.6 21.6 64.4Q25.6 65 26.2 60.2L26.4 46.4Z" fill="'+CAP+'"/><path d="M17.2 58.6Q17.8 63.8 21.6 64.4Q25.6 65 26.2 60.2" stroke="'+LIN+'" stroke-width="2.2" fill="none" stroke-linecap="round"/>'}
 function flapR(){return '<path d="M76.4 45Q82.6 47 83 56Q83.2 63.6 78.4 64.4Q74.4 65 73.8 60.2L73.6 46.4Z" fill="'+CAPS+'"/><path d="M82.8 58.6Q82.2 63.8 78.4 64.4Q74.4 65 73.8 60.2" stroke="#D2B48A" stroke-width="2.2" fill="none" stroke-linecap="round"/>'}
 function goggles(){var s="";[[40.6,37.4],[59.4,37.4]].forEach(function(c){s+='<circle cx="'+(c[0]+.7)+'" cy="'+(c[1]+.8)+'" r="7" fill="'+BRS+'"/><circle cx="'+c[0]+'" cy="'+c[1]+'" r="7" fill="'+BR+'"/><circle cx="'+c[0]+'" cy="'+c[1]+'" r="4.8" fill="'+LENS+'"/><path d="M'+(c[0]-3)+' '+(c[1]-.6)+'Q'+(c[0]-2.4)+' '+(c[1]-3)+' '+(c[0]+.2)+' '+(c[1]-3.4)+'" stroke="#FFFFFF" stroke-width="1.5" fill="none" stroke-linecap="round"/>'});return s+'<rect x="47.2" y="36" width="5.6" height="2.8" rx="1.4" fill="'+BRS+'"/>'}
 /* flecha: el asta entra en el gorro (se dibuja antes que el casquete) */
 function arrow(){return '<rect x="48.6" y="9" width="2.8" height="19" rx="1" fill="'+GOLD+'"/><rect x="50" y="9" width="1.4" height="19" fill="'+GOLDS+'"/><path d="M50 1.6Q51.2 1.6 52 2.7L57.4 10.4Q58.3 12 56.5 12H43.5Q41.7 12 42.6 10.4L48 2.7Q48.8 1.6 50 1.6Z" fill="'+GOLD+'"/><path d="M50 1.6Q51.2 1.6 52 2.7L57.4 10.4Q58.3 12 56.5 12H50Z" fill="'+GOLDS+'"/>'}
 /* piernas: la parte alta entra por debajo del cuerpo */
 function legL(){var L="M41 70H47.4V88.6Q47.4 92 44 92H37.8Q35 92 35 90Q35 87.8 38 87.4L41 87Z";return '<path d="'+L+'" fill="'+LEG+'"/><path d="M44.4 70H47.4V88.6Q47.4 92 44 92H42Q44.4 91 44.4 88Z" fill="'+LEGS+'"/><path d="M35 90.4Q35 92 37.8 92H44Q47.4 92 47.4 89.6V90.4Z" fill="'+SOLE+'"/>'}
 function legR(){var R="M52.6 70H59V87L62 87.4Q65 87.8 65 90Q65 92 62.2 92H56Q52.6 92 52.6 88.6Z";return '<path d="'+R+'" fill="'+LEG+'"/><path d="M56 70H59V87L62 87.4Q63.6 87.6 64.4 88.4Q60 88.6 56 88.4Z" fill="'+LEGS+'"/><path d="M52.6 89.6Q52.6 92 56 92H62.2Q65 92 65 90.4Z" fill="'+SOLE+'"/>'}
 function armL(){return '<path d="M29 57.6Q22 59.6 20.8 66Q20.2 71.2 23.6 72.2Q26.8 72.8 28.4 67.4Z" fill="'+LEG+'"/><path d="M21.6 69.8Q22 72 23.6 72.2Q26.8 72.8 28.4 67.4Q25 70 21.6 69.8Z" fill="'+LEGS+'"/>'}
 function armR(){return '<path d="M71 57.6Q78 59.6 79.2 66Q79.8 71.2 76.4 72.2Q73.2 72.8 71.6 67.4Z" fill="'+LEG+'"/><path d="M78.4 69.8Q78 72 76.4 72.2Q73.2 72.8 71.6 67.4Q75 70 78.4 69.8Z" fill="'+LEGS+'"/>'}

 /* esqueleto: raíz › (sombra, piernas, cuerpo › (brazos, cuerpo, cara, gorro › (flecha, orejeras, casquete, gafas), cejas)).
    Cada grupo lleva data-px/data-py con su pivote; el motor escribe su transform completo en cada cuadro. */
 function grp(cls,px,py,inner){return '<g class="'+cls+'" data-px="'+px+'" data-py="'+py+'">'+inner+'</g>'}
 function build(model){
  var id="rbm"+(++N),body,skin;
  if(model==="A"){body=globe(id,27);skin="#F7E0BD"}
  else if(model==="B"){body=compass(id,false);skin="#FBF0DA"}
  else{body=compass(id,true);skin="#F7E0BD"}
  var fc=face(skin);
  var hat=grp("rk-hat",50,46,grp("rk-arrow",50,26,arrow())+grp("rk-flapL",24,47,flapL())+grp("rk-flapR",76,47,flapR())+capParts(id)+grp("rk-gog",50,38,goggles()));
  return '<svg class="rbx rbx-'+model+'" viewBox="0 0 100 100" aria-hidden="true">'+
   grp("rk-root",50,92,
    '<g class="rk-shadow"><ellipse class="rk-sh" cx="50" cy="92" rx="21" ry="2.8" fill="var(--rb-sh,#13213F)" opacity=".2"/><ellipse cx="42" cy="92" rx="6.4" ry="1.3" fill="#13213F" opacity=".22"/><ellipse cx="58" cy="92" rx="6.4" ry="1.3" fill="#13213F" opacity=".22"/></g>'+
    grp("rk-legL",44,72,legL())+grp("rk-legR",56,72,legR())+
    grp("rk-body",50,82,
     body+'<g class="rk-face">'+fc[0]+'</g>'+hat+'<g class="rk-brows">'+fc[1]+'</g>'+grp("rk-armL",27,60,armL())+grp("rk-armR",73,60,armR()))
   )+'</svg>';
 }

 /* ================= motor de animación: un solo bucle para todos los Rumbo visibles ================= */
 var MOT=(function(){
  if(typeof window==="undefined")return null;
  var ST=new WeakMap(),VIS=new WeakMap(),list=document.getElementsByClassName("rbx"),raf=0,last=0,io=null;
  function f(n){return Math.round(n*100)/100}
  function rnd(a,b){return a+Math.random()*(b-a)}
  function cl(x,a,b){return Math.max(a,Math.min(b,x))}
  function RMq(){try{return window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){return false}}
  if(window.IntersectionObserver)io=new IntersectionObserver(function(es){es.forEach(function(e){VIS.set(e.target,e.isIntersecting)});go()});
  /* transform completo con pivote explícito: traslado, y luego giro y escala alrededor del pivote */
  function T(el,o){if(!el)return;var px=+el.getAttribute("data-px")||0,py=+el.getAttribute("data-py")||0;
   el.setAttribute("transform","translate("+f((o.x||0)+px)+" "+f((o.y||0)+py)+") rotate("+f(o.r||0)+") scale("+f(o.sx==null?1:o.sx)+" "+f(o.sy==null?1:o.sy)+") translate("+(-px)+" "+(-py)+")")}
  function spring(sp,target,dt,k,c,lim){var a=-k*(sp.x-target)-c*sp.v;sp.v+=a*dt;sp.x+=sp.v*dt;if(sp.x>lim){sp.x=lim;sp.v*=-.2}if(sp.x<-lim){sp.x=-lim;sp.v*=-.2}return sp.x}
  function init(svg){
   var q=function(c){return svg.querySelector("."+c)};
   var st={t:0,g:{root:q("rk-root"),body:q("rk-body"),legL:q("rk-legL"),legR:q("rk-legR"),hat:q("rk-hat"),arrow:q("rk-arrow"),flapL:q("rk-flapL"),flapR:q("rk-flapR"),gog:q("rk-gog"),armL:q("rk-armL"),armR:q("rk-armR"),shadow:q("rk-shadow"),mouth:q("rk-mouth"),zz:q("rk-zz")},
    gaze:Array.prototype.slice.call(svg.querySelectorAll(".rk-gaze")),lids:Array.prototype.slice.call(svg.querySelectorAll(".rk-lid")),
    dp:Array.prototype.slice.call(svg.querySelectorAll("[data-p]")).map(function(e){return {e:e,w:e.getAttribute("data-p").split(" "),o:-1}}),
    w:{idle:1,walk:0,cheer:0},pose:{wave:0,point:0},act:null,blinkIn:rnd(1,4),blinkT:-1,twice:false,gz:[0,0],gzT:[0,0],gzIn:rnd(3,7),gzHold:0,
    sp:{arrow:{x:0,v:0},flapL:{x:0,v:0},flapR:{x:0,v:0},gog:{x:0,v:0},hat:{x:0,v:0}},py:0,vy:0,flip:1};
   ST.set(svg,st);if(io)io.observe(svg);else VIS.set(svg,true);return st}
  function frame(now){
   raf=0;var dt=Math.min(.05,Math.max(0,(now-(last||now))/1000));last=now;
   if(document.hidden)return;
   var any=false,rm=RMq();
   for(var i=0;i<list.length;i++){var svg=list[i],st=ST.get(svg)||init(svg);if(!VIS.get(svg))continue;any=true;step(svg,st,dt,rm)}
   if(any)raf=requestAnimationFrame(frame);
  }
  function go(){if(!raf&&!document.hidden){last=0;raf=requestAnimationFrame(frame)}}
  document.addEventListener("visibilitychange",go);
  /* registra los Rumbo que aparecen después */
  setInterval(function(){for(var i=0;i<list.length;i++)if(!ST.get(list[i]))init(list[i]);go()},600);
  function act(st,k,dur){st.act={k:k,t:0,d:dur}}
  function step(svg,st,dt,rm){
   var wr=svg.parentNode,cls=wr&&wr.classList,mood=(wr&&wr.getAttribute("data-mood"))||"idle",g=st.g;st.t+=dt;var t=st.t;
   if(!cls)return;
   /* acciones de un solo tiro que pide la app con clases a-* */
   ["jump","tilt","shake","look"].forEach(function(k){if(cls.contains("a-"+k)){cls.remove("a-"+k);act(st,k,{jump:.72,tilt:.6,shake:.45,look:1.1}[k])}});
   var loop=cls.contains("walk")?"walk":(cls.contains("cheer")||cls.contains("dance"))?"cheer":"idle";
   /* mezcla suave entre estados (≈200 ms) */
   var a=1-Math.exp(-dt/.07);["idle","walk","cheer"].forEach(function(k){st.w[k]+=((k===loop?1:0)-st.w[k])*a});
   st.pose.wave+=((cls.contains("p-wave")?1:0)-st.pose.wave)*a;st.pose.point+=((cls.contains("p-point")?1:0)-st.pose.point)*a;
   var W=st.w,B={x:0,y:0,r:0,sx:1,sy:1},lift=0,legL=0,legR=0,lyL=0,lyR=0,armL=0,armR=0,sway=0;
   if(!rm){
    /* reposo: respiración sutil y flecha que busca el norte */
    var br=Math.sin(t*2*Math.PI/3.4),slp=mood==="sleep"?1.8:1;
    var bw=cls.contains("float")?1:.25;B.sy+=W.idle*.016*br*slp*bw;B.sx-=W.idle*.008*br*slp*bw;sway+=W.idle*4*Math.sin(t*2*Math.PI/2.8);
    /* caminar: piernas desde la cadera; el cuerpo sube con la pierna recta y baja al apoyar */
    var ph=t*2*Math.PI/.52,s1=Math.sin(ph),c2=Math.cos(2*ph);
    /* de frente: cada pie se levanta por turnos, con un balanceo pequeño hacia el mismo lado */
    legL+=W.walk*7*s1;legR+=W.walk*7*s1;lyL+=W.walk*-2.6*Math.max(0,s1);lyR+=W.walk*-2.6*Math.max(0,-s1);B.y+=W.walk*-2.2*(.5+.5*c2);B.r+=W.walk*3.5;B.sy+=W.walk*-.035*(.5-.5*c2);B.sx+=W.walk*.02*(.5-.5*c2);
    armL+=W.walk*-16*s1;armR+=W.walk*16*s1;
    /* celebrar: saltos con anticipación, estiramiento y aterrizaje */
    function hop(p){var o={y:0,sx:1,sy:1,up:0};if(p<.14){var k=p/.14;o.y=1.4*k;o.sy=1-.07*k;o.sx=1+.05*k}else if(p<.74){var k2=(p-.14)/.6;o.y=-16*Math.sin(Math.PI*k2);o.sy=1+.06*Math.max(0,1-k2*3);o.sx=1-.03*Math.max(0,1-k2*3);o.up=1}else{var k3=(p-.74)/.26;var sq=Math.sin(Math.PI*k3);o.sy=1-.07*sq;o.sx=1+.05*sq;o.up=1-k3}return o}
    if(W.cheer>.001){var hp=hop((t%.9)/.9);lift+=W.cheer*Math.min(0,hp.y);B.y+=W.cheer*Math.max(0,hp.y);B.sx+=W.cheer*(hp.sx-1);B.sy+=W.cheer*(hp.sy-1);armL+=W.cheer*hp.up*112;armR-=W.cheer*hp.up*112}
    /* poses */
    armR+=st.pose.wave*(-96-16*(.5+.5*Math.sin(t*2*Math.PI/.9)))+st.pose.point*(-82);
    /* acción en curso */
    if(st.act){var A=st.act;A.t+=dt;var p=Math.min(1,A.t/A.d);
     if(A.k==="jump"){var hj=hop(p);lift+=Math.min(0,hj.y);B.y+=Math.max(0,hj.y);B.sx+=hj.sx-1;B.sy+=hj.sy-1;armL+=hj.up*100;armR-=hj.up*100}
     else if(A.k==="tilt")B.r+=p<.3?-9*Math.sin(p/.3*Math.PI/2):p<.65?-9+15*((p-.3)/.35):6*(1-(p-.65)/.35);
     else if(A.k==="shake")B.x+=2.6*Math.sin(p*Math.PI*8)*(1-p);
     else if(A.k==="look"){B.r+=(p>.22&&p<.58)?-6:p>.78?2*(1-p)/.22:0}
     if(p>=1)st.act=null}
    B.sx=cl(B.sx,.92,1.08);B.sy=cl(B.sy,.92,1.08);
   }
   /* secundarios con resortes: la flecha, las orejeras, las gafas y el gorro siguen al cuerpo con un leve retraso */
   var yy=B.y+lift,vy=(yy-st.py)/(dt||.016);st.py=yy;st.vy+=(vy-st.vy)*.5;
   var ar=spring(st.sp.arrow,sway+B.r*.6+cl(-st.vy*.12,-8,8)+(mood==="sad"?-10:0),dt,90,9,12);
   var fl=spring(st.sp.flapL,cl(st.vy*.25,-15,15),dt,70,7,15),fr=spring(st.sp.flapR,cl(-st.vy*.25,-15,15),dt,70,7,15);
   var gy=spring(st.sp.gog,cl(st.vy*.02,-1,1),dt,110,10,1.1),hy=spring(st.sp.hat,cl(st.vy*.025,-1.2,1.2),dt,120,12,1.2);
   if(rm){ar=0;fl=0;fr=0;gy=0;hy=0}
   /* raíz: mira hacia donde va */
   var flip=cls.contains("left")?-1:1;
   /* el salto mueve todo el personaje; la sombra se queda en el suelo y se encoge */
   T(g.root,{sx:flip,y:lift});
   var hgt=Math.max(0,-lift);T(g.shadow,{y:-lift,sx:1-hgt/36,sy:1-hgt/36});
   T(g.body,B);T(g.legL,{r:legL,y:lyL+Math.max(0,B.y*.15)});T(g.legR,{r:legR,y:lyR+Math.max(0,B.y*.15)});
   T(g.armL,{r:armL});T(g.armR,{r:armR});
   T(g.hat,{y:hy});T(g.arrow,{r:ar});T(g.flapL,{r:fl});T(g.flapR,{r:fr});T(g.gog,{y:gy});
   /* parpadeo: bajan los párpados; dobles de vez en cuando */
   if(cls.contains("blink")&&st.blinkT<0)st.blinkIn=0;
   var lid=0;if(mood==="sleep")lid=1;else{st.blinkIn-=dt;if(st.blinkIn<=0&&st.blinkT<0){st.blinkT=0;st.twice=Math.random()<.2}
    if(st.blinkT>=0){st.blinkT+=dt;var bt=st.blinkT/.14;lid=bt<.5?bt*2:bt<1?2-bt*2:0;if(bt>=1){if(st.twice){st.twice=false;st.blinkT=-.0001;st.blinkIn=.09}else{st.blinkT=-1;st.blinkIn=rnd(2,6)}}}}
   st.lids.forEach(function(l){l.setAttribute("transform","translate(0 49) scale(1 "+f(lid)+") translate(0 -49)")});
   /* mirada: la app manda con g-l, g-r, g-u; si no, miradas ocasionales */
   var tg=cls.contains("g-l")?[-2.2,.2]:cls.contains("g-r")?[2.2,.2]:cls.contains("g-u")?[.8,-1.6]:loop==="walk"?[1.6,0]:mood==="curious"?[1.6,-1.2]:mood==="think"?[-1.6,-1.6]:cls.contains("p-point")?[2.2,0]:null;
   if(!tg){st.gzIn-=dt;if(st.gzIn<=0){st.gzT=[[-1.8,0],[1.8,0],[.8,-1],[0,0]][Math.floor(Math.random()*4)];st.gzHold=rnd(.8,1.6);st.gzIn=rnd(3,7)}if(st.gzHold>0){st.gzHold-=dt;if(st.gzHold<=0)st.gzT=[0,0]}tg=st.gzT}
   var ga=1-Math.exp(-dt/.06);st.gz[0]+=(tg[0]-st.gz[0])*ga;st.gz[1]+=(tg[1]-st.gz[1])*ga;
   st.gaze.forEach(function(e){e.setAttribute("transform","translate("+f(st.gz[0])+" "+f(st.gz[1])+")")});
   /* expresiones con fundido corto */
   var fa=1-Math.exp(-dt/.05);
   st.dp.forEach(function(d){var tgt=d.w.indexOf(mood)>-1?1:0;if(d.o<0)d.o=tgt;else d.o+=(tgt-d.o)*fa;var v=Math.round(d.o*100)/100;if(v!==d.last){d.e.style.opacity=v;d.last=v}});
   if(g.mouth&&mood==="talk"){var m=.35+.65*(.5+.5*Math.sin(t*2*Math.PI*3.6));g.mouth.setAttribute("transform","translate(0 63.6) scale(1 "+f(m)+") translate(0 -63.6)")}
   if(g.zz){var z=(t%2.4)/2.4;g.zz.setAttribute("transform","translate("+f(z*2)+" "+f(2-z*6)+")");g.zz.style.opacity=mood==="sleep"?f(Math.sin(Math.PI*z)):0}
  }
  return {go:go};
 })();
 var NAMES={v1:"Actual (v1)",A:"A · Globo",B:"B · Brújula",C:"C · Híbrido"};
 var cur=null;try{cur=localStorage.getItem("vocatlas_rumbo")}catch(e){}
 function pick(m){if(m){cur=m;try{localStorage.setItem("vocatlas_rumbo",m)}catch(e){}}return cur||"B"}
 function svg(m){m=m||pick();return m==="v1"?rumboSVG():build(m)}
 return {svg:svg,build:build,pick:pick,NAMES:NAMES,models:["v1","A","B","C"]};
})();
