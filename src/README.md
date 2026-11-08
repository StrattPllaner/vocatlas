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
