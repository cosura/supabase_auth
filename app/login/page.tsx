'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from '../../lib/auth';
import { useAuth } from '../../components/AuthProvider.tsx';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  // すでにログインしている場合はダッシュボードにリダイレクト
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      
      const { data, error } = await signIn(email, password);
      
      // デバッグ用：ログイン結果を詳細にコンソールに出力
      console.log('Supabase ログイン結果:', { 
        data: data ? JSON.stringify(data, null, 2) : null, 
        error: error ? JSON.stringify(error, null, 2) : null 
      });
      
      if (error) {
        setError(error.message);
        return;
      }
      
      if (data?.user) {
        // ログイン成功 - ダッシュボードへリダイレクト
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('ログインエラー:', err);
      setError('ログイン処理中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">ログイン</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            パスワード
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>
        
        <div className="mt-4 text-center">
          <p>
            アカウントをお持ちでない場合は、
            <Link href="/register" className="text-blue-500 hover:underline">
              新規登録
            </Link>
            してください。
          </p>
        </div>
      </form>
    </div>
  );
}
