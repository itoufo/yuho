const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// データベース接続
const dbPath = path.join(__dirname, 'data', 'content.db');
const db = new Database(dbPath);

// ミドルウェア
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ========== ページルート ==========

// ダッシュボード（ホーム）
app.get('/', (req, res) => {
  const stats = {
    total: db.prepare('SELECT COUNT(*) as count FROM articles').get().count,
    byStatus: db.prepare(`
      SELECT status, COUNT(*) as count FROM articles GROUP BY status
    `).all(),
    byBranding: db.prepare(`
      SELECT branding_type, COUNT(*) as count FROM articles GROUP BY branding_type
    `).all()
  };

  const recentArticles = db.prepare(`
    SELECT * FROM articles ORDER BY updated_at DESC LIMIT 5
  `).all();

  res.render('index', { stats, recentArticles });
});

// 記事一覧
app.get('/articles', (req, res) => {
  const { status, branding_type } = req.query;

  let query = 'SELECT * FROM articles WHERE 1=1';
  const params = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  if (branding_type) {
    query += ' AND branding_type = ?';
    params.push(branding_type);
  }

  query += ' ORDER BY priority DESC, updated_at DESC';

  const articles = db.prepare(query).all(...params);
  const branding = db.prepare('SELECT * FROM branding').all();

  res.render('articles', { articles, branding, filters: { status, branding_type } });
});

// 記事作成フォーム
app.get('/articles/new', (req, res) => {
  const branding = db.prepare('SELECT * FROM branding').all();
  const categories = db.prepare('SELECT DISTINCT category FROM articles WHERE category IS NOT NULL').all();
  res.render('article-form', { article: null, branding, categories });
});

// 記事編集フォーム
app.get('/articles/:id/edit', (req, res) => {
  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id);
  const branding = db.prepare('SELECT * FROM branding').all();
  const categories = db.prepare('SELECT DISTINCT category FROM articles WHERE category IS NOT NULL').all();

  if (!article) {
    return res.redirect('/articles');
  }
  res.render('article-form', { article, branding, categories });
});

// 記事詳細
app.get('/articles/:id', (req, res) => {
  const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id);
  if (!article) {
    return res.redirect('/articles');
  }
  res.render('article-detail', { article });
});

// ブランディング一覧
app.get('/branding', (req, res) => {
  const branding = db.prepare('SELECT * FROM branding').all();
  const articleCounts = db.prepare(`
    SELECT branding_type, COUNT(*) as count
    FROM articles
    GROUP BY branding_type
  `).all();

  res.render('branding', { branding, articleCounts });
});

// プロフィール
app.get('/profile', (req, res) => {
  res.render('profile');
});

// ========== API ルート ==========

// 記事作成
app.post('/articles', (req, res) => {
  const { title, branding_type, category, status, file_path, priority } = req.body;

  db.prepare(`
    INSERT INTO articles (title, branding_type, category, status, file_path, priority)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(title, branding_type || null, category || null, status || 'idea', file_path || null, priority || 0);

  res.redirect('/articles');
});

// 記事更新
app.post('/articles/:id', (req, res) => {
  const { title, branding_type, category, status, file_path, note_url, priority } = req.body;

  let updateFields = `
    title = ?, branding_type = ?, category = ?, status = ?,
    file_path = ?, note_url = ?, priority = ?, updated_at = CURRENT_TIMESTAMP
  `;

  const params = [title, branding_type || null, category || null, status, file_path || null, note_url || null, priority || 0, req.params.id];

  // 公開時は published_at も更新
  if (status === 'published') {
    const current = db.prepare('SELECT status FROM articles WHERE id = ?').get(req.params.id);
    if (current && current.status !== 'published') {
      updateFields = `
        title = ?, branding_type = ?, category = ?, status = ?,
        file_path = ?, note_url = ?, priority = ?, updated_at = CURRENT_TIMESTAMP,
        published_at = CURRENT_TIMESTAMP
      `;
    }
  }

  db.prepare(`UPDATE articles SET ${updateFields} WHERE id = ?`).run(...params);

  res.redirect('/articles');
});

// 記事削除
app.post('/articles/:id/delete', (req, res) => {
  db.prepare('DELETE FROM article_tags WHERE article_id = ?').run(req.params.id);
  db.prepare('DELETE FROM articles WHERE id = ?').run(req.params.id);
  res.redirect('/articles');
});

// ステータス更新（AJAX用）
app.patch('/api/articles/:id/status', (req, res) => {
  const { status } = req.body;

  let query = 'UPDATE articles SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
  if (status === 'published') {
    query = 'UPDATE articles SET status = ?, updated_at = CURRENT_TIMESTAMP, published_at = CURRENT_TIMESTAMP WHERE id = ?';
  }

  db.prepare(query).run(status, req.params.id);
  res.json({ success: true });
});

// サーバー起動
app.listen(PORT, () => {
  console.log(`🚀 Dashboard running at http://localhost:${PORT}`);
});
