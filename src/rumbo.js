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
 var LANDS=[[[-1,-.05],[-.82,-.32],[-.62,-.2],[-.55,.12],[-.62,.42],[-.78,.62],[-.98,.5]],[[.62,.36],[.84,.18],[1,.3],[.98,.66],[.78,.78],[.6,.62]],[[-.3,.86],[-.06,.74],[.22,.8],[.3,1],[-.2,1.02]],[[.4,-.62],[.62,-.52],[.58,-.36],[.42,-.4]]];
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
  s+='<g data-p="idle talk meh sadhope sad think curious"><g class="rb-gaze"><g class="rb-eyes"><g class="rb-eL">'+eye(E1,4.5,5.6)+'</g><g class="rb-eR">'+eye(E2,4.5,5.6)+'</g></g></g>'+
   '<path class="rb-lid" d="M36.2 49.4H45.8V55.4Q41 52.4 36.2 55.4Z" fill="'+skin+'"/><path class="rb-lid" d="M54.2 49.4H63.8V55.4Q59 52.4 54.2 55.4Z" fill="'+skin+'"/></g>';
  /* contento: ojos abiertos un poco más grandes */
  s+='<g data-p="happy wink"><g class="rb-gaze"><g class="rb-eL" data-p="happy">'+eye(E1,4.8,5.9)+'</g><g class="rb-eL" data-p="wink">'+eye(E1,4.8,5.9)+'</g><g class="rb-eR" data-p="happy">'+eye(E2,4.8,5.9)+'</g></g></g>';
  s+='<g data-p="wink">'+arc(E2,true)+'</g>';
  /* muy feliz y celebrando: ojos en arco */
  s+='<g data-p="joy">'+arc(E1,true)+arc(E2,true)+'</g>';
  /* sorprendido: ojos grandes y cejas arriba */
  s+='<g data-p="wow">'+eye(E1,5.4,6.6)+eye(E2,5.4,6.6)+brow(E1,-6,-2)+brow(E2,6,-2)+'</g>';
  /* dormido: ojos cerrados y zetas */
  s+='<g data-p="sleep">'+arc(E1,false)+arc(E2,false)+'<g class="rb-zz"><text x="66" y="40" font-size="7" font-weight="900" fill="'+INK+'" opacity=".55">z</text><text x="71" y="33" font-size="5" font-weight="900" fill="'+INK+'" opacity=".4">z</text></g></g>';
  /* cejas por expresión */
  s+='<g data-p="curious">'+brow(E1,0,0)+brow(E2,-10,-2.2)+'</g>';
  s+='<g data-p="think">'+brow(E1,10,.4)+brow(E2,-4,-.6)+'</g>';
  s+='<g data-p="sad sadhope">'+brow(E1,-14,1)+brow(E2,14,1)+'</g>';
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
  s+='<ellipse data-p="talk" class="rb-mouth" cx="50" cy="63.6" rx="3.2" ry="2.6" fill="'+INK+'"/>';
  s+='<ellipse data-p="sleep" cx="50" cy="64" rx="1.6" ry="1.3" fill="'+INK+'" opacity=".8"/>';
  /* "no le gustó": ojos de rayita */
  s+='<g data-p="no"><path d="M37.4 55H44.6M55.4 55H62.6" stroke="'+INK+'" stroke-width="2" stroke-linecap="round"/></g>';
  return s}

 /* ---------- gorro, solapas, gafas y anillo de la flecha ---------- */
 function hat(id){
  var cap="M22 50Q22 25.6 50 24Q78 25.6 78 50Q66 43 50 43Q34 43 22 50Z";
  var s='<clipPath id="'+id+'c"><path d="'+cap+'"/></clipPath>';
  /* solapas: cuelgan de los lados, por fuera de la cara */
  s+='<path d="M22.4 47Q17.4 48.4 17 56Q16.8 63.6 21.6 64.4Q25.6 65 26.2 60.2L26.2 48.6Z" fill="'+CAP+'"/><path d="M17.2 58.6Q17.8 63.8 21.6 64.4Q25.6 65 26.2 60.2" stroke="'+LIN+'" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
  s+='<path d="M77.6 47Q82.6 48.4 83 56Q83.2 63.6 78.4 64.4Q74.4 65 73.8 60.2L73.8 48.6Z" fill="'+CAPS+'"/><path d="M82.8 58.6Q82.2 63.8 78.4 64.4Q74.4 65 73.8 60.2" stroke="#D2B48A" stroke-width="2.2" fill="none" stroke-linecap="round"/>';
  s+='<path d="'+cap+'" fill="'+CAP+'"/><g clip-path="url(#'+id+'c)"><path d="M54 20L84 20L84 54L60 54Q64 40 54 20Z" fill="'+CAPS+'"/><path d="M28 42Q29 31 40 27.4" stroke="'+CAPH+'" stroke-width="2" fill="none" stroke-linecap="round"/></g>';
  /* borde del gorro con grosor */
  s+='<path d="M22 50Q34 43 50 43Q66 43 78 50L78 52.4Q66 45.4 50 45.4Q34 45.4 22 52.4Z" fill="'+CAPS+'"/>';
  /* correa de las gafas */
  s+='<path d="M23.2 41.4Q50 31.6 76.8 41.4L76.4 44.4Q50 34.8 23.6 44.4Z" fill="'+STRAP+'"/>';
  /* gafas: marco con su sombra, cristal y un brillo */
  [[40.6,37.4],[59.4,37.4]].forEach(function(c){s+='<circle cx="'+(c[0]+.7)+'" cy="'+(c[1]+.8)+'" r="7" fill="'+BRS+'"/><circle cx="'+c[0]+'" cy="'+c[1]+'" r="7" fill="'+BR+'"/><circle cx="'+c[0]+'" cy="'+c[1]+'" r="4.8" fill="'+LENS+'"/><path d="M'+(c[0]-3)+' '+(c[1]-.6)+'Q'+(c[0]-2.4)+' '+(c[1]-3)+' '+(c[0]+.2)+' '+(c[1]-3.4)+'" stroke="#FFFFFF" stroke-width="1.5" fill="none" stroke-linecap="round"/>'});
  s+='<rect x="47.2" y="36" width="5.6" height="2.8" rx="1.4" fill="'+BRS+'"/>';
  /* anillo donde nace la flecha */
  s+='<ellipse cx="50" cy="25.6" rx="4.6" ry="1.7" fill="'+BRS+'"/><ellipse cx="50" cy="24.8" rx="4.6" ry="1.7" fill="'+BR+'"/>';
  return s}
 function arrow(){return '<rect x="48.6" y="9" width="2.8" height="17" rx="1" fill="'+GOLD+'"/><rect x="50" y="9" width="1.4" height="17" fill="'+GOLDS+'"/><path d="M50 1.6Q51.2 1.6 52 2.7L57.4 10.4Q58.3 12 56.5 12H43.5Q41.7 12 42.6 10.4L48 2.7Q48.8 1.6 50 1.6Z" fill="'+GOLD+'"/><path d="M50 1.6Q51.2 1.6 52 2.7L57.4 10.4Q58.3 12 56.5 12H50Z" fill="'+GOLDS+'"/>'}
 function legs(){
  var L="M41 75H47.4V88.6Q47.4 92 44 92H37.8Q35 92 35 90Q35 87.8 38 87.4L41 87Z",R="M52.6 75H59V87L62 87.4Q65 87.8 65 90Q65 92 62.2 92H56Q52.6 92 52.6 88.6Z";
  return '<g class="rb-legL"><path d="'+L+'" fill="'+LEG+'"/><path d="M44.4 75H47.4V88.6Q47.4 92 44 92H42Q44.4 91 44.4 88Z" fill="'+LEGS+'"/><path d="M35 90.4Q35 92 37.8 92H44Q47.4 92 47.4 89.6V90.4Z" fill="'+SOLE+'"/></g>'+
   '<g class="rb-legR"><path d="'+R+'" fill="'+LEG+'"/><path d="M56 75H59V87L62 87.4Q63.6 87.6 64.4 88.4Q60 88.6 56 88.4Z" fill="'+LEGS+'"/><path d="M52.6 89.6Q52.6 92 56 92H62.2Q65 92 65 90.4Z" fill="'+SOLE+'"/></g>'}
 function arms(){
  return '<g class="rb-armL"><path d="M27.6 58.6Q22 59.6 20.8 66Q20.2 71.2 23.6 72.2Q26.8 72.8 27.8 68Z" fill="'+LEG+'"/><path d="M21.6 69.8Q22 72 23.6 72.2Q26.8 72.8 27.8 68Q25 70 21.6 69.8Z" fill="'+LEGS+'"/></g>'+
   '<g class="rb-armR"><path d="M72.4 58.6Q78 59.6 79.2 66Q79.8 71.2 76.4 72.2Q73.2 72.8 72.2 68Z" fill="'+LEG+'"/><path d="M78.4 69.8Q78 72 76.4 72.2Q73.2 72.8 72.2 68Q75 70 78.4 69.8Z" fill="'+LEGS+'"/></g>'}

 function build(model){
  var id="rbm"+(++N),body,skin;
  if(model==="A"){body=globe(id,27);skin="#F7E0BD"}
  else if(model==="B"){body=compass(id,false);skin="#FBF0DA"}
  else{body=compass(id,true);skin="#F7E0BD"}
  return '<svg class="rbx rbx-'+model+'" viewBox="0 0 100 100" aria-hidden="true">'+
   '<ellipse class="rb-sh" cx="50" cy="92" rx="21" ry="2.8"/>'+
   '<g class="rb-sh2"><ellipse cx="42" cy="92" rx="6.4" ry="1.3" fill="#13213F" opacity=".22"/><ellipse cx="58" cy="92" rx="6.4" ry="1.3" fill="#13213F" opacity=".22"/></g>'+
   '<g class="rb-f"><g class="rb-b">'+legs()+arms()+
    '<g class="rb-head"><g class="rb-n">'+arrow()+'</g>'+body+'<g class="rb-face">'+face(skin)+'</g><g class="rb-hat">'+hat(id)+'</g></g>'+
   '</g></g></svg>';
 }
 var NAMES={v1:"Actual (v1)",A:"A · Globo",B:"B · Brújula",C:"C · Híbrido"};
 var cur=null;try{cur=localStorage.getItem("vocatlas_rumbo")}catch(e){}
 function pick(m){if(m){cur=m;try{localStorage.setItem("vocatlas_rumbo",m)}catch(e){}}return cur||"A"}
 function svg(m){m=m||pick();return m==="v1"?rumboSVG():build(m)}
 return {svg:svg,build:build,pick:pick,NAMES:NAMES,models:["v1","A","B","C"]};
})();
