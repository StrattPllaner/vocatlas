import { chromium } from 'playwright';import fs from 'fs';
const AXE=fs.readFileSync(process.env.SP+'/pw/node_modules/axe-core/axe.min.js','utf8');
const b=await chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const res={};
for(const scheme of ['light','dark']){
const c=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,colorScheme:scheme,isMobile:true,hasTouch:true});
await c.addInitScript(()=>{localStorage.setItem('vocatlas_v1',JSON.stringify({interests:["code","mate","robots"],custom:[],res:{datos:"yes"},rate:{datos:8},seen:{},st:{},nick:"Dani",grado:"p3"}))});
const p=await c.newPage();
async function run(n){await p.addScriptTag({content:AXE});const r=await p.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}});return r.violations.map(v=>({id:v.id,impact:v.impact,n:v.nodes.length,ex:v.nodes.slice(0,4).map(x=>(x.target.join(' ')+' '+(x.any[0]&&x.any[0].message||'')).slice(0,170))}))});res[scheme+':'+n]=r}
await p.goto('http://localhost:8765/index.html');await p.waitForSelector('#iGo');await p.waitForTimeout(1200);await run('inicio');
await p.click('#iGo');await p.waitForSelector('#app.on #world .poi');await p.waitForTimeout(2500);await run('mapa');
for(const v of ['probar','atlas','yo']){await p.click(`#nav [data-v=${v}]`);await p.waitForTimeout(1200);await run(v)}
await c.close();}
await b.close();fs.writeFileSync(process.env.SP+'/pw/out/axe.json',JSON.stringify(res,null,1));
for(const k in res){console.log('==',k);res[k].forEach(v=>console.log(' ',v.impact,v.id,v.n,'|',v.ex.join(' || ')))}
