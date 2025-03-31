# Supabase認証システム

Next.jsとSupabaseを利用した認証システムの実装です。

## 機能

- ユーザー登録（サインアップ）
- ユーザーログイン
- ログアウト
- 認証情報の保持
- 認証済みユーザーのみが閲覧可能なページ

## 使用技術

- フロントエンド: Next.js（React）
- バックエンド: Supabase
- 認証方式: Supabase Auth（メール & パスワード認証）
- データベース: SupabaseのPostgreSQL
- 言語: TypeScript

## セットアップ手順

1. プロジェクトをクローンする
   ```
   git clone <リポジトリURL>
   cd supabase-auth
   ```

2. 依存関係をインストールする
   ```
   npm install
   ```

3. Supabaseアカウントを作成し、新しいプロジェクトを作成する
   - [Supabase](https://supabase.io)にアクセスしてアカウントを作成
   - 新しいプロジェクトを作成
   - プロジェクトの設定から「API」セクションを確認

4. `.env.local`ファイルを作成し、環境変数を設定する
   ```
   NEXT_PUBLIC_SUPABASE_URL=あなたのSupabaseプロジェクトURL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=あなたのSupabase匿名キー
   ```

5. 開発サーバーを起動する
   ```
   npm run dev
   ```

6. ブラウザで http://localhost:3000 にアクセスする

## プロジェクト構造

- `app/`: Next.jsのAppルーターによるページコンポーネント
- `components/`: 再利用可能なReactコンポーネント
- `lib/`: ヘルパー関数やユーティリティ
- `utils/`: 設定やクライアント関連のユーティリティ

## Supabaseの設定

Supabaseプロジェクトでは以下の設定が必要です：

1. Authentication > Settings > Email auth を有効化
2. SQLエディタで以下のテーブルを作成（オプション）:

```sql
-- プロファイルテーブル（ユーザーの追加情報を格納）
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  website TEXT
);

-- RLSポリシー（Row Level Security）
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "プロファイルは本人のみ編集可能" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "プロファイルは誰でも閲覧可能" 
  ON public.profiles 
  FOR SELECT 
  USING (true);
```

## 主要コンポーネント

- `AuthProvider.tsx`: 認証状態を管理し、アプリ全体で利用できるようにするコンテキストプロバイダー
- `lib/auth.ts`: Supabase認証APIとやり取りするヘルパー関数
- `middleware.ts`: ルートごとの認証チェックを行うミドルウェア

## ライセンス

MIT
