/**
 * zen_hikiyose_premium.js - 無料/有料フラグ管理
 */

import ZenStorage from './zen_hikiyose_storage.js';

const ZenPremium = (() => {
  const STORAGE_KEY = 'is_premium';

  const isPremium = () => ZenStorage.get(STORAGE_KEY, false);

  const setPremium = (value) => ZenStorage.set(STORAGE_KEY, !!value);

  const unlock = () => setPremium(true);

  const lock = () => setPremium(false);

  /**
   * プレミアム限定要素の表示制御
   * data-premium 属性を持つ要素を制御する
   */
  const applyUI = () => {
    const premium = isPremium();
    document.querySelectorAll('[data-premium]').forEach(el => {
      if (premium) {
        el.classList.remove('premium-locked');
      } else {
        el.classList.add('premium-locked');
      }
    });
  };

  return { isPremium, unlock, lock, applyUI };
})();

export default ZenPremium;
