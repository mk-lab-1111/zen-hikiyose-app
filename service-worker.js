/**
 * service-worker.js - オフライン対応
 */

const CACHE_NAME = 'mindful-asset-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/zen_hikiyose_base.css',
  '/css/zen_hikiyose_theme.css',
  '/css/zen_hikiyose_components.css',
  '/js/zen_hikiyose_app.js',
  '/js/zen_hikiyose_storage.js',
  '/js/zen_hikiyose_premium.js',
  '/js/zen_hikiyose_score.js',
  '/pages/zen_hikiyose_home.html',
  '/pages/zen_hikiyose_onboarding.html',
  '/pages/zen_hikiyose_affirmation.html',
  '/pages/zen_hikiyose_record.html',
  '/pages/zen_hikiyose_log.html',
  '/pages/zen_hikiyose_dream_log.html',
  '/pages/zen_hikiyose_mandala.html',
  '/pages/zen_hikiyose_roadmap.html',
  '/pages/zen_hikiyose_advice.html',
  '/pages/zen_hikiyose_settings.html',
  '/pages/zen_hikiyose_premium.html',
  '/data/zen_hikiyose_advice.json',
  '/data/zen_hikiyose_roadmap.json',
  '/data/zen_hikiyose_review.json',
];

// インストール：静的ファイルをキャッシュ
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// アクティベート：古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// フェッチ：キャッシュファースト戦略
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
        }
        return response;
      });
    })
  );
});
