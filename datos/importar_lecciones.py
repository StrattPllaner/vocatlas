#!/usr/bin/env python3
"""Convierte las lecciones escritas en texto (datos/fuentes/lecciones/<id>.lec) en el catálogo de la app
(datos/carreras/<id>.json, formato 2: explicación + preguntas de 3 opciones + examen final).

El texto se escribe igual que en el chat:

  **Lección 1: El corazón (4 preguntas)**          (o «Lección 1: Título (4 preguntas). Explicación…» en un solo párrafo)
  Párrafos de explicación. Las fórmulas van solas en su línea entre $$ … $$ (\\frac, \\text, \\times, {,}).
  Pregunta 1. Caso… A: opción. B: opción. C: opción. Correcta: B. Por qué.
  Pregunta 2. … Correcta: B, porque
  $$ fórmula $$
  Repaso de la lección 1, pregunta 1. (misma forma)   ← versión reescrita que sale si el alumno la falla
  **Examen final**
  Pregunta 1. …

Los datos de entrada (texto de la tarjeta, cifras, frase de Rumbo y cómo se agrupan las lecciones en unidades)
están en datos/fuentes/lecciones/meta.json.

  python3 datos/importar_lecciones.py            # todas las que tengan .lec
  python3 datos/importar_lecciones.py medicina   # solo una
"""
import json, os, re, sys, glob
D = os.path.dirname(os.path.abspath(__file__))
F = D + '/fuentes/lecciones/'

def tex(s):
    """$$ LaTeX $$ → fórmula simple que dibuja la app: {numerador|denominador}."""
    s = s.strip().strip('$').strip()
    s = s.replace('{,}', ',')
    s = re.sub(r'\\text\{([^{}]*)\}', r'\1', s)
    while '\\frac' in s:
        n = re.sub(r'\\frac\{([^{}]*)\}\{([^{}]*)\}', r'{\1|\2}', s)
        if n == s: raise ValueError('fracción que no se pudo leer: ' + s)
        s = n
    # \qquad separa dos fórmulas en la misma línea: la app las pone una junto a otra
    s = s.replace('\\times', '×').replace('\\qquad', ' ;; ').replace('\\cdot', '·')
    s = re.sub(r'(?<=[\s{|=])-(?=[\s\d])', '−', ' ' + s)
    if '\\' in s: raise ValueError('fórmula con un comando que la app no dibuja: ' + s)
    return re.sub(r'\s+', ' ', s).strip()

def cap(s):
    s = s.strip()
    if s.endswith('.') and not s.endswith('..'): s = s[:-1]
    i = 1 if s[:1] in '"«¿' else 0
    return s[:i] + s[i:i+1].upper() + s[i+1:]

QRE = re.compile(r'^(?:Pregunta (\d+)|Repaso de la lección (\d+), pregunta (\d+))\.\s*(.*?)\s+A:\s*(.*?)\s+B:\s*(.*?)\s+C:\s*(.*?)\s+Correcta:\s*([ABC])(.*)$', re.S)
LRE = re.compile(r'^(?:\*\*)?Lección (\d+):\s*(.*?)\s*\((\d+) preguntas?\)(?:\*\*)?\.?\s*(.*)$', re.S)

def parse(txt, cid):
    les, cur, last, exam = [], None, None, None
    for blk in [b.strip() for b in re.split(r'\n\s*\n', txt) if b.strip()]:
        m = LRE.match(blk)
        if m:
            cur = {'n': int(m.group(1)), 'titulo': m.group(2).strip(), 'esperadas': int(m.group(3)), 'partes': [], 'preguntas': []}
            les.append(cur); last = None
            if m.group(4).strip(): cur['partes'].append({'t': m.group(4).strip()})
            continue
        if re.match(r'^\*\*Examen final', blk):
            exam = cur = {'n': 'examen', 'titulo': 'Examen final', 'partes': [], 'preguntas': []}; last = None; continue
        if blk.startswith('$$'):
            if last is not None and last.pop('_porque', False): last['formula'] = tex(blk)
            elif cur is not None: cur['partes'].append({'f': tex(blk)})
            continue
        q = QRE.match(blk)
        if q:
            n, rl, rn, preg, a, b, c, ok, rest = q.groups()
            rest = rest.strip()
            item = {'pregunta': preg.strip(), 'opciones': [cap(a), cap(b), cap(c)], 'correcta': 'ABC'.index(ok)}
            if rest.startswith(', porque'):
                item['_porque'] = True; rest = rest[len(', porque'):].strip()
            rest = rest.lstrip('.').strip()
            if rest: item['explicacion'] = rest
            if rl:  # versión reescrita de una pregunta ya escrita
                dest = [l for l in les if l['n'] == int(rl)]
                if not dest or len(dest[0]['preguntas']) < int(rn): raise ValueError(f'{cid}: el repaso apunta a la lección {rl}, pregunta {rn}, que no existe')
                item.pop('_porque', None); dest[0]['preguntas'][int(rn) - 1]['repaso'] = item; last = None
            else:
                if cur is None: raise ValueError(f'{cid}: pregunta antes de cualquier lección: {blk[:60]}')
                cur['preguntas'].append(item); last = item
            continue
        if blk.startswith('Pregunta') or blk.startswith('Repaso'):
            raise ValueError(f'{cid}: no se pudo leer esta pregunta (¿falta «A:», «B:», «C:» o «Correcta:»?): {blk[:90]}')
        if cur is None: continue
        cur['partes'].append({'t': blk})
    for l in les:
        if len(l['preguntas']) != l['esperadas']:
            raise ValueError(f"{cid}: la lección {l['n']} dice {l['esperadas']} preguntas y trae {len(l['preguntas'])}")
    for l in les + ([exam] if exam else []):
        for p in l['preguntas']:
            if p.pop('_porque', False): raise ValueError(f"{cid}: «porque» sin fórmula en la lección {l['n']}: {p['pregunta'][:60]}")
    return les, exam

def card(p):
    t = {'tipo': 'pregunta'}; t.update(p); return t

def build(cid, meta):
    les, exam = parse(open(F + cid + '.lec').read(), cid)
    by = {l['n']: l for l in les}
    def lesson(k):
        if k == 'entrada':
            return {'id': '0', 'titulo': 'Conócela', 'minutos': 1, 'tarjetas': [
                {'tipo': 'ficha', 'texto': meta['entrada'], 'cifras': meta['cifras']},
                {'tipo': 'escena', 'texto': meta['gancho']}]}
        if k == 'examen':
            if not exam: raise ValueError(f'{cid}: falta el examen final')
            return {'id': 'ex', 'titulo': 'Examen final', 'minutos': 6, 'examen': True, 'aprobar': meta.get('aprobar', 7), 'tarjetas':
                [{'tipo': 'info', 'titulo': 'Examen final', 'partes': [{'t': f"Son {len(exam['preguntas'])} casos nuevos que mezclan todas las lecciones. Apruebas con {meta.get('aprobar', 7)}. Si no, lo repites y las que fallaste regresan con otras palabras."}]}]
                + [card(p) for p in exam['preguntas']]}
        l = by[k]
        return {'id': str(k), 'titulo': l['titulo'], 'minutos': 2 + (len(l['preguntas']) + 1) // 2, 'tarjetas':
                [{'tipo': 'info', 'titulo': l['titulo'], 'partes': l['partes']}] + [card(p) for p in l['preguntas']] + [{'tipo': 'teves'}]}
    usadas = [k for u in meta['unidades'] for k in u[2]]
    falta = [l['n'] for l in les if l['n'] not in usadas]
    if falta: raise ValueError(f'{cid}: las lecciones {falta} no están en ninguna unidad de meta.json')
    out = {'id': cid, 'version': 2, 'formato': 2, 'estado': 'completo',
           'revision': 'Pendiente de revisión por un profesionista de la carrera. Generado con datos/importar_lecciones.py desde datos/fuentes/lecciones/' + cid + '.lec; no se edita a mano.',
           'unidades': [{'id': 'u%d' % (i + 1), 'titulo': u[0], 'sub': u[1], 'lecciones': [lesson(k) for k in u[2]]} for i, u in enumerate(meta['unidades'])]}
    json.dump(out, open(D + '/carreras/' + cid + '.json', 'w'), ensure_ascii=False, indent=1)
    nq = sum(1 for u in out['unidades'] for l in u['lecciones'] for t in l['tarjetas'] if t['tipo'] == 'pregunta')
    print(f'{cid}: {sum(len(u["lecciones"]) for u in out["unidades"])} lecciones, {nq} preguntas')

if __name__ == '__main__':
    meta = json.load(open(F + 'meta.json'))
    ids = sys.argv[1:] or sorted(os.path.basename(p)[:-4] for p in glob.glob(F + '*.lec'))
    for cid in ids:
        if cid not in meta: sys.exit(f'{cid}: falta su entrada en datos/fuentes/lecciones/meta.json')
        build(cid, meta[cid])
