# Regla entre los seis tipos de interés y las carreras de Vocatlas

Para que un orientador vocacional la revise. **Esta regla es de Vocatlas, no de O*NET®.** El test entrega seis puntajes; decir «tus intereses apuntan hacia estas carreras» es un agregado nuestro y no tiene estudio de validación.

## Cómo funciona

1. A cada carrera le asignamos una **ocupación de referencia** de O*NET®, la más parecida a lo que hace un egresado.
2. De esa ocupación tomamos su **código de intereses** tal como lo publica O*NET OnLine: de una a tres letras, en orden de importancia.
3. Con los puntajes del estudiante calculamos qué tanto coincide: la primera letra pesa 3, la segunda 2 y la tercera 1. Cada puntaje se divide entre el máximo posible, se multiplica por su peso, se suma y se divide entre la suma de los pesos.
4. Mostramos las cinco carreras con mayor coincidencia, **sin porcentaje**, diciendo en qué intereses coinciden. Es una pista para explorar, no un veredicto.

Letras: R Realista · I Investigador · A Artístico · S Social · E Emprendedor · C Convencional.

## Tabla

Códigos consultados en O*NET OnLine el 15 de noviembre de 2026. Cada código enlaza a su página.

| Carrera de Vocatlas | Ocupación de referencia en O*NET® | Código O*NET-SOC | Intereses | En palabras |
|---|---|---|---|---|
| Medicina | General Internal Medicine Physicians | [29-1216.00](https://www.onetonline.org/link/summary/29-1216.00) | ISR | Investigador, Social, Realista |
| Veterinaria | Veterinarians | [29-1131.00](https://www.onetonline.org/link/summary/29-1131.00) | IR | Investigador, Realista |
| Nutrición | Dietitians and Nutritionists | [29-1031.00](https://www.onetonline.org/link/summary/29-1031.00) | SI | Social, Investigador |
| Psicología | Clinical and Counseling Psychologists | [19-3033.00](https://www.onetonline.org/link/summary/19-3033.00) | SI | Social, Investigador |
| Ing. Civil | Civil Engineers | [17-2051.00](https://www.onetonline.org/link/summary/17-2051.00) | RIC | Realista, Investigador, Convencional |
| Mecatrónica | Mechatronics Engineers | [17-2199.05](https://www.onetonline.org/link/summary/17-2199.05) | RIC | Realista, Investigador, Convencional |
| Aeroespacial | Aerospace Engineers | [17-2011.00](https://www.onetonline.org/link/summary/17-2011.00) | IRC | Investigador, Realista, Convencional |
| Ing. Ambiental | Environmental Engineers | [17-2081.00](https://www.onetonline.org/link/summary/17-2081.00) | IRC | Investigador, Realista, Convencional |
| Computación | Software Developers | [15-1252.00](https://www.onetonline.org/link/summary/15-1252.00) | IC | Investigador, Convencional |
| Ciencia de datos | Data Scientists | [15-2051.00](https://www.onetonline.org/link/summary/15-2051.00) | IC | Investigador, Convencional |
| Biotecnología | Biochemists and Biophysicists | [19-1021.00](https://www.onetonline.org/link/summary/19-1021.00) | IR | Investigador, Realista |
| Física | Physicists | [19-2012.00](https://www.onetonline.org/link/summary/19-2012.00) | IRC | Investigador, Realista, Convencional |
| Derecho | Lawyers | [23-1011.00](https://www.onetonline.org/link/summary/23-1011.00) | ECI | Emprendedor, Convencional, Investigador |
| Educación | Secondary School Teachers, Except Special and Career/Technical Education | [25-2031.00](https://www.onetonline.org/link/summary/25-2031.00) | S | Social |
| Negocios | General and Operations Managers | [11-1021.00](https://www.onetonline.org/link/summary/11-1021.00) | EC | Emprendedor, Convencional |
| Finanzas | Financial and Investment Analysts | [13-2051.00](https://www.onetonline.org/link/summary/13-2051.00) | CEI | Convencional, Emprendedor, Investigador |
| Arquitectura | Architects, Except Landscape and Naval | [17-1011.00](https://www.onetonline.org/link/summary/17-1011.00) | RCA | Realista, Convencional, Artístico |
| Moda | Fashion Designers | [27-1022.00](https://www.onetonline.org/link/summary/27-1022.00) | ARE | Artístico, Realista, Emprendedor |
| Comunicación | News Analysts, Reporters, and Journalists | [27-3023.00](https://www.onetonline.org/link/summary/27-3023.00) | AIE | Artístico, Investigador, Emprendedor |
| Cine | Producers and Directors | [27-2012.00](https://www.onetonline.org/link/summary/27-2012.00) | AE | Artístico, Emprendedor |

## Qué conviene que revise el orientador

- **¿La ocupación de referencia representa bien a la carrera en México?** Las más discutibles: Negocios (elegimos gerentes generales), Biotecnología (bioquímicos y biofísicos, no ingenieros biomédicos), Cine (productores y directores, no editores) y Educación (maestros de secundaria y preparatoria).
- **Carreras con el mismo código.** Civil y Mecatrónica comparten RIC; Aeroespacial, Ambiental y Física comparten IRC; Computación y Ciencia de datos comparten IC; Veterinaria y Biotecnología comparten IR; Nutrición y Psicología comparten SI. El test no puede distinguirlas entre sí: saldrán juntas.
- **Educación tiene una sola letra (S).** Su coincidencia depende solo del puntaje Social, así que tiende a salir muy arriba o muy abajo.
- **Los pesos 3, 2, 1** son una decisión nuestra, sencilla a propósito.
- **Sesgo hacia Investigador.** Quince de las veinte carreras tienen I entre sus letras; un estudiante con I alto verá muchas carreras parecidas.

## Dónde está en el código

- Datos: `datos/regla-intereses.json`.
- Cálculo: función `ipMatch` en `src/intereses.js`.
