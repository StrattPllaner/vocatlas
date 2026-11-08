/* ================= entorno ANTERIOR (solo para la comparación en #art): vegetación, objetos, mar y edificios genéricos por bioma ================= */
var ENV0=(function(I){
 var P=I.P,f1=I.f1,box=I.box,ball=I.ball,cyl=I.cyl,poly=I.poly,line=I.line,T=I.T;
 function at(x,y,s){return '<g transform="translate('+f1(P(x,y,0)[0])+' '+f1(P(x,y,0)[1])+')">'+s+'</g>'}
 function sh(r){return '<ellipse cx="'+f1(r*.5)+'" cy="'+f1(r*.18)+'" rx="'+f1(r*1.1)+'" ry="'+f1(r*.5)+'" fill="#1D2C55" opacity=".16"/>'}
 /* ---------- árboles ---------- */
 function treeRound(k,c){k=k||1;c=c||"#58B05A";var s=sh(9*k);
  s+=box(-1.2*k,-1.2*k,0,2.4*k,2.4*k,9*k,"#9A6B45",{noGlint:true});
  s+=ball(0,0,7*k,9*k,c);s+=ball(-3.5*k,3*k,10*k,6*k,I.tint(c,.08));
  return s}
 function treePine(k,c){k=k||1;c=c||"#2F8F6A";var t=T(c),s=sh(7*k);
  s+=box(-1*k,-1*k,0,2*k,2*k,5*k,"#8A5E3C",{noGlint:true});
  [[5,10,9],[11,8,8],[16.5,6,7]].forEach(function(l){var y0=-l[0]*k,w=l[1]*k,h=l[2]*k;
   s+='<path d="M0 '+f1(y0-h)+'L'+f1(w)+' '+f1(y0+1)+'Q0 '+f1(y0+4*k)+' '+f1(-w)+' '+f1(y0+1)+'Z" fill="'+t.b+'"/>';
   s+='<path d="M0 '+f1(y0-h)+'L'+f1(w)+' '+f1(y0+1)+'Q'+f1(w*.4)+' '+f1(y0+3*k)+' '+f1(w*.12)+' '+f1(y0+3.4*k)+'Z" fill="'+t.s+'"/>';
   s+='<path d="M0 '+f1(y0-h)+'L'+f1(-w*.55)+' '+f1(y0-h*.35)+'" stroke="'+t.h+'" stroke-width="'+f1(1.1*k)+'" stroke-linecap="round" opacity=".7"/>'});
  return s}
 function palm(k,flip){k=k||1;var d=flip?-1:1,s=sh(7*k),tr="#B07B4E";
  s+='<path d="M0 0Q'+f1(2*d*k)+' '+f1(-10*k)+' '+f1(6*d*k)+' '+f1(-22*k)+'" fill="none" stroke="'+tr+'" stroke-width="'+f1(2.6*k)+'" stroke-linecap="round"/>';
  s+='<path d="M0 0Q'+f1(2*d*k)+' '+f1(-10*k)+' '+f1(6*d*k)+' '+f1(-22*k)+'" fill="none" stroke="#8A5E3C" stroke-width="'+f1(2.6*k)+'" stroke-dasharray="1 3" stroke-linecap="round"/>';
  var cx=6*d*k,cy=-22*k,G=T("#3FAE5A");
  [[-160,G.s],[-20,G.s],[-120,G.b],[-60,G.b],[-90,G.l],[200,G.b],[-200,G.s]].forEach(function(f){var a=f[0]*Math.PI/180,L=11*k,ex=cx+Math.cos(a)*L,ey=cy+Math.sin(a)*L*.7+4*k;
   s+='<path d="M'+f1(cx)+' '+f1(cy)+'Q'+f1((cx+ex)/2+Math.sin(a)*3*k)+' '+f1((cy+ey)/2-4*k)+' '+f1(ex)+' '+f1(ey)+'Q'+f1((cx+ex)/2)+' '+f1((cy+ey)/2)+' '+f1(cx)+' '+f1(cy)+'Z" fill="'+f[1]+'"/>'});
  s+='<circle cx="'+f1(cx-1*k)+'" cy="'+f1(cy+1.5*k)+'" r="'+f1(1.4*k)+'" fill="#7A4E2C"/><circle cx="'+f1(cx+1.2*k)+'" cy="'+f1(cy+2*k)+'" r="'+f1(1.3*k)+'" fill="#6A4226"/>';
  return s}
 function bush(k,c){k=k||1;c=c||"#4FA352";return sh(5*k)+ball(0,0,-1,5*k,c)+ball(3.4*k,-1*k,-1,3.6*k,I.tint(c,.1))}
 function rock(k){k=k||1;var R="#A9A39A",t=T(R);return sh(4*k)+'<path d="M'+f1(-5*k)+' 0L'+f1(-3.6*k)+' '+f1(-4.6*k)+'L'+f1(1*k)+' '+f1(-6*k)+'L'+f1(5*k)+' '+f1(-2.4*k)+'L'+f1(4.6*k)+' '+f1(.8*k)+'Z" fill="'+t.b+'"/><path d="M'+f1(1*k)+' '+f1(-6*k)+'L'+f1(5*k)+' '+f1(-2.4*k)+'L'+f1(4.6*k)+' '+f1(.8*k)+'L'+f1(.6*k)+' '+f1(1*k)+'Z" fill="'+t.s+'"/><path d="M'+f1(-3.6*k)+' '+f1(-4.6*k)+'L'+f1(1*k)+' '+f1(-6*k)+'" stroke="'+t.h+'" stroke-width="1" stroke-linecap="round"/>'}
 function flowers(cols){cols=cols||["#FF7A9C","#FFD24D","#FFFFFF","#B98CFF"];var s="";for(var i=0;i<6;i++){var a=i*2.1,x=Math.cos(a)*4,y=Math.sin(a)*2;s+='<path d="M'+f1(x)+' '+f1(y+1)+'v-3" stroke="#3E8E4B" stroke-width=".8"/><circle cx="'+f1(x)+'" cy="'+f1(y-2.4)+'" r="1.5" fill="'+cols[i%cols.length]+'"/>'}return s}
 function lamp(glow){var s=sh(2)+'<path d="M0 0V-16" stroke="#34404E" stroke-width="1.6" stroke-linecap="round"/><path d="M-2 -16h4l-.6 -3.6h-2.8z" fill="#34404E"/><circle cx="0" cy="-15" r="1.6" fill="'+(glow||"#FFE08A")+'" class="iso-lamp"/>';return s}
 function signpost(){return sh(3)+'<path d="M0 0V-17" stroke="#8A5E3C" stroke-width="1.8" stroke-linecap="round"/><path d="M-1 -16h9l2.4 2-2.4 2h-9z" fill="#E8B33A"/><path d="M1 -11h-9l-2.4 2 2.4 2h9z" fill="#4FA8E0"/>'}
 function bench(){return box(-4,-1,0,8,2.4,2.2,"#B07B4E",{noGlint:true})+line([P(-3.6,1.4,0),P(-3.6,1.4,2)],"#5A4636",.8)}
 function crate(){return box(-2.6,-2.6,0,5.2,5.2,5,"#C99A5B")}
 function cone(){return '<path d="M-2.6 0L0 -7L2.6 0Z" fill="#FF8A3D"/><path d="M-1.6 -2.8h3.2" stroke="#FFF" stroke-width="1"/><path d="M0 -7L2.6 0H.6Z" fill="#E06A22"/>'}
 /* ---------- mar ---------- */
 function sailboat(c){c=c||"#E2434B";return '<g class="iso-bob">'+'<ellipse cx="2" cy="3" rx="13" ry="3.4" fill="#1D2C55" opacity=".18"/><path d="M-11 0h22l-4 5h-14z" fill="'+c+'"/><path d="M-11 0h22l-1 1.4h-20z" fill="'+I.tint(c,.4)+'"/><path d="M0 0V-24" stroke="#5A4636" stroke-width="1.2"/><path d="M1 -23L12 -2H1z" fill="#FFFDF5"/><path d="M-1 -19L-9 -2H-1z" fill="#F1E9D8"/><path d="M1 -23L12 -2H8z" fill="#E6DCC6"/></g>'}
 function ferry(){return '<g class="iso-bob" style="--bd:1.3s">'+'<ellipse cx="3" cy="5" rx="24" ry="5" fill="#1D2C55" opacity=".18"/>'+box(-10,-6,0,24,12,4,"#E2434B",{top:"#FFFFFF"})+box(-6,-4,4,14,8,5,"#FFFFFF",{right:"#D9DCE2"})+box(-2,-2,9,6,4,3,"#FFFFFF",{right:"#D9DCE2"})+box(2,-1,12,2,2,4,"#F2B544")+'</g>'}
 function whale(){return '<g class="iso-whale"><path d="M-16 2Q-8 -9 8 -5Q14 -3 16 2Z" fill="#3E6E9A"/><path d="M-12 1Q-4 -4 8 -2" fill="none" stroke="#6E9CC7" stroke-width="1.4" stroke-linecap="round"/><path d="M16 1l6 -5l-1 6z" fill="#3E6E9A"/><g class="iso-spout"><path d="M-8 -8q-1 -5 -4 -7M-8 -8q1 -6 3 -8M-8 -8q0 -6 0 -9" stroke="#FFFFFF" stroke-width="1.2" fill="none" stroke-linecap="round"/></g><ellipse cx="0" cy="3" rx="20" ry="3" fill="#FFFFFF" opacity=".5"/></g>'}
 function dolphin(){return '<g class="iso-dolphin"><path d="M-9 2Q-4 -10 8 -4Q5 -4 3 -1Q-2 -3 -9 2Z" fill="#6E8FB3"/><path d="M-1 -6l2 -4 2 3z" fill="#5C7EA3"/><path d="M8 -4l3 -1-1 3z" fill="#6E8FB3"/></g>'}
 function gull(){return '<path class="iso-gull" d="M-5 0q2.5 -3 5 0q2.5 -3 5 0" fill="none" stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round"/>'}
 function cloud(k){k=k||1;return '<g class="iso-cloud"><ellipse cx="'+f1(8*k)+'" cy="'+f1(30*k)+'" rx="'+f1(26*k)+'" ry="'+f1(7*k)+'" fill="#1D2C55" opacity=".1"/>'+ball(0,0,0,9*k,"#FFFFFF",{noGlint:true})+ball(10*k,2*k,-2*k,12*k,"#FFFFFF",{noGlint:true})+ball(22*k,0,0,8*k,"#FFFFFF",{noGlint:true})+'</g>'}
 function lighthouse(){var s='<g>';
  s+=I.cyl(0,0,0,14,4,"#B9A47E",{top:"#9FD67E"});
  s+=I.cyl(0,0,4,5.5,8,"#FFFFFF",{noGlint:true})+I.cyl(0,0,12,5,8,"#E2434B",{noGlint:true})+I.cyl(0,0,20,4.5,8,"#FFFFFF",{noGlint:true})+I.cyl(0,0,28,4.2,4,"#E2434B",{noGlint:true});
  var t=P(0,0,32);s+='<rect x="'+f1(t[0]-4)+'" y="'+f1(t[1]-6)+'" width="8" height="6" rx="1.5" fill="#FFE08A"/><path d="M'+f1(t[0]-5.5)+' '+f1(t[1]-6)+'L'+f1(t[0])+' '+f1(t[1]-11)+'L'+f1(t[0]+5.5)+' '+f1(t[1]-6)+'Z" fill="#34404E"/>';
  s+='<g class="iso-beam" style="transform-origin:'+f1(t[0])+'px '+f1(t[1]-3)+'px"><path d="M'+f1(t[0])+' '+f1(t[1]-3)+'L'+f1(t[0]+90)+' '+f1(t[1]-18)+'L'+f1(t[0]+90)+' '+f1(t[1]+12)+'Z" fill="#FFF3B0" opacity=".45"/></g>';
  return s+'</g>'}
 function pier(len){var s="";for(var i=0;i<len;i+=4)s+=box(i,-3,1,3.4,6,1,"#C99A5B",{noGlint:true});for(i=0;i<=len;i+=8)s+=box(i,-3.6,-3,1.2,1.2,6,"#8A5E3C",{noGlint:true})+box(i,2.6,-3,1.2,1.2,6,"#8A5E3C",{noGlint:true});return s}
 function compass(){var s='<g class="iso-compass">',G="#F2B544",N="#E2434B",D="#14323F";
  s+='<circle r="38" fill="#FFF8E8" opacity=".92"/><circle r="38" fill="none" stroke="'+D+'" stroke-width="1.6"/><circle r="31" fill="none" stroke="'+D+'" stroke-width=".8" stroke-dasharray="1.5 3"/>';
  for(var i=0;i<8;i++){var a=i*Math.PI/4,L=i%2?18:32,w=i%2?4:6,c=Math.cos(a),sn=Math.sin(a),px=-sn*w,py=c*w;
   s+='<path d="M0 0L'+f1(px)+' '+f1(py)+'L'+f1(c*L)+' '+f1(sn*L)+'Z" fill="'+(i===6?N:i%2?"#C9B48C":G)+'"/><path d="M0 0L'+f1(-px)+' '+f1(-py)+'L'+f1(c*L)+' '+f1(sn*L)+'Z" fill="'+(i===6?I.shade(N,.25):i%2?"#A98F67":I.shade(G,.25))+'"/>'}
  s+='<circle r="3.4" fill="'+D+'"/><text y="-41" text-anchor="middle" font-size="10" font-weight="800" fill="'+D+'" font-family="inherit">N</text>';
  return s+'</g>'}
 /* ---------- edificios genéricos por bioma (para carreras sin ilustración propia) ---------- */
 var BIOME={
  jardin:{top:"#8FD06A",side:"#B9A47E",tree:"round",deco:["flowers","bush","bench","lamp","treeRound"]},
  industria:{top:"#D8CDB8",side:"#9C8A6C",tree:"pine",deco:["rock","crate","cone","treePine","lamp"]},
  vidrio:{top:"#7FD3C8",side:"#4E8F97",tree:"round",deco:["lamp","bush","treeRound","bench"]},
  ciudad:{top:"#E6DECD",side:"#A9977A",tree:"round",deco:["lamp","bench","treeRound","signpost","bush"]},
  barrio:{top:"#F4C7B3",side:"#B98B74",tree:"palm",deco:["flowers","palm","treeRound","lamp","bush"]}
 };
 function generic(biome,color,seed){
  var b=BIOME[biome]||BIOME.ciudad,R=MAPGEN.rng(seed),s=I.platform(40,b.top,{side:b.side}),c=color,g="#4FA8E0",fr="#EEF2F4",i,j;
  var v=Math.floor(R()*2);
  if(biome==="jardin"){
   s+=box(-18,-14,7,24,20,18,"#FFFFFF",{left:"#F6F1E8",right:"#DCD6CE",top:"#FFFDF8"});
   s+=I.gable(-18,-14,25,24,20,9,c);
   var L=I.faceL(-18,-14,7,24,20);for(i=0;i<3;i++)s+=I.win(L,3+i*7,7,4,5,g,fr);
   s+=I.quad(L,9.5,0,5,6,I.shade(c,.2));
  }else if(biome==="industria"){
   s+=box(-20,-14,7,28,22,14,"#D9DEE2",{left:"#CDD3D8",right:"#AFB7BF"});
   for(i=0;i<3;i++){var x0=-20+i*9.3;s+=I.poly([P(x0,-14,21),P(x0,8,21),P(x0+4,8,27),P(x0+4,-14,27)],c)+I.poly([P(x0+4,-14,27),P(x0+4,8,27),P(x0+9.3,8,21),P(x0+9.3,-14,21)],I.shade(c,.25))}
   s+=cyl(14,-10,7,3,30,"#A9B0B8")+'<circle class="iso-smoke" cx="'+f1(P(14,-10,40)[0])+'" cy="'+f1(P(14,-10,40)[1])+'" r="4" fill="#FFFFFF" opacity=".7"/>';
   var L2=I.faceL(-20,-14,7,28,22);for(i=0;i<4;i++)s+=I.win(L2,2+i*6.5,6,4,4,g,fr);
  }else if(biome==="vidrio"){
   var h=34+v*12;s+=box(-12,-12,7,22,20,h,g,{left:"#5BB4E8",right:"#3E8CC4",top:"#B7E3FA"});
   var L3=I.faceL(-12,-12,7,22,20),R3=I.faceR(-12,-12,7,22,20);
   for(j=4;j<h;j+=6){s+=I.line([L3(0,j),L3(22,j)],"#DDF3FF",.8,{op:.7});s+=I.line([R3(0,j),R3(20,j)],"#9BD0F2",.8,{op:.6})}
   s+=I.poly([L3(2,h-2),L3(8,h-2),L3(2,4)],"#FFFFFF",{op:.25,st:false});
   s+=box(-12,-12,7+h,22,20,2,c);
  }else if(biome==="barrio"){
   s+=box(-16,-12,7,22,18,16,c,{});
   var L4=I.faceL(-16,-12,7,22,18);s+=I.win(L4,3,6,5,5,g,"#FFFFFF")+I.win(L4,13,6,5,5,g,"#FFFFFF");
   for(i=0;i<5;i++)s+=I.poly([L4(i*4.4,12),L4(i*4.4+4.4,12),L4(i*4.4+4.4,15),L4(i*4.4,15)],i%2?"#FFFFFF":I.shade(c,.3),{st:false});
   s+=box(-16,-12,23,22,18,2.4,I.tint(c,.3));
  }else{
   var hh=30+v*14;s+=box(-14,-12,7,20,18,hh,"#E8E1D3",{left:"#DED6C6",right:"#C4BAA7"});
   var L5=I.faceL(-14,-12,7,20,18),R5=I.faceR(-14,-12,7,20,18);
   for(j=5;j<hh-3;j+=7)for(i=0;i<3;i++){s+=I.win(L5,2+i*6.3,j,3.6,4,g,fr);if(i<2)s+=I.win(R5,3+i*7,j,4,4,g,fr)}
   s+=box(-10,-8,7+hh,12,10,6,c);
  }
  s+=at(26,10,ENV_ONE(b.deco[0],seed))+at(-28,18,ENV_ONE(b.deco[1],seed+1));
  return s;
 }
 function ENV_ONE(k,seed){var R=MAPGEN.rng(seed);switch(k){
  case "treeRound":return treeRound(.8+R()*.4,["#58B05A","#4FA352","#6CC06A"][Math.floor(R()*3)]);
  case "treePine":return treePine(.8+R()*.4);case "palm":return palm(.8+R()*.3,R()<.5);
  case "flowers":return flowers();case "bush":return bush(.9+R()*.3);case "bench":return bench();case "lamp":return lamp();
  case "rock":return rock(.8+R()*.6);case "crate":return crate();case "cone":return cone();case "signpost":return signpost();}return ""}
 return {at:at,treeRound:treeRound,treePine:treePine,palm:palm,bush:bush,rock:rock,flowers:flowers,lamp:lamp,signpost:signpost,bench:bench,crate:crate,cone:cone,sailboat:sailboat,ferry:ferry,whale:whale,dolphin:dolphin,gull:gull,cloud:cloud,lighthouse:lighthouse,pier:pier,compass:compass,generic:generic,one:ENV_ONE,BIOME:BIOME};
})(ISO);
