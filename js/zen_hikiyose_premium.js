/**
 * zen_hikiyose_premium.js
 * 無料/有料プランの管理と、ロックUIの制御を行う。
 */

import ZenStorage from './zen_hikiyose_storage.js';

const ZenPremium = (() => {
  const KEY = 'zen_hikiyose_premium';

  /** プレミアム会員かどうかを返す */
  const isPremium = () => {
    const data = ZenStorage.get(KEY, { is_premium: false });
    return data.is_premium === true;
  };

  /** プレミアムを有効にする */
  const unlock = () => {
    ZenStorage.set(KEY, { is_premium: true, unlocked_at: new Date().toISOString() });
  };

  /** プレミアムを無効にする（テスト用） */
  const lock = () => {
    ZenStorage.set(KEY, { is_premium: false });
  };

  /**
   * 要素にプレミアムロックを適用する。
   * @param {HTMLElement} container - ロックをかけるコンテナ
   * @param {string} message - 表示するメッセージ
   */
  const applyLock = (container, message = 'この機能はプレミアムプランで利用できます') => {
    if (isPremium()) return;

    container.style.position = 'relative';
    container.style.overflow = 'hidden';

    const overlay = document.createElement('div');
    overlay.className = 'premium-lock-overlay';
    overlay.innerHTML = `
      <div class="premium-lock-box">
        <div class="premium-lock-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>
        <p class="premium-lock-msg">${message}</p>
        <a href="zen_hikiyose_premium.html" class="btn-primary premium-lock-btn">プレミアムの詳細を見る</a>
      </div>
    `;
    container.appendChild(overlay);
  };

  return { isPremium, unlock, lock, applyLock };
})();

export default ZenPremium;
