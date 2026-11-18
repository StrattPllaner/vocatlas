/* ================= símbolos de las carreras (propuestas para validar en #art) =================
   Un objeto protagonista por carrera, sin escenario. Vista frontal con un ligero tres cuartos: la silueta se dibuja primero
   y el volumen sale de tres tonos (un fondo oscuro desplazado abajo a la derecha, el tono base y una luz arriba a la
   izquierda recortada a la silueta), con contorno del mismo color oscurecido y esquinas redondeadas. Cada carrera tiene
   dos propuestas; la elegida se guarda en el dispositivo (vocatlas_simbolos). Todavía no se usan en la app. */
var SIMB=(function(){
 /* ---------- ayudas para escribir contornos en una caja de 100 × 100 ---------- */
 function rr(x,y,w,h,r){r=Math.min(r,w/2,h/2);return "M"+(x+r)+" "+y+"h"+(w-2*r)+"a"+r+" "+r+" 0 0 1 "+r+" "+r+"v"+(h-2*r)+"a"+r+" "+r+" 0 0 1 "+(-r)+" "+r+"h"+(-(w-2*r))+"a"+r+" "+r+" 0 0 1 "+(-r)+" "+(-r)+"v"+(-(h-2*r))+"a"+r+" "+r+" 0 0 1 "+r+" "+(-r)+"z"}
 function ci(cx,cy,r){return "M"+(cx-r)+" "+cy+"a"+r+" "+r+" 0 1 0 "+2*r+" 0a"+r+" "+r+" 0 1 0 "+(-2*r)+" 0z"}
 function el(cx,cy,rx,ry){return "M"+(cx-rx)+" "+cy+"a"+rx+" "+ry+" 0 1 0 "+2*rx+" 0a"+rx+" "+ry+" 0 1 0 "+(-2*rx)+" 0z"}
 function pg(p){return "M"+p.map(function(q){return q[0]+" "+q[1]}).join("L")+"Z"}
 function star(cx,cy,R,r,n){var o=[];n=n||5;for(var i=0;i<n*2;i++){var a=-Math.PI/2+i*Math.PI/n,k=i%2?r:R;o.push([+(cx+Math.cos(a)*k).toFixed(1),+(cy+Math.sin(a)*k).toFixed(1)])}return pg(o)}
 function gear(cx,cy,R,r,n){var o=[];for(var i=0;i<n*4;i++){var a=i/(n*4)*Math.PI*2,k=(Math.floor(i/2)%2)?r:R;o.push([+(cx+Math.cos(a)*k).toFixed(1),+(cy+Math.sin(a)*k).toFixed(1)])}return pg(o)}
 /* piezas: {d} contorno relleno · {l,w} trazo grueso que también es silueta · {x,c,w} detalle encima (c: w blanco, d oscuro, l luz) · t: transformación */
 var D=function(d,t){return {d:d,t:t}},L=function(l,w,t){return {l:l,w:w,t:t}},X=function(x,c,w,t){return {x:x,c:c||"w",w:w,t:t}};

 var AREAC={salud:"#3E9E78",ing:"#E2683E",tec:"#3F7DB0",neg:"#C9922E",arte:"#9C6CB5"};
 var S={
  /* ---------- salud ---------- */
  medicina:{n:"Estetoscopio|Maletín médico",a:[L("M30 14v26a20 20 0 0 0 40 0V14",7),L("M50 60v10a14 14 0 0 0 14 14",7),D(ci(70,82,11)),D(ci(30,13,6)),D(ci(70,13,6)),X(ci(70,82,5),"w")],
   b:[D(rr(10,32,80,54,10)),L("M36 32v-9h28v9",7),X(pg([[45,42],[55,42],[55,52],[65,52],[65,62],[55,62],[55,72],[45,72],[45,62],[35,62],[35,52],[45,52]]),"w")]},
  enfermeria:{n:"Cofia|Jeringa",a:[D("M12 66Q12 30 50 24Q88 30 88 66L80 74H20Z"),X(pg([[45,38],[55,38],[55,46],[63,46],[63,56],[55,56],[55,64],[45,64],[45,56],[37,56],[37,46],[45,46]]),"w"),X("M20 66H80",'d',3)],
   b:[D(rr(36,24,28,50,6),"rotate(-40 50 50)"),D(rr(28,16,44,8,4),"rotate(-40 50 50)"),L("M50 74v18",4,"rotate(-40 50 50)"),L("M50 16V6",6,"rotate(-40 50 50)"),X("M40 34h10M40 44h10M40 54h10",'w',3,"rotate(-40 50 50)")]},
  odontologia:{n:"Muela|Cepillo dental",a:[D("M22 24Q22 8 38 10Q50 18 62 10Q78 8 78 24Q80 50 70 66Q66 90 58 90Q53 90 52 72Q50 66 48 72Q47 90 42 90Q34 90 30 66Q20 50 22 24Z"),X("M34 22Q40 18 44 24",'w',3)],
   b:[D(rr(34,52,60,12,6),"rotate(-30 50 50)"),D(rr(6,48,34,20,6),"rotate(-30 50 50)"),D(rr(8,30,30,18,4),"rotate(-30 50 50)"),X("M14 32v14M22 32v14M30 32v14",'d',2.5,"rotate(-30 50 50)")]},
  nutricion:{n:"Manzana|Plato y cubiertos",a:[D("M50 30C30 16 8 34 18 60C24 82 40 92 50 84C60 92 76 82 82 60C92 34 70 16 50 30Z"),L("M50 30Q50 18 56 12",4),X(el(66,18,9,5),"l",0,"rotate(-30 66 18)")],
   b:[D(ci(50,52,30)),X(ci(50,52,19),"l"),L("M10 22v60M6 22v14q4 6 8 0V22",4),L("M90 22v60",6)]},
  psicologia:{n:"Cabeza con cerebro|Cerebro",a:[D("M30 90V72C18 66 14 52 16 40C18 20 34 10 52 10C72 10 86 24 86 42C86 48 90 54 92 58C93 61 91 62 88 62H86V72C86 78 80 81 74 79L66 77V90Z"),X("M30 40C28 30 36 22 46 24C50 18 62 18 64 26C72 26 76 34 72 40C76 48 68 54 62 50C58 56 46 56 44 50C36 54 28 48 30 40Z","l"),X("M46 28V50M38 36Q46 40 54 34",'d',2)],
   b:[D("M22 52C10 46 14 28 28 28C30 16 46 12 52 22C58 12 76 16 76 28C90 28 92 46 80 52C88 62 78 78 66 72C60 84 40 84 34 72C22 78 12 62 22 52Z"),X("M50 22V78",'d',3),X("M30 44Q38 40 40 48M62 40Q70 44 68 52M36 62Q44 58 44 66M58 60Q66 64 62 70",'d',2.5)]},
  veterinaria:{n:"Huella con cruz|Hueso",a:[D(el(50,64,24,20)),D(el(20,40,9,12)),D(el(38,24,9,12)),D(el(62,24,9,12)),D(el(80,40,9,12)),X(pg([[46,52],[54,52],[54,60],[62,60],[62,68],[54,68],[54,76],[46,76],[46,68],[38,68],[38,60],[46,60]]),"w")],
   b:[D(rr(24,40,52,20,6),"rotate(-30 50 50)"),D(ci(22,36,10),"rotate(-30 50 50)"),D(ci(22,64,10),"rotate(-30 50 50)"),D(ci(78,36,10),"rotate(-30 50 50)"),D(ci(78,64,10),"rotate(-30 50 50)")]},
  fisioterapia:{n:"Brazo flexionado|Mancuerna",a:[D("M14 86V66C14 54 24 50 32 52L46 56C46 42 50 28 58 20C64 14 74 16 74 24C74 32 66 36 64 46C78 40 92 50 88 66C84 82 68 88 52 86Z"),X("M56 58Q68 54 76 62",'d',3)],
   b:[D(rr(8,30,16,40,5)),D(rr(76,30,16,40,5)),D(rr(20,40,8,20,3)),D(rr(72,40,8,20,3)),D(rr(26,45,48,10,4))]},
  qfb:{n:"Cápsula|Frasco de medicina",a:[D(rr(14,36,72,28,14),"rotate(-35 50 50)"),X("M50 36V64",'d',3,"rotate(-35 50 50)"),X(rr(50,37.5,34.5,25,12.5),'l',0,"rotate(-35 50 50)")],
   b:[D(rr(24,30,52,58,10)),D(rr(30,14,40,16,5)),X(rr(30,46,40,26,4),"w"),X(pg([[46,50],[54,50],[54,55],[59,55],[59,63],[54,63],[54,68],[46,68],[46,63],[41,63],[41,55],[46,55]]),"d")]},
  educfisica:{n:"Silbato|Balón",a:[D("M14 46C14 34 22 28 34 28H86V48H64C64 64 52 76 38 76C24 76 14 62 14 46Z"),D(rr(70,22,16,10,4)),X(ci(36,52,8),"d"),L("M10 30Q4 20 12 14",3)],
   b:[D(ci(50,50,38)),X(pg([[50,34],[64,44],[58,60],[42,60],[36,44]]),"d"),X("M50 34V14M64 44l16-6M58 60l10 16M42 60l-10 16M36 44l-16-6",'d',3)]},
  biomedica:{n:"Corazón con pulso|Monitor de signos",a:[D("M50 86C20 66 8 50 10 34C12 18 30 10 42 18C46 21 48 24 50 28C52 24 54 21 58 18C70 10 88 18 90 34C92 50 80 66 50 86Z"),X("M14 46H34L40 34L48 60L56 40L60 46H86",'w',4)],
   b:[D(rr(10,16,80,58,10)),D(rr(36,74,28,8,3)),D(rr(26,82,48,8,4)),X(rr(18,24,64,42,4),'d'),X("M22 46H38L44 34L52 58L58 42L62 46H78",'w',3)]},
  /* ---------- ingenierías ---------- */
  civil:{n:"Casco de obra|Puente",a:[D("M14 66Q14 24 50 20Q86 24 86 66Z"),D(rr(6,62,88,12,6)),X("M50 22V60",'d',4),X("M30 30Q26 40 28 56",'l',4)],
   b:[L("M10 70Q50 14 90 70",7),D(rr(4,60,92,12,4)),L("M30 60V44M50 60V36M70 60V44",4),D(rr(6,72,10,18,3)),D(rr(84,72,10,18,3))]},
  mecatronica:{n:"Brazo robótico|Engrane con circuito",a:[D(rr(14,78,40,12,4)),L("M34 78V54L64 30",11),D(ci(34,54,9)),D(ci(64,30,9)),L("M70 26L82 16M70 34L84 38",6),X(ci(34,54,4),'d'),X(ci(64,30,4),'d')],
   b:[D(gear(50,50,42,34,8)),X(rr(34,34,32,32,4),'d'),X("M42 42h16v16H42z",'w',2.5),X("M50 30v8M50 62v8M30 50h8M62 50h8",'w',2.5)]},
  aeroespacial:{n:"Cohete|Avión",a:[D("M50 6C66 18 70 40 68 62H32C30 40 34 18 50 6Z"),D(pg([[32,52],[18,72],[18,84],[32,72]])),D(pg([[68,52],[82,72],[82,84],[68,72]])),D(rr(38,62,24,10,3)),X(ci(50,34,8),"l"),X("M42 76L46 92M58 76L54 92",'d',4)],
   b:[D("M8 50C8 44 14 42 22 42H70L86 30H94L86 46V54L94 70H86L70 58H22C14 58 8 56 8 50Z"),D(pg([[40,46],[56,14],[66,14],[58,46]])),D(pg([[40,54],[56,86],[66,86],[58,54]])),X("M24 48h8M36 48h8",'w',4)]},
  ambiental:{n:"Hoja con gota|Aerogenerador",a:[D("M18 82C14 50 30 18 84 14C86 60 62 86 18 82Z"),X("M22 78Q46 56 70 28",'d',3.5),X("M66 64C66 56 72 50 72 50C72 50 78 56 78 64C78 68 75 71 72 71C69 71 66 68 66 64Z","w")],
   b:[D(pg([[46,40],[54,40],[58,92],[42,92]])),D(ci(50,38,7)),D(rr(46,4,8,32,4)),D(rr(46,4,8,34,4),"rotate(120 50 38)"),D(rr(46,4,8,34,4),"rotate(240 50 38)"),X(ci(50,38,3),'d')]},
  industrial:{n:"Engrane con flecha|Fábrica",a:[D(gear(48,52,36,28,8)),X(ci(48,52,12),'d'),L("M80 30A40 40 0 0 0 30 14",5),D(pg([[22,8],[34,22],[38,6]]))],
   b:[D("M6 90V48L28 60V48L50 60V48L72 60V20H86V90Z"),X(rr(16,68,12,10,2),'l'),X(rr(38,68,12,10,2),'l'),X(rr(60,68,12,10,2),'l'),X("M76 10Q80 4 86 6",'d',3)]},
  mecanica:{n:"Llave inglesa|Tuerca",a:[D("M24 10C12 14 8 28 14 38L48 72C52 84 64 94 78 90L68 80L72 70L82 74L92 84C96 70 86 56 72 52L38 18C34 10 30 8 24 10Z"),X("M28 26L64 62",'l',4)],
   b:[D(pg([[50,8],[86,29],[86,71],[50,92],[14,71],[14,29]])),X(ci(50,50,16),'d'),X("M30 32L50 20",'l',4)]},
  electrica:{n:"Rayo|Clavija",a:[D(pg([[58,4],[20,54],[46,54],[36,96],[82,40],[54,40],[66,4]])),X("M54 12L32 48",'l',3)],
   b:[D(rr(22,38,56,40,12)),D(rr(34,10,8,30,3)),D(rr(58,10,8,30,3)),L("M50 78v16",8),X("M30 50h40",'l',4)]},
  electronica:{n:"Chip|Placa de circuito",a:[D(rr(24,24,52,52,8)),L("M34 24V10M50 24V10M66 24V10M34 76V90M50 76V90M66 76V90M24 34H10M24 50H10M24 66H10M76 34H90M76 50H90M76 66H90",5),X(rr(36,36,28,28,4),'d'),X(ci(44,44,3),'w')],
   b:[D(rr(10,14,80,72,10)),X("M24 30H48V50H70M24 70H40V50M60 30V40",'d',4),X(ci(48,30,5),'w'),X(ci(70,50,5),'w'),X(ci(40,70,5),'w'),X(ci(60,40,5),'w')]},
  quimicaing:{n:"Matraz con engrane|Torre de destilación",a:[D("M40 8H60V36L84 82C86 88 82 92 76 92H24C18 92 14 88 16 82L40 36Z"),X("M28 66H72L80 82C81 85 79 86 76 86H24C21 86 19 85 20 82Z",'l'),D(gear(72,22,16,12,6)),X(ci(72,22,5),'d')],
   b:[D(rr(36,6,28,86,12)),D(rr(14,30,22,8,3)),D(rr(64,52,22,8,3)),X("M40 30h20M40 46h20M40 62h20",'d',3),X(ci(50,80,5),'w')]},
  /* ---------- tecnología y ciencias ---------- */
  computacion:{n:"Código en pantalla|Laptop",a:[D(rr(8,14,84,60,10)),D(rr(40,74,20,10,2)),D(rr(28,84,44,8,4)),X(rr(16,22,68,44,4),'d'),X("M38 32L28 44L38 56M62 32L72 44L62 56M54 30L46 58",'w',4)],
   b:[D(rr(18,18,64,46,8)),D("M6 70H94L88 84H12Z"),X(rr(24,24,52,34,3),'d'),X("M36 34l-6 7 6 7M64 34l6 7-6 7",'w',3)]},
  datos:{n:"Gráfica con lupa|Gráfica de pastel",a:[D(rr(8,52,16,38,4)),D(rr(30,34,16,56,4)),D(rr(52,44,16,46,4)),L("M78 58L92 72",8),D(ci(68,46,18)),X(ci(68,46,11),'w')],
   b:[D(ci(46,54,38)),D("M56 8A38 38 0 0 1 92 44H56Z"),X("M46 54L46 16M46 54L82 64",'d',3.5)]},
  biotec:{n:"ADN|Tubo con hoja",a:[L("M32 8C32 30 68 34 68 50C68 66 32 70 32 92",8),L("M68 8C68 30 32 34 32 50C32 66 68 70 68 92",8),X("M38 18H62M42 30H58M42 70H58M38 82H62",'w',3.5)],
   b:[D(rr(36,6,28,88,14)),X(rr(40,52,20,38,10),'l'),X("M50 48C40 40 40 28 50 20C60 28 60 40 50 48Z","w"),X("M50 48V28",'d',2)]},
  fisica:{n:"Átomo|Imán",a:[L(el(50,50,42,16),5),L(el(50,50,42,16),5,"rotate(60 50 50)"),L(el(50,50,42,16),5,"rotate(-60 50 50)"),D(ci(50,50,10))],
   b:[D("M14 14H38V54C38 62 44 68 50 68C56 68 62 62 62 54V14H86V54C86 76 70 90 50 90C30 90 14 76 14 54Z"),X(rr(14,14,24,14,2),'w'),X(rr(62,14,24,14,2),'w')]},
  ia:{n:"Cabeza de robot|Cerebro de circuito",a:[D(rr(16,26,68,58,16)),L("M50 26V12",5),D(ci(50,10,6)),D(rr(6,46,10,18,4)),D(rr(84,46,10,18,4)),X(ci(36,50,8),'w'),X(ci(64,50,8),'w'),X("M36 70h28",'d',5)],
   b:[D("M22 52C10 46 14 28 28 28C30 16 46 12 52 22C58 12 76 16 76 28C90 28 92 46 80 52C88 62 78 78 66 72C60 84 40 84 34 72C22 78 12 62 22 52Z"),X("M30 50H44V36M56 64V50H72M50 22V40",'w',3.5),X(ci(44,36,4),'d'),X(ci(72,50,4),'d'),X(ci(56,64,4),'d')]},
  ciberseguridad:{n:"Escudo con candado|Candado",a:[D("M50 6L86 18V46C86 70 70 86 50 94C30 86 14 70 14 46V18Z"),X(rr(36,46,28,24,4),'w'),X("M40 46V38C40 26 60 26 60 38V46",'w',4),X(ci(50,58,4),'d')],
   b:[D(rr(18,42,64,50,10)),L("M32 44V32C32 6 68 6 68 32V44",8),X(ci(50,62,7),'d'),X("M50 66v12",'d',5)]},
  quimica:{n:"Molécula|Probeta",a:[L("M30 66L50 30L72 64M30 66H72",6),D(ci(50,28,15)),D(ci(28,68,13)),D(ci(74,66,13)),X(ci(46,24,4),'w')],
   b:[D("M34 6H66V12H60V78C60 88 54 94 50 94C46 94 40 88 40 78V12H34Z"),X("M40 54H60V78C60 84 56 88 50 88C44 88 40 84 40 78Z",'l'),X("M42 26h8M42 38h8",'d',3)]},
  biologia:{n:"Microscopio|Célula",a:[D(rr(20,82,62,10,4)),D(rr(22,66,40,8,3)),L("M70 82V52C70 40 62 32 52 32",8),D(rr(28,8,18,40,5),"rotate(-25 37 28)"),D(rr(30,48,14,10,3),"rotate(-25 37 28)"),X(ci(70,60,5),'w')],
   b:[D("M50 8C76 8 92 26 90 50C88 76 70 92 48 90C22 88 8 70 10 48C12 24 26 8 50 8Z"),X(ci(56,46,14),'d'),X(ci(52,42,4),'w'),X(el(28,62,7,4),'l'),X(el(70,74,6,3),'l'),X(el(30,30,5,3),'l')]},
  matematicas:{n:"Pi|Signos de operaciones",a:[D(rr(10,16,80,14,7)),D("M28 30H42V76C42 84 36 90 26 88V76C28 76 28 74 28 72Z"),D("M58 30H72V70C72 76 76 78 82 76V88C70 94 58 88 58 74Z")],
   b:[D(rr(8,8,84,84,16)),X("M30 22v20M20 32h20M60 32h20M22 62l16 16M38 62L22 78M60 64h20M60 76h20",'w',5)]},
  /* ---------- negocios y sociedad ---------- */
  derecho:{n:"Balanza|Mazo",a:[D(rr(28,84,44,8,4)),L("M50 84V14",6),D(ci(50,12,6)),L("M14 26H86",6),L("M20 26L10 56M20 26L30 56M80 26L70 56M80 26L90 56",2.5),D("M6 56H34C34 66 28 72 20 72C12 72 6 66 6 56Z"),D("M66 56H94C94 66 88 72 80 72C72 72 66 66 66 56Z")],
   b:[D(rr(10,22,50,26,10),"rotate(-35 35 35)"),L("M44 46L86 88",8),D(rr(52,78,40,12,5))]},
  negocios:{n:"Portafolio|Corbata",a:[D(rr(8,30,84,58,10)),L("M36 30V20H64V30",7),X("M8 54H92",'d',3),X(rr(44,48,12,12,3),"l")],
   b:[D(pg([[38,8],[62,8],[58,22],[42,22]])),D(pg([[42,22],[58,22],[70,74],[50,94],[30,74]])),X("M46 40L62 56M44 58L64 76",'l',3)]},
  finanzas:{n:"Pila de monedas|Alcancía",a:[D(el(50,78,36,12)),D(rr(14,58,72,20,0)),D(el(50,58,36,12)),D(rr(14,38,72,20,0)),D(el(50,38,36,12)),X(el(50,38,24,7),'l'),X("M14 58Q50 72 86 58M14 78Q50 92 86 78",'d',3)],
   b:[D("M18 56C18 36 36 26 54 26C74 26 88 38 88 56C88 68 82 76 74 80V90H62V84H44V90H32V80C24 76 18 68 18 56Z"),D(el(14,56,6,8)),D(pg([[60,26],[66,12],[74,26]])),X(rr(44,30,18,5,2),'d'),X(ci(70,46,3),'d')]},
  educacion:{n:"Pizarrón|Birrete",a:[D(rr(8,12,84,60,8)),L("M30 72L22 92M70 72L78 92",5),X(rr(16,20,68,44,4),'d'),X("M24 32h24M24 44h36",'w',4),X(ci(70,32,5),'w')],
   b:[D(pg([[50,14],[94,34],[50,54],[6,34]])),D("M24 44V64C24 72 36 78 50 78C64 78 76 72 76 64V44L50 56Z"),L("M88 38V66",3),D(ci(88,70,5))]},
  contaduria:{n:"Calculadora|Recibo",a:[D(rr(20,8,60,84,12)),X(rr(28,16,44,18,4),'d'),X(ci(36,48,5),'w'),X(ci(50,48,5),'w'),X(ci(64,48,5),'w'),X(ci(36,62,5),'w'),X(ci(50,62,5),'w'),X(ci(64,62,5),'w'),X(ci(36,76,5),'w'),X(ci(50,76,5),'w'),X(rr(59,71,10,10,3),'l')],
   b:[D("M20 8H80V92L72 86L64 92L56 86L48 92L40 86L32 92L26 86L20 92Z"),X("M30 24h40M30 36h40M30 48h26M30 64h40",'w',4)]},
  economia:{n:"Gráfica con flecha|Billete",a:[L("M10 82L36 56L52 68L82 30",9),D(pg([[68,24],[90,20],[86,42]])),X(ci(28,30,12),'l'),X("M28 24v12",'d',3)],
   b:[D(rr(6,24,88,52,8)),X(ci(50,50,14),'l'),X(rr(14,32,72,36,4),'w',2.5),X("M50 42v16",'d',4)]},
  actuaria:{n:"Dado|Campana de Gauss",a:[D(rr(14,14,72,72,14)),X(ci(32,32,6),'w'),X(ci(68,32,6),'w'),X(ci(50,50,6),'w'),X(ci(32,68,6),'w'),X(ci(68,68,6),'w')],
   b:[D("M6 86C24 86 30 20 50 20C70 20 76 86 94 86Z"),X("M50 24V84",'w',3),X("M30 60V84M70 60V84",'d',2.5)]},
  mercadotecnia:{n:"Megáfono|Etiqueta de precio",a:[D(pg([[14,38],[34,38],[80,14],[80,86],[34,62],[14,62]])),D(rr(26,62,14,24,4)),X("M86 40Q94 50 86 60",'d',4)],
   b:[D(pg([[8,40],[40,8],[90,8],[90,58],[58,90]])),X(ci(72,26,7),'w'),X("M40 54l14-14",'l',4)]},
  comext:{n:"Barco con contenedores|Contenedor",a:[D("M6 58H94L82 84H18Z"),D(rr(20,36,20,22,2)),D(rr(42,36,20,22,2)),D(rr(42,20,20,16,2)),D(rr(64,36,16,22,2)),X("M6 66H94",'w',3)],
   b:[D(rr(8,24,84,52,6)),X("M22 32v36M36 32v36M50 32v36M64 32v36M78 32v36",'d',3.5)]},
  turismo:{n:"Maleta|Palmera",a:[D(rr(16,26,68,62,10)),L("M38 26V16H62V26",6),X("M34 26V88M66 26V88",'d',4),D(ci(28,92,4)),D(ci(72,92,4))],
   b:[L("M50 92C50 70 52 50 58 36",8),D("M58 36C46 22 26 22 14 30C30 30 44 32 58 36Z"),D("M58 36C64 20 80 12 94 16C80 24 68 30 58 36Z"),D("M58 36C70 30 86 36 92 50C78 44 66 40 58 36Z"),D("M58 36C48 30 36 34 26 48C38 42 48 38 58 36Z"),D(el(50,92,24,5))]},
  politicas:{n:"Edificio de gobierno|Urna de votación",a:[D(rr(8,82,84,10,3)),D(rr(14,46,72,8,3)),D("M24 46C24 28 36 18 50 18C64 18 76 28 76 46Z"),L("M50 18V6",3),D(rr(18,54,8,28,2)),D(rr(36,54,8,28,2)),D(rr(56,54,8,28,2)),D(rr(74,54,8,28,2))],
   b:[D(rr(14,40,72,52,8)),X(rr(30,48,40,6,3),'d'),D(rr(34,10,32,36,4),"rotate(8 50 28)"),X("M42 22l6 6 10-12",'d',4,"rotate(8 50 28)")]},
  rrii:{n:"Globo con bandera|Dos banderas",a:[D(ci(44,56,34)),X("M18 44Q30 52 26 64Q34 72 40 64Q50 60 46 48Q40 40 30 40Z",'l'),X("M54 30Q64 36 70 46Q60 52 58 44Q52 40 54 30Z",'l'),L("M74 30V6",4),D(pg([[76,6],[96,12],[76,20]]))],
   b:[L("M20 92V10M80 92V10",5),D(pg([[22,12],[52,18],[44,28],[52,38],[22,44]])),D(pg([[78,12],[48,18],[56,28],[48,38],[78,44]]))]},
  sociologia:{n:"Grupo de personas|Burbujas de diálogo",a:[D(ci(50,26,13)),D("M28 70C28 54 38 44 50 44C62 44 72 54 72 70Z"),D(ci(20,40,10)),D("M4 78C4 64 12 56 20 56C26 56 30 58 32 62V78Z"),D(ci(80,40,10)),D("M96 78C96 64 88 56 80 56C74 56 70 58 68 62V78Z")],
   b:[D("M6 18C6 12 10 8 16 8H56C62 8 66 12 66 18V42C66 48 62 52 56 52H28L16 62V52C10 52 6 48 6 42Z"),D("M94 44C94 38 90 34 84 34H50C44 34 40 38 40 44V66C40 72 44 76 50 76H72L84 88V76C90 76 94 72 94 66Z"),X("M18 24h36M18 36h24",'w',4)]},
  trabajosocial:{n:"Manos con corazón|Casa con corazón",a:[D("M6 70C16 70 24 74 30 82H70C76 74 84 70 94 70V90H6Z"),D("M50 64C30 50 22 40 24 30C26 20 38 16 44 22L50 28L56 22C62 16 74 20 76 30C78 40 70 50 50 64Z"),X("M34 26Q30 30 32 36",'l',3)],
   b:[D(pg([[50,8],[92,44],[82,44],[82,90],[18,90],[18,44],[8,44]])),X("M50 76C38 68 32 62 34 54C36 48 44 46 48 52L50 54L52 52C56 46 64 48 66 54C68 62 62 68 50 76Z","w")]},
  criminologia:{n:"Lupa con huella|Placa",a:[L("M62 62L88 88",10),D(ci(40,40,32)),X(ci(40,40,24),'w'),X("M30 30Q40 22 50 30M26 40Q40 28 54 40M28 50Q40 40 52 50M34 58Q40 54 46 58",'d',2.5)],
   b:[D(star(50,50,44,30,7)),X(ci(50,50,18),'l'),X(star(50,50,12,6,5),'d')]},
  /* ---------- arte y comunicación ---------- */
  arquitectura:{n:"Compás sobre plano|Casa con plano",a:[D(rr(22,58,76,32,4),"skewX(-14)"),X("M38 66h40M38 76h24",'w',2.5,"skewX(-14)"),L("M50 14L30 78M50 14L72 78",6),D(ci(50,14,7)),X("M38 52H62",'d',3)],
   b:[D(pg([[50,6],[88,38],[80,38],[80,70],[20,70],[20,38],[12,38]])),D(rr(6,74,88,18,3)),X(rr(42,46,16,24,2),"w"),X("M14 80h30M14 86h50",'w',2.5)]},
  moda:{n:"Vestido en gancho|Tijeras",a:[L("M50 18V10Q50 4 56 6",4),L("M50 18L20 30H80Z",3),D("M38 30H62L64 46L84 90H16L36 46Z"),X("M38 46H62",'d',3)],
   b:[D(ci(26,72,14)),D(ci(74,72,14)),X(ci(26,72,7),'w'),X(ci(74,72,7),'w'),L("M34 62L70 8M66 62L30 8",9),D(ci(50,40,4))]},
  comunicacion:{n:"Micrófono|Periódico",a:[D(rr(32,8,36,52,18)),L("M22 46C22 64 34 72 50 72C66 72 78 64 78 46",5),L("M50 72V86",5),D(rr(30,84,40,8,4)),X("M40 22h20M40 32h20M40 42h20",'d',3)],
   b:[D(rr(10,14,80,72,6)),X(rr(18,22,30,24,2),'l'),X("M54 24h28M54 34h28M54 44h20M18 56h64M18 66h64M18 76h44",'w',3.5)]},
  cine:{n:"Claqueta|Cámara de cine",a:[D(rr(10,40,80,50,6)),D(pg([[10,22],[86,8],[90,26],[14,40]])),X("M24 20L32 36M44 16L52 32M64 12L72 28",'w',6),X("M20 58h60M20 72h40",'w',3)],
   b:[D(ci(30,26,16)),D(ci(64,22,14)),D(rr(10,42,62,40,8)),D(pg([[72,52],[94,40],[94,84],[72,72]])),X(ci(30,26,6),'d'),X(ci(64,22,5),'d')]},
  grafico:{n:"Pluma vectorial|Pincel",a:[D("M50 6L80 46L58 92H42L20 46Z"),X(ci(50,52,7),'w'),X("M50 10V44",'w',3),X(rr(40,84,20,10,2),'d')],
   b:[D(rr(44,4,12,52,6),"rotate(35 50 50)"),D(rr(41,54,18,12,3),"rotate(35 50 50)"),D("M41 66H59C60 80 54 92 50 96C46 92 40 80 41 66Z","rotate(35 50 50)"),X("M44 70C46 80 48 86 50 90",'l',3,"rotate(35 50 50)")]},
  disindustrial:{n:"Silla|Lámpara de escritorio",a:[D(rr(28,6,44,44,10)),D(pg([[16,50],[84,50],[92,64],[8,64]])),L("M14 64L12 92M86 64L88 92",6),L("M30 64V84M70 64V84",5),X("M38 18h24",'l',4)],
   b:[D(el(50,88,30,6)),L("M50 86L36 54L62 28",6),D(ci(36,54,5)),D(pg([[56,14],[84,28],[74,48],[48,30]])),X(ci(62,28,4),'d')]},
  animacion:{n:"Pelota rebotando|Folioscopio",a:[D(rr(6,14,88,70,10)),X(rr(14,22,72,54,4),'d'),X(ci(30,36,6),'l'),X(ci(50,62,7),'l'),X(ci(72,40,8),'w'),X("M18 70H82",'w',2)],
   b:[D(rr(10,36,64,52,6),"rotate(-14 42 62)"),D(rr(18,26,64,52,6),"rotate(-6 50 52)"),D(rr(26,18,64,52,6)),X(ci(58,40,10),'w'),X("M40 58h36",'w',3)]},
  gastronomia:{n:"Gorro de chef|Sartén",a:[D("M24 64C10 62 6 40 20 34C20 18 40 12 50 22C60 12 80 18 80 34C94 40 90 62 76 64Z"),D(rr(24,62,52,24,4)),X("M38 66V84M50 66V84M62 66V84",'d',3)],
   b:[D(ci(40,56,32)),L("M70 46L94 30",9),X(ci(40,56,22),'d'),X(el(34,52,8,5),'w')]},
  cine_:null
 };
 delete S.cine_;
 /* las carreras de la app sin propuesta propia aún (no debería quedar ninguna) */
 function list(){return C.filter(function(c){return S[c.id]})}

 /* ---------- dibujo: fondo oscuro desplazado, base con contorno, luz recortada arriba a la izquierda y detalles ---------- */
 function tones(c){return {b:c,d:ISO.shade(c,.42),k:ISO.shade(c,.3),l:ISO.tint(c,.5),w:"#FFFFFF"}}
 function partsOf(id,v){var s=S[id];return s?(s[v]||s.a):null}
 function draw(id,v,col,silo){var P=partsOf(id,v);if(!P)return "";var T=tones(col),cid="sc-"+id+"-"+v+(silo?"-n":""),g="",sil=P.filter(function(p){return p.d||p.l});
  var tr=function(p){return p.t?' transform="'+p.t+'"':''};
  var shape=function(p,fill,stroke,sw){return p.d?'<path d="'+p.d+'"'+tr(p)+' fill="'+fill+'"'+(stroke?' stroke="'+stroke+'" stroke-width="'+sw+'" stroke-linejoin="round"':'')+'/>':'<path d="'+p.l+'"'+tr(p)+' fill="none" stroke="'+fill+'" stroke-width="'+(p.w+(sw||0))+'" stroke-linecap="round" stroke-linejoin="round"/>'};
  if(silo)return sil.map(function(p){return shape(p,"#111")}).join("");
  /* 1) volumen: la silueta en el tono oscuro, desplazada abajo a la derecha */
  g+='<g transform="translate(3.5 3.5)">'+sil.map(function(p){return shape(p,T.k,p.d?T.k:null,p.d?4:4)}).join("")+'</g>';
  /* 2) contorno: la silueta un poco más gruesa en el tono más oscuro */
  g+=sil.map(function(p){return shape(p,T.d,p.d?T.d:null,5)}).join("");
  /* 3) base */
  g+=sil.map(function(p){return shape(p,T.b)}).join("");
  /* 4) luz arriba a la izquierda, recortada a la silueta */
  g+='<clipPath id="'+cid+'">'+sil.map(function(p){return p.d?'<path d="'+p.d+'"'+tr(p)+'/>':''}).join("")+'</clipPath>';
  g+='<path d="M-20 -20H62Q40 30 -20 60Z" fill="'+T.l+'" opacity=".55" clip-path="url(#'+cid+')"/>';
  sil.forEach(function(p){if(p.l)g+='<path d="'+p.l+'"'+tr(p)+' fill="none" stroke="'+T.l+'" stroke-width="'+(p.w*.3)+'" stroke-linecap="round" opacity=".7" transform="translate(-'+(p.w*.18)+' -'+(p.w*.18)+')'+(p.t?" "+p.t:"")+'"/>'});
  /* 5) detalles */
  P.forEach(function(p){if(!p.x)return;var c=T[p.c]||p.c;g+=p.w?'<path d="'+p.x+'"'+tr(p)+' fill="none" stroke="'+c+'" stroke-width="'+p.w+'" stroke-linecap="round" stroke-linejoin="round"/>':'<path d="'+p.x+'"'+tr(p)+' fill="'+c+'"/>'});
  return g}
 function icon(id,v,size,o){o=o||{};var c=byId[id]||{area:"neg"},col=o.col||AREAC[c.area]||"#3F7DA6";
  return '<svg class="sy" width="'+size+'" height="'+size+'" viewBox="-6 -6 114 114" aria-hidden="true">'+draw(id,v,col,o.silo)+'</svg>'}
 /* elección guardada en el dispositivo; mientras no elijas, la primera */
 var PICK={};try{PICK=JSON.parse(localStorage.getItem("vocatlas_simbolos")||"{}")||{}}catch(e){}
 function pick(id,v){if(v){PICK[id]=v;try{localStorage.setItem("vocatlas_simbolos",JSON.stringify(PICK))}catch(e){}}return PICK[id]||"a"}
 function names(id){var s=S[id];return s?s.n.split("|"):[]}
 return {icon:icon,pick:pick,names:names,list:list,has:function(id){return !!S[id]},AREAC:AREAC,variants:function(id){var s=S[id];return s?["a","b"].filter(function(v){return s[v]}):[]}};
})();
