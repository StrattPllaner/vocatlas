# Vocatlas · Dirección de diseño

Fase 0. Este documento manda sobre cualquier pantalla, componente, icono o ilustración. Si algo no está aquí, se agrega aquí antes de construirlo.

Estado: **borrador para aprobación**. Las decisiones que necesitan tu visto bueno están marcadas con **[Decidir]**.

---

## 1. Concepto

**Vocatlas es el atlas personal de un explorador que se descubre a sí mismo.** Cada carrera es una isla. Probarla es visitarla. Lo que sientes en cada visita va dibujando tu mapa, y al final el atlas te dice hacia dónde apunta tu brújula.

**Personalidad.** Curiosa, alentadora, juguetona y confiable. Nunca infantil, nunca corporativa.

| Sí | No |
|---|---|
| Un compañero de viaje que sabe orientarse | Un maestro que califica |
| Celebrar con medida | Confeti en cada toque |
| Decir lo que no sabemos ("todavía no tenemos este dato") | Inventar sueldos o testimonios |
| Formas redondas con peso y volumen | Formas blanditas sin estructura |

**Prueba de reconocimiento.** Si tapas el nombre, alguien debe saber que es Vocatlas por cinco cosas:

1. Rumbo.
2. La brújula y la rosa de los vientos.
3. Las rutas punteadas.
4. Los sellos de pasaporte.
5. La paleta crema con azul verdoso y terracota.

## 2. Motivos de marca

Los motivos son la firma visual y se usan con criterio. Cada uno tiene un lugar fijo y una dosis máxima.

| Motivo | Dónde sí | Dónde no | Dosis |
|---|---|---|---|
| Rosa de los vientos | Logo, carga, Atlas (la aguja), sello de "informe listo" | Fondos de tarjetas, decoración suelta | Una por pantalla, máximo |
| Rutas punteadas | Caminos del mapa, indicador de pasos, progreso del recorrido | Separadores de lista, bordes decorativos | Solo donde significa "camino" |
| Alfileres de mapa | Ubicación de Rumbo, carrera seleccionada, estado de la República | Viñetas, iconos genéricos | Solo donde significa "aquí" |
| Curvas de nivel | Fondo de inicio y de resultado, con 4 % de opacidad | El mapa jugable, tarjetas, cualquier zona con texto | Dos pantallas |
| Sellos de pasaporte | Carrera completada, área completada, informe | Insignias menores, botones | Solo logros reales |

> **[Decidir]** En noviembre rechazaste la "carta náutica": curvas de nivel, cuadrícula y rosa de los vientos regadas por el mapa, porque se veía como relleno de IA. Este brief las vuelve a pedir, pero "con criterio". Mi propuesta respeta las dos cosas:
> - **Curvas de nivel:** nunca en el mapa jugable; solo como fondo apenas visible en inicio y resultado.
> - **Rosa de los vientos:** solo como logo y en la aguja del Atlas.
> - **Cuadrícula:** no vuelve.
>
> Confírmame si así está bien.

## 3. Voz y tono

- Español de México, de tú, frases de 12 palabras o menos.
- Cálida y directa. Humor suave cuando ayuda, nunca en errores ni en datos.
- Verbos de acción en botones: "Probar", "Seguir", "Entrar a la isla". Nada de "Aceptar" ni "Enviar".
- Errores que dicen qué hacer: "No encontramos ese estado. Prueba con 'Jalisco'." Nunca "Entrada inválida".
- Sin modismos forzados ("chido", "neta") y sin tono de anuncio ("¡Descubre tu potencial!").
- Mayúscula solo al inicio. Las únicas MAYÚSCULAS son etiquetas pequeñas de 12 px con espaciado, y solo en nombres de área sobre el mapa y en sellos.
- **Prohibido inventar:** sueldos, costos, porcentajes de empleo, testimonios. Si no hay dato con fuente, se muestra un estado vacío que lo dice.

## 4. Color

### 4.1 Escalas de nueve tonos

Se derivan en OKLCH, con luminosidad fija por paso: 100 = 97.5 %, 200 = 93.5 %, 300 = 87.5 %, 400 = 80 %, 500 = 71.5 %, 600 = 62 %, 700 = 52 %, 800 = 42 %, 900 = 32 %.

Cada color base queda exacto en el paso más cercano a su luminosidad. Los extremos bajan de croma para no verse fluorescentes.

| Familia | Base | Paso de la base |
|---|---|---|
| crema | `#F6EFE2` | 200 |
| tinta (azul verdoso) | `#14323F` | 900 |
| terracota | `#E8603C` | 600 |
| mostaza | `#F2B544` | 400 |
| salvia | `#7FB59A` | 500 |
| cielo | `#8FC9E8` | 400 |
| niebla (gris azulado) | `#DDE5EA` | 200 |
| frambuesa (solo error) | `#C8364E` | 700 |
| laguna (área Ingenierías) | `#2E9C9C` | 600 |
| ciruela (área Arte) | `#9E5F9C` | 600 |

Los valores completos viven en `:root` y se ven en `#kit`.

### 4.2 Proporción 60 · 30 · 10

- **60 % neutros:** crema, blanco, tinta y niebla. Fondos, superficies y texto.
- **30 % apoyo:** salvia, cielo, mostaza y las familias de área. Mapa, ilustración, selección y progreso.
- **10 % acento:** terracota. Casi solo la acción principal de la pantalla, más el alfiler de "estás aquí".

### 4.3 Terracota de acción

> **[Decidir]** El texto blanco sobre `#E8603C` tiene contraste **3.4 : 1**. Para texto de 18 px eso no pasa AA, que pide 4.5.
>
> **Propuesta:**
> - El botón principal usa **terracota de acción `#D1431A`** (4.64 : 1 con blanco), con borde inferior `#AB2E03`.
> - `#E8603C` se queda como terracota de marca para ilustración, logo, alfiler y superficies grandes sin texto encima.
>
> La alternativa es dejar `#E8603C` en el botón y aceptar que no cumple AA. No la recomiendo.

### 4.4 Volumen táctil

Todo elemento que se toca tiene un borde inferior sólido del mismo tono, unos 20 puntos más oscuro en L de OKLCH (≈ 0.09).

- Ejemplo: botón `#D1431A`, borde `#AB2E03`.
- Lo táctil nunca lleva sombra difusa. La sombra difusa es solo para capas flotantes (§7).

### 4.5 Semánticos

Todos pasan 4.5 : 1 con blanco en el botón y con su fondo claro en el texto.

| Rol | Botón | Borde | Fondo claro | Texto sobre fondo | Contraste |
|---|---|---|---|---|---|
| Acierto | `#488066` | `#31654D` | salvia-100 | salvia-800 | 4.61 · 7.57 |
| Error | `#CB304C` | `#A80D35` | frambuesa-100 | frambuesa-800 | 5.16 · 7.41 |
| Aviso | mostaza-400 de fondo, texto tinta | mostaza-600 | mostaza-100 | mostaza-800 | 7.97 |
| Información | `#3F7B99` | `#27607C` | cielo-100 | cielo-800 | 4.66 · 8.1 |

**Nada depende solo del color.**
- El acierto lleva una palomita y la palabra.
- El error lleva su icono y la palabra.
- El progreso lleva número.
- Las áreas llevan icono y nombre.

### 4.6 Áreas y carreras

Cada área es una familia de color. Cada carrera es un tono de esa familia, de 400 a 700, para que se distingan entre sí sin salirse de su área. Los tonos de área nunca se usan en botones.

| Área | Familia | Carreras (tono) |
|---|---|---|
| Salud | salvia, verde | Medicina 600 · Psicología 700 · Nutrición 500 · Veterinaria 400 |
| Ingenierías | laguna, verde azulado | Mecatrónica 600 · Ing. Civil 700 · Aeroespacial 500 · Ing. Ambiental 400 |
| Tecnología y ciencias | cielo, azul | Computación 700 · Ciencia de datos 600 · Física 500 · Biotecnología 400 |
| Negocios y sociedad | mostaza, ámbar | Derecho 700 · Finanzas 600 · Negocios 500 · Educación 400 |
| Arte y comunicación | ciruela, violeta | Arquitectura 600 · Comunicación 700 · Moda 500 · Cine 400 |

> **[Decidir]** Hoy Ing. Civil es terracota pura y choca con la regla del acento. Propongo mover Ingenierías a laguna. Los cinco tonos de área quedan repartidos en el círculo cromático (ámbar 85°, verde 150°, laguna 190°, azul 235° y violeta 320°), y además cada área lleva su icono.

### 4.7 Modo oscuro

Se diseña a mano con su propia lógica de superficies; no es una inversión del claro.

- **Fondo:** `#0C1E26`, noche de mar.
- **Superficies que suben:** tinta-900 `#14323F`, luego `#1B3F4E`, luego `#24495A`. Más arriba es más claro, nunca más sombra.
- **Texto:** crema-100 (15.9 : 1), secundario tinta-300 (8.4 : 1), terciario tinta-400 (6.0 : 1).
- **Bordes de componentes:** `#2F5669`, más claros que la superficie.
- **Bordes inferiores de volumen:** el mismo tono del botón, 20 puntos más oscuro, igual que en claro.
- **Acento:** la terracota de acción se queda. El cielo sube a cielo-400 para enlaces y foco.
- **Mapa de noche:** mar profundo, islas desaturadas al 70 %, caminos con luz cálida tenue. El agua se mueve menos.
- **Ilustración:** las mismas formas con una paleta nocturna definida por objeto, no un filtro.

### 4.8 Contraste mínimo

- Texto: 4.5 : 1. Texto de 24 px o más, o de 18.66 px en negrita o más: 3 : 1.
- Bordes de campos, interruptores, foco y estados de componentes: 3 : 1 contra lo que tienen al lado.
- Los bordes de tarjetas decorativas no cuentan como información y pueden ser más suaves.
- Los campos usan crema-600 `#8C7F67` (3.9 : 1 sobre blanco). El borde crema-400 de tarjeta (1.6 : 1) solo es decorativo.
- El catálogo `#kit` mide cada par de tokens y muestra el número.

## 5. Tipografía

### 5.1 Familia

**M PLUS Rounded 1c** (Google Fonts), redondeada y geométrica.
- Se carga en pesos 500, 700 y 800, solo el subconjunto latino: unos 85 KB en total. Se precarga el 800 de títulos y se usa `font-display: swap`.
- Respaldo real: `ui-rounded` (SF Pro Rounded en Apple), luego `"Nunito"`, `system-ui` y `sans-serif`.
- La comprobé: incluye ñ, á, é, í, ó, ú, ü, ¿ y ¡, y sus números ya son tabulares de origen (todos los dígitos miden igual), así que las cifras alinean sin ajustes.
- Descarté Fredoka, la de la fase 1: llega solo a peso 700 y sus números tienen anchos distintos.
- Descarté Nunito: es redondeada pero humanista, no geométrica.

> **[Decidir]** Es un cambio respecto a la fase 1. El catálogo se rehará con esta fuente.

### 5.2 Escala

Modular de 12 a 48 px. El interlineado y el espaciado entre letras se ajustan por tamaño.

| Token | Tamaño | Interlineado | Espaciado | Peso | Uso |
|---|---|---|---|---|---|
| `--fs-48` | 48 | 52 | −0.02 em | 800 | Momento protagonista: resultado, sello |
| `--fs-36` | 36 | 40 | −0.015 em | 800 | Título de pantalla de enfoque |
| `--fs-28` | 28 | 34 | −0.01 em | 800 | Título de pestaña |
| `--fs-22` | 22 | 28 | −0.005 em | 800 | Título de tarjeta u hoja |
| `--fs-18` | 18 | 26 | 0 | 700 | Botones, opciones de respuesta |
| `--fs-16` | 16 | 24 | 0 | 500–600 | Cuerpo y campos (16 px mínimo, para que iOS no haga zoom) |
| `--fs-14` | 14 | 20 | 0.005 em | 500–700 | Ayudas, metadatos, etiquetas de pestaña |
| `--fs-12` | 12 | 16 | 0.08 em, MAYÚSCULAS | 700 | Solo etiquetas de área y sellos |

**Reglas**
- Nunca menos de 12 px.
- Cifras con `font-variant-numeric: tabular-nums` donde se alinean.
- Todo texto escala hasta 200 % sin romperse: los contenedores crecen y nada tiene altura fija.

## 6. Retícula y estructura

### 6.1 Medidas

- **Base:** 4 px. Los espaciados entre bloques son múltiplos de 8: 8, 16, 24, 32, 40, 48 y 64. El 4 y el 12 solo se usan dentro de un componente.
- **Márgenes de pantalla:** 16 px de 320 a 389, 20 px de 390 a 767, y 24 px de 768 en adelante.
- **Zonas seguras:** `env(safe-area-inset-*)` en las cuatro orillas, siempre.
- **Altura:** `100dvh` para la app y `100svh` para cálculos que no deben saltar cuando aparece la barra del navegador.

### 6.2 Esqueleto fijo de la app

| Pieza | Altura | Contenido |
|---|---|---|
| Barra superior | 56 px + zona segura | Regresar o logo · título · anillo de claridad |
| Contenido | Lo que sobra | Se desplaza; no rebota ni recarga al jalar |
| Barra inferior | 64 px + zona segura | Mapa, Probar, Atlas y Yo. Siempre visible, nunca cortada |

**Acción principal**
- Una sola por pantalla.
- Anclada abajo, sobre la barra inferior o en su lugar en pantallas de enfoque, al alcance del pulgar.
- En pantallas de enfoque (perfil, test, reto), el contenido mide 560 px de ancho como máximo y va centrado.

### 6.3 Puntos de quiebre

Se diseña de móvil hacia arriba. Cada tamaño se compone a propósito.

| Nombre | Rango | Composición |
|---|---|---|
| Celular | 320–599 | Una columna. Barra inferior. Hojas inferiores. Ilustraciones medianas arriba del contenido. |
| Celular horizontal | alto ≤ 480 | Barra inferior compacta (48 px + zona segura). Ilustración a un lado o fuera. Las hojas ocupan 60 % del ancho, centradas. |
| Tableta | 600–1023 | Pantallas de enfoque centradas a 560 px con ilustración arriba. El mapa usa una hoja lateral en horizontal. |
| Computadora | ≥ 1024 | Dos columnas: contenido de 480 a 560 px a la izquierda, ilustración o mapa a la derecha. La barra inferior pasa a riel lateral de 88 px. |

Anchos que se prueban siempre: 320, 360, 390 y 430; 844 × 390 en horizontal; 820 × 1180; 1440 × 900.

## 7. Formas y elevación

- **Radios:** 8, 12, 16, 24, 32 y píldora.
  - Campos y chips: 16.
  - Botones: 16.
  - Tarjetas: 24.
  - Hojas y ventanas: 32.
  - Insignias: píldora.
- **Esquinas squircle:** se aproximan con el radio. Donde se pueda, se usa `corner-shape: squircle`; donde no, se queda el radio normal sin trucos.
- **Bordes:** 2 px en todo componente.
- **Trazo de iconos:** 2 px con puntas redondas.

**Cinco niveles de elevación**

| Nivel | Qué | Cómo se ve |
|---|---|---|
| 0 | Fondo | Plano |
| 1 | Superficie: tarjeta, lista | Borde de 2 px, sin sombra |
| 2 | Táctil: botón, chip, opción | Borde de 2 px + borde inferior sólido de 4 px (se hunde a 0 al tocar) |
| 3 | Flotante: aviso, globo de Rumbo, menú | Sombra difusa `0 8 24` al 14 % |
| 4 | Capa: hoja inferior, ventana | Sombra `0 16 40` al 20 % + velo detrás |

## 8. Componentes

Todos se presentan en `#kit` en claro y oscuro, con estos estados donde apliquen: reposo, presionado, enfocado, desactivado, cargando y error.

**Acciones**
- **Botones** primario, secundario, fantasma y de peligro, en tres tamaños (40, 48 y 56 px de alto; el de 40 solo dentro de listas, con área táctil extendida a 48). Variantes con icono, con carga y de ancho completo.
- **Botón de icono:** 48 × 48.

**Tarjetas**
- **Carrera:** ilustración, nombre, área y sello si ya la probaste.
- **Estadística:** número tabular grande y etiqueta.
- **Área:** color de familia, icono y progreso.
- **Bloqueada:** se ve el contenido, con candado y la razón.

**Selección y entrada**
- Opciones seleccionables grandes (respuestas del test y del reto) con marca de verificación y letra A, B o C.
- Chips de temas con icono propio; rebotan al elegirse.
- Campos de texto y de número.
- Selector con búsqueda que ignora acentos. Ciudad de México y Estado de México van como entradas separadas.
- Mensajes de error amables.
- Control segmentado e interruptores.

**Progreso**
- Barra gruesa de 16 px con brillo interno y llenado con ligero rebote.
- Anillo de claridad.
- Indicador de pasos con ruta punteada.

**Estado y logros**
- Insignias, sellos de pasaporte, filas de lista y avatar de perfil (inicial sobre color de área favorita; sin fotos).

**Capas**
- Ventana modal.
- Hoja inferior arrastrable con dos alturas: corta y completa.
- Aviso tipo toast.
- Globo de diálogo de Rumbo.
- Hoja de retroalimentación de acierto o error con la reacción de Rumbo.

**Estados de espera y vacío**
- Estado vacío con ilustración de 160 px.
- Esqueletos de carga con brillo.

**Navegación**
- Barra superior.
- Barra inferior con iconos que pasan de contorno a relleno al activarse.
- Riel lateral para computadora.

## 9. Iconografía

- **Cuadrícula:** 24 × 24, con zona viva de 20 × 20 y 2 px de margen.
- **Trazo:** 2 px, puntas y uniones redondas.
- **Ajuste óptico:** los círculos ocupan 20 px y los cuadrados 18 px, para que pesen igual.
- **Dos versiones por icono:**
  - Contorno para el estado normal.
  - Relleno para el activo. Los detalles interiores se recortan con el color de la superficie; no se dibujan encima.
- **Entrega:** símbolos `<symbol>` en un solo `<svg>` oculto, y se usan con `<use href="#i-nombre">`. Cero emojis.
- **Revisión:** página `#icons` con todo el set a 16, 24 y 32 px sobre la cuadrícula, en claro y oscuro.

**Set mínimo: 56 iconos**

| Grupo | Iconos |
|---|---|
| Navegación (5) | mapa, probar (foco), atlas (brújula), yo, regresar |
| Acciones (11) | siguiente, cerrar, más, menos, buscar, filtro, lista, centrar, sonido, silencio, compartir |
| Estado (9) | palomita, tache, info, aviso, candado, reloj, estrella, sello, sin conexión |
| Áreas (5) | salud, ingenierías, tecnología y ciencias, negocios y sociedad, arte y comunicación |
| Carreras (20) | Medicina, Psicología, Nutrición, Veterinaria, Mecatrónica, Ing. Civil, Aeroespacial, Ing. Ambiental, Computación, Ciencia de datos, Física, Biotecnología, Derecho, Finanzas, Negocios, Educación, Arquitectura, Comunicación, Moda, Cine |
| Plaza (6) | qué haces, un día real, lo difícil, cuánto se gana, testimonio, mini reto |

## 10. Ilustración

### 10.1 Reglas invariables

- Vector plano.
- **Tres tonos por objeto:** base, sombra (base −0.08 L) y luz (base +0.06 L).
- **Luz siempre desde arriba a la izquierda.** La sombra cae abajo a la derecha.
- Esquinas redondeadas, con un radio mínimo de 2 px a tamaño de uso.
- Sin contornos negros. Si un objeto lleva contorno, es su propio tono oscurecido (−0.18 L).
- **Edificios del mapa:**
  - Mismo ángulo (vista 3/4 frontal, cenital de 30°).
  - Misma base: plataforma elíptica de pasto con borde de tierra.
  - Misma huella: 96 × 72 unidades.
  - Mínimo 44 px de ancho en pantalla al zoom inicial del celular.
- Complejidad controlada: un edificio tiene 40 trazos como máximo y se reutiliza con `<symbol>`.

### 10.2 Edificios

- **Cinco principales con detalle propio:**
  - Medicina: hospital con cruz y ambulancia.
  - Mecatrónica: taller con brazo robótico.
  - Arquitectura: estudio con maqueta y grúa.
  - Derecho: tribunal con columnas y balanza.
  - Computación: laboratorio con pantallas y antena.
- **Las otras 15:** una plantilla cuidada (base, cuerpo, techo y ventanas) más un elemento distintivo encima: telescopio en Física, matraz en Biotecnología, claqueta en Cine, etcétera.

### 10.3 Islas y agua

- Orilla con espuma de 2 tonos.
- Curvas de nivel suaves *dentro* de la isla: 2 a 3 anillos de tierra más clara, no líneas.
- Agua con textura que se mueve despacio: 1 desplazamiento de 40 s, desactivado en dispositivos lentos y con movimiento reducido.

### 10.4 Escenas

- **Gran formato:** carga, inicio, perfil y resultado.
- **Pequeñas, de 160 px:** sin conexión, sin datos todavía, lista vacía, error general, y sello pendiente.

### 10.5 Rumbo

**Capas SVG:** sombra, piernas (dos), cuerpo-globo, continentes, mejillas, ojos (con brillo), boca, gorro, gafas y flecha.

**Diez expresiones**

| Expresión | Cuándo |
|---|---|
| Reposo | Por defecto |
| Hablando | Globo de diálogo |
| Pensando | Esperando una respuesta |
| Contento | Al entrar |
| Animando | Antes de un reto |
| Celebrando | Acierto o sello |
| Sorprendido | Al descubrir algo |
| Guiño | Microgesto |
| Triste con aliento | Error |
| Dormido | Sin conexión |

**Poses:** de pie, saludando, señalando, sentado flotando (inicio) y estampando un sello.

**Caminata:** rig equivalente a 8 cuadros, con piernas que pivotan en la cadera, rebote del cuerpo con aplastar y estirar, y la flecha con retraso.

**Dónde aparece:** carga, inicio, retroalimentación, estados vacíos, avisos y el globo de diálogo.

> **Compromiso de calidad.** Si al construirla una ilustración no llega al nivel de las cinco principales, te lo digo y propongo simplificarla en lugar de entregarla a medias.

## 11. Movimiento

### 11.1 Base

- **Duraciones:** 150 ms (toque y estado), 300 ms (capas y transiciones) y 600 ms (momento protagonista).
- **Curvas:**
  - Lo que entra usa resorte `cubic-bezier(.34,1.56,.64,1)`.
  - Lo que sale usa suave `cubic-bezier(.4,0,.2,1)`.
  - Lo que se mueve en el lugar usa `ease-in-out`.
- **Solo `transform` y `opacity`.** Nada de animar `width`, `top` ni `filter`.
- Como máximo 6 elementos animados a la vez fuera del mapa.
- Un solo momento protagonista por pantalla.

### 11.2 Coreografías

| Momento | Qué pasa |
|---|---|
| Toque de botón | Se hunde 4 px en 80 ms y regresa en 150 ms con resorte |
| Elegir chip | Escala 0.94 → 1.04 → 1 en 300 ms; aparece la palomita |
| Lista o tarjetas | Entran escalonadas cada 40 ms, subiendo 8 px y apareciendo |
| Barra de progreso | Llena con sobreimpulso del 3 % y se asienta en 600 ms |
| Cambio de pantalla | Eje compartido: sale −24 px desvaneciendo y entra desde +24 px con resorte |
| Hoja inferior | Sube con resorte en 300 ms; al cerrar baja con curva suave |
| Acierto | Rumbo hace anticipación (se agacha), salta con aplastar y estirar, y la hoja verde sube |
| Error | Rumbo hace un "no" suave con la flecha caída, la hoja frambuesa sube; nada tiembla agresivo |
| Carrera completada | El sello cae de arriba, se aplasta al estamparse, deja tinta y aparece el nombre (600 ms) |
| Territorio | Onda de color que llena la zona desde el punto de contacto (600 ms) |
| Rumbo en reposo | Parpadeo cada 2 a 5 s, respiración de 3.4 s, flecha que oscila como aguja |
| Caminata | Cámara que lo sigue con suavizado; huellas que se desvanecen |

**Movimiento reducido:** todo se convierte en desvanecimientos de 150 ms y Rumbo se queda quieto, con parpadeo.

## 12. Sonido y vibración

- **Ocho sonidos** sintetizados con WebAudio, de 60 a 400 ms y volumen bajo: toque, selección, acierto, error, completado, sello, deslizamiento y desbloqueo.
- **Apagados de forma predeterminada.** El interruptor vive en Yo.
- **Vibración** con `navigator.vibrate` donde exista: 10 ms al tocar, un patrón corto en acierto y uno doble suave en error. La app nunca depende de ella.

## 13. Gamificación

- **El progreso es la claridad vocacional:** sube cuando exploras, calificas y reaccionas en los retos. Se muestra como anillo y porcentaje.
- **Sellos:**
  - Uno por carrera completada.
  - Uno por área, cuando probaste todas sus carreras.
  - Hitos: primera isla, 5 carreras, las 5 áreas visitadas.
- **Cierre con sentido:** un informe con tus tres mejores opciones y por qué.
- **Sin rachas, puntos, vidas ni tablas de posiciones.** La app se usa semanas, no años.

## 14. Pantallas y flujo

1. **Carga:** Rumbo caminando sobre una ruta punteada, progreso real (fuentes, escena y mapa) y frases sin datos inventados. Aparece de inmediato.
2. **Inicio:** escena de islas con Rumbo protagonista y una acción.
3. **Perfil:** apodo, grado, estado de la República (con búsqueda y CDMX y Edomex separados) y edad opcional.
4. **Metas:** según el grado.
5. **Bifurcación:** test corto o ir directo a los temas.
6. **Test:** basado en los seis intereses de Holland, una pregunta por pantalla con tres respuestas táctiles.
7. **Resultado del test:** nombres amigables y el aviso "esto orienta, no diagnostica".
8. **Temas:** chips.
9. **Armando tu mapa.**
10. **Mapa:**
    - Visor superior y zoom.
    - Filtros por área.
    - **Vista de lista** como alternativa para una mano y para accesibilidad.
    - Hoja de carrera con dos alturas.
    - Recorrido de Rumbo por los caminos.
11. **Plaza** de cada carrera, con estaciones.
12. **Mini reto** con retroalimentación.
13. **Resumen** al completar, con sello.
14. **Pestañas:**
    - **Probar.**
    - **Atlas:** progreso, sellos por área, tus tres mejores e informe.
    - **Yo:** perfil, metas, estado, sonido, tema y borrar mis datos.
15. **Estados:** vacío, error y sin conexión.

### 14.1 El mapa en celular

- **Zoom inicial:** muestra las islas completas.
- **Etiquetas por zoom:**
  - Lejos: solo nombres de área.
  - Medio: nombres de carrera de la isla en foco.
  - Cerca: todas las etiquetas.
- **Sin choques:** un algoritmo de colisión oculta la etiqueta de menor prioridad. Nunca se pisan etiquetas, ni etiqueta con edificio, ni etiqueta con bandera.
- **Gestos:** un dedo arrastra con inercia; dos dedos hacen zoom. El mapa usa `touch-action: none` y la página no se desplaza mientras tanto.
- **Hoja de carrera:** arrastrable entre corta (35 % de la pantalla) y completa (85 %). Nunca tapa todo el mapa.
- **Zoom con botones:** opcional, abajo a la derecha, al alcance del pulgar.
- **Vista de lista:** siempre disponible con un botón visible.

## 15. Accesibilidad

- Objetivos táctiles de 48 px o más, con 8 px de separación.
- Foco visible: anillo de 3 px en cielo-600 (cielo-400 en oscuro) con 3 px de separación. Se dibuja solo con teclado.
- Etiquetas reales en cada campo. Orden de teclado lógico. `Esc` cierra capas y el foco regresa a donde estaba.
- Cada territorio del mapa tiene nombre accesible ("Medicina, Salud, no probada"). La vista de lista es la ruta principal para lectores de pantalla.
- Texto al 200 % sin cortes. Nada se comunica solo con color ni solo con movimiento.
- `prefers-reduced-motion` y `prefers-color-scheme` respetados. El tema también se puede fijar a mano en Yo.

## 16. Móvil, rendimiento e instalación

- **Teclado:** el campo activo y el botón de continuar quedan visibles cuando aparece el teclado. Se ajusta con `visualViewport`.
- **Gestos del navegador:** `overscroll-behavior: none` en la app para evitar recargar al jalar y el rebote. El gesto de regresar de iOS en las orillas queda libre.
- **Nada depende del cursor:** todo lo que se descubre pasando el cursor tiene equivalente táctil.
- **Presupuesto de peso:**
  - HTML con CSS y JS: 160 KB gzip o menos.
  - Fuentes: 90 KB o menos.
  - Sin librerías.
- **Dispositivos lentos:** se detectan por `hardwareConcurrency ≤ 4`, `deviceMemory ≤ 4` o cuadros lentos en la carga. En ellos se apaga el agua animada, bajan las partículas y se simplifican las sombras.
- **App instalable:**
  - Manifiesto con iconos de 192, 512 y enmascarable, color de tema y modo `standalone`.
  - Pantalla de bienvenida.
  - Service worker que guarda la app para usarla sin conexión.
  - Invitación a instalar después de completar la primera carrera, nunca al primer segundo.

> **[Decidir]** El sitio vive en GitHub Pages como un solo `index.html`. El manifiesto, los iconos y el service worker tienen que ser archivos aparte en el repo (`manifest.webmanifest`, `sw.js` y `icons/`). Es la única excepción a "un solo archivo". ¿De acuerdo?

## 17. Implementación

- **Un solo `index.html`**, ordenado por secciones marcadas:
  1. Tokens.
  2. Base.
  3. Componentes `.ui-*` con modificadores `is-*`.
  4. Pantallas.
  5. Símbolos SVG.
  6. JS por secciones: estado, datos, almacenamiento, sonido, componentes, mapa y pantallas.
- **Estado central:** un objeto `S`. Se guarda solo en el dispositivo con `localStorage` dentro de `try/catch`. Nada sale del aparato.
- **Se conserva:**
  - La afinidad por temas.
  - Los retos.
  - El progreso guardado (`vocatlas_v1`), con migración si cambia la forma.
  - Los caminos del mapa.
- **Páginas internas de revisión:** `#kit`, `#icons` y `#art`.

## 18. Control de calidad

Antes de mostrarte cualquier fase hago todo esto:

1. Capturas con Playwright en:
   - 390 × 844, 820 × 1180 y 1440 × 900.
   - Emulación táctil de iPhone SE, iPhone 15, iPhone 15 Pro Max, Pixel 7 y un Android de 360 × 640, en vertical y horizontal.
   - Modo claro y oscuro.
   - Con el procesador limitado a 4 veces menos velocidad.
2. Un script que falla si hay:
   - Desplazamiento horizontal.
   - Algún elemento táctil de menos de 48 px.
   - Texto recortado o encimado.
   - Elementos que se pisan.
   - Pares de color bajo AA.
3. Revisión a ojo con tres pruebas:
   - Entrecerrar los ojos para comprobar la jerarquía.
   - Escala de grises.
   - Alineación a la retícula.
4. Una crítica dura de mi propio trabajo, corregir y volver a renderizar, en dos rondas como mínimo.

**Límite honesto:** la WebKit de Playwright se parece a Safari, pero no es Safari. Lo que dependa del iPhone real (teclado, zonas seguras, gestos de regreso) te pido verificarlo en tu teléfono al cierre de cada fase.

## 19. Fases

| Fase | Entrega | Revisión |
|---|---|---|
| 0 | Este documento | Tu aprobación de las decisiones marcadas |
| 1 | Catálogo `#kit`, rehecho con estos tokens | Capturas en todos los tamaños |
| 2 | Iconos `#icons` | Set completo a 3 tamaños |
| 3 | Ilustraciones y Rumbo `#art` | Cada pieza a varios tamaños |
| 4 | Pantallas, una por una, en el orden del §14 | Capturas por pantalla |
| 5 | Pulido de movimiento y sonido | Videos cortos de cada coreografía |
| 6 | Auditoría final de accesibilidad y calidad | Reporte con resultados |

No avanzo de fase sin tu aprobación. Al cerrar cada una te digo:
- Qué defectos encontré y corregí.
- Qué compromisos tomé.
- Qué conviene validar con estudiantes reales.

## Anexo · Cambios respecto a la fase 1 ya publicada

La fase 1 anterior (catálogo en `#kit`, ya en línea) se rehace con este documento:

- **Fuente:** Fredoka pasa a M PLUS Rounded 1c.
- **Escala tipográfica:** la de 13, 15, 17, 20, 24, 30, 38 y 48 pasa a 12, 14, 16, 18, 22, 28, 36 y 48.
- **Radios:** 8, 12, 16, 20 y 28 pasan a 8, 12, 16, 24 y 32.
- **Botón principal:** pasa a la terracota de acción `#D1431A` y los botones semánticos a sus versiones AA.
- **Colores de área:** pasan a sus familias.
- **Componentes:** se agregan los que faltan (§8).
