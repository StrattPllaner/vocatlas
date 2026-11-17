#!/usr/bin/env python3
"""Arma las 21 lecciones de cada carrera que no tiene contenido escrito a mano, con lo que trae la base de carreras
(datos/fuentes/vocatlas_carreras.json): qué es, día a día, dificultad, materias, perfil, empleo y escuelas.
Cada lección primero enseña (lectura o plática con Rumbo) y luego pregunta sobre eso. Las respuestas correctas salen
de la carrera; las incorrectas, de carreras de otra área. No se escribe ninguna cifra en el texto: sueldos, costos y
duración van por cifras.json. A las carreras escritas a mano solo se les agrega una plática con Rumbo en «Un día real».
Uso: python3 datos/generar_lecciones.py && python3 datos/validar.py && python3 src/build.py"""
import json,os,re,random
D=os.path.dirname(os.path.abspath(__file__));R=os.path.join(D,"..")
src=json.load(open(D+"/fuentes/vocatlas_carreras.json"))
by={c["id"]:c for c in src["carreras"]}
campo={x.get("carrera_id"):x.get("campo_laboral_pdf") for x in src["catalogo"] if x.get("carrera_id")}
UNIS={u["id"]:u for u in src["universidades"]}
html=open(R+"/index.html").read()
# carreras de la app: nombre, área y mini reto (las originales viven en index.html; las nuevas en carreras-extra.json)
APP={}
for m in re.finditer(r'\{id:"([a-z]+)",name:"([^"]+)",area:"([a-z]+)"[^\n]*\n\s*q:"([^"]+)",o:\[([^\]]+)\],\s*\n\s*r:"([^"]+)"',html):
    APP[m.group(1)]={"name":m.group(2),"area":m.group(3),"q":m.group(4),"o":re.findall(r'"([^"]+)"',m.group(5)),"r":m.group(6)}
EXTRA=json.load(open(D+"/carreras-extra.json"))
for x in EXTRA:APP[x["id"]]={"name":x["name"],"area":x["area"],"q":x["q"],"o":x["o"],"r":x["r"]}
MAPA={"medicina":"medicina","nutricion":"nutricion","psicologia":"psicologia","veterinaria":"mvz","civil":"ingenieria-civil",
      "mecatronica":"mecatronica","aeroespacial":"aeronautica","ambiental":"ingenieria-ambiental","computacion":"sistemas-computacionales",
      "datos":"ciencia-de-datos","biotec":"biotecnologia","fisica":"fisica","derecho":"derecho","negocios":"administracion",
      "finanzas":"finanzas","educacion":"pedagogia","arquitectura":"arquitectura","moda":"diseno-modas","comunicacion":"comunicacion"}
for x in EXTRA:MAPA[x["id"]]=x["fid"]
AREAN={"salud":"Salud","ing":"Ingenierías","tec":"Tecnología y ciencias","neg":"Negocios y sociedad","arte":"Arte y comunicación"}
ESCRITAS={os.path.basename(p)[:-5] for p in os.listdir(D+"/carreras") if p.endswith(".json")}
ESCRITAS={k for k in ESCRITAS if not json.load(open(D+"/carreras/"+k+".json")).get("generado")}

# ---------- texto: frases cortas, sin cifras ----------
NUM=re.compile(r"\d[\d,.]*\s*(%|por ciento)|\$\s*\d|\d[\d,.]*\s*(mil |millones|pesos|semestres)",re.I)
def frases(t):
    t=(t or "").strip()
    return [f.strip() for f in re.split(r"(?<=[.;])\s+",t) if f.strip()]
def cap(t):return t[:1].upper()+t[1:] if t else t
def corta(t,n=36):
    w=t.split()
    if len(w)<=n:return t
    t=" ".join(w[:n]);k=max(t.rfind(","),t.rfind(";"),t.rfind(":"))
    return (t[:k] if k>len(t)*.5 else t).rstrip(",;: ")+"…"
def limpias(t,n=36,maxi=4,digitos=False):
    out=[]
    for f in frases(t):
        if NUM.search(f) or (not digitos and re.search(r"\d",f)):continue
        out.append(cap(corta(f.rstrip(";"),n)))
        if len(out)>=maxi:break
    return out
def poco(v,alto,medio,bajo):
    if v is None:return None
    return alto if v>=.6 else medio if v>=.4 else bajo

# ---------- tarjetas ----------
def info(titulo,texto=None,puntos=None):
    d={"tipo":"info","titulo":titulo}
    if texto:d["texto"]=texto
    if puntos:d["puntos"]=puntos
    return d
def dec(p,ok,malas,cons_ok,cons_mal):
    return {"tipo":"decision","pregunta":p,"opciones":[{"texto":ok,"consecuencia":cons_ok,"mejor":True}]+[{"texto":t,"consecuencia":cm} for t,cm in zip(malas,cons_mal)]}
def vf(a,r,rv):return {"tipo":"vf","afirmacion":a,"respuesta":r,"revelacion":rv}
def refl(p,ops):return {"tipo":"reflexion","pregunta":p,"opciones":ops}
def escala(p,a="No va conmigo",b="Va mucho conmigo"):return {"tipo":"reflexion","pregunta":p,"escala":[a,b]}
def clave(t):return {"tipo":"clave","texto":t}
def interes(p=None):return {"tipo":"interes","pregunta":p} if p else {"tipo":"interes"}
def dos(p,a,b):return {"tipo":"dos_caminos","pregunta":p,"a":{"texto":a[0],"dice":a[1]},"b":{"texto":b[0],"dice":b[1]}}
def L(i,t,m,cards):return {"id":i,"titulo":t,"minutos":m,"tarjetas":cards}

def otras(cid,n,rnd,campo_fn):
    """n carreras de otra área (según la base) que sí tienen el dato pedido"""
    a=by[MAPA[cid]]["area"];pool=[k for k,f in MAPA.items() if k!=cid and f in by and by[f]["area"]!=a and campo_fn(by[f])]
    rnd.shuffle(pool);return pool[:n]

def chat_dia(cid,c,n):
    """plática con Rumbo sobre el trabajo: día a día, lo difícil, si hay trabajo y qué se necesita"""
    dl=c.get("demanda_laboral") or {};dif=c.get("dificultad") or {}
    temas=[]
    d=limpias(c.get("dia_a_dia"),30,3)
    if d:temas.append({"q":"¿Qué haces en un día normal?","a":d})
    f=limpias(dif.get("filtro"),30,2,True)
    if dif.get("nivel") or f:temas.append({"q":"¿Qué es lo más difícil?","a":([f"Se considera una carrera de dificultad {dif['nivel'].lower()}."] if dif.get("nivel") else [])+f})
    ej=poco(dl.get("porcentaje_que_ejerce"),"La mayoría de quienes la estudian trabaja en algo de su carrera.","Cerca de la mitad trabaja en algo de su carrera.","Menos de la mitad trabaja en algo de su carrera; muchos se mueven a otras áreas.")
    nota=limpias(dl.get("nota"),30,2)
    if ej or nota:temas.append({"q":"¿Hay trabajo?","a":([ej+" Es un promedio nacional del IMCO."] if ej else [])+nota})
    req=limpias(dl.get("requiere"),30,2,True)
    if req:temas.append({"q":"¿Qué necesito para ejercer?","a":req})
    return {"tipo":"chat","subtitulo":"Te cuenta cómo es trabajar en "+n,"intro":["¡Hola! Junté lo que se sabe de "+n+".","Pregúntame lo que quieras."],"temas":temas,"minimo":2,"auto":True} if len(temas)>=2 else None

def leccion_1(cid,c,n,rnd):
    U=[]
    dia=limpias(c.get("dia_a_dia"),26,3)
    o=otras(cid,2,rnd,lambda x:limpias(x.get("dia_a_dia"),26,1))
    cards=[info("¿Qué es "+n+"?",cap(corta(c.get("que_es",""),38)),dia[:3] or None)]
    if dia and len(o)==2:
        cards.append(dec("Por lo que leíste, ¿qué hace alguien de "+n+"?",dia[0],[limpias(by[MAPA[k]]["dia_a_dia"],26,1)[0] for k in o],
            "Exacto: eso es parte del día a día en "+n+".",["Eso lo hace alguien de "+APP[k]["name"]+"." for k in o]))
    else:cards.append(vf("Con el nombre de la carrera ya sabes cómo es "+n+".",False,"El nombre dice poco: lo que importa es qué harías cada día."))
    ar=APP[cid]["area"];malas=[v for k,v in AREAN.items() if k!=ar];rnd.shuffle(malas)
    par=[by[p]["nombre"] for p in (c.get("carreras_parecidas") or []) if p in by][:3]
    cards.append({"tipo":"completar","frase":n+" es una carrera del área de ___.","opciones":[AREAN[ar]]+malas[:2],"correcta":0,
        "revelacion":"Está en "+AREAN[ar]+"."+(" Se parece a "+", ".join(par)+"." if par else "")})
    cards+=[clave("Antes de elegir, entiende qué harías cada día, no solo el nombre."),interes()]
    U.append(L("1.1","Qué es y qué hace",3,cards))
    cl=campo.get(MAPA[cid]);lug=[cap(x.strip(" .")) for x in re.split(r",| y ",(frases(cl)[0] if cl else "")) if x.strip()][:4]
    if cl:
        U.append(L("1.2","Dónde trabajas",3,[info("Dónde trabaja alguien de "+n,cap(corta(frases(cl)[0],38)),limpias(" ".join(frases(cl)[1:]),30,2) or None),
            vf("Alguien de "+n+" solo puede trabajar en un tipo de lugar.",False,"Puede trabajar en varios: "+", ".join(x.lower() for x in lug[:3])+"."),
            refl("¿Dónde te ves trabajando?",lug[:4] if len(lug)>=2 else ["En una institución","En una empresa","Por mi cuenta","No sé todavía"]),
            clave("Una carrera abre varias puertas, no una sola."),interes()]))
    else:
        U.append(L("1.2","Dónde trabajas",3,[info("Dónde trabaja alguien de "+n,None,dia or ["Revisa el campo laboral en el plan de estudios de cada escuela."]),
            vf("Todas las personas de "+n+" hacen exactamente lo mismo.",False,"Cada quien se especializa en algo distinto según dónde trabaja."),
            refl("¿Dónde te ves trabajando?",["En una institución","En una empresa","Por mi cuenta","No sé todavía"]),clave("Una carrera abre varias puertas, no una sola."),interes()]))
    ch=chat_dia(cid,c,n);dif=c.get("dificultad") or {}
    cards=[ch] if ch else [info("Lo que hay que saber",None,dia or [cap(corta(c.get("que_es",""),30))])]
    if dif.get("nivel"):
        lv=dif["nivel"];falso=rnd.random()<.5;otro={"Muy alta":"Baja","Alta":"Baja","Media":"Muy alta","Media-alta":"Baja","Baja":"Muy alta"}.get(lv,"Baja")
        cards.append(vf(n+" se considera una carrera de dificultad "+(otro if falso else lv).lower()+".",not falso,"Se considera de dificultad "+lv.lower()+". "+(limpias(dif.get("filtro"),24,1,True) or [""])[0]))
    else:cards.append(vf("Para "+n+" basta con que te guste el tema.",False,"El gusto ayuda, pero también hace falta constancia y estudiar las materias base."))
    cards+=[refl("¿Qué te llamó más la atención?",[t["q"] for t in (ch or {"temas":[]})["temas"]][:4] or ["Lo que hace cada día","Lo difícil","El trabajo","Nada en especial"]),
            clave("Preguntar a quien ya sabe ahorra muchos errores."),interes()]
    U.append(L("1.3","Pregúntale a Rumbo",4,cards))
    pars=[(by[p]["nombre"],corta(cap(by[p].get("que_es","")),9).rstrip("…").rstrip(",")) for p in (c.get("carreras_parecidas") or []) if p in by][:4]
    cards=[info("Carreras cercanas a "+n,None,[a+": "+b.lower()+"." for a,b in pars] or ["Revisa las carreras de la misma área en tu mapa."])]
    if len(pars)>=3:cards.append({"tipo":"emparejar","pregunta":"Une cada carrera con lo que estudia.","pares":[list(x) for x in pars],"revelacion":"Se cruzan en temas, pero cada una tiene su propio enfoque."})
    else:cards.append(vf("Las carreras parecidas son exactamente iguales.",False,"Comparten temas, pero el enfoque y el trabajo cambian."))
    cards+=[refl("¿Cuál de estas te da curiosidad?",[a for a,b in pars][:3]+["Me quedo con "+n]),clave("Si dudas entre dos, compara lo que harías cada día."),interes()]
    U.append(L("1.4","Carreras parecidas",3,cards))
    return U

def leccion_2(cid,c,n,rnd):
    U=[];a=dict(APP[cid]);pf=c.get("perfil") or {}
    sin=lambda t:re.sub(r"\d[\d,.]*\s*pesos","algo de dinero",t)
    a["q"]=sin(a["q"]);a["o"]=[sin(x) for x in a["o"]];a["r"]=sin(a["r"])
    U.append(L("2.1","Mini reto",3,[refl(a["q"],a["o"]),info("Así lo piensa alguien de "+n,a["r"]),escala("¿Te gustó pensar en algo así?","Nada","Mucho"),
        clave("Los retos de una carrera se parecen a lo que harías en su trabajo."),interes("¿Te ves resolviendo retos así?")]))
    hab=[cap(x) for x in pf.get("habilidades",[])][:4];o=otras(cid,2,rnd,lambda x:(x.get("perfil") or {}).get("habilidades"))
    if hab and len(o)==2:
        U.append(L("2.2","Lo que te piden",3,[info("Habilidades que usarás en "+n,None,hab),
            {"tipo":"completar","pregunta":"Según lo que leíste, completa la frase.","frase":"Para "+n+" es clave: ___.","opciones":[hab[0]]+[cap(by[MAPA[k]]["perfil"]["habilidades"][0]) for k in o],"correcta":0,"revelacion":"Es de las habilidades que más se usan en "+n+"."},
            escala("¿Qué tanto se te da esto: "+(hab[1] if len(hab)>1 else hab[0]).lower()+"?","Me cuesta","Se me da"),
            clave("Las habilidades se entrenan; lo importante es que te guste usarlas."),interes()]))
    else:U.append(L("2.2","Lo que te piden",3,[info("Lo que te piden",None,["Constancia para estudiar","Gusto por los temas de la carrera","Trabajar con otras personas"]),escala("¿Qué tanto te ves estudiando esto varios años?"),refl("¿Qué te preocupa más?",["Las materias","El tiempo","El costo","Nada"]),clave("Las habilidades se entrenan."),interes()]))
    it=[cap(x) for x in pf.get("intereses",[])][:4];o=otras(cid,2,rnd,lambda x:(x.get("perfil") or {}).get("intereses"))
    if it and len(o)==2:
        U.append(L("2.3","Temas que vas a ver",3,[info("Temas que te deben gustar",None,it),
            dec("¿Cuál de estos temas es más de "+n+"?",it[0],[cap(by[MAPA[k]]["perfil"]["intereses"][0]) for k in o],"Sí, es de sus temas centrales.",["Ese es más de "+APP[k]["name"]+"." for k in o]),
            refl("¿Cuál de estos temas te gusta más?",it[:3]+["Ninguno me late"]),clave("Si los temas te aburren, la carrera se hace muy larga."),interes()]))
    else:U.append(L("2.3","Temas que vas a ver",3,[info("Temas que vas a ver",None,limpias(c.get("que_es"),30,3) or ["Revisa el plan de estudios de cada escuela."]),escala("¿Qué tanto te interesan estos temas?"),refl("¿Qué quieres saber más?",["Las materias","El trabajo","Las escuelas","Nada"]),clave("Si los temas te aburren, la carrera se hace muy larga."),interes()]))
    et=((c.get("materias") or {}).get("por_etapa")) or [];o=otras(cid,2,rnd,lambda x:((x.get("materias") or {}).get("por_etapa") or [{}])[0].get("materias"))
    if et and len(o)==2:
        m0=et[0]["materias"]
        U.append(L("2.4","Materias clave",4,[{"tipo":"voltear","pregunta":"¿Qué materias crees que llevas en cada etapa? Piénsalo y voltea.","cartas":[{"frente":e["etapa"],"reverso":", ".join(e["materias"][:4])} for e in et[:4]]},
            dec("¿Cuál de estas materias llevarías en "+n+"?",m0[0],[by[MAPA[k]]["materias"]["por_etapa"][0]["materias"][0] for k in o],"Sí: es de las primeras materias de "+n+".",["Esa es de "+APP[k]["name"]+"." for k in o]),
            refl("¿Cuál te da más curiosidad?",m0[:4]),clave("Las primeras materias son la base; muchas veces son las más pesadas."),interes()]))
    else:U.append(L("2.4","Materias clave",4,[info("Materias",None,["Cada escuela tiene su propio mapa curricular.","Busca el de la escuela que te interese y revisa sus primeras materias."]),escala("¿Qué tanto te gustan las materias de ciencias básicas?"),refl("¿Revisaste algún plan de estudios?",["Sí","Todavía no"]),clave("El mapa curricular te dice qué vas a estudiar de verdad."),interes()]))
    return U

def leccion_3(cid,c,n,rnd):
    U=[];dia=limpias(c.get("dia_a_dia"),26,4);o=otras(cid,1,rnd,lambda x:limpias(x.get("dia_a_dia"),26,1))
    cards=[info("Un día de trabajo en "+n,None,dia or ["Revisa con alguien que la ejerza cómo es su día."])]
    if len(dia)>=2 and o:
        cards.append(dec("¿Qué de esto NO es parte del día de alguien de "+n+"?",limpias(by[MAPA[o[0]]]["dia_a_dia"],26,1)[0],dia[:2],
            "Exacto: eso lo hace alguien de "+APP[o[0]]["name"]+".",["Esto sí lo hace: es parte de su día.","Esto sí lo hace: es parte de su día."]))
    elif dia:
        o2=otras(cid,2,rnd,lambda x:limpias(x.get("dia_a_dia"),26,1))
        if len(o2)==2:cards.append(dec("¿Cuál de estas cosas sí hace alguien de "+n+"?",dia[0],[limpias(by[MAPA[k]]["dia_a_dia"],26,1)[0] for k in o2],
            "Sí: es parte de su día.",["Eso es más de "+APP[k]["name"]+"." for k in o2]))
    if len(cards)<2:cards.append(refl("¿Qué parte del día te gustaría más?",["Trabajar con personas","Resolver problemas","Crear algo","Organizar"]))
    cards+=[escala("¿Te ves haciendo esto todos los días?"),clave("El día a día pesa más que el título."),interes()]
    U.append(L("3.1","Un día real",4,cards))
    dif=c.get("dificultad") or {};f=limpias(dif.get("filtro"),30,3,True);o=otras(cid,2,rnd,lambda x:limpias((x.get("dificultad") or {}).get("filtro"),20,1,True))
    cards=[info("Lo difícil de "+n,("Se considera de dificultad "+dif["nivel"].lower()+".") if dif.get("nivel") else None,f or None)]
    if f and len(o)==2:cards.append(dec("Según lo que leíste, ¿qué es lo que más cuesta en "+n+"?",corta(f[0],20),[corta(limpias(by[MAPA[k]]["dificultad"]["filtro"],20,1,True)[0],20) for k in o],
        "Sí, es de lo que más cuesta en "+n+".",["Eso es más de "+APP[k]["name"]+"." for k in o]))
    cards+=[escala("¿Qué tanto te preocupa esto?","Mucho","Nada"),clave("Saber lo difícil desde antes te ayuda a prepararte."),interes()]
    U.append(L("3.2","Lo difícil",4,cards))
    U.append(L("3.3","Historia real",3,[refl("Si pudieras preguntarle algo a alguien que ya estudia "+n+", ¿qué sería?",["¿Qué fue lo más difícil?","¿Qué te sorprendió?","¿Volverías a elegirla?","¿Cómo es un día normal?"]),
        {"tipo":"testimonio","estado":"pendiente","perfil":"Estudiante de últimos semestres o egresado de "+n},
        refl("Mientras llega esta historia, ¿a quién podrías preguntarle tú?",["A un familiar o conocido que la estudió","A un estudiante de mi ciudad","A un maestro que la conozca","Todavía no conozco a nadie"]),
        clave("Una persona real te cuenta lo que ningún folleto dice."),interes()]))
    pq=[x for x in (c.get("perfil") or {}).get("preguntas_soy_yo",[]) if not NUM.search(x)][:3]
    while len(pq)<3:pq.append(["¿Te imaginas estudiando esto varios años?","¿Te gusta lo que hace cada día?","¿Te ves trabajando en esto?"][len(pq)])
    U.append(L("3.4","¿Es para ti?",3,[{"tipo":"escena","texto":"Contesta con honestidad. Nadie más ve tus respuestas."}]+[escala(x) for x in pq]+[clave("Si dijiste que sí a casi todo, vale la pena seguir explorándola."),interes()]))
    return U

def leccion_4(cid,c,n,rnd):
    U=[];et=((c.get("materias") or {}).get("por_etapa")) or []
    cards=[{"tipo":"escena","texto":"Cada escuela arma su plan distinto, pero el orden general se parece. Vamos a verlo."}]
    if len(et)>=3:cards.append({"tipo":"ordenar","pregunta":"Ordena lo que estudias, de lo primero a lo último.","pasos":[", ".join(e["materias"][:2]) for e in et[:5]],"revelacion":"Primero las bases y al final lo más especializado y las prácticas."})
    cards+=[{"tipo":"rango","pregunta":"¿Cuántos años crees que pasan desde que entras hasta que te titulas?","min":3,"max":10,"paso":1,"unidad":"años","dato":cid+".duracion"},
            clave("Revisa el mapa curricular de cada escuela: cambia de una a otra."),interes()]
    U.append(L("4.1","Cuánto dura y qué estudias",4,cards))
    us=[];[us.append(x["universidad"]) for x in c.get("donde_estudiarla",[]) if x["universidad"] in UNIS and x["universidad"] not in us]
    ex=[(UNIS[u]["nombre"],UNIS[u]["admision"]["examen"]) for u in us][:4]
    cards=[info("Cómo se entra en la región",None,[a+": "+b for a,b in ex] or ["Cada universidad publica su convocatoria con fechas y examen."])]
    if len(ex)>=3:
        cards.append(dec("Según lo que leíste, ¿qué pide "+ex[0][0]+" para entrar?",corta(ex[0][1],18),[corta(b,18) for a,b in ex[1:3]],"Exacto.",["Eso lo pide "+a+"." for a,b in ex[1:3]]))
    else:cards.append(refl("¿Ya sabes qué examen pide la escuela que te interesa?",["Sí","Más o menos","Todavía no"]))
    cards+=[vf("Todas las universidades usan el mismo examen.",False,"Cada una tiene el suyo: revisa la convocatoria de la que te interese."),
            clave("Conoce el examen de tu escuela desde antes."),interes()]
    U.append(L("4.2","Cómo se entra",4,cards))
    U.append(L("4.3","Dónde, cuánto cuesta y becas",4,[{"tipo":"escena","texto":"El costo cambia mucho entre una universidad pública y una privada. Antes de ver datos, apuesta."},
        {"tipo":"rango","pregunta":"¿Cuánto crees que cuesta un semestre en una universidad pública?","min":0,"max":60000,"paso":1000,"unidad":"pesos","dato":cid+".costo_publica"},
        {"tipo":"rango","pregunta":"¿Y un semestre en una universidad privada?","min":0,"max":300000,"paso":5000,"unidad":"pesos","dato":cid+".costo_privada"},
        {"tipo":"dato","titulo":"Becas para estudiar "+n,"dato":cid+".becas"},
        vf("Una universidad cara garantiza un mejor empleo.",False,"Pesan más lo que aprendes, tus prácticas y tu esfuerzo."),
        refl("¿Qué pesa más para ti al elegir escuela?",["El costo","Que esté cerca de mi casa","El prestigio","Las prácticas que ofrece"]),
        clave("Además de la colegiatura, cuenta transporte y materiales."),interes()]))
    return U

def leccion_5(cid,c,n,rnd):
    U=[];dl=c.get("demanda_laboral") or {};req=limpias(dl.get("requiere"),30,2,True);o=otras(cid,2,rnd,lambda x:limpias((x.get("demanda_laboral") or {}).get("requiere"),18,1,True))
    cards=[info("Qué te piden para trabajar",None,(req+limpias(dl.get("nota"),30,2)) or ["Título y cédula profesional para ejercer como profesionista."])]
    if req and len(o)==2:cards.append(dec("Según lo que leíste, ¿qué necesitas para ejercer "+n+"?",corta(req[0],18),[corta(limpias(by[MAPA[k]]["demanda_laboral"]["requiere"],18,1,True)[0],18) for k in o],"Exacto.",["Eso lo piden en "+APP[k]["name"]+"." for k in o]))
    cards+=[dos("¿Cómo te ves?",("En una institución o empresa","Más estabilidad y un equipo de quien aprender."),("Por tu cuenta","Más libertad, pero tienes que conseguir clientes.")),clave("Saber qué te piden te ahorra sorpresas al salir."),interes()]
    U.append(L("5.1","Qué piden para trabajar",4,cards))
    U.append(L("5.2","Sueldo y demanda",4,[{"tipo":"escena","texto":"Hablemos de dinero sin rodeos. Antes de ver cualquier cifra, apuesta: así recuerdas mejor el dato real."},
        {"tipo":"rango","pregunta":"¿Cuánto crees que gana al mes, en promedio, un profesionista de "+n+" en México?","min":5000,"max":100000,"paso":1000,"unidad":"pesos","dato":cid+".ingreso"},
        {"tipo":"rango","pregunta":"De cada 100 egresados, ¿cuántos crees que trabajan en algo de su carrera?","min":0,"max":100,"paso":5,"unidad":"de cada 100","dato":cid+".ocupacion_afin"},
        vf("Todos los egresados de "+n+" ganan lo mismo.",False,"Cambia con la experiencia, el lugar, la especialidad y si trabajas por tu cuenta."),
        escala("¿Qué tanto pesa el sueldo en tu decisión?"),clave("El promedio orienta, pero tu camino puede ser distinto."),interes()]))
    temas=[]
    a=poco(dl.get("porcentaje_que_ejerce"),"La mayoría trabaja en algo de su carrera.","Cerca de la mitad trabaja en algo de su carrera.","Menos de la mitad trabaja en algo de su carrera.")
    if a:temas.append({"q":"¿Cuántos trabajan en lo suyo?","a":[a,"Es un promedio nacional del IMCO."]})
    b=poco(dl.get("porcentaje_con_posgrado"),"Muchos siguen con un posgrado.","Una parte importante hace posgrado.","Pocos hacen posgrado; la mayoría empieza a trabajar.")
    if b:temas.append({"q":"¿Muchos hacen posgrado?","a":[b]})
    m=dl.get("porcentaje_mujeres")
    if m is not None:temas.append({"q":"¿Hay más hombres o mujeres?","a":["Hay más mujeres que hombres." if m>=.55 else "Hay más hombres que mujeres." if m<=.45 else "Hay casi el mismo número de hombres y mujeres.","Eso no decide nada: cualquiera puede estudiarla."]})
    inf=poco(dl.get("tasa_informalidad"),"Mucha gente trabaja sin prestaciones.","Una parte trabaja sin prestaciones.","La mayoría tiene un trabajo formal, con prestaciones.")
    if inf:temas.append({"q":"¿El trabajo tiene prestaciones?","a":[inf,"Las prestaciones son cosas como seguro médico y aguinaldo."]})
    if len(temas)>=2:
        cards=[{"tipo":"chat","subtitulo":"Te cuenta cómo les va al salir","intro":["Te cuento cómo les va a quienes estudian "+n+" al salir."],"temas":temas,"minimo":2}]
        pe=dl.get("porcentaje_que_ejerce")
        cards.append(vf("La mayoría de quienes estudian "+n+" trabaja en algo de su carrera.",bool(pe is not None and pe>=.5),(a or "")+" Promedio nacional del IMCO."))
    else:cards=[info("El futuro",None,["Pregunta a egresados cómo les fue al salir.","Revisa Compara Carreras del IMCO."]),escala("¿Qué tanto te importa encontrar trabajo rápido?")]
    cards+=[refl("¿Qué te importa más de tu futuro trabajo?",["Que tenga que ver con lo que estudié","Ganar bien","Tener prestaciones","Hacer algo que me guste"]),clave("Pregunta cómo les va a quienes ya salieron."),interes()]
    U.append(L("5.3","Cómo les va al salir",4,cards))
    par=[by[p]["nombre"] for p in (c.get("carreras_parecidas") or []) if p in by][:3]
    U.append(L("5.4","Después de titularte",3,[info("Después de titularte",None,["Puedes especializarte con cursos, diplomados o una maestría.","También puedes trabajar desde el inicio y estudiar después."]+(["Se combina bien con: "+", ".join(par)+"."] if par else [])),
        dos("¿Qué harías al terminar?",("Trabajar desde el inicio","Ganas experiencia y dinero; después decides si estudias más."),("Seguir estudiando","Te especializas antes; tardas más en empezar a trabajar.")),
        refl("¿Cómo te imaginas después de la carrera?",["Trabajando","En una maestría","Emprendiendo","No sé todavía"]),
        clave("Al titularte empieza otra parte del camino, no termina."),interes()]))
    return U

def leccion_6(n):
    return [L("6.1","Lo que sentiste",3,[refl("Antes de ver tus respuestas: ¿cómo te fue con "+n+"?",["Me gustó más de lo que pensaba","Más o menos como esperaba","Me gustó menos de lo que pensaba"]),
        {"tipo":"resumen"},refl("Viendo tus respuestas, ¿qué pesó más?",["Lo que sentí al probarla","Lo que supe de la realidad","El camino para llegar","El futuro que ofrece"]),
        clave("Lo que sentiste al probarla vale más que lo que imaginabas."),interes("¿Te ves estudiando "+n+"?")]),
     L("6.2","Tu veredicto",3,[refl("Si mañana tuvieras que elegir carrera, ¿"+n+" estaría entre tus opciones?",["Sí, entre las primeras","Sí, pero no arriba","No creo","No lo sé"]),
        {"tipo":"comparar"},dos("¿Qué te ayudaría más a decidir?",("Hablar con alguien que la estudia","Busca a un estudiante o egresado cerca de ti y hazle tus preguntas. Una plática aclara más que diez videos."),("Probar otra carrera y comparar","Explora otra de tu mapa. Comparar dos caminos reales aclara más que pensar en uno solo.")),
        {"tipo":"veredicto"},clave("Decidir «en duda» también es avanzar.")])]

UN=[("u1",1),("u2",2),("u3",3),("u4",4),("u5",5),("u6",6)]
hechas=0;platicas=0
for cid,fid in MAPA.items():
    c=by.get(fid)
    if not c or cid not in APP:continue
    n=APP[cid]["name"];rnd=random.Random(cid)
    if cid in ESCRITAS:
        # escrita a mano: solo se agrega la plática con Rumbo en «Un día real», antes de la idea clave
        p=D+"/carreras/"+cid+".json";j=json.load(open(p));ch=chat_dia(cid,c,n)
        for u in j["unidades"]:
            for l in u["lecciones"]:
                if l["id"]=="3.1":
                    l["tarjetas"]=[t for t in l["tarjetas"] if not t.get("auto")]
                    if ch:k=[t["tipo"] for t in l["tarjetas"]].index("clave");l["tarjetas"].insert(k,ch);platicas+=1
        json.dump(j,open(p,"w"),ensure_ascii=False,indent=1);continue
    L1=leccion_1(cid,c,n,rnd)+leccion_2(cid,c,n,rnd)+leccion_3(cid,c,n,rnd)+leccion_4(cid,c,n,rnd)+leccion_5(cid,c,n,rnd)+leccion_6(n)
    uni=[{"id":u,"lecciones":[l for l in L1 if l["id"].startswith(str(k)+".")]} for u,k in UN]
    out={"id":cid,"version":1,"estado":"completo","generado":True,
         "revision":"Armada automáticamente con la base de carreras de Morelos y CDMX ("+src["meta"]["fecha_corte"]+"). Falta que la revise alguien de la carrera.","unidades":uni}
    json.dump(out,open(D+"/carreras/"+cid+".json","w"),ensure_ascii=False,indent=1);hechas+=1
print(f"{hechas} carreras con lecciones armadas · {platicas} pláticas con Rumbo en carreras escritas a mano")
