# Vocatlas · Currículo de carreras y revisión del test de intereses

Fecha: 14 de noviembre de 2026. Fase 1 del plan. **Nada de esto está programado todavía: espero tu aprobación.**

## 0. Lo que necesito que decidas

1. **Estructura de 21 lecciones por carrera** (sección 2). Si la apruebas, es la misma para las 20 carreras.
2. **Cuándo se gana el Rumbo de la carrera.** Hoy se gana al completar la carrera (4 lecciones). Con 21 lecciones eso tarda de una a dos horas. Propongo: el Rumbo se gana al terminar la unidad 2 (Pruébala) y el sello al terminar la unidad 6. Quien ya los ganó los conserva.
3. **Test de intereses** (sección 9). No pude obtener los reactivos oficiales en español: solo se entregan con una cuenta gratuita de desarrollador que debe registrar el dueño de la app. Necesito que te registres y me pases el acceso, o que me digas que dejo la estructura lista sin preguntas.
4. **Datos con fuente** (sección 6). No escribí ninguna cifra. Todas quedan como pendientes hasta verificarlas una por una; dime si las verifico yo en la fase 3 o si las llenas tú.
5. **Testimonios.** Quedan como plantilla. Hace falta entrevistar al menos a una persona por carrera.

## 1. Principios de diseño instruccional

- **Primero haces, luego te explico.** Cada dato llega después de que el estudiante apostó por una respuesta. Nunca hay dos tarjetas de solo lectura seguidas.
- **Una idea por lección.** Cada lección cierra con una idea clave de una línea.
- **Lo real antes que lo bonito.** La unidad 3 existe para que nadie elija una carrera por la versión de las series.
- **El estudiante se mide a sí mismo.** Al final de cada unidad contesta qué tanto le interesó y qué tan capaz se sintió. Con eso se arma su veredicto; no lo decide la app.
- **Sin datos inventados.** Si no hay cifra verificada, la tarjeta lo dice y enseña dónde buscarla.
- **Sesiones cortas.** Una lección dura de tres a cinco minutos y se puede dejar a la mitad.

## 2. Estructura común: 6 unidades, 21 lecciones

| Unidad | Lección | Parada | Actividad principal |
|---|---|---|---|
| **1. Conócela** | 1.1 Qué es y qué resuelve | Sello | Decisión en un escenario |
| | 1.2 A quién ayudas | Sello | Clasificar |
| | 1.3 Mitos y realidades | Sello | Verdadero o falso con revelación |
| | 1.4 Carreras parecidas | Sello | Emparejar y comparar |
| **2. Pruébala** | 2.1 a 2.4 Cuatro retos | Hexágono | Dinámica propia del área (sección 4) |
| **3. La realidad** | 3.1 Un día real | Pergamino | Armar un día |
| | 3.2 Lo difícil | Sello | Decisión en un escenario |
| | 3.3 Historia real | Pergamino | Testimonio (plantilla) con preguntas |
| | 3.4 ¿Quién lo disfruta? | Brújula | Reflexión personal |
| **4. El camino** | 4.1 Cuánto dura y qué estudias | Sello | Ordenar etapas |
| | 4.2 Cómo se entra | Sello | Verdadero o falso |
| | 4.3 Dónde, cuánto cuesta y becas | Sello | Adivinar un rango y ver la cifra |
| **5. El futuro** | 5.1 Dónde se trabaja | Sello | Emparejar |
| | 5.2 Sueldo y demanda | Sello | Adivinar un rango y ver la cifra |
| | 5.3 Cómo la cambia la tecnología | Brújula | Elegir entre dos caminos |
| | 5.4 Después de titularte | Sello | Elegir entre dos caminos |
| **6. Tu veredicto** | 6.1 Lo que sentiste | Brújula | Repaso de tus propias respuestas |
| | 6.2 Tu veredicto | Parada grande | Comparar carreras y decidir |

- **Cierre de unidad:** la última lección de cada unidad termina con las dos preguntas de autoevaluación y abre el cofre.
- **Duración:** 21 lecciones de 3 a 5 minutos dan entre 63 y 105 minutos por carrera.
- **Avance en el mapa:** la carrera se pinta en proporción a las 21 lecciones. Lo que ya hiciste se respeta: "Qué haces" cuenta como 1.1, el mini reto como 2.1 y tu calificación como 6.2.

### Anatomía de una lección (5 a 8 tarjetas)

1. **Gancho:** una situación o pregunta, máximo 40 palabras.
2. **Apuesta:** el estudiante responde antes de saber.
3. **Revelación:** qué pasa en la realidad y por qué.
4. **Segunda interacción**, con otra dinámica.
5. **Revelación o dato con fuente.**
6. **Idea clave**, una línea.
7. **Pregunta de interés:** "¿Te ves haciendo esto?" con tres respuestas: sí, no sé, no.

## 3. Tipos de tarjeta

| Tipo | Qué hace el estudiante | Campos en el catálogo |
|---|---|---|
| `escena` | Lee una situación corta | `texto`, `ilustracion` |
| `decision` | Elige qué haría | `pregunta`, `opciones[]` con `texto`, `consecuencia`, `mejor` |
| `vf` | Verdadero o falso | `afirmacion`, `respuesta`, `revelacion` |
| `rango` | Mueve un deslizador y ve la cifra | `pregunta`, `min`, `max`, `unidad`, `dato` (referencia a un dato con fuente) |
| `ordenar` | Acomoda pasos | `pasos[]` en el orden correcto, `revelacion` |
| `emparejar` | Une pares | `pares[]`, `revelacion` |
| `clasificar` | Manda cada elemento a su grupo | `grupos[]`, `elementos[]` con `grupo` |
| `dos_caminos` | Elige entre A y B, sin respuesta correcta | `a`, `b`, `que_dice_de_ti` |
| `armar_dia` | Coloca actividades en un horario | `bloques[]`, `actividades[]`, `dia_real` |
| `reflexion` | Contesta sobre sí mismo | `pregunta`, `escala` u `opciones[]` |
| `comparar` | Ve dos carreras lado a lado | `criterios[]` |
| `testimonio` | Lee una historia real | `persona`, `sorprendio`, `dificil`, `recomendaria`, `estado` |
| `dato` | Ve una cifra con su fuente | `dato` (referencia), o estado vacío |
| `clave` | Idea clave de la lección | `texto` |
| `interes` | "¿Te ves haciendo esto?" | fija |
| `autoevaluacion` | Interés y capacidad de la unidad | fija |

## 4. Dinámicas propias por área (unidad 2)

| Área | Dinámicas | Se construyen sobre |
|---|---|---|
| Salud | Triaje por urgencia, síntoma y estudio adecuado, ordenar un procedimiento, conversación con un paciente | `ordenar`, `emparejar`, `decision` encadenada |
| Ingenierías | Armar una estructura con piezas y límite de peso o presupuesto, encontrar la falla, optimizar costo contra seguridad | `armar` (nuevo), `decision`, `rango` doble |
| Tecnología y ciencias | Depurar un programa por bloques, encontrar el patrón en datos, elegir el experimento que prueba una hipótesis | `bloques` (nuevo), `patron` (nuevo), `decision` |
| Negocios y sociedad | Decidir con presupuesto limitado, negociar con argumentos, analizar un caso legal, priorizar tareas | `presupuesto` (nuevo), `decision` encadenada, `clasificar` |
| Arte y comunicación | Elegir el encuadre, componer moviendo elementos, decidir el mensaje para un público, criticar con criterios | `encuadre` (nuevo), `componer` (nuevo), `decision`, `clasificar` |

Son seis dinámicas nuevas que hay que programar: `armar`, `bloques`, `patron`, `presupuesto`, `encuadre` y `componer`. Las demás reutilizan tarjetas comunes.

## 5. Recorrido de las cinco carreras completas

Las tablas dan el contenido específico de cada lección. Las tarjetas palabra por palabra se escriben en la fase 3, cuando apruebes esto; al final de la sección hay dos lecciones completas como muestra del tono.

Lo que dice "dato" se llena solo con cifra verificada (sección 6). Los puntos marcados con (v) son afirmaciones sobre trámites o reglas que hay que confirmar en fuente oficial antes de publicarlas.

### 5.1 Medicina

| Lección | Contenido | Idea clave |
|---|---|---|
| 1.1 Qué es | Llega alguien con dolor de pecho: ¿qué haces primero? Preguntar, revisar, pedir estudios, decidir. | Medicina es decidir con información incompleta para cuidar a alguien. |
| 1.2 A quién ayudas | Clasificar casos: consulta, urgencias, quirófano, prevención en una comunidad, investigación. | No todo es hospital: también se previene y se investiga. |
| 1.3 Mitos | "Hay que ser de puro 10." "Todos terminan operando." "Si te impresiona la sangre, no puedes." "Sales ganando muy bien." | Pesa más la constancia que el promedio. |
| 1.4 Parecidas | Enfermería, Odontología, Nutrición, Fisioterapia, Psicología, Químico farmacobiólogo: quién diagnostica, quién cuida, quién rehabilita. | Hay muchas formas de trabajar en salud sin ser médico. |
| 2.1 Triaje | Cinco pacientes llegan a urgencias al mismo tiempo. Ordénalos por gravedad. | Lo urgente no siempre es lo que más grita. |
| 2.2 Síntoma y estudio | Unir cada caso con el estudio que más ayuda: electrocardiograma, radiografía, glucosa en sangre, biometría. | Un estudio se pide para contestar una pregunta. |
| 2.3 Procedimiento | Ordenar los pasos para curar una herida: lavado de manos, guantes, limpieza, cierre, indicaciones. | El orden evita infecciones. |
| 2.4 Hablar con el paciente | Una señora no quiere tomar su tratamiento. Eliges qué decir en tres turnos. | Escuchar también es parte del tratamiento. |
| 3.1 Un día real | Armar el día de un interno: pase de visita, consulta, guardia, clase, dormir. | Las guardias cambian tu rutina completa. |
| 3.2 Lo difícil | Decisiones con cansancio, dar malas noticias, años sin ingreso propio, materias pesadas como Anatomía, Bioquímica y Farmacología. | Es una carrera larga: se aguanta mejor con un porqué claro. |
| 3.3 Historia real | Plantilla de testimonio: estudiante en internado o médico recién egresado. | Pendiente de entrevista. |
| 3.4 ¿Quién lo disfruta? | ¿Aguantas estudiar mucho por años? ¿Te gusta tratar con gente en sus peores días? ¿Toleras no saber la respuesta? | Te debe gustar la gente, no solo la biología. |
| 4.1 Cuánto dura | Ordenar etapas: ciencias básicas, ciclos clínicos, internado, servicio social, título; después, especialidad (v). Duración: dato. | El título es apenas la mitad si quieres especialidad. |
| 4.2 Cómo se entra | Examen de admisión y promedio, cupo limitado; para especialidad existe un examen nacional (v). | Entrar es competido: se prepara con tiempo. |
| 4.3 Dónde y cuánto | Escuelas en tu estado, costo en pública y privada, becas: datos. | Pública o privada cambia el costo, no el esfuerzo. |
| 5.1 Dónde se trabaja | Emparejar: hospital público, consultorio propio, hospital privado, salud pública, investigación, docencia. | Muchos médicos combinan dos trabajos. |
| 5.2 Sueldo y demanda | Adivina el ingreso mensual promedio y cuántos trabajan en lo que estudiaron: datos. | El ingreso sube mucho con la especialidad, pero tarda. |
| 5.3 Tecnología | Telemedicina, análisis de imágenes con IA, expediente electrónico: ¿la usarías o desconfiarías? | La tecnología ayuda a decidir; la responsabilidad sigue siendo tuya. |
| 5.4 Después | Especialidad, maestría en salud pública, investigación o consultorio propio. | Al titularte eliges otra vez. |
| 6.1 Lo que sentiste | Tus respuestas de interés y capacidad en las cinco unidades, en una gráfica simple. | Lo que sentiste al probarla vale más que lo que imaginabas. |
| 6.2 Veredicto | Comparar con tus otras carreras y decidir: la guardo, la descarto o sigo en duda. | Decidir "en duda" también es avanzar. |

### 5.2 Computación

| Lección | Contenido | Idea clave |
|---|---|---|
| 1.1 Qué es | Una tiendita quiere vender por internet: ¿qué harías primero? Entender el problema, diseñar, programar, probar. | Programar es la última parte: primero se entiende el problema. |
| 1.2 A quién ayudas | Clasificar productos: una app de banco, un videojuego, el sistema de un hospital, un modelo de IA, la seguridad de una red. | Casi todas las industrias necesitan software. |
| 1.3 Mitos | "Es puro videojuego." "Hay que ser genio de mate." "Trabajas solo y callado." "Ya sé usar la compu, ya la hice." | Se trabaja en equipo y se aprende toda la vida. |
| 1.4 Parecidas | Ing. en software, Sistemas, Ciencia de datos, Mecatrónica, Diseño digital: quién teoriza, quién construye, quién analiza. | Los nombres cambian por escuela: revisa el plan de estudios. |
| 2.1 Depurar | Un robot debe llegar a la meta con bloques de avanzar y girar. El programa tiene un error: encuéntralo. | Depurar es buscar con método, no adivinar. |
| 2.2 Algoritmo | Ordenar los pasos para que una máquina haga un sándwich sin ambigüedades. | La computadora hace lo que dices, no lo que quieres. |
| 2.3 Buscar rápido | Adivina un número del 1 al 100 con el menor número de preguntas. | Una buena estrategia vale más que una máquina rápida. |
| 2.4 Diseñar para alguien | Una app para la cafetería de la escuela: tienes tiempo para tres funciones de ocho. | Decidir qué no hacer también es ingeniería. |
| 3.1 Un día real | Armar el día de una desarrolladora: reunión corta, programar, revisar código de otro, un error en producción. | Se lee y corrige más código del que se escribe. |
| 3.2 Lo difícil | Frustración de errores que duran horas, mucho tiempo sentado, actualizarse siempre, materias pesadas como Cálculo, Matemáticas discretas y Estructuras de datos. | La frustración es parte del trabajo diario. |
| 3.3 Historia real | Plantilla de testimonio: estudiante de últimos semestres o egresada con primer empleo. | Pendiente de entrevista. |
| 3.4 ¿Quién lo disfruta? | ¿Te gusta resolver acertijos? ¿Toleras equivocarte muchas veces? ¿Aprendes por tu cuenta? | Se disfruta si te gusta entender cómo funciona algo. |
| 4.1 Cuánto dura | Ordenar etapas: fundamentos y matemáticas, algoritmos, sistemas (bases de datos, redes), especialización y proyecto. Duración: dato. | Los primeros semestres son más matemáticas que programación. |
| 4.2 Cómo se entra | Examen de admisión con peso en matemáticas; no necesitas saber programar antes. | Se puede empezar de cero. |
| 4.3 Dónde y cuánto | Escuelas en tu estado, costo, becas: datos. | El portafolio de proyectos pesa junto con el título. |
| 5.1 Dónde se trabaja | Emparejar: empresa de software, banco, startup, gobierno, por tu cuenta y a distancia. | Se puede trabajar para otro país desde tu ciudad. |
| 5.2 Sueldo y demanda | Ingreso promedio y ocupación: datos. | La demanda es alta, pero piden demostrar lo que sabes hacer. |
| 5.3 Tecnología | Asistentes de IA que escriben código: ¿los usas para avanzar o prefieres entender todo tú? | Cambian las herramientas; entender el problema sigue siendo tuyo. |
| 5.4 Después | Maestría, certificaciones, emprender un producto o especializarte en seguridad, datos o IA. | Aquí se estudia siempre, con o sin posgrado. |
| 6.1 y 6.2 | Igual que en todas las carreras. | |

### 5.3 Derecho

| Lección | Contenido | Idea clave |
|---|---|---|
| 1.1 Qué es | A tu vecina no le devuelven el depósito de la renta: ¿qué harías? Leer el contrato, hablar, negociar, demandar. | El derecho resuelve conflictos con reglas; el juicio es el último recurso. |
| 1.2 A quién ayudas | Clasificar casos por materia: penal, civil, familiar, laboral, mercantil. | Hay muchas ramas y casi nadie las ejerce todas. |
| 1.3 Mitos | "Es memorizar leyes." "Todo es pelear en juicios como en las series." "Para ejercer hay que pasar un examen nacional" (v). "Hay que ser bueno para discutir." | Se trata de leer con cuidado y argumentar por escrito. |
| 1.4 Parecidas | Ciencias políticas, Criminología, Relaciones internacionales, Administración pública, Trabajo social. | Si te atrae la justicia, hay más de un camino. |
| 2.1 Analizar un caso | Compraste un celular usado y salió con reporte de robo. ¿Hubo contrato? ¿Quién responde? | Primero los hechos, luego la regla, al final la conclusión. |
| 2.2 Negociar | Representas a un inquilino. Eliges tres argumentos de seis para llegar a un acuerdo. | Un buen acuerdo evita un mal juicio. |
| 2.3 Redactar sin huecos | Tres versiones de una cláusula: elige la que no se presta a dos lecturas. | Una palabra ambigua puede costar un juicio. |
| 2.4 Los dos lados | El mismo caso desde la defensa y desde la acusación: ¿qué prueba le sirve a cada quien? | Defender a alguien no es estar de acuerdo con lo que hizo. |
| 3.1 Un día real | Armar el día de una pasante: juzgado, redactar un escrito, atender a un cliente, revisar expedientes. | Se lee y se escribe casi todo el día. |
| 3.2 Lo difícil | Trámites lentos, mucha lectura, clientes en crisis, empezar como pasante con poco sueldo, materias como Derecho procesal y Amparo. | Se avanza con paciencia y orden. |
| 3.3 Historia real | Plantilla de testimonio: pasante o abogada recién titulada. | Pendiente de entrevista. |
| 3.4 ¿Quién lo disfruta? | ¿Te gusta leer con lupa? ¿Te incomoda la injusticia? ¿Puedes defender una postura que no es la tuya? | Lo disfruta quien goza armar un buen argumento. |
| 4.1 Cuánto dura | Ordenar etapas: materias base (constitucional, civil, penal), procesales, especialidad, prácticas y servicio social, titulación. Duración: dato. | Las prácticas en un despacho o juzgado enseñan tanto como las clases. |
| 4.2 Cómo se entra | Examen de admisión con peso en lectura y redacción; requisitos de la escuela. | Leer mucho desde hoy es la mejor preparación. |
| 4.3 Dónde y cuánto | Escuelas en tu estado, costo, becas: datos. | Hay muchas escuelas: revisa que el programa tenga reconocimiento oficial (v). |
| 5.1 Dónde se trabaja | Emparejar: despacho, juzgado, fiscalía, notaría, empresa, gobierno, organización civil. | Litigar es solo una de las salidas. |
| 5.2 Sueldo y demanda | Ingreso promedio y ocupación: datos. | Es una carrera con muchos egresados: especializarte te distingue. |
| 5.3 Tecnología | Juicios en línea, búsqueda de precedentes con IA, contratos automáticos. | La máquina encuentra textos; decidir qué es justo sigue siendo humano. |
| 5.4 Después | Maestría, carrera judicial, notaría, despacho propio (v). | Varios caminos piden concursos o exámenes adicionales. |
| 6.1 y 6.2 | Igual que en todas las carreras. | |

### 5.4 Arquitectura

| Lección | Contenido | Idea clave |
|---|---|---|
| 1.1 Qué es | Una familia de cinco tiene un terreno pequeño: ¿qué preguntas primero? Cómo viven, cuánto tienen, dónde da el sol. | Se diseña para cómo vive la gente, no para la foto. |
| 1.2 A quién ayudas | Clasificar proyectos: casa, escuela, parque, restauración de un edificio viejo, interior de una tienda. | Un arquitecto también diseña ciudad y espacio público. |
| 1.3 Mitos | "Es dibujar bonito." "Es lo mismo que Ing. civil." "Hay que nacer sabiendo dibujar." "Solo diseñas casas." | El dibujo se aprende; lo esencial es pensar el espacio. |
| 1.4 Parecidas | Ing. civil, Diseño de interiores, Urbanismo, Diseño industrial, Arquitectura de paisaje. | El arquitecto decide el espacio; el ingeniero civil, que no se caiga. |
| 2.1 Componer una casa | Mueve cocina, sala, baño y dos recámaras en un terreno con una sola fachada a la calle. | Cada decisión mueve luz, privacidad y recorridos. |
| 2.2 El sol | Elige hacia dónde abren las ventanas en un clima caluroso y ve cómo queda la casa a mediodía. | La orientación es gratis y cambia todo. |
| 2.3 Presupuesto | Tres materiales para el mismo muro: costo, duración y temperatura. Tienes un tope. | Diseñar es elegir qué sacrificar. |
| 2.4 Criticar un espacio | Evalúa tu propio salón de clases con cuatro criterios: función, luz, circulación y contexto. | La crítica es con criterios, no con gustos. |
| 3.1 Un día real | Armar el día de un estudiante en semana de entrega: taller, maqueta, corrección, software, desvelo. | Las entregas marcan el ritmo de la carrera. |
| 3.2 Lo difícil | Desveladas, costo de materiales y de impresión, crítica pública de tu trabajo, materias como Estructuras y Taller de diseño. | Aprendes a que critiquen tu trabajo sin tomarlo personal. |
| 3.3 Historia real | Plantilla de testimonio: estudiante de taller avanzado o arquitecta en su primer despacho. | Pendiente de entrevista. |
| 3.4 ¿Quién lo disfruta? | ¿Te fijas en cómo están hechos los lugares? ¿Aguantas rehacer algo tres veces? ¿Te gusta trabajar con las manos y con la compu? | Lo disfruta quien no puede entrar a un lugar sin analizarlo. |
| 4.1 Cuánto dura | Ordenar etapas: representación y taller básico, construcción y estructuras, urbanismo e historia, prácticas, proyecto de titulación. Duración: dato. | El taller de diseño está en casi todos los semestres. |
| 4.2 Cómo se entra | Examen de admisión; algunas escuelas piden prueba de aptitud o dibujo (v). | No piden que ya dibujes perfecto. |
| 4.3 Dónde y cuánto | Escuelas en tu estado, costo, becas y gasto en materiales: datos. | Además de la colegiatura, cuenta materiales y computadora. |
| 5.1 Dónde se trabaja | Emparejar: despacho, constructora, gobierno, interiorismo, modelado digital, restauración, por tu cuenta. | Muchos empiezan dibujando proyectos de otros. |
| 5.2 Sueldo y demanda | Ingreso promedio y ocupación: datos. | El ingreso crece con experiencia y con clientes propios. |
| 5.3 Tecnología | Modelado en 3D, recorridos virtuales, imágenes generadas con IA: ¿herramienta o atajo? | La imagen la hace una máquina; el criterio, tú. |
| 5.4 Después | Maestría, especializarte en sustentabilidad o restauración, perito o director de obra (v), despacho propio. | Firmar una obra pide requisitos adicionales. |
| 6.1 y 6.2 | Igual que en todas las carreras. | |

### 5.5 Veterinaria

| Lección | Contenido | Idea clave |
|---|---|---|
| 1.1 Qué es | Llega un perro que no come desde ayer y su dueño está nervioso: ¿qué haces primero? Tu paciente no habla. | Atiendes al animal y también a la persona que lo trae. |
| 1.2 A quién ayudas | Clasificar: mascotas, animales de granja, fauna silvestre, revisar que la carne y la leche sean seguras, laboratorio. | No todo es perros y gatos: también es lo que comemos. |
| 1.3 Mitos | "Es jugar con perritos." "Solo se atienden mascotas." "Con amar a los animales basta." "Es una medicina más fácil." | Amar a los animales ayuda, pero no alcanza. |
| 1.4 Parecidas | Biología, Agronomía, Zootecnia, Medicina, Biotecnología. | El veterinario cura y también cuida la producción de alimentos. |
| 2.1 Triaje | Sala de espera: un atropellado, un golpe de calor, una vacuna, un gato que no orina, un cachorro con diarrea. Ordena. | Cada especie avisa distinto que está grave. |
| 2.2 Síntoma y estudio | Unir caso con estudio: radiografía, análisis de sangre, de heces, ultrasonido. | Sin palabras del paciente, los estudios hablan por él. |
| 2.3 Hablar con el dueño | El tratamiento cuesta más de lo que la familia puede pagar. Eliges qué decir en tres turnos. | Ser honesto con los costos es parte del cuidado. |
| 2.4 Algo pasa en la granja | Las gallinas ponen menos huevo. Revisa alimento, agua, luz y temperatura: encuentra la causa. | En producción se cuida al grupo, no solo al individuo. |
| 3.1 Un día real | Armar el día en una clínica: consultas, una cirugía, una urgencia, limpiar, llamar a dueños. | Hay más limpieza y papeleo de lo que parece. |
| 3.2 Lo difícil | Eutanasia, mordidas y rasguños, dueños que no pueden pagar, trabajo en campo, materias como Anatomía comparada y Farmacología. | Vas a ver animales sufrir y no siempre podrás salvarlos. |
| 3.3 Historia real | Plantilla de testimonio: estudiante en prácticas o veterinario de clínica o de campo. | Pendiente de entrevista. |
| 3.4 ¿Quién lo disfruta? | ¿Aguantas olores, sangre y suciedad? ¿Puedes dar una mala noticia? ¿Te ves trabajando en un rancho? | Te deben interesar los animales también cuando no son tiernos. |
| 4.1 Cuánto dura | Ordenar etapas: ciencias básicas de varias especies, medicina y zootecnia por especie, prácticas clínicas y de campo, servicio social. Duración: dato. | Estudias varias especies, no una sola. |
| 4.2 Cómo se entra | Examen de admisión con peso en biología y química; cupo según la escuela. | Biología y química de prepa sí se usan. |
| 4.3 Dónde y cuánto | Escuelas en tu estado, costo, becas: datos. | Fíjate si la escuela tiene hospital y prácticas de campo. |
| 5.1 Dónde se trabaja | Emparejar: clínica, rancho, rastro e inocuidad de alimentos, laboratorio, zoológico, gobierno, industria farmacéutica. | La clínica de mascotas es solo una parte del empleo. |
| 5.2 Sueldo y demanda | Ingreso promedio y ocupación: datos. | El ingreso varía mucho según la rama. |
| 5.3 Tecnología | Collares con sensores, telemedicina veterinaria, análisis de imágenes. | Los datos ayudan a detectar antes; revisar al animal sigue siendo a mano. |
| 5.4 Después | Especialidad por especie, maestría en producción o salud pública, clínica propia. | Poner tu clínica pide saber de negocio. |
| 6.1 y 6.2 | Igual que en todas las carreras. | |

### 5.6 Muestra de tono: lección 2.1 de Medicina, tarjeta por tarjeta

1. **Escena.** "Son las 2 de la mañana en urgencias. Eres la única persona de guardia y acaban de entrar cinco pacientes al mismo tiempo."
2. **Ordenar.** "¿A quién atiendes primero? Acomódalos." Señor de 60 con dolor en el pecho y sudor frío · Niña con fiebre que juega con un celular · Joven con el tobillo torcido · Señora que no puede respirar bien · Hombre con una cortada en la mano que ya no sangra.
3. **Revelación.** "Primero quien no puede respirar y quien tiene dolor de pecho: su vida corre peligro en minutos. La cortada y el tobillo pueden esperar aunque duelan más."
4. **Verdadero o falso.** "El paciente que más se queja es el más grave." Falso: "Quien puede gritar, respira. A veces el más grave es el más callado."
5. **Decisión.** "La mamá de la niña te reclama porque llegó antes que el señor. ¿Qué le dices?" Tres opciones con su consecuencia.
6. **Idea clave.** "Lo urgente no siempre es lo que más grita."
7. **Interés.** "¿Te ves tomando decisiones así?"

### 5.7 Muestra de tono: lección 2.1 de Computación

1. **Escena.** "Este robot debe llegar a la bandera. Alguien ya escribió el programa, pero el robot termina en el agua."
2. **Bloques.** Programa: avanzar 2 · girar a la derecha · avanzar 3 · girar a la derecha · avanzar 1. "Corre el programa y mira dónde falla."
3. **Decisión.** "¿Cuál bloque cambiarías?" El estudiante toca un bloque y elige su reemplazo.
4. **Revelación.** "El segundo giro era a la izquierda. El error estaba en un solo bloque, pero se notó tres pasos después."
5. **Verdadero o falso.** "Un buen programador casi no comete errores." Falso: "Todos se equivocan todo el día. Lo que cambia es qué tan rápido encuentran el error."
6. **Idea clave.** "Depurar es buscar con método, no adivinar."
7. **Interés.** "¿Te ves buscando errores así?"

## 6. Datos y fuentes

Cada cifra vive en el catálogo como un dato separado, con valor, unidad, fuente, enlace y fecha de consulta. Una tarjeta nunca trae el número escrito: apunta al dato. Si el dato está pendiente, la tarjeta muestra: "Todavía no tenemos esta cifra verificada. Puedes buscarla en" y el nombre de la fuente.

| Dato por carrera | Fuente sugerida | Estado hoy |
|---|---|---|
| Ingreso mensual promedio | Compara Carreras, IMCO | Pendiente |
| Tasa de ocupación e informalidad | Compara Carreras, IMCO | Pendiente |
| Número de profesionistas y distribución por sexo | Observatorio Laboral, STPS | Pendiente |
| En qué trabajan los egresados | Observatorio Laboral, STPS | Pendiente |
| Matrícula y egresados por estado | Anuarios estadísticos de ANUIES | Pendiente |
| Duración del plan y etapas | Sitio oficial de cada universidad | Pendiente |
| Requisitos y examen de admisión | Sitio oficial de cada universidad | Pendiente |
| Costo en pública y privada | Sitio oficial de cada universidad | Pendiente |
| Escuelas por estado | ANUIES y sitios oficiales | Pendiente |
| Becas | Sitios oficiales de gobierno y universidades | Pendiente |

No consulté estas fuentes todavía: verificar 10 datos de 20 carreras es trabajo de la fase 3 y lo haré dato por dato, guardando el enlace y la fecha. Lo que no pueda verificar se queda pendiente.

### Testimonios

Plantilla por carrera: quién es (nombre de pila, etapa, tipo de escuela, estado), qué te sorprendió, qué fue lo más difícil, a quién se la recomendarías y a quién no. Estado: sin entrevista. La lección 3.3 se muestra como "Llega pronto" hasta tener una historia real con permiso de quien la cuenta.

## 7. Las otras 15 carreras: estructura lista para llenarse

Usan las mismas 21 lecciones. Esta tabla fija lo que cambia: el mito principal de 1.3, los cuatro retos de la unidad 2 y las carreras parecidas de 1.4. Falta escribir sus tarjetas.

| Carrera | Mito principal | Retos 2.1 a 2.4 | Parecidas |
|---|---|---|---|
| Nutrición | "Es hacer dietas para bajar de peso" | Armar un plato con límites · Leer una etiqueta · Entrevistar a un paciente · Menú para un comedor con presupuesto | Medicina, Gastronomía, Química de alimentos |
| Psicología | "Es leer la mente o dar consejos" | Escuchar sin aconsejar (conversación) · Distinguir observación de interpretación · Elegir el tipo de apoyo adecuado · Diseñar una encuesta sin preguntas tramposas | Psiquiatría, Trabajo social, Pedagogía |
| Ing. Civil | "Es lo mismo que Arquitectura" | Armar un puente con piezas y peso límite · Encontrar la falla en un muro · Costo contra seguridad · Planear el orden de una obra | Arquitectura, Topografía, Ing. ambiental |
| Mecatrónica | "Es armar robots todo el día" | Encontrar la falla en un circuito · Programar un brazo por bloques · Elegir sensor para cada tarea · Optimizar una línea de producción | Mecánica, Electrónica, Computación |
| Aeroespacial | "Solo sirve para ser astronauta" | Diseñar un ala entre peso y sustentación · Encontrar la falla antes del despegue · Planear una órbita con combustible limitado · Elegir materiales | Mecánica, Aeronáutica, Física |
| Ing. Ambiental | "Es plantar árboles" | Encontrar de dónde viene la contaminación de un río · Planta de tratamiento con presupuesto · Costo contra impacto · Priorizar acciones en una ciudad | Biología, Ing. civil, Ing. química |
| Ciencia de datos | "Es hacer gráficas bonitas" | Encontrar el patrón · Detectar la gráfica engañosa · Elegir qué dato falta · Hipótesis y experimento | Computación, Actuaría, Estadística |
| Biotecnología | "Es clonar cosas" | Hipótesis y experimento · Ordenar un protocolo de laboratorio · Encontrar la contaminación · Decidir si un producto sale al mercado | Biología, Química, Ing. en alimentos |
| Física | "Solo sirve para dar clases" | Estimar sin medir · Hipótesis y experimento · Encontrar el error en una medición · Elegir el modelo que explica los datos | Matemáticas, Ingenierías, Astronomía |
| Educación | "Es cuidar niños" | Planear una clase de 20 minutos · Explicar lo mismo de tres formas · Resolver un conflicto en el salón · Diseñar una evaluación justa | Pedagogía, Psicología, Trabajo social |
| Negocios | "Es para ser jefe" | Presupuesto limitado para abrir un puesto · Priorizar tareas de la semana · Negociar con un proveedor · Poner precio | Finanzas, Mercadotecnia, Contaduría |
| Finanzas | "Es para hacerse rico rápido" | Armar un presupuesto personal · Riesgo contra rendimiento · Detectar una estafa · Decidir un crédito | Contaduría, Economía, Actuaría |
| Moda | "Es dibujar vestidos" | Componer un atuendo para un cliente · Costear una prenda · Elegir tela para un uso · Criticar una colección con criterios | Diseño gráfico, Diseño industrial, Mercadotecnia |
| Comunicación | "Es salir en la tele" | Mensaje de una campaña para un público · Verificar una noticia · Titular sin engañar · Entrevistar eligiendo preguntas | Periodismo, Mercadotecnia, Cine |
| Cine | "Es ser director famoso" | Elegir el encuadre · Ordenar una escena en el montaje · Presupuesto de un cortometraje · Criticar una escena con criterios | Comunicación, Animación, Artes visuales |

## 8. Formato del catálogo

El contenido vive en archivos de datos separados del código: uno por carrera (`datos/carreras/medicina.json`) y uno de cifras (`datos/cifras.json`). La app los carga cuando abres la carrera y los guarda para usarse sin conexión.

```json
{
  "id": "medicina",
  "version": 1,
  "unidades": [
    {
      "id": "u2", "titulo": "Pruébala",
      "lecciones": [
        {
          "id": "2.1", "titulo": "Triaje", "parada": "hexagono", "minutos": 4,
          "tarjetas": [
            {"tipo": "escena", "texto": "Son las 2 de la mañana en urgencias..."},
            {"tipo": "ordenar", "pregunta": "¿A quién atiendes primero?", "pasos": ["...", "..."], "revelacion": "..."},
            {"tipo": "vf", "afirmacion": "...", "respuesta": false, "revelacion": "..."},
            {"tipo": "clave", "texto": "Lo urgente no siempre es lo que más grita."},
            {"tipo": "interes"}
          ]
        }
      ]
    }
  ]
}
```

```json
{
  "medicina.ingreso": {"valor": null, "unidad": "MXN al mes", "fuente": "Compara Carreras, IMCO", "url": null, "consultado": null, "estado": "pendiente"}
}
```

Un script revisará antes de publicar: máximo de palabras por tarjeta, que no haya dos tarjetas de lectura seguidas, que cada lección cierre con idea clave y pregunta de interés, y que ningún número aparezca escrito fuera de `cifras.json`.

## 9. Test de intereses: revisión de la licencia

Revisé el sitio oficial del O*NET Resource Center el 14 de noviembre de 2026. No soy abogado: esto es mi lectura de las páginas.

**Qué existe**

- El O*NET Interest Profiler tiene una versión corta de 60 preguntas y una mini de 30.
- En español se ofrece a través de Mi Próximo Paso. Las preguntas en español de 30 y de 60 se entregan por los servicios web de O*NET, que piden registrarse en un programa gratuito de desarrolladores.
- El único archivo descargable que encontré es el cuestionario de 60 preguntas en inglés, en PDF. No encontré una descarga oficial de los reactivos en español.

**Qué pide la licencia de las herramientas**

- Hay dos opciones. Para copiar el instrumento tal cual: Creative Commons Atribución-SinDerivadas 4.0. Para modificarlo o construir sobre él: la O*NET Tools Developer License.
- En ambas hay que dar crédito a las O*NET Career Exploration Tools y al Departamento del Trabajo de Estados Unidos (USDOL/ETA), enlazar la licencia y mostrar que O*NET® es marca registrada de USDOL/ETA.
- "O*NET" se usa como adjetivo y con el símbolo ®. No se puede dar a entender que USDOL/ETA respalda la app.
- Con la licencia de desarrollador, si se modifica el contenido o se usa solo una parte, hay que avisarlo al usuario, enlazar una descripción de los cambios desde la pantalla de inicio del test y hacer un estudio de validación. Cambiar solo el software para integrarlo no cuenta como modificación.
- Registrar el uso de las herramientas es opcional.

**Qué piden los términos de los servicios web**

- Registrarse y usar el servicio solo en sitios propios registrados.
- No alterar la información y mostrar cerca de ella un enlace visible a O*NET Web Services.
- Límite de 5 solicitudes por segundo y 50,000 al día.
- Los términos no dicen si las preguntas se pueden guardar dentro de la app.

**Lo que esto significa para Vocatlas**

- **No tengo los reactivos en español.** No los voy a inventar ni a traducir del inglés: una traducción propia sería una versión modificada y pediría validación. Dejo lista la estructura para cargarlos.
- **Mostrar una pregunta por pantalla con nuestro diseño** es integración de software; el texto y la escala de respuesta quedan intactos.
- **Recomendar carreras de Vocatlas a partir del resultado** es un agregado nuestro, no parte del instrumento. Lo presentaré separado y con su aviso. Queda la duda de si esto obliga al estudio de validación de la licencia de desarrollador; conviene preguntarlo a O*NET por escrito.
- **Vocatlas no tiene servidor.** Una clave de servicios web no se puede esconder en una página estática. Hay dos caminos: descargar las preguntas una vez con tu cuenta e incluirlas en el catálogo con su atribución, o montar un intermediario pequeño que guarde la clave.

**Lo que necesito de ti**

1. Que te registres en el programa de desarrolladores de O*NET Web Services con el sitio de Vocatlas.
2. Que confirmes con ellos, por correo, si puedes guardar las preguntas en español dentro de la app y si recomendar carreras propias exige validación.

Mientras tanto, en la fase 4 puedo construir todo el test (pantallas, pausa y retoma, puntajes, resultados, historial) con el banco de preguntas vacío.

## 10. Qué habría que validar con estudiantes reales

- Si 21 lecciones se sienten como un recorrido o como tarea.
- Si las preguntas de "qué tan capaz te sentiste" desaniman a quien le fue mal en un reto.
- Si los retos de la unidad 2 se entienden sin instrucciones.
- Si la unidad 3 asusta de más o informa.
- Si ganar el Rumbo al terminar la unidad 2 motiva a seguir o hace que abandonen ahí.

## Fuentes

- [O*NET Interest Profiler](https://www.onetcenter.org/IP.html)
- [Licencia de las Career Exploration Tools](https://www.onetcenter.org/license_tools.html)
- [O*NET Tools Developer License](https://www.onetcenter.org/license_toolsdev.html)
- [Servicios web del Interest Profiler](https://services.onetcenter.org/ip)
- [Referencia de Mi Próximo Paso](https://services.onetcenter.org/reference/mpp/ip)
- [Términos de los servicios web](https://services.onetcenter.org/terms)
