'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider.tsx';
import { supabase } from '../../utils/supabase';

export default function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const router = useRouter();

  // 認証チェック
  useEffect(() => {
    if (!loading && !user) {
      // 認証されていない場合はログインページにリダイレクト
      router.push('/login');
    }
  }, [user, loading, router]);

  // ユーザープロファイルの取得
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        setLoadingProfile(true);
        
        // Supabaseからユーザープロファイルを取得
        // 注：profiles テーブルが存在することを前提としています
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('プロファイル取得エラー:', error);
          // プロファイルが見つからない場合は、空のプロファイルを設定
          setUserProfile({
            id: user.id,
            email: user.email,
            created_at: user.created_at
          });
        } else {
          setUserProfile(data);
        }
      } catch (err) {
        console.error('プロファイル取得中にエラーが発生しました:', err);
      } finally {
        setLoadingProfile(false);
      }
    };

    if (user) {
      fetchUserProfile();
    }
  }, [user]);

  // ローディング中の表示
  if (loading || !user) {
    return <div className="text-center mt-10">読み込み中...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">ダッシュボード</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">ユーザー情報</h2>
        
        {loadingProfile ? (
          <p>プロファイル読み込み中...</p>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">メールアドレス</p>
              <p className="font-medium">{user.email}</p>
            </div>
            
            <div>
              <p className="text-gray-600">ユーザーID</p>
              <p className="font-medium">{user.id}</p>
            </div>
            
            <div>
              <p className="text-gray-600">アカウント作成日</p>
              <p className="font-medium">
                {new Date(user.created_at || '').toLocaleString('ja-JP')}
              </p>
            </div>
            
            <div>
              <p className="text-gray-600">最終ログイン</p>
              <p className="font-medium">
                {new Date(user.last_sign_in_at || '').toLocaleString('ja-JP')}
              </p>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">アカウント管理</h2>
        
        <button
          onClick={signOut}
          className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          ログアウト
        </button>
      </div>
    </div>
  );
}
