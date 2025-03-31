'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../utils/supabase';
import { useRouter } from 'next/navigation';

// 認証コンテキストの型定義
type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

// 認証コンテキストの作成
const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

// AuthContext を使用するためのカスタムフック
export const useAuth = () => useContext(AuthContext);

// 認証プロバイダーコンポーネント
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 初期化時にセッションを取得
  useEffect(() => {
    const getInitialSession = async () => {
      try {
        // 現在のセッションを取得
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('セッション初期化エラー:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // 認証状態が変わったときにルートを更新
        if (event === 'SIGNED_IN') {
          router.refresh();
        }
        if (event === 'SIGNED_OUT') {
          router.push('/login');
        }
      }
    );

    // クリーンアップ関数
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // サインアウト処理
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // コンテキストの値
  const value = {
    user,
    session,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 保護されたページコンポーネント
// 認証されていないユーザーをログインページにリダイレクト
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // ロード中またはユーザーが認証されていない場合はローディング表示
  if (loading || !user) {
    return <div>読み込み中...</div>;
  }

  return <>{children}</>;
};
