# Vocatlas · Auditoría de ilustración y plan (segunda pasada)

Fecha: 8 de noviembre de 2026. Se revisan todas las piezas de `#art` contra las reglas de construcción y los criterios de aceptación de tu documento.

**Criterios:**

| Clave | Qué se revisa |
|---|---|
| S | La silueta se reconoce rellena en negro. |
| P | Sin partes pegadas, flotando ni costuras. |
| I | Isométrico 2:1 con la luz del lado correcto. |
| T | Toca el suelo o el agua con sombra o espuma. |
| 64 | Se distingue a 64 px sobre el mar nocturno. |
| Pr | Proporción coherente con el resto. |
| M | Mismo mundo que Medicina. |
| C | No satura el celular. |

## 1. Auditoría

### Edificios

| Pieza | Pasa | Qué falla |
|---|---|---|
| Medicina (estructura) | Sí, con ajustes | Es el estándar. Los arbustos son esferas pegadas (P) y las flores son puntos sueltos. Falta la versión simplificada a 64 px: a ese tamaño las ventanas se vuelven ruido (64). |
| Computación (estructura) | No | Hoy es un monitor sobre una base y no un edificio donde se trabaja (la ficha pide una fachada-pantalla). Los arbustos son esferas pegadas (P). La pantalla oscura se pierde de noche (64). |
| Derecho (estructura) | No | La estatua no se lee: es un trapecio con una bolita y líneas sueltas (S, P). La escalinata tiene 3 escalones sin caras claras ni de sombra definidas (pides de 5 a 7). La cabeza queda tapada por la balanza. |
| Reserva: salud, industria, vidrio, ciudad, barrio | No | Son cajas de prueba de menor calidad que Medicina (M). En el mapa de 120 carreras se repiten iguales (C). Falta la versión emblema. |

### Vegetación y objetos de tierra

| Pieza | Pasa | Qué falla |
|---|---|---|
| Árbol redondo | No | Dos esferas encimadas sobre una caja-tronco: bolitas sobre palitos (S, P). El tronco no se ensancha ni entra a la copa. |
| Pino | No | Triángulos sueltos sin dentado; los niveles se ven pegados (P). Pasa a 64. |
| Palmera | Parcial | Las hojas son lóbulos y no plumas; el tronco no se ensancha abajo. Los cocos sirven. |
| Arbusto | No | Dos esferas encimadas (S, P), más alto de lo debido para un arbusto (Pr). |
| Flores | No | Círculos sobre palitos (S, P), sin hojas y de frente (I). |
| Roca | Parcial | Las facetas sirven, pero no se hunde en el suelo y la sombra flota (T). |
| Banca | No | Una caja con una raya: no se lee como banca (S). No tiene patas, tablones ni respaldo. |
| Farol | No | Poste plano de frente (I). La linterna es un círculo y no tiene base ancha. |
| Señal | No | Tablas planas de frente sin grosor (I). |
| Caja | Sí | Le faltan las juntas de tablas: es mejora, no falla. |
| Cono | No | Triángulo plano de frente (I). |

### Agua y cielo

| Pieza | Pasa | Qué falla |
|---|---|---|
| Muelle | Parcial | Tablones y pilotes en isométrico, pero sin espuma en los pilotes ni sombra sobre el agua (T). Muy corto. |
| Faro | Parcial | La torre de cilindros apilados muestra costuras entre franjas (P). No tiene balcón con barandal ni roca: está sobre una isla de pasto. |
| Velero | No | Casco plano de frente y velas de perfil (I). Sin cubierta ni estela (T). |
| Transbordador | Parcial | Isométrico, pero el casco es una caja sin proa y no tiene estela ni ventanas (T). |
| Ballena | No | Óvalo más líneas más chorro sueltos (S, P). De perfil (I). Sin agua alrededor (T). |
| Delfín | No | La silueta no se reconoce (S); es de perfil (I) y sin salpicadura (T). |
| Gaviota | Parcial | Se entiende, pero es blanca sobre agua clara y se pierde de día. |
| Nube | No | Tres esferas encimadas (P). Sin base plana. |
| Rosa de los vientos | Parcial | La rosa pasa, pero el disco no tiene grosor ni toca el agua (T). |

### Mapa generado en celular

| Revisión | Pasa | Qué falla |
|---|---|---|
| Densidad | No | La decoración usa unas 14 piezas por carrera: en celular satura y compite con las carreras (C). |
| Niveles de detalle | Parcial | El zoom medio todavía no usa la versión simplificada ni el nombre corto. |
| Toque | Parcial | Todavía no hay un área de toque mínima de 48 px que no se encime con la de otra carrera. |

## 2. Método nuevo

1. **Silueta primero.** Cada pieza parte de un solo trazo cerrado. Las copas, arbustos y nubes son una sola forma de masas fusionadas, generada por función, con el borde ondulado. Los animales son un solo contorno dibujado a mano.
2. **Tonos por planos.** La sombra y la luz se pintan dentro de la silueta, recortadas por ella, así que nada se sale ni deja costura.
3. **Isométrico estricto.** Lo que tiene perfil propio (velas, aletas, delfines, cola de ballena) se dibuja en su plano vertical y se inclina al eje isométrico.
4. **Siempre toca algo.** Sombra de contacto más sombra proyectada abajo a la derecha. En el agua, espuma y anillos en la línea de flotación.
5. **Tres niveles de detalle por pieza:** completo, 96 px y 64 px, con la misma silueta.
6. **Rendimiento.** Cada pieza se define una sola vez como símbolo y el mapa la reutiliza, para que el celular no cargue miles de nodos repetidos.
7. **Presupuesto en celular.** Máximo 3 adornos por isla y 2 objetos de mar a la vista. Entre 6 y 8 carreras en la vista inicial. Nombres cortos a zoom medio. Áreas de toque de 48 px o más, sin traslape.

## 3. Orden

1. Esta auditoría.
2. El entorno completo, con antes y después, silueta en negro y versión a 96 px.
3. Estructura y emblema de 7 carreras (Medicina, Derecho, Computación, Cine, Arquitectura, Veterinaria y Ciencia de datos), con la sección de comparación, la elección guardada en el dispositivo, la fila a 64 px y las dos escenas de prueba. **Aquí me detengo para que elijas.**
4. Las 13 carreras restantes y los objetos de reserva, siguiendo tus elecciones.

## 4. Resultado de las etapas 2 y 3 (8 de noviembre de 2026)

Revisión de cada pieza nueva contra los criterios, tras dos rondas o más.

### Entorno

| Pieza | Resultado | Notas |
|---|---|---|
| Árbol redondo, pino, palmera, arbusto | Pasa | Una sola silueta de masas fusionadas. El tronco del árbol se abre en raíces y entra a la copa. |
| Flores, roca, banca, farol, señal, caja, cono | Pasa | La banca ahora tiene tres tablones, respaldo inclinado y laterales de metal. El cono, el farol y la señal ya están en isométrico. |
| Muelle, faro, velero, transbordador | Pasa | Espuma en la línea de flotación, estela y sombra sobre el agua. El faro tiene balcón con barandal, linterna y su roca. |
| Nube y rosa de los vientos | Pasa | Nube con base plana en sombra. Rosa sobre un disco flotante con grosor y ondas. |
| Ballena | Pasa, con reserva | Lomo y cabeza que asoman en su plano isométrico, chorro en abanico y cola a lo lejos. Tomó tres intentos. A 64 px se lee como lomo de ballena, no como la ballena entera. |
| Delfines | En el límite | Cuerpo arqueado, hocico, aletas y salpicaduras. A 64 px todavía pueden confundirse con peces. Es el que menos me convence. |

### Carreras (estructura y emblema)

| Carrera | Estructura | Emblema |
|---|---|---|
| Medicina | Pasa | Pasa. Las olivas del estetoscopio se pierden a 64 px. |
| Derecho | Pasa: seis escalones y estatua de una pieza | Pasa |
| Computación | Pasa: fachada-pantalla luminosa | Pasa |
| Cine | Pasa | Pasa: cámara agrandada 1.5 veces en la segunda ronda |
| Arquitectura | Pasa | Pasa |
| Veterinaria | Pasa | Pasa: perro de una sola silueta |
| Ciencia de datos | Pasa | Pasa |

### En celular

- Con el presupuesto del celular hay 3 adornos por isla y 2 objetos de mar.
- La vista inicial muestra entre 6 y 8 carreras.
- A zoom medio se ven las carreras simplificadas con su nombre corto; de cerca, todo el detalle y los nombres completos.
- Cada carrera tiene un área de toque de 48 px o más.
- **Compromiso:** para que quepan de 6 a 8 carreras, la vista inicial queda en escala 0.7. Así los edificios miden de 90 a 100 px de alto, menos que los 110 px que pedía el brief anterior.

## 5. Tercera pasada: acabado, Rumbo y pantallas (8 de noviembre de 2026)

### Reglas nuevas aplicadas a todo

- **Orden por profundidad automático.** Cada carrera declara sus partes con su huella en el suelo. Un ensamblador las dibuja de atrás hacia adelante, así que ninguna atraviesa a otra.
- **Script de traslapes.** `node qa/traslapes.js` revisa cada pieza y señala:
  - partes que ocupan el mismo lugar;
  - partes a menos de 1.5 unidades sin tocarse;
  - partes fuera de la plataforma.
  - Resultado: 0 hallazgos en las 14 piezas.
- **Brillos y bordes dentro de su forma.** Los destellos de las aristas van por dentro de la tapa y terminan en seco. Las cumbreras terminan donde termina el techo. Los aleros tienen grosor visible. Lo que puede salirse, como cristales, rayas de la claqueta o el reflejo de la lupa, se recorta con su silueta.
- **Detalles con volumen.** Bayas con sombra y brillo, medio cubiertas por el follaje. Luces de los servidores con su hueco y su brillo. Focos de la marquesina con su base.

### Correcciones por pieza

| Pieza | Qué cambió |
|---|---|
| Medicina, estructura | Se conserva. Flores dentro de la plataforma y destellos recortados. |
| Medicina, emblema | El estetoscopio está acostado sobre la tapa, junto al borde derecho. Baja por el frente y la campana queda en el piso con su sombra. Nada flota. |
| Derecho, emblema | Libro y mazo más grandes, separados de la balanza. El arbusto se movió. |
| Derecho, estructura | Estatua nueva de una sola pieza: brazo en alto con la balanza colgando, venda, espada y pedestal de dos escalones. Escalinata de seis escalones con canto iluminado. Techo con alero de grosor visible. |
| Computación, emblema | La torre queda a la derecha, con aire, sin encimarse con el monitor. |
| Cine, emblema | Claqueta con grosor y rayas recortadas dentro de la barra. Reflector en su pie de tres patas, con el haz hacia afuera. |
| Arquitectura, emblema | El compás está de pie atrás a la derecha y no toca la casa. |
| Veterinaria, emblema | Perro con hocico más largo, dos patas delanteras rectas separadas, oreja caída proporcional y cola. |
| Ciencia de datos, emblema | La tendencia sale de la primera barra y sube con flecha. La lupa queda adelante, en el piso, sin atravesar las barras. |
| Ballena | Asoma tranquila con lomo y cabeza, más ancha y con chorro desde arriba de la cabeza. Se quitó la cola lejana, que a tamaño chico parecía un pájaro. |
| Delfines | Tres, separados, cada uno en su propio arco. La cola del que sale y el hocico del que entra tocan el agua justo en su anillo. |
| Escenas de prueba | Encuadran la isla, no el mar. Se recalculan si el contenedor cambia de tamaño o cargó oculto. |

### Rumbo

Mismo diseño, construcción nueva:
- Esfera con degradado y continentes proyectados sobre su curva, sin contorno negro.
- Gorro que envuelve la parte de arriba, con borde de grosor y costura.
- Solapas que cuelgan y proyectan sombra.
- Gafas con marco de dos tonos y reflejo, y correa que rodea el gorro.
- Anillo donde nace la flecha.
- Piernas con luz, sombra y suela.
- Sombras de contacto que se encogen al saltar.
- Párpados para parpadear y mejillas con degradado.
- El gorro sigue al cuerpo con un ligero retraso al saltar, caminar y respirar.

### Pantallas

- **Inicio:**
  - La escena se rehízo con piezas isométricas del sistema: isla con grosor, arena y espuma; palmera, árbol, arbusto y flores; bandera isométrica y velero.
  - Las montañas tienen lado iluminado y lado en sombra, y son más claras hacia atrás.
  - Nubes con volumen, sol o luna con estrellas.
  - El globo de diálogo va a un lado de Rumbo y apunta a su boca.
- **Carga:** bandera isométrica con base y sombra, y Rumbo nuevo.

### Lo que no quedó al nivel

- **Delfines:** mejoraron, pero a 64 px todavía pueden leerse como peces.
- **Rumbo:** su construcción ya sigue las reglas, pero los continentes se ven poco, porque las solapas y el gorro tapan los lados del globo.
- **Pantalla de inicio en iPad horizontal:** la escena es ancha y baja, así que la isla se recorta abajo. Rumbo y el globo de diálogo sí se ven completos.

## Carreras v2: primer lote (Veterinaria, Arquitectura, Cine, Ciencia de datos, Nutrición)

- Código en `src/iso-bld2.js`, registrado con `ART.addV2(id,{s,e})`. La v1 sigue intacta en `iso-bld.js`.
- En #art, cada tarjeta trae un selector «Versión 1 / Versión 2». La elección se guarda en el dispositivo (`vocatlas_ver`) y por defecto se usa la v2.
- `qa/traslapes.js` revisa la v1 y la v2 por separado; ambas salen en 0 hallazgos.
- Dos rondas de revisión a 200 %:
  - perro nuevo (`dog2`), de tres cuartos, con cabeza grande, orejas caídas, hocico claro y patas con patitas;
  - compás separado de la casa;
  - lupa sin cruzar las barras;
  - marquesina legible;
  - la media manzana acostada ahora es una rodaja con semillas (antes parecía un hongo).
- Se corrigió además un error del mapa: al girar el teléfono, la cámara no se recentraba y los edificios quedaban fuera de la pantalla.

## Rumbo: ojos y animación nuevos (modelos A, B y C)

- **Ojos paramétricos.** Blanco ovalado, pupila grande recortada con clipPath y dos brillos fijos del mismo lado. Los párpados de arriba y de abajo son del color de la cara y llevan su línea. Las expresiones mueven y curvan los párpados, nunca deforman el ojo. Las cejas son gruesas y redondeadas y se mueven con cada emoción.
- **Parpadeo.** Dura de 120 a 180 ms: baja en el 40 % del tiempo y sube en el 60 %. El ojo se aplasta un poco al cerrarse y la pupila baja con el párpado. Ocurre cada 2 a 6 s, a veces doble, y también al cambiar de expresión y antes de mirar a otro lado.
- **Mirada.** Sigue el dedo o el cursor, o el elemento indicado con `data-look`. Se mueve con saltos rápidos y cortos y tiene micro movimientos al sostenerse.
- **Escalonamiento.** Primero se mueve la cara, luego el gorro y las gafas, y al final las orejeras y la flecha (resortes con límites). Los brazos y la inclinación del cuerpo también van con resorte y dan un rebote al llegar. Al aplastar y estirar, el volumen se conserva (sx = 1/sy).
- **Coreografías.** Saludo, acierto, error con ánimo, celebración grande, caminar y detenerse (con asentamiento) y señalar. En reposo hay una variación cada 10 a 15 s: mirar alrededor, acomodarse las gafas, balancearse o bostezar.
- **Brazos con hombro redondo.** El hombro está centrado en el pivote, dentro del cuerpo. Antes, al levantar el brazo, la raíz se separaba del cuerpo; lo detectó la revisión de uniones.
- **Revisión de uniones.** `qa/uniones.js` revisa cuadro por cuadro piernas, hombros, flecha, orejeras, gafas, la cabeza bajo el gorro y los ojos dentro de la cara. Resultado: 0 fallas en 17 animaciones × 3 modelos, en Chromium y WebKit.
- **Fluidez.** En #rumbo, con 72 Rumbo en la página, corre a 60 cuadros por segundo: en Chromium con el procesador a ¼ de velocidad (perfil Pixel 7) y en WebKit (perfil iPhone 15).


## Cara de Rumbo: referencia única

La cara sale de `cara-rumbo.svg`, usado tal cual (ver DESIGN.md, sección 10.5). Las notas anteriores de este documento sobre ojos (brillos, pupilas, párpados del color de la cara, cejas) y mejillas rosadas quedan anuladas.

- Modelo T: cuerpo de brújula del modelo S con esa cara.
- En #rumbo se ve la referencia sola, Rumbo a 64, 128 y 400 px y una superposición de la referencia en rojo semitransparente sobre la cara. Coinciden exactamente.

## Rumbo final en la app (modelo U)

- Todas las pantallas usan el modelo U: inicio, pasaporte, metas, test, mapa, plazas, retos, avisos y estados vacíos. La elección de modelo guardada antes en el dispositivo se reinicia una vez.
- La pantalla de inicio ya no dibuja el globo viejo: muestra a Rumbo, y al deslizar hacia arriba gira la flecha de la brújula («Gira la brújula hacia arriba»). Al entrar da sus vueltas rápidas y hace zoom como antes.
- Error corregido: el giro del gorro salía NaN en Chrome porque una variable se llamaba igual que la de la mano derecha.
