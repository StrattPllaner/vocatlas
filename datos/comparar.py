#!/usr/bin/env python3
"""Arma datos/comparar.json para el comparador con datos verificados de la base (IMCO Compara Carreras 2026 y universidades
de Morelos y CDMX). Nada se inventa: si un dato no existe, no se incluye y la app dice «pendiente»."""
import json,os
D=os.path.dirname(os.path.abspath(__file__))
src=json.load(open(D+'/fuentes/vocatlas_carreras.json'));by={c['id']:c for c in src['carreras']}
uni=json.load(open(D+'/universidades.json'))
ns={'__file__':D+'/lecciones_generales.py'};exec(open(D+'/lecciones_generales.py').read().split('if __name__')[0],ns)
MAPA=ns['MAPA'];UT={u['id']:u['tipo'] for u in uni['unis']}
out={}
for cid,fid in MAPA.items():
    c=by.get(fid)
    if not c:continue
    s=c.get('sueldo') or {};d=c.get('demanda_laboral') or {};o={}
    if s.get('promedio_mensual'):
        o['sueldo']={'prom':s['promedio_mensual'],'rango':s.get('rango_medio'),'jov':s.get('menores_de_30'),'exp':s.get('de_30_o_mas'),'rank':s.get('ranking_nacional'),'aprox':s.get('es_aproximacion'),'campo':s.get('campo_imco')}
    for k,kk in (('desempleo','tasa_desempleo'),('informal','tasa_informalidad'),('ejerce','porcentaje_que_ejerce'),('mujeres','porcentaje_mujeres'),('posgrado','porcentaje_con_posgrado')):
        if d.get(kk) is not None:o[k]=round(d[kk]*100)
    o['duracion']=c.get('duracion');o['dificultad']=(c.get('dificultad') or {}).get('nivel')
    if d.get('requiere'):o['requiere']=d['requiere']
    ing=c.get('ingreso') or {};comp=[v for k,v in ing.items() if k!='nota' and v]
    if comp:o['competencia']=comp[0]
    e={}
    for x in (uni['car'].get(cid) or {}).get('donde',[]):
        for ed in x['edo']:
            if ed not in ('MOR','CMX'):continue
            t=UT.get(x['u'],'privada');e.setdefault(ed,{'pub':set(),'pri':set()})['pub' if t=='publica' else 'pri'].add(x['u'])
    o['escuelas']={k:{'pub':len(v['pub']),'pri':len(v['pri'])} for k,v in e.items()}
    o['fuente_empleo']=s.get('fuente') or d.get('fuente');o['corte']=c.get('verificado_al')
    out[cid]=o
json.dump(out,open(D+'/comparar.json','w'),ensure_ascii=False,indent=0)
print(len(out),'carreras')
