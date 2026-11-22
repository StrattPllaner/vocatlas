/* ================= imágenes que no cargan =================
   Si una imagen falla (copia guardada dañada o red que se cortó), se pide otra vez directo al servidor una vez,
   con una marca para que no salga de la copia; si vuelve a fallar se oculta en vez de mostrar el signo de «?». */
(function(){if(typeof document==="undefined")return;
 document.addEventListener("error",function(e){var t=e.target;if(!t||t.tagName!=="IMG")return;var s=t.getAttribute("src")||"";if(!s||/^data:|^blob:/.test(s))return;
  if(!t.__rt){t.__rt=1;t.src=s+(s.indexOf("?")<0?"?":"&")+"r="+Date.now();return}
  t.style.visibility="hidden"},true)})();
