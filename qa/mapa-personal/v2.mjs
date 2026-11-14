import {launch,page,state,ALL} from './lib.mjs';
const out=process.argv[2];const b=await launch();
const ST=()=>state(['medicina','nutricion','psicologia','veterinaria','computacion'],{medicina:4,nutricion:3,psicologia:2,veterinaria:1},{at:'nutricion'});
const ovf=p=>p.evaluate(()=>{var o=[];document.querySelectorAll('#pick *,#v-atlas *').forEach(e=>{var r=e.getBoundingClientRect();if(r.width&&(r.right>innerWidth+1||r.left<-1)&&!e.closest('.at-row,.pk-filters'))o.push(e.className)});return o.slice(0,5).join('|')});
const small=p=>p.evaluate(()=>{var o=[];document.querySelectorAll('#pick.on button,#pick.on input,#v-atlas.on button').forEach(e=>{var r=e.getBoundingClientRect();if(r.width&&(r.height<44||r.width<44))o.push((e.id||e.className)+':'+Math.round(r.width)+'x'+Math.round(r.height))});return o.slice(0,6).join('|')});
for(const size of ['m360','m390','ipad','desk'])for(const dark of [false,true]){
 const tag=size+(dark?'-d':'');
 let p=await page(b,size,dark,state(null),4);await p.waitForTimeout(5000);
 await p.screenshot({path:out+'/pick-'+tag+'.png'});
 console.log(tag,'pick desb:['+await ovf(p)+'] chicos:['+await small(p)+'] errs',p.errs.length);
 if(size==='m360'&&!dark){await p.fill('#pkQ','ingenieria');await p.waitForTimeout(400);await p.screenshot({path:out+'/pick-busca.png'});await p.fill('#pkQ','mecatronica');await p.waitForTimeout(300);console.log('busca sin acento:',await p.evaluate(()=>[].filter.call(document.querySelectorAll('#pick .pk-card'),e=>!e.hidden).map(e=>e.getAttribute('data-id')).join(',')))}
 await p.context().close();
 p=await page(b,size,dark,ST(),4);await p.waitForTimeout(6000);
 await p.click('nav button[data-v=atlas]');await p.waitForTimeout(2600);await p.screenshot({path:out+'/atlas-'+tag+'.png'});
 const blocks=await p.evaluate(()=>{var v=document.querySelector('#v-atlas').getBoundingClientRect();return [].map.call(document.querySelectorAll('#v-atlas .at-in'),e=>{var r=e.getBoundingClientRect();return r.top<innerHeight-100?1:0}).reduce((a,b)=>a+b,0)});
 console.log(tag,'atlas bloques visibles:',blocks,'desb:['+await ovf(p)+'] chicos:['+await small(p)+'] errs',p.errs.length);
 await p.context().close();
}
// color 0,25,50,75,100 de cerca, claro y oscuro
for(const dark of [false,true]){
 const p=await page(b,'m390',dark,state(['medicina','nutricion','psicologia','veterinaria','computacion'],{medicina:4,nutricion:3,psicologia:2,veterinaria:1}));await p.waitForTimeout(4500);
 await p.evaluate(()=>__vt('hideHint();RB.follow=false;var b=ISOW.fit,f=framing((b[0]+b[2])/2,(b[1]+b[3])/2+10,.62);view.s=f.s;view.tx=f.tx;view.ty=f.ty;commit();apply();1'));await p.waitForTimeout(700);
 await p.screenshot({path:out+'/color'+(dark?'-d':'')+'.png'});await p.context().close();
}
await b.close();process.exit(0);
