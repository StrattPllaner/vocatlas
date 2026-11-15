import {launch,page,state,ALL,SIZES} from './lib.mjs';
const b=await launch();
const six=['medicina','computacion','derecho','arquitectura','veterinaria','negocios'];
for(const sz of ['m360','m390','ipad','desk'])for(const dark of [false,true]){
 const p=await page(b,sz,dark,state(sz==='desk'?ALL:six,{medicina:4,computacion:2,derecho:1}));await p.waitForTimeout(3000);
 const r=await p.evaluate(()=>{const R=e=>e.getBoundingClientRect(),vis=e=>{const s=getComputedStyle(e);return s.display!=='none'&&s.visibility!=='hidden'&&+s.opacity>0.1&&R(e).width>0};
  const els=['#clar','.zoom','#hint','#addCar','#nav'].map(s=>document.querySelector(s)).filter(e=>e&&vis(e));const out=[];
  for(let i=0;i<els.length;i++)for(let j=i+1;j<els.length;j++){const a=R(els[i]),c=R(els[j]);if(a.left<c.right&&c.left<a.right&&a.top<c.bottom&&c.top<a.bottom)out.push(els[i].id+'/'+els[j].id)}
  const c=R(document.querySelector('#clar'));return {ov:out,hs:document.documentElement.scrollWidth>innerWidth,clar:[Math.round(c.width),Math.round(c.height)]}});
 console.log(sz,dark?'noche':'dia',JSON.stringify(r),'errores',p.errs.length);
 if(sz==='ipad'&&!dark)await p.screenshot({path:'../f2/ipad.png'});
 if(sz==='m360'&&!dark){await p.click('#clar');await p.waitForTimeout(600);console.log('chip abre',await p.evaluate(()=>document.querySelector('#app').getAttribute('data-v')));await p.click('nav button[data-v=atlas]');await p.waitForTimeout(900);await p.screenshot({path:'../f2/atlas360.png'})}
 await p.context().close();
}
// flujo de primera vez hasta el mapa
{const p=await page(b,'m390',false,null);await p.waitForTimeout(2600);await p.screenshot({path:'../f2/inicio.png'});console.log('boot oculto',await p.evaluate(()=>getComputedStyle(document.querySelector('#boot')).display),'errores',p.errs.length)}
await b.close();
