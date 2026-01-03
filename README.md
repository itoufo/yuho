# 伊東雄歩 コンテンツ管理ダッシュボード

> 「令和のエジソン」伊東雄歩のnote.com投稿を管理するダッシュボード

![Brand Structure](img/brand-structure.jpg)

## 🎯 プロジェクト概要

note.comでの発信活動を効率化するための個人用ダッシュボード。

- **記事アイデア管理**: 61件以上のアイデアをステータス別に管理
- **ブランディング戦略**: 4つのブランド軸で発信を最適化
- **プロフィール可視化**: 経歴・哲学・実績を一目で把握

## 🏗️ アーキテクチャ

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Netlify   │────▶│   Browser   │────▶│  Supabase   │
│  (Hosting)  │     │ (Static JS) │     │ (PostgreSQL)│
└─────────────┘     └─────────────┘     └─────────────┘
```

### 技術スタック

| Layer | Technology |
|-------|------------|
| Frontend | HTML + Vanilla JS + CSS |
| Backend | Supabase (PostgreSQL + REST API) |
| Hosting | Netlify (Static) |
| Image Gen | nanobanana MCP (Gemini) |

## 📁 ディレクトリ構成

```
yuho/
├── index.html          # ダッシュボード
├── articles.html       # 記事管理
├── branding.html       # ブランディング
├── account-design.html # アカウント設計
├── profile.html        # プロフィール
├── css/
│   └── style.css
├── js/
│   ├── config.js       # Supabase設定
│   └── app.js          # ユーティリティ
├── img/
│   └── brand-structure.jpg
├── sql/                # SQLスクリプト
├── scripts/            # 自動化スクリプト
├── docs/               # ドキュメント類
│   ├── profile.md      # プロフィール詳細
│   ├── branding.md     # ブランディング戦略
│   ├── ideas/          # 記事アイデア
│   ├── drafts/         # 下書き
│   └── outputs/        # 出力ファイル
├── CLAUDE.md           # AIコンテキスト
└── README.md           # このファイル
```

## 🚀 セットアップ

### ローカル実行

```bash
git clone git@github.com:itoufo/yuho.git
cd yuho
npx serve . -p 3000
# http://localhost:3000 でアクセス
```

### Supabaseセットアップ

1. Supabaseプロジェクト作成
2. SQLエディタで以下を実行:

```sql
-- テーブル作成
CREATE TABLE yuho_articles (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  branding_type TEXT CHECK (branding_type IN ('social_misfit_ai', 'philosopher', 'tech_ceo', 'learning_theory')),
  category TEXT,
  status TEXT DEFAULT 'idea' CHECK (status IN ('idea', 'drafting', 'review', 'published')),
  file_path TEXT,
  note_url TEXT,
  priority INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

CREATE TABLE yuho_branding (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  concept TEXT,
  target TEXT,
  tone TEXT
);

-- 初期データ
INSERT INTO yuho_branding (code, name, concept, target, tone) VALUES
  ('social_misfit_ai', '社会不適合×AI', '社会不適合がAIで人生を変える方法を教える人', '社会に馴染めない人、ADHD、HSP', 'カジュアル、共感、実体験ベース'),
  ('philosopher', '哲学者モード', '常識への疑問、世界の見方、成長力学', '思考好き、上級者', '深い、問いかけ、こびない'),
  ('tech_ceo', '技術経営者', 'AI×ビジネス×技術の専門家', 'BtoB、経営者、技術者', 'プロフェッショナル'),
  ('learning_theory', '学習理論専門家', '成長力学、NLP、教育メソッド', '教育関係者、学習者', 'アカデミック、実践的');
```

3. `js/config.js` にURL/Keyを設定

### Netlifyデプロイ

1. [Netlify](https://app.netlify.com) にログイン
2. **Add new site** → **Import from Git**
3. GitHubリポジトリ `itoufo/yuho` を選択
4. 設定:
   - Base directory: （空欄）
   - Build command: （空欄）
   - Publish directory: `.`
5. **Deploy**

## 📊 データモデル

### 記事ステータスフロー

```
idea → drafting → review → published
 │                          │
 └──────────────────────────┘
         (優先度変更)
```

### ブランディング4軸

| Code | Name | Phase | Focus |
|------|------|-------|-------|
| `social_misfit_ai` | 社会不適合×AI | 1 | 集客 |
| `philosopher` | 哲学者モード | 2 | ファン化 |
| `tech_ceo` | 技術経営者 | 3 | BtoB |
| `learning_theory` | 学習理論専門家 | 3 | 教育 |

## 🗺️ ロードマップ

### Phase 1: 基盤構築 ✅
- [x] ダッシュボード作成
- [x] Supabase連携
- [x] Netlifyデプロイ
- [x] プロフィール可視化
- [x] アカウント設計書作成

### Phase 2: コンテンツ発信（1-3ヶ月）
- [ ] Twitter @yuho_misfit 本格運用開始
- [ ] note.com 初記事公開
- [ ] 週1本ペースで記事執筆
- [ ] MCP連携でnote投稿自動化

### Phase 3: ブランド拡張（4-6ヶ月）
- [ ] 哲学者モード @yuho_think 開始
- [ ] コアファンコミュニティ形成
- [ ] メルマガ/LINE開設

### Phase 4: 事業連携（7-12ヶ月）
- [ ] 技術経営者ブランド開始
- [ ] 学習理論ブランド開始
- [ ] Digitech Quest / AIフレンズとの連携強化

### 将来構想
- [ ] YouTube展開
- [ ] 書籍出版
- [ ] オンラインコース

## 🔧 開発ガイド

### 新しいページを追加する場合

1. HTMLファイル作成（既存ページをコピー）
2. ナビゲーションリンクを全ページに追加
3. `git push` でNetlifyに自動デプロイ

### Supabaseにデータ追加

```bash
curl -X POST 'https://[PROJECT_ID].supabase.co/rest/v1/yuho_articles' \
  -H "apikey: [ANON_KEY]" \
  -H "Authorization: Bearer [ANON_KEY]" \
  -H "Content-Type: application/json" \
  -d '[{"title":"記事タイトル","branding_type":"social_misfit_ai","status":"idea","priority":5}]'
```

### 画像生成（nanobanana）

Claude Code内で:
```
mcp__nanobanana__nanobanana_generate
- prompt: 画像の説明
- style: digital_art
- aspect_ratio: 16:9
```

## 📝 関連ドキュメント

- [CLAUDE.md](CLAUDE.md) - AIコンテキスト（会話引き継ぎ用）
- [account-design.md](account-design.md) - アカウント設計詳細

## 🔗 リンク

- **GitHub**: https://github.com/itoufo/yuho
- **Netlify**: （デプロイ後に追加）
- **note.com**: https://note.com/yuho_walker
- **Twitter**: https://twitter.com/itoWalker

## 📄 ライセンス

Private - All rights reserved

---

Made with ❤️ by 伊東雄歩 + Claude Code
