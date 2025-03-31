// Next.jsのAPIルートを作成
// このファイルはクライアントからサーバーへの認証リクエストを処理します

import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// ログインAPI
export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // パラメータチェック
    if (!email || !password) {
      return NextResponse.json(
        { error: 'メールアドレスとパスワードが必要です' },
        { status: 400 }
      );
    }
    
    // Supabaseクライアントの初期化（サーバーサイド）
    const supabase = createRouteHandlerClient({ cookies });
    
    // ログイン処理
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { user: data.user, session: data.session },
      { status: 200 }
    );
  } catch (error) {
    console.error('ログインAPI処理エラー:', error);
    return NextResponse.json(
      { error: '認証処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

// セッション確認API
export async function GET() {
  try {
    // Supabaseクライアントの初期化（サーバーサイド）
    const supabase = createRouteHandlerClient({ cookies });
    
    // 現在のセッションを取得
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { session: data.session, user: data.session?.user || null },
      { status: 200 }
    );
  } catch (error) {
    console.error('セッション確認API処理エラー:', error);
    return NextResponse.json(
      { error: 'セッション確認中にエラーが発生しました' },
      { status: 500 }
    );
  }
}

// ログアウトAPI
export async function DELETE() {
  try {
    // Supabaseクライアントの初期化（サーバーサイド）
    const supabase = createRouteHandlerClient({ cookies });
    
    // ログアウト処理
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { message: 'ログアウト成功' },
      { status: 200 }
    );
  } catch (error) {
    console.error('ログアウトAPI処理エラー:', error);
    return NextResponse.json(
      { error: 'ログアウト処理中にエラーが発生しました' },
      { status: 500 }
    );
  }
}
