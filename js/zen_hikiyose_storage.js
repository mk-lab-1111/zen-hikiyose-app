/**
 * zen_hikiyose_storage.js - localStorage管理
 */

const ZenStorage = (() => {
  const PREFIX = 'mindful_asset_';

  const key = (name) => `${PREFIX}${name}`;

  const get = (name, defaultValue = null) => {
    try {
      const raw = localStorage.getItem(key(name));
      if (raw === null) return defaultValue;
      return JSON.parse(raw);
    } catch {
      return defaultValue;
    }
  };

  const set = (name, value) => {
    try {
      localStorage.setItem(key(name), JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  };

  const remove = (name) => {
    localStorage.removeItem(key(name));
  };

  const clear = () => {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(PREFIX));
    keys.forEach(k => localStorage.removeItem(k));
  };

  return { get, set, remove, clear };
})();

export default ZenStorage;
