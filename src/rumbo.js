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
   else s+='<path class="rk-tick" d="M'+(CX+v[0]*(r-1.4)).toFixed(1)+' '+(CY+v[1]*(r-1.4)).toFixed(1)+'L'+(CX+v[0]*(r-4.6)).toFixed(1)+' '+(CY+v[1]*(r-4.6)).toFixed(1)+'" stroke="'+mk+'" stroke-width="2.2" stroke-linecap="round"/>'});
  if(!withGlobe)[[.71,.71],[-.71,.71]].forEach(function(v){s+='<circle class="rk-tick" cx="'+(CX+v[0]*(r-2.4)).toFixed(1)+'" cy="'+(CY+v[1]*(r-2.4)).toFixed(1)+'" r="1" fill="'+mk+'"/>'});
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
  sonrisa:{n:"Siempre sonriente",d:"En reposo los ojos son arcos felices; se abren para sorprenderse o pensar.",c:[[41.6,58],[58.4,58]],rx:3.5,ry:4,idle:"joy"},
  grandes:{n:"Grandes brillantes",d:"Óvalos grandes con dos brillos, muy expresivos.",c:[[40.8,57.4],[59.2,57.4]],rx:4.4,ry:5.4},
  medialuna:{n:"Media luna",d:"Puntos con el párpado de abajo un poco arriba: sonríe con la mirada.",c:[[41.6,58],[58.4,58]],rx:3.5,ry:4,idle:"happy"},
  ambar:{n:"Ámbar",d:"Iris color latón, como la brújula, con pupila y brillo.",c:[[41,57.4],[59,57.4]],rx:4,ry:4.6},
  cielo:{n:"Cielo",d:"Iris azul cielo, como las gafas, con pupila y brillo.",c:[[41,57.4],[59,57.4]],rx:4,ry:4.6},
  clasico:{n:"Clásico",d:"Óvalos altos con una cuña de brillo, como en las caricaturas antiguas.",c:[[43,57.2],[57,57.2]],rx:2.7,ry:4.8},
  sinbrillo:{n:"Sin brillo",d:"Puntos limpios, sin brillo. Lo más mínimo.",c:[[42.2,58.4],[57.8,58.4]],rx:3,ry:3.2},
  horizontal:{n:"Horizontales",d:"Óvalos más anchos que altos: mirada tranquila y dulce.",c:[[41.4,58.4],[58.6,58.4]],rx:3.8,ry:2.9},
  separados:{n:"Separados",d:"Botones más abajo y más separados: cara de bebé.",c:[[39.4,59.4],[60.6,59.4]],rx:3,ry:3.2},
  pestanas:{n:"Pestañitas",d:"Puntos con dos pestañitas hacia afuera.",c:[[41.8,58.2],[58.2,58.2]],rx:3.2,ry:3.5},
  retro:{n:"Retro",d:"Ojos negros en forma de huevo, inclinados, con un brillo ovalado grande adentro, arriba.",c:[[43,57.4],[57,57.4]],rx:4.1,ry:6.2},
  story:{n:"Libro",d:"Ojos grandes café con dos brillos.",c:[[43.6,57.8],[56.4,57.8]],rx:4.5,ry:5.2},
  orig3:{n:"Original",d:"Ojos de la imagen de referencia, un poco más grandes.",c:[[41.5,53.6],[58.7,53.6]],rx:3.7,ry:4.3},
  orig2:{n:"Original",d:"Ojos del Rumbo original, brillo arriba a la derecha.",c:[[43.2,52.1],[59.36,52.1]],rx:3.32,ry:3.7},
  original:{n:"Original",d:"Los ojos del Rumbo original.",c:[[43.2,54.6],[56.8,54.6]],rx:3.3,ry:3.8},
  destellos:{n:"Dos destellos",d:"Óvalos con dos estrellitas de brújula como brillo.",c:[[41.4,57.6],[58.6,57.6]],rx:3.7,ry:4.5},
  enormes:{n:"Enormes",d:"Ojos grandes con blanco y pupilas grandes que casi se tocan. Mucha expresión.",c:[[40.4,57],[59.6,57]],rx:6.2,ry:6.8},
  anime:{n:"Animé",d:"Óvalos grandes con iris en degradado ámbar y varios brillos.",c:[[41,57.2],[59,57.2]],rx:4.6,ry:5.8},
  gafas:{n:"Tras las gafas",d:"Las gafas bajan a los ojos: ojos grandes detrás de los lentes.",c:[[40.6,56.4],[59.4,56.4]],rx:4.4,ry:4.8,lid:"#D3EEF1"},
  antifaz:{n:"Antifaz de aviador",d:"Un antifaz café detrás de ojos blancos con pupila: aventurero.",c:[[41,57.4],[59,57.4]],rx:4.2,ry:4.6,lid:"#6E4226"},
  gotas:{n:"Gotitas",d:"Ojos en forma de gota, redondos abajo, con brillo.",c:[[41.8,57.6],[58.2,57.6]],rx:3.4,ry:4.6},
  cuadritos:{n:"Cuadraditos",d:"Cuadrados con esquinas muy redondas: geométrico y tierno.",c:[[41.6,57.8],[58.4,57.8]],rx:3.4,ry:3.8},
  iris:{n:"Iris verde agua",d:"Blanco, iris verde agua grande y pupila: mirada cálida.",c:[[40.8,57],[59.2,57]],rx:5.2,ry:5.6},
  cejas:{n:"Cejas protagonistas",d:"Puntos mínimos y cejas grandes que hacen casi toda la expresión.",c:[[42.4,58.6],[57.6,58.6]],rx:2.4,ry:2.6,brow:1.6}};
 var EYEK=["enormes","anime","gafas","antifaz","gotas","cuadritos","iris","cejas","boton","frijol","brillo","blanco","aguja","sonrisa","grandes","medialuna","ambar","cielo","clasico","sinbrillo","horizontal","separados","pestanas","destellos"];
 var eyeCur=null;try{eyeCur=localStorage.getItem("vocatlas_ojos")}catch(e){}
 function eyePick(k){if(k){eyeCur=k;try{localStorage.setItem("vocatlas_ojos",k)}catch(e){}}return EYES[eyeCur]?eyeCur:"boton"}
 function eyeM(id,i,skin,ek){var E0=EYES[ek];skin=E0.lid||skin;var c=E0.c[i],cx=c[0],cy=c[1],rx=E0.rx,ry=E0.ry,cid=id+"e"+i,g="";
  if(ek==="enormes"||ek==="iris"||ek==="gafas"||ek==="antifaz"){
   var pr=ek==="enormes"?3.9:ek==="iris"?2.2:ek==="gafas"?3:2.8;
   g=(ek==="enormes"||ek==="iris"?'<ellipse cx="'+cx+'" cy="'+(cy+.6)+'" rx="'+rx+'" ry="'+ry+'" fill="#E9D6B0"/>':'')+'<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="#FFFFFF"/>'+
    '<clipPath id="'+cid+'w"><ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'"/></clipPath><g clip-path="url(#'+cid+'w)"><g class="rk-iris">'+
    (ek==="iris"?'<circle cx="'+cx+'" cy="'+(cy+.4)+'" r="4" fill="#2E9C8F"/><circle cx="'+cx+'" cy="'+(cy+.4)+'" r="4" fill="none" stroke="#1F6E66" stroke-width=".8"/>':'')+
    '<circle cx="'+cx+'" cy="'+(cy+.5)+'" r="'+pr+'" fill="'+INK+'"/><circle cx="'+(cx-pr*.36)+'" cy="'+(cy-pr*.3)+'" r="'+(pr*.36)+'" fill="#FFFFFF"/><circle cx="'+(cx+pr*.38)+'" cy="'+(cy+pr*.55)+'" r="'+(pr*.16)+'" fill="#FFFFFF"/></g></g>'}
  else if(ek==="anime"){var gid=cid+"g";
   g='<defs><linearGradient id="'+gid+'" x1="0" y1="0" x2="0" y2="1"><stop offset=".35" stop-color="'+INK+'"/><stop offset="1" stop-color="#C98A2E"/></linearGradient></defs><ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="url(#'+gid+')"/>'+
    '<ellipse cx="'+(cx-1.4)+'" cy="'+(cy-2.4)+'" rx="1.7" ry="2" fill="#FFFFFF"/><circle cx="'+(cx+1.6)+'" cy="'+(cy+2.2)+'" r=".8" fill="#FFFFFF"/><circle cx="'+(cx+2)+'" cy="'+(cy-2.6)+'" r=".45" fill="#FFFFFF"/>'}
  else if(ek==="gotas")g='<path d="M'+cx+' '+(cy-ry)+'C'+(cx+rx*.6)+' '+(cy-ry*.45)+' '+(cx+rx)+' '+(cy+ry*.05)+' '+(cx+rx)+' '+(cy+ry*.4)+'C'+(cx+rx)+' '+(cy+ry*1.05)+' '+(cx-rx)+' '+(cy+ry*1.05)+' '+(cx-rx)+' '+(cy+ry*.4)+'C'+(cx-rx)+' '+(cy+ry*.05)+' '+(cx-rx*.6)+' '+(cy-ry*.45)+' '+cx+' '+(cy-ry)+'Z" fill="'+INK+'"/><circle cx="'+(cx-1)+'" cy="'+(cy+.2)+'" r="1.15" fill="#FFFFFF"/>';
  else if(ek==="cuadritos")g='<rect x="'+(cx-rx)+'" y="'+(cy-ry)+'" width="'+(2*rx)+'" height="'+(2*ry)+'" rx="2.2" fill="'+INK+'"/><rect x="'+(cx-2.1)+'" y="'+(cy-2.5)+'" width="1.9" height="1.9" rx=".7" fill="#FFFFFF"/>';
  else if(ek==="blanco"){
   g='<ellipse cx="'+cx+'" cy="'+(cy+.5)+'" rx="'+rx+'" ry="'+ry+'" fill="#E9D6B0"/><ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="#FFFFFF"/>'+
    '<clipPath id="'+cid+'w"><ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'"/></clipPath><g clip-path="url(#'+cid+'w)"><g class="rk-iris">'+
    '<circle cx="'+cx+'" cy="'+(cy+.6)+'" r="3.5" fill="'+INK+'"/><circle cx="'+(cx-1.1)+'" cy="'+(cy-.6)+'" r="1.25" fill="#FFFFFF"/><circle cx="'+(cx+1.2)+'" cy="'+(cy+1.9)+'" r=".55" fill="#FFFFFF"/></g></g>'}
  else{g='<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="'+INK+'"/>';
   if(ek==="boton")g+='<circle cx="'+(cx-1)+'" cy="'+(cy-1.2)+'" r="1.05" fill="#FFFFFF"/>';
   else if(ek==="frijol")g+='<ellipse cx="'+(cx-.6)+'" cy="'+(cy-2.2)+'" rx=".9" ry="1.2" fill="#FFFFFF"/>';
   else if(ek==="brillo")g+='<circle cx="'+(cx-1.15)+'" cy="'+(cy-1.75)+'" r="1.35" fill="#FFFFFF"/><path d="'+STAR+'" transform="translate('+(cx+1.3)+' '+(cy+1.55)+') scale(.78)" fill="#FFFFFF"/>';
   else if(ek==="aguja")g+='<path d="M'+(cx-2.2)+' '+(cy-.2)+'L'+(cx-.9)+' '+(cy-2.6)+'L'+(cx+.1)+' '+(cy-1.6)+'Z" fill="#FFFFFF"/><circle cx="'+(cx+1.3)+'" cy="'+(cy+1.4)+'" r=".55" fill="#FFFFFF"/>';
   else if(ek==="grandes")g+='<circle cx="'+(cx-1.4)+'" cy="'+(cy-2.1)+'" r="1.75" fill="#FFFFFF"/><circle cx="'+(cx+1.6)+'" cy="'+(cy+2)+'" r=".9" fill="#FFFFFF"/>';
   else if(ek==="ambar"||ek==="cielo"){var IR=ek==="ambar"?"#C98A2E":"#4FA3C7";g+='<ellipse cx="'+cx+'" cy="'+(cy+.3)+'" rx="'+(rx*.74)+'" ry="'+(ry*.74)+'" fill="'+IR+'"/><ellipse cx="'+cx+'" cy="'+(cy+.5)+'" rx="'+(rx*.4)+'" ry="'+(ry*.42)+'" fill="'+INK+'"/><circle cx="'+(cx-1.2)+'" cy="'+(cy-1.4)+'" r="1.2" fill="#FFFFFF"/><circle cx="'+(cx+1.2)+'" cy="'+(cy+1.6)+'" r=".5" fill="#FFFFFF"/>'}
   else if(ek==="clasico")g+='<clipPath id="'+cid+'p"><ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'"/></clipPath><path clip-path="url(#'+cid+'p)" d="M'+(cx+.1)+' '+(cy-1.2)+'L'+(cx+.6)+' '+(cy-6)+'L'+(cx+3.4)+' '+(cy-3.2)+'Z" fill="#FFFFFF"/>';
   else if(ek==="sinbrillo"){}
   else if(ek==="retro"){/* forma de huevo (más ancha abajo), los dos inclinados hacia el mismo lado; brillo ovalado grande adentro, arriba, con borde negro alrededor */
    var e=function(a,b){return (cx+a*rx).toFixed(2)+' '+(cy+b*ry).toFixed(2)};
    g='<g transform="rotate(9 '+cx+' '+cy+')"><path d="M'+e(0,-1)+'C'+e(.62,-1)+' '+e(1,-.45)+' '+e(1,.15)+'C'+e(1,.72)+' '+e(.56,1)+' '+e(0,1)+'C'+e(-.56,1)+' '+e(-1,.72)+' '+e(-1,.15)+'C'+e(-1,-.45)+' '+e(-.62,-1)+' '+e(0,-1)+'Z" fill="#111111"/>'+
    '<ellipse cx="'+(cx+rx*.2).toFixed(2)+'" cy="'+(cy-ry*.33).toFixed(2)+'" rx="'+(rx*.56).toFixed(2)+'" ry="'+(ry*.42).toFixed(2)+'" fill="#FFFFFF" transform="rotate(12 '+(cx+rx*.2).toFixed(2)+' '+(cy-ry*.33).toFixed(2)+')"/></g>'}
   else if(ek==="story")g='<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="#3A2213"/><ellipse cx="'+cx+'" cy="'+(cy+1.6)+'" rx="'+(rx*.7)+'" ry="'+(ry*.5)+'" fill="#5C3A20"/><circle cx="'+(cx+1.4)+'" cy="'+(cy-1.8)+'" r="1.7" fill="#FFFFFF"/><circle cx="'+(cx-1.6)+'" cy="'+(cy+1.9)+'" r=".7" fill="#FFFFFF"/>';
   else if(ek==="orig3")g='<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="#10204A"/><circle cx="'+(cx+1.15)+'" cy="'+(cy-1.3)+'" r="1.18" fill="#FFFFFF"/>';
   else if(ek==="orig2")g='<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="#10204A"/><circle cx="'+(cx+.98)+'" cy="'+(cy-1.56)+'" r="1.07" fill="#FFFFFF"/>';
   else if(ek==="pestanas"){var sd=i?1:-1;g+='<circle cx="'+(cx-1)+'" cy="'+(cy-1.2)+'" r="1.05" fill="#FFFFFF"/><path d="M'+(cx+sd*2.4)+' '+(cy-2.3)+'L'+(cx+sd*4.4)+' '+(cy-3.9)+'M'+(cx+sd*3)+' '+(cy-1.1)+'L'+(cx+sd*5.1)+' '+(cy-2)+'" stroke="'+INK+'" stroke-width="1.1" stroke-linecap="round"/>'}
   else if(ek==="destellos")g+='<path d="'+STAR+'" transform="translate('+(cx-1.1)+' '+(cy-1.7)+') scale(1.35)" fill="#FFFFFF"/><path d="'+STAR+'" transform="translate('+(cx+1.3)+' '+(cy+1.6)+') scale(.75)" fill="#FFFFFF"/>';
   else g+='<circle cx="'+(cx-1)+'" cy="'+(cy-1.4)+'" r="1.15" fill="#FFFFFF"/>'}
  return '<g class="rk-eye" data-i="'+i+'" data-cx="'+cx+'" data-cy="'+cy+'" data-rx="'+rx+'" data-ry="'+ry+'"><g class="rk-esq"><g class="rk-pup">'+g+'</g>'+
   '<clipPath id="'+cid+'k"><ellipse cx="'+cx+'" cy="'+cy+'" rx="'+(rx+1.4)+'" ry="'+(ry+1.4)+'"/></clipPath><g clip-path="url(#'+cid+'k)">'+
   '<path class="rk-lo" fill="'+skin+'"/><path class="rk-lol" fill="none" stroke="none"/>'+
   '<path class="rk-up" fill="'+skin+'"/><path class="rk-lash" fill="none" stroke="'+INK+'" stroke-width="1.9" stroke-linecap="round" stroke-opacity="0"/>'+
   '</g></g></g>'}
 function face(skin,id,ek){
  var s='';
  /* mejillas planas */
  var E0=EYES[ek];
  if(ek==="antifaz")s+='<path d="M30.6 57.4Q30.6 50.6 41 50.6Q46 50.6 50 52.6Q54 50.6 59 50.6Q69.4 50.6 69.4 57.4Q69.4 64.4 59 64.4Q54 64.4 50 61.4Q46 64.4 41 64.4Q30.6 64.4 30.6 57.4Z" fill="#6E4226"/><path d="M32.4 55Q33.6 51.8 39 51.6" stroke="#8E5A36" stroke-width="1.2" fill="none" stroke-linecap="round"/>';
  if(ek==="gafas")E0.c.forEach(function(c){s+='<circle cx="'+(c[0]+.5)+'" cy="'+(c[1]+.6)+'" r="7.6" fill="'+BRS+'"/><circle cx="'+c[0]+'" cy="'+c[1]+'" r="7.6" fill="'+BR+'"/><circle cx="'+c[0]+'" cy="'+c[1]+'" r="6" fill="#D3EEF1"/>'});
  s+=eyeM(id,0,skin,ek)+eyeM(id,1,skin,ek);
  if(ek==="gafas")s+='<rect x="47.4" y="55" width="5.2" height="2.6" rx="1.3" fill="'+BRS+'"/>'+E0.c.map(function(c){return '<path d="M'+(c[0]-4.4)+' '+(c[1]-1.6)+'Q'+(c[0]-3.6)+' '+(c[1]-4.4)+' '+(c[0]-.6)+' '+(c[1]-5)+'" stroke="#FFFFFF" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".8"/>'}).join("");
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
  s+='<path class="rk-capj" d="'+CAPD+'" fill="'+CAP+'"/><g clip-path="url(#'+id+'c)"><path d="M54 20L84 20L84 55L60 55Q64 40 54 20Z" fill="'+CAPS+'"/><path class="rk-caphl" d="M28 42Q29 31 40 27.4" stroke="'+CAPH+'" stroke-width="2" fill="none" stroke-linecap="round"/></g>';
  /* borde con grosor: baja un poco sobre la cabeza para que nunca aparezca un hueco */
  s+='<path class="rk-capj" d="M22 51Q34 44 50 44Q66 44 78 51L78 53.6Q66 46.6 50 46.6Q34 46.6 22 53.6Z" fill="'+CAPS+'"/>';
  s+='<path class="rk-strap" d="M23.2 41.4Q50 31.6 76.8 41.4L76.4 44.4Q50 34.8 23.6 44.4Z" fill="'+STRAP+'"/>';
  s+='<ellipse cx="50" cy="25.6" rx="4.6" ry="1.7" fill="'+BRS+'"/><ellipse cx="50" cy="24.8" rx="4.6" ry="1.7" fill="'+BR+'"/>';
  return s}
 /* orejeras: nacen dentro del borde del gorro (traslape) */
 function flapL(){return '<path d="M23.6 45Q17.4 47 17 56Q16.8 63.6 21.6 64.4Q25.6 65 26.2 60.2L26.4 46.4Z" fill="'+CAP+'"/><path d="M17.2 58.6Q17.8 63.8 21.6 64.4Q25.6 65 26.2 60.2" stroke="'+LIN+'" stroke-width="2.2" fill="none" stroke-linecap="round"/>'}
 function flapR(){return '<path d="M76.4 45Q82.6 47 83 56Q83.2 63.6 78.4 64.4Q74.4 65 73.8 60.2L73.6 46.4Z" fill="'+CAPS+'"/><path d="M82.8 58.6Q82.2 63.8 78.4 64.4Q74.4 65 73.8 60.2" stroke="#D2B48A" stroke-width="2.2" fill="none" stroke-linecap="round"/>'}
 function goggles(){var s="";[[40.6,37.4],[59.4,37.4]].forEach(function(c){s+='<circle cx="'+(c[0]+.7)+'" cy="'+(c[1]+.8)+'" r="7" fill="'+BRS+'"/><circle cx="'+c[0]+'" cy="'+c[1]+'" r="7" fill="'+BR+'"/><circle cx="'+c[0]+'" cy="'+c[1]+'" r="4.8" fill="'+LENS+'"/><path d="M'+(c[0]-3)+' '+(c[1]-.6)+'Q'+(c[0]-2.4)+' '+(c[1]-3)+' '+(c[0]+.2)+' '+(c[1]-3.4)+'" stroke="#FFFFFF" stroke-width="1.5" fill="none" stroke-linecap="round"/>'});return s+'<rect x="47.2" y="36" width="5.6" height="2.8" rx="1.4" fill="'+BRS+'"/>'}
 /* flecha: el asta entra en el gorro (se dibuja antes que el casquete) */
 function arrow(){return '<rect x="48.6" y="9" width="2.8" height="19" rx="1" fill="'+GOLD+'"/><rect x="50" y="9" width="1.4" height="19" fill="'+GOLDS+'"/><path d="M50 1.6Q51.2 1.6 52 2.7L57.4 10.4Q58.3 12 56.5 12H43.5Q41.7 12 42.6 10.4L48 2.7Q48.8 1.6 50 1.6Z" fill="'+GOLD+'"/><path d="M50 1.6Q51.2 1.6 52 2.7L57.4 10.4Q58.3 12 56.5 12H50Z" fill="'+GOLDS+'"/>'}
 /* piernas: la parte alta entra por debajo del cuerpo */
 /* piernas cortas y botitas de aviador: puntera redonda hacia afuera, borde de borrego como el forro del gorro,
    ojales, suela oscura y brillo en la punta. La parte alta del pantalón entra bajo el cuerpo. */
 var BOOT="#8A5230",BOOTS="#6E3F22",BSOLE="#3E2618";
 function leg(m){var X=function(x){return (m<0?x:100-x).toFixed(2)},s="";
  var P=function(d){return d.replace(/X\(([-\d.]+)\)/g,function(_,x){return X(+x)})};
  s+='<path d="'+P("MX(41.6) 69.6LX(47.2) 69.6LX(47.2) 82.4LX(41.6) 82.4Z")+'" fill="'+LEG+'"/><path d="'+(m<0?P("MX(44.8) 69.6LX(47.2) 69.6LX(47.2) 82.4LX(44.8) 82.4Z"):"M55.8 69.6L58.4 69.6L58.4 82.4L55.8 82.4Z")+'" fill="'+LEGS+'"/>';
  /* bota */
  s+='<path d="'+P("MX(40.4) 82.2QX(40.4) 80.8 X(41.8) 80.8LX(46.8) 80.8QX(48.2) 80.8 X(48.2) 82.2LX(48.2) 88.8QX(48.2) 92 X(45) 92LX(38.4) 92QX(34.4) 92 X(34.4) 89.2QX(34.4) 86.2 X(37.8) 85.8QX(40.4) 85.5 X(40.4) 83.6Z")+'" fill="'+BOOT+'"/>';
  if(m<0)s+='<path d="'+P("MX(45.6) 80.8LX(46.8) 80.8QX(48.2) 80.8 X(48.2) 82.2LX(48.2) 88.8QX(48.2) 92 X(45) 92LX(43.6) 92QX(45.6) 91 X(45.6) 88.4Z")+'" fill="'+BOOTS+'"/>';
  s+='<path d="'+P("MX(34.5) 89.6QX(34.8) 92 X(38.4) 92LX(45) 92QX(48.2) 92 X(48.2) 89LX(48.2) 90.6QX(48) 93.4 X(45) 93.4LX(38.4) 93.4QX(34.2) 93.4 X(34.5) 89.6Z")+'" fill="'+BSOLE+'"/>';
  s+='<ellipse cx="'+X(37.4)+'" cy="87.7" rx="1.7" ry=".9" fill="#B07A50"/>';
  s+='<circle class="rk-lace" cx="'+X(43.4)+'" cy="84.6" r=".55" fill="'+LIN+'"/><circle class="rk-lace" cx="'+X(43.4)+'" cy="87" r=".55" fill="'+LIN+'"/>';
  /* borde de borrego */
  s+='<rect x="'+(m<0?39.8:100-49)+'" y="80.4" width="9.2" height="3.1" rx="1.55" fill="'+LIN+'"/><rect x="'+(m<0?45.4:56.6)+'" y="80.4" width="3.6" height="3.1" rx="1.55" fill="#D9BC92"/>';
  return s}
 function legL(){return leg(-1)}
 function legR(){return leg(1)}
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
 /* acabados: liso (el actual), tinta a mano, papel recortado y mínimo. Los tres nuevos llevan asimetría intencional:
    gorro ladeado, orejera derecha levantada y flecha un poco chueca. */
 var FIN={liso:{n:"Liso",d:"El acabado actual: formas planas y simétricas."},
  tinta:{n:"Tinta a mano",d:"Contorno de tinta con trazo irregular, como dibujado con plumón. Gorro ladeado y una orejera arriba."},
  papel:{n:"Papel recortado",d:"Capas de papel con sombra entre ellas y textura de papel. Gorro ladeado y una orejera arriba."},
  minimo:{n:"Mínimo",d:"Muy pocas piezas, como un logotipo: sin gafas, sin correa, sin marcas. Gorro ladeado."}};
 var FINK=["liso","tinta","papel","minimo"];
 var finCur=null;try{finCur=localStorage.getItem("vocatlas_acabado")}catch(e){}
 function finPick(k){if(k){finCur=k;try{localStorage.setItem("vocatlas_acabado",k)}catch(e){}}return FIN[finCur]?finCur:"liso"}
 function build(model,ek,fx){if(model==="R")return buildR();if(model==="O")return buildO();if(model==="P")return buildP();if(model==="S")return buildS();if(model==="T")return buildS("ref");if(model==="U")return buildS("ref",true);ek=EYES[ek]?ek:eyePick();fx=FIN[fx]?fx:finPick();
  var id="rbm"+(++N),body,skin;
  if(model==="A"){body=globe(id,27);skin="#F7E0BD"}
  else if(model==="B"){body=compass(id,false);skin="#FBF0DA"}
  else{body=compass(id,true);skin="#F7E0BD"}
  var fc=face(skin,id,ek);
  var hat=grp("rk-hat",50,42,grp("rk-arrow",50,26,arrow())+grp("rk-flapL",24,47,flapL())+grp("rk-flapR",76,47,flapR())+capParts(id)+grp("rk-gog",50,38,goggles()));
  var flt="",fa="",ha="";
  if(fx==="tinta"){flt='<filter id="'+id+'f" x="-10%" y="-10%" width="120%" height="120%"><feMorphology in="SourceAlpha" operator="dilate" radius="1" result="d0"/><feTurbulence type="fractalNoise" baseFrequency=".28" numOctaves="1" seed="4" result="n"/><feDisplacementMap in="d0" in2="n" scale="1.6" xChannelSelector="R" yChannelSelector="G" result="d"/><feFlood flood-color="#2B1D16"/><feComposite in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';fa=' filter="url(#'+id+'f)"'}
  if(fx==="papel"){flt='<filter id="'+id+'f" x="-10%" y="-10%" width="125%" height="125%"><feTurbulence type="fractalNoise" baseFrequency="2.2" numOctaves="1" seed="7" result="n"/><feColorMatrix in="n" type="matrix" values="0 0 0 0 .3 0 0 0 0 .2 0 0 0 0 .1 0 0 0 .16 0" result="g"/><feComposite in="g" in2="SourceAlpha" operator="in" result="gt"/><feDropShadow in="SourceGraphic" dx=".8" dy="1.2" stdDeviation=".3" flood-color="#4A2E18" flood-opacity=".45" result="ds"/><feMerge><feMergeNode in="ds"/><feMergeNode in="gt"/></feMerge></filter>'+
   '<filter id="'+id+'h" x="-10%" y="-10%" width="125%" height="130%"><feDropShadow dx=".5" dy="1.1" stdDeviation=".35" flood-color="#3A2414" flood-opacity=".5"/></filter>';fa=' filter="url(#'+id+'f)"';ha=' filter="url(#'+id+'h)"'}
  if(ha)hat='<g'+ha+'>'+hat+'</g>';
  return '<svg class="rbx rbx-'+model+'" data-acabado="'+fx+'"'+(fx!=="liso"?' data-asim="1"':'')+' data-ojos="'+ek+'"'+(ek==="gafas"?' data-sin-gafas="1"':'')+(EYES[ek].idle?' data-ojos-idle="'+EYES[ek].idle+'"':'')+' viewBox="0 0 100 100" aria-hidden="true">'+
   grp("rk-root",50,92,
    '<g class="rk-shadow"><ellipse class="rk-sh" cx="50" cy="92" rx="21" ry="2.8" fill="var(--rb-sh,#13213F)" opacity=".2"/><ellipse cx="42" cy="92" rx="6.4" ry="1.3" fill="#13213F" opacity=".22"/><ellipse cx="58" cy="92" rx="6.4" ry="1.3" fill="#13213F" opacity=".22"/></g>'+
    flt+'<g class="rk-char"'+fa+'>'+grp("rk-legL",44,72,legL())+grp("rk-legR",56,72,legR())+
    grp("rk-body",50,82,
     body+'<g class="rk-face">'+fc[0]+'</g>'+hat)+'</g>'
   )+'</svg>';
 }

 /* ================= motor de animación: un solo bucle para todos los Rumbo visibles ================= */
 /* ================= modelo R: el del boceto =================
    Brújula con cara: cuerpo y cabeza son una sola pieza. Contorno café oscuro del mismo grosor en todo,
    con uniones y puntas redondeadas. Ojos enormes, bajos y juntitos; gorro de aviador ladeado a la derecha
    con orejeras desiguales; flecha que escapa por arriba; manitas con guante que flotan; piernas cortas con botitas. */
 var RO="#3A2418",RW=1.6,RRING="#F5B935",RRINGS="#D9922A",RRINGH="#FFE08A",RDIAL="#FFF6E5",RTICK="#E3C99A",
  RHAT="#8E5B3A",RHATS="#734528",RHATH="#AD7550",RFUR="#F6E6CA",RFURS="#E3CDA6",RGOG="#C98A3A",RLENS="#7CC0EA",RSTRAP="#6A3E22",
  RLEG="#3E68A0",RLEGS="#2C4F80",RGLV="#7A4A2E",RGLVS="#5E3620",RARW="#F07C2E",RARWS="#CF5F1A",RPUP="#2B1B14";
 var RE=[[41.8,63.6],[58.2,63.6]],RERX=5.6,RERY=6.5;
 function ln(o){return ' stroke="'+RO+'" stroke-width="'+(o||RW)+'" stroke-linejoin="round" stroke-linecap="round"'}
 function eyeR(id,i){var c=RE[i],cx=c[0],cy=c[1],rx=RERX,ry=RERY,cid=id+"r"+i;
  return '<g class="rk-eye" data-i="'+i+'" data-cx="'+cx+'" data-cy="'+cy+'" data-rx="'+rx+'" data-ry="'+ry+'"><g class="rk-esq"><g class="rk-pup">'+
   '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="'+RPUP+'"/>'+
   '<clipPath id="'+cid+'w"><ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'"/></clipPath><g clip-path="url(#'+cid+'w)"><g class="rk-iris">'+
   '<circle cx="'+(cx-1.5)+'" cy="'+(cy-2)+'" r="2.3" fill="#FFFFFF"/><circle cx="'+(cx+1.9)+'" cy="'+(cy+2.4)+'" r="1" fill="#FFFFFF"/></g></g></g>'+
   '<clipPath id="'+cid+'k"><ellipse cx="'+cx+'" cy="'+cy+'" rx="'+(rx+1.3)+'" ry="'+(ry+1.3)+'"/></clipPath><g clip-path="url(#'+cid+'k)">'+
   '<path class="rk-lo" fill="'+RDIAL+'"/><path class="rk-lol" fill="none" stroke="none"/>'+
   '<path class="rk-up" fill="'+RDIAL+'"/><path class="rk-lash" fill="none" stroke="'+RO+'" stroke-width="1.6" stroke-linecap="round" stroke-opacity="0"/>'+
   '</g></g></g>'}
 function faceR(id){var s="";
  s+='<ellipse cx="35" cy="71.6" rx="2.9" ry="1.9" fill="#F7A1A1" opacity=".8"/><ellipse cx="65" cy="71.6" rx="2.9" ry="1.9" fill="#F7A1A1" opacity=".8"/>';
  s+=eyeR(id,0)+eyeR(id,1);
  var MO="#5A2A26",TG="#F28A8A",L=function(d,w){return '<path d="'+d+'" fill="none"'+ln(w||1.4)+'/>'};
  s+='<g data-p="idle">'+L("M48.1 74.3Q50 76.5 51.9 74.3")+'</g>';
  s+='<g data-p="happy wink"><path d="M47.4 73.9Q50 77.8 52.6 73.9Z" fill="'+MO+'"'+ln(1.2)+'/><path d="M48.7 75.8Q50 77 51.3 75.8Q50 75.1 48.7 75.8Z" fill="'+TG+'"/></g>';
  s+='<g data-p="joy"><path d="M46.8 73.5Q50 79.2 53.2 73.5Z" fill="'+MO+'"'+ln(1.2)+'/><path d="M48.2 76.4Q50 78.2 51.8 76.4Q50 75.4 48.2 76.4Z" fill="'+TG+'"/></g>';
  s+='<ellipse data-p="wow" cx="50" cy="75.5" rx="1.5" ry="1.9" fill="'+MO+'"'+ln(1.1)+'/>';
  s+='<ellipse data-p="curious" cx="51.2" cy="75.2" rx="1" ry="1.2" fill="'+MO+'"'+ln(1)+'/>';
  s+='<g data-p="think">'+L("M48.3 75.3Q50 74.6 51.8 75.5")+'</g>';
  s+='<g data-p="sadhope">'+L("M48 75Q50 76.3 52 75")+'</g>';
  s+='<g data-p="sad no">'+L("M47.9 76.1Q50 74.3 52.1 76.1")+'</g>';
  s+='<g data-p="meh">'+L("M48.3 75.3H51.7")+'</g>';
  s+='<ellipse data-p="talk" class="rk-mouth" cx="50" cy="75.3" rx="1.8" ry="1.5" fill="'+MO+'"'+ln(1.1)+'/>';
  s+='<ellipse data-p="sleep" cx="50" cy="75.5" rx=".9" ry=".7" fill="'+MO+'"/>';
  s+='<ellipse data-p="yawn" cx="50" cy="75.8" rx="1.9" ry="2.5" fill="'+MO+'"'+ln(1.1)+'/>';
  s+='<g data-p="sleep"><g class="rk-zz"><text x="70" y="44" font-size="7" font-weight="900" fill="'+RO+'" opacity=".55">z</text><text x="75" y="37" font-size="5" font-weight="900" fill="'+RO+'" opacity=".4">z</text></g></g>';
  var br=[0,1].map(function(i){return '<g class="rk-brow" data-i="'+i+'" transform="translate('+RE[i][0]+' '+(RE[i][1]-RERY-3.4)+')"><path d="M-2.6 .5Q0 -.9 2.6 .5" fill="none"'+ln(1.5)+'/></g>'}).join("");
  return [s,br]}
 function gloveR(x,y,side){/* manita café con puño crema; el pulgar va hacia el cuerpo */
  var t=-side,s='<ellipse cx="'+(x+t*3.4)+'" cy="'+(y-.6)+'" rx="2.1" ry="1.6" transform="rotate('+(t*-30)+' '+(x+t*3.4)+' '+(y-.6)+')" fill="'+RGLV+'"'+ln(1.3)+'/>';
  s+='<path d="M'+(x-3.4)+' '+(y+1.6)+'C'+(x-4)+' '+(y-1.8)+' '+(x-2.6)+' '+(y-4.6)+' '+(x+.2)+' '+(y-4.6)+'C'+(x+3)+' '+(y-4.6)+' '+(x+4)+' '+(y-2)+' '+(x+3.6)+' '+(y+1.2)+'C'+(x+3.3)+' '+(y+3)+' '+(x+1.6)+' '+(y+3.6)+' '+x+' '+(y+3.6)+'C'+(x-1.8)+' '+(y+3.6)+' '+(x-3.1)+' '+(y+3)+' '+(x-3.4)+' '+(y+1.6)+'Z" fill="'+RGLV+'"'+ln(1.3)+'/>';
  s+='<rect x="'+(x-3.3)+'" y="'+(y+2.6)+'" width="6.6" height="2.6" rx="1.3" fill="'+RFUR+'"'+ln(1.2)+'/>';
  s+='<path d="M'+(x-1.9)+' '+(y-2.6)+'Q'+(x-1)+' '+(y-3.6)+' '+(x+.4)+' '+(y-3.6)+'" stroke="'+RHATH+'" stroke-width="1" fill="none" stroke-linecap="round"/>';
  return s}
 function legRm(side){var X=function(x){return (side<0?x:100-x).toFixed(2)},s="";
  s+='<path d="M'+X(42)+' 81.6L'+X(45)+' 81.6L'+X(45)+' 91L'+X(42)+' 91Z" fill="'+RLEG+'"'+ln(1.3)+'/>';
  s+='<path d="M'+X(46)+' 91.6C'+X(46.6)+' 95.8 '+X(45)+' 97.4 '+X(41.4)+' 97.4L'+X(37)+' 97.4C'+X(34.1)+' 97.4 '+X(33.7)+' 94.5 '+X(36.4)+' 93.5C'+X(38.2)+' 92.8 '+X(40)+' 92.6 '+X(41)+' 91.4Z" fill="'+RGLV+'"'+ln(1.3)+'/>';
  s+='<rect x="'+(side<0?40.2:100-46.8)+'" y="89.6" width="6.6" height="2.8" rx="1.4" fill="'+RFUR+'"'+ln(1.2)+'/>';
  s+='<ellipse cx="'+X(37.8)+'" cy="94.6" rx="1.3" ry=".6" fill="'+RHATH+'"/>';
  return s}
 function buildR(){
  var id="rbm"+(++N),fc=faceR(id);
  /* cuerpo: aro dorado con grosor, carátula crema con marcas cortas y suaves */
  var body='<circle class="rk-core" cx="50" cy="60" r="27" fill="'+RRING+'"/>'+crescent(50,60,26.4,-3.2,-3.6,RRINGS)+
   '<path d="M25.6 66A25 25 0 0 1 27.6 49" stroke="'+RRINGH+'" stroke-width="2" fill="none" stroke-linecap="round"/>'+
   '<circle cx="50" cy="60" r="27" fill="none"'+ln()+'/>'+
   '<circle cx="50" cy="60" r="20.8" fill="'+RDIAL+'"'+ln(1.3)+'/>'+crescent(50,60,20.1,-2.2,-2.6,"#F6E7CC");
  [0,90,180,270].forEach(function(a){var t=a*Math.PI/180,c=Math.cos(t),n=Math.sin(t);body+='<path class="rk-tick" d="M'+(50+c*18.4).toFixed(2)+' '+(60+n*18.4).toFixed(2)+'L'+(50+c*20.3).toFixed(2)+' '+(60+n*20.3).toFixed(2)+'" stroke="'+RTICK+'" stroke-width="1.5" stroke-linecap="round"/>'});
  [].forEach(function(a){var t=a*Math.PI/180;body+='<circle class="rk-tick" cx="'+(50+Math.cos(t)*19.6).toFixed(2)+'" cy="'+(60+Math.sin(t)*19.6).toFixed(2)+'" r=".75" fill="'+RTICK+'"/>'});
  /* gorro: flecha detrás, orejeras, casquete con costura, correa, borde de piel y gafas */
  var DOME="M22.6 42.6C21.8 27 33.6 15.4 50 15.4C66.4 15.4 78.2 27 77.4 42.6Q50 25.6 22.6 42.6Z";
  var arrow='<path d="M49.25 18L49.25 8.2Q49.25 7.3 50 7.3Q50.75 7.3 50.75 8.2L50.75 18Z" fill="'+RARW+'"'+ln(1.2)+'/>'+
   '<path d="M50 2.4Q50.85 2.4 51.4 3.2L54.4 7.9Q55 9 53.8 9L46.2 9Q45 9 45.6 7.9L48.6 3.2Q49.15 2.4 50 2.4Z" fill="'+RARW+'"'+ln(1.3)+'/>'+
   '<path d="M50.4 3.8L53.2 8" stroke="'+RARWS+'" stroke-width="1.1" stroke-linecap="round"/>';
  var flapL='<path d="M22 42.4C19 49.6 18.6 57.6 19.8 63.6C20.4 67 18.6 68.8 16 69.4C13.6 70 13.4 73.2 16.2 73.4C21 73.6 24.8 70.2 25.4 65C26 58.2 26.4 50.2 26.6 43.4Z" fill="'+RHAT+'"'+ln()+'/>'+
   '<path d="M17 71.6C20.4 71.8 23 69.6 23.8 65.2" stroke="'+RFUR+'" stroke-width="1.6" fill="none" stroke-linecap="round"/>';
  var flapR='<path d="M78 42.4C80.8 49.6 81.4 57.6 80.2 63.6C79.6 67 81.4 68.8 84 69.4C86.4 70 86.6 73.2 83.8 73.4C79 73.6 75.2 70.2 74.6 65C74 58.2 73.6 50.2 73.4 43.4Z" fill="'+RHATS+'"'+ln()+'/>'+
   '<path d="M83 71.6C79.6 71.8 77 69.6 76.2 65.2" stroke="'+RFURS+'" stroke-width="1.6" fill="none" stroke-linecap="round"/>';
  var cap='<clipPath id="'+id+'d"><path d="'+DOME+'"/></clipPath><path class="rk-capj" d="'+DOME+'" fill="'+RHAT+'"/>'+
   '<g clip-path="url(#'+id+'d)"><path d="M57 14C71 18 83 30 81 50L92 50L92 14Z" fill="'+RHATS+'"/>'+
   '<path d="M22.6 35.6C34 24.6 66 24.6 77.4 35.6" stroke="'+RSTRAP+'" stroke-width="2.8" fill="none"/>'+
   '<path d="M50 15.6C51.8 22 51.8 28 50.6 33.6" stroke="'+RHATS+'" stroke-width="1.2" fill="none" stroke-dasharray="1.6 1.4" stroke-linecap="round"/></g>'+
   '<path d="M27.6 34Q29.4 24.2 39.6 19.6" stroke="'+RHATH+'" stroke-width="1.8" fill="none" stroke-linecap="round"/>'+
   '<path d="'+DOME+'" fill="none"'+ln()+'/>'+
   '<path class="rk-capj" d="M21.4 41.6Q50 23.4 78.6 41.6C80.4 43 80.2 46 77.6 46.4Q50 29.6 22.4 46.4C19.8 46 19.6 43 21.4 41.6Z" fill="'+RFUR+'"'+ln()+'/>'+
   '<path d="M25 44.2Q50 30.4 75 44.2" stroke="'+RFURS+'" stroke-width="1.3" fill="none" stroke-linecap="round"/>';
  var gog='<rect x="45" y="26" width="10" height="2.4" rx="1.2" fill="'+RGOG+'"'+ln(1.1)+'/>';
  [[40.8,27.2],[59.2,27.2]].forEach(function(c){gog+='<circle cx="'+c[0]+'" cy="'+c[1]+'" r="4.5" fill="'+RGOG+'"'+ln(1.3)+'/><circle cx="'+c[0]+'" cy="'+c[1]+'" r="2.9" fill="'+RLENS+'"/><path d="M'+(c[0]-1.9)+' '+(c[1]-.3)+'Q'+(c[0]-1.5)+' '+(c[1]-2)+' '+(c[0]+.3)+' '+(c[1]-2.2)+'" stroke="#FFFFFF" stroke-width="1" fill="none" stroke-linecap="round"/>'});
  var hat=grp("rk-hat",50,44,grp("rk-arrow",50,17,arrow)+grp("rk-flapL",24.4,43.4,flapL)+grp("rk-flapR",76.2,43,flapR)+cap+grp("rk-gog",50,27,gog));
  return '<svg class="rbx rbx-R" data-ojos="R" data-hatr="4" data-arr="-10" data-eyefix="1" data-brow-auto="1" viewBox="0 0 100 100" aria-hidden="true">'+
   grp("rk-root",50,97.6,
    '<g class="rk-shadow"><ellipse class="rk-sh" cx="50" cy="97.8" rx="20" ry="2.2" fill="var(--rb-sh,#13213F)" opacity=".18"/><ellipse cx="40.4" cy="97.7" rx="5.6" ry="1.1" fill="#13213F" opacity=".25"/><ellipse cx="59.6" cy="97.7" rx="5.6" ry="1.1" fill="#13213F" opacity=".25"/></g>'+
    grp("rk-legL",43.4,83,legRm(-1))+grp("rk-legR",56.6,83,legRm(1))+
    grp("rk-body",50,86,body+'<g class="rk-face">'+fc[0]+'</g>'+'<g class="rk-brows" style="opacity:0">'+fc[1]+'</g>'+hat)+
    grp("rk-handL",11,57,gloveR(11,57,-1))+grp("rk-handR",89,57,gloveR(89,57,1))
   )+'</svg>'}

 /* ================= modelo O: el original, mejorado =================
    Mismo personaje del principio (globo con cara, gorro de aviador con la lengüeta de la correa a la izquierda,
    contorno oscuro) con tres mejoras: el globo es un planeta (océano, continentes, nubes, atmósfera y lado de noche),
    el gorro es un casquete limpio con costura, gafas y orejeras con forro, y las patas llevan botitas. */
 var OOL="#412D19",OGL="#1E1A1C",OSEA="#4BA3DB",OSEAD="#3A8CC6",OLAND="#7CC36A",OLANDD="#5FA552",OCAP="#93522E",OCAPL="#B06A3E",OCAPD="#6F3B1F",
  OLIN="#F1D9B0",OSTR="#C8823C",OSTRL="#E2A866",OBR="#E2A24E",OBRD="#B07A36",OLENS="#A8D4E0",OLEG="#3B6296",OLEGD="#2F5079",OBOOT="#8A5230",OBOOTD="#6E3F22",OGLD="#F1A43E";
 var OC=[50,57],ORR=23.5;
 function lo(w){return ' stroke="'+OOL+'" stroke-width="'+(w||1.4)+'" stroke-linejoin="round" stroke-linecap="round"'}
 function planetO(id){var cx=OC[0],cy=OC[1],r=ORR,s="";
  var LANDS=[[[-1.05,.02],[-.72,-.04],[-.52,.1],[-.44,.36],[-.22,.5],[-.14,.76],[-.42,1.05],[-1.05,1]],
   [[.5,-.64],[.76,-.72],[1.05,-.5],[1.05,.5],[.86,.62],[.62,.5],[.55,.28],[.7,.08],[.6,-.22]],[[.2,.76],[.42,.72],[.52,.88],[.3,.96]]];
  s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(r+1.8)+'" fill="#BFE6FA" opacity=".55"/>';
  s+='<clipPath id="'+id+'p"><circle cx="'+cx+'" cy="'+cy+'" r="'+r+'"/></clipPath>';
  s+='<circle class="rk-core" cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="'+OSEA+'"/>';
  s+='<g clip-path="url(#'+id+'p)">';
  /* los puntos se dan en su posición final sobre la cara; se convierten al disco antes de proyectar a la esfera */
  function inv(L){return L.map(function(q){var df=Math.hypot(q[0],q[1])||1e-6,d=(2/Math.PI)*Math.asin(Math.min(1,df));return [q[0]/df*d,q[1]/df*d]})}
  LANDS.forEach(function(L){var d=sm(sph(inv(L),cx,cy,r));s+='<path d="'+d+'" fill="'+OLAND+'"/><path d="'+d+'" fill="none" stroke="'+OLANDD+'" stroke-width=".8"/>'});
  /* nubes */
  s+='<path d="M'+(cx-20)+' '+(cy-7)+'q2.4 -2.2 5 -.6q2 -1.6 4 .2" stroke="#FFFFFF" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".85"/>';
  s+='<path d="M'+(cx+11)+' '+(cy+15)+'q2.2 -1.8 4.4 -.4q1.8 -1.4 3.6 .2" stroke="#FFFFFF" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".8"/>';
  /* lado de noche y brillo de la atmósfera */
  s+=crescent(cx,cy,r+.4,-4.2,-4.6,"#173E70",.32);
  s+='</g>';
  s+='<path d="M'+(cx-r*.84).toFixed(2)+' '+(cy+r*.2).toFixed(2)+'A'+r+' '+r+' 0 0 1 '+(cx-r*.5).toFixed(2)+' '+(cy-r*.76).toFixed(2)+'" stroke="#FFFFFF" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".7"/>';
  s+='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+OGL+'" stroke-width="1.4"/>';
  return s}
 function faceO(id){var s="";
  s+='<ellipse cx="38.6" cy="61.6" rx="3.4" ry="2.2" fill="#F49A9A" opacity=".75"/><ellipse cx="61.4" cy="61.6" rx="3.4" ry="2.2" fill="#F49A9A" opacity=".75"/>';
  s+=eyeM(id,0,OSEA,"original")+eyeM(id,1,OSEA,"original");
  var I='stroke="'+INK+'" fill="none" stroke-linecap="round"';
  s+='<path data-p="idle" d="M45.6 61.4Q50 65.6 54.4 61.4" '+I+' stroke-width="1.9"/>';
  s+='<g data-p="happy wink"><path d="M45 60.8Q50 67.6 55 60.8Z" fill="'+INK+'" stroke="'+INK+'" stroke-width="1.2" stroke-linejoin="round"/><path d="M47.2 64.4Q50 66 52.8 64.4Q51.4 63.2 50 63.2Q48.6 63.2 47.2 64.4Z" fill="#E86A6A"/></g>';
  s+='<g data-p="joy"><path d="M44.2 60.2Q50 70 55.8 60.2Z" fill="'+INK+'" stroke="'+INK+'" stroke-width="1.2" stroke-linejoin="round"/><path d="M46.8 65.6Q50 68 53.2 65.6Q51.6 64 50 64Q48.4 64 46.8 65.6Z" fill="#E86A6A"/></g>';
  s+='<ellipse data-p="wow" cx="50" cy="63" rx="2.4" ry="2.9" fill="'+INK+'"/>';
  s+='<ellipse data-p="curious" cx="51.6" cy="62.6" rx="1.6" ry="1.8" fill="'+INK+'"/>';
  s+='<path data-p="think" d="M47.4 62.6Q50.4 61.6 53.2 63" '+I+' stroke-width="1.8"/>';
  s+='<path data-p="sadhope" d="M46.6 62.4Q50 64.4 53.4 62.4" '+I+' stroke-width="1.8"/>';
  s+='<path data-p="sad no" d="M46.2 63.8Q50 60.8 53.8 63.8" '+I+' stroke-width="1.9"/>';
  s+='<path data-p="meh" d="M46.6 62.6H53.4" '+I+' stroke-width="1.9"/>';
  s+='<ellipse data-p="talk" class="rk-mouth" cx="50" cy="62.6" rx="3" ry="2.4" fill="'+INK+'"/>';
  s+='<ellipse data-p="sleep" cx="50" cy="62.8" rx="1.5" ry="1.2" fill="'+INK+'"/>';
  s+='<ellipse data-p="yawn" cx="50" cy="63" rx="2.8" ry="3.6" fill="'+INK+'"/>';
  s+='<g data-p="sleep"><g class="rk-zz"><text x="70" y="40" font-size="7" font-weight="900" fill="'+INK+'" opacity=".55">z</text><text x="75" y="33" font-size="5" font-weight="900" fill="'+INK+'" opacity=".4">z</text></g></g>';
  return s}
 function legO(side){var X=function(x){return (side<0?x:100-x).toFixed(2)},s="";
  s+='<path d="M'+X(42.2)+' 70.6L'+X(47.4)+' 70.6L'+X(47.4)+' 87.4L'+X(42.2)+' 87.4Z" fill="'+OLEG+'"'+lo()+'/>';
  s+='<path d="M'+X(45.2)+' 71.4L'+X(47.4)+' 71.4L'+X(47.4)+' 87L'+X(45.2)+' 87Z" fill="'+OLEGD+'"/>';
  s+='<path d="M'+X(48.4)+' 87.4C'+X(49)+' 91.6 '+X(47.4)+' 93.2 '+X(43.8)+' 93.2L'+X(38.6)+' 93.2C'+X(35.4)+' 93.2 '+X(35)+' 90.2 '+X(37.8)+' 89.1C'+X(39.6)+' 88.5 '+X(41.4)+' 88.3 '+X(42.2)+' 87.2Z" fill="'+OBOOT+'"'+lo()+'/>';
  s+='<path d="M'+X(36)+' 91.8C'+X(36.8)+' 92.8 '+X(38.4)+' 92.7 '+X(40.6)+' 92.7" stroke="'+OBOOTD+'" stroke-width="1.1" fill="none" stroke-linecap="round"/>';
  s+='<ellipse cx="'+X(39.4)+'" cy="90.4" rx="1.4" ry=".6" fill="#B07A50"/>';
  s+='<rect x="'+(side<0?41.4:100-48.4)+'" y="85.6" width="7" height="2.8" rx="1.4" fill="'+OLIN+'"'+lo(1.1)+'/>';
  return s}
 function buildO(){
  var id="rbm"+(++N),body=planetO(id),face=faceO(id);
  var DOME="M28.4 44.4C27.4 30.4 37 22.2 50 22.2C63 22.2 72.6 30.4 71.6 44.4Q50 34.4 28.4 44.4Z";
  var arrow='<rect x="49" y="12" width="2" height="12" rx="1" fill="#F2C88A"'+lo(1.1)+'/><path d="M50 4.4Q51 4.4 51.6 5.4L55.2 11.2Q55.8 12.4 54.4 12.4L45.6 12.4Q44.2 12.4 44.8 11.2L48.4 5.4Q49 4.4 50 4.4Z" fill="'+OGLD+'"'+lo(1.2)+'/><path d="M50.4 5.8L53.8 11" stroke="#D9862A" stroke-width="1.1" stroke-linecap="round"/>';
  var flapL='<path d="M28.4 42.6C24.4 49.4 23.4 57.4 24.6 63.4C25.4 66.6 29.2 66.8 30.2 63.8C31.2 58.8 31.4 50.6 31.8 43.4Z" fill="'+OCAP+'"'+lo()+'/><path d="M26 62.2C26.4 64.4 28.4 64.8 29.2 62.8" stroke="'+OLIN+'" stroke-width="1.5" fill="none" stroke-linecap="round"/>';
  var flapR='<path d="M71.6 42.6C75 48.6 75.8 55.2 74.6 60.2C73.8 63.2 70.2 63.2 69.4 60.6C68.4 55.8 68 49.4 67.8 43.4Z" fill="'+OCAPD+'"'+lo()+'/><path d="M73.4 59.4C73 61.4 71.2 61.8 70.6 60" stroke="#D9BC92" stroke-width="1.4" fill="none" stroke-linecap="round"/>';
  var cap='<clipPath id="'+id+'d"><path d="'+DOME+'"/></clipPath><path class="rk-capj" d="'+DOME+'" fill="'+OCAP+'"/>'+
   '<g clip-path="url(#'+id+'d)"><path d="M58 18C72 22 82 34 78 52L90 52L90 18Z" fill="'+OCAPD+'" opacity=".8"/><path d="M28.6 35.6Q50 23.4 71.4 35.6" stroke="#5E331A" stroke-width="2.2" fill="none"/>'+
   '<path d="M50 22.4C51.6 28 51.6 33 50.6 38.6" stroke="'+OCAPD+'" stroke-width="1.1" fill="none" stroke-dasharray="1.6 1.4" stroke-linecap="round"/></g>'+
   '<path d="M31.8 34Q33.2 26.4 41.4 23.4" stroke="'+OCAPL+'" stroke-width="1.8" fill="none" stroke-linecap="round"/>'+
   '<path d="'+DOME+'" fill="none"'+lo()+'/>'+
   /* correa: cruza la frente y sale a la izquierda como lengüeta, con hebilla */
   '<path class="rk-capj" d="M27.2 42.4Q50 32.4 72.8 42.4L73.2 45.8Q50 35.8 26.8 45.8Z" fill="'+OSTR+'"'+lo()+'/>'+
   '<path d="M28.2 43.6L19.2 45.6Q16.6 46.2 17 48.4Q17.6 50.4 20 49.8L28 47.4Z" fill="'+OSTR+'"'+lo()+'/>'+
   '<path d="M29.4 42.8Q50 34.6 70.6 42.8" stroke="'+OSTRL+'" stroke-width=".9" fill="none" stroke-linecap="round"/>'+
   '<rect x="23.2" y="44.8" width="3.2" height="4" rx=".8" fill="none" stroke="'+OBR+'" stroke-width="1.1" transform="rotate(-14 24.8 46.8)"/>';
  var gog='<rect x="45.6" y="29" width="8.8" height="2.6" rx="1.3" fill="'+OBRD+'"'+lo(1.1)+'/>';
  [[42.2,30.4],[57.8,30.4]].forEach(function(c){gog+='<circle cx="'+(c[0]+.5)+'" cy="'+(c[1]+.6)+'" r="5.4" fill="'+OBRD+'"/><circle cx="'+c[0]+'" cy="'+c[1]+'" r="5.4" fill="'+OBR+'"'+lo(1.2)+'/><circle cx="'+c[0]+'" cy="'+c[1]+'" r="3.5" fill="'+OLENS+'"'+lo(.9)+'/><path d="M'+(c[0]-2)+' '+(c[1]-.4)+'Q'+(c[0]-1.6)+' '+(c[1]-2.2)+' '+(c[0]+.3)+' '+(c[1]-2.4)+'" stroke="#FFFFFF" stroke-width="1.1" fill="none" stroke-linecap="round"/>'});
  var hat=grp("rk-hat",50,46,grp("rk-arrow",50,23.4,arrow)+grp("rk-flapL",30,43.6,flapL)+grp("rk-flapR",70,43.6,flapR)+cap+grp("rk-gog",50,30.4,gog));
  return '<svg class="rbx rbx-O" data-ojos="original" data-hatr="-4" data-arr="4" viewBox="0 0 100 100" aria-hidden="true">'+
   grp("rk-root",50,93.2,
    '<g class="rk-shadow"><ellipse class="rk-sh" cx="50" cy="93.4" rx="21" ry="2.6" fill="var(--rb-sh,#13213F)" opacity=".18"/><ellipse cx="41.6" cy="93.3" rx="6" ry="1.2" fill="#13213F" opacity=".24"/><ellipse cx="58.4" cy="93.3" rx="6" ry="1.2" fill="#13213F" opacity=".24"/></g>'+
    grp("rk-legL",44.8,74,legO(-1))+grp("rk-legR",55.2,74,legO(1))+
    grp("rk-body",50,80,body+'<g class="rk-face">'+face+'</g>'+hat))+'</svg>'}

 /* ================= modelo P: el de la imagen de referencia, con el centro de brújula =================
    Medido sobre la imagen (928×998 px): MQ lleva esas coordenadas al cuadro de 0 a 100.
    Capucha y orejeras detrás de la bola (las orejeras se abren con resorte, como en el video); correa con lengüeta
    y gafas delante. La correa tapa el borde de arriba de la bola. */
 var MQ='<g transform="matrix(.112 0 0 .112 -7.344 -6.64)">',QE='</g>';
 function qx(px){return +(.112*px-7.344).toFixed(2)}function qy(py){return +(.112*py-6.64).toFixed(2)}
 var QOL="#4B2A13",QHOOD="#B26B35",QHOODD="#8C4E22",QSTR="#C07A3E",QSTRL="#DB9758",QRIM="#F1DFC2",QLENS="#7AB6E2",QLENSH="#ABD6F3",
  QBALL="#F7E6C8",QBRASS="#D9A24E",QTICK="#CDA772",QLEG="#3D6CB1",QLEGD="#2F5996",QNAVY="#10204A",QCHK="#F0A090",QGLD="#F5A93A",QGLDD="#E38F28",QSTEM="#F4D2A0";
 function buildP(){
  var id="rbm"+(++N),O=function(w){return ' stroke="'+QOL+'" stroke-width="'+(w||9)+'" stroke-linejoin="round" stroke-linecap="round"'};
  /* flecha (detrás de la capucha) */
  var arrow=MQ+'<rect x="461" y="186" width="30" height="120" rx="15" fill="'+QSTEM+'"'+O(8)+'/>'+
   '<path d="M478 92C493 92 540 158 540 182C540 205 514 212 478 212C442 212 416 205 416 182C416 158 463 92 478 92Z" fill="'+QGLD+'"'+O(8)+'/>'+
   '<path d="M478 100C492 108 532 162 532 182C532 199 510 205 482 206Z" fill="'+QGLDD+'" opacity=".6"/>'+
   '<path d="M450 160Q462 128 476 112" stroke="#FFD08A" stroke-width="8" fill="none" stroke-linecap="round"/>'+QE;
  /* capucha y orejeras (detrás de la bola) */
  var HD="M252 528C238 420 318 296 470 266C602 248 708 300 732 428C738 470 610 426 512 426C420 426 300 476 252 528Z";
  var hood=MQ+'<clipPath id="'+id+'h"><path d="'+HD+'"/></clipPath><path class="rk-capj" d="'+HD+'" fill="'+QHOOD+'"/>'+
   '<g clip-path="url(#'+id+'h)"><path d="M560 230C680 250 760 330 760 470L800 470L800 230Z" fill="'+QHOODD+'" opacity=".55"/>'+
   '<path d="M300 340Q360 296 430 286" stroke="#C98048" stroke-width="10" fill="none" stroke-linecap="round" opacity=".8"/></g>'+
   '<path d="'+HD+'" fill="none"'+O()+'/>'+QE;
  var flapL=MQ+'<path d="M266 462C234 536 232 640 266 692C284 716 322 712 326 690L404 640L404 470Z" fill="'+QHOOD+'"'+O()+'/>'+
   '<path d="M300 520C286 590 288 650 304 690" stroke="'+QHOODD+'" stroke-width="12" fill="none" stroke-linecap="round" opacity=".7"/>'+QE;
  var flapR=MQ+'<path d="M698 410C732 446 746 522 728 572C718 596 690 594 686 570L630 540L620 430Z" fill="#A15E2D"'+O()+'/>'+
   '<path d="M712 460C722 500 722 536 714 566" stroke="'+QHOODD+'" stroke-width="10" fill="none" stroke-linecap="round" opacity=".7"/>'+QE;
  var hatb=grp("rk-hatb",50,40,grp("rk-arrow",qx(476),qy(285),arrow)+grp("rk-flapL",qx(300),qy(500),flapL)+grp("rk-flapR",qx(700),qy(440),flapR)+hood);
  /* bola: brújula con aro de latón fino, aro interior, triángulos cardinales (norte en rojo), puntitos y N */
  var body=MQ+'<circle class="rk-core" cx="512" cy="583" r="222" fill="'+QBALL+'"/>'+
   '<circle cx="512" cy="583" r="207" fill="none" stroke="'+QBRASS+'" stroke-width="12"/>'+
   '<circle cx="512" cy="583" r="193" fill="none" stroke="#E6CC9E" stroke-width="4"/>';
  [[0,-1,"#D9534F"],[1,0,QTICK],[0,1,QTICK],[-1,0,QTICK]].forEach(function(q){var ux=q[0],uy=q[1],px=-uy,py=ux,tip=158,base=186,w=14;
   body+='<path d="M'+(512+ux*tip)+' '+(583+uy*tip)+'L'+(512+ux*base+px*w)+' '+(583+uy*base+py*w)+'L'+(512+ux*base-px*w)+' '+(583+uy*base-py*w)+'Z" fill="'+q[2]+'" stroke="'+q[2]+'" stroke-width="5" stroke-linejoin="round"/>'});
  [45,135,225,315].forEach(function(a){var t=a*Math.PI/180;body+='<circle cx="'+(512+Math.cos(t)*172).toFixed(1)+'" cy="'+(583+Math.sin(t)*172).toFixed(1)+'" r="8" fill="'+QTICK+'"/>'});
  body+='<text x="512" y="474" text-anchor="middle" font-size="44" font-weight="900" fill="#D9534F" font-family="Nunito,Arial,sans-serif">N</text>';
  /* volumen: media luna de sombra abajo a la derecha y sombra de la correa sobre la carátula */
  body+='<clipPath id="'+id+'q"><circle cx="512" cy="583" r="222"/></clipPath><g clip-path="url(#'+id+'q)">'+crescent(512,583,226,-34,-40,"#7A4A1E",.16)+
   '<path d="M260 520Q395 400 520 396Q640 392 740 452L740 476Q640 418 520 424Q400 430 270 548Z" fill="#5A3416" opacity=".14"/></g>';
  body+='<circle cx="512" cy="583" r="222" fill="none"'+O()+'/>'+QE;
  /* cara */
  var face=eyeM(id,0,QBALL,"orig3")+eyeM(id,1,QBALL,"orig3");
  var I='stroke="'+QNAVY+'" fill="none" stroke-linecap="round"';
  face+='<path data-p="idle" d="M44.4 61.9Q50.4 68.2 56.5 61.9" '+I+' stroke-width="1.7"/>';
  face+='<g data-p="happy wink"><path d="M44.2 61.4Q50.4 70 56.7 61.4Z" fill="'+QNAVY+'" stroke="'+QNAVY+'" stroke-width="1.2" stroke-linejoin="round"/><path d="M47.2 65.8Q50.4 67.8 53.6 65.8Q52 64.4 50.4 64.4Q48.8 64.4 47.2 65.8Z" fill="#E86A6A"/></g>';
  face+='<g data-p="joy"><path d="M43.6 60.8Q50.4 71.4 57.2 60.8Z" fill="'+QNAVY+'" stroke="'+QNAVY+'" stroke-width="1.2" stroke-linejoin="round"/><path d="M46.6 66.8Q50.4 69.6 54.2 66.8Q52.3 65.2 50.4 65.2Q48.5 65.2 46.6 66.8Z" fill="#E86A6A"/></g>';
  face+='<ellipse data-p="wow" cx="50.4" cy="64.6" rx="2.3" ry="2.9" fill="'+QNAVY+'"/>';
  face+='<ellipse data-p="curious" cx="51.8" cy="64" rx="1.6" ry="1.8" fill="'+QNAVY+'"/>';
  face+='<circle data-p="think" cx="51.8" cy="64" r="1.8" fill="'+QNAVY+'"/>';
  face+='<path data-p="sadhope" d="M46.8 63.6Q50.4 65.6 54 63.6" '+I+' stroke-width="1.7"/>';
  face+='<path data-p="sad no" d="M46.2 65.4Q50.4 61.8 54.6 65.4" '+I+' stroke-width="1.7"/>';
  face+='<path data-p="meh" d="M46.6 63.8H54.2" '+I+' stroke-width="1.7"/>';
  face+='<ellipse data-p="talk" class="rk-mouth" cx="50.4" cy="63.8" rx="3.1" ry="2.6" fill="'+QNAVY+'"/>';
  face+='<ellipse data-p="sleep" cx="50.4" cy="64.2" rx="1.4" ry="1.1" fill="'+QNAVY+'"/>';
  face+='<ellipse data-p="yawn" cx="50.4" cy="64.6" rx="2.7" ry="3.5" fill="'+QNAVY+'"/>';
  face+='<g data-p="sleep"><g class="rk-zz"><text x="72" y="40" font-size="7" font-weight="900" fill="'+QNAVY+'" opacity=".55">z</text><text x="77" y="33" font-size="5" font-weight="900" fill="'+QNAVY+'" opacity=".4">z</text></g></g>';
  /* delante: correa con lengüeta (tapa el borde de arriba de la bola) y gafas */
  var front=MQ+'<path class="rk-capj" d="M285 452Q395 352 520 342Q640 338 712 398Q722 418 708 432Q640 392 520 382Q410 388 310 500L222 504Q186 502 188 478Q192 456 222 456Z" fill="'+QSTR+'"'+O()+'/>'+
   '<path d="M212 472Q250 468 292 468Q392 372 520 360Q628 358 690 400" stroke="'+QSTRL+'" stroke-width="8" fill="none" stroke-linecap="round" opacity=".85"/>'+
   '<path d="M226 496Q270 494 306 492Q410 380 520 374Q630 372 700 420" stroke="#9A5726" stroke-width="9" fill="none" stroke-linecap="round" opacity=".6"/>'+QE;
  var lens=function(cx,cy,rx,ry,rot){return '<g transform="rotate('+rot+' '+cx+' '+cy+')"><ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="'+QRIM+'"'+O()+'/>'+
   '<ellipse cx="'+cx+'" cy="'+(cy+3)+'" rx="'+(rx*.72)+'" ry="'+(ry*.64)+'" fill="'+QLENS+'"'+O(6)+'/>'+
   '<path d="M'+(cx-rx*.62)+' '+(cy-2)+'Q'+(cx-rx*.5)+' '+(cy-ry*.5)+' '+cx+' '+(cy-ry*.52)+'Q'+(cx+rx*.5)+' '+(cy-ry*.5)+' '+(cx+rx*.62)+' '+(cy-4)+'Q'+(cx+rx*.3)+' '+(cy-ry*.24)+' '+cx+' '+(cy-ry*.24)+'Q'+(cx-rx*.3)+' '+(cy-ry*.24)+' '+(cx-rx*.62)+' '+(cy-2)+'Z" fill="'+QLENSH+'"/>'+
   '<path d="M'+(cx+rx*.25)+' '+(cy+ry*.28)+'Q'+(cx+rx*.42)+' '+(cy+ry*.2)+' '+(cx+rx*.5)+' '+(cy+ry*.02)+'" stroke="#FFFFFF" stroke-width="6" fill="none" stroke-linecap="round" opacity=".7"/></g>'};
  var gog=MQ+'<rect x="466" y="306" width="30" height="22" rx="8" fill="'+QHOODD+'"'+O(7)+'/>'+lens(568,318,80,54,10)+lens(393,330,86,56,-12)+QE;
  var hat=grp("rk-hat",50,40,front+grp("rk-gog",qx(480),qy(322),gog));
  var leg=function(x0,x1){var m=(x0+x1)/2;return MQ+'<path d="M'+(x0+8)+' 610L'+(x1-8)+' 610L'+(x1-8)+' 864Q'+(x1-8)+' 908 '+m+' 908Q'+(x0+8)+' 908 '+(x0+8)+' 864Z" fill="'+QLEG+'"/>'+
   QE};
  return '<svg class="rbx rbx-P" data-ojos="orig3" viewBox="0 0 100 100" aria-hidden="true">'+
   grp("rk-root",50,95.4,
    '<g class="rk-shadow"><ellipse class="rk-sh" cx="50" cy="95.6" rx="25" ry="3" fill="var(--rb-sh,#13213F)" opacity=".26"/><ellipse cx="'+qx(395)+'" cy="95.5" rx="7.4" ry="1.4" fill="#13213F" opacity=".3"/><ellipse cx="'+qx(578)+'" cy="95.5" rx="7.4" ry="1.4" fill="#13213F" opacity=".3"/></g>'+
    grp("rk-legL",qx(395),qy(760),leg(332,458))+grp("rk-legR",qx(578),qy(760),leg(515,641))+
    grp("rk-body",50,qy(805),hatb+body+'<g class="rk-face">'+face+'</g>'+hat))+'</svg>'}

 /* ================= modelo S: el de la ilustración de libro, simplificado al estilo plano de la app =================
    Brújula dorada con carátula crema, ojos grandes café con brillos, gorro de cuero ladeado con gafas y orejera con broche,
    flecha dorada, guantes blancos flotantes y botas azules con botón dorado. Contorno café suave del mismo grosor en todo. */
 var SO="#4B2A13",SRING="#E9B44C",SRINGS="#C68E2E",SRINGH="#FCE3A0",SDIAL="#FBF3E2",STK="#8A6A4A",SCAP="#9A5B33",SCAPS="#7A4426",SCAPH="#B97A4E",
  SGOLD="#E3A845",SLENS="#8FB7D6",SLENSH="#C4DDF0",SGLV="#FFFFFF",SGLVS="#E4E2DE",SBOOT="#3F78C8",SBOOTS="#2E5FA6",SSOLE="#D9B98A",SEYE="#3A2213";
 function sl(w){return ' stroke="'+SO+'" stroke-width="'+(w||1.4)+'" stroke-linejoin="round" stroke-linecap="round"'}
 function gloveS(x,y,side){/* guante de caricatura de una sola silueta: pulgar hacia el cuerpo, tres dedos y meñique; puño abajo */
  var G="M-3.4 3.6L-3.6 .6C-5.6 .4 -6.8 -1.4 -5.8 -2.8C-5 -3.8 -3.8 -3.4 -3.3 -2.4L-3.2 -5.4C-3.2 -7.4 -.8 -7.4 -.8 -5.4L-.8 -6.6C-.8 -8.8 1.8 -8.8 1.8 -6.6L1.8 -5.8C1.8 -7.8 4.4 -7.8 4.4 -5.8L4.4 -3.2C4.8 -4.6 6.8 -4.2 6.4 -2.6L5.2 1.6C4.8 3 4.2 3.6 3.6 3.6Z";
  return '<g transform="translate('+x+' '+y+') scale('+(side<0?-1:1)+' 1)"><path d="'+G+'" fill="'+SGLV+'"'+sl(1.1)+'/>'+
   '<path d="M-.8 -4.8V-2.4M1.8 -4.4V-2.2M4.4 -2.6V-1" stroke="'+SGLVS+'" stroke-width=".9" stroke-linecap="round"/>'+
   '<rect x="-3.8" y="3" width="8" height="2.6" rx="1.3" fill="'+SGLVS+'"'+sl(1)+'/></g>'}
 function bootS(side){var X=function(x){return (side<0?x:100-x).toFixed(2)},s="";
  s+='<path d="M'+X(36)+' 72L'+X(47)+' 72L'+X(47.4)+' 89.6C'+X(47.6)+' 93.6 '+X(46)+' 95.4 '+X(42)+' 95.4L'+X(33.6)+' 95.4C'+X(29.8)+' 95.4 '+X(28.8)+' 92.2 '+X(31.6)+' 90.4C'+X(33.6)+' 89.2 '+X(35.4)+' 88.4 '+X(36)+' 86Z" fill="'+SBOOT+'"'+sl()+'/>';
  s+='<path d="M'+X(44.4)+' 76L'+X(47)+' 76L'+X(47.4)+' 89.6C'+X(47.6)+' 92.6 '+X(46.6)+' 94 '+X(44.6)+' 94.4C'+X(45.6)+' 92 '+X(45.2)+' 88 '+X(44.4)+' 76Z" fill="'+SBOOTS+'"/>';
  s+='<path d="M'+X(29.4)+' 93.2C'+X(30)+' 95.2 '+X(31.4)+' 95.6 '+X(33.6)+' 95.6L'+X(42)+' 95.6C'+X(45.4)+' 95.6 '+X(47.2)+' 94.6 '+X(47.6)+' 92.6L'+X(47.6)+' 94.4C'+X(47.2)+' 96.6 '+X(45.2)+' 97.2 '+X(42)+' 97.2L'+X(33.6)+' 97.2C'+X(30.6)+' 97.2 '+X(29.2)+' 96 '+X(29.4)+' 93.2Z" fill="'+SSOLE+'"'+sl(1.2)+'/>';
  s+='<circle cx="'+X(44.4)+'" cy="85.4" r="1.2" fill="'+SGOLD+'"'+sl(.9)+'/>';
  return s}
 /* cara de Rumbo (modelo T): la referencia cara-rumbo.svg usada tal cual (CARA, la inyecta build.py).
    Sus subtrazos se reparten en piezas sin cambiar su forma: el ojo izquierdo y la sonrisa vienen unidos en el dibujo,
    así que se separan con dos recortes complementarios. Cada pieza tiene su pivote en su centro (coordenadas de la referencia). */
 var FK=.168,FTX=31.59,FTY=41.77;
 function caraPieces(){var P={fr:[],fl:[]};
  CARA.sub.forEach(function(d){var n=d.match(/-?\d+\.?\d*/g).map(Number),x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;for(var k=0;k<n.length;k+=2){x0=Math.min(x0,n[k]);x1=Math.max(x1,n[k]);y0=Math.min(y0,n[k+1]);y1=Math.max(y1,n[k+1])}
   var w=x1-x0,h=y1-y0;
   if(w>100)P.big=d;else if(x0>130&&h>60)P.er=d;else if(y0>150)P.chin=d;else if(w<10&&h<10)(x0<100?P.fl:P.fr).push(d);else P.nose=d});
  return P}
 function faceRef(id,col){var P=caraPieces(),s='<g transform="translate('+FTX+' '+FTY+') scale('+FK+')" style="color:'+col+'">';
  var F=function(d,c){return '<path d="'+d+'" fill="currentColor" fill-rule="evenodd"'+(c?' clip-path="url(#'+c+')"':'')+'/>'};
  var A=function(cls,d,w){return '<path class="'+cls+'" d="'+d+'" fill="none" stroke="currentColor" stroke-width="'+w+'" stroke-linecap="round" opacity="0"/>'};
  s+='<clipPath id="'+id+'fe"><path d="M40 0H110V125H64L62.6 111.4L60 108H40Z"/></clipPath><clipPath id="'+id+'fs"><path d="M0 108H60L62.6 111.4L64 125H110V0H240V200H0Z"/></clipPath>';
  var eye=function(cls,d,cx,clip){return '<g class="'+cls+'">'+grp("rk-fo",cx,73,F(d,clip))+
   A("rk-fup","M"+(cx-21)+" 84Q"+cx+" 50 "+(cx+21)+" 84",9)+A("rk-fdn","M"+(cx-21)+" 70Q"+cx+" 94 "+(cx+21)+" 70",8)+A("rk-fln","M"+(cx-19)+" 76Q"+cx+" 84 "+(cx+19)+" 76",7)+'</g>'};
  s+=eye("rk-feL",P.big,79,id+"fe")+eye("rk-feR",P.er,159,null);
  s+=grp("rk-fn",112,112,F(P.nose));
  s+=grp("rk-fs",115,138,F(P.big,id+"fs"));
  s+=grp("rk-fc",114,156,F(P.chin));
  s+='<g class="rk-ff">'+P.fl.map(function(d){return F(d)}).join("")+P.fr.map(function(d){return F(d)}).join("")+'</g>';
  s+='<ellipse class="rk-fO" cx="114" cy="140" rx="8" ry="10" fill="currentColor" opacity="0"/>';
  s+='<ellipse data-p="talk" class="rk-mouth" cx="114" cy="141" rx="9" ry="6.5" fill="currentColor"/>';
  s+='</g>';
  s+='<g data-p="sleep"><g class="rk-zz"><text x="70" y="36" font-size="7" font-weight="900" fill="'+col+'" opacity=".55">z</text><text x="75" y="29" font-size="5" font-weight="900" fill="'+col+'" opacity=".4">z</text></g></g>';
  return s}
 /* ================= manos con articulaciones (modelo U) =================
    Guante de caricatura: palma acolchada, pulgar y tres dedos de dos segmentos cada uno (cápsulas que se traslapan en el nudillo),
    puño enrollado y tres costuras en el dorso. Todo se dibuja sin contorno y la silueta completa recibe un solo contorno
    con un filtro (dilatar el alfa), así no aparecen costuras internas al doblar los dedos.
    Coordenadas locales: muñeca en (0,0), dedos hacia arriba; el pulgar queda del lado −x. */
 var HW="#FFFDF8",HS="#D6DCE8",HSD="#BCC5D6",HST="#C2CAD8";
 var HF=[{n:"t",x:-2.7,y:-3.6,a:-62,l1:3,l2:2.2},{n:"i",x:-2,y:-6.2,a:-9,l1:4,l2:2.6},{n:"m",x:0,y:-7,a:0,l1:4.4,l2:2.8},{n:"r",x:2,y:-6.3,a:9,l1:3.8,l2:2.4}];
 /* cápsula con su extremo de abajo centrado en el pivote (0,0): el nudillo es una articulación de bola,
    la base de cada segmento coincide con el extremo redondo del anterior y nunca se abre un hueco */
 var HR=1.4;
 function capsule(L){var r=HR;return 'M'+(-r)+' 0V'+(-L+r)+'A'+r+' '+r+' 0 0 1 '+r+' '+(-L+r)+'V0A'+r+' '+r+' 0 0 1 '+(-r)+' 0Z'}
 function seg(L){return '<path class="hk-seg" d="'+capsule(L)+'" fill="'+HW+'"/><path d="M.42 0V'+(-L+1.3)+'Q1.4 '+(-L+1.6)+' 1.4 '+(-L+2.2)+'V0Z" fill="'+HS+'" opacity=".9"/>'}
 function dbg(x,y){return '<circle class="hk-dbg" cx="'+x+'" cy="'+y+'" r=".45" fill="#E2434B"/>'}
 function handRig(id,side){var s='<filter id="'+id+'" x="-30%" y="-30%" width="160%" height="160%"><feMorphology in="SourceAlpha" operator="dilate" radius=".72" result="d"/><feFlood flood-color="#4B2A13"/><feComposite in2="d" operator="in" result="o"/><feMerge><feMergeNode in="o"/><feMergeNode in="SourceGraphic"/></feMerge></filter>';
  var f='';
  HF.forEach(function(q){f+='<g class="hk-'+q.n+'1 hk-p" data-px="'+q.x+'" data-py="'+q.y+'" data-a="'+q.a+'" data-l="'+q.l1+'" transform="rotate('+q.a+' '+q.x+' '+q.y+')"><g transform="translate('+q.x+' '+q.y+')">'+seg(q.l1)+
   '<g class="hk-'+q.n+'2 hk-d" data-px="0" data-py="'+(-q.l1+HR)+'"><g transform="translate(0 '+(-q.l1+HR)+')">'+seg(q.l2+HR)+dbg(0,0)+'</g></g>'+dbg(0,0)+'</g></g>'});
  var palm='<path class="hk-palm" d="M-4.3 -2.8C-4.7 -6.6 -2.7 -8.4 0 -8.4C2.7 -8.4 4.7 -6.6 4.3 -2.8C4 -.5 2.3 .7 0 .7C-2.3 .7 -4 -.5 -4.3 -2.8Z" fill="'+HW+'"/>'+
   '<path d="M3.5 -6.2C4.5 -4.2 4.3 -1.2 2 .2C3.3 -1.6 3.7 -3.9 3.5 -6.2Z" fill="'+HS+'"/>'+
   '<g class="hk-stitch" opacity="0"><path d="M-1.7 -5.8V-3.6M0 -6V-3.8M1.7 -5.8V-3.6" stroke="'+HST+'" stroke-width=".55" stroke-linecap="round"/></g>'+
   '<path class="hk-crease" d="M-1.6 -1.6Q0 -1 1.6 -1.6" stroke="'+HS+'" stroke-width=".5" fill="none" stroke-linecap="round" opacity=".7"/>';
  /* el pulgar va detrás de la palma, los dedos encima */
  var thumb=f.slice(0,f.indexOf('<g class="hk-i1'));var rest=f.slice(f.indexOf('<g class="hk-i1'));
  var cuff='<rect x="-4" y="-.4" width="8" height="2.8" rx="1.4" fill="'+HW+'"/><rect x="-4" y="1" width="8" height="1.4" rx=".7" fill="'+HS+'"/><path d="M-3.2 .5H3.2" stroke="'+HSD+'" stroke-width=".4" stroke-linecap="round" opacity=".7"/>';
  s+='<g class="hk-flip" filter="url(#'+id+')">'+thumb+palm+rest+cuff+'</g>'+dbg(0,0);
  return s}
 function handAt(id,x,y,side){return '<g transform="translate('+x+' '+y+') scale('+(side<0?-.86:.86)+' .86)">'+handRig(id,side)+'</g>'}
 /* gorro de aviador del modelo U: casquete redondo con panel central y costuras, borde de borrego esponjoso,
    gafas grandes con su correa, orejeras con forro de borrego y una correa con hebilla, botón y flecha arriba */
 function hatU(id){var CAP="#9A5B33",CAPS="#7A4426",CAPL="#B27245",FUR="#F6E8CF",FURS="#E3CDA8",STR="#4E2E19",o=sl;
  var DOME="M26.8 45.6C25.6 31.4 36.2 22.6 50 22.6C63.8 22.6 74.4 31.4 73.2 45.6Q50 36 26.8 45.6Z";
  var arrow='<path d="M49.3 25.8L49.3 10.6L50.7 10.6L50.7 25.8Z" fill="'+SGOLD+'"'+o(1.1)+'/><path d="M50 3.6L54.6 10.4Q55 11.4 54 11.2L50 10.2L46 11.2Q45 11.4 45.4 10.4Z" fill="'+SGOLD+'"'+o(1.2)+'/>';
  var flap=function(m){var X=function(x){return (m<0?x:100-x).toFixed(2)};return '<path d="M'+X(28.4)+' 42.8C'+X(24.2)+' 47.8 '+X(23)+' 54.6 '+X(24)+' 60.4C'+X(24.8)+' 64.8 '+X(29.6)+' 65.6 '+X(31.2)+' 61.8C'+X(32.4)+' 57.4 '+X(32.6)+' 50 '+X(32.6)+' 44Z" fill="'+(m<0?CAP:CAPS)+'"'+o()+'/>'+
   '<path d="M'+X(25.2)+' 58.6C'+X(25.6)+' 62.4 '+X(28.6)+' 63.6 '+X(30)+' 61" stroke="'+FUR+'" stroke-width="1.8" fill="none" stroke-linecap="round"/>'+
   (m<0?'<path d="M29.6 61.2L28.6 68.4" stroke="'+STR+'" stroke-width="1.6" stroke-linecap="round"/><rect x="27.2" y="66.6" width="3" height="2.6" rx=".6" fill="none" stroke="'+SGOLD+'" stroke-width=".9"/>':'')};
  var cap='<clipPath id="'+id+'u"><path d="'+DOME+'"/></clipPath><path class="rk-capj" d="'+DOME+'" fill="'+CAP+'"/>'+
   '<g clip-path="url(#'+id+'u)"><path d="M59 18C71 22 80 33 77 48L90 48L90 18Z" fill="'+CAPS+'"/>'+
   '<path d="M44.6 22Q42.6 32 43.6 42L56.4 42Q57.4 32 55.4 22Z" fill="'+CAPL+'" opacity=".55"/>'+
   '<path d="M44.6 23Q42.8 32 43.8 41M55.4 23Q57.2 32 56.2 41" stroke="'+CAPS+'" stroke-width=".9" fill="none" stroke-dasharray="1.3 1.1" stroke-linecap="round"/>'+
   '<path d="M24 37.4Q50 23 76 37.4" stroke="'+STR+'" stroke-width="2.6" fill="none"/></g>'+
   '<path d="M30.6 36Q32 28.6 39.6 24.8" stroke="#C48A5C" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".8"/>'+
   '<path d="'+DOME+'" fill="none"'+o()+'/><ellipse cx="50" cy="23" rx="2.2" ry="1.3" fill="'+CAPS+'"'+o(1)+'/>';
  /* borde de borrego: círculos encimados a lo largo de la curva, primero el contorno y luego el relleno */
  var fo="",ff="",fs="";for(var i=0;i<=14;i++){var t=i/14,x=(1-t)*(1-t)*26.4+2*(1-t)*t*50+t*t*73.6,y=(1-t)*(1-t)*45.8+2*(1-t)*t*35.4+t*t*45.8,r=i%2?2.15:2.45;
   fo+='<circle class="rk-capj" cx="'+x.toFixed(2)+'" cy="'+y.toFixed(2)+'" r="'+(r+.75)+'" fill="'+SO+'"/>';ff+='<circle cx="'+x.toFixed(2)+'" cy="'+y.toFixed(2)+'" r="'+r+'" fill="'+FUR+'"/>';
   }
  fs='<path d="M28.4 47.6Q50 38.6 71.6 47.6" stroke="'+FURS+'" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".9"/>';
  var gog='<rect x="47.4" y="31" width="5.2" height="2.6" rx="1.2" fill="'+SGOLD+'"'+o(1)+'/>';
  [[41.2,32.6],[58.8,32.6]].forEach(function(c){gog+='<circle cx="'+(c[0]+.5)+'" cy="'+(c[1]+.6)+'" r="6" fill="#B07A2A"/><circle cx="'+c[0]+'" cy="'+c[1]+'" r="6" fill="'+SGOLD+'"'+o(1.2)+'/><circle cx="'+c[0]+'" cy="'+c[1]+'" r="4.2" fill="'+SLENS+'"'+o(1)+'/>'+
   '<path d="M'+(c[0]-2.6)+' '+(c[1]+.2)+'Q'+(c[0]-2.2)+' '+(c[1]-2.6)+' '+(c[0]+.4)+' '+(c[1]-2.9)+'" stroke="#FFFFFF" stroke-width="1.3" fill="none" stroke-linecap="round" opacity=".9"/>'});
  return grp("rk-hat",50,42,grp("rk-arrow",50,24.4,arrow)+grp("rk-flapL",30.6,45,flap(-1))+grp("rk-flapR",69.4,45,flap(1))+cap+fo+ff+fs+grp("rk-gog",50,32.6,gog))}
 function buildS(fk,nh){
  var id="rbm"+(++N),C=[50,57.6],R=24.4;
  /* cuerpo: caja dorada con grosor, carátula crema, marcas cortas y triángulo rojo del norte */
  var body='<circle class="rk-core" cx="50" cy="57.6" r="'+R+'" fill="'+SRING+'"/>'+crescent(50,57.6,R-.4,-3,-3.4,SRINGS)+
   '<path d="M28.6 63A22 22 0 0 1 33 42.6" stroke="'+SRINGH+'" stroke-width="1.8" fill="none" stroke-linecap="round"/>'+
   '<circle cx="50" cy="57.6" r="'+R+'" fill="none"'+sl()+'/>'+
   '<circle cx="50" cy="57.6" r="19.8" fill="'+SDIAL+'"'+sl(1.2)+'/>'+crescent(50,57.6,19.2,-2,-2.4,"#F0E3C8");
  for(var a=0;a<360;a+=30){if(a===270)continue;var t=a*Math.PI/180,c=Math.cos(t),n=Math.sin(t),r0=a%90===0?15.2:16.2;
   body+='<path d="M'+(50+c*r0).toFixed(2)+' '+(57.6+n*r0).toFixed(2)+'L'+(50+c*17.8).toFixed(2)+' '+(57.6+n*17.8).toFixed(2)+'" stroke="'+STK+'" stroke-width="1.2" stroke-linecap="round"/>'}
  body+='<path d="M50 40.6L51.6 44.4L48.4 44.4Z" fill="#D9534F" stroke="#D9534F" stroke-width=".6" stroke-linejoin="round"/>';
  /* cara */
  var face;if(fk==="ref")face=faceRef(id,SO);else{face='<ellipse cx="38.4" cy="65.6" rx="2.6" ry="1.8" fill="#F4A3A0" opacity=".7"/><ellipse cx="61.6" cy="65.6" rx="2.6" ry="1.8" fill="#F4A3A0" opacity=".7"/>'+
   eyeM(id,0,SDIAL,"retro")+eyeM(id,1,SDIAL,"retro");
  var I='stroke="'+SEYE+'" fill="none" stroke-linecap="round"';
  face+='<path data-p="idle" d="M47.6 65.6Q50 67.9 52.4 65.6" '+I+' stroke-width="1.4"/>';
  face+='<g data-p="happy wink"><path d="M47.2 65.2Q50 69.4 52.8 65.2Z" fill="'+SEYE+'" stroke="'+SEYE+'" stroke-width="1" stroke-linejoin="round"/><path d="M48.5 67.3Q50 68.4 51.5 67.3Q50.7 66.6 50 66.6Q49.3 66.6 48.5 67.3Z" fill="#E86A6A"/></g>';
  face+='<g data-p="joy"><path d="M46.6 64.8Q50 70.6 53.4 64.8Z" fill="'+SEYE+'" stroke="'+SEYE+'" stroke-width="1" stroke-linejoin="round"/><path d="M48.2 67.9Q50 69.4 51.8 67.9Q50.9 67 50 67Q49.1 67 48.2 67.9Z" fill="#E86A6A"/></g>';
  face+='<ellipse data-p="wow" cx="50" cy="66.6" rx="1.6" ry="2" fill="'+SEYE+'"/>';
  face+='<ellipse data-p="curious" cx="51" cy="66.2" rx="1.1" ry="1.3" fill="'+SEYE+'"/>';
  face+='<path data-p="think" d="M48.2 66.3Q50 65.6 51.8 66.4" '+I+' stroke-width="1.3"/>';
  face+='<path data-p="sadhope" d="M48 66Q50 67.3 52 66" '+I+' stroke-width="1.3"/>';
  face+='<path data-p="sad no" d="M47.8 67Q50 65.2 52.2 67" '+I+' stroke-width="1.4"/>';
  face+='<path data-p="meh" d="M48.2 66.2H51.8" '+I+' stroke-width="1.4"/>';
  face+='<ellipse data-p="talk" class="rk-mouth" cx="50" cy="66.2" rx="1.9" ry="1.6" fill="'+SEYE+'"/>';
  face+='<ellipse data-p="sleep" cx="50" cy="66.4" rx=".9" ry=".7" fill="'+SEYE+'"/>';
  face+='<ellipse data-p="yawn" cx="50" cy="66.6" rx="1.8" ry="2.4" fill="'+SEYE+'"/>';
  face+='<g data-p="sleep"><g class="rk-zz"><text x="70" y="36" font-size="7" font-weight="900" fill="'+SEYE+'" opacity=".55">z</text><text x="75" y="29" font-size="5" font-weight="900" fill="'+SEYE+'" opacity=".4">z</text></g></g>';}
  /* gorro de cuero: casquete con borde grueso, costuras, orejeras (la izquierda con broche) y gafas */
  var DOME="M26.2 47.4C25 31 36 20.6 50.6 20.6C65 20.6 75.6 30.4 74.6 46C66 39.6 58 37.4 50 37.6C41.6 37.8 33.4 41.4 26.2 47.4Z";
  var arrow='<path d="M49.3 22L49.3 10.6L50.7 10.6L50.7 22Z" fill="'+SGOLD+'"'+sl(1.1)+'/>'+
   '<path d="M50 3.6L54.6 10.4Q55 11.4 54 11.2L50 10.2L46 11.2Q45 11.4 45.4 10.4Z" fill="'+SGOLD+'"'+sl(1.2)+'/>';
  var flapL='<path d="M27.6 44.6C23.8 49.6 22.6 56 23.4 61.6C24 65.6 27.4 66.4 29.6 64.2C31 62.4 31.6 56.6 32 46.6Z" fill="'+SCAP+'"'+sl()+'/>'+
   '<circle cx="26.8" cy="59" r="1.7" fill="'+SGOLD+'"'+sl(1)+'/>';
  var flapR='<path d="M72.2 43.4C75.4 47 76.4 51.6 75.4 55.4C74.8 57.8 72 58 71.2 55.8C70.4 53 69.8 48.8 69.4 44.4Z" fill="'+SCAPS+'"'+sl()+'/>';
  var cap='<clipPath id="'+id+'d"><path d="'+DOME+'"/></clipPath><path class="rk-capj" d="'+DOME+'" fill="'+SCAP+'"/>'+
   '<g clip-path="url(#'+id+'d)"><path d="M58 16C72 20 82 32 78 50L90 50L90 16Z" fill="'+SCAPS+'"/>'+
   '<path d="M50.6 20.8C52.4 26.4 52.6 31.6 51.6 37.4" stroke="'+SCAPS+'" stroke-width="1" fill="none" stroke-dasharray="1.4 1.2" stroke-linecap="round"/>'+
   '<path d="M26 37.4C36 29 64 28.6 75 36" stroke="#5E3A22" stroke-width="2.6" fill="none"/></g>'+
   '<path d="M31.4 34.4Q32.8 26.8 41 22.8" stroke="'+SCAPH+'" stroke-width="1.6" fill="none" stroke-linecap="round"/>'+
   '<path d="'+DOME+'" fill="none"'+sl()+'/>'+
   '<path class="rk-capj" d="M25.4 45.6C33 39.6 41.6 36 50 35.8C58.4 35.6 67 38 75.4 44.6L74.6 48C66.6 41.6 58.2 39.4 50 39.6C41.8 39.8 33.6 43.2 26.4 49.2Z" fill="'+SCAPS+'"'+sl()+'/>';
  var gog='<rect x="45.6" y="30.6" width="8.4" height="2.4" rx="1.2" fill="'+SGOLD+'"'+sl(1)+'/>';
  [[40.8,32.2],[59,31.6]].forEach(function(c){gog+='<circle cx="'+c[0]+'" cy="'+c[1]+'" r="5" fill="'+SGOLD+'"'+sl(1.2)+'/><circle cx="'+c[0]+'" cy="'+c[1]+'" r="3.4" fill="'+SLENS+'"'+sl(.9)+'/><path d="M'+(c[0]-2)+' '+(c[1]+.4)+'L'+(c[0]+.6)+' '+(c[1]-2.2)+'" stroke="'+SLENSH+'" stroke-width="1.2" stroke-linecap="round"/>'});
  var hat=nh?hatU(id):grp("rk-hat",50,42,grp("rk-arrow",50,22,arrow)+grp("rk-flapL",30,46,flapL)+grp("rk-flapR",71,45,flapR)+cap+grp("rk-gog",50,31.6,gog));
  return '<svg class="rbx rbx-S'+(fk==="ref"?' rbx-T'+(nh?' rbx-U':'')+'" data-face="ref':'')+'" data-ojos="retro" data-hatr="-7" data-arr="-16" data-eyefix="1" viewBox="0 0 100 100" aria-hidden="true">'+
   grp("rk-root",50,97,
    '<g class="rk-shadow"><ellipse class="rk-sh" cx="50" cy="97.2" rx="24" ry="2.4" fill="var(--rb-sh,#13213F)" opacity=".2"/><ellipse cx="38.6" cy="97.1" rx="9" ry="1.2" fill="#13213F" opacity=".22"/><ellipse cx="61.4" cy="97.1" rx="9" ry="1.2" fill="#13213F" opacity=".22"/></g>'+
    grp("rk-legL",41.5,76,bootS(-1))+grp("rk-legR",58.5,76,bootS(1))+
    grp("rk-body",50,82,body+'<g class="rk-face">'+face+'</g>'+hat)+
    (nh?grp("rk-handL",15,70,handAt(id+"hL",15,70,-1))+grp("rk-handR",86,60,handAt(id+"hR",86,60,1)):grp("rk-handL",16,70,gloveS(16,70,-1))+grp("rk-handR",85,58,gloveS(85,58,1))))+'</svg>'}

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
  var D0={u:-.05,b:0,t:0,l:0,c:0,s:1,p:1};
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
  /* ajustes del modelo R: ojos enormes, así que feliz y triste se hacen con menos párpado */
  var EPR={happy:[E(),E()],wink:[E(),E(ARC)],sad:[E({u:.26,t:2}),E({u:.26,t:2})],sadhope:[E({u:.2,t:1.6}),E({u:.2,t:1.6})],meh:[E({u:.34}),E({u:.34})],no:[E({u:.4,l:.16,c:-.4}),E({u:.4,l:.16,c:-.4})],think:[E({u:.12}),E({u:.12})],curious:[E({u:.14,s:.97}),E({u:-.05,s:1.06})]};
  var GZ={think:[-1.8,-2.2],curious:[1.6,-1],sadhope:[0,1.2],sad:[0,1.6],sleep:[0,1]};
  /* dedo o cursor: los ojos lo siguen un rato después de cada movimiento */
  var PTR={x:0,y:0,t:-1e9};
  function onPtr(e){PTR.x=e.clientX;PTR.y=e.clientY;PTR.t=performance.now()}
  window.addEventListener("pointermove",onPtr,{passive:true});window.addEventListener("pointerdown",onPtr,{passive:true});
  function init(svg){
   var q=function(c){return svg.querySelector("."+c)};
   var st={t:0,g:{root:q("rk-root"),body:q("rk-body"),face:q("rk-face"),brows:q("rk-brows"),legL:q("rk-legL"),legR:q("rk-legR"),hat:q("rk-hat"),hatb:q("rk-hatb"),arrow:q("rk-arrow"),flapL:q("rk-flapL"),flapR:q("rk-flapR"),gog:q("rk-gog"),armL:q("rk-armL"),handL:q("rk-handL"),handR:q("rk-handR"),armR:q("rk-armR"),shadow:q("rk-shadow"),mouth:q("rk-mouth"),zz:q("rk-zz")},
    hk:(function(){var hs=["rk-handL","rk-handR"].map(function(c){var h=svg.querySelector("."+c);if(!h||!h.querySelector(".hk-flip"))return null;var sp=function(){return {x:0,v:0}};return {flip:h.querySelector(".hk-flip"),st:h.querySelector(".hk-stitch"),cr:h.querySelector(".hk-crease"),f:["t","i","m","r"].map(function(n){var p=h.querySelector(".hk-"+n+"1");return {p:p,d:h.querySelector(".hk-"+n+"2"),a0:+p.getAttribute("data-a"),l:+p.getAttribute("data-l")}}),c:[sp(),sp(),sp(),sp()],s:sp(),ta:{x:-62,v:0},hv:{x:1,v:0},lag:sp(),pr:0,mi:-1,mt:0,mn:2,last:{}}});return hs[0]?hs:null})(),
    fp:(function(){var g=function(c){return svg.querySelector("."+c)},e=function(c){var r=g(c);return r?{o:r.querySelector(".rk-fo"),up:r.querySelector(".rk-fup"),dn:r.querySelector(".rk-fdn"),ln:r.querySelector(".rk-fln"),c:{sx:1,sy:1,op:1,up:0,dn:0,dx:0,dy:0},last:{}}:null};var L=e("rk-feL");return L?{eL:L,eR:e("rk-feR"),s:g("rk-fs"),c:g("rk-fc"),n:g("rk-fn"),O:g("rk-fO"),ff:g("rk-ff"),m:{ssx:1,ssy:1,sop:1,O:0,ch:1,Os:1},last:{},smT:-9}:null})(),
    eyes:Array.prototype.slice.call(svg.querySelectorAll(".rk-eye")).map(function(e,i){return {sq:e.querySelector(".rk-esq"),pup:e.querySelector(".rk-pup"),up:e.querySelector(".rk-up"),lash:e.querySelector(".rk-lash"),lo:e.querySelector(".rk-lo"),lol:e.querySelector(".rk-lol"),iris:e.querySelector(".rk-iris"),cx:+e.getAttribute("data-cx"),cy:+e.getAttribute("data-cy"),rx:+e.getAttribute("data-rx"),ry:+e.getAttribute("data-ry"),cur:E(),last:{}}}),
    brw:Array.prototype.slice.call(svg.querySelectorAll(".rk-brow")).map(function(e){return {e:e,dy:0,a:0}}),
    dp:Array.prototype.slice.call(svg.querySelectorAll("[data-p]")).map(function(e){return {e:e,w:e.getAttribute("data-p").split(" "),o:-1}}),
    w:{idle:1,walk:0,cheer:0},pose:{wave:0,point:0},act:null,ov:null,idleIn:rnd(10,15),lastIdle:"",
    blinkIn:rnd(1,4),blinkT:-1,blinkD:.15,twice:false,mood:null,
    gz:[0,0],gzT:[0,0],gzIn:rnd(2.5,5),gzHold:0,mic:[0,0],micIn:.5,rc:null,rcT:0,lk:null,lkT:0,
    sp:{arrow:{x:0,v:0},flapL:{x:0,v:0},flapR:{x:0,v:0},gog:{x:0,v:0},hat:{x:0,v:0},hatR:{x:0,v:0},face:{x:0,v:0},faceX:{x:0,v:0},lean:{x:0,v:0},armL:{x:0,v:0},armR:{x:0,v:0},hLx:{x:0,v:0},hLy:{x:0,v:0},hLr:{x:0,v:0},hRx:{x:0,v:0},hRy:{x:0,v:0},hRr:{x:0,v:0}},
    py:0,vy:0,px:0,vx:0,pr:0,vr:0,idleEye:svg.getAttribute("data-ojos-idle"),asH:svg.getAttribute("data-hatr")?+svg.getAttribute("data-hatr"):svg.getAttribute("data-asim")?-6:0,asA:svg.getAttribute("data-arr")?+svg.getAttribute("data-arr"):svg.getAttribute("data-asim")?5:0,eyefix:!!svg.getAttribute("data-eyefix"),isR:svg.classList.contains("rbx-R")||svg.classList.contains("rbx-P")||svg.classList.contains("rbx-S"),browAuto:!!svg.getAttribute("data-brow-auto"),browO:-1,spin:0,asF:svg.getAttribute("data-asim")?-24:0,bk:(EYES[svg.getAttribute("data-ojos")]||{}).brow||1};
   ST.set(svg,st);if(io)io.observe(svg);else VIS.set(svg,true);return st}
  function frame(now){
   raf=0;var dt=Math.min(.05,Math.max(0,(now-(last||now))/1000))*(window.__rbSlow||1);last=now;
   if(document.hidden)return;
   var any=false,rm=RMq();
   for(var i=0;i<list.length;i++){var svg=list[i],st=ST.get(svg)||init(svg);if(!VIS.get(svg))continue;any=true;step(svg,st,dt,rm,now)}
   if(any)raf=requestAnimationFrame(frame);
  }
  function go(){if(!raf&&!document.hidden){last=0;raf=requestAnimationFrame(frame)}}
  document.addEventListener("visibilitychange",go);
  /* registra los Rumbo que aparecen después */
  setInterval(function(){for(var i=0;i<list.length;i++)if(!ST.get(list[i]))init(list[i]);go()},600);
  /* biblioteca de poses de mano: c curvatura de [pulgar, índice, medio, anular] (0 recto, 1 doblado), s apertura, t ángulo del pulgar, v vista (1 palma, −1 dorso) */
  var HPOSE={relajada:{c:[0,0,0,.02],s:1.05,t:-70,v:-1},saludo:{c:[0,0,0,0],s:1.25,t:-74,v:1},"señalar":{c:[.7,0,1,1],s:.9,t:-20,v:-1},pulgar:{c:[0,1,1,1],s:.8,t:-92,v:1,r:82},
   "puño":{c:[.6,1,1,1],s:.8,t:-24,v:-1},paz:{c:[.7,0,0,1],s:1.7,t:-22,v:1},uno:{c:[.7,0,1,1],s:.9,t:-20,v:1},dos:{c:[.7,0,0,1],s:1.1,t:-20,v:1},tres:{c:[.7,0,0,0],s:1.1,t:-20,v:1},
   celebrando:{c:[0,0,0,0],s:1.55,t:-86,v:1},sosteniendo:{c:[.35,.55,.6,.65],s:.95,t:-36,v:1},aplaudiendo:{c:[.05,.04,.04,.06],s:.9,t:-50,v:1},pensando:{c:[.45,.35,.6,.7],s:.9,t:-40,v:-1}};
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
    B.r+=(g.handR?0:st.pose.wave*5*Math.sin(t*2*Math.PI/.6));lean+=st.pose.point*(g.handR?2:5)+(mood==="curious"?-7:0);
    /* coreografías */
    if(A){A.t+=dt;var p=Math.min(1,A.t/A.d),e;
     if(A.k==="jump"){var hj=hop(p);lift+=Math.min(0,hj.y);B.y+=Math.max(0,hj.y);B.sy+=hj.sy-1;aL+=hj.up*100;aR-=hj.up*100}
     else if(A.k==="yes"){var hy2=hop(cl(p/.85,0,1),11);lift+=Math.min(0,hy2.y);B.y+=Math.max(0,hy2.y);B.sy+=hy2.sy-1;aL+=hy2.up*120;aR-=hy2.up*120}
     else if(A.k==="cheer"){var q2=cl(p/.92,0,1),hc=hop((q2*2)%1,15);if(q2>=1)hc={y:0,sy:1,up:0};lift+=Math.min(0,hc.y);B.y+=Math.max(0,hc.y);B.sy+=hc.sy-1;e=env(A,.12,.35);aL+=e*135;aR-=e*135;B.r+=e*3*Math.sin(A.t*2*Math.PI/.45)}
     else if(A.k==="wave"){e=env(A,.22,.35);B.r+=e*6*Math.sin((A.t-.1)*2*Math.PI/.55);B.y+=-1.2*e*Math.abs(Math.sin((A.t-.1)*2*Math.PI/.55));look=[1.2,-.4]}
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
   /* manitas flotantes: posición y giro con resorte (pequeño rebote); siguen al cuerpo con un leve retraso */
   if(g.handR){var hl={x:0,y:0,r:0},hr={x:0,y:0,r:0},fl2=Math.sin(t*2*Math.PI/2.4),fl3=Math.sin(t*2*Math.PI/2.4+1.7);
    hl.y+=W.idle*.8*fl2;hr.y+=W.idle*.8*fl3;
    hl.x+=W.walk*1.6*s1;hr.x-=W.walk*1.6*s1;hl.y+=W.walk*-.6;hr.y+=W.walk*-.6;
    var up=W.cheer;if(A&&(A.k==="cheer"||A.k==="yes"||A.k==="jump"))up=Math.max(up,env(A,.15,.3));
    hl.x+=up*4;hl.y+=up*-22;hr.x-=up*4;hr.y+=up*-22;hl.r+=up*(-18+12*Math.sin(t*2*Math.PI/.5));hr.r+=up*(18-12*Math.sin(t*2*Math.PI/.5));
    var wv=st.pose.wave;if(A&&A.k==="wave")wv=Math.max(wv,env(A,.22,.35));
    hr.x+=wv*-1.5;hr.y+=wv*-15;hr.r+=wv*(10+24*Math.sin(t*2*Math.PI/.5));
    var pt=st.pose.point;hr.x+=pt*3;hr.y+=pt*-7;hr.r+=pt*-80;
    if(A&&A.k==="oops"){var eo=env(A,.3,.5);hl.x+=eo*3;hr.x-=eo*3;hl.y+=eo*2;hr.y+=eo*2}
    if(A&&A.k==="adjust"){var ea2=env(A,.32,.4);hl.x+=ea2*24;hl.y+=ea2*-27;hl.r+=ea2*20}
    if(A&&A.k==="yawn"){var ey2=env(A,.4,.6);hl.x+=ey2*16;hl.y+=ey2*-6}
    /* manos con articulaciones: pose de cada mano (las dos nunca iguales) y su lugar */
    var PL="relajada",PR="relajada";
    if(st.hk){if(up>.5)PL=PR="celebrando";if(A&&A.k==="yes"){PL="celebrando";PR="pulgar"}if(wv>.3)PR="saludo";if(pt>.3)PR="señalar";if(mood==="think")PL="pensando";if(A&&A.k==="oops")PL=PR="sosteniendo";
     var xl=wr.getAttribute("data-pose-l"),xr=wr.getAttribute("data-pose-r");if(xl)PL=xl;if(xr)PR=xr;st.PL=PL;st.PR=PR;
     if(PL==="aplaudiendo"||PR==="aplaudiendo"){var cl3=Math.abs(Math.sin(t*2*Math.PI/.7));hl.x+=29-cl3*2.4;hl.y+=7;hl.r+=70;hr.x-=31-cl3*2.4;hr.y+=17;hr.r-=70}
     if(PL==="pensando"){hl.x+=26;hl.y+=4;hl.r-=24}
     if(pt>.3)hr.r+=pt*160;
     /* en reposo las manos cuelgan: dedos hacia abajo, inclinadas hacia el cuerpo; al caminar se balancean como péndulo */
     var hgL=PL==="relajada"?1:0,hgR=PR==="relajada"?1:0,sw=W.walk*14*s1;
     hl.r+=hgL*(166+sw);hl.y-=hgL*7.5;hl.x-=hgL*1.2;hr.r-=hgR*(160-sw);hr.y-=hgR*6.5;hr.x+=hgR*.6;
     var QL=HPOSE[PL]||{},QR=HPOSE[PR]||{},hvw=wr.getAttribute("data-hview"),vf=function(Q){return hvw==="dorso"?-1:hvw==="palma"?1:(Q.v||1)};hl.r-=(QL.r||0)*vf(QL);hr.r+=(QR.r||0)*vf(QR)}
    var by=B.y+lift;hl.y+=by;hr.y+=by;
    var sx2=rm?0:1,HK=150,HC=12;
    T(g.handL,{x:spring(st.sp.hLx,hl.x,dt,HK,HC,40)*sx2,y:spring(st.sp.hLy,hl.y,dt,HK,HC,40)*sx2,r:spring(st.sp.hLr,hl.r,dt,120,11,260)*sx2});
    T(g.handR,{x:spring(st.sp.hRx,hr.x,dt,HK,HC,40)*sx2,y:spring(st.sp.hRy,hr.y,dt,HK,HC,40)*sx2,r:spring(st.sp.hRr,hr.r,dt,120,11,260)*sx2})}

   /* ---------- dedos: cada uno con su resorte (rigidez distinta, así se doblan uno tras otro con rebote) ---------- */
   if(st.hk&&!rm){var HP=HPOSE,ts=["relajada","relajada"];
    st.hk.forEach(function(h,i){var nm=i?st.PR:st.PL,Q=HP[nm]||HP.relajada,vw=wr.getAttribute("data-hview");
     var view=vw==="dorso"?-1:vw==="palma"?1:Q.v;
     /* micro movimientos: de vez en cuando un dedo se dobla un poco y se estira */
     h.mt-=dt;if(h.mt<=0){h.mi=Math.floor(Math.random()*4);h.mn=rnd(.25,.6);h.mt=rnd(2,4)}var mic=h.mn>0?(h.mn-=dt,.07*Math.sin(Math.PI*Math.max(0,h.mn)/.6)):0;
     var dif=i?.02:0,sp2=Q.s*(i?.93:1);
     /* velocidad de la muñeca: los dedos se quedan atrás al cambiar de dirección */
     var rr=i?st.sp.hRr.x:st.sp.hLr.x,wvv=(rr-h.pr)/(dt||.016);h.pr=rr;var lg=spring(h.lag,cl(-wvv*.045,-26,26),dt,120,9,26);
     var hv=spring(h.hv,view,dt,140,14,1.2);setA(h.flip,"transform","scale("+f(Math.abs(hv)<.05?(hv<0?-.05:.05):hv)+" 1)",h.last,"fl");
     setA(h.st,"opacity",f(cl(-hv*2,0,1)),h.last,"st");setA(h.cr,"opacity",f(cl(hv*2,0,1)),h.last,"cr");
     var K=[290,260,235,210];
     h.f.forEach(function(fi,k){var tgt=cl(Q.c[k]+(k?dif:0)+(h.mi===k?mic:0),0,1),c=spring(h.c[k],tgt,dt,K[k],14,1.15);
      var sg=k===3?-1:1,base=k===0?spring(h.ta,Q.t+(i?6:0),dt,200,15,180):fi.a0*sp2;
      T(fi.p,{r:base+c*sg*(k?6:30)+lg*.6,y:k?c*fi.l*.45:0,sy:k?1-c*.3:1});T(fi.d,{r:lg*.8+(k?0:c*40),sy:k?Math.max(.08,1-c*.92):1})})});
   }
   /* la flecha gira de alegría en el acierto y la celebración */
   var spin=0;if(A&&(A.k==="yes"||A.k==="cheer")&&!rm){var sp2=cl(A.t/(A.d*.7),0,1);spin=360*(1-Math.pow(1-sp2,3))}
   T(g.face,{x:fx,y:fy});T(g.brows,{x:fx,y:fy});
   T(g.hat,{y:hy,r:hr+st.asH});if(g.hatb)T(g.hatb,{y:hy,r:hr+st.asH});T(g.arrow,{r:ar+st.asA+spin});T(g.flapL,{r:fl});T(g.flapR,{r:fr+st.asF});T(g.gog,{y:gy});
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
   var ea=rm?1:1-Math.exp(-dt/.055),tgE=st.isR&&EPR[mood]?EPR[mood]:st.idleEye&&(mood==="idle"||mood==="talk"||(mood==="happy"&&st.idleEye==="joy"))?EP[st.idleEye]:EP[mood],tgB=BRW[mood]||BRW.idle;
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
    setA(ey.sq,"transform","translate("+f((st.eyefix?0:st.gz[0]*.7)+cx)+" "+f((st.eyefix?0:st.gz[1]*.7)+cy)+") scale("+f(ssx)+" "+f(ssy)+") translate("+(-cx)+" "+(-cy)+")",ey.last,"s");
    setA(ey.pup,"transform","translate(0 "+f(.5*bl)+")",ey.last,"p");
    if(ey.iris)setA(ey.iris,"transform","translate("+f(st.gz[0]*(st.eyefix?.75:.7))+" "+f(st.gz[1]*(st.eyefix?.75:.7))+")",ey.last,"i")});
   /* cejas casi invisibles en reposo: aparecen solo en expresiones fuertes */
   if(st.browAuto&&g.brows){var bo=/^(wow|sad|sadhope|curious|think|no)$/.test(mood)?1:0;st.browO=st.browO<0?bo:st.browO+(bo-st.browO)*ea;var bv=f(st.browO);if(bv!==st.browL){g.brows.style.opacity=bv;st.browL=bv}}

   /* ---------- cara de la referencia (modelo T): piezas de cara-rumbo.svg ---------- */
   if(st.fp){var FP=st.fp,ED={sx:1,sy:1,op:1,up:0,dn:0,dx:0,dy:0},Em=function(o){var r={};for(var q in ED)r[q]=o&&o[q]!=null?o[q]:ED[q];return r};
    var UP=Em({op:0,up:1}),DN=Em({op:0,dn:1});
    var FE={happy:[UP,UP],joy:[UP,UP],wink:[Em(),UP],sleep:[DN,DN],yawn:[DN,DN],wow:[Em({sx:.92,sy:1.12}),Em({sx:.92,sy:1.12})],
     curious:[Em(),Em({sx:1.08,sy:1.08})],sad:[Em({sy:.93}),Em({sy:.93})]}[mood]||[Em(),Em()];
    var MD={ssx:1,ssy:1,sop:1,O:0,ch:1,Os:1},Mm=function(o){var r={};for(var q in MD)r[q]=o&&o[q]!=null?o[q]:MD[q];return r};
    var FM={happy:Mm({ssy:1.12}),joy:Mm({ssy:1.25,ssx:1.05}),wink:Mm({ssy:1.1}),wow:Mm({sop:0,O:1,ch:0}),yawn:Mm({sop:0,O:1,ch:0,Os:1.4}),sleep:Mm({ssy:.4,ssx:.7}),
     sad:Mm({ssy:-.7,ch:0}),no:Mm({ssy:-.6,ch:0}),sadhope:Mm({ssy:.45}),meh:Mm({ssy:.12,ch:0}),think:Mm({ssy:.3,ssx:.6,ch:0}),curious:Mm({ssy:.5,ssx:.8})}[mood]||Mm();
    var gx=st.gz[0]*3,gy=st.gz[1]*3;
    [FP.eL,FP.eR].forEach(function(E2,i){if(!E2)return;var c=E2.c,T0=FE[i];for(var q in c)c[q]+=(T0[q]-c[q])*ea;
     var shut=c.op>.5?bl:0;
     setA(E2.o,"transform","translate("+f(gx+c.dx)+" "+f(gy+c.dy)+")"+(function(){var px=+E2.o.getAttribute("data-px"),py=+E2.o.getAttribute("data-py");return " translate("+px+" "+py+") scale("+f(c.sx)+" "+f(Math.max(.04,c.sy*(1-.92*shut)))+") translate("+(-px)+" "+(-py)+")"})(),E2.last,"o");
     setA(E2.o,"opacity",f(c.op*(shut>.85?0:1)),E2.last,"oo");
     var tr="translate("+f(gx*.5)+" "+f(gy*.5)+")";setA(E2.up,"transform",tr,E2.last,"ut");setA(E2.dn,"transform",tr,E2.last,"dt");setA(E2.ln,"transform",tr,E2.last,"lt");
     setA(E2.up,"opacity",f(c.up),E2.last,"u");setA(E2.dn,"opacity",f(c.dn),E2.last,"d");setA(E2.ln,"opacity",f(c.op*(shut>.5?(shut-.5)*2:0)),E2.last,"l")});
    var m=FP.m;for(var q2 in m)m[q2]+=(FM[q2]-m[q2])*ea;
    T(FP.s,{sx:m.ssx,sy:Math.abs(m.ssy)<.06?(m.ssy<0?-.06:.06):m.ssy});setA(FP.s,"opacity",f(m.sop),FP.last,"so");
    setA(FP.c,"opacity",f(m.ch),FP.last,"co");setA(FP.O,"opacity",f(m.O),FP.last,"Oo");
    setA(FP.O,"transform","translate(114 140) scale("+f(m.Os)+") translate(-114 -140)",FP.last,"Ot");
    /* pecas: se ocultan cuando Rumbo se ve muy chico */
    if(t-FP.smT>1){FP.smT=t;var wpx=svg.getBoundingClientRect().width;FP.ff.style.display=wpx>0&&wpx<60?"none":""}
   }
   st.brw.forEach(function(bw2,i){var tb=tgB[i];bw2.dy+=(tb[0]-bw2.dy)*ea;bw2.a+=(tb[1]-bw2.a)*ea;var e2=st.eyes[i],lift2=bl*.5;
    bw2.e.setAttribute("transform","translate("+f(e2.cx+st.gz[0]*.15)+" "+f(e2.cy-e2.ry-3.4*st.bk+bw2.dy*st.bk+lift2)+") rotate("+f(bw2.a*(st.bk>1?1.3:1))+") scale("+st.bk+")")});
   /* bocas con fundido corto */
   var fa=rm?1:1-Math.exp(-dt/.05);
   st.dp.forEach(function(d){var tgt=d.w.indexOf(mood)>-1?1:0;if(d.o<0)d.o=tgt;else d.o+=(tgt-d.o)*fa;var v=Math.round(d.o*100)/100;if(v!==d.last){d.e.style.opacity=v;d.last=v}});
   if(g.mouth&&mood==="talk"){var m=.35+.65*(.5+.5*Math.sin(t*2*Math.PI*3.6));var my=+g.mouth.getAttribute("cy");g.mouth.setAttribute("transform","translate(0 "+my+") scale(1 "+f(m)+") translate(0 "+(-my)+")")}
   if(g.zz){var z=(t%2.4)/2.4;g.zz.setAttribute("transform","translate("+f(z*2)+" "+f(2-z*6)+")");g.zz.style.opacity=mood==="sleep"?f(Math.sin(Math.PI*z)):0}
  }
  return {go:go};
 })();
 var NAMES={U:"U · Manos con articulaciones",T:"T · Cara de la referencia",S:"S · Libro simplificado",P:"P · Original con brújula",O:"O · Original mejorado",R:"R · Boceto",v1:"Actual (v1)",A:"A · Globo",B:"B · Brújula",C:"C · Híbrido"};
 var cur=null;try{cur=localStorage.getItem("vocatlas_rumbo")}catch(e){}
 function pick(m){if(m){cur=m;try{localStorage.setItem("vocatlas_rumbo",m)}catch(e){}}return cur||"U"}
 function svg(m,ek,fx){m=m||pick();return m==="v1"?rumboSVG():build(m,ek,fx)}
 return {svg:svg,build:build,pick:pick,EYES:EYES,EYEK:EYEK,eyePick:eyePick,FIN:FIN,FINK:FINK,finPick:finPick,NAMES:NAMES,models:["U","T","S","P","O","R","v1","A","B","C"]};
})();
