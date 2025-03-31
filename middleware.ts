import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// このミドルウェアはすべてのルートリクエストに対して実行されます
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Supabaseクライアントを作成
  const supabase = createMiddlewareClient({ req, res });
  
  // セッションの更新（JWTが期限切れの場合は自動的に更新）
  await supabase.auth.getSession();
  
  return res;
}

// ミドルウェアを適用するルートを指定
export const config = {
  matcher: [
    // すべてのルートに適用
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
