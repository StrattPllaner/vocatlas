// Boceto completo: a 0 % ninguna pieza del territorio de una carrera conserva sus colores originales.
import {launch,page,state,ALL} from './lib.mjs';
const b=await launch();let fail=0;
for(const [sz,pick] of [['desk',ALL],['m390',['medicina','computacion','derecho','arquitectura','veterinaria','negocios']]]){
 const p=await page(b,sz,false,state(pick,{}));await p.waitForTimeout(3500);
 // 1) inventario por código: cada pieza del territorio y el color de cada una de sus formas
 const inv=await p.evaluate(()=>{
  const ok=v=>!v||v==='none'||/^url\(#skp/.test(v)||/^var\(--sk/.test(v)||v==='currentColor';
  const bad=[],seen={},count={};
  const scan=(root,owner)=>{const all=[root,...root.querySelectorAll('*')];for(const e of all){
    if(e.tagName==='use'){const t=document.querySelector(e.getAttribute('href'));if(t)scan(t,owner);continue}
    if(e.closest('clipPath'))continue;
    for(const a of ['fill','stroke','stop-color']){const v=e.getAttribute(a);if(!ok(v))bad.push(owner+' '+e.tagName+' '+a+'='+v)}
    const st=e.getAttribute('style');if(st&&/#[0-9a-f]{6}/i.test(st))bad.push(owner+' style '+st)}};
  const W=document.querySelector('#world');
  // piezas: todo lo que hay dentro de las islas con carrera
  for(const e of W.querySelectorAll('.m-objs>g')){
   const cls=e.getAttribute('class'),kind=/m-br/.test(cls)?'puente':/m-gh/.test(cls)?'islote por descubrir':/poi/.test(cls)?'edificio':'decoración:'+(e.getAttribute('data-k')||'?');
   count[kind]=(count[kind]||0)+1;
   if(kind==='puente'||kind==='islote por descubrir')continue;
   const c=e.getAttribute('data-c');if(!c){bad.push('sin carrera: '+cls);continue}
   const sk=e.querySelector(':scope>.vbz'),co=e.querySelector(':scope>.vco');
   if(!sk||!co){bad.push(kind+' sin las dos versiones');continue}
   if(getComputedStyle(co).display!=='none')bad.push(kind+' de '+c+': versión a color visible a 0 %');
   if(getComputedStyle(sk).display==='none')bad.push(kind+' de '+c+': boceto oculto a 0 %');
   scan(sk,kind+' de '+c)}
  // suelo: una capa de boceto por carrera
  const ids=[...W.querySelectorAll('.terr')].map(e=>e.getAttribute('data-id'));
  for(const id of ids){const g=W.querySelector('.t-gsk [data-c="'+id+'"]>.vbz');if(!g){bad.push('suelo sin boceto: '+id);continue}count.suelo=(count.suelo||0)+1;scan(g,'suelo de '+id)}
  return {bad:[...new Set(bad)],count,careers:ids.length}});
 console.log(sz,'carreras',inv.careers,JSON.stringify(inv.count));
 if(inv.bad.length){fail++;console.log('  FALLA',inv.bad.slice(0,15))}
 // 2) por pixeles: dentro de cada isla con carreras no debe haber color (se ocultan puentes, etiquetas, Rumbo y ambiente, que sí van a color)
 await p.addStyleTag({content:'#mlayer,#amb,#occl,.m-br,.hint,.clar,.zoom,.addc,nav{visibility:hidden!important}'});
 await p.click('#zfit').catch(()=>{});await p.evaluate(()=>{document.querySelector('#zfit').click()});await p.waitForTimeout(900);
 const polys=await p.evaluate(()=>__vt('JSON.stringify(ISOW.W.islands.map(function(L){return L.coast.map(function(q){var a=ISOW.pj(q,0);return [a[0]*view.s+view.tx,a[1]*view.s+view.ty]})}))')).then(JSON.parse);
 const buf=await p.screenshot({type:'png'});
 const res=await p.evaluate(async([u,polys,dpr])=>{const im=new Image();im.src=u;await im.decode();const c=document.createElement('canvas');c.width=im.width;c.height=im.height;const x=c.getContext('2d');x.drawImage(im,0,0);
  const inP=(px,py,P)=>{let k=false;for(let i=0,j=P.length-1;i<P.length;j=i++){if((P[i][1]>py)!==(P[j][1]>py)&&px<(P[j][0]-P[i][0])*(py-P[i][1])/(P[j][1]-P[i][1])+P[i][0])k=!k}return k};
  let n=0,bad=0;const ex=[];
  for(const P of polys){const xs=P.map(q=>q[0]),ys=P.map(q=>q[1]);for(let py=Math.max(0,Math.min(...ys));py<Math.min(innerHeight,Math.max(...ys));py+=2)for(let px=Math.max(0,Math.min(...xs));px<Math.min(innerWidth,Math.max(...xs));px+=2){
    if(!inP(px,py,P))continue;const d=x.getImageData(Math.round(px*dpr),Math.round(py*dpr),1,1).data,r=d[0],g=d[1],b2=d[2];n++;
    // papel y sepia: rojo >= verde >= azul, con poca diferencia entre rojo y verde
    const sepia=r>=g-2&&g>=b2-2&&(r-g)<46;if(!sepia){bad++;if(ex.length<6)ex.push([Math.round(px),Math.round(py),r,g,b2])}}}
  return {n,bad,ex}},['data:image/png;base64,'+buf.toString('base64'),polys,2]);
 const pct=res.bad/res.n*100;console.log('  pixeles revisados',res.n,'con color',res.bad,'('+pct.toFixed(2)+' %)',JSON.stringify(res.ex));
 if(pct>0.6){fail++;await p.screenshot({path:'../f2/sk-fail-'+sz+'.png'})}
 await p.context().close();
}
await b.close();console.log(fail?'FALLA':'OK');process.exit(fail?1:0);
