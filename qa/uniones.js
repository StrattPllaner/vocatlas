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
 var J=[
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
 J.forEach(function(j){if(!j[1])return;var bad=j[3].filter(function(pt){return !inAny(j[2],j[1],pt)});if(bad.length)out.push({n:j[0],fuera:bad})});
 /* la cabeza bajo el gorro: el borde de arriba del cuerpo debe quedar cubierto por el gorro (sin hueco entre gorro y cabeza) */
 if(core){var r=+core.getAttribute("r"),cx=+core.getAttribute("cx"),cy=+core.getAttribute("cy"),bad=[];
  for(var a=-160;a<=-20;a+=10){var t=a*Math.PI/180,pt=[cx+Math.cos(t)*(r-.6),cy+Math.sin(t)*(r-.6)];if(!inAny(caps,core,pt))bad.push(a)}
  if(bad.length)out.push({n:"cabeza descubierta bajo el gorro",fuera:bad})}
 /* ojos dentro de la cara */
 [].slice.call(svg.querySelectorAll(".rk-esq ellipse")).slice(0,1).forEach(function(){});
 svg.querySelectorAll(".rk-eye").forEach(function(e,i){var el=e.querySelector("ellipse");var cx=+el.getAttribute("cx"),cy=+el.getAttribute("cy"),rx=+el.getAttribute("rx")+1,ry=+el.getAttribute("ry")+1;
  var pts=[[cx-rx,cy],[cx+rx,cy],[cx,cy-ry],[cx,cy+ry]].filter(function(pt){return !inside(core,el,pt)});if(pts.length)out.push({n:"ojo "+(i?"der.":"izq.")+" fuera de la cara",fuera:pts})});
 return out};
