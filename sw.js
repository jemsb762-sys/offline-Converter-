var CACHE="converter-v1";
var FILES=["./","./index.html","./manifest.json","./icon-180.png","./icon-192.png","./icon-512.png","./lib/docx.js","./lib/pptxgen.js","./lib/jszip.js","./lib/pdf-lib.js","./lib/pdf.min.mjs","./lib/pdf.worker.min.mjs"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(FILES)}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(n){return n!==CACHE}).map(function(n){return caches.delete(n)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){if(e.request.method!=="GET")return;e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(function(r){return r||fetch(e.request)}))});
