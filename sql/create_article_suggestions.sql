-- 記事提案テーブル（書くべき記事の優先順位管理）
-- Supabase SQL Editorで実行してください

CREATE TABLE IF NOT EXISTS yuho_article_suggestions (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    branding_type TEXT NOT NULL CHECK (branding_type IN ('social_misfit_ai', 'philosopher', 'tech_ceo', 'learning_theory')),
    category TEXT CHECK (category IN ('story', 'failure', 'adhd', 'ai', 'philosophy', 'business', 'learning', 'timely')),
    priority INTEGER DEFAULT 50 CHECK (priority >= 0 AND priority <= 100),
    impact TEXT CHECK (impact IN ('high', 'medium', 'low')),
    effort TEXT CHECK (effort IN ('high', 'medium', 'low')),
    status TEXT DEFAULT 'suggested' CHECK (status IN ('suggested', 'approved', 'writing', 'completed', 'skipped')),
    related_draft_id TEXT,
    related_article_id INTEGER,
    tags TEXT[] DEFAULT '{}',
    notes TEXT,
    source TEXT DEFAULT 'ai_analysis',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_suggestions_priority ON yuho_article_suggestions(priority DESC);
CREATE INDEX idx_suggestions_status ON yuho_article_suggestions(status);
CREATE INDEX idx_suggestions_branding ON yuho_article_suggestions(branding_type);

-- RLSポリシー（全アクセス許可）
ALTER TABLE yuho_article_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read suggestions" ON yuho_article_suggestions FOR SELECT USING (true);
CREATE POLICY "Public insert suggestions" ON yuho_article_suggestions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update suggestions" ON yuho_article_suggestions FOR UPDATE USING (true);
CREATE POLICY "Public delete suggestions" ON yuho_article_suggestions FOR DELETE USING (true);

-- updated_at自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_yuho_suggestions_updated_at
    BEFORE UPDATE ON yuho_article_suggestions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- コメント
COMMENT ON TABLE yuho_article_suggestions IS 'AI分析による記事提案・優先順位管理';
COMMENT ON COLUMN yuho_article_suggestions.priority IS '優先度 0-100（100が最高）';
COMMENT ON COLUMN yuho_article_suggestions.impact IS 'インパクト: high=差別化大, medium=安定, low=ニッチ';
COMMENT ON COLUMN yuho_article_suggestions.effort IS '執筆労力: high=リサーチ必要, medium=通常, low=すぐ書ける';

-- 初期データ挿入
INSERT INTO yuho_article_suggestions (title, description, branding_type, category, priority, impact, effort, tags, notes) VALUES
-- 最優先（priority 90-100）
('本人訴訟で弁護士事務所に勝った話', '弁護士を入れず本人訴訟で戦い勝訴した実体験。裁判の準備、法廷での戦い、勝訴後の心境まで。', 'social_misfit_ai', 'failure', 100, 'high', 'medium', ARRAY['訴訟', '本人訴訟', '経験談', '失敗談'], 'X投稿と連動可能、他にない差別化要素'),

('2000万円消えた夜、僕は3日間何も食べられなかった', '上位企業のトンズラで2000万円を失った経験。絶望から立ち直るまでの過程。', 'social_misfit_ai', 'failure', 95, 'high', 'medium', ARRAY['失敗談', '2000万円', '復活', '経営'], '失敗談の極み、復活ストーリーで希望を与える'),

('「UFO!」といじめられた名前を、誇りに変えるまで', '名前「雄歩」をからかわれた子供時代から、竜馬がゆくとの出会い、「英雄然として歩む」という意味を見出すまで。', 'social_misfit_ai', 'story', 90, 'high', 'low', ARRAY['名前', '雄歩', '竜馬がゆく', 'いじめ', '転機'], '感動ストーリー、シェアされやすい'),

-- 高優先（priority 80-89）
('経営者同士で結婚した話——「普通の結婚」を諦めた先に', '2024年に経営者同士で結婚。社会不適合同士の出会いと理解し合える関係。', 'social_misfit_ai', 'timely', 85, 'high', 'low', ARRAY['結婚', '経営者', '2024年', '人生'], 'タイムリー、人間味、ファン化促進'),

('AIフレンズ継続率90%の秘密——なぜ人は学びを続けられないのか', '成長力学を活用したコミュニティ設計。継続率90%を実現した仕組み。', 'learning_theory', 'learning', 82, 'medium', 'medium', ARRAY['AIフレンズ', '継続率', '成長力学', 'コミュニティ'], '事業導線、専門性アピール'),

('MENSAメンバーだけでチームを作ったら崩壊した話', 'IQ高い人だけを集めたチームが崩壊した理由。「頭が良い」だけでは組織は動かない。', 'social_misfit_ai', 'failure', 80, 'high', 'low', ARRAY['MENSA', 'チーム', '失敗談', '経営'], '失敗から学んだ教訓、共感+学び'),

-- 哲学者モード（priority 70-79）
('成長力学入門——知識を「点」から「体積」に変える方法', '独自理論「成長力学」の基礎解説。点→線→体積モデル、心のエネルギー論。', 'philosopher', 'philosophy', 78, 'medium', 'high', ARRAY['成長力学', '学習理論', '点線体積'], '独自理論の基盤記事、長期資産'),

('「世界征服」の本当の意味', '「世界征服」という夢の本当の意味。常識を変え、新しい価値観を提示すること。', 'philosopher', 'philosophy', 75, 'medium', 'medium', ARRAY['世界征服', '夢', '哲学', '価値観'], '夢を語る→深いファン化、ブランド核心'),

('1秒の価値——自分の時間を誰のために使うか', '1秒を相手のために使うことで世界を変える力になる。時間の使い方の哲学。', 'philosopher', 'philosophy', 72, 'medium', 'low', ARRAY['1秒の価値', '時間', '哲学'], '名言的でシェアされやすい'),

-- 中優先（priority 60-69）
('役員に顧客を奪われて訴訟した話', '信頼していた役員が顧客リストを持って退職。訴訟で勝訴し100万円獲得。', 'social_misfit_ai', 'failure', 68, 'medium', 'medium', ARRAY['訴訟', '役員', '裏切り', '経営'], '経営者のリアル、教訓'),

('オフショア開発でブリッジSEが納品前日に失踪した話', '150人月のプロジェクトでのトラブル。ブリッジSEの失踪と乗り越えた方法。', 'social_misfit_ai', 'failure', 65, 'medium', 'medium', ARRAY['オフショア', '開発', 'トラブル', 'SE'], '開発者共感、笑い話に昇華'),

('ADHDの「過集中」を武器にする方法', '過集中のメリット・デメリット。コントロールして武器にする具体的方法。', 'social_misfit_ai', 'adhd', 62, 'medium', 'medium', ARRAY['ADHD', '過集中', '仕事術'], 'ADHD層への実践的価値'),

-- 追加候補（priority 50-59）
('「普通」ができない人のための仕事の選び方', '社会不適合者が生き残れる職種・働き方の選び方。', 'social_misfit_ai', 'adhd', 55, 'medium', 'medium', ARRAY['仕事選び', 'キャリア', 'ADHD'], '実用的、ターゲット層に刺さる'),

('心理学・教育学に1000万円投資して学んだこと', 'NLPマスタープラクティショナー取得までの道のり。投資して得た知見。', 'learning_theory', 'learning', 52, 'medium', 'high', ARRAY['心理学', '教育学', 'NLP', '投資'], '専門性アピール、権威づけ'),

('フリーランスを経由せず、いきなり株式会社を作った理由', '2015年にフリーランス経験なしで法人化した理由と結果。', 'social_misfit_ai', 'business', 50, 'medium', 'low', ARRAY['起業', '株式会社', 'フリーランス'], '起業志望者向け');
