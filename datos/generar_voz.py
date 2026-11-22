"""Genera la voz de Rumbo: un audio por línea de diálogo de datos/guiones/*.json, en media/voz/<id>.m4a.

Voz: Piper (programa de voz con IA, corre en la computadora) con el modelo es_ES-davefx-medium
(grabaciones con licencia CC0: https://huggingface.co/rhasspy/piper-voices/tree/main/es/es_ES/davefx/medium).
Tono: se genera un poco más lenta y se reproduce un poco más rápido (misma duración, tono un poco más alto). TONO=1.06 por defecto.
Solo regenera las líneas nuevas o cuyo texto cambió (media/voz/indice.json guarda el texto de cada id).

Uso:
  PIPER=/ruta/a/piper MODELO=/ruta/a/es_ES-davefx-medium.onnx python3 datos/generar_voz.py
Necesita macOS (afconvert) para pasar a AAC (.m4a), que todos los navegadores reproducen.
"""
import json, os, subprocess, wave, glob, tempfile
D = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(D, '..', 'media', 'voz')
PIPER = os.environ.get('PIPER', 'piper')
MODELO = os.environ['MODELO']
K = float(os.environ.get('TONO', '1.06'))  # 1 = voz original; más alto = más agudo
os.makedirs(OUT, exist_ok=True)
idx_p = os.path.join(OUT, 'indice.json')
idx = json.load(open(idx_p)) if os.path.exists(idx_p) else {}

def lineas(o):
    """todas las {id, dice} del guion, a cualquier profundidad"""
    if isinstance(o, dict):
        if 'id' in o and 'dice' in o:
            yield o['id'], o['dice']
        for v in o.values():
            yield from lineas(v)
    elif isinstance(o, list):
        for v in o:
            yield from lineas(v)

n = 0
for f in sorted(glob.glob(os.path.join(D, 'guiones', '*.json'))):
    for i, t in lineas(json.load(open(f))):
        dst = os.path.join(OUT, i + '.m4a')
        if idx.get(i) == t and idx.get('_tono') == K and os.path.exists(dst):
            continue
        with tempfile.TemporaryDirectory() as tmp:
            a, b = os.path.join(tmp, 'a.wav'), os.path.join(tmp, 'b.wav')
            subprocess.run([PIPER, '-m', MODELO, '--length-scale', str(K), '-f', a], input=t.encode(), check=True, capture_output=True)
            r = wave.open(a); p = r.getparams(); fr = r.readframes(p.nframes); r.close()
            w = wave.open(b, 'wb'); w.setnchannels(p.nchannels); w.setsampwidth(p.sampwidth); w.setframerate(int(p.framerate * K)); w.writeframes(fr); w.close()
            subprocess.run(['afconvert', '-f', 'm4af', '-d', 'aac', '-b', '48000', b, dst], check=True)
        idx[i] = t; n += 1
        print('voz', i)
idx['_tono'] = K
json.dump(idx, open(idx_p, 'w'), ensure_ascii=False, indent=1, sort_keys=True)
print('listo:', n, 'nuevas;', len(idx), 'en total')
