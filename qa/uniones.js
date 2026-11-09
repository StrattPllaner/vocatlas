/* Revisión de uniones de Rumbo, cuadro por cuadro (se inyecta en la página).
   Para cada unión toma puntos del borde de la pieza hija y comprueba que caen DENTRO de la pieza madre
   en la pose de ese cuadro (con todas las transformaciones del esqueleto). Si alguno queda fuera,
   la pieza se separó (hueco) o se salió de su forma. También devuelve el margen mínimo en unidades.
   Uso: window.__uniones(svg) → [{n:"pierna izq.", fuera:[...]}] (vacío = todo bien). */
window.__uniones=function(svg){
 var core=svg.querySelector(".rk-core"),caps=[].slice.call(svg.querySelectorAll(".rk-capj"));
 function first(c){return svg.querySelector("."+c+" path, ."+c+" rect")}
 function inside(shape,el,pt){var m=shape.getScreenCTM().inverse().multiply(el.getScreenCTM());var p=svg.createSVGPoint();p.x=pt[0];p.y=pt[1];var q=p.matrixTransform(m);return shape.isPointInFill(q)}
 function inAny(shapes,el,pt){return shapes.some(function(s){return inside(s,el,pt)})}
 var isR=svg.classList.contains("rbx-R");
 var isO=svg.classList.contains("rbx-O");if(isO)isR=true;
 var isP=svg.classList.contains("rbx-P");if(isP)isR=true;
 var isS=svg.classList.contains("rbx-S");if(isS)isR=true;
 var J=isS?[
  ["bota izq.",first("rk-legL"),[core],[[37,72.6],[46.4,72.6]]],
  ["bota der.",first("rk-legR"),[core],[[53.6,72.6],[63,72.6]]],
  ["asta de la flecha",first("rk-arrow"),caps,[[49.6,21.6],[50.4,21.6]]],
  ["orejera izq.",first("rk-flapL"),[core].concat(caps),[[31,47],[31.6,49]]],
  ["orejera der.",first("rk-flapR"),[core].concat(caps),[[70,45.4],[71,47]]],
  ["gafas sobre el gorro",svg.querySelector(".rk-gog rect"),caps,[[48,31.8],[52,31.8]]]
 ]:isP?[
  ["pierna izq.",first("rk-legL"),[core],[[350,624],[446,624]]],
  ["pierna der.",first("rk-legR"),[core],[[527,624],[629,624]]],
  ["asta de la flecha",svg.querySelector(".rk-arrow rect"),caps,[[468,296],[484,296]]],
  ["orejera izq.",first("rk-flapL"),[core].concat(caps),[[384,540],[384,620]]],
  ["orejera der.",first("rk-flapR"),[core].concat(caps),[[640,460],[640,520]]],
  ["gafas sobre el gorro",svg.querySelector(".rk-gog rect"),caps,[[480,316]]]
 ]:isO?[
  ["pierna izq.",first("rk-legL"),[core],[[42.8,71.4],[47,71.4]]],
  ["pierna der.",first("rk-legR"),[core],[[53,71.4],[57.2,71.4]]],
  ["asta de la flecha",first("rk-arrow"),caps,[[49.4,23.6],[50.6,23.6]]],
  ["orejera izq.",first("rk-flapL"),caps,[[29.2,43.6],[31,43.6]]],
  ["orejera der.",first("rk-flapR"),caps,[[69,43.6],[70.8,43.6]]],
  ["gafas sobre el gorro",first("rk-gog"),caps,[[42.2,26],[57.8,26],[37.6,30.4],[62.4,30.4]]]
 ]:isR?[
  ["pierna izq.",first("rk-legL"),[core],[[42.4,82.4],[44.6,82.4]]],
  ["pierna der.",first("rk-legR"),[core],[[55.4,82.4],[57.6,82.4]]],
  ["asta de la flecha",first("rk-arrow"),caps,[[49.5,17.6],[50.5,17.6]]],
  ["orejera izq.",first("rk-flapL"),caps,[[23.4,43.6],[25.6,44]]],
  ["orejera der.",first("rk-flapR"),caps,[[74.6,43.8],[77.6,43.2]]],
  ["gafas sobre el gorro",first("rk-gog"),caps,[[36.6,27.2],[63.4,27.2],[40.8,23],[59.2,23]]]
 ]:[
  ["pierna izq.",first("rk-legL"),[core],[[41.6,70.6],[46.8,70.6]]],
  ["pierna der.",first("rk-legR"),[core],[[53.2,70.6],[58.4,70.6]]],
  ["hombro izq.",svg.querySelector(".rk-armL circle:last-child"),[core],[[24.8,62.4],[30.8,62.4],[27.8,59.4],[27.8,65.4]]],
  ["hombro der.",svg.querySelector(".rk-armR circle:last-child"),[core],[[69.2,62.4],[75.2,62.4],[72.2,59.4],[72.2,65.4]]],
  ["asta de la flecha",first("rk-arrow"),caps,[[49.2,27.6],[50.8,27.6]]],
  ["orejera izq.",first("rk-flapL"),caps,[[25.8,46.6],[25.6,49.8]]],
  ["orejera der.",first("rk-flapR"),caps,[[74.2,46.6],[74.4,49.8]]],
  ["gafas sobre el gorro",first("rk-gog"),caps,[[34,37.4],[66,37.4],[40.6,31],[59.4,31]]]
 ];
 var out=[];
 /* dedos de las manos con articulaciones: el segmento 1 nace dentro de la palma y el 2 dentro del 1 */
 svg.querySelectorAll(".hk-flip").forEach(function(fl,hi){var palm=fl.querySelector(".hk-palm");
  fl.querySelectorAll(".hk-p").forEach(function(pg){var s1=pg.querySelector(".hk-seg"),dg=pg.querySelector(".hk-d"),s2=dg&&dg.querySelector(".hk-seg");
   var nm=(hi?"mano der. ":"mano izq. ")+pg.getAttribute("class").split(" ")[0];
   var b1=[[-1.25,0],[1.25,0],[0,1.25]].filter(function(pt){return !inside(palm,s1,pt)});if(b1.length)J.length,out.push({n:nm+" fuera de la palma",fuera:b1});
   if(s2){var b2=[[-1.25,0],[1.25,0],[0,1.25]].filter(function(pt){return !inside(s1,s2,pt)});if(b2.length)out.push({n:nm+" punta separada",fuera:b2})}})});
 J.forEach(function(j){if(!j[1])return;var bad=j[3].filter(function(pt){return !inAny(j[2],j[1],pt)});if(bad.length)out.push({n:j[0],fuera:bad})});
 /* la cabeza bajo el gorro: el borde de arriba del cuerpo debe quedar cubierto por el gorro (sin hueco entre gorro y cabeza) */
 if(core){var r=+core.getAttribute("r"),cx=+core.getAttribute("cx"),cy=+core.getAttribute("cy"),bad=[];
  for(var a=(isR?-125:-160);a<=(isR?-55:-20);a+=10){var t=a*Math.PI/180,pt=[cx+Math.cos(t)*(r-.6),cy+Math.sin(t)*(r-.6)];if(!inAny(caps,core,pt))bad.push(a)}
  if(bad.length)out.push({n:"cabeza descubierta bajo el gorro",fuera:bad})}
 /* ojos dentro de la cara */
 [].slice.call(svg.querySelectorAll(".rk-esq ellipse")).slice(0,1).forEach(function(){});
 svg.querySelectorAll(".rk-eye").forEach(function(e,i){var el=e.querySelector("ellipse");var cx=+el.getAttribute("cx"),cy=+el.getAttribute("cy"),rx=+el.getAttribute("rx")+1,ry=+el.getAttribute("ry")+1;
  var pts=[[cx-rx,cy],[cx+rx,cy],[cx,cy-ry],[cx,cy+ry]].filter(function(pt){return !inside(core,el,pt)});if(pts.length)out.push({n:"ojo "+(i?"der.":"izq.")+" fuera de la cara",fuera:pts})});
 return out};
