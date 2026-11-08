# Vocatlas · Auditoría de errores y plan de rediseño

Fecha: 8 de noviembre de 2026. Versión auditada: `caded4b` (la publicada en strattpllaner.github.io/vocatlas).
Estado: **para aprobación**. No se corrigió nada todavía.

## 1. Cómo se probó

- **Recorrido automático con Playwright** en 7 dispositivos: iPhone SE (320×568), iPhone 15 (393×659), iPhone 15 Pro Max (430×739), Pixel 7 (412×839), Android 360×640, iPad (810×1080) y computadora (1440×900).
  - Modo claro en todos. Modo oscuro en iPhone 15, Pixel 7, iPad y computadora. En total, 12 corridas.
  - iPhone e iPad corren en WebKit, el motor de Safari. Android y computadora corren en Chrome, y los Android con el procesador 4 veces más lento.
- **Flujos recorridos en cada corrida:**
  - Primer uso: inicio, pasaporte (primero vacío para ver los errores, luego lleno), meta y temas.
  - Temas propios con acentos, espacios, HTML, duplicados y textos de 1 y de 36 letras.
  - "Armar mi mapa" pulsado 5 veces seguidas.
  - Mapa: zoom completo y cercano, arrastre para medir fluidez, toque a un edificio, caminata, plaza, tarjeta de carrera, reto, dos respuestas rápidas, reacción, calificación y guardar.
  - Volver al mapa, las pestañas Probar, Atlas y Yo, y 24 toques rápidos entre pestañas.
  - Cuatro ciclos de pestañas más visita a una plaza, para medir fugas.
  - Recarga con progreso guardado, girar el dispositivo en el mapa y en la plaza, cambiar temas y borrar datos.
  - Sin conexión, con localStorage bloqueado y con las fuentes de Google caídas.
- **En cada pantalla, un script mide:**
  - desplazamiento horizontal
  - elementos fuera del ancho de pantalla
  - texto recortado por su caja
  - textos encimados que de verdad se ven
  - objetivos táctiles de menos de 48 px
  - ids repetidos en el DOM vivo
  - en el mapa: etiquetas encimadas entre sí, sobre edificios, cortadas en el borde o debajo de las barras; Rumbo tapando edificios; altura de cada edificio en pixeles.
- **Registro de errores:** excepciones no capturadas, promesas rechazadas, errores de consola y solicitudes fallidas.
- **Contraste y accesibilidad:** axe-core (WCAG 2.1 AA) en inicio, mapa, Probar, Atlas y Yo, claro y oscuro.
- **HTML estático:** html-validate.
- **Capturas:** 336 capturas del estado actual en `~/Desktop/vocatlas-auditoria/antes/` y una hoja por dispositivo en `~/Desktop/vocatlas-auditoria/hoja-*.jpg`. Son el "antes" para comparar al final.
- **Scripts:** en `qa/` de este repo, para volver a correrlos en cada fase.

## 2. Defectos encontrados

### Críticos (impiden usar la app como se espera)

| # | Defecto | Evidencia |
|---|---|---|
| C1 | **Los edificios del mapa son demasiado chicos para tocarlos.** Ninguno llega a los 110 px de alto en celular en ninguna vista. | iPhone 15: zoom inicial de 68 a 108 px; mapa completo de 16 a 26 px; zoom cercano de 41 a 67 px. En computadora, 8 de 13 quedan abajo de 110 al inicio. |
| C2 | **Hay edificios que no se pueden tocar porque otra cosa los tapa.** Con el mapa completo, el toque en Medicina cae en Rumbo o en las etiquetas de Psicología y Nutrición. | Edificios tapados al centrar: 4 a 6 por celular (Medicina, Psicología, Nutrición, Arquitectura, Moda y Comunicación). |
| C3 | **Rumbo tapa el edificio donde está parado.** Tocarlo lo hace "pensar" en vez de entrar. Este es el caso de Física que señalaste. | Medicina 66 % tapada al entrar y 92 % con el mapa completo. Al volver de una plaza, 68 % del edificio visitado. Pasa en las 12 corridas. |
| C4 | **iPhone SE: el pie del cuestionario se sale de la pantalla.** "Agregar" y "Armar mi mapa" quedan cortados a la derecha. | Los elementos llegan a x = 343 en una pantalla de 320 (captura `iphone-se-claro-07`). |
| C5 | **En horizontal, el mapa no se reacomoda.** Las islas quedan detrás de la barra inferior y no queda ningún edificio tocable en la zona visible. | La prueba "girar y entrar a una plaza" no encontró edificio en todos los celulares (captura `iphone-15-claro-21`). |
| C6 | **No funciona sin conexión.** Al recargar sin red aparece la página de error del navegador. No hay service worker, manifiesto ni iconos, así que no se instala como app. | Pasa en las 12 corridas. Además, Chrome pide `favicon.ico` y recibe 404. |

### Importantes (se ven mal, confunden o degradan con el uso)

| # | Defecto | Evidencia |
|---|---|---|
| I1 | **Etiquetas de área encimadas** con el mapa completo: Arte y comunicación con Negocios y sociedad, Ingenierías con Arte y comunicación, Salud con Tecnología y ciencias, y Mar de las Preguntas con Ingenierías. | Todos los celulares (captura `-09-mapa-todo`). |
| I2 | **"Estrecho de Prepa" encima de Nutrición.** | 5 de 5 vistas del mapa en iPhone. |
| I3 | **Etiquetas de carrera sobre otros edificios:** Ing. Civil sobre Aeroespacial, Mecatrónica sobre Ambiental, Psicología sobre Veterinaria, Arquitectura sobre Comunicación y Moda sobre Cine. Al acercar, también se enciman pines entre sí: Computación con Ciencia de datos, Ciencia de datos con Biotecnología, Ing. Civil con Mecatrónica, Arquitectura con Moda, Comunicación con Cine y Aeroespacial con Ambiental. | De 12 a 29 casos por dispositivo. |
| I4 | **Etiquetas cortadas en el borde del mapa:** Negocios y sociedad, Ingenierías, Islas por descubrir, Mar de las Preguntas y Estrecho de Prepa, y también pines de carrera. Incluye el caso de Tecnología y ciencias que señalaste. | De 21 a 44 casos por dispositivo. |
| I5 | **Etiquetas debajo de las barras:** Ing. Civil, Aeroespacial, Ambiental y Bahía de la Curiosidad quedan bajo la barra inferior translúcida. En iPhone SE, el aviso de "Toca un edificio…" tapa la etiqueta Salud. En computadora, los botones de zoom tapan "Islas por descubrir". | De 8 a 20 casos por dispositivo. |
| I6 | **Barra inferior apretada en pantallas chicas:** en 320 px cada botón mide 71 px de ancho y las etiquetas del mapa se ven a través de ella. | Captura `iphone-se-claro-08`. |
| I7 | **En la plaza:** el control de caminar tapa la estación "Cuánto se gana", y en 320 px se corta el nombre de la carrera ("Ciencia de da…"). También se cortan "Ciencia de datos · mini reto" y "Rumbo va a Ciencia de datos". | Capturas `-12-plaza` y `-11-caminando`. |
| I8 | **Error de JavaScript no capturado en las 12 corridas:** `$("#glSurf").innerHTML` es null. El parpadeo y las miradas del globo de inicio redibujan 120 ms o 1.1 s después y no revisan si el globo sigue en pantalla. | Aparece al entrar al mapa, al girar o al regresar. |
| I9 | **Fuga de escuchadores:** cada visita a una plaza agrega 3 escuchadores permanentes a `window` (teclas abajo, teclas arriba y pérdida de foco) que nunca se quitan. | Contador de escuchadores activos: de +23 a +28 por ciclo. Los nodos del DOM se mantienen estables (3108 a 3136), así que la fuga real son esos 3 por visita. |
| I10 | **Accesibilidad:** los edificios y pines del mapa no se alcanzan con teclado ni con lector de pantalla (no tienen `tabindex` ni rol). Hay contraste insuficiente en textos chicos: "Claridad" 2.72 : 1 y etiquetas de tarjeta 2.77 : 1 en claro, y 4.14 : 1 en oscuro. | axe: 1 a 5 casos por pantalla. |
| I11 | **Temas propios:** acepta duplicados que solo cambian mayúsculas ("música" y "Música") y guarda espacios repetidos ("Química␣␣␣orgánica"). Una palabra de 30 letras sin espacios casi desborda el chip en 320 px. | Lo guardado en localStorage tras recargar. |
| I12 | **Control "Cuánto te late"** mide 44 px de alto (mínimo pedido: 48). | Todas las corridas. |

### Menores

| # | Defecto |
|---|---|
| M1 | **HTML:** 13 botones sin `type`, dos encabezados `header` sin nombre (landmarks duplicados), `aria-label` en elementos sin rol, una entrada sin `type` y una barra de progreso hecha a mano en lugar de `<progress>`. |
| M2 | **Con localStorage bloqueado,** la app completa el flujo sin errores, pero no avisa que nada se guardará. |
| M3 | **Teclado virtual:** no hay manejo de `visualViewport` y se usa `100vh` en un lugar. Además, la emulación no abre teclado virtual, así que no se pudo medir si tapa campos (queda para el teléfono real). |
| M4 | **Código muerto:** por ejemplo, `sceneHTMLOld`. |
| M5 | **Pixel 7:** el globo de inicio sobresale 4 px a cada lado. Es decorativo y no causa desplazamiento. |

### Lo que salió bien (sin hallazgos)

- **Errores y estado:**
  - Ninguna promesa rechazada.
  - Ninguna solicitud fallida aparte del `favicon.ico`.
  - Ningún id repetido en el DOM vivo.
  - Ningún desplazamiento horizontal de página (el desborde del iPhone SE queda recortado dentro del pie).
- **Datos:**
  - Los campos usan texto de 17 px.
  - El progreso se conserva al recargar.
  - "Borrar todo" deja el estado vacío.
  - El HTML que escribe el alumno se muestra como texto y no se ejecuta.
  - Con las fuentes caídas, la app arranca en 1.4 s.
- **Toques rápidos:** no duplican vistas ni mapas.
- **Fluidez del mapa** en Chrome con el procesador 4 veces más lento: mediana de 16.7 ms por cuadro, p95 de 16.8 ms y ninguna tarea larga al arrastrar.
  - El WebKit sin ventana marca 33 ms porque limita sus cuadros. Ese número no sirve para juzgar y no lo cuento como defecto.

### Límites de esta auditoría

- **WebKit no es Safari.** El teclado, las zonas seguras y el gesto de regreso del iPhone real los tienes que probar tú al cerrar cada fase.
- **Limitar el procesador** solo se puede en Chrome.
- **Las franjas de Safari en la entrada con el globo** siguen sin confirmar en un iPhone real.

## 3. Plan

Sigo tu método: un punto de control por fase. En cada fase hago crítica propia y al menos dos rondas de render, y entrego capturas en celular, iPad y computadora.

### Fase 1 · Correcciones que sobreviven al rediseño (inmediata tras aprobar)

- **Código:**
  - Error del globo (I8).
  - Fuga de escuchadores (I9).
  - Pie del cuestionario en 320 px (C4).
  - Duplicados y espacios en los temas propios (I11).
  - Control de 48 px (I12).
  - Contraste (I10).
  - HTML (M1).
  - Aviso cuando no se puede guardar (M2).
  - `visualViewport` (M3) y código muerto (M4).
- **Instalación sin conexión (C6):** manifiesto, iconos y service worker como archivos aparte en el repo. Es la única excepción a "un solo archivo" (ver decisión 1).

Los defectos del mapa (C1, C2, C3, C5 e I1 a I7) no se parchan aquí: el mapa nuevo los resuelve de raíz en la fase 2.

### Fase 2 · Mapa generado e ilustración del mundo (en `#art`)

- **Generador de mapa a partir del catálogo:**
  - Islas por área, con tamaño proporcional a sus carreras.
  - Regiones por subárea y bioma por tipo.
  - Carreras distribuidas con separación mínima, más cerca las que comparten temas.
  - Caminos con árbol de expansión mínima más conexiones extra, y puentes entre las islas más afines.
  - Contorno orgánico de cada isla y resultado determinista.
  - Proyección isométrica 2 : 1.
  - Tres niveles de detalle: islas, subáreas con contador, y edificios con nombre.
  - Colocación de etiquetas sin encimarse, con prioridad, y medida con el mismo script de esta auditoría.
  - Pruebas con 20, 50 y 120 carreras de ejemplo, con capturas.
- **Ilustración:**
  - 20 edificios con la ficha que diste: plataforma redonda con grosor, tres tonos, destello y objetos que cuentan su historia.
  - Entorno: costa con arena y espuma, agua en capas, relieve en dos niveles, tres especies de árbol, arbustos, rocas, flores, faroles, señales, muelles, faro, velero, transbordador, ballena, delfines, gaviotas, nubes con volumen y rosa de los vientos.
  - Letreros colgantes con alfiler para las carreras.
  - Mapa de día como versión principal y de noche como modo oscuro.
- **`#art`** muestra cada pieza sobre fondo neutro a tres tamaños, incluido 96 px.
- **Orden de trabajo:** primero te enseño 3 edificios terminados (Medicina, Computación y Derecho) y una muestra del entorno, para que apruebes el estilo antes de dibujar los otros 17.

### Fase 3 · Iconos, componentes y Rumbo

- **`#icons`:** 40 o más iconos propios en cuadrícula de 24, con contorno y relleno, incluidas las 20 carreras y las 5 áreas.
- **`#kit`:** todos los componentes con todos sus estados, en claro y oscuro.
- **`#rumbo`:** rig en capas SVG con pivotes y física de resortes en un bucle de `requestAnimationFrame`.
  - 10 expresiones y 12 reacciones.
  - Ciclo de caminata con frenado y ojos que siguen el dedo.
  - Reposo con variaciones.
  - Versión reducida para equipos lentos y con `prefers-reduced-motion`.
  - Detrás de una interfaz chica (`rumbo.set`, `rumbo.play` y `rumbo.look`) para poder cambiarlo por Rive sin tocar el resto.

### Fase 4 · Pantallas, aprendizaje y contenido

- **Pantallas:** se aplica todo una por una, con capturas de antes y después en celular, iPad y computadora.
- **Catálogo de carreras separado del código, con formato documentado.**
  - Contenido completo de Medicina, Computación, Derecho, Arquitectura y Mecatrónica.
  - El resto lleva un estado de "llega pronto".
- **Recorrido de 10 lecciones** con 8 tipos de actividad, más el veredicto final.
- **Adaptación por reglas en el dispositivo**, con la explicación en Atlas.
- **Repaso ligero al volver.**

### Fase 5 · Movimiento y sonido

- Coreografías de transición, 8 sonidos (apagados por defecto) y vibración.

### Fase 6 · Auditoría final

- Vuelvo a correr todo esto hasta llegar a cero errores.
- Entrego el informe final con lo corregido y lo que no se pudo resolver.

## 4. Decisiones que necesito de ti

1. **Archivos aparte.**
   - Para instalarse y funcionar sin conexión hacen falta `manifest.webmanifest`, `sw.js` e `icons/`.
   - Para el catálogo propongo `carreras.json`, que se puede editar sin tocar el código; el service worker lo guarda para usarlo sin red.
   - La alternativa es dejar el catálogo dentro del HTML en un bloque de datos. Funciona igual, pero es más incómodo de editar.
2. **Presupuesto de peso.**
   - Hoy la app pesa 98 KB comprimida, y el límite acordado es 200 KB.
   - Calculo que llegará a unos 260–320 KB: los 20 edificios detallados suman alrededor de 100 KB, el entorno y Rumbo unos 40 KB, y el contenido de 5 carreras unos 30 KB.
   - Propuesta: subir el límite a 320 KB, con el mapa cargado en segundo plano después de la primera pantalla.
3. **Las 5 decisiones abiertas de DESIGN.md** (fuente M PLUS Rounded 1c, terracota de acción `#D1431A`, familias laguna y ciruela, motivos de marca, archivos de PWA).
   - Siguen vigentes.
   - Con este brief, la parte de ilustración de DESIGN.md se reemplaza por la especificación isométrica, y los colores se suben a una versión más viva para el mapa de día.
4. **"Quien ya la estudió".** No puedo escribir testimonios sin inventarlos. Esa unidad queda con un estado de "pendiente de testimonio real" hasta que me pases entrevistas. Las cifras (sueldos, duración, costos) quedan marcadas como "pendiente de fuente", con sugerencias como Compara Carreras del IMCO y el Observatorio Laboral.

## 5. Riesgo que te digo desde ahora

- **Los edificios.** Dibujar 20 edificios isométricos a mano en código SVG, con el nivel que pides, es la parte con más riesgo de quedar por debajo de "profesional".
  - Por eso la fase 2 empieza con 3 edificios terminados para que los juzgues.
  - Si no alcanzan el nivel, te lo diré y te propondré opciones:
    - simplificar el estilo a volúmenes limpios con menos detalle;
    - usar un paquete de ilustraciones con licencia comercial adaptado a esta paleta;
    - o encargar los edificios a un ilustrador con esta misma ficha técnica.
- **Rumbo.** Puedo hacerlo fluido en código. Si en la fase 3 no se siente de animación profesional, la interfaz ya queda lista para cambiarlo por Rive.
