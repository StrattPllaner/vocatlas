#!/usr/bin/env python3
"""Lecciones generales de las 50 carreras: para saber DE QUÉ TRATA una carrera y si va contigo, no para enseñar la carrera.

Por qué así (lo que más piden los estudiantes al elegir carrera):
- Encuesta «La elección profesional», Centro de Opinión Pública UVM (2019, 640 alumnos de último año de bachillerato):
  lo más útil para decidir es saber qué hacen los profesionistas día a día (94 %), qué piden las empresas (94 %),
  cómo está el mercado de trabajo (92 %) y conocer experiencias reales (90 %); 40 % eligió creyendo que su carrera
  casi no llevaba matemáticas; el costo y que la carrera no esté cerca también pesan.
  https://saladeprensa.uvm.mx/40-de-los-egresados-de-bachillerato-en-mexico-confiesan-haber-elegido-la-carrera-que-estudiaran-solo-porque-creen-que-no-incluye-matematicas/
- OCDE (PISA 2022): casi 4 de cada 10 adolescentes no saben qué quieren hacer; recomienda acercarlos a experiencias
  reales de trabajo antes de elegir.

Cada lección primero te pide adivinar («¿qué crees que…?») y luego te enseña lo real; al final, «¿te ves aquí?».
Todo sale de datos/fuentes/vocatlas_carreras.json (base con fuentes) y de datos/cifras.json; no se inventa nada.
Unidades: 1 ¿De qué se trata?  2 ¿Va contigo?  3 ¿Y después?  4 Tu decisión.  (ids 0..7 y ex, como antes)
Uso: python3 datos/lecciones_generales.py && python3 src/build.py"""
import json,os,re,random
D=os.path.dirname(os.path.abspath(__file__));R=os.path.join(D,"..")
src=json.load(open(D+"/fuentes/vocatlas_carreras.json"))
by={c["id"]:c for c in src["carreras"]}
campo={}
for x in src["catalogo"]:
    if x.get("carrera_id") and x.get("campo_laboral_pdf") and x.get("tipo")=="con_ficha":campo.setdefault(x["carrera_id"],x["campo_laboral_pdf"])
CIF=json.load(open(D+"/cifras.json"))
html=open(R+"/index.html").read()
APP={}
for m in re.finditer(r'\{id:"([a-z]+)",name:"([^"]+)",area:"([a-z]+)"',html):APP.setdefault(m.group(1),{"name":m.group(2),"area":m.group(3)})
EXTRA=json.load(open(D+"/carreras-extra.json"))
for x in EXTRA:APP[x["id"]]={"name":x["name"],"area":x["area"]}
MAPA={"medicina":"medicina","nutricion":"nutricion","psicologia":"psicologia","veterinaria":"mvz","civil":"ingenieria-civil",
      "mecatronica":"mecatronica","aeroespacial":"aeronautica","ambiental":"ingenieria-ambiental","computacion":"sistemas-computacionales",
      "datos":"ciencia-de-datos","biotec":"biotecnologia","fisica":"fisica","derecho":"derecho","negocios":"administracion",
      "finanzas":"finanzas","educacion":"pedagogia","arquitectura":"arquitectura","moda":"diseno-modas","comunicacion":"comunicacion"}
for x in EXTRA:MAPA[x["id"]]=x["fid"]

def cap(t):return t[:1].upper()+t[1:] if t else t
def frases(t):return [f.strip().rstrip(".") for f in re.split(r"(?<=[.;])\s+",(t or "").strip()) if f.strip()]
VERBO=re.compile(r"^[A-ZÁÉÍÓÚa-záéíóúñ]+[aeó]n?$")
def partes_dia(t):
    """«Redacta contratos, demandas y escritos, asesora clientes…» → «Redacta contratos, demandas y escritos», «Asesora clientes»"""
    out=[]
    for f in frases(t):
        for p in re.split(r",\s*",f):
            if ":" in p:a0,b0=p.split(":",1);p=b0 if len(a0.split())<=3 else a0
            p=re.sub(r"^en [a-záéíóúñ]+\s+","",p.strip(" .;"))
            if not p:continue
            w=p.split()[0]
            if VERBO.match(w) and w.lower() not in ("una","la","una","esta","toda","cada","alguna","mucha","otra","casi"):out.append(cap(p))
            elif out:out[-1]=out[-1]+", "+p[:1].lower()+p[1:]
    out=[x for x in out if 2<=len(x.split())<=12 and not re.search(r"\d",x)]
    seen=[];[seen.append(x) for x in out if x not in seen];return seen
def corta(t,n=22):
    w=t.split();return t if len(w)<=n else " ".join(w[:n]).rstrip(",;:")+"…"
MATH=re.compile(r"c[aá]lculo|matem|[aá]lgebra|estad[ií]stic|ecuaciones|probabilidad|geometr|f[ií]sica|anal[ií]tica|num[eé]ric|finanzas|contabilidad|econometr|programaci[oó]n",re.I)
def materias(c):
    return [(e.get("etapa",""),e.get("materias",[])) for e in (c.get("materias") or {}).get("por_etapa",[])]
def cif_ok(k):d=CIF.get(k);return bool(d and d.get("estado")!="pendiente" and d.get("valor") is not None)

def info(t,texto=None,puntos=None):
    d={"tipo":"info","titulo":t}
    if texto:d["texto"]=texto
    if puntos:d["puntos"]=puntos
    return d
def preg(p,ok,malas,ex,rnd):
    ops=[ok]+malas;return {"tipo":"pregunta","pregunta":p,"opciones":ops,"correcta":0,"explicacion":ex,"adivina":True}
def vf(a,r,rv):return {"tipo":"vf","afirmacion":a,"respuesta":r,"revelacion":rv}
def esc(t):return {"tipo":"escena","texto":t}
def escala(p,a="Nada",b="Mucho"):return {"tipo":"reflexion","pregunta":p,"escala":[a,b]}
def refl(p,ops):return {"tipo":"reflexion","pregunta":p,"opciones":ops}
def clave(t):return {"tipo":"clave","texto":t}
TEV={"tipo":"teves"}
def L(i,t,m,cards):return {"id":i,"titulo":t,"minutos":m,"tarjetas":cards}

def otras(cid,n,rnd,need):
    a=APP[cid]["area"];pool=[k for k,f in MAPA.items() if k!=cid and k in APP and f in by and APP[k]["area"]!=a and need(k,by[f])];rnd.shuffle(pool);return pool[:n]

def build(cid):
    c=by[MAPA[cid]];n=APP[cid]["name"];rnd=random.Random("g"+cid);dl=c.get("demanda_laboral") or {};dif=c.get("dificultad") or {};pf=c.get("perfil") or {}
    dia=partes_dia(c.get("dia_a_dia"))
    # ---------- unidad 1: ¿de qué se trata? ----------
    o=otras(cid,2,rnd,lambda k,x:len(partes_dia(x.get("dia_a_dia")))>=2)
    L0=L("0","Conócela",1,[esc("Antes de leer nada: ¿qué crees que hace alguien que estudió "+n+"?"),
        preg("¿Cuál de estas cosas crees que hace?",dia[0] if dia else cap(corta(re.split(r"[.;]",c["que_es"])[0],10)),[partes_dia(by[MAPA[k]]["dia_a_dia"])[0] for k in o],
             "En pocas palabras, "+n+" es "+corta(c["que_es"].rstrip("."),40)+".",rnd),
        info(n+" en una frase",cap(corta(frases(c["que_es"])[0],40))+"."),TEV])
    o2=otras(cid,1,rnd,lambda k,x:len(partes_dia(x.get("dia_a_dia")))>=2)
    L1=L("1","Un día normal",2,[esc("Imagina que acompañas un día entero a alguien de "+n+". ¿Qué crees que hace?"),
        info("Un día normal",None,dia[:6] if len(dia)>=2 else [cap(corta(x,16)) for x in frases(c["dia_a_dia"])][:5]),
        *([preg("¿Cuál de estas cosas NO es parte de su día?",partes_dia(by[MAPA[o2[0]]]["dia_a_dia"])[0],dia[1:3],
             "Eso lo hace alguien de "+APP[o2[0]]["name"]+", no de "+n+".",rnd)] if len(dia)>=3 else []),
        refl("De ese día, ¿qué te late más?",(dia[:3]+["Nada de eso"]) if len(dia)>=3 else ["Casi todo","Algunas cosas","Nada de eso"]),TEV])
    mats=[m for _,ms in materias(c) for m in ms];mm=[m for m in mats if MATH.search(m)]
    nivel=dif.get("nivel","Media");dificil=nivel in ("Alta","Muy alta","Media-alta")
    ej=dl.get("porcentaje_que_ejerce");mu=dl.get("porcentaje_mujeres")
    mit=[vf("En "+n+" llevas materias de matemáticas o con muchos números.",bool(mm),
            ("Sí: "+", ".join(mm[:3])+"." if mm else "No aparecen como materia propia en su plan de estudios.")+" Muchos eligen carrera pensando en evitar las matemáticas; mejor saberlo desde ahora.")]
    mit.append(vf("Es de las carreras más difíciles.",nivel in ("Alta","Muy alta"),"Su dificultad es "+nivel.lower()+". "+cap(dif.get("filtro","").rstrip("."))+"."))
    if ej is not None:
        k=round(ej*100);mit.append(vf("La mayoría de quienes la estudian terminan trabajando en otra cosa.",k<50,
            str(k)+" de cada 100 trabajan en algo de su carrera (IMCO, Compara Carreras 2026)."))
    if mu is not None:
        k=round(mu*100);mit.append(vf("Casi todos los que se dedican a esto son hombres.",k<25,
            "De cada 100 personas que la ejercen, "+str(k)+" son mujeres (IMCO, Compara Carreras 2026)."))
    L2=L("2","Mitos y realidades",2,[esc("¿Verdadero o falso? Primero di lo que crees.")]+mit+[TEV])
    # ---------- unidad 2: ¿va contigo? ----------
    L3=L("3","¿Se te da?",2,[esc("Para que una carrera te guste no basta con que te llame la atención. ¿Se te da lo que pide?"),
        info("Lo que pide "+n,None,(pf.get("habilidades") or [])[:4]),
        info("Y lo que te tiene que gustar",None,(pf.get("intereses") or [])[:4])]+
        [escala(q,"No","Sí") for q in (pf.get("preguntas_soy_yo") or [])[:3]]+[clave("Si dijiste que no a algo, no pasa nada: sirve para saber qué preguntar y qué carreras parecidas ver.")])
    et=materias(c);prim=et[0][1] if et else []
    o3=otras(cid,2,rnd,lambda k,x:bool(materias(x)) and len(materias(x)[0][1])>=2)
    L4=L("4","Lo que estudias",2,[esc("¿Qué crees que ves en el primer año de "+n+"?"),
        preg("¿Cuál crees que es el primer año?",", ".join(prim[:3]),[", ".join(materias(by[MAPA[k]])[0][1][:3]) for k in o3],
             "Esas son materias de los primeros semestres. Las otras son de "+" y ".join(APP[k]["name"] for k in o3)+".",rnd),
        info("Lo que vas viendo",None,[e+": "+", ".join(ms[:4]) for e,ms in et[:4]]),
        clave("Los nombres cambian un poco según la universidad; la idea general es esta."),TEV])
    # ---------- unidad 3: ¿y después? ----------
    cl=campo.get(MAPA[cid]) or "";lug=[cap(x.strip(" .")) for x in re.split(r",\s*",frases(cl)[0] if cl else "") if 1<=len(x.split())<=6][:6]
    o4=otras(cid,2,rnd,lambda k,x:bool(campo.get(MAPA[k])) and lug1(k) is not None) if False else None
    def lug1(k):
        f=frases(campo.get(MAPA[k]) or "");xs=[cap(y.strip(" .")) for y in re.split(r",\s*",f[0])] if f else []
        mine=" ".join(lug).lower()
        for x in xs:
            if x and 1<=len(x.split())<=6 and not any(w in mine for w in x.lower().split() if len(w)>4):return x
        return None
    L5=L("5","Dónde trabajarías",2,[esc("Al terminar, ¿dónde crees que trabajaría alguien de "+n+"?"),
        preg("¿Cuál de estos lugares es más de "+n+"?",lug[0] if lug else "En su campo",(lambda L:[x for i,x in enumerate(L) if x not in L[:i] and x!=(lug[0] if lug else "")][:2])([lug1(k) for k in otras(cid,12,rnd,lambda k,x:bool(campo.get(MAPA[k])) and lug1(k) is not None)]),
             "Es uno de los lugares donde trabaja alguien de "+n+".",rnd),
        info("Dónde se trabaja",None,lug or [cap(corta(cl))]),TEV])
    L6c=[esc("Ahora lo que todos preguntan: ¿hay trabajo y cuánto se gana?")]
    if cif_ok(cid+".ocupacion_afin"):L6c.append({"tipo":"rango","pregunta":"De cada 100 que estudiaron "+n+", ¿cuántos crees que trabajan en algo de su carrera?","min":0,"max":100,"paso":5,"unidad":"de cada 100","dato":cid+".ocupacion_afin"})
    if cif_ok(cid+".ingreso"):L6c.append({"tipo":"rango","pregunta":"¿Cuánto crees que gana al mes, en promedio?","min":5000,"max":50000,"paso":1000,"unidad":"pesos al mes","dato":cid+".ingreso"})
    if dl.get("nota"):L6c.append(info("Así está el trabajo",cap(dl["nota"].strip())))
    if dl.get("requiere"):L6c.append(clave(cap(dl["requiere"].strip())))
    L6=L("6","¿Hay trabajo?",2,L6c+[TEV])
    par=[APP[k]["name"] for k in (c.get("carreras_parecidas") or []) if k in APP][:4]
    L7=L("7","Qué tan difícil es",2,[esc("¿Dónde crees que está lo más difícil de "+n+"?"),
        info("Lo más difícil","Dificultad "+nivel.lower()+". "+cap(dif.get("filtro","").rstrip("."))+".",None),
        info("Cuánto dura",cap(c.get("duracion","").rstrip("."))+"."),
        escala("¿Te ves aguantando eso?","No","Sí")]+
        ([info("Si te gusta, pero no del todo",None,["Mira también: "+", ".join(par)])] if par else [])+[TEV])
    # ---------- unidad 4: tu decisión ----------
    EX=L("ex","Tu veredicto",2,[esc("Ya sabes qué hace alguien de "+n+", qué estudias, qué tan difícil es y si hay trabajo."),
        {"tipo":"escuelas"},{"tipo":"veredicto"},clave("Decidir «sigo en duda» también es avanzar.")])
    U=[{"id":"u1","titulo":"¿De qué se trata?","sub":"Qué hace y cómo es su día","lecciones":[L0,L1,L2]},
       {"id":"u2","titulo":"¿Va contigo?","sub":"Lo que pide y lo que estudias","lecciones":[L3,L4]},
       {"id":"u3","titulo":"¿Y después?","sub":"Trabajo y dificultad","lecciones":[L5,L6,L7]},
       {"id":"u4","titulo":"Tu decisión","sub":"¿La guardas o la descartas?","lecciones":[EX]}]
    return {"id":cid,"version":3,"formato":2,"estado":"completo","generado":True,
            "revision":"Lecciones generales (de qué trata la carrera y si va contigo), armadas con datos/lecciones_generales.py desde la base de carreras con fuentes ("+src["meta"]["fecha_corte"]+").",
            "unidades":U}

if __name__=="__main__":
    k=0
    for cid in sorted(MAPA):
        if cid not in APP or MAPA[cid] not in by:print("sin datos:",cid);continue
        json.dump(build(cid),open(D+"/carreras/"+cid+".json","w"),ensure_ascii=False,indent=1);k+=1
    print(k,"carreras con lecciones generales")
