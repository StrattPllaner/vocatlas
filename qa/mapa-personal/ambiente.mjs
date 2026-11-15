import {launch,page,state,ALL} from './lib.mjs';
const b=await launch();
const six=['medicina','computacion','derecho','arquitectura','veterinaria','negocios'];
const st=state(six,{medicina:4,computacion:2,derecho:1});
// rendimiento con CPU x4: cuadros en reposo, arrastrando y haciendo zoom
for(const [sz,pick] of [['m390',six],['m390',ALL],['desk',ALL]]){
 const p=await page(b,sz,false,state(pick,{medicina:4,computacion:2}),4);await p.waitForTimeout(5000);
 const meas=async(ms)=>p.evaluate(ms=>new Promise(r=>{let n=0,t0=performance.now(),worst=0,last=t0;function f(t){n++;worst=Math.max(worst,t-last);last=t;if(t-t0<ms)requestAnimationFrame(f);else r({fps:+(n/((t-t0)/1000)).toFixed(1),worst:+worst.toFixed(0)})}requestAnimationFrame(f)}),ms);
 const idle=await meas(2000);
 const [w,h]=[p.viewportSize().width,p.viewportSize().height];
 const cdp=await p.context().newCDPSession(p);
 const drag=meas(2400);
 if(sz==='desk'){await p.mouse.move(w/2,h/2);await p.mouse.down();for(let i=0;i<60;i++){await p.mouse.move(w/2+Math.sin(i/8)*200,h/2+Math.cos(i/8)*120);await p.waitForTimeout(16)}await p.mouse.up()}
 else{await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:w/2,y:h/2}]});for(let i=0;i<60;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:w/2+Math.sin(i/8)*120,y:h/2+Math.cos(i/8)*160}]});await p.waitForTimeout(16)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})}
 const d=await drag;
 const zm=meas(2000);for(let i=0;i<4;i++){await p.click(i%2?'#zout':'#zin');await p.waitForTimeout(420)}const z=await zm;
 const q=await p.evaluate(()=>window.__vt?__vt('JSON.stringify({q:AMB.q,avg:AMB.avg,n:AMB.it.length})'):'');
 console.log(sz,pick.length,'reposo',JSON.stringify(idle),'arrastre',JSON.stringify(d),'zoom',JSON.stringify(z),q,p.errs.length);
 await p.context().close();
}
// pausas
{const p=await page(b,'m390',false,st);await p.waitForTimeout(3000);
 const run=()=>p.evaluate(()=>__vt('!!AMB.raf'));
 console.log('mapa',await run());await p.click('nav button[data-v=yo]');await p.waitForTimeout(500);console.log('yo',await run());
 await p.click('nav button[data-v=map]');await p.waitForTimeout(500);console.log('mapa2',await run());
 await p.screenshot({path:'../f2/hint.png'});await p.context().close()}
{const c=await b.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});const p=await c.newPage();await p.addInitScript(s=>{localStorage.setItem('vocatlas_v1',JSON.stringify(s));localStorage.setItem('vocatlas_qa','1')},st);await p.goto('http://localhost:8765/index.html');await p.waitForTimeout(2500);console.log('rm raf',await p.evaluate(()=>__vt('!!AMB.raf')));await p.screenshot({path:'../f2/rm.png'})}
await b.close();
