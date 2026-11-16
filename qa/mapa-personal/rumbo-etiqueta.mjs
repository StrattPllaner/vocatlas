import {launch,page,state,ALL} from './lib.mjs';
// Las etiquetas fuera de pantalla no se revisan (están ocultas y su posición no se actualiza).
const b=await launch();
const six=['medicina','computacion','derecho','arquitectura','veterinaria','negocios'];
// Rumbo, etiqueta y edificio: sin encimarse, en tres acercamientos
for(const sz of ['m390','desk']){
 const p=await page(b,sz,false,state(sz==='desk'?ALL:six,{medicina:4,computacion:2}));await p.waitForTimeout(3200);
 let bad=[];
 for(const z of ['fit','mid','near']){
  if(z==='mid'){await p.click('#zin');await p.waitForTimeout(700)}if(z==='near'){await p.click('#zin');await p.click('#zin');await p.waitForTimeout(900)}
  const r=await p.evaluate(()=>{const out=[];const ids=JSON.parse(__vt('JSON.stringify(mapCs().map(function(c){return c.id}))'));
   for(const id of ids){__vt('(function(){var n=NODES["'+id+'"];RB.at="'+id+'";RB.x=n[0];RB.y=n[1];placeRumbo()})()');
    if(document.querySelector('.mpin[data-id="'+id+'"]').style.visibility==='hidden')continue;const rb=document.querySelector('.rbm .rb').getBoundingClientRect(),pl=document.querySelector('.mpin[data-id="'+id+'"] .pl').getBoundingClientRect(),po=document.querySelector('#poi-'+id+' .sk, #poi-'+id+' .co');
    const bb=document.querySelector('#poi-'+id).getBoundingClientRect();
    const hit=(a,c)=>a.left<c.right&&c.left<a.right&&a.top<c.bottom&&c.top<a.bottom;
    // cuerpo de Rumbo sin los márgenes transparentes
    const body={left:rb.left+rb.width*.18,right:rb.right-rb.width*.18,top:rb.top+rb.height*.12,bottom:rb.bottom};
    if(hit(body,pl))out.push(id+': Rumbo sobre etiqueta');
    const cx=bb.left+bb.width/2,cy=bb.top+bb.height/2;if(cx>body.left&&cx<body.right&&cy>body.top&&cy<body.bottom)out.push(id+': Rumbo sobre el centro del edificio');
    const ov=Math.max(0,Math.min(body.right,bb.right)-Math.max(body.left,bb.left))*Math.max(0,Math.min(body.bottom,bb.bottom)-Math.max(body.top,bb.top))/(bb.width*bb.height||1);if(ov>.3)out.push(id+': Rumbo tapa '+Math.round(ov*100)+' % del edificio')}
   return out});
  if(r.length)bad.push(z,...r)}
 console.log(sz,'Rumbo/etiqueta',bad.length?bad:'OK');await p.context().close()}
// rendimiento con CPU x4
for(const [sz,pick] of [['m390',ALL],['desk',ALL]]){
 const p=await page(b,sz,false,state(pick,{medicina:4,computacion:2}),4);await p.waitForTimeout(5000);
 const meas=async(ms)=>p.evaluate(ms=>new Promise(r=>{let n=0,t0=performance.now(),worst=0,last=t0;function f(t){n++;worst=Math.max(worst,t-last);last=t;if(t-t0<ms)requestAnimationFrame(f);else r({fps:+(n/((t-t0)/1000)).toFixed(1),worst:+worst.toFixed(0)})}requestAnimationFrame(f)}),ms);
 const idle=await meas(2000);const [w,h]=[p.viewportSize().width,p.viewportSize().height];
 const drag=meas(2400);await p.mouse.move(w/2,h/2);
 if(sz==='desk'){await p.mouse.down();for(let i=0;i<60;i++){await p.mouse.move(w/2+Math.sin(i/8)*200,h/2+Math.cos(i/8)*120);await p.waitForTimeout(16)}await p.mouse.up()}
 else{const cdp=await p.context().newCDPSession(p);await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:w/2,y:h/2}]});for(let i=0;i<60;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:w/2+Math.sin(i/8)*120,y:h/2+Math.cos(i/8)*160}]});await p.waitForTimeout(16)}await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]})}
 const d=await drag;const zm=meas(2400);for(let i=0;i<4;i++){await p.click(i%2?'#zout':'#zin');await p.waitForTimeout(500)}const z=await zm;
 console.log(sz,'reposo',JSON.stringify(idle),'arrastre',JSON.stringify(d),'zoom',JSON.stringify(z),p.errs.length);await p.context().close()}
// capturas
for(const [sz,dark] of [['m390',false],['desk',false],['m390',true]]){
 const p=await page(b,sz,dark,state(six,{medicina:4,computacion:2}));await p.waitForTimeout(3500);await p.evaluate(()=>document.querySelector('#hint').classList.add('hide'));await p.waitForTimeout(400);
 await p.screenshot({path:`../f2/b-${sz}${dark?'-d':''}.png`});
 if(!dark){for(let i=0;i<(sz==='desk'?3:3);i++)await p.click('#zin');await p.waitForTimeout(1200);await p.screenshot({path:`../f2/b-${sz}-200.png`})}
 await p.context().close()}
await b.close();
