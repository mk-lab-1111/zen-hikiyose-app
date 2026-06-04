/**
 * zen_hikiyose_score.js - マインドスコア計算
 */

import ZenStorage from './zen_hikiyose_storage.js';

const ZenScore = (() => {
  const STORAGE_KEY = 'score_history';

  /**
   * 現在のマインドスコア（0〜100）を計算
   */
  const calculate = () => {
    const history = ZenStorage.get(STORAGE_KEY, []);
    if (history.length === 0) return 0;

    // 直近30件の平均
    const recent = history.slice(-30);
    const total = recent.reduce((sum, entry) => sum + (entry.value || 0), 0);
    return Math.round(total / recent.length);
  };

  /**
   * スコアエントリを追加
   * @param {number} value - スコア値（0〜100）
   */
  const addEntry = (value) => {
    const history = ZenStorage.get(STORAGE_KEY, []);
    history.push({
      value: Math.max(0, Math.min(100, value)),
      timestamp: new Date().toISOString(),
    });
    ZenStorage.set(STORAGE_KEY, history);
  };

  /**
   * 連続記録日数を取得
   */
  const getStreak = () => {
    const history = ZenStorage.get(STORAGE_KEY, []);
    if (history.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dates = [...new Set(
      history.map(e => new Date(e.timestamp).toDateString())
    )].reverse();

    for (let i = 0; i < dates.length; i++) {
      const entryDate = new Date(dates[i]);
      entryDate.setHours(0, 0, 0, 0);
      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);

      if (entryDate.getTime() === expected.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  return { calculate, addEntry, getStreak };
})();

export default ZenScore;
