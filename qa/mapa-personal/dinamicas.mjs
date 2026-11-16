import {launch} from './lib.mjs';
const b=await launch();
for(const [w,h] of [[390,844],[360,800]]){
const c=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:2,isMobile:true,hasTouch:true});const p=await c.newPage();p.setDefaultTimeout(4000);const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:8765/index.html#din');await p.waitForTimeout(1500);
const go=async()=>{await p.click('#lcGo');await p.waitForTimeout(250)};const sh=async n=>{if(w===390)await p.screenshot({path:`../f3/d-${n}.png`})};const ov=[];
const chk=async()=>{if(await p.evaluate(()=>{const b=document.querySelector('.lc-body');return b.scrollWidth>b.clientWidth+1}))ov.push(await p.getAttribute('.lc-card','data-t'))};
try{
// armar: primero falla (todo madera), luego acierta
await chk();for(const s of await p.$$('[data-s]'))await s.click();await go();await sh('armar-falla');
await p.click('[data-p="1"]');for(const s of await p.$$('[data-s]'))await s.click();await p.click('[data-p="2"]');await (await p.$$('[data-s]'))[0].click();await p.click('[data-p="0"]');await (await p.$$('[data-s]'))[1].click();await go();await sh('armar');await go();
// bloques
await chk();await p.click('[data-b="0"]');await p.waitForTimeout(200);await p.click('[data-b="3"]');await p.waitForTimeout(200);await p.click('.lc-opt');await go();await sh('bloques');await go();
// patron
await chk();await (await p.$$('.lc-opt'))[2].click();await go();await sh('patron');await go();
// presupuesto
await chk();for(const s of await p.$$('.lc-bud button')){await s.click();await p.waitForTimeout(80)}await sh('presupuesto-tope');await go();await sh('presupuesto');await go();
// encuadre
await chk();await sh('encuadre0');await p.click('.lc-enc button');await go();await sh('encuadre');await go();
// componer
await chk();const z=[0,2,3,4];for(let i=0;i<4;i++){await p.click(`[data-e="${i}"]`);await p.click(`[data-z="${z[i]}"]`)}await go();await sh('componer');await go();
}catch(e){console.log('SE DETUVO en',await p.getAttribute('.lc-card','data-t').catch(()=>'?'),e.message.split('\n')[0]);await p.screenshot({path:'../f3/d-error.png'})}
await p.waitForTimeout(600);console.log(w,'fin',!(await p.$('.lc')),'desbordes',ov,'errores',errs);await c.close()}
await b.close();
