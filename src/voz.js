/* ================= Rumbo habla =================
   Voz: si existe media/voz/<id>.mp3 se usa ese audio (grabado); si no, la voz del navegador (Web Speech API),
   eligiendo la mejor en español de México y, si no hay, otra en español.
   Boca: cinco formas (cerrada, entreabierta, abierta, redonda o/u, ancha e/i). Con la voz del navegador sigue los avisos
   de palabra (onboundary) y reparte las vocales de cada palabra; si la voz no los manda (algunas de Android), sigue un
   ritmo calculado por el largo del texto. Con audio grabado sigue el volumen real.
   Nunca suena solo: la primera frase con sonido siempre sale de un toque del estudiante. Todo lo que dice se puede leer
   (globo e historial). Silencio, velocidad y "ocultar globo" se guardan en el dispositivo. */
var VOZ=(function(){
 var KEY="vocatlas_voz",P={mute:false,rate:1,hideText:false},LOG=[],cur=null,voice=null,tried=false;
 try{var o=JSON.parse(localStorage.getItem(KEY)||"{}");for(var k in o)P[k]=o[k]}catch(e){}
 function save(){try{localStorage.setItem(KEY,JSON.stringify(P))}catch(e){}}
 var TTS=typeof window!=="undefined"&&"speechSynthesis" in window&&"SpeechSynthesisUtterance" in window;
 /* la mejor voz: español de México primero; entre iguales, las de mejor calidad (natural, premium, mejorada, Google) */
 function pickVoice(){if(!TTS)return null;var L=speechSynthesis.getVoices()||[],best=null,bs=-1;
  L.forEach(function(v){var l=(v.lang||"").toLowerCase().replace("_","-"),n=(v.name||"").toLowerCase(),s=-1;
   if(l.indexOf("es")!==0)return;s=l==="es-mx"?10:l==="es-us"||l==="es-419"?7:5;
   if(/natural|premium|enhanced|mejorad|neural|google/.test(n))s+=2;if(/paulina|mónica|monica|juan|sabina|dalia|jorge/.test(n))s+=1;
   if(s>bs){bs=s;best=v}});return best}
 if(TTS){voice=pickVoice();if(speechSynthesis.addEventListener)speechSynthesis.addEventListener("voiceschanged",function(){voice=pickVoice()})}
 /* forma de boca por vocal */
 var SHAPE={c:[1,.12],m:[.9,.5],a:[1,1],o:[.72,.9],e:[1.28,.48]};
 function vis(ch){ch=ch.toLowerCase();return /[aá]/.test(ch)?"a":/[oóuúü]/.test(ch)?"o":/[eéií]/.test(ch)?"e":null}
 function setMouth(rb,k){if(!rb)return;var s=SHAPE[k]||SHAPE.c;rb.__vis=s}
 /* recorre las vocales de un texto a lo largo de una duración */
 function playWord(rb,word,dur,tok){var vs=[];for(var i=0;i<word.length;i++){var v=vis(word[i]);if(v)vs.push(v)}if(!vs.length)vs=["m"];
  var step=dur/vs.length;vs.forEach(function(v,i){setTimeout(function(){if(cur!==tok)return;setMouth(rb,v);setTimeout(function(){if(cur===tok)setMouth(rb,"m")},step*.6)},i*step)})}
 function estDur(text){return Math.max(900,text.length*62/P.rate)}
 /* globo de diálogo junto a Rumbo */
 function bubble(host,text){if(!host)return null;var b=host.querySelector(".vz-globo");if(!b){b=document.createElement("div");b.className="vz-globo";b.setAttribute("aria-live","polite");host.appendChild(b)}
  b.textContent=text;b.classList.toggle("is-hidden",!!P.hideText&&!P.mute);b.classList.add("on");return b}
 /* habla una línea {id,dice}. rb: el elemento .rb de Rumbo; host: donde va el globo. Devuelve una promesa que se cumple al terminar */
 function say(line,rb,host,opt){opt=opt||{};stop();var tok={};cur=tok;var text=line.dice||line.text||"";LOG.push({id:line.id,t:text,at:Date.now()});
  bubble(host,text);if(rb){rb.setAttribute("data-mood","talk")}
  return new Promise(function(res){
   function done(){if(cur!==tok)return;cur=null;if(rb){rb.__vis=null;rb.setAttribute("data-mood","happy")}res()}
   tok.done=done;
   /* sin sonido: la boca sigue el ritmo de lectura y el texto se queda en el globo */
   function silent(){var words=text.split(/\s+/),t=0,per=estDur(text)/Math.max(1,words.length);words.forEach(function(w,i){setTimeout(function(){if(cur===tok)playWord(rb,w,per*.85,tok)},t);t+=per});tok.tm=setTimeout(done,t+200)}
   if(P.mute||opt.silent){silent();return}
   /* audio grabado, si existe */
   var tryFile=line.id&&!opt.noFile;
   function tts(){if(!TTS){silent();return}var u=new SpeechSynthesisUtterance(text);u.lang=voice?voice.lang:"es-MX";if(voice)u.voice=voice;u.rate=P.rate;u.pitch=1.05;
    var gotB=false,words=text.split(/\s+/),wi=0,per=estDur(text)/Math.max(1,words.length);
    u.onboundary=function(e){if(cur!==tok||e.name&&e.name!=="word")return;gotB=true;var w=text.slice(e.charIndex).split(/\s/)[0]||"";playWord(rb,w,Math.max(140,w.length*58/P.rate),tok)};
    u.onstart=function(){/* si en 450 ms no llegó ningún aviso de palabra, la boca sigue un ritmo calculado */
     setTimeout(function(){if(gotB||cur!==tok)return;(function next(){if(cur!==tok||wi>=words.length)return;playWord(rb,words[wi],per*.85,tok);wi++;tok.tm=setTimeout(next,per)})()},450)};
    u.onend=done;u.onerror=function(){if(cur===tok)silent()};tok.u=u;speechSynthesis.speak(u)}
   if(tryFile){var a=new Audio();a.preload="auto";a.src="media/voz/"+line.id+".mp3";a.playbackRate=P.rate;tok.a=a;
    a.onerror=function(){if(cur===tok){tok.a=null;tts()}};
    a.oncanplay=function(){if(cur!==tok)return;a.oncanplay=null;
     /* boca con el volumen real del audio */
     try{var AC=window.AudioContext||window.webkitAudioContext,ac=VOZ._ac||(VOZ._ac=new AC()),src=ac.createMediaElementSource(a),an=ac.createAnalyser();an.fftSize=512;src.connect(an);an.connect(ac.destination);var buf=new Uint8Array(an.fftSize);
      (function loop(){if(cur!==tok)return;an.getByteTimeDomainData(buf);var s=0;for(var i=0;i<buf.length;i++){var v=(buf[i]-128)/128;s+=v*v}var r=Math.sqrt(s/buf.length),o=Math.min(1,r*6);if(rb)rb.__vis=[1,.12+.88*o];requestAnimationFrame(loop)})()}catch(e){}
     a.play().catch(function(){if(cur===tok){tok.a=null;tts()}})};
    a.onended=done;a.load()}
   else tts()})}
 function stop(){var t=cur;cur=null;if(t){clearTimeout(t.tm);if(t.a){try{t.a.pause()}catch(e){}}}if(TTS)try{speechSynthesis.cancel()}catch(e){}}
 function skip(){var t=cur;stop();if(t&&t.done){cur=t;t.done()}}
 function setMute(m){P.mute=!!m;save();if(m)stop()}
 function setRate(r){P.rate=r;save()}
 function setHide(h){P.hideText=!!h;save();document.querySelectorAll(".vz-globo").forEach(function(b){b.classList.toggle("is-hidden",!!h&&!P.mute)})}
 return {say:say,stop:stop,skip:skip,setMute:setMute,setRate:setRate,setHide:setHide,P:P,log:LOG,voice:function(){return voice},tts:TTS,setMouth:setMouth,SHAPE:SHAPE};
})();
