// Juega Medicina completa: las 21 lecciones, los cofres y el Rumbo de la carrera. Toma una captura de cada tipo de tarjeta.
import {launch,page,state} from './lib.mjs';
const SZ=process.argv[2]||'m390',DARK=process.argv[3]==='d',OUT=process.argv[4]||'../f3/';
const b=await launch();const seen={};let over=[];
const p=await page(b,SZ,DARK,state(['medicina','computacion','derecho'],{}));await p.waitForTimeout(3000);
await p.evaluate(()=>__vt('openCareer("medicina")'));await p.waitForTimeout(2200);
const go=async()=>{await p.click('#lcGo');await p.waitForTimeout(260)};
async function card(){
 const t=await p.getAttribute('.lc-card','data-t');
 // nada debe salirse a lo ancho ni quedar bajo el botón
 const ov=await p.evaluate(()=>{const b=document.querySelector('.lc-body');return b.scrollWidth>b.clientWidth+1||document.documentElement.scrollWidth>innerWidth});if(ov)over.push(t);
 const shot=async(s)=>{if(!seen[t+s]){seen[t+s]=1;await p.screenshot({path:`${OUT}c-${t}${s}-${SZ}${DARK?'-d':''}.png`})}};
 await shot('');
 const cl=async(sel,n=0)=>{const e=(await p.$$(sel))[n];if(e){await e.click();await p.waitForTimeout(120)}};
 if(['escena','clave','dato','testimonio','resumen','comparar'].includes(t)){await go();return}
 if(t==='decision'){await cl('.lc-opt');await go();await shot('-r');await go();return}
 if(t==='vf'){await cl('.lc-vf button');await shot('-r');await go();return}
 if(t==='dos_caminos'){await cl('.lc-two button');await shot('-r');await go();return}
 if(t==='reflexion'){if(await p.$('.lc-opt'))await cl('.lc-opt');else await cl('.lc-scale button',3);await go();return}
 if(t==='rango'){await go();await shot('-r');await go();return}
 if(t==='ordenar'){for(const e of await p.$$('.lc-oi')){await e.click()}await go();await shot('-r');await go();return}
 if(t==='emparejar'||t==='armar_dia'){for(const e of await p.$$('[data-r]')){await e.click()}await shot('-m');await go();await shot('-r');await go();return}
 if(t==='clasificar'){for(let i=0;i<12;i++){if(!(await p.$eval('#lcGo',e=>e.disabled)))break;await cl('.lc-clg button');await p.waitForTimeout(1250)}await shot('-r');await go();return}
 if(t==='interes'){await cl('.lc-int button');await go();return}
 if(t==='autoevaluacion'){await cl('.lc-a1 button',3);await cl('.lc-a2 button',2);await go();return}
 if(t==='veredicto'){await cl('.lc-ver button');await go();return}
 throw new Error('tipo sin jugar: '+t);
}
let lessons=0;
for(let guard=0;guard<40;guard++){

 const cur=await p.evaluate(()=>{const e=document.querySelector('.lp-n.s-cur,.lp-n.s-open');return e?+e.getAttribute('data-i'):-1});
 if(cur<0)break;
 await p.evaluate(i=>document.querySelector('.lp-n[data-i="'+i+'"]').click(),cur);await p.waitForTimeout(350);
 if(guard===0)await p.screenshot({path:`${OUT}pop-${SZ}.png`});
 await p.click('#lpGo');await p.waitForTimeout(500);
 if(await p.$('.lc')){lessons++;for(let k=0;k<12&&await p.$('.lc.on, .lc');k++){if(!(await p.$('.lc-card')))break;await card();if(!(await p.$('.lc')))break;await p.waitForTimeout(80)}await p.waitForTimeout(1300)}
 else{await p.waitForTimeout(900);if(await p.$('#lpLesson')){const sk=await p.$('.rt-skin');await p.screenshot({path:`${OUT}${sk?'skin':'cofre'}-${SZ}.png`});await p.click('#lpLok');await p.waitForTimeout(900)}}
 if(lessons===5&&!seen.mid){seen.mid=1;await p.waitForTimeout(500);await p.screenshot({path:`${OUT}ruta-mid-${SZ}${DARK?'-d':''}.png`})}
}
const fin=await p.evaluate(()=>__vt('JSON.stringify({p:progOf("medicina"),skin:skinOn("medicina"),chest:Object.keys(S.chest).length,auto:Object.keys(S.auto.medicina||{}).length,int:Object.keys(S.int.medicina||{}).length,res:S.res.medicina,rate:S.rate.medicina,ver:S.ver.medicina})'));
await p.screenshot({path:`${OUT}ruta-fin-${SZ}${DARK?'-d':''}.png`});
console.log(SZ,DARK?'noche':'dia','lecciones jugadas',lessons,fin,'tipos',Object.keys(seen).filter(k=>!/-/.test(k)&&k!=='mid').join(','),'desbordes',over,'errores',p.errs);
await b.close();
