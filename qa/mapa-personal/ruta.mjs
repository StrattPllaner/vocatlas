import {launch,page,state} from './lib.mjs';
const b=await launch();
for(const [sz,dk] of [['desk',false],['m390',true],['ipad',false]]){
const p=await page(b,sz,dk,state(['medicina','computacion','derecho'],{medicina:2}));await p.waitForTimeout(3000);
await p.evaluate(()=>__vt('openCareer("medicina")'));await p.waitForTimeout(2500);await p.screenshot({path:`../f3/r2-${sz}${dk?'-d':''}.png`});
// la línea pasa por el centro de cada parada
const off=await p.evaluate(()=>{const svg=document.querySelector('.rt-line').getBoundingClientRect();let m=0;document.querySelectorAll('.lp-n').forEach(n=>{const r=n.getBoundingClientRect();});const c=document.querySelector('#lpCol').getBoundingClientRect();return Math.round(Math.abs((svg.left+svg.width/2)-(c.left+c.width/2)))});
const vis=await p.evaluate(()=>{const sc=document.querySelector('#lpScroll').getBoundingClientRect();return [...document.querySelectorAll('.lp-n')].filter(n=>{const r=n.getBoundingClientRect();return r.top>=sc.top&&r.bottom<=sc.bottom}).length});
console.log(sz,dk,'desfase de la línea',off,'paradas visibles',vis,p.errs.length);await p.context().close()}
await b.close();
