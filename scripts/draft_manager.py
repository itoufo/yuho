#!/usr/bin/env python3
"""
note用下書き管理スクリプト
Supabaseに下書きを保存・取得する
"""

import json
import requests
import sys
from datetime import datetime
from pathlib import Path

# Supabase設定
SUPABASE_URL = 'https://bjnyvjtilklrfbnnnybi.supabase.co'
SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqbnl2anRpbGtscmZibm5ueWJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwMjY4NjQsImV4cCI6MjA4MDYwMjg2NH0.vUVLkJvxntsF4YNzvQI2ouTC9VJOGsoVFu2iYqx_ObQ'

HEADERS = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}

def save_draft(draft_data: dict) -> dict:
    """下書きを保存（upsert）"""
    url = f'{SUPABASE_URL}/rest/v1/yuho_drafts'

    # upsert用ヘッダー追加
    headers = {**HEADERS, 'Prefer': 'resolution=merge-duplicates,return=representation'}

    response = requests.post(url, headers=headers, json=draft_data)

    if response.status_code in [200, 201]:
        print(f"✅ 保存成功: {draft_data.get('title', draft_data.get('id'))}")
        return response.json()
    else:
        print(f"❌ 保存失敗: {response.status_code}")
        print(response.text)
        return None

def get_all_drafts() -> list:
    """全下書きを取得"""
    url = f'{SUPABASE_URL}/rest/v1/yuho_drafts?order=created_at.desc'
    response = requests.get(url, headers=HEADERS)

    if response.status_code == 200:
        return response.json()
    else:
        print(f"❌ 取得失敗: {response.status_code}")
        return []

def get_draft_by_id(draft_id: str) -> dict:
    """IDで下書きを取得"""
    url = f'{SUPABASE_URL}/rest/v1/yuho_drafts?id=eq.{draft_id}'
    response = requests.get(url, headers=HEADERS)

    if response.status_code == 200:
        data = response.json()
        return data[0] if data else None
    return None

def delete_draft(draft_id: str) -> bool:
    """下書きを削除"""
    url = f'{SUPABASE_URL}/rest/v1/yuho_drafts?id=eq.{draft_id}'
    response = requests.delete(url, headers=HEADERS)

    if response.status_code == 204:
        print(f"✅ 削除成功: {draft_id}")
        return True
    else:
        print(f"❌ 削除失敗: {response.status_code}")
        return False

def save_from_markdown(md_path: str, draft_id: str = None, branding: str = None) -> dict:
    """
    Markdownファイルから下書きを保存

    ファイル形式:
    ---
    title: タイトル
    tags: タグ1, タグ2
    thumbnail: path/to/thumb.jpg
    ---
    本文...
    """
    path = Path(md_path)
    if not path.exists():
        print(f"❌ ファイルが見つかりません: {md_path}")
        return None

    content = path.read_text(encoding='utf-8')

    # フロントマター解析
    title = ''
    tags = []
    thumbnail = ''
    body = content

    if content.startswith('---'):
        parts = content.split('---', 2)
        if len(parts) >= 3:
            frontmatter = parts[1]
            body = parts[2].strip()

            for line in frontmatter.strip().split('\n'):
                if line.startswith('title:'):
                    title = line[6:].strip()
                elif line.startswith('tags:'):
                    tags = [t.strip() for t in line[5:].split(',')]
                elif line.startswith('thumbnail:'):
                    thumbnail = line[10:].strip()

    # IDがなければファイル名から生成
    if not draft_id:
        draft_id = path.stem

    draft_data = {
        'id': draft_id,
        'title': title or path.stem,
        'tags': tags,
        'thumbnail': thumbnail,
        'branding': branding,
        'content': body,
        'images': []
    }

    return save_draft(draft_data)

def export_to_markdown(draft_id: str, output_path: str = None) -> str:
    """下書きをMarkdownファイルに出力"""
    draft = get_draft_by_id(draft_id)
    if not draft:
        print(f"❌ 下書きが見つかりません: {draft_id}")
        return None

    # フロントマター作成
    frontmatter = f"""---
title: {draft['title']}
tags: {', '.join(draft.get('tags', []))}
thumbnail: {draft.get('thumbnail', '')}
---

"""

    content = frontmatter + (draft.get('content', '') or '')

    if output_path:
        Path(output_path).write_text(content, encoding='utf-8')
        print(f"✅ 出力成功: {output_path}")

    return content

def list_drafts():
    """下書き一覧を表示"""
    drafts = get_all_drafts()

    if not drafts:
        print("📝 下書きはありません")
        return

    print(f"\n📝 下書き一覧 ({len(drafts)}件)")
    print("-" * 60)

    for d in drafts:
        tags = ', '.join(d.get('tags', []))
        print(f"• {d['id']}")
        print(f"  タイトル: {d['title']}")
        print(f"  タグ: {tags}")
        print(f"  作成日: {d.get('created_at', '')[:10]}")
        print()

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("使い方:")
        print("  python draft_manager.py list                    # 一覧表示")
        print("  python draft_manager.py get <id>                # 取得")
        print("  python draft_manager.py save <md_file> [id] [branding]  # 保存")
        print("  python draft_manager.py export <id> [output.md] # エクスポート")
        print("  python draft_manager.py delete <id>             # 削除")
        sys.exit(0)

    cmd = sys.argv[1]

    if cmd == 'list':
        list_drafts()
    elif cmd == 'get' and len(sys.argv) >= 3:
        draft = get_draft_by_id(sys.argv[2])
        if draft:
            print(json.dumps(draft, ensure_ascii=False, indent=2))
    elif cmd == 'save' and len(sys.argv) >= 3:
        md_path = sys.argv[2]
        draft_id = sys.argv[3] if len(sys.argv) > 3 else None
        branding = sys.argv[4] if len(sys.argv) > 4 else None
        save_from_markdown(md_path, draft_id, branding)
    elif cmd == 'export' and len(sys.argv) >= 3:
        draft_id = sys.argv[2]
        output = sys.argv[3] if len(sys.argv) > 3 else None
        result = export_to_markdown(draft_id, output)
        if result and not output:
            print(result)
    elif cmd == 'delete' and len(sys.argv) >= 3:
        delete_draft(sys.argv[2])
    else:
        print("❌ 不正なコマンド")
