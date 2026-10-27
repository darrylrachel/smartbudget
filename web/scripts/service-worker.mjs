import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
// Only build-owned public shell assets enter this list. No arbitrary GET caching.
const assets = ['/index.html','/offline.html','/manifest.webmanifest','/icon-192.png','/icon-512.png','/maskable-512.png', ...readdirSync('dist/assets').filter(name => /\.(js|css)$/.test(name)).map(name => `/assets/${name}`)];
const version = createHash('sha256'); for (const path of assets) version.update(readFileSync(`dist${path}`));
const cache = `smartbudget-public-${version.digest('hex').slice(0,12)}`;
writeFileSync('dist/sw.js', `const CACHE=${JSON.stringify(cache)};const PUBLIC=${JSON.stringify(assets)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(PUBLIC))));
self.addEventListener('message',event=>{if(event.data?.type==='ACTIVATE_UPDATE')self.skipWaiting()});
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('smartbudget-public-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin)return;
if(/^\\/(api|auth|rest|rpc|export|exports)(\\/|$)/.test(url.pathname))return;
if(event.request.mode==='navigate'){event.respondWith(fetch(event.request,{cache:'no-store'}).catch(()=>caches.match('/offline.html')));return;}
if(!url.search&&PUBLIC.includes(url.pathname))event.respondWith(caches.open(CACHE).then(cache=>cache.match(event.request).then(hit=>hit||fetch(event.request))));});
`);
