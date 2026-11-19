/* ================= símbolos de las carreras =================
   Seis por carrera, uno por unidad de su espiral. Cada objeto con sus colores reales (el metal plateado, la madera café,
   la manzana roja…) y con aspecto 3D: cada pieza lleva un degradado de luz (claro arriba a la izquierda, oscuro abajo a la
   derecha), su grosor visible desplazado abajo a la derecha, un contorno delgado de su mismo color oscurecido y un brillo
   suave. Vista frontal, sin escenario. Se revisan en #art. */
var SIMB=(function(){
 function rr(x,y,w,h,r){r=Math.min(r,w/2,h/2);return "M"+(x+r)+" "+y+"h"+(w-2*r)+"a"+r+" "+r+" 0 0 1 "+r+" "+r+"v"+(h-2*r)+"a"+r+" "+r+" 0 0 1 "+(-r)+" "+r+"h"+(-(w-2*r))+"a"+r+" "+r+" 0 0 1 "+(-r)+" "+(-r)+"v"+(-(h-2*r))+"a"+r+" "+r+" 0 0 1 "+r+" "+(-r)+"z"}
 function ci(cx,cy,r){return "M"+(cx-r)+" "+cy+"a"+r+" "+r+" 0 1 0 "+2*r+" 0a"+r+" "+r+" 0 1 0 "+(-2*r)+" 0z"}
 function el(cx,cy,rx,ry){return "M"+(cx-rx)+" "+cy+"a"+rx+" "+ry+" 0 1 0 "+2*rx+" 0a"+rx+" "+ry+" 0 1 0 "+(-2*rx)+" 0z"}
 function pg(p){return "M"+p.map(function(q){return q[0]+" "+q[1]}).join("L")+"Z"}
 function star(cx,cy,R,r,n){var o=[];n=n||5;for(var i=0;i<n*2;i++){var a=-Math.PI/2+i*Math.PI/n,k=i%2?r:R;o.push([+(cx+Math.cos(a)*k).toFixed(1),+(cy+Math.sin(a)*k).toFixed(1)])}return pg(o)}
 function gear(cx,cy,R,r,n){var o=[];for(var i=0;i<n*4;i++){var a=i/(n*4)*Math.PI*2,k=(Math.floor(i/2)%2)?r:R;o.push([+(cx+Math.cos(a)*k).toFixed(1),+(cy+Math.sin(a)*k).toFixed(1)])}return pg(o)}
 /* gota (dedo de huella): punta hacia el centro de la pata */
 function toe(cx,cy,rx,ry,a){return {d:"M"+cx+" "+(cy-ry)+"C"+(cx+rx*1.15)+" "+(cy-ry)+" "+(cx+rx)+" "+(cy+ry*.9)+" "+cx+" "+(cy+ry)+"C"+(cx-rx)+" "+(cy+ry*.9)+" "+(cx-rx*1.15)+" "+(cy-ry)+" "+cx+" "+(cy-ry)+"Z",t:"rotate("+a+" "+cx+" "+cy+")"}}
 var CRUZ=function(cx,cy,s){var a=s/3;return pg([[cx-a/2,cy-s/2],[cx+a/2,cy-s/2],[cx+a/2,cy-a/2],[cx+s/2,cy-a/2],[cx+s/2,cy+a/2],[cx+a/2,cy+a/2],[cx+a/2,cy+s/2],[cx-a/2,cy+s/2],[cx-a/2,cy+a/2],[cx-s/2,cy+a/2],[cx-s/2,cy-a/2],[cx-a/2,cy-a/2]])};
 /* piezas: D(contorno, color, transformación) · L(trazo, grosor, color, transformación) · X(detalle, color, grosor si es línea, transformación) */
 var D=function(d,c,t){return {d:d,c:c,t:t}},L=function(l,w,c,t){return {l:l,w:w,c:c,t:t}},X=function(x,c,w,t){return {x:x,c:c,w:w,t:t}};
 /* colores reales */
 var ST="#A9B6C2",GO="#E8B53C",WO="#B9804B",RE="#DE4A3C",WH="#F3F1EA",BK="#3A4048",BL="#3F82C4",GR="#4FAE5B",PA="#F4ECD9",GL="#AEE0F2",OR="#F08A2E",PU="#8E5BB5",PK="#F3A3B5",BR="#8A5A36",YE="#F6CD3B",TE="#2FA39A",NA="#2D4A6E",SK="#E7A97C",CR="#F0E2C2",CH="#2F5E45",GY="#8C96A0";
 var AREAC={salud:"#3E9E78",ing:"#E2683E",tec:"#3F7DB0",neg:"#C9922E",arte:"#9C6CB5"};
 var S={
  medicina:{n:"Estetoscopio|Maletín médico",a:[L("M30 14v26a20 20 0 0 0 40 0V14",7,BK),L("M50 60v10a14 14 0 0 0 14 14",7,BK),D(ci(70,82,12),ST),D(ci(30,12,6),ST),D(ci(70,12,6),ST),X(ci(70,82,6),"#D5DCE2")],
   b:[D(rr(10,32,80,54,10),RE),L("M36 32v-9h28v9",7,BK),X(CRUZ(50,59,28),WH)]},
  enfermeria:{n:"Cofia|Jeringa",a:[D("M12 66Q12 30 50 24Q88 30 88 66L80 74H20Z",WH),X(CRUZ(50,50,24),RE),X("M20 66H80","#C9CCC6",3)],
   b:[D(rr(36,24,28,50,6),GL,"rotate(-40 50 50)"),D(rr(28,16,44,8,4),ST,"rotate(-40 50 50)"),L("M50 74v18",4,ST,"rotate(-40 50 50)"),L("M50 16V6",6,ST,"rotate(-40 50 50)"),X(rr(40,44,20,26,3),"#E9677A",0,"rotate(-40 50 50)"),X("M40 34h10M40 44h10M40 54h10",BL,2.5,"rotate(-40 50 50)")]},
  odontologia:{n:"Muela|Cepillo dental",a:[D("M18 30C16 16 26 8 36 10C42 11 46 15 50 15C54 15 58 11 64 10C74 8 84 16 82 30C81 40 76 46 74 52C73 62 72 72 68 84C66 90 60 92 58 86C56 78 55 68 50 64C45 68 44 78 42 86C40 92 34 90 32 84C28 72 27 62 26 52C24 46 19 40 18 30Z","#FAF7F0"),X("M36 13Q42 24 50 21Q58 24 64 13",'#D9D2C2',2.5),X("M50 21V30",'#D9D2C2',2),X("M27 50Q50 58 73 50",'#E3DCCB',2),X("M24 22Q24 14 32 14",'#FFFFFF',4),X("M50 64Q52 74 56 84",'#E6DFCE',2)],
   b:[D(rr(34,52,60,12,6),BL,"rotate(-30 50 50)"),D(rr(6,48,34,18,6),BL,"rotate(-30 50 50)"),D(rr(8,24,30,24,3),WH,"rotate(-30 50 50)"),X("M12 26v20M17 26v20M22 26v20M27 26v20M32 26v20","#7FC8E8",2,"rotate(-30 50 50)"),X("M10 26H36","#4FA3D0",2.5,"rotate(-30 50 50)"),X("M40 56H88","#7FB2E3",2.5,"rotate(-30 50 50)")]},
  nutricion:{n:"Manzana|Plato y cubiertos",a:[D("M50 28C44 22 30 18 20 28C10 40 12 60 22 76C30 88 40 92 50 86C60 92 70 88 78 76C88 60 90 40 80 28C70 18 56 22 50 28Z",RE),L("M50 28Q49 18 55 9",4,BR),D("M56 16C62 6 76 6 82 12C76 20 64 22 56 16Z",GR),X("M58 15Q68 12 78 12","#2F7F3E",1.5),X("M24 38Q22 50 28 60",'#FF8A7A',4),X("M46 84Q50 88 54 84",'#8E2A22',2)],
   b:[D(ci(50,52,30),WH),X(ci(50,52,19),"#E6E1D6"),D(ci(44,50,7),GR),D(ci(56,56,6),RE),D(ci(52,44,5),YE),L("M10 22v60M6 22v14q4 6 8 0V22",4,ST),L("M90 22v60",6,ST)]},
  psicologia:{n:"Cabeza con cerebro|Cerebro",a:[D("M30 90V72C18 66 14 52 16 40C18 20 34 10 52 10C72 10 86 24 86 42C86 48 90 54 92 58C93 61 91 62 88 62H86V72C86 78 80 81 74 79L66 77V90Z",TE),D("M30 40C28 30 36 22 46 24C50 18 62 18 64 26C72 26 76 34 72 40C76 48 68 54 62 50C58 56 46 56 44 50C36 54 28 48 30 40Z",PK),X("M46 28V50M38 36Q46 40 54 34","#C9677F",2)],
   b:[D("M20 58C10 54 10 38 20 32C20 20 34 14 44 18C50 10 66 12 70 20C82 18 92 30 88 42C96 50 90 64 80 64C76 70 66 72 60 68L44 70C34 72 24 66 20 58Z",PK),D("M60 66C64 76 76 80 84 72C86 66 82 62 78 62Z","#E58AA0"),D(rr(42,66,10,22,4),"#E58AA0"),X("M30 32Q36 40 30 48M44 22Q42 32 50 36Q58 30 56 22M64 24Q60 34 70 38M78 30Q72 40 80 48M24 52Q34 50 38 58M48 44Q56 50 64 44M54 56Q60 62 70 56M38 40Q44 46 40 52","#C9677F",2.2),X("M66 70Q72 72 78 68M64 74Q70 76 76 74","#C25E78",1.6)]},
  veterinaria:{n:"Huella con cruz|Hueso",a:[{d:"M50 50C40 50 27 59 24 72C22 82 29 90 38 88C43 87 46 84 50 84C54 84 57 87 62 88C71 90 78 82 76 72C73 59 60 50 50 50Z",c:"#5B3B30"},(function(){var o=toe(18,42,8.5,12,-28);o.c="#5B3B30";return o})(),(function(){var o=toe(36,24,9,12.5,-9);o.c="#5B3B30";return o})(),(function(){var o=toe(64,24,9,12.5,9);o.c="#5B3B30";return o})(),(function(){var o=toe(82,42,8.5,12,28);o.c="#5B3B30";return o})(),X("M34 70Q38 60 48 58","#8A6152",3),X("M30 30Q32 22 38 20","#8A6152",2.5),X("M58 20Q63 21 66 26","#8A6152",2.5),X(CRUZ(50,73,18),"#FFFFFF")],
   b:[D("M24 42C22 30 6 30 8 42C8 46 10 48 12 50C10 52 8 54 8 58C6 70 22 70 24 58L76 58C78 70 94 70 92 58C92 54 90 52 88 50C90 48 92 46 92 42C94 30 78 30 76 42Z","#EFE3C8","rotate(-30 50 50)"),X("M26 46H74",'#FFFFFF',3,"rotate(-30 50 50)"),X("M10 40Q12 34 18 34M80 34Q86 34 89 40","#FFFFFF",2.5,"rotate(-30 50 50)"),X("M26 56H74","#D2C3A1",2,"rotate(-30 50 50)")]},
  fisioterapia:{n:"Brazo flexionado|Mancuerna",a:[D("M14 86V66C14 54 24 50 32 52L46 56C46 42 50 28 58 20C64 14 74 16 74 24C74 32 66 36 64 46C78 40 92 50 88 66C84 82 68 88 52 86Z",SK),D(rr(8,80,30,10,4),BL),X("M54 60Q66 50 80 58",'#C98557',3),X("M60 24Q66 22 70 26M58 30Q64 28 68 32",'#C98557',2),X("M50 62Q48 74 56 82",'#C98557',2.2),X("M62 44Q72 40 82 46",'#F5C9A6',3)],
   b:[D(rr(8,30,16,40,5),BK),D(rr(76,30,16,40,5),BK),D(rr(20,40,8,20,3),GY),D(rr(72,40,8,20,3),GY),D(rr(26,45,48,10,4),ST)]},
  qfb:{n:"Cápsula|Frasco de medicina",a:[D(rr(14,36,36,28,0),RE,"rotate(-35 50 50)"),D("M50 36H72A14 14 0 0 1 72 64H50Z",WH,"rotate(-35 50 50)"),D("M28 36H50V64H28A14 14 0 0 1 28 36Z",RE,"rotate(-35 50 50)")],
   b:[D(rr(24,30,52,58,10),"#C9852F"),D(rr(30,14,40,16,5),WH),X(rr(30,46,40,26,4),WH),X(CRUZ(50,59,18),RE)]},
  educfisica:{n:"Silbato|Balón",a:[D("M14 46C14 34 22 28 34 28H86V48H64C64 64 52 76 38 76C24 76 14 62 14 46Z",ST),D(rr(70,22,16,10,4),ST),X(ci(36,52,8),"#5B6670"),L("M10 30Q4 20 12 14",3,RE)],
   b:[D(ci(50,50,38),WH),D(pg([[50,36],[63,45],[58,60],[42,60],[37,45]]),BK),D("M50 12L60 14L58 24L50 28L42 24L40 14Z",BK),D("M86 44L86 56L78 58L70 50L74 40L82 38Z",BK),D("M14 44L18 38L26 40L30 50L22 58L14 56Z",BK),D("M30 80L40 72L48 76L46 86L38 88Z",BK),D("M70 80L62 72L54 76L56 86L64 88Z",BK),X("M50 28V36M63 45L72 48M58 60L62 72M42 60L38 72M37 45L28 48","#5B6670",1.6)]},
  biomedica:{n:"Corazón con pulso|Monitor de signos",a:[D("M50 86C20 66 8 50 10 34C12 18 30 10 42 18C46 21 48 24 50 28C52 24 54 21 58 18C70 10 88 18 90 34C92 50 80 66 50 86Z",RE),X("M14 46H34L40 34L48 60L56 40L60 46H86",WH,4)],
   b:[D(rr(10,16,80,58,10),"#5B6670"),D(rr(36,74,28,8,3),GY),D(rr(26,82,48,8,4),GY),X(rr(18,24,64,42,4),"#13283B"),X("M22 46H38L44 34L52 58L58 42L62 46H78","#5BE07A",3)]},
  civil:{n:"Casco de obra|Puente",a:[D("M14 66Q14 24 50 20Q86 24 86 66Z",YE),D(rr(6,62,88,12,6),YE),X("M50 22V60","#D4A624",4),X(rr(38,40,24,10,3),WH)],
   b:[D(rr(0,62,100,10,3),"#B23A2E"),D(rr(18,20,10,64,3),RE),D(rr(72,20,10,64,3),RE),L("M4 62Q23 40 23 22Q50 58 77 22Q77 40 96 62",3,"#7A2A22"),D(rr(0,82,100,10,4),BL)]},
  mecatronica:{n:"Brazo robótico|Engrane con circuito",a:[D(rr(14,78,40,12,4),GY),L("M34 78V54L64 30",11,OR),D(ci(34,54,9),BK),D(ci(64,30,9),BK),L("M70 26L82 16M70 34L84 38",6,ST)],
   b:[D(gear(50,50,42,34,8),ST),D(rr(32,32,36,36,4),GR),X("M40 40h8v8h12M60 40v6M40 60h20",GO,2.5),X(ci(48,48,3),GO)]},
  aeroespacial:{n:"Cohete|Avión",a:[D("M44 76L50 98L56 76Z",OR),D("M50 6C66 18 70 40 68 62H32C30 40 34 18 50 6Z",WH),D(pg([[32,52],[18,72],[18,84],[32,72]]),RE),D(pg([[68,52],[82,72],[82,84],[68,72]]),RE),D(rr(38,62,24,10,3),GY),D(ci(50,34,8),GL),D("M50 6C58 12 62 18 64 24H36C38 18 42 12 50 6Z",RE)],
   b:[D("M8 50C8 44 14 42 22 42H70L86 30H94L86 46V54L94 70H86L70 58H22C14 58 8 56 8 50Z",WH),D(pg([[40,46],[56,14],[66,14],[58,46]]),BL),D(pg([[40,54],[56,86],[66,86],[58,54]]),BL),X("M22 48h6M32 48h6M42 48h6",BL,4)]},
  ambiental:{n:"Hoja con gota|Aerogenerador",a:[D("M18 82C14 50 30 18 84 14C86 60 62 86 18 82Z",GR),X("M22 78Q46 56 80 18",'#2F7F3E',3),X("M34 66Q32 54 30 46M44 56Q44 44 46 34M54 46Q56 36 60 26M40 62Q50 64 60 62M50 52Q60 54 70 50M60 40Q68 42 76 38",'#2F7F3E',1.8),D("M66 64C66 56 72 48 72 48C72 48 78 56 78 64C78 68 75 71 72 71C69 71 66 68 66 64Z",BL)],
   b:[D(pg([[46,40],[54,40],[58,92],[42,92]]),WH),D(ci(50,38,7),ST),D(rr(46,4,8,32,4),WH),D(rr(46,4,8,34,4),WH,"rotate(120 50 38)"),D(rr(46,4,8,34,4),WH,"rotate(240 50 38)"),D(rr(30,90,40,6,3),GR)]},
  industrial:{n:"Engrane con flecha|Fábrica",a:[D(gear(48,52,36,28,8),ST),X(ci(48,52,12),"#6B7884"),L("M80 30A40 40 0 0 0 30 14",5,OR),D(pg([[22,8],[34,22],[38,6]]),OR)],
   b:[D("M6 90V48L28 60V48L50 60V48L72 60V20H86V90Z","#B5583F"),X(rr(16,68,12,10,2),YE),X(rr(38,68,12,10,2),YE),X(rr(60,68,12,10,2),YE),D(ci(84,12,6),"#C9D0D6"),D(ci(92,6,4),"#C9D0D6")]},
  mecanica:{n:"Llave inglesa|Tuerca",a:[D("M44 5L44 20L56 20L56 5A18 18 0 1 1 44 5Z",ST,"rotate(-40 50 50)"),D(rr(43,34,14,60,7),ST,"rotate(-40 50 50)"),X(ci(50,84,3),"#7C8792",0,"rotate(-40 50 50)")],
   b:[D(pg([[50,8],[86,29],[86,71],[50,92],[14,71],[14,29]]),ST),X(ci(50,50,16),"#5B6670"),X("M38 46A12 12 0 0 1 52 38","#8994A0",3)]},
  electrica:{n:"Rayo|Clavija",a:[D(pg([[58,4],[20,54],[46,54],[36,96],[82,40],[54,40],[66,4]]),YE)],
   b:[D(rr(22,38,56,40,12),WH),D(rr(34,10,8,30,3),GO),D(rr(58,10,8,30,3),GO),L("M50 78v16",8,BK)]},
  electronica:{n:"Chip|Placa de circuito",a:[L("M34 24V10M50 24V10M66 24V10M34 76V90M50 76V90M66 76V90M24 34H10M24 50H10M24 66H10M76 34H90M76 50H90M76 66H90",5,ST),D(rr(24,24,52,52,8),BK),X(ci(34,34,3),GY)],
   b:[D(rr(10,14,80,72,10),"#2F8F4E"),X("M24 30H48V50H70M24 70H40V50M60 30V40",GO,4),D(ci(48,30,5),GO),D(ci(70,50,5),GO),D(ci(40,70,5),GO),D(rr(54,58,22,16,3),BK)]},
  quimicaing:{n:"Matraz con engrane|Torre de destilación",a:[D("M40 8H60V36L84 82C86 88 82 92 76 92H24C18 92 14 88 16 82L40 36Z",GL),D("M28 66H72L80 82C81 85 79 86 76 86H24C21 86 19 85 20 82Z",GR),D(gear(72,22,16,12,6),ST),X(ci(72,22,5),GY)],
   b:[D(rr(36,6,28,86,12),ST),D(rr(14,30,22,8,3),GY),D(rr(64,52,22,8,3),GY),X("M40 30h20M40 46h20M40 62h20",BL,4),X(ci(50,80,5),OR)]},
  computacion:{n:"Código en pantalla|Laptop",a:[D(rr(8,14,84,60,10),BK),D(rr(40,74,20,10,2),GY),D(rr(28,84,44,8,4),GY),X(rr(16,22,68,44,4),"#13283B"),X("M38 32L28 44L38 56M62 32L72 44L62 56","#5BE07A",4),X("M54 30L46 58",YE,4)],
   b:[D(rr(18,18,64,46,8),ST),D("M6 70H94L88 84H12Z",ST),X(rr(24,24,52,34,3),"#13283B"),X("M36 34l-6 7 6 7M64 34l6 7-6 7","#5BE07A",3)]},
  datos:{n:"Gráfica con lupa|Gráfica de pastel",a:[D(rr(8,52,16,38,4),BL),D(rr(30,34,16,56,4),TE),D(rr(52,44,16,46,4),OR),L("M78 58L92 72",8,BK),D(ci(68,46,18),ST),D(ci(68,46,11),GL)],
   b:[D(ci(46,54,38),BL),D("M46 54V16A38 38 0 0 1 84 54Z",YE),D("M56 8A38 38 0 0 1 92 44H56Z",OR)]},
  biotec:{n:"ADN|Tubo con hoja",a:[L("M32 8C32 30 68 34 68 50C68 66 32 70 32 92",8,BL),L("M68 8C68 30 32 34 32 50C32 66 68 70 68 92",8,RE),X("M38 18H62M42 30H58M42 70H58M38 82H62",YE,3.5)],
   b:[D(rr(36,6,28,88,14),GL),D(rr(40,52,20,38,10),GR),D("M50 48C40 40 40 28 50 20C60 28 60 40 50 48Z","#2F8F4E")]},
  fisica:{n:"Átomo|Imán",a:[L(el(50,50,42,16),5,BL),L(el(50,50,42,16),5,BL,"rotate(60 50 50)"),L(el(50,50,42,16),5,BL,"rotate(-60 50 50)"),D(ci(50,50,10),RE)],
   b:[D("M14 14H38V54C38 62 44 68 50 68C56 68 62 62 62 54V14H86V54C86 76 70 90 50 90C30 90 14 76 14 54Z",RE),D(rr(14,14,24,14,2),ST),D(rr(62,14,24,14,2),ST)]},
  ia:{n:"Cabeza de robot|Cerebro de circuito",a:[D(rr(16,26,68,58,16),ST),L("M50 26V12",5,GY),D(ci(50,10,6),RE),D(rr(6,46,10,18,4),GY),D(rr(84,46,10,18,4),GY),X(ci(36,50,8),"#5BD3F5"),X(ci(64,50,8),"#5BD3F5"),X("M36 70h28",BK,5)],
   b:[D("M22 52C10 46 14 28 28 28C30 16 46 12 52 22C58 12 76 16 76 28C90 28 92 46 80 52C88 62 78 78 66 72C60 84 40 84 34 72C22 78 12 62 22 52Z",BL),X("M30 50H44V36M56 64V50H72M50 22V40","#5BD3F5",3.5),X(ci(44,36,4),YE),X(ci(72,50,4),YE),X(ci(56,64,4),YE)]},
  ciberseguridad:{n:"Escudo con candado|Candado",a:[D("M50 6L86 18V46C86 70 70 86 50 94C30 86 14 70 14 46V18Z",BL),L("M40 46V38C40 26 60 26 60 38V46",4,ST),D(rr(36,46,28,24,4),GO),X(ci(50,58,4),BR)],
   b:[L("M32 44V32C32 6 68 6 68 32V44",8,ST),D(rr(18,42,64,50,10),GO),X(ci(50,62,7),BR),X("M50 66v12",BR,5)]},
  quimica:{n:"Molécula|Probeta",a:[L("M30 66L50 30L72 64M30 66H72",6,GY),D(ci(50,28,15),RE),D(ci(28,68,13),BL),D(ci(74,66,13),WH)],
   b:[D("M34 6H66V12H60V78C60 88 54 94 50 94C46 94 40 88 40 78V12H34Z",GL),D("M40 54H60V78C60 84 56 88 50 88C44 88 40 84 40 78Z",BL),X("M42 26h8M42 38h8","#5E8FA8",3)]},
  biologia:{n:"Microscopio|Célula",a:[D(rr(20,82,62,10,4),NA),D(rr(22,66,40,8,3),GY),L("M70 82V52C70 40 62 32 52 32",8,NA),D(rr(28,8,18,40,5),WH,"rotate(-25 37 28)"),D(rr(30,48,14,10,3),BK,"rotate(-25 37 28)")],
   b:[D("M50 8C76 8 92 26 90 50C88 76 70 92 48 90C22 88 8 70 10 48C12 24 26 8 50 8Z","#9BD58A"),X("M50 14C70 14 84 28 84 50","#C8EBBE",3),D(ci(56,46,15),PU),X(ci(52,42,5),"#C7A6E2"),X("M26 60Q32 54 38 60Q44 66 50 60","#5E9A4E",2),X("M62 72Q68 68 74 72Q78 76 72 78","#5E9A4E",2),D(el(28,32,8,4),OR,"rotate(-30 28 32)"),X("M22 33l3-3 3 3 3-3 3 3","#B85E1A",1.2,"rotate(-30 28 32)"),D(el(72,72,7,4),OR,"rotate(20 72 72)"),D(ci(30,74,4),GR),D(ci(76,30,3.5),GR)]},
  matematicas:{n:"Pi|Signos de operaciones",a:[D(rr(10,16,80,14,7),BL),D("M28 30H42V76C42 84 36 90 26 88V76C28 76 28 74 28 72Z",BL),D("M58 30H72V70C72 76 76 78 82 76V88C70 94 58 88 58 74Z",BL)],
   b:[D(rr(8,8,84,84,16),"#2F5E45"),X("M30 22v20M20 32h20M60 32h20M22 62l16 16M38 62L22 78M60 64h20M60 76h20",WH,5)]},
  derecho:{n:"Balanza|Mazo",a:[D(rr(28,84,44,8,4),GO),L("M50 84V14",6,GO),D(ci(50,12,6),GO),L("M14 26H86",6,GO),L("M20 26L10 56M20 26L30 56M80 26L70 56M80 26L90 56",2,"#B88A20"),D("M6 56H34C34 66 28 72 20 72C12 72 6 66 6 56Z",GO),D("M66 56H94C94 66 88 72 80 72C72 72 66 66 66 56Z",GO)],
   b:[L("M44 46L86 88",8,WO),D(rr(10,22,50,26,10),WO,"rotate(-35 35 35)"),X(rr(18,22,6,26,1),GO,0,"rotate(-35 35 35)"),X(rr(46,22,6,26,1),GO,0,"rotate(-35 35 35)"),D(rr(52,78,40,12,5),"#8F5E30")]},
  negocios:{n:"Portafolio|Corbata",a:[D(rr(8,30,84,58,10),BR),L("M36 30V20H64V30",7,"#5E3A20"),X("M8 54H92","#5E3A20",3),D(rr(44,48,12,12,3),GO)],
   b:[D(pg([[38,8],[62,8],[58,22],[42,22]]),RE),D(pg([[42,22],[58,22],[70,74],[50,94],[30,74]]),RE),X("M46 40L62 56M44 58L64 76",NA,4)]},
  finanzas:{n:"Pila de monedas|Alcancía",a:[D(el(50,78,36,12),GO),D(rr(14,58,72,20,0),GO),D(el(50,58,36,12),GO),D(rr(14,38,72,20,0),GO),D(el(50,38,36,12),"#F3CB5E"),X("M14 58Q50 72 86 58M14 78Q50 92 86 78","#B8861C",3)],
   b:[D("M18 56C18 36 36 26 54 26C74 26 88 38 88 56C88 68 82 76 74 80V90H62V84H44V90H32V80C24 76 18 68 18 56Z",PK),D(el(14,56,7,9),"#EE8EA4"),X(el(12,54,1.6,2.2),"#B9566E"),X(el(16,58,1.6,2.2),"#B9566E"),D(pg([[60,27],[66,12],[74,28]]),"#EE8EA4"),X(rr(44,30,18,5,2),"#B9566E"),X(ci(70,46,3.2),BK),X(ci(71,45,1),WH),X("M88 50Q96 46 92 40Q88 36 92 32","#EE8EA4",3),X("M30 52Q40 46 50 48","#F9C7D2",4),D(ci(54,16,8),GO)]},
  educacion:{n:"Pizarrón|Birrete",a:[D(rr(8,12,84,60,8),WO),L("M30 72L22 92M70 72L78 92",5,WO),X(rr(15,19,70,46,4),"#2F5E45"),X("M24 32h24M24 44h36",WH,4),X(ci(70,32,5),WH)],
   b:[D(pg([[50,14],[94,34],[50,54],[6,34]]),BK),D("M24 44V64C24 72 36 78 50 78C64 78 76 72 76 64V44L50 56Z",BK),L("M88 38V66",3,GO),D(ci(88,70,5),GO)]},
  contaduria:{n:"Calculadora|Recibo",a:[D(rr(20,8,60,84,12),"#4A5560"),X(rr(28,16,44,18,4),"#BFE0B0"),X(ci(36,48,5),WH),X(ci(50,48,5),WH),X(ci(64,48,5),WH),X(ci(36,62,5),WH),X(ci(50,62,5),WH),X(ci(64,62,5),WH),X(ci(36,76,5),WH),X(ci(50,76,5),WH),X(rr(59,71,10,10,3),OR)],
   b:[D("M20 8H80V92L72 86L64 92L56 86L48 92L40 86L32 92L26 86L20 92Z",WH),X("M30 24h40M30 36h40M30 48h26","#9AA3AC",4),X("M30 64h40",GR,4)]},
  economia:{n:"Gráfica con flecha|Billete",a:[L("M10 82L36 56L52 68L82 30",9,GR),D(pg([[68,24],[90,20],[86,42]]),GR),D(ci(28,30,12),GO),X("M28 24v12","#B8861C",3)],
   b:[D(rr(6,24,88,52,8),"#7DB46C"),X(ci(50,50,14),"#A9D398"),X(rr(14,32,72,36,4),"#4E8A3E",2.5),X("M50 42v16","#4E8A3E",4)]},
  actuaria:{n:"Dado|Campana de Gauss",a:[D(rr(14,14,72,72,14),WH),X(ci(32,32,6),BK),X(ci(68,32,6),BK),X(ci(50,50,6),RE),X(ci(32,68,6),BK),X(ci(68,68,6),BK)],
   b:[D("M6 86C24 86 30 20 50 20C70 20 76 86 94 86Z",BL),X("M50 24V84",WH,3),X("M30 60V84M70 60V84","#2C5E91",2.5)]},
  mercadotecnia:{n:"Megáfono|Etiqueta de precio",a:[D(pg([[14,38],[34,38],[80,14],[80,86],[34,62],[14,62]]),RE),D(rr(14,38,20,24,3),WH),D(rr(26,62,14,24,4),GY),X("M86 40Q94 50 86 60",OR,4)],
   b:[D(pg([[8,40],[40,8],[90,8],[90,58],[58,90]]),YE),X(ci(72,26,7),WH),X("M34 58l18-18M42 66l18-18","#C99A1E",4)]},
  comext:{n:"Barco con contenedores|Contenedor",a:[D("M6 58H94L82 84H18Z",RE),D(rr(20,36,20,22,2),OR),D(rr(42,36,20,22,2),BL),D(rr(42,20,20,16,2),GR),D(rr(64,36,16,22,2),YE),D(rr(0,84,100,8,4),BL)],
   b:[D(rr(8,24,84,52,6),OR),X("M22 32v36M36 32v36M50 32v36M64 32v36M78 32v36","#B85E1A",3.5)]},
  turismo:{n:"Maleta|Palmera",a:[D(rr(16,26,68,62,10),OR),L("M38 26V16H62V26",6,BR),X("M34 26V88M66 26V88",BR,4),D(ci(28,92,4),BK),D(ci(72,92,4),BK)],
   b:[D(el(50,92,30,6),YE),L("M50 92C50 70 52 50 58 36",8,BR),X("M48 86h6M49 78h6M50 70h6M51 62h6M53 54h6M55 46h5","#5E3A20",1.6),D("M58 36C46 22 26 22 14 30C30 30 44 32 58 36Z",GR),D("M58 36C64 20 80 12 94 16C80 24 68 30 58 36Z",GR),D("M58 36C70 30 86 36 92 50C78 44 66 40 58 36Z",GR),D("M58 36C48 30 36 34 26 48C38 42 48 38 58 36Z",GR),X("M22 29l-2 5M30 27l-2 5M38 27l-1 5M46 29l-1 5M70 22l2 4M78 18l2 4M86 17l1 4M70 36l3 3M78 38l2 4M86 42l1 4M38 38l-3 4M46 36l-2 4","#2F7F3E",1.5),D(ci(56,42,4),BR),D(ci(62,40,4),BR)]},
  politicas:{n:"Edificio de gobierno|Urna de votación",a:[D(rr(8,82,84,10,3),GY),D(rr(14,46,72,8,3),WH),D("M24 46C24 28 36 18 50 18C64 18 76 28 76 46Z",ST),L("M50 18V6",3,GY),D(rr(18,54,8,28,2),WH),D(rr(36,54,8,28,2),WH),D(rr(56,54,8,28,2),WH),D(rr(74,54,8,28,2),WH)],
   b:[D(rr(34,10,32,36,4),WH,"rotate(8 50 28)"),X("M42 22l6 6 10-12",GR,4,"rotate(8 50 28)"),D(rr(14,40,72,52,8),BL),X(rr(30,48,40,6,3),"#1F4E7A")]},
  rrii:{n:"Globo con bandera|Pasaporte",a:[D(ci(44,56,34),BL),D("M18 44Q30 52 26 64Q34 72 40 64Q50 60 46 48Q40 40 30 40Z",GR),D("M54 30Q64 36 70 46Q60 52 58 44Q52 40 54 30Z",GR),L("M74 30V6",4,GY),D(pg([[76,6],[96,12],[76,20]]),RE)],
   b:[D(rr(20,8,60,84,8),NA),X(ci(50,42,15),GO,0),X(ci(50,42,10),NA),X("M35 42h30M50 27v30",GO,2),X("M32 70h36M38 80h24",GO,3)]},
  sociologia:{n:"Grupo de personas|Burbujas de diálogo",a:[D(ci(20,40,10),OR),D("M4 78C4 64 12 56 20 56C26 56 30 58 32 62V78Z",OR),D(ci(80,40,10),GR),D("M96 78C96 64 88 56 80 56C74 56 70 58 68 62V78Z",GR),D(ci(50,26,13),BL),D("M28 70C28 54 38 44 50 44C62 44 72 54 72 70Z",BL)],
   b:[D("M6 18C6 12 10 8 16 8H56C62 8 66 12 66 18V42C66 48 62 52 56 52H28L16 62V52C10 52 6 48 6 42Z",BL),D("M94 44C94 38 90 34 84 34H50C44 34 40 38 40 44V66C40 72 44 76 50 76H72L84 88V76C90 76 94 72 94 66Z",OR),X("M18 24h36M18 36h24",WH,4),X("M52 50h30M52 60h20",WH,4)]},
  trabajosocial:{n:"Mano con corazón|Casa con corazón",a:[D("M8 64C20 58 34 60 46 68H62C70 68 72 78 64 80H48L64 82L84 68C90 62 98 68 94 74L78 88C56 96 30 94 8 90Z",SK),X("M48 80H62M60 74L66 70M70 70L76 66","#C98557",1.8),X("M14 70Q26 66 38 70",'#F5C9A6',3),D("M54 54C36 42 30 34 32 26C34 18 44 16 49 22L54 27L59 22C64 16 74 18 76 26C78 34 72 42 54 54Z",RE),X("M38 26Q38 22 42 22",'#FF9A8E',3)],
   b:[D(pg([[50,8],[92,44],[8,44]]),RE),D(rr(18,40,64,50,4),CR),D("M50 78C38 70 32 64 34 56C36 50 44 48 48 54L50 56L52 54C56 48 64 50 66 56C68 64 62 70 50 78Z",RE)]},
  criminologia:{n:"Lupa con huella|Placa",a:[L("M62 62L88 88",10,BK),D(ci(40,40,32),ST),D(ci(40,40,24),GL),X("M30 30Q40 22 50 30M26 40Q40 28 54 40M28 50Q40 40 52 50M34 58Q40 54 46 58",NA,2.5)],
   b:[D(star(50,50,44,30,7),GO),D(ci(50,50,18),"#F3CB5E"),X(star(50,50,12,6,5),"#B8861C")]},
  arquitectura:{n:"Compás sobre plano|Casa con plano",a:[D(rr(22,58,76,32,4),BL,"skewX(-14)"),X("M38 66h40M38 76h24",WH,2.5,"skewX(-14)"),L("M50 14L30 78M50 14L72 78",6,ST),D(ci(50,14,7),GY),X("M38 52H62","#5B6670",3)],
   b:[D(rr(6,74,88,18,3),BL),X("M14 80h30M14 86h50",WH,2.5),D(pg([[50,6],[88,38],[12,38]]),RE),D(rr(20,36,60,34,2),CR),X(rr(42,46,16,24,2),BR)]},
  moda:{n:"Vestido en gancho|Tijeras",a:[L("M50 18V10Q50 4 56 6",4,ST),L("M50 18L20 30H80Z",3,ST),D("M38 30H62L64 46L84 90H16L36 46Z",RE),X("M38 46H62",PK,4)],
   b:[L("M34 62L70 8M66 62L30 8",9,ST),D(ci(26,72,14),RE),D(ci(74,72,14),RE),X(ci(26,72,7),WH),X(ci(74,72,7),WH),D(ci(50,40,4),GY)]},
  comunicacion:{n:"Micrófono|Periódico",a:[L("M22 46C22 64 34 72 50 72C66 72 78 64 78 46",5,BK),L("M50 72V86",5,BK),D(rr(30,84,40,8,4),BK),D(rr(32,8,36,52,18),ST),X("M40 22h20M40 32h20M40 42h20","#6B7884",3)],
   b:[D(rr(10,14,80,72,6),WH),X(rr(18,22,30,24,2),"#A9B6C2"),X("M54 24h28M54 34h28M54 44h20M18 56h64M18 66h64M18 76h44","#7A848E",3.5)]},
  cine:{n:"Claqueta|Cámara de cine",a:[D(rr(10,40,80,50,6),BK),D(pg([[10,22],[86,8],[90,26],[14,40]]),BK),X("M24 20L32 36M44 16L52 32M64 12L72 28",WH,6),X("M20 58h60M20 72h40",WH,3)],
   b:[D(ci(30,26,16),BK),D(ci(64,22,14),BK),D(rr(10,42,62,40,8),"#4A5560"),D(pg([[72,52],[94,40],[94,84],[72,72]]),BK),X(ci(30,26,6),ST),X(ci(64,22,5),ST)]},
  grafico:{n:"Pluma vectorial|Pincel",a:[D("M50 6L80 46L58 92H42L20 46Z",NA),X(ci(50,52,7),WH),X("M50 10V44",WH,3),D(rr(40,84,20,10,2),GY)],
   b:[D(rr(44,4,12,52,6),WO,"rotate(35 50 50)"),D(rr(41,54,18,12,3),ST,"rotate(35 50 50)"),D("M41 66H59C60 80 54 92 50 96C46 92 40 80 41 66Z",RE,"rotate(35 50 50)")]},
  disindustrial:{n:"Silla|Lámpara de escritorio",a:[D(rr(28,6,44,44,10),WO),D(pg([[16,50],[84,50],[92,64],[8,64]]),WO),L("M14 64L12 92M86 64L88 92",6,"#8F5E30"),L("M30 64V84M70 64V84",5,"#8F5E30")],
   b:[D(el(44,88,30,7),BK),L("M40 84L30 52L58 30",6,ST),D(ci(30,52,6),GY),D(ci(58,30,6),GY),D("M56 18C66 6 88 10 92 28L66 44C58 38 52 28 56 18Z",YE),D(el(80,38,8,5),"#FFF3B0","rotate(-30 80 38)")]},
  animacion:{n:"Pelota rebotando|Folioscopio",a:[L("M8 34h20M4 50h22M8 66h20",5,"#C9C2B4"),D(ci(62,50,30),RE),X("M40 32Q62 50 84 40","#FFFFFF",5),X("M40 66Q62 52 86 62","#FFFFFF",5)],
   b:[D(rr(10,36,64,52,6),"#E6E1D6","rotate(-14 42 62)"),D(rr(18,26,64,52,6),"#EEE9DE","rotate(-6 50 52)"),D(rr(26,18,64,52,6),WH),D(ci(58,40,10),RE),X("M40 58h36","#9AA3AC",3)]},
  gastronomia:{n:"Gorro de chef|Sartén",a:[D("M24 64C10 62 6 40 20 34C20 18 40 12 50 22C60 12 80 18 80 34C94 40 90 62 76 64Z",WH),D(rr(24,62,52,24,4),WH),X("M36 64Q34 50 38 38M50 64Q50 46 52 30M64 64Q66 50 62 38",'#D6D2C7',2),X("M28 70H72",'#D6D2C7',2),X("M34 72V84M42 72V84M50 72V84M58 72V84M66 72V84",'#CFCBC0',1.6),X("M22 40Q20 30 30 26",'#FFFFFF',3)],
   b:[L("M70 46L94 30",9,BR),D(ci(40,56,32),BK),D("M26 50C26 40 40 36 48 42C58 40 62 52 56 60C52 70 34 70 30 62C26 58 26 54 26 50Z",WH),D(ci(42,52,8),YE)]}
 };

 /* ---------- objetos propios de cada carrera (salud) ---------- */
 var O={
  termometro:[D(rr(42,6,16,64,8),"#EDF6FA"),D(ci(50,78,14),RE),X(rr(46.5,30,7,46,3.5),RE),X("M58 18h6M58 28h6M58 38h6M58 48h6M58 58h6","#7A8894",2)],
  bata:[D("M24 18L40 10H60L76 18L90 40V90H62V44H38V90H10V40Z",WH),D("M40 10L50 34L60 10Z","#CFE3EC"),X("M50 34V90","#C9CCC6",2),X("M40 10L36 30L46 40M60 10L64 30L54 40","#C9CCC6",2.5),D(rr(62,52,16,14,2),"#E6ECEF"),X("M66 48V60",BL,3),X(ci(50,56,2),"#9AA3AC"),X(ci(50,70,2),"#9AA3AC")],
  suero:[L("M50 4V14",3,GY),D("M26 14H74V58C74 72 64 80 50 80C36 80 26 72 26 58Z",GL),D("M28 40H72V58C72 70 62 78 50 78C38 78 28 70 28 58Z","#F2D36B"),X(rr(36,22,28,10,2),WH),L("M50 80V96",3,GY),X("M40 46h4M40 54h4M40 62h4","#C9A23A",1.6)],
  curita:[D(rr(6,34,88,32,16),"#E8B98C","rotate(-35 50 50)"),D(rr(34,36,32,28,4),"#F6E2CC","rotate(-35 50 50)"),X("M16 44h1M22 52h1M16 58h1M78 44h1M84 52h1M78 58h1","#B8875C",3,"rotate(-35 50 50)")],
  cubrebocas:[L("M18 34C4 34 4 62 18 62M82 34C96 34 96 62 82 62",3,"#7FB2E3"),D("M18 30Q50 20 82 30V64Q50 82 18 64Z","#BFE0F5"),X("M20 40Q50 32 80 40M20 50Q50 44 80 50M20 60Q50 56 80 60","#8FC4E6",2)],
  espejo:[D(rr(44,46,12,50,6),ST,"rotate(30 50 50)"),D(ci(50,24,20),GY,"rotate(30 50 50)"),D(ci(50,24,15),"#DDF1FA","rotate(30 50 50)"),X("M40 18Q44 12 52 12","#FFFFFF",3,"rotate(30 50 50)")],
  pasta:[D("M14 40H72L86 46V54L72 60H14C10 60 8 56 8 50C8 44 10 40 14 40Z",WH),D(rr(84,42,12,16,3),BL),X(rr(24,44,34,12,2),BL),X("M28 50h26","#FFFFFF",2.5),D("M10 32C4 28 6 18 14 20C18 12 30 14 30 22C38 20 40 30 32 34C26 38 14 36 10 32Z","#E9F6FC")],
  sonrisa:[D("M8 34Q50 20 92 34Q86 80 50 84Q14 80 8 34Z","#C9475A"),D("M14 38Q50 28 86 38V50Q50 44 14 50Z","#FAF7F0"),D("M20 64Q50 58 80 64Q72 76 50 78Q28 76 20 64Z","#FAF7F0"),X("M30 34V48M42 32V46M58 32V46M70 34V48","#D9D2C2",1.5),X("M16 44H84",ST,2.5),X(rr(24,40,6,6,1),ST),X(rr(36,38,6,6,1),ST),X(rr(52,38,6,6,1),ST),X(rr(64,40,6,6,1),ST)],
  bascula:[D(rr(10,22,80,64,14),WH),D(rr(30,30,40,22,6),"#2B3540"),X("M38 42h24","#5BE07A",4),X(rr(18,62,24,14,4),"#C9CED3"),X(rr(58,62,24,14,4),"#C9CED3")],
  cinta:[D(ci(38,46,30),YE),D(ci(38,46,10),"#B88A20"),D("M60 64H96V80H58Z",YE),X("M64 64v6M70 64v4M76 64v6M82 64v4M88 64v6","#5B4A20",1.6),X("M22 30a20 20 0 0 1 20-6","#FFF1B0",3)],
  zanahoria:[D("M30 30C40 22 56 26 62 36L26 92C22 96 16 92 18 86Z",OR),D("M58 30C56 18 62 8 70 6C70 16 66 24 62 30Z",GR),D("M60 34C68 24 80 22 90 26C84 34 74 38 64 38Z",GR),D("M54 28C48 18 50 8 56 4C60 12 58 22 56 30Z","#3E9A4B"),X("M36 50l8 3M30 62l8 3M26 74l7 3M42 40l6 2","#C9661E",2)],
  vaso:[D("M22 14H78L70 90H30Z",GL),D("M26 44H74L70 88H30Z","#7FC8F0"),X("M30 20L36 84",WH,4),D(el(50,44,24,3.5),"#BDE6F8")],
  divan:[D("M8 60C8 46 20 44 26 52L30 58H86C92 58 94 64 94 70V78H8Z","#8E4A3A"),D(rr(4,46,22,32,10),"#A85A48"),D(rr(30,52,62,12,6),"#B86A56"),L("M14 78V90M86 78V90",5,BR),X("M44 64v8M60 64v8M76 64v8","#6E3528",2)],
  libreta:[D(rr(18,8,62,84,6),"#F2C94C"),D(rr(26,14,50,72,3),WH),X("M34 28h34M34 40h34M34 52h34M34 64h22","#9AA3AC",2.5),L("M86 20L58 78",7,BL),D(pg([[56,80],[60,72],[66,76]]),"#F2D3A0"),X("M18 20h-6M18 34h-6M18 48h-6M18 62h-6M18 76h-6",GY,3)],
  pensamiento:[D("M24 50C10 50 8 30 22 28C22 14 40 10 48 18C54 6 76 8 78 22C92 22 94 42 82 46C84 58 68 62 60 56C54 64 36 62 34 54C30 56 26 54 24 50Z",WH),D(ci(30,70,8),WH),D(ci(20,84,5),WH),X("M40 34Q48 28 58 34",GY,2.5)],
  perro:[D("M18 22C10 22 8 40 12 56C14 62 20 62 22 56L24 44Z","#8A5A36"),D("M82 22C90 22 92 40 88 56C86 62 80 62 78 56L76 44Z","#8A5A36"),D("M50 18C30 18 22 34 22 52C22 74 34 88 50 88C66 88 78 74 78 52C78 34 70 18 50 18Z","#D9A06A"),D(el(50,70,16,12),"#F2D6B3"),D(el(50,62,7,5),BK),X(ci(38,48,4),BK),X(ci(62,48,4),BK),X(ci(39,47,1.3),WH),X(ci(63,47,1.3),WH),X("M50 66V74M42 76Q50 82 58 76",BK,2),D(el(50,84,6,5),"#E9677A")],
  gato:[D(pg([[20,40],[24,8],[44,26]]),"#9AA3AC"),D(pg([[80,40],[76,8],[56,26]]),"#9AA3AC"),X(pg([[26,32],[27,16],[38,26]]),PK),X(pg([[74,32],[73,16],[62,26]]),PK),D("M50 22C28 22 16 38 16 56C16 76 32 88 50 88C68 88 84 76 84 56C84 38 72 22 50 22Z","#B4BDC6"),X(el(36,52,6,7),"#9BD58A"),X(el(64,52,6,7),"#9BD58A"),X(el(36,52,2,6),BK),X(el(64,52,2,6),BK),D(pg([[45,64],[55,64],[50,70]]),PK),X("M50 70Q46 76 40 74M50 70Q54 76 60 74M8 62L30 64M8 72L30 68M92 62L70 64M92 72L70 68","#5B6670",1.6)],
  collar:[L(el(50,40,36,18),9,RE),X("M16 40Q50 62 84 40","#B23A2E",2),D(ci(50,72,16),GO),L("M50 56V58",4,GO),X(star(50,72,8,4,5),"#B8861C")],
  muleta:[L("M34 14C40 8 58 8 64 14",8,"#3A4048"),L("M40 16L44 86M58 16L54 86",5,ST),L("M42 46H56",8,"#3A4048"),D(rr(40,82,18,8,3),ST),D(rr(42,88,14,8,4),"#3A4048"),X("M44 24v14M56 24v14",ST,2),X(ci(49,64,1.6),"#5B6670"),X(ci(49,72,1.6),"#5B6670")],
  columna:[D(rr(36,4,28,12,5),CR),D(rr(34,20,32,12,5),CR),D(rr(32,36,36,12,5),CR),D(rr(30,52,40,12,5),CR),D(rr(30,68,40,12,5),CR),D("M34 84H66L60 96H40Z",CR),X("M42 16h16M42 32h16M42 48h16M42 64h16M42 80h16","#E59AA6",3)],
  liga:[D("M10 30C10 20 22 18 30 24L76 60C86 66 92 76 86 84C80 90 70 86 66 80L22 44C14 40 10 36 10 30Z","#4FB6A8"),X("M20 30L74 72","#8ADBD1",3),D(rr(4,22,18,18,6),"#2B3540"),D(rr(80,74,18,18,6),"#2B3540")],
  camilla:[D(rr(6,40,88,14,6),"#5FB4D9"),D(rr(6,30,24,12,5),WH),L("M16 54V82M84 54V82M16 70H84",5,ST),D(ci(16,86,5),BK),D(ci(84,86,5),BK)],
  blister:[D(rr(12,14,76,72,10),"#D5DCE2"),D(el(32,32,10,8),WH),D(el(68,32,10,8),"#F2A94C"),D(el(32,58,10,8),WH),D(el(68,58,10,8),WH),X("M50 18V82M16 46H84","#B4BEC7",1.6)],
  gotero:[D(rr(36,4,28,24,12),RE),D(rr(42,26,16,8,2),"#3A4048"),D("M44 34H56V74L50 86L44 74Z",GL),X("M46 54H54V74L50 82L46 74Z","#8FC4E6"),D("M44 92C44 88 50 84 50 84C50 84 56 88 56 92C56 95 53 97 50 97C47 97 44 95 44 92Z","#8FC4E6")],
  mortero:[L("M56 50L84 8",9,"#C9C2B4"),D("M10 48H90C90 72 72 86 50 86C28 86 10 72 10 48Z","#E9E3D6"),D(el(50,48,40,8),"#B8AF9E"),D(rr(34,84,32,8,3),"#D5CEC0"),X("M18 56Q30 72 50 76","#FFFFFF",3)],
  cronometro:[D(rr(42,4,16,10,3),ST),D(rr(70,14,10,10,3),ST,"rotate(40 75 19)"),D(ci(50,56,38),ST),D(ci(50,56,30),WH),X("M50 56V36M50 56L62 64",BK,4),X("M50 30v4M76 56h-4M50 82v-4M24 56h4",GY,3),X("M50 56m-26 0a26 26 0 0 1 26-26",RE,3)],
  trofeo:[D("M28 10H72V36C72 52 62 62 50 62C38 62 28 52 28 36Z",GO),L("M28 18H16V28C16 38 24 42 30 42M72 18H84V28C84 38 76 42 70 42",5,GO),D(rr(44,60,12,14,2),GO),D(rr(30,74,40,16,4),"#6B4A2A"),X(rr(38,78,24,8,2),"#F3CB5E"),X(star(50,32,10,5,5),"#FFF1B0")],
  tenis:[D("M6 64C6 50 18 40 34 42L56 52C66 56 84 58 92 66C96 70 96 76 92 78H8C6 74 6 70 6 64Z",WH),D("M30 42C38 30 54 32 58 42L56 54H30Z",BL),D(rr(4,76,92,12,6),"#E2683E"),X("M6 82H94","#B4502A",2),X("M34 46l14 4M33 52l16 4M38 39l12 4",WH,2.2),X("M58 62C70 64 84 66 92 72",BL,3.5),X(ci(14,64,2),"#C9CCC6"),X(ci(22,60,2),"#C9CCC6")],
  cono:[D("M40 10H60L80 82H20Z",OR),D("M33 36H67L71 50H29Z",WH),D("M26 62H74L77 72H23Z",WH),D(rr(8,80,84,12,4),OR)],
  protesis:[D("M34 6H66V26C66 34 58 38 50 38C42 38 34 34 34 26Z","#D9B79A"),D(rr(32,24,36,14,6),"#3A4048"),D(ci(50,44,8),ST),L("M50 50V76",7,ST),X("M47 54h6M47 62h6M47 70h6","#7C8792",1.6),D("M40 76H60L62 82C72 82 88 84 90 92H38Z","#3A4048"),X("M44 82h40","#5B6670",2)],
  rayosx:[D(rr(10,6,80,88,8),"#1E2B38"),X("M50 14V86","#CFE3EC",5),X("M30 26Q50 34 70 26M28 38Q50 46 72 38M28 50Q50 58 72 50M30 62Q50 70 70 62M34 74Q50 80 66 74","#CFE3EC",3),X(rr(10,6,80,8,4),"#3A4C5E")]
 };
 /* los objetos nuevos se dibujan igual que los de cada carrera */
 Object.keys(O).forEach(function(k){S["o_"+k]={n:k,a:O[k]}});
 function list(){return C.filter(function(c){return S[c.id]})}
 function partsOf(id,v){var s=S[id];return s?(s[v]||s.a):null}
 /* 3D simulado, sin filtros (barato de dibujar):
    · grosor en cuatro capas hacia abajo a la derecha, cada una un poco más oscura
    · cada pieza con degradado de su color, bisel (borde claro arriba a la izquierda y oscuro abajo a la derecha,
      recortado a la propia pieza), un reflejo suave en la misma esquina para todas y un contorno delgado de su color
    · las piezas de tubo con su brillo y su sombra a lo largo */
 var UID=0;
 /* material según el color: metal plateado y dorado, vidrio, madera; lo demás es plástico o pintura */
 var MAT={"#A9B6C2":"metal","#8C96A0":"metal","#C9D0D6":"metal","#E8B53C":"metal","#F3CB5E":"metal","#AEE0F2":"glass","#B9804B":"wood","#8A5A36":"wood","#8F5E30":"wood","#5E3A20":"wood","#C9852F":"glass"};
 function mat(c){return MAT[c.toUpperCase()]||MAT[c]||"plastic"}
 /* metal: bandas de reflejo como cromo */
 function metal(c){var k=c.replace("#","");return '<linearGradient id="sm'+k+'" x1="0" y1="0" x2="1" y2=".35"><stop offset="0" stop-color="'+ISO.tint(c,.55)+'"/><stop offset=".22" stop-color="'+ISO.tint(c,.15)+'"/><stop offset=".42" stop-color="'+ISO.shade(c,.28)+'"/><stop offset=".55" stop-color="'+ISO.tint(c,.7)+'"/><stop offset=".72" stop-color="'+c+'"/><stop offset="1" stop-color="'+ISO.shade(c,.32)+'"/></linearGradient>'}
 function grad(c){var k=c.replace("#","");return '<radialGradient id="sg'+k+'" cx=".34" cy=".28" r=".9" fx=".3" fy=".22"><stop offset="0" stop-color="'+ISO.tint(c,.55)+'"/><stop offset=".18" stop-color="'+ISO.tint(c,.3)+'"/><stop offset=".42" stop-color="'+ISO.tint(c,.06)+'"/><stop offset=".66" stop-color="'+c+'"/><stop offset=".86" stop-color="'+ISO.shade(c,.16)+'"/><stop offset="1" stop-color="'+ISO.shade(c,.32)+'"/></radialGradient>'}
 function draw(id,v,silo){var P=partsOf(id,v);if(!P)return "";var sil=P.filter(function(p){return p.d||p.l}),tr=function(p){return p.t?' transform="'+p.t+'"':''},g="",cols={},u=++UID;
  var shape=function(p,fill,stroke,sw,extra){return p.d?'<path d="'+p.d+'"'+tr(p)+' fill="'+fill+'"'+(stroke?' stroke="'+stroke+'" stroke-width="'+sw+'" stroke-linejoin="round"':'')+(extra||'')+'/>':'<path d="'+p.l+'"'+tr(p)+' fill="none" stroke="'+fill+'" stroke-width="'+(p.w+(sw||0))+'" stroke-linecap="round" stroke-linejoin="round"'+(extra||'')+'/>'};
  if(silo)return sil.map(function(p){return shape(p,"#111")}).join("");
  sil.forEach(function(p){cols[p.c]=1});
  g+='<defs>'+Object.keys(cols).map(grad).join("")+Object.keys(cols).filter(function(c){return mat(c)==="metal"}).map(metal).join("")+
   '<filter id="sb'+u+'" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.8"/></filter>'+
   '<radialGradient id="shp" cx=".3" cy=".22" r=".22"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".85"/><stop offset=".5" stop-color="#FFFFFF" stop-opacity=".25"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>'+
   '<radialGradient id="sh2" cx=".26" cy=".18" r=".07"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".95"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>'+
   '<radialGradient id="shm" cx=".28" cy=".2" r=".3"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".95"/><stop offset=".35" stop-color="#FFFFFF" stop-opacity=".35"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>'+'<radialGradient id="ss'+u+'" gradientUnits="userSpaceOnUse" cx="28" cy="22" r="62"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".5"/><stop offset=".4" stop-color="#FFFFFF" stop-opacity=".12"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient></defs>';
  /* grosor en capas */
  for(var k=12;k>=1;k--){var dx=(k*.62).toFixed(2),dy=(k*.54).toFixed(2);g+='<g transform="translate('+dx+' '+dy+')">'+sil.map(function(p){var c=ISO.shade(p.c,.2+k*.022);return shape(p,c,p.d?c:null,1.4)}).join("")+'</g>'}
  sil.forEach(function(p,i){
   /* sombra suave que esta pieza proyecta sobre las de atrás */
   if(i>0)g+='<g filter="url(#sb'+u+')" opacity=".32"><g transform="translate(2.6 3)">'+shape(p,"#1A1410",p.d?"#1A1410":null,1)+'</g></g>';
   var dk=ISO.shade(p.c,.4),lt=ISO.tint(p.c,.62),sh=ISO.shade(p.c,.3),m=mat(p.c),gr=m==="metal"?"url(#sm"+p.c.replace("#","")+")":"url(#sg"+p.c.replace("#","")+")";
   if(p.d){var cid="sk"+u+"_"+i;
    g+='<clipPath id="'+cid+'"><path d="'+p.d+'"'+tr(p)+'/></clipPath>';
    g+='<path d="'+p.d+'"'+tr(p)+' fill="'+gr+'"'+(m==="glass"?' fill-opacity=".72"':'')+'/>';
    /* material: vetas de madera o reflejo diagonal del vidrio, recortados a la pieza */
    if(m==="wood"){var vt="";for(var y=-20;y<130;y+=6.5)vt+="M-30 "+y+"Q20 "+(y+3)+" 50 "+(y-1)+"T130 "+(y+2);g+='<g clip-path="url(#'+cid+')"><path d="'+vt+'"'+tr(p)+' fill="none" stroke="'+ISO.shade(p.c,.22)+'" stroke-width="1.1" opacity=".55"/></g>'}
    if(m==="glass")g+='<g clip-path="url(#'+cid+')"><path d="M-10 70L70 -10H86L6 70Z" fill="#FFFFFF" opacity=".42"/><path d="M8 84L88 4H94L14 84Z" fill="#FFFFFF" opacity=".3"/></g>';
    g+='<g clip-path="url(#'+cid+')"><g transform="translate(-2.4 -2.2)"><path d="'+p.d+'"'+tr(p)+' fill="none" stroke="'+sh+'" stroke-width="5" stroke-linejoin="round" opacity=".55"/></g>'+
     '<g transform="translate(2.2 2.4)"><path d="'+p.d+'"'+tr(p)+' fill="none" stroke="'+lt+'" stroke-width="4.5" stroke-linejoin="round" opacity=".85"/></g>'+
     '<rect x="-10" y="-10" width="124" height="124" fill="url(#ss'+u+')"/></g>'+(m!=="wood"?'<path d="'+p.d+'"'+tr(p)+' fill="url(#sh'+(m==="metal"?"m":"p")+')"/>':'');
    /* luz de rebote: borde claro fino abajo a la derecha, por dentro */
    g+='<g clip-path="url(#'+cid+')"><g transform="translate(-1.6 -1.6)"><path d="'+p.d+'"'+tr(p)+' fill="none" stroke="'+ISO.tint(p.c,.45)+'" stroke-width="1.6" stroke-linejoin="round" opacity=".55"/></g></g>';
    g+='<path d="'+p.d+'"'+tr(p)+' fill="none" stroke="'+dk+'" stroke-width="1.6" stroke-linejoin="round"/>'+
     (m!=="wood"?'<path d="'+p.d+'"'+tr(p)+' fill="url(#sh2)"/>':'')}
   else{var w=p.w,o=(w*.2).toFixed(2);if(m==="metal")gr="url(#sg"+p.c.replace("#","")+")";
    g+=shape(p,dk,null,2.4);g+=shape(p,gr);
    g+='<g transform="translate('+o+' '+o+')"><path d="'+p.l+'"'+tr(p)+' fill="none" stroke="'+sh+'" stroke-width="'+(w*.34).toFixed(2)+'" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/></g>';
    g+='<g transform="translate(-'+o+' -'+o+')"><path d="'+p.l+'"'+tr(p)+' fill="none" stroke="'+lt+'" stroke-width="'+(w*.3).toFixed(2)+'" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/></g>'}});
  /* detalles: con un borde fino para que los claros no se pierdan */
  P.forEach(function(p){if(!p.x)return;g+=p.w?'<path d="'+p.x+'"'+tr(p)+' fill="none" stroke="'+p.c+'" stroke-width="'+p.w+'" stroke-linecap="round" stroke-linejoin="round"/>':'<path d="'+p.x+'"'+tr(p)+' fill="'+p.c+'" stroke="'+ISO.shade(p.c,.25)+'" stroke-width=".8" stroke-linejoin="round"/>'});
  return g}
 function icon(id,v,size,o){o=o||{};return '<svg class="sy" width="'+size+'" height="'+size+'" viewBox="-6 -6 114 114" aria-hidden="true">'+draw(id,v,o.silo)+'</svg>'}
 var PICK={};try{PICK=JSON.parse(localStorage.getItem("vocatlas_simbolos")||"{}")||{}}catch(e){}
 function pick(id,v){if(v){PICK[id]=v;try{localStorage.setItem("vocatlas_simbolos",JSON.stringify(PICK))}catch(e){}}return PICK[id]||"a"}
 /* seis símbolos por carrera, uno por unidad: el suyo primero y luego objetos de su mundo */
 var SIX={
  medicina:"medicina.a medicina.b biomedica.a o_termometro.a o_bata.a enfermeria.b",enfermeria:"enfermeria.a o_suero.a o_curita.a o_cubrebocas.a o_termometro.a enfermeria.b",
  odontologia:"odontologia.a odontologia.b o_espejo.a o_pasta.a o_sonrisa.a o_cubrebocas.a",nutricion:"nutricion.a nutricion.b o_bascula.a o_cinta.a o_zanahoria.a o_vaso.a",
  psicologia:"psicologia.a psicologia.b o_divan.a o_libreta.a o_pensamiento.a sociologia.b",veterinaria:"veterinaria.a veterinaria.b o_perro.a o_gato.a o_collar.a medicina.a",
  fisioterapia:"fisioterapia.a fisioterapia.b o_muleta.a o_columna.a o_liga.a o_camilla.a",qfb:"qfb.a qfb.b o_blister.a o_gotero.a o_mortero.a quimica.b",
  educfisica:"educfisica.a educfisica.b o_cronometro.a o_trofeo.a o_tenis.a o_cono.a",biomedica:"biomedica.a biomedica.b o_protesis.a o_rayosx.a mecatronica.b electronica.a",
  civil:"civil.a civil.b mecanica.a arquitectura.a industrial.a mecanica.b",mecatronica:"mecatronica.a mecatronica.b electronica.a ia.a mecanica.a electrica.a",
  aeroespacial:"aeroespacial.a aeroespacial.b fisica.a mecanica.b electronica.a rrii.a",ambiental:"ambiental.a ambiental.b turismo.b electrica.a quimicaing.a biologia.b",
  industrial:"industrial.a industrial.b civil.a contaduria.a economia.a mecanica.b",mecanica:"mecanica.a mecanica.b industrial.a civil.a mecatronica.a aeroespacial.b",
  electrica:"electrica.a electrica.b electronica.a ambiental.b civil.a electronica.b",electronica:"electronica.a electronica.b electrica.b electrica.a computacion.a ia.a",
  quimicaing:"quimicaing.a quimicaing.b industrial.b quimica.a quimica.b civil.a",computacion:"computacion.a computacion.b electronica.a ia.a ciberseguridad.b datos.a",
  datos:"datos.a datos.b computacion.b contaduria.a actuaria.b actuaria.a",biotec:"biotec.a biotec.b biologia.a biologia.b quimica.a quimicaing.a",
  fisica:"fisica.a fisica.b aeroespacial.a electrica.a matematicas.a quimica.b",ia:"ia.a ia.b electronica.a computacion.b computacion.a datos.a",
  ciberseguridad:"ciberseguridad.a ciberseguridad.b computacion.a computacion.b criminologia.a electronica.a",quimica:"quimica.a quimica.b quimicaing.a biologia.a fisica.a biotec.a",
  biologia:"biologia.a biologia.b biotec.a ambiental.a veterinaria.a biotec.b",matematicas:"matematicas.a matematicas.b contaduria.a actuaria.a actuaria.b arquitectura.a",
  derecho:"derecho.a derecho.b politicas.a criminologia.a politicas.b educacion.b",negocios:"negocios.a negocios.b economia.a finanzas.a mercadotecnia.a sociologia.b",
  finanzas:"finanzas.a finanzas.b economia.b economia.a contaduria.a datos.b",educacion:"educacion.a educacion.b nutricion.a sociologia.a sociologia.b contaduria.a",
  contaduria:"contaduria.a contaduria.b finanzas.a economia.b negocios.a datos.b",economia:"economia.a economia.b finanzas.a politicas.a rrii.a actuaria.b",
  actuaria:"actuaria.a actuaria.b contaduria.a matematicas.a datos.a ciberseguridad.a",mercadotecnia:"mercadotecnia.a mercadotecnia.b sociologia.b economia.a comunicacion.a grafico.b",
  comext:"comext.a comext.b rrii.a aeroespacial.b economia.b turismo.a",turismo:"turismo.a turismo.b aeroespacial.b comext.a rrii.a gastronomia.a",
  politicas:"politicas.a politicas.b derecho.a mercadotecnia.a rrii.a sociologia.a",rrii:"rrii.a rrii.b aeroespacial.b politicas.a sociologia.b comext.a",
  sociologia:"sociologia.a sociologia.b trabajosocial.b datos.a educacion.a politicas.a",trabajosocial:"trabajosocial.a trabajosocial.b sociologia.a sociologia.b medicina.b politicas.a",
  criminologia:"criminologia.a criminologia.b derecho.a derecho.b ciberseguridad.a psicologia.a",arquitectura:"arquitectura.a arquitectura.b civil.a disindustrial.a disindustrial.b grafico.a",
  moda:"moda.a moda.b grafico.b mercadotecnia.b cine.b grafico.a",comunicacion:"comunicacion.a comunicacion.b mercadotecnia.a cine.b sociologia.b computacion.b",
  cine:"cine.a cine.b comunicacion.a animacion.a animacion.b comunicacion.b",grafico:"grafico.a grafico.b computacion.b mercadotecnia.b comunicacion.b arquitectura.a",
  disindustrial:"disindustrial.a disindustrial.b arquitectura.a industrial.a mecanica.a grafico.b",animacion:"animacion.a animacion.b grafico.b cine.a cine.b computacion.b",
  gastronomia:"gastronomia.a gastronomia.b nutricion.a nutricion.b ambiental.a mercadotecnia.b"};
 function six(id){return (SIX[id]||"").split(" ").filter(Boolean).map(function(k){var q=k.split(".");return {id:q[0],v:q[1]}})}
 /* símbolo k (0 a 5) de la carrera id, en el color del área de id */
 function unit(id,k,size,o){var q=six(id)[k];if(!q)return "";o=o||{};var c=byId[id]||{area:"neg"};return icon(q.id,q.v,size,{col:o.col||AREAC[c.area],silo:o.silo})}

 function names(id){var s=S[id];return s?s.n.split("|"):[]}
 return {icon:icon,six:six,unit:unit,pick:pick,names:names,list:list,has:function(id){return !!S[id]},AREAC:AREAC,variants:function(id){var s=S[id];return s?["a","b"].filter(function(v){return s[v]}):[]}};
})();
