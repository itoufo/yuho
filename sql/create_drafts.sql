-- 下書きテーブル作成
-- Supabase SQL Editorで実行してください

CREATE TABLE IF NOT EXISTS yuho_drafts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    thumbnail TEXT,
    images JSONB DEFAULT '[]',
    branding TEXT,
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLSポリシー（全アクセス許可）
ALTER TABLE yuho_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON yuho_drafts FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON yuho_drafts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON yuho_drafts FOR UPDATE USING (true);
CREATE POLICY "Public delete access" ON yuho_drafts FOR DELETE USING (true);

-- updated_at自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_yuho_drafts_updated_at
    BEFORE UPDATE ON yuho_drafts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
