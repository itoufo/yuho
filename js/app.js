// 共通ユーティリティ

// ステータスラベル
const statusLabels = {
  idea: 'アイデア',
  drafting: '執筆中',
  review: 'レビュー',
  published: '公開済み'
};

// ブランディングラベル
const brandingLabels = {
  social_misfit_ai: '社会不適合×AI',
  philosopher: '哲学者モード',
  tech_ceo: '技術経営者',
  learning_theory: '学習理論専門家'
};

// URLパラメータ取得
function getParams() {
  return Object.fromEntries(new URLSearchParams(window.location.search));
}

// 日付フォーマット
function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('ja-JP');
}

// トースト通知
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
