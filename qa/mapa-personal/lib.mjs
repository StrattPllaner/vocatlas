import { chromium, webkit } from 'playwright';
export const URL='http://localhost:8765/index.html';
export const SIZES={m360:[360,800,true],m390:[390,844,true],ipad:[820,1180,true],desk:[1440,900,false]};
export const BASE={interests:['salud','code','dibujo','negocios','construccion'],custom:[],res:{},rate:{},seen:{},st:{},chest:{},flow:null,nick:'Leo',grado:'p2',meta:{tipo:'n',n:5,ritmo:'constante',plazo:'1m'}};
export const ALL=['medicina','veterinaria','nutricion','psicologia','civil','mecatronica','aeroespacial','ambiental','computacion','datos','biotec','fisica','derecho','educacion','negocios','finanzas','arquitectura','moda','comunicacion','cine'];
export function prog(id,n){const o={res:{},rate:{},st:{},chest:{}};if(n>=1)o.st[id]={hace:1};if(n>=2)o.res[id]='yes';if(n>=3)o.chest[id+':c1']=1;if(n>=4)o.rate[id]=8;return o}
export function state(pick,progs={},extra={}){const s=JSON.parse(JSON.stringify(BASE));if(pick){s.pick=pick;s.pk=1}for(const id in progs){const o=prog(id,progs[id]);Object.assign(s.res,o.res);Object.assign(s.rate,o.rate);Object.assign(s.st,o.st);Object.assign(s.chest,o.chest)}return Object.assign(s,extra)}
export async function launch(){return chromium.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'})}
export async function page(b,size,dark,st,cpu){const [w,h,mob]=SIZES[size];const c=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:2,isMobile:mob,hasTouch:mob,colorScheme:dark?'dark':'light'});const p=await c.newPage();p.errs=[];
 p.on('pageerror',e=>{p.errs.push(e.message);console.log('ERR',size,e.message)});p.on('console',m=>{if(m.type()==='error'&&!/favicon|Failed to load resource/.test(m.text())){p.errs.push(m.text());console.log('CON',m.text().slice(0,200))}});
 await p.addInitScript(()=>{try{localStorage.setItem('vocatlas_qa','1')}catch(e){}});if(st)await p.addInitScript(s=>{localStorage.setItem('vocatlas_v1',JSON.stringify(s));localStorage.setItem('vocatlas_sfx','0');localStorage.setItem('vocatlas_qa','1')},st);
 if(cpu){const cdp=await c.newCDPSession(p);await cdp.send('Emulation.setCPUThrottlingRate',{rate:cpu})}
 await p.goto(URL);return p}
