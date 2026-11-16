# Fuentes del mapa isométrico

La app sigue siendo un solo `index.html`. Estos módulos se editan aquí y se meten al HTML con:

```
python3 src/build.py
```

El script reemplaza lo que hay entre `/*@iso-js*/ … /*@iso-js-fin*/` y `/*@iso-css*/ … /*@iso-css-fin*/`.

- `iso-lib.js`: proyección 2:1 y figuras (cajas, cilindros, esferas, techos, ventanas con reflejo, plataforma).
- `iso-bld.js`: edificios ilustrados por carrera.
- `iso-gen.js`: generador del mapa a partir del catálogo (islas, carreras, caminos, puentes, subáreas).
- `iso-env.js`: vegetación, objetos del mar y edificios de reserva por bioma.
- `iso-map.js`: dibujo del mundo y visor (zoom, niveles de detalle, letreros sin encimarse).
- `iso-fix.js`: catálogos de prueba de 20, 50 y 120 carreras.
- `iso-art.js`: página interna `#art`.
- `iso.css`: estilos del mapa y de `#art`.
- `rumbo.js`: la mascota. `build.py` mete `skins.js` en el marcador `/*@skins*/`.
- `skins.js`: un Rumbo por carrera (gorro y botas). `RUMBO.svg("U",null,null,"medicina")` lo dibuja; `RUMBO.skin(k)` fija el que usa toda la app.
- `mine.js`, `mine.css`: mapa personal, elección de carreras, Atlas.
- `perfil.js`, `perfil.css`: pestaña Yo (perfil, colección de Rumbos, ajustes).

## Lecciones (fase 3a)

- `leccion.js`: reproductor de tarjetas (`LEC.open`). Un tipo de tarjeta = una función en `R`. No trae contenido.
- `ruta.js`: la ruta de cada carrera (`PATH`) y el avance por lección (`lessDone`, `progOf`, `nextLesson`, `unitDone`, `markLesson`).
- `ruta.css`: estilos de la ruta (`.rt-*`) y de las lecciones (`.lc-*`).
- El contenido viene de `../datos/` y `build.py` lo copia como `CAT`. Ver `../datos/README.md`.
- Ojo con los nombres de clase cortos: `.reveal` y `.sk` ya existían con otro uso y causaron dos errores. Las clases nuevas llevan prefijo.
