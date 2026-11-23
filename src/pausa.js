/* ================= pausa de lo que está tapado =================
   Cuando una pantalla completa (lección, puerta, apuntes, test, cofre) cubre la app, lo que queda debajo deja de animarse:
   Rumbo 3D, los símbolos 3D y el Rumbo plano solo se dibujan si están dentro de esa pantalla. Se revisa con un observador
   (no en cada cuadro). window.__top es la capa de arriba o null. */
(function(){if(typeof document==="undefined")return;var SEL=".lc,.pt-room,.ap,.ipsf,.cer,.lp-lesson.on";window.__top=null;var t=0;
 function upd(){t=0;var L=document.querySelectorAll(SEL);window.__top=L.length?L[L.length-1]:null}
 new MutationObserver(function(){if(!t)t=setTimeout(upd,60)}).observe(document.documentElement,{childList:true,subtree:true});
 window.__shown=function(el){var T=window.__top||window.__view;return !T||T.contains(el)}})();
