'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthProvider.tsx';
import { supabase } from '../../utils/supabase';

export default function Dashboard() {
  const { user, loading, signOut, deleteAccount } = useAuth();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
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

  // アカウント削除処理
  const handleDeleteAccount = async () => {
    // 確認ダイアログを表示
    const confirmed = window.confirm(
      '本当にアカウントを削除しますか？この操作は取り消せません。'
    );

    if (!confirmed) return;

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const result = await deleteAccount();
      
      if (!result.success) {
        setDeleteError(result.error || 'アカウント削除中にエラーが発生しました');
      }
      // 成功した場合はログインページにリダイレクトする（AuthProviderで処理されています）
    } catch (error: any) {
      setDeleteError(error?.message || '不明なエラーが発生しました');
    } finally {
      setIsDeleting(false);
    }
  };

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
        
        <div className="flex flex-col gap-4">
          {/* エラーメッセージ表示エリア */}
          {deleteError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">エラー: </strong>
              <span className="block sm:inline">{deleteError}</span>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4">
            {/* ログアウトボタン */}
            <button
              onClick={signOut}
              disabled={isDeleting}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              ログアウト
            </button>
            
            {/* 退会ボタン */}
            <button
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50 disabled:opacity-50"
            >
              {isDeleting ? '処理中...' : 'アカウント削除（退会）'}
            </button>
          </div>
          
          <p className="text-sm text-gray-500 mt-2">
            アカウントを削除すると、すべてのデータが完全に削除され、元に戻すことはできません。
          </p>
        </div>
      </div>
    </div>
  );
}
