import {launch,page,state,ALL,BASE} from './lib.mjs';
const out=process.argv[2];const b=await launch();
// 2. lección real: entrar a la carrera, completar "Qué haces" y volver al mapa
let p=await page(b,'m390',false,state(['medicina','computacion'],{medicina:3}));await p.waitForTimeout(4500);
await p.evaluate(()=>__vt('openCareer("computacion");1'));await p.waitForSelector('#plaza.on .lp-n.s-cur',{timeout:8000});await p.waitForTimeout(1600);
await p.click('#plaza .lp-n.s-cur');await p.waitForTimeout(500);await p.click('#lpGo');await p.waitForTimeout(600);await p.click('#lpLok');await p.waitForTimeout(1500);
console.log('avance compu:',await p.evaluate(()=>__vt('progOf("computacion").p+" tinta en mapa="+INK.computacion')));
await p.click('#pzx');await p.waitForTimeout(2300);await p.screenshot({path:out+'/tinta-mitad.png'});await p.waitForTimeout(2200);
console.log('tras volver: tinta=',await p.evaluate(()=>__vt('INK.computacion')),'claridad',await p.evaluate(()=>document.querySelector('#pct').textContent));
await p.screenshot({path:out+'/tinta-fin.png'});
// 3. completar medicina (falta veredicto) -> celebración
await p.evaluate(()=>__vt('S.rate.medicina=9;save();updateHud(true);refreshMap("medicina");1'));await p.waitForTimeout(3600);
console.log('celebración visible:',await p.evaluate(()=>!!document.querySelector('.ui-modal.cel.on')));await p.screenshot({path:out+'/celebra.png'});
await p.click('.ui-modal.cel .ui-btn');await p.waitForTimeout(500);
// 4. quitar y volver a agregar conserva avance
await p.evaluate(()=>__vt('PK.sel=["computacion"];pkApply([],["medicina"]);1'));await p.waitForTimeout(4500);
await p.evaluate(()=>__vt('PK.sel=["computacion","medicina"];pkApply(["medicina"],[]);1'));await p.waitForTimeout(5000);
console.log('medicina de vuelta: avance',await p.evaluate(()=>__vt('progOf("medicina").p+" tinta="+INK.medicina+" celebró otra vez="+!!document.querySelector(".ui-modal.cel")')),'errs',p.errs.length);
await p.context().close();
// 5. fluidez con 20 carreras y procesador a 1/4
for(const size of ['m390','desk']){
 const pr={};ALL.forEach((id,i)=>pr[id]=i%5);
 p=await page(b,size,false,state(ALL,pr),4);await p.waitForTimeout(8000);
 const r=await p.evaluate(()=>new Promise(res=>{__vt('hideHint();RB.follow=false;var f=fitAll();animView(f.s*1.6,f.tx-200,f.ty-150,2500);1');var t=[],l=performance.now();function f(n){t.push(n-l);l=n;if(t.length<150&&performance.now()-s0<3000)requestAnimationFrame(f);else{t.sort((a,b)=>a-b);res('cuadros '+t.length+' mediana '+t[t.length>>1].toFixed(1)+'ms p95 '+t[Math.floor(t.length*.95)].toFixed(1)+'ms')}}var s0=performance.now();requestAnimationFrame(f)}));
 console.log('fluidez',size,r);
 const r2=await p.evaluate(()=>new Promise(res=>{__vt('INK.medicina=0;setInk("medicina",0);inkTo("medicina",1);1');var t=[],l=performance.now(),s0=l;function f(n){t.push(n-l);l=n;if(performance.now()-s0<1700)requestAnimationFrame(f);else{t.sort((a,b)=>a-b);res('cuadros '+t.length+' mediana '+t[t.length>>1].toFixed(1)+'ms p95 '+t[Math.floor(t.length*.95)].toFixed(1)+'ms')}}requestAnimationFrame(f)}));
 console.log('tinta avanzando',size,r2);await p.context().close();
}
await b.close();process.exit(0);
