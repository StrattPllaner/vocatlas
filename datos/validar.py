#!/usr/bin/env python3
"""Revisa el catálogo antes de publicar. Sale con error si algo no cumple.
   · cada lección: de 5 a 8 tarjetas, cierra con idea clave y pregunta de interés (o veredicto),
   · ninguna tarjeta pasa de 40 palabras en un mismo texto,
   · nunca dos tarjetas de solo lectura seguidas,
   · ninguna cifra (pesos, porcentajes, duraciones) escrita en el texto: van en cifras.json,
   · cada cifra tiene fuente, enlace y fecha, o está marcada como pendiente,
   · cada «dato» apunta a una cifra que existe.
   Además lista las tarjetas que necesitan revisión de un médico o de una fuente oficial."""
import json,glob,os,re,sys
D=os.path.dirname(os.path.abspath(__file__));err=[];rev={}
LECTURA={"escena","dato","testimonio","clave","comparar","resumen","info"}
cif=json.load(open(D+"/cifras.json"));est=json.load(open(D+"/estructura.json"))
orden=[l[0] for u in est["unidades"] for l in u["lecciones"]]
def textos(t):
    for k,v in t.items():
        if k in("tipo","revisar","dato","estado","vista"):continue
        if isinstance(v,str):yield v
        elif isinstance(v,list):
            for x in v:
                if isinstance(x,str):yield x
                elif isinstance(x,list):
                    for y in x:
                        if isinstance(y,str):yield y
                elif isinstance(x,dict):
                    for y in x.values():
                        if isinstance(y,str):yield y
        elif isinstance(v,dict):
            for y in v.values():
                if isinstance(y,str):yield y
NUM=re.compile(r"\d[\d,.]*\s*(%|por ciento)|\$\s*\d|\d[\d,.]*\s*(mil |millones|pesos|semestres)",re.I)
for k,c in cif.items():
    if c.get("estado")=="pendiente":
        if c.get("valor") is not None:err.append(f"{k}: está pendiente pero trae valor")
        if not c.get("fuente_sugerida"):err.append(f"{k}: pendiente sin fuente sugerida")
    elif c.get("estado")=="confirmar":
        # dato de la base de carreras sin fuente oficial propia: se muestra con la etiqueta «Por confirmar»
        for f in("valor","fuente","consultado"):
            if c.get(f) in(None,""):err.append(f"{k}: falta {f}")
    else:
        for f in("valor","fuente","url","consultado"):
            if c.get(f) in(None,""):err.append(f"{k}: falta {f}")
for p in sorted(glob.glob(D+"/carreras/*.json")):
    c=json.load(open(p));cid=c["id"];ids=[l["id"] for u in c["unidades"] for l in u["lecciones"]]
    if c.get("estado")=="completo" and ids!=orden:err.append(f"{cid}: las lecciones no coinciden con la estructura ({len(ids)} de {len(orden)})")
    for u in c["unidades"]:
        for l in u["lecciones"]:
            w=f"{cid} {l['id']}";T=l["tarjetas"]
            if not 5<=len(T)<=8:err.append(f"{w}: tiene {len(T)} tarjetas (deben ser de 5 a 8)")
            tipos=[t["tipo"] for t in T]
            if "clave" not in tipos:err.append(f"{w}: falta la idea clave")
            if tipos[-1] not in("interes","clave") or ("interes" not in tipos and "veredicto" not in tipos):err.append(f"{w}: no cierra con idea clave y pregunta de interés")
            for a,b in zip(tipos,tipos[1:]):
                if a in LECTURA and b in LECTURA:err.append(f"{w}: dos tarjetas de solo lectura seguidas ({a}, {b})")
            for i,t in enumerate(T):
                for s in textos(t):
                    n=len(s.split())
                    if n>40:err.append(f"{w} tarjeta {i+1}: {n} palabras: «{s[:50]}…»")
                    if NUM.search(s):err.append(f"{w} tarjeta {i+1}: cifra escrita en el texto: «{s[:60]}…»")
                if "dato" in t and t["dato"] not in cif:err.append(f"{w} tarjeta {i+1}: el dato {t['dato']} no existe en cifras.json")
                if t.get("revisar"):rev.setdefault(t["revisar"],[]).append((cid,l["id"],l["titulo"],i+1,t["tipo"],next(textos(t),"")))
pend=[k for k,c in cif.items() if c.get("estado")=="pendiente"]
if "--revision" in sys.argv:
    for quien,L in rev.items():
        print(f"\n== Para revisar con: {quien} ({len(L)} tarjetas) ==")
        for cid,lid,tit,i,tipo,s in L:print(f"  {cid} {lid} «{tit}», tarjeta {i} ({tipo}): {s[:90]}")
    print(f"\n== Cifras pendientes ({len(pend)}) ==");[print("  "+k) for k in pend]
print(f"\n{len(err)} errores · {sum(len(v) for v in rev.values())} tarjetas por revisar · {len(pend)} cifras pendientes")
for e in err:print("  ✗ "+e)
sys.exit(1 if err else 0)
