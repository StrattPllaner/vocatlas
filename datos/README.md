# Catálogo de contenido

Todo el contenido de las lecciones vive aquí, separado del código. `src/build.py` lo copia dentro de `index.html`.

- `estructura.json`: las 6 unidades y 21 lecciones comunes a todas las carreras, con el tipo de parada de cada una.
- `carreras/<id>.json`: el contenido de una carrera. Hoy solo existe `medicina.json`; las otras 19 usan la estructura y muestran «Llega pronto» en lo que no tienen.
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

Una tarjeta con `"revisar": "medico"` tiene una afirmación clínica o del ejercicio profesional; con `"revisar": "fuente"`, una regla o trámite que se confirma en fuente oficial. La lista completa para enseñarle al médico está en `docs/REVISION_MEDICINA.md`. Cuando una tarjeta quede revisada, se le quita la marca.

## Tipos de tarjeta

`escena`, `decision`, `vf`, `rango`, `dato`, `ordenar`, `emparejar`, `clasificar`, `dos_caminos`, `armar_dia`, `reflexion`, `testimonio`, `resumen`, `comparar`, `veredicto`, `clave`, `interes`, y las seis dinámicas: `armar`, `bloques`, `patron`, `presupuesto`, `encuadre`, `componer`. Cómo se juega cada una está en `src/leccion.js`; un ejemplo de cada dinámica, en `demo-dinamicas.json`.

La autoevaluación de cierre de unidad la agrega la app sola en la última lección de cada unidad.
