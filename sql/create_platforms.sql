-- プラットフォーム管理テーブル作成
-- Supabase SQL Editorで実行してください

-- プラットフォームマスタ
CREATE TABLE IF NOT EXISTS yuho_platforms (
    id SERIAL PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    content_type TEXT,
    typical_length TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 初期データ
INSERT INTO yuho_platforms (code, name, description, content_type, typical_length) VALUES
('note', 'note', '長文記事・ストーリー', 'テキスト記事', '2000-5000字'),
('x', 'X (Twitter)', '短文・スレッド・告知', 'ショートテキスト', '280字/ツイート'),
('youtube', 'YouTube', '動画コンテンツ', '動画', '5-15分'),
('voicy', 'Voicy', '音声配信・ラジオ', '音声', '10-20分')
ON CONFLICT (code) DO NOTHING;

-- 記事×プラットフォーム紐付け（各プラットフォームごとの進捗管理）
CREATE TABLE IF NOT EXISTS yuho_article_platforms (
    id SERIAL PRIMARY KEY,
    article_id INTEGER REFERENCES yuho_articles(id) ON DELETE CASCADE,
    platform_id INTEGER REFERENCES yuho_platforms(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'planned' CHECK(status IN ('planned', 'drafting', 'scheduled', 'published', 'skipped')),
    url TEXT,
    scheduled_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(article_id, platform_id)
);

-- RLSポリシー（読み取り許可）
ALTER TABLE yuho_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE yuho_article_platforms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON yuho_platforms FOR SELECT USING (true);
CREATE POLICY "Public all access" ON yuho_platforms FOR ALL USING (true);

CREATE POLICY "Public read access" ON yuho_article_platforms FOR SELECT USING (true);
CREATE POLICY "Public all access" ON yuho_article_platforms FOR ALL USING (true);

-- 進捗サマリービュー
CREATE OR REPLACE VIEW yuho_platform_summary AS
SELECT
    p.code as platform,
    p.name as platform_name,
    COUNT(CASE WHEN ap.status = 'planned' THEN 1 END) as planned,
    COUNT(CASE WHEN ap.status = 'drafting' THEN 1 END) as drafting,
    COUNT(CASE WHEN ap.status = 'scheduled' THEN 1 END) as scheduled,
    COUNT(CASE WHEN ap.status = 'published' THEN 1 END) as published,
    COUNT(CASE WHEN ap.status = 'skipped' THEN 1 END) as skipped,
    COUNT(ap.id) as total
FROM yuho_platforms p
LEFT JOIN yuho_article_platforms ap ON p.id = ap.platform_id
GROUP BY p.id, p.code, p.name
ORDER BY p.id;
