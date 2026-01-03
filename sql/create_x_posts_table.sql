-- X（Twitter）投稿管理テーブル
CREATE TABLE yuho_x_posts (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  category TEXT CHECK (category IN ('adhd_relatable', 'work_struggle', 'failure_story', 'hope', 'ai_life', 'question')),
  branding_type TEXT DEFAULT 'social_misfit_ai',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'posted')),
  related_article_id INTEGER REFERENCES yuho_articles(id),
  priority INTEGER DEFAULT 0,
  posted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_x_posts_status ON yuho_x_posts(status);
CREATE INDEX idx_x_posts_category ON yuho_x_posts(category);

-- RLSポリシー（オープン）
ALTER TABLE yuho_x_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON yuho_x_posts FOR ALL USING (true) WITH CHECK (true);

-- コメント
COMMENT ON TABLE yuho_x_posts IS 'X（Twitter）投稿の下書き・管理';
COMMENT ON COLUMN yuho_x_posts.category IS 'adhd_relatable=ADHDあるある, work_struggle=会社員つらい, failure_story=失敗談, hope=希望系, ai_life=AI×人生, question=問いかけ';
