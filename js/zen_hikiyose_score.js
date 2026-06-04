/**
 * zen_hikiyose_score.js
 * マインドスコアの計算・管理を行う。
 *
 * 計算式：
 *   新スコア = 現スコア × (1 + 成長率) + 当日獲得ポイント × ストリーク補正
 *
 * 成長率：
 *   1〜90日目   : 0.3%/日
 *   91〜365日目 : 0.5%/日
 *   366日目以降 : 0.8%/日
 *
 * 獲得ポイント：
 *   朝アファメーション : +50pt
 *   夜アファメーション : +50pt
 *   両方ボーナス       : +30pt
 *   引き寄せログ       : +20pt
 *   夢実現ログ         : +30pt
 *   ロードマップ1%進捗 : +10pt
 *
 * ストリーク補正：× (1 + 連続日数 × 0.01)
 */

import ZenStorage from './zen_hikiyose_storage.js';

const ZenScore = (() => {
  const KEY = 'zen_hikiyose_mind_score';

  const defaultData = () => ({
    score: 0,
    totalDays: 0,
    streak: 0,
    lastPracticeDate: null,
    lastGrowthDate: null,
    dailyLog: {},  // 'YYYY-MM-DD': { morning, evening, log, dreamLog, roadmap, bothBonus }
  });

  const getData = () => ZenStorage.get(KEY, defaultData());
  const saveData = (d) => ZenStorage.set(KEY, d);

  const todayKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  };

  const yesterdayKey = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  };

  const growthRate = (totalDays) => {
    if (totalDays <= 90)  return 0.003;
    if (totalDays <= 365) return 0.005;
    return 0.008;
  };

  /**
   * 1日1回だけ成長率を適用する。
   * アプリ起動時に呼ぶ。
   */
  const applyDailyGrowth = () => {
    const data = getData();
    const today = todayKey();
    if (data.lastGrowthDate === today) return; // 今日は適用済み

    data.score = Math.round(data.score * (1 + growthRate(data.totalDays)));
    data.totalDays = (data.totalDays || 0) + 1;
    data.lastGrowthDate = today;

    // ストリーク更新
    if (data.lastPracticeDate === yesterdayKey()) {
      // 昨日実践した → 継続
    } else if (data.lastPracticeDate !== today) {
      // 昨日も今日もなし → リセット
      data.streak = 0;
    }

    saveData(data);
  };

  /**
   * 実践ポイントを加算する。
   * @param {'morning'|'evening'|'log'|'dreamLog'|'roadmap'} type
   * @returns {number} 獲得したポイント（0なら重複）
   */
  const addPoints = (type) => {
    const data = getData();
    const today = todayKey();
    if (!data.dailyLog[today]) data.dailyLog[today] = {};
    const dl = data.dailyLog[today];

    const BASE = { morning: 50, evening: 50, log: 20, dreamLog: 30, roadmap: 10 };
    if (!BASE[type]) return 0;

    // 一日一回制限（log, dreamLog, roadmapは何度でもOK）
    const once = ['morning', 'evening'];
    if (once.includes(type) && dl[type]) return 0;

    dl[type] = true;
    let pts = BASE[type];

    // 両方ボーナス
    if (dl.morning && dl.evening && !dl.bothBonus) {
      pts += 30;
      dl.bothBonus = true;
    }

    // ストリーク補正
    const multiplier = 1 + (data.streak || 0) * 0.01;
    const earned = Math.round(pts * multiplier);
    data.score = Math.round((data.score || 0) + earned);

    // 最終実践日・ストリーク更新
    if (data.lastPracticeDate !== today) {
      if (data.lastPracticeDate === yesterdayKey()) {
        data.streak = (data.streak || 0) + 1;
      } else {
        data.streak = 1;
      }
      data.lastPracticeDate = today;
    }

    saveData(data);
    return earned;
  };

  const getCurrentScore = () => Math.round(getData().score || 0);
  const getStreak = () => getData().streak || 0;
  const getTotalDays = () => getData().totalDays || 0;
  const getDailyLog = (dateKey = todayKey()) => getData().dailyLog[dateKey] || {};

  return { applyDailyGrowth, addPoints, getCurrentScore, getStreak, getTotalDays, getDailyLog };
})();

export default ZenScore;
