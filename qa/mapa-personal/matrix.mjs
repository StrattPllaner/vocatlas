import {launch,page,state,ALL} from './lib.mjs';
const out=process.argv[2];const b=await launch();const res=[];
const SETS={1:['medicina'],3:['medicina','computacion','cine'],6:['medicina','nutricion','civil','computacion','derecho','cine'],12:ALL.filter((_,i)=>i%5!==4&&i%5!==2).slice(0,12),20:ALL};
// mide encimados en el mapa a vista completa: letreros entre sí y edificios entre sí
const MEASURE=`(function(){var r=function(e){return e.getBoundingClientRect()},ov=function(a,b,m){return a.left<b.right-m&&b.left<a.right-m&&a.top<b.bottom-m&&b.top<a.bottom-m};
 var vis=function(e){return +getComputedStyle(e).opacity>.1};var pins=[].slice.call(document.querySelectorAll('#mlayer .mpin .pl')).filter(vis).map(function(e){return [e.textContent,r(e)]}),n=0,list=[];
 for(var i=0;i<pins.length;i++)for(var j=i+1;j<pins.length;j++)if(ov(pins[i][1],pins[j][1],2)){n++;list.push(pins[i][0]+'/'+pins[j][0])}
 var vw=innerWidth,cut=pins.filter(function(p){return p[1].width&&(p[1].left<0||p[1].right>vw)}).length;
 var al=[].slice.call(document.querySelectorAll('#mlayer .al .t,#mlayer .sl .t')).filter(vis).map(function(e){return r(e)}),alo=0;for(i=0;i<al.length;i++)for(j=i+1;j<al.length;j++)if(ov(al[i],al[j],0))alo++;
 var dx=document.documentElement.scrollWidth>innerWidth;
 return JSON.stringify({pins:pins.length,enc:n,list:list.slice(0,4),fuera:cut,areas:alo,desb:dx,isl:ISOW.W.islands.length,gh:ISOW.ghosts.length,s:+view.s.toFixed(2)})})()`;
for(const size of ['m360','m390','ipad','desk'])for(const dark of [false,true]){
 for(const n of [1,3,6,12,20]){
  if(dark&&(n===3||n===12))continue;
  const pr={};SETS[n].forEach((id,i)=>{pr[id]=i%5});
  const p=await page(b,size,dark,state(SETS[n],pr),4);await p.waitForTimeout(size==='desk'?5000:6500);
  await p.evaluate(()=>__vt('hideHint();RB.follow=false;var f=fitAll();view.s=f.s;view.tx=f.tx;view.ty=f.ty;commit();apply();1'));await p.waitForTimeout(900);
  const m=JSON.parse(await p.evaluate(c=>__vt(c),MEASURE));
  const nm='map-'+size+(dark?'-d':'')+'-'+n;await p.screenshot({path:out+'/'+nm+'.png'});
  res.push(nm+' '+JSON.stringify(m)+' errs:'+p.errs.length);console.log(res[res.length-1]);
  await p.context().close();
 }
}
await b.close();process.exit(0);
