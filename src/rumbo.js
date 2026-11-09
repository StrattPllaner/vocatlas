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
  s+='<circle class="rk-core" cx="'+CX+'" cy="'+CY+'" r="'+r+'" fill="#F7E0BD"/>';
  s+='<g clip-path="url(#'+id+'g)"><g fill="#7FA2B3">'+LANDS.map(function(L){return '<path d="'+sm(sph(L,CX,CY,r))+'"/>'}).join("")+'</g>'+
   /* un solo tono de sombra encima de mar y tierra */
   crescent(CX,CY,r,-3.4,-3.8,"#6E4A26",.16)+'</g>';
  s+='<path d="M'+(CX-r*.86).toFixed(1)+' '+(CY+r*.1).toFixed(1)+'A'+r+' '+r+' 0 0 1 '+(CX-r*.66).toFixed(1)+' '+(CY-r*.48).toFixed(1)+'" stroke="#FFFFFF" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/>';
  return s}
 function compass(id,withGlobe){var s="",R=27;
  /* caja: aro grueso de latón con su sombra y un brillo */
  s+='<circle class="rk-core" cx="'+CX+'" cy="'+CY+'" r="'+R+'" fill="'+BR+'"/>'+crescent(CX,CY,R,-3.4,-3.8,BRS)+
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

 /* ---------- cara ----------
    Ojos paramétricos: el motor mueve párpados, pupilas y cejas en cada cuadro (no se cambian dibujos).
    Cada ojo: blanco ovalado un poco más alto que ancho; pupila grande con brillo grande arriba a la izquierda
    y uno chico abajo a la derecha (se mueven con la pupila, siempre del mismo lado); todo recortado al blanco.
    Párpado de arriba y de abajo del color de la cara, con su línea; el párpado de arriba lleva la pestaña.
    Bocas y zetas siguen con data-p (fundido corto). */
 /* estilos de ojos (se elige en #rumbo y se guarda en el dispositivo).
    Todos comparten párpados del color de la cara, línea solo al cerrar, y la mirada mueve el ojo entero. */
 var STAR="M0 -1.3L.32 -.32L1.3 0L.32 .32L0 1.3L-.32 .32L-1.3 0L-.32 -.32Z";
 var EYES={
  boton:{n:"Botón",d:"Puntos redondos y pequeños con un brillo. Lo más sencillo y tierno.",c:[[42.2,58.4],[57.8,58.4]],rx:3.1,ry:3.3},
  frijol:{n:"Frijol",d:"Cápsulas altas y delgadas, un brillo arriba. Moderno y limpio.",c:[[43,57.6],[57,57.6]],rx:2.3,ry:4.4},
  brillo:{n:"Brillo estelar",d:"Óvalos con brillo redondo y un destello de rosa de los vientos.",c:[[41.4,57.4],[58.6,57.4]],rx:3.7,ry:4.7},
  blanco:{n:"Con blanco",d:"Blanco suave sin contorno y pupila grande que mira a todos lados.",c:[[40.8,57],[59.2,57]],rx:5,ry:5.5},
  aguja:{n:"Aguja",d:"Puntos redondos con un brillo en forma de aguja de brújula.",c:[[41.8,58],[58.2,58]],rx:3.5,ry:3.7},
  sonrisa:{n:"Siempre sonriente",d:"En reposo los ojos son arcos felices; se abren para sorprenderse o pensar.",c:[[41.6,58],[58.4,58]],rx:3.5,ry:4}};
 var EYEK=["boton","frijol","brillo","blanco","aguja","sonrisa"];
 var eyeCur=null;try{eyeCur=localStorage.getItem("vocatlas_ojos")}catch(e){}
 function eyePick(k){if(k){eyeCur=k;try{localStorage.setItem("vocatlas_ojos",k)}catch(e){}}return EYES[eyeCur]?eyeCur:"boton"}
 function eyeM(id,i,skin,ek){var E0=EYES[ek],c=E0.c[i],cx=c[0],cy=c[1],rx=E0.rx,ry=E0.ry,cid=id+"e"+i,g="";
  if(ek==="blanco"){
   g='<ellipse cx="'+cx+'" cy="'+(cy+.5)+'" rx="'+rx+'" ry="'+ry+'" fill="#E9D6B0"/><ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="#FFFFFF"/>'+
    '<clipPath id="'+cid+'w"><ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'"/></clipPath><g clip-path="url(#'+cid+'w)"><g class="rk-iris">'+
    '<circle cx="'+cx+'" cy="'+(cy+.6)+'" r="3.5" fill="'+INK+'"/><circle cx="'+(cx-1.1)+'" cy="'+(cy-.6)+'" r="1.25" fill="#FFFFFF"/><circle cx="'+(cx+1.2)+'" cy="'+(cy+1.9)+'" r=".55" fill="#FFFFFF"/></g></g>'}
  else{g='<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="'+INK+'"/>';
   if(ek==="boton")g+='<circle cx="'+(cx-1)+'" cy="'+(cy-1.2)+'" r="1.05" fill="#FFFFFF"/>';
   else if(ek==="frijol")g+='<ellipse cx="'+(cx-.6)+'" cy="'+(cy-2.2)+'" rx=".9" ry="1.2" fill="#FFFFFF"/>';
   else if(ek==="brillo")g+='<circle cx="'+(cx-1.15)+'" cy="'+(cy-1.75)+'" r="1.35" fill="#FFFFFF"/><path d="'+STAR+'" transform="translate('+(cx+1.3)+' '+(cy+1.55)+') scale(.78)" fill="#FFFFFF"/>';
   else if(ek==="aguja")g+='<path d="M'+(cx-2.2)+' '+(cy-.2)+'L'+(cx-.9)+' '+(cy-2.6)+'L'+(cx+.1)+' '+(cy-1.6)+'Z" fill="#FFFFFF"/><circle cx="'+(cx+1.3)+'" cy="'+(cy+1.4)+'" r=".55" fill="#FFFFFF"/>';
   else g+='<circle cx="'+(cx-1)+'" cy="'+(cy-1.4)+'" r="1.15" fill="#FFFFFF"/>'}
  return '<g class="rk-eye" data-i="'+i+'" data-cx="'+cx+'" data-cy="'+cy+'" data-rx="'+rx+'" data-ry="'+ry+'"><g class="rk-esq"><g class="rk-pup">'+g+'</g>'+
   '<clipPath id="'+cid+'k"><ellipse cx="'+cx+'" cy="'+cy+'" rx="'+(rx+1.4)+'" ry="'+(ry+1.4)+'"/></clipPath><g clip-path="url(#'+cid+'k)">'+
   '<path class="rk-lo" fill="'+skin+'"/><path class="rk-lol" fill="none" stroke="none"/>'+
   '<path class="rk-up" fill="'+skin+'"/><path class="rk-lash" fill="none" stroke="'+INK+'" stroke-width="1.9" stroke-linecap="round" stroke-opacity="0"/>'+
   '</g></g></g>'}
 function face(skin,id,ek){
  var s='';
  /* mejillas planas */
  s+=eyeM(id,0,skin,ek)+eyeM(id,1,skin,ek);
  s+='<ellipse cx="34.2" cy="64.6" rx="3.4" ry="2.2" fill="'+CHK+'" opacity=".8"/><ellipse cx="65.8" cy="64.6" rx="3.4" ry="2.2" fill="'+CHK+'" opacity=".8"/>';
  /* bocas */
  s+='<path data-p="idle" d="M45.6 66.2Q50 70.2 54.4 66.2" stroke="'+INK+'" stroke-width="1.9" fill="none" stroke-linecap="round"/>';
  s+='<g data-p="happy wink"><path d="M44.8 65.4Q50 72.6 55.2 65.4Z" fill="'+INK+'" stroke="'+INK+'" stroke-width="1.2" stroke-linejoin="round"/><path d="M47 69.2Q50 71 53 69.2Q51.6 68 50 68Q48.4 68 47 69.2Z" fill="#E86A6A"/></g>';
  s+='<g data-p="joy"><path d="M43.8 64.6Q50 75 56.2 64.6Z" fill="'+INK+'" stroke="'+INK+'" stroke-width="1.2" stroke-linejoin="round"/><path d="M46.4 70.4Q50 72.8 53.6 70.4Q51.8 68.6 50 68.6Q48.2 68.6 46.4 70.4Z" fill="#E86A6A"/></g>';
  s+='<ellipse data-p="wow" cx="50" cy="68.4" rx="2.6" ry="3.2" fill="'+INK+'"/>';
  s+='<ellipse data-p="curious" cx="52.2" cy="67.8" rx="1.7" ry="1.9" fill="'+INK+'"/>';
  s+='<path data-p="think" d="M47 67.8Q50.4 66.8 53.4 68.2" stroke="'+INK+'" stroke-width="1.8" fill="none" stroke-linecap="round"/>';
  s+='<path data-p="sadhope" d="M46.4 67.6Q50 69.6 53.6 67.6" stroke="'+INK+'" stroke-width="1.8" fill="none" stroke-linecap="round"/>';
  s+='<path data-p="sad no" d="M46 68.8Q50 65.8 54 68.8" stroke="'+INK+'" stroke-width="1.9" fill="none" stroke-linecap="round"/>';
  s+='<path data-p="meh" d="M46.4 67.6H53.6" stroke="'+INK+'" stroke-width="1.9" stroke-linecap="round"/>';
  s+='<ellipse data-p="talk" class="rk-mouth" cx="50" cy="67.8" rx="3.2" ry="2.6" fill="'+INK+'"/>';
  s+='<ellipse data-p="sleep" cx="50" cy="68.2" rx="1.6" ry="1.3" fill="'+INK+'" opacity=".8"/>';
  s+='<g data-p="yawn"><ellipse cx="50" cy="68.6" rx="3" ry="3.9" fill="'+INK+'"/><ellipse cx="50" cy="71" rx="1.9" ry="1.1" fill="#E86A6A"/></g>';
  s+='<g data-p="sleep"><g class="rk-zz"><text x="66" y="40" font-size="7" font-weight="900" fill="'+INK+'" opacity=".55">z</text><text x="71" y="33" font-size="5" font-weight="900" fill="'+INK+'" opacity=".4">z</text></g></g>';
  /* cejas: gruesas, redondeadas y un poco arqueadas; el motor las mueve con cada emoción */
  var br=[0,1].map(function(i){return '<g class="rk-brow" data-i="'+i+'"><path d="M-2.9 .7Q0 -1.1 2.9 .7" stroke="'+INK+'" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>'}).join("");
  return [s,br]}

 /* ---------- gorro, solapas, gafas y anillo de la flecha ---------- */
 /* ---------- gorro: casquete, orejeras, gafas y flecha como hijos (cada uno con su pivote) ---------- */
 var CAPD="M22 51Q22 25.6 50 24Q78 25.6 78 51Q66 44 50 44Q34 44 22 51Z";
 function capParts(id){
  var s='<clipPath id="'+id+'c"><path d="'+CAPD+'"/></clipPath>';
  s+='<path class="rk-capj" d="'+CAPD+'" fill="'+CAP+'"/><g clip-path="url(#'+id+'c)"><path d="M54 20L84 20L84 55L60 55Q64 40 54 20Z" fill="'+CAPS+'"/><path d="M28 42Q29 31 40 27.4" stroke="'+CAPH+'" stroke-width="2" fill="none" stroke-linecap="round"/></g>';
  /* borde con grosor: baja un poco sobre la cabeza para que nunca aparezca un hueco */
  s+='<path class="rk-capj" d="M22 51Q34 44 50 44Q66 44 78 51L78 53.6Q66 46.6 50 46.6Q34 46.6 22 53.6Z" fill="'+CAPS+'"/>';
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
 /* brazos: hombro redondo centrado en el pivote (dentro del cuerpo), así la unión se ve igual en cualquier ángulo;
    manga con su sombra del lado de afuera y puño un poco más oscuro */
 var SHL=[27.8,62.4],SHR=[72.2,62.4];
 function arm(sh,hx,hy,side){var x=sh[0],y=sh[1];
  return '<path d="M'+x+' '+y+'L'+hx+' '+hy+'" stroke="'+LEG+'" stroke-width="6" stroke-linecap="round"/>'+
   '<path d="M'+(x+side*1.6)+' '+(y+.4)+'L'+(hx+side*1.6)+' '+(hy+.2)+'" stroke="'+LEGS+'" stroke-width="2.4" stroke-linecap="round"/>'+
   '<circle cx="'+hx+'" cy="'+hy+'" r="3" fill="'+LEGS+'"/><circle cx="'+(hx-side*.6)+'" cy="'+(hy-.7)+'" r="1.9" fill="'+LEG+'"/>'+
   '<circle cx="'+x+'" cy="'+y+'" r="3" fill="'+LEG+'"/>'}
 function armL(){return arm(SHL,21.4,71.6,-1)}
 function armR(){return arm(SHR,78.6,71.6,1)}

 /* esqueleto: raíz › (sombra, piernas, cuerpo › (brazos, cuerpo, cara, gorro › (flecha, orejeras, casquete, gafas), cejas)).
    Cada grupo lleva data-px/data-py con su pivote; el motor escribe su transform completo en cada cuadro. */
 function grp(cls,px,py,inner){return '<g class="'+cls+'" data-px="'+px+'" data-py="'+py+'">'+inner+'</g>'}
 function build(model,ek){ek=EYES[ek]?ek:eyePick();
  var id="rbm"+(++N),body,skin;
  if(model==="A"){body=globe(id,27);skin="#F7E0BD"}
  else if(model==="B"){body=compass(id,false);skin="#FBF0DA"}
  else{body=compass(id,true);skin="#F7E0BD"}
  var fc=face(skin,id,ek);
  var hat=grp("rk-hat",50,46,grp("rk-arrow",50,26,arrow())+grp("rk-flapL",24,47,flapL())+grp("rk-flapR",76,47,flapR())+capParts(id)+grp("rk-gog",50,38,goggles()));
  return '<svg class="rbx rbx-'+model+'" data-ojos="'+ek+'" viewBox="0 0 100 100" aria-hidden="true">'+
   grp("rk-root",50,92,
    '<g class="rk-shadow"><ellipse class="rk-sh" cx="50" cy="92" rx="21" ry="2.8" fill="var(--rb-sh,#13213F)" opacity=".2"/><ellipse cx="42" cy="92" rx="6.4" ry="1.3" fill="#13213F" opacity=".22"/><ellipse cx="58" cy="92" rx="6.4" ry="1.3" fill="#13213F" opacity=".22"/></g>'+
    grp("rk-legL",44,72,legL())+grp("rk-legR",56,72,legR())+
    grp("rk-body",50,82,
     body+'<g class="rk-face">'+fc[0]+'</g>'+hat+'<g class="rk-brows">'+fc[1]+'</g>'+grp("rk-armL",SHL[0],SHL[1],armL())+grp("rk-armR",SHR[0],SHR[1],armR()))
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
  /* ---------- ojos: parámetros por expresión (ojo izquierdo, ojo derecho) ----------
     u párpado de arriba (0 abierto, 1 cerrado) · b curva de su borde (+ cuelga, − arco) · t caída hacia afuera
     l párpado de abajo (0 abajo, 1 arriba) · c curva de su borde (+ el centro sube) · s tamaño del ojo · p tamaño de pupila */
  var D0={u:0,b:.6,t:0,l:0,c:0,s:1,p:1};
  function E(o){var r={};for(var k in D0)r[k]=o&&o[k]!=null?o[k]:D0[k];return r}
  var ARC={u:.58,b:-3.4,l:.42,c:3.4},HAP={u:.04,l:.3,c:2.2};
  var EP={idle:[E(),E()],talk:[E(),E()],happy:[E(HAP),E(HAP)],joy:[E(ARC),E(ARC)],wink:[E(HAP),E(ARC)],
   curious:[E({u:.24,s:.97}),E({u:0,s:1.08})],think:[E({u:.22}),E({u:.22})],wow:[E({u:0,s:1.18}),E({u:0,s:1.18})],
   sad:[E({u:.36,t:2.4}),E({u:.36,t:2.4})],sadhope:[E({u:.3,t:2}),E({u:.3,t:2})],
   meh:[E({u:.42,b:0}),E({u:.42,b:0})],no:[E({u:.48,b:0,l:.22,c:-.4}),E({u:.48,b:0,l:.22,c:-.4})],
   sleep:[E({u:.5,b:2.6,l:.5,c:-2.6}),E({u:.5,b:2.6,l:.5,c:-2.6})],yawn:[E({u:.46,l:.3,c:1}),E({u:.46,l:.3,c:1})]};
  /* cejas: [subir(−)/bajar(+), giro] por ojo */
  var BRW={idle:[[0,0],[0,0]],talk:[[-.4,0],[-.4,0]],happy:[[-.8,0],[-.8,0]],joy:[[-1.6,0],[-1.6,0]],wink:[[-1,0],[.6,7]],curious:[[.4,5],[-2.6,-8]],
   think:[[-1.6,-8],[.6,4]],wow:[[-3,0],[-3,0]],sad:[[.8,-14],[.8,14]],sadhope:[[-.2,-10],[-.2,10]],meh:[[.8,0],[.8,0]],no:[[1.2,12],[1.2,-12]],sleep:[[1,0],[1,0]],yawn:[[-1.4,0],[-1.4,0]]};
  var GZ={think:[-1.8,-2.2],curious:[1.6,-1],sadhope:[0,1.2],sad:[0,1.6],sleep:[0,1]};
  /* dedo o cursor: los ojos lo siguen un rato después de cada movimiento */
  var PTR={x:0,y:0,t:-1e9};
  function onPtr(e){PTR.x=e.clientX;PTR.y=e.clientY;PTR.t=performance.now()}
  window.addEventListener("pointermove",onPtr,{passive:true});window.addEventListener("pointerdown",onPtr,{passive:true});
  function init(svg){
   var q=function(c){return svg.querySelector("."+c)};
   var st={t:0,g:{root:q("rk-root"),body:q("rk-body"),face:q("rk-face"),brows:q("rk-brows"),legL:q("rk-legL"),legR:q("rk-legR"),hat:q("rk-hat"),arrow:q("rk-arrow"),flapL:q("rk-flapL"),flapR:q("rk-flapR"),gog:q("rk-gog"),armL:q("rk-armL"),armR:q("rk-armR"),shadow:q("rk-shadow"),mouth:q("rk-mouth"),zz:q("rk-zz")},
    eyes:Array.prototype.slice.call(svg.querySelectorAll(".rk-eye")).map(function(e,i){return {sq:e.querySelector(".rk-esq"),pup:e.querySelector(".rk-pup"),up:e.querySelector(".rk-up"),lash:e.querySelector(".rk-lash"),lo:e.querySelector(".rk-lo"),lol:e.querySelector(".rk-lol"),iris:e.querySelector(".rk-iris"),cx:+e.getAttribute("data-cx"),cy:+e.getAttribute("data-cy"),rx:+e.getAttribute("data-rx"),ry:+e.getAttribute("data-ry"),cur:E(),last:{}}}),
    brw:Array.prototype.slice.call(svg.querySelectorAll(".rk-brow")).map(function(e){return {e:e,dy:0,a:0}}),
    dp:Array.prototype.slice.call(svg.querySelectorAll("[data-p]")).map(function(e){return {e:e,w:e.getAttribute("data-p").split(" "),o:-1}}),
    w:{idle:1,walk:0,cheer:0},pose:{wave:0,point:0},act:null,ov:null,idleIn:rnd(10,15),lastIdle:"",
    blinkIn:rnd(1,4),blinkT:-1,blinkD:.15,twice:false,mood:null,
    gz:[0,0],gzT:[0,0],gzIn:rnd(2.5,5),gzHold:0,mic:[0,0],micIn:.5,rc:null,rcT:0,lk:null,lkT:0,
    sp:{arrow:{x:0,v:0},flapL:{x:0,v:0},flapR:{x:0,v:0},gog:{x:0,v:0},hat:{x:0,v:0},hatR:{x:0,v:0},face:{x:0,v:0},faceX:{x:0,v:0},lean:{x:0,v:0},armL:{x:0,v:0},armR:{x:0,v:0}},
    py:0,vy:0,px:0,vx:0,pr:0,vr:0,smile:svg.getAttribute("data-ojos")==="sonrisa"};
   ST.set(svg,st);if(io)io.observe(svg);else VIS.set(svg,true);return st}
  function frame(now){
   raf=0;var dt=Math.min(.05,Math.max(0,(now-(last||now))/1000));last=now;
   if(document.hidden)return;
   var any=false,rm=RMq();
   for(var i=0;i<list.length;i++){var svg=list[i],st=ST.get(svg)||init(svg);if(!VIS.get(svg))continue;any=true;step(svg,st,dt,rm,now)}
   if(any)raf=requestAnimationFrame(frame);
  }
  function go(){if(!raf&&!document.hidden){last=0;raf=requestAnimationFrame(frame)}}
  document.addEventListener("visibilitychange",go);
  /* registra los Rumbo que aparecen después */
  setInterval(function(){for(var i=0;i<list.length;i++)if(!ST.get(list[i]))init(list[i]);go()},600);
  var DUR={jump:.72,tilt:.6,shake:.45,look:1.1,wave:1.7,yes:1.05,oops:1.7,cheer:1.9,adjust:1.5,sway:2.4,yawn:1.9};
  function act(st,k){st.act={k:k,t:0,d:DUR[k]}}
  function ease(x){x=cl(x,0,1);return x*x*(3-2*x)}
  /* envolvente: entra en a segundos, sale en b segundos antes del final */
  function env(A,a,b){return Math.min(ease(A.t/a),ease((A.d-A.t)/b))}
  function blink(st){if(st.blinkT<0){st.blinkT=0;st.blinkD=rnd(.12,.18);st.twice=Math.random()<.18}}
  function setA(el,k,v,cache,key){if(cache[key]!==v){cache[key]=v;el.setAttribute(k,v)}}
  /* salto con anticipación, estiramiento, aterrizaje y asentamiento */
  function hop(p,H){H=H||16;var o={y:0,sy:1,up:0};if(p<.16){var k=ease(p/.16);o.y=1.6*k;o.sy=1-.075*k}else if(p<.72){var k2=(p-.16)/.56;o.y=-H*Math.sin(Math.PI*k2);o.sy=1+.06*Math.max(0,1-k2*2.6);o.up=1}else{var k3=(p-.72)/.28,sq=Math.sin(Math.PI*k3)*(1-k3*.4);o.sy=1-.07*sq;o.y=1.2*sq;o.up=1-ease(k3)}return o}
  function step(svg,st,dt,rm,now){
   var wr=svg.parentNode,cls=wr&&wr.classList,g=st.g;st.t+=dt;var t=st.t;
   if(!cls)return;
   var dm=(wr.getAttribute("data-mood"))||"idle";
   /* acciones de un solo tiro que pide la app con clases a-* */
   for(var k in DUR)if(cls.contains("a-"+k)){cls.remove("a-"+k);act(st,k)}
   var loop=cls.contains("walk")?"walk":(cls.contains("cheer")||cls.contains("dance"))?"cheer":"idle";
   /* variaciones en reposo cada 10 a 15 s para que nunca se vea en bucle */
   if(loop==="idle"&&!st.act&&!cls.contains("p-wave")&&!cls.contains("p-point")&&(dm==="idle"||dm==="happy")&&!rm){st.idleIn-=dt;if(st.idleIn<=0){var opts=["look","adjust","sway","yawn"].filter(function(o){return o!==st.lastIdle});st.lastIdle=opts[Math.floor(Math.random()*opts.length)];act(st,st.lastIdle);st.idleIn=rnd(10,15)}}
   /* expresión efectiva: las coreografías pueden poner una por un momento */
   var A=st.act,ovm=null;
   if(A){var pa=A.t/A.d;ovm=A.k==="yes"||A.k==="cheer"?"joy":A.k==="wave"?"happy":A.k==="oops"?(pa<.45?"sad":"sadhope"):A.k==="yawn"?(pa>.12&&pa<.8?"yawn":null):A.k==="look"?"curious":null;if(ovm)st.ov={m:ovm,until:t+.35}}
   var mood=st.ov&&t<st.ov.until?st.ov.m:dm;if(!EP[mood])mood=EP[dm]?dm:"idle";
   if(st.mood!==mood){if(st.mood!==null&&mood!=="sleep"&&mood!=="joy")blink(st);st.mood=mood}
   /* mezcla suave entre estados (≈200 ms) */
   var a=1-Math.exp(-dt/.07);["idle","walk","cheer"].forEach(function(k){st.w[k]+=((k===loop?1:0)-st.w[k])*a});
   st.pose.wave+=((cls.contains("p-wave")?1:0)-st.pose.wave)*a;st.pose.point+=((cls.contains("p-point")?1:0)-st.pose.point)*a;
   var W=st.w,B={x:0,y:0,r:0,sy:1},lift=0,legL=0,legR=0,lyL=0,lyR=0,aL=0,aR=0,sway=0,lean=0,gogY=0,look=null;
   if(!rm){
    /* reposo: respiración sutil y flecha que busca el norte */
    var br=Math.sin(t*2*Math.PI/3.4),slp=mood==="sleep"?1.8:1,bw=cls.contains("float")?1:.4;
    B.sy+=W.idle*.016*br*slp*bw;B.y+=W.idle*-.25*br*bw;sway+=W.idle*4*Math.sin(t*2*Math.PI/2.8);
    /* caminar: cada pie se levanta por turnos desde la cadera; el cuerpo sube con la pierna recta y baja al apoyar */
    var ph=t*2*Math.PI/.52,s1=Math.sin(ph),c2=Math.cos(2*ph);
    legL+=W.walk*7*s1;legR+=W.walk*7*s1;lyL+=W.walk*-2.6*Math.max(0,s1);lyR+=W.walk*-2.6*Math.max(0,-s1);B.y+=W.walk*-2.2*(.5+.5*c2);B.sy+=W.walk*-.035*(.5-.5*c2);
    B.r+=W.walk*2.2*s1;aL+=W.walk*-16*s1;aR+=W.walk*16*s1;lean+=W.walk*3.5;
    if(W.cheer>.001){var hp=hop((t%.9)/.9);lift+=W.cheer*Math.min(0,hp.y);B.y+=W.cheer*Math.max(0,hp.y);B.sy+=W.cheer*(hp.sy-1);aL+=W.cheer*hp.up*112;aR-=W.cheer*hp.up*112}
    /* poses */
    aR+=st.pose.wave*(-84-18*(.5+.5*Math.sin(t*2*Math.PI/.9)))+st.pose.point*(-82);lean+=st.pose.point*2;
    /* coreografías */
    if(A){A.t+=dt;var p=Math.min(1,A.t/A.d),e;
     if(A.k==="jump"){var hj=hop(p);lift+=Math.min(0,hj.y);B.y+=Math.max(0,hj.y);B.sy+=hj.sy-1;aL+=hj.up*100;aR-=hj.up*100}
     else if(A.k==="yes"){var hy2=hop(cl(p/.85,0,1),11);lift+=Math.min(0,hy2.y);B.y+=Math.max(0,hy2.y);B.sy+=hy2.sy-1;aL+=hy2.up*120;aR-=hy2.up*120}
     else if(A.k==="cheer"){var q2=cl(p/.92,0,1),hc=hop((q2*2)%1,15);if(q2>=1)hc={y:0,sy:1,up:0};lift+=Math.min(0,hc.y);B.y+=Math.max(0,hc.y);B.sy+=hc.sy-1;e=env(A,.12,.35);aL+=e*135;aR-=e*135;B.r+=e*3*Math.sin(A.t*2*Math.PI/.45)}
     else if(A.k==="wave"){e=env(A,.22,.35);aR+=e*(-86+(A.t>.3&&A.t<1.3?-22*Math.sin((A.t-.3)*2*Math.PI/.34):0));B.r+=-2.4*e;look=[1.2,-.4]}
     else if(A.k==="oops"){var e1=ease(A.t/.32),e2=ease((A.t-.75)/.5);B.y+=1.8*e1*(1-e2);B.sy+=-.04*e1*(1-e2);B.r+=(-4*e1*(1-e2))+3*Math.sin(cl((A.t-.95)/.6,0,1)*Math.PI*2)*(1-ease((A.t-.95)/.6))*e2;aL+=-12*e1*(1-e2);aR+=12*e1*(1-e2);look=A.t<.9?[-.6,1.6]:null}
     else if(A.k==="adjust"){e=env(A,.32,.4);aL+=e*146;gogY=A.t>.45&&A.t<.95?-1.2*Math.sin((A.t-.45)/.5*Math.PI):0;look=[0,-1.8]}
     else if(A.k==="sway"){e=env(A,.4,.5);B.r+=3*Math.sin(A.t*2*Math.PI/1.2)*e}
     else if(A.k==="yawn"){e=env(A,.4,.6);B.sy+=.045*e;aL+=40*e;aR-=40*e}
     else if(A.k==="tilt")B.r+=p<.3?-9*Math.sin(p/.3*Math.PI/2):p<.65?-9+15*((p-.3)/.35):6*(1-(p-.65)/.35);
     else if(A.k==="shake")B.x+=2.6*Math.sin(p*Math.PI*8)*(1-p);
     else if(A.k==="look"){B.r+=(p>.22&&p<.58)?-6:p>.78?2*(1-p)/.22:0;look=p<.22?[0,0]:p<.58?[-2,-.4]:p<.85?[2,-.4]:[0,0]}
     if(p>=1)st.act=null}
    B.sy=cl(B.sy,.92,1.08);
   }
   /* inclinación con resorte: al detenerse se pasa un poco y se asienta */
   B.r+=rm?0:spring(st.sp.lean,lean,dt,70,7,8);
   /* aplastar y estirar conservando el volumen */
   B.sx=1/B.sy;
   /* brazos con resorte (pequeño rebote al llegar) */
   aL=rm?0:spring(st.sp.armL,aL,dt,170,14,150);aR=rm?0:spring(st.sp.armR,aR,dt,170,14,150);
   /* velocidades del cuerpo para el escalonamiento: cara, luego gorro y gafas, al final orejeras y flecha */
   var yy=B.y+lift,vy=(yy-st.py)/(dt||.016);st.py=yy;st.vy+=(vy-st.vy)*.5;
   var vx=(B.x-st.px)/(dt||.016);st.px=B.x;st.vx+=(vx-st.vx)*.5;var vr=(B.r-st.pr)/(dt||.016);st.pr=B.r;st.vr+=(vr-st.vr)*.5;
   var fy=spring(st.sp.face,cl(st.vy*.012,-.8,.8),dt,190,17,.9),fx=spring(st.sp.faceX,cl(-st.vx*.012-st.vr*.01,-.8,.8),dt,190,17,.9);
   var hy=spring(st.sp.hat,cl(st.vy*.025,-1.2,1.2),dt,120,12,1.2),hr=spring(st.sp.hatR,cl(-st.vr*.03,-4,4),dt,110,10,4);
   var gy=spring(st.sp.gog,cl(st.vy*.03,-1.2,1.2)+gogY,dt,95,9,1.6);
   var ar=spring(st.sp.arrow,sway+B.r*.6+cl(-st.vy*.12,-8,8)+(mood==="sad"?-10:0),dt,70,7,12);
   var fl=spring(st.sp.flapL,cl(st.vy*.25+st.vr*.2,-15,15),dt,60,6,15),fr=spring(st.sp.flapR,cl(-st.vy*.25+st.vr*.2,-15,15),dt,60,6,15);
   if(rm){ar=0;fl=0;fr=0;gy=0;hy=0;hr=0;fx=0;fy=0}
   var flip=cls.contains("left")?-1:1;
   /* el salto mueve todo el personaje; la sombra se queda en el suelo y se encoge */
   T(g.root,{sx:flip,y:lift});
   var hgt=Math.max(0,-lift);T(g.shadow,{y:-lift,sx:1-hgt/36,sy:1-hgt/36});
   T(g.body,B);T(g.legL,{r:legL,y:lyL+Math.max(0,B.y*.15)});T(g.legR,{r:legR,y:lyR+Math.max(0,B.y*.15)});
   T(g.armL,{r:aL});T(g.armR,{r:aR});
   T(g.face,{x:fx,y:fy});T(g.brows,{x:fx,y:fy});
   T(g.hat,{y:hy,r:hr});T(g.arrow,{r:ar});T(g.flapL,{r:fl});T(g.flapR,{r:fr});T(g.gog,{y:gy});
   /* ---------- parpadeo: baja rápido (40 %) y sube más lento (60 %); a veces doble ---------- */
   if(cls.contains("blink")||cls.contains("a-blink")){cls.remove("blink");cls.remove("a-blink");blink(st)}
   var bl=0;if(mood!=="sleep"&&!rm){st.blinkIn-=dt;if(st.blinkIn<=0)blink(st);
    if(st.blinkT>=0){st.blinkT+=dt;var bp=st.blinkT/st.blinkD;bl=bp<.4?1-Math.pow(1-bp/.4,2):bp<1?1-ease((bp-.4)/.6):0;
     if(bp>=1){if(st.twice){st.twice=false;st.blinkT=-1;st.blinkIn=.08}else{st.blinkT=-1;st.blinkIn=rnd(2,6)}}}}
   /* ---------- mirada ---------- */
   var tg=null;
   if(cls.contains("g-l"))tg=[-2.2,.2];else if(cls.contains("g-r"))tg=[2.2,.2];else if(cls.contains("g-u"))tg=[.8,-1.8];
   else if(look)tg=look;
   else if(now-PTR.t<2500){if(!st.rc||t-st.rcT>.3){st.rc=svg.getBoundingClientRect();st.rcT=t}var rc=st.rc;if(rc.width){var dx=PTR.x-(rc.left+rc.width/2),dy=PTR.y-(rc.top+rc.height*.56);tg=[2.1*cl(dx/180,-1,1)*flip,1.8*cl(dy/180,-1,1)]}}
   if(!tg){var lsel=wr.getAttribute("data-look");if(lsel){if(!st.lk||t-st.lkT>.5){var le=document.querySelector(lsel);st.lk=le?le.getBoundingClientRect():null;st.lkT=t;st.rc=svg.getBoundingClientRect()}if(st.lk&&st.rc){var dx2=st.lk.left+st.lk.width/2-(st.rc.left+st.rc.width/2),dy2=st.lk.top+st.lk.height/2-(st.rc.top+st.rc.height*.56);tg=[2.1*cl(dx2/180,-1,1)*flip,1.8*cl(dy2/180,-1,1)]}}}
   if(!tg)tg=loop==="walk"?[1.6,0]:cls.contains("p-point")?[2.2,0]:GZ[mood]||null;
   if(!tg){st.gzIn-=dt;if(st.gzIn<=0){st.gzT=[[-1.9,0],[1.9,0],[.9,-1.2],[-.9,.8],[0,0]][Math.floor(Math.random()*5)];st.gzHold=rnd(.7,1.5);st.gzIn=rnd(2.5,6)}if(st.gzHold>0){st.gzHold-=dt;if(st.gzHold<=0)st.gzT=[0,0]}tg=st.gzT}
   /* micro movimientos al sostener la mirada */
   st.micIn-=dt;if(st.micIn<=0){st.mic=[rnd(-.28,.28),rnd(-.22,.22)];st.micIn=rnd(.35,.9)}
   var tx=tg[0]+st.mic[0],ty=tg[1]+st.mic[1];
   /* sacádico: si el punto cambia mucho, a veces parpadea antes */
   if(Math.hypot(tg[0]-(st.lt||[0,0])[0],tg[1]-(st.lt||[0,0])[1])>1.4&&Math.random()<.45)blink(st);st.lt=tg;
   var ga=rm?1:1-Math.exp(-dt/.028);st.gz[0]+=(tx-st.gz[0])*ga;st.gz[1]+=(ty-st.gz[1])*ga;
   /* ---------- párpados, pupilas y cejas ---------- */
   var ea=rm?1:1-Math.exp(-dt/.055),tgE=st.smile&&(mood==="idle"||mood==="talk"||mood==="happy")?EP.joy:EP[mood],tgB=BRW[mood]||BRW.idle;
   st.eyes.forEach(function(ey,i){var c=ey.cur,T0=tgE[i];for(var k in c)c[k]+=(T0[k]-c[k])*ea;
    var cx=ey.cx,cy=ey.cy,rx=ey.rx,ry=ey.ry,closed=c.u+c.l>.95,b=closed?0:bl;
    var l=c.l+(Math.max(c.l,.4)-c.l)*b,u=c.u+((1-l)-c.u)*b,bb=c.b+(1.4-c.b)*b,cc=c.c+(-1.4-c.c)*b;
    var side=i===0?-1:1,x0=cx-rx-1.2,x1=cx+rx+1.2,yu=cy-ry+u*2*ry,yo=yu+c.t,yi=yu-c.t*.25;
    var yuL=side<0?yo:yi,yuR=side<0?yi:yo,qu=2*(yu+bb)-(yuL+yuR)/2;
    var yl=cy+ry-l*2*ry,ql=2*(yl-cc)-yl;
    var up="M"+f(x0)+" "+f(cy-ry-1.5)+"H"+f(x1)+"V"+f(yuR)+"Q"+f(cx)+" "+f(qu)+" "+f(x0)+" "+f(yuL)+"Z";
    var la0=cx-rx-.3,la1=cx+rx+.3,lash="M"+f(la0)+" "+f(yuL)+"Q"+f(cx)+" "+f(qu)+" "+f(la1)+" "+f(yuR);
    var lo="M"+f(x0)+" "+f(cy+ry+1.5)+"H"+f(x1)+"V"+f(yl)+"Q"+f(cx)+" "+f(ql)+" "+f(x0)+" "+f(yl)+"Z";
    var lol="M"+f(la0)+" "+f(yl)+"Q"+f(cx)+" "+f(ql)+" "+f(la1)+" "+f(yl);
    var shut=cl((u+l-.7)/.3,0,1);
    setA(ey.up,"d",up,ey.last,"u");setA(ey.lash,"d",lash,ey.last,"a");setA(ey.lo,"d",lo,ey.last,"o");setA(ey.lol,"d",lol,ey.last,"ol");
    setA(ey.lash,"stroke-opacity",f(shut),ey.last,"aw");
    var ssx=c.s*(1+.04*bl),ssy=c.s*(1-.1*bl);
    /* la mirada mueve el ojo entero (con sus párpados) sobre la cara */
    setA(ey.sq,"transform","translate("+f(st.gz[0]*.7+cx)+" "+f(st.gz[1]*.7+cy)+") scale("+f(ssx)+" "+f(ssy)+") translate("+(-cx)+" "+(-cy)+")",ey.last,"s");
    setA(ey.pup,"transform","translate(0 "+f(.5*bl)+")",ey.last,"p");
    if(ey.iris)setA(ey.iris,"transform","translate("+f(st.gz[0]*.7)+" "+f(st.gz[1]*.7)+")",ey.last,"i")});
   st.brw.forEach(function(bw2,i){var tb=tgB[i];bw2.dy+=(tb[0]-bw2.dy)*ea;bw2.a+=(tb[1]-bw2.a)*ea;var e2=st.eyes[i],lift2=bl*.5;
    bw2.e.setAttribute("transform","translate("+f(e2.cx+st.gz[0]*.15)+" "+f(e2.cy-e2.ry-3.4+bw2.dy+lift2)+") rotate("+f(bw2.a)+")")});
   /* bocas con fundido corto */
   var fa=rm?1:1-Math.exp(-dt/.05);
   st.dp.forEach(function(d){var tgt=d.w.indexOf(mood)>-1?1:0;if(d.o<0)d.o=tgt;else d.o+=(tgt-d.o)*fa;var v=Math.round(d.o*100)/100;if(v!==d.last){d.e.style.opacity=v;d.last=v}});
   if(g.mouth&&mood==="talk"){var m=.35+.65*(.5+.5*Math.sin(t*2*Math.PI*3.6));g.mouth.setAttribute("transform","translate(0 67.8) scale(1 "+f(m)+") translate(0 -67.8)")}
   if(g.zz){var z=(t%2.4)/2.4;g.zz.setAttribute("transform","translate("+f(z*2)+" "+f(2-z*6)+")");g.zz.style.opacity=mood==="sleep"?f(Math.sin(Math.PI*z)):0}
  }
  return {go:go};
 })();
 var NAMES={v1:"Actual (v1)",A:"A · Globo",B:"B · Brújula",C:"C · Híbrido"};
 var cur=null;try{cur=localStorage.getItem("vocatlas_rumbo")}catch(e){}
 function pick(m){if(m){cur=m;try{localStorage.setItem("vocatlas_rumbo",m)}catch(e){}}return cur||"B"}
 function svg(m,ek){m=m||pick();return m==="v1"?rumboSVG():build(m,ek)}
 return {svg:svg,build:build,pick:pick,EYES:EYES,EYEK:EYEK,eyePick:eyePick,NAMES:NAMES,models:["v1","A","B","C"]};
})();
