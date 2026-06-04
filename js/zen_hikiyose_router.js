/**
 * zen_hikiyose_router.js
 * ページ遷移・ナビゲーション管理
 */

const ZenRouter = (() => {
  /** 現在のページファイル名（拡張子なし）を返す */
  const getCurrentPage = () => {
    const path = window.location.pathname;
    const file = path.split('/').pop() || 'index.html';
    return file.replace('.html', '');
  };

  /** pagesディレクトリ内にいるかどうかを返す */
  const isInPagesDir = () => window.location.pathname.includes('/pages/');

  /**
   * ページに遷移する。
   * @param {string} pageName - ファイル名（拡張子なし）
   */
  const go = (pageName) => {
    const base = isInPagesDir() ? '' : 'pages/';
    window.location.href = `${base}${pageName}.html`;
  };

  /** 前のページに戻る */
  const back = () => window.history.back();

  /**
   * ボトムナビのアクティブ状態を更新する。
   */
  const updateNav = () => {
    const current = getCurrentPage();
    document.querySelectorAll('.bottom-nav__item').forEach(item => {
      const href = item.getAttribute('href') || '';
      const target = href.split('/').pop().replace('.html', '');
      item.classList.toggle('is-active', target === current);
    });
  };

  return { getCurrentPage, isInPagesDir, go, back, updateNav };
})();

export default ZenRouter;
