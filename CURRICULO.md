# Vocatlas · Currículo de carreras, versión 2

Fecha: 21 de noviembre de 2026. Reemplaza la versión del 14 de noviembre. **Nada de esta versión está programado todavía: espero tu aprobación.**

Esta versión cambia tres cosas:
- Cada lección sigue los ingredientes que la investigación sobre orientación vocacional ha encontrado que sí funcionan.
- Ya no todo es texto: hay explicaciones animadas, video, interactivos y audio.
- Rumbo habla.

Lo que sigue vigente de la versión anterior está al final, en los anexos: las dinámicas por área, las otras carreras, el test de intereses y las fuentes.

## 0. Lo que necesito que decidas

1. **¿21 lecciones o 9 paradas en Medicina?** Pediste aplicarlo "a las 21 lecciones de Medicina". Hoy Medicina tiene 9 paradas en el formato 2 (20 de noviembre): una tarjeta de entrada, 7 lecciones de explicación con casos y un examen final de 10 preguntas.
   - **Propuesta:** volver a 21 lecciones en 6 unidades y reutilizar todo el contenido del formato 2 dentro de ellas (sección 9).
   - Si prefieres conservar las 9 paradas, la misma estructura de pasos aplica; solo cambia cuántas lecciones hay.
2. **Claridad.** El mapa ya muestra un anillo de "Claridad" en porcentaje, que se calcula con tu avance.
   - **Propuesta:** que la escala nueva del 1 al 5, al empezar y al terminar cada carrera (sección 7), se muestre en el Atlas por carrera.
   - El anillo se queda como está.
3. **Texto de Rumbo siempre visible.** El globo con lo que dice Rumbo sale siempre, por accesibilidad. La investigación sobre aprendizaje con multimedia encontró que repetir en pantalla, palabra por palabra, lo que se narra puede distraer.
   - **Propuesta:** el globo muestra frases cortas, el estudiante avanza a su ritmo, y hay un botón para ocultar el globo cuando hay sonido.
4. **Dónde guardar los videos.** No conviene meterlos al repositorio: GitHub Pages limita cada sitio publicado a 1 GB y recomienda no pasar de 100 GB de descarga al mes.
   - **Propuesta:** un servicio de video que entregue la calidad según la conexión. Lo eliges tú cuando haya videos; mientras, el componente queda listo con su estado vacío.
5. **Revisión médica.** ¿Quién revisa? Necesito un nombre o un rol (por ejemplo, un médico general con cédula) para la lista de la sección 9.4.

## 1. Principios de orientación (base en evidencia)

| Principio | Qué dice la evidencia | Cómo se ve en Vocatlas |
|---|---|---|
| Ejercicios escritos sobre uno mismo | Uno de los cinco ingredientes que más efecto tienen en las intervenciones de elección de carrera (Brown y Ryan Krane, 2000; Brown et al., 2003; replicado por Whiston et al., 2017) | Cada lección cierra con dos preguntas sobre el estudiante; hay respuestas abiertas cortas en las unidades 3 y 6 |
| Retroalimentación personalizada | Mismo grupo de ingredientes | La respuesta de Rumbo cambia según lo que eligió y según sus reflexiones anteriores |
| Información del mundo laboral | Mismo grupo de ingredientes; la OCDE encontró que explorar ocupaciones y tener un plan claro durante la secundaria se asocia con mejores resultados laborales años después (OCDE, 2021) | Cifras con fuente y fecha de `cifras.json`, y la tarjeta de mito contra realidad |
| Modelos a seguir | Mismo grupo de ingredientes; en la teoría sociocognitiva, ver a alguien parecido lograrlo aumenta la confianza (Lent, Brown y Hackett, 1994) | Voz real en video o audio: jóvenes de escuelas públicas y privadas y de distintos estados |
| Apoyo de su red | Mismo grupo de ingredientes | Actividad "Platícalo": una pregunta para hacerle a alguien de confianza, y después anota qué le dijeron |
| Avance realista | La OCDE recomienda corregir expectativas poco realistas desde la escuela | Unidad 3 "La realidad", con lo bueno y lo difícil |
| Confianza por logros | En la teoría sociocognitiva, la experiencia de lograr algo es la fuente más fuerte de confianza | Mini prácticas con dificultad que sube poco a poco; el error se repasa, no se castiga |
| Los retos solos no bastan | En los metaanálisis, el efecto viene de combinar ingredientes, no de uno solo | Ninguna práctica va sola: siempre la acompañan reflexión, un dato real o una persona real |
| Recuerdo y repaso | Recordar lo aprendido (más que releerlo) mejora la memoria a largo plazo (Roediger y Karpicke, 2006), sobre todo con repasos espaciados (Cepeda et al., 2006) | Al volver a la app, dos preguntas rápidas de lo visto antes; se suma al repaso de lo fallado que ya existe |

Sobre las lecciones cortas: no encontré un metaanálisis sólido que mida su efecto en orientación vocacional. Por eso cada lección dura de 3 a 5 minutos por diseño (sesiones que caben en un recreo), no porque haya evidencia de que lo corto funcione mejor. Hay que medirlo con estudiantes (sección 7).

## 2. Estructura de cada lección

Entre seis y ocho pasos. Los formatos rotan para que dos lecciones seguidas no se sientan iguales.

| Paso | Qué hace el estudiante | Obligatorio |
|---|---|---|
| **Gancho** | Una escena concreta que lo pone en el lugar del profesionista. Máximo 40 palabras, o una ilustración narrada | Sí |
| **Decisión** | Elige qué haría; cada opción tiene su consecuencia | Una interacción es obligatoria: decisión o mini práctica |
| **Revelación** | Qué pasa en la vida real; con dato verificado y su fuente cuando aplica | Sí |
| **Mito contra realidad** | Una afirmación común que se confirma o se corrige | No |
| **Mini práctica** | Un reto un poco más difícil que el de la lección anterior | Ver "Decisión" |
| **Voz real** | Testimonio corto en video o audio, con transcripción | No (al menos uno por unidad) |
| **Reflexión** | "¿Cómo te sentiste haciendo esto?" (cinco caritas) y "¿Te ves haciéndolo cada día?" (1 a 5) | **Sí, siempre al final** |
| **Idea clave** | Una línea | Sí |

**Reglas que revisa un script antes de publicar**
- Nunca más de dos pasos seguidos de solo texto.
- Al menos un formato que no sea texto por lección.
- Gancho, una interacción, revelación y reflexión en cada lección.
- Ningún número escrito fuera de `cifras.json`.
- Máximo 40 palabras por paso de texto.

**Retroalimentación personalizada.** Rumbo responde según:
- La opción que eligió el estudiante.
- Su reflexión: si dijo que se sintió mal pero contestó bien, se lo hace notar.
- El patrón de la unidad: si le gustan las prácticas pero no la realidad, se lo dice en 6.1.

## 3. Formatos multimedia

Regla: cada lección tiene al menos un formato que no es texto, elegido según lo que mejor explica ese contenido.

### a) Explicación animada narrada por Rumbo

Sirve para explicar procesos paso a paso.

- **Cómo se hace:** se construye dentro de la app con las ilustraciones del sistema de #art, en SVG animado por etapas. No es video.
- **Duración:** de 30 a 60 segundos en total, en 3 a 6 etapas.
- **Narración:** Rumbo narra cada etapa con una o dos frases.
- **Controles:** pausa, etapa anterior, etapa siguiente y repetir. La barra de avance va marcada por etapas.
- **Al final:** una pregunta sobre el proceso.
- **Sin sonido:** cada etapa muestra su frase en el globo de Rumbo y avanza al tocar.
- **Catálogo:** el guion vive en `datos/guiones/<carrera>.json`, separado del código:

```json
{"id": "med-urgencias", "titulo": "El recorrido de un paciente en urgencias", "revisar": "medico",
 "etapas": [
  {"escena": "llegada", "dice": "Llega alguien a urgencias. Lo primero no es la fila: es ver qué tan grave está."},
  {"escena": "triaje", "dice": "En el triaje lo clasifican por riesgo. El que no respira bien pasa antes que el que grita."}
 ],
 "pregunta": {"texto": "¿Qué decide quién pasa primero?", "opciones": ["Quién llegó antes", "Quién tiene más riesgo", "Quién se queja más"], "correcta": 1}}
```

### b) Video real

Sirve para testimonios, un día real y lugares de trabajo.

- **Formato:** vertical, de 30 a 90 segundos.
- **Subtítulos:** siempre activados, en archivo WebVTT.
- **Controles:** miniatura, velocidad (0.75×, 1×, 1.25× y 1.5×) y botón "Leer la transcripción".
- **Carga:** el video se descarga solo cuando el estudiante lo abre, en la calidad que permita la conexión.
- **Sin video todavía:** se muestra un estado vacío con la ilustración del lugar, Rumbo y el texto "Este video llega pronto". Nunca se muestra un hueco.
- **Permisos:** no se usan videos de terceros. Si en algún caso propongo incrustar uno público, te diré cuál y con qué permiso, y esperaré tu aprobación.

### c) Interactivos visuales

- **Diagrama que se toca para descubrir sus partes:** el corazón, el cuerpo humano, un circuito, el plano de una casa.
- **Línea de tiempo arrastrable:** los semestres de la carrera o un día de trabajo.
- **Comparador visual de cifras:** barras con cifras de `cifras.json`, como en "¿Cuánto ganan?".
- **Ritmo:** tocar al compás. En Medicina se usa para el ritmo de la RCP.

### d) Audio

Frases de testimonios en audio, de 10 a 20 segundos, siempre con su transcripción. Se graban junto con el video, o por teléfono si la persona no quiere salir a cuadro.

## 4. Rumbo habla

- **Cuándo habla:**
  - Presenta cada lección.
  - Narra las explicaciones animadas.
  - Da la retroalimentación.
  - Acompaña la reflexión final.
- **Cómo habla:** frases cortas, en español de México, tuteando, cálido y sin sonar a comercial. Ejemplo: "Escogiste escuchar primero. Así empiezan casi todos los diagnósticos."
- **Globo y boca:** mientras habla aparece un globo con el texto. Su boca se mueve con 5 formas: cerrada, entreabierta, abierta, redonda (o, u) y ancha (e, i).
- **Cómo se sincroniza la boca:**
  - Con la voz del navegador, la boca sigue los avisos de palabra de la voz. Cada palabra se parte en sílabas y a cada vocal le toca su forma.
  - Algunas voces de Android no mandan esos avisos. En ese caso la boca se mueve con un ritmo calculado por el largo del texto.
  - Con audios grabados, la boca seguirá el volumen real del audio.
- **Manos:** gesticula con las manos que ya tiene (señalar, abrir, contar con los dedos) según la etiqueta de cada frase.
- **Voz por ahora:** la síntesis de voz del navegador (Web Speech API). Elige la mejor voz en español de México que haya en el dispositivo, prefiriendo las de mayor calidad. Si no hay, usa otra voz en español.
- **Para cambiar a audios grabados:** cada línea de diálogo tiene un `id` y su texto en el catálogo. Si existe `media/voz/<id>.mp3`, se usa ese audio con el mismo texto como subtítulo; si no, se usa la voz del navegador.
- **Nunca arranca solo:** el sonido empieza solo después de que el estudiante toca algo, como piden los navegadores.
- **Controles:**
  - Botón de silenciar siempre visible; la preferencia se guarda en el dispositivo.
  - Velocidad de voz ajustable (lenta, normal o rápida).
  - Botón "Saltar" en cada narración.
- **Accesibilidad:** todo lo que dice Rumbo se puede leer. Hay un historial de lo que dijo en la lección, para quien está en un lugar sin audio o tiene discapacidad auditiva.

## 5. Contenido y datos

- No se inventan cifras, sueldos, costos, porcentajes ni testimonios. Cada dato va con fuente y fecha en `datos/cifras.json`; si falta, se queda pendiente y la tarjeta lo dice.
- Los guiones de las explicaciones animadas y todo lo que dice Rumbo van en el catálogo (`datos/guiones/`), separados del código, para que tú y un profesional del área los revisen.
- Cada tarjeta o guion lleva una marca de revisión:
  - `medico`: lo revisa un profesional del área.
  - `oficial`: se confirma en una fuente oficial.
  - `listo`: ya se revisó.
- `docs/REVISION_MEDICINA.md` se genera solo a partir de esas marcas.

## 6. Ejemplos de multimedia por carrera

| Carrera | Explicación animada | Interactivo | Video que conviene grabar |
|---|---|---|---|
| Medicina | El recorrido de un paciente en urgencias | Corazón que se toca; ritmo de RCP | Un día de una persona en servicio social |
| Derecho | Las etapas de un juicio | Línea de tiempo de un juicio | Una pasante en el juzgado |
| Ing. Civil | Cómo se construye un puente | Elegir el puente según el peso | Una ingeniera en la obra |
| Computación | Cómo viaja un dato por internet | Bloques para depurar | Un desarrollador en su primer empleo |
| Arquitectura | De la idea a la maqueta | Plano de casa que se toca | Una estudiante en semana de entrega |

## 7. Medición (todo se guarda en el dispositivo)

- **Claridad por carrera:**
  - Al empezar y al terminar cada carrera, el estudiante contesta: "¿Qué tan seguro te sientes de si esta carrera es para ti?" en una escala del 1 al 5, con etiquetas en los extremos ("Nada seguro" y "Muy seguro").
  - El Atlas muestra la respuesta de antes y la de después de cada carrera.
  - Se mide si el estudiante sabe si la carrera es para él, no si le gusta: terminar seguro de que "no es para mí" también cuenta como avance.
- **Uso de formatos:** por cada formato (animada, video, interactivo, audio, texto) se cuenta cuántas veces se abrió, se terminó, se saltó y se repitió.
- **Mostrar los datos:** en #art hay una tabla con estas cuentas para revisarlas. No se envía nada a ningún servidor.

## 8. Rendimiento y celular

- **Explicaciones animadas:** van a 60 cuadros por segundo en un celular de gama media; solo animan movimiento y transparencia. Se prueban con el CPU frenado 4 veces.
- **Video:** se descarga solo cuando el estudiante lo abre; nunca se precarga. Su miniatura es una imagen chica.
- **Voz:** la del navegador no pesa nada. Cada audio grabado se descarga cuando hace falta.
- **Pantalla:** primero celular. Los controles miden al menos 44 px y los subtítulos al menos 16 px, sobre un fondo que se pueda leer.

## 9. Medicina: 21 lecciones con la estructura nueva

Las 21 lecciones reutilizan el contenido del formato 2: las 7 lecciones de explicación y el examen final. Las explicaciones del formato 2 se vuelven pasos de revelación o explicaciones animadas, y sus casos de 3 opciones se vuelven decisiones y mini prácticas.

En la tabla:
- "No texto" es el formato principal de la lección.
- Las celdas marcadas con (m) necesitan revisión médica.
- Las marcadas con (o) se confirman en fuente oficial.

### 9.1 Unidad 1 · Conócela

| Lección | Gancho | Interacción | Revelación o dato | No texto | Idea clave |
|---|---|---|---|---|---|
| 1.1 Qué hace un médico | Alguien llega con presión en el pecho | Decisión: ¿qué haces primero? | Escuchar es el inicio del diagnóstico (m) | **Animada:** el recorrido de un paciente en urgencias (m) | Medicina es decidir con información incompleta para cuidar a alguien |
| 1.2 A quién ayudas | Un pueblo, un quirófano, un laboratorio | Clasificar casos por lugar | No todo es hospital | **Interactivo:** mapa de lugares de trabajo que se toca | También se previene y se investiga |
| 1.3 Mitos | "Hay que ser de puro 10" | Tres mitos contra realidad | Aspirantes por lugar: dato pendiente | **Video:** estudiante de primeros semestres (estado vacío) | Pesa más la constancia que el promedio |
| 1.4 Carreras parecidas | ¿Quién diagnostica, quién cuida, quién rehabilita? | Emparejar | Ingreso promedio de Medicina y 5 carreras de salud (IMCO 2026, verificado) | **Comparador visual de cifras** | Hay muchas formas de trabajar en salud |

### 9.2 Unidad 2 · Pruébala (contenido del formato 2, lecciones 1 a 4)

| Lección | Gancho | Interacción | Revelación o dato | No texto | Idea clave |
|---|---|---|---|---|---|
| 2.1 El corazón (m) | Un atleta con un lado del corazón más grueso | Casos 1 a 4 del formato 2, de fácil a difícil | Infarto: cada minuto cuenta | **Interactivo:** corazón que se toca para descubrir sus partes y **animada:** el recorrido de la sangre | El corazón son dos bombas |
| 2.2 Signos vitales (m) | Una paciente con tres números raros | Casos del formato 2 | Rangos normales | **Interactivo:** deslizadores de signos vitales con zonas de color | Varios números raros juntos casi siempre significan algo |
| 2.3 Pensar como médico (m) | "El peor dolor de cabeza de mi vida" | Decisión encadenada de historia clínica | Señales de alarma | **Audio:** Rumbo actúa a la paciente y el estudiante elige qué preguntar | Primero se descarta lo que puede matar |
| 2.4 Medicinas y dosis (m) | Un niño de 20 kg y un jarabe | Mini práctica de cálculo en el pizarrón, en tres niveles | Antibiótico contra virus | **Animada:** cómo se calcula una dosis (medicina inventada, Rumbocilina) | La dosis de un niño sale de su peso |

### 9.3 Unidad 3 · La realidad

| Lección | Gancho | Interacción | Revelación o dato | No texto | Idea clave |
|---|---|---|---|---|---|
| 3.1 Urgencias (m) | Tres pacientes al mismo tiempo | Ordenar por riesgo; luego el orden de revisión: vía aérea, respiración, circulación | RCP: profundidad y ritmo (m) | **Interactivo de ritmo:** compresiones al compás | Lo urgente no siempre es lo que más grita |
| 3.2 Un día real | Te toca guardia de 24 horas | **Línea de tiempo arrastrable:** el día de un interno | Las guardias cambian tu rutina completa (o) | **Video:** un día real (estado vacío) | Las guardias marcan el ritmo |
| 3.3 Lo difícil | Dar una mala noticia | Decisión: qué decir, en tres turnos (m) | Lo bueno y lo difícil, con honestidad | **Audio:** frase de una médica joven (estado vacío) | Es una carrera larga: se aguanta mejor con un porqué claro |
| 3.4 Historia real | ¿Quién estudia Medicina? | Preguntas sobre el testimonio | Testimonio real con permiso | **Video:** testimonio (estado vacío) + **Platícalo** con tu familia | Te debe gustar la gente, no solo la biología |

### 9.4 Unidad 4 · El camino

| Lección | Gancho | Interacción | Revelación o dato | No texto | Idea clave |
|---|---|---|---|---|---|
| 4.1 Cuánto dura | Tienes 17 años: ¿a qué edad terminas? | **Línea de tiempo arrastrable:** ciencias básicas, ciclos clínicos, internado y servicio social (o) | Duración de 6 a 7 años (por confirmar) | Línea de tiempo | El título es apenas la mitad si quieres especialidad |
| 4.2 Cómo se entra | Examen de admisión y examen de especialidad | Mito contra realidad | 15,779 de 44,911 aspirantes consiguieron lugar en el ENARM 2025 (verificado) | **Comparador visual** de lugares contra aspirantes | Entrar es competido: se prepara con tiempo |
| 4.3 Dónde y cuánto cuesta | Pública o privada | Rango: adivina el costo | Costos (por confirmar) y becas (verificado) | **Comparador visual** + **Platícalo:** cuánto puede apoyar tu familia | Pública o privada cambia el costo, no el esfuerzo |

### 9.5 Unidad 5 · El futuro

| Lección | Gancho | Interacción | Revelación o dato | No texto | Idea clave |
|---|---|---|---|---|---|
| 5.1 Medicina en la comunidad (m) | Quince personas enfermas después de una boda | Casos del formato 2 (brote, dengue, deshidratación) | El servicio social te pone a cuidar a un pueblo (o) | **Animada:** cómo se investiga un brote (m) | Se cuida al pueblo, no solo al paciente |
| 5.2 Dónde se trabaja y cuánto se gana | ¿Hospital o consultorio? | Emparejar lugares | 27,823 pesos al mes; 81 de cada 100 trabajan en lo suyo (IMCO 2026, verificado) | **Comparador visual** (el mismo de "¿Cuánto ganan?") | El ingreso sube con la especialidad, pero tarda |
| 5.3 Decisiones difíciles (m) | Una sola cama de terapia intensiva | Casos de ética del formato 2 | Las cuatro reglas de la ética médica | **Animada:** las cuatro reglas con un caso | Decidir bien también es decidir justo |
| 5.4 Tecnología y después | La IA lee una radiografía | Elegir entre dos caminos | Especialidad, salud pública e investigación | **Video:** residente (estado vacío) | Al titularte eliges otra vez |

### 9.6 Unidad 6 · Tu veredicto

| Lección | Gancho | Interacción | Revelación o dato | No texto | Idea clave |
|---|---|---|---|---|---|
| 6.1 Examen y lo que sentiste | Diez casos | Examen final del formato 2: 10 preguntas, se aprueba con 7 (m) | Tus reflexiones de las cinco unidades | **Gráfica** de tus reflexiones | Lo que sentiste al probarla vale más que lo que imaginabas |
| 6.2 Tu veredicto | ¿Qué haces con Medicina? | La guardo, la descarto o sigo en duda | Claridad del 1 al 5, antes y después | **Comparador** con tus otras carreras + **Platícalo** | Decidir "en duda" también es avanzar |

**Revisión médica antes de publicar:** 1.1, 2.1, 2.2, 2.3, 2.4, 3.1, 3.3, 5.1, 5.3, 6.1 y las animaciones de 1.1, 2.1, 2.4, 5.1 y 5.3. Las 29 tarjetas marcadas hoy en `docs/REVISION_MEDICINA.md` se conservan.

## 10. Videos que conviene grabar para Medicina

Todos verticales, con subtítulos, sin pacientes reconocibles a cuadro y con la autorización firmada de `docs/TESTIMONIOS.md`. Si la persona es menor de edad, también firma su madre, padre o tutor. Cuando se grabe en un hospital o centro de salud, hace falta un permiso por escrito de la institución.

| # | Video | Objetivo | Duración | A quién entrevistar | Guion corto de preguntas |
|---|---|---|---|---|---|
| 1 | Primeros semestres | Romper el mito de "puro 10" y mostrar cómo se estudia | 60 s | Estudiante de 1.º o 2.º año de una universidad pública, de un estado que no sea CDMX | ¿Por qué elegiste Medicina? ¿Qué te sorprendió del primer semestre? ¿Cuántas horas estudias en un día normal? ¿Qué le dirías a alguien de prepa que no es de 10? |
| 2 | Un día de internado | Mostrar la realidad de las guardias | 90 s | Interna o interno de pregrado, de universidad privada | ¿A qué hora empieza tu día? ¿Cómo es una guardia? ¿Qué es lo más pesado? ¿Qué te hace seguir? |
| 3 | Servicio social en comunidad | Mostrar que la medicina también cuida a un pueblo | 90 s | Médica o médico pasante en un centro de salud rural | ¿Dónde estás y qué atiendes? ¿Qué no te enseñaron en la escuela? ¿Cómo es estar lejos de casa? ¿Qué aprendiste de la comunidad? |
| 4 | Lo difícil | Hablar con honestidad de lo duro | 60 s | Médica general con menos de 5 años de egresada | ¿Qué fue lo más difícil de la carrera? ¿Cómo diste tu primera mala noticia? ¿Te volverías a inscribir? |
| 5 | Prepararse para el ENARM | Mostrar el camino a la especialidad | 60 s | Residente de primer año | ¿Cómo te preparaste? ¿Qué pasa si no te quedas a la primera? ¿Por qué elegiste tu especialidad? |
| 6 | No todo es hospital | Mostrar salud pública o investigación | 60 s | Médico en salud pública, epidemiología o investigación | ¿Qué haces en un día normal? ¿Cómo llegaste ahí? ¿Ves pacientes? ¿A quién le recomendarías este camino? |
| 7 | Lugar de trabajo | Que vean un consultorio o un centro de salud por dentro, sin pacientes | 30 s | Toma de recorrido narrada por quien trabaja ahí | Recorrido: dónde se recibe al paciente, dónde se revisa, qué hay en el botiquín |
| 8 | Audio: una frase | Frase corta para la lección 3.3 | 15 s | Cualquiera de las personas anteriores | "Lo que nadie me dijo de Medicina fue…" |

Que las personas sean diversas: mujeres y hombres, escuelas públicas y privadas, y al menos tres estados distintos.

## 11. Verificación

- En #art:
  - Una explicación animada completa de Medicina narrada por Rumbo.
  - El componente de video con su estado vacío.
  - Rumbo hablando con sus formas de boca.
- Recorrer tres lecciones completas de Medicina en celular, iPad y computadora, con y sin sonido. En cada una se verifica que:
  - Nunca haya más de dos pasos seguidos de solo texto.
  - Todo lo que dice Rumbo se pueda leer.
  - Nada se encime.
- Corregir y repetir hasta que todo pase, mínimo dos rondas.

## 12. Orden de trabajo

1. **Este documento.** Espero tu aprobación.
2. **Rumbo hablando y una explicación animada** ("El recorrido de un paciente en urgencias"). Espero tu aprobación.
3. **Todo aplicado a las lecciones de Medicina**, con su verificación.

## Fuentes de la sección 1

- Brown, S. D., y Ryan Krane, N. E. (2000). Four (or five) sessions and a cloud of dust: Old assumptions and new observations about career counseling. En S. D. Brown y R. W. Lent (eds.), *Handbook of Counseling Psychology* (3.ª ed.). Wiley.
- Brown, S. D., Ryan Krane, N. E., Brecheisen, J., Castelino, P., Budisin, I., Miller, M., y Edens, L. (2003). Critical ingredients of career choice interventions: More analyses and new hypotheses. *Journal of Vocational Behavior, 62*(3), 411-428.
- Whiston, S. C., Li, Y., Goodrich Mitts, N., y Wright, L. (2017). Effectiveness of career choice interventions: A meta-analytic replication and extension. *Journal of Vocational Behavior, 100*, 175-184.
- Lent, R. W., Brown, S. D., y Hackett, G. (1994). Toward a unifying social cognitive theory of career and academic interest, choice, and performance. *Journal of Vocational Behavior, 45*(1), 79-122.
- OCDE (2021). Covacevich, C., Mann, A., Santos, C., y Champaud, J. *Indicators of teenage career readiness: An analysis of longitudinal data from eight countries*. OECD Education Working Papers, n.º 258. Proyecto Career Readiness: https://www.oecd.org/education/career-readiness/
- Roediger, H. L., y Karpicke, J. D. (2006). Test-enhanced learning. *Psychological Science, 17*(3), 249-255.
- Cepeda, N. J., Pashler, H., Vul, E., Wixted, J. T., y Rohrer, D. (2006). Distributed practice in verbal recall tasks. *Psychological Bulletin, 132*(3), 354-380.
- Mayer, R. E. (2020). *Multimedia Learning* (3.ª ed.). Cambridge University Press. Fuente del punto 3 de la sección 0: los principios de segmentar, de narrar con imágenes y de no repetir el mismo texto que se narra.

Verificado en línea el 21 de noviembre de 2026: el documento de la OCDE (n.º 258, octubre de 2021, [registro](https://econpapers.repec.org/RePEc:oec:eduaab:258-en)), los datos de Whiston et al. (2017) ([registro](https://www.econbiz.de/Record/effectiveness-of-career-choice-interventions-a-meta-analytic-replication-and-extension/10011720945)) y el límite de 1 GB de GitHub Pages ([documentación](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)). Las demás referencias son textos clásicos del área; confirmo sus páginas exactas antes de publicar algo que las cite dentro de la app.

---

# Anexos (siguen vigentes de la versión del 14 de noviembre)

## Anexo A. Dinámicas propias por área (unidad 2)

| Área | Dinámicas | Se construyen sobre |
|---|---|---|
| Salud | Triaje por urgencia, síntoma y estudio adecuado, ordenar un procedimiento, conversación con un paciente | `ordenar`, `emparejar`, `decision` encadenada |
| Ingenierías | Armar una estructura con piezas y límite de peso o presupuesto, encontrar la falla, optimizar costo contra seguridad | `armar` (nuevo), `decision`, `rango` doble |
| Tecnología y ciencias | Depurar un programa por bloques, encontrar el patrón en datos, elegir el experimento que prueba una hipótesis | `bloques` (nuevo), `patron` (nuevo), `decision` |
| Negocios y sociedad | Decidir con presupuesto limitado, negociar con argumentos, analizar un caso legal, priorizar tareas | `presupuesto` (nuevo), `decision` encadenada, `clasificar` |
| Arte y comunicación | Elegir el encuadre, componer moviendo elementos, decidir el mensaje para un público, criticar con criterios | `encuadre` (nuevo), `componer` (nuevo), `decision`, `clasificar` |

Son seis dinámicas nuevas que hay que programar: `armar`, `bloques`, `patron`, `presupuesto`, `encuadre` y `componer`. Las demás reutilizan tarjetas comunes.

## Anexo B. Otras carreras: mito principal, retos y carreras parecidas

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

## Anexo C. Test de intereses: revisión de la licencia

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

## Fuentes del anexo C

- [O*NET Interest Profiler](https://www.onetcenter.org/IP.html)
- [Licencia de las Career Exploration Tools](https://www.onetcenter.org/license_tools.html)
- [O*NET Tools Developer License](https://www.onetcenter.org/license_toolsdev.html)
- [Servicios web del Interest Profiler](https://services.onetcenter.org/ip)
- [Referencia de Mi Próximo Paso](https://services.onetcenter.org/reference/mpp/ip)
- [Términos de los servicios web](https://services.onetcenter.org/terms)
