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
js+=''.join(open(src+f).read()+'\n' for f in ['rumbo.js','iso-lib.js','iso-gen.js','iso-env-old.js','iso-env.js','iso-bld.js','iso-bld2.js','iso-bld3.js','iso-map.js','iso-fix.js','iso-art.js','rumbo-page.js'])
css=open(src+'iso.css').read()
def put(s,a,b,body,anchor,before=True):
    if a in s:
        i=s.index(a);j=s.index(b,i)+len(b);return s[:i]+a+'\n'+body+b+s[j:]
    k=s.index(anchor);blk=a+'\n'+body+b+'\n'
    return s[:k]+blk+s[k:]
s=put(s,'/*@iso-css*/','/*@iso-css-fin*/',css,'</style>')
s=put(s,'/*@iso-js*/','/*@iso-js-fin*/',js,'/* ================= sistema de diseño: iconos, sonidos y catálogo #kit')
open(p,'w').write(s)
print('ok',len(s))
