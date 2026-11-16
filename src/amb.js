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
  el.appendChild(d);
  AMB.it.push({k:a.k,i:a.i,x:a.x+ISOW.OX,y:a.y+ISOW.OY,B:B,el:d,m:d.firstChild,sub:a.k==="gull"?d.querySelector(".iso-gull"):a.k==="whale"?d.querySelector(".iso-spout"):null,vis:false,ph:(a.i*2.399+(a.k.charCodeAt(0)%7))%6.283,lo:a.i%2===1});
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
  else if(o.k==="boat"){u=26*sin(t/9+p);x=u;y=u*.5+1.6*sin(t*1.8+p);r=1.7*sin(t*1.8+p+1)}
  else if(o.k==="whale"){u=(t+p*2)%15;op=u<2?0:u<3?u-2:u<9?1:u<10?10-u:0;y=(1-op)*7;if(o.sub){var k=u>3.6&&u<5.4?sin((u-3.6)/1.8*Math.PI):0;o.sub.style.transform="scale("+k.toFixed(2)+")";o.sub.style.opacity=k.toFixed(2)}}
  else if(o.k==="dolphin"){u=((t+p)%6)/1.3;if(u>1)op=0;else{x=-24+48*u;y=-30*4*u*(1-u)+6;r=-46+92*u;op=u<.12?u/.12:u>.88?(1-u)/.12:1}}
  else if(o.k==="wave"){u=((t+p*1.7)%5.5)/5.5;op=.75*sin(u*Math.PI);x=10*u}
  var st=o.m.style;st.transform="translate3d("+(x*s).toFixed(1)+"px,"+(y*s).toFixed(1)+"px,0)"+(r?" rotate("+r.toFixed(1)+"deg)":"");
  if(op!==o.op){o.op=op;st.opacity=op.toFixed(2)}
 }
}
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
