import {launch,page,state} from './lib.mjs';
const out=process.argv[2];const b=await launch();const T0=Date.now();const tl=m=>console.log(((Date.now()-T0)/1000).toFixed(1)+'s',m);
// congela las animaciones CSS en un instante dado (ms desde que arrancaron)
const freeze=(p,t)=>p.evaluate(t=>{document.getAnimations().forEach(a=>{try{a.pause();a.currentTime=t}catch(e){}})},t);
let p=await page(b,'m390',false,state(null));await p.waitForTimeout(3500);
await p.click('#pkGo');await p.waitForTimeout(1500);
// espera a que el mapa tenga la clase de aparición
await p.waitForSelector('#world.emerge',{timeout:8000});tl('emerge');
let i=0;for(const t of [500,900,1150,1450,1800,2300]){await freeze(p,t);await p.screenshot({path:out+'/em-'+(i++)+'.png'})}
await p.evaluate(()=>document.getAnimations().forEach(a=>a.play()));
await p.waitForTimeout(4500);await p.screenshot({path:out+'/em-fin.png'});tl('creado');
// agregar una carrera a un área nueva y otra a una isla existente
await p.click('#addCar');await p.waitForSelector('#pick.on .pk-card');await p.waitForTimeout(500);
await p.click('#pick .pk-sec[data-sec=salud] .pk-card[data-id=medicina]');await p.click('#pick .pk-sec[data-sec=tec] .pk-card[data-id=computacion]');await p.waitForTimeout(300);await p.screenshot({path:out+'/add-pick.png'});
await p.click('#pkGo');await p.waitForSelector('#world .is-new',{timeout:8000});tl('agregando');
i=0;for(const t of [300,700,1000,1300,1700]){await freeze(p,t);await p.screenshot({path:out+'/add-'+(i++)+'.png'})}
await p.evaluate(()=>document.getAnimations().forEach(a=>a.play()));
await p.waitForTimeout(3500);await p.screenshot({path:out+'/add-fin.png'});
tl('pick '+await p.evaluate(()=>__vt('S.pick.join(",")')));
// quitar una (deja su isla vacía)
await p.click('#addCar');await p.waitForSelector('#pick.on .pk-card');await p.waitForTimeout(500);
await p.click('#pick .pk-sec[data-sec=arte] .pk-card[data-id=arquitectura]');await p.waitForTimeout(200);
await p.click('#pkGo');await p.waitForTimeout(600);await p.screenshot({path:out+'/rm-confirm.png'});
await p.click('#rmOk');await p.waitForSelector('#world .is-sink',{timeout:8000});tl('quitando');
i=0;for(const t of [150,400,650]){await freeze(p,t);await p.screenshot({path:out+'/rm-'+(i++)+'.png'})}
await p.evaluate(()=>document.getAnimations().forEach(a=>a.play()));
await p.waitForTimeout(3500);await p.screenshot({path:out+'/rm-fin.png'});
tl('pick '+await p.evaluate(()=>__vt('S.pick.join(",")'))+' errs '+p.errs.length);
await b.close();process.exit(0);
