/* ================= ambiente del mapa: nubes, olas, ballena, delfines, barcos y gaviotas =================
   Cada cosa que se mueve vive fuera del svg del mapa, en su propia capa, y solo cambia transform y opacity.
   Un solo requestAnimationFrame mueve todo. Se detiene si la pestaña no se ve, si no estás en el mapa o si hay una lección abierta.
   Lo que queda fuera de la pantalla no se actualiza. Si el equipo no da los cuadros, baja la cantidad o se queda quieto. */
var AMB={it:[],raf:0,q:2,t0:0,last:0,acc:0,n:0,odd:false,measured:false};
var AMBBOX={cloud:[-90,-70,180,110],gull:[-10,-8,20,14],boat:[-46,-70,92,96],whale:[-44,-40,88,62],dolphin:[-22,-16,44,32],wave:[-14,-5,28,9]};
function ambBuild(){
 var el=document.getElementById("amb");if(!el)return;el.innerHTML="";AMB.it=[];
 if(typeof ISOW==="undefined"||!ISOW||!ISOW.R.amb)return;
 ISOW.R.amb.forEach(function(a){
  var B=AMBBOX[a.k],d=document.createElement("div"),k=a.k==="cloud"?(1.1+a.i%3*.3):1;
  B=[B[0]*k,B[1]*k,B[2]*k,B[3]*k];
  d.className="amb-s amb-"+a.k;
  d.innerHTML='<div class="amb-m"><svg viewBox="'+B.join(" ")+'" width="100%" height="100%">'+a.art+'</svg></div>';
  /* anillo de espuma donde el animal rompe el agua, o estela detrás del barco */
  if(a.k==="whale"||a.k==="dolphin"||a.k==="boat"){var r=document.createElement("i");r.className="amb-rip";r.style.top=(a.k==="whale"?64:a.k==="dolphin"?72:74)+"%";d.appendChild(r)}
  el.appendChild(d);
  AMB.it.push({k:a.k,i:a.i,x:a.x+ISOW.OX,y:a.y+ISOW.OY,B:B,el:d,m:d.firstChild,sub:a.k==="gull"?d.querySelector(".iso-gull"):a.k==="whale"?d.querySelector(".iso-spout"):null,rp:d.querySelector(".amb-rip"),vis:false,ph:(a.i*2.399+(a.k.charCodeAt(0)%7))%6.283,lo:a.i%2===1});
 });
 ambPlace();ambQuality();ambPose(RM()?3.2:0);ambSync();
}
/* tamaño y lugar en pantalla: solo al fijar la cámara, nunca en cada cuadro */
function ambPlace(){
 var el=document.getElementById("amb");if(!el||!AMB.it.length)return;
 var W=box.clientWidth,H=box.clientHeight,s=cm.s,vs=view.s/cm.s;AMB.s=s;
 /* la capa mide lo que el mundo; cada cosa va en su lugar del mundo y solo se anima lo que cae en pantalla */
 for(var i=0;i<AMB.it.length;i++){var o=AMB.it[i],B=o.B,l=(o.x+B[0])*s,t=(o.y+B[1])*s,w=B[2]*s,h=B[3]*s,sl=view.tx+l*vs,st=view.ty+t*vs;
  o.vis=sl+w*vs>-120&&sl<W+120&&st+h*vs>-80&&st<H+80;
  o.el.style.cssText="left:"+l.toFixed(1)+"px;top:"+t.toFixed(1)+"px;width:"+w.toFixed(1)+"px;height:"+h.toFixed(1)+"px"+(o.off||!o.vis?";display:none":"");
 }
}
function ambQuality(){for(var i=0;i<AMB.it.length;i++){var o=AMB.it[i];o.off=AMB.q<2&&(o.k==="wave"||o.lo)||AMB.q<1&&o.k!=="cloud"&&o.k!=="boat"}ambPlace()}
/* pose de cada cosa en el segundo t; desplazamientos en unidades del mapa, se llevan a pantalla con la escala fijada */
function ambPose(t){
 var s=AMB.s||1,sin=Math.sin,cos=Math.cos;
 for(var i=0;i<AMB.it.length;i++){var o=AMB.it[i];if(o.off||!o.vis)continue;
  var x=0,y=0,r=0,op=1,sc=1,p=o.ph,u;
  if(o.k==="cloud"){x=70*sin(t/38+p);y=5*sin(t/11+p)}
  else if(o.k==="gull"){x=90*cos(t/7+p);y=26*sin(t/7+p);if(o.sub)o.sub.style.transform="scaleY("+(.5+.5*Math.abs(sin(t*4.2+p))).toFixed(2)+")"}
  else if(o.k==="whale"){
   /* 16 s: abajo, sale inclinada, nada y echa su chorro, se sumerge de cola */
   u=(t+p*2.3)%16;var rv=-1;
   if(u<2){op=0}
   else if(u<3.4){var e=(u-2)/1.4;op=Math.min(1,e*1.6);y=14*(1-e)*(1-e);r=-9*(1-e);rv=(u-2)/1.6}
   else if(u<9){op=1;y=1.2*sin(u*1.7)}
   else if(u<10.6){var e2=(u-9)/1.6;op=e2<.6?1:1-(e2-.6)/.4;y=16*e2*e2;r=11*e2;rv=(u-9)/1.8}
   else op=0;
   x=1.8*Math.min(u,10.6)-9;
   if(o.sub){var k=u>4&&u<6?sin((u-4)/2*Math.PI):0;o.sub.style.transform="scale("+k.toFixed(2)+")";o.sub.style.opacity=k.toFixed(2)}
   ambRip(o,rv,x*s,1.5)}
  else if(o.k==="dolphin"){u=((t+p)%6)/1.3;var dv=-1,dx=0;if(u>1)op=0;else{x=-24+48*u;y=-30*4*u*(1-u)+6;r=-46+92*u;op=u<.12?u/.12:u>.88?(1-u)/.12:1}
   if(u<.45){dv=u/.45;dx=-24}else if(u>.9&&u<1.5){dv=(u-.9)/.6;dx=24}ambRip(o,dv,dx*s,1)}
  else if(o.k==="boat"){u=40*sin(t/12+p);x=u;y=u*.45+1.6*sin(t*1.8+p);r=1.8*sin(t*1.8+p+1);
   /* estela: un anillo que se abre detrás cada 2.2 s */
   var wv=((t+p)%2.2)/2.2,dir=cos(t/12+p)>=0?1:-1;ambRip(o,wv,(x-dir*14*wv)*s,1.3,y*s)}
  else if(o.k==="wave"){u=((t+p*1.7)%5.5)/5.5;op=.75*sin(u*Math.PI);x=10*u}
  var st=o.m.style;st.transform="translate3d("+(x*s).toFixed(1)+"px,"+(y*s).toFixed(1)+"px,0)"+(r?" rotate("+r.toFixed(1)+"deg)":"");
  if(op!==o.op){o.op=op;st.opacity=op.toFixed(2)}
 }
}
/* anillo de espuma: v de 0 a 1 se abre y se desvanece; fuera de ese rango no se ve */
function ambRip(o,v,px,big,py){var e=o.rp;if(!e)return;if(v<0||v>1){if(e._v!==-1){e._v=-1;e.style.opacity="0"}return}
 e._v=v;e.style.transform="translate3d("+px.toFixed(1)+"px,"+((py||0)).toFixed(1)+"px,0) scale("+((.35+1.25*v)*big).toFixed(2)+")";e.style.opacity=(.85*(1-v)).toFixed(2)}
function ambCan(){var a=document.getElementById("app");return !RM()&&AMB.q>0&&AMB.it.length&&!document.hidden&&curView==="map"&&a&&a.classList.contains("on")&&!document.body.classList.contains("lp-open")}
function ambFrame(now){
 AMB.raf=0;if(!ambCan())return;
 var dt=now-AMB.last;AMB.last=now;if(!AMB.t0)AMB.t0=now;
 /* presupuesto: se miden 90 cuadros seguidos; con menos de unos 40 por segundo se baja a la mitad y con menos de 24 se queda quieto */
 if(!AMB.measured&&dt>0&&dt<250){AMB.acc+=dt;if(++AMB.n>=90){var avg=AMB.acc/AMB.n;AMB.measured=true;AMB.avg=avg;if(avg>42){AMB.q=0;ambQuality();ambPose(3.2);return}if(avg>25){AMB.q=1;ambQuality()}}}
 AMB.odd=!AMB.odd;
 if(AMB.q>1||AMB.odd)ambPose((now-AMB.t0)/1000);
 AMB.raf=requestAnimationFrame(ambFrame);
}
function ambSync(){if(AMB.raf||!ambCan())return;AMB.last=performance.now();AMB.raf=requestAnimationFrame(ambFrame)}
document.addEventListener("visibilitychange",ambSync);
