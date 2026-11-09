/* Revisión de traslapes de las ilustraciones.
   Para cada pieza compara las huellas en el suelo de sus partes principales:
   - "se atraviesan": dos partes ocupan el mismo lugar (una pasaría por dentro de la otra).
   - "sin aire": dos partes que no se tocan quedan a menos de 1.5 unidades (se leerían como una masa).
   El orden de dibujo lo garantiza el ensamblador por profundidad. Uso: node qa/traslapes.js */
const fs=require('fs'),path=require('path'),S=path.join(__dirname,'..','src');
global.localStorage={getItem(){return null},setItem(){}};
eval(['iso-lib.js','iso-gen.js','iso-env-old.js','iso-env.js','iso-bld.js','iso-bld2.js'].map(f=>fs.readFileSync(path.join(S,f),'utf8')).join('\n'));
let fallas=0;
ART.ids.forEach(id=>['v1','v2'].forEach(vv=>{if(vv==='v1'?!ART.A[id]:!ART.V2[id])return;['s','e'].forEach(v=>{
 const ps=ART.parts(id,v,2,vv),msgs=[];
 for(let i=0;i<ps.length;i++)for(let j=i+1;j<ps.length;j++){const a=ps[i].fp,b=ps[j].fp;
  const ox=Math.min(a[2],b[2])-Math.max(a[0],b[0]),oy=Math.min(a[3],b[3])-Math.max(a[1],b[1]);
  if(ox>.05&&oy>.05)msgs.push(`se atraviesan: ${ps[i].n} y ${ps[j].n} (${ox.toFixed(1)}×${oy.toFixed(1)})`);
  else{const gx=Math.max(a[0],b[0])-Math.min(a[2],b[2]),gy=Math.max(a[1],b[1])-Math.min(a[3],b[3]),gap=Math.max(gx,gy);if(gap>.05&&gap<1.5)msgs.push(`sin aire: ${ps[i].n} y ${ps[j].n} (${gap.toFixed(1)})`)}}
 /* nada fuera de la plataforma (radio 46) */
 ps.forEach(p=>{const f=p.fp,far=Math.max(...[[f[0],f[1]],[f[2],f[1]],[f[0],f[3]],[f[2],f[3]]].map(q=>Math.hypot(q[0],q[1])));if(far>47)msgs.push(`fuera de la plataforma: ${p.n} (${far.toFixed(1)})`)});
 fallas+=msgs.length;console.log(`${id} ${vv}/${v==='s'?'estructura':'emblema'}: ${msgs.length?msgs.join('; '):'sin traslapes'}`);
})}));
console.log(fallas?`\n${fallas} hallazgos`:'\nTodo en orden');process.exit(fallas?1:0);
