# CLAUDE.md - プロジェクトコンテキスト

このファイルはClaude Codeが会話を引き継ぐためのコンテキストファイルです。

---

## プロジェクト概要

**伊東雄歩（Yuho Ito）のコンテンツ管理ダッシュボード**

note.comへの投稿を管理するためのダッシュボード。プロフィール、ブランディング戦略、記事アイデア、下書きを一元管理する。

---

## 人物: 伊東雄歩

### 基本情報
- **名前**: 伊東雄歩（いとうゆうほ / ゆぽゆぽ）
- **生年**: 1990年
- **出身**: 神奈川県横須賀市
- **学歴**: 横須賀高校 → 東北大学
- **肩書**: 株式会社ウォーカー代表取締役
- **資格**: MENSA会員、NLPマスタープラクティショナー
- **ブランディング**: 「令和のエジソン」

### 特徴
- IQ130超
- ADHD気質（敬語苦手、遅刻癖、忘れ物癖）
- 訴訟5回（4勝1分）
- 最大損失2000万円を経験
- 独自理論「成長力学」を開発

### キャリア
- 2013: ソフトバンク入社（PNet PMO、WAF技術主任）
- 2015: 株式会社ウォーカー設立（フリーランス経験なしで直接法人化）
- 2016: AI教材「StoQ」開発、Edix出展
- 2017: JDLA認定講座講師
- 2019-2021: アパレル大規模基幹システム（150人月超）
- 2024: 経営者同士で結婚
- 現在: 健全AI教育協会（HAIIA）理事、Digitech Quest全国展開中

### 哲学・思想
- **夢**: 「世界征服」= 世界の常識を変え、新しい価値観を提示すること
- **座右の銘**: 「失敗は経験の元」
- **名前の意味**: 「雄歩」= 英雄然として歩む

---

## 成長力学（独自理論）

### 情報処理モデル
```
心（Emotion）→ 脳（Processing）→ 記憶（Memory）
```
好奇心が湧いた情報ほど深く記憶される。

### 3つの最適化軸
1. **効率**: 必要な情報を即座に引き出せる状態
2. **尊厳**: 自己評価を高める情報は優先保存
3. **目標達成**: ゴール直結情報は優先順位が高い

### 点→線→体積モデル
- **点**: 孤立した知識の断片
- **線**: 点同士を結ぶ関係性
- **体積**: 創造的アイデアが生まれる状態

### アイデアの公式
```
アイデア = 既存の知識（体積化） + リラックス状態
```

---

## ブランディング戦略（4軸）

### 1. 社会不適合×AI（メイン）
- **ハンドル**: @yuho_misfit
- **コンセプト**: 社会不適合がAIで人生を変える方法を教える人
- **ターゲット**: 社会に馴染めない人、ADHD、HSP
- **トーン**: カジュアル、共感、実体験ベース
- **Phase**: 1（今すぐ開始）

### 2. 哲学者モード（サブ）
- **ハンドル**: @yuho_think
- **コンセプト**: 常識への疑問、世界の見方、成長力学
- **ターゲット**: 思考好き、上級者
- **トーン**: 深い、問いかけ、こびない
- **注意**: バズらせない、数より深さ
- **Phase**: 2（4-6ヶ月後）

### 3. 技術経営者（専門）
- **ハンドル**: @yuho_tech_ceo
- **コンセプト**: AI×ビジネス×技術の専門家
- **ターゲット**: BtoB、経営者、技術者
- **トーン**: プロフェッショナル
- **Phase**: 3（7-12ヶ月後）

### 4. 学習理論専門家（専門）
- **ハンドル**: @yuho_learning
- **コンセプト**: 成長力学、NLP、教育メソッド
- **ターゲット**: 教育関係者、学習者
- **トーン**: アカデミック、実践的
- **Phase**: 3（7-12ヶ月後）

---

## 技術スタック

### ダッシュボード
- **フロントエンド**: 静的HTML + Vanilla JS
- **バックエンド**: Supabase（PostgreSQL + REST API）
- **ホスティング**: Netlify
- **画像生成**: nanobanana MCP

### Supabase設定
- **URL**: https://bjnyvjtilklrfbnnnybi.supabase.co
- **テーブル接頭辞**: `yuho_`

### テーブル構造
```sql
yuho_articles (id, title, branding_type, category, status, file_path, note_url, priority, created_at, updated_at, published_at)
yuho_branding (id, code, name, concept, target, tone)
yuho_tags (id, name)
yuho_article_tags (article_id, tag_id)
```

### ステータス
- `idea`: アイデア
- `drafting`: 執筆中
- `review`: レビュー
- `published`: 公開済み

---

## ファイル構成

```
dashboard/
├── index.html          # ダッシュボード（統計・概要）
├── articles.html       # 記事管理（CRUD）
├── branding.html       # ブランディング一覧
├── account-design.html # アカウント設計（4ブランド詳細）
├── profile.html        # プロフィール（詳細な経歴）
├── css/style.css       # 共通スタイル
├── js/
│   ├── config.js       # Supabase設定
│   └── app.js          # 共通ユーティリティ
├── img/
│   └── brand-structure.jpg  # ブランド構造図（nanobanana生成）
├── netlify.toml        # Netlify設定
├── account-design.md   # アカウント設計書（詳細）
├── CLAUDE.md           # このファイル
└── README.md           # プロジェクト概要
```

---

## 関連ファイル（dashboard外）

```
/Users/administrator/Dev/yuhoito/
├── profile.md          # プロフィール詳細（マスターデータ）
├── branding.md         # ブランディング戦略詳細
├── ideas/
│   └── article-ideas.md  # 記事アイデア一覧
├── drafts/
│   └── my-story-failures.md  # 下書き記事
└── content.db          # SQLiteバックアップ（旧）
```

---

## 記事データ概要

- **総記事数**: 61件
- **social_misfit_ai**: 24件
- **philosopher**: 37件
- **drafting状態**: 1件（my-story-failures.md）

---

## 今後の作業予定

### Phase 1（今すぐ）
- [ ] Twitterアカウント @yuho_misfit 作成/リニューアル
- [ ] プロフィール設計
- [ ] 固定ツイート作成
- [ ] 最初の10ツイート下書き
- [ ] noteマガジン作成
- [ ] 最初の記事公開（my-story-failures.md を完成させる）

### Phase 2（4-6ヶ月後）
- [ ] 哲学者モード @yuho_think 開始

### Phase 3（7-12ヶ月後）
- [ ] 技術経営 @yuho_tech_ceo 開始
- [ ] 学習理論 @yuho_learning 開始

---

## MCP連携

### note.com投稿
```
mcp__Note__publish_note: Markdownファイルからnote.comに記事を公開
mcp__Note__save_draft: 下書き保存
```

### 画像生成
```
mcp__nanobanana__nanobanana_generate: テキストから画像生成
```

---

## よく使うコマンド

```bash
# ローカル実行
cd /Users/administrator/Dev/yuhoito/dashboard
npx serve . -p 3000

# デプロイ（自動）
git add -A && git commit -m "message" && git push

# Supabaseにデータ挿入（curl）
curl -X POST 'https://bjnyvjtilklrfbnnnybi.supabase.co/rest/v1/yuho_articles' \
  -H "apikey: [ANON_KEY]" \
  -H "Content-Type: application/json" \
  -d '[{"title":"...","branding_type":"...","status":"idea"}]'
```

---

## 注意事項

- Supabase anon keyはjs/config.jsに記載（公開リポジトリ注意）
- RLSポリシーは現在オープン（本番運用時は要設定）
- 画像生成はnanobanana MCPを使用（Gemini経由）
