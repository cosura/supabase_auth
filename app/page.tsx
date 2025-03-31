'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/AuthProvider.tsx';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // 認証チェック
  useEffect(() => {
    if (!loading && !user) {
      // 認証されていない場合はログインページにリダイレクト
      router.push('/login');
    }
  }, [user, loading, router]);

  // ローディング中の表示
  if (loading) {
    return <div className="text-center mt-10">読み込み中...</div>;
  }

  // 認証されていない場合は何も表示しない（リダイレクト中）
  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6">ホームページ</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">認証済みユーザー専用コンテンツ</h2>
        <p className="mb-4">
          このページは認証済みユーザーだけが閲覧できます。
        </p>
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-medium mb-2">ユーザー情報:</h3>
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>メール:</strong> {user.email}</p>
          <p><strong>最終ログイン:</strong> {new Date(user.last_sign_in_at || '').toLocaleString('ja-JP')}</p>
        </div>
      </div>
    </div>
  );
}
