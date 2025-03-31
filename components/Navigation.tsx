'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';

const Navigation = () => {
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Supabase Auth デモ
        </Link>
        
        <div className="flex gap-4">
          {user ? (
            <>
              <Link href="/dashboard" className="hover:text-gray-300">
                ダッシュボード
              </Link>
              <button
                onClick={signOut}
                className="hover:text-gray-300"
              >
                ログアウト
              </button>
              <span className="text-gray-400">
                {user.email}
              </span>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-gray-300">
                ログイン
              </Link>
              <Link href="/register" className="hover:text-gray-300">
                新規登録
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
