/**
 * zen_hikiyose_app.js - アプリ本体・画面遷移
 */

import ZenStorage from './zen_hikiyose_storage.js';
import ZenPremium from './zen_hikiyose_premium.js';

// ==========================================================================
// トースト通知
// ==========================================================================
const showToast = (message, type = '', duration = 2000) => {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast${type ? ` toast-${type}` : ''}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-hiding');
    toast.addEventListener('animationend', () => toast.remove());
  }, duration);
};

// ==========================================================================
// テーマ管理
// ==========================================================================
const applyTheme = () => {
  const theme = ZenStorage.get('theme', 'default');
  if (theme && theme !== 'default') {
    document.documentElement.setAttribute('data-theme', theme);
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
};

const setTheme = (theme) => {
  ZenStorage.set('theme', theme);
  applyTheme();
};

// ==========================================================================
// ボトムナビ アクティブ制御
// ==========================================================================
const updateNavActive = () => {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.bottom-nav-item').forEach(item => {
    const href = item.getAttribute('href') || '';
    const isActive = href.includes(path) || (path === 'index.html' && href.includes('home'));
    item.classList.toggle('active', isActive);
  });
};

// ==========================================================================
// オンボーディング判定
// ==========================================================================
const checkOnboarding = () => {
  const completed = ZenStorage.get('onboarding_completed', false);
  const isIndex = window.location.pathname.endsWith('index.html') ||
                  window.location.pathname === '/' ||
                  window.location.pathname === '';
  if (!completed && isIndex) {
    window.location.href = 'pages/zen_hikiyose_onboarding.html';
  }
};

// ==========================================================================
// 初期化
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  ZenPremium.applyUI();
  updateNavActive();
  checkOnboarding();

  // Service Worker 登録
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {});
  }
});

export { showToast, setTheme, applyTheme };
