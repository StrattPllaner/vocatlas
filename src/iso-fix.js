/* catálogos de prueba del generador: las 20 carreras reales y versiones de 50 y 120 con nombres reales de carreras */
var ISOFIX=(function(){
 var AREAS=[{id:"salud",name:"Salud",biome:"jardin"},{id:"ing",name:"Ingenierías",biome:"industria"},{id:"tec",name:"Tecnología y ciencias",biome:"vidrio"},{id:"neg",name:"Negocios y sociedad",biome:"ciudad"},{id:"arte",name:"Arte y comunicación",biome:"barrio"}];
 var SHORT={datos:"Datos",biotec:"Biotec",aeroespacial:"Aeroespacial",ambiental:"Ambiental",civil:"Civil",comunicacion:"Comunicación",arquitectura:"Arquitectura",veterinaria:"Veterinaria",computacion:"Computación",mecatronica:"Mecatrónica"};
 var REAL=[
  ["medicina","Medicina","salud","Clínica","#3F9C7A","cuerpo salud bio ayudar quimica"],["veterinaria","Veterinaria","salud","Clínica","#A5CF8E","animales bio salud agro naturaleza"],
  ["nutricion","Nutrición","salud","Bienestar","#8CC7A1","nutricion cocina cuerpo deportes salud ayudar"],["psicologia","Psicología","salud","Bienestar","#4BAAA3","mente ayudar escribir salud ensenar"],
  ["civil","Ing. Civil","ing","Construcción","#E8603C","construccion mate fisica lider ambiente"],["mecatronica","Mecatrónica","ing","Máquinas","#F2894F","robots code fisica autos mate videojuegos"],
  ["aeroespacial","Aeroespacial","ing","Máquinas","#D8574A","aviones espacio fisica mate robots"],["ambiental","Ing. Ambiental","ing","Energía","#EBA45A","ambiente energia naturaleza mar agro quimica"],
  ["computacion","Computación","tec","Software","#3F7DA6","code ia videojuegos juegos seguridad mate robots"],["datos","Ciencia de datos","tec","Software","#5BA3D0","datos mate ia code negocios dinero juegos"],
  ["biotec","Biotecnología","tec","Ciencias","#2D6A8A","bio quimica salud cuerpo agro ambiente"],["fisica","Física","tec","Ciencias","#6FA8DC","fisica mate espacio energia juegos"],
  ["derecho","Derecho","neg","Sociedad","#A8793A","leyes politica escribir lider idiomas historia"],["educacion","Educación","neg","Sociedad","#EAD06B","ensenar ayudar mente escribir idiomas lider"],
  ["negocios","Negocios","neg","Empresa","#F2B544","negocios lider dinero marketing viajes eventos"],["finanzas","Finanzas","neg","Empresa","#D98E3B","dinero mate datos negocios politica juegos"],
  ["arquitectura","Arquitectura","arte","Diseño","#B88AA8","construccion diseno dibujo mate ambiente"],["moda","Moda","arte","Diseño","#D98C9C","moda diseno dibujo belleza marketing"],
  ["comunicacion","Comunicación","arte","Medios","#9E86BF","marketing foto escribir cine idiomas diseno"],["cine","Cine","arte","Medios","#7C5C8E","cine foto musica teatro escribir dibujo videojuegos"]
 ].map(function(a){return {id:a[0],name:a[1],area:a[2],sub:a[3],color:a[4],tags:a[5].split(" "),short:SHORT[a[0]]}});
 /* nombres reales para las pruebas de escala; subárea y temas se reparten de forma fija */
 var MORE={
  salud:{subs:["Clínica","Bienestar","Cuidados"],tags:"cuerpo salud bio ayudar quimica mente deportes",n:["Enfermería","Odontología","Fisioterapia","Optometría","Químico farmacéutico","Biomedicina","Terapia ocupacional","Salud pública","Gerontología","Imagenología","Paramédico","Audiología","Terapia física","Partería","Podología","Trabajo social clínico","Toxicología","Genética médica","Medicina del deporte","Laboratorio clínico"]},
  ing:{subs:["Construcción","Máquinas","Energía"],tags:"construccion mate fisica robots energia autos ambiente",n:["Ing. Mecánica","Ing. Eléctrica","Ing. Industrial","Ing. Química","Ing. Petrolera","Ing. Naval","Ing. Minera","Ing. Biomédica","Ing. Automotriz","Ing. en Energías Renovables","Ing. Topográfica","Ing. Hidráulica","Ing. en Materiales","Ing. Electrónica","Ing. Agrónoma","Ing. en Alimentos","Ing. Geológica","Ing. en Logística","Ing. Textil","Ing. Forestal"]},
  tec:{subs:["Software","Ciencias","Datos"],tags:"code ia datos mate fisica bio quimica espacio",n:["Ciberseguridad","Inteligencia artificial","Ing. de software","Videojuegos","Matemáticas","Química","Biología","Astronomía","Actuaría","Geofísica","Nanotecnología","Bioinformática","Redes","Robótica","Estadística","Oceanografía","Ciencias de la Tierra","Ciencia cognitiva","Meteorología","Genómica"]},
  neg:{subs:["Sociedad","Empresa","Gobierno"],tags:"negocios dinero lider leyes politica idiomas ensenar",n:["Contaduría","Economía","Mercadotecnia","Administración","Relaciones internacionales","Ciencia política","Sociología","Turismo","Gastronomía","Comercio exterior","Recursos humanos","Pedagogía","Historia","Filosofía","Antropología","Criminología","Logística","Hotelería","Trabajo social","Geografía"]},
  arte:{subs:["Diseño","Medios","Escena"],tags:"diseno dibujo cine foto musica teatro escribir moda",n:["Diseño gráfico","Diseño industrial","Música","Teatro","Danza","Artes visuales","Fotografía","Animación","Periodismo","Letras","Diseño de interiores","Producción musical","Publicidad","Ilustración","Arte digital","Escenografía","Traducción","Conservación de arte","Diseño de modas","Locución"]}
 };
 var PAL={salud:["#3F9C7A","#4BAAA3","#8CC7A1","#5FB28E"],ing:["#E8603C","#F2894F","#D8574A","#EBA45A"],tec:["#3F7DA6","#5BA3D0","#2D6A8A","#6FA8DC"],neg:["#A8793A","#F2B544","#D98E3B","#EAD06B"],arte:["#B88AA8","#D98C9C","#9E86BF","#7C5C8E"]};
 function catalog(n){
  if(n<=20)return REAL.slice(0,n);
  var out=REAL.slice(),k=0,ids=["salud","ing","tec","neg","arte"];
  while(out.length<n){var a=ids[k%5],m=MORE[a],i=Math.floor(k/5);if(i>=m.n.length)break;var tg=m.tags.split(" ");
   out.push({id:a+"_"+i,name:m.n[i],area:a,sub:m.subs[i%m.subs.length],color:PAL[a][i%4],tags:[tg[i%tg.length],tg[(i*3+1)%tg.length],tg[(i*5+2)%tg.length]]});k++}
  return out;
 }
 return {AREAS:AREAS,catalog:catalog};
})();
