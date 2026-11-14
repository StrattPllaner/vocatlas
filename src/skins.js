 /* ================= skins de Rumbo: uno por carrera =================
    Cada skin cambia el gorro de aviador por el de la carrera y el color de las botas; el cuerpo de brújula, la cara
    y las manos son los mismos, así que todas las animaciones siguen funcionando. Se dibujan con las mismas reglas
    que el resto: relleno plano, sombra a la derecha y contorno del tono oscuro de cada pieza. */
 var skinCur=null;
 var KD="M26.8 45.6C25.6 31.4 36.2 22.6 50 22.6C63.8 22.6 74.4 31.4 73.2 45.6Q50 36 26.8 45.6Z";
 function kol(c,w){return ' stroke="'+rbLine(c)+'" stroke-width="'+(w||1.4)+'" stroke-linejoin="round" stroke-linecap="round"'}
 /* casquete: relleno, sombra a la derecha recortada, lo que vaya dentro y el contorno encima */
 function kCap(id,d,col,inner,n){var c=id+"k"+(n||"");return '<clipPath id="'+c+'"><path d="'+d+'"/></clipPath><path class="rk-capj" d="'+d+'" fill="'+col+'"/>'+
  '<g clip-path="url(#'+c+')"><path d="M60 0C72 14 80 30 77 52L100 52L100 0Z" fill="'+rbShade(col,.2)+'"/>'+(inner||"")+'</g><path d="'+d+'" fill="none"'+kol(col)+'/>'}
 function kDome(top,w){w=w||0;return "M"+(26.8-w)+" 45.6C"+(25.6-w)+" "+(top+8.8)+" 36.2 "+top+" 50 "+top+"C63.8 "+top+" "+(74.4+w)+" "+(top+8.8)+" "+(73.2+w)+" 45.6Q50 36 "+(26.8-w)+" 45.6Z"}
 /* cinta que sigue la frente */
 function kBand(col,w,dy,x0){dy=dy||0;x0=x0||26.6;var d="M"+x0+" "+(45.4+dy)+"Q50 "+(35.6+dy)+" "+(100-x0)+" "+(45.4+dy);
  return '<path d="'+d+'" stroke="'+rbLine(col)+'" stroke-width="'+(w+1.6)+'" fill="none" stroke-linecap="round"/><path d="'+d+'" stroke="'+col+'" stroke-width="'+w+'" fill="none" stroke-linecap="round"/>'}
 /* ala de sombrero: una media luna que sigue la frente y sale a los lados */
 function kBrim(col,x0,up,th){var a=x0,b=100-x0;
  return '<path d="M'+a+' '+(44.4)+'Q50 '+(44.4-up*2)+' '+b+' 44.4Q'+(b+2)+' 47 '+(b-1.4)+' 47.8Q50 '+(47.8-up*2+th)+' '+(a+1.4)+' 47.8Q'+(a-2)+' 47 '+a+' 44.4Z" fill="'+col+'"'+sl()+'/>'}
 function kHi(d,col){return '<path d="'+d+'" stroke="'+col+'" stroke-width="1.5" fill="none" stroke-linecap="round" opacity=".85"/>'}
 /* la flecha de la brújula, cuando el gorro deja la cabeza descubierta */
 function kArrow(y0){return '<path d="M49.3 '+y0+'L49.3 17.6L50.7 17.6L50.7 '+y0+'Z" fill="'+SGOLD+'"'+sl(1.1)+'/><path d="M50 10.6L54.6 17.4Q55 18.4 54 18.2L50 17.2L46 18.2Q45 18.4 45.4 17.4Z" fill="'+SGOLD+'"'+sl(1.2)+'/>'}
 function kHard(id,col,ridge,brim){var d=kDome(20.6);
  return kCap(id,d,col,'<path d="M46.4 18Q45.2 30 45.8 42L54.2 42Q54.8 30 53.6 18Z" fill="'+ridge+'"/>')+kHi("M31 35.4Q32.6 27.6 40 23.6","#FFFFFF")+
   '<path d="M23.4 44.2Q50 32.6 76.6 44.2Q78.4 46.8 76 48Q50 37.4 24 48Q21.6 46.8 23.4 44.2Z" fill="'+brim+'"'+sl()+'/>'}
 var SKINS={
  medicina:{n:"Rumbo Doctor",boot:"#2FA79A",hat:function(id){
   return kCap(id,kDome(21.6),"#3DB6A8",'<path d="M20 44.6Q50 30.4 80 44.6L80 52L20 52Z" fill="#F4F8F8"/>')+kHi("M31 35Q32.6 27.4 40.4 23.8","#8FE0D4")+
    '<circle cx="50" cy="29.4" r="5" fill="#FFFFFF"'+sl(1.1)+'/><path d="M48.8 26.2h2.4v2h2v2.4h-2v2h-2.4v-2h-2v-2.4h2z" fill="#E2434B"/>'}},
  veterinaria:{n:"Rumbo Veterinario",boot:"#E58B3A",hat:function(id){
   var ear=function(m){var X=function(x){return (m<0?x:100-x).toFixed(1)},c=m<0?"#A9683A":"#935730";
    return '<path d="M'+X(31)+' 34.6C'+X(23)+' 30.6 '+X(13.6)+' 36 '+X(13)+' 46.6C'+X(12.6)+' 54.6 '+X(17.6)+' 60.6 '+X(22.6)+' 58.4C'+X(26.4)+' 56.6 '+X(26.2)+' 51 '+X(27.6)+' 46.4C'+X(28.8)+' 42.6 '+X(33)+' 39 '+X(31)+' 34.6Z" fill="'+c+'"'+sl()+'/>'+
     '<path d="M'+X(26.6)+' 38.4C'+X(21)+' 37.6 '+X(17)+' 41.6 '+X(16.6)+' 47.4C'+X(16.4)+' 51.6 '+X(18.6)+' 55 '+X(21)+' 54.6C'+X(23)+' 53.4 '+X(22.8)+' 49 '+X(24)+' 45.4Z" fill="#E7B58C" opacity=".8"/>'};
   var band="M26.2 46.6A25.9 25.9 0 0 1 73.8 46.6";
   return '<path d="'+band+'" stroke="'+rbLine("#E58B3A")+'" stroke-width="5" fill="none" stroke-linecap="round"/><path d="'+band+'" stroke="#E58B3A" stroke-width="3.4" fill="none" stroke-linecap="round"/>'+
    grp("rk-flapL",29,37,ear(-1))+grp("rk-flapR",71,37,ear(1))+
    '<circle cx="50" cy="31" r="5.4" fill="#FFFFFF"'+sl(1.1)+'/><ellipse cx="50" cy="32.6" rx="2.3" ry="1.8" fill="#A9683A"/><circle cx="47.2" cy="30" r="1" fill="#A9683A"/><circle cx="50" cy="28.4" r="1.1" fill="#A9683A"/><circle cx="52.8" cy="30" r="1" fill="#A9683A"/>'}},
  nutricion:{n:"Rumbo Chef",boot:"#5DBB63",hat:function(id){
   var d="M27.4 45.4L28.8 31.6C19.6 28 21.4 13.6 32.6 15C35.6 6.4 49.6 5.2 54 11.4C62 5.6 76.6 10.4 73.4 22.4C80.4 26 77.4 33.6 71.4 32.4L72.6 45.4Q50 36 27.4 45.4Z";
   return kCap(id,d,"#FFFFFF",'<path d="M40 30Q39 22 41 15M50 28.6Q50 20 51 13M60 30Q61.6 23 60.6 17" stroke="#D9DEE6" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M20 39.6Q50 26.6 80 39.6L80 52L20 52Z" fill="#EEF1F5"/><path d="M28 33.4Q50 26 72 33.2" stroke="#C9D0DA" stroke-width="1" fill="none"/>')+
    '<path d="M62.6 33.4Q62.4 25.6 70.4 23.6Q71.4 31.4 62.6 33.4Z" fill="#5DBB63"'+sl(1.1)+'/><path d="M63.4 32.4Q66 28 69.6 24.8" stroke="#3E8F46" stroke-width=".8" fill="none" stroke-linecap="round"/>'}},
  psicologia:{n:"Rumbo Psicólogo",boot:"#8B6FD0",hat:function(id){
   return '<circle cx="50" cy="15.6" r="5.4" fill="#F1E9FF"'+sl()+'/><path d="M47 13.6Q49 12 51 13M48.6 17.6Q51 18.6 53 16.6" stroke="#CDBCF0" stroke-width="1" fill="none" stroke-linecap="round"/>'+
    kCap(id,kDome(19.4),"#9B7BD4",'<path d="M38 20Q35 30 36 40M50 19Q50 30 50 38M62 20Q65 30 64 40" stroke="#8566C2" stroke-width="1.1" fill="none" stroke-linecap="round"/>')+kHi("M31 34Q32.6 26 40 22","#BFA6EC")+
    '<path d="M25.4 46.6Q50 36.4 74.6 46.6L75 39.4Q50 29.2 25 39.4Z" fill="#B79AE6"'+sl()+'/><path d="M47.2 34.8v1.9a2.8 2.8 0 0 0 5.6 0v-1.9M50 34.2v6.6" stroke="#FFFFFF" stroke-width="1.3" fill="none" stroke-linecap="round"/>'}},
  civil:{n:"Rumbo Ingeniero",boot:"#B9773F",hat:function(id){
   return kHard(id,"#F7C52E","#FBDD6E","#EDB21B")+'<rect x="46.4" y="33.4" width="7.2" height="4.6" rx="1.2" fill="#3A4252"'+sl(1)+'/><circle cx="50" cy="35.7" r="1.5" fill="#FFF3B0"/>'}},
  mecatronica:{n:"Rumbo Robot",boot:"#8794A3",hat:function(id){
   var bolt=function(x,c){return '<circle cx="'+x+'" cy="45.4" r="4.6" fill="'+c+'"'+sl()+'/><circle cx="'+x+'" cy="45.4" r="1.9" fill="#5C6877"/>'};
   return '<path d="M50 22L50 12" stroke="'+rbLine("#AEB8C4")+'" stroke-width="2.2" stroke-linecap="round"/><circle cx="50" cy="9.6" r="3" fill="#E2434B"'+sl(1.1)+'/><circle cx="49" cy="8.6" r=".9" fill="#FFFFFF" opacity=".8"/>'+
    kCap(id,kDome(21.4),"#AEB8C4",'<path d="M20 42.6Q50 29 80 42.6" stroke="#2B3A4A" stroke-width="5.4" fill="none"/><circle cx="41" cy="35" r="1.1" fill="#4FE0D0"/><circle cx="46" cy="33.6" r="1.1" fill="#4FE0D0"/><circle cx="54" cy="33.6" r="1.1" fill="#FFD66B"/><circle cx="59" cy="35" r="1.1" fill="#4FE0D0"/><path d="M36 26L64 26" stroke="#97A3B1" stroke-width="1"/>')+
    kHi("M31 33Q32.6 27 39.6 23.6","#DCE3EA")+'<circle cx="38.6" cy="28.6" r=".9" fill="#7C8898"/><circle cx="61.4" cy="28.6" r=".9" fill="#7C8898"/>'+bolt(26.4,"#9AA6B4")+bolt(73.6,"#8794A3")}},
  aeroespacial:{n:"Rumbo Astronauta",boot:"#E9EEF3",hat:function(id){
   return '<path d="M66 23L70.6 13.6" stroke="'+rbLine("#E9EEF3")+'" stroke-width="1.8" stroke-linecap="round"/><circle cx="71" cy="12.6" r="2.2" fill="#E2434B"'+sl(1)+'/>'+
    kCap(id,kDome(17.6,1.4),"#F4F6F8",'<path d="M20 41Q50 26.4 80 41" stroke="#F0B34A" stroke-width="8.4" fill="none"/><path d="M20 36.4Q50 21.8 80 36.4" stroke="#E2434B" stroke-width="1.5" fill="none"/><path d="M33 34.4Q41 30.6 47 29.8" stroke="#FFE9B0" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M20 44.4Q50 29.8 80 44.4" stroke="#C98A25" stroke-width="1.2" fill="none"/>')+
    kHi("M30.4 30Q32.6 23.4 39.6 20","#FFFFFF")+kBand("#C3CCD6",2.6,.6,25.4)+'<circle cx="26.2" cy="45.6" r="4" fill="#DDE3EA"'+sl()+'/><circle cx="26.2" cy="45.6" r="1.5" fill="#E2434B"/>'}},
  ambiental:{n:"Rumbo Guardabosques",boot:"#4E7A3A",hat:function(id){
   var d="M33.6 38C35.6 28 44 18.6 50 17.6C56 18.6 64.4 28 66.4 38Q50 31.8 33.6 38Z";
   return kBrim("#7BA05B",17,5.4,3.4)+kCap(id,d,"#6B8E4E",'<path d="M30 39Q50 28.6 70 39" stroke="#5E3A22" stroke-width="4.6" fill="none"/><path d="M50 18Q48.6 24 49.4 30" stroke="#587A3E" stroke-width="1" fill="none" stroke-linecap="round"/>')+
    '<path d="M46.6 35Q46.4 28.6 53 27Q53.8 33.4 46.6 35Z" fill="#A7D46B"'+sl(1)+'/>'}},
  computacion:{n:"Rumbo Programador",boot:"#2B3445",hat:function(id){
   var band="M24.6 48.6A26.9 26.9 0 0 1 75.4 48.6",cup=function(x,c){return '<rect x="'+(x-4)+'" y="44.6" width="8" height="14.4" rx="3.6" fill="'+c+'"'+sl()+'/><rect x="'+(x-1.5)+'" y="47.8" width="3" height="8" rx="1.5" fill="#4FE0D0"/>'};
   return grp("rk-arrow",50,31,kArrow(31))+'<path d="'+band+'" stroke="'+rbLine("#2B3445")+'" stroke-width="5.8" fill="none" stroke-linecap="round"/><path d="'+band+'" stroke="#3A4558" stroke-width="4.2" fill="none" stroke-linecap="round"/>'+
    '<path d="M40 33.6Q50 29.6 60 33.6" stroke="#566378" stroke-width="2.2" fill="none" stroke-linecap="round"/>'+
    '<path d="M23.4 58Q23.4 70.4 33 71.6" stroke="'+rbLine("#2B3445")+'" stroke-width="1.7" fill="none" stroke-linecap="round"/><ellipse cx="34.4" cy="71.7" rx="2.5" ry="1.9" fill="#2B3445"'+sl(1)+'/>'+cup(23.6,"#3A4558")+cup(76.4,"#2B3445")}},
  datos:{n:"Rumbo Analista",boot:"#2F4A8A",hat:function(id){
   return kCap(id,KD,"#2F4A8A",'<path d="M50 22Q45 30 44 42M50 22Q55 30 56 42" stroke="#263D74" stroke-width="1" fill="none"/>')+kHi("M31 35.6Q32.6 28.6 40 24.8","#5B78BE")+
    '<ellipse cx="50" cy="23" rx="2.2" ry="1.3" fill="#263D74"'+sl(1)+'/>'+
    '<path d="M31 43.4Q50 35.2 69 43.4Q72.6 49.6 50 47.4Q27.4 49.6 31 43.4Z" fill="#263D74"'+sl()+'/>'+
    '<rect x="45.2" y="31.4" width="2.6" height="5" rx=".5" fill="#FFFFFF"/><rect x="48.7" y="28.4" width="2.6" height="8" rx=".5" fill="#4FE0D0"/><rect x="52.2" y="30" width="2.6" height="6.4" rx=".5" fill="#FFD66B"/>'}},
  biotec:{n:"Rumbo Científico",boot:"#4CB872",hat:function(id){
   return kCap(id,KD,"#F4F6F8",'<path d="M20 37Q50 24 80 37" stroke="#4CB872" stroke-width="3.4" fill="none"/>')+kHi("M31 35.6Q32.6 28.6 40 24.8","#FFFFFF")+
    '<rect x="36" y="26.6" width="28" height="11.6" rx="5.6" fill="#4CB872"'+sl(1.2)+'/><rect x="38.2" y="28.6" width="23.6" height="7.6" rx="3.8" fill="#D2F1F4"'+sl(.9)+'/>'+
    '<path d="M41 33.6Q41.6 30.6 45 30.2" stroke="#FFFFFF" stroke-width="1.3" fill="none" stroke-linecap="round"/><path d="M50 28.6V36.2" stroke="#4CB872" stroke-width="1.6"/>'}},
  fisica:{n:"Rumbo Físico",boot:"#7A5AA8",hat:function(id){
   /* melena blanca despeinada: mechones en punta que salen hacia afuera, más largos a los lados */
   var T=[[205,27,-8],[224,30,-7],[243,27,-5],[259,31,-3],[275,28,3],[291,31,5],[308,28,7],[325,30,8],[341,27,9]],cx=50,cy=44,d="M27 47",px=27,py=47;
   T.forEach(function(t,i){var a=t[0]*Math.PI/180,x=cx+t[1]*Math.cos(a),y=cy+t[1]*Math.sin(a)*.92,a2=(t[0]+9)*Math.PI/180,vx=cx+19.4*Math.cos(a2),vy=cy+19.4*Math.sin(a2)*.92;
    d+="Q"+(px+(x-px)*.3-3).toFixed(1)+" "+(py+(y-py)*.62).toFixed(1)+" "+x.toFixed(1)+" "+y.toFixed(1);
    if(i<T.length-1)d+="Q"+(x+(vx-x)*.75+1).toFixed(1)+" "+(y+(vy-y)*.3).toFixed(1)+" "+vx.toFixed(1)+" "+vy.toFixed(1);px=i<T.length-1?vx:x;py=i<T.length-1?vy:y});
   d+="Q76 43 73 47Q50 36 27 47Z";
   return kCap(id,d,"#F4F1EA",'<path d="M31 40Q32 33 27 28M39.6 35Q39 27 35 21.6M50 33Q50 25 51 18M60.4 35Q61.6 27 66 22M69 40Q69 33 73.6 28.6" stroke="#CFC8BA" stroke-width="1.2" fill="none" stroke-linecap="round"/>')}},
  derecho:{n:"Rumbo Juez",boot:"#3A3F4E",hat:function(id){
   var lap=function(m){var X=function(x){return (m<0?x:100-x).toFixed(1)},c=m<0?"#F1EEE6":"#DFDACE",s="";
    s+='<path d="M'+X(28.6)+' 40.6C'+X(22.6)+' 45.6 '+X(20.6)+' 56 '+X(22)+' 66C'+X(22.8)+' 70.6 '+X(30.4)+' 70.6 '+X(31.2)+' 66C'+X(32.2)+' 58 '+X(33.4)+' 50 '+X(34.4)+' 43Z" fill="'+c+'"'+sl()+'/>';
    [50,55.4,60.8,66.2].forEach(function(y){s+='<path d="M'+X(23.6)+' '+y+'Q'+X(27)+' '+(y+2.2)+' '+X(30.6)+' '+y+'" stroke="#BDB6A6" stroke-width="1.1" fill="none" stroke-linecap="round"/>'});return s};
   var curls="";[[30,40.6],[34,34],[40,28.6],[60,28.6],[66,34],[70,40.6]].forEach(function(q){curls+='<path d="M'+(q[0]-3)+' '+q[1]+'q3 2.4 6 0" stroke="#BDB6A6" stroke-width="1.1" fill="none" stroke-linecap="round"/>'});
   return grp("rk-flapL",30,44,lap(-1))+grp("rk-flapR",70,44,lap(1))+kCap(id,kDome(21.6),"#F1EEE6",curls+'<path d="M50 21Q49.4 30 50 39" stroke="#BDB6A6" stroke-width="1.1" fill="none"/>')}},
  educacion:{n:"Rumbo Maestro",boot:"#C8553D",hat:function(id){
   return kCap(id,kDome(25),"#2B3445","")+
    '<path d="M19 25.6L50 36.4L81 25.6L81 28.2L50 39L19 28.2Z" fill="#1F2735"'+sl()+'/><path d="M50 14.8L81 25.6L50 36.4L19 25.6Z" fill="#3A4558"'+sl()+'/>'+
    '<path d="M50 25.6Q62 26 71.6 29.4L72.4 40" stroke="#E3A845" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><ellipse cx="50" cy="25.6" rx="2.4" ry="1.3" fill="#E3A845"'+sl(.9)+'/>'+
    '<path d="M70.6 39.6L74.2 39.6L75 46.6L69.8 46.6Z" fill="#E3A845"'+sl(1)+'/>'}},
  negocios:{n:"Rumbo Empresario",boot:"#2B3445",hat:function(id){
   var d="M33 39L31.4 15.6Q50 9.6 68.6 15.6L67 39Q50 32.4 33 39Z";
   return kBrim("#2B3445",21,5,3.6)+kCap(id,d,"#3A4558",'<path d="M30 36.6Q50 28.6 70 36.6" stroke="#E3A845" stroke-width="4.4" fill="none"/><path d="M31.4 15.6Q50 20.6 68.6 15.6" stroke="#566378" stroke-width="1.2" fill="none"/>')+kHi("M36 31L35 19.6","#566378")}},
  finanzas:{n:"Rumbo Financiero",boot:"#2F8F5B",hat:function(id){
   var band="M25.2 47.6A26.3 26.3 0 0 1 74.8 47.6";
   return grp("rk-arrow",50,31,kArrow(31))+'<path d="'+band+'" stroke="'+rbLine("#2F8F5B")+'" stroke-width="5" fill="none" stroke-linecap="round"/><path d="'+band+'" stroke="#2F8F5B" stroke-width="3.4" fill="none" stroke-linecap="round"/>'+
    '<path d="M27.6 44.6Q50 34.6 72.4 44.6Q78.6 53 50 49.6Q21.4 53 27.6 44.6Z" fill="#3FBF7F" fill-opacity=".8"'+kol("#2F8F5B")+'/><path d="M32 46Q42 41.6 50 41.2" stroke="#B8F0D0" stroke-width="1.3" fill="none" stroke-linecap="round"/>'+
    '<circle cx="50" cy="33" r="4.6" fill="#F2C14E"'+sl(1.1)+'/><path d="M51.6 31.4Q50 30.2 48.8 31.4Q48 32.8 50 33.1Q52 33.4 51.2 34.8Q50 35.9 48.4 34.7M50 29.8V36.3" stroke="#8A5E12" stroke-width=".9" fill="none" stroke-linecap="round"/>'}},
  arquitectura:{n:"Rumbo Arquitecto",boot:"#4A90D9",hat:function(id){
   return kHard(id,"#F4F6F8","#4A90D9","#DDE3EA")+
    '<g transform="rotate(-58 70 36)"><rect x="62" y="34.6" width="14" height="3" fill="#F7C52E"'+sl(1)+'/><path d="M76 34.6L80.6 36.1L76 37.6Z" fill="#E7C9A0"'+sl(1)+'/><path d="M79 35.6L80.6 36.1L79 36.6Z" fill="#3A4252"/><rect x="59.6" y="34.6" width="2.6" height="3" rx=".6" fill="#F08A9B"'+sl(1)+'/></g>'}},
  moda:{n:"Rumbo Diseñador",boot:"#E0568A",hat:function(id){
   var d="M33.4 37.6C31.6 25.6 40 19.6 50 19.6C60 19.6 68.4 25.6 66.6 37.6Q50 31.6 33.4 37.6Z";
   return '<path d="M11.6 42.6Q30 29.4 50 30.4Q70 29.4 88.4 42.6Q90.6 47.6 84.4 47Q66 38.4 50 39Q34 38.4 15.6 47Q9.4 47.6 11.6 42.6Z" fill="#F27FA5"'+sl()+'/><path d="M72 36.6Q80 40 84.6 44" stroke="#D9638C" stroke-width="1.2" fill="none" stroke-linecap="round"/>'+
    kCap(id,d,"#F593B4",'<path d="M30 36Q50 28 70 36" stroke="#B83B6E" stroke-width="4.4" fill="none"/>')+kHi("M37 30Q38.6 24.6 44 22","#FBC3D6")+
    '<path d="M63 31.6L70.6 27.6L70 35.6Z" fill="#B83B6E"'+sl(1)+'/><path d="M63 31.6L56.6 26.6L56 34Z" fill="#CC4C80"'+sl(1)+'/><circle cx="63" cy="31.6" r="1.9" fill="#E0568A"'+sl(1)+'/>'}},
  comunicacion:{n:"Rumbo Reportero",boot:"#8A5A34",hat:function(id){
   var d="M33 38.6C31.4 26 37 17.6 44.6 19.2Q50 22.6 55.4 19.2C63 17.6 68.6 26 67 38.6Q50 32.4 33 38.6Z";
   return kBrim("#C9A26B",19.6,5.4,3.6)+kCap(id,d,"#D4B07A",'<path d="M30 36.4Q50 28.4 70 36.4" stroke="#5E3A22" stroke-width="4.6" fill="none"/>')+kHi("M37 30Q38 24 42.6 21.6","#EBD0A4")+
    '<g transform="rotate(14 62 27)"><rect x="57.6" y="22.4" width="9.4" height="7" rx=".9" fill="#FFFFFF"'+sl(1)+'/><path d="M59.4 24.8H65.2M59.4 27H63.6" stroke="#E2434B" stroke-width="1" stroke-linecap="round"/></g>'}},
  cine:{n:"Rumbo Director",boot:"#C8553D",hat:function(id){
   var d="M25 42.4C19.6 30 33.6 19.4 52 20.4C70.4 21.4 81.6 31 76 41.6Q72.6 45.4 66.4 42.8Q50 36 33.6 42.8Q28 46 25 42.4Z";
   return '<path d="M53 21L54.6 16.4" stroke="'+rbLine("#39405A")+'" stroke-width="2.2" stroke-linecap="round"/>'+kCap(id,d,"#39405A",'')+kHi("M30 33Q33.6 25.6 42.6 23","#5E6788")+
    kBand("#262B3D",2.4,-1.2,31)+'<path d="M64.2 26.6l1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4z" fill="#F2C14E"'+sl(.9)+'/>'}}
 };
 var SKINK=["medicina","veterinaria","nutricion","psicologia","civil","mecatronica","aeroespacial","ambiental","computacion","datos","biotec","fisica","derecho","educacion","negocios","finanzas","arquitectura","moda","comunicacion","cine"];
 function skinHat(SK,id){var h=SK.hat(id);
  /* las piezas que el motor de animación busca: si el gorro no trae flecha u orejeras, quedan vacías */
  return grp("rk-hat",50,42,h)}
