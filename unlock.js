const form=document.getElementById('unlock'),status=document.getElementById('status'),button=document.getElementById('submit');
const bytes=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
form.addEventListener('submit',async event=>{event.preventDefault();button.disabled=true;let cacheName;try{
 if(!crypto.subtle||!('serviceWorker'in navigator))throw Error('unsupported');
 status.textContent='Zugang wird geprüft …';
 const manifest=await fetch('./manifest.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('network');return r.json()});
 const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(document.getElementById('password').value),'PBKDF2',false,['deriveKey']);
 const key=await crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',iterations:manifest.iterations,salt:bytes(manifest.salt)},material,{name:'AES-GCM',length:256},false,['decrypt']);
 const pieces=await Promise.all(manifest.chunks.map(p=>fetch('./'+p,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('network');return r.arrayBuffer()})));
 const encrypted=new Uint8Array(pieces.reduce((n,b)=>n+b.byteLength,0));let offset=0;for(const p of pieces){encrypted.set(new Uint8Array(p),offset);offset+=p.byteLength}
 let packed;try{packed=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(manifest.iv)},key,encrypted)}catch{throw Error('password')}
 document.getElementById('password').value='';status.textContent='Schulmodell wird vorbereitet …';
 const files=JSON.parse(await new Response(new Blob([packed]).stream().pipeThrough(new DecompressionStream('gzip'))).text());
 const base=new URL('./',location.href);cacheName='school-unlocked-'+base.pathname;
 await caches.delete(cacheName);const cache=await caches.open(cacheName);
 for(const file of files){if(file.name.includes('..')||file.name.startsWith('/'))throw Error('package');const url=new URL('app/'+file.name,base);await cache.put(url.href,new Response(bytes(file.data),{headers:{'Content-Type':file.type,'Cache-Control':'no-store'}}))}
 await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});await navigator.serviceWorker.ready;
 if(!navigator.serviceWorker.controller)await new Promise(resolve=>{navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true});setTimeout(resolve,4000)});
 location.assign(new URL('app/index.html',base));
 }catch(error){if(cacheName)await caches.delete(cacheName);status.textContent=error.message==='password'?'Das Kennwort stimmt nicht. Bitte erneut versuchen.':error.message==='unsupported'?'Bitte einen aktuellen Browser über HTTPS verwenden.':'Das Modell konnte nicht geladen werden. Bitte erneut versuchen.';button.disabled=false;document.getElementById('password').focus()}});