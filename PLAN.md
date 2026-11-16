# Plan de Vocatlas

Estado al 15 de noviembre de 2026. Se marca conforme avanza.

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
  - [ ] Pendiente: el catálogo va dentro de `index.html`; con cinco carreras completas habrá que cargarlo aparte para no pasar el límite de peso.
- [x] Fase 4: Probar con el test de intereses (versiones de 30 y 60, una pregunta por pantalla, resultados, carreras sugeridas con «Agregar», historial, créditos y avisos), retos rápidos y comparador.
  - [ ] Pendiente tuyo: crear la clave en services.onetcenter.org y correr `ONET_API_KEY=… python3 datos/onet/cargar.py`. Hasta entonces el test avisa que no tiene preguntas y no deja empezar.
  - [ ] Pendiente: probar el test con las preguntas reales; solo se probó con un banco de prueba que vive en el script de QA.
  - [x] Correo en inglés para onet@onetcenter.org: `docs/CORREO_ONET.md` (falta que lo envíes).
  - [x] Tabla de la regla entre intereses y carreras, con el código de O*NET de cada ocupación verificado: `docs/REGLA_INTERESES.md` (falta que la revise un orientador).
- [ ] Pausa: prueba de Medicina y del test con estudiantes.
- [ ] Fase 3b: contenido de Computación, Derecho, Arquitectura y Veterinaria.
- [ ] Fase 5: perfil.
- [x] Guion de entrevista de cinco preguntas y formato de autorización: `docs/TESTIMONIOS.md`.
- [ ] Universidades de ejemplo: pública nacional, pública estatal (falta confirmar el estado) y privada.
