'use client';

import { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signUp } from '../../lib/auth';
import { useAuth } from '../../components/AuthProvider.tsx';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
    
    // 入力チェック
    if (!email || !password || !confirmPassword) {
      setError('すべての項目を入力してください');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }
    
    if (password.length < 6) {
      setError('パスワードは6文字以上で設定してください');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      
      const { data, error } = await signUp(email, password);
      
      // デバッグ用：登録結果を詳細にコンソールに出力
      console.log('Supabase サインアップ結果:', { 
        data: JSON.stringify(data, null, 2), 
        error: error ? JSON.stringify(error, null, 2) : null 
      });
      
      if (error) {
        setError(error.message);
        return;
      }
      
      // 登録成功
      setSuccess('登録が完了しました！メールを確認して認証を完了してください');
      
      // Supabaseの設定に応じて、メール確認が必要な場合とそうでない場合の処理
      if (data?.user && !data.user.confirmed_at) {
        // メール確認が必要
        setSuccess('登録が完了しました！メールを確認して認証を完了してください');
      } else {
        // メール確認が不要、または既に確認済み
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('登録エラー:', err);
      setError('登録処理中にエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">新規アカウント登録</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <p>{success}</p>
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
        
        <div className="mb-4">
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
          <p className="text-sm text-gray-500 mt-1">6文字以上で入力してください</p>
        </div>
        
        <div className="mb-6">
          <label htmlFor="confirm-password" className="block text-gray-700 mb-2">
            パスワード（確認）
          </label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !!success}
          className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
            (loading || !!success) ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading ? '登録中...' : '登録する'}
        </button>
        
        <div className="mt-4 text-center">
          <p>
            すでにアカウントをお持ちの場合は、
            <Link href="/login" className="text-blue-500 hover:underline">
              ログイン
            </Link>
            してください。
          </p>
        </div>
      </form>
    </div>
  );
}
