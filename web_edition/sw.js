// sw.js - LVM Persistence Layer v2.0
const CACHE_NAME = 'lvm-cache-v2.0';
const ASSETS_TO_CACHE = [
  'index.html',
  'LVM_MASTER_CONTROL.html',
  'manifest.json',
  'lvm_bridge.js'
];

// インストール時にシステム資産をキャッシュに封印
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[LVM] Core Assets Cached');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 通信エラー（オフライン）時でもキャッシュから「城」を呼び出す
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // キャッシュにあればそれを返し、なければネットワークへ
      return response || fetch(event.request);
    })
  );
});

// バージョンアップ時に古いキャッシュを浄化
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});