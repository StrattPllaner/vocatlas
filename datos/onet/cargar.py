#!/usr/bin/env python3
"""Descarga las preguntas oficiales del O*NET Interest Profiler en español (Mi Próximo Paso) y las deja en datos/onet/ip.json.

Uso:
    ONET_API_KEY=tu_clave python3 datos/onet/cargar.py
    python3 src/build.py

La clave se crea gratis en https://services.onetcenter.org (My Account). No se guarda en ningún archivo.

Qué hace, sin cambiar una sola palabra de lo que entrega el servicio:
  1. Baja las 60 preguntas del Short Form y las 30 del Mini-IP, con su área y sus cinco opciones de respuesta.
  2. Baja el título y la descripción oficial de cada una de las seis áreas de interés.
  3. Averigua cómo califica el servicio oficial: pide resultados para respuestas de prueba y anota cuántos puntos
     suma cada respuesta en cada pregunta. Así la app califica igual que O*NET sin tener que llamar al servicio
     (la clave no puede ir dentro de una app pública).
  4. Comprueba esa tabla contra el servicio con respuestas al azar. Si un solo resultado no coincide, no guarda nada.
"""
import json,os,sys,time,random,datetime,urllib.request,urllib.error
BASE="https://api-v2.onetcenter.org"
KEY=os.environ.get("ONET_API_KEY")
if not KEY:sys.exit("Falta la clave. Úsalo así: ONET_API_KEY=tu_clave python3 datos/onet/cargar.py")
AREAS=["realistic","investigative","artistic","social","enterprising","conventional"]
def get(path):
    for intento in range(5):
        try:
            r=urllib.request.Request(BASE+path,headers={"X-API-Key":KEY,"Accept":"application/json","User-Agent":"vocatlas-cargar/1"})
            with urllib.request.urlopen(r,timeout=30) as f:
                time.sleep(.25);return json.load(f)
        except urllib.error.HTTPError as e:
            if e.code==429:time.sleep(1);continue
            sys.exit(f"El servicio respondió {e.code} en {path}. Revisa la clave.")
    sys.exit("El servicio no respondió.")
def preguntas(path,n):
    d=get(f"{path}?start=1&end={n}")
    q=sorted(d["question"],key=lambda x:x["index"]);o=sorted(d["answer_option"],key=lambda x:x["value"])
    assert len(q)==n and d["total"]==n,f"Se esperaban {n} preguntas y llegaron {len(q)}"
    assert [x["value"] for x in o]==[1,2,3,4,5],"Las opciones de respuesta no son 1 a 5"
    return q,o
def puntaje(ans):
    d=get("/mpp/interestprofiler/results?answers="+ans);return {r["code"]:r["score"] for r in d["result"]},d["result"]
def calificacion(q):
    """puntos[i][v-1] = puntos que suma la pregunta i con la respuesta v, medidos contra el servicio oficial"""
    n=len(q);base,_=puntaje("1"*n);pts=[[0]*5 for _ in range(n)]
    # una pregunta por área basta para medir el valor de cada respuesta; luego se comprueba que todas se comporten igual
    for v in range(2,6):
        s,_=puntaje(str(v)*n)
        for a in AREAS:
            k=[x for x in q if x["area"]==a];d=s[a]-base[a]
            for x in k:pts[x["index"]-1][v-1]=d/len(k)
    for x in q:pts[x["index"]-1][0]=0.0
    return base,pts
def calcula(q,base,pts,ans):
    s=dict(base)
    for x in q:s[x["area"]]+=pts[x["index"]-1][int(ans[x["index"]-1])-1]
    return {a:int(round(v)) for a,v in s.items()}
out={"estado":"cargado","consultado":datetime.date.today().isoformat(),"fuente":"O*NET Web Services, Mi Próximo Paso","licencia":"https://www.onetcenter.org/license_toolsdev.html","versiones":{}}
for nombre,path,n in(("60","/mpp/interestprofiler/questions",60),("30","/mpp/interestprofiler/questions_30",30)):
    print(f"Bajando las {n} preguntas…");q,o=preguntas(path,n)
    print("Midiendo cómo califica el servicio…");base,pts=calificacion(q)
    random.seed(n);fallos=0
    for _ in range(12):
        ans="".join(random.choice("12345") for _ in range(n));real,_=puntaje(ans);mio=calcula(q,base,pts,ans)
        if real!=mio:fallos+=1;print("  no coincide:",ans,real,mio)
    if fallos:sys.exit("La calificación medida no reproduce la del servicio. No se guardó nada; avísale a quien mantiene la app.")
    print("  12 de 12 comprobaciones coinciden.")
    out["versiones"][nombre]={"opciones":o,"preguntas":q,"base":base,"puntos":pts}
_,res=puntaje("3"*60)
out["areas"]={r["code"]:{"titulo":r["title"],"descripcion":r.get("description","")} for r in res}
dest=os.path.join(os.path.dirname(os.path.abspath(__file__)),"ip.json")
json.dump(out,open(dest,"w"),ensure_ascii=False,indent=1)
print("Listo:",dest,"\nAhora corre: python3 src/build.py")
