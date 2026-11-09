# inyecta los módulos isométricos en index.html entre marcadores (se puede correr muchas veces)
import os
src=os.path.dirname(os.path.abspath(__file__))+'/'
p=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','index.html');s=open(p).read()
js=''.join(open(src+f).read()+'\n' for f in ['rumbo.js','iso-lib.js','iso-gen.js','iso-env-old.js','iso-env.js','iso-bld.js','iso-bld2.js','iso-map.js','iso-fix.js','iso-art.js','rumbo-page.js'])
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
