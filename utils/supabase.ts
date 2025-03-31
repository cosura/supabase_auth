import { createClient } from '@supabase/supabase-js';

// 環境変数から Supabase の URL と匿名キーを取得
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 設定値のデバッグ
console.log('Supabase 初期化情報:', { 
  url: supabaseUrl ? `${supabaseUrl.substring(0, 10)}...` : 'undefined',
  keyExists: !!supabaseAnonKey
});

// Supabase クライアントを作成（自動セッション保持を有効に）
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  }
});
