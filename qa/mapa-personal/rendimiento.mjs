import {launch,page,state,ALL} from './lib.mjs';
const b=await launch();
for(const [sz,pick] of [['m390',ALL],['desk',ALL]]){
 const p=await page(b,sz,false,state(pick,{medicina:4,computacion:2}),4);await p.waitForTimeout(7000);
 const meas=async(ms)=>p.evaluate(ms=>new Promise(r=>{let n=0,t0=performance.now(),worst=0,last=t0;function f(t){n++;worst=Math.max(worst,t-last);last=t;if(t-t0<ms)requestAnimationFrame(f);else r({fps:+(n/((t-t0)/1000)).toFixed(1),worst:+worst.toFixed(0)})}requestAnimationFrame(f)}),ms);
 const idle=await meas(3000);const [w,h]=[p.viewportSize().width,p.viewportSize().height];
 const drag=meas(2400);await p.mouse.move(w/2,h/2);
 if(sz==='desk'){await p.mouse.down();for(let i=0;i<60;i++){await p.mouse.move(w/2+Math.sin(i/8)*200,h/2+Math.cos(i/8)*120);await p.waitForTimeout(16)}await p.mouse.up()}
 else{const cdp=await p.context().newCDPSession(p);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:w/2,y:h/2}]});for(let i=0;i<60;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:w/2+Math.sin(i/8)*120,y:h/2+Math.cos(i/8)*160}]});await p.waitForTimeout(16)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})}
 const d=await drag;await p.waitForTimeout(800);const zm=meas(2400);for(let i=0;i<4;i++){await p.click(i%2?'#zout':'#zin');await p.waitForTimeout(500)}const z=await zm;
 const q=await p.evaluate(()=>__vt('JSON.stringify({q:AMB.q,avg:AMB.avg})'));
 console.log(sz,'reposo',JSON.stringify(idle),'arrastre',JSON.stringify(d),'zoom',JSON.stringify(z),q,p.errs.length);await p.context().close()}
await b.close();
