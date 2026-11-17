# Plan de Vocatlas

Estado al 17 de noviembre de 2026. Se marca conforme avanza.

- [x] Fase 1: `CURRICULO.md` y revisión de la licencia del test.
- [x] Fase 2: sin barra superior, carga nueva, boceto y acuarela, ambiente animado.
- [x] Corrección del boceto: todo el territorio de una carrera sin explorar va en boceto (suelo, ladera, caminos, edificio, vegetación, rocas), con rayado solo dentro de caras en sombra y una sola mancha por carrera para pintar. Rumbo llega al frente y a un lado del edificio.
  - [x] Rumbo y etiqueta: revisado; el choque reportado era de una etiqueta fuera de pantalla (error de la prueba).
  - [x] Revisado a 200 %: el rayado queda dentro de su forma.
  - [x] Rendimiento recuperado: una clase repetida animaba todo el mapa; además la transparencia de cada forma ya no crea capas de efecto.
- [x] Fase 3a: ruta de lecciones (6 regiones, paradas con forma por tipo), reproductor de lecciones con 17 tipos de tarjeta, seis dinámicas nuevas (`index.html#din`) y Medicina completa (21 lecciones). Catálogo en `datos/`, con validador.
  - [x] Tarjetas que necesitan revisión marcadas en el catálogo; lista para el médico en `docs/REVISION_MEDICINA.md` (29 para el médico, 9 para fuente oficial).
  - [ ] Pendiente: las 7 cifras de Medicina siguen sin verificar (la app muestra el estado vacío).
  - [ ] Pendiente: testimonio de Medicina (falta la entrevista).
  - [x] El texto de las lecciones ya no va dentro de `index.html`: se descarga de `datos/carreras/` al abrir una carrera y queda guardado para usarse sin conexión.
- [x] Fase 4: Probar con el test de intereses (versiones de 30 y 60, una pregunta por pantalla, resultados, carreras sugeridas con «Agregar», historial, créditos y avisos), retos rápidos y comparador.
  - [ ] Pendiente tuyo: crear la clave en services.onetcenter.org y correr `ONET_API_KEY=… python3 datos/onet/cargar.py`. Hasta entonces el test avisa que no tiene preguntas y no deja empezar.
  - [ ] Pendiente: probar el test con las preguntas reales; solo se probó con un banco de prueba que vive en el script de QA.
  - [x] Correo en inglés para onet@onetcenter.org: `docs/CORREO_ONET.md` (falta que lo envíes).
  - [x] Tabla de la regla entre intereses y carreras, con el código de O*NET de cada ocupación verificado: `docs/REGLA_INTERESES.md` (falta que la revise un orientador).
- [x] Arreglos pedidos el 16 de noviembre: mapa fluido (cámara que no redibuja y piezas horneadas como imagen), límite de nubes, anillos de agua junto con su isla, ruta de lecciones como viaje entre islas, Comparar como pestaña propia, trajes de tela, caminado con pasos cruzados, 75 % en proceso, orilla superior al hacer scroll, menos texto.
  - [ ] Pendiente: medir en un iPhone y en Safari de verdad (solo se midió en WebKit sin tarjeta gráfica).
- [ ] Pausa: prueba de Medicina y del test con estudiantes.
- [x] Fase 3b: contenido de Computación, Derecho, Arquitectura y Veterinaria (21 lecciones cada una, con sus retos propios).
  - [ ] Pendiente: revisión por un profesionista de cada carrera: `docs/REVISION_COMPUTACION.md`, `docs/REVISION_DERECHO.md`, `docs/REVISION_ARQUITECTURA.md` y `docs/REVISION_VETERINARIA.md`.
  - [ ] Pendiente: 28 cifras nuevas (7 por carrera) y cuatro testimonios.
- [x] Lecciones nuevas (17 nov): temario por unidades en lugar de camino; tarjetas de lectura, plática con Rumbo, voltear y completar.
  - [x] Las 45 carreras sin contenido escrito tienen sus 21 lecciones armadas con la base (`datos/generar_lecciones.py`): primero enseñan y luego preguntan; las respuestas incorrectas salen de carreras de otra área.
  - [ ] Pendiente: revisión por alguien de cada carrera (las armadas dicen «generado» en su archivo).
- [ ] Fase 5: perfil.
- [x] Guion de entrevista de cinco preguntas y formato de autorización: `docs/TESTIMONIOS.md`.
- [x] Universidades de Morelos y CDMX (10, públicas y privadas) con costo, examen y fuente, desde `datos/fuentes/vocatlas_carreras.json` vía `datos/importar_carreras.py`. Se ven en «Escuelas» de cada carrera y en Yo.
  - [x] Sueldo promedio y cuántos ejercen su carrera (IMCO 2026, promedio nacional) para 15 carreras del mapa.
  - [ ] Pendiente: confirmar los costos y requisitos marcados «por confirmar» (confianza media en la base).
  - [x] Duración y costo por carrera desde la base («Por confirmar» en la app); becas con fuente oficial (Jóvenes Escribiendo el Futuro, UNAM, IPN).
  - [x] 31 carreras nuevas de la base en `datos/carreras-extra.json` (descripción, temas y mini reto escritos para la app; edificio genérico de su zona; lecciones «Llega pronto»).
  - [ ] Pendiente: edificio propio, Rumbo y lecciones de las 31 carreras nuevas; sumarlas a la regla del test de intereses.
  - [ ] Pendiente: el peso es 329 KB comprimidos (límite 320); si hace falta, los mini retos de las carreras nuevas pueden descargarse aparte.
