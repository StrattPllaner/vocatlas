# QA de Vocatlas

Scripts de la auditoría (ver `../AUDITORIA.md`). Necesitan Playwright 1.48 con WebKit, Google Chrome y un servidor local:

```
python3 -m http.server 8765        # desde la raíz del repo
SP=<carpeta con pw/ y shots/> node audit.mjs iphone-15 claro <carpeta-capturas>
SP=<…> node axe.mjs
python3 summ.py
```

- `measure.js`: se inyecta en la página; mide desbordes, recortes, objetivos táctiles menores de 48 px, textos encimados, ids repetidos y, en el mapa, etiquetas encimadas, cortadas o sobre edificios, Rumbo tapando edificios y altura de cada edificio.
- `audit.mjs`: recorre todos los flujos en un dispositivo y registra errores, promesas rechazadas, solicitudes fallidas, fluidez del mapa y escuchadores activos.
- `axe.mjs`: contraste y accesibilidad WCAG 2.1 AA.
- `runall.sh`: los 12 casos (7 dispositivos, claro y oscuro).
