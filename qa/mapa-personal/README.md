# Pruebas del mapa personal, la elección de carreras y el Atlas

Necesitan Playwright (con Google Chrome instalado) y un servidor local en la raíz del repo: `python3 -m http.server 8765`.
Cada script recibe la carpeta donde deja las capturas: `node matrix.mjs <carpeta>`.

- `lib.mjs`: tamaños (360×800, 390×844, iPad, computadora), estados de prueba y la marca `vocatlas_qa`, que expone `__vt()` para leer el estado interno.
- `matrix.mjs`: mapa con 1, 3, 6, 12 y 20 carreras en los cuatro tamaños, claro y oscuro, con el procesador a 1/4. Mide letreros encimados o fuera de pantalla.
- `flow.mjs`: crear el mapa, agregar y quitar carreras, cuadro por cuadro (congela las animaciones en instantes fijos).
- `v2.mjs`: elección de carreras y Atlas en todos los tamaños y temas; desbordes, botones menores de 44 px y buscador sin acentos. Color al 0, 25, 50, 75 y 100 %.
- `v3.mjs`: lección real y regreso al mapa, celebración al completar, quitar y volver a agregar, y fluidez con 20 carreras.
