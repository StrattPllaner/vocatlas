# inyecta los módulos isométricos en index.html entre marcadores (se puede correr muchas veces)
import os
src=os.path.dirname(os.path.abspath(__file__))+'/'
p=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','index.html');s=open(p).read()
import re,json
# cara de Rumbo: se toma tal cual de cara-rumbo.svg (un solo path, evenodd); se separa en sus subtrazos sin tocar su forma
cs=open(os.path.join(src,'..','cara-rumbo.svg')).read()
vb=re.search(r'viewBox="([^"]+)"',cs).group(1)
cd=re.search(r' d="([^"]+)"',cs).group(1)
subs=[x.strip() for x in re.split(r'(?=M)',cd) if x.strip()]
js='/* cara de Rumbo, copiada de cara-rumbo.svg por build.py; no se edita a mano */\nvar CARA={vb:'+json.dumps(vb)+',sub:'+json.dumps(subs)+'};\n'
# catálogo de contenido (datos/): estructura común, carreras con contenido, cifras y la lección de muestra de las dinámicas
import glob
D=os.path.join(src,'..','datos')+'/'
cat={'ip':json.load(open(D+'onet/ip.json')),'regla':json.load(open(D+'regla-intereses.json')),'est':json.load(open(D+'estructura.json')),'cif':json.load(open(D+'cifras.json')),'demo':json.load(open(D+'demo-dinamicas.json')),'guiones':{f[:-5]:json.load(open(D+'guiones/'+f)) for f in sorted(os.listdir(D+'guiones')) if f.endswith('.json')} if os.path.isdir(D+'guiones') else {},'voz':sorted(k for k in json.load(open(D+'../media/voz/indice.json')).keys() if not k.startswith('_')) if os.path.exists(D+'../media/voz/indice.json') else [],'unisrc':'datos/universidades.json?v='+__import__('hashlib').sha1(open(D+'universidades.json','rb').read()).hexdigest()[:10],'car':{}}
# el texto de las lecciones no va dentro de la página: se descarga de datos/carreras/<id>.json al abrir una lección
# (con la huella del archivo en la dirección, para que una versión nueva no salga de la copia vieja)
import hashlib
for f in sorted(glob.glob(D+'carreras/*.json')):
    raw=open(f,'rb').read();c=json.loads(raw)
    for u in c['unidades']:
        for l in u['lecciones']:
            # qué clase de lección es, para mostrarlo en el temario (las tarjetas se descargan aparte)
            tp=[t['tipo'] for t in l.get('tarjetas',[])]
            l['k']='examen' if l.get('examen') else 'dato' if 'ficha' in tp else 'lee' if 'pregunta' in tp else 'chat' if 'chat' in tp else 'reto' if any(x in tp for x in ('bloques','patron','presupuesto','armar','componer','encuadre')) else 'voltear' if 'voltear' in tp else 'testi' if 'testimonio' in tp else 'dato' if 'rango' in tp else 'lee' if 'info' in tp else 'sobre' if tp and all(x in ('reflexion','escena','clave','interes','resumen','comparar','veredicto','dos_caminos') for x in tp) else 'juega'
            l.pop('tarjetas',None)
    c['src']='datos/carreras/'+c['id']+'.json?v='+hashlib.sha1(raw).hexdigest()[:10]
    cat['car'][c['id']]=c
cat['sym']=sorted(f[:-5] for f in os.listdir(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','media','sym')) if f.endswith('.webp'))
import hashlib
_v3=hashlib.sha1(b''.join(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','vendor','3d',f),'rb').read() for f in sorted(os.listdir(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','vendor','3d'))) if f.endswith('.js'))).hexdigest()[:10]
js+='/* catálogo de contenido, copiado de datos/ por build.py; no se edita aquí */\nvar CAT='+json.dumps(cat,ensure_ascii=False,separators=(',',':'))+';\n'
js+=open(src+'rumbo.js').read().replace('/*@skins*/',open(src+'skins.js').read())+'\n'
js+=''.join(open(src+f).read()+'\n' for f in ['imgfix.js','pausa.js','iso-lib.js','iso-gen.js','iso-env-old.js','iso-env.js','iso-bld.js','iso-bld2.js','iso-bld3.js','estructuras4.js','iso-map.js','iso-fix.js','islas3.js','simbolos.js','iso-art.js','rumbo-page.js','leccion.js','torre.js','ruta.js','intereses.js','comparar.js','sprite.js','amb.js','mine.js','escuelas.js','sueldo.js','puertas.js','apuntes.js','voz.js','explica.js','perfil.js'])
css=open(src+'iso.css').read()+open(src+'mine.css').read()+open(src+'perfil.css').read()+open(src+'ruta.css').read()+open(src+'intereses.css').read()+open(src+'comparar.css').read()+open(src+'ancho.css').read()+open(src+'simbolos.css').read()+open(src+'sueldo.css').read()+open(src+'puertas.css').read()+open(src+'ventanas.css').read()+open(src+'explica.css').read()
def put(s,a,b,body,anchor,before=True):
    if a in s:
        i=s.index(a);j=s.index(b,i)+len(b);return s[:i]+a+'\n'+body+b+s[j:]
    k=s.index(anchor);blk=a+'\n'+body+b+'\n'
    return s[:k]+blk+s[k:]
s=put(s,'/*@iso-css*/','/*@iso-css-fin*/',css,'</style>')
# carreras nuevas (datos/carreras-extra.json): se suman a la lista C de la app
ex=[{k:x[k] for k in ('id','name','area','sub','color','tags','desc','q','o','r')} for x in json.load(open(D+'carreras-extra.json'))]
s=put(s,'/*@extra*/','/*@extra-fin*/','C=C.concat('+json.dumps(ex,ensure_ascii=False,separators=(',',':'))+');\n','/*@extra*/')
js=js.replace('__V3D__',_v3)
s=put(s,'/*@iso-js*/','/*@iso-js-fin*/',js,'/* ================= sistema de diseño: iconos, sonidos y catálogo #kit')
open(p,'w').write(s)
print('ok',len(s))
