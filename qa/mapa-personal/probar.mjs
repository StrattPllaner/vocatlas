// Probar: test de intereses (sin banco y con un banco de PRUEBA que solo existe aquí), resultados, agregar al mapa, historial y comparador.
import {launch,page,state} from './lib.mjs';
const b=await launch();const SZ=process.argv[2]||'m390',DK=process.argv[3]==='d';
const p=await page(b,SZ,DK,state(['medicina','computacion','derecho'],{medicina:4,computacion:2}));await p.waitForTimeout(3000);
const shot=n=>p.screenshot({path:`../f4/${n}-${SZ}${DK?'-d':''}.png`});
const ov=async w=>{const o=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth);if(o)console.log('DESBORDE',w)};
await p.click('nav button[data-v=probar]');await p.waitForTimeout(800);await shot('probar');await ov('probar');
// 1) sin banco: no deja empezar y lo dice
await p.click('#pbIP');await p.waitForTimeout(600);await shot('ip-sin-banco');
console.log('sin banco: botón empezar',!!(await p.$('#ipGo')),'aviso',!!(await p.$('.ip-wait')),'crédito',(await p.$$('.ip-cred a')).length);
await p.click('.ip-link');await p.waitForTimeout(400);await shot('ip-avisos');await p.click('.ui-sheet .ui-btn');await p.waitForTimeout(400);
await p.click('.at-sub .ui-iconbtn');await p.waitForTimeout(500);
// 2) banco de PRUEBA (preguntas falsas a propósito): mismo formato que entrega el servicio
await p.evaluate(()=>{const A=['realistic','investigative','artistic','social','enterprising','conventional'];const mk=n=>({opciones:[1,2,3,4,5].map(v=>({value:v,name:'Opción de prueba '+v})),preguntas:Array.from({length:n},(_,i)=>({index:i+1,area:A[i%6],text:'Pregunta de prueba '+(i+1)+' (aquí va el texto oficial de O*NET)'})),base:Object.fromEntries(A.map(a=>[a,0])),puntos:Array.from({length:n},()=>[0,1,2,3,4].map(x=>x*(n===30?2:1)))});
 __vt('CAT').ip={estado:'cargado',consultado:'prueba',versiones:{'30':mk(30),'60':mk(60)},areas:Object.fromEntries(A.map(a=>[a,{titulo:'Área de prueba '+a,descripcion:'Descripción de prueba.'}]))};__vt('renderProbar()')});
await p.click('#pbIP');await p.waitForTimeout(600);await shot('ip-inicio');await ov('inicio');
await p.click('#ipGo');await p.waitForTimeout(700);await shot('ip-pregunta');await ov('pregunta');
for(let i=0;i<12;i++){await p.click(`.ip-opts button[data-v="${(i%5)+1}"]`);await p.waitForTimeout(260)}
await p.click('#ipB');await p.waitForTimeout(200);console.log('anterior conserva respuesta',await p.$eval('.ip-opts [aria-checked=true]',e=>e.getAttribute('data-v')));
await p.click('#ipX');await p.waitForTimeout(500);
console.log('borrador',await p.evaluate(()=>__vt('S.ipd&&S.ipd.a.length')));
await p.click('#pbIP');await p.waitForTimeout(500);console.log('botón',await p.$eval('#ipGo',e=>e.textContent));await p.click('#ipGo');await p.waitForTimeout(700);
p.setDefaultTimeout(3000);for(let i=0;i<40;i++){if(!(await p.$('.ip-run.on')))break;const q=await p.$eval('.ip-n',e=>e.textContent).catch(()=>null);if(!q)break;const n=+q.split('/')[0];await p.click(`.ip-opts button[data-v="${[5,4,2,5,1,3][(n-1)%6]}"]`).catch(()=>{});await p.waitForTimeout(330)}
await p.waitForTimeout(800);await shot('ip-resultado');await ov('resultado');
const res=await p.evaluate(()=>__vt('JSON.stringify({n:S.ip.length,s:S.ip[S.ip.length-1].s,d:S.ipd})'));console.log('resultado',res);
await p.evaluate(()=>document.querySelector('.at-subb').scrollTo(0,99999));await p.waitForTimeout(300);await shot('ip-resultado2');
const add=await p.$('[data-add]');if(add){const id=await add.getAttribute('data-add');await add.click();await p.waitForTimeout(600);console.log('agregada',id,await p.evaluate(i=>__vt('picked("'+i+'")'),id))}
await p.click('.at-sub .ui-iconbtn');await p.waitForTimeout(600);await shot('probar2');
// 3) comparador
console.log('vista al volver',await p.evaluate(()=>document.querySelector('#app').getAttribute('data-v')));await p.waitForTimeout(2500);await p.click('nav button[data-v=probar]');await p.waitForTimeout(700);await p.click('#pbCmp');await p.waitForTimeout(600);await shot('comparar');await ov('comparar');
console.log('columnas',await p.$$eval('.cmp thead th',e=>e.length-1),'pendientes',await p.$$eval('.cmp-p',e=>e.length));
await p.click('.cmp-pick .ui-chip[aria-pressed=false]').catch(()=>{});await p.waitForTimeout(300);
await p.click('.at-sub .ui-iconbtn');await p.waitForTimeout(500);
// 4) historial
await p.click('#pbIP');await p.waitForTimeout(500);console.log('historial',await p.$$eval('.ip-hi',e=>e.length));await shot('ip-historial');
console.log('errores',p.errs);await b.close();
