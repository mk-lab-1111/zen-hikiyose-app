/**
 * zen_hikiyose_storage.js
 * localStorageの読み書きを管理する。
 * キー名は仕様書通りに固定する。
 */

const ZenStorage = (() => {
  /**
   * 値を取得する。存在しない場合はdefaultValueを返す。
   */
  const get = (key, defaultValue = null) => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return defaultValue;
      return JSON.parse(raw);
    } catch {
      return defaultValue;
    }
  };

  /**
   * 値を保存する。
   */
  const set = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  };

  /**
   * キーを削除する。
   */
  const remove = (key) => {
    localStorage.removeItem(key);
  };

  /**
   * アプリの全データを削除する。
   */
  const clearAll = () => {
    const keys = [
      'zen_hikiyose_settings',
      'zen_hikiyose_affirmation_record',
      'zen_hikiyose_log',
      'zen_hikiyose_dream_log',
      'zen_hikiyose_mandala',
      'zen_hikiyose_roadmap_progress',
      'zen_hikiyose_premium',
      'zen_hikiyose_onboarding',
      'zen_hikiyose_alarm',
      'zen_hikiyose_theme',
      'zen_hikiyose_mind_score',
    ];
    keys.forEach(k => localStorage.removeItem(k));
  };

  return { get, set, remove, clearAll };
})();

export default ZenStorage;
