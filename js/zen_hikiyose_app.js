/**
 * zen_hikiyose_app.js
 * アプリ共通の初期化・ユーティリティ
 */

import ZenStorage from './zen_hikiyose_storage.js';
import ZenScore from './zen_hikiyose_score.js';
import ZenRouter from './zen_hikiyose_router.js';

const ZenApp = (() => {

  /** テーマを適用する */
  const applyTheme = () => {
    const theme = ZenStorage.get('zen_hikiyose_theme', 'default');
    if (theme && theme !== 'default') {
      document.documentElement.setAttribute('data-theme', theme);
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  /** テーマを保存・適用する */
  const setTheme = (theme) => {
    ZenStorage.set('zen_hikiyose_theme', theme);
    applyTheme();
  };

  /**
   * トースト通知を表示する。
   * @param {string} message
   * @param {'default'|'success'|'error'} type
   * @param {number} duration - ミリ秒
   */
  const showToast = (message, type = 'default', duration = 2500) => {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    // 表示後にアニメーションクラス追加
    requestAnimationFrame(() => toast.classList.add('is-visible'));

    setTimeout(() => {
      toast.classList.remove('is-visible');
      toast.addEventListener('transitionend', () => toast.remove(), { once: true });
    }, duration);
  };

  /** アプリ共通の初期化 */
  const init = () => {
    applyTheme();
    ZenRouter.updateNav();
    ZenScore.applyDailyGrowth();
  };

  return { init, applyTheme, setTheme, showToast };
})();

export default ZenApp;
export const showToast = ZenApp.showToast;
