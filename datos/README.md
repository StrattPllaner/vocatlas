# Catálogo de contenido

Todo el contenido de las lecciones vive aquí, separado del código. `src/build.py` copia dentro de `index.html` la estructura, las cifras y los títulos; el texto de cada lección se descarga de `carreras/<id>.json` al abrir la carrera.

- `estructura.json`: las 6 unidades y 21 lecciones comunes a todas las carreras, con el tipo de parada de cada una.
- `carreras/<id>.json`: el contenido de una carrera. Hoy existen Medicina, Computación, Derecho, Arquitectura y Veterinaria; las otras 15 usan la estructura y muestran «Llega pronto» en lo que no tienen.
- `cifras.json`: cada cifra con valor, unidad, fuente, enlace y fecha de consulta. Una tarjeta nunca trae un número escrito: apunta a su cifra. Si está pendiente, la app muestra un estado vacío.
- `demo-dinamicas.json`: una lección de muestra con las seis dinámicas nuevas. Se ve en `index.html#din`.

## Antes de publicar

```
python3 datos/validar.py             # falla si algo no cumple
python3 datos/validar.py --revision  # lista lo que hay que revisar
python3 src/build.py
```

El validador revisa: de 5 a 8 tarjetas por lección, máximo 40 palabras por texto, nunca dos tarjetas de solo lectura seguidas, cierre con idea clave y pregunta de interés, ninguna cifra escrita en el texto y cada cifra con fuente o marcada como pendiente.

## Revisión

Una tarjeta con `"revisar": "medico"` tiene una afirmación clínica o del ejercicio profesional; con `"revisar": "fuente"`, una regla o trámite que se confirma en fuente oficial. Cada carrera tiene su lista para el profesionista que la revise en `docs/REVISION_<CARRERA>.md`. Cuando una tarjeta quede revisada, se le quita la marca.

## Tipos de tarjeta

`escena`, `decision`, `vf`, `rango`, `dato`, `ordenar`, `emparejar`, `clasificar`, `dos_caminos`, `armar_dia`, `reflexion`, `testimonio`, `resumen`, `comparar`, `veredicto`, `clave`, `interes`, y las seis dinámicas: `armar`, `bloques`, `patron`, `presupuesto`, `encuadre`, `componer`. Cómo se juega cada una está en `src/leccion.js`; un ejemplo de cada dinámica, en `demo-dinamicas.json`.

La autoevaluación de cierre de unidad la agrega la app sola en la última lección de cada unidad.

## Test de intereses (O*NET® Interest Profiler)

- `onet/ip.json`: las preguntas oficiales en español, sus cinco opciones y la tabla de calificación. Hoy dice `"estado": "pendiente"`: la app avisa y no deja empezar.
- `onet/cargar.py`: las descarga del servicio oficial con tu clave, mide cómo califica el servicio y lo comprueba con respuestas al azar antes de guardar. No se escribe ninguna pregunta a mano.

```
ONET_API_KEY=tu_clave python3 datos/onet/cargar.py
python3 src/build.py
```

Antes de publicar con las preguntas dentro de la app, espera la respuesta de O*NET sobre si se pueden guardar (ver `docs/CORREO_ONET.md`).

- `regla-intereses.json`: la ocupación de referencia y el código de intereses de cada carrera. Explicada en `docs/REGLA_INTERESES.md`.

## Universidades y sueldos (Morelos y CDMX)

- `fuentes/vocatlas_carreras.json`: la base original, con fuente y nivel de confianza en cada dato.
- `importar_carreras.py`: la convierte. Llena en `cifras.json` el sueldo promedio y cuántos ejercen su carrera (solo IMCO, solo si el campo corresponde a la carrera) y escribe `universidades.json` (universidades, costo, admisión y dónde se estudia cada carrera de la app).

```
python3 datos/importar_carreras.py
python3 datos/validar.py
python3 src/build.py
```

Lo marcado con confianza «media» en la base se muestra con la etiqueta «Por confirmar».
