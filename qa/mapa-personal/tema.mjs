import {launch,page,state} from './lib.mjs';
const out=(process.env.OUT||'.')+'/';
const b=await launch();
const st=state(['medicina','computacion','cine'],{medicina:4,computacion:2});
const bg=p=>p.evaluate(()=>getComputedStyle(document.body).backgroundColor+' night='+!!document.querySelector('#world .is-night')+' tema='+localStorage.vocatlas_tema);
for(const sys of [false,true]){
 const p=await page(b,'m390',sys,st);await p.waitForTimeout(4500);
 await p.evaluate(()=>window.__vt('showView("yo")'));await p.waitForTimeout(900);
 await p.evaluate(()=>{document.querySelector('#yTema').scrollIntoView({block:'center'})});
 console.log('sistema',sys?'oscuro':'claro',await bg(p));
 const want=sys?'light':'dark';
 await p.click('#yTema [data-t='+want+']');await p.waitForTimeout(900);console.log(' tras elegir',want,await bg(p));
 await p.screenshot({path:out+'tema-'+want+'-yo.png'});
 await p.evaluate(()=>window.__vt('showView("map")'));await p.waitForTimeout(1500);await p.screenshot({path:out+'tema-'+want+'-map.png'});
 await p.reload();await p.waitForTimeout(4500);console.log(' tras recargar',await bg(p));await p.screenshot({path:out+'tema-'+want+'-re.png'});
 await p.evaluate(()=>window.__vt('showView("yo")'));await p.waitForTimeout(700);
 await p.evaluate(()=>{document.querySelector('#yTema').scrollIntoView({block:'center'})});
 await p.click('#yTema [data-t=auto]');await p.waitForTimeout(700);console.log(' auto',await bg(p),'errs',p.errs.length);
 await p.context().close();
}
await b.close();
