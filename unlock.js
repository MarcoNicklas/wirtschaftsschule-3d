const form=document.getElementById('unlock'),status=document.getElementById('status'),button=document.getElementById('submit');
if(new URLSearchParams(location.search).has('update'))status.textContent='Eine neue Fassung ist verfügbar. Bitte zum Aktualisieren das Kennwort eingeben.';
const bytes=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
form.addEventListener('submit',async event=>{event.preventDefault();button.disabled=true;let cacheName;try{
 if(!crypto.subtle||!('serviceWorker'in navigator))throw Error('unsupported');
 status.textContent='Zugang wird geprüft …';
 const manifest=await fetch('./manifest.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('network');return r.json()});
 const material=await crypto.subtle.importKey('raw',new TextEncoder().encode(document.getElementById('password').value),'PBKDF2',false,['deriveKey']);
 const key=await crypto.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',iterations:manifest.iterations,salt:bytes(manifest.salt)},material,{name:'AES-GCM',length:256},false,['decrypt']);
 const pieces=await Promise.all(manifest.chunks.map(p=>fetch('./'+p+'?v='+manifest.version,{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('network');return r.arrayBuffer()})));
 const encrypted=new Uint8Array(pieces.reduce((n,b)=>n+b.byteLength,0));let offset=0;for(const p of pieces){encrypted.set(new Uint8Array(p),offset);offset+=p.byteLength}
 let packed;try{packed=await crypto.subtle.decrypt({name:'AES-GCM',iv:bytes(manifest.iv)},key,encrypted)}catch{throw Error('password')}
 document.getElementById('password').value='';status.textContent='Schulmodell wird vorbereitet …';
 const files=JSON.parse(await new Response(new Blob([packed]).stream().pipeThrough(new DecompressionStream('gzip'))).text());
 const base=new URL('./',location.href);cacheName='school-unlocked-'+base.pathname+manifest.version;
 await caches.delete(cacheName);const cache=await caches.open(cacheName);
 for(const file of files){if(file.name.includes('..')||file.name.startsWith('/'))throw Error('package');const url=new URL('app/'+file.name,base);let body=bytes(file.data);if(file.name==='index.html')body=new TextDecoder().decode(body).replace('</head>','<meta name="school-build" content="'+manifest.version+'"></head>').replace('../lock.js','../lock.js?v='+manifest.version);await cache.put(url.href,new Response(body,{headers:{'Content-Type':file.type,'Cache-Control':'no-store'}}))}
 const registration=await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});
 const pending=registration.installing||registration.waiting;
 if(pending&&pending.state!=='activated')await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('worker')),20000);pending.addEventListener('statechange',()=>{if(pending.state==='activated'){clearTimeout(timer);resolve()}else if(pending.state==='redundant'){clearTimeout(timer);reject(Error('worker'))}})});
 await navigator.serviceWorker.ready;
 const workerVersion=await new Promise((resolve,reject)=>{const channel=new MessageChannel(),timer=setTimeout(()=>reject(Error('worker')),5000);channel.port1.onmessage=e=>{clearTimeout(timer);resolve(e.data?.version)};registration.active.postMessage({type:'school-version'},[channel.port2])});
 if(workerVersion!==manifest.version)throw Error('update');
 if(!navigator.serviceWorker.controller)await new Promise(resolve=>{navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true});setTimeout(resolve,4000)});
 location.assign(new URL('app/index.html',base));
 }catch(error){if(cacheName)await caches.delete(cacheName);status.textContent=error.message==='password'?'Das Kennwort stimmt nicht. Bitte erneut versuchen.':error.message==='unsupported'?'Bitte einen aktuellen Browser über HTTPS verwenden.':'Das Modell konnte nicht geladen werden. Bitte erneut versuchen.';button.disabled=false;document.getElementById('password').focus()}});