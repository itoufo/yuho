// 下書きデータ管理
// 各下書きは js/drafts/ 以下の個別ファイルで管理
const DRAFTS = [];

// 下書き関連ユーティリティ
function getDrafts() {
  return DRAFTS;
}

function getDraftById(id) {
  return DRAFTS.find(d => d.id === id);
}

function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.textContent;
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = original;
      btn.classList.remove('copied');
    }, 2000);
  });
}
