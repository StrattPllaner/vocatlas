# DATOS.md · Estructura de datos por carrera (para el comparador)

Estado: **propuesta para aprobación**. No se construye el comparador hasta que se apruebe.
Corte de los datos que ya existen: 17 de noviembre de 2026. Conteo hecho el 22 de noviembre de 2026 sobre las 50 carreras de la app.

## Reglas

1. Ningún dato se inventa. Si no hay fuente verificada, el campo queda como `pendiente` y la app lo muestra así.
2. Todo dato numérico o verificable lleva `fuente`, `url` (si existe), `consultado` (fecha) y `alcance`:
   `nacional`, `estatal:MOR`, `estatal:CMX` o `universidad:<id>`.
3. Cada dato lleva `estado`: `verificado` (confirmado en la fuente), `confirmar` (de fuente secundaria o sin año claro) o `pendiente`.
4. Escuelas, costos y admisión se guardan **por estado** (solo Morelos y CDMX) y nunca se mezclan.
5. Lo que no tiene cifras oficiales (vida en la profesión) se describe en texto, con su origen marcado (`origen: fuente | testimonio`), nunca con números inventados.
6. Los datos personales del estudiante (grupo h) se calculan en el dispositivo y no van en el catálogo.

## Forma de cada dato

```json
{
  "valor": "16,836 a 36,499",
  "unidad": "pesos al mes",
  "alcance": "nacional",
  "fuente": "IMCO, Compara Carreras 2026 (ENOE 2T2025–1T2026, INEGI)",
  "url": "https://comparacarreras.org/",
  "consultado": "2026-11-17",
  "estado": "verificado",
  "nota": "Rango medio de quienes estudiaron la carrera y trabajan."
}
```

## Estructura por carrera

Archivo previsto: `datos/catalogo/<id>.json`, uno por carrera. Se genera con un script desde la base con fuentes
(`datos/fuentes/vocatlas_carreras.json`), `datos/cifras.json` y `datos/universidades.json`. Ninguno se edita a mano.

### a) Lo básico
| Campo | Clave | Fuente prevista |
|---|---|---|
| Área y subárea | `basico.area`, `basico.subarea` | Catálogo de la app |
| Qué se hace, en una frase | `basico.que_hace` | Base de carreras (planes de estudio de UNAM, IPN, UAEM y privadas) |
| Con qué trabaja: personas, datos, objetos o ideas | `basico.trabaja_con` | Se deriva del código Holland de O*NET con el mapa de Prediger (R→objetos, I→ideas, A→ideas, S→personas, E→personas y datos, C→datos). El campo dice que es una derivación |
| Carreras parecidas | `basico.parecidas[]` | Base de carreras |
| En qué se diferencian | `basico.parecidas[].diferencia` | Planes de estudio oficiales (comparar materias y campo laboral) |

### b) Estudiarla
| Campo | Clave | Fuente prevista |
|---|---|---|
| Duración y etapas adicionales | `estudio.duracion`, `estudio.etapas[]` | Plan de estudios oficial de cada universidad (alcance: universidad) |
| Modalidades (presencial, mixta, en línea) | `estudio.modalidades[]` | Oferta oficial de cada universidad |
| Materias más pesadas y disciplinas relacionadas | `estudio.materias`, `estudio.disciplinas[]` | Plan de estudios; «pesadas» según la nota de dificultad de la base |
| Horas a la semana | `estudio.horas_semana` | Mapa curricular con créditos/horas de la universidad |
| Prácticas profesionales y servicio social | `estudio.practicas`, `estudio.servicio_social` | Reglamento de cada universidad; servicio social: Ley Reglamentaria del Art. 5.º constitucional |
| Opciones de titulación | `estudio.titulacion[]` | Reglamento de titulación de cada universidad |
| Requisitos y examen de admisión | `estudio.admision[edo][]` | Convocatoria oficial de cada universidad |
| Competencia: aspirantes por lugar | `estudio.competencia[]` (escuela, año) | Estadísticas de admisión que publica cada universidad |
| Idioma requerido | `estudio.idioma` | Plan de estudios / reglamento |

### c) Costo
| Campo | Clave | Fuente prevista |
|---|---|---|
| Colegiatura pública y privada (rangos) | `costo.colegiatura[edo]` | Sitio oficial de cada universidad (alcance: universidad) |
| Materiales y equipo | `costo.materiales` | Listas oficiales de material de las facultades |
| Gastos escondidos propios de la carrera | `costo.escondidos` | Listas oficiales de material y reglamentos de laboratorio/taller |
| Costo total estimado (pública y privada) | `costo.total[edo]` + `costo.total.calculo` | Se calcula: colegiatura por periodo × número de periodos del plan + inscripciones. La fórmula y las cifras de origen se guardan junto al resultado |
| Becas | `costo.becas[]` | Becas Benito Juárez (gob.mx) y convocatorias de cada universidad |

### d) Dónde estudiarla
| Campo | Clave | Fuente prevista |
|---|---|---|
| Escuelas por estado, públicas y privadas | `donde[edo].publicas[]`, `donde[edo].privadas[]` | Sitio oficial de cada universidad |
| Disponibilidad en línea | `donde.en_linea[]` | Oferta oficial |
| Acreditaciones de calidad | `donde[...].acreditacion` | COPAES (organismos acreditadores) |

### e) Empleo al salir (todo nacional: no hay dato confiable por estado)
| Campo | Clave | Fuente prevista |
|---|---|---|
| Ingreso mensual (rango) | `empleo.ingreso` | IMCO, Compara Carreras 2026 |
| Tasa de ocupación / desempleo | `empleo.desempleo` | IMCO, Compara Carreras 2026 |
| Informalidad | `empleo.informalidad` | IMCO, Compara Carreras 2026 |
| Número de profesionistas | `empleo.profesionistas` | Observatorio Laboral (STPS) |
| Mujeres y hombres | `empleo.mujeres` | IMCO, Compara Carreras 2026 / Observatorio Laboral |
| Sectores donde trabajan | `empleo.sectores[]` | Base de carreras (campo laboral de los planes) / Observatorio Laboral |
| Trabaja en algo relacionado | `empleo.ejerce` | IMCO, Compara Carreras 2026 («vinculación») |
| Demanda y tendencia | `empleo.tendencia` | IMCO (evolución 2020–2025) |
| Independiente / emprender | `empleo.independiente` | Texto con fuente (colegios de profesionistas, planes de estudio) |
| Remoto / extranjero | `empleo.remoto` | Texto con fuente |
| Cédula, colegiación o certificación | `empleo.requiere` | SEP (Dirección General de Profesiones) |
| Conviene posgrado | `empleo.posgrado` | IMCO (% con posgrado) + texto con fuente |

### f) Vida en la profesión (sin cifras; texto con origen marcado)
`vida.horarios`, `vida.estres`, `vida.tipo` (oficina, campo, físico, mixto), `vida.viajes`, `vida.equipo`,
`vida.contacto`, `vida.tecnologia_ia`. Fuentes previstas: O*NET OnLine (secciones *Work Context* de la ocupación de
referencia), colegios de profesionistas y testimonios reales (marcados como testimonio).

### g) Perfil que encaja
| Campo | Clave | Fuente prevista |
|---|---|---|
| Habilidades clave | `perfil.habilidades[]` | Base de carreras |
| Código Holland (O*NET) | `perfil.holland` + `perfil.onet` (ocupación y código) | O*NET OnLine, sección Interests |
| Materias de prepa relacionadas | `perfil.prepa[]` | Planes de estudio (requisitos de área / bachillerato recomendado) |

### h) Datos del estudiante (en el dispositivo, no en el catálogo)
Afinidad (temas + test), reacción en los retos, lecciones completadas, capacidad en autoevaluaciones y seguridad 1 a 5.
Ya existen en el estado local: `S.interests`, `S.ip`, `S.res`, `S.les`, `S.auto`, `S.rate`.

## Qué ya está lleno (por campo)

50 carreras. «Lleno» = hay un dato con fuente; puede estar en estado `confirmar`.

| Grupo | Campo | Carreras con dato |
|---|---|---|
| Lo básico | Área y subárea | 50 de 50 |
| Lo básico | Qué se hace | 50 de 50 |
| Lo básico | Con qué trabaja (personas/datos/objetos/ideas) | 19 de 50 |
| Lo básico | Carreras parecidas | 50 de 50 |
| Lo básico | En qué se diferencian | 0 de 50 |
| Estudiarla | Duración | 50 de 50 |
| Estudiarla | Etapas adicionales | 8 de 50 |
| Estudiarla | Modalidades | 0 de 50 |
| Estudiarla | Materias (y las más pesadas) | 50 de 50 |
| Estudiarla | Disciplinas relacionadas | 50 de 50 |
| Estudiarla | Horas a la semana | 0 de 50 |
| Estudiarla | Prácticas y servicio social | 0 de 50 |
| Estudiarla | Titulación | 0 de 50 |
| Estudiarla | Requisitos y examen | 50 de 50 |
| Estudiarla | Competencia para entrar | 10 de 50 |
| Estudiarla | Idioma requerido | 0 de 50 |
| Costo | Colegiatura pública/privada (por escuela) | 50 de 50 |
| Costo | Materiales y equipo | 0 de 50 |
| Costo | Gastos escondidos | 0 de 50 |
| Costo | Costo total estimado | 1 de 50 |
| Costo | Becas | 50 de 50 |
| Dónde estudiarla | Escuelas por estado | 50 de 50 |
| Dónde estudiarla | En línea | 0 de 50 |
| Dónde estudiarla | Acreditaciones | 0 de 50 |
| Empleo al salir | Ingreso (rango) | 49 de 50 |
| Empleo al salir | Tasa de ocupación / desempleo | 49 de 50 |
| Empleo al salir | Informalidad | 49 de 50 |
| Empleo al salir | Número de profesionistas | 0 de 50 |
| Empleo al salir | Mujeres y hombres | 49 de 50 |
| Empleo al salir | Sectores | 50 de 50 |
| Empleo al salir | Trabaja en lo que estudió | 49 de 50 |
| Empleo al salir | Demanda y tendencia | 50 de 50 |
| Empleo al salir | Independiente / emprender | 0 de 50 |
| Empleo al salir | Remoto / extranjero | 0 de 50 |
| Empleo al salir | Cédula / certificación | 50 de 50 |
| Empleo al salir | Conviene posgrado | 49 de 50 |
| Vida en la profesión | Horarios y guardias | 0 de 50 |
| Vida en la profesión | Estrés | 0 de 50 |
| Vida en la profesión | Tipo de trabajo | 0 de 50 |
| Vida en la profesión | Viajes | 0 de 50 |
| Vida en la profesión | Equipo o individual | 0 de 50 |
| Vida en la profesión | Contacto con personas | 0 de 50 |
| Vida en la profesión | Efecto de la tecnología y la IA | 0 de 50 |
| Perfil que encaja | Habilidades clave | 50 de 50 |
| Perfil que encaja | Código Holland (O*NET) | 19 de 50 |
| Perfil que encaja | Materias de prepa relacionadas | 0 de 50 |

Notas importantes:
- **Código Holland:** solo 19 de 50 carreras lo tienen. El test de Probar recomienda solo entre esas 19 hasta completar las 31 restantes.
- **Ingreso:** la base trae dato para 49 carreras, pero en `cifras.json` 11 están marcadas «pendiente» porque el IMCO no tiene esa carrera exacta y el dato sería de una carrera parecida. Se mostrarán como «aproximado: carrera X del IMCO» o como pendiente; tú decides.
- **Colegiaturas:** hay costo por universidad, pero muchas están en estado `confirmar` (cifra publicada sin año claro).
- **Costo total, competencia, horas, titulación, modalidades, vida en la profesión:** casi todo pendiente; requiere revisar el sitio de cada universidad (Morelos y CDMX) carrera por carrera.

## Qué ya está lleno (por carrera)

Celdas = campos llenos / campos del grupo. Grupos: a) básico (5), b) estudiarla (11), c) costo (5), d) dónde (3), e) empleo (12), f) vida (7), g) perfil (3).

| Carrera | a | b | c | d | e | f | g |
|---|---|---|---|---|---|---|---|
| Actuaría | 3/5 | 5/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Administración | 4/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 2/3 |
| Aeroespacial | 4/5 | 5/11 | 2/5 | 1/3 | 9/12 | 0/7 | 2/3 |
| Animación | 3/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Arquitectura | 4/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 2/3 |
| Biología | 3/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Biomédica | 3/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Biotecnología | 4/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 2/3 |
| Ciberseguridad | 3/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Ciencia de datos | 4/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 2/3 |
| Ciencias políticas | 3/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Computación | 4/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 2/3 |
| Comunicación | 4/5 | 5/11 | 2/5 | 1/3 | 9/12 | 0/7 | 2/3 |
| Contaduría | 3/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Criminología | 3/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Derecho | 4/5 | 5/11 | 2/5 | 1/3 | 9/12 | 0/7 | 2/3 |
| Diseño gráfico | 3/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Diseño industrial | 3/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Economía | 3/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Educación | 4/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 2/3 |
| Educación física | 3/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Enfermería | 3/5 | 5/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Finanzas | 4/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 2/3 |
| Fisioterapia | 3/5 | 5/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Física | 4/5 | 5/11 | 2/5 | 1/3 | 3/12 | 0/7 | 2/3 |
| Gastronomía | 3/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Ing. Ambiental | 4/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 2/3 |
| Ing. Civil | 4/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 2/3 |
| Ing. Electrónica | 3/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Ing. Eléctrica | 3/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Ing. Industrial | 3/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Ing. Mecánica | 3/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Ing. Química | 3/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Inteligencia artificial | 3/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Matemáticas | 3/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Mecatrónica | 4/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 2/3 |
| Medicina | 4/5 | 6/11 | 3/5 | 1/3 | 9/12 | 0/7 | 2/3 |
| Mercadotecnia | 3/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Moda | 4/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 2/3 |
| Negocios internacionales | 3/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Nutrición | 4/5 | 5/11 | 2/5 | 1/3 | 9/12 | 0/7 | 2/3 |
| Odontología | 3/5 | 6/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Psicología | 4/5 | 6/11 | 2/5 | 1/3 | 9/12 | 0/7 | 2/3 |
| QFB | 3/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Química | 3/5 | 5/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Relaciones internacionales | 3/5 | 5/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Sociología | 3/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Trabajo social | 3/5 | 5/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Turismo | 3/5 | 4/11 | 2/5 | 1/3 | 9/12 | 0/7 | 1/3 |
| Veterinaria | 4/5 | 5/11 | 2/5 | 1/3 | 9/12 | 0/7 | 2/3 |

## Plan después de aprobar

1. Script `datos/catalogo.py` que arma `datos/catalogo/<id>.json` con lo que ya existe y marca lo demás `pendiente`.
2. Comparador con las 8 filas principales, secciones que se abren, fuente y fecha al tocar cada cifra, prioridades del estudiante, reflexión con Rumbo y verificación con Playwright (360×800, 390×844, iPad y computadora), mínimo dos rondas.
3. Llenar pendientes por bloques, empezando por lo que más pesa al decidir: costo total, competencia para entrar y códigos Holland faltantes.

## Fuentes revisadas para esta propuesta
- IMCO, Compara Carreras 2026 y su comunicado: https://comparacarreras.org/ · https://imco.org.mx/wp-content/uploads/2026/08/Compara-Carreras-2026_Comunicado_IMCO.pdf
- Observatorio Laboral (STPS): https://www.observatoriolaboral.gob.mx/
- Anuarios estadísticos de ANUIES (Formato 911 de la SEP): https://www.anuies.mx (descarga vigente por confirmar)
- O*NET OnLine e Interest Profiler: https://www.onetonline.org · https://www.onetcenter.org/IP.html
- Encuesta «La elección profesional», UVM 2019: https://saladeprensa.uvm.mx/
