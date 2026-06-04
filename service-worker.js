/**
 * service-worker.js
 * オフライン対応・キャッシュ管理
 */

const CACHE = 'mindful-asset-v2';

const STATIC = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/zen_hikiyose_theme.css',
  '/css/zen_hikiyose_base.css',
  '/css/zen_hikiyose_components.css',
  '/js/zen_hikiyose_app.js',
  '/js/zen_hikiyose_router.js',
  '/js/zen_hikiyose_storage.js',
  '/js/zen_hikiyose_premium.js',
  '/js/zen_hikiyose_score.js',
  '/pages/zen_hikiyose_onboarding.html',
  '/pages/zen_hikiyose_home.html',
  '/pages/zen_hikiyose_affirmation.html',
  '/pages/zen_hikiyose_affirmation_record.html',
  '/pages/zen_hikiyose_alarm.html',
  '/pages/zen_hikiyose_log.html',
  '/pages/zen_hikiyose_dream_log.html',
  '/pages/zen_hikiyose_mandala.html',
  '/pages/zen_hikiyose_roadmap.html',
  '/pages/zen_hikiyose_advice.html',
  '/pages/zen_hikiyose_reviews.html',
  '/pages/zen_hikiyose_settings.html',
  '/pages/zen_hikiyose_premium.html',
  '/data/zen_hikiyose_advice.json',
  '/data/zen_hikiyose_roadmap.json',
  '/data/zen_hikiyose_reviews.json',
  '/data/zen_hikiyose_affirmation_samples.json',
  '/data/zen_hikiyose_content_dream_log_tips.txt',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      });
    })
  );
});
