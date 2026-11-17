#!/usr/bin/env python3
"""Toma la base de carreras de Morelos y CDMX (datos/fuentes/vocatlas_carreras.json) y llena dos cosas:
   · cifras.json: sueldo promedio y cuántos ejercen su carrera, solo de IMCO Compara Carreras y solo cuando
     el campo de IMCO corresponde a la carrera (si el archivo dice que es aproximación, no se usa),
   · universidades.json: las universidades con su costo, admisión y fuente, y dónde se estudia cada carrera de la app.
   Nada se escribe a mano: si el archivo no trae el dato, la cifra sigue pendiente.
   Uso: python3 datos/importar_carreras.py && python3 datos/validar.py && python3 src/build.py"""
import json,os
D=os.path.dirname(os.path.abspath(__file__))
src=json.load(open(D+"/fuentes/vocatlas_carreras.json"))
FECHA=src["meta"]["fecha_corte"]
IMCO_URL="https://imco.org.mx/comparacarreras/"
# carrera de la app -> carrera del archivo (solo cuando es la misma carrera o su nombre más común)
MAPA={"medicina":"medicina","nutricion":"nutricion","psicologia":"psicologia","veterinaria":"mvz","civil":"ingenieria-civil",
      "mecatronica":"mecatronica","aeroespacial":"aeronautica","ambiental":"ingenieria-ambiental","computacion":"sistemas-computacionales",
      "datos":"ciencia-de-datos","biotec":"biotecnologia","fisica":"fisica","derecho":"derecho","negocios":"administracion",
      "finanzas":"finanzas","educacion":"pedagogia","arquitectura":"arquitectura","moda":"diseno-modas","comunicacion":"comunicacion"}
REGION={"CDMX":"CMX","Morelos":"MOR","Estado de México":"MEX","Estado de México (zona metropolitana)":"MEX"}
by={c["id"]:c for c in src["carreras"]}

def pend(u,sug):return {"valor":None,"unidad":u,"fuente":None,"url":None,"consultado":None,"estado":"pendiente","fuente_sugerida":sug}
cif=json.load(open(D+"/cifras.json"))
n=0
for app,fid in MAPA.items():
    c=by.get(fid)
    if not c:continue
    s=c.get("sueldo") or {};dl=c.get("demanda_laboral") or {}
    campo=s.get("campo_imco") or ""
    fuente="IMCO, Compara Carreras 2026 («"+campo+"»), promedio nacional" if campo else "IMCO, Compara Carreras 2026, promedio nacional"
    ok=s.get("promedio_mensual") and s.get("es_aproximacion") is False and "IMCO" in (s.get("fuente") or "")
    if ok:
        cif[app+".ingreso"]={"valor":"{:,}".format(s["promedio_mensual"]),"unidad":"pesos al mes","fuente":fuente,"url":IMCO_URL,"consultado":FECHA,"estado":"verificado"};n+=1
    else:cif.setdefault(app+".ingreso",pend("pesos al mes","Compara Carreras, del IMCO"))
    pq=dl.get("porcentaje_que_ejerce")
    if ok and isinstance(pq,(int,float)) and "IMCO" in (dl.get("fuente") or ""):
        cif[app+".ocupacion_afin"]={"valor":str(round(pq*100)),"unidad":"de cada 100","fuente":fuente,"url":IMCO_URL,"consultado":FECHA,"estado":"verificado"};n+=1
    else:cif.setdefault(app+".ocupacion_afin",pend("de cada 100","el Observatorio Laboral de la Secretaría del Trabajo"))
json.dump(cif,open(D+"/cifras.json","w"),ensure_ascii=False,indent=1)

# universidades: solo lo que se muestra, con su fuente y su confianza
U=[]
for u in src["universidades"]:
    U.append({"id":u["id"],"n":u["nombre"],"nc":u["nombre_completo"],"tipo":u["tipo"],
              "sedes":[{"n":s["nombre"],"edo":REGION.get(s["estado"],""),"nota":s.get("nota","")} for s in u["sedes"]],
              "costo":{"txt":u["costo"]["texto"],"fuente":u["costo"]["fuente"],"conf":u["costo"]["confianza"]},
              "adm":{"examen":u["admision"]["examen"],"txt":u["admision"]["detalle"],"fuente":u["admision"]["fuente"],"conf":u["admision"]["confianza"]},
              "url":u.get("url_oferta","")})
import re
def edos(uid,sede):
    """estado de una sede según su nombre; si la universidad está en un solo estado, ese"""
    t=sede.lower();e=set()
    if re.search(r"morelos|cuernavaca|cuautla|jojutla|chamilpa",t):e.add("MOR")
    if re.search(r"edomex|estado de méxico|iztacala|acatlán|aragón|cuautitlán|toluca|atizapán|lerma|azcapotzalco y lerma",t):e.add("MEX")
    if re.search(r"cdmx|ciudad de méxico|cu\b|ciudad universitaria|xochimilco|iztapalapa|azcapotzalco|cuajimalpa|zaragoza|santa fe|tlalpan|zacatenco|santo tomás|norte y sur|sur|norte",t) or not e:
        un=[x for x in U if x["id"]==uid];st={z["edo"] for z in un[0]["sedes"]} if un else set()
        if not e and len(st)==1:e|=st
        else:e.add("CMX")
    return sorted(e)
car={}
for app,fid in MAPA.items():
    c=by.get(fid)
    if not c:continue
    car[app]={"nombre":c["nombre"],"donde":[{"u":x["universidad"],"sede":x["sede"],"prog":x["programa"],"conf":x["confianza"],"edo":edos(x["universidad"],x["sede"])} for x in c.get("donde_estudiarla",[])],
              "morelos":bool(c.get("se_puede_terminar_en_morelos"))}
out={"region":["CMX","MOR"],"corte":FECHA,"fuente":src["meta"]["nombre"],"nota":"Costos y requisitos cambian cada año: confírmalos siempre en el sitio oficial de cada universidad.","unis":U,"car":car}
json.dump(out,open(D+"/universidades.json","w"),ensure_ascii=False,indent=1)
print(f"{n} cifras con fuente · {len(U)} universidades · {len(car)} carreras con dónde estudiarlas")
